import { Staff, StaffStatus, EmploymentType } from '@/services/types/staff.types'
import type { Department, Position } from '@/services/types/department.types'

// Minimal helpers to synthesize Department/Position objects from API codes/strings
function makeDepartment(code?: string): Department | undefined {
  if (!code) return undefined as any
  return {
    id: code,
    code,
    name: code.replace(/_/g, ' '),
    createdAt: '',
    updatedAt: ''
  } as unknown as Department
}

function makePosition(title?: string | null, departmentCode?: string): Position | undefined {
  if (!title) return undefined as any
  return {
    id: title,
    title,
    code: title,
    departmentId: departmentCode || '',
    createdAt: '',
    updatedAt: ''
  } as unknown as Position
}

function toStaffStatus(status?: string | null, isActive?: boolean): StaffStatus {
  // Prefer explicit employmentStatus, fall back to isActive
  switch (status) {
    case 'ACTIVE':
      return StaffStatus.ACTIVE
    case 'INACTIVE':
      return StaffStatus.INACTIVE
    case 'ON_LEAVE':
      return StaffStatus.ON_LEAVE
    case 'TERMINATED':
      return StaffStatus.TERMINATED
    case 'SUSPENDED':
      return StaffStatus.SUSPENDED
    default:
      return isActive ? StaffStatus.ACTIVE : StaffStatus.INACTIVE
  }
}

function toEmploymentType(type?: string | null): EmploymentType {
  switch (type) {
    case 'FULL_TIME':
      return EmploymentType.FULL_TIME
    case 'PART_TIME':
      return EmploymentType.PART_TIME
    case 'CONTRACT':
      return EmploymentType.CONTRACT
    case 'INTERN':
      return EmploymentType.INTERN
    case 'CONSULTANT':
      return EmploymentType.CONSULTANT
    case 'FREELANCE':
      return EmploymentType.FREELANCE
    default:
      return EmploymentType.FULL_TIME
  }
}

export function transformApiStaffToStaff(apiStaff: any): Staff {
  const departmentCode = apiStaff?.department as string | undefined
  const positionTitle = apiStaff?.positionTitle as string | undefined
  const monthlySalary = apiStaff?.monthlySalary
  const user = apiStaff?.user || {}

  return {
    id: apiStaff?.id,
    createdAt: apiStaff?.createdAt || '',
    updatedAt: apiStaff?.updatedAt || '',
    // User-like fields (Staff extends User sans status in our types)
    email: user?.email || undefined,
    firstName: apiStaff?.firstName || user?.firstName || '',
    lastName: apiStaff?.lastName || user?.lastName || '',
    phone: user?.phone || undefined,
    username: user?.email || undefined,
    role: undefined as any,
    permissions: [] as any,

    // Personal Information
    nationalId: apiStaff?.nationalId || user?.tcKimlikNo || undefined,
    dateOfBirth: user?.dateOfBirth || undefined,

    emergencyContact: undefined,

    // Employment Information
    employeeId: apiStaff?.userId || apiStaff?.id,
    department: makeDepartment(departmentCode) as any,
    position: makePosition(positionTitle, departmentCode) as any,
    employmentType: toEmploymentType(apiStaff?.employmentType),
    startDate: apiStaff?.startDate || '',
    endDate: apiStaff?.endDate || undefined,
    salary: monthlySalary != null ? Number(monthlySalary) : undefined,

    // Manager
    managerId: undefined,
    manager: undefined as any,

    // Additional
    avatar: user?.avatarUrl || undefined,
    notes: apiStaff?.notes || undefined,
    isManager: false,

    // Status overrides
    status: toStaffStatus(apiStaff?.employmentStatus, apiStaff?.isActive),
  } as unknown as Staff
}

export function transformApiStaffListToStaff(list: any[]): Staff[] {
  if (!Array.isArray(list)) return []
  return list.map(transformApiStaffToStaff)
}


