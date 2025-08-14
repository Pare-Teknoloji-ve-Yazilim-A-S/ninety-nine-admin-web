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

export default function CreatePaymentPage() {
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
    { label: 'Ana Sayfa', href: '/dashboard' },
    { label: 'Finansal İşlemler', href: '/dashboard/financial' },
    { label: 'Yeni İşlem', href: '/dashboard/financial/create' },
    { label: 'Ödeme Kaydet', active: true }
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
  const dynamicPaymentMethodOptions = (appEnums?.payment?.paymentMethod as string[] | undefined)
    ? (appEnums!.payment!.paymentMethod as string[]).map((code) => {
        const enumValue = (PaymentMethod as any)[code] ?? code;
        const fallback = PAYMENT_METHOD_OPTIONS.find(o => String(o.value) === String(enumValue));
        return {
          value: (PaymentMethod as any)[code] ?? (fallback?.value ?? enumValue),
          label: fallback?.label ?? code,
          icon: fallback?.icon ?? '💳',
        };
      })
    : PAYMENT_METHOD_OPTIONS;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:ml-72">
          <DashboardHeader
            title="Ödeme Kaydet"
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
                    Ödeme Kaydet
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ml-14">
                  Mevcut bir faturaya ödeme kaydedin
                </p>
              </div>
            </div>

            {/* Kart 1: Ödeme Yapılacak Konut Seçimi */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ödeme Yapılacak Konut Seçin</h3>
              </div>
              <div className="mb-4">
                <SearchBar
                  placeholder="Adres, daire numarası veya isim ile ara..."
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
                <label className="text-sm text-text-light-secondary dark:text-text-secondary">İşlem Türü:</label>
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
                  <option value="all">Tümü</option>
                  <option value="DUES">Aidat</option>
                  <option value="UTILITY">Fatura</option>
                  <option value="MAINTENANCE">Bakım</option>
                  <option value="PENALTY">Ceza</option>
                  <option value="OTHER">Diğer</option>
                </select>
              </div>
              {selectedBills.length > 0 && (
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm text-text-on-light dark:text-text-on-dark">
                    {selectedBills.length} kayıt seçili
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelectedBills([]); setIsConfirmed(false); }}
                  >
                    Tümünü Kaldır
                  </Button>
                </div>
              )}
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-background-light-secondary dark:bg-background-secondary">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-light-secondary dark:text-text-secondary">Daire No</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-light-secondary dark:text-text-secondary">Ad Soyad</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-light-secondary dark:text-text-secondary">Borç Tutarı</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-light-secondary dark:text-text-secondary">Durum</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-light-secondary dark:text-text-secondary">İşlem Türü</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="bg-background-light-card dark:bg-background-card divide-y divide-gray-200 dark:divide-gray-700">
                    {searchLoading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center">
                          <div className="inline-flex items-center gap-2 text-text-light-secondary dark:text-text-secondary">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-gold border-t-transparent" />
                            Aranıyor...
                          </div>
                        </td>
                      </tr>
                    ) : pendingBills.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-text-light-secondary dark:text-text-secondary">
                          Sonuç bulunamadı
                        </td>
                      </tr>
                      ) : (
                      pendingBills.map((b) => {
                        const displayNo = b.property?.propertyNumber || b.property?.name || '-';
                        const fullName = `${b.assignedTo?.firstName || ''} ${b.assignedTo?.lastName || ''}`.trim() || '-';
                        const debt = Number(b.amount) || 0;
                        const hasDebt = true; // pending bills by definition
                        const typeLabel = b.billType === 'DUES' ? 'Aidat' : b.billType === 'MAINTENANCE' ? 'Bakım' : b.billType === 'UTILITY' ? 'Fatura' : b.billType === 'PENALTY' ? 'Ceza' : 'Diğer';
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
                                {hasDebt ? 'Borcu Var' : 'Borç Yok'}
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
                                  Kaldır
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setSelectedBills(prev => [...prev, b])}
                                >
                                  Seç
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
                  Onayla ve Devam Et
                </Button>
              </div>
            </Card>

            {/* Kart 2: Ödeme Yöntemi Seçimi */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ödeme Yöntemi Seçin</h3>
              </div>
              {!isConfirmed && (
                <div className="mb-4 rounded-lg px-4 py-2 border border-primary-gold/20 bg-background-light-card dark:bg-background-card text-sm text-text-light-secondary dark:text-text-secondary flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary-gold" />
                  Lütfen önce üstteki karttan bir konut seçin ve onaylayın
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
                  {(!isConfirmed) ? 'Lütfen önce üstteki karttan bir konut seçin ve onaylayın' : 'Lütfen ortadaki karttan bir ödeme yöntemi seçin'}
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
                    Ödeme Kaydetme İpuçları:
                  </p>
                  <ul className="space-y-1 list-disc list-inside ml-2">
                    <li>Sadece bekleyen veya gecikmiş faturalar görüntülenir</li>
                    <li>Ödeme tutarı fatura tutarından farklı olabilir (kısmi/fazla ödeme)</li>
                    <li>Ödeme yöntemini doğru seçtiğinizden emin olun</li>
                    <li>İşlem ID ve makbuz numarası takip için önemlidir</li>
                    <li>Ödeme tarihi geçmiş bir tarih olabilir</li>
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