<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminJobOrderService;
use Illuminate\Http\Request;

class AdminJobOrderController extends Controller
{
    public function index(AdminJobOrderService $adminJobOrder)
    {
        $jobOrders = $adminJobOrder->getAllJobOrders();

        return response()->json([
            'message' => 'JobOrders retrieved successfully.',
            'data'    => $jobOrders,
        ], 200);
    }
}
