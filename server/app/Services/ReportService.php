<?php

namespace App\Services;

use App\Models\AreaManager;
use App\Models\Customer;
use App\Models\JobOrder;
use App\Models\JobOrderDetail;
use App\Models\Mechanic;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
            default              => $sort['column']
        };

        $search = request('search', '');

        return JobOrder::query()
            ->with([
                'customer:id,name,user_id',
                'customer.user:id,name,code',
                'mechanic:id,name'
            ])
            ->select('id', 'job_order_number', 'job_order_type', 'created_at', 'customer_id', 'mechanic_id')
            ->withCount([
                'jobOrderDetails'
                =>
                fn($item)
                =>
                $item->when(
                    $filter_by === 'job_order_detail_type',
                    fn($item)
                    =>
                    $item->where('type', $filter_item)
                )
            ])
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
                $filter_by === 'branch',
                fn($jobOrder)
                =>
                $jobOrder->where(
                    fn($item)
                    =>
                    $item->whereRelation('customer.user', 'id', $filter_item)
                )
            )
            ->when(
                $filter_by === 'area_manager',
                fn($jobOrder)
                =>
                $jobOrder->where(
                    fn($item)
                    =>
                    $item->whereRelation('customer.user.areaManagers', 'area_manager_id', $filter_item)
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
            ->when(
                $filter_by === 'job_order_detail_type',
                fn($item)
                =>
                $item->whereRelation('jobOrderDetails', 'type', $filter_item)
            )
            ->when(
                $filter_by === 'job_order_type',
                fn($item)
                =>
                $item->where('job_order_type', $filter_item)
            )
            ->paginate($per_page);
    }

    public function exportData()
    {
        Auth::user()->userExportLog()->create();

        $filter_item = request('filter_item', '');

        $filter_by = request('filter_by', 'all');

        $search = request('search', '');

        return JobOrder::query()
            ->with([
                'customer:id,name,user_id',
                'customer.user:id,name,code',
                'mechanic:id,name',
                'jobOrderDetails'
                =>
                fn($item)
                =>
                $item->when(
                    $filter_by === 'job_order_detail_type',
                    fn($item)
                    =>
                    $item->where('type', $filter_item)
                )
            ])
            ->select('id', 'job_order_number', 'job_order_type', 'created_at', 'customer_id', 'mechanic_id')
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
                $filter_by === 'branch',
                fn($jobOrder)
                =>
                $jobOrder->where(
                    fn($item)
                    =>
                    $item->whereRelation('customer.user', 'id', $filter_item)
                )
            )
            ->when(
                $filter_by === 'area_manager',
                fn($jobOrder)
                =>
                $jobOrder->where(
                    fn($item)
                    =>
                    $item->whereRelation('customer.user.areaManagers', 'area_manager_id', $filter_item)
                )
            )
            ->when(
                $filter_by === 'date',
                fn($query)
                =>
                $query->whereDate('created_at', $filter_item)
            )
            ->when(
                $filter_by === 'job_order_type',
                fn($item)
                =>
                $item->where('job_order_type', $filter_item)
            )
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'Date'                  => $item->created_at->format('Y-m-d H:i:s'),
                    'Customer Name'         => $item->customer?->name,
                    'Job Requests & Amount' => $item->jobOrderDetails->where('type', 'job_request')->map(function ($item) {
                        return "{$item->category}: ₱{$item->amount}";
                    })
                        ->implode("\n"),
                    'Part Used & Amount'    => $item->jobOrderDetails->where('type', 'parts_replacement')->map(function ($item) {
                        return "{$item->category}: ₱{$item->amount}";
                    })
                        ->implode("\n")
                ];
            });
    }

    public function exportBranch()
    {
        Auth::user()->userExportLog()->create();

        $search = request('search', '');

        $jobOrders = JobOrder::query()
            ->select('id', 'job_order_number', 'mechanic_id', 'customer_id', 'created_at')
            ->whereRelation('customer.user', 'id', Auth::id())
            ->with([
                'customer:id,name',
                'mechanic:id,name',
                'jobOrderDetails'
            ])
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
            ->orderBy('id', 'asc')
            ->whereMonth('created_at', now()->month)
            ->get()
            ->map(function ($item) {
                return [
                    'Date'                  => $item->created_at->format('Y-m-d H:i:s'),
                    'Customer Name'         => $item->customer?->name,
                    'Job Requests & Amount' => $item->jobOrderDetails->where('type', 'job_request')->map(function ($item) {
                        return "{$item->category}: ₱{$item->amount}";
                    })
                        ->implode("\n"),
                    'Part Used & Amount'    => $item->jobOrderDetails->where('type', 'parts_replacement')->map(function ($item) {
                        return "{$item->category}: ₱{$item->amount}";
                    })
                        ->implode("\n")
                ];
            });

        return $jobOrders;
    }
}
