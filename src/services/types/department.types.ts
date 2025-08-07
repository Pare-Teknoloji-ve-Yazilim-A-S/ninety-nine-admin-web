// Department Domain Types - API-99CLUB Compatible
import { BaseEntity } from '../core/types'

// Forward declaration to avoid circular imports
// Staff interface is defined in staff.types.ts
export interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  // ... other Staff properties will be available when properly imported
}

// Department Interface - Unified definition
export interface Department extends BaseEntity {
  name: string
  description?: string
  code: string // Unique department code (e.g., 'IT', 'HR', 'FIN')
  managerId?: string
  manager?: Staff
  parentDepartmentId?: string
  parentDepartment?: Department
  isActive: boolean
  
  // Additional Department Fields
  budget?: number
  location?: string
  email?: string
  phone?: string
  costCenter?: string
  
  // Hierarchy Information
  level: number // 0: Root, 1: Division, 2: Department, 3: Team
  path: string // Hierarchical path (e.g., '/company/it/development')
  
  // Statistics (computed fields)
  totalStaff?: number
  activeStaff?: number
  staffCount: number
  positions?: Position[]
  subDepartments?: Department[]
  childDepartments?: Department[]
  staff?: Staff[]
}

// Position Interface - Unified definition
export interface Position extends BaseEntity {
  title: string
  description?: string
  departmentId: string
  department: Department
  level: number // 1: Junior, 2: Mid, 3: Senior, 4: Lead, 5: Manager, 6: Director
  minSalary?: number
  maxSalary?: number
  requirements?: string[]
  responsibilities?: string[]
  isActive: boolean
  
  // Additional Position Fields
  code?: string // Position code (e.g., 'DEV001', 'HR002')
  category: PositionCategory
  employmentTypes: EmploymentType[] // Allowed employment types for this position
  
  // Reporting Structure
  reportsToPositionId?: string
  reportsToPosition?: Position
  
  // Statistics (computed fields)
  currentStaffCount?: number
  maxStaffCount?: number
  vacancies?: number
  staffCount: number
  staff?: Staff[]
}

// Position Category Enum
export type PositionCategory = 
  | 'EXECUTIVE' 
  | 'MANAGEMENT' 
  | 'TECHNICAL' 
  | 'ADMINISTRATIVE' 
  | 'SALES' 
  | 'SUPPORT' 
  | 'OPERATIONS'

// Import EmploymentType from staff.types.ts
import { EmploymentType } from './staff.types'
export { EmploymentType }

// Department DTOs
export interface CreateDepartmentDto {
  name: string
  description?: string
  code: string
  managerId?: string
  parentDepartmentId?: string
  budget?: number
  location?: string
  email?: string
  phone?: string
}

export interface UpdateDepartmentDto {
  name?: string
  description?: string
  code?: string
  managerId?: string
  parentDepartmentId?: string
  budget?: number
  location?: string
  email?: string
  phone?: string
  isActive?: boolean
}

// Position DTOs
export interface CreatePositionDto {
  title: string
  description?: string
  departmentId: string
  level: number
  minSalary?: number
  maxSalary?: number
  requirements?: string[]
  responsibilities?: string[]
  code?: string
  category: PositionCategory
  employmentTypes: EmploymentType[]
  reportsToPositionId?: string
  maxStaffCount?: number
}

export interface UpdatePositionDto {
  title?: string
  description?: string
  departmentId?: string
  level?: number
  minSalary?: number
  maxSalary?: number
  requirements?: string[]
  responsibilities?: string[]
  code?: string
  category?: PositionCategory
  employmentTypes?: EmploymentType[]
  reportsToPositionId?: string
  maxStaffCount?: number
  isActive?: boolean
}

// Filter Parameters
export interface DepartmentFilterParams {
  page?: number
  limit?: number
  search?: string
  parentDepartmentId?: string
  managerId?: string
  isActive?: boolean
  level?: number
  hasManager?: boolean
  sortBy?: 'name' | 'code' | 'createdAt' | 'totalStaff'
  sortOrder?: 'asc' | 'desc'
}

export interface PositionFilterParams {
  page?: number
  limit?: number
  search?: string
  departmentId?: string
  category?: PositionCategory
  level?: number
  minSalary?: number
  maxSalary?: number
  employmentType?: EmploymentType
  isActive?: boolean
  hasVacancies?: boolean
  sortBy?: 'title' | 'level' | 'minSalary' | 'maxSalary' | 'currentStaffCount'
  sortOrder?: 'asc' | 'desc'
}

// Response DTOs
export interface DepartmentListResponse {
  departments: Department[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PositionListResponse {
  positions: Position[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Department Hierarchy
export interface DepartmentHierarchy {
  department: Department
  children: DepartmentHierarchy[]
  level: number
  totalStaffInHierarchy: number
}

// Organization Chart
export interface OrganizationChart {
  departments: DepartmentHierarchy[]
  totalDepartments: number
  totalPositions: number
  totalStaff: number
}

// Department Statistics
export interface DepartmentStats {
  departmentId: string
  departmentName: string
  totalStaff: number
  activeStaff: number
  inactiveStaff: number
  totalPositions: number
  filledPositions: number
  vacantPositions: number
  budget?: number
  budgetUtilization?: number
}

// Position Statistics
export interface PositionStats {
  positionId: string
  positionTitle: string
  departmentName: string
  currentStaffCount: number
  maxStaffCount?: number
  vacancies: number
  averageSalary?: number
  salaryRange?: {
    min: number
    max: number
  }
}

// Bulk Operations
export interface BulkDepartmentActionDto {
  departmentIds: string[]
  action: 'activate' | 'deactivate' | 'delete' | 'assign_manager'
  data?: {
    managerId?: string
    isActive?: boolean
  }
}

export interface BulkPositionActionDto {
  positionIds: string[]
  action: 'activate' | 'deactivate' | 'delete' | 'transfer_department'
  data?: {
    departmentId?: string
    isActive?: boolean
  }
}

export interface BulkActionResponse {
  successful: string[]
  failed: {
    id: string
    error: string
  }[]
  total: number
  successCount: number
  failureCount: number
}

// Department Transfer
export interface DepartmentTransferDto {
  departmentId: string
  newParentDepartmentId?: string
  effectiveDate: string
  reason?: string
}

// Position Transfer
export interface PositionTransferDto {
  positionId: string
  newDepartmentId: string
  effectiveDate: string
  reason?: string
}

// Audit Logs
export interface DepartmentAuditLog extends BaseEntity {
  departmentId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'MANAGER_ASSIGN' | 'TRANSFER'
  changes: Record<string, { from: any; to: any }>
  performedBy: string
  reason?: string
  ipAddress?: string
}

export interface PositionAuditLog extends BaseEntity {
  positionId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'TRANSFER'
  changes: Record<string, { from: any; to: any }>
  performedBy: string
  reason?: string
  ipAddress?: string
}

// Export/Import
export interface DepartmentExportParams {
  format: 'csv' | 'excel' | 'pdf'
  filters?: DepartmentFilterParams
  includeHierarchy?: boolean
  includeStats?: boolean
}

export interface PositionExportParams {
  format: 'csv' | 'excel' | 'pdf'
  filters?: PositionFilterParams
  includeDepartmentInfo?: boolean
  includeStats?: boolean
}

// Validation Schemas (for future use with Zod)
export interface DepartmentValidationRules {
  name: {
    minLength: number
    maxLength: number
    required: boolean
  }
  code: {
    pattern: RegExp
    unique: boolean
    required: boolean
  }
  budget: {
    min: number
    max: number
  }
}

export interface PositionValidationRules {
  title: {
    minLength: number
    maxLength: number
    required: boolean
  }
  level: {
    min: number
    max: number
    required: boolean
  }
  salary: {
    minSalaryLessThanMaxSalary: boolean
    positiveValues: boolean
  }
}