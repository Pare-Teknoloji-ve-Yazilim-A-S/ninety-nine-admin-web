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
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { 
  UPDATE_PAYMENT_PERMISSION_ID, 
  UPDATE_PAYMENT_PERMISSION_NAME 
} from '@/app/components/ui/Sidebar';

// Dil çevirileri
const translations = {
  tr: {
    // Form header
    recordPaymentDesc: 'Mevcut bir faturaya ödeme kaydedin',
    
    // Selected bills section
    selectedBills: 'Seçilen Faturalar',
    billsLoading: 'Faturalar yükleniyor...',
    selectBillsFromCard: 'Üstteki karttan fatura seçiniz',
    amount: 'Tutar:',
    status: 'Durum:',
    dueDate: 'Vade Tarihi:',
    overdue: 'Gecikmiş',
    pending: 'Bekliyor',
    remove: 'Kaldır',
    
    // Form fields
    paymentAmount: 'Ödeme Tutarı (IQD) *',
    paymentDate: 'Ödeme Tarihi *',
    paymentDateRequired: 'Ödeme tarihi gereklidir',
    receiptNumber: 'Makbuz Numarası',
    receiptNumberPlaceholder: 'Seçilen faturaların ID listesi',
    
    // Buttons
    cancel: 'İptal',
    recordPayment: 'Ödeme Kaydet',
    recordingPayment: 'Ödeme Kaydediliyor...',
    permissionLoading: 'İzinler kontrol ediliyor...',
    noPermission: 'Bu sayfaya erişim izniniz bulunmamaktadır.',
    requiredPermission: 'Gerekli İzin: Ödeme Güncelleme'
  },
  en: {
    // Form header
    recordPaymentDesc: 'Record payment for an existing bill',
    
    // Selected bills section
    selectedBills: 'Selected Bills',
    billsLoading: 'Loading bills...',
    selectBillsFromCard: 'Select bills from the card above',
    amount: 'Amount:',
    status: 'Status:',
    dueDate: 'Due Date:',
    overdue: 'Overdue',
    pending: 'Pending',
    remove: 'Remove',
    
    // Form fields
    paymentAmount: 'Payment Amount (IQD) *',
    paymentDate: 'Payment Date *',
    paymentDateRequired: 'Payment date is required',
    receiptNumber: 'Receipt Number',
    receiptNumberPlaceholder: 'Selected bills ID list',
    
    // Buttons
    cancel: 'Cancel',
    recordPayment: 'Record Payment',
    recordingPayment: 'Recording Payment...',
    permissionLoading: 'Checking permissions...',
    noPermission: 'You do not have permission to access this page.',
    requiredPermission: 'Required Permission: Update Payment'
  },
  ar: {
    // Form header
    recordPaymentDesc: 'تسجيل دفعة لفاتورة موجودة',
    
    // Selected bills section
    selectedBills: 'الفواتير المحددة',
    billsLoading: 'جاري تحميل الفواتير...',
    selectBillsFromCard: 'اختر الفواتير من البطاقة أعلاه',
    amount: 'المبلغ:',
    status: 'الحالة:',
    dueDate: 'تاريخ الاستحقاق:',
    overdue: 'متأخر',
    pending: 'معلق',
    remove: 'إزالة',
    
    // Form fields
    paymentAmount: 'مبلغ الدفع (دينار عراقي) *',
    paymentDate: 'تاريخ الدفع *',
    paymentDateRequired: 'تاريخ الدفع مطلوب',
    receiptNumber: 'رقم الإيصال',
    receiptNumberPlaceholder: 'قائمة معرفات الفواتير المحددة',
    
    // Buttons
    cancel: 'إلغاء',
    recordPayment: 'تسجيل الدفع',
    recordingPayment: 'جاري تسجيل الدفع...',
    permissionLoading: 'جاري فحص الأذونات...',
    noPermission: 'ليس لديك إذن للوصول إلى هذه الصفحة.',
    requiredPermission: 'الإذن المطلوب: تحديث الدفع'
  }
};

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
  // BEFORE any conditional returns - Tüm hook'ları en üste taşı
  const [mounted, setMounted] = useState(false);
  const { hasPermission, loading: permissionLoading } = usePermissionCheck();
  
  // Client-side mount kontrolü
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const [currentLanguage, setCurrentLanguage] = useState('tr');
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

  // Tüm hook'ları en üste taşı
  const watchedPaymentMethod = watch('paymentMethod');

  const totalSelectedAmount = useMemo(() => {
    return bills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  }, [bills]);

  // Dil tercihini localStorage'dan al
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Reflect selected payment method from parent into form state
  useEffect(() => {
    if (selectedPaymentMethod) {
      setValue('paymentMethod', selectedPaymentMethod, { shouldValidate: true });
    }
  }, [selectedPaymentMethod, setValue]);

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

  // Keep derived fields in sync - Bu useEffect'i hook'ların başına taşıyoruz
  useEffect(() => {
    setValue('amount', totalSelectedAmount);
    // Auto-fill receipt number as joined bill IDs
    const joined = bills.map(b => b.id).join(',');
    setValue('receiptNumber', joined);
    // Ensure today's date
    setValue('paymentDate', new Date().toISOString().split('T')[0]);
  }, [bills, setValue, totalSelectedAmount]);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

  // Permission kontrolü - koşullu render fonksiyonları
  const renderPermissionLoading = () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">{t.permissionLoading}</span>
    </div>
  );

  const renderNoPermission = () => (
    <Card className="p-6 text-center">
      <div className="flex flex-col items-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">İzin Yok</h3>
          <p className="text-gray-600 mb-2">{t.noPermission}</p>
          <p className="text-sm text-gray-500">{t.requiredPermission}</p>
        </div>
        <Button onClick={onCancel} variant="outline">
          {t.cancel}
        </Button>
      </div>
    </Card>
  );

  // SSR ve permission kontrolü
  if (!mounted || permissionLoading) {
    return renderPermissionLoading();
  }

  if (!hasPermission(UPDATE_PAYMENT_PERMISSION_ID)) {
    return renderNoPermission();
  }



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
  const dynamicPaymentMethodOptions = (() => {
    const paymentMethodTranslations = {
      tr: {
        CASH: { label: 'Nakit', description: 'Nakit ödeme' },
        CREDIT_CARD: { label: 'Kredi Kartı', description: 'Kredi kartı ile ödeme' },
        BANK_TRANSFER: { label: 'Banka Havalesi/EFT', description: 'Banka havalesi/EFT ile ödeme' },
        DIRECT_DEBIT: { label: 'Otomatik Ödeme Talimatı', description: 'Hesaptan otomatik tahsilat' },
        ONLINE_PAYMENT: { label: 'Online Ödeme', description: 'İnternet üzerinden ödeme' },
        MOBILE_PAYMENT: { label: 'Mobil Ödeme', description: 'Mobil uygulama ile ödeme' },
        CHECK: { label: 'Çek', description: 'Çek ile ödeme' },
        OTHER: { label: 'Diğer', description: 'Diğer ödeme yöntemi' }
      },
      en: {
        CASH: { label: 'Cash', description: 'Cash payment' },
        CREDIT_CARD: { label: 'Credit Card', description: 'Payment by credit card' },
        BANK_TRANSFER: { label: 'Bank Transfer/EFT', description: 'Payment by bank transfer/EFT' },
        DIRECT_DEBIT: { label: 'Direct Debit', description: 'Automatic deduction from account' },
        ONLINE_PAYMENT: { label: 'Online Payment', description: 'Payment over the internet' },
        MOBILE_PAYMENT: { label: 'Mobile Payment', description: 'Payment via mobile app' },
        CHECK: { label: 'Check', description: 'Payment by check' },
        OTHER: { label: 'Other', description: 'Other payment method' }
      },
      ar: {
        CASH: { label: 'نقداً', description: 'دفع نقدي' },
        CREDIT_CARD: { label: 'بطاقة ائتمان', description: 'الدفع ببطاقة الائتمان' },
        BANK_TRANSFER: { label: 'تحويل بنكي/EFT', description: 'الدفع بالتحويل البنكي/EFT' },
        DIRECT_DEBIT: { label: 'خصم مباشر', description: 'خصم تلقائي من الحساب' },
        ONLINE_PAYMENT: { label: 'دفع إلكتروني', description: 'الدفع عبر الإنترنت' },
        MOBILE_PAYMENT: { label: 'دفع محمول', description: 'الدفع عبر التطبيق المحمول' },
        CHECK: { label: 'شيك', description: 'الدفع بشيك' },
        OTHER: { label: 'أخرى', description: 'طريقة دفع أخرى' }
      }
    };

    const baseOptions = (appEnums?.data?.payment?.paymentMethod as string[] | undefined)
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

    return baseOptions.map(option => ({
      ...option,
      label: paymentMethodTranslations[currentLanguage as keyof typeof paymentMethodTranslations]?.[option.value as keyof typeof paymentMethodTranslations.tr]?.label || option.label,
      description: paymentMethodTranslations[currentLanguage as keyof typeof paymentMethodTranslations]?.[option.value as keyof typeof paymentMethodTranslations.tr]?.description || option.description
    }));
  })();

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
            {t.recordPayment}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.recordPaymentDesc}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Selected Bills List (from upper card) - payment method under title, then bills list */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-text-on-light dark:text-text-on-dark" />
            <label className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
              {t.selectedBills}
            </label>
          </div>
          {/* Payment method selection moved to parent card. We display current selection here. */}
          {loadingBills ? (
            <div className="text-sm text-text-light-secondary dark:text-text-secondary">{t.billsLoading}</div>
          ) : bills.length === 0 ? (
            <div className="text-sm text-text-light-secondary dark:text-text-secondary">{t.selectBillsFromCard}</div>
          ) : (
            <div className="space-y-2">
              {bills.map((b) => (
                <div
                  key={b.id}
                  className="flex items-start justify-between gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                >
                  <div className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <span className="text-text-on-light dark:text-text-on-dark font-medium">{t.amount}</span>
                      <span className="text-text-on-light dark:text-text-on-dark">{Number(b.amount).toLocaleString('tr-TR')} IQD</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-text-on-light dark:text-text-on-dark font-medium">{t.status}</span>
                      <span className={b.status === 'OVERDUE' ? 'text-primary-red' : 'text-semantic-warning-600'}>
                        {b.status === 'OVERDUE' ? t.overdue : t.pending}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-text-on-light dark:text-text-on-dark font-medium">{t.dueDate}</span>
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
                    {t.remove}
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
              {t.paymentAmount}
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
              {t.paymentDate}
            </label>
            <Input
              type="date"
              {...register('paymentDate', { required: t.paymentDateRequired })}
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
            {t.receiptNumber}
          </label>
          <Input
            {...register('receiptNumber')}
            placeholder={t.receiptNumberPlaceholder}
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
            {t.cancel}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isLoading}
            isLoading={isSubmitting}
            icon={CreditCard}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? t.recordingPayment : t.recordPayment}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreatePaymentForm;