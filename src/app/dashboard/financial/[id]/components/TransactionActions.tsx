'use client';

import React, { useState, useEffect } from 'react';
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
import { generatePaymentPDF, generateBillPDF, generatePaymentPDFForPrint, generateBillPDFForPrint, generateHTMLReceiptPDF, generateHTMLBillPDF } from '@/lib/pdf-generator';

// Dil çevirileri
const translations = {
  tr: {
    // Card header
    actions: 'İşlemler',
    availableActions: 'Bu işlem için mevcut aksiyonlar',
    
    // Buttons
    edit: 'Düzenle',
    markAsPaid: 'Ödendi Olarak İşaretle',
    downloadReceipt: 'Makbuz İndir',
    printReceipt: 'Makbuz Yazdır',
    emailReceipt: 'E-posta Gönder',
    refresh: 'Yenile',
    more: 'Daha Fazla',
    less: 'Daha Az',
    transactionHistory: 'İşlem Geçmişi',
    delete: 'Sil',
    
    // Status info
    lastUpdate: 'Son Güncelleme:',
    transactionType: 'İşlem Türü:',
    bill: 'Fatura',
    payment: 'Ödeme',
    
    // Warning messages
    completedTransactionWarning: 'Bu işlem tamamlandığı için düzenlenemez veya silinemez.',
    
    // Confirmation messages
    deleteConfirmation: 'Bu işlemi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    markAsPaidConfirmation: 'Bu faturayı ödendi olarak işaretlemek istediğinizden emin misiniz?',
    
    // Error messages
    deleteError: 'İşlem silinirken bir hata oluştu. Lütfen tekrar deneyin.',
    updateError: 'Fatura güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
    
    // Feature messages
    printFeature: 'Makbuz yazdırma özelliği yakında aktif olacak.',
    downloadFeature: 'Makbuz İndir',
    emailFeature: 'E-posta gönderme özelliği yakında aktif olacak.'
  },
  en: {
    // Card header
    actions: 'Actions',
    availableActions: 'Available actions for this transaction',
    
    // Buttons
    edit: 'Edit',
    markAsPaid: 'Mark as Paid',
    downloadReceipt: 'Download Receipt',
    printReceipt: 'Print Receipt',
    emailReceipt: 'Email Receipt',
    refresh: 'Refresh',
    more: 'More',
    less: 'Less',
    transactionHistory: 'Transaction History',
    delete: 'Delete',
    
    // Status info
    lastUpdate: 'Last Update:',
    transactionType: 'Transaction Type:',
    bill: 'Bill',
    payment: 'Payment',
    
    // Warning messages
    completedTransactionWarning: 'This transaction cannot be edited or deleted as it is completed.',
    
    // Confirmation messages
    deleteConfirmation: 'Are you sure you want to delete this transaction? This action cannot be undone.',
    markAsPaidConfirmation: 'Are you sure you want to mark this bill as paid?',
    
    // Error messages
    deleteError: 'An error occurred while deleting the transaction. Please try again.',
    updateError: 'An error occurred while updating the bill. Please try again.',
    
    // Feature messages
    printFeature: 'Print receipt feature will be available soon.',
    downloadFeature: 'Download Receipt',
    emailFeature: 'Email receipt feature will be available soon.'
  },
  ar: {
    // Card header
    actions: 'الإجراءات',
    availableActions: 'الإجراءات المتاحة لهذه المعاملة',
    
    // Buttons
    edit: 'تعديل',
    markAsPaid: 'تحديد كمدفوع',
    downloadReceipt: 'تحميل الإيصال',
    printReceipt: 'طباعة الإيصال',
    emailReceipt: 'إرسال الإيصال بالبريد',
    refresh: 'تحديث',
    more: 'المزيد',
    less: 'أقل',
    transactionHistory: 'تاريخ المعاملة',
    delete: 'حذف',
    
    // Status info
    lastUpdate: 'آخر تحديث:',
    transactionType: 'نوع المعاملة:',
    bill: 'فاتورة',
    payment: 'دفع',
    
    // Warning messages
    completedTransactionWarning: 'لا يمكن تعديل أو حذف هذه المعاملة لأنها مكتملة.',
    
    // Confirmation messages
    deleteConfirmation: 'هل أنت متأكد من أنك تريد حذف هذه المعاملة؟ لا يمكن التراجع عن هذا الإجراء.',
    markAsPaidConfirmation: 'هل أنت متأكد من أنك تريد تحديد هذه الفاتورة كمدفوع؟',
    
    // Error messages
    deleteError: 'حدث خطأ أثناء حذف المعاملة. يرجى المحاولة مرة أخرى.',
    updateError: 'حدث خطأ أثناء تحديث الفاتورة. يرجى المحاولة مرة أخرى.',
    
    // Feature messages
    printFeature: 'ميزة طباعة الإيصال ستكون متاحة قريباً.',
    downloadFeature: 'تحميل الإيصال',
    emailFeature: 'ميزة إرسال الإيصال بالبريد ستكون متاحة قريباً.'
  }
};

interface TransactionActionsProps {
  transaction: TransactionDetail;
  onUpdate: () => void;
}

const TransactionActions: React.FC<TransactionActionsProps> = ({ 
  transaction,
  onUpdate 
}) => {
  // Dil tercihini localStorage'dan al
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Check if transaction can be edited
  const canEdit = () => {
    if (isBillTransaction(transaction)) {
      return transaction.data.status !== 'PAID';
    }
    if (isPaymentTransaction(transaction)) {
      return transaction.data.status === 'PENDING';
    }
    return false; // BillItem cannot be edited
  };

  // Check if transaction can be deleted
  const canDelete = () => {
    if (isBillTransaction(transaction)) {
      return transaction.data.status === 'PENDING';
    }
    if (isPaymentTransaction(transaction)) {
      return transaction.data.status === 'PENDING';
    }
    return true; // BillItem can be deleted
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
    if (!confirm(t.deleteConfirmation)) {
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
      alert(t.deleteError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle mark as paid
  const handleMarkAsPaid = async () => {
    if (!isBillTransaction(transaction)) return;

    if (!confirm(t.markAsPaidConfirmation)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await billingService.markBillAsPaid(transaction.id);
      onUpdate(); // Refresh the transaction data
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      alert(t.updateError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle print receipt
  const handlePrintReceipt = async () => {
    try {
      if (isPaymentTransaction(transaction)) {
        const paymentData = transaction.data;
        const paymentDetails = {
          invoiceNumber: paymentData.receiptNumber || paymentData.id,
          status: paymentData.status,
          description: paymentData.description || 'Payment',
          notes: paymentData.notes || '',
          date: new Date(paymentData.paymentDate || paymentData.createdAt).toLocaleDateString('tr-TR'),
          transactionId: paymentData.transactionId || paymentData.id,
          receiptNumber: paymentData.receiptNumber || paymentData.id,
          paymentMethod: paymentData.paymentMethod,
          amount: paymentData.amount.toString(),
          currency: 'IQD'
        };
        
        // Generate HTML-based PDF and open print dialog
        await generateHTMLReceiptPDF(paymentDetails, {
          payments: {
            detail: {
              invoice: 'Invoice',
              companyInfo: 'Company Information',
              taxOffice: 'Tax Office',
              taxNumber: 'Tax Number',
              invoiceDate: 'Invoice Date',
              transactionId: 'Transaction ID',
              receiptNumber: 'Receipt Number',
              paymentStatus: 'Payment Status',
              paymentMethod: 'Payment Method',
              totalAmount: 'Total Amount',
              invoiceFooter: 'Thank you for your business!',
              contactInfo: 'For any questions, please contact us',
              customerService: 'Customer Service'
            },
            status: {
              completed: 'Completed',
              pending: 'Pending'
            }
          }
        }, { print: true, download: false });
      } else if (isBillTransaction(transaction)) {
        const billData = transaction.data;
        const billDetails = {
          invoiceNumber: billData.documentNumber || billData.id,
          status: billData.status,
          title: billData.title,
          description: billData.description,
          dueDate: new Date(billData.dueDate).toLocaleDateString('tr-TR'),
          billType: billData.billType,
          amount: billData.amount,
          currency: 'IQD',
          propertyName: billData.property?.name,
          assignedToName: billData.assignedTo ? `${billData.assignedTo.firstName} ${billData.assignedTo.lastName}` : undefined
        };
        
        // Generate HTML-based PDF and open print dialog
        await generateHTMLBillPDF(billDetails, {
          bills: {
            detail: {
              invoice: 'Invoice',
              companyInfo: 'Company Information',
              taxOffice: 'Tax Office',
              taxNumber: 'Tax Number',
              dueDate: 'Due Date',
              billType: 'Bill Type',
              documentNumber: 'Document Number',
              billStatus: 'Bill Status',
              property: 'Property',
              assignedTo: 'Assigned To',
              totalAmount: 'Total Amount',
              invoiceFooter: 'Thank you for your business!',
              contactInfo: 'For any questions, please contact us',
              customerService: 'Customer Service'
            },
            status: {
              paid: 'Paid',
              pending: 'Pending'
            }
          }
        }, { print: true, download: false });
      }
    } catch (error) {
      console.error('Error generating PDF for print:', error);
      const errorMessage = currentLanguage === 'tr' 
        ? 'PDF yazdırma için oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
        : currentLanguage === 'ar'
        ? 'حدث خطأ أثناء إنشاء PDF للطباعة. يرجى المحاولة مرة أخرى.'
        : 'An error occurred while generating the PDF for printing. Please try again.';
      alert(errorMessage);
    }
  };

  // Handle download receipt
  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    try {
      if (isPaymentTransaction(transaction)) {
        const paymentData = transaction.data;
        const paymentDetails = {
          invoiceNumber: paymentData.receiptNumber || paymentData.id,
          status: paymentData.status,
          description: paymentData.description || 'Payment',
          notes: paymentData.notes || '',
          date: new Date(paymentData.paymentDate || paymentData.createdAt).toLocaleDateString('tr-TR'),
          transactionId: paymentData.transactionId || paymentData.id,
          receiptNumber: paymentData.receiptNumber || paymentData.id,
          paymentMethod: paymentData.paymentMethod,
          amount: paymentData.amount.toString(),
          currency: 'IQD'
        };
        
        // Generate HTML-based PDF and download
        await generateHTMLReceiptPDF(paymentDetails, {
          payments: {
            detail: {
              invoice: 'Invoice',
              companyInfo: 'Company Information',
              taxOffice: 'Tax Office',
              taxNumber: 'Tax Number',
              invoiceDate: 'Invoice Date',
              transactionId: 'Transaction ID',
              receiptNumber: 'Receipt Number',
              paymentStatus: 'Payment Status',
              paymentMethod: 'Payment Method',
              totalAmount: 'Total Amount',
              invoiceFooter: 'Thank you for your business!',
              contactInfo: 'For any questions, please contact us',
              customerService: 'Customer Service'
            },
            status: {
              completed: 'Completed',
              pending: 'Pending'
            }
          }
        }, { print: false, download: true });
      } else if (isBillTransaction(transaction)) {
        const billData = transaction.data;
        const billDetails = {
          invoiceNumber: billData.documentNumber || billData.id,
          status: billData.status,
          title: billData.title,
          description: billData.description,
          dueDate: new Date(billData.dueDate).toLocaleDateString('tr-TR'),
          billType: billData.billType,
          amount: billData.amount,
          currency: 'IQD',
          propertyName: billData.property?.name,
          assignedToName: billData.assignedTo ? `${billData.assignedTo.firstName} ${billData.assignedTo.lastName}` : undefined
        };
        
        // Generate HTML-based PDF and download
        await generateHTMLBillPDF(billDetails, {
          bills: {
            detail: {
              invoice: 'Invoice',
              companyInfo: 'Company Information',
              taxOffice: 'Tax Office',
              taxNumber: 'Tax Number',
              dueDate: 'Due Date',
              billType: 'Bill Type',
              documentNumber: 'Document Number',
              billStatus: 'Bill Status',
              property: 'Property',
              assignedTo: 'Assigned To',
              totalAmount: 'Total Amount',
              invoiceFooter: 'Thank you for your business!',
              contactInfo: 'For any questions, please contact us',
              customerService: 'Customer Service'
            },
            status: {
              paid: 'Paid',
              pending: 'Pending'
            }
          }
        }, { print: false, download: true });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = currentLanguage === 'tr' 
        ? 'PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
        : currentLanguage === 'ar'
        ? 'حدث خطأ أثناء إنشاء PDF. يرجى المحاولة مرة أخرى.'
        : 'An error occurred while generating the PDF. Please try again.';
      alert(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle email receipt
  const handleEmailReceipt = () => {
    // In a real app, this would send receipt via email
    console.log('Emailing receipt for transaction:', transaction.id);
    alert(t.emailFeature);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <MoreVertical className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.actions}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.availableActions}
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
              {t.edit}
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
              {t.markAsPaid}
            </Button>
          )}

          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={handleDownloadReceipt}
            disabled={isSubmitting || isDownloading}
            isLoading={isDownloading}
            className="w-full justify-start"
          >
            {t.downloadReceipt}
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
              {t.printReceipt}
            </Button>

            <Button
              variant="ghost"
              size="md"
              icon={Mail}
              onClick={handleEmailReceipt}
              disabled={isSubmitting}
              className="w-full justify-start"
            >
              {t.emailReceipt}
            </Button>

            <Button
              variant="ghost"
              size="md"
              icon={RefreshCw}
              onClick={onUpdate}
              disabled={isSubmitting}
              className="w-full justify-start"
            >
              {t.refresh}
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
            {showMoreActions ? t.less : t.more}
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
                {t.transactionHistory}
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
                  {t.delete}
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
            <span>{t.lastUpdate}</span>
            <span>
              {new Date(transaction.data.updatedAt || transaction.data.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t.transactionType}</span>
            <span>
              {isBillTransaction(transaction) ? t.bill : t.payment}
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
              {t.completedTransactionWarning}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TransactionActions;