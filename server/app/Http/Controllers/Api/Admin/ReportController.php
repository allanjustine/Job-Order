<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobOrder;
use App\Services\ReportService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ReportService $reportService)
    {
        $reports = $reportService->getAllReports();

        return response()->json([
            'message' => 'Reports retrieved successfully.',
            'data'    => $reports
        ], 200);
    }

    public function exportData(ReportService $reportService)
    {
        $reportExported = $reportService->exportData();

        return response()->json([
            'message' => 'Report exported successfully.',
            'data'    => $reportExported
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ReportService $reportService, JobOrder $job_order)
    {
        $data = $reportService->showJo($job_order);

        return response()->json([
            'message' => 'Job Order retrieved successfully.',
            'data'    => $data
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function prevNextJobOrderStats(JobOrder $jobOrder)
    {
        $jobOrderItem = JobOrder::query()
            ->select('id', 'status')
            ->whereNull('status');

        $prevJobOrder = (clone $jobOrderItem)
            ->where('id', '<', $jobOrder->id)
            ->orderBy('id', 'desc')
            ->first();

        $nextJobOrder = (clone $jobOrderItem)
            ->where('id', '>', $jobOrder->id)
            ->orderBy('id', 'asc')
            ->first();

        return response()->json([
            'message'      => 'Previous and next job order stats retrieved successfully.',
            'data'         => [
                'previous' => $prevJobOrder?->id,
                'next'     => $nextJobOrder?->id,
            ]
        ], 200);
    }
}
