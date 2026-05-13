<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\JobOrderService;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\JobOrder;

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

    public function store(Request $request, JobOrderService $jobOrderService)
    {
        $user = Auth::user();

        $customer = $jobOrderService->store($request, $user);

        return response()->json("\"{$customer->name}\" Job Order has been printed successfully.", 201);
    }

    public function exportBranchData(ReportService $reportService)
    {
        $data = $reportService->exportBranch();

        return response()->json([
            'message' => 'Report exported successfully.',
            'data'    => $data
        ], 200);
    }

    public function show(JobOrder $jobOrder)
    {
        return response()->json([
            'message' => 'Job Order fetched successfully.',
            'data'    => $jobOrder->load([
                'customer',
                'mechanics',
                'jobOrderDetails',
                'customer.user'
            ])
                ->loadSum('jobOrderDetails', 'amount')
                ->loadSum(['jobOrderDetails as total_job_request' => fn($tjr) => $tjr->where('type', 'job_request')], 'amount')
                ->loadSum(['jobOrderDetails as total_parts_used' => fn($tjr) => $tjr->where('type', 'parts_replacement')], 'amount')
        ], 200);
    }

    public function destroy($id)
    {
        $jobOrder = JobOrder::find($id);

        if (!$jobOrder) {
            return response()->json([
                'message' => 'Job Order not found.'
            ], 404);
        }

        $jobOrder->update([
            'status' => 'cancelled'
        ]);

        return response()->json([
            'message' => 'Job Order cancelled successfully.'
        ], 200);
    }
}
