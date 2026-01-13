<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\JobOrder;
use App\Models\Mechanic;
use Illuminate\Support\Facades\Auth;
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
            'mechanic.name' => Mechanic::query()->select('name')->whereColumn('mechanics.id', 'job_orders.mechanic_id'),
            default => $sort['column']
        };

        $jobOrders = JobOrder::query()
            ->select('id', 'job_order_number', 'mechanic_id', 'customer_id', 'created_at')
            ->whereRelation('customer.user', 'id', Auth::id())
            ->with([
                'customer:id,name',
                'mechanic:id,name'
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
                    ->orWhereRelation('mechanic', 'name', 'like', "%{$search}%")
            )
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
                ->create([
                    'name'           => "Test Waw",
                    'contact_number' => "122222222"
                ]);

            $job_order = $customer
                ->jobOrders()
                ->create([
                    ...$request->job_order,
                    'job_order_number' => $job_order_number
                ]);

            $job_order
                ->jobOrderDetails()
                ->createMany($request->job_order_details);

            return $customer;
        });

        return $customer;
    }
}
