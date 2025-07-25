import React from 'react';
import { Ticket, ticketService } from '@/services/ticket.service';
import { 
    RotateCcw, 
    CheckCircle, 
    XCircle, 
    X 
} from 'lucide-react';

export interface BulkActionHandlers {
    getBulkActions: (selectedRequests: Ticket[]) => Array<{
        id: string;
        label: string;
        icon: any;
        variant: 'default' | 'danger' | 'warning' | 'success';
        onClick: (items: Ticket[]) => void;
        disabled?: boolean;
        loading?: boolean;
    }>;
    executeBulkStatusChange: (action: string) => Promise<void>;
}

export interface ToastFunctions {
    success: (title: string, message: string) => void;
    info: (title: string, message: string) => void;
    error: (title: string, message: string) => void;
}

export interface DataUpdateFunctions {
    setRequests: React.Dispatch<React.SetStateAction<Ticket[]>>;
    refreshData: () => void;
}



export function createRequestBulkActionHandlers(
    toastFunctions: ToastFunctions,
    dataUpdateFunctions: DataUpdateFunctions,
    selectedRequests: Ticket[]
): BulkActionHandlers {
    const { success, info, error } = toastFunctions;
    const { setRequests, refreshData } = dataUpdateFunctions;

    const getBulkActions = (selectedRequests: Ticket[]) => [
        {
            id: 'start-progress',
            label: `İşleme Al (${selectedRequests.length})`,
            icon: RotateCcw,
            variant: 'warning' as const,
            onClick: (items: Ticket[]) => executeBulkStatusChange('start-progress'),
            disabled: selectedRequests.every(req => req.status === 'IN_PROGRESS')
        },
        {
            id: 'resolve',
            label: `Tamamlandı Olarak İşaretle (${selectedRequests.length})`,
            icon: CheckCircle,
            variant: 'success' as const,
            onClick: (items: Ticket[]) => executeBulkStatusChange('resolve'),
            disabled: selectedRequests.every(req => req.status === 'COMPLETED')
        },
        {
            id: 'close',
            label: `Kapat (${selectedRequests.length})`,
            icon: XCircle,
            variant: 'danger' as const,
            onClick: (items: Ticket[]) => executeBulkStatusChange('close'),
            disabled: selectedRequests.every(req => req.status === 'CLOSED')
        },
        {
            id: 'cancel',
            label: `İptal Et (${selectedRequests.length})`,
            icon: X,
            variant: 'danger' as const,
            onClick: (items: Ticket[]) => executeBulkStatusChange('cancel'),
            disabled: selectedRequests.every(req => req.status === 'CANCELLED')
        }
    ];



    const executeBulkStatusChange = async (action: string) => {
        try {
            const actionLabels = {
                'start-progress': 'işleme alındı',
                'resolve': 'tamamlandı olarak işaretlendi',
                'close': 'kapatıldı',
                'cancel': 'iptal edildi'
            };

            // Call ticket service for each selected request
            const promises = selectedRequests.map(async (request) => {
                switch (action) {
                    case 'start-progress':
                        return await ticketService.startProgress(request.id);
                    case 'resolve':
                        return await ticketService.resolve(request.id);
                    case 'close':
                        return await ticketService.close(request.id);
                    case 'cancel':
                        return await ticketService.cancel(request.id);
                    default:
                        throw new Error(`Unknown action: ${action}`);
                }
            });

            await Promise.all(promises);
            
            // Refresh data after bulk operation
            refreshData();
            
            success(
                'Başarılı',
                `${selectedRequests.length} talep ${actionLabels[action as keyof typeof actionLabels]}`
            );
        } catch (err) {
            error(
                'Hata',
                'Talep durumları güncellenirken bir hata oluştu.'
            );
        }
    };



    return {
        getBulkActions,
        executeBulkStatusChange
    };
} 