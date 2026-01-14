<?php

namespace App\Services;

use App\Models\AreaManager;
use App\Models\Customer;
use App\Models\JobOrder;
use App\Models\JobOrderDetail;
use App\Models\Mechanic;
use App\Models\User;

class ReportService
{
    public function getAllReports()
    {
        $per_page = request('perPage', 10);

        $sort = request('sort', ["column" => "id", "direction" => "asc"]);

        $filter_item = request('filter_item', '');

        $filter_by = request('filter_by', 'all');

        $column = match ($sort['column']) {
            'customer.name'      => Customer::query()->select('name')->whereColumn('customers.id', 'job_orders.customer_id'),
            'mechanic.name'      => Mechanic::query()->select('name')->whereColumn('mechanics.id', 'job_orders.mechanic_id'),
            'customer.user.name' => User::query()->select('users.name')->where('users.id', Customer::query()->select('customers.user_id')->whereColumn('customers.id', 'job_orders.customer_id')),
            default => $sort['column']
        };

        $search = request('search', '');

        return JobOrder::query()
            ->with([
                'customer:id,name,user_id',
                'customer.user:id,name,code',
                'mechanic:id,name'
            ])
            ->select('id', 'job_order_number', 'job_order_type', 'created_at', 'customer_id', 'mechanic_id')
            ->withCount('jobOrderDetails')
            ->when(
                $search,
                fn($jobOrder)
                =>
                $jobOrder->where(
                    fn($item)
                    =>
                    $item->whereAny(
                        [
                            'job_order_number',
                            'job_order_type'
                        ],
                        'like',
                        "%{$search}%"
                    )
                        ->orWhereRelation('customer', 'name', 'like', "%{$search}%")
                        ->orWhereRelation('mechanic', 'name', 'like', "%{$search}%")
                        ->orWhereHas('customer.user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('code', 'like', "%{$search}%");
                        })
                )
            )
            ->when(
                $filter_by !== 'all' && $filter_by !== 'date' && $filter_item,
                fn($jobOrder)
                =>
                $jobOrder->where(
                    fn($item)
                    =>
                    $item->whereRelation('customer.user', 'id', $filter_item)
                        ->orWhereRelation('customer.user.areaManagers', 'area_manager_id', $filter_item)
                )
            )
            ->when(
                $filter_by === 'date',
                fn($query)
                =>
                $query->whereDate('created_at', $filter_item)
            )
            ->when(
                $sort['column'] !== 'user.name',
                fn($jobOrder) =>
                $jobOrder->orderBy($column, $sort['direction'])
            )
            ->paginate($per_page);
    }

    public function exportData()
    {
        $filter_item = request('filter_item', '');
        $filter_by = request('filter_by', 'all');

        return JobOrderDetail::query()
            ->when(
                $filter_by === 'branch',
                fn($query)
                =>
                $query->whereRelation('jobOrder.customer', 'user_id', $filter_item)
            )
            ->when(
                $filter_by === 'area_manager',
                fn($query)
                =>
                $query->whereRelation('jobOrder.customer.user.areaManagers', 'area_manager_id', $filter_item)
            )
            ->get()
            ->groupBy('category')
            ->map(fn($items, $category) => [
                'Job Request & Parts Replacement' => $category,
                'Total Income'                    => $items->sum('amount'),
                'Total Job Request'               => $items->count()
            ])
            ->sortByDesc('Total Job Request')
            ->filter()
            ->take(10)
            ->values();
    }
}
