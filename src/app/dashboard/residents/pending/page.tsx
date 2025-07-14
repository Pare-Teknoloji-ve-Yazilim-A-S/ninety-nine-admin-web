'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Checkbox from '@/app/components/ui/Checkbox';
import Modal from '@/app/components/ui/Modal';
import {
    RefreshCw,
    AlertTriangle,
    Search,
    Check,
    X,
    MessageSquare,
    Mail,
    Eye,
    Clock,
    AlertCircle,
    User,
    Phone,
    Home,
    Calendar,
    Download,
    TrendingDown,
    FileX
} from 'lucide-react';
import { usePendingResidents } from '@/hooks/usePendingResidents';
import type { Resident as ApiResident } from '@/services/types/resident.types';

// UI Resident tipi
interface ResidentCardData {
    id: string | number;
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
    block?: string;
    apartment?: string;
    residentType?: string;
    createdAt?: string;
    status?: string;
}

function mapApiResidentToCardData(resident: ApiResident): ResidentCardData {
    return {
        id: resident.id,
        firstName: resident.firstName,
        lastName: resident.lastName,
        phone: resident.phone,
        email: resident.email,
        block: resident.property?.block,
        apartment: resident.property?.apartment,
        residentType: resident.property?.ownershipType,
        createdAt: resident.createdAt,
        status: resident.status,
    };
}

export default function PendingApprovalsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedApplications, setSelectedApplications] = useState<(string | number)[]>([]);
    const [filterType, setFilterType] = useState<'all' | 'today'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<ResidentCardData | null>(null);

    // API'den veri çek
    const { residents, loading, error, refresh } = usePendingResidents();
    const cardResidents: ResidentCardData[] = residents.map(mapApiResidentToCardData);
    console.log("residents", residents);
    // Breadcrumb
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Sakinler', href: '/dashboard/residents' },
        { label: 'Onay Bekleyenler', active: true }
    ];

    // Filtreleme
    const filteredApplications = cardResidents.filter(app => {
        const matchesSearch = searchTerm === '' ||
            app.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.phone?.includes(searchTerm);

        // "today" filtresi için başvuru tarihi bugüne ait mi?
        const isToday = (() => {
            if (!app.createdAt) return false;
            const today = new Date();
            const created = new Date(app.createdAt);
            return today.toDateString() === created.toDateString();
        })();

        const matchesFilter = filterType === 'all' || (filterType === 'today' && isToday);
        return matchesSearch && matchesFilter;
    });

    // Sayaçlar
    const todayCount = cardResidents.filter(app => {
        if (!app.createdAt) return false;
        const today = new Date();
        const created = new Date(app.createdAt);
        return today.toDateString() === created.toDateString();
    }).length;

    const toggleSelection = (id: string | number) => {
        setSelectedApplications(prev =>
            prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
        );
    };

    const handleApprove = (application: ResidentCardData) => {
        setSelectedApplication(application);
        setShowApprovalModal(true);
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="lg:ml-72">
                    <DashboardHeader
                        title={`Onay Bekleyen Sakinler (${cardResidents.length})`}
                        breadcrumbItems={breadcrumbItems}
                    />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Summary */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                                    Son 24 saat: {todayCount} | Bu hafta: -- | Bu ay: {cardResidents.length}
                                </h2>
                            </div>
                            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={refresh} disabled={loading}>
                                {loading ? 'Yükleniyor...' : 'Yenile'}
                            </Button>
                        </div>
                        {/* Hata */}
                        {error && (
                            <Card className="mb-6 border-l-4 border-l-red-500">
                                <div className="p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                                                Hata: {error}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Filters */}
                                <Card>
                                    <div className="p-6">
                                        <div className="relative mb-4">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="İsim, TC, telefon veya daire no ile ara..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant={filterType === 'all' ? 'primary' : 'secondary'}
                                                size="sm"
                                                onClick={() => setFilterType('all')}
                                            >
                                                Tümü ({cardResidents.length})
                                            </Button>
                                            <Button
                                                variant={filterType === 'today' ? 'primary' : 'secondary'}
                                                size="sm"
                                                onClick={() => setFilterType('today')}
                                            >
                                                Bugün ({todayCount})
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                                {/* Applications List */}
                                <div className="space-y-4">
                                    {loading && (
                                        <Card className="text-center py-12">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-gold" />
                                                <div>
                                                    <h3 className="text-lg font-medium mb-2">Yükleniyor...</h3>
                                                </div>
                                            </div>
                                        </Card>
                                    )}
                                    {!loading && filteredApplications.map((application) => (
                                        <Card key={application.id} className="hover:shadow-lg transition-shadow">
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            checked={selectedApplications.includes(application.id)}
                                                            onChange={() => toggleSelection(application.id)}
                                                        />
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                                                                {application.firstName} {application.lastName}
                                                            </h3>
                                                            <Badge variant="soft" color="secondary">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                {application.createdAt ? `${Math.floor((Date.now() - new Date(application.createdAt).getTime()) / (1000 * 60 * 60 * 24))} gün önce` : 'Bekliyor'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                            <User className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-text-light-secondary">Telefon:</span>
                                                                <span className="text-text-on-light dark:text-text-on-dark font-medium">
                                                                    {application.phone}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Home className="h-4 w-4 text-gray-400" />
                                                                <span>
                                                                    {application.block} Blok, Daire {application.apartment}
                                                                    ({application.residentType === 'owner' ? 'Malik' : application.residentType === 'tenant' ? 'Kiracı' : 'Diğer'})
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span className="text-text-light-secondary">
                                                                    Kayıt: {application.createdAt ? new Date(application.createdAt).toLocaleString('tr-TR') : '-'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="primary" size="sm" icon={Check}
                                                        onClick={() => handleApprove(application)}>
                                                        Onayla
                                                    </Button>
                                                    <Button variant="danger" size="sm" icon={X}>
                                                        Reddet
                                                    </Button>
                                                    <Button variant="secondary" size="sm" icon={MessageSquare}>
                                                        Not Ekle
                                                    </Button>
                                                    <Button variant="secondary" size="sm" icon={Mail}>
                                                        Bilgi İste
                                                    </Button>
                                                    <Button variant="ghost" size="sm" icon={Eye}>
                                                        İncele
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                    {!loading && filteredApplications.length === 0 && (
                                        <Card className="text-center py-12">
                                            <div className="flex flex-col items-center gap-4">
                                                <FileX className="h-16 w-16 text-gray-400" />
                                                <div>
                                                    <h3 className="text-lg font-medium mb-2">Başvuru bulunamadı</h3>
                                                    <p className="text-text-light-secondary">
                                                        Arama kriterlerinize uygun başvuru yok.
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            </div>
                            {/* Sidebar Stats */}
                            <div className="space-y-6">
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">📈 Bugünün İstatistikleri</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-text-light-secondary">Toplam Başvuru:</span>
                                                <span className="text-sm font-medium">{cardResidents.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-text-light-secondary">Onaylanan:</span>
                                                <span className="text-sm font-medium text-green-600">-</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-text-light-secondary">Reddedilen:</span>
                                                <span className="text-sm font-medium text-red-600">-</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">⏱️ Ortalama İşlem Süresi</h3>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-primary-gold">-</p>
                                            <div className="flex items-center justify-center gap-1 mt-2">
                                                <TrendingDown className="h-4 w-4 text-green-500" />
                                                <span className="text-sm text-green-600">-</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            {/* Approval Modal */}
            <Modal
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                title="Başvuru Onaylama"
                size="md"
            >
                {selectedApplication && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">
                                {selectedApplication.firstName} {selectedApplication.lastName} - {selectedApplication.block} Blok, Daire {selectedApplication.apartment}
                            </h3>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-3">Onay Seçenekleri:</label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="radio" name="approval-type" defaultChecked className="mr-2" />
                                    <span className="text-sm">Tam onay - Tüm haklara sahip</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="approval-type" className="mr-2" />
                                    <span className="text-sm">Şartlı onay - Kısıtlı erişim</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-3">Otomatik İşlemler:</label>
                            <div className="space-y-2">
                                <Checkbox label="QR kod oluştur ve aktifleştir" defaultChecked />
                                <Checkbox label="Mobil uygulama erişimi ver" defaultChecked />
                                <Checkbox label="Hoşgeldin mesajı gönder" defaultChecked />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setShowApprovalModal(false)}>
                                İptal
                            </Button>
                            <Button variant="primary" icon={Check}>
                                Onayla ve Bilgilendir
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </ProtectedRoute>
    );
} 