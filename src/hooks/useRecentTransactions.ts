import { useState, useEffect } from 'react';
import paymentService from '@/services/payment.service';
import billingService from '@/services/billing.service';
import { ResponsePaymentDto } from '@/services/types/billing.types';

export interface Transaction {
  id: string;
  date: string;
  type: string;
  unit: string;
  amount: string;
  status: 'Ödendi' | 'Bekliyor' | 'Gecikmiş';
}

interface UseRecentTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRecentTransactions(limit: number = 5): UseRecentTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch recent payments and bills
      const [payments, bills] = await Promise.all([
        paymentService.getAllPayments(),
        billingService.getAllBills()
      ]);
      
      // Combine and transform data
      const combinedTransactions: Transaction[] = [];
      
      // Add payments
      payments.slice(0, Math.ceil(limit / 2)).forEach((payment: any) => {
        combinedTransactions.push({
          id: payment.id,
          date: payment.createdAt || payment.paymentDate,
          type: 'Ödeme',
          unit: payment.property?.propertyNumber || payment.bill?.property?.propertyNumber || 'N/A',
          amount: `${payment.amount?.toLocaleString('tr-TR') || '0'} IQD`,
          status: payment.status === 'completed' ? 'Ödendi' : 
                 payment.status === 'pending' ? 'Bekliyor' : 'Gecikmiş'
        });
      });
      
      // Add bills
      bills.data.slice(0, Math.ceil(limit / 2)).forEach((bill: any) => {
        combinedTransactions.push({
          id: bill.id,
          date: bill.createdAt || bill.dueDate,
          type: bill.billType || 'Fatura',
          unit: bill.property?.propertyNumber || 'N/A',
          amount: `${bill.amount?.toLocaleString('tr-TR') || '0'} IQD`,
          status: bill.status === 'paid' ? 'Ödendi' : 
                 bill.status === 'pending' ? 'Bekliyor' : 'Gecikmiş'
        });
      });
      
      // Sort by date (newest first) and limit
      const sortedTransactions = combinedTransactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
      
      setTransactions(sortedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      
      // Fallback to default data on error
      const defaultTransactions: Transaction[] = [
        { id: '1', date: '2024-01-15', type: 'Aidat', unit: 'A-101', amount: '1,200 IQD', status: 'Ödendi' },
        { id: '2', date: '2024-01-15', type: 'Bakım', unit: 'B-205', amount: '350 IQD', status: 'Bekliyor' },
        { id: '3', date: '2024-01-14', type: 'Aidat', unit: 'C-301', amount: '1,200 IQD', status: 'Ödendi' },
        { id: '4', date: '2024-01-14', type: 'Elektrik', unit: 'A-105', amount: '180 IQD', status: 'Gecikmiş' },
        { id: '5', date: '2024-01-13', type: 'Aidat', unit: 'B-102', amount: '1,200 IQD', status: 'Ödendi' },
      ];
      setTransactions(defaultTransactions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [limit]);

  const refetch = () => {
    fetchTransactions();
  };

  return {
    transactions,
    loading,
    error,
    refetch
  };
}