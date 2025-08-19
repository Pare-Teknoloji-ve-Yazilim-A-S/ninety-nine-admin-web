'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Button from '@/app/components/ui/Button';
import { CreditCard, ArrowLeft, CheckCircle, Home, User, AlertTriangle, X } from 'lucide-react';
import CreatePaymentForm from '../../components/CreatePaymentForm';
import Card from '@/app/components/ui/Card';
import SearchBar from '@/app/components/ui/SearchBar';
import billingService from '@/services/billing.service';
import type { ResponseBillDto } from '@/services/types/billing.types';
import TablePagination from '@/app/components/ui/TablePagination';
import { PAYMENT_METHOD_OPTIONS, PaymentMethod } from '@/services/types/billing.types';
import { enumsService } from '@/services/enums.service';

// Dil çevirileri
const translations = {
  tr: {
    pageTitle: 'Ödeme Kaydet',
    pageDescription: 'Mevcut bir faturaya ödeme kaydedin',
    home: 'Ana Sayfa',
    financialTransactions: 'Finansal İşlemler',
    newTransaction: 'Yeni İşlem',
    recordPayment: 'Ödeme Kaydet',
    
    // Property selection card
    selectPropertyToPay: 'Ödeme Yapılacak Konut Seçin',
    searchPlaceholder: 'Adres, daire numarası veya isim ile ara...',
    transactionTypeLabel: 'İşlem Türü:',
    all: 'Tümü',
    dues: 'Aidat',
    utility: 'Fatura',
    maintenance: 'Bakım',
    penalty: 'Ceza',
    other: 'Diğer',
    recordsSelected: 'kayıt seçili',
    removeAll: 'Tümünü Kaldır',
    
    // Table headers
    apartmentNo: 'Daire No',
    fullName: 'Ad Soyad',
    debtAmount: 'Borç Tutarı',
    status: 'Durum',
    transactionType: 'İşlem Türü',
    
    // Table content
    searching: 'Aranıyor...',
    noResults: 'Sonuç bulunamadı',
    hasDebt: 'Borcu Var',
    noDebt: 'Borç Yok',
    remove: 'Kaldır',
    select: 'Seç',
    confirmAndContinue: 'Onayla ve Devam Et',
    
    // Payment method card
    selectPaymentMethod: 'Ödeme Yöntemi Seçin',
    selectPropertyFirst: 'Lütfen önce üstteki karttan bir konut seçin ve onaylayın',
    
    // Form section
    selectPropertyFirstForm: 'Lütfen önce üstteki karttan bir konut seçin ve onaylayın',
    selectPaymentMethodForm: 'Lütfen ortadaki karttan bir ödeme yöntemi seçin',
    
    // Help section
    paymentTips: 'Ödeme Kaydetme İpuçları:',
    tip1: 'Sadece bekleyen veya gecikmiş faturalar görüntülenir',
    tip2: 'Ödeme tutarı fatura tutarından farklı olabilir (kısmi/fazla ödeme)',
    tip3: 'Ödeme yöntemini doğru seçtiğinizden emin olun',
    tip4: 'İşlem ID ve makbuz numarası takip için önemlidir',
    tip5: 'Ödeme tarihi geçmiş bir tarih olabilir'
  },
  en: {
    pageTitle: 'Record Payment',
    pageDescription: 'Record payment for an existing bill',
    home: 'Home',
    financialTransactions: 'Financial Transactions',
    newTransaction: 'New Transaction',
    recordPayment: 'Record Payment',
    
    // Property selection card
    selectPropertyToPay: 'Select Property to Pay',
    searchPlaceholder: 'Search by address, apartment number or name...',
    transactionTypeLabel: 'Transaction Type:',
    all: 'All',
    dues: 'Dues',
    utility: 'Utility',
    maintenance: 'Maintenance',
    penalty: 'Penalty',
    other: 'Other',
    recordsSelected: 'records selected',
    removeAll: 'Remove All',
    
    // Table headers
    apartmentNo: 'Apartment No',
    fullName: 'Full Name',
    debtAmount: 'Debt Amount',
    status: 'Status',
    transactionType: 'Transaction Type',
    
    // Table content
    searching: 'Searching...',
    noResults: 'No results found',
    hasDebt: 'Has Debt',
    noDebt: 'No Debt',
    remove: 'Remove',
    select: 'Select',
    confirmAndContinue: 'Confirm and Continue',
    
    // Payment method card
    selectPaymentMethod: 'Select Payment Method',
    selectPropertyFirst: 'Please first select a property from the card above and confirm',
    
    // Form section
    selectPropertyFirstForm: 'Please first select a property from the card above and confirm',
    selectPaymentMethodForm: 'Please select a payment method from the middle card',
    
    // Help section
    paymentTips: 'Payment Recording Tips:',
    tip1: 'Only pending or overdue bills are displayed',
    tip2: 'Payment amount can be different from bill amount (partial/overpayment)',
    tip3: 'Make sure to select the correct payment method',
    tip4: 'Transaction ID and receipt number are important for tracking',
    tip5: 'Payment date can be a past date'
  },
  ar: {
    pageTitle: 'تسجيل الدفع',
    pageDescription: 'تسجيل دفعة لفاتورة موجودة',
    home: 'الرئيسية',
    financialTransactions: 'المعاملات المالية',
    newTransaction: 'معاملة جديدة',
    recordPayment: 'تسجيل الدفع',
    
    // Property selection card
    selectPropertyToPay: 'اختر العقار للدفع',
    searchPlaceholder: 'البحث بالعنوان أو رقم الشقة أو الاسم...',
    transactionTypeLabel: 'نوع المعاملة:',
    all: 'الكل',
    dues: 'الرسوم',
    utility: 'المرافق',
    maintenance: 'الصيانة',
    penalty: 'الغرامة',
    other: 'أخرى',
    recordsSelected: 'سجل محدد',
    removeAll: 'إزالة الكل',
    
    // Table headers
    apartmentNo: 'رقم الشقة',
    fullName: 'الاسم الكامل',
    debtAmount: 'مبلغ الدين',
    status: 'الحالة',
    transactionType: 'نوع المعاملة',
    
    // Table content
    searching: 'جاري البحث...',
    noResults: 'لم يتم العثور على نتائج',
    hasDebt: 'لديه دين',
    noDebt: 'لا يوجد دين',
    remove: 'إزالة',
    select: 'اختيار',
    confirmAndContinue: 'تأكيد والمتابعة',
    
    // Payment method card
    selectPaymentMethod: 'اختر طريقة الدفع',
    selectPropertyFirst: 'يرجى أولاً اختيار عقار من البطاقة أعلاه والتأكيد',
    
    // Form section
    selectPropertyFirstForm: 'يرجى أولاً اختيار عقار من البطاقة أعلاه والتأكيد',
    selectPaymentMethodForm: 'يرجى اختيار طريقة دفع من البطاقة الوسطى',
    
    // Help section
    paymentTips: 'نصائح تسجيل الدفع:',
    tip1: 'يتم عرض الفواتير المعلقة أو المتأخرة فقط',
    tip2: 'يمكن أن يكون مبلغ الدفع مختلفاً عن مبلغ الفاتورة (دفع جزئي/زائد)',
    tip3: 'تأكد من اختيار طريقة الدفع الصحيحة',
    tip4: 'معرف المعاملة ورقم الإيصال مهمان للتتبع',
    tip5: 'يمكن أن يكون تاريخ الدفع تاريخاً سابقاً'
  }
};

export default function CreatePaymentPage() {
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [pendingBills, setPendingBills] = useState<ResponseBillDto[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [billType, setBillType] = useState<string | undefined>(undefined);
  // Helper to load from backend
  const loadPending = async (params: { page: number; limit: number; search?: string; billType?: string }) => {
    setSearchLoading(true);
    try {
      const { bills, pagination } = await billingService.getAllPendingBillsPaginated({
        page: params.page,
        limit: params.limit,
        search: params.search,
        orderColumn: 'createdAt',
        orderBy: 'DESC',
        billType: params.billType,
      });
      setPendingBills(bills);
      setTotal(pagination.total);
      setTotalPages(pagination.totalPages);
    } finally {
      setSearchLoading(false);
    }
  };
  const [selectedBills, setSelectedBills] = useState<ResponseBillDto[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [appEnums, setAppEnums] = useState<Record<string, any> | null>(null);
  const router = useRouter();

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t.home, href: '/dashboard' },
    { label: t.financialTransactions, href: '/dashboard/financial' },
    { label: t.newTransaction, href: '/dashboard/financial/create' },
    { label: t.recordPayment, active: true }
  ];

  const handleCancel = () => {
    router.push('/dashboard/financial/create');
  };

  const handleSuccess = (payment: any) => {
    console.log('Payment created successfully:', payment);
    
    // Show success message and redirect
    // In a real app, you might want to show a toast notification here
    setTimeout(() => {
      router.push('/dashboard/financial');
    }, 1000);
  };

  const handleGoBack = () => {
    router.back();
  };

  // Initial fetch
  useEffect(() => {
    (async () => {
      setSearchLoading(true);
      try {
        const { bills, pagination } = await billingService.getAllPendingBillsPaginated({
          page,
          limit,
          search: undefined,
          orderColumn: 'createdAt',
          orderBy: 'DESC',
          billType,
        });
        setPendingBills(bills);
        setTotal(pagination.total);
        setTotalPages(pagination.totalPages);
      } finally {
        setSearchLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load enums from localStorage if available
  useEffect(() => {
    const cached = enumsService.getFromCache();
    if (cached) setAppEnums(cached);
  }, []);

  // Build dynamic payment method options from appEnums (fallback to constants)
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
          };
        })
      : PAYMENT_METHOD_OPTIONS;

    return baseOptions.map(option => ({
      ...option,
      label: paymentMethodTranslations[currentLanguage as keyof typeof paymentMethodTranslations]?.[option.value as keyof typeof paymentMethodTranslations.tr]?.label || option.label,
      description: paymentMethodTranslations[currentLanguage as keyof typeof paymentMethodTranslations]?.[option.value as keyof typeof paymentMethodTranslations.tr]?.description || ''
    }));
  })();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:ml-72">
          <DashboardHeader
            title={t.pageTitle}
            breadcrumbItems={breadcrumbItems}
          />

          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowLeft}
                    onClick={handleGoBack}
                    className="p-2"
                  />
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t.pageTitle}
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ml-14">
                  {t.pageDescription}
                </p>
              </div>
            </div>

            {/* Kart 1: Ödeme Yapılacak Konut Seçimi */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.selectPropertyToPay}</h3>
              </div>
              <div className="mb-4">
                <SearchBar
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={async (term) => {
                    setSearchQuery(term);
                    setPage(1);
                    await loadPending({ page: 1, limit, search: term || undefined, billType });
                  }}
                  debounceMs={400}
                />
              </div>
              <div className="mb-3 flex items-center gap-3">
                <label className="text-sm text-text-light-secondary dark:text-text-secondary">{t.transactionTypeLabel}</label>
                <select
                  value={billType || 'all'}
                  onChange={async (e) => {
                    const v = e.target.value === 'all' ? undefined : e.target.value;
                    setBillType(v);
                    setPage(1);
                    await loadPending({ page: 1, limit, search: searchQuery || undefined, billType: v });
                  }}
                  className="border border-gray-200 dark:border-gray-700 rounded bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark text-sm px-3 py-2"
                >
                  <option value="all">{t.all}</option>
                  <option value="DUES">{t.dues}</option>
                  <option value="UTILITY">{t.utility}</option>
                  <option value="MAINTENANCE">{t.maintenance}</option>
                  <option value="PENALTY">{t.penalty}</option>
                  <option value="OTHER">{t.other}</option>
                </select>
              </div>
              {selectedBills.length > 0 && (
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm text-text-on-light dark:text-text-on-dark">
                    {selectedBills.length} {t.recordsSelected}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelectedBills([]); setIsConfirmed(false); }}
                  >
                    {t.removeAll}
                  </Button>
                </div>
              )}
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-background-light-secondary dark:bg-background-secondary">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-light-secondary dark:text-text-secondary">{t.apartmentNo}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-light-secondary dark:text-text-secondary">{t.fullName}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-light-secondary dark:text-text-secondary">{t.debtAmount}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-light-secondary dark:text-text-secondary">{t.status}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-light-secondary dark:text-text-secondary">{t.transactionType}</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="bg-background-light-card dark:bg-background-card divide-y divide-gray-200 dark:divide-gray-700">
                    {searchLoading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center">
                          <div className="inline-flex items-center gap-2 text-text-light-secondary dark:text-text-secondary">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-gold border-t-transparent" />
                            {t.searching}
                          </div>
                        </td>
                      </tr>
                    ) : pendingBills.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-text-light-secondary dark:text-text-secondary">
                          {t.noResults}
                        </td>
                      </tr>
                      ) : (
                      pendingBills.map((b) => {
                        const displayNo = b.property?.propertyNumber || b.property?.name || '-';
                        const fullName = `${b.assignedTo?.firstName || ''} ${b.assignedTo?.lastName || ''}`.trim() || '-';
                        const debt = Number(b.amount) || 0;
                        const hasDebt = true; // pending bills by definition
                        const typeLabel = b.billType === 'DUES' ? t.dues : b.billType === 'MAINTENANCE' ? t.maintenance : b.billType === 'UTILITY' ? t.utility : b.billType === 'PENALTY' ? t.penalty : t.other;
                        const isSelected = selectedBills.some(sb => sb.id === b.id);
                        return (
                          <tr key={b.id} className="hover:bg-background-light-soft dark:hover:bg-background-soft">
                            <td className="px-4 py-3 text-text-on-light dark:text-text-on-dark">
                              <div className="flex items-center gap-2"><Home className="h-4 w-4" /> {displayNo}</div>
                            </td>
                            <td className="px-4 py-3 text-text-on-light dark:text-text-on-dark">
                              <div className="flex items-center gap-2"><User className="h-4 w-4" /> {fullName}</div>
                            </td>
                            <td className="px-4 py-3 text-text-on-light dark:text-text-on-dark">{debt.toLocaleString('tr-TR')} IQD</td>
                            <td className="px-4 py-3">
                              <span className={`text-sm font-medium ${hasDebt ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {hasDebt ? t.hasDebt : t.noDebt}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-text-on-light dark:text-text-on-dark">{typeLabel}</td>
                            <td className="px-4 py-3 text-right">
                              {isSelected ? (
                                                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    icon={X}
                                    onClick={() => {
                                      setSelectedBills(prev => prev.filter(sb => sb.id !== b.id));
                                      setIsConfirmed(false);
                                    }}
                                  >
                                    {t.remove}
                                  </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setSelectedBills(prev => [...prev, b])}
                                >
                                  {t.select}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <TablePagination
                currentPage={page}
                totalPages={totalPages}
                totalRecords={total}
                recordsPerPage={limit}
                onPageChange={async (p) => {
                  setPage(p);
                  await loadPending({ page: p, limit, search: searchQuery || undefined, billType });
                }}
                onRecordsPerPageChange={async (n) => {
                  setLimit(n);
                  setPage(1);
                  await loadPending({ page: 1, limit: n, search: searchQuery || undefined, billType });
                }}
                recordsPerPageOptions={[10, 25, 50, 100]}
                preventScroll={true}
              />
              <div className="flex justify-end mt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsConfirmed(true)}
                  disabled={selectedBills.length === 0}
                >
                  {t.confirmAndContinue}
                </Button>
              </div>
            </Card>

            {/* Kart 2: Ödeme Yöntemi Seçimi */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.selectPaymentMethod}</h3>
              </div>
              {!isConfirmed && (
                <div className="mb-4 rounded-lg px-4 py-2 border border-primary-gold/20 bg-background-light-card dark:bg-background-card text-sm text-text-light-secondary dark:text-text-secondary flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary-gold" />
                  {t.selectPropertyFirst}
                </div>
              )}
              <div className={!isConfirmed ? 'pointer-events-none opacity-60 blur-[1px]' : ''}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {dynamicPaymentMethodOptions.map(opt => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(opt.value as PaymentMethod)}
                      className={`relative flex flex-col items-center p-3 border rounded-lg transition-colors ${
                        selectedPaymentMethod === opt.value
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="text-lg mb-1">{opt.icon}</span>
                      <div className="text-xs font-medium text-gray-900 dark:text-white text-center">{opt.label}</div>
                      {selectedPaymentMethod === opt.value && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Payment Creation Form */}
            <div className="space-y-6">
              {(!isConfirmed || !selectedPaymentMethod) && (
                <div className="rounded-lg px-4 py-2 border border-primary-gold/20 bg-background-light-card dark:bg-background-card text-sm text-text-light-secondary dark:text-text-secondary flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary-gold" />
                  {(!isConfirmed) ? t.selectPropertyFirstForm : t.selectPaymentMethodForm}
                </div>
              )}
              <div className={(!isConfirmed || !selectedPaymentMethod) ? 'pointer-events-none opacity-60 blur-[1px]' : ''}>
                <CreatePaymentForm
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                  loading={isSubmitting}
                  preselectedBills={selectedBills}
                  onRemoveBill={(id) => {
                    setSelectedBills(prev => prev.filter(b => b.id !== id));
                    if (selectedBills.length - 1 === 0) { setIsConfirmed(false); setSelectedPaymentMethod(undefined); }
                  }}
                  onClearBills={() => { setSelectedBills([]); setIsConfirmed(false); setSelectedPaymentMethod(undefined); }}
                  selectedPaymentMethod={selectedPaymentMethod}
                />
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    {t.paymentTips}
                  </p>
                  <ul className="space-y-1 list-disc list-inside ml-2">
                    <li>{t.tip1}</li>
                    <li>{t.tip2}</li>
                    <li>{t.tip3}</li>
                    <li>{t.tip4}</li>
                    <li>{t.tip5}</li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}