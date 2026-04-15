import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Package, TrendingDown, TrendingUp, Users, History, Layers } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DashboardProps {
    stats: {
        total_stok: string;
        pembelian: number;
        penjualan: number;
        total_mitra: number;
    };
    stokData: any[];
    recentTransactions: any[];
}

export default function Dashboard({ stats, stokData, recentTransactions }: DashboardProps) {
    const statCards = [
        {
            title: 'Total Stok',
            value: stats.total_stok,
            description: 'Stok tersedia saat ini',
            icon: Package,
            color: 'text-blue-600',
        },
        {
            title: 'Pembelian (Bulan Ini)',
            value: stats.pembelian > 0 ? formatCurrency(stats.pembelian) : 'Rp 0',
            description: 'Total pengadaan stok masuk',
            icon: TrendingDown,
            color: 'text-orange-600',
        },
        {
            title: 'Penjualan (Bulan Ini)',
            value: stats.penjualan > 0 ? formatCurrency(stats.penjualan) : 'Rp 0',
            description: 'Total omzet keluar',
            icon: TrendingUp,
            color: 'text-green-600',
        },
        {
            title: 'Total Supplier/Pelanggan',
            value: stats.total_mitra,
            description: 'Total mitra bisnis aktif',
            icon: Users,
            color: 'text-purple-600',
        },
    ];

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
                    {statCards.map((stat) => (
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
                                        {stokData.map((item) => (
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
