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

/**
 * Bulk action handlers class
 */
export class BulkActionHandlers {
    private toast: ToastFunctions;
    private messageState: BulkMessageState;
    private setMessageState: (state: BulkMessageState) => void;

    constructor(
        toast: ToastFunctions,
        messageState: BulkMessageState,
        setMessageState: (state: BulkMessageState) => void
    ) {
        this.toast = toast;
        this.messageState = messageState;
        this.setMessageState = setMessageState;
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
     * Handle bulk status change
     */
    handleBulkStatusChange = (residents: Resident[], status: string): void => {
        const statusLabels: Record<string, string> = {
            'active': 'Aktif',
            'inactive': 'Pasif',
            'pending': 'Beklemede',
            'suspended': 'Askıya Alınmış'
        };

        const statusLabel = statusLabels[status] || status;
        
        this.toast.success(
            'Durum Güncellendi', 
            `${residents.length} sakin "${statusLabel}" durumuna geçirildi`
        );
    };

    /**
     * Handle bulk delete
     */
    handleBulkDelete = (residents: Resident[]): void => {
        if (confirm(`${residents.length} sakini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            this.toast.success(
                'Sakinler Silindi', 
                `${residents.length} sakin başarıyla silindi`
            );
        }
    };

    /**
     * Get bulk actions configuration
     */
    getBulkActions = (): BulkAction[] => {
        return [
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
            },
            {
                id: BULK_ACTION_IDS.ACTIVATE,
                label: 'Aktif Yap',
                icon: UserCheck,
                onClick: (residents: Resident[]) => this.handleBulkStatusChange(residents, 'active')
            },
            {
                id: BULK_ACTION_IDS.DEACTIVATE,
                label: 'Pasif Yap',
                icon: UserX,
                onClick: (residents: Resident[]) => this.handleBulkStatusChange(residents, 'inactive'),
                variant: 'warning'
            },
            {
                id: BULK_ACTION_IDS.DELETE,
                label: 'Sil',
                icon: Trash2,
                onClick: this.handleBulkDelete,
                variant: 'danger'
            },
        ];
    };
}

/**
 * Create bulk action handlers instance
 */
export const createBulkActionHandlers = (
    toast: ToastFunctions,
    messageState: BulkMessageState,
    setMessageState: (state: BulkMessageState) => void
): BulkActionHandlers => {
    return new BulkActionHandlers(toast, messageState, setMessageState);
}; 