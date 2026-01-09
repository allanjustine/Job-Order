<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTargetIncomeRequest;
use App\Http\Requests\UpdateTargetIncomeRequest;
use App\Models\TargetIncome;
use App\Services\TargetIncomeService;
use Illuminate\Http\Request;

class TargetIncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(TargetIncomeService $targetIncomeService)
    {
        $targetIncomes = $targetIncomeService->getTargetIncomes();

        return response()->json([
            'message' => 'TargetIncomes retrieved successfully.',
            'data'    => $targetIncomes,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTargetIncomeRequest $request, TargetIncomeService $targetIncomeService)
    {
        $request->validated();

        $targetIncome = $targetIncomeService->store($request);

        return response()->json([
            'message' => "Target Income of \"({$targetIncome->user->code}) - {$targetIncome->user->name}\" created successfully.",
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
     * Update the specified resource in storage.
     */
    public function update(UpdateTargetIncomeRequest $request, TargetIncomeService $targetIncomeService, TargetIncome $targetIncome)
    {
        $request->validated();

        $targetIncomeService->update($request, $targetIncome);

        return response()->json([
            'message' => "Target Income of \"({$targetIncome->user->code}) - {$targetIncome->user->name}\" updated successfully.",
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TargetIncomeService $targetIncomeService, TargetIncome $targetIncome)
    {
        $targetIncomeService->delete($targetIncome);

        return response()->json([
            'message' => "Target Income of \"({$targetIncome->user->code}) - {$targetIncome->user->name}\" deleted successfully.",
        ], 200);
    }
}
