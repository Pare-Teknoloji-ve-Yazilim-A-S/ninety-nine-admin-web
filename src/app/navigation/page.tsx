'use client';

import React, { useState } from 'react';
import {
    Home,
    Settings,
    Users,
    FileText,
    ShoppingCart,
    Bell,
    Search,
    User,
    Package,
    CreditCard,
    Truck,
    CheckCircle,
    X
} from 'lucide-react';

import {
    Navbar,
    Sidebar,
    SidebarPatterns,
    Breadcrumb,
    BreadcrumbPatterns,
    Stepper,
    StepperPatterns,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Toast,
    ToastContainer
} from '@/app/components/ui';

export default function NavigationDemo() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }>>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    const navItems = [
        {
            label: 'Ana Sayfa',
            icon: <Home size={20} />,
            onClick: () => showToast('Ana Sayfa seçildi', 'info'),
        },
        {
            label: 'Ürünler',
            icon: <Package size={20} />,
            badge: 5,
            children: [
                {
                    label: 'Tüm Ürünler',
                    onClick: () => showToast('Tüm Ürünler seçildi', 'info'),
                },
                {
                    label: 'Kategoriler',
                    onClick: () => showToast('Kategoriler seçildi', 'info'),
                },
                {
                    label: 'Stok Takibi',
                    badge: 3,
                    onClick: () => showToast('Stok Takibi seçildi', 'warning'),
                },
            ],
        },
        {
            label: 'Kullanıcılar',
            icon: <Users size={20} />,
            onClick: () => showToast('Kullanıcılar seçildi', 'info'),
        },
        {
            label: 'Ayarlar',
            icon: <Settings size={20} />,
            onClick: () => showToast('Ayarlar seçildi', 'info'),
        },
    ];

    const sidebarItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <Home size={20} />,
            active: true,
            onClick: () => showToast('Dashboard seçildi', 'success'),
        },
        {
            id: 'products',
            label: 'Ürünler',
            icon: <Package size={20} />,
            badge: 12,
            children: [
                {
                    id: 'all-products',
                    label: 'Tüm Ürünler',
                    onClick: () => showToast('Tüm Ürünler seçildi', 'info'),
                },
                {
                    id: 'add-product',
                    label: 'Ürün Ekle',
                    onClick: () => showToast('Ürün Ekle seçildi', 'info'),
                },
                {
                    id: 'categories',
                    label: 'Kategoriler',
                    onClick: () => showToast('Kategoriler seçildi', 'info'),
                },
            ],
        },
        {
            id: 'orders',
            label: 'Siparişler',
            icon: <ShoppingCart size={20} />,
            badge: 5,
            onClick: () => showToast('Siparişler seçildi', 'info'),
        },
        {
            id: 'users',
            label: 'Kullanıcılar',
            icon: <Users size={20} />,
            onClick: () => showToast('Kullanıcılar seçildi', 'info'),
        },
        {
            id: 'settings',
            label: 'Ayarlar',
            icon: <Settings size={20} />,
            onClick: () => showToast('Ayarlar seçildi', 'info'),
        },
    ];

    const orderSteps = [
        {
            id: 'cart',
            title: 'Sepet',
            description: 'Ürünlerinizi seçin',
            icon: <ShoppingCart size={20} />,
        },
        {
            id: 'shipping',
            title: 'Teslimat',
            description: 'Adres bilgilerini girin',
            icon: <Truck size={20} />,
        },
        {
            id: 'payment',
            title: 'Ödeme',
            description: 'Ödeme yöntemini seçin',
            icon: <CreditCard size={20} />,
        },
        {
            id: 'confirmation',
            title: 'Onay',
            description: 'Siparişinizi onaylayın',
            icon: <CheckCircle size={20} />,
        },
    ];

    return (
        <div className="min-h-screen bg-background-primary">
            <ToastContainer
                toasts={toasts}
                position="top-right"
                onClose={(id) => setToasts(prev => prev.filter(toast => toast.id !== id))}
            />

            {/* Navbar Demo */}
            <Navbar
                brand={{
                    name: 'NinetyNine',
                    logo: '/logo.svg',
                }}
                items={navItems}
                user={{
                    name: 'John Doe',
                    email: 'john@example.com',
                }}
                searchable
                actions={
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        Menu
                    </Button>
                }
            />

            <div className="flex">
                {/* Sidebar Demo */}
                <Sidebar
                    items={sidebarItems}
                    collapsed={sidebarCollapsed}
                    onToggle={setSidebarCollapsed}
                    overlay={showSidebar}
                    onClose={() => setShowSidebar(false)}
                    header={{
                        title: 'Admin Panel',
                        subtitle: 'Yönetim Paneli',
                    }}
                    footer={
                        <div className="text-sm text-text-secondary">
                            v1.0.0
                        </div>
                    }
                />

                {/* Main Content */}
                <div className="flex-1 p-8 transition-all duration-300">
                    <div className="max-w-6xl mx-auto space-y-12">

                        {/* Page Header */}
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-bold text-text-primary">
                                🧭 Navigasyon Component'leri
                            </h1>
                            <p className="text-text-secondary max-w-2xl mx-auto">
                                Navbar, Sidebar, Breadcrumb ve Stepper component'leri ile güçlü navigasyon çözümleri
                            </p>
                        </div>

                        {/* Navbar Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Navbar - Üst Navigasyon</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-text-primary">Özellikler</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-3 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary">Responsive</div>
                                            <div className="text-xs text-text-secondary">Mobil uyumlu</div>
                                        </div>
                                        <div className="p-3 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary">Dropdown</div>
                                            <div className="text-xs text-text-secondary">Alt menüler</div>
                                        </div>
                                        <div className="p-3 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary">Arama</div>
                                            <div className="text-xs text-text-secondary">Entegre arama</div>
                                        </div>
                                        <div className="p-3 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary">Kullanıcı Menüsü</div>
                                            <div className="text-xs text-text-secondary">Profil yönetimi</div>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Sidebar Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sidebar - Yan Menü</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-text-primary">Kontroller</h3>
                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                        >
                                            {sidebarCollapsed ? 'Genişlet' : 'Daralt'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowSidebar(!showSidebar)}
                                        >
                                            {showSidebar ? 'Gizle' : 'Göster'}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-text-primary">Önceden Tanımlı Desenleri</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-2">Admin Sidebar</div>
                                            {SidebarPatterns.Admin({ collapsed: false })}
                                        </div>
                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-2">Basit Sidebar</div>
                                            {SidebarPatterns.Simple({ collapsed: false })}
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Breadcrumb Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Breadcrumb - Sayfa Yolu</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-text-primary">Örnekler</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-2">Basit Breadcrumb</div>
                                            {BreadcrumbPatterns.Simple("Navigasyon Demo")}
                                        </div>

                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-2">İki Seviyeli</div>
                                            {BreadcrumbPatterns.TwoLevel("Components", "Navigasyon")}
                                        </div>

                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-2">Üç Seviyeli</div>
                                            {BreadcrumbPatterns.ThreeLevel("Components", "UI", "Navigasyon")}
                                        </div>

                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-2">Dashboard Yolu</div>
                                            {BreadcrumbPatterns.Dashboard(['Dashboard', 'Components', 'Navigation', 'Demo'])}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-text-primary">Boyut Seçenekleri</h3>
                                    <div className="space-y-3">
                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-2">Küçük (sm)</div>
                                            <Breadcrumb
                                                items={[
                                                    { label: 'Ana Sayfa', href: '/' },
                                                    { label: 'Components', href: '/components' },
                                                    { label: 'Navigasyon', active: true },
                                                ]}
                                                size="sm"
                                            />
                                        </div>

                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-2">Orta (md)</div>
                                            <Breadcrumb
                                                items={[
                                                    { label: 'Ana Sayfa', href: '/' },
                                                    { label: 'Components', href: '/components' },
                                                    { label: 'Navigasyon', active: true },
                                                ]}
                                                size="md"
                                            />
                                        </div>

                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-2">Büyük (lg)</div>
                                            <Breadcrumb
                                                items={[
                                                    { label: 'Ana Sayfa', href: '/' },
                                                    { label: 'Components', href: '/components' },
                                                    { label: 'Navigasyon', active: true },
                                                ]}
                                                size="lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Stepper Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Stepper - Adım Göstergesi</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-text-primary">Interaktif Stepper</h3>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        <div className="mb-4">
                                            <Stepper
                                                steps={orderSteps}
                                                currentStep={currentStep}
                                                variant="icon"
                                                clickable
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                                disabled={currentStep === 0}
                                            >
                                                Önceki
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentStep(Math.min(orderSteps.length - 1, currentStep + 1))}
                                                disabled={currentStep === orderSteps.length - 1}
                                            >
                                                Sonraki
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-text-primary">Önceden Tanımlı Desenleri</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-3">Kayıt Süreci</div>
                                            {StepperPatterns.Registration(2)}
                                        </div>

                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-3">Sipariş Süreci</div>
                                            {StepperPatterns.Order(1)}
                                        </div>

                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-3">Basit Süreç</div>
                                            {StepperPatterns.Simple(1)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-text-primary">Varyantlar</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-3">Varsayılan</div>
                                            <Stepper
                                                steps={[
                                                    { id: '1', title: 'Başlangıç' },
                                                    { id: '2', title: 'İşlem' },
                                                    { id: '3', title: 'Bitir' },
                                                ]}
                                                currentStep={1}
                                                variant="default"
                                            />
                                        </div>

                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-3">Numaralı</div>
                                            <Stepper
                                                steps={[
                                                    { id: '1', title: 'Başlangıç' },
                                                    { id: '2', title: 'İşlem' },
                                                    { id: '3', title: 'Bitir' },
                                                ]}
                                                currentStep={1}
                                                variant="numbered"
                                            />
                                        </div>

                                        <div className="p-4 bg-background-secondary rounded-lg">
                                            <div className="text-sm font-medium text-text-primary mb-3">Minimal</div>
                                            <Stepper
                                                steps={[
                                                    { id: '1', title: 'Başlangıç' },
                                                    { id: '2', title: 'İşlem' },
                                                    { id: '3', title: 'Bitir' },
                                                ]}
                                                currentStep={1}
                                                variant="minimal"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-text-primary">Dikey Stepper</h3>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        {StepperPatterns.Minimal(1, { orientation: "vertical" })}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Özet</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-background-secondary rounded-lg">
                                        <div className="text-2xl font-bold text-primary-gold">4</div>
                                        <div className="text-sm text-text-secondary">Navigasyon Component'i</div>
                                    </div>
                                    <div className="text-center p-4 bg-background-secondary rounded-lg">
                                        <div className="text-2xl font-bold text-primary-gold">15+</div>
                                        <div className="text-sm text-text-secondary">Hazır Desen</div>
                                    </div>
                                    <div className="text-center p-4 bg-background-secondary rounded-lg">
                                        <div className="text-2xl font-bold text-primary-gold">3</div>
                                        <div className="text-sm text-text-secondary">Boyut Seçeneği</div>
                                    </div>
                                    <div className="text-center p-4 bg-background-secondary rounded-lg">
                                        <div className="text-2xl font-bold text-primary-gold">100%</div>
                                        <div className="text-sm text-text-secondary">Responsive</div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
} 