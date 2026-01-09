<?php

namespace App\Services;

use App\Models\AreaManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AreaManagerService
{
    public function getAllAreaManagers()
    {
        $per_page = request('perPage', 10);

        $sort = request('sort', ["column" => "target_income", "direction" => "asc"]);

        $search = request('search', '');

        return AreaManager::query()
            ->with('users:id,code,name')
            ->when(
                $search,
                fn($query)
                =>
                $query->whereRelation('users', 'name', 'like', "%{$search}%")
            )
            ->orderBy($sort['column'], $sort['direction'])
            ->paginate($per_page, ['id', 'created_at', 'name']);
    }

    public function store($request)
    {
        return DB::transaction(function () use ($request) {
            $areaManager = AreaManager::query()
                ->create([
                    'name' => Str::title($request->name)
                ]);

            $areaManager->users()->attach($request->user_ids);

            return $areaManager;
        });
    }

    public function update($request, $areaManager)
    {
        return DB::transaction(function () use ($request, $areaManager) {
            $areaManager->update([
                'name' => Str::title($request->name)
            ]);

            $areaManager->users()->sync($request->user_ids);

            return $areaManager;
        });
    }

    public function delete($areaManager)
    {
        return $areaManager->delete();
    }
}
