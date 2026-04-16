<?php

namespace App\Http\Controllers\Pemilik;

use App\Http\Controllers\Controller;
use App\Models\KualitasBarang;
use App\Models\LogStok;
use App\Models\Stok;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MonitoringStokController extends Controller
{
    /**
     * Display a listing of the stocks for monitoring.
     */
    public function index()
    {
        // 1. Current Stock Data with Status
        $stocks = KualitasBarang::with('stok')->get()->map(function ($item) {
            $stokCount = $item->stok->jumlah_stok ?? 0;
            $stokMin = $item->stok->stok_minimum ?? 10;
            
            if ($stokCount == 0) {
                $status = 'Habis';
                $color = 'text-red-600 bg-red-50 dark:bg-red-900/20';
            } elseif ($stokCount <= $stokMin) {
                $status = 'Menipis';
                $color = 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
            } else {
                $status = 'Tersedia';
                $color = 'text-green-600 bg-green-50 dark:bg-green-900/20';
            }

            return [
                'id_kualitas' => $item->id_kualitas,
                'kode' => $item->kode_kualitas,
                'nama' => $item->nama_kualitas,
                'jumlah' => (float)$stokCount,
                'minimum' => (float)$stokMin,
                'status' => $status,
                'color' => $color,
            ];
        });

        // 2. Recent Movement Logs (Last 20)
        $logs = LogStok::with(['kualitas', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id_log,
                    'tanggal' => $log->created_at->isoFormat('DD MMM YYYY, HH:mm'),
                    'grade' => $log->kualitas->nama_kualitas ?? 'Unknown',
                    'tipe' => $log->tipe_perubahan,
                    'jumlah' => $log->jumlah,
                    'keterangan' => $log->keterangan,
                    'user' => $log->user->name ?? 'System',
                ];
            });

        // 3. Stats Summary
        $stats = [
            'total_kg' => $stocks->sum('jumlah'),
            'total_items' => $stocks->count(),
            'low_stock_count' => $stocks->whereIn('status', ['Habis', 'Menipis'])->count(),
        ];

        return Inertia::render('pemilik/monitoring/stok', [
            'stocks' => $stocks,
            'logs' => $logs,
            'stats' => $stats,
        ]);
    }
}
