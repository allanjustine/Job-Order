<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleName;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $per_page = request('perPage') ?: 10;

        $sort = request('sort') ?: ["column" => "id", "direction" => "desc"];

        $search = request('search') ?: '';

        $customers = User::with('branch:id,branch_name,branch_code', 'roles:id,name')
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
            "data"  => $customers
        ]);

        return response()->json(await($data), 200);
    }

    public function userSelectionOptions()
    {
        $type = request('type', null);

        $users = User::where(
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
            ->get(['id', 'name', 'code']);

        return response()->json([
            'message' => 'User selection options retrieved successfully.',
            'data'    => $users->makeHidden(['roles', 'is_admin', 'redirect_url']),
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
        //
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
    public function destroy(string $id)
    {
        //
    }
}
