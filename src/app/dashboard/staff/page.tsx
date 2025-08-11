'use client'

import { useMemo, useRef, useState } from 'react'
import { Plus, RefreshCw, Settings } from 'lucide-react'
import Button from '@/app/components/ui/Button'
import Modal from '@/app/components/ui/Modal'
import { StaffList, StaffForm, StaffStats, StaffFilters } from '@/components/staff'
import { useStaff, useStaffActions, useDepartments, usePositions } from '@/hooks'
import type { Staff } from '@/services/types/staff.types'
import { StaffStatus } from '@/services/types/staff.types'
import type { QuickFilter, SavedFilter } from '@/services/types/ui.types'
import { useRouter } from 'next/navigation'

function StaffPage () {
  const router = useRouter()
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const {
    staff,
    loading: staffLoading,
    isLoading: staffIsLoading,
    error: staffError,
    stats,
    pagination: staffPagination,
    filters: staffFilters,
    searchQuery: staffSearchQuery,
    setPage: setStaffPage,
    setLimit,
    setFilters: setStaffFilters,
    setSearchQuery: setStaffSearchQuery,
    refreshStaff
  } = useStaff()

  const {
    createStaff,
    updateStaff,
    deleteStaff,
    activateStaff,
    deactivateStaff,
    bulkUpdateStaffStatus,
    bulkDeleteStaff,
    exportStaff,
    importStaff,
    loading: actionsLoading
  } = useStaffActions()

  const {
    departments,
    loading: departmentsLoading,
  } = useDepartments()

  const {
    positions,
    loading: positionsLoading,
  } = usePositions()

  const handleCreateStaff = async (data: any) => {
    const success = await createStaff(data)
    if (success) {
      setIsStaffFormOpen(false)
      refreshStaff()
    }
  }

  const handleUpdateStaff = async (data: any) => {
    if (!editingStaff) return
    const success = await updateStaff(editingStaff.id, data)
    if (success) {
      setIsStaffFormOpen(false)
      setEditingStaff(null)
      refreshStaff()
    }
  }

  const handleEditStaff = (staff: Staff) => {
    setEditingStaff(staff)
    setIsStaffFormOpen(true)
  }

  const handleDeleteStaff = async (staff: Staff) => {
    const success = await deleteStaff(staff.id)
    if (success) {
      refreshStaff()
    }
  }

  const handleFormClose = () => {
    setIsStaffFormOpen(false)
    setEditingStaff(null)
  }

  const handleViewStaff = (record: Staff) => {
    router.push(`/dashboard/staff/${record.id}`)
  }

  const handleActivate = async (record: Staff) => {
    await activateStaff(record.id)
    refreshStaff()
  }

  const handleDeactivate = async (record: Staff) => {
    await deactivateStaff(record.id)
    refreshStaff()
  }

  const handleBulkAction = async (action: string, ids: string[]) => {
    if (ids.length === 0) return
    switch (action) {
      case 'activate':
        await bulkUpdateStaffStatus({ staffIds: ids, operation: 'update', data: { status: StaffStatus.ACTIVE } })
        break
      case 'deactivate':
        await bulkUpdateStaffStatus({ staffIds: ids, operation: 'update', data: { status: StaffStatus.INACTIVE } })
        break
      case 'delete':
        await bulkDeleteStaff(ids)
        break
      default:
        break
    }
    setSelectedStaffIds([])
    refreshStaff()
  }

  const handleExport = async () => {
    const blob = await exportStaff(staffFilters)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'personel-listesi.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await importStaff(file)
      refreshStaff()
      e.target.value = ''
    }
  }

  // Header counts
  const totalStaffCount = stats?.total ?? staffPagination.total ?? staff.length
  const activeCount = stats?.byStatus?.ACTIVE ?? 0
  const inactiveCount = stats?.byStatus?.INACTIVE ?? 0
  const onLeaveCount = stats?.byStatus?.ON_LEAVE ?? 0
  const suspendedCount = stats?.byStatus?.SUSPENDED ?? 0
  const terminatedCount = stats?.byStatus?.TERMINATED ?? 0
  const activeRate = totalStaffCount > 0 ? Math.round((activeCount / totalStaffCount) * 100) : 0

  const quickFilters: QuickFilter[] = useMemo(() => [
    { key: 'active', label: 'Aktif', count: activeCount },
    { key: 'inactive', label: 'Pasif', count: inactiveCount },
    { key: 'on_leave', label: 'İzinli', count: onLeaveCount },
  ], [activeCount, inactiveCount, onLeaveCount])

  const savedFilters: SavedFilter[] = []

  return (
    <div className="space-y-6">
      {/* Page Header with Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
            Personel Yönetimi <span className="text-primary-gold">({totalStaffCount.toLocaleString()} kişi)</span>
          </h2>
          <p className="text-text-light-secondary dark:text-text-secondary">
            Aktif: {activeCount} ({activeRate}%) | Pasif: {inactiveCount} | İzinli: {onLeaveCount} | Askıda: {suspendedCount} | Ayrılan: {terminatedCount}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="md" icon={RefreshCw} onClick={refreshStaff}>
            Yenile
          </Button>
          <Button variant="primary" size="md" icon={Settings} onClick={() => router.push('/settings/user-management')}>
            Rol Ayarları
          </Button>
        </div>
      </div>

      {/* Modal: Create/Edit Staff */}
      <Modal
        isOpen={isStaffFormOpen}
        onClose={handleFormClose}
        title={editingStaff ? 'Personel Düzenle' : 'Yeni Personel Ekle'}
        size="lg"
      >
        <StaffForm
          staff={editingStaff as Staff}
          departments={departments}
          positions={positions}
          managers={staff.filter(s => s.id !== editingStaff?.id)}
          onSubmit={editingStaff ? handleUpdateStaff : handleCreateStaff}
          onCancel={handleFormClose}
          isLoading={actionsLoading}
        />
      </Modal>

      {/* Stats */}
      <StaffStats stats={{
        total: staff.length,
        byStatus: staff.reduce((acc, s) => {
          acc[s.status] = (acc[s.status] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        byEmploymentType: staff.reduce((acc, s) => {
          acc[s.employmentType] = (acc[s.employmentType] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        departmentCount: departments.length,
        averageSalary: staff.reduce((sum, s) => sum + (s.salary || 0), 0) / (staff.length || 1)
      }} />

      {/* Main Content: Filters + List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StaffFilters
            filters={staffFilters}
            departments={departments}
            positions={positions}
            quickFilters={quickFilters}
            savedFilters={savedFilters}
            onFiltersChange={setStaffFilters}
            onQuickFilterApply={(key) => {
              switch (key) {
                case 'active':
                  setStaffFilters({ ...staffFilters, status: [StaffStatus.ACTIVE] })
                  break
                case 'inactive':
                  setStaffFilters({ ...staffFilters, status: [StaffStatus.INACTIVE] })
                  break
                case 'on_leave':
                  setStaffFilters({ ...staffFilters, status: [StaffStatus.ON_LEAVE] })
                  break
                default:
                  break
              }
            }}
            onSaveFilter={() => { /* no-op for now */ }}
            onDeleteSavedFilter={() => { /* no-op for now */ }}
            onExportFilters={handleExport}
            onImportFilters={() => { /* handled via hidden input */ }}
            onReset={() => setStaffFilters({})}
          />
        </div>
        <div className="lg:col-span-2">
          <StaffList
            staff={staff}
            totalCount={staffPagination.total}
            currentPage={staffPagination.page}
            totalPages={staffPagination.totalPages}
            pageSize={staffPagination.limit}
            isLoading={staffIsLoading}
            error={staffError}
            searchQuery={staffSearchQuery}
            selectedStaff={selectedStaffIds}
            viewMode={viewMode}
            onSearch={setStaffSearchQuery}
            onPageChange={setStaffPage}
            onPageSizeChange={(size) => setLimit(size)}
            onSelectionChange={setSelectedStaffIds}
            onViewModeChange={setViewMode}
            onView={handleViewStaff}
            onEdit={handleEditStaff}
            onDelete={handleDeleteStaff}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onBulkAction={handleBulkAction}
            onExport={handleExport}
            onImport={handleImportClick}
            onRefresh={refreshStaff}
            onCreateNew={() => setIsStaffFormOpen(true)}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, application/json"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>
      </div>
    </div>
  )
}

export default StaffPage


