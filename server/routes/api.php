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
use App\Http\Controllers\Api\UserDashboardController;
use App\Models\JobOrder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', function (Request $request) {
        return $request->user()->load('roles:id,name', 'branch:id,branch_name,branch_code');
    });

    // ADMIN ROLE ROUTES
    Route::middleware('role:admin')->group(function () {
        Route::controller(CustomersController::class)->group(function () {
            Route::get('customers', 'index');
        });
        Route::controller(UsersController::class)->group(function () {
            Route::get('users', 'index');
            Route::get('user-selection-options', 'userSelectionOptions');
            Route::patch('users/{user}/update', 'update');
        });
        Route::resource('target-incomes', TargetIncomeController::class);
        Route::post('target-incomes/sync-with-last-month', [TargetIncomeController::class, 'syncWithLastMonth']);
        Route::resource('area-managers', AreaManagerController::class);
        Route::get('area-manager-selection-options', [AreaManagerController::class, 'areaManagerSelectionOptions']);
        Route::get('admin-stats', [AdminDashboardController::class, 'index']);
        Route::get('admin-job-orders', [AdminJobOrderController::class, 'index']);
        Route::get('reports', [ReportController::class, 'index']);
        Route::get('export-reports', [ReportController::class, 'exportData']);
        Route::delete('delete-job-order/{id}', [JobOrderController::class, 'destroy']);
        Route::post('lock-all-user-date-pickers', [UsersController::class, 'lockAllUserDatePickers']);
    });

    // EMPLOYEE ROLE ROUTES
    Route::middleware('role:employee')->group(function () {
        Route::controller(JobOrderController::class)->group(function () {
            Route::get('job-orders', 'index');
            Route::get('job-orders/{job_order}/browse', 'show')->withoutMiddleware('role:employee');
            Route::get('export-branch-reports', [JobOrderController::class, 'exportBranchData']);
        });
        Route::controller(JobOrderController::class)->group(function () {
            Route::post('create-job-order', 'store');
        });
        Route::get('branch-mechanics', [MechanicController::class, 'branchMechanic']);
        Route::get('branch-stats', [UserDashboardController::class, 'index']);
        Route::get('get-job-order-number', function () {
            $user = Auth::user();

            $lastJobOrderNumber = $user->jobOrders()->max('job_order_number') ?? 0;

            Cache::forget('jo_transaction_code');

            $jobOrderNumber = sprintf('%07d', $lastJobOrderNumber + 1);

            do {
                $generated_code = "JO-" . Str::upper(Str::random(15));
            } while (JobOrder::query()->where('transaction_code', "{$generated_code}")->exists());

            Cache::put('jo_transaction_code', $generated_code, now()->addMinutes(30));

            return response()->json([
                'job_order_number' => $jobOrderNumber,
                'transaction_code' => $generated_code
            ], 200);
        });
        Route::get('mechanic-checking', function (Request $request) {
            $has_mechanic = $request->user()->mechanics();
            $word_pluralize = Str::plural('mechanic', $has_mechanic->count());

            return response()->json([
                "message"      => "{$has_mechanic->count()} {$word_pluralize} found. You can now create a job order.",
                "has_mechanic" => $has_mechanic->exists()
            ], 200);
        });
        Route::post('verifying-job-order', [JobOrderController::class, 'verifyingJobOrder']);
    });

    // GLOBAL AUTHENTICATED ROUTES
    Route::controller(AuthController::class)->group(function () {
        Route::post('logout', 'destroy');
    });
    Route::resource('mechanics', MechanicController::class);
});

// PUBLIC ROUTES
Route::controller(BranchController::class)->group(function () {
    Route::get('branches', 'index');
});
Route::controller(AuthController::class)->group(function () {
    Route::post('register', 'store');
    Route::post('login', 'login');
});
Route::get('toks/{any}', function () {
    $test2 = "0000242";
    $test = sprintf('%07d', $test2);
    return response()->json([
        'message' => $test
    ], 200);
});
Route::post('job-order/search', [JobOrderController::class, 'search'])->middleware('throttle:50,1');