import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FinancialTransactionsList, 
  FinancialFilters, 
  FinancialTransaction,
  UseFinancialListReturn,
  ExportIncludeOption
} from '@/services/types/financial-list.types';
import billingService from '@/services/billing.service';

// Mock data generator for development
const generateMockData = (): FinancialTransactionsList => {
  const mockData = {
    pageInfo: {
      title: "Finansal İşlemler",
      subtitle: "Fatura ve Ödeme Yönetimi",
      icon: "💰",
      lastUpdated: new Date().toISOString()
    },
    filters: {
      search: {
        placeholder: "İşlem ID, daire numarası veya açıklama ile ara...",
        value: "",
        type: "text" as const
      },
      transactionType: {
        label: "İşlem Türü",
        value: "all",
        type: "select" as const,
        options: [
          { value: "all", label: "Tüm İşlemler", count: 1247 },
          { value: "payment", label: "Ödeme", count: 856, color: "#10b981", icon: "💳" },
          { value: "bill", label: "Fatura", count: 234, color: "#f59e0b", icon: "📄" },
          { value: "due", label: "Aidat", count: 98, color: "#3b82f6", icon: "🏠" },
          { value: "refund", label: "İade", count: 12, color: "#8b5cf6", icon: "↩️" },
          { value: "penalty", label: "Gecikme Cezası", count: 34, color: "#ef4444", icon: "⚠️" },
          { value: "deposit", label: "Depozit", count: 13, color: "#06b6d4", icon: "🏦" }
        ]
      },
      paymentStatus: {
        label: "Ödeme Durumu",
        value: "all",
        type: "select" as const,
        options: [
          { value: "all", label: "Tüm Durumlar", count: 1247 },
          { value: "paid", label: "Ödendi", count: 856, color: "#10b981" },
          { value: "pending", label: "Bekliyor", count: 198, color: "#f59e0b" },
          { value: "overdue", label: "Gecikmiş", count: 156, color: "#ef4444" },
          { value: "partial", label: "Kısmi Ödeme", count: 23, color: "#8b5cf6" },
          { value: "cancelled", label: "İptal", count: 14, color: "#6b7280" }
        ]
      },
      paymentMethod: {
        label: "Ödeme Yöntemi",
        value: "all",
        type: "select" as const,
        options: [
          { value: "all", label: "Tüm Yöntemler", count: 1247 },
          { value: "zaincash", label: "ZainCash", count: 423, icon: "📱", color: "#e11d48" },
          { value: "asiacell", label: "AsiaCell Pay", count: 298, icon: "📱", color: "#0ea5e9" },
          { value: "bank_transfer", label: "Banka Havalesi", count: 234, icon: "🏦", color: "#059669" },
          { value: "cash", label: "Nakit", count: 187, icon: "💵", color: "#d97706" },
          { value: "credit_card", label: "Kredi Kartı", count: 89, icon: "💳", color: "#7c3aed" },
          { value: "check", label: "Çek", count: 16, icon: "📝", color: "#64748b" }
        ]
      },
      serviceType: {
        label: "Hizmet Türü",
        value: "all",
        type: "select" as const,
        options: [
          { value: "all", label: "Tüm Hizmetler", count: 1247 },
          { value: "monthly_dues", label: "Aylık Aidat", count: 345, icon: "🏠" },
          { value: "electricity", label: "Elektrik", count: 298, icon: "⚡" },
          { value: "water", label: "Su", count: 267, icon: "💧" },
          { value: "gas", label: "Gaz", count: 156, icon: "🔥" },
          { value: "internet", label: "İnternet", count: 89, icon: "🌐" },
          { value: "maintenance", label: "Bakım", count: 67, icon: "🔧" },
          { value: "parking", label: "Otopark", count: 25, icon: "🚗" }
        ]
      },
      dateRange: {
        label: "Tarih Aralığı",
        startDate: "2025-07-01",
        endDate: "2025-07-30",
        type: "daterange" as const,
        presets: [
          { value: "today", label: "Bugün" },
          { value: "yesterday", label: "Dün" },
          { value: "last_7_days", label: "Son 7 Gün" },
          { value: "last_30_days", label: "Son 30 Gün" },
          { value: "this_month", label: "Bu Ay" },
          { value: "last_month", label: "Geçen Ay" },
          { value: "this_quarter", label: "Bu Çeyrek" },
          { value: "this_year", label: "Bu Yıl" },
          { value: "custom", label: "Özel Tarih" }
        ]
      },
      amountRange: {
        label: "Tutar Aralığı (IQD)",
        minAmount: 0,
        maxAmount: 2000000,
        type: "range" as const,
        presets: [
          { value: "0-100000", label: "0 - 100,000 IQD" },
          { value: "100000-500000", label: "100,000 - 500,000 IQD" },
          { value: "500000-1000000", label: "500,000 - 1,000,000 IQD" },
          { value: "1000000+", label: "1,000,000+ IQD" }
        ]
      },
      building: {
        label: "Bina/Blok",
        value: "all",
        type: "select" as const,
        options: [
          { value: "all", label: "Tüm Bloklar", count: 1247 },
          { value: "block_a", label: "A Blok", count: 356 },
          { value: "block_b", label: "B Blok", count: 298 },
          { value: "block_c", label: "C Blok", count: 334 },
          { value: "block_d", label: "D Blok", count: 259 }
        ]
      }
    },
    financialSummary: {
      totalTransactions: 1247,
      totalRevenue: {
        amount: 187500000,
        currency: "IQD",
        formatted: "187,500,000 IQD"
      },
      totalPending: {
        amount: 23400000,
        currency: "IQD",
        formatted: "23,400,000 IQD"
      },
      totalOverdue: {
        amount: 8900000,
        currency: "IQD",
        formatted: "8,900,000 IQD"
      },
      collectionRate: 94.2,
      averageTransactionAmount: {
        amount: 150240,
        currency: "IQD",
        formatted: "150,240 IQD"
      },
      monthlyGrowth: {
        percentage: 12.5,
        trend: "up" as const
      }
    },
    quickStats: [
      {
        label: "Bugün Toplanan",
        value: "12,450,000 IQD",
        count: 34,
        change: "+18%",
        trend: "up" as const,
        color: "#10b981",
        icon: "💰"
      },
      {
        label: "Bekleyen Ödemeler",
        value: "23,400,000 IQD",
        count: 198,
        change: "-5%",
        trend: "down" as const,
        color: "#f59e0b",
        icon: "⏳"
      },
      {
        label: "Gecikmiş Borçlar",
        value: "8,900,000 IQD",
        count: 156,
        change: "-12%",
        trend: "down" as const,
        color: "#ef4444",
        icon: "⚠️"
      },
      {
        label: "Bu Ay Toplam",
        value: "187,500,000 IQD",
        count: 1247,
        change: "+12.5%",
        trend: "up" as const,
        color: "#3b82f6",
        icon: "📊"
      }
    ],
    paymentMethodStats: [
      {
        method: "ZainCash",
        amount: 63450000,
        percentage: 33.8,
        count: 423,
        color: "#e11d48",
        icon: "📱"
      },
      {
        method: "AsiaCell Pay",
        amount: 55860000,
        percentage: 29.8,
        count: 298,
        color: "#0ea5e9",
        icon: "📱"
      },
      {
        method: "Banka Havalesi",
        amount: 39000000,
        percentage: 20.8,
        count: 234,
        color: "#059669",
        icon: "🏦"
      },
      {
        method: "Nakit",
        amount: 18720000,
        percentage: 10.0,
        count: 187,
        color: "#d97706",
        icon: "💵"
      },
      {
        method: "Diğer",
        amount: 10470000,
        percentage: 5.6,
        count: 105,
        color: "#6b7280",
        icon: "💳"
      }
    ],
    sortOptions: {
      currentSort: "transaction_date_desc",
      options: [
        { value: "transaction_date_desc", label: "En Yeni Önce" },
        { value: "transaction_date_asc", label: "En Eski Önce" },
        { value: "amount_desc", label: "Tutar (Yüksek→Düşük)" },
        { value: "amount_asc", label: "Tutar (Düşük→Yüksek)" },
        { value: "due_date_asc", label: "Vade Tarihi (Yakın→Uzak)" },
        { value: "status_asc", label: "Duruma Göre" },
        { value: "apartment_asc", label: "Daire Numarasına Göre" },
        { value: "payment_method_asc", label: "Ödeme Yöntemine Göre" }
      ]
    },
    pagination: {
      currentPage: 1,
      totalPages: 25,
      itemsPerPage: 50,
      totalItems: 1247,
      showingFrom: 1,
      showingTo: 50,
      pageSizeOptions: [25, 50, 100, 200]
    },
    bulkActions: {
      enabled: true,
      selectedCount: 0,
      selectedAmount: {
        amount: 0,
        currency: "IQD",
        formatted: "0 IQD"
      },
      actions: [
        {
          id: "mark_paid",
          label: "Ödendi Olarak İşaretle",
          icon: "✅",
          requiresSelection: true,
          confirmationRequired: true,
          restrictedTo: ["pending", "overdue"]
        },
        {
          id: "send_reminder",
          label: "Ödeme Hatırlatması Gönder",
          icon: "📢",
          requiresSelection: true,
          confirmationRequired: false,
          restrictedTo: ["pending", "overdue"]
        },
        {
          id: "apply_penalty",
          label: "Gecikme Cezası Uygula",
          icon: "⚠️",
          requiresSelection: true,
          confirmationRequired: true,
          restrictedTo: ["overdue"]
        },
        {
          id: "generate_receipt",
          label: "Makbuz Oluştur",
          icon: "🧾",
          requiresSelection: true,
          confirmationRequired: false,
          restrictedTo: ["paid"]
        },
        {
          id: "export_selected",
          label: "Seçilenleri Dışa Aktar",
          icon: "📤",
          requiresSelection: true,
          confirmationRequired: false
        },
        {
          id: "cancel_transaction",
          label: "İşlemi İptal Et",
          icon: "❌",
          requiresSelection: true,
          confirmationRequired: true,
          dangerAction: true,
          restrictedTo: ["pending"]
        }
      ]
    },
    tableColumns: [
      { key: "select", label: "", width: "40px", sortable: false, type: "checkbox" as const },
      { key: "transactionId", label: "İşlem ID", width: "120px", sortable: true, type: "link" as const },
      { key: "apartment", label: "Daire", width: "100px", sortable: true, type: "text" as const },
      { key: "resident", label: "Sakin", width: "150px", sortable: true, type: "user" as const },
      { key: "transactionType", label: "İşlem Türü", width: "120px", sortable: true, type: "badge" as const },
      { key: "serviceType", label: "Hizmet", width: "120px", sortable: true, type: "badge" as const },
      { key: "amount", label: "Tutar", width: "120px", sortable: true, type: "currency" as const, align: "right" as const },
      { key: "paymentMethod", label: "Ödeme Yöntemi", width: "130px", sortable: true, type: "badge" as const },
      { key: "status", label: "Durum", width: "100px", sortable: true, type: "status" as const },
      { key: "transactionDate", label: "İşlem Tarihi", width: "120px", sortable: true, type: "datetime" as const },
      { key: "dueDate", label: "Vade", width: "100px", sortable: true, type: "date" as const },
      { key: "actions", label: "İşlemler", width: "100px", sortable: false, type: "actions" as const }
    ],
    transactions: [], // Will be populated from API
    exportOptions: {
      formats: [
        { value: "excel", label: "Excel (.xlsx)", icon: "📊" },
        { value: "pdf", label: "PDF Raporu", icon: "📄" },
        { value: "csv", label: "CSV Dosyası", icon: "📋" },
        { value: "financial_report", label: "Mali Rapor (PDF)", icon: "💼" }
      ],
      includeOptions: [
        { key: "basic_info", label: "Temel Bilgiler", default: true },
        { key: "resident_info", label: "Sakin Bilgileri", default: true },
        { key: "payment_details", label: "Ödeme Detayları", default: true },
        { key: "consumption_data", label: "Tüketim Verileri", default: false },
        { key: "penalty_info", label: "Ceza Bilgileri", default: false },
        { key: "receipt_numbers", label: "Makbuz Numaraları", default: true },
        { key: "financial_summary", label: "Mali Özet", default: false }
      ],
      dateRangeRequired: true
    },
    reportingOptions: {
      availableReports: [
        {
          id: "monthly_collection",
          label: "Aylık Tahsilat Raporu",
          description: "Detaylı gelir analizi ve tahsilat oranları",
          icon: "📊"
        },
        {
          id: "overdue_analysis",
          label: "Gecikmiş Ödemeler Analizi",
          description: "Borçlu daireler ve gecikme trendleri",
          icon: "⚠️"
        },
        {
          id: "payment_method_breakdown",
          label: "Ödeme Yöntemi Dağılımı",
          description: "Kullanılan ödeme kanalları ve performans",
          icon: "💳"
        },
        {
          id: "consumption_trends",
          label: "Tüketim Trend Analizi",
          description: "Elektrik, su, gaz tüketim analizleri",
          icon: "⚡"
        }
      ]
    },
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: true,
      canRefund: true,
      canExport: true,
      canViewCosts: true,
      canManagePenalties: true,
      canGenerateReports: true,
      canBulkEdit: true,
      role: "financial_admin"
    },
    integrations: {
      paymentGateways: {
        zaincash: {
          enabled: true,
          status: "active" as const,
          lastSync: new Date().toISOString()
        },
        asiacell: {
          enabled: true,
          status: "active" as const,
          lastSync: new Date().toISOString()
        },
        bankTransfer: {
          enabled: true,
          status: "active" as const,
          accounts: ["Al-Rashid Bank", "Commercial Bank of Iraq"],
          autoReconciliation: true
        }
      },
      accountingSystem: {
        enabled: false,
        provider: null,
        lastSync: null
      }
    }
  };

  return mockData;
};

// Generate mock transactions
const generateMockTransactions = (count: number = 50): FinancialTransaction[] => {
  const transactions: FinancialTransaction[] = [];
  const blocks = ['A', 'B', 'C', 'D'];
  const transactionTypes = ['payment', 'bill', 'due', 'refund', 'penalty', 'deposit'];
  const paymentStatuses = ['paid', 'pending', 'overdue', 'partial', 'cancelled'];
  const paymentMethods = ['zaincash', 'asiacell', 'bank_transfer', 'cash', 'credit_card'];
  const serviceTypes = ['monthly_dues', 'electricity', 'water', 'gas', 'internet', 'maintenance', 'parking'];

  for (let i = 0; i < count; i++) {
    const block = blocks[Math.floor(Math.random() * blocks.length)];
    const floor = Math.floor(Math.random() * 4) + 1;
    const unit = Math.floor(Math.random() * 10) + 1;
    const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const status = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const amount = Math.floor(Math.random() * 500000) + 50000;
    const isOverdue = status === 'overdue';
    const daysOverdue = isOverdue ? Math.floor(Math.random() * 30) + 1 : 0;

    transactions.push({
      id: `TXN-2025-${String(i + 1).padStart(4, '0')}`,
      transactionId: `TXN-2025-${String(i + 1).padStart(4, '0')}`,
      apartment: {
        number: `${block}-${floor}${String(unit).padStart(2, '0')}`,
        block,
        floor,
        owner: `Owner ${i + 1}`,
        tenant: Math.random() > 0.3 ? `Tenant ${i + 1}` : null
      },
      resident: {
        name: `Resident ${i + 1}`,
        phone: `+964 7${Math.floor(Math.random() * 10)}0 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
        email: `resident${i + 1}@email.com`,
        avatar: `R${i + 1}`,
        type: Math.random() > 0.5 ? 'owner' : 'tenant'
      },
      transactionType: {
        id: transactionType,
        label: transactionType.charAt(0).toUpperCase() + transactionType.slice(1),
        icon: transactionType === 'payment' ? '💳' : '📄',
        color: transactionType === 'payment' ? '#10b981' : '#f59e0b'
      },
      serviceType: {
        id: serviceType,
        label: serviceType.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        icon: serviceType === 'electricity' ? '⚡' : '🏠',
        color: '#3b82f6'
      },
      amount: {
        amount: amount,
        currency: 'IQD',
        formatted: `${amount.toLocaleString()} IQD`
      },
      paymentMethod: status === 'paid' ? {
        id: paymentMethod,
        label: paymentMethod.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        icon: '💳',
        color: '#10b981'
      } : null,
      status: {
        id: status,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        color: status === 'paid' ? '#10b981' : status === 'pending' ? '#f59e0b' : '#ef4444',
        bgColor: status === 'paid' ? '#d1fae5' : status === 'pending' ? '#fef3c7' : '#fee2e2'
      },
      transactionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      paidDate: status === 'paid' ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString() : null,
      period: '2025-07',
      description: `${serviceType} payment for period 2025-07`,
      isOverdue,
      daysOverdue,
      tags: [transactionType, serviceType, block.toLowerCase()]
    });
  }

  return transactions;
};

export const useFinancialList = (): UseFinancialListReturn => {
  const [data, setData] = useState<FinancialTransactionsList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Initialize filters from mock data
  const [filters, setFilters] = useState<FinancialFilters>(() => {
    const mock = generateMockData();
    return mock.filters;
  });

  // Memoize filters to prevent infinite re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters.search.value,
    filters.transactionType.value,
    filters.paymentStatus.value,
    filters.paymentMethod.value,
    filters.serviceType.value,
    filters.dateRange.startDate,
    filters.dateRange.endDate,
    filters.amountRange.minAmount,
    filters.amountRange.maxAmount,
    filters.building.value
  ]);

  // Fetch financial data
  const fetchFinancialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock data with transactions
      const mockData = generateMockData();
      const transactions = generateMockTransactions(50);
      mockData.transactions = transactions;

      // Apply filters
      let filteredTransactions = transactions;

      // Search filter
      if (memoizedFilters.search.value) {
        const searchTerm = memoizedFilters.search.value.toLowerCase();
        filteredTransactions = filteredTransactions.filter(t =>
          t.transactionId.toLowerCase().includes(searchTerm) ||
          t.apartment.number.toLowerCase().includes(searchTerm) ||
          t.description.toLowerCase().includes(searchTerm) ||
          t.resident.name.toLowerCase().includes(searchTerm)
        );
      }

      // Transaction type filter
      if (memoizedFilters.transactionType.value !== 'all') {
        filteredTransactions = filteredTransactions.filter(t =>
          t.transactionType.id === memoizedFilters.transactionType.value
        );
      }

      // Payment status filter
      if (memoizedFilters.paymentStatus.value !== 'all') {
        filteredTransactions = filteredTransactions.filter(t =>
          t.status.id === memoizedFilters.paymentStatus.value
        );
      }

      // Payment method filter
      if (memoizedFilters.paymentMethod.value !== 'all') {
        filteredTransactions = filteredTransactions.filter(t =>
          t.paymentMethod?.id === memoizedFilters.paymentMethod.value
        );
      }

      // Service type filter
      if (memoizedFilters.serviceType.value !== 'all') {
        filteredTransactions = filteredTransactions.filter(t =>
          t.serviceType.id === memoizedFilters.serviceType.value
        );
      }

      // Amount range filter
      filteredTransactions = filteredTransactions.filter(t =>
        t.amount.amount >= memoizedFilters.amountRange.minAmount &&
        t.amount.amount <= memoizedFilters.amountRange.maxAmount
      );

      // Update data with filtered transactions
      mockData.transactions = filteredTransactions;
      mockData.pagination.totalItems = filteredTransactions.length;
      mockData.pagination.totalPages = Math.ceil(filteredTransactions.length / mockData.pagination.itemsPerPage);

      setData(mockData);
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Finansal veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  // Initial data fetch
  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  // Update filter
  const updateFilter = useCallback((filterKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey as keyof FinancialFilters],
        value
      }
    }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    const mockData = generateMockData();
    setFilters(mockData.filters);
  }, []);

  // Handle bulk actions
  const handleBulkAction = useCallback(async (actionId: string) => {
    try {
      console.log('Bulk action:', actionId, 'Selected:', selectedTransactions);
      // TODO: Implement bulk action API calls
      
      // Refresh data after action
      await fetchFinancialData();
      setSelectedTransactions([]);
    } catch (err) {
      console.error('Bulk action error:', err);
    }
  }, [selectedTransactions, fetchFinancialData]);

  // Handle export
  const handleExport = useCallback(async (format: string, options: ExportIncludeOption[]) => {
    try {
      console.log('Export:', format, 'Options:', options);
      // TODO: Implement export functionality
    } catch (err) {
      console.error('Export error:', err);
    }
  }, []);

  // Calculate selected amount
  useEffect(() => {
    if (data && selectedTransactions.length > 0) {
      const selectedAmount = data.transactions
        .filter(t => selectedTransactions.includes(t.id))
        .reduce((sum, t) => sum + t.amount.amount, 0);

      setData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          bulkActions: {
            ...prev.bulkActions,
            selectedCount: selectedTransactions.length,
            selectedAmount: {
              amount: selectedAmount,
              currency: 'IQD',
              formatted: `${selectedAmount.toLocaleString()} IQD`
            }
          }
        };
      });
    }
  }, [selectedTransactions, data]);

  return {
    data,
    loading,
    error,
    filters,
    selectedTransactions,
    viewMode,
    setViewMode,
    updateFilter,
    resetFilters,
    setSelectedTransactions,
    handleBulkAction,
    handleExport,
    refetch: fetchFinancialData
  };
};