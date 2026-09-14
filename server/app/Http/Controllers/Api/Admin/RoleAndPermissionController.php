<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\RoleAndPermissionService;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionController extends Controller
{
    public function __construct(public RoleAndPermissionService $roleAndPermissionService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rolesAndPermissions = $this->roleAndPermissionService->getRolesAndPermissions();

        return response()->json([
            'message'  => 'Roles and permissions retrieved successfully',
            'data'     => [
                'data' => $rolesAndPermissions
            ]
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
    public function store(Request $request)
    {
        $roleOrPermission = $this->roleAndPermissionService->store($request);

        return response()->json([
            'message' => "{$roleOrPermission->name} role/permission created successfully",
            'data'    => $roleOrPermission
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        $this->roleAndPermissionService->update($request, $id);

        return response()->json([
            'message' => 'Role/permission updated successfully',
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroyRole(Role $role)
    {
        $this->roleAndPermissionService->deleteRole($role);

        return response()->json([
            'message' => "{$role->name} role deleted successfully",
        ], 200);
    }

    public function destroyPermission(Permission $permission)
    {
        $this->roleAndPermissionService->deletePermission($permission);

        return response()->json([
            'message' => "{$permission->name} permission deleted successfully",
        ], 200);
    }

    public function getAllRoles()
    {
        $roles = $this->roleAndPermissionService->getAllRoles();

        return response()->json([
            'message' => 'All roles retrieved successfully',
            'data'    => $roles
        ], 200);
    }
}
