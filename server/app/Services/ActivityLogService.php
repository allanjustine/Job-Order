<?php

namespace App\Services;

use App\Models\User;
use Spatie\Activitylog\Models\Activity;

class ActivityLogService
{
    public function getActivityLogs()
    {
        $per_page = request('perPage') ?: 10;

        $sort = request('sort') ?: ["column" => "id", "direction" => "desc"];

        $search = request('search') ?: '';

        $column = match ($sort['column']) {
            'causer.name' => User::query()->select('name')->whereColumn('users.id', 'activity_log.causer_id'),
            default => $sort['column']
        };

        return Activity::query()
            ->with(['causer:id,name'])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('causer', function ($q) use ($search) {
                    $q->whereAny(
                        [
                            'name',
                            'code',
                            'email'
                        ],
                        "like",
                        "%{$search}%"
                    );
                })->orWhereLike('description', "%{$search}%");
            })
            ->orderBy($column, $sort["direction"])
            ->paginate($per_page, ['id', 'description', 'causer_id', 'causer_type', 'subject_type', 'created_at']);
    }
}
