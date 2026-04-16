<?php

namespace App\Http\Controllers\Pemilik;

use App\Http\Controllers\Controller;
use App\Models\LogStok;
use App\Models\User;
use App\Models\KualitasBarang;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditStokController extends Controller
{
    /**
     * Display the audit logs with filters.
     */
    public function index(Request $request)
    {
        $filters = $this->getFilters($request);
        $logs = $this->getAuditLogs($filters);
        
        return Inertia::render('pemilik/manajemen/audit', [
            'logs' => $logs,
            'filters' => $filters,
            'users' => User::select('id', 'name')->get(),
            'grades' => KualitasBarang::select('id_kualitas', 'nama_kualitas')->get(),
        ]);
    }

    /**
     * Export audit logs to HTML.
     */
    public function exportHtml(Request $request)
    {
        $filters = $this->getFilters($request);
        $logs = $this->getAuditLogs($filters, false); // Get all without pagination

        $html = view('laporan.audit-html', [
            'logs' => $logs,
            'filters' => $filters,
            'printDate' => Carbon::now()->isoFormat('DD MMMM YYYY, HH:mm')
        ])->render();

        return response($html)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', 'attachment; filename="Audit-Stok-'.Carbon::now()->format('Ymd').'.html"');
    }

    /**
     * Get filters from request.
     */
    private function getFilters(Request $request)
    {
        return [
            'start_date' => $request->input('start_date', Carbon::now()->subDays(30)->toDateString()),
            'end_date' => $request->input('end_date', Carbon::now()->toDateString()),
            'type' => $request->input('type', 'all'),
            'user_id' => $request->input('user_id', 'all'),
            'id_kualitas' => $request->input('id_kualitas', 'all'),
            'search' => $request->input('search', ''),
        ];
    }

    /**
     * Fetch logs based on filters.
     */
    private function getAuditLogs($filters, $paginate = true)
    {
        $query = LogStok::with(['kualitas', 'user'])
            ->whereBetween('created_at', [
                Carbon::parse($filters['start_date'])->startOfDay(),
                Carbon::parse($filters['end_date'])->endOfDay()
            ]);

        if ($filters['type'] !== 'all') {
            $query->where('tipe_perubahan', $filters['type']);
        }

        if ($filters['user_id'] !== 'all') {
            $query->where('id_user', $filters['user_id']);
        }

        if ($filters['id_kualitas'] !== 'all') {
            $query->where('id_kualitas', $filters['id_kualitas']);
        }

        if ($filters['search']) {
            $query->where('keterangan', 'like', '%' . $filters['search'] . '%');
        }

        $query->orderBy('created_at', 'desc');

        return $paginate ? $query->paginate(30)->withQueryString() : $query->get();
    }
}
