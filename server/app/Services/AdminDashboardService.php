<?php

namespace App\Services;

use App\Enums\JobOrderType;
use App\Enums\TypeOfJob;
use App\Models\AreaManager;
use App\Models\Customer;
use App\Models\JobOrder;
use App\Models\JobOrderDetail;
use App\Models\Mechanic;

class AdminDashboardService
{
    private function totalJobPrints()
    {

        $total = JobOrder::query()
            ->count();

        $totalMotors = JobOrder::query()
            ->where('job_order_type', JobOrderType::MOTORS?->value)
            ->count();

        $totalTrimotors = JobOrder::query()
            ->where('job_order_type', JobOrderType::TRIMOTORS?->value)
            ->count();


        return [
            'total'           => $total,
            'total_motors'    => $totalMotors,
            'total_trimotors' => $totalTrimotors
        ];
    }

    private function todayPrints()
    {
        return JobOrder::query()
            ->whereToday('created_at')
            ->count();
    }

    private function weeklyPrints()
    {
        return JobOrder::query()
            ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();
    }

    private function monthlyPrints()
    {
        return JobOrder::query()
            ->whereMonth('created_at', now()->month)
            ->count();
    }

    private function totalMechanics()
    {
        return Mechanic::query()
            ->count();
    }

    private function totalMotorcycleJobs()
    {
        return JobOrder::query()
            ->where('job_order_type', JobOrderType::MOTORS?->value)
            ->withSum('jobOrderDetails', 'amount')
            ->get()
            ->sum('job_order_details_sum_amount');
    }

    private function totalTrimotorcycleJobs()
    {
        return JobOrder::query()
            ->where('job_order_type', JobOrderType::TRIMOTORS?->value)
            ->withSum('jobOrderDetails', 'amount')
            ->get()
            ->sum('job_order_details_sum_amount');
    }

    private function totalAmount()
    {
        return JobOrderDetail::query()
            ->sum('amount');
    }

    private function topTenOverAllJobOrders()
    {
        $jobOrderDetails = JobOrderDetail::query()
            ->get()
            ->groupBy('category');

        return $jobOrderDetails->map(fn($items, $category) => [
            'category' => $category,
            'amount'   => $items->sum('amount'),
        ])
            ->sortByDesc('amount')
            ->filter()
            ->take(10)
            ->values();
    }

    private function topTenBranchJobOrders()
    {
        $customers = Customer::query()
            ->get()
            ->groupBy('user_id');

        return $customers->map(function ($items) {
            $customerIds = $items->pluck('id');

            $jobOrderIds = JobOrder::query()
                ->whereIn('customer_id', $customerIds)
                ->pluck('id');

            $jobOrderDetails = JobOrderDetail::query()
                ->whereIn('job_order_id', $jobOrderIds)
                ->get()
                ->groupBy('category');

            return $jobOrderDetails->map(fn($items, $category) => [
                'category' => $category,
                'amount'   => $items->sum('amount'),
                'branch'   => [
                    'name' => $items->first()->jobOrder?->customer?->user?->name,
                    'code' => $items->first()->jobOrder?->customer?->user?->code
                ]
            ])
                ->sortByDesc('amount')
                ->first();
        })
            ->sortByDesc('amount')
            ->filter()
            ->take(10)
            ->values();
    }

    private function topTenAreaManagersJobOrders()
    {
        $areaManagers = AreaManager::query()
            ->with('users:id,name,code')
            ->get();

        return $areaManagers->map(function ($item) {
            $userIds = $item->users->pluck('id');

            $customerIds = Customer::query()
                ->whereIn('user_id', $userIds)
                ->pluck('id');

            $jobOrderIds = JobOrder::query()
                ->whereIn('customer_id', $customerIds)
                ->pluck('id');

            $jobOrderDetails = JobOrderDetail::query()
                ->whereIn('job_order_id', $jobOrderIds)
                ->get()
                ->groupBy('category');

            return $jobOrderDetails->map(fn($items, $category) => [
                'category'          => $category,
                'area_manager_name' => $item->name,
                'amount'            => $items->sum('amount'),
                'branch'            => [
                    'name'          => $items->first()->jobOrder?->customer?->user?->name,
                    'code'          => $items->first()->jobOrder?->customer?->user?->code
                ]
            ])
                ->sortByDesc('amount')
                ->first();
        })->sortByDesc('amount')
            ->filter()
            ->take(10)
            ->values();
    }

    public function getAllStats()
    {
        return [
            'total_job_prints'            => $this->totalJobPrints(),
            'today_prints'                => $this->todayPrints(),
            'weekly_prints'               => $this->weeklyPrints(),
            'monthly_prints'              => $this->monthlyPrints(),
            'total_mechanics'             => $this->totalMechanics(),
            'total_motorcycle_jobs'       => $this->totalMotorcycleJobs(),
            'total_trimotors_job'         => $this->totalTrimotorcycleJobs(),
            'total_amount'                => $this->totalAmount(),
            'top_over_all_job_orders'     => $this->topTenOverAllJobOrders(),
            'top_branch_job_orders'       => $this->topTenBranchJobOrders(),
            'top_area_manager_job_orders' => $this->topTenAreaManagersJobOrders()
        ];
    }
}
