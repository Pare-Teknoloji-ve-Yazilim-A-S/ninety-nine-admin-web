import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, ticketService } from '@/services/ticket.service';

export interface UseRequestsActionsProps {
    refreshData: () => void;
    setSelectedRequests: (requests: Ticket[]) => void;
    setRequests: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

export function useRequestsActions({
    refreshData,
    setSelectedRequests,
    setRequests
}: UseRequestsActionsProps) {
    const router = useRouter();

    const handleViewRequest = useCallback((request: Ticket) => {
        // Navigate to request detail page
        router.push(`/dashboard/requests/${request.id}`);
    }, [router]);

    const handleEditRequest = useCallback((request: Ticket) => {
        // Navigate to edit page
        router.push(`/dashboard/requests/${request.id}/edit`);
    }, [router]);

    const handleDeleteRequest = useCallback(async (request: Ticket) => {
        try {
            await ticketService.cancel(request.id);
            
            // Remove from state
            setRequests(prev => prev.filter(r => r.id !== request.id));
            
            console.log('✓ Talep başarıyla iptal edildi');
        } catch (error) {
            console.error('✗ Talep iptal edilirken hata oluştu:', error);
        }
    }, [setRequests]);

    const handleUpdateRequestStatus = useCallback(async (request: Ticket, action: string) => {
        try {
            let updated: Ticket | null = null;
            
            switch (action) {
                case 'start-progress':
                    updated = await ticketService.startProgress(request.id);
                    break;
                case 'resolve':
                    updated = await ticketService.resolve(request.id);
                    break;
                case 'close':
                    updated = await ticketService.close(request.id);
                    break;
                case 'cancel':
                    updated = await ticketService.cancel(request.id);
                    break;
                default:
                    throw new Error(`Unknown action: ${action}`);
            }
            
            if (updated) {
                // Update in state
                setRequests(prev => prev.map(r => 
                    r.id === request.id ? updated! : r
                ));
            }
            
            console.log(`✓ Talep durumu güncellendi: ${action}`);
        } catch (error) {
            console.error('✗ Talep durumu güncellenirken hata oluştu:', error);
        }
    }, [setRequests]);

    const handleSendNotification = useCallback(async (request: Ticket, message: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log(`✓ Bildirim gönderildi: ${message}`);
        } catch (error) {
            console.error('✗ Bildirim gönderilirken hata oluştu:', error);
        }
    }, []);

    return {
        handleViewRequest,
        handleEditRequest,
        handleDeleteRequest,
        handleUpdateRequestStatus,
        handleSendNotification
    };
} 