<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserDashboardService;
use Illuminate\Http\Request;

class UserDashboardController extends Controller
{
    public function index(UserDashboardService $dashboard)
    {
        $items = $dashboard->getUserDashboard();

        return response()->json([
            'message' => 'Dashboard data retrieved successfully.',
            'data'    => $items
        ], 200);
    }
}
