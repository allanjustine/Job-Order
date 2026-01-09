<?php

namespace App\Services;

use App\Models\Mechanic;
use App\Models\User;
use Illuminate\Support\Str;

class MechanicService
{
    public function getMechanics()
    {
        $per_page = request('perPage', 10);

        $sort = request('sort', ["column" => "name", "direction" => "asc"]);

        $branch_id = request('branch_id', null);

        $column = match ($sort['column']) {
            'user.name' => User::query()->select('code')->whereColumn('users.id', 'mechanics.user_id'),
            default => $sort['column']
        };

        $search = request('search', '');

        return Mechanic::query()
            ->with('user:id,code,name')
            ->withCount('jobOrders')
            ->when(
                $branch_id,
                fn($mechanic)
                =>
                $mechanic->where('user_id', $branch_id)
            )
            ->when(
                $search,
                fn($query)
                =>
                $query->where('name', 'like', "%{$search}%")
                    ->orWhereRelation('user', 'name', 'like', "%{$search}%")
                    ->orWhereRelation('user', 'code', 'like', "%{$search}%")
            )
            ->orderBy($column, $sort['direction'])
            ->paginate($per_page, ['id', 'name', 'user_id']);
    }

    public function getBranchMechanics($user_id)
    {
        return Mechanic::query()
            ->where('user_id', $user_id)
            ->get(['id', 'name']);
    }

    public function store($request)
    {
        return Mechanic::query()
            ->create([
                "name"    => Str::title($request->name),
                "user_id" => $request->user_id,
            ]);
    }

    public function update($request, $mechanic)
    {
        return $mechanic->update([
            "name"    => Str::title($request->name),
            "user_id" => $request->user_id,
        ]);
    }

    public function delete($mechanic)
    {
        return $mechanic->delete();
    }
}
