<?php

namespace App\Http\Controllers\Gudang;

use App\Http\Controllers\Controller;
use App\Models\KualitasBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KualitasBarangController extends Controller
{
    /**
     * Display a listing of the qualities.
     */
    public function index()
    {
        return Inertia::render('gudang/barang/index', [
            'barang' => KualitasBarang::all()
        ]);
    }

    /**
     * Store a newly created quality in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'kode_kualitas' => 'required|string|max:10|unique:kualitas_barang,kode_kualitas',
            'nama_kualitas' => 'required|string|max:255',
            'harga_default' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string',
        ]);

        KualitasBarang::create($request->all());

        return redirect()->back()->with('success', 'Data kualitas barang berhasil ditambahkan.');
    }

    /**
     * Update the specified quality in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'kode_kualitas' => 'required|string|max:10|unique:kualitas_barang,kode_kualitas,' . $id . ',id_kualitas',
            'nama_kualitas' => 'required|string|max:255',
            'harga_default' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string',
        ]);

        $barang = KualitasBarang::findOrFail($id);
        $barang->update($request->all());

        return redirect()->back()->with('success', 'Data kualitas barang berhasil diperbarui.');
    }

    /**
     * Remove the specified quality from storage.
     */
    public function destroy($id)
    {
        try {
            $barang = KualitasBarang::findOrFail($id);
            $barang->delete();

            return redirect()->back()->with('success', 'Data kualitas barang berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus data: Data mungkin sedang digunakan dalam transaksi.']);
        }
    }
}
