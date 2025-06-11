<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\JobOrder;
use App\Models\JobRequest;
use App\Models\PartsRequest;

class JobOrderController extends Controller
{
public function store(Request $request)
{
    $validation = Validator::make($request->all(), [
        'customerName'                  => 'required',
        'address'                       => 'required',
        'date'                          => 'required',   
        'contact'                       => 'required',
        'vehicleModel'                  => 'required',
        'chassis'                       => 'required', 
        'dealer'                        => 'required',
        'mileage'                       => 'required',
        'dateSold'                      => 'required',
        'typeOfJob'                     => 'required',
        'repairJobStart'                => 'required',
        'repairJobEnd'                  => 'required',
        'vehicleDocument'               => 'required',
        'VehicleDocumentOthers'         => 'required',
        'vehicleVisual'                 => 'required',
        'vehicleVisualOthers'           => 'required',
        'jobRequest'                    => 'required|array',
        'cost'                          => 'required|array',
        'partsName'                     => 'required|array',
        'partNo'                        => 'required|array',
        'quantity'                      => 'required|array',
        'price'                         => 'required|array',
    ]);

    if ($validation->fails()) {
        return response()->json([
            'status' => false,
            'message' => 'Validation error',
            'errors' => $validation->errors()
        ], 401);
    }

    // ✅ Calculate totals
    $totalLabor = array_sum($request->cost);

    $totalParts = 0;
    foreach ($request->price as $index => $price) {
        $qty = $request->quantity[$index] ?? 0;
        $totalParts += $price * $qty;
    }

    $overallTotal = $totalLabor + $totalParts;

    // ✅ Save to database
    $job_order = JobOrder::create([
        'customerName'                  => $request->customerName,
        'address'                       => $request->address,
        'date'                          => $request->date,
        'contact'                       => $request->contact,
        'vehicleModel'                  => $request->vehicleModel,
        'chassis'                       => $request->chassis,
        'dealer'                        => $request->dealer,
        'mileage'                       => $request->mileage,
        'dateSold'                      => $request->dateSold,
        'typeOfJob'                     => $request->typeOfJob,
        'repairJobStart'                => $request->repairJobStart,
        'repairJobEnd'                  => $request->repairJobEnd,
        'vehicleDocument'               => $request->vehicleDocument,
        'VehicleDocumentOthers'         => $request->VehicleDocumentOthers,
        'vehicleVisual'                 => $request->vehicleVisual,
        'vehicleVisualOthers'           => $request->vehicleVisualOthers,
        'jobRequest'                    => $request->jobRequest,
        'cost'                          => $request->cost,
        'partsName'                     => $request->partsName,
        'partNo'                        => $request->partNo,
        'quantity'                      => $request->quantity,
        'price'                         => $request->price,
        'totalLabor'                    => $totalLabor,
        'totalParts'                    => $totalParts,
        'totalAmount'                   => $overallTotal,
    ]);

    // ✅ Return response
    return response()->json([
        'message' => 'Job order created successfully',
        'data' => $job_order,
        'totals' => [
            'labor' => $totalLabor,
            'parts' => $totalParts,
            'overall' => $overallTotal,
        ]
    ]);
}



    public function index(){
        
        $job_order = JobOrder::all();
        
        return response()->json([
         'status' => true,
         'data' => $job_order
        ]);
    }
}
