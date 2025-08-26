// Staff Hooks
export { default as useStaff } from './useStaff'
export { default as useStaffActions } from './useStaffActions'
export { default as useStaffFilters } from './useStaffFilters'
export { default as useDepartments } from './useDepartments'
export { default as usePositions } from './usePositions'

// Role Hooks
export { useRoles } from './useRoles'

// Permission Hooks
export { usePermissions } from './usePermissions'
export { usePermissionCheck } from './usePermissionCheck'

// Re-export types for convenience
export type {
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  StaffFilterParams,
  StaffListResponse,
  StaffDetailResponse,
  StaffStatsResponse,
  StaffProfileDto,
  StaffAssignmentDto,
  BulkStaffOperationDto,
  StaffExportDto,
  StaffImportDto,
  StaffPerformanceDto,
  StaffLeaveDto,
  StaffStatus,
  EmploymentType
} from '@/services/types/staff.types'

export type {
  Department,
  Position,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreatePositionDto,
  UpdatePositionDto,
  DepartmentFilterParams,
  PositionFilterParams,
  DepartmentListResponse,
  PositionListResponse,
  DepartmentHierarchy,
  OrganizationChart,
  DepartmentStats,
  PositionStats,
  BulkDepartmentActionDto,
  BulkPositionActionDto,
  DepartmentTransferDto,
  PositionTransferDto,
  DepartmentAuditLog,
  PositionAuditLog,
  DepartmentValidationRules,
  PositionValidationRules
} from '@/services/types/department.types'