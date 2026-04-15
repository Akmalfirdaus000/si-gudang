<?php

namespace App\Http\Controllers\Gudang;

use App\Http\Controllers\Controller;
use App\Models\Penjualan;
use App\Models\DetailPenjualan;
use App\Models\Stok;
use App\Models\LogStok;
use App\Models\Pelanggan;
use App\Models\KualitasBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PenjualanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $penjualan = Penjualan::with(['pelanggan', 'user'])
            ->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('gudang/penjualan/index', [
            'penjualan' => $penjualan
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('gudang/penjualan/create', [
            'pelanggan' => Pelanggan::all(),
            'kualitas' => KualitasBarang::with('stok')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_pelanggan' => 'required|exists:pelanggan,id_pelanggan',
            'tanggal' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.id_kualitas' => 'required|exists:kualitas_barang,id_kualitas',
            'items.*.jumlah' => 'required|numeric|min:1',
            'items.*.harga' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $total_penjualan = 0;
            foreach ($request->items as $item) {
                $total_penjualan += $item['jumlah'] * $item['harga'];
                
                // Cek Stok tersedia
                $stok = Stok::where('id_kualitas', $item['id_kualitas'])->first();
                if (!$stok || $stok->jumlah_stok < $item['jumlah']) {
                    $kualitas = KualitasBarang::find($item['id_kualitas']);
                    throw new \Exception("Stok untuk kualitas {$kualitas->nama_kualitas} tidak mencukupi. (Sisa: " . ($stok->jumlah_stok ?? 0) . " Kg)");
                }
            }

            $penjualan = Penjualan::create([
                'id_pelanggan' => $request->id_pelanggan,
                'id_user' => auth()->id(),
                'tanggal' => $request->tanggal,
                'total_penjualan' => $total_penjualan,
                'keterangan' => $request->keterangan,
            ]);

            foreach ($request->items as $item) {
                $subtotal = $item['jumlah'] * $item['harga'];
                
                DetailPenjualan::create([
                    'id_penjualan' => $penjualan->id_penjualan,
                    'id_kualitas' => $item['id_kualitas'],
                    'jumlah' => $item['jumlah'],
                    'harga' => $item['harga'],
                    'subtotal' => $subtotal,
                ]);

                // Kurangi Stok
                $stok = Stok::where('id_kualitas', $item['id_kualitas'])->first();
                $stok->jumlah_stok -= $item['jumlah'];
                $stok->save();

                // Catat Log Stok
                LogStok::create([
                    'id_kualitas' => $item['id_kualitas'],
                    'id_user' => auth()->id(),
                    'tipe_perubahan' => 'keluar',
                    'jumlah' => $item['jumlah'],
                    'keterangan' => 'Penjualan ke pelanggan: ' . ($pelanggan->nama_pelanggan ?? 'N/A'),
                ]);
            }

            DB::commit();
            return redirect()->route('gudang.penjualan.index')->with('success', 'Transaksi penjualan berhasil disimpan.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $penjualan = Penjualan::with(['pelanggan', 'user', 'details.kualitas'])
            ->findOrFail($id);

        return Inertia::render('gudang/penjualan/show', [
            'penjualan' => $penjualan
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $penjualan = Penjualan::with('details')->findOrFail($id);

            foreach ($penjualan->details as $detail) {
                // Kembalikan Stok (Revert)
                $stok = Stok::where('id_kualitas', $detail->id_kualitas)->first();
                if ($stok) {
                    $stok->jumlah_stok += $detail->jumlah;
                    $stok->save();
                }

                // Catat Log Stok (Revert)
                LogStok::create([
                    'id_kualitas' => $detail->id_kualitas,
                    'id_user' => auth()->id(),
                    'tipe_perubahan' => 'masuk',
                    'jumlah' => $detail->jumlah,
                    'keterangan' => 'Pembatalan Penjualan #' . $penjualan->id_penjualan,
                ]);
            }

            $penjualan->delete();

            DB::commit();
            return redirect()->route('gudang.penjualan.index')->with('success', 'Transaksi penjualan berhasil dihapus.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus data: ' . $e->getMessage()]);
        }
    }
}
