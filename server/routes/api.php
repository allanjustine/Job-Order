<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\JobOrderController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/create-job-order', [JobOrderController::class, 'store']);
Route::get('/job-orders', [JobOrderController::class, 'index']);
