import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, ticketService } from '@/services/ticket.service';

export interface UseRequestsActionsProps {
    refreshData: () => void;
    setSelectedRequests: (requests: Ticket[]) => void;
    setRequests: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

interface ConfirmationDialog {
    isOpen: boolean;
    ticket: Ticket | null;
}

export function useRequestsActions({
    refreshData,
    setSelectedRequests,
    setRequests
}: UseRequestsActionsProps) {
    const router = useRouter();

    // Confirmation modal state
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialog>({
        isOpen: false,
        ticket: null
    });

    // Show delete confirmation modal
    const showDeleteConfirmation = useCallback((ticket: Ticket) => {
        setConfirmationDialog({
            isOpen: true,
            ticket
        });
    }, []);

    // Hide confirmation modal
    const hideConfirmation = useCallback(() => {
        setConfirmationDialog({
            isOpen: false,
            ticket: null
        });
    }, []);

    // Confirm delete with API call
    const confirmDelete = useCallback(async () => {
        const ticket = confirmationDialog.ticket;
        if (!ticket) return;

        try {
            setIsDeleting(true);
            
            // Call delete API
            await ticketService.deleteTicket(ticket.id);
            
            // Remove from state
            setRequests(prev => prev.filter(r => r.id !== ticket.id));
            
            // Remove from selected if it was selected
            setSelectedRequests([]);
            
            console.log('✓ Talep başarıyla silindi');
            
            // Refresh data to ensure consistency
            refreshData();
            
            // Hide modal
            hideConfirmation();
            
        } catch (error) {
            console.error('✗ Talep silinirken hata oluştu:', error);
            // Don't hide modal on error, let user try again
        } finally {
            setIsDeleting(false);
        }
    }, [confirmationDialog.ticket, setRequests, setSelectedRequests, refreshData, hideConfirmation]);

    const handleViewRequest = useCallback((request: Ticket) => {
        // Navigate to request detail page
        router.push(`/dashboard/requests/${request.id}`);
    }, [router]);

    const handleEditRequest = useCallback((request: Ticket) => {
        // Navigate to edit page
        router.push(`/dashboard/requests/${request.id}/edit`);
    }, [router]);

    const handleDeleteRequest = useCallback((request: Ticket) => {
        // Show confirmation modal instead of window.confirm
        showDeleteConfirmation(request);
    }, [showDeleteConfirmation]);

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
            
            // Refresh data to ensure consistency
            refreshData();
        } catch (error) {
            console.error('✗ Talep durumu güncellenirken hata oluştu:', error);
            alert('Talep durumu güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }, [setRequests, refreshData]);

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
        handleSendNotification,
        // Modal state and handlers
        isDeleting,
        confirmationDialog,
        showDeleteConfirmation,
        hideConfirmation,
        confirmDelete
    };
} 