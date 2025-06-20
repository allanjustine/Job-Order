<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        $users = [
            "name"          => "Head Office",
            "code"          => "HO",
            "email"         => "admin@gmail.com",
            "password"      => "Smct123456",
            "branch_id"     => 1,
        ];

        $user = User::create($users);

        $roles = [
            [
                "name"              => "admin",
                "guard_name"        => "web",
                "created_at"        => now(),
                "updated_at"        => now(),
            ],
            [
                "name"              => "employee",
                "guard_name"        => "web",
                "created_at"        => now(),
                "updated_at"        => now(),
            ]
        ];

        $permissions = [
            [
                "name"              => "admin-access",
                "guard_name"        => "web",
                "created_at"        => now(),
                "updated_at"        => now(),
            ],
            [
                "name"              => 'employee-access',
                "guard_name"        => "web",
                "created_at"        => now(),
                "updated_at"        => now(),
            ]
        ];

        Permission::insert($permissions);

        Role::insert($roles);

        $adminPermissions = Permission::where("name", RoleName::ADMIN_ACCESS?->value)
            ->first();
        $employeePermissions = Permission::where("name", RoleName::EMPLOYEE_ACCESS?->value)
            ->first();

        $adminRole = Role::where("name", RoleName::ADMIN?->value)
            ->first();
        $employeeRole = Role::where("name", RoleName::EMPLOYEE?->value)
            ->first();

        $adminRole->syncPermissions([$adminPermissions, $employeePermissions]);
        $employeeRole->syncPermissions([$employeePermissions]);

        $user->assignRole($adminRole, $employeeRole);
    }
}
