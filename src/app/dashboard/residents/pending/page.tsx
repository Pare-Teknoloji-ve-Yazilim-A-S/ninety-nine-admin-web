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
import SearchBar from '@/app/components/ui/SearchBar';
import BulkActionsBar from '@/app/components/ui/BulkActionsBar';
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
                        title=""
                        breadcrumbItems={breadcrumbItems}
                    />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                                    Onay Bekleyen Sakinler <span className="text-primary-gold">
                                        ({cardResidents.length})
                                    </span>
                                </h2>
                                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                    Son 24 saat: {todayCount}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="ghost" size="md" icon={RefreshCw} onClick={refresh} disabled={loading}>
                                    {loading ? 'Yükleniyor...' : 'Yenile'}
                                </Button>
                            </div>
                        </div>
                        {/* Search and Filters */}
                        <Card className="mb-6">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search Bar */}
                                    <div className="flex-1">
                                        <SearchBar
                                            placeholder="İsim, telefon veya daire no ile ara..."
                                            value={searchTerm}
                                            onChange={setSearchTerm}
                                        />
                                    </div>
                                    {/* Filter Buttons */}
                                    <div className="flex gap-2 items-center">
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
                            </div>
                        </Card>
                        {/* Error Message */}
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
                        {/* Applications List (Grid) */}
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
                            {/* Grid Layout for Applications */}
                            {!loading && filteredApplications.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                                    {filteredApplications.map((application) => (
                                        <Card
                                            key={application.id}
                                            className="bg-background-light-card dark:bg-background-card shadow-lg rounded-2xl transition-all hover:shadow-2xl hover:-translate-y-1 border border-background-light-soft dark:border-background-soft flex flex-col justify-between min-h-[320px]"
                                        >
                                            <div className="flex flex-col h-full p-6 gap-4">
                                                {/* Üst: Avatar ve İsim */}
                                                <div className="flex items-center gap-4 mb-2">
                                                    <div className="shrink-0 w-16 h-16 bg-gradient-to-br from-primary-gold-light/40 to-background-light-soft dark:from-primary-gold/20 dark:to-background-soft rounded-xl flex items-center justify-center border border-primary-gold/20">
                                                        <User className="h-8 w-8 text-primary-gold" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-bold text-text-on-light dark:text-text-on-dark truncate">
                                                            {application.firstName} {application.lastName}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="soft" color="secondary" className="text-xs px-2 py-0.5">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                {application.createdAt ? `${Math.floor((Date.now() - new Date(application.createdAt).getTime()) / (1000 * 60 * 60 * 24))} gün önce` : 'Bekliyor'}
                                                            </Badge>
                                                            <Badge variant="soft" color={application.residentType === 'owner' ? 'gold' : application.residentType === 'tenant' ? 'primary' : 'secondary'} className="text-xs px-2 py-0.5">
                                                                {application.residentType === 'owner' ? 'Malik' : application.residentType === 'tenant' ? 'Kiracı' : 'Diğer'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Checkbox
                                                        checked={selectedApplications.includes(application.id)}
                                                        onChange={() => toggleSelection(application.id)}
                                                        className="ml-2 mt-1"
                                                    />
                                                </div>
                                                {/* Orta: Bilgi Alanları */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-primary-gold" />
                                                        <span className="text-text-on-light dark:text-text-on-dark font-medium truncate">{application.phone || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-primary-gold" />
                                                        <span className="text-text-on-light dark:text-text-on-dark font-medium truncate">{application.email || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Home className="h-4 w-4 text-primary-gold" />
                                                        <span className="truncate">{application.block} Blok, Daire {application.apartment}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-primary-gold" />
                                                        <span className="text-text-light-secondary">Kayıt: {application.createdAt ? new Date(application.createdAt).toLocaleString('tr-TR') : '-'}</span>
                                                    </div>
                                                </div>
                                                {/* Alt: Aksiyonlar */}
                                                <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-background-light-soft dark:border-background-soft">
                                                    <Button variant="primary" size="sm" icon={Check}
                                                        className="flex-1 min-w-[110px]"
                                                        onClick={() => handleApprove(application)}>
                                                        Onayla
                                                    </Button>
                                                    <Button variant="danger" size="sm" icon={X} className="flex-1 min-w-[110px]">
                                                        Reddet
                                                    </Button>
                                                    <Button variant="secondary" size="sm" icon={Mail} className="flex-1 min-w-[110px]">
                                                        Bilgi İste
                                                    </Button>
                                                    <Button variant="ghost" size="sm" icon={Eye} className="flex-1 min-w-[110px]">
                                                        İncele
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
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