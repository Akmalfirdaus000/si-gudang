<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Finansial - {{ $startDate }} s/d {{ $endDate }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 40px;
            background-color: #fff;
        }
        .header {
            text-align: center;
            border-bottom: 3px double #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .header p {
            margin: 5px 0 0;
            font-size: 14px;
            color: #666;
        }
        .report-info {
            margin-bottom: 30px;
        }
        .report-info h2 {
            font-size: 18px;
            margin-bottom: 10px;
            text-decoration: underline;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        .summary-card {
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 4px;
            background-color: #f9f9f9;
        }
        .summary-card label {
            display: block;
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        .summary-card .value {
            font-size: 18px;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        table th, table td {
            border: 1px solid #ddd;
            padding: 12px 8px;
            text-align: left;
            font-size: 12px;
        }
        table th {
            background-color: #f2f2f2;
            text-transform: uppercase;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .type-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        .pembelian { background-color: #d1e7ff; color: #004085; }
        .penjualan { background-color: #d4edda; color: #155724; }
        .footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 200px;
            text-align: center;
        }
        .signature-space {
            height: 80px;
        }
        @media print {
            body { padding: 0; }
            .summary-card { background-color: #fff !important; }
            table th { background-color: #f2f2f2 !important; -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>SI-GUDANG CASSIAVERA</h1>
        <p>Laporan Manajemen Keuangan Gudang Kayu Manis</p>
    </div>

    <div class="report-info">
        <h2>LAPORAN REALISASI KEUANGAN</h2>
        <p><strong>Periode:</strong> {{ \Carbon\Carbon::parse($startDate)->isoFormat('DD MMMM YYYY') }} s/d {{ \Carbon\Carbon::parse($endDate)->isoFormat('DD MMMM YYYY') }}</p>
        <p><strong>Dicetak pada:</strong> {{ \Carbon\Carbon::now()->isoFormat('DD/MM/YYYY HH:mm') }}</p>
    </div>

    <div class="summary-grid">
        <div class="summary-card">
            <label>Pemasukan (Penjualan)</label>
            <div class="value">Rp {{ number_format($summary['total_penjualan'], 0, ',', '.') }}</div>
        </div>
        <div class="summary-card">
            <label>Pengeluaran (Pembelian)</label>
            <div class="value">Rp {{ number_format($summary['total_pembelian'], 0, ',', '.') }}</div>
        </div>
        <div class="summary-card">
            <label>Laba Kotor Estimasi</label>
            <div class="value" style="color: #28a745;">Rp {{ number_format($summary['laba_kotor'], 0, ',', '.') }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th width="40">No</th>
                <th width="100">ID</th>
                <th width="100">Tanggal</th>
                <th width="100">Tipe</th>
                <th>Keterangan / Pihak Terkait</th>
                <th class="text-right">Jumlah (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $index => $tr)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $tr['id'] }}</td>
                <td>{{ \Carbon\Carbon::parse($tr['tanggal'])->format('d/m/Y') }}</td>
                <td class="text-center">
                    <span class="type-badge {{ strtolower($tr['tipe']) }}">
                        {{ strtoupper($tr['tipe']) }}
                    </span>
                </td>
                <td>{{ $tr['entitas'] }} - {{ $tr['keterangan'] ?: 'N/A' }}</td>
                <td class="text-right">
                    {{ $tr['tipe'] === 'Penjualan' ? '+' : '-' }}
                    {{ number_format($tr['total'], 0, ',', '.') }}
                </td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="5" class="text-right">TOTAL BERSIH (LABA/RUGI)</th>
                <th class="text-right">Rp {{ number_format($summary['laba_kotor'], 0, ',', '.') }}</th>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <div class="signature-box">
            <p>Disiapkan Oleh,</p>
            <div class="signature-space"></div>
            <p><strong>( Admin Gudang )</strong></p>
        </div>
        <div class="signature-box">
            <p>Disetujui Oleh,</p>
            <div class="signature-space"></div>
            <p><strong>( Pemilik Gudang )</strong></p>
        </div>
    </div>

    <script>
        // Optional: window.print();
    </script>
</body>
</html>
