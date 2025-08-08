'use client'

import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Modal from '@/app/components/ui/Modal'
import { StaffList, StaffForm, StaffStats } from '@/components/staff'
import { useStaff, useStaffActions, useDepartments, usePositions } from '@/hooks'
import type { Staff } from '@/services/types/staff.types'

function StaffPage () {
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

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
    setFilters: setStaffFilters,
    setSearchQuery: setStaffSearchQuery,
    refreshStaff
  } = useStaff()

  const {
    createStaff,
    updateStaff,
    deleteStaff,
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

  // Header counts
  const totalStaffCount = stats?.total ?? staffPagination.total ?? staff.length
  const activeCount = stats?.byStatus?.ACTIVE ?? 0
  const inactiveCount = stats?.byStatus?.INACTIVE ?? 0
  const onLeaveCount = stats?.byStatus?.ON_LEAVE ?? 0
  const suspendedCount = stats?.byStatus?.SUSPENDED ?? 0
  const terminatedCount = stats?.byStatus?.TERMINATED ?? 0
  const activeRate = totalStaffCount > 0 ? Math.round((activeCount / totalStaffCount) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Page Header with Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
            Personel Listesi <span className="text-primary-gold">({totalStaffCount.toLocaleString()} Personel)</span>
          </h2>
          <p className="text-text-light-secondary dark:text-text-secondary">
            Aktif: {activeCount} ({activeRate}%) | Pasif: {inactiveCount} | İzinli: {onLeaveCount} | Askıda: {suspendedCount} | Ayrılan: {terminatedCount}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="md" icon={RefreshCw} onClick={refreshStaff}>
            Yenile
          </Button>
          <Button variant="primary" size="md" icon={Plus} onClick={() => setIsStaffFormOpen(true)}>
            Yeni Personel
          </Button>
        </div>
      </div>
        
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

      {/* Main Content - Only Staff List Card */}
      <Card title="Personel Listesi" subtitle="Tüm personel bilgilerini görüntüleyin ve yönetin">
        <StaffList
          staff={staff}
          totalCount={staffPagination.total}
          currentPage={staffPagination.page}
          totalPages={staffPagination.totalPages}
          pageSize={staffPagination.limit}
          isLoading={staffIsLoading}
          error={staffError}
          searchQuery={staffSearchQuery}
          onPageChange={setStaffPage}
          onSearch={setStaffSearchQuery}
          onEdit={handleEditStaff}
          onDelete={handleDeleteStaff}
          onRefresh={refreshStaff}
        />
      </Card>
    </div>
  )
}

export default StaffPage