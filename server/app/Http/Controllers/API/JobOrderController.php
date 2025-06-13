<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\JobOrder;
use App\Models\JobRequest;
use App\Models\PartsRequest;
use App\Models\VisualCheck;

class JobOrderController extends Controller
{
    public function store(Request $request)
    {
        $customer = Customer::create([
            'user_id'               => 1,
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

        return response()->json("Created ! LALALALALALA", 201);
    }

    public function index()
    {
        $per_page = request('perPage') ?: 10;

        $job_orders = JobOrder::with(
            'jobRequests',
            'partsRequests',
            'document',
            'visualCheck',
            'customer.user.branch'
        )
            ->orderBy('created_at', 'desc')
            ->paginate($per_page);

        return response()->json($job_orders, 200);
    }
}
