'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import {
    Home,
    Users,
    Settings,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Download,
    Upload
} from 'lucide-react';

export default function TemplatePage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Breadcrumb örnekleri
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Şablon', href: '/dashboard/template' },
        { label: 'Sayfa Şablonu', active: true }
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div className="lg:ml-72">
                    {/* Header */}
                    <DashboardHeader
                        title="Sayfa Şablonu"
                        breadcrumbItems={breadcrumbItems}
                    />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                                    Sayfa İçeriği
                                </h2>
                                <p className="text-text-light-secondary dark:text-text-secondary">
                                    Bu sayfa yeni sayfa geliştirmek için referans olarak kullanılacak temel şablon sayfasıdır.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="secondary" size="sm" icon={Filter}>
                                    Filtrele
                                </Button>
                                <Button variant="secondary" size="sm" icon={Download}>
                                    İndir
                                </Button>
                                <Button variant="primary" size="sm" icon={Plus}>
                                    Yeni Ekle
                                </Button>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content Area */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary-gold/10 dark:bg-primary-gold/20 rounded-xl flex items-center justify-center">
                                                <Users className="h-6 w-6 text-primary-gold" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                                    247
                                                </p>
                                                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                    Toplam Kullanıcı
                                                </p>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-semantic-success-500/10 dark:bg-semantic-success-500/20 rounded-xl flex items-center justify-center">
                                                <Home className="h-6 w-6 text-semantic-success-500" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                                    89
                                                </p>
                                                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                    Aktif Konut
                                                </p>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary-red/10 dark:bg-primary-red/20 rounded-xl flex items-center justify-center">
                                                <Settings className="h-6 w-6 text-primary-red" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                                    12
                                                </p>
                                                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                    Bekleyen İşlem
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Main Content Card */}
                                <Card>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                                                İçerik Listesi
                                            </h3>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" icon={Search}>
                                                    Ara
                                                </Button>
                                                <Button variant="ghost" size="sm" icon={Upload}>
                                                    Yükle
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Sample Table/List */}
                                        <div className="space-y-4">
                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <div key={item} className="flex items-center justify-between p-4 bg-background-light-soft dark:bg-background-soft rounded-lg">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-primary-gold/20 dark:bg-primary-gold/30 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-medium text-primary-gold">
                                                                {item}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                Örnek İçerik {item}
                                                            </h4>
                                                            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                                Bu bir örnek açıklama metnidir.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge
                                                            variant="soft"
                                                            color={item % 2 === 0 ? "green" : "gold"}
                                                        >
                                                            {item % 2 === 0 ? "Aktif" : "Beklemede"}
                                                        </Badge>
                                                        <Button variant="ghost" size="sm" icon={Edit}>
                                                            Düzenle
                                                        </Button>
                                                        <Button variant="ghost" size="sm" icon={Trash2} className="text-primary-red hover:text-primary-red">
                                                            Sil
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Sidebar Content */}
                            <div className="space-y-6">
                                {/* Info Card */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                            Hızlı Bilgi
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                    Durum:
                                                </span>
                                                <Badge variant="soft" color="green">
                                                    Aktif
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                    Oluşturulma:
                                                </span>
                                                <span className="text-sm text-text-on-light dark:text-text-on-dark">
                                                    15 Ocak 2024
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                    Güncelleme:
                                                </span>
                                                <span className="text-sm text-text-on-light dark:text-text-on-dark">
                                                    2 saat önce
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Action Card */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                            Hızlı İşlemler
                                        </h3>
                                        <div className="space-y-3">
                                            <Button variant="outline" className="w-full justify-start" icon={Plus}>
                                                Yeni Öğe Ekle
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start" icon={Edit}>
                                                Toplu Düzenle
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start" icon={Download}>
                                                Rapor İndir
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start" icon={Settings}>
                                                Ayarları Düzenle
                                            </Button>
                                        </div>
                                    </div>
                                </Card>

                                {/* Help Card */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                                            Yardım
                                        </h3>
                                        <p className="text-sm text-text-light-secondary dark:text-text-secondary mb-4">
                                            Bu sayfayı kullanırken yardıma ihtiyacınız mı var?
                                        </p>
                                        <Button variant="primary" size="sm" className="w-full">
                                            Destek Al
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
} 