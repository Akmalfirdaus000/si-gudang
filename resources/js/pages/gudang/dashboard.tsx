import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Package, TrendingDown, TrendingUp, Users, History, Layers } from 'lucide-react';

const stats = [
    {
        title: 'Total Stok',
        value: '1,250 Kg',
        description: '+12% dari bulan lalu',
        icon: Package,
        color: 'text-blue-600',
    },
    {
        title: 'Pembelian (Bulan Ini)',
        value: 'Rp 45.200.000',
        description: '15 Transaksi baru',
        icon: TrendingDown,
        color: 'text-orange-600',
    },
    {
        title: 'Penjualan (Bulan Ini)',
        value: 'Rp 62.800.000',
        description: '24 Transaksi baru',
        icon: TrendingUp,
        color: 'text-green-600',
    },
    {
        title: 'Total Supplier/Pelanggan',
        value: '42',
        description: '12 Supplier, 30 Pelanggan',
        icon: Users,
        color: 'text-purple-600',
    },
];

const stockData = [
    { kode: 'STK', nama: 'Stik', stok: '450 Kg', status: 'Aman', color: 'bg-green-100 text-green-800' },
    { kode: 'KF', nama: 'KF', stok: '320 Kg', status: 'Aman', color: 'bg-green-100 text-green-800' },
    { kode: 'PTH', nama: 'Patah', stok: '85 Kg', status: 'Menipis', color: 'bg-yellow-100 text-yellow-800' },
    { kode: 'KB', nama: 'Kecil/Biasa', stok: '395 Kg', status: 'Aman', color: 'bg-green-100 text-green-800' },
];

const recentTransactions = [
    { id: '#TRX-001', tipe: 'Penjualan', pihak: 'Toko Berkah', total: 'Rp 5.400.000', tanggal: '15 Apr 2026' },
    { id: '#TRX-002', tipe: 'Pembelian', pihak: 'Bpk. Sugeng (Supplier)', total: 'Rp 12.000.000', tanggal: '14 Apr 2026' },
    { id: '#TRX-003', tipe: 'Penjualan', pihak: 'CV Kayu Harum', total: 'Rp 8.200.000', tanggal: '14 Apr 2026' },
    { id: '#TRX-004', tipe: 'Penjualan', pihak: 'Toko Maju Jaya', total: 'Rp 2.100.000', tanggal: '13 Apr 2026' },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Gudang Dashboard" />
            
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard Gudang Cassiavera</h1>
                    <p className="text-muted-foreground">Selamat datang kembali! Berikut ringkasan operasional gudang hari ini.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    {/* Stock Table */}
                    <Card className="lg:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <Layers className="h-5 w-5" />
                                    Status Stok Kayu Manis
                                </CardTitle>
                            </div>
                            <Badge variant="outline">Update Realtime</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kode</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kualitas</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Jumlah Stok</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {stockData.map((item) => (
                                            <tr key={item.kode} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle font-medium">{item.kode}</td>
                                                <td className="p-4 align-middle">{item.nama}</td>
                                                <td className="p-4 align-middle">{item.stok}</td>
                                                <td className="p-4 align-middle">
                                                    <Badge className={item.color} variant="secondary">
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Transaksi Terakhir
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTransactions.map((trx) => (
                                    <div key={trx.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{trx.pihak}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {trx.tipe} • {trx.tanggal}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-bold ${trx.tipe === 'Penjualan' ? 'text-green-600' : 'text-blue-600'}`}>
                                                {trx.tipe === 'Penjualan' ? '+' : '-'}{trx.total}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground uppercase">{trx.id}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-6 w-full rounded-md border py-2 text-sm font-medium hover:bg-accent">
                                Lihat Semua Transaksi
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
