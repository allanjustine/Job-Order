<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\JobOrder;
use App\Models\JobOrderDetail;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class ReportService
{
    public function getAllReports()
    {
        $per_page = request('perPage', 10);

        $sort = request('sort', ["column" => "created_at", "direction" => "asc"]);

        $date_range = explode(", ", request('date_range', ''));

        $branch = request('branch', '');

        $area_manager = request('area_manager', '');

        $job_order_type = request('job_order_type', '');

        $column = match ($sort['column']) {
            'customer.name'      => Customer::query()->select('name')->whereColumn('customers.id', 'job_orders.customer_id'),
            'customer.user.name' => User::query()->select('users.name')->where('users.id', Customer::query()->select('customers.user_id')->whereColumn('customers.id', 'job_orders.customer_id')),
            default              => $sort['column']
        };

        $search = request('search', '');

        return JobOrder::query()
            ->with([
                'customer:id,name,user_id',
                'customer.user:id,name,code',
                'mechanics:id,name',
                'jobOrderDiagnosis:id,job_order_id,title,status,remarks',
            ])
            ->select('id', 'job_order_number', 'job_order_type', 'date', 'customer_id', 'status', 'reason_for_cancellation')
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
                        ->orWhereRelation('mechanics', 'name', 'like', "%{$search}%")
                        ->orWhereRelation('jobOrderDetails', 'category', 'like', "%{$search}%")
                        ->orWhereRelation('jobOrderDetails', 'part_number', 'like', "%{$search}%")
                        ->orWhereHas('customer.user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('code', 'like', "%{$search}%");
                        })
                )
            )
            ->when(
                $branch,
                fn($jobOrder)
                =>
                $jobOrder->where(
                    fn($item)
                    =>
                    $item->whereRelation('customer.user', 'id', $branch)
                )
            )
            ->when(
                $area_manager,
                fn($jobOrder)
                =>
                $jobOrder->where(
                    fn($item)
                    =>
                    $item->whereRelation('customer.user.areaManagers', 'area_manager_id', $area_manager)
                )
            )
            ->when(
                $date_range && $date_range[0] && $date_range[1],
                fn($query)
                =>
                $query->whereBetween('date', [Carbon::parse($date_range[0])->startOfDay(), Carbon::parse($date_range[1])->endOfDay()])
            )
            ->when(
                $sort['column'] !== 'user.name',
                fn($jobOrder) =>
                $jobOrder->orderBy($column, $sort['direction'])
            )
            ->when(
                $job_order_type,
                fn($item)
                =>
                $item->where('job_order_type', $job_order_type)
            )
            ->paginate($per_page);
    }

    public function exportData()
    {
        Auth::user()->userExportLog()->create();

        $date_range = explode(", ", request('date_range', ''));

        $branch = request('branch', '');

        $area_manager = request('area_manager', '');

        $job_order_type = request('job_order_type', '');

        $search = request('search', '');

        return JobOrderDetail::query()
            ->select('id', 'job_order_id', 'type', 'amount', 'quantity', 'category', 'part_brand', 'part_number')
            ->with([
                'jobOrder:id,job_order_number,customer_id,job_order_type,general_remarks,category,status,date,reason_for_cancellation',
                'jobOrder.customer:id,name',
                'jobOrder.mechanics:id,name,user_id',
                'jobOrder.mechanics.user',
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
                            'part_brand',
                            'part_number',
                            'quantity',
                            'type',
                            'category',
                        ],
                        'like',
                        "%{$search}%"
                    )
                        ->orWhereRelation('jobOrder.customer', 'name', 'like', "%{$search}%")
                        ->orWhereRelation('jobOrder.mechanics', 'name', 'like', "%{$search}%")
                        ->orWhereHas('jobOrder.customer.user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('code', 'like', "%{$search}%");
                        })
                )
            )
            ->when(
                $branch,
                fn($jobOrder)
                =>
                $jobOrder->where(
                    fn($item)
                    =>
                    $item->whereRelation('jobOrder.customer.user', 'id', $branch)
                )
            )
            ->when(
                $area_manager,
                fn($jobOrder)
                =>
                $jobOrder->where(
                    fn($item)
                    =>
                    $item->whereRelation('jobOrder.customer.user.areaManagers', 'area_manager_id', $area_manager)
                )
            )
            ->when(
                $date_range[0] && $date_range[1],
                fn($query) =>
                $query->whereHas('jobOrder', function ($q) use ($date_range) {
                    $q->whereBetween('date', [
                        Carbon::parse($date_range[0])->startOfDay(),
                        Carbon::parse($date_range[1])->endOfDay()
                    ]);
                })
            )
            ->when(
                $job_order_type,
                fn($item)
                =>
                $item->whereRelation('jobOrder', 'job_order_type', $job_order_type)
            )
            ->orderBy('type', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'Date'              => $item->jobOrder?->date->format('Y-m-d'),
                    'JO Number'         => $item->jobOrder?->job_order_number,
                    'Branch Code'       => $item->jobOrder?->mechanics->first()?->user?->code,
                    'Customer Name'     => $item->jobOrder?->customer?->name,
                    'Job Requests'      => $item->type === 'job_request' ? $item->category : '',
                    'Job Amount'        => $item->type === 'job_request' ? $item->amount : "",
                    'Part Used'         => $item->type === 'parts_replacement' ? $item->category : '',
                    'Quantity'          => $item->type === 'parts_replacement' ? $item->quantity : '',
                    'Part Brand'        => $item->type === 'parts_replacement' ? $item->part_brand : '',
                    'Part Number'       => $item->type === 'parts_replacement' ? $item->part_number : '',
                    'Part Used Amount ' => $item->type === 'parts_replacement' ? $item->amount : '',
                    'General Remarks '  => $item->jobOrder?->general_remarks,
                    'JO Category'       => $item->jobOrder?->category,
                    'JO Status'         => $item->jobOrder?->status,
                    'Reason for Cancellation' => $item->jobOrder?->reason_for_cancellation,
                ];
            });
    }

    public function exportBranch()
    {
        Auth::user()->userExportLog()->create();

        $search = request('search', '');

        $from = request('from', '');

        $to = request('to', '');

        $jobOrders = JobOrderDetail::query()
            ->select('id', 'job_order_id', 'type', 'amount', 'quantity', 'category', 'part_brand', 'part_number')
            ->with([
                'jobOrder:id,job_order_number,customer_id,job_order_type,general_remarks,category,status,date,reason_for_cancellation',
                'jobOrder.customer:id,name,address',
                'jobOrder.mechanics:id,name',
            ])
            ->when(
                $search,
                fn($jobOrder)
                =>
                $jobOrder->whereAny(
                    [
                        'part_brand',
                        'part_number',
                        'quantity',
                        'type',
                        'category',
                    ],
                    'like',
                    "%{$search}%"
                )
                    ->orWhereRelation('jobOrder', 'job_order_number', 'like', "%{$search}%")
                    ->orWhereRelation('jobOrder.customer', 'name', 'like', "%{$search}%")
                    ->orWhereRelation('jobOrder.mechanics', 'name', 'like', "%{$search}%")
            )
            // ->orderBy('type', 'asc')
            ->orderBy(JobOrder::select('job_order_number')->whereColumn('job_orders.id', 'job_order_details.job_order_id'), 'asc')
            ->whereHas('jobOrder', function ($q) use ($from, $to) {
                $q->where(
                    fn($item)
                    =>
                    $item->whereBetween('date', [Carbon::parse($from)->startOfDay(), Carbon::parse($to)->endOfDay()])
                );
            })
            ->whereRelation('jobOrder.customer.user', 'id', Auth::id())
            ->get();

        $lastJoNumber = null;

        $jobOrders = $jobOrders->map(function ($item) use (&$lastJoNumber) {

            $currentJoNumber = $item->jobOrder?->job_order_number;

            $showHeader = $lastJoNumber !== $currentJoNumber;

            $lastJoNumber = $currentJoNumber;

            return [
                'Date'              => $showHeader ? $item->jobOrder?->date->format('m-d-Y') : '',
                'JO Number'         => $showHeader ? $item->jobOrder?->job_order_number : '',
                'Branch Code'       => $item->jobOrder?->mechanics->first()?->user?->code,
                'Customer Name'     => $showHeader ? $item->jobOrder?->customer?->name : '',
                'Address'           => $showHeader ? $item->jobOrder?->customer?->address : '',
                'Mechanics'         => $showHeader ? $item->jobOrder?->mechanics->pluck('name')->join(', ') : '',
                'Job Requests'      => $item->type === 'job_request' ? $item->category : '',
                'Job Amount'        => $item->type === 'job_request' ? $item->amount : "",
                'Part Used'         => $item->type === 'parts_replacement' ? $item->category : '',
                'Quantity'          => $item->type === 'parts_replacement' ? $item->quantity : '',
                'Part Brand'        => $item->type === 'parts_replacement' ? $item->part_brand : '',
                'Part Number'       => $item->type === 'parts_replacement' ? $item->part_number : '',
                'Part Used Amount ' => $item->type === 'parts_replacement' ? $item->amount : '',
                'General Remarks '  => $item->jobOrder?->general_remarks,
                'JO Category'       => $item->jobOrder?->category,
                'JO Status'         => $item->jobOrder?->status,
                'Reason for Cancellation' => $item->jobOrder?->reason_for_cancellation,
            ];
        });

        return $jobOrders;
    }
}
