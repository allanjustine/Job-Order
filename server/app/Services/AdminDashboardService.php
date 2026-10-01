<?php

namespace App\Services;

use App\Enums\JobOrderType;
use App\Enums\TicketStatus;
use App\Enums\TypeOfJob;
use App\Models\AreaManager;
use App\Models\Customer;
use App\Models\JobOrder;
use App\Models\JobOrderDetail;
use App\Models\Mechanic;
use App\Models\Ticket;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

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
        return JobOrderDetail::query()
            ->whereRelation('jobOrder', 'job_order_type', JobOrderType::MOTORS?->value)
            ->sum('amount');
    }

    private function totalTrimotorcycleJobs()
    {
        return JobOrderDetail::query()
            ->whereRelation('jobOrder', 'job_order_type', JobOrderType::TRIMOTORS?->value)
            ->sum('amount');
    }

    private function totalAmount()
    {
        return JobOrderDetail::query()
            ->sum('amount');
    }

    private function topTenOverAllJobOrders()
    {
        $jobOrderDetails = JobOrderDetail::query()
            ->get(['id', 'category', 'amount', 'job_order_id'])
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
            ->get(['id', 'user_id'])
            ->groupBy('user_id');

        return $customers->map(function ($items) {
            $customerIds = $items->pluck('id');

            $jobOrderIds = JobOrder::query()
                ->whereIn('customer_id', $customerIds)
                ->pluck('id');

            $jobOrderDetails = JobOrderDetail::query()
                ->with('jobOrder.customer.user')
                ->whereIn('job_order_id', $jobOrderIds)
                ->get(['id', 'category', 'amount', 'job_order_id'])
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
                ->with('jobOrder.customer.user')
                ->whereIn('job_order_id', $jobOrderIds)
                ->get(['id', 'category', 'amount', 'job_order_id'])
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

    public function ticketStats()
    {
        $tickets = Ticket::query();

        $total_tickets = $tickets->count();

        $total_tickets_by_status = $tickets->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        return [
            'total_tickets'    => $total_tickets,
            'pending_tickets'  => $total_tickets_by_status[TicketStatus::PENDING?->value] ?? 0,
            'edited_tickets'   => $total_tickets_by_status[TicketStatus::EDITED?->value] ?? 0,
            'rejected_tickets' => $total_tickets_by_status[TicketStatus::REJECTED?->value] ?? 0
        ];
    }

    public function totalJoByMonths($startingDate = false)
    {
        return JobOrder::query()
            ->whereNull('status')
            ->whereYear('created_at', now()->year)
            ->when($startingDate, function ($query) use ($startingDate) {
                $query->where('created_at', '>=', $startingDate);
            })
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(*) as total_jos'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    public function totalTicketsByMonths($startingDate = false)
    {
        return Ticket::query()
            ->whereYear('created_at', now()->year)
            ->when($startingDate, function ($query) use ($startingDate) {
                $query->where('created_at', '>=', $startingDate);
            })
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(*) as total_tickets'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    public function chartData()
    {
        return $this->totalTicketsByMonths()
            ->concat($this->totalJoByMonths())
            ->groupBy('month')
            ->map(function ($items, $month) {
                return [
                    'month'        => Carbon::create()->month($month)->format("F"),
                    'month_number' => $month,
                    'ticket'       => $items->sum('total_tickets'),
                    'job_order'    => $items->sum('total_jos')
                ];
            })
            ->sortBy('month_number')
            ->values();
    }

    public function getLastSixMonthsTicketsAndJoData()
    {
        $starting_date = now()->subMonths(5)->startOfMonth();

        $last_six_months_date = collect(range(now()->subMonths(5)->month, now()->month));

        $tickets = $this->totalTicketsByMonths($starting_date)
            ->pluck('total_tickets', 'month');

        $jos = $this->totalJoByMonths($starting_date)
            ->pluck('total_jos', 'month');

        $tickets_data = $last_six_months_date->map(function ($month) use ($tickets) {
            return [
                'month' => Carbon::create()->month($month)->format("F"),
                'total' => $tickets[$month] ?? 0
            ];
        });

        $jos_data = $last_six_months_date->map(function ($month) use ($jos) {
            return [
                'month' => Carbon::create()->month($month)->format("F"),
                'total' => $jos[$month] ?? 0
            ];
        });

        return [
            [
                'data'  => $tickets_data,
                'title' => 'ticket'
            ],
            [
                'data'  => $jos_data,
                'title' => 'job_order'
            ]
        ];
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
            'top_area_manager_job_orders' => $this->topTenAreaManagersJobOrders(),
            'ticket_stats'                => $this->ticketStats(),
            'chart_data'                  => $this->chartData(),
            'last_six_months_data'        => $this->getLastSixMonthsTicketsAndJoData(),
        ];
    }
}
