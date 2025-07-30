'use client';

import React, { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { 
  Edit,
  Trash2,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  MoreVertical,
  FileText,
  RefreshCw,
  Mail
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TransactionDetail, isBillTransaction, isPaymentTransaction } from '../hooks/useTransactionDetail';
import { billingService, paymentService } from '@/services';

interface TransactionActionsProps {
  transaction: TransactionDetail;
  onUpdate: () => void;
}

const TransactionActions: React.FC<TransactionActionsProps> = ({ 
  transaction,
  onUpdate 
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Check if transaction can be edited
  const canEdit = () => {
    if (isBillTransaction(transaction)) {
      return transaction.data.status !== 'PAID';
    }
    return transaction.data.status === 'PENDING';
  };

  // Check if transaction can be deleted
  const canDelete = () => {
    if (isBillTransaction(transaction)) {
      return transaction.data.status === 'PENDING';
    }
    return transaction.data.status === 'PENDING';
  };

  // Check if bill can be marked as paid
  const canMarkAsPaid = () => {
    return isBillTransaction(transaction) && 
           ['PENDING', 'OVERDUE'].includes(transaction.data.status);
  };

  // Handle edit action
  const handleEdit = () => {
    if (isBillTransaction(transaction)) {
      router.push(`/dashboard/financial/create/bill?edit=${transaction.id}`);
    } else {
      router.push(`/dashboard/financial/create/payment?edit=${transaction.id}`);
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    if (!confirm('Bu işlemi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isBillTransaction(transaction)) {
        await billingService.deleteBill(transaction.id);
      } else {
        await paymentService.deletePayment(transaction.id);
      }
      
      // Redirect to financial list after successful deletion
      router.push('/dashboard/financial');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('İşlem silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle mark as paid
  const handleMarkAsPaid = async () => {
    if (!isBillTransaction(transaction)) return;

    if (!confirm('Bu faturayı ödendi olarak işaretlemek istediğinizden emin misiniz?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await billingService.markBillAsPaid(transaction.id);
      onUpdate(); // Refresh the transaction data
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      alert('Fatura güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle print receipt
  const handlePrintReceipt = () => {
    // In a real app, this would generate and print a receipt
    console.log('Printing receipt for transaction:', transaction.id);
    alert('Makbuz yazdırma özelliği yakında aktif olacak.');
  };

  // Handle download receipt
  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    console.log('Downloading receipt for transaction:', transaction.id);
    alert('Makbuz indirme özelliği yakında aktif olacak.');
  };

  // Handle email receipt
  const handleEmailReceipt = () => {
    // In a real app, this would send receipt via email
    console.log('Emailing receipt for transaction:', transaction.id);
    alert('E-posta gönderme özelliği yakında aktif olacak.');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <MoreVertical className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            İşlemler
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bu işlem için mevcut aksiyonlar
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Primary Actions */}
        <div className="space-y-3">
          {canEdit() && (
            <Button
              variant="primary"
              size="md"
              icon={Edit}
              onClick={handleEdit}
              disabled={isSubmitting}
              className="w-full justify-start"
            >
              Düzenle
            </Button>
          )}

          {canMarkAsPaid() && (
            <Button
              variant="primary"
              size="md"
              icon={CheckCircle}
              onClick={handleMarkAsPaid}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full justify-start bg-green-600 hover:bg-green-700"
            >
              Ödendi Olarak İşaretle
            </Button>
          )}

          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={handleDownloadReceipt}
            disabled={isSubmitting}
            className="w-full justify-start"
          >
            Makbuz İndir
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="md"
              icon={Printer}
              onClick={handlePrintReceipt}
              disabled={isSubmitting}
              className="w-full justify-start"
            >
              Makbuz Yazdır
            </Button>

            <Button
              variant="ghost"
              size="md"
              icon={Mail}
              onClick={handleEmailReceipt}
              disabled={isSubmitting}
              className="w-full justify-start"
            >
              E-posta Gönder
            </Button>

            <Button
              variant="ghost"
              size="md"
              icon={RefreshCw}
              onClick={onUpdate}
              disabled={isSubmitting}
              className="w-full justify-start"
            >
              Yenile
            </Button>
          </div>
        </div>

        {/* More Actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            icon={MoreVertical}
            onClick={() => setShowMoreActions(!showMoreActions)}
            className="w-full justify-center text-gray-500 dark:text-gray-400"
          >
            {showMoreActions ? 'Daha Az' : 'Daha Fazla'}
          </Button>

          {showMoreActions && (
            <div className="mt-3 space-y-3">
              <Button
                variant="ghost"
                size="md"
                icon={FileText}
                onClick={() => router.push(`/dashboard/financial/${transaction.id}/audit`)}
                disabled={isSubmitting}
                className="w-full justify-start text-gray-600 dark:text-gray-400"
              >
                İşlem Geçmişi
              </Button>

              {canDelete() && (
                <Button
                  variant="ghost"
                  size="md"
                  icon={Trash2}
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Sil
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Information */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Son Güncelleme:</span>
            <span>
              {new Date(transaction.data.updatedAt || transaction.data.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>İşlem Türü:</span>
            <span>
              {isBillTransaction(transaction) ? 'Fatura' : 'Ödeme'}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {!canEdit() && !canDelete() && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              Bu işlem tamamlandığı için düzenlenemez veya silinemez.
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TransactionActions;