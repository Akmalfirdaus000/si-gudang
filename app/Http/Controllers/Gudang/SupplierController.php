<?php

namespace App\Http\Controllers\Gudang;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    /**
     * Display a listing of the suppliers.
     */
    public function index()
    {
        return Inertia::render('gudang/supplier/index', [
            'suppliers' => Supplier::all()
        ]);
    }

    /**
     * Store a newly created supplier in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_supplier' => 'required|string|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        $supplier = Supplier::create($request->all());

        if ($request->wantsJson()) {
            return response()->json($supplier);
        }

        return redirect()->back()->with('success', 'Supplier berhasil ditambahkan.');
    }

    /**
     * Update the specified supplier in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_supplier' => 'required|string|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'nullable|string',
        ]);

        $supplier = Supplier::findOrFail($id);
        $supplier->update($request->all());

        return redirect()->back()->with('success', 'Data supplier berhasil diperbarui.');
    }

    /**
     * Remove the specified supplier from storage.
     */
    public function destroy($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->delete();

            return redirect()->back()->with('success', 'Supplier berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus: Supplier mungkin memiliki riwayat transaksi.']);
        }
    }
}
