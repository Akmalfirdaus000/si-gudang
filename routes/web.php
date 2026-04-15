<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $role = auth()->user()->role;
        if ($role === 'admin_gudang') {
            return redirect()->route('gudang.dashboard');
        }
        if ($role === 'pemilik') {
            return redirect()->route('pemilik.dashboard');
        }
        return redirect('/');
    })->name('dashboard');

    Route::inertia('gudang/dashboard', 'gudang/dashboard')->name('gudang.dashboard');
    Route::inertia('pemilik/dashboard', 'pemilik/dashboard')->name('pemilik.dashboard');
});

require __DIR__.'/settings.php';
