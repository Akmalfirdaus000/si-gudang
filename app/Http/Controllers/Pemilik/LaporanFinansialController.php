<?php

namespace App\Http\Controllers\Pemilik;

use App\Http\Controllers\Controller;
use App\Models\Pembelian;
use App\Models\Penjualan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class LaporanFinansialController extends Controller
{
    public function index(Request $request)
    {
        $data = $this->getReportData($request);

        return Inertia::render('pemilik/laporan/finansial', $data);
    }

    public function exportHtml(Request $request)
    {
        $data = $this->getReportData($request);

        $html = view('laporan.finansial-html', [
            'startDate' => $data['filters']['start_date'],
            'endDate' => $data['filters']['end_date'],
            'summary' => $data['summary'],
            'transactions' => $data['transactions']
        ])->render();

        return response($html)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', 'attachment; filename="Laporan-Finansial-'.($data['filters']['start_date']).'-to-'.($data['filters']['end_date']).'.html"');
    }

    private function getReportData(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());

        // 1. Summary Totals
        $totalPenjualan = Penjualan::whereBetween('tanggal', [$startDate, $endDate])->sum('total_penjualan');
        $totalPembelian = Pembelian::whereBetween('tanggal', [$startDate, $endDate])->sum('total_pembelian');
        $labaKotor = $totalPenjualan - $totalPembelian;

        // 2. Chart Data (Daily combined)
        $chartData = $this->getChartData($startDate, $endDate);

        // 3. Combined Recent Transactions Table
        $penjualanRaw = Penjualan::with('pelanggan')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'PJN-' . $item->id_penjualan,
                    'tanggal' => $item->tanggal,
                    'tipe' => 'Penjualan',
                    'entitas' => $item->pelanggan->nama_pelanggan ?? '-',
                    'total' => (float)$item->total_penjualan,
                    'keterangan' => $item->keterangan,
                ];
            });

        $pembelianRaw = Pembelian::with('supplier')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'PBL-' . $item->id_pembelian,
                    'tanggal' => $item->tanggal,
                    'tipe' => 'Pembelian',
                    'entitas' => $item->supplier->nama_supplier ?? '-',
                    'total' => (float)$item->total_pembelian,
                    'keterangan' => $item->keterangan,
                ];
            });

        $transactions = $penjualanRaw->concat($pembelianRaw)
            ->sortByDesc('tanggal')
            ->values();

        return [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'summary' => [
                'total_penjualan' => (float)$totalPenjualan,
                'total_pembelian' => (float)$totalPembelian,
                'laba_kotor' => (float)$labaKotor,
            ],
            'chartData' => $chartData,
            'transactions' => $transactions,
        ];
    }

    private function getChartData($start, $end)
    {
        $p = Carbon::parse($start);
        $e = Carbon::parse($end);
        $data = [];

        while ($p <= $e) {
            $dateStr = $p->toDateString();
            
            $sales = Penjualan::whereDate('tanggal', $dateStr)->sum('total_penjualan');
            $purchases = Pembelian::whereDate('tanggal', $dateStr)->sum('total_pembelian');

            $data[] = [
                'date' => $p->isoFormat('DD MMM'),
                'penjualan' => (float)$sales,
                'pembelian' => (float)$purchases,
            ];

            $p->addDay();
        }

        return $data;
    }
}
