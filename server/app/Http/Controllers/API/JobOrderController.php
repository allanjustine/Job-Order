<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobOrderRequest;
use App\Models\Customer;
use App\Services\JobOrderService;
use Illuminate\Support\Facades\Auth;

class JobOrderController extends Controller
{

    public function index(JobOrderService $jobOrderService)
    {
        $jobOrders = $jobOrderService->getBranchJobOrders();

        return response()->json([
            'message' => 'Job Orders fetched successfully.',
            'data'    => $jobOrders
        ]);
    }

    public function store(StoreJobOrderRequest $request, JobOrderService $jobOrderService)
    {
        $user = Auth::user();

        $customer = $jobOrderService->store($request, $user);

        return response()->json("\"{$customer->name}\" Job Order has been printed successfully.", 201);
    }
}
