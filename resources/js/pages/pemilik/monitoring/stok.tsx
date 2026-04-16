import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { 
    Package, 
    AlertTriangle, 
    Activity, 
    TrendingUp, 
    ArrowRightLeft,
    Box
} from 'lucide-react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

interface MonitoringStokProps {
    stocks: {
        id_kualitas: number;
        kode: string;
        nama: string;
        jumlah: number;
        minimum: number;
        status: string;
        color: string;
    }[];
    logs: {
        id: number;
        tanggal: string;
        grade: string;
        tipe: string;
        jumlah: number;
        keterangan: string;
        user: string;
    }[];
    stats: {
        total_kg: number;
        total_items: number;
        low_stock_count: number;
    };
}

export default function MonitoringStok({ stocks, logs, stats }: MonitoringStokProps) {
    const formatWeight = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(value) + ' Kg';
    };

    return (
        <>
            <Head title="Monitoring Stok" />
            
            <div className="flex flex-col gap-8 p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Monitoring Stok</h1>
                    <p className="text-muted-foreground">Pantau ketersediaan grade kayu manis dan riwayat pergerakan barang secara real-time.</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Stok Gudang</CardTitle>
                            <Package className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatWeight(stats.total_kg)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total berat seluruh kualitas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stok Kritis/Menipis</CardTitle>
                            <AlertTriangle className={`h-4 w-4 ${stats.low_stock_count > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.low_stock_count} <span className="text-sm font-normal text-muted-foreground">Grade</span></div>
                            <p className="text-xs text-muted-foreground mt-1">Grade di bawah stok minimum</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Varian Kualitas</CardTitle>
                            <Box className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_items} Varian</div>
                            <p className="text-xs text-muted-foreground mt-1">Jumlah grade terdaftar</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 lg:grid-cols-7">
                    {/* Stock by Grade Table */}
                    <Card className="lg:col-span-4 shadow-sm">
                        <CardHeader>
                            <CardTitle>Rincian Stok per Grade</CardTitle>
                            <CardDescription>Status ketersediaan barang untuk setiap klasifikasi kualitas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Kode</TableHead>
                                        <TableHead className="text-right">Jumlah</TableHead>
                                        <TableHead className="text-right">Min. Stok</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stocks.map((stock) => (
                                        <TableRow key={stock.kode}>
                                            <TableCell className="font-medium">{stock.nama}</TableCell>
                                            <TableCell className="text-xs font-mono">{stock.kode}</TableCell>
                                            <TableCell className="text-right font-bold">{formatWeight(stock.jumlah)}</TableCell>
                                            <TableCell className="text-right text-muted-foreground text-xs">{formatWeight(stock.minimum)}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={`${stock.color} border-none shadow-none px-2 py-0.5`}>
                                                    {stock.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Stock Distribution Chart */}
                    <Card className="lg:col-span-3 shadow-sm border-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Grafik Distribusi Stok
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={stocks}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                        <XAxis type="number" hide />
                                        <YAxis 
                                            dataKey="kode" 
                                            type="category" 
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fontWeight: 600 }}
                                        />
                                        <Tooltip 
                                            cursor={{fill: 'transparent'}}
                                            formatter={(value: any) => formatWeight(value)}
                                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                        />
                                        <Bar dataKey="jumlah" radius={[0, 4, 4, 0]} barSize={20}>
                                            {stocks.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.status === 'Habis' ? '#ef4444' : entry.status === 'Menipis' ? '#f59e0b' : '#10b981'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Movement Log */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowRightLeft className="h-5 w-5 text-primary" />
                                Log Pergerakan Stok Terbaru
                            </CardTitle>
                            <CardDescription>Catatan 20 aktivitas terakhir terkait stok di gudang.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="pl-6">Waktu</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead className="text-right">Jumlah</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead className="pr-6">Keterangan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id} className="text-sm">
                                        <TableCell className="pl-6 text-muted-foreground whitespace-nowrap">{log.tanggal}</TableCell>
                                        <TableCell className="font-medium">{log.grade}</TableCell>
                                        <TableCell>
                                            <span className={`capitalize font-semibold ${
                                                log.tipe === 'masuk' ? 'text-green-600' : 
                                                log.tipe === 'keluar' ? 'text-red-600' : 'text-blue-600'
                                            }`}>
                                                {log.tipe}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold">
                                            {log.tipe === 'keluar' ? '-' : '+'}{log.jumlah} Kg
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">{log.user}</TableCell>
                                        <TableCell className="pr-6 text-muted-foreground max-w-[200px] truncate">{log.keterangan}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
