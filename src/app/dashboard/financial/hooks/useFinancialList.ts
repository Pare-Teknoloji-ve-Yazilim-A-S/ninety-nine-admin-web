import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FinancialTransactionsList, 
  FinancialFilters, 
  FinancialTransaction,
  UseFinancialListReturn,
  ExportIncludeOption,
  MoneyAmount,
  TransactionType,
  ServiceType,
  TransactionStatus,
  TransactionApartment,
  TransactionResident
} from '@/services/types/financial-list.types';
import billingService from '@/services/billing.service';

// API Response Types
interface ApiBillResponse {
  id: string;
  title: string;
  amount: string;
  dueDate: string;
  description: string;
  billType: string;
  status: string;
  penaltyStartDate?: string;
  isPenaltyApplied: boolean;
  documentNumber: string;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  property?: {
    id: string;
    name: string;
    propertyNumber: string;
    floor?: number | null;
  };
}

interface ApiPaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiBillingResponse {
  data: ApiBillResponse[];
  pagination: ApiPaginationResponse;
}

// Transform API data to FinancialTransaction format
const transformApiDataToFinancialTransaction = (apiBill: ApiBillResponse): FinancialTransaction => {
  // Map bill types to transaction types
  const getTransactionType = (billType: string): TransactionType => {
    const typeMap: Record<string, TransactionType> = {
      'DUES': { id: 'due', label: 'Aidat', icon: '🏠', color: '#3b82f6' },
      'UTILITY': { id: 'bill', label: 'Fatura', icon: '📄', color: '#f59e0b' },
      'MAINTENANCE': { id: 'maintenance', label: 'Bakım', icon: '🔧', color: '#8b5cf6' },
      'PENALTY': { id: 'penalty', label: 'Cezai', icon: '⚠️', color: '#ef4444' },
      'DEPOSIT': { id: 'deposit', label: 'Depozit', icon: '🏦', color: '#06b6d4' }
    };
    return typeMap[billType] || { id: 'other', label: 'Diğer', icon: '📋', color: '#6b7280' };
  };

  // Map bill types to service types
  const getServiceType = (billType: string): ServiceType => {
    const serviceMap: Record<string, ServiceType> = {
      'DUES': { id: 'monthly_dues', label: 'Aylık Aidat', icon: '🏠', color: '#3b82f6' },
      'UTILITY': { id: 'utility', label: 'Fatura', icon: '⚡', color: '#f59e0b' },
      'MAINTENANCE': { id: 'maintenance', label: 'Bakım', icon: '🔧', color: '#8b5cf6' },
      'PENALTY': { id: 'penalty', label: 'Cezai', icon: '⚠️', color: '#ef4444' },
      'DEPOSIT': { id: 'deposit', label: 'Depozit', icon: '🏦', color: '#06b6d4' }
    };
    return serviceMap[billType] || { id: 'other', label: 'Diğer', icon: '📋', color: '#6b7280' };
  };

  // Map status to transaction status
  const getTransactionStatus = (status: string): TransactionStatus => {
    const statusMap: Record<string, TransactionStatus> = {
      'PENDING': { id: 'pending', label: 'Bekliyor', color: '#f59e0b', bgColor: '#fef3c7' },
      'PAID': { id: 'paid', label: 'Ödendi', color: '#10b981', bgColor: '#d1fae5' },
      'OVERDUE': { id: 'overdue', label: 'Gecikmiş', color: '#ef4444', bgColor: '#fee2e2' },
      'CANCELLED': { id: 'cancelled', label: 'İptal', color: '#6b7280', bgColor: '#f3f4f6' },
      'PARTIAL': { id: 'partial', label: 'Kısmi', color: '#8b5cf6', bgColor: '#ede9fe' }
    };
    return statusMap[status] || { id: 'unknown', label: 'Bilinmiyor', color: '#6b7280', bgColor: '#f3f4f6' };
  };

  // Calculate amount
  const amount = parseFloat(apiBill.amount);
  const amountData: MoneyAmount = {
    amount,
    currency: 'IQD',
    formatted: `${amount.toLocaleString()} IQD`
  };

  // Calculate overdue days
  const dueDate = new Date(apiBill.dueDate);
  const today = new Date();
  const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
  const isOverdue = daysOverdue > 0 && apiBill.status === 'PENDING';

  // Create apartment info: use property.name in the table as requested
  const apartment: TransactionApartment = {
    number: apiBill.property?.name || 'N/A',
    block: apiBill.property?.propertyNumber || '',
    floor: apiBill.property?.floor || 0,
    owner: 'Bilinmiyor',
    tenant: null
  };

  // Create resident info using assignedTo firstName + lastName
  const assignedTo = (apiBill as any).assignedTo as { firstName?: string; lastName?: string; phone?: string; email?: string } | undefined;
  const assignedFullName = [assignedTo?.firstName, assignedTo?.lastName].filter(Boolean).join(' ').trim();
  const resident: TransactionResident = {
    name: assignedFullName || '',
    phone: assignedTo?.phone || '',
    email: assignedTo?.email || '',
    avatar: '',
    type: 'owner'
  };

  return {
    id: apiBill.id,
    transactionId: apiBill.documentNumber || apiBill.id,
    title: apiBill.title,
    apartment,
    resident,
    // Store original API data for modal access
    _originalData: apiBill,
    transactionType: getTransactionType(apiBill.billType),
    serviceType: getServiceType(apiBill.billType),
    amount: amountData,
    paymentMethod: null, // API doesn't provide payment method info
    status: getTransactionStatus(apiBill.status),
    transactionDate: apiBill.createdAt,
    dueDate: apiBill.dueDate,
    paidDate: apiBill.paidAt || null,
    period: new Date(apiBill.dueDate).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
    description: apiBill.description || apiBill.title,
    receiptNumber: apiBill.documentNumber,
    fees: undefined,
    isOverdue,
    daysOverdue,
    penalty: apiBill.isPenaltyApplied ? {
      amount: amount * 0.1, // 10% penalty
      currency: 'IQD',
      rate: 0.1,
      description: 'Gecikme cezası'
    } : undefined,
    consumption: undefined,
    previousReading: undefined,
    currentReading: undefined,
    meterNumber: undefined,
    maintenanceDetails: undefined,
    remindersSent: 0,
    lastReminderDate: undefined,
    tags: [apiBill.billType.toLowerCase()]
  };
};

// Test API call function for debugging
const testBillingApiCall = async () => {
  try {
    console.log('🔍 Testing Billing API Call...');
    console.log('📡 Making request to: GET /admin/billing');
    
    // Test parameters - only page and limit as requested
    const testParams = {
      page: 1,
      limit: 10
    };
    
    console.log('📋 Request Parameters:', testParams);
    console.log('🔑 Headers: Authorization Bearer Token required');
    console.log('🌐 Full URL will be: GET /api/proxy/admin/billing?page=1&limit=10');
    
    // Make the actual API call with query parameters
    const response = await billingService.getAllBills(testParams);
    
    console.log('✅ API Response Success!');
    console.log('📊 Response Data:', response);
    console.log('📈 Response Type:', typeof response);
    console.log('�� Response Length:', response.data?.length || 'No data');
    
    if (response.data && response.data.length > 0) {
      console.log('📋 First Item Structure:', response.data[0]);
      console.log('🔍 Available Fields:', Object.keys(response.data[0]));
      
      // Check if response matches expected structure
      const expectedFields = [
        'id', 'title', 'amount', 'dueDate', 'description', 'billType', 
        'status', 'penaltyStartDate', 'isPenaltyApplied', 'documentNumber',
        'property', 'assignedTo', 'totalPaid', 'remainingAmount', 
        'createdAt', 'updatedAt'
      ];
      
      const actualFields = Object.keys(response.data[0]);
      console.log('🎯 Expected Fields:', expectedFields);
      console.log('📝 Actual Fields:', actualFields);
      
      const missingFields = expectedFields.filter(field => !actualFields.includes(field));
      const extraFields = actualFields.filter(field => !expectedFields.includes(field));
      
      if (missingFields.length > 0) {
        console.log('⚠️ Missing Fields:', missingFields);
      }
      if (extraFields.length > 0) {
        console.log('➕ Extra Fields:', extraFields);
      }
    }
    
    return response;
  } catch (error) {
    console.error('❌ API Call Failed:', error);
    console.error('🚨 Error Details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    throw error;
  }
};

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
      { key: "title", label: "Title", width: "120px", sortable: true, type: "link" as const },
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
      title: `Transaction ${i + 1}`,
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
  // Server pagination state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Initialize filters from mock data
  const [filters, setFilters] = useState<FinancialFilters>(() => {
    const mock = generateMockData();
    return mock.filters;
  });

  // Sorting state mapped to API params
  const [orderColumn, setOrderColumn] = useState<string>('createdAt');
  const [orderBy, setOrderBy] = useState<'ASC' | 'DESC'>('DESC');

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

      // Always call real API with default paging
      const apiResponse = await billingService.getAllBills({
        page,
        limit,
        search: filters.search.value || undefined,
        status: filters.paymentStatus.value !== 'all' ? filters.paymentStatus.value : undefined,
        billType: filters.transactionType.value !== 'all' ? filters.transactionType.value.toUpperCase() : undefined,
        // propertyId can be added when UI provides it
        orderColumn,
        orderBy,
      } as any);

      // Normalize API response shapes defensively
      const rawItemsCandidate: any = (apiResponse as any);
      const itemsArray: any[] = Array.isArray(rawItemsCandidate?.data)
        ? rawItemsCandidate.data
        : Array.isArray(rawItemsCandidate?.results?.results)
          ? rawItemsCandidate.results.results
          : Array.isArray(rawItemsCandidate?.results)
            ? rawItemsCandidate.results
            : [];

      // Transform API data to FinancialTransaction format
      const transformedTransactions: FinancialTransaction[] = itemsArray.map(transformApiDataToFinancialTransaction);

      // Create base data structure for UI components
      const baseData = generateMockData();

      // Calculate financial summary from real data
      const totalAmount = transformedTransactions.reduce((sum, t) => sum + t.amount.amount, 0);
      const paidTransactions = transformedTransactions.filter(t => t.status.id === 'paid');
      const pendingTransactions = transformedTransactions.filter(t => t.status.id === 'pending');
      const overdueTransactions = transformedTransactions.filter(t => t.isOverdue);

      const totalPaid = paidTransactions.reduce((sum, t) => sum + t.amount.amount, 0);
      const totalPending = pendingTransactions.reduce((sum, t) => sum + t.amount.amount, 0);
      const totalOverdue = overdueTransactions.reduce((sum, t) => sum + t.amount.amount, 0);

      // Update financial summary with real data
      baseData.financialSummary = {
        totalTransactions: transformedTransactions.length,
        totalRevenue: {
          amount: totalAmount,
          currency: 'IQD',
          formatted: `${totalAmount.toLocaleString()} IQD`
        },
        totalPending: {
          amount: totalPending,
          currency: 'IQD',
          formatted: `${totalPending.toLocaleString()} IQD`
        },
        totalOverdue: {
          amount: totalOverdue,
          currency: 'IQD',
          formatted: `${totalOverdue.toLocaleString()} IQD`
        },
        collectionRate: totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0,
        averageTransactionAmount: {
          amount: transformedTransactions.length > 0 ? totalAmount / transformedTransactions.length : 0,
          currency: 'IQD',
          formatted: transformedTransactions.length > 0 ? `${(totalAmount / transformedTransactions.length).toLocaleString()} IQD` : '0 IQD'
        },
        monthlyGrowth: {
          percentage: 12.5,
          trend: 'up' as const
        }
      };

      // Update pagination with real data (fallback to client-side pagination if API doesn't provide it)
      const apiPagination = (apiResponse as any)?.pagination;

      let currentPage = Number(apiPagination?.page) || page || 1;
      let pageSize = Number(apiPagination?.limit) || limit || 10;
      let total = Number(apiPagination?.total);
      let totalPages = Number(apiPagination?.totalPages);

      let pagedTransactions = transformedTransactions;
      if (!apiPagination || !Number.isFinite(total) || !Number.isFinite(totalPages)) {
        // Server didn't provide valid pagination; apply client-side pagination
        total = transformedTransactions.length;
        pageSize = limit || 10;
        currentPage = page || 1;
        totalPages = Math.max(1, Math.ceil(total / pageSize));
        const start = (currentPage - 1) * pageSize;
        pagedTransactions = transformedTransactions.slice(start, start + pageSize);
      }

      baseData.pagination = {
        currentPage,
        totalPages,
        itemsPerPage: pageSize,
        totalItems: total,
        showingFrom: total === 0 ? 0 : ((currentPage - 1) * pageSize) + 1,
        showingTo: Math.min(currentPage * pageSize, total),
        pageSizeOptions: [10, 25, 50, 100]
      };

      // Update data with real transactions (server paginated or client-sliced)
      baseData.transactions = pagedTransactions;

      setData(baseData);
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Finansal veriler yüklenirken bir hata oluştu');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters, page, limit, orderColumn, orderBy]);

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
    refetch: fetchFinancialData,
    page,
    limit,
    setPage,
    setLimit
  };
};