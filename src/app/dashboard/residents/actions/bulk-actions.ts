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

/**
 * Bulk action handlers class
 */
export class BulkActionHandlers {
    private toast: ToastFunctions;

    constructor(toast: ToastFunctions) {
        this.toast = toast;
    }

    /**
     * Handle bulk email action
     */
    handleBulkMail = (residents: Resident[]): void => {
        const emails = residents
            .filter(r => r.contact.email && r.contact.email !== 'Belirtilmemiş')
            .map(r => r.contact.email)
            .join(', ');
        
        this.toast.info(
            'Toplu Mail', 
            `${residents.length} sakine mail gönderiliyor. ${emails ? 'E-postalar: ' + emails : 'Email adresi bulunamadı'}`
        );
    };

    /**
     * Handle bulk SMS action
     */
    handleBulkSMS = (residents: Resident[]): void => {
        const phones = residents
            .filter(r => r.contact.phone && r.contact.phone !== 'Belirtilmemiş')
            .map(r => r.contact.phone)
            .join(', ');
        
        this.toast.info(
            'Toplu SMS', 
            `${residents.length} sakine SMS gönderiliyor. ${phones ? 'Telefonlar: ' + phones : 'Telefon numarası bulunamadı'}`
        );
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
     * Handle bulk tag assignment
     */
    handleBulkTag = (residents: Resident[]): void => {
        const tags = prompt('Atanacak etiketleri virgülle ayırarak yazın:');
        if (tags && tags.trim()) {
            this.toast.success(
                'Etiketler Atandı', 
                `${residents.length} sakine "${tags}" etiketleri başarıyla atandı`
            );
        }
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
                id: BULK_ACTION_IDS.TAG,
                label: 'Etiket Ata',
                icon: Tag,
                onClick: this.handleBulkTag
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
export const createBulkActionHandlers = (toast: ToastFunctions): BulkActionHandlers => {
    return new BulkActionHandlers(toast);
}; 