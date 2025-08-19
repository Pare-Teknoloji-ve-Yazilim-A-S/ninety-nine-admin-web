'use client'

import React, { useState, useEffect } from 'react';
import type { Staff } from '@/services/types/staff.types'
import GenericListView from '@/app/components/templates/GenericListView'
import GenericGridView from '@/app/components/templates/GenericGridView'
import BulkActionsBar from '@/app/components/ui/BulkActionsBar'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Checkbox from '@/app/components/ui/Checkbox'
import TablePagination from '@/app/components/ui/TablePagination'
import Badge from '@/app/components/ui/Badge'
import EmptyState from '@/app/components/ui/EmptyState'
import Skeleton from '@/app/components/ui/Skeleton'
import { getTableColumns } from './table-columns'

// Dil çevirileri
const translations = {
  tr: {
    noStaffRecords: 'Henüz personel kaydı bulunmuyor.',
    noRecordsFound: 'Kayıt bulunamadı.'
  },
  en: {
    noStaffRecords: 'No staff records found yet.',
    noRecordsFound: 'No records found.'
  },
  ar: {
    noStaffRecords: 'لم يتم العثور على سجلات موظفين بعد.',
    noRecordsFound: 'لم يتم العثور على سجلات.'
  }
};

type ViewMode = 'table' | 'grid'

interface ContentAreaProps {
  staff: Staff[]
  totalCount: number
  currentPage: number
  totalPages: number
  pageSize: number
  isLoading?: boolean
  error?: string | null
  searchQuery?: string
  selectedStaff?: string[]
  viewMode: ViewMode
  onSearch: (q: string) => void
  onPageChange: (p: number) => void
  onPageSizeChange: (s: number) => void
  onSelectionChange: (ids: string[]) => void
  onViewModeChange: (m: ViewMode) => void
  onView: (s: Staff) => void
  onEdit: (s: Staff) => void
  onDelete: (s: Staff) => void
  onActivate: (s: Staff) => void
  onDeactivate: (s: Staff) => void
  onBulkAction: (action: string, ids: string[]) => void
}

export default function ContentArea({
  staff,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  isLoading,
  error,
  onSelectionChange,
  onPageChange,
  onPageSizeChange,
  onView,
  onDelete,
  viewMode
}: ContentAreaProps) {
  // Dil tercihini localStorage'dan al
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

  const columns = getTableColumns({ onView })

  const data = Array.isArray(staff) ? staff : []

  return (
    <>
      {/** Table view */}
      {viewMode === 'table' && (
        <GenericListView
          data={data}
          loading={!!isLoading}
          error={error}
          columns={columns as any}
          onSelectionChange={(rows: Staff[]) => onSelectionChange(rows.map(r => String(r.id)))}
          pagination={{
            currentPage,
            totalPages,
            totalRecords: totalCount,
            recordsPerPage: pageSize,
            onPageChange,
            onRecordsPerPageChange: onPageSizeChange,
            recordsPerPageOptions: [5, 10, 20, 30, 40, 50],
            preventScroll: true
          }}
          emptyStateMessage={totalCount === 0 ? t.noStaffRecords : t.noRecordsFound}
          selectable
          showPagination
        />
      )}
      {/** Grid view */}
      {viewMode === 'grid' && (
        <GenericGridView
          data={data}
          loading={!!isLoading}
          error={error}
          onSelectionChange={(ids) => onSelectionChange(ids.map(String) as any)}
          pagination={{
            currentPage,
            totalPages,
            totalRecords: totalCount,
            recordsPerPage: pageSize,
            onPageChange,
            onRecordsPerPageChange: onPageSizeChange,
            preventScroll: true
          }}
          emptyStateMessage={totalCount === 0 ? t.noStaffRecords : t.noRecordsFound}
          ui={{ Card, Button, Checkbox, TablePagination, Badge, EmptyState, Skeleton, BulkActionsBar }}
          renderCard={(item) => (
            <Card className="p-4 rounded-2xl">
              <div className="font-medium">{(item as Staff).firstName} {(item as Staff).lastName}</div>
              <div className="text-sm text-text-light-muted">{(item as Staff).email}</div>
            </Card>
          )}
          getItemId={(item) => (item as Staff).id}
        />
      )}
    </>
  )
}


