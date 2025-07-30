'use client';

import React, { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Skeleton from '@/app/components/ui/Skeleton';
import { ToastContainer } from '@/app/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import AnnouncementForm from '../../components/AnnouncementForm';
import { useAnnouncementDetail } from '../../hooks/useAnnouncementDetail';
import { announcementService } from '@/services';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import type { 
    AnnouncementFormData, 
    UpdateAnnouncementDto 
} from '@/services/types/announcement.types';

/**
 * Edit Announcement Page Component
 * 
 * Provides form interface for editing existing announcements
 */
export default function EditAnnouncementPage() {
    const router = useRouter();
    const params = useParams();
    const { toasts, removeToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const announcementId = params?.id as string;

    // Data hook
    const { announcement, loading: fetchLoading, error, refreshAnnouncement } = useAnnouncementDetail({
        announcementId
    });

    // Breadcrumb items
    const breadcrumbItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Duyurular', href: '/dashboard/announcements' },
        { label: announcement?.title || 'Duyuru', href: `/dashboard/announcements/${announcementId}` },
        { label: 'Düzenle', href: `/dashboard/announcements/${announcementId}/edit` }
    ];

    // Toast functions
    const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
        console.log(`${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'} ${title}: ${message}`);
    }, []);

    // Form submission handler
    const handleSubmit = useCallback(async (formData: AnnouncementFormData) => {
        if (!announcement) return;

        setLoading(true);

        try {
            // Prepare data for API
            const updateData: UpdateAnnouncementDto = {
                title: formData.title,
                content: formData.content,
                type: formData.type,
                status: formData.status,
                publishDate: formData.publishDate?.toISOString(),
                expiryDate: formData.expiryDate?.toISOString(),
                isPinned: formData.isPinned,
                isEmergency: formData.isEmergency,
                propertyIds: formData.propertyIds.length > 0 ? formData.propertyIds : undefined,
            };

            // Update announcement
            await announcementService.updateAnnouncement(announcement.id, updateData);
            
            // Upload new image if provided
            if (formData.image) {
                try {
                    await announcementService.uploadAnnouncementImage(announcement.id, formData.image);
                } catch (imageError) {
                    console.warn('Image upload failed:', imageError);
                    showToast('info', 'Uyarı', 'Duyuru güncellendi ancak görsel yüklenemedi');
                }
            }

            showToast('success', 'Başarılı', 'Duyuru başarıyla güncellendi');
            
            // Redirect to announcement detail page
            router.push(`/dashboard/announcements/${announcement.id}`);
        } catch (error: any) {
            console.error('Failed to update announcement:', error);
            showToast('error', 'Hata', error?.message || 'Duyuru güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }, [announcement, router, showToast]);

    // Cancel handler
    const handleCancel = useCallback(() => {
        if (announcement) {
            router.push(`/dashboard/announcements/${announcement.id}`);
        } else {
            router.push('/dashboard/announcements');
        }
    }, [announcement, router]);

    // Back handler
    const handleBack = useCallback(() => {
        if (announcement) {
            router.push(`/dashboard/announcements/${announcement.id}`);
        } else {
            router.push('/dashboard/announcements');
        }
    }, [announcement, router]);

    // Loading state
    if (fetchLoading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader title="Duyuru Düzenle" breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="mb-6">
                                <Skeleton className="h-10 w-48" />
                            </div>
                            <div className="mb-8">
                                <Skeleton className="h-8 w-64 mb-2" />
                                <Skeleton className="h-4 w-96" />
                            </div>
                            <div className="space-y-6">
                                <Card className="p-6">
                                    <Skeleton className="h-6 w-32 mb-6" />
                                    <div className="space-y-4">
                                        <Skeleton className="h-12 w-full" />
                                        <Skeleton className="h-32 w-full" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Skeleton className="h-12 w-full" />
                                            <Skeleton className="h-12 w-full" />
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-6">
                                    <Skeleton className="h-6 w-32 mb-6" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Skeleton className="h-12 w-full" />
                                        <Skeleton className="h-12 w-full" />
                                    </div>
                                </Card>
                            </div>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    // Error state
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
                                        {error || 'Düzenlemek istediğiniz duyuru bulunamadı veya silinmiş olabilir.'}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button variant="ghost" size="md" onClick={() => router.push('/dashboard/announcements')}>
                                        Duyuru Listesine Dön
                                    </Button>
                                    <Button variant="primary" size="md" onClick={refreshAnnouncement}>
                                        Tekrar Dene
                                    </Button>
                                </div>
                            </Card>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content Area */}
                <div className="lg:ml-72">
                    {/* Header */}
                    <DashboardHeader title="Duyuru Düzenle" breadcrumbItems={breadcrumbItems} />

                    {/* Main Content */}
                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Back Button */}
                        <div className="mb-6">
                            <Button variant="ghost" size="md" icon={ArrowLeft} onClick={handleBack}>
                                Duyuru Detayına Dön
                            </Button>
                        </div>

                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2">
                                Duyuru Düzenle
                            </h1>
                            <p className="text-text-light-secondary dark:text-text-secondary">
                                "{announcement.title}" duyurusunu düzenleyebilirsiniz. Değişiklikler kaydedildikten sonra
                                duyuru sakinler tarafından görülebilir.
                            </p>
                        </div>

                        {/* Announcement Form */}
                        <AnnouncementForm
                            mode="edit"
                            initialData={announcement}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            loading={loading}
                        />
                    </main>
                </div>

                {/* Toast Container */}
                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </div>
        </ProtectedRoute>
    );
}