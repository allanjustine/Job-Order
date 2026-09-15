<?php

namespace App\Services;

use App\Models\TicketCategory;
use Illuminate\Support\Facades\Auth;

class TicketCategoryService
{
    public function getAllTicketCategories()
    {
        $per_page = request('perPage', 10);

        $sort = request('sort', ["column" => "name", "direction" => "asc"]);

        $search = request('search', '');

        return TicketCategory::query()
            ->withCount('tickets')
            ->when(
                $search,
                fn($query)
                =>
                $query->where('name', 'like', "%{$search}%")
            )
            ->orderBy($sort['column'], $sort['direction'])
            ->paginate($per_page);
    }

    public function storeTicketCategory($request)
    {
        $ticket_category = TicketCategory::query()
            ->create([
                'name' => $request->name
            ]);

        activity()
            ->causedBy(Auth::user())
            ->performedOn($ticket_category)
            ->log("Created ticket category \"{$ticket_category->name}\".");

        return $ticket_category;
    }

    public function updateTicketCategory($request, $ticketCategory)
    {
        $old_name = $ticketCategory->name;

        $ticketCategory->update([
            'name' => $request->name
        ]);

        $new_name = $ticketCategory->name;

        activity()
            ->causedBy(Auth::user())
            ->performedOn($ticketCategory)
            ->log("Updated ticket category name from: \"{$old_name}\" to \"{$new_name}\".");

        return $ticketCategory;
    }

    public function deleteTicketCategory($ticketCategory)
    {
        activity()
            ->causedBy(Auth::user())
            ->performedOn($ticketCategory)
            ->log("Deleted ticket category \"{$ticketCategory->name}\".");

        return $ticketCategory->delete();
    }
}
