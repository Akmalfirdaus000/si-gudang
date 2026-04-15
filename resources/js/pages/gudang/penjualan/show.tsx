import { Head, Link } from '@inertiajs/react';
import React from 'react';
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
import { ArrowLeft, FileText, User, Calendar, Info } from 'lucide-react';

interface ShowProps {
    penjualan: any;
}

export default function Show({ penjualan }: ShowProps) {
    return (
        <>
            <Head title={`Detail Penjualan #${penjualan.id_penjualan}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={penjualanRoute.index().url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Detail Penjualan #{penjualan.id_penjualan}</h1>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-500" />
                                Rincian Barang Keluar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kualitas</TableHead>
                                        <TableHead className="text-right">Jumlah (Kg)</TableHead>
                                        <TableHead className="text-right">Harga / Kg</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {penjualan.details.map((detail: any) => (
                                        <TableRow key={detail.id_detail_penjualan}>
                                            <TableCell>
                                                <div className="font-medium">{detail.kualitas.nama_kualitas}</div>
                                                <div className="text-xs text-muted-foreground">{detail.kualitas.kode_kualitas}</div>
                                            </TableCell>
                                            <TableCell className="text-right">{detail.jumlah} Kg</TableCell>
                                            <TableCell className="text-right">{formatCurrency(detail.harga)}</TableCell>
                                            <TableCell className="text-right font-bold">{formatCurrency(detail.subtotal)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-6 flex justify-end">
                                <div className="w-full md:w-1/3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Total Item:</span>
                                        <span>{penjualan.details.length} Jenis</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <span className="font-bold">Total Penjualan:</span>
                                        <span className="text-xl font-bold text-blue-600">{formatCurrency(penjualan.total_penjualan)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Informasi Transaksi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase">Pelanggan</div>
                                        <div className="font-medium">{penjualan.pelanggan?.nama_pelanggan || 'Umum'}</div>
                                        <div className="text-xs text-muted-foreground">{penjualan.pelanggan?.no_hp || '-'}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase">Tanggal</div>
                                        <div className="font-medium">
                                            {new Date(penjualan.tanggal).toLocaleDateString('id-ID', { 
                                                day: 'numeric', 
                                                month: 'long', 
                                                year: 'numeric' 
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Info className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase">Dicatat Oleh</div>
                                        <div className="font-medium">{penjualan.user?.name}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {penjualan.keterangan && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Keterangan Tambahan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground italic">
                                        "{penjualan.keterangan}"
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
