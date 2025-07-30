import { useState, useEffect, useCallback } from 'react';
import { billingService } from '@/services';
import { paymentService } from '@/services';
import { ResponseBillDto, ResponsePaymentDto } from '@/services/types/billing.types';

export type TransactionType = 'bill' | 'payment';

export interface TransactionDetail {
  id: string;
  type: TransactionType;
  data: ResponseBillDto | ResponsePaymentDto;
  relatedTransactions?: ResponsePaymentDto[] | ResponseBillDto;
}

export interface UseTransactionDetailReturn {
  transaction: TransactionDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}

export const useTransactionDetail = (id: string): UseTransactionDetailReturn => {
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionDetail = useCallback(async () => {
    if (!id) {
      setError('Transaction ID is required');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // First try to fetch as a bill
      try {
        const billResponse = await billingService.getBillById(id);
        if (billResponse.data) {
          // Fetch related payments for this bill
          const relatedPayments = await paymentService.getPaymentsByBill(id);
          
          setTransaction({
            id,
            type: 'bill',
            data: billResponse.data,
            relatedTransactions: relatedPayments
          });
          return;
        }
      } catch (billError: any) {
        // If it's not found as a bill, continue to try as payment
        if (billError?.response?.status !== 404) {
          throw billError;
        }
      }

      // If not found as a bill, try to fetch as a payment
      try {
        const paymentResponse = await paymentService.getPaymentById(id);
        if (paymentResponse.data) {
          let relatedBill = null;
          
          // If payment has a billId, fetch the related bill
          if (paymentResponse.data.billId) {
            try {
              const billResponse = await billingService.getBillById(paymentResponse.data.billId);
              relatedBill = billResponse.data;
            } catch (billError) {
              console.warn('Could not fetch related bill:', billError);
            }
          }
          
          setTransaction({
            id,
            type: 'payment',
            data: paymentResponse.data,
            relatedTransactions: relatedBill
          });
          return;
        }
      } catch (paymentError: any) {
        // If it's not found as a payment either, it doesn't exist
        if (paymentError?.response?.status === 404) {
          throw new Error('Transaction not found');
        }
        throw paymentError;
      }

      // If we reach here, transaction wasn't found in either endpoint
      throw new Error('Transaction not found');
      
    } catch (err: any) {
      console.error('Error fetching transaction detail:', err);
      setError(err.message || 'Failed to fetch transaction details');
      setTransaction(null);
    } finally {
      setLoading(false);
      setIsRefetching(false);
    }
  }, [id]);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await fetchTransactionDetail();
  }, [fetchTransactionDetail]);

  useEffect(() => {
    fetchTransactionDetail();
  }, [fetchTransactionDetail]);

  return {
    transaction,
    loading,
    error,
    refetch,
    isRefetching
  };
};

// Helper functions to check transaction type
export const isBillTransaction = (transaction: TransactionDetail): transaction is TransactionDetail & { data: ResponseBillDto } => {
  return transaction.type === 'bill';
};

export const isPaymentTransaction = (transaction: TransactionDetail): transaction is TransactionDetail & { data: ResponsePaymentDto } => {
  return transaction.type === 'payment';
};