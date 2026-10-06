<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePartNumberRequest;
use App\Http\Requests\UpdatePartNumberRequest;
use App\Models\PartNumber;
use App\Services\PartNumberService;
use Illuminate\Http\Request;

class PartNumberController extends Controller
{
    public function __construct(public PartNumberService $partNumberService) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $part_numbers = $this->partNumberService->getAllPartNumbers();

        return response()->json([
            'message' => 'Part numbers retrieved successfully.',
            'data'    => $part_numbers
        ], 200);
    }

    public function index2()
    {
        $part_numbers = $this->partNumberService->getAllPartNumbersWithoutPagination();

        return response()->json([
            'message' => 'Part numbers retrieved successfully.',
            'data'    => $part_numbers
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePartNumberRequest $request)
    {
        $part_number = $this->partNumberService->storePartNumber($request);

        return response()->json([
            'message' => "Part number \"{$part_number->part_number}\" created successfully.",
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
    public function update(UpdatePartNumberRequest $request, PartNumber $partNumber)
    {
        $this->partNumberService->updatePartNumber($request, $partNumber);

        return response()->json([
            'message' => "Part number \"{$partNumber->part_number}\" updated successfully.",
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PartNumber $partNumber)
    {
        $this->partNumberService->deletePartNumber($partNumber);

        return response()->json([
            'message' => "Part number \"{$partNumber->part_number}\" deleted successfully.",
        ], 200);
    }
}
