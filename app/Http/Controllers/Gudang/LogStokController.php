<?php

namespace App\Http\Controllers\Gudang;

use App\Http\Controllers\Controller;
use App\Models\LogStok;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LogStokController extends Controller
{
    /**
     * Display a listing of the stock logs.
     */
    public function index(Request $request)
    {
        $query = LogStok::with(['kualitas', 'user'])
            ->latest();

        // Filter berdasarkan Tipe
        if ($request->has('tipe') && $request->tipe != '') {
            $query->where('tipe_perubahan', $request->tipe);
        }

        // Filter berdasarkan Kualitas
        if ($request->has('id_kualitas') && $request->id_kualitas != '') {
            $query->where('id_kualitas', $request->id_kualitas);
        }

        // Filter berdasarkan Pencarian Keterangan
        if ($request->has('search') && $request->search != '') {
            $query->where('keterangan', 'like', '%' . $request->search . '%');
        }

        $logs = $query->paginate(20)->withQueryString();

        return Inertia::render('gudang/log_stok/index', [
            'logs' => $logs,
            'filters' => $request->only(['tipe', 'id_kualitas', 'search'])
        ]);
    }
}
