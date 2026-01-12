<?php

use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminJobOrderController;
use App\Http\Controllers\Api\Admin\AreaManagerController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\Admin\CustomersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\JobOrderController;
use App\Http\Controllers\Api\Admin\MechanicController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\TargetIncomeController;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\UserDashboardController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles:id,name', 'branch:id,branch_name,branch_code');
    });

    // ADMIN ROLE ROUTES
    Route::middleware('role:admin')->group(function () {
        Route::controller(CustomersController::class)->group(function () {
            Route::get('/customers', 'index');
        });
        Route::controller(UsersController::class)->group(function () {
            Route::get('/users', 'index');
            Route::get('user-selection-options', 'userSelectionOptions');
        });
        Route::resource('target-incomes', TargetIncomeController::class);
        Route::resource('area-managers', AreaManagerController::class);
        Route::get('area-manager-selection-options', [AreaManagerController::class, 'areaManagerSelectionOptions']);
        Route::get('admin-stats', [AdminDashboardController::class, 'index']);
        Route::get('admin-job-orders', [AdminJobOrderController::class, 'index']);
        Route::get('reports', [ReportController::class, 'index']);
        Route::get('export-reports', [ReportController::class, 'exportData']);
    });

    // EMPLOYEE ROLE ROUTES
    Route::middleware('role:employee')->group(function () {
        Route::controller(JobOrderController::class)->group(function () {
            Route::get('/job-orders', 'index');
        });
        Route::controller(JobOrderController::class)->group(function () {
            Route::post('/create-job-order', 'store');
        });
        Route::get('branch-mechanics', [MechanicController::class, 'branchMechanic']);
        Route::get('branch-stats', [UserDashboardController::class, 'index']);
    });

    // GLOBAL AUTHENTICATED ROUTES
    Route::controller(AuthController::class)->group(function () {
        Route::post('/logout', 'destroy');
    });
    Route::resource('mechanics', MechanicController::class);
});

// PUBLIC ROUTES
Route::controller(BranchController::class)->group(function () {
    Route::get('/branches', 'index');
});

Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'store');
    Route::post('/login', 'login');
});

Route::get('/toks/{any}', function () {
    $test2 = "0000242";
    $test = sprintf('%07d', $test2);
    return response()->json([
        'message' => $test
    ], 200);
});
