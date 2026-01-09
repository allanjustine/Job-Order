<?php

namespace App\Services;

use App\Enums\RoleName;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class AuthService
{
    public function authenticate($request)
    {
        $user = User::query()
            ->whereAny(
                [
                    'email',
                    'code'
                ],
                $request->branchCodeOrEmail
            )
            ->first();

        if (!$user) {
            return abort(404, "Branch code or email does not exist");
        }

        if (!Auth::guard('web')->attempt([
            'email' => filter_var($request->branchCodeOrEmail, FILTER_VALIDATE_EMAIL) ? $request->branchCodeOrEmail : $user->email,
            'password' => $request->password
        ])) {
            return abort(400, "Invalid credentials");
        }

        $request->session()->regenerate();

        return $user;
    }

    public function store($request)
    {
        return DB::transaction(function () use ($request) {
            $user = User::query()
                ->create([
                    "name"                  => Str::title($request->branchName),
                    "code"                  => Str::upper($request->branchCode),
                    "branch_id"             => $request->branch,
                    "email"                 => Str::of($request->email)->lower()->trim(),
                    "password"              => $request->password,
                ]);

            $employeeRole = Role::query()
                ->where("name", RoleName::EMPLOYEE?->value)
                ->first();

            $user->assignRole($employeeRole);
        });
    }
}
