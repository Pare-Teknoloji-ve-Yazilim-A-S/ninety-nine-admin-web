'use client'

import { useState, useEffect, useCallback } from 'react'
import { staffService } from '@/services/staff.service'
import {
  Staff,
  StaffFilterParams,
  StaffListResponse,
  StaffStatsResponse,
  StaffStatus
} from '@/services/types/staff.types'
import { PaginatedResponse, LoadingState } from '@/services/core/types'
import { useToast } from './useToast'

interface UseStaffOptions {
  autoFetch?: boolean
  initialFilters?: StaffFilterParams
  onError?: (error: Error) => void
  onSuccess?: (data: any) => void
}

interface UseStaffReturn {
  // Data
  staff: Staff[]
  selectedStaff: Staff | null
  stats: StaffStatsResponse | null
  
  // Pagination
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  
  // Loading states
  loading: LoadingState
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  
  // Error states
  error: string | null
  
  // Actions
  fetchStaff: (params?: StaffFilterParams) => Promise<void>
  fetchStaffById: (id: string | number) => Promise<Staff | null>
  refreshStaff: () => Promise<void>
  fetchStats: () => Promise<void>
  
  // Pagination actions
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  goToNextPage: () => void
  goToPrevPage: () => void
  
  // Selection
  selectStaff: (staff: Staff | null) => void
  
  // Filters
  filters: StaffFilterParams
  setFilters: (filters: StaffFilterParams) => void
  clearFilters: () => void
  
  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchStaff: (query: string) => Promise<void>
  
  // Utility
  getStaffByStatus: (status: StaffStatus) => Staff[]
  getStaffByDepartment: (departmentId: string) => Staff[]
  getTotalStaffCount: () => number
}

export function useStaff(options: UseStaffOptions = {}): UseStaffReturn {
  const {
    autoFetch = true,
    initialFilters = {},
    onError,
    onSuccess
  } = options

  const { success, error: toastError } = useToast()

  // State
  const [staff, setStaff] = useState<Staff[]>([])
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [stats, setStats] = useState<StaffStatsResponse | null>(null)
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    error: null
  })
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<StaffFilterParams>(initialFilters)
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  // Clear error when data changes
  useEffect(() => {
    if (staff.length > 0) {
      setError(null)
    }
  }, [staff])

  // Handle errors
  const handleError = useCallback((err: any, defaultMessage: string) => {
    const errorMessage = err?.response?.data?.message || err?.message || defaultMessage
    setError(errorMessage)
    
    if (onError) {
      onError(err)
    } else {
      toastError(errorMessage, 'Hata')
    }
  }, [onError, toastError])

  // Handle success
  const handleSuccess = useCallback((data: any, message?: string) => {
    if (onSuccess) {
      onSuccess(data)
    } else if (message) {
      success(message, 'Başarılı')
    }
  }, [onSuccess, success])

  // Fetch staff list
  const fetchStaff = useCallback(async (params?: StaffFilterParams) => {
    try {
      setLoading({ isLoading: true, error: null })
      setError(null)

      const currentFilters = params || filters
      const response = await staffService.getAllStaff({
        ...currentFilters,
        page: pagination.page,
        limit: pagination.limit
      })

      if (response.success && response.data) {
        setStaff(response.data.data)
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages
        })
        handleSuccess(response.data)
      }
    } catch (err: any) {
      handleError(err, 'Personel listesi yüklenirken hata oluştu')
    } finally {
      setLoading({ isLoading: false, error: null })
    }
  }, [filters, pagination.page, pagination.limit, handleError, handleSuccess])

  // Fetch staff by ID
  const fetchStaffById = useCallback(async (id: string | number): Promise<Staff | null> => {
    try {
      setLoading({ isLoading: true, error: null })
      setError(null)

      const response = await staffService.getStaffById(id)

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (err: any) {
      handleError(err, 'Personel bilgileri yüklenirken hata oluştu')
      return null
    } finally {
      setLoading({ isLoading: false, error: null })
    }
  }, [handleError])

  // Refresh staff list
  const refreshStaff = useCallback(async () => {
    await fetchStaff()
  }, [fetchStaff])

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await staffService.getStaffStats()

      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (err: any) {
      handleError(err, 'İstatistikler yüklenirken hata oluştu')
    }
  }, [handleError])

  // Pagination actions
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }))
  }, [])

  const goToNextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      setPage(pagination.page + 1)
    }
  }, [pagination.page, pagination.totalPages, setPage])

  const goToPrevPage = useCallback(() => {
    if (pagination.page > 1) {
      setPage(pagination.page - 1)
    }
  }, [pagination.page, setPage])

  // Selection
  const selectStaff = useCallback((staff: Staff | null) => {
    setSelectedStaff(staff)
  }, [])

  // Filters
  const clearFilters = useCallback(() => {
    setFilters({})
    setSearchQuery('')
  }, [])

  // Search
  const searchStaff = useCallback(async (query: string) => {
    try {
      setLoading({ isLoading: true, error: null })
      setError(null)

      const response = await staffService.searchStaff(query, filters)

      if (response.success && response.data) {
        setStaff(response.data.data)
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages
        })
      }
    } catch (err: any) {
      handleError(err, 'Arama sırasında hata oluştu')
    } finally {
      setLoading({ isLoading: false, error: null })
    }
  }, [filters, handleError])

  // Utility functions
  const getStaffByStatus = useCallback((status: StaffStatus): Staff[] => {
    return staff.filter(s => s.status === status)
  }, [staff])

  const getStaffByDepartment = useCallback((departmentId: string): Staff[] => {
    return staff.filter(s => s.department.id === departmentId)
  }, [staff])

  const getTotalStaffCount = useCallback((): number => {
    return pagination.total
  }, [pagination.total])

  // Auto-fetch on mount and when filters/pagination change
  useEffect(() => {
    if (autoFetch) {
      fetchStaff()
    }
  }, [autoFetch, filters, pagination.page, pagination.limit])

  // Auto-fetch stats on mount
  useEffect(() => {
    if (autoFetch) {
      fetchStats()
    }
  }, [autoFetch, fetchStats])

  return {
    // Data
    staff,
    selectedStaff,
    stats,
    
    // Pagination
    pagination,
    
    // Loading states
    loading,
    isLoading: loading.isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Error states
    error,
    
    // Actions
    fetchStaff,
    fetchStaffById,
    refreshStaff,
    fetchStats,
    
    // Pagination actions
    setPage,
    setLimit,
    goToNextPage,
    goToPrevPage,
    
    // Selection
    selectStaff,
    
    // Filters
    filters,
    setFilters,
    clearFilters,
    
    // Search
    searchQuery,
    setSearchQuery,
    searchStaff,
    
    // Utility
    getStaffByStatus,
    getStaffByDepartment,
    getTotalStaffCount
  }
}

export default useStaff