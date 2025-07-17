import { useEffect, useState, useCallback } from 'react';
import { ticketService, Ticket } from '@/services/ticket.service';

export function useWaitingTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketService.getTicketsByStatus('WAITING');
      setTickets(data);
    } catch (err: any) {
      setError(err?.message || 'Bekleyen talepler alınamadı.');
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