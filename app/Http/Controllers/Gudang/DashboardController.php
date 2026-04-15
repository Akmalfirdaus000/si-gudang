<?php

namespace App\Http\Controllers\Gudang;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

use App\Models\Stok;
use App\Models\Pembelian;
use App\Models\Penjualan;
use App\Models\Supplier;
use App\Models\Pelanggan;
use App\Models\KualitasBarang;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DashboardController extends Controller
{
    /**
     * Display the warehouse dashboard.
     */
    public function index()
    {
        $now = Carbon::now();

        $stats = [
            'total_stok' => Stok::sum('jumlah_stok') . ' Kg',
            'pembelian' => Pembelian::whereMonth('tanggal', $now->month)->sum('total_pembelian'),
            'penjualan' => Penjualan::whereMonth('tanggal', $now->month)->sum('total_penjualan'),
            'total_mitra' => Supplier::count() + Pelanggan::count(),
        ];

        $stokData = KualitasBarang::with('stok')->get()->map(function ($item) {
            $stok = $item->stok->jumlah_stok ?? 0;
            
            if ($stok == 0) {
                $status = 'Habis';
                $color = 'bg-red-100 text-red-800';
            } elseif ($stok <= 10) {
                $status = 'Menipis';
                $color = 'bg-yellow-100 text-yellow-800';
            } else {
                $status = 'Tersedia';
                $color = 'bg-green-100 text-green-800';
            }

            return [
                'kode' => $item->kode_kualitas,
                'nama' => $item->nama_kualitas,
                'stok' => $stok . ' Kg',
                'status' => $status,
                'color' => $color,
            ];
        });

        // Gabungkan transaksi terbaru
        $recentPurchases = Pembelian::with('supplier')->latest('tanggal')->limit(5)->get()->map(function ($p) {
            return [
                'id' => '#BY-' . str_pad($p->id_pembelian, 3, '0', STR_PAD_LEFT),
                'tipe' => 'Pembelian',
                'pihak' => $p->supplier->nama_supplier ?? 'Umum',
                'total' => 'Rp ' . number_format($p->total_pembelian, 0, ',', '.'),
                'tanggal' => Carbon::parse($p->tanggal)->format('d M Y'),
                'raw_date' => $p->tanggal,
            ];
        });

        $recentSales = Penjualan::with('pelanggan')->latest('tanggal')->limit(5)->get()->map(function ($s) {
            return [
                'id' => '#SL-' . str_pad($s->id_penjualan, 3, '0', STR_PAD_LEFT),
                'tipe' => 'Penjualan',
                'pihak' => $s->pelanggan->nama_pelanggan ?? 'Umum',
                'total' => 'Rp ' . number_format($s->total_penjualan, 0, ',', '.'),
                'tanggal' => Carbon::parse($s->tanggal)->format('d M Y'),
                'raw_date' => $s->tanggal,
            ];
        });

        $recentTransactions = collect($recentPurchases)
            ->merge($recentSales)
            ->sortByDesc('raw_date')
            ->values()
            ->take(5);

        return Inertia::render('gudang/dashboard', [
            'stats' => $stats,
            'stokData' => $stokData,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
