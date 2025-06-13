<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\JobOrderController;

Route::middleware('auth:sanctum')->group(
    fn() =>
    [
        Route::get('/user', fn(Request $request) => $request->user()),
        // Route::controller(JobOrderController::class)->group(fn() => [
        //     Route::post('/create-job-order', 'store'),
        //     Route::get('/job-orders', 'index'),
        // ])
    ]
);

Route::controller(JobOrderController::class)->group(fn() => [
    Route::post('/create-job-order', 'store'),
    Route::get('/job-orders', 'index'),
]);
