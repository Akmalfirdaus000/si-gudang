import { Head, useForm, usePage } from '@inertiajs/react';
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
import { Label } from '@/components/ui/label';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from '@/components/ui/dialog';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { 
    UserPlus, 
    UserCog, 
    Shield, 
    Key, 
    Trash2, 
    Mail, 
    User,
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'pemilik' | 'admin_gudang';
}

interface ManajemenUserProps {
    users: UserItem[];
}

export default function ManajemenUser({ users }: ManajemenUserProps) {
    const { auth } = usePage().props as any;
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

    const addForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin_gudang' as 'pemilik' | 'admin_gudang'
    });

    const editForm = useForm({
        name: '',
        email: '',
        role: 'admin_gudang' as 'pemilik' | 'admin_gudang'
    });

    const resetForm = useForm({
        password: '',
        password_confirmation: ''
    });

    const handleAdd = () => {
        addForm.post('/pemilik/users', {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
                toast.success('User berhasil ditambahkan');
            }
        });
    };

    const handleEditOpen = (user: UserItem) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role
        });
        setIsEditOpen(true);
    };

    const handleEdit = () => {
        if (!selectedUser) return;
        editForm.put(`/pemilik/users/${selectedUser.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                toast.success('Data user diperbarui');
            }
        });
    };

    const handleResetOpen = (user: UserItem) => {
        setSelectedUser(user);
        resetForm.reset();
        setIsResetOpen(true);
    };

    const handleReset = () => {
        if (!selectedUser) return;
        resetForm.put(`/pemilik/users/${selectedUser.id}/reset-password`, {
            onSuccess: () => {
                setIsResetOpen(false);
                toast.success('Password berhasil diatur ulang');
            }
        });
    };

    const handleDelete = (user: UserItem) => {
        if (confirm(`Apakah Anda yakin ingin menghapus user ${user.name}?`)) {
            router.delete(`/pemilik/users/${user.id}`, {
                onSuccess: () => toast.success('User dihapus')
            });
        }
    };

    return (
        <>
            <Head title="Manajemen User" />
            
            <div className="flex flex-col gap-8 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Manajemen User</h1>
                        <p className="text-muted-foreground">Kelola hak akses dan profil pengguna sistem SI-GUDANG.</p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Tambah User
                    </Button>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Daftar Pengguna</CardTitle>
                        <CardDescription>Semua akun yang terdaftar dengan hak akses tertentu.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right pr-6">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium">{user.name}</span>
                                                {auth.user.id === user.id && (
                                                    <Badge variant="secondary" className="text-[10px] py-0">Anda</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`border-none ${
                                                user.role === 'pemilik' 
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                                <Shield className="mr-1 h-3 w-3" />
                                                {user.role === 'pemilik' ? 'Pemilik' : 'Admin Gudang'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditOpen(user)}>
                                                    <UserCog className="h-4 w-4 text-blue-500" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleResetOpen(user)}>
                                                    <Key className="h-4 w-4 text-yellow-600" />
                                                </Button>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-8 w-8" 
                                                    onClick={() => handleDelete(user)}
                                                    disabled={auth.user.id === user.id}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah User */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" value={addForm.data.name} onChange={e => addForm.setData('name', e.target.value)} />
                            {addForm.errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {addForm.errors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={addForm.data.email} onChange={e => addForm.setData('email', e.target.value)} />
                            {addForm.errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {addForm.errors.email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Hak Akses</Label>
                            <Select value={addForm.data.role} onValueChange={(v: any) => addForm.setData('role', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pemilik">Pemilik</SelectItem>
                                    <SelectItem value="admin_gudang">Admin Gudang</SelectItem>
                                </SelectContent>
                            </Select>
                            {addForm.errors.role && <p className="text-xs text-red-500">{addForm.errors.role}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={addForm.data.password} onChange={e => addForm.setData('password', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <Input id="password_confirmation" type="password" value={addForm.data.password_confirmation} onChange={e => addForm.setData('password_confirmation', e.target.value)} />
                            {addForm.errors.password && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {addForm.errors.password}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                        <Button onClick={handleAdd} disabled={addForm.processing}>Simpan User</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Edit User */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama Lengkap</Label>
                            <Input id="edit-name" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input id="edit-email" type="email" value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-role">Hak Akses</Label>
                            <Select value={editForm.data.role} onValueChange={(v: any) => editForm.setData('role', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pemilik">Pemilik</SelectItem>
                                    <SelectItem value="admin_gudang">Admin Gudang</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
                        <Button onClick={handleEdit} disabled={editForm.processing}>Pembaruan Data</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Reset Password */}
            <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Atur Ulang Password</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <p className="text-sm text-muted-foreground">Menyetel ulang password untuk user: <span className="font-bold text-foreground">{selectedUser?.name}</span></p>
                        <div className="grid gap-2">
                            <Label htmlFor="reset-password">Password Baru</Label>
                            <Input id="reset-password" type="password" value={resetForm.data.password} onChange={e => resetForm.setData('password', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reset-password-conf">Konfirmasi Password Baru</Label>
                            <Input id="reset-password-conf" type="password" value={resetForm.data.password_confirmation} onChange={e => resetForm.setData('password_confirmation', e.target.value)} />
                            {resetForm.errors.password && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {resetForm.errors.password}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResetOpen(false)}>Batal</Button>
                        <Button onClick={handleReset} disabled={resetForm.processing}>Ubah Password</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Missing router import in the main call, I'll add it.
import { router } from '@inertiajs/react';
