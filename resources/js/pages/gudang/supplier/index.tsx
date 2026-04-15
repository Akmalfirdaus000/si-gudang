import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import supplierRoute from '@/routes/gudang/supplier';
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
import { Truck, Plus, Edit2, Trash2, Phone, MapPin, Search } from 'lucide-react';

interface SupplierProps {
    suppliers: any[];
}

export default function Index({ suppliers }: SupplierProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_supplier: '',
        no_hp: '',
        alamat: '',
    });

    const filteredSuppliers = suppliers.filter(s => 
        s.nama_supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.no_hp && s.no_hp.includes(searchTerm))
    );

    const handleOpenAddModal = () => {
        setEditId(null);
        reset();
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: any) => {
        setEditId(item.id_supplier);
        setData({
            nama_supplier: item.nama_supplier,
            no_hp: item.no_hp || '',
            alamat: item.alamat || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            put(supplierRoute.update(editId).url, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Data supplier berhasil diperbarui.');
                },
            });
        } else {
            post(supplierRoute.store().url, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    toast.success('Supplier baru berhasil ditambahkan.');
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
            router.delete(supplierRoute.destroy(id).url, {
                onSuccess: () => toast.success('Supplier berhasil dihapus.'),
                onError: (err: any) => toast.error(err.error || 'Gagal menghapus supplier.'),
            });
        }
    };

    return (
        <>
            <Head title="Manajemen Supplier" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Data Supplier</h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            Kelola daftar mitra pemasok kayu manis Anda.
                        </p>
                    </div>
                    <Button onClick={handleOpenAddModal} className="bg-blue-600 text-white hover:bg-blue-700 shadow-md">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Supplier
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau telepon..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Truck className="h-5 w-5 text-blue-500" />
                            Daftar Pemasok Aktif
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead>Nama Supplier</TableHead>
                                        <TableHead>Kontak</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSuppliers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                Tidak ada data supplier ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSuppliers.map((item) => (
                                            <TableRow key={item.id_supplier} className="hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="font-bold text-blue-600">{item.nama_supplier}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                                        {item.no_hp || '-'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-start gap-2 text-sm max-w-[300px]">
                                                        <MapPin className="h-3 w-3 text-muted-foreground mt-1 shrink-0" />
                                                        <span className="truncate">{item.alamat || '-'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(item)}>
                                                        <Edit2 className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id_supplier)}>
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
                                    {editId ? 'Ubah Data Supplier' : 'Tambah Supplier Baru'}
                                </DialogTitle>
                                <DialogDescription className="text-sm">
                                    Lengkapi identitas mitra pemasok di bawah ini.
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="px-6 py-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_supplier" className="text-sm font-semibold">Nama Lengkap / Perusahaan</Label>
                                    <Input
                                        id="nama_supplier"
                                        value={data.nama_supplier}
                                        onChange={(e) => setData('nama_supplier', e.target.value)}
                                        placeholder="Contoh: PT. Kayu Manis Lestari"
                                        required
                                    />
                                    {errors.nama_supplier && <p className="text-xs text-red-500">{errors.nama_supplier}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="no_hp" className="text-sm font-semibold">Nomor Telepon / WhatsApp</Label>
                                    <Input
                                        id="no_hp"
                                        value={data.no_hp}
                                        onChange={(e) => setData('no_hp', e.target.value)}
                                        placeholder="0812xxxx"
                                        required
                                    />
                                    {errors.no_hp && <p className="text-xs text-red-500">{errors.no_hp}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alamat" className="text-sm font-semibold">Alamat Lengkap</Label>
                                    <Textarea
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        placeholder="Alamat kantor atau rumah..."
                                        className="h-24 resize-none"
                                    />
                                </div>
                            </div>

                            <DialogFooter className="bg-gray-50 px-6 py-4">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                                    {editId ? 'Simpan Perubahan' : 'Tambah Supplier'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
