<?php

namespace App\Services;

use App\Enums\RoleName;
use App\Models\Branch;
use App\Models\User;
use App\Models\UserExportLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class UserService
{
    public function getAllUsers()
    {
        $per_page = request('perPage') ?: 10;

        $sort = request('sort') ?: ["column" => "id", "direction" => "desc"];

        $search = request('search') ?: '';

        $sort['column'] = match ($sort['column']) {
            'user_export_log.created_at' => UserExportLog::query()->select('created_at')->whereColumn('user_export_logs.user_id', 'users.id')->latest()->limit(1),
            'branch.branch_name'         => Branch::query()->select('branch_name')->whereColumn('branches.id', 'users.branch_id'),
            'user.role'                  => Role::query()->select('roles.name')->join('model_has_roles', 'model_has_roles.role_id', '=', 'roles.id')->whereColumn('model_has_roles.model_id', 'users.id'),
            default                      => $sort['column']
        };

        $customers = User::with(['branch:id,branch_name,branch_code', 'roles:id,name', 'userExportLog'])
            ->whereNotIn('id', [Auth::id()])
            ->when(
                $search,
                fn($query) =>
                $query->where(
                    fn($subQuery) =>
                    $subQuery->where("name", "like", "%{$search}%")
                        ->orWhere("code", "like", "%{$search}%")
                        ->orWhere("email", "like", "%{$search}%")
                        ->orWhereHas(
                            "roles",
                            fn($roleQuery) =>
                            $roleQuery->where("name", "like", "%{$search}%")
                        )
                        ->orWhereHas(
                            "branch",
                            fn($branchQuery) =>
                            $branchQuery->where("branch_name", "like", "%{$search}%")
                                ->orWhere('code', 'like', "%{$search}%")
                        )
                )
            )
            ->orderBy($sort["column"], $sort["direction"])
            ->paginate($per_page);

        $data = async(fn() => [
            "data"                => $customers->through(fn($user) => [
                "id"              => $user->id,
                "name"            => $user->name,
                "code"            => $user->code,
                "branch_id"       => $user->branch_id,
                "email"           => $user->email,
                "branch"          => $user->branch,
                "user_export_log" => $user->userExportLog?->created_at?->diffForHumans(),
                "is_locked_date"  => $user->is_locked_date,
                "roles"           => $user->roles,
                "created_at"      => $user->created_at
            ])
        ]);

        return await($data);
    }

    public function storeUser($request)
    {
        $user =  DB::transaction(function () use ($request) {
            $user = User::query()
                ->create([
                    "name"      => Str::title($request->name),
                    "code"      => Str::upper($request->code),
                    "branch_id" => $request->branch_id,
                    "email"     => Str::of($request->email)->lower()->trim(),
                    "password"  => "Smct123456",
                ]);

            $employeeRole = Role::findOrFail($request->role_id);

            $user->assignRole($employeeRole);

            return $user;
        });

        activity()
            ->causedBy(Auth::user())
            ->performedOn($user)
            ->log("Added new user {$user->name} to system.");

        return $user;
    }

    public function updateUser($request, $user)
    {
        $old_data = "name: {$user->name}, code: {$user->code}, branch: {$user->branch->branch_name}, email: {$user->email}, role: {$user->roles->first()->name}";

        DB::transaction(function () use ($request, $user) {
            $user->update([
                "name"      => Str::title($request->name),
                "code"      => Str::upper($request->code),
                "branch_id" => $request->branch_id,
                "email"     => Str::of($request->email)->lower()->trim(),
            ]);

            $employeeRole = Role::findOrFail($request->role_id);

            $user->syncRoles($employeeRole);

            return $user;
        });

        $new_data = "name: {$user->name}, code: {$user->code}, branch: {$user->branch->branch_name}, email: {$user->email}, role: {$user->roles->first()->name}";

        activity()
            ->causedBy(Auth::user())
            ->performedOn($user)
            ->log("Updated a user from \"{$old_data}\" to \"{$new_data}\".");


        return [
            'new_data' => $new_data,
            'old_data' => $old_data
        ];
    }

    public function deleteUser($user)
    {
        activity()
            ->causedBy(Auth::user())
            ->performedOn($user)
            ->log("Deleted a user {$user->name} from system.");

        return $user->delete();
    }

    public function getSelectionOptions()
    {
        $type = request('type', null);

        return  User::query()
            ->has('customers')
            ->where(
                fn($query)
                =>
                $query->whereNot('id', Auth::id())
                    ->whereDoesntHaveRelation('roles', 'name', RoleName::ADMIN?->value)
            )
            ->when(
                $type === 'target-income',
                fn($query)
                =>
                $query->whereDoesntHave(
                    'targetIncomes',
                    fn($user)
                    =>
                    $user->whereMonth('month_of', now()->month)
                        ->whereYear('month_of', now()->year)
                )
            )
            ->when(
                $type === 'area-manager',
                fn($query)
                =>
                $query->doesntHave('areaManagers')
            )
            ->orderBy('code')
            ->get(['id', 'name', 'code']);
    }
}
