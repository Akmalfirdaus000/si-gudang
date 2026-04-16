<?php

namespace App\Http\Controllers\Pemilik;

use App\Http\Controllers\Controller;
use App\Models\Pembelian;
use App\Models\Penjualan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiwayatTransaksiController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(60)->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());
        $type = $request->input('type', 'all'); // all, pembelian, penjualan
        $search = $request->input('search');

        $penjualan = [];
        $pembelian = [];

        if ($type === 'all' || $type === 'penjualan') {
            $queryPenjualan = Penjualan::with(['pelanggan', 'details.kualitas'])
                ->whereBetween('tanggal', [$startDate, $endDate]);
            
            if ($search) {
                $queryPenjualan->where(function($q) use ($search) {
                    $q->where('id_penjualan', 'like', "%$search%")
                      ->orWhereHas('pelanggan', function($sub) use ($search) {
                          $sub->where('nama_pelanggan', 'like', "%$search%");
                      });
                });
            }
            
            $penjualan = $queryPenjualan->get()->map(function($item) {
                return [
                    'id' => 'PJN-' . $item->id_penjualan,
                    'db_id' => $item->id_penjualan,
                    'tanggal' => $item->tanggal,
                    'tipe' => 'Penjualan',
                    'entitas' => $item->pelanggan->nama_pelanggan ?? 'Umum',
                    'total' => (float)$item->total_penjualan,
                    'keterangan' => $item->keterangan,
                    'items' => $item->details->map(function($d) {
                        return [
                            'nama' => $d->kualitas->nama_kualitas ?? 'N/A',
                            'jumlah' => $d->jumlah,
                            'harga' => $d->harga,
                            'subtotal' => $d->subtotal,
                        ];
                    })
                ];
            });
        }

        if ($type === 'all' || $type === 'pembelian') {
            $queryPembelian = Pembelian::with(['supplier', 'details.kualitasBarang'])
                ->whereBetween('tanggal', [$startDate, $endDate]);

            if ($search) {
                $queryPembelian->where(function($q) use ($search) {
                    $q->where('id_pembelian', 'like', "%$search%")
                      ->orWhereHas('supplier', function($sub) use ($search) {
                          $sub->where('nama_supplier', 'like', "%$search%");
                      });
                });
            }

            $pembelian = $queryPembelian->get()->map(function($item) {
                return [
                    'id' => 'PBL-' . $item->id_pembelian,
                    'db_id' => $item->id_pembelian,
                    'tanggal' => $item->tanggal,
                    'tipe' => 'Pembelian',
                    'entitas' => $item->supplier->nama_supplier ?? 'N/A',
                    'total' => (float)$item->total_pembelian,
                    'keterangan' => $item->keterangan,
                    'items' => $item->details->map(function($d) {
                        return [
                            'nama' => $d->kualitasBarang->nama_kualitas ?? 'N/A',
                            'jumlah' => $d->jumlah,
                            'harga' => $d->harga,
                            'subtotal' => $d->subtotal,
                        ];
                    })
                ];
            });
        }

        $transactions = collect($penjualan)
            ->concat($pembelian)
            ->sortByDesc('tanggal')
            ->values();

        return Inertia::render('pemilik/laporan/transaksi', [
            'transactions' => $transactions,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'type' => $type,
                'search' => $search,
            ]
        ]);
    }
}
