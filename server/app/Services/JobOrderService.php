<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\JobOrder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
            ->select('id', 'job_order_number', 'job_order_type', 'customer_id', 'created_at')
            ->with([
                'customer:id,name',
                'mechanics:id,name'
            ])
            ->withSum('jobOrderDetails as total_amount', 'amount')
            ->when(
                $search,
                fn($jobOrder)
                =>
                $jobOrder->whereAny(
                    [
                        'job_order_number'
                    ],
                    'like',
                    "%{$search}%"
                )
                    ->orWhereRelation('customer', 'name', 'like', "%{$search}%")
                    ->orWhereRelation('mechanics', 'name', 'like', "%{$search}%")
            )
            ->whereRelation('customer.user', 'id', Auth::id())
            ->orderBy(
                $column,
                $sort['direction']
            )
            ->paginate($per_page);

        return $jobOrders;
    }

    public function store($request, $user)
    {
        $customer = DB::transaction(function () use ($request, $user) {
            $lastJobOrderNumber = $user
                ->jobOrders()
                ->max('job_order_number') ?? 0;

            $job_order_number = \sprintf('%07d', $lastJobOrderNumber + 1);

            $customer = $user
                ->customers()
                ->create($request->customer);

            $job_order = $customer
                ->jobOrders()
                ->create([
                    ...$request->job_order,
                    'job_order_number' => $job_order_number
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

            return $customer;
        });

        return $customer;
    }
}
