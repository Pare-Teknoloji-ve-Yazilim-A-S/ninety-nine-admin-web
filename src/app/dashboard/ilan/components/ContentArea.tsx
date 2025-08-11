'use client'

import GenericListView from '@/app/components/templates/GenericListView'
import GenericGridView from '@/app/components/templates/GenericGridView'
import type { Announcement } from '@/services/types/announcement.types'
import type { ViewMode } from '../hooks/useModuleUI'

interface ContentAreaProps {
  data: Announcement[]
  loading: boolean
  error: string | null
  viewMode: ViewMode
  pagination: { page: number; totalPages: number; total: number; limit: number }
  onPageChange: (p: number) => void
  onPageSizeChange: (s: number) => void
}

export default function ContentArea({ data, loading, error, viewMode, pagination, onPageChange, onPageSizeChange }: ContentAreaProps) {
  if (viewMode === 'table') {
    return (
      <GenericListView
        data={data}
        loading={loading}
        error={error || undefined}
        columns={[]}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalRecords: pagination.total,
          recordsPerPage: pagination.limit,
          onPageChange,
          onRecordsPerPageChange: onPageSizeChange,
        }}
      />
    )
  }

  return (
    <GenericGridView
      data={data}
      loading={loading}
      error={error || undefined}
      selectedItems={[]}
      onSelectionChange={() => {}}
      bulkActions={[]}
      pagination={{
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        totalRecords: pagination.total,
        recordsPerPage: pagination.limit,
        onPageChange,
        onRecordsPerPageChange: onPageSizeChange,
      }}
    />
  )
}


