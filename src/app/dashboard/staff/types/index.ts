import type { Staff, StaffStats, CreateStaffDto, UpdateStaffDto } from '@/services/types/staff.types'
import type { Department, Position } from '@/services/types/department.types'
import type { QuickFilter, SavedFilter } from '@/services/types/ui.types'
import type { StaffStatus } from '@/services/types/staff.types'
import type { StaffViewMode, StaffBulkAction } from '../constants/staff'

export interface StaffFilters {
  status?: StaffStatus[]
  department?: string[]
  position?: string[]
  employmentType?: string[]
  employmentStatus?: StaffStatus[]
  positionTitle?: string
  search?: string
}

export interface StaffPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface StaffUIState {
  isStaffFormOpen: boolean
  filtersOpen: boolean
  viewMode: StaffViewMode
  selectedStaffIds: string[]
  editingStaff: Staff | null
}

export interface StaffDataState {
  staff: Staff[]
  departments: Department[]
  positions: Position[]
  statsSummary: string
  quickFilters: QuickFilter[]
  savedFilters: SavedFilter[]
  managers: Staff[]
  pagination: StaffPagination
  quickStats: StaffStats
  isLoading: boolean
  error: string | null
  searchQuery: string
  filters: StaffFilters
}

export interface StaffActions {
  openCreate: () => void
  openEdit: (staff: Staff) => void
  closeForm: () => void
  applyQuickFilter: (key: string) => void
  onCreate: (data: CreateStaffDto) => Promise<void>
  onUpdate: (data: UpdateStaffDto) => Promise<void>
  onDelete: (staff: Staff) => Promise<void>
  onActivate: (staff: Staff) => Promise<void>
  onDeactivate: (staff: Staff) => Promise<void>
  onBulk: (action: StaffBulkAction, ids: string[]) => Promise<void>
  onExport: () => Promise<void>
  onImportClick: () => void
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  onView: (staff: Staff) => void
  openSettings: () => void
  refresh: () => Promise<void>
  setSearchQuery: (query: string) => void
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setViewMode: (mode: StaffViewMode) => void
  setSelected: (ids: string[]) => void
  setFilters: (filters: Partial<StaffFilters>) => void
  openFilters: () => void
  closeFilters: () => void
}

export interface StaffPageViewModel {
  ui: StaffUIState
  data: StaffDataState
  refs: {
    importInputRef: React.RefObject<HTMLInputElement>
  }
  actions: StaffActions
}