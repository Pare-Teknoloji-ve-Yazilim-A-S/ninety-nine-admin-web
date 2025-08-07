// Staff Hooks
export { default as useStaff } from './useStaff'
export { default as useStaffActions } from './useStaffActions'
export { default as useStaffFilters } from './useStaffFilters'
export { default as useDepartments } from './useDepartments'
export { default as usePositions } from './usePositions'

// Re-export types for convenience
export type {
  Staff,
  StaffCreateDto,
  StaffUpdateDto,
  StaffFilterParams,
  StaffListDto,
  StaffStats
} from '@/services/types/staff.types'

export type {
  Department,
  Position,
  DepartmentCreateDto,
  DepartmentUpdateDto,
  PositionCreateDto,
  PositionUpdateDto
} from '@/services/types/department.types'