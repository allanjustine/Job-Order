<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UsersController extends Controller
{
    public function __construct(public UserService $userService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = $this->userService->getAllUsers();

        return response()->json($users, 200);
    }

    public function userSelectionOptions()
    {
        $users = $this->userService->getSelectionOptions();

        return response()->json([
            'message' => 'User selection options retrieved successfully.',
            'data'    => $users->makeHidden([
                'roles',
                'is_admin',
                'is_audit',
                'is_accounting',
                'is_employee',
                'redirect_url'
            ]),
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
    public function store(StoreUserRequest $storeUserRequest)
    {
        $storeUserRequest->validated();

        $user = $this->userService->storeUser($storeUserRequest);

        return response()->json([
            'message' => 'User created successfully.',
            'data'    => $user,
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
    public function update(UpdateUserRequest $updateUserRequest, User $user)
    {
        $data = $this->userService->updateUser($updateUserRequest, $user);

        return response()->json([
            'message' => "User from \"{$data['old_data']}\" to \"{$data['new_data']}\" updated successfully."
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */

    public function lockUpdate(User $user)
    {
        $user->update([
            "is_locked_date" => !$user->is_locked_date
        ]);

        $status = $user->is_locked_date ? "locked" : "unlocked";

        activity()
            ->causedBy(Auth::user())
            ->performedOn($user)
            ->log("Updated date picker status to {$status}");

        return response()->json([
            'message' => "User date picker is now {$status} successfully."
        ], 200);
    }

    public function destroy(User $user)
    {
        $this->userService->deleteUser($user);

        return response()->json([
            'message' => "User {$user->name} deleted successfully."
        ], 200);
    }

    public function lockAllUserDatePickers()
    {
        $lock_status = request('lock_status', false);

        $users = User::query()
            ->where('is_locked_date', $lock_status);

        $to_message = $users->count() . ' ' . Str::plural('user', $users->count());

        $users->update([
            'is_locked_date' => !$lock_status
        ]);

        $message = $lock_status ? 'locked' : 'unlocked';

        activity()
            ->causedBy(Auth::user())
            ->log("Successfully {$message} to {$to_message} date pickers.");

        return response()->json([
            'message' => "Successfully {$message} date pickers to {$to_message}"
        ], 200);
    }
}
