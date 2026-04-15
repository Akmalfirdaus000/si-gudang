<?php

namespace App\Http\Controllers\Gudang;

use App\Http\Controllers\Controller;
use App\Models\Stok;
use App\Models\KualitasBarang;
use App\Models\LogStok;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StokController extends Controller
{
    /**
     * Display a listing of the stocks.
     */
    public function index()
    {
        $stokData = KualitasBarang::with('stok')->get()->map(function ($item) {
            $stokCount = $item->stok->jumlah_stok ?? 0;
            
            // Logika Status yang sama dengan Dashboard
            if ($stokCount == 0) {
                $status = 'Habis';
                $color = 'bg-red-100 text-red-800';
            } elseif ($stokCount <= 10) {
                $status = 'Menipis';
                $color = 'bg-yellow-100 text-yellow-800';
            } else {
                $status = 'Tersedia';
                $color = 'bg-green-100 text-green-800';
            }

            return [
                'id_kualitas' => $item->id_kualitas,
                'kode' => $item->kode_kualitas,
                'nama' => $item->nama_kualitas,
                'harga_default' => $item->harga_default,
                'jumlah_stok' => $stokCount,
                'status' => $status,
                'color' => $color,
            ];
        });

        return Inertia::render('gudang/stok/index', [
            'stok' => $stokData
        ]);
    }

    /**
     * Update the stock amount (Stock Opname / Penyesuaian).
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'jumlah_baru' => 'required|numeric|min:0',
            'keterangan' => 'required|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            $stok = Stok::where('id_kualitas', $id)->first();
            if (!$stok) {
                $stok = Stok::create([
                    'id_kualitas' => $id,
                    'jumlah_stok' => 0
                ]);
            }

            $stokLama = $stok->jumlah_stok;
            $stokBaru = $request->jumlah_baru;
            $perubahan = abs($stokBaru - $stokLama);
            $tipe = $stokBaru >= $stokLama ? 'masuk' : 'keluar';

            // Update stok
            $stok->jumlah_stok = $request->jumlah_baru;
            $stok->save();

            // Catat Log Stok sebagai Penyesuaian
            LogStok::create([
                'id_kualitas' => $id,
                'id_user' => auth()->id(),
                'tipe_perubahan' => 'penyesuaian',
                'jumlah' => $request->jumlah_baru,
                'keterangan' => $request->keterangan ?? 'Stock Opname (Penyesuaian Manual)',
            ]);

            DB::commit();
            return redirect()->back()->with('success', 'Stok berhasil diperbarui melalui penyesuaian manual.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui stok: ' . $e->getMessage()]);
        }
    }
}
