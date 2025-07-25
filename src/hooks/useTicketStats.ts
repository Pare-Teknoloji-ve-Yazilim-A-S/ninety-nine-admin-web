import { useState, useEffect } from 'react';
import { ticketService } from '../services/ticket.service';

interface TicketStats {
    currentMonthCount: number;
    previousMonthCount: number;
    percentageChange: number;
    changeDirection: 'increase' | 'decrease';
    currentMonthName: string;
    previousMonthName: string;
}

interface UseTicketStatsReturn {
    stats: TicketStats | null;
    loading: boolean;
    error: string | null;
}

export const useTicketStats = (): UseTicketStatsReturn => {
    const [stats, setStats] = useState<TicketStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTicketStats = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const data = await ticketService.getMonthlyStats();
                console.log('Ticket stats response:', data);
                setStats(data);
            } catch (err: any) {
                console.error('Error fetching ticket stats:', err);
                setError(err.response?.data?.message || 'Talepler istatistikleri yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchTicketStats();
    }, []);

    return { stats, loading, error };
}; 