import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api/client';
import { apiConfig } from '@/services/config/api.config';

export interface TicketSummary {
  openTickets: number;
  inProgressTickets: number;
  waitingTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  cancelledTickets: number;
  unassignedTickets: number;
  overdueTickets: number;
  dueTodayTickets: number;
  totalTickets: number;
}

// API direkt TicketSummary döndürüyor, wrapper yok
export type TicketSummaryResponse = TicketSummary;

export function useTicketSummary() {
  const [summary, setSummary] = useState<TicketSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      console.log('🔄 Fetching ticket summary...');
      console.log('📍 API Endpoint:', apiConfig.endpoints.tickets.summary);
      console.log('📍 Full URL:', `${apiConfig.baseURL}${apiConfig.endpoints.tickets.summary}`);
      
      setLoading(true);
      setError(null);
      
      console.log('📡 Making API request...');
      const response = await apiClient.get<TicketSummaryResponse>(apiConfig.endpoints.tickets.summary);
      console.log('✅ Ticket summary response received');
      console.log('📊 Response status:', response.status);
      console.log('📊 Response data:', response.data);
      
      // API direkt data döndürüyor, success/message wrapper'ı yok
      if (response.data && typeof response.data === 'object') {
        console.log('📊 Setting ticket summary data directly:', response.data);
        setSummary(response.data);
        console.log('✅ Summary data set successfully');
      } else {
        console.error('❌ Invalid response data format:', response.data);
        setError('Geçersiz response formatı');
      }
    } catch (err: any) {
      console.error('❌ Error fetching ticket summary:', err);
      console.error('❌ Error name:', err.name);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error stack:', err.stack);
      
      if (err.response) {
        console.error('❌ Error response status:', err.response.status);
        console.error('❌ Error response data:', err.response.data);
        console.error('❌ Error response headers:', err.response.headers);
      } else if (err.request) {
        console.error('❌ Error request:', err.request);
      }
      
      setError(err.message || 'Ticket summary yüklenirken hata oluştu');
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 useTicketSummary useEffect triggered');
    console.log('🔧 API Config:', {
      baseURL: apiConfig.baseURL,
      endpoints: apiConfig.endpoints.tickets,
      summary: apiConfig.endpoints.tickets.summary
    });
    fetchSummary();
  }, []);

  const refetch = () => {
    fetchSummary();
  };

  return {
    summary,
    loading,
    error,
    refetch
  };
}
