<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\JobOrder;
use App\Models\Mechanic;

class AdminJobOrderService
{
    public function getAllJobOrders()
    {
        $per_page = request('perPage', 10);

        $sort = request('sort', ["column" => "id", "direction" => "desc"]);

        $search = request('search', '');

        $column = match ($sort['column']) {
            'customer.name' => Customer::query()->select('name')->whereColumn('customers.id', 'job_orders.customer_id'),
            'mechanic.name' => Mechanic::query()->select('name')->whereColumn('mechanics.id', 'job_orders.mechanic_id'),
            default => $sort['column']
        };

        return JobOrder::query()
            ->select('id', 'job_order_number', 'mechanic_id', 'customer_id', 'created_at')
            ->with('customer:id,name', 'mechanic:id,name')
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
    }
}
