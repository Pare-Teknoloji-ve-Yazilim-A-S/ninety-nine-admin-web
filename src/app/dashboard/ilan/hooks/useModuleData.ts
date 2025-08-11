'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Announcement, AnnouncementFilterParams, AnnouncementSortConfig } from '@/services/types/announcement.types'
import { announcementService } from '@/services'

interface UseModuleDataProps {
  page?: number
  limit?: number
  search?: string
  sort?: AnnouncementSortConfig
  filters?: Record<string, any>
}

export function useModuleData({ page = 1, limit = 20, search = '', sort, filters = {} }: UseModuleDataProps = {}) {
  const [data, setData] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ page, limit, total: 0, totalPages: 0 })

  const fetchData = useCallback(async (override: Partial<UseModuleDataProps> = {}) => {
    setLoading(true)
    setError(null)
    try {
      const currentPage = override.page ?? pagination.page
      const currentLimit = override.limit ?? pagination.limit
      const currentSearch = override.search ?? search
      const currentSort = override.sort ?? sort
      const currentFilters = override.filters ?? filters

      const params: AnnouncementFilterParams = {
        page: currentPage,
        limit: currentLimit,
        search: currentSearch || undefined,
        orderColumn: (currentSort?.key as any) || 'createdAt',
        orderBy: (currentSort?.direction?.toUpperCase?.() as any) || 'DESC',
        ...currentFilters
      }

      Object.keys(params).forEach((k) => {
        const v = (params as any)[k]
        if (v === undefined || v === null || v === '') delete (params as any)[k]
      })

      const response = currentSearch
        ? await announcementService.searchAnnouncements(currentSearch, params)
        : await announcementService.getAllAnnouncements(params)

      setData(response.data || [])
      setPagination((prev) => ({
        page: currentPage,
        limit: currentLimit,
        total: response.total || 0,
        totalPages: response.totalPages || 0,
      }))
    } catch (err: any) {
      setError(err?.message || 'Veri yüklenirken hata oluştu')
      setData([])
      setPagination((prev) => ({ ...prev, total: 0, totalPages: 0 }))
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, search, sort, filters])

  const refetch = useCallback(async () => fetchData(), [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, pagination, fetchData, refetch, setData }
}

export type UseModuleDataReturn = ReturnType<typeof useModuleData>


