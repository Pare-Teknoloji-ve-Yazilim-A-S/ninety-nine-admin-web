// Staff Components
export { default as StaffCard } from './StaffCard'
export { default as StaffList } from './StaffList'
export { default as StaffForm } from './StaffForm'
export { default as StaffFilters } from './StaffFilters'
export { default as StaffStats } from './StaffStats'
export { default as DepartmentCard } from './DepartmentCard'
export { default as PositionCard } from './PositionCard'

// Re-export types for convenience
export type {
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  StaffFilterParams,
  StaffListResponse,
  StaffStats as StaffStatsType,
  StaffStatus,
  EmploymentType,
  EmergencyContact
} from '@/services/types/staff.types'

export type {
  Department,
  Position,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreatePositionDto,
  UpdatePositionDto
} from '@/services/types/department.types'

export type {
  StaffCardProps,
  StaffListConfig,
  StaffFiltersConfig,
  TableColumn,
  TableConfig,
  FilterOption,
  QuickFilter,
  SavedFilter
} from '@/services/types/ui.types'