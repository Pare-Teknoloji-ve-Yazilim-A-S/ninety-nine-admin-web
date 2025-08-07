// Financial List Page Type Definitions

// Page Info
export interface PageInfo {
  title: string;
  subtitle: string;
  icon: string;
  lastUpdated: string;
}

// Filter Option Types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  color?: string;
  icon?: string;
}

export interface DateRangePreset {
  value: string;
  label: string;
}

export interface AmountRangePreset {
  value: string;
  label: string;
}

// Filter Types
export interface SearchFilter {
  placeholder: string;
  value: string;
  type: 'text';
}

export interface SelectFilter {
  label: string;
  value: string;
  type: 'select';
  options: FilterOption[];
}

export interface DateRangeFilter {
  label: string;
  startDate: string;
  endDate: string;
  type: 'daterange';
  presets: DateRangePreset[];
}

export interface AmountRangeFilter {
  label: string;
  minAmount: number;
  maxAmount: number;
  type: 'range';
  presets: AmountRangePreset[];
}

export interface FinancialFilters {
  search: SearchFilter;
  transactionType: SelectFilter;
  paymentStatus: SelectFilter;
  paymentMethod: SelectFilter;
  serviceType: SelectFilter;
  dateRange: DateRangeFilter;
  amountRange: AmountRangeFilter;
  building: SelectFilter;
}

// Financial Summary Types
export interface MoneyAmount {
  amount: number;
  currency: string;
  formatted: string;
}

export interface GrowthMetric {
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface FinancialSummary {
  totalTransactions: number;
  totalRevenue: MoneyAmount;
  totalPending: MoneyAmount;
  totalOverdue: MoneyAmount;
  collectionRate: number;
  averageTransactionAmount: MoneyAmount;
  monthlyGrowth: GrowthMetric;
}

// Quick Stats
export interface QuickStat {
  label: string;
  value: string;
  count: number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
}

// Payment Method Stats
export interface PaymentMethodStat {
  method: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
  icon: string;
}

// Sort Options
export interface SortOption {
  value: string;
  label: string;
}

export interface SortOptions {
  currentSort: string;
  options: SortOption[];
}

// Pagination
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  showingFrom: number;
  showingTo: number;
  pageSizeOptions: number[];
}

// Bulk Actions
export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  requiresSelection: boolean;
  confirmationRequired: boolean;
  restrictedTo?: string[];
  dangerAction?: boolean;
}

export interface BulkActionsConfig {
  enabled: boolean;
  selectedCount: number;
  selectedAmount: MoneyAmount;
  actions: BulkAction[];
}

// Table Columns
export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable: boolean;
  type: 'checkbox' | 'link' | 'text' | 'user' | 'badge' | 'currency' | 'status' | 'datetime' | 'date' | 'actions';
  align?: 'left' | 'right' | 'center';
}

// Transaction Types
export interface TransactionApartment {
  number: string;
  block: string;
  floor: number;
  owner: string;
  tenant?: string | null;
}

export interface TransactionResident {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  type: 'owner' | 'tenant';
}

export interface TransactionType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface ServiceType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
  color: string;
  transactionRef?: string;
  bankAccount?: string;
  receivedBy?: string;
}

export interface TransactionStatus {
  id: string;
  label: string;
  color: string;
  bgColor: string;
}

export interface TransactionFees {
  processingFee: number;
  currency: string;
}

export interface TransactionPenalty {
  amount: number;
  currency: string;
  rate?: number;
  description?: string;
}

export interface ConsumptionData {
  amount: number;
  unit: string;
  rate: number;
  currency: string;
}

export interface MaintenanceDetails {
  requestId: string;
  technician: string;
  company: string;
  workDescription: string;
}

export interface FinancialTransaction {
  id: string;
  transactionId: string;
  title: string;
  apartment: TransactionApartment;
  resident: TransactionResident;
  transactionType: TransactionType;
  serviceType: ServiceType;
  amount: MoneyAmount;
  paymentMethod?: PaymentMethod | null;
  status: TransactionStatus;
  transactionDate: string;
  dueDate: string;
  paidDate?: string | null;
  period: string;
  description: string;
  receiptNumber?: string;
  fees?: TransactionFees;
  isOverdue: boolean;
  daysOverdue: number;
  penalty?: TransactionPenalty;
  consumption?: ConsumptionData;
  previousReading?: number;
  currentReading?: number;
  meterNumber?: string;
  maintenanceDetails?: MaintenanceDetails;
  remindersSent?: number;
  lastReminderDate?: string;
  tags: string[];
}

// Export Options
export interface ExportFormat {
  value: string;
  label: string;
  icon: string;
}

export interface ExportIncludeOption {
  key: string;
  label: string;
  default: boolean;
}

export interface ExportOptions {
  formats: ExportFormat[];
  includeOptions: ExportIncludeOption[];
  dateRangeRequired: boolean;
}

// Reporting Options
export interface AvailableReport {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface ReportingOptions {
  availableReports: AvailableReport[];
}

// Permissions
export interface FinancialPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canRefund: boolean;
  canExport: boolean;
  canViewCosts: boolean;
  canManagePenalties: boolean;
  canGenerateReports: boolean;
  canBulkEdit: boolean;
  role: string;
}

// Integration Types
export interface PaymentGateway {
  enabled: boolean;
  status: 'active' | 'inactive' | 'error';
  lastSync?: string;
  accounts?: string[];
  autoReconciliation?: boolean;
}

export interface AccountingSystem {
  enabled: boolean;
  provider?: string | null;
  lastSync?: string | null;
}

export interface Integrations {
  paymentGateways: {
    zaincash?: PaymentGateway;
    asiacell?: PaymentGateway;
    bankTransfer?: PaymentGateway;
  };
  accountingSystem: AccountingSystem;
}

// Main Financial List Type
export interface FinancialTransactionsList {
  pageInfo: PageInfo;
  filters: FinancialFilters;
  financialSummary: FinancialSummary;
  quickStats: QuickStat[];
  paymentMethodStats: PaymentMethodStat[];
  sortOptions: SortOptions;
  pagination: PaginationInfo;
  bulkActions: BulkActionsConfig;
  tableColumns: TableColumn[];
  transactions: FinancialTransaction[];
  exportOptions: ExportOptions;
  reportingOptions: ReportingOptions;
  permissions: FinancialPermissions;
  integrations: Integrations;
}

// Component Props Types
export interface FinancialPageHeaderProps {
  pageInfo: PageInfo;
  permissions: FinancialPermissions;
  onCreateNew: () => void;
  onExport: () => void;
  onGenerateReport: () => void;
}

export interface FinancialSummaryStatsProps {
  summary: FinancialSummary;
}

export interface FinancialQuickStatsProps {
  stats: QuickStat[];
}

export interface FinancialPaymentMethodChartProps {
  stats: PaymentMethodStat[];
  totalAmount: number;
}

export interface FinancialFiltersBarProps {
  filters: FinancialFilters;
  onFilterChange: (filterKey: string, value: any) => void;
  onSearchChange: (value: string) => void;
  onResetFilters: () => void;
}

export interface FinancialFilterPanelProps {
  filters: FinancialFilters;
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filterKey: string, value: any) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

export interface FinancialTableProps {
  transactions: FinancialTransaction[];
  columns: TableColumn[];
  selectedTransactions: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onSort: (columnKey: string) => void;
  onRowClick: (transaction: FinancialTransaction) => void;
  onActionClick: (action: string, transaction: FinancialTransaction) => void;
  loading?: boolean;
}

export interface FinancialGridProps {
  transactions: FinancialTransaction[];
  selectedTransactions: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onTransactionClick: (transaction: FinancialTransaction) => void;
  onActionClick: (action: string, transaction: FinancialTransaction) => void;
  loading?: boolean;
}

export interface FinancialBulkActionsBarProps {
  bulkActions: BulkActionsConfig;
  onActionClick: (actionId: string) => void;
  onClearSelection: () => void;
}

// Hook Return Type
export interface UseFinancialListReturn {
  data: FinancialTransactionsList | null;
  loading: boolean;
  error: string | null;
  filters: FinancialFilters;
  selectedTransactions: string[];
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
  updateFilter: (filterKey: string, value: any) => void;
  resetFilters: () => void;
  setSelectedTransactions: (ids: string[]) => void;
  handleBulkAction: (actionId: string) => Promise<void>;
  handleExport: (format: string, options: ExportIncludeOption[]) => Promise<void>;
  refetch: () => Promise<void>;
}