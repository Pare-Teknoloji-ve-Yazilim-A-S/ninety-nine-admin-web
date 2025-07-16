import React from 'react';
import Modal from './Modal';
import { Bill } from '@/services/billing.service';
import { CreditCard } from 'lucide-react';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bills: Bill[];
  residentName: string;
  loading?: boolean;
  error?: string | null;
}

const statusColor = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'text-semantic-success-600';
    case 'OVERDUE':
      return 'text-primary-red';
    case 'PENDING':
      return 'text-semantic-warning-600';
    case 'CANCELLED':
      return 'text-gray-400';
    default:
      return 'text-text-light-secondary';
  }
};

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  isOpen,
  onClose,
  bills,
  residentName,
  loading = false,
  error = null,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${residentName} - Ödeme Geçmişi`}
      icon={CreditCard}
      size="lg"
      variant="default"
      scrollable
    >
      {loading ? (
        <div className="py-8 text-center text-text-light-secondary">Yükleniyor...</div>
      ) : error ? (
        <div className="py-8 text-center text-primary-red">{error}</div>
      ) : bills.length === 0 ? (
        <div className="py-8 text-center text-text-light-secondary">Ödeme geçmişi bulunamadı.</div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {bills.map((bill) => (
            <div key={bill.id} className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-text-on-light dark:text-text-on-dark">{bill.title}</div>
                <div className="text-xs text-text-light-muted dark:text-text-muted mt-1 flex flex-wrap gap-2">
                  <span>Oluşturulma: {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}</span>
                  <span>Vade: {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}</span>
                  <span>Tip: {bill.billType}</span>
                  <span className={`font-medium ${statusColor(bill.status)}`}>{bill.status === 'PAID' ? 'Ödendi' : bill.status === 'OVERDUE' ? 'Gecikmiş' : bill.status === 'PENDING' ? 'Bekliyor' : bill.status === 'CANCELLED' ? 'İptal Edildi' : bill.status}</span>
                </div>
                {bill.description && (
                  <div className="text-xs text-text-light-muted dark:text-text-muted mt-1">{bill.description}</div>
                )}
              </div>
              <div className="flex flex-col items-end min-w-[100px]">
                <span className="font-semibold text-lg text-primary-gold">₺{Number(bill.amount).toLocaleString('tr-TR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default PaymentHistoryModal; 