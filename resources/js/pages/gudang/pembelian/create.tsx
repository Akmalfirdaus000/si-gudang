import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import pembelianRoute from '@/routes/gudang/pembelian';
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
import { formatCurrency } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { ArrowLeft, Save, Plus, Trash2, Calculator, UserPlus } from 'lucide-react';

interface CreateProps {
    suppliers: any[];
    kualitas: any[];
}

export default function Create({ suppliers, kualitas }: CreateProps) {
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        id_supplier: '',
        tanggal: new Date().toISOString().split('T')[0],
        items: [
            { id_kualitas: '', jumlah: '', harga: '' }
        ],
        keterangan: '',
    });

    const supplierForm = useForm({
        nama_supplier: '',
        alamat: '',
        no_hp: '',
    });

    // Otomatis pilih supplier baru setelah tersimpan
    useEffect(() => {
        if (suppliers.length > 0 && supplierForm.wasSuccessful) {
            const lastSupplier = suppliers[suppliers.length - 1];
            setData('id_supplier', lastSupplier.id_supplier.toString());
            setIsSupplierModalOpen(false);
            supplierForm.reset();
        }
    }, [suppliers]);

    const handleAddSupplier = (e: React.FormEvent) => {
        e.preventDefault();
        supplierForm.post('/gudang/supplier', {
            onSuccess: () => {
                setIsSupplierModalOpen(false);
                supplierForm.reset();
                toast.success('Supplier baru berhasil ditambahkan');
            },
            onError: () => {
                toast.error('Gagal menambahkan supplier. Silakan periksa inputan Anda.');
            }
        });
    };

    const addItem = () => {
        setData('items', [...data.items, { id_kualitas: '', jumlah: '', harga: '' }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const calculateTotal = () => {
        return data.items.reduce((acc, item) => {
            const sub = Number(item.jumlah) * Number(item.harga);
            return acc + (isNaN(sub) ? 0 : sub);
        }, 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(pembelianRoute.store().url, {
            onSuccess: () => {
                toast.success('Transaksi pembelian berhasil disimpan');
            },
            onError: () => {
                toast.error('Gagal menyimpan transaksi. Silakan periksa kembali data Anda.');
            }
        });
    };

    return (
        <>
            <Head title="Tambah Pembelian Stok" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={pembelianRoute.index().url}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Catat Pembelian Baru</h1>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Daftar Barang</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Kualitas Kayu Manis</TableHead>
                                        <TableHead>Jumlah (Kg)</TableHead>
                                        <TableHead>Harga / Kg</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <select
                                                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={item.id_kualitas}
                                                    onChange={(e) => {
                                                        const id = e.target.value;
                                                        const selectedKualitas = kualitas.find(k => k.id_kualitas.toString() === id);
                                                        const newItems = [...data.items];
                                                        newItems[index] = { 
                                                            ...newItems[index], 
                                                            id_kualitas: id,
                                                            harga: selectedKualitas ? Math.floor(selectedKualitas.harga_default).toString() : ''
                                                        };
                                                        setData('items', newItems);
                                                    }}
                                                    required
                                                >
                                                    <option value="">Pilih Kualitas</option>
                                                    {kualitas.map((k) => (
                                                        <option key={k.id_kualitas} value={k.id_kualitas}>
                                                            {k.nama_kualitas} ({k.kode_kualitas})
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors[`items.${index}.id_kualitas` as keyof typeof errors] && (
                                                    <p className="mt-1 text-xs text-red-500">{errors[`items.${index}.id_kualitas` as keyof typeof errors]}</p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.jumlah}
                                                    onChange={(e) => handleItemChange(index, 'jumlah', e.target.value)}
                                                    placeholder="0.00"
                                                    required
                                                />
                                                {errors[`items.${index}.jumlah` as keyof typeof errors] && (
                                                    <p className="mt-1 text-xs text-red-500">{errors[`items.${index}.jumlah` as keyof typeof errors]}</p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="text"
                                                    value={item.harga ? new Intl.NumberFormat('id-ID').format(Number(item.harga)) : ''}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        const rawValue = e.target.value.replace(/\D/g, '');
                                                        handleItemChange(index, 'harga', rawValue);
                                                    }}
                                                    placeholder="0"
                                                    required
                                                />
                                                {errors[`items.${index}.harga` as keyof typeof errors] && (
                                                    <p className="mt-1 text-xs text-red-500">{errors[`items.${index}.harga` as keyof typeof errors]}</p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(index)}
                                                    disabled={data.items.length === 1}
                                                    className="text-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Item
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Utama</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="id_supplier">Supplier</Label>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={() => setIsSupplierModalOpen(true)}
                                        >
                                            <UserPlus className="mr-1 h-3 w-3" />
                                            Baru
                                        </Button>
                                    </div>
                                    <select
                                        id="id_supplier"
                                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.id_supplier}
                                        onChange={(e) => setData('id_supplier', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Supplier</option>
                                        {suppliers.map((s) => (
                                            <option key={s.id_supplier} value={s.id_supplier}>
                                                {s.nama_supplier}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.id_supplier && <p className="text-xs text-red-500">{errors.id_supplier}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal">Tanggal Transaksi</Label>
                                    <Input
                                        id="tanggal"
                                        type="date"
                                        value={data.tanggal}
                                        onChange={(e) => setData('tanggal', e.target.value)}
                                        required
                                    />
                                    {errors.tanggal && <p className="text-xs text-red-500">{errors.tanggal}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                                    <Textarea
                                        id="keterangan"
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Tambahkan info tambahan..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5" />
                                    Total Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    Rp {new Intl.NumberFormat('id-ID').format(calculateTotal())}
                                </div>
                                <Button type="submit" className="w-full mt-6" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Transaksi
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>

                {/* Quick Create Supplier Modal */}
                <Dialog open={isSupplierModalOpen} onOpenChange={setIsSupplierModalOpen}>
                    <DialogContent className="sm:max-width-[425px]">
                        <form onSubmit={handleAddSupplier}>
                            <DialogHeader>
                                <DialogTitle>Tambah Supplier Baru</DialogTitle>
                                <DialogDescription>
                                    Input data supplier baru dengan cepat. Supplier akan langsung terpilih saat disimpan.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="nama_supplier">Nama Supplier</Label>
                                    <Input
                                        id="nama_supplier"
                                        value={supplierForm.data.nama_supplier}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => supplierForm.setData('nama_supplier', e.target.value)}
                                        placeholder="Contoh: PT. Kayu Maju"
                                        required
                                    />
                                    {supplierForm.errors.nama_supplier && <p className="text-xs text-red-500">{supplierForm.errors.nama_supplier}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="no_hp">No. HP / WhatsApp</Label>
                                    <Input
                                        id="no_hp"
                                        value={supplierForm.data.no_hp}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => supplierForm.setData('no_hp', e.target.value)}
                                        placeholder="0812..."
                                        required
                                    />
                                    {supplierForm.errors.no_hp && <p className="text-xs text-red-500">{supplierForm.errors.no_hp}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Textarea
                                        id="alamat"
                                        value={supplierForm.data.alamat}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => supplierForm.setData('alamat', e.target.value)}
                                        placeholder="Alamat lengkap..."
                                        required
                                    />
                                    {supplierForm.errors.alamat && <p className="text-xs text-red-500">{supplierForm.errors.alamat}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsSupplierModalOpen(false)}>Batal</Button>
                                <Button type="submit" disabled={supplierForm.processing}>Simpan Supplier</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
