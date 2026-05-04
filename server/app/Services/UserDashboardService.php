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
        $total = JobOrder::query()
            ->whereRelation('customer.user', 'id', Auth::id())
            ->count();

        $totalMotors = JobOrder::query()
            ->whereRelation('customer.user', 'id', Auth::id())
            ->where('job_order_type', JobOrderType::MOTORS?->value)
            ->count();

        $totalTrimotors = JobOrder::query()
            ->whereRelation('customer.user', 'id', Auth::id())
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
        return JobOrder::query()
            ->whereRelation('customer.user', 'id', Auth::id())
            ->whereNull('status')
            ->withSum([
                'jobOrderDetailsByJobRequestType'
                =>
                fn($jobOrderDetail)
                =>
                $jobOrderDetail->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
            ], 'amount')
            ->get()
            ->sum('job_order_details_by_job_request_type_sum_amount');
    }

    private function totalAmount()
    {
        return JobOrder::query()
            ->whereRelation('customer.user', 'id', Auth::id())
            ->whereNull('status')
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
        return JobOrderDetail::query()
            ->whereRelation('jobOrder.customer.user', 'id', Auth::id())
            ->get()
            ->groupBy('category')
            ->map(fn($items, $category) => [
                'category'   => $category,
                'type'       => $items->first()->type,
                'amount'     => $items->sum('amount'),
                'quantity'   => $items->where('type', "parts_replacement")->sum('quantity') ?: null,
                'part_brand' => $items->where('type', "parts_replacement")->pluck('part_brand')->filter()->unique()->count() ?: null
            ])
            ->sortByDesc('amount')
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

    public function sumByTypes()
    {
        $sum_of_job_request = JobOrder::query()
            ->whereRelation('customer.user', 'id', Auth::id())
            ->withSum('jobOrderDetailsByJobRequestType', 'amount')
            ->get()
            ->sum('job_order_details_by_job_request_type_sum_amount');

        $sum_of_parts_replacement = JobOrder::query()
            ->whereRelation('customer.user', 'id', Auth::id())
            ->withSum('jobOrderDetailsByPartsReplacementType', 'amount')
            ->get()
            ->sum('job_order_details_by_parts_replacement_type_sum_amount');


        return [
            'sum_of_job_request'       => $sum_of_job_request,
            'sum_of_parts_replacement' => $sum_of_parts_replacement,
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
            'sum_by_types'          => $this->sumByTypes()
        ];
    }
}
