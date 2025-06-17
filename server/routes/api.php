<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\CustomersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\JobOrderController;
use App\Http\Controllers\Api\UsersController;

Route::middleware('auth:sanctum')->group(
    fn() =>
    [
        Route::get('/user', fn(Request $request) => $request->user()->load('roles:id,name', 'branch:id,branch_name,branch_code')),

        // ADMIN ROLE ROUTES
        Route::middleware('role:admin')->group(fn() => [
            Route::controller(JobOrderController::class)->group(fn() => [
                Route::get('/job-orders', 'index'),
            ]),
            Route::controller(CustomersController::class)->group(fn() => [
                Route::get('/customers', 'index')
            ]),
            Route::controller(UsersController::class)->group(fn() => [
                Route::get('/users', 'index')
            ])
        ]),

        // EMPLOYEE ROLE ROUTES
        Route::middleware('role:employee')->group(fn() => [
            Route::controller(JobOrderController::class)->group(fn() => [
                Route::post('/create-job-order', 'store')
            ])
        ]),


        // GLOBAL AUTHENTICATED ROUTES
        Route::controller(AuthController::class)->group(fn() => [
            Route::post('/logout', 'destroy'),
        ])
    ]
);

// PUBLIC ROUTES
Route::controller(BranchController::class)->group(
    fn() => [
        Route::get('/branches', 'index')
    ]
);
Route::controller(AuthController::class)->group(fn() => [
    Route::post('/register', 'store'),
    Route::post('/login', 'login'),
]);
