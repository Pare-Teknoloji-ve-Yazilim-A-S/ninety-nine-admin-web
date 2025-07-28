'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Calendar,
    User,
    MapPin,
    FileText,
    Clock,
    AlertCircle,
    CheckCircle,
    PauseCircle,
    RotateCcw,
    Play,
    X
} from 'lucide-react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Skeleton from '@/app/components/ui/Skeleton';
import { ticketService, Ticket } from '@/services/ticket.service';
import { useRequestsActions } from '../hooks/useRequestsActions';
import ConfirmationModal from '@/app/components/ui/ConfirmationModal';

// Status configuration with icons and colors
const STATUS_CONFIG = {
    OPEN: { label: 'Açık', color: 'info', icon: 'AlertCircle' },
    IN_PROGRESS: { label: 'İşlemde', color: 'warning', icon: 'RotateCcw' },
    WAITING: { label: 'Beklemede', color: 'secondary', icon: 'PauseCircle' },
    RESOLVED: { label: 'Çözüldü', color: 'success', icon: 'CheckCircle' },
    CLOSED: { label: 'Kapalı', color: 'secondary', icon: 'CheckCircle' },
    CANCELLED: { label: 'İptal', color: 'red', icon: 'X' }
};

const TYPE_COLOR_MAP = {
    FAULT_REPAIR: 'red',
    MAINTENANCE: 'warning',
    CLEANING: 'info',
    SECURITY: 'red',
    COMPLAINT: 'warning',
    SUGGESTION: 'success',
    OTHER: 'secondary'
};

const PRIORITY_COLOR_MAP = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'red',
    URGENT: 'red'
};

export default function TicketDetailPage() {
    const router = useRouter();
    const params = useParams();
    const ticketId = params.id as string;

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Data State
    const [ticket, setTicket] = useState<Ticket | null>(null);

    // Actions hook
    const {
        handleEditRequest,
        handleDeleteRequest,
        handleUpdateRequestStatus,
        isDeleting,
        confirmationDialog,
        hideConfirmation,
        confirmDelete
    } = useRequestsActions({
        refreshData: () => fetchTicket(),
        setSelectedRequests: () => {},
        setRequests: () => {}
    });

    // Breadcrumb
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Hizmet Talepleri', href: '/dashboard/requests' },
        { label: 'Talep Detayı', active: true }
    ];

    // Fetch ticket data
    const fetchTicket = async () => {
        if (!ticketId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await ticketService.getTicketById(ticketId);
            setTicket(response);
        } catch (err) {
            console.error('Error fetching ticket:', err);
            setError('Talep verisi yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [ticketId]);

    // Get status info with proper icon mapping
    const getStatusInfo = (status: string) => {
        const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.OPEN;
        const iconMap = { AlertCircle, RotateCcw, PauseCircle, CheckCircle, Calendar, X };
        const IconComponent = iconMap[config.icon as keyof typeof iconMap] || AlertCircle;
        return {
            ...config,
            iconComponent: IconComponent
        };
    };

    // Handle actions
    const handleEdit = () => {
        if (ticket) {
            handleEditRequest(ticket);
        }
    };

    const handleDelete = () => {
        if (ticket) {
            handleDeleteRequest(ticket);
        }
    };

    const handleStatusChange = async (action: string) => {
        if (ticket) {
            await handleUpdateRequestStatus(ticket, action);
            // Refresh ticket data
            fetchTicket();
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader
                            title="Talep Detayı"
                            breadcrumbItems={breadcrumbItems}
                        />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="space-y-6">
                                <Skeleton className="h-48 w-full" />
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <Skeleton className="h-64 w-full" />
                                    </div>
                                    <Skeleton className="h-64 w-full" />
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error || !ticket) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader
                            title="Talep Detayı"
                            breadcrumbItems={breadcrumbItems}
                        />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="p-6">
                                <div className="text-center">
                                    <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                        {error || 'Talep Bulunamadı'}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {error || 'Aradığınız talep bulunamadı veya erişim yetkiniz bulunmuyor.'}
                                    </p>
                                    <div className="mt-6">
                                        <Button
                                            variant="primary"
                                            onClick={() => router.push('/dashboard/requests')}
                                        >
                                            Talep Listesine Dön
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const statusInfo = getStatusInfo(ticket.status);
    const StatusIcon = statusInfo.iconComponent;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                
                <div className="lg:ml-72">
                    <DashboardHeader
                        title={`Talep: ${ticket.ticketNumber}`}
                        breadcrumbItems={breadcrumbItems}
                    />

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="space-y-6">
                            {/* Header Card */}
                            <Card className="p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                                {ticket.title}
                                            </h1>
                                            <StatusIcon className={`h-6 w-6 text-semantic-${statusInfo.color}-500`} />
                                            <Badge variant="soft" color={statusInfo.color as any}>
                                                {statusInfo.label}
                                            </Badge>
                                        </div>
                                        <p className="text-text-light-secondary dark:text-text-secondary">
                                            Talep No: <span className="font-medium">{ticket.ticketNumber}</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="ghost"
                                            icon={ArrowLeft}
                                            onClick={() => router.back()}
                                        >
                                            Geri
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            icon={Edit}
                                            onClick={handleEdit}
                                        >
                                            Düzenle
                                        </Button>
                                        <Button
                                            variant="danger"
                                            icon={Trash2}
                                            onClick={handleDelete}
                                        >
                                            Sil
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Description */}
                                    <Card className="p-6">
                                        <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                            Açıklama
                                        </h2>
                                        <p className="text-text-light-secondary dark:text-text-secondary whitespace-pre-wrap">
                                            {ticket.description}
                                        </p>
                                    </Card>

                                    {/* Quick Actions */}
                                    {ticket.status === 'OPEN' && (
                                        <Card className="p-6">
                                            <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                                Hızlı İşlemler
                                            </h2>
                                            <div className="flex flex-wrap gap-3">
                                                <Button
                                                    variant="primary"
                                                    icon={Play}
                                                    onClick={() => handleStatusChange('start-progress')}
                                                >
                                                    İşleme Al
                                                </Button>
                                                <Button
                                                    variant="success"
                                                    icon={CheckCircle}
                                                    onClick={() => handleStatusChange('resolve')}
                                                >
                                                    Çöz
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    icon={X}
                                                    onClick={() => handleStatusChange('cancel')}
                                                >
                                                    İptal Et
                                                </Button>
                                            </div>
                                        </Card>
                                    )}

                                    {ticket.status === 'IN_PROGRESS' && (
                                        <Card className="p-6">
                                            <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                                Hızlı İşlemler
                                            </h2>
                                            <div className="flex flex-wrap gap-3">
                                                <Button
                                                    variant="success"
                                                    icon={CheckCircle}
                                                    onClick={() => handleStatusChange('resolve')}
                                                >
                                                    Çöz
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    icon={PauseCircle}
                                                    onClick={() => handleStatusChange('mark-waiting')}
                                                >
                                                    Beklet
                                                </Button>
                                            </div>
                                        </Card>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    <Card className="p-6">
                                        <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                            Talep Bilgileri
                                        </h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                        Tip
                                                    </p>
                                                    <Badge variant="soft" color={TYPE_COLOR_MAP[ticket.type as keyof typeof TYPE_COLOR_MAP] || 'secondary'}>
                                                        {ticket.type}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <AlertCircle className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                        Öncelik
                                                    </p>
                                                    <Badge variant="soft" color={PRIORITY_COLOR_MAP[ticket.priority as keyof typeof PRIORITY_COLOR_MAP] || 'secondary'}>
                                                        {ticket.priority}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <User className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                        Oluşturan
                                                    </p>
                                                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                        {ticket.creator?.firstName} {ticket.creator?.lastName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                        Emlak
                                                    </p>
                                                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                        {ticket.property?.name || ticket.property?.propertyNumber || '--'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Clock className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                        Oluşturulma
                                                    </p>
                                                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                        {new Date(ticket.createdAt).toLocaleString('tr-TR')}
                                                    </p>
                                                </div>
                                            </div>

                                            {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                                            Son Güncelleme
                                                        </p>
                                                        <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                            {new Date(ticket.updatedAt).toLocaleString('tr-TR')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmationDialog.isOpen}
                onClose={hideConfirmation}
                onConfirm={async () => {
                    await confirmDelete();
                    // Navigate back to requests list if deletion was successful
                    if (!confirmationDialog.isOpen) {
                        router.push('/dashboard/requests');
                    }
                }}
                title="Talebi Sil"
                description={
                    confirmationDialog.ticket 
                        ? `"${confirmationDialog.ticket.title}" adlı talep kalıcı olarak silinecektir. Bu işlem geri alınamaz.`
                        : "Bu talebi silmek istediğinizden emin misiniz?"
                }
                confirmText="Sil"
                cancelText="İptal"
                variant="danger"
                loading={isDeleting}
                itemName={confirmationDialog.ticket?.title}
                itemType="talep"
            />
        </ProtectedRoute>
    );
} 