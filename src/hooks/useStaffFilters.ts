'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { StaffStatus, EmploymentType, StaffFilterParams } from '@/services/types/staff.types'
import { Department, Position } from '@/services/types/department.types'
import { FilterOption, QuickFilter, SavedFilter, FilterGroup } from '@/services/types/ui.types'
import { staffService } from '@/services/staff.service'
import { enumsService } from '@/services/enums.service'
import { getStaffStatusConfig, getEmploymentTypeConfig } from '@/services/types/ui.types'

interface UseStaffFiltersOptions {
  initialFilters?: StaffFilterParams
  autoApply?: boolean
  onFiltersChange?: (filters: StaffFilterParams) => void
  enableSavedFilters?: boolean
}

interface UseStaffFiltersReturn {
  // Current filters
  filters: StaffFilterParams
  activeFiltersCount: number
  hasActiveFilters: boolean
  
  // Filter options
  statusOptions: FilterOption<StaffStatus>[]
  employmentTypeOptions: FilterOption<EmploymentType>[]
  departmentOptions: FilterOption<string>[]
  positionOptions: FilterOption<string>[]
  
  // Filter groups configuration
  filterGroups: FilterGroup[]
  quickFilters: QuickFilter[]
  
  // Actions
  setFilter: (key: keyof StaffFilterParams, value: any) => void
  setFilters: (filters: Partial<StaffFilterParams>) => void
  clearFilter: (key: keyof StaffFilterParams) => void
  clearAllFilters: () => void
  resetFilters: () => void
  
  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // Date filters
  setDateRange: (startDate: string | null, endDate: string | null) => void
  setHireDateRange: (startDate: string | null, endDate: string | null) => void
  
  // Quick filters
  applyQuickFilter: (filterKey: string) => void
  
  // Saved filters
  savedFilters: SavedFilter[]
  saveCurrentFilters: (name: string) => void
  applySavedFilter: (filterId: string) => void
  deleteSavedFilter: (filterId: string) => void
  
  // Utility
  getFilterSummary: () => string
  exportFilters: () => string
  importFilters: (filtersJson: string) => boolean
}

export function useStaffFilters(options: UseStaffFiltersOptions = {}): UseStaffFiltersReturn {
  const {
    initialFilters = {},
    autoApply = true,
    onFiltersChange,
    enableSavedFilters = true
  } = options

  // State
  const [filters, setFiltersState] = useState<StaffFilterParams>(initialFilters)
  const [searchQuery, setSearchQuery] = useState('')
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [appEnums, setAppEnums] = useState<Record<string, any> | null>(null)

  // Load departments and positions
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [deptResponse, posResponse] = await Promise.all([
          staffService.getAllDepartments(),
          staffService.getAllPositions()
        ])
        
        if (deptResponse.success && deptResponse.data) {
          setDepartments(deptResponse.data.data)
        }
        
        if (posResponse.success && posResponse.data) {
          setPositions(posResponse.data.data)
        }
      } catch (error) {
        console.error('Failed to load filter options:', error)
      }
    }
    
    loadOptions()
  }, [])

  // Load enums from localStorage if available
  useEffect(() => {
    const cached = enumsService.getFromCache()
    if (cached) setAppEnums(cached)
  }, [])

  // Load saved filters from localStorage
  useEffect(() => {
    if (enableSavedFilters) {
      const saved = localStorage.getItem('staff-saved-filters')
      if (saved) {
        try {
          setSavedFilters(JSON.parse(saved))
        } catch (error) {
          console.error('Failed to load saved filters:', error)
        }
      }
    }
  }, [enableSavedFilters])

  // Filter options
  const statusOptions: FilterOption<StaffStatus>[] = useMemo(() => {
    // Dil tercihini localStorage'dan al
    const currentLanguage = typeof window !== 'undefined' ? localStorage.getItem('preferredLanguage') || 'tr' : 'tr';
    const staffStatusConfig = getStaffStatusConfig(currentLanguage);
    
    const codes = (appEnums?.staff?.staffStatus as string[] | undefined)
    if (codes && codes.length > 0) {
      return codes.map((code) => ({ 
        label: staffStatusConfig[code as StaffStatus]?.label || code, 
        value: (StaffStatus as any)[code] ?? code 
      })) as FilterOption<StaffStatus>[]
    }
    return Object.entries(staffStatusConfig).map(([key, config]) => ({
      label: config.label,
      value: key as StaffStatus
    }))
  }, [appEnums])

  const employmentTypeOptions: FilterOption<EmploymentType>[] = useMemo(() => {
    // Dil tercihini localStorage'dan al
    const currentLanguage = typeof window !== 'undefined' ? localStorage.getItem('preferredLanguage') || 'tr' : 'tr';
    const employmentTypeConfig = getEmploymentTypeConfig(currentLanguage);
    
    const codes = (appEnums?.staff?.employmentType as string[] | undefined)
    if (codes && codes.length > 0) {
      return codes.map((code) => ({ 
        label: employmentTypeConfig[code as EmploymentType]?.label || code, 
        value: (EmploymentType as any)[code] ?? code 
      })) as FilterOption<EmploymentType>[]
    }
    return Object.entries(employmentTypeConfig).map(([key, config]) => ({
      label: config.label,
      value: key as EmploymentType
    }))
  }, [appEnums])

  const departmentOptions: FilterOption<string>[] = useMemo(() => 
    departments.map(dept => ({
      label: dept.name,
      value: String(dept.id)
    }))
  , [departments])

  const positionOptions: FilterOption<string>[] = useMemo(() => 
    positions.map(pos => ({
      label: pos.title,
      value: String(pos.id)
    }))
  , [positions])

  // Filter groups configuration
  const filterGroups: FilterGroup[] = useMemo(() => [
    {
      key: 'status',
      label: 'Durum',
      type: 'multiselect',
      options: statusOptions,
      clearable: true
    },
    {
      key: 'employmentType',
      label: 'İstihdam Türü',
      type: 'multiselect',
      options: employmentTypeOptions,
      clearable: true
    },
    {
      key: 'departmentId',
      label: 'Departman',
      type: 'multiselect',
      options: departmentOptions,
      clearable: true,
      searchable: true
    },
    {
      key: 'positionId',
      label: 'Pozisyon',
      type: 'multiselect',
      options: positionOptions,
      clearable: true,
      searchable: true
    },
    {
      key: 'hireDate',
      label: 'İşe Başlama Tarihi',
      type: 'daterange',
      clearable: true
    },
    {
      key: 'salary',
      label: 'Maaş Aralığı',
      type: 'number',
      clearable: true
    }
  ], [statusOptions, employmentTypeOptions, departmentOptions, positionOptions])

  // Quick filters
  const quickFilters: QuickFilter[] = useMemo(() => [
    {
      key: 'active',
      label: 'Aktif Personel',
      icon: '✅',
      filters: { status: [StaffStatus.ACTIVE] }
    },
    {
      key: 'inactive',
      label: 'Pasif Personel',
      icon: '❌',
      filters: { status: [StaffStatus.INACTIVE] }
    },
    {
      key: 'onLeave',
      label: 'İzinli Personel',
      icon: '🏖️',
      filters: { status: [StaffStatus.ON_LEAVE] }
    },
    {
      key: 'fullTime',
      label: 'Tam Zamanlı',
      icon: '⏰',
      filters: { employmentType: [EmploymentType.FULL_TIME] }
    },
    {
      key: 'newHires',
      label: 'Yeni İşe Alınanlar',
      icon: '🆕',
      filters: {
        startDateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    },
    {
      key: 'managers',
      label: 'Yöneticiler',
      icon: '👔',
      filters: { isManager: true }
    }
  ], [])

  // Computed values
  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof StaffFilterParams]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== undefined && value !== null && value !== ''
    }).length
  }, [filters])

  const hasActiveFilters = activeFiltersCount > 0

  // Actions
  const setFilter = useCallback((key: keyof StaffFilterParams, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFiltersState(newFilters)
    
    if (autoApply && onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }, [filters, autoApply, onFiltersChange])

  const setFilters = useCallback((newFilters: Partial<StaffFilterParams>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFiltersState(updatedFilters)
    
    if (autoApply && onFiltersChange) {
      onFiltersChange(updatedFilters)
    }
  }, [filters, autoApply, onFiltersChange])

  const clearFilter = useCallback((key: keyof StaffFilterParams) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFiltersState(newFilters)
    
    if (autoApply && onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }, [filters, autoApply, onFiltersChange])

  const clearAllFilters = useCallback(() => {
    setFiltersState({})
    setSearchQuery('')
    
    if (autoApply && onFiltersChange) {
      onFiltersChange({})
    }
  }, [autoApply, onFiltersChange])

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters)
    setSearchQuery('')
    
    if (autoApply && onFiltersChange) {
      onFiltersChange(initialFilters)
    }
  }, [initialFilters, autoApply, onFiltersChange])

  // Date filters
  const setDateRange = useCallback((startDate: string | null, endDate: string | null) => {
    const newFilters = { ...filters }
    if (startDate) {
      newFilters.startDateFrom = startDate
    } else {
      delete newFilters.startDateFrom
    }
    if (endDate) {
      newFilters.startDateTo = endDate
    } else {
      delete newFilters.startDateTo
    }
    
    setFiltersState(newFilters)
    
    if (autoApply && onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }, [filters, autoApply, onFiltersChange])

  const setHireDateRange = useCallback((startDate: string | null, endDate: string | null) => {
    const newFilters = { ...filters }
    if (startDate) {
      newFilters.startDateFrom = startDate
    } else {
      delete newFilters.startDateFrom
    }
    if (endDate) {
      newFilters.startDateTo = endDate
    } else {
      delete newFilters.startDateTo
    }
    
    setFiltersState(newFilters)
    
    if (autoApply && onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }, [filters, autoApply, onFiltersChange])

  // Quick filters
  const applyQuickFilter = useCallback((filterKey: string) => {
    const quickFilter = quickFilters.find(qf => qf.key === filterKey)
    if (quickFilter) {
      setFilters(quickFilter.filters)
    }
  }, [quickFilters, setFilters])

  // Saved filters
  const saveCurrentFilters = useCallback((name: string) => {
    if (!enableSavedFilters) return
    
    const newSavedFilter: SavedFilter = {
      id: Date.now().toString(),
      name,
      filters,
      createdBy: 'current-user', // This should come from auth context
      createdAt: new Date().toISOString()
    }
    
    const updatedSavedFilters = [...savedFilters, newSavedFilter]
    setSavedFilters(updatedSavedFilters)
    localStorage.setItem('staff-saved-filters', JSON.stringify(updatedSavedFilters))
  }, [enableSavedFilters, filters, savedFilters])

  const applySavedFilter = useCallback((filterId: string) => {
    const savedFilter = savedFilters.find(sf => sf.id === filterId)
    if (savedFilter) {
      setFilters(savedFilter.filters)
    }
  }, [savedFilters, setFilters])

  const deleteSavedFilter = useCallback((filterId: string) => {
    if (!enableSavedFilters) return
    
    const updatedSavedFilters = savedFilters.filter(sf => sf.id !== filterId)
    setSavedFilters(updatedSavedFilters)
    localStorage.setItem('staff-saved-filters', JSON.stringify(updatedSavedFilters))
  }, [enableSavedFilters, savedFilters])

  // Utility functions
  const getFilterSummary = useCallback((): string => {
    const summaryParts: string[] = []
    
    if (filters.status && filters.status.length > 0) {
      const statusLabels = filters.status.map(status => 
        statusOptions.find(opt => opt.value === status)?.label || status
      )
      summaryParts.push(`Durum: ${statusLabels.join(', ')}`)
    }
    
    if (filters.departmentId && filters.departmentId.length > 0) {
      const deptLabels = filters.departmentId.map(deptId => 
        departmentOptions.find(opt => opt.value === deptId)?.label || deptId
      )
      summaryParts.push(`Departman: ${deptLabels.join(', ')}`)
    }
    
    if (filters.employmentType && filters.employmentType.length > 0) {
      const typeLabels = filters.employmentType.map(type => 
        employmentTypeOptions.find(opt => opt.value === type)?.label || type
      )
      summaryParts.push(`İstihdam Türü: ${typeLabels.join(', ')}`)
    }
    
    if (filters.startDateFrom || filters.startDateTo) {
      const from = filters.startDateFrom ? new Date(filters.startDateFrom).toLocaleDateString('tr-TR') : ''
      const to = filters.startDateTo ? new Date(filters.startDateTo).toLocaleDateString('tr-TR') : ''
      summaryParts.push(`İşe Başlama: ${from} - ${to}`)
    }
    
    return summaryParts.join(' | ') || 'Filtre yok'
  }, [filters, statusOptions, departmentOptions, employmentTypeOptions])

  const exportFilters = useCallback((): string => {
    return JSON.stringify(filters, null, 2)
  }, [filters])

  const importFilters = useCallback((filtersJson: string): boolean => {
    try {
      const importedFilters = JSON.parse(filtersJson)
      setFilters(importedFilters)
      return true
    } catch (error) {
      console.error('Failed to import filters:', error)
      return false
    }
  }, [setFilters])

  return {
    // Current filters
    filters,
    activeFiltersCount,
    hasActiveFilters,
    
    // Filter options
    statusOptions,
    employmentTypeOptions,
    departmentOptions,
    positionOptions,
    
    // Filter groups configuration
    filterGroups,
    quickFilters,
    
    // Actions
    setFilter,
    setFilters,
    clearFilter,
    clearAllFilters,
    resetFilters,
    
    // Search
    searchQuery,
    setSearchQuery,
    
    // Date filters
    setDateRange,
    setHireDateRange,
    
    // Quick filters
    applyQuickFilter,
    
    // Saved filters
    savedFilters,
    saveCurrentFilters,
    applySavedFilter,
    deleteSavedFilter,
    
    // Utility
    getFilterSummary,
    exportFilters,
    importFilters
  }
}

export default useStaffFilters