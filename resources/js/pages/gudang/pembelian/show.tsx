import { Head, Link } from '@inertiajs/react';
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
import { ArrowLeft, Printer, ShoppingBag, User, Calendar, Store } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ShowProps {
    pembelian: any;
}

export default function Show({ pembelian }: ShowProps) {
    return (
        <>
            <Head title={`Detail Pembelian #${String(pembelian.id_pembelian).padStart(3, '0')}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={pembelianRoute.index().url}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Detail Transaksi Pembelian</h1>
                            <p className="text-muted-foreground">ID Transaksi: #BY-{String(pembelian.id_pembelian).padStart(3, '0')}</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak Invoice
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Info Transaksi */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ShoppingBag className="h-5 w-5" />
                                Rincian Barang
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kualitas Kayu Manis</TableHead>
                                        <TableHead className="text-right">Jumlah (Kg)</TableHead>
                                        <TableHead className="text-right">Harga / Kg</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pembelian.details.map((detail: any) => (
                                        <TableRow key={detail.id_detail_pembelian}>
                                            <TableCell>
                                                <div className="font-medium">{detail.kualitas_barang?.nama_kualitas}</div>
                                                <div className="text-xs text-muted-foreground">{detail.kualitas_barang?.kode_kualitas}</div>
                                            </TableCell>
                                            <TableCell className="text-right">{detail.jumlah} Kg</TableCell>
                                            <TableCell className="text-right">Rp {new Intl.NumberFormat('id-ID').format(detail.harga)}</TableCell>
                                            <TableCell className="text-right font-bold">
                                                Rp {new Intl.NumberFormat('id-ID').format(detail.subtotal)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Separator className="my-4" />
                            <div className="flex flex-col items-end gap-2 pr-4">
                                <div className="text-sm text-muted-foreground">Total Keseluruhan:</div>
                                <div className="text-2xl font-bold text-primary">
                                    Rp {new Intl.NumberFormat('id-ID').format(pembelian.total_pembelian)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Sidebar */}
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Informasi Tambahan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Store className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Supplier</p>
                                        <p className="font-medium">{pembelian.supplier?.nama_supplier || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Tanggal Transaksi</p>
                                        <p className="font-medium">{new Date(pembelian.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Petugas (Gudang)</p>
                                        <p className="font-medium">{pembelian.user?.name || '-'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Catatan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm italic text-muted-foreground">
                                    {pembelian.keterangan || 'Tidak ada catatan tambahan.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
