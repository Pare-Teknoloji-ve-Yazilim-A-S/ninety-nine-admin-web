// Staff Domain Types - API-99CLUB Compatible
import { BaseEntity } from '../core/types'
import { User, UserRole, Permission } from './user.types'
import { Department, Position } from './department.types'

// Staff Status Enum
export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED',
  SUSPENDED = 'SUSPENDED'
}

// Employment Type Enum
export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
  CONSULTANT = 'CONSULTANT',
  FREELANCE = 'FREELANCE'
}

// Type aliases for compatibility
export type StaffStatusType = StaffStatus
export type EmploymentTypeEnum = EmploymentType

// Emergency Contact Information
export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

// Department and Position interfaces are now imported from department.types.ts
// This prevents circular imports and ensures single source of truth

// Staff Interface - extends User with additional staff-specific fields
export interface Staff extends Omit<User, 'status'> {
  // Personal Information
  nationalId?: string
  dateOfBirth?: string
  address?: string
  emergencyContact?: EmergencyContact
  
  // Employment Information
  employeeId: string
  department: Department
  position: Position
  employmentType: EmploymentType
  startDate: string
  endDate?: string
  salary?: number
  
  // Manager Information
  managerId?: string
  manager?: Staff
  
  // Additional Fields
  avatar?: string
  notes?: string
  isManager: boolean
  
  // Override status to use StaffStatus
  status: StaffStatus
}

// Staff Filter Parameters
export interface StaffFilterParams {
  search?: string
  status?: StaffStatus[]
  employmentType?: EmploymentType[]
  // New admin-search specific filters
  employmentStatus?: StaffStatus[]
  positionTitle?: string
  department?: string[]
  // Legacy/id-based filters (still used in some UIs)
  departmentId?: string[]
  positionId?: string[]
  managerId?: string
  salaryMin?: number
  salaryMax?: number
  startDateFrom?: string
  startDateTo?: string
  isManager?: boolean
  hasAvatar?: boolean
  page?: number
  limit?: number
  sortBy?: keyof Staff
  sortOrder?: 'asc' | 'desc'
}

// Staff Statistics
export interface StaffStats {
  total: number
  byStatus: Record<StaffStatus, number>
  byEmploymentType: Record<EmploymentType, number>
  byDepartment?: Record<string, number>
  departmentCount: number
  averageSalary: number
  recentHires?: Staff[]
  growth?: {
    total: number
    byStatus: Record<StaffStatus, number>
  }
}

// Staff DTOs
export interface CreateStaffDto {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone?: string
  nationalId?: string
  dateOfBirth?: string
  address?: string
  emergencyContact?: EmergencyContact
  
  // Employment Information
  employeeId: string
  departmentId: string
  positionId: string
  employmentType: EmploymentType
  startDate: string
  salary?: number
  managerId?: string
  
  // Additional Fields
  avatar?: string
  notes?: string
  isManager?: boolean
  
  // User fields
  username: string
  password: string
  role: UserRole
  roleId: string
  permissions?: Permission[]
}

export interface UpdateStaffDto {
  // Personal Information
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  nationalId?: string
  dateOfBirth?: string
  address?: string
  emergencyContact?: EmergencyContact
  
  // Employment Information
  employeeId?: string
  departmentId?: string
  positionId?: string
  employmentType?: EmploymentType
  startDate?: string
  endDate?: string
  salary?: number
  managerId?: string
  
  // Additional Fields
  avatar?: string
  notes?: string
  isManager?: boolean
  status?: StaffStatus
  
  // User fields
  username?: string
  role?: UserRole
  permissions?: Permission[]
}

// Staff Response DTOs
export interface StaffListResponse {
  data: Staff[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface StaffDetailResponse {
  data: Staff
}

// Additional response types for staff service
export interface StaffStatsResponse {
  total: number
  byStatus: Record<StaffStatus, number>
  byEmploymentType: Record<EmploymentType, number>
  byDepartment?: Record<string, number>
  departmentCount: number
  averageSalary: number
  recentHires?: Staff[]
  growth?: {
    total: number
    byStatus: Record<StaffStatus, number>
  }
}

export interface StaffProfileDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  nationalId?: string
  dateOfBirth?: string
  address?: string
  emergencyContact?: EmergencyContact
  avatar?: string
  notes?: string
}

export interface StaffAssignmentDto {
  staffId: string
  departmentId?: string
  positionId?: string
  managerId?: string
  startDate?: string
}

export interface BulkStaffOperationDto {
  staffIds: string[]
  operation: 'activate' | 'deactivate' | 'delete' | 'update' | 'transfer'
  data?: Partial<UpdateStaffDto>
}

export interface StaffAuditLogResponse {
  id: string
  staffId: string
  action: string
  changes: Record<string, unknown>
  performedBy: string
  performedAt: string
  ipAddress?: string
}

export interface StaffExportDto {
  format: 'csv' | 'xlsx' | 'pdf'
  fields?: (keyof Staff)[]
  filters?: StaffFilterParams
  includeHeaders?: boolean
  fileName?: string
}

export interface StaffImportDto {
  file: File
  validateOnly?: boolean
  skipDuplicates?: boolean
  updateExisting?: boolean
}

export interface StaffHierarchyResponse {
  staff: Staff
  directReports: StaffHierarchyResponse[]
  level: number
}

export interface StaffPerformanceDto {
  staffId: string
  reviewerId: string
  period: string
  score: number
  goals: string[]
  achievements: string[]
  improvements: string[]
  comments?: string
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED'
}

export interface StaffLeaveDto {
  staffId: string
  type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID'
  startDate: string
  endDate: string
  days: number
  reason?: string
}

// Staff Bulk Operations
export interface BulkStaffOperation {
  staffIds: string[]
  operation: 'activate' | 'deactivate' | 'delete' | 'update' | 'transfer'
  data?: Partial<UpdateStaffDto>
}

export interface BulkStaffResult {
  success: string[]
  failed: Array<{
    id: string
    error: string
  }>
  total: number
  successCount: number
  failedCount: number
}

// Staff Import/Export
export interface StaffImportData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  employeeId: string
  departmentCode: string
  positionTitle: string
  employmentType: EmploymentType
  startDate: string
  salary?: number
  managerEmail?: string
}

export interface StaffImportResult {
  imported: Staff[]
  failed: Array<{
    row: number
    data: StaffImportData
    errors: string[]
  }>
  total: number
  importedCount: number
  failedCount: number
}

export interface StaffExportOptions {
  format: 'csv' | 'xlsx' | 'pdf'
  fields?: (keyof Staff)[]
  filters?: StaffFilterParams
  includeHeaders?: boolean
  fileName?: string
}

// Staff Performance (for future use)
export interface StaffPerformance extends BaseEntity {
  staffId: string
  staff: Staff
  reviewerId: string
  reviewer: Staff
  period: string
  score: number
  goals: string[]
  achievements: string[]
  improvements: string[]
  comments?: string
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED'
}

// Staff Training (for future use)
export interface StaffTraining extends BaseEntity {
  staffId: string
  staff: Staff
  title: string
  description?: string
  provider: string
  startDate: string
  endDate: string
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  certificateUrl?: string
  cost?: number
}

// Staff Leave (for future use)
export interface StaffLeave extends BaseEntity {
  staffId: string
  type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID'
  startDate: string
  endDate: string
  days: number
  reason?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  approvedBy?: string
  approver?: Staff
}