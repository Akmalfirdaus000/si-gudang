<?php

namespace App\Http\Controllers\Gudang;

use App\Http\Controllers\Controller;
use App\Models\Pembelian;
use App\Models\DetailPembelian;
use App\Models\Stok;
use App\Models\LogStok;
use App\Models\Supplier;
use App\Models\KualitasBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class PembelianController extends Controller
{
    /**
     * Display a listing of the purchases.
     */
    public function index()
    {
        $pembelian = Pembelian::with(['supplier', 'user'])
            ->latest('tanggal')
            ->paginate(10);

        return Inertia::render('gudang/pembelian/index', [
            'pembelian' => $pembelian
        ]);
    }

    /**
     * Show the form for creating a new purchase.
     */
    public function create()
    {
        return Inertia::render('gudang/pembelian/create', [
            'suppliers' => Supplier::all(),
            'kualitas' => KualitasBarang::all(),
        ]);
    }

    /**
     * Store a newly created purchase in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_supplier' => 'required|exists:supplier,id_supplier',
            'tanggal' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.id_kualitas' => 'required|exists:kualitas_barang,id_kualitas',
            'items.*.jumlah' => 'required|numeric|min:0.1',
            'items.*.harga' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // 1. Simpan Pembelian
            $totalHarga = collect($request->items)->sum(function ($item) {
                return $item['jumlah'] * $item['harga'];
            });

            $pembelian = Pembelian::create([
                'id_supplier' => $request->id_supplier,
                'id_user' => auth()->id(),
                'tanggal' => $request->tanggal,
                'total_pembelian' => $totalHarga,
                'keterangan' => $request->keterangan,
            ]);

            foreach ($request->items as $item) {
                $subtotal = $item['jumlah'] * $item['harga'];

                // 2. Simpan Detail
                DetailPembelian::create([
                    'id_pembelian' => $pembelian->id_pembelian,
                    'id_kualitas' => $item['id_kualitas'],
                    'jumlah' => $item['jumlah'],
                    'harga' => $item['harga'],
                    'subtotal' => $subtotal,
                ]);

                // 3. Update Stok
                $stok = Stok::where('id_kualitas', $item['id_kualitas'])->first();
                if (!$stok) {
                    $stok = Stok::create([
                        'id_kualitas' => $item['id_kualitas'],
                        'jumlah_stok' => 0,
                        'stok_minimum' => 10,
                        'last_update' => now(),
                    ]);
                }

                $stok->increment('jumlah_stok', $item['jumlah']);
                $stok->update(['last_update' => now()]);

                // 4. Catat Log Stok
                LogStok::create([
                    'id_kualitas' => $item['id_kualitas'],
                    'id_user' => auth()->id(),
                    'tipe_perubahan' => 'masuk',
                    'jumlah' => $item['jumlah'],
                    'keterangan' => 'Pembelian dari supplier: ' . ($supplier->nama_supplier ?? 'N/A'),
                ]);
            }

            DB::commit();
            return redirect()->route('gudang.pembelian.index')->with('success', 'Pembelian berhasil dicatat.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified purchase.
     */
    public function show($id)
    {
        $pembelian = Pembelian::with(['supplier', 'user', 'details.kualitasBarang'])
            ->findOrFail($id);

        return Inertia::render('gudang/pembelian/show', [
            'pembelian' => $pembelian
        ]);
    }

    /**
     * Remove the specified purchase from storage.
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $pembelian = Pembelian::with('details')->findOrFail($id);

            foreach ($pembelian->details as $detail) {
                // Revert Stok
                $stok = Stok::where('id_kualitas', $detail->id_kualitas)->first();
                if ($stok) {
                    $stok->decrement('jumlah_stok', $detail->jumlah);
                    $stok->update(['last_update' => now()]);
                }

                // Catat Log
                LogStok::create([
                    'id_kualitas' => $detail->id_kualitas,
                    'id_user' => auth()->id(),
                    'tipe_perubahan' => 'keluar',
                    'jumlah' => $detail->jumlah,
                    'keterangan' => 'Pembatalan Pembelian #' . $pembelian->id_pembelian,
                ]);
            }

            $pembelian->delete(); // Ini otomatis menghapus detail jika onDelete cascade diset di migrasi

            DB::commit();
            return redirect()->route('gudang.pembelian.index')->with('success', 'Transaksi pembelian berhasil dihapus dan stok dikembalikan.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menghapus transaksi: ' . $e->getMessage());
        }
    }
}
