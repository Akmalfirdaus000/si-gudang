import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, Search, ArrowUpCircle, ArrowDownCircle, RefreshCw, User as UserIcon, Calendar } from 'lucide-react';

interface LogStokProps {
    logs: {
        data: any[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        tipe?: string;
        search?: string;
    };
}

export default function Index({ logs, filters }: LogStokProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [tipe, setTipe] = useState(filters.tipe || 'all');

    // Fungsi format tanggal manual tanpa dependensi eksternal
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };

    const handleFilterChange = (newSearch: string, newTipe: string) => {
        router.get('/gudang/log-stok', {
            search: newSearch,
            tipe: newTipe === 'all' ? '' : newTipe
        }, {
            preserveState: true,
            replace: true
        });
    };

    const getTipeBadge = (tipe: string) => {
        switch (tipe) {
            case 'masuk':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 flex items-center gap-1 w-fit">
                    <ArrowUpCircle className="h-3 w-3" /> Stok Masuk
                </Badge>;
            case 'keluar':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 flex items-center gap-1 w-fit">
                    <ArrowDownCircle className="h-3 w-3" /> Stok Keluar
                </Badge>;
            default:
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 flex items-center gap-1 w-fit">
                    <RefreshCw className="h-3 w-3" /> Penyesuaian
                </Badge>;
        }
    };

    return (
        <>
            <Head title="Riwayat Log Stok" />

            <div className="flex flex-col gap-6 p-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Log Pergerakan Stok</h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        Audit lengkap riwayat masuk, keluar, dan penyesuaian stok barang secara real-time.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 max-w-sm min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari keterangan..."
                            className="pl-9 h-10"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                handleFilterChange(e.target.value, tipe);
                            }}
                        />
                    </div>
                    
                    <Select value={tipe} onValueChange={(val) => {
                        setTipe(val);
                        handleFilterChange(search, val);
                    }}>
                        <SelectTrigger className="w-[180px] h-10">
                            <SelectValue placeholder="Semua Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tipe</SelectItem>
                            <SelectItem value="masuk">Stok Masuk</SelectItem>
                            <SelectItem value="keluar">Stok Keluar</SelectItem>
                            <SelectItem value="penyesuaian">Penyesuaian</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-blue-600" />
                            Riwayat Audit Stok
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/30">
                                        <TableHead className="w-[180px]">Waktu & Petugas</TableHead>
                                        <TableHead>Kualitas Barang</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead className="text-right">Jumlah</TableHead>
                                        <TableHead className="min-w-[250px]">Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                Tidak ada riwayat pergerakan stok ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        logs.data.map((log) => (
                                            <TableRow key={log.id_log} className="hover:bg-gray-50/50 transition-colors">
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                            {formatDate(log.created_at)}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                            <UserIcon className="h-3.5 w-3.5" />
                                                            {log.user?.name || 'Sistem'}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-blue-700">{log.kualitas?.kode_kualitas}</span>
                                                        <span className="text-xs text-muted-foreground">{log.kualitas?.nama_kualitas}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getTipeBadge(log.tipe_perubahan)}</TableCell>
                                                <TableCell className="text-right">
                                                    <span className={`text-sm font-black ${log.tipe_perubahan === 'masuk' ? 'text-blue-600' : 'text-green-600'}`}>
                                                        {log.tipe_perubahan === 'keluar' ? '-' : '+'}{log.jumlah} Kg
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm text-gray-600 leading-relaxed italic">
                                                        "{log.keterangan || '-'}"
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination (Sederhana) */}
                {logs.last_page > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={logs.current_page <= 1}
                            onClick={() => router.get(logs.links[0].url)}
                        >
                            Sebelumnya
                        </Button>
                        <div className="text-sm font-medium">
                            Halaman {logs.current_page} dari {logs.last_page}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={logs.current_page >= logs.last_page}
                            onClick={() => router.get(logs.links[logs.links.length - 1].url)}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
