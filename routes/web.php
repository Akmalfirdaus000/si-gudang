<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Gudang\DashboardController as GudangDashboard;
use App\Http\Controllers\Pemilik\DashboardController as PemilikDashboard;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

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

    Route::get('gudang/dashboard', [GudangDashboard::class, 'index'])->name('gudang.dashboard');
    Route::get('pemilik/dashboard', [PemilikDashboard::class, 'index'])->name('pemilik.dashboard');

    // Gudang - Pembelian
    Route::resource('gudang/pembelian', \App\Http\Controllers\Gudang\PembelianController::class)
        ->names([
            'index' => 'gudang.pembelian.index',
            'create' => 'gudang.pembelian.create',
            'store' => 'gudang.pembelian.store',
            'show' => 'gudang.pembelian.show',
            'edit' => 'gudang.pembelian.edit',
            'update' => 'gudang.pembelian.update',
            'destroy' => 'gudang.pembelian.destroy',
        ]);

    // Gudang - Supplier
    Route::resource('gudang/supplier', \App\Http\Controllers\Gudang\SupplierController::class)
        ->names([
            'index' => 'gudang.supplier.index',
            'store' => 'gudang.supplier.store',
        ]);

    // Gudang - Penjualan
    Route::resource('gudang/penjualan', \App\Http\Controllers\Gudang\PenjualanController::class)
        ->names([
            'index' => 'gudang.penjualan.index',
            'create' => 'gudang.penjualan.create',
            'store' => 'gudang.penjualan.store',
            'show' => 'gudang.penjualan.show',
            'destroy' => 'gudang.penjualan.destroy',
        ]);

    // Gudang - Pelanggan
    Route::resource('gudang/pelanggan', \App\Http\Controllers\Gudang\PelangganController::class)
        ->names([
            'index' => 'gudang.pelanggan.index',
            'store' => 'gudang.pelanggan.store',
        ]);

    // Gudang - Stok
    Route::resource('gudang/stok', \App\Http\Controllers\Gudang\StokController::class)
        ->names([
            'index' => 'gudang.stok.index',
            'update' => 'gudang.stok.update',
        ]);

    // Gudang - Barang & Grade
    Route::resource('gudang/kualitas-barang', \App\Http\Controllers\Gudang\KualitasBarangController::class)
        ->names([
            'index' => 'gudang.barang.index',
            'store' => 'gudang.barang.store',
            'update' => 'gudang.barang.update',
            'destroy' => 'gudang.barang.destroy',
        ]);

    // Gudang - Log Stok
    Route::get('gudang/log-stok', [\App\Http\Controllers\Gudang\LogStokController::class, 'index'])
        ->name('gudang.log-stok.index');
});

require __DIR__.'/settings.php';
