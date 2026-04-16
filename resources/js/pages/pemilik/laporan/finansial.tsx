import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Filter, 
    Download,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Legend
} from 'recharts';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import pemilikRoute from '@/routes/pemilik';

interface LaporanFinansialProps {
    filters: {
        start_date: string;
        end_date: string;
    };
    summary: {
        total_penjualan: number;
        total_pembelian: number;
        laba_kotor: number;
    };
    chartData: {
        date: string;
        penjualan: number;
        pembelian: number;
    }[];
    transactions: {
        id: string;
        tanggal: string;
        tipe: 'Penjualan' | 'Pembelian';
        entitas: string;
        total: number;
        keterangan: string;
    }[];
}

export default function LaporanFinansial({ filters, summary, chartData, transactions }: LaporanFinansialProps) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = () => {
        router.get(pemilikRoute.laporanFinansial().url, {
            start_date: startDate,
            end_date: endDate
        }, { preserveState: true });
    };

    const handleExport = () => {
        const url = pemilikRoute.laporanFinansial.exportHtml({
            query: {
                start_date: startDate,
                end_date: endDate
            }
        }).url;
        window.location.href = url;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <>
            <Head title="Laporan Finansial" />
            
            <div className="flex flex-col gap-8 p-8">
                {/* Header & Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Laporan Finansial</h1>
                        <p className="text-muted-foreground">Analisis mendalam pemasukan dan pengeluaran operasional Anda.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 rounded-lg border bg-card p-1 shadow-sm">
                            <Input 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-8 w-[140px] border-none bg-transparent focus-visible:ring-0 px-2"
                            />
                            <span className="text-[10px] font-bold uppercase text-muted-foreground px-1">s/d</span>
                            <Input 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-8 w-[140px] border-none bg-transparent focus-visible:ring-0 px-2"
                            />
                            <Button size="icon" variant="ghost" onClick={handleFilter} className="h-8 w-8 hover:bg-muted">
                                <Filter className="h-4 w-4 text-primary" />
                            </Button>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleExport} className="h-10">
                            <Download className="mr-2 h-4 w-4" />
                            Ekspor
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-l-4 border-l-green-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                Total Penjualan
                                <ArrowUpCircle className="h-4 w-4 text-green-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.total_penjualan)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Uang masuk dari pelanggan</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                Total Pembelian
                                <ArrowDownCircle className="h-4 w-4 text-blue-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.total_pembelian)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Uang keluar untuk stok kayu</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-primary shadow-sm bg-primary/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                Estimasi Laba Kotor
                                <TrendingUp className="h-4 w-4 text-primary" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{formatCurrency(summary.laba_kotor)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Selisih penjualan vs pembelian</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="grid gap-8 lg:grid-cols-1">
                    {/* Financial Chart */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Tren Arus Kas</CardTitle>
                            <CardDescription>Perbandingan harian antara uang masuk (Penjualan) dan uang keluar (Pembelian).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPenjualan" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorPembelian" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis 
                                            dataKey="date" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#6B7280', fontSize: 12 }} 
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                            tickFormatter={(val) => `Rp${val/1000000}jt`}
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            formatter={(value: any) => formatCurrency(value)}
                                        />
                                        <Legend verticalAlign="top" height={36}/>
                                        <Area 
                                            type="monotone" 
                                            dataKey="penjualan" 
                                            name="Uang Masuk (Sales)"
                                            stroke="#22c55e" 
                                            fillOpacity={1} 
                                            fill="url(#colorPenjualan)" 
                                            strokeWidth={2}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="pembelian" 
                                            name="Uang Keluar (Purchase)"
                                            stroke="#3b82f6" 
                                            fillOpacity={1} 
                                            fill="url(#colorPembelian)" 
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transactions Table */}
                    <Card className="shadow-md overflow-hidden">
                        <CardHeader className="bg-muted/30">
                            <CardTitle>Riwayat Transaksi Terkait</CardTitle>
                            <CardDescription>Semua pembelian dan penjualan dalam rentang waktu yang dipilih.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">ID</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead>Pihak Terkait</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length > 0 ? (
                                        transactions.map((tr) => (
                                            <TableRow key={tr.id} className="hover:bg-muted/50 transition-colors">
                                                <TableCell className="font-mono text-xs font-semibold">{tr.id}</TableCell>
                                                <TableCell className="text-sm">{new Date(tr.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                                                <TableCell>
                                                    <Badge variant={tr.tipe === 'Penjualan' ? 'default' : 'secondary'} className={
                                                        tr.tipe === 'Penjualan' ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400' : 
                                                        'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }>
                                                        {tr.tipe}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium">{tr.entitas}</TableCell>
                                                <TableCell className={`text-right font-bold ${tr.tipe === 'Penjualan' ? 'text-green-600' : 'text-blue-600'}`}>
                                                    {tr.tipe === 'Penjualan' ? '+' : '-'} {formatCurrency(tr.total)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{tr.keterangan || '-'}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                Tidak ada transaksi dalam rentang waktu ini.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
