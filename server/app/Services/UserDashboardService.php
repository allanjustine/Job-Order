<?php

namespace App\Services;

use App\Enums\JobOrderType;
use App\Models\Customer;
use App\Models\JobOrder;
use App\Models\JobOrderDetail;
use App\Models\Mechanic;
use App\Models\TargetIncome;
use Illuminate\Support\Facades\Auth;

class UserDashboardService
{
    private function totalJobPrints()
    {
        $customerIds = Customer::query()
            ->where('user_id', Auth::id())
            ->pluck('id');

        $total = JobOrder::query()
            ->whereIn('customer_id', $customerIds)
            ->count();

        $totalMotors = JobOrder::query()
            ->whereIn('customer_id', $customerIds)
            ->where('job_order_type', JobOrderType::MOTORS?->value)
            ->count();

        $totalTrimotors = JobOrder::query()
            ->whereIn('customer_id', $customerIds)
            ->where('job_order_type', JobOrderType::TRIMOTORS?->value)
            ->count();


        return [
            'total'           => $total,
            'total_motors'    => $totalMotors,
            'total_trimotors' => $totalTrimotors
        ];
    }

    private function monthlyTargetIncome()
    {
        $targetIncome =  TargetIncome::query()
            ->where('user_id', Auth::id())
            ->where(
                fn($targetIncome)
                =>
                $targetIncome->whereMonth('month_of', now()->month)
                    ->whereYear('month_of', now()->year)
            )
            ->first(['id', 'target_income']);

        return $targetIncome->target_income ?? 0;
    }

    private function monthlyShopIncome()
    {
        $customerIds = Customer::query()
            ->where('user_id', Auth::id())
            ->pluck('id');

        return JobOrder::query()
            ->whereIn('customer_id', $customerIds)
            ->withSum([
                'jobOrderDetails'
                =>
                fn($jobOrderDetail)
                =>
                $jobOrderDetail->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
            ], 'amount')
            ->get()
            ->sum('job_order_details_sum_amount');
    }

    private function totalAmount()
    {
        $customerIds = Customer::query()
            ->where('user_id', Auth::id())
            ->pluck('id');

        return JobOrder::query()
            ->whereIn('customer_id', $customerIds)
            ->withSum('jobOrderDetails', 'amount')
            ->get()
            ->sum('job_order_details_sum_amount');
    }

    private function totalMechanics()
    {
        return Mechanic::query()
            ->where('user_id', Auth::id())
            ->count();
    }

    public function getTopJobOrders()
    {
        $customerIds = Customer::query()
            ->where('user_id', Auth::id())
            ->pluck('id');

        $jobOrders = JobOrder::query()
            ->whereIn('customer_id', $customerIds)
            ->pluck('id');

        $jobOrderDetails = JobOrderDetail::query()
            ->whereIn('job_order_id', $jobOrders)
            ->get()
            ->groupBy('category');

        return $jobOrderDetails->map(fn($items, $category) => [
            'category' => $category,
            'amount'   => $items->sum('amount'),
        ])->sortByDesc('amount')
            ->take(5)
            ->values();
    }

    private function targetData()
    {
        $percentage = ($this->monthlyShopIncome() <= 0 || $this->monthlyTargetIncome() <= 0) ? 0 : number_format(($this->monthlyShopIncome() / $this->monthlyTargetIncome()) * 100, 2);
        return [
            'total_remaining_target' => $this->monthlyTargetIncome() - $this->monthlyShopIncome(),
            'target_percentage'      => $this->monthlyTargetIncome() === 0 ? "0.00%" : "{$percentage}%"
        ];
    }

    public function getUserDashboard()
    {
        return [
            'total_job_prints'      => $this->totalJobPrints(),
            'monthly_target_income' => $this->monthlyTargetIncome(),
            'monthly_shop_income'   => $this->monthlyShopIncome(),
            'total_amount'          => $this->totalAmount(),
            'total_mechanics'       => $this->totalMechanics(),
            'target_data'           => $this->targetData(),
            'top_job_orders'        => $this->getTopJobOrders(),
        ];
    }
}
