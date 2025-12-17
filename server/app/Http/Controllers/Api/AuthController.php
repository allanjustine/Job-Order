<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleName;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function login(Request $request)
    {
        $request->validate([
            'branchCodeOrEmail'     => ['required'],
            'password'              => ['required', 'min:4', 'max:16']
        ]);

        $user = User::where('email', $request->branchCodeOrEmail)
            ->orWhere('code', $request->branchCodeOrEmail)
            ->first();

        if (!$user) {
            return response()->json("Branch code or email does not exist", 404);
        }


        if (!Auth::guard('web')->attempt([
            'email' => filter_var($request->branchCodeOrEmail, FILTER_VALIDATE_EMAIL) ? $request->branchCodeOrEmail : $user->email,
            'password' => $request->password
        ])) {
            return response()->json("Invalid Credentials", 400);
        }

        $request->session()->regenerate();

        return response()->json([
            "message"   => "Login successfully",
            "url"       => $user->isAdmin() ? "/admin/dashboard" : "/dashboard"
        ], 202);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "branchCode"        => ["required", "unique:users,code"],
            "branchName"        => ["required"],
            "branch"            => ["required", "exists:branches,id"],
            "email"             => ["required", "email", "unique:users,email"],
            "password"          => ["required", "min:4", "max:16", "confirmed"],
        ]);

        $user = User::create([
            "name"                  => $request->branchName,
            "code"                  => $request->branchCode,
            "branch_id"             => $request->branch,
            "email"                 => $request->email,
            "password"              => $request->password,
        ]);

        $employeeRole = Role::where("name", RoleName::EMPLOYEE?->value)
            ->first();

        $user->assignRole($employeeRole);

        return response()->json("Successfully registered. You can login your account now.", 201);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        Auth::guard("web")->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(
            "Logged out successfully",
            202
        );
    }
}
