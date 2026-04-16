import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Search, 
    Filter, 
    ArrowRightLeft, 
    ExternalLink, 
    Calendar,
    ArrowUpRight,
    ArrowDownLeft
} from 'lucide-react';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from '@/components/ui/dialog';
import { useState } from 'react';
import pemilikRoute from '@/routes/pemilik';

interface TransactionItem {
    nama: string;
    jumlah: number;
    harga: number;
    subtotal: number;
}

interface Transaction {
    id: string;
    db_id: number;
    tanggal: string;
    tipe: 'Penjualan' | 'Pembelian';
    entitas: string;
    total: number;
    keterangan: string;
    items: TransactionItem[];
}

interface RiwayatTransaksiProps {
    transactions: Transaction[];
    filters: {
        start_date: string;
        end_date: string;
        type: string;
        search: string;
    };
}

export default function RiwayatTransaksi({ transactions, filters }: RiwayatTransaksiProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const handleFilter = () => {
        router.get(pemilikRoute.riwayatTransaksi().url, {
            search,
            type,
            start_date: startDate,
            end_date: endDate
        }, { preserveState: true });
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
            <Head title="Riwayat Transaksi" />
            
            <div className="flex flex-col gap-8 p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Riwayat Transaksi</h1>
                    <p className="text-muted-foreground">Arsip lengkap seluruh transaksi pembelian dan penjualan barang.</p>
                </div>

                {/* Filters */}
                <Card className="border-none shadow-sm bg-muted/30">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex-1 min-w-[240px]">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari ID Transaksi atau Nama..."
                                        className="pl-9 bg-background"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    />
                                </div>
                            </div>

                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="w-[180px] bg-background">
                                    <SelectValue placeholder="Tipe Transaksi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tipe</SelectItem>
                                    <SelectItem value="penjualan">Penjualan (In)</SelectItem>
                                    <SelectItem value="pembelian">Pembelian (Out)</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2 rounded-md border bg-background p-1 px-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Input 
                                    type="date" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="h-8 w-34 border-none focus-visible:ring-0 bg-transparent text-xs"
                                />
                                <span className="text-xs font-bold text-muted-foreground">s/d</span>
                                <Input 
                                    type="date" 
                                    value={endDate} 
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="h-8 w-34 border-none focus-visible:ring-0 bg-transparent text-xs"
                                />
                            </div>

                            <Button onClick={handleFilter} size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Terapkan
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions Table */}
                <Card className="shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px] pl-6">ID Transaksi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Pelanggan / Supplier</TableHead>
                                    <TableHead className="text-right">Total Nilai</TableHead>
                                    <TableHead className="text-center pr-6">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            Tidak ada transaksi ditemukan pada periode ini.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((tr) => (
                                        <TableRow key={tr.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedTransaction(tr)}>
                                            <TableCell className="pl-6 font-mono text-xs font-bold">{tr.id}</TableCell>
                                            <TableCell className="text-sm">{tr.tanggal}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`flex w-fit items-center gap-1 border-none px-2 ${
                                                    tr.tipe === 'Penjualan' 
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                    {tr.tipe === 'Penjualan' ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                                                    {tr.tipe}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium text-sm">{tr.entitas}</TableCell>
                                            <TableCell className="text-right font-bold">{formatCurrency(tr.total)}</TableCell>
                                            <TableCell className="text-center pr-6">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Detail Modal */}
            <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <div className="flex items-center justify-between pr-8">
                            <div>
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                    <ArrowRightLeft className="h-5 w-5 text-primary" />
                                    Detail Transaksi {selectedTransaction?.id}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedTransaction?.tanggal} • {selectedTransaction?.entitas}
                                </DialogDescription>
                            </div>
                            <Badge className={selectedTransaction?.tipe === 'Penjualan' ? 'bg-green-500' : 'bg-red-500'}>
                                {selectedTransaction?.tipe}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <div className="mt-4">
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Nama Kualitas (Grade)</TableHead>
                                        <TableHead className="text-right">Jumlah</TableHead>
                                        <TableHead className="text-right">Harga / Kg</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedTransaction?.items.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-medium">{item.nama}</TableCell>
                                            <TableCell className="text-right">{item.jumlah} Kg</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.harga)}</TableCell>
                                            <TableCell className="text-right font-bold">{formatCurrency(item.subtotal)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <tfoot className="bg-muted/20">
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right font-bold py-4">TOTAL TRANSAKSI</TableCell>
                                        <TableCell className="text-right font-bold text-lg text-primary">{formatCurrency(selectedTransaction?.total || 0)}</TableCell>
                                    </TableRow>
                                </tfoot>
                            </Table>
                        </div>

                        {selectedTransaction?.keterangan && (
                            <div className="mt-4 p-3 rounded-md bg-muted/50 text-sm">
                                <p className="font-bold text-xs uppercase text-muted-foreground mb-1">Catatan / Keterangan:</p>
                                {selectedTransaction.keterangan}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
