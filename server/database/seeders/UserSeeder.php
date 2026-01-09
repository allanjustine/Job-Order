<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
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

        $password = Hash::make('password');

        $users = [
            [
                "name"          => "Administrator",
                "code"          => "admin",
                "email"         => "admin@gmail.com",
                "password"      => $password,
                "branch_id"     => 1,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                "name"          => "Testing User",
                "code"          => "TEST",
                "email"         => "test@gmail.com",
                "password"      => $password,
                "branch_id"     => 2,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]
        ];

        User::query()
            ->insert($users);

        $user = User::query()
            ->get();

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
            ],
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

        Permission::query()
            ->insert($permissions);

        Role::query()
            ->insert($roles);

        $adminPermissions = Permission::query()
            ->where("name", RoleName::ADMIN_ACCESS?->value)
            ->first();
        $employeePermissions = Permission::query()
            ->where("name", RoleName::EMPLOYEE_ACCESS?->value)
            ->first();

        $adminRole = Role::query()
            ->where("name", RoleName::ADMIN?->value)
            ->first();
        $employeeRole = Role::query()
            ->where("name", RoleName::EMPLOYEE?->value)
            ->first();

        $adminRole->syncPermissions([$adminPermissions, $employeePermissions]);
        $employeeRole->syncPermissions([$employeePermissions]);

        $user->first()->assignRole($adminRole);
        $user->last()->assignRole($employeeRole);
    }
}
