import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import stokRoute from '@/routes/gudang/stok';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Package, Search, Edit3, History, AlertTriangle } from 'lucide-react';

interface StokProps {
    stok: any[];
}

export default function Index({ stok }: StokProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        jumlah_baru: '',
        keterangan: '',
    });

    const filteredStok = stok.filter(item => 
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpname = (item: any) => {
        setSelectedItem(item);
        setData({
            jumlah_baru: item.jumlah_stok.toString(),
            keterangan: '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        put(stokRoute.update(selectedItem.id_kualitas).url, {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                toast.success(`Data stok ${selectedItem.nama} berhasil diperbarui.`);
            },
            onError: () => {
                toast.error('Gagal melakukan penyesuaian stok.');
            }
        });
    };

    return (
        <>
            <Head title="Monitoring Stok" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">Monitoring Stok Kayu Manis</h1>
                    <p className="text-muted-foreground">
                        Pantau ketersediaan stok real-time dan lakukan penyesuaian manual (Stock Opname) jika diperlukan.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari kualitas kayu manis..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-500" />
                            Daftar Stok Saat Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Kualitas</TableHead>
                                        <TableHead>Harga Default</TableHead>
                                        <TableHead>Jumlah Stok</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStok.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                Tidak ada data stok ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredStok.map((item) => (
                                            <TableRow key={item.id_kualitas}>
                                                <TableCell className="font-medium">{item.kode}</TableCell>
                                                <TableCell>{item.nama}</TableCell>
                                                <TableCell>{formatCurrency(item.harga_default)}</TableCell>
                                                <TableCell className="font-bold text-lg">
                                                    {item.jumlah_stok} Kg
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={item.color} variant="secondary">
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleOpname(item)}>
                                                        <Edit3 className="mr-2 h-4 w-4" />
                                                        Opname
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

                {/* Stock Opname Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-md w-[95vw] rounded-xl overflow-hidden p-0 gap-0">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader className="p-6 pb-2">
                                <DialogTitle className="text-xl font-bold">Penyesuaian Stok</DialogTitle>
                                <DialogDescription className="text-sm">
                                    Update jumlah fisik gudang untuk kualitas <span className="font-bold text-blue-600">{selectedItem?.nama}</span>.
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="px-6 py-4 space-y-5">
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 text-blue-800 text-[12px] leading-relaxed">
                                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <p>Perubahan ini akan dicatat dalam riwayat log audit sistem secara otomatis.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jumlah_baru" className="text-sm font-semibold">Jumlah Stok Fisik (Kg)</Label>
                                    <div className="relative">
                                        <Input
                                            id="jumlah_baru"
                                            type="number"
                                            step="0.01"
                                            value={data.jumlah_baru}
                                            onChange={(e) => setData('jumlah_baru', e.target.value)}
                                            placeholder="0.00"
                                            className="pl-3 pr-10 h-11 text-lg font-bold focus:ring-blue-500"
                                            required
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Kg</div>
                                    </div>
                                    {errors.jumlah_baru && <p className="text-xs text-red-500 mt-1">{errors.jumlah_baru}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="keterangan" className="text-sm font-semibold">Alasan Penyesuaian</Label>
                                    <Textarea
                                        id="keterangan"
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Contoh: Selisih timbangan, barang rusak..."
                                        className="min-h-[80px] resize-none focus:ring-blue-500 text-sm"
                                        required
                                    />
                                    {errors.keterangan && <p className="text-xs text-red-500 mt-1">{errors.keterangan}</p>}
                                </div>
                            </div>

                            <DialogFooter className="bg-gray-50 px-6 py-4 flex gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1 h-11">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 text-white shadow-lg shadow-blue-200">
                                    Simpan Perubahan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
