import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    ShoppingCart, 
    Banknote, 
    Package, 
    Users, 
    ClipboardList, 
    FileText, 
    Activity, 
    History,
    UserCog,
    Truck
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userRole = auth.user.role;

    const menuItems = {
        pemilik: [
            { title: 'Dashboard', href: '/pemilik/dashboard', icon: LayoutGrid },
            { title: 'Laporan', href: '#', icon: FileText },
            { title: 'Monitoring Stok', href: '#', icon: Activity },
            { title: 'Riwayat Transaksi', href: '#', icon: History },
            { title: 'Manajemen User', href: '#', icon: UserCog },
            { title: 'Log Stok', href: '#', icon: ClipboardList },
        ],
        admin_gudang: [
            { title: 'Dashboard', href: '/gudang/dashboard', icon: LayoutGrid },
            { title: 'Pembelian', href: '#', icon: ShoppingCart },
            { title: 'Penjualan', href: '#', icon: Banknote },
            { title: 'Stok', href: '#', icon: Package },
            { title: 'Supplier', href: '#', icon: Truck },
            { title: 'Pelanggan', href: '#', icon: Users },
            { title: 'Log Stok', href: '#', icon: ClipboardList },
        ],
    };

    const mainNavItems: NavItem[] = menuItems[userRole as keyof typeof menuItems] || [];

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

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
