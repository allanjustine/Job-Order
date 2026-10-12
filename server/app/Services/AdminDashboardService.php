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
use App\Models\User;
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
            ->select('category')
            ->selectRaw('sum(amount) as amount')
            ->groupBy('category')
            ->orderByDesc('amount')
            ->limit(10)
            ->get();

        return $jobOrderDetails;
    }

    private function topTenBranchJobOrders()
    {
        $users = User::query()
            ->join('customers', 'customers.user_id', '=', 'users.id')
            ->join('job_orders', 'job_orders.customer_id', '=', 'customers.id')
            ->join('job_order_details', 'job_order_details.job_order_id', '=', 'job_orders.id')
            ->select(
                'users.name',
                'users.code',
                'job_order_details.category',
                DB::raw('SUM(job_order_details.amount) as total_sales'),
                DB::raw('ROW_NUMBER() OVER (PARTITION BY users.id ORDER BY SUM(job_order_details.amount) DESC) as tops')
            )
            ->groupBy(
                'job_order_details.category',
                'users.id',
                'users.name',
                'users.code'
            );

        return User::query()
            ->fromSub($users, 'top_branches')
            ->where('tops', 1)
            ->orderByDesc('total_sales')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'amount'   => $item->total_sales,
                    'branch'   => [
                        'name' => $item->name,
                        'code' => $item->code
                    ]
                ];
            });
    }

    private function topTenAreaManagersJobOrders()
    {
        return AreaManager::query()
            ->join('area_manager_user', 'area_manager_user.area_manager_id', '=', 'area_managers.id')
            ->join('users', 'users.id', '=', 'area_manager_user.user_id')
            ->join('customers', 'customers.user_id', '=', 'users.id')
            ->join('job_orders', 'job_orders.customer_id', '=', 'customers.id')
            ->join('job_order_details', 'job_order_details.job_order_id', '=', 'job_orders.id')
            ->select(
                'area_managers.id',
                'area_managers.name as area_name',
                DB::raw('SUM(job_order_details.amount) as total_sales')
            )
            ->withCount('users')
            ->groupBy(
                'area_managers.id',
                'area_managers.name',
            )
            ->orderByDesc('total_sales')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'area_manager_name' => $item->area_name,
                    'amount'            => $item->total_sales,
                    'total_branches'    => $item->users_count
                ];
            });
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

    private function getMonthName(string | int $month)
    {
        return Carbon::create()->month($month)->format("F");
    }

    public function chartData()
    {
        return $this->totalTicketsByMonths()
            ->concat($this->totalJoByMonths())
            ->groupBy('month')
            ->map(function ($items, $month) {
                return [
                    'month'        => $this->getMonthName($month),
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
                'month' => $this->getMonthName($month),
                'total' => $tickets[$month] ?? 0
            ];
        });

        $jos_data = $last_six_months_date->map(function ($month) use ($jos) {
            return [
                'month' => $this->getMonthName($month),
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

    public function getMonthlySales()
    {
        $monthly_sales = JobOrderDetail::query()
            ->whereRelation('jobOrder', 'status', null)
            ->whereYear('created_at', now()->year)
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw("COALESCE(SUM(CASE WHEN type = 'job_request' THEN amount END), 0) as job_request_sales"),
                DB::raw("COALESCE(SUM(CASE WHEN type = 'parts_replacement' THEN amount END), 0) as parts_replacement_sales")
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return $monthly_sales->map(function ($item) {
            return [
                'month'                   => $this->getMonthName($item->month),
                'job_request_sales'       => $item->job_request_sales,
                'parts_replacement_sales' => $item->parts_replacement_sales
            ];
        });
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
            'monthly_sales'               => $this->getMonthlySales()
        ];
    }
}
