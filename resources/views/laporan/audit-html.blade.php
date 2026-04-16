<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audit Pergerakan Stok - SI-GUDANG</title>
    <style>
        body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 22px; }
        .info { margin-bottom: 20px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 11px; }
        th { background-color: #f5f5f5; text-transform: uppercase; }
        .masuk { color: #155724; font-weight: bold; }
        .keluar { color: #721c24; font-weight: bold; }
        .penyesuaian { color: #004085; font-weight: bold; }
        .footer { margin-top: 40px; text-align: right; font-size: 12px; }
        @media print {
            body { padding: 0; }
            th { background-color: #eee !important; -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>BERITA ACARA AUDIT PERGERAKAN STOK</h1>
        <p>SI-GUDANG CASSIAVERA</p>
    </div>

    <div class="info">
        <p><strong>Periode Audit:</strong> {{ \Carbon\Carbon::parse($filters['start_date'])->isoFormat('DD MMM YYYY') }} - {{ \Carbon\Carbon::parse($filters['end_date'])->isoFormat('DD MMM YYYY') }}</p>
        <p><strong>Tanggal Cetak:</strong> {{ $printDate }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="30">No</th>
                <th width="120">Waktu Kejadian</th>
                <th width="100">Grade Barang</th>
                <th width="80">Tipe</th>
                <th width="70">Jumlah</th>
                <th width="100">Petugas</th>
                <th>Keterangan / Deskripsi Perubahan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($logs as $index => $log)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ \Carbon\Carbon::parse($log->created_at)->isoFormat('DD/MM/YY HH:mm') }}</td>
                <td>{{ $log->kualitas->nama_kualitas ?? 'N/A' }}</td>
                <td class="{{ strtolower($log->tipe_perubahan) }}">
                    {{ strtoupper($log->tipe_perubahan) }}
                </td>
                <td style="text-align: right;">
                    {{ $log->tipe_perubahan === 'keluar' ? '-' : '+' }}{{ number_format($log->jumlah, 0, ',', '.') }} Kg
                </td>
                <td>{{ $log->user->name ?? 'System' }}</td>
                <td>{{ $log->keterangan }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak Otomatis oleh Sistem SI-GUDANG</p>
        <p>Penanggung Jawab: ____________________</p>
    </div>
</body>
</html>
