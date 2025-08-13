'use client';

import React, { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Skeleton from '@/app/components/ui/Skeleton';
import ConfirmationModal from '@/app/components/ui/ConfirmationModal';
import { ToastContainer } from '@/app/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { useAnnouncementDetail } from '../hooks/useAnnouncementDetail';
import { createAnnouncementActionHandlers } from '../actions/announcement-actions';
import {
    ArrowLeft, Edit, Trash2, Archive, Send, Pin, AlertTriangle, 
    Copy, Calendar, User, MapPin, Clock, Eye, Download
} from 'lucide-react';
import {
    getAnnouncementTypeLabel,
    getAnnouncementStatusLabel,
    getAnnouncementTypeColor,
    getAnnouncementStatusColor,
    isAnnouncementExpired,
    isAnnouncementExpiringSoon,
    getDaysUntilExpiry,
    AnnouncementStatus
} from '@/services/types/announcement.types';
import type { Announcement } from '@/services/types/announcement.types';

/**
 * Announcement Detail Page Component
 * 
 * Shows detailed view of a single announcement with action buttons
 */
export default function AnnouncementDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { toasts, removeToast } = useToast();
    const announcementId = params?.id as string;

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [confirmationState, setConfirmationState] = useState<{
        isOpen: boolean;
        action: string;
        loading: boolean;
    }>({
        isOpen: false,
        action: '',
        loading: false
    });

    // Data hook
    const { announcement, loading, error, refreshAnnouncement } = useAnnouncementDetail({
        announcementId
    });

    // Toast functions
    const toastFunctions = {
        success: useCallback((title: string, message: string) => {
            console.log(`✓ ${title}: ${message}`);
        }, []),
        info: useCallback((title: string, message: string) => {
            console.info(`${title}: ${message}`);
        }, []),
        error: useCallback((title: string, message: string) => {
            console.error(`✗ ${title}: ${message}`);
        }, [])
    };

    // Data update functions
    const dataUpdateFunctions = {
        setAnnouncements: () => {}, // Not needed for detail view
        refreshData: refreshAnnouncement
    };

    // Action handlers
    const actionHandlers = createAnnouncementActionHandlers(
        toastFunctions,
        dataUpdateFunctions,
        announcement ? [announcement] : []
    );

    // Breadcrumb items
    const breadcrumbItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Duyurular', href: '/dashboard/announcements' },
        { label: announcement?.title || 'Duyuru Detayı', href: `/dashboard/announcements/${announcementId}` }
    ];

    // Action handlers
    const handleBack = useCallback(() => {
        router.push('/dashboard/announcements');
    }, [router]);

    const handleEdit = useCallback(() => {
        if (announcement) {
            router.push(`/dashboard/announcements/${announcement.id}/edit`);
        }
    }, [announcement, router]);

    const handleDelete = useCallback(() => {
        setConfirmationState({
            isOpen: true,
            action: 'delete',
            loading: false
        });
    }, []);

    const handlePublish = useCallback(async () => {
        if (announcement) {
            await actionHandlers.handlePublishAnnouncement(announcement);
            await refreshAnnouncement();
        }
    }, [announcement, actionHandlers, refreshAnnouncement]);

    const handleArchive = useCallback(async () => {
        if (announcement) {
            await actionHandlers.handleArchiveAnnouncement(announcement);
            await refreshAnnouncement();
        }
    }, [announcement, actionHandlers, refreshAnnouncement]);

    const handleTogglePin = useCallback(async () => {
        if (announcement) {
            await actionHandlers.handleTogglePin(announcement);
            await refreshAnnouncement();
        }
    }, [announcement, actionHandlers, refreshAnnouncement]);

    const handleToggleEmergency = useCallback(async () => {
        if (announcement) {
            await actionHandlers.handleToggleEmergency(announcement);
            await refreshAnnouncement();
        }
    }, [announcement, actionHandlers, refreshAnnouncement]);

    const handleDuplicate = useCallback(async () => {
        if (announcement) {
            await actionHandlers.handleDuplicateAnnouncement(announcement);
        }
    }, [announcement, actionHandlers]);

    const handleConfirmAction = useCallback(async () => {
        if (!announcement) return;

        setConfirmationState(prev => ({ ...prev, loading: true }));

        try {
            switch (confirmationState.action) {
                case 'delete':
                    await actionHandlers.handleDeleteAnnouncement(announcement);
                    router.push('/dashboard/announcements');
                    break;
                default:
                    break;
            }
            setConfirmationState({ isOpen: false, action: '', loading: false });
        } catch (error) {
            setConfirmationState(prev => ({ ...prev, loading: false }));
        }
    }, [announcement, confirmationState.action, actionHandlers, router]);

    // Render helper functions
    const renderStatusBadge = (announcement: Announcement) => {
        const isExpired = isAnnouncementExpired(announcement);
        const isExpiringSoon = isAnnouncementExpiringSoon(announcement);
        
        let statusColor = getAnnouncementStatusColor(announcement.status);
        let statusLabel = getAnnouncementStatusLabel(announcement.status);
        
        if (isExpired) {
            statusColor = 'red';
            statusLabel += ' (Süresi Dolmuş)';
        } else if (isExpiringSoon) {
            statusColor = 'gold';
            statusLabel += ' (Yakında Bitiyor)';
        }
        
        return (
            <Badge
                variant="soft"
                color={statusColor as any}
                className="text-sm px-4 py-2 rounded-full font-medium"
            >
                {statusLabel}
            </Badge>
        );
    };

    const renderActionButtons = (announcement: Announcement) => {
        const buttons = [];

        // Edit button - always available
        buttons.push(
            <Button key="edit" variant="secondary" size="md" icon={Edit} onClick={handleEdit}>
                Düzenle
            </Button>
        );

        // Status-specific actions
        if (announcement.status === AnnouncementStatus.DRAFT) {
            buttons.push(
                <Button key="publish" variant="primary" size="md" icon={Send} onClick={handlePublish}>
                    Yayınla
                </Button>
            );
        }

        if (announcement.status === AnnouncementStatus.PUBLISHED) {
            buttons.push(
                <Button key="archive" variant="secondary" size="md" icon={Archive} onClick={handleArchive}>
                    Arşivle
                </Button>
            );
        }

        // Pin/Unpin button
        buttons.push(
            <Button 
                key="pin" 
                variant="ghost" 
                size="md" 
                icon={Pin} 
                onClick={handleTogglePin}
                className={announcement.isPinned ? 'text-primary-gold' : ''}
            >
                {announcement.isPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
            </Button>
        );

        // Emergency toggle
        buttons.push(
            <Button 
                key="emergency" 
                variant="ghost" 
                size="md" 
                icon={AlertTriangle} 
                onClick={handleToggleEmergency}
                className={announcement.isEmergency ? 'text-red-500' : ''}
            >
                {announcement.isEmergency ? 'Acil İşaretini Kaldır' : 'Acil Olarak İşaretle'}
            </Button>
        );

        // Duplicate button
        buttons.push(
            <Button key="duplicate" variant="ghost" size="md" icon={Copy} onClick={handleDuplicate}>
                Kopyala
            </Button>
        );

        // Delete button
        buttons.push(
            <Button key="delete" variant="danger" size="md" icon={Trash2} onClick={handleDelete}>
                Sil
            </Button>
        );

        return buttons;
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader title="Duyuru Detayı" breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="p-8">
                                <Skeleton className="h-8 w-3/4 mb-4" />
                                <Skeleton className="h-4 w-1/2 mb-6" />
                                <Skeleton className="h-32 w-full mb-6" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-10 w-24" />
                                    <Skeleton className="h-10 w-24" />
                                    <Skeleton className="h-10 w-24" />
                                </div>
                            </Card>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error || !announcement) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader title="Duyuru Bulunamadı" breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="p-8 text-center">
                                <div className="mb-6">
                                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                    <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                                        Duyuru Bulunamadı
                                    </h2>
                                    <p className="text-text-light-secondary dark:text-text-secondary">
                                        {error || 'Aradığınız duyuru bulunamadı veya silinmiş olabilir.'}
                                    </p>
                                </div>
                                <Button variant="primary" size="md" icon={ArrowLeft} onClick={handleBack}>
                                    Duyuru Listesine Dön
                                </Button>
                            </Card>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const isExpired = isAnnouncementExpired(announcement);
    const isExpiringSoon = isAnnouncementExpiringSoon(announcement);
    const daysUntilExpiry = getDaysUntilExpiry(announcement);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content Area */}
                <div className="lg:ml-72">
                    {/* Header */}
                    <DashboardHeader title="Duyuru Detayı" breadcrumbItems={breadcrumbItems} />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        {/* Back Button */}
                        <div className="mb-6">
                            <Button variant="ghost" size="md" icon={ArrowLeft} onClick={handleBack}>
                                Duyuru Listesine Dön
                            </Button>
                        </div>

                        {/* Sağ üst aksiyonlar */}
                        <div className="mb-4 flex justify-end gap-3">
                            <Button variant="secondary" size="md" icon={Edit} onClick={handleEdit}>
                                Düzenle
                            </Button>
                            <Button variant="danger" size="md" icon={Trash2} onClick={handleDelete}>
                                Kaldır
                            </Button>
                        </div>

                        {/* Üst dizilim: Sol büyük kart (Başlık ve İçerik) + Sağ küçük kart (Yayın/Bitiş/Tip) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
                            {/* Sol: Başlık ve İçerik */}
                            <div className="lg:col-span-2">
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-6">Başlık ve İçerik</h2>
                                <Card className="shadow-lg">
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <p className="text-xs text-text-light-secondary dark:text-text-secondary">Başlık</p>
                                            <p className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">{announcement.title}</p>
                                            {/* Alt başlık satırı: A1 Daire 13 • Dolu • A Blok Blok • 10. Kat • 170 m² */}
                                            {Array.isArray(announcement.properties) && announcement.properties.length > 0 && (
                                                <p className="text-sm text-text-light-secondary dark:text-text-secondary mt-1">
                                                    {/* Varsayılan ilk property üzerinden gösterim */}
                                                    {(() => {
                                                        const p: any = announcement.properties![0];
                                                        const name = p?.name || '';
                                                        const status = p?.status ? (p.status === 'OCCUPIED' ? 'Dolu' : p.status) : '';
                                                        const block = p?.block || p?.blockNumber || 'A';
                                                        const floor = p?.floor ?? 0;
                                                        const area = p?.area ?? 0;
                                                        const parts: string[] = [];
                                                        if (name) parts.push(name);
                                                        if (status) parts.push(status);
                                                        parts.push(`${block} Blok Blok`);
                                                        parts.push(`${floor}. Kat`);
                                                        parts.push(`${area} m²`);
                                                        return parts.join(' • ');
                                                    })()}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-light-secondary dark:text-text-secondary mb-1">İçerik</p>
                                            <p className="text-sm text-text-on-light dark:text-text-on-dark whitespace-pre-wrap">{announcement.content}</p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Görsel Kartı */}
                                <div className="mt-6">
                                    <Card className="shadow-md">
                                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                            <h3 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">Görsel</h3>
                                        </div>
                                        <div className="p-6">
                                            {announcement.imageUrl ? (
                                                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                    <img src={announcement.imageUrl} alt={announcement.title} className="w-full h-auto" />
                                                </div>
                                            ) : (
                                                <div className="h-56 flex items-center justify-center rounded-lg bg-background-light-soft dark:bg-background-soft text-text-light-secondary dark:text-text-secondary">
                                                    Görsel bulunamadı
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                            {/* Sağ: Küçük özet kartı */}
                            <div className="lg:sticky lg:top-24">
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-6">Duyuru Bilgileri</h2>
                                <Card className="shadow-md">
                                    <div className="p-6 space-y-6">
                                        {/* Tip */}
                                        <div>
                                            <p className="text-xs text-text-light-secondary dark:text-text-secondary mb-1">Tip</p>
                                            <p className={`text-sm font-medium ${announcement.type === 'EMERGENCY' ? 'text-primary-red' : 'text-text-on-light dark:text-text-on-dark'}`}>
                                                {getAnnouncementTypeLabel(announcement.type)}
                                            </p>
                                        </div>
                                        {/* Tarihler yan yana */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-xs text-text-light-secondary dark:text-text-secondary mb-1">Yayınlanma Tarihi</p>
                                                <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">{announcement.publishDate ? new Date(announcement.publishDate).toLocaleDateString('tr-TR') : '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-light-secondary dark:text-text-secondary mb-1">Bitiş Tarihi</p>
                                                <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">{announcement.expiryDate ? new Date(announcement.expiryDate).toLocaleDateString('tr-TR') : '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Alt içerikler burada devam eder (gerekirse ek kartlar) */}
                    </main>
                </div>

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={confirmationState.isOpen}
                    onClose={() => setConfirmationState({ isOpen: false, action: '', loading: false })}
                    onConfirm={handleConfirmAction}
                    title="Duyuru Silme"
                    variant="danger"
                    loading={confirmationState.loading}
                    itemName={announcement?.title}
                    itemType="duyuru"
                />

                {/* Toast Container */}
                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </div>
        </ProtectedRoute>
    );
}