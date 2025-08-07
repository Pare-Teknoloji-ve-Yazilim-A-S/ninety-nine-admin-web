'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Position,
  CreatePositionDto,
  UpdatePositionDto,
  PositionFilterParams,
} from '@/services/types/department.types'
import { ApiResponse, PaginatedResponse } from '@/services/core/types'
import { staffService } from '@/services/staff.service'
import { useToast } from '@/hooks/use-toast'

interface UsePositionsOptions {
  autoLoad?: boolean
  pageSize?: number
  departmentId?: string
  enableRealtime?: boolean
}

interface UsePositionsReturn {
  // Data
  positions: Position[]
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
  filters: PositionFilterParams
  
  // Actions
  loadPositions: (page?: number, filters?: PositionFilterParams) => Promise<void>
  createPosition: (data: CreatePositionDto) => Promise<Position | null>
  updatePosition: (id: string, data: UpdatePositionDto) => Promise<Position | null>
  deletePosition: (id: string) => Promise<boolean>
  getPosition: (id: string) => Promise<Position | null>
  
  // Bulk operations
  bulkDelete: (ids: string[]) => Promise<boolean>
  bulkUpdate: (updates: Array<{ id: string; data: Partial<UpdatePositionDto> }>) => Promise<boolean>
  
  // Pagination
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  setPageSize: (size: number) => void
  
  // Filters
  setFilters: (filters: PositionFilterParams) => void
  clearFilters: () => void
  
  // Utility
  refreshPositions: () => Promise<void>
  findPositionById: (id: string) => Position | undefined
  getPositionsByDepartment: (departmentId: string) => Position[]
  getPositionHierarchy: () => Position[]
  getSubordinatePositions: (positionId: string) => Position[]
  getSuperiorPositions: (positionId: string) => Position[]
}

export function usePositions(options: UsePositionsOptions = {}): UsePositionsReturn {
  const {
    autoLoad = true,
    pageSize: initialPageSize = 20,
    departmentId,
    enableRealtime = false
  } = options

  const { toast } = useToast()

  // State
  const [positions, setPositions] = useState<Position[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)
  const [filters, setFiltersState] = useState<PositionFilterParams>(
    departmentId ? { departmentId } : {}
  )

  // Computed values
  const totalPages = Math.ceil(totalCount / pageSize)

  // Load positions
  const loadPositions = useCallback(async (
    page: number = currentPage,
    filterParams: PositionFilterParams = filters
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await staffService.getAllPositions({
        page,
        limit: pageSize,
        ...filterParams
      })

      if (response.success && response.data) {
        setPositions(response.data.data)
        setTotalCount(response.data.total)
        setCurrentPage(page)
      } else {
        throw new Error(response.message || 'Pozisyonlar yüklenemedi')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toast({
          title: 'Hata',
          description: errorMessage,
          variant: 'destructive'
        })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, filters, pageSize])

  // Create position
  const createPosition = useCallback(async (data: CreatePositionDto): Promise<Position | null> => {
    try {
      setIsCreating(true)
      setError(null)

      const response = await staffService.createPosition(data)

      if (response.success && response.data) {
        // Add to local state
        setPositions(prev => [response.data!, ...prev])
        setTotalCount(prev => prev + 1)

        toast({
          title: 'Başarılı',
          description: 'Pozisyon başarıyla oluşturuldu'
        })

        return response.data
      } else {
        throw new Error(response.message || 'Pozisyon oluşturulamadı')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toast({
          title: 'Hata',
          description: errorMessage,
          variant: 'destructive'
        })
      return null
    } finally {
      setIsCreating(false)
    }
  }, [])

  // Update position
  const updatePosition = useCallback(async (
    id: string,
    data: UpdatePositionDto
  ): Promise<Position | null> => {
    try {
      setIsUpdating(true)
      setError(null)

      const response = await staffService.updatePosition(id, data)

      if (response.success && response.data) {
        // Update local state
        setPositions(prev => 
          prev.map(pos => pos.id === id ? response.data! : pos)
        )

        toast({
          title: 'Başarılı',
          description: 'Pozisyon başarıyla güncellendi'
        })

        return response.data
      } else {
        throw new Error(response.message || 'Pozisyon güncellenemedi')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toast({
        title: 'Hata',
        description: errorMessage,
        variant: 'destructive'
      })
      return null
    } finally {
      setIsUpdating(false)
    }
  }, [])

  // Delete position
  const deletePosition = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsDeleting(true)
      setError(null)

      const response = await staffService.deletePosition(id)

      if (response.success) {
        // Remove from local state
        setPositions(prev => prev.filter(pos => pos.id !== id))
        setTotalCount(prev => prev - 1)

        toast({
          title: 'Başarılı',
          description: 'Pozisyon başarıyla silindi'
        })

        return true
      } else {
        throw new Error(response.message || 'Pozisyon silinemedi')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toast({
        title: 'Hata',
        description: errorMessage,
        variant: 'destructive'
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [])

  // Get single position
  const getPosition = useCallback(async (id: string): Promise<Position | null> => {
    try {
      setError(null)

      const response = await staffService.getPositionById(id)

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Pozisyon bulunamadı')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      return null
    }
  }, [])

  // Bulk operations
  const bulkDelete = useCallback(async (ids: string[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      setError(null)

      const response = await staffService.bulkDelete(ids)

      if (response.success) {
        // Remove from local state
        setPositions(prev => prev.filter(pos => !ids.includes(pos.id.toString())))
        setTotalCount(prev => prev - ids.length)

        toast({
          title: 'Başarılı',
          description: `${ids.length} pozisyon başarıyla silindi`
        })

        return true
      } else {
        throw new Error(response.message || 'Pozisyonlar silinemedi')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toast({
        title: 'Hata',
        description: errorMessage,
        variant: 'destructive'
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [])

  const bulkUpdate = useCallback(async (
    updates: Array<{ id: string; data: Partial<UpdatePositionDto> }>
  ): Promise<boolean> => {
    try {
      setIsUpdating(true)
      setError(null)

      const response = await staffService.bulkUpdate(updates)

      if (response.success) {
        // Update local state
        setPositions(prev => 
          prev.map(pos => {
            const update = updates.find(u => u.id === pos.id)
            return update ? { ...pos, ...update.data } : pos
          })
        )

        toast({
          title: 'Başarılı',
          description: `${updates.length} pozisyon başarıyla güncellendi`
        })

        return true
      } else {
        throw new Error(response.message || 'Pozisyonlar güncellenemedi')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(errorMessage)
      toast({
        title: 'Hata',
        description: errorMessage,
        variant: 'destructive'
      })
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [])

  // Pagination
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadPositions(page, filters)
    }
  }, [totalPages, loadPositions, filters])

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
    loadPositions(1, filters)
  }, [loadPositions, filters])

  // Filters
  const setFilters = useCallback((newFilters: PositionFilterParams) => {
    setFiltersState(newFilters)
    setCurrentPage(1)
    loadPositions(1, newFilters)
  }, [loadPositions])

  const clearFilters = useCallback(() => {
    const baseFilters = departmentId ? { departmentId } : {}
    setFiltersState(baseFilters)
    setCurrentPage(1)
    loadPositions(1, baseFilters)
  }, [loadPositions, departmentId])

  // Utility functions
  const refreshPositions = useCallback(async () => {
    await loadPositions(currentPage, filters)
  }, [loadPositions, currentPage, filters])

  const findPositionById = useCallback((id: string): Position | undefined => {
    return positions.find(pos => pos.id === id)
  }, [positions])

  const getPositionsByDepartment = useCallback((deptId: string): Position[] => {
    return positions.filter(pos => pos.departmentId === deptId)
  }, [positions])

  const getPositionHierarchy = useCallback((): Position[] => {
    // Build hierarchy tree based on reporting relationships
    const rootPositions = positions.filter(pos => !pos.reportsToPositionId)
    const buildHierarchy = (managerId: string | null): Position[] => {
      return positions
        .filter(pos => pos.reportsToPositionId === managerId)
        .map(pos => ({
          ...pos,
          subordinates: buildHierarchy(pos.id.toString())
        }))
    }
    
    return rootPositions.map(pos => ({
      ...pos,
      subordinates: buildHierarchy(pos.id.toString())
    }))
  }, [positions])

  const getSubordinatePositions = useCallback((positionId: string): Position[] => {
    return positions.filter(pos => pos.reportsToPositionId === positionId)
  }, [positions])

  const getSuperiorPositions = useCallback((positionId: string): Position[] => {
    const superiors: Position[] = []
    let currentPos = positions.find(pos => pos.id === positionId)
    
    while (currentPos && currentPos.reportsToPositionId) {
      const superior = positions.find(pos => pos.id === currentPos!.reportsToPositionId)
      if (superior) {
        superiors.unshift(superior)
        currentPos = superior
      } else {
        break
      }
    }
    
    return superiors
  }, [positions])

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadPositions()
    }
  }, []) // Only run on mount

  // Update filters when departmentId changes
  useEffect(() => {
    if (departmentId) {
      setFiltersState(prev => ({ ...prev, departmentId }))
      if (autoLoad) {
        loadPositions(1, { ...filters, departmentId })
      }
    }
  }, [departmentId]) // Only run when departmentId changes

  // Real-time updates (if enabled)
  useEffect(() => {
    if (!enableRealtime) return

    // This would be implemented with WebSocket or Server-Sent Events
    // For now, we'll use polling as a fallback
    const interval = setInterval(() => {
      refreshPositions()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [enableRealtime, refreshPositions])

  return {
    // Data
    positions,
    totalCount,
    
    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    loading: isLoading,
    
    // Error states
    error,
    
    // Pagination
    currentPage,
    totalPages,
    pageSize,
    
    // Filters
    filters,
    
    // Actions
    loadPositions,
    createPosition,
    updatePosition,
    deletePosition,
    getPosition,
    
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
    refreshPositions,
    findPositionById,
    getPositionsByDepartment,
    getPositionHierarchy,
    getSubordinatePositions,
    getSuperiorPositions
  }
}

export default usePositions