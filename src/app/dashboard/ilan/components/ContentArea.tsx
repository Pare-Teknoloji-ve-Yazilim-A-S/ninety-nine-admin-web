'use client'

import GenericListView from '@/app/components/templates/GenericListView'
import GenericGridView from '@/app/components/templates/GenericGridView'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Checkbox from '@/app/components/ui/Checkbox'
import TablePagination from '@/app/components/ui/TablePagination'
import Badge from '@/app/components/ui/Badge'
import EmptyState from '@/app/components/ui/EmptyState'
import Skeleton from '@/app/components/ui/Skeleton'
import BulkActionsBar from '@/app/components/ui/BulkActionsBar'
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
      ui={{ Card, Button, Checkbox, TablePagination, Badge, EmptyState, Skeleton, BulkActionsBar }}
      renderCard={(item) => (
        <Card key={(item as any).id} className="p-4">
          <div className="text-base font-medium">{(item as any).title}</div>
          <div className="text-sm text-text-light-secondary dark:text-text-secondary line-clamp-2">{(item as any).content}</div>
        </Card>
      )}
      getItemId={(item) => (item as any).id}
    />
  )
}


