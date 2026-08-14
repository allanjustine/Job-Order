<?php

namespace App\Services;

use App\Models\AreaManager;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AreaManagerService
{
    public function getAllAreaManagers()
    {
        $per_page = request('perPage', 10);

        $sort = request('sort', ["column" => "target_income", "direction" => "asc"]);

        $search = request('search', '');

        $area_managers = AreaManager::query()
            ->with('users:id,code,name')
            ->when(
                $search,
                fn($query)
                =>
                $query->whereRelation('users', 'name', 'like', "%{$search}%")
            )
            ->orderBy($sort['column'], $sort['direction'])
            ->paginate($per_page);

        return $area_managers->through(fn($area_manager) => [
            'id'         => $area_manager->id,
            'name'       => $area_manager->name,
            'created_at' => $area_manager->created_at,
            'users'      => $area_manager->users->map(fn($user) => [
                'id'     => $user->id,
                'code'   => $user->code,
                'name'   => $user->name,
            ])
        ]);
    }

    public function store($request)
    {
        return DB::transaction(function () use ($request) {
            $areaManager = AreaManager::query()
                ->create([
                    'name' => Str::title($request->name)
                ]);

            $areaManager->users()->attach($request->user_ids);

            $user_count = count($request->user_ids);

            activity()
                ->causedBy(Auth::user())
                ->performedOn($areaManager)
                ->log("Added area manager {$areaManager->name} with {$user_count} branches.");

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

            $user_count = count($request->user_ids);

            activity()
                ->causedBy(Auth::user())
                ->performedOn($areaManager)
                ->log("Added {$user_count} branches to {$areaManager->name}.");

            return $areaManager;
        });
    }

    public function delete($areaManager)
    {
        activity()
            ->causedBy(Auth::user())
            ->performedOn($areaManager)
            ->log("Deleted area manager {$areaManager->name}.");

        return $areaManager->delete();
    }
}
