<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json('Welcome to mobile legends. Five seconds to reach the battle field! SMASH THEM!', 501);
});
