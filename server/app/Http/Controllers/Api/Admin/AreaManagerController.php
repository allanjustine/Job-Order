<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAreaManagerRequest;
use App\Http\Requests\UpdateAreaManagerRequest;
use App\Models\AreaManager;
use App\Services\AreaManagerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AreaManagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(AreaManagerService $areaManagerService)
    {
        $areaManagers = $areaManagerService->getAllAreaManagers();

        return response()->json([
            'message' => 'AreaManagers retrieved successfully.',
            'data'    => $areaManagers
        ], 200);
    }

    public function areaManagerSelectionOptions()
    {
        $areaManagers = AreaManager::query()
            ->whereNot('id', Auth::id())
            ->get(['id', 'name']);

        return response()->json([
            'message' => 'Area Managers retrieved successfully.',
            'data'    => $areaManagers
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAreaManagerRequest $request, AreaManagerService $areaManagerService)
    {
        $request->validated();

        $areaManager = $areaManagerService->store($request);

        return response()->json([
            'message' => "Area Manager \"{$areaManager->name}\" created successfully.",
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
    public function update(UpdateAreaManagerRequest $request, AreaManagerService $areaManagerService, AreaManager $areaManager)
    {
        $request->validated();

        $areaManagerService->update($request, $areaManager);

        return response()->json([
            'message' => "Area Manager \"{$areaManager->name}\" updated successfully.",
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AreaManagerService $areaManagerService, AreaManager $areaManager)
    {
        $areaManagerService->delete($areaManager);

        return response()->json([
            'message' => "Area Manager \"{$areaManager->name}\" deleted successfully.",
        ], 200);
    }
}
