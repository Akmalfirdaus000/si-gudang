import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import pembelianRoute from '@/routes/gudang/pembelian';
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

interface PembelianProps {
    pembelian: {
        data: any[];
        links: any[];
    };
}

export default function Index({ pembelian }: PembelianProps) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini? Stok akan dikurangi kembali secara otomatis.')) {
            router.delete(pembelianRoute.destroy(id).url, {
                onSuccess: () => {
                    toast.success('Transaksi berhasil dihapus dan stok telah diperbarui');
                },
                onError: () => {
                    toast.error('Gagal menghapus transaksi');
                }
            });
        }
    };

    return (
        <>
            <Head title="Data Pembelian Stok" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Data Pembelian stok</h1>
                        <p className="text-muted-foreground">Kelola riwayat pembelian kayu manis dari supplier.</p>
                    </div>
                    <Button asChild className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all active:scale-95">
                        <Link href={pembelianRoute.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Catat Pembelian
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Riwayat Transaksi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Transaksi</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Total Pembelian</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pembelian.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            Belum ada data pembelian.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pembelian.data.map((item) => (
                                        <TableRow key={item.id_pembelian}>
                                            <TableCell className="font-medium">
                                                #BY-{String(item.id_pembelian).padStart(3, '0')}
                                            </TableCell>
                                            <TableCell>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</TableCell>
                                            <TableCell>{item.supplier?.nama_supplier || 'Umum'}</TableCell>
                                            <TableCell className="font-bold">
                                                {formatCurrency(item.total_pembelian)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Terarsip</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" asChild title="Detail">
                                                        <Link href={pembelianRoute.show(item.id_pembelian).url}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id_pembelian)} title="Hapus">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination Simple */}
                        {pembelian.data.length > 0 && (
                            <div className="mt-4 flex items-center justify-end gap-2">
                                {pembelian.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        asChild
                                        disabled={!link.url}
                                    >
                                        <Link 
                                            href={link.url || '#'} 
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </Button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
