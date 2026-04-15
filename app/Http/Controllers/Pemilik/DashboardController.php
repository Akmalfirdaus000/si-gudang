<?php

namespace App\Http\Controllers\Pemilik;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

use App\Models\Stok;
use App\Models\Pembelian;
use App\Models\Penjualan;
use App\Models\KualitasBarang;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the owner dashboard.
     */
    public function index()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        
        $totalPenjualan = Penjualan::whereMonth('tanggal', $now->month)->sum('total_penjualan');
        $totalPembelian = Pembelian::whereMonth('tanggal', $now->month)->sum('total_pembelian');
        $labaKotor = $totalPenjualan - $totalPembelian;
        
        $financialStats = [
            [
                'title' => 'Total Penjualan',
                'value' => 'Rp ' . number_format($totalPenjualan, 0, ',', '.'),
                'change' => '+0%', 
                'trend' => 'up',
                'description' => 'Bulan ini'
            ],
            [
                'title' => 'Estimasi Laba Kotor',
                'value' => 'Rp ' . number_format($labaKotor, 0, ',', '.'),
                'change' => '+0%',
                'trend' => $labaKotor >= 0 ? 'up' : 'down',
                'description' => 'Bulan ini'
            ],
            [
                'title' => 'Total Pengeluaran',
                'value' => 'Rp ' . number_format($totalPembelian, 0, ',', '.'),
                'change' => '-0%',
                'trend' => 'down',
                'description' => 'Pembelian Stok'
            ],
            [
                'title' => 'Total Stok (Kg)',
                'value' => number_format(Stok::sum('jumlah_stok'), 0, ',', '.') . ' Kg',
                'change' => 'Tetap',
                'trend' => 'neutral',
                'description' => 'Total berat aset'
            ]
        ];

        // Data Penjualan Mingguan (7 hari terakhir)
        $salesData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $sum = Penjualan::whereDate('tanggal', $date->toDateString())->sum('total_penjualan');
            
            $salesData[] = [
                'day' => $date->isoFormat('ddd'),
                'raw_value' => (float)$sum,
                'value' => (float)$sum 
            ];
        }

        // Scaling sales data untuk chart bar (0-100)
        $maxSales = collect($salesData)->max('raw_value') ?: 1;
        foreach ($salesData as &$data) {
            $data['value'] = ($data['raw_value'] / $maxSales) * 100;
        }

        return Inertia::render('pemilik/dashboard', [
            'financialStats' => $financialStats,
            'salesData' => $salesData,
        ]);
    }
}
