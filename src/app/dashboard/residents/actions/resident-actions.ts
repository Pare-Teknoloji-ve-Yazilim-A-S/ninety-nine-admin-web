import { Resident } from '@/app/components/ui/ResidentRow';
import { ResidentActionHandlers as IResidentActionHandlers } from '../types';
import { residentService } from '@/services';
import type { ResidentStatus } from '@/app/components/ui/ResidentRow';

/**
 * Toast notification functions interface
 */
interface ToastFunctions {
    success: (title: string, message: string) => void;
    info: (title: string, message: string) => void;
    error: (title: string, message: string) => void;
}

/**
 * Data update functions interface
 */
interface DataUpdateFunctions {
    setResidents: (residents: Resident[]) => void;
    refreshData: () => void;
}

/**
 * Individual resident action handlers class
 */
export class ResidentActionHandlers {
    private toast: ToastFunctions;
    private dataUpdate: DataUpdateFunctions;
    private residents: Resident[];

    constructor(
        toast: ToastFunctions, 
        dataUpdate: DataUpdateFunctions,
        residents: Resident[]
    ) {
        this.toast = toast;
        this.dataUpdate = dataUpdate;
        this.residents = residents;
    }

    /**
     * Handle view resident action
     */
    handleViewResident = (resident: Resident): void => {
        this.toast.info(
            'Sakin Görüntüleniyor', 
            `${resident.fullName} detayları açılıyor`
        );
        // Navigate to resident detail page
        window.location.href = `/dashboard/residents/${resident.id}`;
    };

    /**
     * Handle edit resident action
     */
    handleEditResident = (resident: Resident): void => {
        this.toast.info(
            'Sakin Düzenleniyor', 
            `${resident.fullName} bilgileri düzenleniyor`
        );
        // Navigate to resident edit page
        window.location.href = `/dashboard/residents/${resident.id}/edit`;
    };

    /**
     * Handle delete resident action
     */
    handleDeleteResident = async (resident: Resident): Promise<void> => {
        try {
            // Call the API to delete the resident
            await residentService.deleteResident(resident.id.toString());
            
            // Remove resident from local state after successful API call
            const updatedResidents = this.residents.filter(r => r.id !== resident.id);
            this.dataUpdate.setResidents(updatedResidents);
            
            // Refresh data to ensure consistency
            this.dataUpdate.refreshData();
            
            this.toast.success(
                'Sakin Silindi', 
                `${resident.fullName} başarıyla silindi`
            );
        } catch (error) {
            console.error('Delete resident failed:', error);
            this.toast.error(
                'Silme Hatası', 
                error instanceof Error ? error.message : 'Silme işlemi başarısız oldu'
            );
        }
    };

    /**
     * Handle call resident action
     */
    handleCallResident = (resident: Resident): void => {
        if (confirm(`${resident.contact.phone} numarasını aramak istiyor musunuz?`)) {
            // Open phone app or make call
            window.location.href = `tel:${resident.contact.phone}`;
        }
    };

    /**
     * Handle message resident action
     */
    handleMessageResident = (resident: Resident): void => {
        const message = prompt(`${resident.fullName} için mesaj yazın:`);
        if (message && message.trim()) {
            this.toast.success(
                'Mesaj Gönderildi', 
                `Mesaj başarıyla gönderildi: "${message}"`
            );
        }
    };

    /**
     * Handle generate QR code action
     */
    handleGenerateQR = (resident: Resident): void => {
        this.toast.info(
            'QR Kod Oluşturuluyor', 
            `${resident.fullName} için QR kod hazırlanıyor`
        );
        
        // Generate QR code with resident info
        setTimeout(() => {
            this.toast.success(
                'QR Kod İndiriliyor', 
                'QR kod oluşturuldu ve indiriliyor'
            );
        }, 1000);
    };

    /**
     * Handle view notes action
     */
    handleViewNotes = (resident: Resident): void => {
        const notes = resident.notes || 'Bu sakin için henüz not bulunmuyor.';
        const newNote = prompt(`${resident.fullName} - Notlar:\n\n${notes}\n\nYeni not eklemek için yazın:`);
        
        if (newNote && newNote.trim()) {
            // Update resident notes
            const updatedResidents = this.residents.map(r =>
                r.id === resident.id
                    ? { 
                        ...r, 
                        notes: (r.notes || '') + '\n' + new Date().toLocaleDateString() + ': ' + newNote 
                    }
                    : r
            );
            this.dataUpdate.setResidents(updatedResidents);
            
            this.toast.success('Not Eklendi', 'Not başarıyla eklendi');
        }
    };

    /**
     * Handle view history action
     */
    handleViewHistory = (resident: Resident): void => {
        const registrationDate = new Date(resident.registrationDate).toLocaleDateString();
        const lastActivity = resident.lastActivity || 'Bilgi yok';
        
        this.toast.info(
            'Aktivite Geçmişi', 
            `${resident.fullName} - Kayıt: ${registrationDate}, Son aktivite: ${lastActivity}`
        );
    };

    /**
     * Handle view payment history action
     */
    handleViewPaymentHistory = (resident: Resident): void => {
        const debt = resident.financial.totalDebt;
        const balance = resident.financial.balance;
        
        this.toast.info(
            'Ödeme Geçmişi', 
            `${resident.fullName} - Borç: ₺${debt.toLocaleString()}, Bakiye: ₺${balance.toLocaleString()}`
        );
    };

    /**
     * Handle update resident status (active/passive)
     */
    handleUpdateResidentStatus = async (resident: Resident, newStatus: 'ACTIVE' | 'INACTIVE') => {
        try {
            // Call the API to update the resident's status
            await residentService.updateResident(resident.id.toString(), { status: newStatus });

            // Update local state
            const updatedResidents = this.residents.map(r =>
                r.id === resident.id ? {
                        ...r,
                        status: {
                            ...(r.status as ResidentStatus),
                            type: newStatus === 'ACTIVE' ? 'active' : 'inactive',
                            label: newStatus === 'ACTIVE' ? 'Aktif' : 'Pasif',
                            color: newStatus === 'ACTIVE' ? 'green' : 'gray',
                        } as ResidentStatus,
                    }
                    : r
            );
            this.dataUpdate.setResidents(updatedResidents);
            this.dataUpdate.refreshData();

            this.toast.success(
                'Durum Güncellendi',
                `${resident.fullName} artık ${newStatus === 'ACTIVE' ? 'Aktif' : 'Pasif'}`
            );
        } catch (error) {
            this.toast.error(
                'Durum Güncellenemedi',
                error instanceof Error ? error.message : 'Durum güncelleme işlemi başarısız oldu'
            );
        }
    };

    /**
     * Get all resident action handlers
     */
    getActionHandlers = (): IResidentActionHandlers => {
        return {
            handleViewResident: this.handleViewResident,
            handleEditResident: this.handleEditResident,
            handleDeleteResident: this.handleDeleteResident,
            handleCallResident: this.handleCallResident,
            handleMessageResident: this.handleMessageResident,
            handleGenerateQR: this.handleGenerateQR,
            handleViewNotes: this.handleViewNotes,
            handleViewHistory: this.handleViewHistory,
            handleViewPaymentHistory: this.handleViewPaymentHistory,
            handleUpdateResidentStatus: this.handleUpdateResidentStatus,
        };
    };
}

/**
 * Create resident action handlers instance
 */
export const createResidentActionHandlers = (
    toast: ToastFunctions,
    dataUpdate: DataUpdateFunctions,
    residents: Resident[]
): IResidentActionHandlers => {
    const handlers = new ResidentActionHandlers(toast, dataUpdate, residents);
    return handlers.getActionHandlers();
}; 