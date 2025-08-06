// Service Requests List Types
// Based on docs/page-structure/request-list-view.json

export interface PageInfo {
  title: string;
  subtitle: string;
  icon: string;
  lastUpdated: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
  color?: string;
  icon?: string;
  company?: string;
}

export interface FilterConfig {
  label: string;
  value: string;
  type: 'text' | 'select' | 'daterange';
  placeholder?: string;
  options?: FilterOption[];
  presets?: Array<{
    value: string;
    label: string;
  }>;
  startDate?: string;
  endDate?: string;
}

export interface RequestFilters {
  search?: FilterConfig;
  status?: FilterConfig;
  priority?: FilterConfig;
  category?: FilterConfig;
  assignee?: FilterConfig;
  dateRange?: FilterConfig;
  building?: FilterConfig;
}

export interface RequestSummary {
  totalRequests: number;
  activeRequests: number;
  completedToday: number;
  overdueRequests: number;
  averageResponseTime: string;
  averageCompletionTime: string;
  satisfactionRate: number;
}

export interface QuickStat {
  label: string;
  value: number;
  change: string;
  trend: 'up' | 'down';
  color: string;
  icon: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface SortOptions {
  currentSort: string;
  options: SortOption[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  showingFrom: number;
  showingTo: number;
  pageSizeOptions: number[];
}

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  requiresSelection: boolean;
  confirmationRequired: boolean;
  dangerAction?: boolean;
}

export interface BulkActionsConfig {
  enabled: boolean;
  selectedCount: number;
  actions: BulkAction[];
}

export interface TableColumn {
  key: string;
  label: string;
  width: string;
  sortable: boolean;
  type: 'text' | 'badge' | 'status' | 'user' | 'datetime' | 'date' | 'actions' | 'checkbox' | 'link';
}

export interface ApartmentInfo {
  number: string;
  block: string;
  floor: number;
  owner: string;
  tenant?: string;
  phone: string;
}

export interface CategoryInfo {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface PriorityInfo {
  id: string;
  label: string;
  level: number;
  color: string;
  icon: string;
}

export interface StatusInfo {
  id: string;
  label: string;
  color: string;
  bgColor: string;
}

export interface AssigneeInfo {
  id: string;
  name: string;
  company: string;
  phone: string;
  avatar: string;
  rating: number;
}

export interface CostInfo {
  estimated: number;
  actual?: number;
  currency: string;
}

export interface ServiceRequest {
  id: string;
  requestId: string;
  title: string;
  description: string;
  apartment: ApartmentInfo;
  category: CategoryInfo;
  priority: PriorityInfo;
  status: StatusInfo;
  assignee?: AssigneeInfo;
  createdDate: string;
  updatedDate: string;
  dueDate: string;
  estimatedCompletion?: string;
  completedDate?: string;
  responseTime?: string;
  completionTime?: string;
  imagesCount: number;
  commentsCount: number;
  cost: CostInfo;
  customerRating?: number;
  tags: string[];
  isOverdue: boolean;
  isUrgent: boolean;
  hasImages: boolean;
  hasComments: boolean;
}

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
}

export interface RequestPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAssign: boolean;
  canExport: boolean;
  canViewCosts: boolean;
  canBulkEdit: boolean;
  role: string;
}

export interface ServiceRequestsList {
  pageInfo: PageInfo;
  filters: RequestFilters;
  summary: RequestSummary;
  quickStats: QuickStat[];
  sortOptions: SortOptions;
  pagination: PaginationInfo;
  bulkActions: BulkActionsConfig;
  tableColumns: TableColumn[];
  requests: ServiceRequest[];
  exportOptions: ExportOptions;
  permissions: RequestPermissions;
}

// API Request/Response Types
export interface RequestsListFilters {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignee?: string;
  building?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface RequestsListResponse {
  data: ServiceRequest[];
  summary: RequestSummary;
  quickStats: QuickStat[];
  pagination: PaginationInfo;
  permissions: RequestPermissions;
}

// Hook Return Types
export interface UseRequestsListResult {
  data: ServiceRequestsList;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (filters: Partial<RequestsListFilters>) => void;
  resetFilters: () => void;
  updateSort: (sort: string) => void;
  updatePagination: (page: number, limit?: number) => void;
}

export interface UseRequestsFiltersResult {
  filters: RequestsListFilters;
  activeFilters: Array<{ key: string; value: any; label: string }>;
  setFilter: (key: keyof RequestsListFilters, value: any) => void;
  removeFilter: (key: keyof RequestsListFilters) => void;
  resetFilters: () => void;
  applyFilters: (filters: Partial<RequestsListFilters>) => void;
}

export interface UseRequestsActionsResult {
  viewRequest: (request: ServiceRequest) => void;
  editRequest: (request: ServiceRequest) => void;
  deleteRequest: (request: ServiceRequest) => Promise<void>;
  assignTechnician: (request: ServiceRequest, technicianId: string) => Promise<void>;
  updateStatus: (request: ServiceRequest, status: string) => Promise<void>;
  updatePriority: (request: ServiceRequest, priority: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface UseRequestsBulkActionsResult {
  selectedRequests: ServiceRequest[];
  selectRequest: (request: ServiceRequest) => void;
  selectMultiple: (requests: ServiceRequest[]) => void;
  selectAll: (requests: ServiceRequest[]) => void;
  clearSelection: () => void;
  bulkAssign: (technicianId: string) => Promise<void>;
  bulkUpdateStatus: (status: string) => Promise<void>;
  bulkUpdatePriority: (priority: string) => Promise<void>;
  bulkDelete: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface UseRequestsExportResult {
  exportRequests: (format: string, options: ExportIncludeOption[]) => Promise<void>;
  exportSelected: (requests: ServiceRequest[], format: string, options: ExportIncludeOption[]) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Component Props Types
export interface RequestsPageHeaderProps {
  summary: RequestSummary;
  onRefresh: () => void;
  onCreateRequest: () => void;
  loading?: boolean;
}

export interface RequestsSummaryStatsProps {
  summary: RequestSummary;
  loading?: boolean;
}

export interface RequestsQuickStatsProps {
  quickStats: QuickStat[];
  loading?: boolean;
}

export interface RequestsFiltersBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  activeFiltersCount: number;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onApplyFilters?: (filters: any) => void;
  onResetFilters?: () => void;
}

export interface RequestsFilterPanelProps {
  filters: RequestFilters;
  activeFilters: RequestsListFilters;
  onApplyFilters: (filters: RequestsListFilters) => void;
  onResetFilters: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export interface RequestsTableViewProps {
  requests: ServiceRequest[];
  columns: TableColumn[];
  loading?: boolean;
  selectedRequests: ServiceRequest[];
  onSelectionChange: (requests: ServiceRequest[]) => void;
  onRequestAction: (action: string, request: ServiceRequest) => void;
  sortOptions: SortOptions;
  onSortChange: (sort: string) => void;
}

export interface RequestsGridViewProps {
  requests: ServiceRequest[];
  loading?: boolean;
  selectedRequests: ServiceRequest[];
  onSelectionChange: (requests: ServiceRequest[]) => void;
  onRequestAction: (action: string, request: ServiceRequest) => void;
  loadingCardCount?: number;
}

export interface RequestsBulkActionsBarProps {
  selectedCount: number;
  bulkActions: BulkAction[];
  onBulkAction: (actionId: string) => void;
  onClearSelection: () => void;
  loading?: boolean;
}