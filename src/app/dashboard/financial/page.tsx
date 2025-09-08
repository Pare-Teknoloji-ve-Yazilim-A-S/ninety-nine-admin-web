'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import {
    DollarSign,
    CreditCard,
    Receipt,
    AlertTriangle,
    Target,
    Calculator,
    Activity,
    Plus,
    RefreshCw,
    Filter,
    List,
    Grid3X3,
    Download,
    Eye,
    Edit,
    MoreVertical,
    TrendingUp,
    TrendingDown,
    Home,
    User,
    Calendar,
    Building,
    Zap,
    Droplets,
    Flame,
    FileText
} from 'lucide-react';
import GenericListView from '@/app/components/templates/GenericListView';
import GenericGridView from '@/app/components/templates/GenericGridView';
import SearchBar from '@/app/components/ui/SearchBar';
import ViewToggle from '@/app/components/ui/ViewToggle';
import FilterPanel from '@/app/components/ui/FilterPanel';
import StatsCard from '@/app/components/ui/StatsCard';
import Badge from '@/app/components/ui/Badge';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';
import BulkActionsBar from '@/app/components/ui/BulkActionsBar';
import TablePagination from '@/app/components/ui/TablePagination';
import Checkbox from '@/app/components/ui/Checkbox';
import Avatar from '@/app/components/ui/Avatar';
import Modal from '@/app/components/ui/Modal';
import { useRouter } from 'next/navigation';
import { useFinancialList } from './hooks/useFinancialList';
import billingService from '@/services/billing.service';
import { unitPricesService, UnitPrice } from '@/services/unit-prices.service';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { useToast } from '@/hooks/useToast';

// New Transaction butonu için permission
const CREATE_TRANSACTION_PERMISSION_ID = '8d8f0454-7d81-4903-9106-d64a73ba9dc6';

// Transaction detay sayfasına erişim için permission
const VIEW_TRANSACTION_DETAIL_PERMISSION_ID = '6bbd26f0-3890-4418-9901-065ad3547d34';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles
    pageTitle: 'Finansal İşlemler',
    financialTransactions: 'Finansal İşlemler',
    
    // Breadcrumb
    home: 'Ana Sayfa',
    
    // Page header
    totalRevenue: 'Toplam Gelir',
    pendingHeader: 'Bekleyen',
    overdueHeader: 'Gecikmiş',
    refresh: 'Yenile',
    newTransaction: 'Yeni İşlem',
    makePayment: 'Ödeme Yap',
    paymentModal: 'Ödeme Modalı',
    paymentMethod: 'Ödeme Şekli',
    selectPaymentMethod: 'Ödeme şekli seçiniz',
    cash: 'Nakit',
    creditCard: 'Kredi Kartı',
    bankTransfer: 'Banka Havalesi',
    processPayment: 'Ödemeyi İşle',
    cancel: 'İptal',
    apartmentInfo: 'Konut Bilgisi',
    
    // Stats cards
    totalRevenueCard: 'Toplam Gelir',
    pendingPayments: 'Bekleyen Ödemeler',
    overduePayments: 'Vadesi Geçen Ödemeler',
    unitPrices: 'Birim Fiyatları',
    
    // Table headers
    title: 'Başlık',
    apartment: 'Daire',
    resident: 'Sakin',
    transactionType: 'İşlem Türü',
    amount: 'Tutar',
    status: 'Durum',
    transactionDate: 'İşlem Tarihi',
    
    // Resident types
    owner: 'Malik',
    tenant: 'Kiracı',
    
    // Transaction types
    dues: 'Aidat',
    utility: 'Fatura',
    maintenance: 'Bakım',
    penalty: 'Ceza',
    other: 'Diğer',
    
    // Payment statuses
    pending: 'Bekliyor',
    partiallyPaid: 'Kısmi Ödendi',
    paid: 'Ödendi',
    overdue: 'Gecikmiş',
    cancelled: 'İptal',
    
    // Filter labels
    transactionTypeFilter: 'İşlem Türü',
    statusFilter: 'Durum',
    paymentMethodFilter: 'Ödeme Yöntemi',
    all: 'Tümü',
    
    // Search and filters
    searchPlaceholder: 'Başlık, açıklama veya belge no ile ara...',
    filters: 'Filtreler',
    table: 'Tablo',
    grid: 'Kart',
    
    // Loading and empty states
    loading: 'Yükleniyor...',
    noPriceFound: 'Fiyat bulunamadı',
    activePrices: 'aktif fiyat',
    noTransactions: 'Henüz finansal işlem kaydı bulunmuyor.',
    
    // Action menu
    goToDetail: 'Detaya git',
    
    // Card view
    floor: 'Kat',
    penaltyCard: 'ceza',
    daysOverdue: 'gün gecikmiş',
    
    // Currency
    iqd: 'IQD',
    billItems: 'Fatura Kalemleri',
    showBillItems: 'Toplu Ödemeler',
    hideBillItems: 'Toplu Ödemeleri Gizle'
  },
  en: {
    // Page titles
    pageTitle: 'Financial Transactions',
    financialTransactions: 'Financial Transactions',
    
    // Breadcrumb
    home: 'Home',
    
    // Page header
    totalRevenue: 'Total Revenue',
    pendingHeader: 'Pending',
    overdueHeader: 'Overdue',
    refresh: 'Refresh',
    newTransaction: 'New Transaction',
    makePayment: 'Make Payment',
    paymentModal: 'Payment Modal',
    paymentMethod: 'Payment Method',
    selectPaymentMethod: 'Select payment method',
    cash: 'Cash',
    creditCard: 'Credit Card',
    bankTransfer: 'Bank Transfer',
    processPayment: 'Process Payment',
    cancel: 'Cancel',
    apartmentInfo: 'Apartment Info',
    
    // Stats cards
    totalRevenueCard: 'Total Revenue',
    pendingPayments: 'Pending Payments',
    overduePayments: 'Overdue Payments',
    unitPrices: 'Unit Prices',
    
    // Table headers
    title: 'Title',
    apartment: 'Apartment',
    resident: 'Resident',
    transactionType: 'Transaction Type',
    amount: 'Amount',
    status: 'Status',
    transactionDate: 'Transaction Date',
    
    // Resident types
    owner: 'Owner',
    tenant: 'Tenant',
    
    // Transaction types
    dues: 'Dues',
    utility: 'Utility',
    maintenance: 'Maintenance',
    penalty: 'Penalty',
    other: 'Other',
    
    // Payment statuses
    pending: 'Pending',
    partiallyPaid: 'Partially Paid',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
    
    // Filter labels
    transactionTypeFilter: 'Transaction Type',
    statusFilter: 'Status',
    paymentMethodFilter: 'Payment Method',
    all: 'All',
    
    // Search and filters
    searchPlaceholder: 'Search by title, description or document number...',
    filters: 'Filters',
    table: 'Table',
    grid: 'Grid',
    
    // Loading and empty states
    loading: 'Loading...',
    noPriceFound: 'No price found',
    activePrices: 'active prices',
    noTransactions: 'No financial transaction records found yet.',
    
    // Action menu
    goToDetail: 'Go to detail',
    
    // Card view
    floor: 'Floor',
    penaltyCard: 'penalty',
    daysOverdue: 'days overdue',
    
    // Currency
    iqd: 'IQD',
    billItems: 'Bill Items',
    showBillItems: 'Show Bill Items',
    hideBillItems: 'Hide Bill Items'
  },
  ar: {
    // Page titles
    pageTitle: 'المعاملات المالية',
    financialTransactions: 'المعاملات المالية',
    
    // Breadcrumb
    home: 'الرئيسية',
    
    // Page header
    totalRevenue: 'إجمالي الإيرادات',
    pendingHeader: 'في الانتظار',
    overdueHeader: 'متأخر',
    refresh: 'تحديث',
    newTransaction: 'معاملة جديدة',
    makePayment: 'دفع',
    paymentModal: 'نافذة الدفع',
    paymentMethod: 'طريقة الدفع',
    selectPaymentMethod: 'اختر طريقة الدفع',
    cash: 'نقداً',
    creditCard: 'بطاقة ائتمان',
    bankTransfer: 'تحويل بنكي',
    processPayment: 'معالجة الدفع',
    cancel: 'إلغاء',
    apartmentInfo: 'معلومات الشقة',
    
    // Stats cards
    totalRevenueCard: 'إجمالي الإيرادات',
    pendingPayments: 'المدفوعات المعلقة',
    overduePayments: 'المدفوعات المتأخرة',
    unitPrices: 'أسعار الوحدات',
    
    // Table headers
    title: 'العنوان',
    apartment: 'الشقة',
    resident: 'المقيم',
    transactionType: 'نوع المعاملة',
    amount: 'المبلغ',
    status: 'الحالة',
    transactionDate: 'تاريخ المعاملة',
    
    // Resident types
    owner: 'المالك',
    tenant: 'المستأجر',
    
    // Transaction types
    dues: 'الرسوم',
    utility: 'المرافق',
    maintenance: 'الصيانة',
    penalty: 'الغرامة',
    other: 'أخرى',
    
    // Payment statuses
    pending: 'في الانتظار',
    partiallyPaid: 'مدفوع جزئياً',
    paid: 'مدفوع',
    overdue: 'متأخر',
    cancelled: 'ملغي',
    
    // Filter labels
    transactionTypeFilter: 'نوع المعاملة',
    statusFilter: 'الحالة',
    paymentMethodFilter: 'طريقة الدفع',
    all: 'الكل',
    
    // Search and filters
    searchPlaceholder: 'البحث بالعنوان أو الوصف أو رقم المستند...',
    filters: 'المرشحات',
    table: 'جدول',
    grid: 'شبكة',
    
    // Loading and empty states
    loading: 'جاري التحميل...',
    noPriceFound: 'لم يتم العثور على سعر',
    activePrices: 'أسعار نشطة',
    noTransactions: 'لم يتم العثور على سجلات معاملات مالية بعد.',
    
    // Action menu
    goToDetail: 'الذهاب إلى التفاصيل',
    
    // Card view
    floor: 'الطابق',
    penaltyCard: 'غرامة',
    daysOverdue: 'أيام متأخرة',
    
    // Currency
    iqd: 'دينار عراقي',
    billItems: 'بنود الفاتورة',
    showBillItems: 'إظهار بنود الفاتورة',
    hideBillItems: 'إخفاء بنود الفاتورة'
  }
};

export default function FinancialListPage() {
    // Toast hook
    const toast = useToast();
    
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

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
    
    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    
    // Bill Items State
    const [showBillItems, setShowBillItems] = useState(false);
    const [billItemsData, setBillItemsData] = useState<any[]>([]);
    const [billItemsLoading, setBillItemsLoading] = useState(false);
    const [billItemsError, setBillItemsError] = useState<string | null>(null);

    const router = useRouter();

    // Permission kontrolü
    const { hasPermission } = usePermissionCheck();
    const hasCreateTransactionPermission = hasPermission(CREATE_TRANSACTION_PERMISSION_ID);
    const hasViewTransactionDetailPermission = hasPermission(VIEW_TRANSACTION_DETAIL_PERMISSION_ID);

    // Debug log
    console.log('Financial Page - CREATE_TRANSACTION_PERMISSION_ID:', CREATE_TRANSACTION_PERMISSION_ID);
    console.log('Financial Page - hasCreateTransactionPermission:', hasCreateTransactionPermission);
    console.log('Financial Page - VIEW_TRANSACTION_DETAIL_PERMISSION_ID:', VIEW_TRANSACTION_DETAIL_PERMISSION_ID);
    console.log('Financial Page - hasViewTransactionDetailPermission:', hasViewTransactionDetailPermission);

    // Use the financial list hook
    const {
        data,
        loading,
        error,
        filters,
        updateFilter,
        resetFilters,
        handleBulkAction,
        refetch,
        page,
        limit,
        setPage,
        setLimit,
    } = useFinancialList();

    // Breadcrumb items
    const breadcrumbItems = [
        { label: t.home, href: '/dashboard' },
        { label: t.pageTitle, active: true }
    ];

    // Format currency
    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat('tr-TR').format(amount);
    }, []);

    // Format unit prices for display
    const formatUnitPrices = useCallback((prices: UnitPrice[]) => {
        if (prices.length === 0) return t.loading;
        
        const duesPrice = prices.find(p => p.priceType === 'DUES');
        const electricityPrice = prices.find(p => p.priceType === 'ELECTRICITY');
        const waterPrice = prices.find(p => p.priceType === 'WATER');
        const gasPrice = prices.find(p => p.priceType === 'GAS');
        
        const activePrices = [duesPrice, electricityPrice, waterPrice, gasPrice].filter(Boolean);
        
        if (activePrices.length === 0) return t.noPriceFound;
        
        return `${activePrices.length} ${t.activePrices}`;
    }, [t]);

    // Financial statistics from data
    const financialStats = useMemo(() => {
        if (!data) return {
            totalRevenue: 0,
            totalPending: 0,
            totalOverdue: 0,
            totalTransactions: 0,
            collectionRate: 0,
            averageTransaction: 0
        };

        return {
            totalRevenue: data.financialSummary.totalRevenue.amount,
            totalPending: data.financialSummary.totalPending.amount,
            totalOverdue: data.financialSummary.totalOverdue.amount,
            totalTransactions: data.financialSummary.totalTransactions,
            collectionRate: data.financialSummary.collectionRate,
            averageTransaction: data.financialSummary.averageTransactionAmount.amount
        };
    }, [data]);

    // Loading separation: cards vs table
    const [tableLoading, setTableLoading] = useState(false);
    const [cardsLoading, setCardsLoading] = useState(true);
    const lastFetchKind = useRef<'initial' | 'filters' | 'pagination'>('initial');

    // Track previous params to detect changes
    const prevPage = useRef(page);
    const prevLimit = useRef(limit);
    const filtersHash = `${filters.search.value}|${filters.transactionType.value}|${filters.paymentStatus.value}`;
    const prevFiltersHash = useRef(filtersHash);

    // Detect pagination changes
    useEffect(() => {
        if (prevPage.current !== page || prevLimit.current !== limit) {
            lastFetchKind.current = 'pagination';
            setTableLoading(true);
            prevPage.current = page;
            prevLimit.current = limit;
        }
    }, [page, limit]);

    // Detect filter changes (treat as full refresh)
    useEffect(() => {
        if (prevFiltersHash.current !== filtersHash) {
            lastFetchKind.current = lastFetchKind.current === 'initial' ? 'initial' : 'filters';
            setTableLoading(true);
            setCardsLoading(true);
            prevFiltersHash.current = filtersHash;
        }
    }, [filtersHash]);

    // When hook loading completes, end appropriate loading states
    useEffect(() => {
        if (!loading) {
            setTableLoading(false);
            if (lastFetchKind.current === 'filters' || lastFetchKind.current === 'initial') {
                setCardsLoading(false);
            }
            // After first load completes
            if (lastFetchKind.current === 'initial') {
                lastFetchKind.current = 'filters';
            }
        }
    }, [loading]);

    // Fetch pending payments summary for the card
    const [pendingSummary, setPendingSummary] = useState<number | null>(null);
    const [paidSummary, setPaidSummary] = useState<number | null>(null);
    const [overduePendingSummary, setOverduePendingSummary] = useState<number | null>(null);
    
    // Unit prices state
    const [unitPrices, setUnitPrices] = useState<UnitPrice[]>([]);
    const [unitPricesLoading, setUnitPricesLoading] = useState(true);
    
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        
        (async () => {
            try {
                const res = await billingService.getPendingPaymentsSummary({ signal });
                if (!signal.aborted) setPendingSummary(res.totalPendingAmount ?? 0);
            } catch (e) {
                if (!signal.aborted) setPendingSummary(0);
            }
            try {
                const res2 = await billingService.getPaidPaymentsSummary({ signal });
                if (!signal.aborted) setPaidSummary(res2.totalPaidAmount ?? 0);
            } catch (e) {
                if (!signal.aborted) setPaidSummary(0);
            }
            try {
                const res3 = await billingService.getOverduePendingPaymentsSummary({ signal });
                if (!signal.aborted) setOverduePendingSummary(res3.totalOverduePendingAmount ?? 0);
            } catch (e) {
                if (!signal.aborted) setOverduePendingSummary(0);
            }
            
            // Fetch unit prices
            try {
                const prices = await unitPricesService.getAllUnitPrices({ signal });
                if (!signal.aborted) {
                    setUnitPrices(prices);
                    setUnitPricesLoading(false);
                }
            } catch (e) {
                if (!signal.aborted) {
                    setUnitPrices([]);
                    setUnitPricesLoading(false);
                }
            }
        })();
        
        return () => {
            abortController.abort();
        };
    }, []);

    // Handle actions
    const handleTransactionAction = useCallback((action: string, transaction: any) => {
        switch (action) {
            case 'view':
                router.push(`/dashboard/financial/${transaction.id}`);
                break;
            case 'edit':
                console.log('Edit transaction:', transaction);
                break;
            case 'delete':
                console.log('Delete transaction:', transaction);
                break;
            default:
                console.log('Unknown action:', action);
        }
    }, [router]);

    // Handle payment action
    const handlePayment = useCallback((transaction: any) => {
        setSelectedTransaction(transaction);
        setSelectedPaymentMethod('');
        setShowPaymentModal(true);
    }, []);

    // Handle payment processing
    const processPayment = useCallback(async () => {
        if (!selectedPaymentMethod) {
            toast.warning('Lütfen ödeme şekli seçiniz!');
            return;
        }
        
        if (!selectedTransaction) {
            toast.error('Seçili işlem bulunamadı!');
            return;
        }

        try {
            // Prepare payment data - only send what the API expects
            const paymentData = {
                billIds: [selectedTransaction.id],
                paidAt: new Date().toISOString()
            };

            console.log('Processing payment:', paymentData);
            console.log('Payment method:', selectedPaymentMethod);

            // Call the API to mark bill as paid
            await billingService.markBillsAsPaidBulk(paymentData);
            
            // Show success message
            toast.success(`Ödeme başarıyla kaydedildi: ${selectedTransaction?.title} - ${selectedPaymentMethod}`);
            
            // Refresh the data
            if (typeof refetch === 'function') {
                refetch();
            }
            
        } catch (error) {
            console.error('Payment processing error:', error);
            toast.error('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            // Close modal
            setShowPaymentModal(false);
            setSelectedTransaction(null);
            setSelectedPaymentMethod('');
        }
    }, [selectedTransaction, selectedPaymentMethod, refetch, toast]);

    // Close payment modal
    const closePaymentModal = useCallback(() => {
        setShowPaymentModal(false);
        setSelectedTransaction(null);
        setSelectedPaymentMethod('');
    }, []);

    // Helper functions to translate backend values
    const getTranslatedTransactionType = useCallback((transactionType: any) => {
        if (!transactionType || !transactionType.label) return '';
        
        const typeLabel = transactionType.label.toLowerCase();
        
        // Handle both enum values and direct Turkish strings
        if (typeLabel === 'dues' || typeLabel === 'aidat') {
            return t.dues;
        } else if (typeLabel === 'utility' || typeLabel === 'fatura') {
            return t.utility;
        } else if (typeLabel === 'maintenance' || typeLabel === 'bakım') {
            return t.maintenance;
        } else if (typeLabel === 'penalty' || typeLabel === 'ceza') {
            return t.penalty;
        } else if (typeLabel === 'other' || typeLabel === 'diğer') {
            return t.other;
        }
        
        return transactionType.label; // Return original if no match
    }, [t]);

    const getTranslatedStatus = useCallback((status: any) => {
        if (!status) return '';
        
        // Handle both object format (status.label) and direct string format
        const statusLabel = (status.label || status).toLowerCase();
        
        // Handle both enum values and direct Turkish strings
        if (statusLabel === 'paid' || statusLabel === 'ödendi') {
            return t.paid;
        } else if (statusLabel === 'pending' || statusLabel === 'bekliyor') {
            return t.pending;
        } else if (statusLabel === 'partially_paid' || statusLabel === 'kısmi ödendi') {
            return t.partiallyPaid;
        } else if (statusLabel === 'overdue' || statusLabel === 'gecikmiş') {
            return t.overdue;
        } else if (statusLabel === 'cancelled' || statusLabel === 'iptal' || statusLabel === 'canceled') {
            return t.cancelled;
        }
        
        return status.label || status; // Return original if no match
    }, [t]);

    // Table columns configuration
    const tableColumns = useMemo(() => [
        {
            key: 'title',
            header: t.title,
            render: (_value: any, transaction: any) => (
                <button
                    onClick={() => handleTransactionAction('view', transaction)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                    {transaction.title}
                </button>
            ),
        },
        {
            key: 'apartment',
            header: t.apartment,
            render: (_value: any, transaction: any) => (
                <div className="font-medium text-gray-900 dark:text-white">
                    {transaction.apartment.number}
                </div>
            ),
        },
        {
            key: 'resident',
            header: t.resident,
            render: (_value: any, transaction: any) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        fallback={transaction.resident.name}
                        size="sm"
                        className="flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                            {transaction.resident.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {transaction.resident.type === 'owner' ? t.owner : t.tenant}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'transactionType',
            header: t.transactionType,
            render: (_value: any, transaction: any) => (
                <Badge variant="soft" className="flex items-center gap-1">
                    <span>{transaction.transactionType.icon}</span>
                    {getTranslatedTransactionType(transaction.transactionType)}
                </Badge>
            ),
        },
        {
            key: 'amount',
            header: t.amount,
            render: (_value: any, transaction: any) => (
                <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(transaction.amount.amount)} {t.iqd}
                    </div>
                    {transaction.penalty && transaction.penalty.amount > 0 && (
                        <div className="text-sm text-red-600 dark:text-red-400">
                            +{formatCurrency(transaction.penalty.amount)} {t.penalty}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            header: t.status,
            render: (_value: any, transaction: any) => (
                <div className="flex items-center gap-2">
                    <Badge 
                        variant={
                            transaction.status.id === 'paid' ? 'success' :
                            transaction.status.id === 'pending' ? 'warning' :
                            transaction.status.id === 'overdue' ? 'danger' : 'info'
                        }
                    >
                        {getTranslatedStatus(transaction.status)}
                    </Badge>
                    {transaction.isOverdue && (
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-xs">{transaction.daysOverdue}g</span>
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'transactionDate',
            header: t.transactionDate,
            render: (_value: any, transaction: any) => (
                <div>
                    <div className="text-gray-900 dark:text-white">
                        {new Date(transaction.transactionDate).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.transactionDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            ),
        },
        {
            key: 'payment',
            header: t.makePayment,
            render: (_value: any, transaction: any) => (
                <div className="flex justify-center">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePayment(transaction)}
                        disabled={transaction.status.id === 'paid'}
                        className={`px-3 py-1 text-sm ${
                            transaction.status.id === 'paid' 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                        }`}
                    >
                        {t.makePayment}
                    </Button>
                </div>
            ),
        },
    ], [handleTransactionAction, formatCurrency, t, getTranslatedTransactionType, getTranslatedStatus]);

    // Transaction Action Menu
    const TransactionActionMenu: React.FC<{ transaction: any; onAction: (action: string, transaction: any) => void }> = React.memo(({ transaction, onAction }) => {
        // Permission kontrolü - detay sayfasına erişim yoksa hiçbir şey gösterme
        if (!hasViewTransactionDetailPermission) {
            return null;
        }

        const handleGoDetail = (e: React.MouseEvent) => {
            e.stopPropagation();
            onAction('view', transaction);
        };

        return (
            <div className="flex items-center justify-center">
                <button
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                    onClick={handleGoDetail}
                    type="button"
                    title={t.goToDetail}
                >
                    {/* Replace 3-dot with > icon */}
                    <span className="text-xl leading-none">›</span>
                </button>
            </div>
            );
    });

    const TransactionActionMenuWrapper: React.FC<{ row: any }> = useMemo(() =>
        ({ row }) => <TransactionActionMenu transaction={row} onAction={handleTransactionAction} />
        , [handleTransactionAction, t.goToDetail]);

    // Card renderer for grid view
    const renderTransactionCard = useCallback((transaction: any, selectedItems: Array<string | number>, onSelect: (id: string | number) => void, ui: any, ActionMenu?: React.ComponentType<{ row: any }>) => {
        if (!transaction) return null;

        const isOverdue = transaction.isOverdue;

        return (
            <ui.Card key={transaction.id} className={`p-4 rounded-2xl shadow-md bg-white dark:bg-gray-800 border transition-transform hover:scale-[1.01] hover:shadow-lg ${isOverdue ? 'border-l-4 border-l-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ui.Checkbox
                            checked={selectedItems.includes(transaction.id)}
                            onChange={() => onSelect(transaction.id)}
                        />
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                {transaction.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(transaction.transactionDate).toLocaleDateString('tr-TR')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ui.Badge 
                            variant={
                                transaction.status.id === 'paid' ? 'success' :
                                transaction.status.id === 'pending' ? 'warning' :
                                transaction.status.id === 'overdue' ? 'danger' : 'secondary'
                            }
                        >
                            {getTranslatedStatus(transaction.status)}
                        </ui.Badge>
                        {ActionMenu && <ActionMenu row={transaction} />}
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Home className="h-4 w-4" />
                        <span>{transaction.apartment.number} - {transaction.apartment.floor}. {t.floor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        <span>{transaction.resident.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{transaction.transactionType.icon}</span>
                        <span>{getTranslatedTransactionType(transaction.transactionType)} - {transaction.serviceType.label}</span>
                    </div>
                </div>

                <div className="text-right mb-3">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(transaction.amount.amount)} {t.iqd}
                    </p>
                    {transaction.penalty && transaction.penalty.amount > 0 && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            +{formatCurrency(transaction.penalty.amount)} {t.iqd} {t.penalty}
                        </p>
                    )}
                </div>

                {transaction.isOverdue && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full text-sm">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{transaction.daysOverdue} {t.daysOverdue}</span>
                    </div>
                )}
            </ui.Card>
        );
    }, [formatCurrency, t, getTranslatedTransactionType, getTranslatedStatus]);

    // Search handlers
    const handleSearchInputChange = useCallback((value: string) => {
        setSearchInput(value);
    }, []);

    const handleSearchSubmit = useCallback((value: string) => {
        updateFilter('search', value);
    }, [updateFilter]);

    // Selection handlers
    const handleSelectionChange = useCallback((selected: any[]) => {
        setSelectedTransactions(selected.map(t => t.id));
    }, []);

    const handleGridSelectionChange = useCallback((selectedIds: Array<string | number>) => {
        setSelectedTransactions(selectedIds as string[]);
    }, []);

    // Filter configuration
    const filterGroups = useMemo(() => [
        {
            id: 'transactionType',
            label: t.transactionTypeFilter,
            type: 'select' as const,
            options: [
                { id: 'all', label: t.all, value: 'all' },
                { id: 'DUES', label: t.dues, value: 'DUES' },
                { id: 'UTILITY', label: t.utility, value: 'UTILITY' },
                { id: 'MAINTENANCE', label: t.maintenance, value: 'MAINTENANCE' },
                { id: 'PENALTY', label: t.penalty, value: 'PENALTY' },
                { id: 'OTHER', label: t.other, value: 'OTHER' },
            ],
        },
        {
            id: 'paymentStatus',
            label: t.statusFilter,
            type: 'select' as const,
            options: [
                { id: 'all', label: t.all, value: 'all' },
                { id: 'PENDING', label: t.pending, value: 'PENDING' },
                { id: 'PARTIALLY_PAID', label: t.partiallyPaid, value: 'PARTIALLY_PAID' },
                { id: 'PAID', label: t.paid, value: 'PAID' },
                { id: 'OVERDUE', label: t.overdue, value: 'OVERDUE' },
                { id: 'CANCELLED', label: t.cancelled, value: 'CANCELLED' },
            ],
        },
        {
            id: 'paymentMethod',
            label: t.paymentMethodFilter,
            type: 'select' as const,
            options: data?.filters.paymentMethod.options.map(option => ({
                id: option.value,
                label: option.label,
                value: option.value
            })) || [],
        },
    ], [data, t]);

    const handleApplyFilters = useCallback((newFilters: any) => {
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key] !== '' && newFilters[key] !== undefined && newFilters[key] !== null) {
                updateFilter(key, newFilters[key]);
            }
        });
        setShowFilters(false);
    }, [updateFilter]);

    const handleResetFilters = useCallback(() => {
        resetFilters();
        setSearchInput('');
    }, [resetFilters]);

    // Grid UI
    const gridUI = useMemo(() => ({
        Card,
        Button,
        Checkbox,
        TablePagination,
        Badge,
        EmptyState,
        Skeleton,
        BulkActionsBar,
    }), []);

    const getItemId = useCallback((transaction: any) => transaction.id, []);

    // New Transaction Navigation Handler
    const handleNewTransactionClick = useCallback(() => {
        router.push('/dashboard/financial/create');
    }, [router]);
    
    // Bill Items Handler
    const handleBillItemsToggle = useCallback(async () => {
        if (showBillItems) {
            // Hide bill items
            setShowBillItems(false);
            setBillItemsData([]);
            setBillItemsError(null);
        } else {
            // Show bill items - fetch data
            setBillItemsLoading(true);
            setBillItemsError(null);
            
            try {
                const data = await billingService.getBillItems();
                setBillItemsData(data);
                setShowBillItems(true);
            } catch (error) {
                console.error('Bill items fetch error:', error);
                setBillItemsError(error instanceof Error ? error.message : 'Bir hata oluştu');
                toast.error('Fatura kalemleri yüklenirken hata oluştu');
            } finally {
                setBillItemsLoading(false);
            }
        }
    }, [showBillItems, toast]);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                
                <div className="lg:ml-72">
                    <DashboardHeader
                        title={t.pageTitle}
                        breadcrumbItems={breadcrumbItems}
                    />

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Summary */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                    {t.financialTransactions}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t.totalRevenue}: {formatCurrency((paidSummary ?? financialStats.totalRevenue))} {t.iqd} | 
                                    {t.pendingHeader}: {formatCurrency((pendingSummary ?? financialStats.totalPending))} {t.iqd} | 
                                    {t.overdueHeader}: {formatCurrency((overduePendingSummary ?? financialStats.totalOverdue))} {t.iqd}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="ghost" size="md" icon={RefreshCw} onClick={refetch}>
                                    {t.refresh}
                                </Button>
                                {hasCreateTransactionPermission && (
                                    <Button 
                                        variant="primary" 
                                        size="md" 
                                        icon={Plus}
                                        onClick={handleNewTransactionClick}
                                    >
                                        {t.newTransaction}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats Cards - moved to top */}
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                                <StatsCard
                                    title={t.totalRevenueCard}
                                    value={`${formatCurrency((paidSummary ?? financialStats.totalRevenue))} ${t.iqd}`}
                                    icon={DollarSign}
                                    color="success"
                                    loading={cardsLoading || paidSummary === null}
                                    size="md"
                                />
                                <StatsCard
                                    title={t.pendingPayments}
                                    value={`${formatCurrency((pendingSummary ?? financialStats.totalPending))} ${t.iqd}`}
                                    icon={Receipt}
                                    color="warning"
                                    loading={cardsLoading || pendingSummary === null}
                                    size="md"
                                />
                                <StatsCard
                                    title={t.overduePayments}
                                    value={`${formatCurrency(overduePendingSummary ?? financialStats.totalOverdue)} ${t.iqd}`}
                                    icon={AlertTriangle}
                                    color="danger"
                                    loading={cardsLoading || overduePendingSummary === null}
                                    size="md"
                                />
                                {/* Unit Prices Card - Temporarily commented out
                                <StatsCard
                                    title={t.unitPrices}
                                    value={formatUnitPrices(unitPrices)}
                                    icon={Calculator}
                                    color="info"
                                    loading={unitPricesLoading}
                                    size="md"
                                />
                                */}
                            </div>
                        </div>

                        {/* Search and Filters - moved just above the table */}
                        <Card className="mb-6">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <SearchBar
                                            placeholder={t.searchPlaceholder}
                                            value={searchInput}
                                            onChange={(v) => {
                                                setSearchInput(v);
                                            }}
                                            onSearch={(v) => {
                                                updateFilter('search', v);
                                            }}
                                            debounceMs={500}
                                        />
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Button 
                                            variant={showFilters ? "primary" : "secondary"}
                                            size="md"
                                            icon={Filter}
                                            onClick={() => setShowFilters(true)}
                                        >
                                            {t.filters}
                                        </Button>
                                        <Button 
                                            variant={showBillItems ? "primary" : "secondary"}
                                            size="md"
                                            icon={FileText}
                                            onClick={handleBillItemsToggle}
                                            loading={billItemsLoading}
                                        >
                                            {showBillItems ? t.hideBillItems : t.showBillItems}
                                        </Button>
                                        <ViewToggle
                                            options={[
                                                { id: 'table', label: t.table, icon: List },
                                                { id: 'grid', label: t.grid, icon: Grid3X3 }
                                            ]}
                                            activeView={viewMode}
                                            onViewChange={(viewId) => setViewMode(viewId as typeof viewMode)}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Filter Sidebar */}
                        <div className={`fixed inset-0 z-50 ${showFilters ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                            <div
                                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${showFilters ? 'opacity-50' : 'opacity-0'}`}
                                onClick={() => setShowFilters(false)}
                            />
                            <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
                                <FilterPanel
                                    filterGroups={filterGroups}
                                    onApplyFilters={(newFilters) => {
                                        // Map UI filters to API-driven filters
                                        if (newFilters?.paymentStatus) {
                                            updateFilter('paymentStatus', newFilters.paymentStatus);
                                        }
                                        handleApplyFilters(newFilters);
                                    }}
                                    onResetFilters={() => {
                                        handleResetFilters();
                                        updateFilter('paymentStatus', 'all');
                                    }}
                                    onClose={() => setShowFilters(false)}
                                    variant="sidebar"
                                />
                            </div>
                        </div>

                        

                        {/* Data Display */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                            <div className="lg:col-span-1">
                                {showBillItems ? (
                                    <GenericListView
                                        data={billItemsData || []}
                                        loading={billItemsLoading}
                                        error={billItemsError}
                                        columns={[
                                            {
                                                id: 'title',
                                                header: t.title,
                                                accessor: 'title',
                                                sortable: true,
                                                render: (value: any, item: any) => item?.title || '-'
                                            },
                                            {
                                                id: 'amount',
                                                header: t.amount,
                                                accessor: 'amount',
                                                sortable: true,
                                                render: (value: any, item: any) => item?.amount ? `${item.amount} ${t.iqd}` : '-'
                                            },
                                            {
                                                id: 'createdAt',
                                                header: 'Oluşturulma Tarihi',
                                                accessor: 'createdAt',
                                                sortable: true,
                                                render: (value: any, item: any) => item?.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : '-'
                                            }
                                        ]}
                                        emptyStateMessage="Henüz fatura kalemi bulunmuyor"
                                        showPagination={false}
                                    />
                                ) : viewMode === 'table' && (
                                        <GenericListView
                                        data={data?.transactions || []}
                                        loading={loading}
                                        error={error}
                                        columns={tableColumns}
                                        pagination={{
                                                currentPage: data?.pagination.currentPage ?? page,
                                                totalPages: data?.pagination.totalPages ?? 1,
                                                totalRecords: data?.pagination.totalItems ?? 0,
                                                recordsPerPage: data?.pagination.itemsPerPage ?? limit,
                                                onPageChange: (p: number) => {
                                                    if (p !== page) setPage(p);
                                                },
                                                onRecordsPerPageChange: (n: number) => {
                                                    if (n !== limit) {
                                                        setLimit(n);
                                                        setPage(1);
                                                    }
                                                },
                                                recordsPerPageOptions: [10, 25, 50, 100],
                                                preventScroll: true,
                                            }}
                                        emptyStateMessage={t.noTransactions}
                                        showPagination={true}
                                        ActionMenuComponent={TransactionActionMenuWrapper}
                                    />
                                )}
                                {viewMode === 'grid' && (
                                    <GenericGridView
                                        data={data?.transactions || []}
                                        loading={loading}
                                        error={error}
                                        onAction={handleTransactionAction}
                                        pagination={{
                                            currentPage: data?.pagination.currentPage || 1,
                                            totalPages: data?.pagination.totalPages || 1,
                                            totalRecords: data?.pagination.totalItems || 0,
                                            recordsPerPage: data?.pagination.itemsPerPage || 50,
                                            onPageChange: () => {},
                                            onRecordsPerPageChange: () => {},
                                        }}
                                        emptyStateMessage={t.noTransactions}
                                        ui={gridUI}
                                        ActionMenu={TransactionActionMenuWrapper}
                                        renderCard={renderTransactionCard}
                                        getItemId={getItemId}
                                        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                    />
                                )}
                            </div>
                        </div>
                    </main>
                </div>

            </div>

            {/* Payment Modal */}
            <Modal
                isOpen={showPaymentModal}
                onClose={closePaymentModal}
                title={t.paymentModal}
                icon={CreditCard}
                size="md"
                footer={
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={closePaymentModal}
                            className="flex-1"
                        >
                            {t.cancel}
                        </Button>
                        <Button
                            onClick={processPayment}
                            disabled={!selectedPaymentMethod}
                            className="flex-1"
                        >
                            {t.processPayment}
                        </Button>
                    </div>
                }
            >
                {selectedTransaction && (
                    <div className="space-y-4">
                        {/* Apartment Info - Read Only */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-3">
                                {t.apartmentInfo}
                            </label>
                            <div className="p-4 bg-gradient-to-r from-background-secondary to-background-secondary/80 rounded-lg border border-primary-gold/30 shadow-sm">
                                {/* Property Header */}
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-primary-gold/20">
                                    <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                        <Building className="w-5 h-5 text-primary-gold" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-text-primary text-lg">
                                            {selectedTransaction.apartment?.number || 'N/A'}
                                        </h3>
                                        <p className="text-sm text-text-secondary">
                                            {selectedTransaction._originalData?.property?.name || selectedTransaction.transactionType?.label || 'Property Type'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Property Details Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                                            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Alan</span>
                                        </div>
                                        <p className="text-sm font-semibold text-text-primary ml-4">
                                             {selectedTransaction._originalData?.property?.area || selectedTransaction.apartment?.floor || 0} m²
                                         </p>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                                            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Blok No</span>
                                        </div>
                                        <p className="text-sm font-semibold text-text-primary ml-4">
                                            {selectedTransaction._originalData?.property?.propertyNumber || selectedTransaction.apartment?.block || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Assigned Person */}
                                <div className="mt-4 pt-3 border-t border-primary-gold/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary-gold/10 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary-gold" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Sorumlu Kişi</p>
                                            <p className="text-sm font-semibold text-text-primary">
                                                {selectedTransaction._originalData?.assignedTo ? 
                                                    `${selectedTransaction._originalData.assignedTo.firstName} ${selectedTransaction._originalData.assignedTo.lastName}` : 
                                                    selectedTransaction.resident?.name || 'Belirtilmemiş'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                {t.paymentMethod}
                            </label>
                            <select
                                value={selectedPaymentMethod}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                className="w-full p-3 border border-primary-gold/30 rounded-md bg-background-secondary text-text-primary focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                            >
                                <option value="">{t.selectPaymentMethod}</option>
                                <option value="cash">{t.cash}</option>
                                <option value="creditCard">{t.creditCard}</option>
                                <option value="bankTransfer">{t.bankTransfer}</option>
                            </select>
                        </div>
                    </div>
                )}
            </Modal>
        </ProtectedRoute>
    );
}