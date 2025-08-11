'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Staff, StaffStats } from '@/services/types/staff.types'
import type { Department, Position } from '@/services/types/department.types'
import type { QuickFilter, SavedFilter } from '@/services/types/ui.types'
import type { StaffFilters, StaffPagination, StaffDataState } from '../types'
import { calculateStaffStats, generateStatsSummary, getStaffCountByStatus, getTotalStaffCount } from '../utils/staffStats'
import { StaffStatus } from '@/services/types/staff.types'
import { STAFF_QUICK_FILTER_KEYS } from '../constants/staff'

interface UseStaffDataProps {
  initialData?: {
    staff?: Staff[]
    departments?: Department[]
    positions?: Position[]
    quickFilters?: QuickFilter[]
    savedFilters?: SavedFilter[]
    managers?: Staff[]
  }
}

export function useStaffData({ initialData }: UseStaffDataProps = {}) {
  const [staff, setStaff] = useState<Staff[]>(initialData?.staff || [])
  const [departments, setDepartments] = useState<Department[]>(initialData?.departments || [])
  const [positions, setPositions] = useState<Position[]>(initialData?.positions || [])
  const [quickFilters, setQuickFilters] = useState<QuickFilter[]>(initialData?.quickFilters || [])
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(initialData?.savedFilters || [])
  const [managers, setManagers] = useState<Staff[]>(initialData?.managers || [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<StaffFilters>({})
  const [pagination, setPagination] = useState<StaffPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  // Computed values
  const quickStats = useMemo(() => {
    const totalStaffCount = getTotalStaffCount(undefined, pagination, staff)
    return calculateStaffStats(staff, departments, totalStaffCount)
  }, [staff, departments, pagination])

  const statsSummary = useMemo(() => {
    const activeCount = getStaffCountByStatus(quickStats, StaffStatus.ACTIVE)
    const inactiveCount = getStaffCountByStatus(quickStats, StaffStatus.INACTIVE)
    const onLeaveCount = getStaffCountByStatus(quickStats, StaffStatus.ON_LEAVE)
    const suspendedCount = getStaffCountByStatus(quickStats, StaffStatus.SUSPENDED)
    const terminatedCount = getStaffCountByStatus(quickStats, StaffStatus.TERMINATED)
    const totalStaffCount = getTotalStaffCount(quickStats, pagination, staff)

    return generateStatsSummary(
      activeCount,
      inactiveCount,
      onLeaveCount,
      suspendedCount,
      terminatedCount,
      totalStaffCount
    )
  }, [quickStats, pagination, staff])

  // Data fetching functions
  const fetchStaff = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Implement actual API call
      // const response = await staffService.getStaff({ ...filters, search: searchQuery, page: pagination.page, limit: pagination.limit })
      // setStaff(response.data)
      // setPagination(response.pagination)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [filters, searchQuery, pagination.page, pagination.limit])

  const fetchDepartments = useCallback(async () => {
    try {
      // TODO: Implement actual API call
      // const response = await departmentService.getDepartments()
      // setDepartments(response.data)
    } catch (err: unknown) {
      console.error('Failed to fetch departments:', err)
    }
  }, [])

  const fetchPositions = useCallback(async () => {
    try {
      // TODO: Implement actual API call
      // const response = await positionService.getPositions()
      // setPositions(response.data)
    } catch (err: unknown) {
      console.error('Failed to fetch positions:', err)
    }
  }, [])

  const fetchManagers = useCallback(async () => {
    try {
      // TODO: Implement actual API call
      // const response = await staffService.getManagers()
      // setManagers(response.data)
    } catch (err: unknown) {
      console.error('Failed to fetch managers:', err)
    }
  }, [])

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchStaff(),
      fetchDepartments(),
      fetchPositions(),
      fetchManagers()
    ])
  }, [fetchStaff, fetchDepartments, fetchPositions, fetchManagers])

  // Filter and search functions
  const applyQuickFilter = useCallback((key: string) => {
    switch (key) {
      case STAFF_QUICK_FILTER_KEYS.ACTIVE:
        setFilters({ status: [StaffStatus.ACTIVE] })
        break
      case STAFF_QUICK_FILTER_KEYS.INACTIVE:
        setFilters({ status: [StaffStatus.INACTIVE] })
        break
      case STAFF_QUICK_FILTER_KEYS.ON_LEAVE:
        setFilters({ status: [StaffStatus.ON_LEAVE] })
        break
      case STAFF_QUICK_FILTER_KEYS.NEW_HIRES:
        // TODO: Implement new hires filter logic
        break
      default:
        setFilters({})
    }
  }, [])

  const updateFilters = useCallback((newFilters: Partial<StaffFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }))
  }, [])

  // Initial data fetch
  useEffect(() => {
    if (!initialData) {
      refresh()
    }
  }, [])

  // Refetch when filters or pagination change
  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  const dataState: StaffDataState = {
    staff,
    departments,
    positions,
    statsSummary,
    quickFilters,
    savedFilters,
    managers,
    pagination,
    quickStats,
    isLoading,
    error,
    searchQuery,
    filters
  }

  const dataActions = {
    refresh,
    applyQuickFilter,
    setSearchQuery,
    setPage,
    setLimit,
    setFilters: updateFilters
  }

  return {
    dataState,
    dataActions
  }
}