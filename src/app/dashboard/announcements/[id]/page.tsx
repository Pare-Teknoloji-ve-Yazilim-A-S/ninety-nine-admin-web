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
                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Back Button */}
                        <div className="mb-6">
                            <Button variant="ghost" size="md" icon={ArrowLeft} onClick={handleBack}>
                                Duyuru Listesine Dön
                            </Button>
                        </div>

                        {/* Announcement Details */}
                        <Card className="mb-6">
                            <div className="p-8">
                                {/* Header with title and badges */}
                                <div className="mb-6">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                                    {announcement.title}
                                                </h1>
                                                {announcement.isPinned && (
                                                    <Pin className="w-6 h-6 text-primary-gold" />
                                                )}
                                                {announcement.isEmergency && (
                                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status and Type Badges */}
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {renderStatusBadge(announcement)}
                                        <Badge
                                            variant="soft"
                                            color={getAnnouncementTypeColor(announcement.type) as any}
                                            className="text-sm px-4 py-2 rounded-full font-medium"
                                        >
                                            {getAnnouncementTypeLabel(announcement.type)}
                                        </Badge>
                                        {isExpired && (
                                            <Badge
                                                variant="soft"
                                                color="red"
                                                className="text-sm px-4 py-2 rounded-full font-medium"
                                            >
                                                Süresi Dolmuş
                                            </Badge>
                                        )}
                                        {isExpiringSoon && !isExpired && (
                                            <Badge
                                                variant="soft"
                                                color="gold"
                                                className="text-sm px-4 py-2 rounded-full font-medium"
                                            >
                                                Yakında Bitiyor
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {renderActionButtons(announcement)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                        Duyuru İçeriği
                                    </h3>
                                    <div className="prose prose-gray dark:prose-invert max-w-none">
                                        <p className="text-text-light-primary dark:text-text-primary whitespace-pre-wrap">
                                            {announcement.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Image */}
                                {announcement.imageUrl && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                            Görsel
                                        </h3>
                                        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <img
                                                src={announcement.imageUrl}
                                                alt={announcement.title}
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Date Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                                            Tarih Bilgileri
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-text-light-secondary dark:text-text-secondary" />
                                                <div>
                                                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                                        Oluşturulma Tarihi
                                                    </p>
                                                    <p className="text-text-on-light dark:text-text-on-dark">
                                                        {new Date(announcement.createdAt).toLocaleString('tr-TR')}
                                                    </p>
                                                </div>
                                            </div>
                                            {announcement.publishDate && (
                                                <div className="flex items-center gap-3">
                                                    <Send className="w-5 h-5 text-text-light-secondary dark:text-text-secondary" />
                                                    <div>
                                                        <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                                            Yayınlanma Tarihi
                                                        </p>
                                                        <p className="text-text-on-light dark:text-text-on-dark">
                                                            {new Date(announcement.publishDate).toLocaleString('tr-TR')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {announcement.expiryDate && (
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-text-light-secondary dark:text-text-secondary" />
                                                    <div>
                                                        <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                                            Bitiş Tarihi
                                                        </p>
                                                        <p className="text-text-on-light dark:text-text-on-dark">
                                                            {new Date(announcement.expiryDate).toLocaleString('tr-TR')}
                                                            {daysUntilExpiry !== undefined && (
                                                                <span className={`ml-2 text-sm ${
                                                                    isExpired ? 'text-red-500' : 
                                                                    isExpiringSoon ? 'text-yellow-500' : 
                                                                    'text-text-light-secondary dark:text-text-secondary'
                                                                }`}>
                                                                    ({isExpired 
                                                                        ? `${Math.abs(daysUntilExpiry)} gün geçti`
                                                                        : `${daysUntilExpiry} gün kaldı`
                                                                    })
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Author and Properties */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                                            Diğer Bilgiler
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <User className="w-5 h-5 text-text-light-secondary dark:text-text-secondary" />
                                                <div>
                                                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                                        Oluşturan
                                                    </p>
                                                    <p className="text-text-on-light dark:text-text-on-dark">
                                                        {announcement.createdBy 
                                                            ? `${announcement.createdBy.firstName} ${announcement.createdBy.lastName}`
                                                            : 'Bilinmiyor'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-text-light-secondary dark:text-text-secondary" />
                                                <div>
                                                    <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                                        Hedef Özellikler
                                                    </p>
                                                    <p className="text-text-on-light dark:text-text-on-dark">
                                                        {announcement.properties && announcement.properties.length > 0
                                                            ? `${announcement.properties.length} özellik seçildi`
                                                            : 'Tüm özellikler'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Properties List */}
                                {announcement.properties && announcement.properties.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                                            Hedef Özellikler
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {announcement.properties.map(property => (
                                                <div key={property.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                        {property.name}
                                                    </p>
                                                    {property.address && (
                                                        <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                            {property.address}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
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