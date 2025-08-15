'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Calendar,
  CreditCard,
  DollarSign,
  Receipt,
  FileText,
  AlertCircle,
  X
} from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
// import TextArea from '@/app/components/ui/TextArea';
// import Select from '@/app/components/ui/Select';
// import DatePicker from '@/app/components/ui/DatePicker';
import { 
  PaymentFormData, 
  PaymentMethod, 
  PAYMENT_METHOD_OPTIONS,
  DISABLED_PAYMENT_METHOD_OPTIONS,
  CreatePaymentDto 
} from '@/services/types/billing.types';
import { paymentService } from '@/services';
import type { ResponseBillDto } from '@/services/types/billing.types';
import billingService from '@/services/billing.service';
import { enumsService } from '@/services/enums.service';

interface CreatePaymentFormProps {
  onSuccess: (payment: any) => void;
  onCancel: () => void;
  loading?: boolean;
  preselectedBills?: ResponseBillDto[];
  onRemoveBill?: (billId: string) => void;
  onClearBills?: () => void;
  selectedPaymentMethod?: PaymentMethod;
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
  loading: externalLoading = false,
  preselectedBills = [],
  onRemoveBill,
  onClearBills,
  selectedPaymentMethod,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bills, setBills] = useState<BillOption[]>([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [appEnums, setAppEnums] = useState<Record<string, any> | null>(null);

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
        paymentMethod: PaymentMethod.CASH,
      paymentDate: new Date().toISOString().split('T')[0], // Format for HTML date input
      transactionId: '',
      receiptNumber: '',
      description: '',
      notes: ''
    }
  });

  const watchedPaymentMethod = watch('paymentMethod');

  // Reflect selected payment method from parent into form state
  useEffect(() => {
    if (selectedPaymentMethod) {
      setValue('paymentMethod', selectedPaymentMethod, { shouldValidate: true });
    }
  }, [selectedPaymentMethod, setValue]);

  const totalSelectedAmount = useMemo(() => {
    return bills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  }, [bills]);

  // Load bills: always reflect bills selected from parent; no internal fetching
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingBills(true);
        const mapped: BillOption[] = (preselectedBills || []).map((bill: any) => ({
          id: bill.id,
          value: bill.id,
          label: `${bill.title} - ${bill.amount} IQD`,
          amount: Number(bill.amount),
          status: bill.status,
          dueDate: bill.dueDate
        }));
        setBills(mapped);
        setValue('billId', mapped[0]?.id || '');
      } catch (error) {
        console.error('Error loading bills:', error);
      } finally {
        setLoadingBills(false);
      }
    };
    load();
  }, [preselectedBills, setValue]);

  // Load enums from localStorage if available
  useEffect(() => {
    const cached = enumsService.getFromCache();
    if (cached) setAppEnums(cached);
  }, []);

  // Keep derived fields in sync
  useEffect(() => {
    setValue('amount', totalSelectedAmount);
    // Auto-fill receipt number as joined bill IDs
    const joined = bills.map(b => b.id).join(',');
    setValue('receiptNumber', joined);
    // Ensure today's date
    setValue('paymentDate', new Date().toISOString().split('T')[0]);
  }, [bills, setValue, totalSelectedAmount]);

  const onSubmit = async (data: PaymentFormData) => {
    if (isSubmitting || externalLoading) return;

    setIsSubmitting(true);
    try {
      // Bulk mark as paid
      const paidAtIso = new Date().toISOString();
      const billIds = bills.map(b => b.id);
      const bulkResult = await billingService.markBillsAsPaidBulk({ billIds, paidAt: paidAtIso });
      onSuccess(bulkResult);
      reset();
    } catch (error: any) {
      console.error('Error creating payment:', error);
      // Handle error - could show toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build dynamic options from localStorage (fallback to constants)
  const dynamicPaymentMethodOptions = (appEnums?.data?.payment?.paymentMethod as string[] | undefined)
    ? (appEnums!.data!.payment!.paymentMethod as string[]).map((code) => {
        const enumValue = (PaymentMethod as any)[code] ?? code;
        const fallback = PAYMENT_METHOD_OPTIONS.find(o => String(o.value) === String(enumValue));
        return {
          value: (PaymentMethod as any)[code] ?? (fallback?.value ?? enumValue),
          label: fallback?.label ?? code,
          icon: fallback?.icon ?? '💳',
          description: fallback?.description ?? ''
        };
      })
    : PAYMENT_METHOD_OPTIONS;

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    const option = dynamicPaymentMethodOptions.find(opt => opt.value === method);
    return option?.icon || '💳';
  };

  const getPaymentMethodDescription = (method: PaymentMethod) => {
    const option = dynamicPaymentMethodOptions.find(opt => opt.value === method);
    return option?.description || '';
  };

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
        {/* Selected Bills List (from upper card) - payment method under title, then bills list */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-text-on-light dark:text-text-on-dark" />
            <label className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
              Seçilen Faturalar
            </label>
          </div>
          {/* Payment method selection moved to parent card. We display current selection here. */}
          {loadingBills ? (
            <div className="text-sm text-text-light-secondary dark:text-text-secondary">Faturalar yükleniyor...</div>
          ) : bills.length === 0 ? (
            <div className="text-sm text-text-light-secondary dark:text-text-secondary">Üstteki karttan fatura seçiniz</div>
          ) : (
            <div className="space-y-2">
              {bills.map((b) => (
                <div
                  key={b.id}
                  className="flex items-start justify-between gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                >
                  <div className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <span className="text-text-on-light dark:text-text-on-dark font-medium">Tutar:</span>
                      <span className="text-text-on-light dark:text-text-on-dark">{Number(b.amount).toLocaleString('tr-TR')} IQD</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-text-on-light dark:text-text-on-dark font-medium">Durum:</span>
                      <span className={b.status === 'OVERDUE' ? 'text-primary-red' : 'text-semantic-warning-600'}>
                        {b.status === 'OVERDUE' ? 'Gecikmiş' : 'Bekliyor'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-text-on-light dark:text-text-on-dark font-medium">Vade Tarihi:</span>
                      <span className="text-text-on-light dark:text-text-on-dark">{new Date(b.dueDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={X}
                    onClick={() => onRemoveBill?.(b.id)}
                  >
                    Kaldır
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        

        {/* Amount and Payment Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ödeme Tutarı (IQD) *
            </label>
            <Input
              type="text"
              value={`${totalSelectedAmount.toLocaleString('tr-TR')} IQD`}
              readOnly
              icon={DollarSign}
              disabled={isSubmitting || externalLoading || loadingBills}
            />
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
              readOnly
              disabled
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Receipt Number - auto-filled from selected bill IDs */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Makbuz Numarası
          </label>
          <Input
            {...register('receiptNumber')}
            placeholder="Seçilen faturaların ID listesi"
            icon={Receipt}
            readOnly
            disabled
          />
        </div>

        {/* Hidden fields for description and notes (temporarily removed from UI) */}
        <input type="hidden" {...register('description')} />
        <input type="hidden" {...register('notes')} />

        {/* Current Payment Method Info */}
        {watchedPaymentMethod && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">{getPaymentMethodIcon(watchedPaymentMethod)}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {dynamicPaymentMethodOptions.find(opt => opt.value === watchedPaymentMethod)?.label}
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