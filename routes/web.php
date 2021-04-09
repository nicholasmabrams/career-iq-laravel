<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function (Request $request) {
    if (auth('sanctum')->check())
    {
        return redirect('dashboard');
    }

    return redirect('/login');
});

Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');
