<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobOrderDetailsRequest;
use App\Models\JobOrder;
use App\Models\JobOrderDetail;
use App\Services\ManageJobOrderDetailService;
use Illuminate\Http\Request;

class ManageJobOrderDetail extends Controller
{
    public function __construct(public ManageJobOrderDetailService $manageJobOrderDetailService) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobOrderDetailsRequest $request)
    {
        $request->validated();

        $data = $this->manageJobOrderDetailService->store($request);

        return response()->json([
            'message' => "Job Order with transaction code of \"{$data->transaction_code}\" added new job order detail successfully."
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
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
    public function destroy(JobOrderDetail $jobOrderDetail)
    {
        $data = $this->manageJobOrderDetailService->delete($jobOrderDetail);

        return response()->json([
            'message' => "{$data->category} deleted successfully."
        ], 200);
    }
}
