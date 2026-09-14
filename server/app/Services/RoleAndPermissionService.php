<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionService
{
    public function getRolesAndPermissions()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        return [
            'roles'       => $roles->map(fn($item) => [...$item->toArray(), 'type' => 'roles']),
            'permissions' => $permissions->map(fn($item) => [...$item->toArray(), 'type' => 'permissions']),
        ];
    }

    public function store($request)
    {
        $is_role = $request->title === 'roles';

        if ($is_role) {
            $role = Role::create(['name' => $request->name, 'guard_name' => 'web']);

            $permission = Permission::find($request->permission_id);

            $role->givePermissionTo($permission);
        } else {
            $permission = Permission::create(['name' => $request->name, 'guard_name' => 'web']);
        }

        $role_or_permission = $is_role ? 'role' : 'permission';

        $role_or_permission_name = $role->name ?? $permission->name;

        activity()
            ->causedBy(Auth::user())
            ->performedOn($role ?? $permission)
            ->log("Created {$role_or_permission} {$role_or_permission_name}.");

        return $is_role ? $role : $permission;
    }

    public function update($request, $roleOrPermissionId)
    {
        $is_role = $request->title === 'roles';

        $old_data = null;
        $new_data = null;

        if ($is_role) {
            $role = Role::findOrFail($roleOrPermissionId);

            $old_data = "name: {$role->name}, permission: {$role->permissions->first()->name}";

            $role->update(['name' => $request->name]);

            $permission = Permission::find($request->permission_id);

            $new_data = "name: {$role->name}, permission: {$role->permissions->first()->name}";

            $role->syncPermissions($permission);
        } else {
            $permission = Permission::findOrFail($roleOrPermissionId);

            $old_data = "name: {$permission->name}";

            $permission->update(['name' => $request->name]);

            $new_data = "name: {$permission->name}";
        }

        activity()
            ->causedBy(Auth::user())
            ->performedOn($role ?? $permission)
            ->log("Updated a role/permission from \"{$old_data}\" to \"{$new_data}\".");

        return $is_role ? $role : $permission;
    }

    public function deleteRole($role)
    {
        activity()
            ->causedBy(Auth::user())
            ->performedOn($role)
            ->log("Deleted a role {$role->name}.");

        return $role->delete();
    }

    public function deletePermission($permission)
    {
        activity()
            ->causedBy(Auth::user())
            ->performedOn($permission)
            ->log("Deleted a permission {$permission->name}.");

        return $permission->delete();
    }

    public function getAllRoles()
    {
        return Role::latest()->get();
    }
}
