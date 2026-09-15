<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketBrandRequest;
use App\Http\Requests\UpdateTicketBrandRequest;
use App\Models\TicketBrand;
use App\Services\TicketBrandService;
use Illuminate\Http\Request;

class TicketBrandController extends Controller
{
    public function __construct(public TicketBrandService $ticketBrandService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ticket_brands = $this->ticketBrandService->getAllTicketBrands();

        return response()->json([
            'message' => 'Ticket brands retrieved successfully.',
            'data'    => $ticket_brands
        ], 200);
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
    public function store(StoreTicketBrandRequest $ticketBrandRequest)
    {
        $ticket_brand = $this->ticketBrandService->storeTicketBrand($ticketBrandRequest);

        return response()->json([
            'message' => "Ticket brand \"{$ticket_brand->name}\" created successfully.",
            'data'    => $ticket_brand
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
    public function update(UpdateTicketBrandRequest $ticketBrandRequest, TicketBrand $ticketBrand)
    {
        $tickey_brand = $this->ticketBrandService->updateTicketBrand($ticketBrandRequest, $ticketBrand);

        return response()->json([
            'message' => "Ticket brand \"{$tickey_brand->name}\" updated successfully.",
            'data'    => $tickey_brand
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketBrand $ticketBrand)
    {
        $this->ticketBrandService->deleteTicketBrand($ticketBrand);

        return response()->json([
            'message' => "Ticket brand \"{$ticketBrand->name}\" deleted successfully."
        ], 200);
    }
}
