<?php

use App\Http\Controllers\Api\Admin\ActivityLogController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminJobOrderController;
use App\Http\Controllers\Api\Admin\AreaManagerController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\Admin\CustomersController;
use App\Http\Controllers\Api\Admin\ManageJobOrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\JobOrderController;
use App\Http\Controllers\Api\Admin\MechanicController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\RoleAndPermissionController;
use App\Http\Controllers\Api\Admin\TargetIncomeController;
use App\Http\Controllers\Api\Admin\TicketBrandController;
use App\Http\Controllers\Api\Admin\TicketCategoryController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\UserDashboardController;
use App\Models\JobOrder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', function (Request $request) {
        return $request->user()->load([
            'roles:id,name',
            'branch:id,branch_name,branch_code',
        ]);
    });

    // ADMIN ROLE ROUTES
    Route::middleware('role:admin')->group(function () {
        Route::controller(CustomersController::class)->group(function () {
            Route::get('customers', 'index');
        });
        Route::controller(UsersController::class)->group(function () {
            Route::get('users', 'index');
            Route::patch('users/{user}/update', 'lockUpdate');
            Route::patch('users/{user}/update-details', 'update');
            Route::post('users', 'store');
            Route::delete('users/{user}/delete', 'destroy');
            Route::post('lock-all-user-date-pickers', 'lockAllUserDatePickers');
        });
        Route::controller(RoleAndPermissionController::class)->group(function () {
            Route::get('get-all-roles', 'getAllRoles');
            Route::get('role-and-permissions', 'index');
            Route::post('role-and-permissions', 'store');
            Route::patch('role-and-permissions/{id}/update', 'update');
            Route::delete('role-and-permissions/{role}/roles', 'destroyRole');
            Route::delete('role-and-permissions/{permission}/permissions', 'destroyPermission');
        });
        Route::resource('target-incomes', TargetIncomeController::class);
        Route::resource('area-managers', AreaManagerController::class);
        Route::apiResource('ticket-categories', TicketCategoryController::class);
        Route::apiResource('ticket-brands', TicketBrandController::class);
        Route::post('target-incomes/sync-with-last-month', [TargetIncomeController::class, 'syncWithLastMonth']);
        Route::get('admin-stats', [AdminDashboardController::class, 'index']);
        Route::get('admin-job-orders', [AdminJobOrderController::class, 'index']);
        Route::get('activity-logs', [ActivityLogController::class, 'index']);
    });

    // ADMIN | AUDIT | ACCOUNTING ROLE ROUTES
    Route::middleware('role:admin|audit|accounting')->group(function () {
        Route::controller(ReportController::class)->group(function () {
            Route::get('reports', 'index');
            Route::get('export-reports', 'exportData');
            Route::get('show-jo/{job_order}/browse', 'show');
            Route::get('prev-next/{job_order}/stats', 'prevNextJobOrderStats');
        });
        Route::get('user-selection-options', [UsersController::class, 'userSelectionOptions']);
        Route::get('area-manager-selection-options', [AreaManagerController::class, 'areaManagerSelectionOptions']);
    });

    // ADMIN | ACCOUNTING ROLE ROUTES
    Route::middleware('role:admin|accounting')->group(function () {
        Route::controller(JobOrderController::class)->group(function () {
            Route::patch('update-job-order/{job_order}/update', 'update');
            Route::delete('cancel-job-order/{id}', 'cancel');
            Route::delete('delete-job-order/{id}', 'destroy');
        });
        Route::controller(ManageJobOrderDetail::class)->group(function () {
            Route::post('manage-job-order-detail/store', 'store');
            Route::delete('manage-job-order-detail/{job_order_detail}/delete', 'destroy');
        });
        Route::controller(TicketController::class)->group(function () {
            Route::patch('/tickets/{ticket}/{title}', 'updateTicketStatus');
            Route::patch('/tickets/add-note/{ticket}/add-note', 'addNoteToTicket');
            Route::delete('/notes/{note}/delete', 'deleteNote');
            Route::patch('/notes/{note}/update', 'updateTicketNoteContent');
            Route::patch('/tickets/rejected-reason/{ticket}/update-rejected-reason', 'updateTicketRejectedReason');
        });
    });

    // EMPLOYEE ROLE ROUTES
    Route::middleware('role:employee')->group(function () {
        Route::controller(JobOrderController::class)->group(function () {
            Route::get('job-orders', 'index');
            Route::get('job-orders/{job_order}/browse', 'show')->withoutMiddleware('role:employee');
            Route::get('export-branch-reports', 'exportBranchData');
            Route::post('verifying-job-order', 'verifyingJobOrder');
            Route::post('add-receipt/{job_order}', 'addReceipt');
            Route::post('create-job-order', 'store');
        });
        Route::get('branch-mechanics', [MechanicController::class, 'branchMechanic']);
        Route::get('branch-stats', [UserDashboardController::class, 'index']);
        Route::get('get-job-order-number', function () {
            $user = Auth::user();

            $last_job_order_number = $user->jobOrders()->max('job_order_number') ?? 0;

            $job_order_number = sprintf('%07d', $last_job_order_number + 1);

            do {
                $generated_code = "JO-" . Str::upper(Str::random(15));
            } while (JobOrder::query()->where('transaction_code', "{$generated_code}")->exists());

            return response()->json([
                'job_order_number' => $job_order_number,
                'transaction_code' => $generated_code,
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
    });

    // GLOBAL AUTHENTICATED ROUTES
    Route::controller(AuthController::class)->group(function () {
        Route::post('logout', 'destroy');
    });
    Route::controller(TicketController::class)->group(function () {
        Route::get('ticket-categories-and-brands', 'getAllTicketCategoriesAndBrands');
        Route::delete('/tickets/{ticket}/delete', 'destroy');
    });
    Route::resource('mechanics', MechanicController::class);
    Route::resource('tickets', TicketController::class);
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
