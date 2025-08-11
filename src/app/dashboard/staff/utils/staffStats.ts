import { Staff, StaffStats, EmploymentType } from '@/services/types/staff.types'
import { StaffStatus } from '@/services/types/staff.types'
import type { Department } from '@/services/types/department.types'

export function calculateStaffStats(
  staff: Staff[],
  departments: Department[],
  totalStaffCount: number
): StaffStats {
  const initialByStatus = Object.values(StaffStatus).reduce((acc, status) => {
    acc[status as StaffStatus] = 0
    return acc
  }, {} as Record<StaffStatus, number>)

  const initialByEmployment: Record<EmploymentType, number> = {
    [EmploymentType.FULL_TIME]: 0,
    [EmploymentType.PART_TIME]: 0,
    [EmploymentType.CONTRACT]: 0,
    [EmploymentType.INTERN]: 0,
    [EmploymentType.FREELANCE]: 0,
    [EmploymentType.CONSULTANT]: 0
  }

  const byStatus = staff.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1
    return acc
  }, { ...initialByStatus })

  const byEmploymentType = staff.reduce((acc, s) => {
    acc[s.employmentType] = (acc[s.employmentType] || 0) + 1
    return acc
  }, { ...initialByEmployment })

  const averageSalary = staff.length > 0 
    ? staff.reduce((sum, s) => sum + (s.salary || 0), 0) / staff.length
    : 0

  return {
    total: totalStaffCount,
    byStatus,
    byEmploymentType,
    departmentCount: departments.length,
    averageSalary
  }
}

export function generateStatsSummary(
  activeCount: number,
  inactiveCount: number,
  onLeaveCount: number,
  suspendedCount: number,
  terminatedCount: number,
  totalStaffCount: number
): string {
  const activeRate = totalStaffCount > 0 
    ? Math.round((activeCount / totalStaffCount) * 100) 
    : 0

  return `Aktif: ${activeCount} (${activeRate}%) | Pasif: ${inactiveCount} | İzinli: ${onLeaveCount} | Askıda: ${suspendedCount} | Ayrılan: ${terminatedCount}`
}

export function getStaffCountByStatus(
  stats: StaffStats | undefined,
  status: StaffStatus
): number {
  return stats?.byStatus?.[status] ?? 0
}

export function getTotalStaffCount(
  stats: StaffStats | undefined,
  pagination: { total: number },
  staff: Staff[]
): number {
  return stats?.total ?? pagination.total ?? staff.length
}