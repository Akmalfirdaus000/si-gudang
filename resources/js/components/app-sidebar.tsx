import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    ShoppingCart, 
    Package, 
    Users, 
    ClipboardList, 
    FileText, 
    Activity, 
    History,
    UserCog,
    Truck,
    TrendingUp,
    Tag,
    Database,
    ChevronRight,
    Banknote
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import pembelianRoute from '@/routes/gudang/pembelian';
import penjualanRoute from '@/routes/gudang/penjualan';
import stokRoute from '@/routes/gudang/stok';
import barangRoute from '@/routes/gudang/barang';
import supplierRoute from '@/routes/gudang/supplier';
import pelangganRoute from '@/routes/gudang/pelanggan';
import logStokRoute from '@/routes/gudang/log-stok';
import pemilikRoute from '@/routes/pemilik';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userRole = auth.user.role;

    const navItems = {
        admin_gudang: [
            { title: 'Dashboard', href: '/gudang/dashboard', icon: LayoutGrid },
            { title: 'Pembelian', href: pembelianRoute.index().url, icon: ShoppingCart },
            { title: 'Penjualan', href: penjualanRoute.index().url, icon: TrendingUp },
            { title: 'Stok Monitoring', href: stokRoute.index().url, icon: Package },
            { 
                title: 'Data Master', 
                href: '#', 
                icon: Database,
                items: [
                    { title: 'Barang & Grade', href: barangRoute.index().url, icon: Tag },
                    { title: 'Supplier', href: supplierRoute.index().url, icon: Truck },
                    { title: 'Pelanggan', href: pelangganRoute.index().url, icon: Users },
                ]
            },
            { title: 'Log Pergerakan Stok', href: logStokRoute.index().url, icon: ClipboardList },
        ],
        pemilik: [
            { title: 'Dashboard', href: '/pemilik/dashboard', icon: LayoutGrid },
            { 
                title: 'Laporan', 
                href: '#', 
                icon: FileText,
                items: [
                    { title: 'Laporan Finansial', href: pemilikRoute.laporanFinansial().url, icon: Banknote },
                    { title: 'Monitoring Stok', href: pemilikRoute.monitoringStok().url, icon: Activity },
                    { title: 'Riwayat Transaksi', href: pemilikRoute.riwayatTransaksi().url, icon: History },
                ]
            },
            { 
                title: 'Manajemen', 
                href: '#', 
                icon: UserCog,
                items: [
                    { title: 'Manajemen User', href: pemilikRoute.users.index().url, icon: Users },
                    { title: 'Audit Pergerakan Stok', href: pemilikRoute.auditStok().url, icon: ClipboardList },
                ]
            },
        ]
    };

    const activeItems = navItems[userRole as keyof typeof navItems] || [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain items={activeItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
