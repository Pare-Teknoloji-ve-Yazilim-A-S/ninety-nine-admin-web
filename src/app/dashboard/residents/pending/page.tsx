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
import ResidentGridTemplate from '@/app/components/templates/GridList';
import TablePagination from '@/app/components/ui/TablePagination';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';
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
    FileX,
    MoreVertical
} from 'lucide-react';
import { usePendingResidents } from '@/hooks/usePendingResidents';
import type { Resident as ApiResident } from '@/services/types/resident.types';

// UI Resident tipi
interface ResidentCardData {
    id: string | number;
    firstName: string;
    lastName: string;
    address?: {
        block?: string;
        apartment?: string;
    };
    contact?: {
        phone?: string;
        email?: string;
    };
    phone?: string;
    email?: string;
    block?: string;
    apartment?: string;
    residentType?: any;
    createdAt?: string;
    status?: any;
}

function mapApiResidentToGridData(resident: ApiResident) {
    return {
        id: resident.id,
        firstName: resident.firstName,
        lastName: resident.lastName,
        address: {
            block: resident.property?.block,
            apartment: resident.property?.apartment,
        },
        contact: {
            phone: resident.phone,
            email: resident.email,
        },
        residentType: resident.property?.ownershipType
            ? { label: resident.property.ownershipType === 'owner' ? 'Malik' : resident.property.ownershipType === 'tenant' ? 'Kiracı' : 'Diğer', value: resident.property.ownershipType }
            : { label: 'Diğer', value: 'other' },
        status: resident.status
            ? { label: String(resident.status), value: resident.status }
            : { label: 'Bekliyor', value: 'pending' },
        createdAt: resident.createdAt,
    };
}

export default function PendingApprovalsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedApplications, setSelectedApplications] = useState<(string | number)[]>([]);
    const [filterType, setFilterType] = useState<'all' | 'today'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<ResidentCardData | null>(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // API'den veri çek
    const { residents, loading, error, refresh } = usePendingResidents();
    const gridResidents = residents.map(mapApiResidentToGridData);
    console.log("residents", residents);
    // Breadcrumb
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Sakinler', href: '/dashboard/residents' },
        { label: 'Onay Bekleyenler', active: true }
    ];

    // Filtreleme
    const filteredApplications = gridResidents.filter(app => {
        const matchesSearch = searchTerm === '' ||
            app.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.contact?.phone?.includes(searchTerm);
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
    const todayCount = gridResidents.filter(app => {
        if (!app.createdAt) return false;
        const today = new Date();
        const created = new Date(app.createdAt);
        return today.toDateString() === created.toDateString();
    }).length;
    // Bulk actions örnek (isteğe göre düzenlenebilir)
    const bulkActions = [
        {
            id: 'approve',
            label: 'Toplu Onayla',
            icon: Check,
            onClick: (selected: any[]) => {
                // Toplu onay işlemi
            },
            variant: 'success' as const,
        },
        {
            id: 'reject',
            label: 'Toplu Reddet',
            icon: X,
            onClick: (selected: any[]) => {
                // Toplu reddet işlemi
            },
            variant: 'danger' as const,
        },
    ];
    // Action handler
    const handleGridAction = (action: string, resident: any) => {
        if (action === 'approve') {
            setSelectedApplication(resident);
            setShowApprovalModal(true);
        } else if (action === 'reject') {
            // Reddet işlemi
        } else if (action === 'message') {
            // Bilgi iste
        } else if (action === 'view') {
            // İncele
        }
    };
    // Pagination dummy (isteğe göre gerçek pagination eklenebilir)
    const pagination = {
        currentPage: 1,
        totalPages: 1,
        totalRecords: filteredApplications.length,
        recordsPerPage: filteredApplications.length,
        onPageChange: () => {},
        onRecordsPerPageChange: () => {},
    };

    // ActionMenu: üç nokta ile açılan menü
    const PendingActionMenu: React.FC<{ row: any }> = ({ row }) => {
        const [open, setOpen] = useState(false);
        const menuRef = React.useRef<HTMLDivElement>(null);
        const buttonRef = React.useRef<HTMLButtonElement>(null);
        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    menuRef.current &&
                    buttonRef.current &&
                    !menuRef.current.contains(event.target as Node) &&
                    !buttonRef.current.contains(event.target as Node)
                ) {
                    setOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);
        return (
            <div className="relative flex items-center justify-center">
                <Button
                    ref={buttonRef}
                    variant="ghost"
                    size="sm"
                    icon={MoreVertical}
                    className="h-8 w-8 p-0"
                    onClick={() => setOpen((v) => !v)}
                />
                <div
                    ref={menuRef}
                    className={`absolute right-0 top-full mt-1 w-40 bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 ${open ? '' : 'hidden'}`}
                >
                    <button
                        onClick={() => {
                            setOpen(false);
                            setShowInfoModal(true);
                            setSelectedApplication(row);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                        <Mail className="w-5 h-5" /> Bilgi İste
                    </button>
                    <button
                        onClick={() => {
                            setOpen(false);
                            setShowDetailModal(true);
                            setSelectedApplication(row);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                        <Eye className="w-5 h-5" /> İncele
                    </button>
                </div>
            </div>
        );
    };
    // Kart altı custom butonlar
    const renderCardActions = (resident: any) => (
        <div className="mt-6 flex gap-3">
            <Button
                variant="primary"
                size="sm"
                icon={Check}
                className="rounded-lg font-medium shadow-sm hover:bg-primary-gold/10 dark:hover:bg-primary-gold/20 focus:ring-2 focus:ring-primary-gold/30"
                onClick={() => handleGridAction('approve', resident)}
            >
                Onayla
            </Button>
            <Button
                variant="danger"
                size="sm"
                icon={X}
                className="rounded-lg font-medium shadow-sm hover:bg-primary-red/10 dark:hover:bg-primary-red/20 focus:ring-2 focus:ring-primary-red/30"
                onClick={() => handleGridAction('reject', resident)}
            >
                Reddet
            </Button>
        </div>
    );

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
                                        ({gridResidents.length})
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
                                            Tümü ({gridResidents.length})
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
                            <ResidentGridTemplate
                                residents={filteredApplications}
                                loading={loading}
                                onSelectionChange={setSelectedApplications}
                                bulkActions={bulkActions}
                                onAction={handleGridAction}
                                selectedResidents={selectedApplications}
                                pagination={pagination}
                                emptyStateMessage={
                                    error ? 'Veri yüklenirken hata oluştu.' :
                                    searchTerm ? `"${searchTerm}" araması için sonuç bulunamadı.` :
                                    'Henüz başvuru bulunmuyor.'
                                }
                                ui={{
                                    Card,
                                    Button,
                                    Checkbox,
                                    TablePagination,
                                    Badge,
                                    EmptyState,
                                    Skeleton,
                                    BulkActionsBar,
                                }}
                                ActionMenu={PendingActionMenu}
                                renderCardActions={renderCardActions}
                            />
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
                                {selectedApplication.firstName} {selectedApplication.lastName} - {selectedApplication.address?.block || selectedApplication.block} Blok, Daire {selectedApplication.address?.apartment || selectedApplication.apartment}
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
            {/* Bilgi İste Modal */}
            <Modal
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                title="Bilgi İste"
                size="md"
            >
                {selectedApplication && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">
                                {selectedApplication.firstName} {selectedApplication.lastName} - {selectedApplication.address?.block || selectedApplication.block} Blok, Daire {selectedApplication.address?.apartment || selectedApplication.apartment}
                            </h3>
                        </div>
                        <div>
                            <p>Burada bilgi iste modal içeriği olacak.</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setShowInfoModal(false)}>
                                Kapat
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
            {/* İncele Modal */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Başvuru İncele"
                size="md"
            >
                {selectedApplication && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">
                                {selectedApplication.firstName} {selectedApplication.lastName} - {selectedApplication.address?.block || selectedApplication.block} Blok, Daire {selectedApplication.address?.apartment || selectedApplication.apartment}
                            </h3>
                        </div>
                        <div>
                            <p>Burada başvuru detay modal içeriği olacak.</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                                Kapat
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </ProtectedRoute>
    );
} 