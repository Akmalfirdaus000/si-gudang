import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import penjualanRoute from '@/routes/gudang/penjualan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Trash2, FileText } from 'lucide-react';

interface PenjualanProps {
    penjualan: {
        data: any[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function Index({ penjualan }: PenjualanProps) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini? Stok akan dikembalikan secara otomatis.')) {
            router.delete(penjualanRoute.destroy(id).url, {
                onSuccess: () => {
                    toast.success('Transaksi penjualan berhasil dihapus dan stok telah dikembalikan');
                },
                onError: () => {
                    toast.error('Gagal menghapus transaksi');
                }
            });
        }
    };

    return (
        <>
            <Head title="Riwayat Penjualan" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Riwayat Penjualan</h1>
                        <p className="text-muted-foreground">
                            Kelola data transaksi penjualan kayu manis kepada pelanggan.
                        </p>
                    </div>
                    <Button asChild className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all active:scale-95">
                        <Link href={penjualanRoute.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Catat Penjualan
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            Daftar Transaksi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No. Transaksi</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Pelanggan</TableHead>
                                        <TableHead>Total Penjualan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {penjualan.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                Belum ada data penjualan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        penjualan.data.map((item) => (
                                            <TableRow key={item.id_penjualan}>
                                                <TableCell className="font-medium">#PJN-{item.id_penjualan}</TableCell>
                                                <TableCell>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</TableCell>
                                                <TableCell>{item.pelanggan?.nama_pelanggan || 'Umum'}</TableCell>
                                                <TableCell className="font-bold">
                                                    {formatCurrency(item.total_penjualan)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Selesai</Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={penjualanRoute.show(item.id_penjualan).url}>
                                                            <Eye className="h-4 w-4 text-blue-500" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id_penjualan)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
