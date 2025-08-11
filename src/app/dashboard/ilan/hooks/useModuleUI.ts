'use client'

import { useCallback, useState } from 'react'

export type ViewMode = 'table' | 'grid'

export interface SortConfig<TField extends string = string> {
  field: TField
  direction: 'ASC' | 'DESC'
}

export interface FilterParams {
  search?: string
  status?: string | string[]
  type?: string | string[]
  startDate?: string
  endDate?: string
  [key: string]: any
}

export function useModuleUI<TField extends string = string>() {
  const [filters, setFilters] = useState<FilterParams>({})
  const [selectedItems, setSelectedItems] = useState<Array<string | number>>([])
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [sortConfig, setSortConfig] = useState<SortConfig<TField>>({
    field: 'createdAt' as TField,
    direction: 'DESC'
  })

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({})
  }, [])

  return {
    filters,
    selectedItems,
    viewMode,
    sortConfig,
    updateFilter,
    resetFilters,
    setSelectedItems,
    setViewMode,
    setSortConfig
  }
}

export type UseModuleUIReturn = ReturnType<typeof useModuleUI>


