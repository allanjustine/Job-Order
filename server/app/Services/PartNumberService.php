<?php

namespace App\Services;

use App\Models\PartNumber;
use Illuminate\Support\Facades\Auth;

class PartNumberService
{
    public function getAllPartNumbers()
    {
        $per_page = request('perPage', 10);

        $sort = request('sort', ["column" => "part_number", "direction" => "asc"]);

        $search = request('search', '');

        return  PartNumber::query()
            ->when($search, fn($item) => $item->whereLike('part_number', "%{$search}%"))
            ->orderBy($sort['column'], $sort['direction'])
            ->paginate($per_page);
    }

    public function getAllPartNumbersWithoutPagination()
    {
        return PartNumber::query()->pluck('part_number');
    }

    public function storePartNumber($request)
    {
        $part_number = PartNumber::query()
            ->create([
                'part_number' => $request->_part_number
            ]);

        activity()
            ->causedBy(Auth::user())
            ->performedOn($part_number)
            ->log("Added new part number {$part_number->part_number} to system.");

        return $part_number;
    }

    public function updatePartNumber($request, $partNumber)
    {
        $old_part_number = $partNumber->part_number;

        $partNumber->update([
            'part_number' => $request->_part_number
        ]);

        activity()
            ->causedBy(Auth::user())
            ->performedOn($partNumber)
            ->log("Updated part number from {$old_part_number} to {$partNumber->part_number}.");

        return $partNumber;
    }

    public function deletePartNumber($partNumber)
    {
        activity()
            ->causedBy(Auth::user())
            ->performedOn($partNumber)
            ->log("Deleted part number {$partNumber->part_number}.");

        return $partNumber->delete();
    }
}
