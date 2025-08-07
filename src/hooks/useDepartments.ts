'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentFilterParams,
  DepartmentListResponse
} from '@/services/types/department.types'
import { ApiResponse, PaginatedResponse } from '@/services/core/types'
import { staffService } from '@/services/staff.service'
import { useToast } from '@/hooks/useToast'

interface UseDepartmentsOptions {
  autoLoad?: boolean
  pageSize?: number
  enableRealtime?: boolean
}

interface UseDepartmentsReturn {
  // Data
  departments: Department[]
  totalCount: number
  
  // Loading states
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  loading: boolean
  
  // Error states
  error: string | null
  
  // Pagination
  currentPage: number
  totalPages: number
  pageSize: number
  
  // Filters
  filters: DepartmentFilterParams
  
  // Actions
  loadDepartments: (page?: number, filters?: DepartmentFilterParams) => Promise<void>
  createDepartment: (data: CreateDepartmentDto) => Promise<Department | null>
  updateDepartment: (id: string, data: UpdateDepartmentDto) => Promise<Department | null>
  deleteDepartment: (id: string) => Promise<boolean>
  getDepartment: (id: string) => Promise<Department | null>
  
  // Bulk operations
  bulkDelete: (ids: (string | number)[]) => Promise<boolean>
  bulkUpdate: (updates: Array<{ id: string | number; data: Partial<UpdateDepartmentDto> }>) => Promise<boolean>
  
  // Pagination
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  setPageSize: (size: number) => void
  
  // Filters
  setFilters: (filters: DepartmentFilterParams) => void
  clearFilters: () => void
  
  // Utility
  refreshDepartments: () => Promise<void>
  findDepartmentById: (id: string) => Department | undefined
  getDepartmentHierarchy: () => Department[]
  getChildDepartments: (parentId: string) => Department[]
  getParentDepartments: (departmentId: string) => Department[]
}

export function useDepartments(options: UseDepartmentsOptions = {}): UseDepartmentsReturn {
  const {
    autoLoad = true,
    pageSize: initialPageSize = 20,
    enableRealtime = false
  } = options

  const { error: toastError, success: toastSuccess } = useToast()

  // State
  const [departments, setDepartments] = useState<Department[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)
  const [filters, setFiltersState] = useState<DepartmentFilterParams>({})

  // Computed values
  const totalPages = Math.ceil(totalCount / pageSize)

  // Load departments
  const loadDepartments = useCallback(async (
    page: number = currentPage,
    filterParams: DepartmentFilterParams = filters
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await staffService.getAllDepartments({
        page,
        limit: pageSize,
        ...filterParams
      })

      if (response.success !== false) {
        setDepartments(response.data)
        setTotalCount(response.total)
        setCurrentPage(page)
      } else {
        throw new Error('Departmanlar yüklenemedi')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toastError(errorMessage, 'Hata')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, filters, pageSize, toastError])

  // Create department
  const createDepartment = useCallback(async (data: CreateDepartmentDto): Promise<Department | null> => {
    try {
      setIsCreating(true)
      setError(null)

      const response = await staffService.createDepartment(data)

      if (response.success) {
        setDepartments(prev => [...prev, response.data])
        setTotalCount(prev => prev + 1)

        toastSuccess('Departman başarıyla oluşturuldu', 'Başarılı')

        return response.data
      } else {
        throw new Error('Departman oluşturulamadı')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toastError(errorMessage, 'Hata')
      return null
    } finally {
      setIsCreating(false)
    }
  }, [toastError, toastSuccess])

  // Update department
  const updateDepartment = useCallback(async (
    id: string,
    data: UpdateDepartmentDto
  ): Promise<Department | null> => {
    try {
      setIsUpdating(true)
      setError(null)

      const response = await staffService.updateDepartment(id, data)

      if (response.success) {
        setDepartments(prev => 
          prev.map(dept => dept.id === id ? response.data : dept)
        )

        toastSuccess('Departman başarıyla güncellendi', 'Başarılı')

        return response.data
      } else {
        throw new Error('Departman güncellenemedi')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toastError(errorMessage, 'Hata')
      return null
    } finally {
      setIsUpdating(false)
    }
  }, [toastError, toastSuccess])

  // Delete department
  const deleteDepartment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsDeleting(true)
      setError(null)

      const response = await staffService.deleteDepartment(id)

      if (response.success) {
        setDepartments(prev => prev.filter(dept => dept.id !== id))
        setTotalCount(prev => prev - 1)

        toastSuccess('Departman başarıyla silindi', 'Başarılı')

        return true
      } else {
        throw new Error('Departman silinemedi')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toastError(errorMessage, 'Hata')
        return false
    } finally {
      setIsDeleting(false)
    }
  }, [toastError, toastSuccess])

  // Get single department
  const getDepartment = useCallback(async (id: string): Promise<Department | null> => {
    try {
      setError(null)

      const response = await staffService.getDepartmentById(id)

      if (response.success) {
        return response.data
      } else {
        throw new Error('Departman bulunamadı')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      return null
    }
  }, [])

  // Bulk operations
  const bulkDelete = useCallback(async (ids: (string | number)[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      setError(null)

      const response = await staffService.bulkDelete(ids)

      if (response.success) {
        // Remove from local state
        setDepartments(prev => prev.filter(dept => !ids.includes(dept.id.toString())))
        setTotalCount(prev => prev - ids.length)

        toastSuccess(`${ids.length} departman başarıyla silindi`, 'Başarılı')

        return true
      } else {
        throw new Error(response.message || 'Departmanlar silinemedi')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toastError(errorMessage, 'Hata')
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [toastError])

  const bulkUpdate = useCallback(async (
    updates: Array<{ id: string | number; data: Partial<UpdateDepartmentDto> }>
  ): Promise<boolean> => {
    try {
      setIsUpdating(true)
      setError(null)

      const response = await staffService.bulkUpdate(updates)

      if (response.success) {
        // Update local state
        setDepartments(prev => 
          prev.map(dept => {
            const update = updates.find(u => u.id === dept.id)
            return update ? { ...dept, ...update.data } : dept
          })
        )

        toastSuccess(`${updates.length} departman başarıyla güncellendi`, 'Başarılı')

        return true
      } else {
        throw new Error(response.message || 'Departmanlar güncellenemedi')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toastError(errorMessage, 'Hata')
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [toastError])

  // Pagination
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadDepartments(page, filters)
    }
  }, [totalPages, loadDepartments, filters])

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }, [currentPage, totalPages, goToPage])

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }, [currentPage, goToPage])

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size)
    setCurrentPage(1)
    loadDepartments(1, filters)
  }, [loadDepartments, filters])

  // Filters
  const setFilters = useCallback((newFilters: DepartmentFilterParams) => {
    setFiltersState(newFilters)
    setCurrentPage(1)
    loadDepartments(1, newFilters)
  }, [loadDepartments])

  const clearFilters = useCallback(() => {
    setFiltersState({})
    setCurrentPage(1)
    loadDepartments(1, {})
  }, [loadDepartments])

  // Utility functions
  const refreshDepartments = useCallback(async () => {
    await loadDepartments(currentPage, filters)
  }, [loadDepartments, currentPage, filters])

  const findDepartmentById = useCallback((id: string): Department | undefined => {
    return departments.find(dept => dept.id === id)
  }, [departments])

  const getDepartmentHierarchy = useCallback((): Department[] => {
    // Build hierarchy tree
    const rootDepartments = departments.filter(dept => !dept.parentDepartmentId)
    const buildHierarchy = (parentId: string | null): Department[] => {
      return departments
        .filter(dept => dept.parentDepartmentId === parentId)
        .map(dept => ({
          ...dept,
          children: buildHierarchy(dept.id.toString())
        }))
    }
    
    return rootDepartments.map(dept => ({
      ...dept,
      children: buildHierarchy(dept.id.toString())
    }))
  }, [departments])

  const getChildDepartments = useCallback((parentId: string): Department[] => {
    return departments.filter(dept => dept.parentDepartmentId === parentId)
  }, [departments])

  const getParentDepartments = useCallback((departmentId: string): Department[] => {
    const parents: Department[] = []
    let currentDept = departments.find(dept => dept.id === departmentId)
    
    while (currentDept && currentDept.parentDepartmentId) {
      const parent = departments.find(dept => dept.id === currentDept!.parentDepartmentId)
      if (parent) {
        parents.unshift(parent)
        currentDept = parent
      } else {
        break
      }
    }
    
    return parents
  }, [departments])

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadDepartments()
    }
  }, []) // Only run on mount

  // Real-time updates (if enabled)
  useEffect(() => {
    if (!enableRealtime) return

    // This would be implemented with WebSocket or Server-Sent Events
    // For now, we'll use polling as a fallback
    const interval = setInterval(() => {
      refreshDepartments()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [enableRealtime, refreshDepartments])

  return {
    // Data
    departments,
    totalCount,
    
    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    loading: isLoading || isCreating || isUpdating || isDeleting,
    
    // Error states
    error,
    
    // Pagination
    currentPage,
    totalPages,
    pageSize,
    
    // Filters
    filters,
    
    // Actions
    loadDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartment,
    
    // Bulk operations
    bulkDelete,
    bulkUpdate,
    
    // Pagination
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    
    // Filters
    setFilters,
    clearFilters,
    
    // Utility
    refreshDepartments,
    findDepartmentById,
    getDepartmentHierarchy,
    getChildDepartments,
    getParentDepartments
  }
}

export default useDepartments