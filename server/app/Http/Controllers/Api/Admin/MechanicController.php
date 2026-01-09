<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMechanicRequest;
use App\Http\Requests\UpdateMechanicRequest;
use App\Models\Mechanic;
use App\Services\MechanicService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MechanicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(MechanicService $mechanicService)
    {
        $mechanics = $mechanicService->getMechanics();

        return response()->json([
            'message' => 'Mechanics retrieved successfully.',
            'data'    => $mechanics,
        ], 200);
    }

    public function branchMechanic(MechanicService $mechanicService)
    {
        $branchMechanics = $mechanicService->getBranchMechanics(Auth::id());

        return response()->json([
            'message' => 'Branch Mechanics retrieved successfully.',
            'data'    => $branchMechanics,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMechanicRequest $request, MechanicService $mechanicService)
    {
        $request->validated();

        $mechanic = $mechanicService->store($request);

        return response()->json([
            'message' => "Mechanic \"{$mechanic->name}\" created successfully.",
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
    public function update(UpdateMechanicRequest $request, MechanicService $mechanicService, Mechanic $mechanic)
    {
        $request->validated();

        $mechanicService->update($request, $mechanic);

        return response()->json([
            'message' => "Mechanic \"{$mechanic->name}\" updated successfully.",
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MechanicService $mechanicService, Mechanic $mechanic)
    {
        $mechanicService->delete($mechanic);

        return response()->json([
            'message' => "Mechanic \"{$mechanic->name}\" deleted successfully.",
        ], 200);
    }
}
