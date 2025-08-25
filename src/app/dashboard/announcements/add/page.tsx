'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Button from '@/app/components/ui/Button';
import { ToastContainer } from '@/app/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { CREATE_ANNOUNCEMENT_PERMISSION_ID, CREATE_ANNOUNCEMENT_PERMISSION_NAME } from '@/app/components/ui/Sidebar';
import AnnouncementForm from '../components/AnnouncementForm';
import { announcementService } from '@/services';
import { ArrowLeft } from 'lucide-react';
import type { 
    AnnouncementFormData
} from '@/services/types/announcement.types';
import { getBreadcrumbItems } from '../constants';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles
    pageTitle: 'Yeni Duyuru',
    createAnnouncement: 'Yeni Duyuru Oluştur',
    
    // Breadcrumb
    dashboard: 'Dashboard',
    announcements: 'Duyurular',
    newAnnouncement: 'Yeni Duyuru',
    
    // Buttons
    backToList: 'Duyuru Listesine Dön',
    cancel: 'İptal',
    createButton: 'Duyuru Oluştur',
    saveChanges: 'Değişiklikleri Kaydet',
    
    // Messages
    description: 'Apartman sakinleri için yeni bir duyuru oluşturun. Duyurunuz oluşturulduktan sonra gerektiğinde düzenleyebilir veya yayınlayabilirsiniz.',
    
    // Toast messages
    success: 'Başarılı',
    error: 'Hata',
    announcementCreated: 'Duyuru başarıyla oluşturuldu',
    createError: 'Duyuru oluşturulurken bir hata oluştu'
  },
  en: {
    // Page titles
    pageTitle: 'New Announcement',
    createAnnouncement: 'Create New Announcement',
    
    // Breadcrumb
    dashboard: 'Dashboard',
    announcements: 'Announcements',
    newAnnouncement: 'New Announcement',
    
    // Buttons
    backToList: 'Back to Announcements',
    cancel: 'Cancel',
    createButton: 'Create Announcement',
    saveChanges: 'Save Changes',
    
    // Messages
    description: 'Create a new announcement for apartment residents. You can edit or publish your announcement after creation.',
    
    // Toast messages
    success: 'Success',
    error: 'Error',
    announcementCreated: 'Announcement created successfully',
    createError: 'An error occurred while creating the announcement'
  },
  ar: {
    // Page titles
    pageTitle: 'إعلان جديد',
    createAnnouncement: 'إنشاء إعلان جديد',
    
    // Breadcrumb
    dashboard: 'لوحة التحكم',
    announcements: 'الإعلانات',
    newAnnouncement: 'إعلان جديد',
    
    // Buttons
    backToList: 'العودة إلى الإعلانات',
    cancel: 'إلغاء',
    createButton: 'إنشاء إعلان',
    saveChanges: 'حفظ التغييرات',
    
    // Messages
    description: 'أنشئ إعلاناً جديداً لسكان الشقة. يمكنك تعديل أو نشر إعلانك بعد الإنشاء.',
    
    // Toast messages
    success: 'نجح',
    error: 'خطأ',
    announcementCreated: 'تم إنشاء الإعلان بنجاح',
    createError: 'حدث خطأ أثناء إنشاء الإعلان'
  }
};

/**
 * Create Announcement Page Component
 * 
 * Provides form interface for creating new announcements
 */
export default function CreateAnnouncementPage() {
    // Dil tercihini localStorage'dan al
    const [currentLanguage, setCurrentLanguage] = useState('tr');
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Çevirileri al
    const t = translations[currentLanguage as keyof typeof translations];

    const router = useRouter();
    const { toasts, removeToast } = useToast();
    const permissionCheck = usePermissionCheck();
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Check CREATE_ANNOUNCEMENT permission
    const hasCreateAnnouncementPermission = permissionCheck.hasPermission(CREATE_ANNOUNCEMENT_PERMISSION_ID);

    // Redirect if no permission
    useEffect(() => {
        if (!hasCreateAnnouncementPermission) {
            showToast('error', 'Hata', 'Bu sayfaya erişim yetkiniz bulunmamaktadır.');
            router.push('/dashboard/announcements');
        }
    }, [hasCreateAnnouncementPermission, router]);

    // Breadcrumb items
    const breadcrumbItems = getBreadcrumbItems(currentLanguage).concat([
        { label: t.newAnnouncement, href: '/dashboard/announcements/add' }
    ]);

    // Toast functions
    const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
        console.log(`${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'} ${title}: ${message}`);
    }, []);

    // Form submission handler
    const handleSubmit = useCallback(async (formData: AnnouncementFormData) => {
        console.log('[CreateAnnouncementPage] submit called with', formData);
        setLoading(true);

        try {
            // Build multipart form data per new API
            const fd = new FormData();
            fd.append('title', formData.title);
            fd.append('content', formData.content);
            if (formData.type) fd.append('type', String(formData.type));
            if (formData.status) fd.append('status', String(formData.status));
            if (formData.publishDate) fd.append('publishDate', formData.publishDate.toISOString());
            if (formData.expiryDate) fd.append('expiryDate', formData.expiryDate.toISOString());
            if (typeof formData.isPinned === 'boolean') fd.append('isPinned', String(formData.isPinned));
            if (typeof formData.isEmergency === 'boolean') fd.append('isEmergency', String(formData.isEmergency));
            if (formData.propertyIds && formData.propertyIds.length > 0) {
                formData.propertyIds.forEach((id) => fd.append('propertyIds', id));
            }
            if (formData.files && formData.files.length > 0) {
                formData.files.slice(0, 10).forEach((file) => fd.append('files', file));
            } else if (formData.image) {
                // Backward compatibility if only single image selected
                fd.append('files', formData.image);
            }

            // Create announcement (multipart)
            console.log('[CreateAnnouncementPage] creating announcement (multipart)');
            const response = await announcementService.createAnnouncement(fd);
            console.log('[CreateAnnouncementPage] create response', response);
            // API now returns entity under data: {}
            const announcementId = (response as any)?.data?.id || (response as any)?.data?.data?.id;

            showToast('success', t.success, t.announcementCreated);
            
            // Redirect to announcement detail page
            router.push(`/dashboard/announcements/${announcementId}`);
        } catch (error: any) {
            console.error('Failed to create announcement:', error);
            showToast('error', t.error, error?.message || t.createError);
        } finally {
            setLoading(false);
        }
    }, [router, showToast, t]);

    // Cancel handler
    const handleCancel = useCallback(() => {
        router.push('/dashboard/announcements');
    }, [router]);

    // Back handler
    const handleBack = useCallback(() => {
        router.push('/dashboard/announcements');
    }, [router]);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content Area */}
                <div className="lg:ml-72">
                    {/* Header */}
                    <DashboardHeader title={t.pageTitle} breadcrumbItems={breadcrumbItems} />

                    {/* Main Content */}
                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Back Button */}
                        <div className="mb-6">
                            <Button variant="ghost" size="md" icon={ArrowLeft} onClick={handleBack}>
                                {t.backToList}
                            </Button>
                        </div>

                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2">
                                {t.createButton}
                            </h1>
                            <p className="text-text-light-secondary dark:text-text-secondary">
                                {t.description}
                            </p>
                        </div>

                        {/* Announcement Form */}
                        <AnnouncementForm
                            mode="create"
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