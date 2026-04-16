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
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { 
    Search, 
    Filter, 
    Download, 
    Calendar, 
    User as UserIcon, 
    Tag, 
    History,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import pemilikRoute from '@/routes/pemilik';

interface LogItem {
    id_log: number;
    created_at: string;
    tipe_perubahan: 'masuk' | 'keluar' | 'penyesuaian';
    jumlah: number;
    keterangan: string;
    kualitas?: {
        nama_kualitas: string;
    };
    user?: {
        name: string;
    };
}

interface AuditProps {
    logs: {
        data: LogItem[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    filters: {
        start_date: string;
        end_date: string;
        type: string;
        user_id: string;
        id_kualitas: string;
        search: string;
    };
    users: { id: number; name: string }[];
    grades: { id_kualitas: number; nama_kualitas: string }[];
}

export default function AuditStok({ logs, filters, users, grades }: AuditProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');
    const [userId, setUserId] = useState(filters.user_id || 'all');
    const [idKualitas, setIdKualitas] = useState(filters.id_kualitas || 'all');
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = () => {
        router.get(pemilikRoute.auditStok().url, {
            search,
            type,
            user_id: userId,
            id_kualitas: idKualitas,
            start_date: startDate,
            end_date: endDate
        }, { preserveState: true });
    };

    const handleExport = () => {
        const url = pemilikRoute.auditStok.exportHtml({
            query: {
                search,
                type,
                user_id: userId,
                id_kualitas: idKualitas,
                start_date: startDate,
                end_date: endDate
            }
        }).url;
        window.location.href = url;
    };

    return (
        <>
            <Head title="Audit Pergerakan Stok" />
            
            <div className="flex flex-col gap-8 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Audit Pergerakan Stok</h1>
                        <p className="text-muted-foreground">Lacak dan verifikasi setiap perubahan stok barang di gudang secara mendalam.</p>
                    </div>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Ekspor Audit (HTML)
                    </Button>
                </div>

                {/* Advanced Filters */}
                <Card className="border-none shadow-sm bg-muted/20">
                    <CardContent className="p-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Search */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Keterangan</label>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari deskripsi..."
                                        className="pl-9 bg-background"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    />
                                </div>
                            </div>

                            {/* Type Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Tipe Pergerakan</label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="bg-background">
                                        <div className="flex items-center gap-2">
                                            <History className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Semua Tipe" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tipe</SelectItem>
                                        <SelectItem value="masuk">Masuk</SelectItem>
                                        <SelectItem value="keluar">Keluar</SelectItem>
                                        <SelectItem value="penyesuaian">Penyesuaian</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* User Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Petugas (PIC)</label>
                                <Select value={userId} onValueChange={setUserId}>
                                    <SelectTrigger className="bg-background">
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Semua Petugas" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Petugas</SelectItem>
                                        {users.map(u => (
                                            <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Grade Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Grade Barang</label>
                                <Select value={idKualitas} onValueChange={setIdKualitas}>
                                    <SelectTrigger className="bg-background">
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Semua Grade" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Grade</SelectItem>
                                        {grades.map(g => (
                                            <SelectItem key={g.id_kualitas} value={g.id_kualitas.toString()}>{g.nama_kualitas}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Range */}
                            <div className="lg:col-span-2 flex items-center gap-4 bg-background p-3 rounded-md border">
                                <div className="flex items-center gap-2 flex-1">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        type="date" 
                                        value={startDate} 
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="h-8 border-none focus-visible:ring-0"
                                    />
                                    <span className="text-xs font-bold px-2">s/d</span>
                                    <Input 
                                        type="date" 
                                        value={endDate} 
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="h-8 border-none focus-visible:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-2 flex items-end gap-2">
                                <Button onClick={handleFilter} className="w-full">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Terapkan Audit Filter
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Table */}
                <Card className="shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="pl-6 w-[180px]">Waktu</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead className="text-right">Jumlah</TableHead>
                                    <TableHead>Petugas</TableHead>
                                    <TableHead className="pr-6">Keterangan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                                            Tidak ada data audit yang sesuai dengan filter Anda.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((log) => (
                                        <TableRow key={log.id_log} className="group transition-colors">
                                            <TableCell className="pl-6 text-xs text-muted-foreground py-4">
                                                {new Date(log.created_at).toLocaleString('id-ID', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </TableCell>
                                            <TableCell className="font-bold">{log.kualitas?.nama_kualitas || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge className={`capitalize border-none shadow-none px-2 ${
                                                    log.tipe_perubahan === 'masuk' ? 'bg-green-100 text-green-700' :
                                                    log.tipe_perubahan === 'keluar' ? 'bg-red-100 text-red-700' : 
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {log.tipe_perubahan}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className={`text-right font-mono font-bold ${
                                                log.tipe_perubahan === 'masuk' ? 'text-green-600' :
                                                log.tipe_perubahan === 'keluar' ? 'text-red-600' : 'text-blue-600'
                                            }`}>
                                                {log.tipe_perubahan === 'keluar' ? '-' : '+'}{log.jumlah} Kg
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">{log.user?.name || 'System'}</TableCell>
                                            <TableCell className="pr-6 text-sm text-muted-foreground max-w-[300px] truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:max-w-none transition-all">
                                                {log.keterangan}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                <div className="flex items-center justify-between px-2 py-4">
                    <p className="text-sm text-muted-foreground">
                        Halaman {logs.current_page} dari {logs.last_page}
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={logs.current_page === 1}
                            onClick={() => router.get(logs.links[0].url)}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Sebelum
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={logs.current_page === logs.last_page}
                            onClick={() => router.get(logs.links[logs.links.length - 1].url)}
                        >
                            Berikut <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
