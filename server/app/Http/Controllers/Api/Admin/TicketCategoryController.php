<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketCategoryRequest;
use App\Http\Requests\UpdateTicketCategoryRequest;
use App\Models\TicketCategory;
use App\Services\TicketCategoryService;
use Illuminate\Http\Request;

class TicketCategoryController extends Controller
{
    public function __construct(public TicketCategoryService $ticketCategoryService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ticket_categories = $this->ticketCategoryService->getAllTicketCategories();

        return response()->json([
            'message' => 'Ticket categories retrieved successfully.',
            'data'    => $ticket_categories
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
    public function store(StoreTicketCategoryRequest $ticketCategoryRequest)
    {
        $ticket_category = $this->ticketCategoryService->storeTicketCategory($ticketCategoryRequest);

        return response()->json([
            'message' => "Ticket category \"{$ticket_category->name}\" created successfully.",
            'data'    => $ticket_category
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
    public function update(UpdateTicketCategoryRequest $ticketCategoryRequest, TicketCategory $ticketCategory)
    {
        $tickey_category = $this->ticketCategoryService->updateTicketCategory($ticketCategoryRequest, $ticketCategory);

        return response()->json([
            'message' => "Ticket category \"{$tickey_category->name}\" updated successfully.",
            'data'    => $tickey_category
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketCategory $ticketCategory)
    {
        $this->ticketCategoryService->deleteTicketCategory($ticketCategory);

        return response()->json([
            'message' => "Ticket category \"{$ticketCategory->name}\" deleted successfully."
        ], 200);
    }
}
