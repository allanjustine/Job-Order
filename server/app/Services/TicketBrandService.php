<?php

namespace App\Services;

use App\Models\TicketBrand;
use Illuminate\Support\Facades\Auth;

class TicketBrandService
{
    public function getAllTicketBrands()
    {
        $per_page = request('perPage', 10);

        $sort = request('sort', ["column" => "name", "direction" => "asc"]);

        $search = request('search', '');

        return TicketBrand::query()
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

    public function storeTicketBrand($request)
    {
        $ticket_brand = TicketBrand::query()
            ->create([
                'name' => $request->name
            ]);

        activity()
            ->causedBy(Auth::user())
            ->performedOn($ticket_brand)
            ->log("Created ticket brand \"{$ticket_brand->name}\".");

        return $ticket_brand;
    }

    public function updateTicketBrand($request, $ticketBrand)
    {
        $old_name = $ticketBrand->name;

        $ticketBrand->update([
            'name' => $request->name
        ]);

        $new_name = $ticketBrand->name;

        activity()
            ->causedBy(Auth::user())
            ->performedOn($ticketBrand)
            ->log("Updated ticket brand name from: \"{$old_name}\" to \"{$new_name}\".");

        return $ticketBrand;
    }

    public function deleteTicketBrand($ticketBrand)
    {
        activity()
            ->causedBy(Auth::user())
            ->performedOn($ticketBrand)
            ->log("Deleted ticket brand \"{$ticketBrand->name}\".");

        return $ticketBrand->delete();
    }
}
