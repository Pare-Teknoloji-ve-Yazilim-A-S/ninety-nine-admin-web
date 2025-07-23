import { useState, useEffect, useCallback } from 'react';
import { ticketService, Ticket, TicketFilters } from '@/services/ticket.service';

interface MaintenanceRequestsData {
    requests: Ticket[];
    loading: boolean;
    error: string | null;
    totalCount: number;
}

export function useMaintenanceRequests(limit: number = 5): MaintenanceRequestsData {
    const [requests, setRequests] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchMaintenanceRequests = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching maintenance requests...');

            // Fetch maintenance requests without filter to get all tickets
            const filters: TicketFilters = {
                limit: limit,
                orderColumn: 'createdAt',
                orderBy: 'DESC',
            };

            const response = await ticketService.getTickets(filters);
            
            console.log('Maintenance requests response:', response);

            // Handle different response structures
            if (response.data && Array.isArray(response.data)) {
                // Direct array response
                setRequests(response.data);
                setTotalCount(response.data.length);
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                // Nested data structure
                setRequests(response.data.data);
                setTotalCount(response.data.pagination?.total || response.data.data.length);
            } else if (Array.isArray(response)) {
                // Direct array response (no wrapper)
                setRequests(response);
                setTotalCount(response.length);
            } else {
                console.warn('Unexpected response structure:', response);
                setRequests([]);
                setTotalCount(0);
            }
        } catch (err: any) {
            console.error('Failed to fetch maintenance requests:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(`Bakım talepleri yüklenirken bir hata oluştu: ${err.message}`);
            setRequests([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchMaintenanceRequests();
    }, [fetchMaintenanceRequests]);

    return {
        requests,
        loading,
        error,
        totalCount
    };
} 