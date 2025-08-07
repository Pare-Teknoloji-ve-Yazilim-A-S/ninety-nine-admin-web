'use client'

import { useState } from 'react'
import { Plus, Users, Building2, Briefcase, BarChart3 } from 'lucide-react'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Tabs from '@/app/components/ui/Tabs'
import Modal from '@/app/components/ui/Modal'
import {
  StaffList,
  StaffForm,
  StaffStats,
  DepartmentCard,
  PositionCard
} from '@/components/staff'
import {
  useStaff,
  useStaffActions,
  useDepartments,
  usePositions
} from '@/hooks'
import type { Staff } from '@/services/types/staff.types'

function StaffPage () {
  const [activeTab, setActiveTab] = useState('staff')
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  const {
    staff,
    loading: staffLoading,
    isLoading: staffIsLoading,
    error: staffError,
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

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsStaffFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Personel
        </Button>
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

      {/* Main Content */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-6"
        items={[
          {
            id: 'staff',
            label: 'Personel',
            icon: Users,
            content: (
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
            )
          },
          {
            id: 'departments',
            label: 'Departmanlar',
            icon: Building2,
            content: (
              <Card title="Departmanlar" subtitle="Şirket departmanlarını görüntüleyin ve yönetin">
                {departmentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((department) => (
                      <DepartmentCard
                        key={department.id}
                        department={department}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onViewStats={() => {}}
                        onManagePositions={() => {}}
                      />
                    ))}
                  </div>
                )}
              </Card>
            )
          },
          {
            id: 'positions',
            label: 'Pozisyonlar',
            icon: Briefcase,
            content: (
              <Card title="Pozisyonlar" subtitle="Şirket pozisyonlarını görüntüleyin ve yönetin">
                {positionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {positions.map((position) => (
                      <PositionCard
                        key={position.id}
                        position={position}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onViewStats={() => {}}
                      />
                    ))}
                  </div>
                )}
              </Card>
            )
          },
          {
            id: 'reports',
            label: 'Raporlar',
            icon: BarChart3,
            content: (
              <Card title="Raporlar" subtitle="Personel raporlarını görüntüleyin ve analiz edin">
                <div className="text-center py-8 text-muted-foreground">
                  Raporlar yakında eklenecek...
                </div>
              </Card>
            )
          }
        ]}
        fullWidth
      />
    </div>
  )
}

export default StaffPage