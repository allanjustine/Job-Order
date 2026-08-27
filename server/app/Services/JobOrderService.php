<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\JobOrder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class JobOrderService
{
    public function getBranchJobOrders()
    {
        $per_page = request('perPage', 10);

        $sort = request('sort', ["column" => "id", "direction" => "desc"]);

        $search = request('search', '');

        $column = match ($sort['column']) {
            'customer.name' => Customer::query()->select('name')->whereColumn('customers.id', 'job_orders.customer_id'),
            default => $sort['column']
        };

        $jobOrders = JobOrder::query()
            ->select('id', 'job_order_number', 'job_order_type', 'customer_id', 'status', 'next_schedule_date', 'next_schedule_kms', 'created_at','receipt_number')
            ->with([
                'customer:id,name',
                'mechanics:id,name',
                'jobOrderDiagnosis:id,job_order_id,title,status,remarks'
            ])
            ->withSum('jobOrderDetails as total_amount', 'amount')
            ->whereRelation('customer.user', 'id', Auth::id())
            ->when(
                $search,
                fn($jobOrder)
                =>
                $jobOrder->whereAny(
                    [
                        'job_order_number',
                        'status'
                    ],
                    'like',
                    "%{$search}%"
                )
                    ->orWhereRelation('customer', 'name', 'like', "%{$search}%")
                    ->orWhereRelation('mechanics', 'name', 'like', "%{$search}%")
            )
            ->orderBy(
                $column,
                $sort['direction']
            )
            ->paginate($per_page);

        return $jobOrders;
    }

    public function store($request)
    {
        $user = Auth::user();

        $last_job_order_number = $user
            ->jobOrders()
            ->max('job_order_number') ?? 0;

        $job_order_number = \sprintf('%07d', $last_job_order_number + 1);

        $customer = DB::transaction(function () use ($request, $user, $job_order_number) {

            $customer = $user
                ->customers()
                ->create($request->customer);

            $job_order = $customer
                ->jobOrders()
                ->create([
                    ...$request->job_order,
                    'job_order_number' => $job_order_number,
                ]);

            $data = [];

            foreach ($request->job_order_details as $job_order_detail) {
                if ($job_order_detail['category'] === 'other_items') {
                    foreach ($job_order_detail['is_others_items'] as $other_item) {
                        $data[] = [
                            'category'    => $other_item['description'],
                            'type'        => $job_order_detail['type'],
                            'part_brand'  => $other_item['brand'] ?? 'n/a',
                            'part_number' => $other_item['partNumber'] ?? 'n/a',
                            'quantity'    => $other_item['quantity'] ?? 1,
                            'amount'      => $other_item['amount'],
                        ];
                    }
                } else {
                    $data[] = [
                        'category'    => $job_order_detail['category'],
                        'type'        => $job_order_detail['type'],
                        'part_brand'  => $job_order_detail['part_brand'] ?? 'n/a',
                        'part_number' => $job_order_detail['part_number'] ?? 'n/a',
                        'quantity'    => $job_order_detail['quantity'] ?? 1,
                        'amount'      => $job_order_detail['amount'],
                    ];
                }
            }

            $job_order
                ->jobOrderDetails()
                ->createMany($data);

            $job_order->mechanics()->attach($request->mechanic_ids);

            $job_order->jobOrderDiagnosis()->createMany($request->diagnosis ?? []);

            return $customer;
        });

        return $customer;
    }

    public function update($job_order, $request)
    {
        return DB::transaction(function () use ($job_order, $request) {

            $formed_job_order_details = collect($request->job_order_details)->map(function ($job_order_detail) {
                return [
                    ...$job_order_detail,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];
            })->toArray();

            $job_order->customer()->update([
                'name'           => $request->customer['name'],
                'address'        => $request->customer['address'],
                'contact_number' => $request->customer['contact_number'],
            ]);

            $job_order->mechanics()->sync($request->mechanic_ids);

            $job_order->jobOrderDetails()->upsert(
                $formed_job_order_details,
                ['id'],
                ['category', 'part_brand', 'part_number', 'quantity', 'amount']
            );

            $job_order->update($request->job_order);

            activity()
                ->causedBy(Auth::user())
                ->performedOn($job_order)
                ->log("Updated job order data with transaction code of \"{$job_order->transaction_code}\".");

            return $job_order;
        });
    }

    public function delete(string $id)
    {
        $job_order = JobOrder::findOrFail($id);

        activity()
            ->causedBy(Auth::user())
            ->performedOn($job_order)
            ->log("Deleted job order data with transaction code of \"{$job_order->transaction_code}\".");

        $job_order->delete();

        return $job_order;
    }

    public function addReceipt($job_order, $request)
    {
        return DB::transaction(function () use ($job_order, $request) {

            $job_order->update([
                'receipt_number' => $request->receipt_number,
            ]);
            return $job_order;
        });
    }
}
