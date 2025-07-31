'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Calendar,
  CreditCard,
  DollarSign,
  Receipt,
  Hash,
  FileText,
  AlertCircle,
  Search
} from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
import TextArea from '@/app/components/ui/TextArea';
import Select from '@/app/components/ui/Select';
// import DatePicker from '@/app/components/ui/DatePicker';
import { 
  PaymentFormData, 
  PaymentMethod, 
  PAYMENT_METHOD_OPTIONS,
  DISABLED_PAYMENT_METHOD_OPTIONS,
  CreatePaymentDto 
} from '@/services/types/billing.types';
import { paymentService, billingService } from '@/services';

interface CreatePaymentFormProps {
  onSuccess: (payment: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface BillOption {
  id: string;
  value: string;
  label: string;
  amount: number;
  status: string;
  dueDate: string;
}

const CreatePaymentForm: React.FC<CreatePaymentFormProps> = ({
  onSuccess,
  onCancel,
  loading: externalLoading = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bills, setBills] = useState<BillOption[]>([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [selectedBill, setSelectedBill] = useState<BillOption | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm<PaymentFormData>({
    mode: 'onChange',
    defaultValues: {
      billId: '',
      amount: 0,
      paymentMethod: 'CASH',
      paymentDate: new Date().toISOString().split('T')[0], // Format for HTML date input
      transactionId: '',
      receiptNumber: '',
      description: '',
      notes: ''
    }
  });

  const watchedBillId = watch('billId');
  const watchedPaymentMethod = watch('paymentMethod');
  const watchedAmount = watch('amount');

  // Fetch pending/overdue bills
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoadingBills(true);
        
        // Fetch pending and overdue bills
        const [pendingBills, overdueBills] = await Promise.all([
          billingService.getPendingBills(),
          billingService.getOverdueBills()
        ]);

        const allBills = [...pendingBills, ...overdueBills];
        
        const billOptions: BillOption[] = allBills.map((bill: any) => ({
          id: bill.id,
          value: bill.id,
          label: `${bill.title} - ${bill.amount} IQD`,
          amount: bill.amount,
          status: bill.status,
          dueDate: bill.dueDate
        }));

        setBills(billOptions);
      } catch (error) {
        console.error('Error fetching bills:', error);
      } finally {
        setLoadingBills(false);
      }
    };

    fetchBills();
  }, []);

  // Update selected bill info and default amount when bill changes
  useEffect(() => {
    if (watchedBillId) {
      const bill = bills.find(b => b.id === watchedBillId);
      setSelectedBill(bill || null);
      if (bill) {
        setValue('amount', bill.amount);
      }
    } else {
      setSelectedBill(null);
    }
  }, [watchedBillId, bills, setValue]);

  const onSubmit = async (data: PaymentFormData) => {
    if (isSubmitting || externalLoading) return;

    setIsSubmitting(true);
    try {
      const paymentData: CreatePaymentDto = {
        billId: data.billId,
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod,
        paymentDate: new Date(data.paymentDate).toISOString(),
        transactionId: data.transactionId || undefined,
        receiptNumber: data.receiptNumber || undefined,
        description: data.description || undefined,
        notes: data.notes || undefined,
        status: 'COMPLETED' // Default to completed for manual entry
      };

      const response = await paymentService.createPayment(paymentData);
      
      if (response.data) {
        onSuccess(response.data);
        reset();
      }
    } catch (error: any) {
      console.error('Error creating payment:', error);
      // Handle error - could show toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    const option = PAYMENT_METHOD_OPTIONS.find(opt => opt.value === method);
    return option?.icon || '💳';
  };

  const getPaymentMethodDescription = (method: PaymentMethod) => {
    const option = PAYMENT_METHOD_OPTIONS.find(opt => opt.value === method);
    return option?.description || '';
  };

  const isOverpayment = selectedBill && watchedAmount > selectedBill.amount;
  const isUnderpayment = selectedBill && watchedAmount < selectedBill.amount && watchedAmount > 0;

  const isLoading = isSubmitting || externalLoading || loadingBills;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Ödeme Kaydet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mevcut bir faturaya ödeme kaydedin
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bill Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fatura Seçin *
          </label>
          <Select
            {...register('billId', { required: 'Fatura seçiniz' })}
            error={errors.billId?.message}
            disabled={isLoading}
            options={[
              { value: '', label: loadingBills ? 'Faturalar yükleniyor...' : 'Fatura seçin' },
              ...bills
            ]}
          />
          {errors.billId && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.billId.message}
            </p>
          )}
        </div>

        {/* Selected Bill Info */}
        {selectedBill && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Seçilen Fatura Bilgileri
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tutar:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedBill.amount.toLocaleString()} IQD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Durum:</span>
                <span className={`font-medium ${
                  selectedBill.status === 'OVERDUE' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {selectedBill.status === 'OVERDUE' ? 'Gecikmiş' : 'Bekliyor'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Vade Tarihi:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedBill.dueDate).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ödeme Yöntemi *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Active Payment Methods */}
            {PAYMENT_METHOD_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watchedPaymentMethod === option.value
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('paymentMethod', { required: 'Ödeme yöntemi seçiniz' })}
                  className="sr-only"
                />
                <span className="text-lg mb-1">{option.icon}</span>
                <div className="text-xs font-medium text-gray-900 dark:text-white text-center">
                  {option.label}
                </div>
                {watchedPaymentMethod === option.value && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </label>
            ))}
            
            {/* Disabled Payment Methods */}
            {DISABLED_PAYMENT_METHOD_OPTIONS.map((option) => (
              <div
                key={option.value}
                className="relative flex flex-col items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"
              >
                <span className="text-lg mb-1 grayscale">{option.icon}</span>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
                  {option.label}
                </div>
                <div className="absolute top-1 right-1 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs px-1.5 py-0.5 rounded-full font-medium">
                  Yakında
                </div>
              </div>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        {/* Amount and Payment Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ödeme Tutarı (IQD) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register('amount', { 
                required: 'Tutar gereklidir',
                min: { value: 0.01, message: 'Tutar 0\'dan büyük olmalıdır' }
              })}
              placeholder="0.00"
              icon={DollarSign}
              error={errors.amount?.message}
              disabled={isLoading}
            />
            {isOverpayment && (
              <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Fazla ödeme: {(watchedAmount - selectedBill.amount).toLocaleString()} IQD
              </p>
            )}
            {isUnderpayment && (
              <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Kısmi ödeme: {(selectedBill.amount - watchedAmount).toLocaleString()} IQD kalan
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ödeme Tarihi *
            </label>
            <Input
              type="date"
              {...register('paymentDate', { required: 'Ödeme tarihi gereklidir' })}
              icon={Calendar}
              error={errors.paymentDate?.message}
              disabled={isLoading}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Transaction ID and Receipt Number Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              İşlem ID
            </label>
            <Input
              {...register('transactionId')}
              placeholder="Örnek: TRX123456789"
              icon={Hash}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Makbuz Numarası
            </label>
            <Input
              {...register('receiptNumber')}
              placeholder="Örnek: RCT-2024-001"
              icon={Receipt}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Açıklama
          </label>
          <Input
            {...register('description')}
            placeholder="Ödeme açıklaması..."
            icon={FileText}
            disabled={isLoading}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notlar
          </label>
          <TextArea
            value={watch('notes')}
            onChange={(e: any) => setValue('notes', e.target.value)}
            placeholder="Ödeme hakkında ek notlar..."
            rows={3}
            disabled={isLoading}
          />
        </div>

        {/* Current Payment Method Info */}
        {watchedPaymentMethod && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">{getPaymentMethodIcon(watchedPaymentMethod)}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {PAYMENT_METHOD_OPTIONS.find(opt => opt.value === watchedPaymentMethod)?.label}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                - {getPaymentMethodDescription(watchedPaymentMethod)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            İptal
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isLoading}
            isLoading={isSubmitting}
            icon={CreditCard}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Ödeme Kaydediliyor...' : 'Ödeme Kaydet'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreatePaymentForm;