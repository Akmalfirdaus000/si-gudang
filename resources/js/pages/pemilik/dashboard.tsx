import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { 
    TrendingUp, 
    Wallet, 
    ArrowUpRight, 
    ArrowDownRight, 
    BarChart3, 
    Calendar,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OwnerDashboardProps {
    financialStats: {
        title: string;
        value: string;
        change: string;
        trend: 'up' | 'down' | 'neutral';
        icon?: any;
        description: string;
    }[];
    salesData: {
        day: string;
        value: number;
    }[];
}

export default function OwnerDashboard({ financialStats, salesData }: OwnerDashboardProps) {
    const statsWithIcons = financialStats.map((stat, index) => {
        const icons = [TrendingUp, ArrowUpRight, Wallet, BarChart3];
        return { ...stat, icon: icons[index] || BarChart3 };
    });

    return (
        <>
            <Head title="Owner Dashboard" />
            
            <div className="flex flex-col gap-8 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Ringkasan Bisnis Cassiavera</h1>
                        <p className="text-muted-foreground">Analisis performa finansial dan operasional gudang kayu manis Anda.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            April 2026
                        </Button>
                        <Button size="sm">Cetak Laporan</Button>
                    </div>
                </div>

                {/* Financial Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsWithIcons.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="mt-1 flex items-center text-xs">
                                    <span className={
                                        stat.trend === 'up' ? 'text-green-600' : 
                                        stat.trend === 'down' ? 'text-blue-600' : 'text-muted-foreground'
                                    }>
                                        {stat.change}
                                    </span>
                                    <span className="ml-1 text-muted-foreground">{stat.description}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                    {/* Simplified Chart Area */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Tren Penjualan Mingguan</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="flex h-[200px] items-end justify-around gap-2 px-4 pb-2">
                                {salesData.map((data) => (
                                    <div key={data.day} className="flex flex-1 flex-col items-center gap-2">
                                        <div 
                                            className="w-full rounded-t-md bg-primary/20 hover:bg-primary/40 transition-all cursor-pointer" 
                                            style={{ height: `${data.value}%` }}
                                        />
                                        <span className="text-[10px] text-muted-foreground font-medium">{data.day}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Insights */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Insight Bisnis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                                    <ArrowUpRight className="mt-1 h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium">Omzet Meningkat</p>
                                        <p className="text-xs text-muted-foreground">Penjualan kualitas <strong>STK</strong> meningkat 25% minggu ini.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                                    <ArrowDownRight className="mt-1 h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium">Stok Kritis</p>
                                        <p className="text-xs text-muted-foreground">Kualitas <strong>PTH</strong> di bawah minimum. Perlu restock segera.</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                                    <a href="#" className="flex items-center justify-center">
                                        Lihat Analisis Detail <ChevronRight className="ml-1 h-3 w-3" />
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
