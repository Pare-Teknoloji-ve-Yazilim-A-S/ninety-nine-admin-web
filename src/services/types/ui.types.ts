// UI Domain Types for Staff Module
import { Staff, StaffStatus, EmploymentType } from './staff.types'
import { Department, Position, PositionCategory } from './department.types'

// Table and List UI Types
export interface TableColumn<T = any> {
  key: keyof T | string
  title: string
  sortable?: boolean
  filterable?: boolean
  width?: number | string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, record: T) => React.ReactNode
  className?: string
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[]
  rowKey: keyof T | string
  selectable?: boolean
  pagination?: boolean
  sortable?: boolean
  filterable?: boolean
  exportable?: boolean
  actions?: TableAction<T>[]
}

export interface TableAction<T = any> {
  key: string
  label: string
  icon?: React.ReactNode
  onClick: (record: T) => void
  disabled?: (record: T) => boolean
  visible?: (record: T) => boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
}

// Staff List UI Types
export interface StaffListConfig extends TableConfig<Staff> {
  viewMode: 'table' | 'grid' | 'card'
  groupBy?: 'department' | 'position' | 'status' | 'manager'
  showFilters: boolean
  showSearch: boolean
  showBulkActions: boolean
}

export interface StaffCardProps {
  staff: Staff
  selected?: boolean
  onSelect?: (selected: boolean) => void
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  showActions?: boolean
  compact?: boolean
}

// Filter UI Types
export interface FilterOption<T = any> {
  label: string
  value: T
  count?: number
  disabled?: boolean
}

export interface FilterGroup {
  key: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'text' | 'boolean'
  options?: FilterOption[]
  placeholder?: string
  clearable?: boolean
  searchable?: boolean
}

export interface StaffFiltersConfig {
  search: {
    placeholder: string
    fields: (keyof Staff)[]
  }
  groups: FilterGroup[]
  quickFilters: QuickFilter[]
  savedFilters?: SavedFilter[]
}

export interface QuickFilter {
  key: string
  label: string
  icon?: React.ReactNode
  filters: Record<string, any>
  count?: number
}

export interface SavedFilter {
  id: string
  name: string
  filters: Record<string, any>
  isDefault?: boolean
  createdBy: string
  createdAt: string
}

// Form UI Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'multiselect' | 'textarea' | 'file' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  options?: FilterOption[]
  validation?: {
    min?: number
    max?: number
    pattern?: RegExp
    custom?: (value: any) => string | undefined
  }
  dependencies?: string[] // Fields that affect this field
  conditional?: (values: Record<string, any>) => boolean
  help?: string
  className?: string
}

export interface FormSection {
  key: string
  title: string
  description?: string
  fields: FormField[]
  collapsible?: boolean
  defaultCollapsed?: boolean
  className?: string
}

export interface StaffFormConfig {
  mode: 'create' | 'edit' | 'view'
  sections: FormSection[]
  submitLabel?: string
  cancelLabel?: string
  showProgress?: boolean
  autoSave?: boolean
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit'
}

// Modal and Dialog Types
export interface ModalConfig {
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  maskClosable?: boolean
  footer?: React.ReactNode
  className?: string
}

export interface ConfirmDialogConfig {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

// Bulk Actions UI Types
export interface BulkAction {
  key: string
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline'
  requiresConfirmation?: boolean
  confirmationConfig?: ConfirmDialogConfig
  disabled?: (selectedItems: any[]) => boolean
  visible?: (selectedItems: any[]) => boolean
  execute: (selectedItems: any[]) => Promise<void>
}

export interface BulkActionsConfig {
  actions: BulkAction[]
  maxSelection?: number
  showSelectAll?: boolean
  showClearSelection?: boolean
  position?: 'top' | 'bottom' | 'both'
}

// Status and Badge UI Types
export interface StatusConfig {
  [key: string]: {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
    icon?: React.ReactNode
    className?: string
  }
}

export const STAFF_STATUS_CONFIG: StatusConfig = {
  ACTIVE: {
    label: 'Aktif',
    variant: 'success',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
  INACTIVE: {
    label: 'Pasif',
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  },
  ON_LEAVE: {
    label: 'İzinli',
    variant: 'warning',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  },
  TERMINATED: {
    label: 'İşten Çıkarıldı',
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  },
  SUSPENDED: {
    label: 'Askıya Alındı',
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
}

export const EMPLOYMENT_TYPE_CONFIG: StatusConfig = {
  FULL_TIME: {
    label: 'Tam Zamanlı',
    variant: 'default'
  },
  PART_TIME: {
    label: 'Yarı Zamanlı',
    variant: 'outline'
  },
  CONTRACT: {
    label: 'Sözleşmeli',
    variant: 'secondary'
  },
  INTERN: {
    label: 'Stajyer',
    variant: 'outline'
  },
  CONSULTANT: {
    label: 'Danışman',
    variant: 'secondary'
  }
}

// Navigation and Breadcrumb Types
export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  current?: boolean
}

export interface NavigationItem {
  key: string
  label: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  children?: NavigationItem[]
  permissions?: string[]
}

// Loading and Error States
export interface LoadingState {
  isLoading: boolean
  loadingText?: string
  progress?: number
}

export interface ErrorState {
  hasError: boolean
  error?: Error | string
  errorCode?: string
  retryable?: boolean
  onRetry?: () => void
}

export interface EmptyState {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

// Pagination UI Types
export interface PaginationConfig {
  page: number
  limit: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: boolean
  pageSizeOptions?: number[]
  position?: 'top' | 'bottom' | 'both'
}

// Search and Sort UI Types
export interface SearchConfig {
  placeholder: string
  debounceMs?: number
  minLength?: number
  showClearButton?: boolean
  showSearchButton?: boolean
  fields?: string[]
}

export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
  options: {
    field: string
    label: string
  }[]
}

// Export and Import UI Types
export interface ExportConfig {
  formats: ('csv' | 'excel' | 'pdf')[]
  filename?: string
  includeFilters?: boolean
  customFields?: string[]
}

export interface ImportConfig {
  acceptedFormats: string[]
  maxFileSize: number
  templateUrl?: string
  validationRules?: Record<string, any>
  previewRows?: number
}

// Theme and Styling Types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  fontFamily: string
}

// Responsive Design Types
export interface ResponsiveConfig {
  breakpoints: {
    sm: number
    md: number
    lg: number
    xl: number
    '2xl': number
  }
  columns: {
    sm: number
    md: number
    lg: number
    xl: number
  }
}

// Animation and Transition Types
export interface AnimationConfig {
  duration: number
  easing: string
  disabled?: boolean
}

// Accessibility Types
export interface A11yConfig {
  announceChanges?: boolean
  keyboardNavigation?: boolean
  screenReaderSupport?: boolean
  highContrast?: boolean
  reducedMotion?: boolean
}