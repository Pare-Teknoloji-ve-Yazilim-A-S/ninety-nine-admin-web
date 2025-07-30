// Bulk Actions for Announcements
import { announcementService } from '@/services';
import type { 
    Announcement, 
    AnnouncementBulkActionDto 
} from '@/services/types/announcement.types';
import { ANNOUNCEMENT_BULK_ACTIONS } from '../constants';

interface ToastFunctions {
    success: (title: string, message: string) => void;
    error: (title: string, message: string) => void;
    info: (title: string, message: string) => void;
}

interface DataUpdateFunctions {
    setAnnouncements: (announcements: Announcement[]) => void;
    refreshData: () => Promise<void>;
}

interface BulkDeleteState {
    isOpen: boolean;
    announcements: Announcement[];
    loading: boolean;
}

type SetBulkDeleteState = React.Dispatch<React.SetStateAction<BulkDeleteState>>;

export function createBulkActionHandlers(
    toastFunctions: ToastFunctions,
    dataUpdateFunctions: DataUpdateFunctions,
    bulkDeleteState: BulkDeleteState,
    setBulkDeleteState: SetBulkDeleteState
) {
    const getBulkActions = (selectedAnnouncements: Announcement[]) => {
        if (selectedAnnouncements.length === 0) return [];

        return ANNOUNCEMENT_BULK_ACTIONS.map(action => ({
            ...action,
            disabled: false, // You can add logic here to disable specific actions based on selection
            onClick: () => handleBulkAction(action.id, selectedAnnouncements),
        }));
    };

    const handleBulkAction = async (actionId: string, selectedAnnouncements: Announcement[]) => {
        if (selectedAnnouncements.length === 0) {
            toastFunctions.error('Hata', 'Lütfen en az bir duyuru seçin');
            return;
        }

        const ids = selectedAnnouncements.map(announcement => announcement.id);

        try {
            let bulkActionData: AnnouncementBulkActionDto;

            switch (actionId) {
                case 'publish':
                    bulkActionData = {
                        ids,
                        action: 'publish',
                        data: { status: 'PUBLISHED' as any }
                    };
                    break;
                case 'archive':
                    bulkActionData = {
                        ids,
                        action: 'archive',
                        data: { status: 'ARCHIVED' as any }
                    };
                    break;
                case 'pin':
                    bulkActionData = {
                        ids,
                        action: 'pin',
                        data: { isPinned: true }
                    };
                    break;
                case 'unpin':
                    bulkActionData = {
                        ids,
                        action: 'unpin',
                        data: { isPinned: false }
                    };
                    break;
                case 'mark_emergency':
                    bulkActionData = {
                        ids,
                        action: 'mark_emergency',
                        data: { isEmergency: true }
                    };
                    break;
                case 'unmark_emergency':
                    bulkActionData = {
                        ids,
                        action: 'unmark_emergency',
                        data: { isEmergency: false }
                    };
                    break;
                case 'delete':
                    setBulkDeleteState({
                        isOpen: true,
                        announcements: selectedAnnouncements,
                        loading: false
                    });
                    return;
                default:
                    toastFunctions.error('Hata', 'Bilinmeyen işlem');
                    return;
            }

            const response = await announcementService.bulkAction(bulkActionData);
            
            if (response.data?.success) {
                toastFunctions.success(
                    'Başarılı',
                    `${response.data.affectedCount} duyuru güncellendi`
                );
                await dataUpdateFunctions.refreshData();
            } else {
                toastFunctions.error('Hata', response.data?.message || 'İşlem başarısız');
            }
        } catch (error: any) {
            console.error('Bulk action failed:', error);
            toastFunctions.error('Hata', error?.message || 'Toplu işlem başarısız');
        }
    };

    const executeBulkDelete = async () => {
        if (bulkDeleteState.announcements.length === 0) return;

        setBulkDeleteState(prev => ({ ...prev, loading: true }));

        try {
            const ids = bulkDeleteState.announcements.map(announcement => announcement.id);
            const bulkActionData: AnnouncementBulkActionDto = {
                ids,
                action: 'delete'
            };

            const response = await announcementService.bulkAction(bulkActionData);
            
            if (response.data?.success) {
                toastFunctions.success(
                    'Başarılı',
                    `${response.data.affectedCount} duyuru silindi`
                );
                await dataUpdateFunctions.refreshData();
                setBulkDeleteState({
                    isOpen: false,
                    announcements: [],
                    loading: false
                });
            } else {
                toastFunctions.error('Hata', response.data?.message || 'Silme işlemi başarısız');
                setBulkDeleteState(prev => ({ ...prev, loading: false }));
            }
        } catch (error: any) {
            console.error('Bulk delete failed:', error);
            toastFunctions.error('Hata', error?.message || 'Silme işlemi başarısız');
            setBulkDeleteState(prev => ({ ...prev, loading: false }));
        }
    };

    return {
        getBulkActions,
        handleBulkAction,
        executeBulkDelete,
    };
}