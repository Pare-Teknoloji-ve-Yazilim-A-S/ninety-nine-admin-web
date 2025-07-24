import { useState, useEffect } from 'react';
import { loggingService, AuditLog, AuditLogFilter } from '@/services/logging.service';

interface UseAuditLogsReturn {
  logs: AuditLog[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => void;
}

export function useAuditLogs(filter: AuditLogFilter = {}, limit: number = 10): UseAuditLogsReturn {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For dashboard, we'll use the recent logs endpoint
      const response = await loggingService.getRecentAuditLogs(limit);
      
      console.log('Fetched audit logs:', response);
      
      // Handle different response structures
      let logsArray: AuditLog[] = [];
      let total = 0;
      
      if (response && Array.isArray(response)) {
        logsArray = response;
        total = response.length;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        logsArray = (response as any).data;
        total = (response as any).total || (response as any).data.length;
      } else if (response && typeof response === 'object') {
        // If response is an object but not in expected format, try to extract data
        console.warn('Unexpected response format:', response);
        logsArray = [];
        total = 0;
      } else {
        logsArray = [];
        total = 0;
      }
      
      setLogs(logsArray);
      setTotalCount(total);
    } catch (err) {
      console.error('Error in useAuditLogs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch audit logs');
      setLogs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [limit]);

  const refetch = () => {
    fetchLogs();
  };

  return {
    logs,
    loading,
    error,
    totalCount,
    refetch
  };
} 