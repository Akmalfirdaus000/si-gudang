import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import barangRoute from '@/routes/gudang/barang';
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
import { formatCurrency } from '@/lib/utils';
import { Tag, Plus, Edit2, Trash2, Info } from 'lucide-react';

interface BarangProps {
    barang: any[];
}

export default function Index({ barang }: BarangProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        kode_kualitas: '',
        nama_kualitas: '',
        harga_default: '',
        deskripsi: '',
    });

    const handleOpenAddModal = () => {
        setEditId(null);
        reset();
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: any) => {
        setEditId(item.id_kualitas);
        setData({
            kode_kualitas: item.kode_kualitas,
            nama_kualitas: item.nama_kualitas,
            harga_default: item.harga_default.toString(),
            deskripsi: item.deskripsi || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            put(barangRoute.update(editId).url, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Data barang & grade berhasil diperbarui.');
                },
            });
        } else {
            post(barangRoute.store().url, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    toast.success('Data barang & grade berhasil ditambahkan.');
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(barangRoute.destroy(id).url, {
                onSuccess: () => toast.success('Data berhasil dihapus.'),
                onError: (err: any) => toast.error(err.error || 'Gagal menghapus data.'),
            });
        }
    };

    return (
        <>
            <Head title="Barang & Grade" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Barang & Grade</h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            Kelola data master kualitas produk kayu manis dan harga acuan.
                        </p>
                    </div>
                    <Button onClick={handleOpenAddModal} className="bg-blue-600 text-white hover:bg-blue-700 shadow-md">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Grade
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Tag className="h-5 w-5 text-blue-500" />
                            Daftar Kualitas Kayu Manis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="w-[100px]">Kode</TableHead>
                                        <TableHead>Nama Kualitas</TableHead>
                                        <TableHead>Harga Acuan</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {barang.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                Belum ada data barang.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        barang.map((item) => (
                                            <TableRow key={item.id_kualitas} className="hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="font-bold text-blue-600">{item.kode_kualitas}</TableCell>
                                                <TableCell className="font-medium">{item.nama_kualitas}</TableCell>
                                                <TableCell className="font-semibold text-gray-700">{formatCurrency(item.harga_default)}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                                                    {item.deskripsi || '-'}
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(item)}>
                                                        <Edit2 className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id_kualitas)}>
                                                        <Trash2 className="h-4 w-4 text-red-600" />
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

                {/* CRUD Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-md w-[95vw] rounded-xl p-0 overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader className="p-6 pb-2">
                                <DialogTitle className="text-xl font-bold">
                                    {editId ? 'Ubah Data Grade' : 'Tambah Grade Baru'}
                                </DialogTitle>
                                <DialogDescription className="text-sm">
                                    Lengkapi informasi kualitas barang di bawah ini.
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="px-6 py-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="kode_kualitas" className="text-sm font-semibold">Kode</Label>
                                        <Input
                                            id="kode_kualitas"
                                            value={data.kode_kualitas}
                                            onChange={(e) => setData('kode_kualitas', e.target.value.toUpperCase())}
                                            placeholder="STK"
                                            maxLength={10}
                                            required
                                        />
                                        {errors.kode_kualitas && <p className="text-xs text-red-500">{errors.kode_kualitas}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="harga_default" className="text-sm font-semibold">Harga Acuan / Kg</Label>
                                        <Input
                                            id="harga_default"
                                            type="number"
                                            value={data.harga_default}
                                            onChange={(e) => setData('harga_default', e.target.value)}
                                            placeholder="0"
                                            required
                                        />
                                        {errors.harga_default && <p className="text-xs text-red-500">{errors.harga_default}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_kualitas" className="text-sm font-semibold">Nama Kualitas</Label>
                                    <Input
                                        id="nama_kualitas"
                                        value={data.nama_kualitas}
                                        onChange={(e) => setData('nama_kualitas', e.target.value)}
                                        placeholder="Contoh: Stik (Kayu Manis kualitas super)"
                                        required
                                    />
                                    {errors.nama_kualitas && <p className="text-xs text-red-500">{errors.nama_kualitas}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deskripsi" className="text-sm font-semibold">Deskripsi (Opsional)</Label>
                                    <Textarea
                                        id="deskripsi"
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        placeholder="Keterangan tambahan mengenai produk ini..."
                                        className="h-24 resize-none"
                                    />
                                </div>
                            </div>

                            <DialogFooter className="bg-gray-50 px-6 py-4">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                                    {editId ? 'Simpan Perubahan' : 'Tambah Grade'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
