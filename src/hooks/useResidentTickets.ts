'use client';

import { useState, useEffect, useCallback } from 'react';
import { ticketService, Ticket } from '@/services/ticket.service';

export interface UseResidentTicketsOptions {
    residentId: string;
    autoFetch?: boolean;
}

export interface UseResidentTicketsReturn {
    tickets: Ticket[];
    loading: boolean;
    error: string | null;
    refreshTickets: () => Promise<void>;
}

export function useResidentTickets({
    residentId,
    autoFetch = true
}: UseResidentTicketsOptions): UseResidentTicketsReturn {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = useCallback(async () => {
        if (!residentId) {
            setError('Resident ID is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log(`🎫 Fetching tickets for resident: ${residentId}`);
            
            // API returns direct array without data wrapper
            const response = await ticketService.getTicketsByUserId(residentId);
            
            // Response is already an array, not wrapped in data field
            const ticketsArray = Array.isArray(response) ? response : [];
            
            setTickets(ticketsArray);
            
            console.log(`✅ Fetched ${ticketsArray.length} tickets for resident ${residentId}`, ticketsArray);
        } catch (err: any) {
            const errorMessage = err?.message || 'Talepler alınamadı';
            setError(errorMessage);
            console.error('❌ Error fetching resident tickets:', err);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    }, [residentId]);

    const refreshTickets = useCallback(async () => {
        await fetchTickets();
    }, [fetchTickets]);

    // Auto-fetch on mount and when residentId changes
    useEffect(() => {
        if (autoFetch && residentId) {
            fetchTickets();
        }
    }, [autoFetch, residentId, fetchTickets]);

    return {
        tickets,
        loading,
        error,
        refreshTickets
    };
}

export default useResidentTickets; 