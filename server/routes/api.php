<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\JobOrderController;

Route::middleware('auth:sanctum')->group(
    fn() =>
    [
        Route::get('/user', fn(Request $request) => $request->user()),

        // ADMIN ROLE ROUTES
        Route::middleware('role:admin')->group(fn() => [
            Route::controller(JobOrderController::class)->group(fn() => [
                Route::get('/job-orders', 'index'),
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
