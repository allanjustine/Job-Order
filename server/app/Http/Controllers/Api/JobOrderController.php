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
        $customer = $jobOrderService->store($request);

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
                'customer.user',
                'jobOrderDiagnosis:id,job_order_id,title,status,remarks',
            ])
                ->loadSum('jobOrderDetails', 'amount')
                ->loadSum(['jobOrderDetails as total_job_request' => fn($tjr) => $tjr->where('type', 'job_request')], 'amount')
                ->loadSum(['jobOrderDetails as total_parts_used' => fn($tjr) => $tjr->where('type', 'parts_replacement')], 'amount')
        ], 200);
    }

    public function destroy(JobOrderService $jobOrderService, string $id)
    {
        $jobOrder = $jobOrderService->delete($id);

        return response()->json([
            'message' => "Job Order with transaction code of \"{$jobOrder->transaction_code}\" deleted successfully."
        ], 200);
    }

    public function cancel(string $id)
    {
        $jobOrder = JobOrder::find($id);

        if (!$jobOrder) {
            return response()->json([
                'message' => 'Job Order not found.'
            ], 404);
        }

        $jobOrder->update([
            'status'                  => 'cancelled',
            'reason_for_cancellation' => request('reason')
        ]);

        return response()->json([
            'message' => 'Job Order cancelled successfully.'
        ], 200);
    }

    public function search(Request $request)
    {
        $request->validate([
            'transaction_code'        => ['required', 'exists:job_orders,transaction_code']
        ], [
            'transaction_code.exists' => "Job Order with transaction code of \"{$request->transaction_code}\" you searched for does not exist."
        ]);

        $job_order = JobOrder::query()
            ->with([
                'customer',
                'mechanics',
                'jobOrderDetails',
                'customer.user',
                'jobOrderDiagnosis:id,job_order_id,title,status,remarks',
            ])
            ->withSum('jobOrderDetails', 'amount')
            ->withSum(['jobOrderDetails as total_job_request' => fn($tjr) => $tjr->where('type', 'job_request')], 'amount')
            ->withSum(['jobOrderDetails as total_parts_used' => fn($tjr) => $tjr->where('type', 'parts_replacement')], 'amount')
            ->where('transaction_code', $request->transaction_code)
            ->first();

        return response()->json([
            'message' => 'Job Order fetched successfully.',
            'data'    => $job_order
        ], 200);
    }

    public function verifyingJobOrder(Request $request)
    {
        $user = Auth::user();

        if ($user->is_locked_date && !now()->isSameDay($request->job_order_date)) {
            abort(400, 'Submissions of job orders are only allowed on today\'s date. Please make sure the date is correct.');
        }

        return response()->noContent();
    }
}