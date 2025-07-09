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

interface PendingApplication {
    id: string;
    firstName: string;
    lastName: string;
    tcNumber: string;
    phone: string;
    email?: string;
    block: string;
    apartmentNumber: string;
    residentType: 'owner' | 'tenant' | 'family';
    applicationDate: string;
    waitingTime: string;
    priority: 'high' | 'medium' | 'low';
    status: 'complete' | 'missing-docs' | 'duplicate-warning';
    warnings: string[];
    missingDocuments: string[];
    ownerName?: string;
}

// Mock data
const mockApplications: PendingApplication[] = [
    {
        id: '1',
        firstName: 'Mehmet',
        lastName: 'ÖZKAN',
        tcNumber: '12345***901',
        phone: '0532 123 45 67',
        email: 'mehmet.ozkan@email.com',
        block: 'B',
        apartmentNumber: '24',
        residentType: 'tenant',
        applicationDate: '06.01.2025 14:30',
        waitingTime: '2 gün 14 saat',
        priority: 'high',
        status: 'missing-docs',
        warnings: ['Kira sözleşmesi yüklenmemiş', 'Malik onayı bekleniyor (Ali YILMAZ)'],
        missingDocuments: ['Kira sözleşmesi', 'Malik onay yazısı'],
        ownerName: 'Ali YILMAZ'
    },
    {
        id: '2',
        firstName: 'Fatma',
        lastName: 'KAYA',
        tcNumber: '98765***210',
        phone: '0555 987 65 43',
        email: 'fatma.kaya@email.com',
        block: 'A',
        apartmentNumber: '8',
        residentType: 'owner',
        applicationDate: '07.01.2025 09:15',
        waitingTime: '18 saat',
        priority: 'medium',
        status: 'complete',
        warnings: [],
        missingDocuments: []
    }
];

export default function PendingApprovalsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
    const [filterType, setFilterType] = useState<'all' | 'today' | 'missing-docs' | 'duplicate'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<PendingApplication | null>(null);

    // Breadcrumb
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Sakinler', href: '/dashboard/residents' },
        { label: 'Onay Bekleyenler', active: true }
    ];

    // Filter applications
    const filteredApplications = mockApplications.filter(app => {
        const matchesSearch = searchTerm === '' ||
            app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.tcNumber.includes(searchTerm) ||
            app.phone.includes(searchTerm);

        const matchesFilter = filterType === 'all' ||
            (filterType === 'today' && app.waitingTime.includes('saat')) ||
            (filterType === 'missing-docs' && app.status === 'missing-docs');

        return matchesSearch && matchesFilter;
    });

    const todayCount = mockApplications.filter(app => app.waitingTime.includes('saat')).length;
    const missingDocsCount = mockApplications.filter(app => app.status === 'missing-docs').length;
    const urgentCount = mockApplications.filter(app => app.priority === 'high').length;

    const toggleSelection = (id: string) => {
        setSelectedApplications(prev =>
            prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
        );
    };

    const handleApprove = (application: PendingApplication) => {
        setSelectedApplication(application);
        setShowApprovalModal(true);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'red';
            case 'medium': return 'gold';
            default: return 'green';
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="lg:ml-72">
                    <DashboardHeader
                        title={`Onay Bekleyen Sakinler (${mockApplications.length})`}
                        breadcrumbItems={breadcrumbItems}
                    />

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Summary */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                                    Son 24 saat: {todayCount} | Bu hafta: 28 | Bu ay: {mockApplications.length}
                                </h2>
                            </div>
                            <Button variant="secondary" size="sm" icon={RefreshCw}>
                                Yenile
                            </Button>
                        </div>

                        {/* Critical Alerts */}
                        {urgentCount > 0 && (
                            <Card className="mb-6 border-l-4 border-l-red-500">
                                <div className="p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                                                ⚠️ DİKKAT GEREKTİRENLER
                                            </h3>
                                            <div className="space-y-1 text-sm">
                                                <p className="text-red-600">🔴 {urgentCount} başvuru 48 saatten uzun bekliyor</p>
                                                <p className="text-yellow-600">🟡 {missingDocsCount} başvuruda eksik belge var</p>
                                            </div>
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
                                                Tümü ({mockApplications.length})
                                            </Button>
                                            <Button
                                                variant={filterType === 'today' ? 'primary' : 'secondary'}
                                                size="sm"
                                                onClick={() => setFilterType('today')}
                                            >
                                                Bugün ({todayCount})
                                            </Button>
                                            <Button
                                                variant={filterType === 'missing-docs' ? 'primary' : 'secondary'}
                                                size="sm"
                                                onClick={() => setFilterType('missing-docs')}
                                            >
                                                Eksik Belge ({missingDocsCount})
                                            </Button>
                                        </div>
                                    </div>
                                </Card>

                                {/* Applications List */}
                                <div className="space-y-4">
                                    {filteredApplications.map((application) => (
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
                                                            <Badge variant="soft" color={getPriorityColor(application.priority)}>
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                {application.waitingTime} bekliyor
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
                                                                <span className="text-text-light-secondary">TC:</span>
                                                                <span className="text-text-on-light dark:text-text-on-dark font-medium">
                                                                    {application.tcNumber}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="h-4 w-4 text-gray-400" />
                                                                <span>{application.phone}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Home className="h-4 w-4 text-gray-400" />
                                                                <span>
                                                                    {application.block} Blok, Daire {application.apartmentNumber}
                                                                    ({application.residentType === 'owner' ? 'Malik' : 'Kiracı'})
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span className="text-text-light-secondary">
                                                                    Kayıt: {application.applicationDate}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {application.warnings.length > 0 && (
                                                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm font-medium text-yellow-800 mb-1">Uyarılar:</p>
                                                                <ul className="text-sm text-yellow-700 space-y-1">
                                                                    {application.warnings.map((warning, index) => (
                                                                        <li key={index}>• {warning}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

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
                                </div>

                                {filteredApplications.length === 0 && (
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

                            {/* Sidebar Stats */}
                            <div className="space-y-6">
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">📈 Bugünün İstatistikleri</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-text-light-secondary">Toplam Başvuru:</span>
                                                <span className="text-sm font-medium">12</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-text-light-secondary">Onaylanan:</span>
                                                <span className="text-sm font-medium text-green-600">7</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-text-light-secondary">Reddedilen:</span>
                                                <span className="text-sm font-medium text-red-600">2</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">⏱️ Ortalama İşlem Süresi</h3>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-primary-gold">2 saat 45 dakika</p>
                                            <div className="flex items-center justify-center gap-1 mt-2">
                                                <TrendingDown className="h-4 w-4 text-green-500" />
                                                <span className="text-sm text-green-600">%15 iyileşme</span>
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
                                {selectedApplication.firstName} {selectedApplication.lastName} - {selectedApplication.block} Blok, Daire {selectedApplication.apartmentNumber}
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