<?php

namespace App\Http\Controllers\Gudang;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PelangganController extends Controller
{
    /**
     * Display a listing of the customers.
     */
    public function index()
    {
        return Inertia::render('gudang/pelanggan/index', [
            'customers' => Pelanggan::all()
        ]);
    }

    /**
     * Store a newly created customer in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_pelanggan' => 'required|string|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        $pelanggan = Pelanggan::create($request->all());

        if ($request->wantsJson()) {
            return response()->json($pelanggan);
        }

        return redirect()->back()->with('success', 'Pelanggan berhasil ditambahkan.');
    }

    /**
     * Update the specified customer in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_pelanggan' => 'required|string|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        $pelanggan = Pelanggan::findOrFail($id);
        $pelanggan->update($request->all());

        return redirect()->back()->with('success', 'Data pelanggan berhasil diperbarui.');
    }

    /**
     * Remove the specified customer from storage.
     */
    public function destroy($id)
    {
        try {
            $pelanggan = Pelanggan::findOrFail($id);
            $pelanggan->delete();

            return redirect()->back()->with('success', 'Pelanggan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus: Pelanggan mungkin memiliki riwayat transaksi.']);
        }
    }
}
