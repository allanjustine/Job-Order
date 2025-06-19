<?php

namespace App\Http\Controllers\Api;

use App\Enums\TypeOfJob;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Document;
use Illuminate\Http\Request;
use App\Models\JobOrder;
use App\Models\JobRequest;
use App\Models\PartsRequest;
use App\Models\User;
use App\Models\VisualCheck;
use Illuminate\Support\Facades\Auth;

class JobOrderController extends Controller
{
    public function store(Request $request)
    {
        $customer = Customer::create([
            'user_id'               => Auth::id(),
            'name'                  => $request->customerName,
            'address'               => $request->address,
            'contact_number'        => $request->contact
        ]);

        $jobOrder = JobOrder::create([
            'customer_id'           => $customer->id,
            'chassis'               => $request->chassis,
            'date'                  => $request->date,
            'date_sold'             => $request->dateSold,
            'dealer'                => $request->dealer,
            'type_of_job'           => $request->jobType,
            'mileage'               => $request->mileage,
            'repair_job_end'        => $request->repairEnd,
            'repair_job_start'      => $request->repairStart,
            'vehicle_model'         => $request->vehicleModel,
            'service_advisor'       => $request->serviceAdvisor,
            'branch_manager'        => $request->branchManager,
        ]);

        foreach ($request->jobRequests as $jobRequest) {
            JobRequest::create([
                'job_order_id'      => $jobOrder->id,
                'cost'              => $jobRequest["cost"],
                'job_request'       => $jobRequest["request"]
            ]);
        }

        foreach ($request->partsRequests as $partRequest) {
            PartsRequest::create([
                'job_order_id'      => $jobOrder->id,
                'parts_name'        => $partRequest["name"],
                'parts_number'      => $partRequest["partNo"],
                'price'             => $partRequest["price"],
                'quantity'          => $partRequest["quantity"],
            ]);
        }

        Document::create([
            'job_order_id'          => $jobOrder->id,
            'owner_manual'          => $request->documents["ownerManual"],
            'owner_toolkit'         => $request->documents["ownerToolKit"],
            'warranty_guide_book'   => $request->documents["warrantyGuideBook"],
            'others'                => $request->documents["others"],
            'others_text'           => $request->documents["othersText"]
        ]);

        VisualCheck::create([
            'job_order_id'          => $jobOrder->id,
            'broken'                => $request->visualCheck["broken"],
            'dent'                  => $request->visualCheck["dent"],
            'missing'               => $request->visualCheck["missing"],
            'scratch'               => $request->visualCheck["scratch"],
            'broken_note'           => $request->visualCheck["brokenNotes"],
            'dent_note'             => $request->visualCheck["dentNotes"],
            'missing_note'          => $request->visualCheck["missingNotes"],
            'scratch_note'          => $request->visualCheck["scratchNotes"],
        ]);

        return response()->json("\"{$customer->name}\" Job Order has been printed successfully.", 201);
    }

    private function totalJobPrints()
    {
        $totalJobOrders = JobOrder::count();

        $totalPms = JobOrder::where("type_of_job", TypeOfJob::PMS)
            ->count();

        $totalRr = JobOrder::where("type_of_job", TypeOfJob::RR)
            ->count();

        $totalWc = JobOrder::where("type_of_job", TypeOfJob::WC)
            ->count();

        return [$totalJobOrders, $totalPms, $totalRr, $totalWc];
    }

    private function totalDatePrints()
    {
        $todaysPrint = JobOrder::whereToday('created_at')
            ->count();

        $thisWeekPrint = JobOrder::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();

        $thisMonthPrint = JobOrder::whereMonth('created_at', now()->month)
            ->count();

        return [$todaysPrint, $thisWeekPrint, $thisMonthPrint];
    }

    private function totalAmounts()
    {
        $totalLabor = JobRequest::all()
            ->sum('cost');

        $totalParts = PartsRequest::all()
            ->sum('sub_total_price');

        $totalPmsAmountParts = PartsRequest::whereHas('jobOrder', fn($query) => $query->where('type_of_job', TypeOfJob::PMS))
            ->get()
            ->sum('sub_total_price');
        $totalRrAmountParts = PartsRequest::whereHas('jobOrder', fn($query) => $query->where('type_of_job', TypeOfJob::RR))
            ->get()
            ->sum('sub_total_price');
        $totalWcAmountParts = PartsRequest::whereHas('jobOrder', fn($query) => $query->where('type_of_job', TypeOfJob::WC))
            ->get()
            ->sum('sub_total_price');

        $totalPmsAmountLabor = JobRequest::whereHas('jobOrder', fn($query) => $query->where('type_of_job', TypeOfJob::PMS))
            ->get()
            ->sum('cost');
        $totalRrAmountLabor = JobRequest::whereHas('jobOrder', fn($query) => $query->where('type_of_job', TypeOfJob::RR))
            ->get()
            ->sum('cost');
        $totalWcAmountLabor = JobRequest::whereHas('jobOrder', fn($query) => $query->where('type_of_job', TypeOfJob::WC))
            ->get()
            ->sum('cost');

        $totalPmsAmount = $totalPmsAmountParts + $totalPmsAmountLabor;

        $totalRrAmount = $totalRrAmountParts + $totalRrAmountLabor;

        $totalWcAmount = $totalWcAmountParts + $totalWcAmountLabor;

        $totalOverAllAmount = $totalLabor + $totalParts;

        return [$totalLabor, $totalParts, $totalOverAllAmount, $totalPmsAmount, $totalRrAmount, $totalWcAmount];
    }

    public function index()
    {
        $per_page = request('perPage') ?: 10;

        $sort = request('sort') ?: ["column" => "id", "direction" => "desc"];

        $search = request('search') ?: '';

        $job_orders =
            JobOrder::with(
                'jobRequests',
                'partsRequests',
                'document',
                'visualCheck',
                'customer.user.branch',
                'customer.user.roles:id,name',
            )
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where("chassis", "like", "%{$search}%")
                        ->orWhere("dealer", "like", "%{$search}%")
                        ->orWhere("mileage", "like", "%{$search}%");
                });
            })
            ->orderBy($sort["column"], $sort["direction"])
            ->paginate($per_page);

        [$totalJobOrders, $totalPms, $totalRr, $totalWc] = $this->totalJobPrints();

        [$todaysPrint, $thisWeekPrint, $thisMonthPrint] = $this->totalDatePrints();

        $totalBranchPrints = User::whereHas('customers')
            ->count();

        [$totalLabor, $totalParts, $totalOverAllAmount, $totalPmsAmount, $totalRrAmount, $totalWcAmount] = $this->totalAmounts();

        $data = async(fn() => [
            "data"                      => $job_orders,
            "total_job_orders"          => $totalJobOrders,
            "total_pms"                 => $totalPms,
            "total_rr"                  => $totalRr,
            "total_wc"                  => $totalWc,
            "todays_print"              => $todaysPrint,
            "this_week_print"           => $thisWeekPrint,
            "this_month_print"          => $thisMonthPrint,
            "total_branch_prints"       => $totalBranchPrints,
            "total_labor"               => $totalLabor,
            "total_parts"               => $totalParts,
            "total_over_all_amount"     => $totalOverAllAmount,
            "total_pms_amount"          => $totalPmsAmount,
            "total_rr_amount"           => $totalRrAmount,
            "total_wc_amount"           => $totalWcAmount
        ]);

        return response()->json(await($data), 200);
    }
}
