<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStatusTicketRequest;
use App\Http\Requests\StoreTicketRequest;
use App\Models\Ticket;
use App\Services\TicketService;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function __construct(public TicketService $ticketService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tickets = $this->ticketService->getAllTickets();

        return response()->json([
            'message' => 'Tickets retrieved successfully',
            'data'    => $tickets
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
    public function store(StoreTicketRequest $request)
    {
        $request->validated();

        $data = $this->ticketService->storeTicket($request);

        return response()->json([
            'message' => 'Ticket created successfully',
            'data'    => $data
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        $ticket = $this->ticketService->getTicketById($ticket);

        return response()->json([
            'message' => 'Ticket retrieved successfully',
            'data'    => $ticket
        ], 200);
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
    public function destroy(string $id)
    {
        //
    }

    public function getAllTicketCategoriesAndBrands()
    {
        $data = $this->ticketService->getAllTicketCategoriesAndBrands();

        return response()->json([
            'message' => 'Successfully fetched data',
            'data'    => $data
        ], 200);
    }

    public function updateTicketStatus(StoreStatusTicketRequest $request, Ticket $ticket, $title)
    {
        $request->validated();

        $data = $this->ticketService->updateTicketStatus($request, $ticket, $title);

        return response()->json([
            'message' =>  "Ticket with ticket code of {$data->ticket_code} rejected successfully",
        ]);
    }
}
