import { useEffect, useState, useCallback } from 'react';
import { ticketService, Ticket } from '@/services/ticket.service';

export function useResolvedTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketService.getTicketsByStatus('RESOLVED');
      setTickets(data as unknown as Ticket[]);
    } catch (err: any) {
      setError(err?.message || 'Çözümlenen talepler alınamadı.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    error,
    refresh: fetchTickets,
  };
} 