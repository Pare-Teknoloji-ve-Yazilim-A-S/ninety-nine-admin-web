import { useState, useEffect, useCallback } from 'react';
import { billingService } from '@/services';
import { paymentService } from '@/services';
import { ResponseBillDto, ResponsePaymentDto } from '@/services/types/billing.types';

export type TransactionType = 'bill' | 'payment' | 'bill-item';

export interface BillItemDto {
  id: string;
  billIds: string[];
  title: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDetail {
  id: string;
  type: TransactionType;
  data: ResponseBillDto | ResponsePaymentDto | BillItemDto;
  relatedTransactions?: ResponsePaymentDto[] | ResponseBillDto | ResponseBillDto[];
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
        const billData = (billResponse as any)?.data ?? billResponse;
        if (billData && billData.id) {
          // Fetch related payments for this bill
          let relatedPayments: any[] = [];
          try {
            const paymentsResp = await paymentService.getPaymentsByBill(id);
            relatedPayments = Array.isArray(paymentsResp)
              ? paymentsResp
              : (paymentsResp as any)?.data ?? [];
          } catch (_) {
            relatedPayments = [];
          }

          setTransaction({
            id,
            type: 'bill',
            data: billData,
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
        const paymentData = (paymentResponse as any)?.data ?? paymentResponse;
        if (paymentData && paymentData.id) {
          let relatedBill = null;
          
          // If payment has a billId, fetch the related bill
          if (paymentData.billId) {
            try {
              const billResp2 = await billingService.getBillById(paymentData.billId);
              relatedBill = (billResp2 as any)?.data ?? billResp2 ?? null;
            } catch (billError) {
              console.warn('Could not fetch related bill:', billError);
            }
          }
          
          setTransaction({
            id,
            type: 'payment',
            data: paymentData,
            relatedTransactions: relatedBill || undefined
          });
          return;
        }
      } catch (paymentError: any) {
        // If it's not found as a payment either, continue to try as bill-item
        if (paymentError?.response?.status !== 404) {
          throw paymentError;
        }
      }

      // If not found as a payment, try to fetch as a bill-item
      try {
        const billItemResponse = await billingService.getBillItemById(id);
        const billItemData = (billItemResponse as any)?.data ?? billItemResponse;
        if (billItemData && billItemData.id) {
          let relatedBills: ResponseBillDto[] = [];
          
          // If bill-item has billIds, fetch the related bills
          if (billItemData.billIds && Array.isArray(billItemData.billIds)) {
            try {
              const billPromises = billItemData.billIds.map(async (billId: string) => {
                try {
                  const billResp = await billingService.getBillById(billId);
                  return (billResp as any)?.data ?? billResp;
                } catch (error) {
                  console.warn(`Could not fetch bill ${billId}:`, error);
                  return null;
                }
              });
              
              const bills = await Promise.all(billPromises);
              relatedBills = bills.filter(bill => bill !== null);
            } catch (error) {
              console.warn('Could not fetch related bills:', error);
            }
          }
          
          setTransaction({
            id,
            type: 'bill-item',
            data: billItemData,
            relatedTransactions: relatedBills
          });
          return;
        }
      } catch (billItemError: any) {
        // If it's not found as a bill-item either, it doesn't exist
        if (billItemError?.response?.status !== 404) {
          throw billItemError;
        }
      }

      // If we reach here, transaction wasn't found in any endpoint
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
export const isBillTransaction = (transaction: TransactionDetail): transaction is TransactionDetail & { type: 'bill'; data: ResponseBillDto } => {
  return transaction.type === 'bill';
};

export const isPaymentTransaction = (transaction: TransactionDetail): transaction is TransactionDetail & { type: 'payment'; data: ResponsePaymentDto } => {
  return transaction.type === 'payment';
};

export const isBillItemTransaction = (transaction: TransactionDetail): transaction is TransactionDetail & { type: 'bill-item'; data: BillItemDto } => {
  return transaction.type === 'bill-item';
};