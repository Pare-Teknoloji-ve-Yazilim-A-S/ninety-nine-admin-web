"use client";

import { Users, ShoppingCart, DollarSign, CheckCircle, Truck, Clock, TrendingUp, ArrowUpRight, Activity } from 'lucide-react'
import { Card, Badge, ProgressBar, Table } from './ui'

export default function Content() {
    // Dashboard verileri
    const statsData = [
        {
            title: 'Toplam Müşteri',
            value: '1,250',
            change: '+12%',
            changeType: 'positive',
            icon: Users,
            color: 'blue'
        },
        {
            title: 'Toplam Sipariş',
            value: '3,420',
            change: '+8%',
            changeType: 'positive',
            icon: ShoppingCart,
            color: 'green'
        },
        {
            title: 'Toplam Gelir',
            value: '₺125,000',
            change: '+15%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'purple'
        },
        {
            title: 'Aktif Kampanyalar',
            value: '12',
            change: '+3',
            changeType: 'positive',
            icon: Activity,
            color: 'gold'
        }
    ]

    // Son siparişler tablosu için sütun tanımları
    const orderColumns = [
        { key: 'orderId', label: 'Sipariş ID', width: '120px' },
        { key: 'customer', label: 'Müşteri', width: '200px' },
        { key: 'date', label: 'Tarih', width: '120px' },
        {
            key: 'status',
            label: 'Durum',
            width: '150px',
            render: (value: string) => {
                let color = 'secondary';
                let icon = Clock;

                switch (value) {
                    case 'Tamamlandı':
                        color = 'gold';
                        icon = CheckCircle;
                        break;
                    case 'Gönderildi':
                        color = 'accent';
                        icon = Truck;
                        break;
                    case 'İşleniyor':
                        color = 'secondary';
                        icon = Clock;
                        break;
                }

                const IconComponent = icon;
                return (
                    <Badge
                        color={color as any}
                        variant="soft"
                        className="flex items-center gap-1"
                    >
                        <IconComponent className="w-3 h-3" />
                        {value}
                    </Badge>
                );
            }
        },
        { key: 'total', label: 'Toplam', width: '100px' }
    ];

    // Son siparişler verisi
    const recentOrders = [
        { orderId: '#1001', customer: 'Zeynep Demir', date: '2024-07-26', status: 'Tamamlandı', total: '₺150' },
        { orderId: '#1002', customer: 'Emre Yılmaz', date: '2024-07-25', status: 'Gönderildi', total: '₺200' },
        { orderId: '#1003', customer: 'Deniz Kaya', date: '2024-07-24', status: 'İşleniyor', total: '₺100' },
        { orderId: '#1004', customer: 'Can Ahmet', date: '2024-07-23', status: 'Tamamlandı', total: '₺300' },
        { orderId: '#1005', customer: 'Ayşe Aksoy', date: '2024-07-22', status: 'Gönderildi', total: '₺250' }
    ];

    // Performans metrikleri
    const performanceMetrics = [
        { label: 'Satış Hedefi', value: 75, color: 'gold' },
        { label: 'Müşteri Memnuniyeti', value: 92, color: 'accent' },
        { label: 'Stok Durumu', value: 68, color: 'primary' },
        { label: 'Teslimat Performansı', value: 85, color: 'secondary' }
    ];

    return (
        <div className="flex-1 overflow-auto bg-background-primary">
            <div className="p-6">
                {/* Sayfa Başlığı */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-2 h-10 bg-gradient-gold rounded-full"></div>
                        <div>
                            <h2 className="text-4xl font-bold text-text-primary font-helvetica">Admin Dashboard</h2>
                            <p className="text-text-secondary font-inter mt-2">Bugünün genel görünümü ve performans metrikleri</p>
                        </div>
                    </div>
                    <div className="w-32 h-1 bg-gradient-gold rounded-full"></div>
                </div>

                {/* İstatistik Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsData.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={index} className="bg-background-card border border-primary-gold/20 hover:shadow-card transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-full bg-${stat.color}-50`}>
                                            <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                                        </div>
                                        <div className="flex items-center text-text-accent text-sm font-semibold">
                                            <ArrowUpRight className="w-4 h-4 mr-1" />
                                            {stat.change}
                                        </div>
                                    </div>
                                    <h3 className="text-text-secondary text-sm font-medium mb-2 font-inter">{stat.title}</h3>
                                    <p className="text-3xl font-bold text-text-primary font-helvetica">{stat.value}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Alt Grid - Performans ve Siparişler */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Performans Metrikleri */}
                    <Card className="bg-background-card border border-primary-gold/20">
                        <div className="p-6 border-b border-primary-gold/20">
                            <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-text-accent" />
                                <h3 className="text-xl font-semibold text-text-primary font-helvetica">Performans Metrikleri</h3>
                            </div>
                            <p className="text-text-secondary font-inter">Güncel performans göstergeleri</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {performanceMetrics.map((metric, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-primary font-medium">{metric.label}</span>
                                        <span className="text-text-secondary text-sm">{metric.value}%</span>
                                    </div>
                                    <ProgressBar
                                        value={metric.value}
                                        color={metric.color as any}
                                        size="sm"
                                        className="w-full"
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Hızlı İstatistikler */}
                    <div className="lg:col-span-2">
                        <Card className="bg-background-card border border-primary-gold/20 h-full">
                            <div className="p-6 border-b border-primary-gold/20">
                                <h3 className="text-xl font-semibold text-text-primary font-helvetica mb-2">Son Siparişler</h3>
                                <p className="text-text-secondary font-inter">En son alınan siparişlerin listesi</p>
                            </div>
                            <div className="p-6">
                                <Table>
                                    <Table.Head>
                                        <Table.Row>
                                            {orderColumns.map((column) => (
                                                <Table.Header key={column.key} className="font-medium">
                                                    {column.label}
                                                </Table.Header>
                                            ))}
                                        </Table.Row>
                                    </Table.Head>
                                    <Table.Body>
                                        {recentOrders.map((order, index) => (
                                            <Table.Row key={index}>
                                                {orderColumns.map((column) => (
                                                    <Table.Cell key={column.key}>
                                                        {column.render ? column.render(order[column.key as keyof typeof order] as string) : order[column.key as keyof typeof order]}
                                                    </Table.Cell>
                                                ))}
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Alt Bilgi */}
                <div className="text-center pt-6 border-t border-primary-gold/20">
                    <p className="text-text-secondary font-inter mb-4">
                        NinetyNineAdmin Dashboard - Modern yönetim paneli
                    </p>
                    <div className="flex justify-center items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                        <div className="w-2 h-2 bg-primary-gold/60 rounded-full"></div>
                        <div className="w-2 h-2 bg-primary-gold/30 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    )
} 