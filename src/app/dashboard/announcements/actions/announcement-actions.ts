// Individual Announcement Actions
import { announcementService } from '@/services';
import type { Announcement } from '@/services/types/announcement.types';

interface ToastFunctions {
    success: (title: string, message: string) => void;
    error: (title: string, message: string) => void;
    info: (title: string, message: string) => void;
}

interface DataUpdateFunctions {
    setAnnouncements: (announcements: Announcement[]) => void;
    refreshData: () => Promise<void>;
}

export function createAnnouncementActionHandlers(
    toastFunctions: ToastFunctions,
    dataUpdateFunctions: DataUpdateFunctions,
    currentAnnouncements: Announcement[]
) {
    const handleViewAnnouncement = (announcement: Announcement) => {
        // Navigate to announcement detail page
        window.location.href = `/dashboard/announcements/${announcement.id}`;
    };

    const handleEditAnnouncement = (announcement: Announcement) => {
        // Navigate to announcement edit page
        window.location.href = `/dashboard/announcements/${announcement.id}/edit`;
    };

    const handleDeleteAnnouncement = async (announcement: Announcement) => {
        try {
            await announcementService.deleteAnnouncement(announcement.id);
            
            toastFunctions.success(
                'Başarılı',
                `"${announcement.title}" duyurusu silindi`
            );

            // Update local state by removing the deleted announcement
            const updatedAnnouncements = currentAnnouncements.filter(a => a.id !== announcement.id);
            dataUpdateFunctions.setAnnouncements(updatedAnnouncements);
            
            // Refresh data to ensure consistency
            await dataUpdateFunctions.refreshData();
        } catch (error: any) {
            console.error('Failed to delete announcement:', error);
            toastFunctions.error('Hata', error?.message || 'Duyuru silinirken bir hata oluştu');
        }
    };

    const handlePublishAnnouncement = async (announcement: Announcement) => {
        try {
            await announcementService.publishAnnouncement(announcement.id);
            
            toastFunctions.success(
                'Başarılı',
                `"${announcement.title}" duyurusu yayınlandı`
            );

            await dataUpdateFunctions.refreshData();
        } catch (error: any) {
            console.error('Failed to publish announcement:', error);
            toastFunctions.error('Hata', error?.message || 'Duyuru yayınlanırken bir hata oluştu');
        }
    };

    const handleArchiveAnnouncement = async (announcement: Announcement) => {
        try {
            await announcementService.archiveAnnouncement(announcement.id);
            
            toastFunctions.success(
                'Başarılı',
                `"${announcement.title}" duyurusu arşivlendi`
            );

            await dataUpdateFunctions.refreshData();
        } catch (error: any) {
            console.error('Failed to archive announcement:', error);
            toastFunctions.error('Hata', error?.message || 'Duyuru arşivlenirken bir hata oluştu');
        }
    };

    const handleTogglePin = async (announcement: Announcement) => {
        try {
            const newPinnedState = !announcement.isPinned;
            await announcementService.updateAnnouncement(announcement.id, {
                isPinned: newPinnedState
            });
            
            toastFunctions.success(
                'Başarılı',
                `"${announcement.title}" duyurusu ${newPinnedState ? 'sabitlendi' : 'sabitleme kaldırıldı'}`
            );

            await dataUpdateFunctions.refreshData();
        } catch (error: any) {
            console.error('Failed to toggle pin status:', error);
            toastFunctions.error('Hata', error?.message || 'Sabitleme durumu değiştirilemedi');
        }
    };

    const handleToggleEmergency = async (announcement: Announcement) => {
        try {
            const newEmergencyState = !announcement.isEmergency;
            await announcementService.updateAnnouncement(announcement.id, {
                isEmergency: newEmergencyState
            });
            
            toastFunctions.success(
                'Başarılı',
                `"${announcement.title}" duyurusu ${newEmergencyState ? 'acil olarak işaretlendi' : 'acil işareti kaldırıldı'}`
            );

            await dataUpdateFunctions.refreshData();
        } catch (error: any) {
            console.error('Failed to toggle emergency status:', error);
            toastFunctions.error('Hata', error?.message || 'Acil durum işareti değiştirilemedi');
        }
    };

    const handleDuplicateAnnouncement = async (announcement: Announcement) => {
        try {
            const duplicateData = {
                title: `${announcement.title} (Kopya)`,
                content: announcement.content,
                type: announcement.type,
                status: 'DRAFT' as any,
                isEmergency: announcement.isEmergency,
                isPinned: false, // Don't pin duplicates
                propertyIds: announcement.properties?.map(p => p.id) || [],
            };

            await announcementService.createAnnouncement(duplicateData);
            
            toastFunctions.success(
                'Başarılı',
                `"${announcement.title}" duyurusu kopyalandı`
            );

            await dataUpdateFunctions.refreshData();
        } catch (error: any) {
            console.error('Failed to duplicate announcement:', error);
            toastFunctions.error('Hata', error?.message || 'Duyuru kopyalanırken bir hata oluştu');
        }
    };

    return {
        handleViewAnnouncement,
        handleEditAnnouncement,
        handleDeleteAnnouncement,
        handlePublishAnnouncement,
        handleArchiveAnnouncement,
        handleTogglePin,
        handleToggleEmergency,
        handleDuplicateAnnouncement,
    };
}