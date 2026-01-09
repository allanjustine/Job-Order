<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function login(LoginRequest $request, AuthService $authService)
    {
        $request->validated();

        $user = $authService->authenticate($request);

        return response()->json([
            "message"   => "Login successfully",
            "url"       => $user->isAdmin() ? "/admin/dashboard" : "/dashboard"
        ], 202);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RegisterRequest $request, AuthService $authService)
    {
        $request->validated();

        $authService->store($request);

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

        return response()->json("Logged out successfully", 202);
    }
}
