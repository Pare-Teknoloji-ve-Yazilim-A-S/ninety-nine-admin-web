'use client'

import StaffList from '@/components/staff/StaffList'
import type { Staff } from '@/services/types/staff.types'

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
  onExport: () => void
  onImport: () => void
  onRefresh: () => void
  onCreateNew: () => void
}

export default function ContentArea(props: ContentAreaProps) {
  return (
    <StaffList
      {...props}
      showSearchBar={false}
      showViewToggle={false}
    />
  )
}


