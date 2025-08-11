'use client'

import { useMemo, useRef } from 'react'
import type { Announcement } from '@/services/types/announcement.types'
import { useModuleUI } from './useModuleUI'
import { useModuleData } from './useModuleData'

export interface ModulePageViewModel<T = Announcement> {
  ui: ReturnType<typeof useModuleUI>
  data: ReturnType<typeof useModuleData>
  refs: {
    importInputRef: React.RefObject<HTMLInputElement>
  }
  actions: {
    applyQuickFilter: (key: string) => void
    openFilters: () => void
    closeFilters: () => void
  }
  quickStats: Array<{ label: string; value: number }>
}

export function useModulePageViewModel() : ModulePageViewModel {
  const ui = useModuleUI<'createdAt' | 'title' | 'status'>()
  const data = useModuleData({
    page: 1,
    limit: 20,
    search: ui.filters.search as string,
    sort: { key: ui.sortConfig.field as any, direction: ui.sortConfig.direction.toLowerCase() as any },
    filters: ui.filters,
  })

  const importInputRef = useRef<HTMLInputElement>(null)

  const quickStats = useMemo(() => {
    const total = data.pagination.total
    const published = (data.data || []).filter(a => a.status === 'PUBLISHED').length
    const draft = (data.data || []).filter(a => a.status === 'DRAFT').length
    return [
      { label: 'Toplam Duyuru', value: total },
      { label: 'Yayında', value: published },
      { label: 'Taslak', value: draft },
    ]
  }, [data.data, data.pagination.total])

  const applyQuickFilter = (key: string) => {
    const map: Record<string, any> = {
      published: { status: 'PUBLISHED' },
      draft: { status: 'DRAFT' },
      archived: { status: 'ARCHIVED' },
      emergency: { isEmergency: true },
      pinned: { isPinned: true }
    }
    const f = map[key]
    if (!f) return
    ui.updateFilter('status', undefined) // clear before applying
    Object.entries(f).forEach(([k, v]) => ui.updateFilter(k, v))
    data.refetch()
  }

  const openFilters = () => ui.updateFilter('__drawer', true)
  const closeFilters = () => ui.updateFilter('__drawer', false)

  return {
    ui,
    data,
    refs: { importInputRef },
    actions: { applyQuickFilter, openFilters, closeFilters },
    quickStats
  }
}


