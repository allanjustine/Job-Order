<?php

use App\Models\JobOrder;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

Route::view('/', 'welcome');
Route::get('generate-null-jo', function () {
    $jobOrders = JobOrder::query()->whereNull('transaction_code')->get();

    $jobOrders->each(function ($jobOrder) {
        do {
            $generated_code = "JO-" . Str::upper(Str::random(15));
        } while (JobOrder::query()->where('transaction_code', "JO-{$generated_code}")->exists());

        $jobOrder->update([
            'transaction_code' => $generated_code
        ]);
    });
});
