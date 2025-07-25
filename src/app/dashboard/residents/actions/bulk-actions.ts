import { Resident } from '@/app/components/ui/ResidentRow';
import { BulkAction } from '../types';
import { BULK_ACTION_IDS } from '../constants';
import {
    Mail,
    MessageSquare,
    FileText,
    Tag,
    UserCheck,
    UserX,
    Trash2
} from 'lucide-react';
import { residentService } from '@/services/resident.service';
import { BulkActionDto } from '@/services/types/resident.types';

/**
 * Toast notification functions interface
 */
interface ToastFunctions {
    success: (title: string, message: string) => void;
    info: (title: string, message: string) => void;
    error: (title: string, message: string) => void;
}

interface BulkMessageState {
    isOpen: boolean;
    type: 'email' | 'sms' | null;
    recipients: Resident[];
}

interface DataUpdateFunctions {
    setResidents: (residents: Resident[]) => void;
    refreshData: () => void;
}

/**
 * Bulk action handlers class
 */
export class BulkActionHandlers {
    private toast: ToastFunctions;
    private messageState: BulkMessageState;
    private setMessageState: (state: BulkMessageState) => void;
    private dataUpdateFunctions: DataUpdateFunctions;

    constructor(
        toast: ToastFunctions,
        messageState: BulkMessageState,
        setMessageState: (state: BulkMessageState) => void,
        dataUpdateFunctions: DataUpdateFunctions
    ) {
        this.toast = toast;
        this.messageState = messageState;
        this.setMessageState = setMessageState;
        this.dataUpdateFunctions = dataUpdateFunctions;
    }

    /**
     * Handle bulk email action
     */
    handleBulkMail = (residents: Resident[]): void => {
        const validRecipients = residents.filter(r => r.contact.email && r.contact.email !== 'Belirtilmemiş');

        if (validRecipients.length === 0) {
            this.toast.error(
                'Hata',
                'Seçili sakinler arasında geçerli e-posta adresi bulunamadı.'
            );
            return;
        }

        this.setMessageState({
            isOpen: true,
            type: 'email',
            recipients: validRecipients
        });
    };

    /**
     * Handle bulk SMS action
     */
    handleBulkSMS = (residents: Resident[]): void => {
        const validRecipients = residents.filter(r => r.contact.phone && r.contact.phone !== 'Belirtilmemiş');

        if (validRecipients.length === 0) {
            this.toast.error(
                'Hata',
                'Seçili sakinler arasında geçerli telefon numarası bulunamadı.'
            );
            return;
        }

        this.setMessageState({
            isOpen: true,
            type: 'sms',
            recipients: validRecipients
        });
    };

    /**
     * Handle message sending
     */
    handleSendMessage = async (message: string): Promise<void> => {
        const { type, recipients } = this.messageState;
        const isEmail = type === 'email';

        try {
            // TODO: Implement actual sending logic
            await new Promise(resolve => setTimeout(resolve, 1000));

            const recipientList = recipients
                .map(r => isEmail ? r.contact.email : r.contact.phone)
                .join(', ');

            this.toast.success(
                isEmail ? 'E-posta Gönderildi' : 'SMS Gönderildi',
                `${recipients.length} alıcıya başarıyla gönderildi: ${recipientList}`
            );
        } catch (error) {
            this.toast.error(
                'Gönderim Hatası',
                'Mesaj gönderimi sırasında bir hata oluştu.'
            );
        }
    };

    /**
     * Handle bulk PDF generation
     */
    handleBulkPDF = (residents: Resident[]): void => {
        this.toast.info(
            'PDF Oluşturuluyor',
            `${residents.length} sakin için PDF raporu hazırlanıyor`
        );

        // Simulate PDF generation
        setTimeout(() => {
            this.toast.success(
                'PDF Hazır',
                'Sakin raporu başarıyla oluşturuldu ve indiriliyor'
            );
        }, 2000);
    };

    /**
     * Handle bulk status change with API call
     */
    handleBulkStatusChange = async (residents: Resident[], status: 'activate' | 'deactivate'): Promise<void> => {
        try {
            // Filter residents that actually need status change
            const residentsToUpdate = residents.filter(resident => {
                const currentStatus = resident.status?.type || resident.status;
                if (status === 'activate') {
                    return currentStatus !== 'active';
                } else if (status === 'deactivate') {
                    return currentStatus !== 'inactive';
                }
                return false;
            });

            if (residentsToUpdate.length === 0) {
                const statusLabel = status === 'activate' ? 'aktif' : 'pasif';
                this.toast.info(
                    'Durum Güncelleme',
                    `Seçili sakinler zaten ${statusLabel} durumunda.`
                );
                return;
            }

            this.toast.info(
                'Durum Güncelleniyor',
                `${residentsToUpdate.length} sakin için durum güncelleniyor...`
            );

            if (status === 'activate') {
                // Use bulk action API for activate
                const bulkActionData: BulkActionDto = {
                    action: 'activate',
                    userIds: residentsToUpdate.map(r => String(r.id)),
                    reason: 'Toplu durum güncelleme: Aktif yapıldı',
                };

                const response = await residentService.bulkAction(bulkActionData);

                if (response.success) {
                    console.log("BİLMİYOM  response", response);
                    this.toast.success(
                        'Durum Güncellendi',
                        `Seçili sakinler başarıyla aktif durumuna geçirildi.`
                    );

                   
                    // Refresh data to show updated statuses
                    this.dataUpdateFunctions.refreshData();
                } else {
                    throw new Error(response.data.message || 'Bilinmeyen hata');
                }
            } else {
                // Use individual updates for deactivate since bulk API doesn't support INACTIVE
                let successCount = 0;
                let errorCount = 0;
                const errors: string[] = [];

                for (const resident of residentsToUpdate) {
                    try {
                        await residentService.updateResident(String(resident.id), {
                            status: 'INACTIVE'
                        });
                        successCount++;
                    } catch (error: any) {
                        errorCount++;
                        errors.push(`${resident.firstName} ${resident.lastName}: ${error?.message || 'Hata'}`);
                    }
                }

                if (errorCount === 0) {
                    this.toast.success(
                        'Durum Güncellendi',
                        `${successCount} sakin başarıyla pasif durumuna geçirildi.`
                    );
                } else {
                    this.toast.success(
                        'Durum Kısmen Güncellendi',
                        `${successCount} sakin pasif yapıldı, ${errorCount} sakin için hata oluştu.`
                    );
                }

                // Refresh data to show updated statuses  
                this.dataUpdateFunctions.refreshData();
            }

        } catch (error: any) {
            console.error('Bulk status update error:', error);
            this.toast.error(
                'Durum Güncelleme Hatası',
                error?.message || 'Sakin durumları güncellenirken bir hata oluştu.'
            );
        }
    };

    /**
     * Handle bulk delete - Note: API doesn't support delete action, so we'll show an error
     */
    handleBulkDelete = async (residents: Resident[]): Promise<void> => {
        this.toast.error(
            'İşlem Desteklenmiyor',
            'Toplu silme işlemi şu anda API tarafından desteklenmiyor. Lütfen sakinleri tek tek silin.'
        );
    };

    /**
     * Get bulk actions configuration with conditional visibility
     */
    getBulkActions = (selectedResidents: Resident[]): BulkAction[] => {
        // Analyze selected residents to determine which actions should be available
        const activeResidents = selectedResidents.filter(r => {
            const status = r.status?.type || r.status;
            return status === 'active';
        });

        const inactiveResidents = selectedResidents.filter(r => {
            const status = r.status?.type || r.status;
            return status === 'inactive' || status === 'suspended' || status === 'pending';
        });

        const actions: BulkAction[] = [
            {
                id: BULK_ACTION_IDS.MAIL,
                label: 'Toplu Mail',
                icon: Mail,
                onClick: this.handleBulkMail
            },
            {
                id: BULK_ACTION_IDS.SMS,
                label: 'SMS Gönder',
                icon: MessageSquare,
                onClick: this.handleBulkSMS
            },
            {
                id: BULK_ACTION_IDS.PDF,
                label: 'PDF Oluştur',
                icon: FileText,
                onClick: this.handleBulkPDF
            }
        ];

        // Only show "Aktif Yap" if there are inactive residents
        if (inactiveResidents.length > 0) {
            actions.push({
                id: BULK_ACTION_IDS.ACTIVATE,
                label: `Aktif Yap (${inactiveResidents.length})`,
                icon: UserCheck,
                onClick: (residents: Resident[]) => this.handleBulkStatusChange(residents, 'activate')
            });
        }

        // Only show "Pasif Yap" if there are active residents
        if (activeResidents.length > 0) {
            actions.push({
                id: BULK_ACTION_IDS.DEACTIVATE,
                label: `Pasif Yap (${activeResidents.length})`,
                icon: UserX,
                onClick: (residents: Resident[]) => this.handleBulkStatusChange(residents, 'deactivate'),
                variant: 'warning'
            });
        }

        return actions;
    };
}

/**
 * Create bulk action handlers instance
 */
export const createBulkActionHandlers = (
    toast: ToastFunctions,
    messageState: BulkMessageState,
    setMessageState: (state: BulkMessageState) => void,
    dataUpdateFunctions: DataUpdateFunctions
): BulkActionHandlers => {
    return new BulkActionHandlers(toast, messageState, setMessageState, dataUpdateFunctions);
}; 