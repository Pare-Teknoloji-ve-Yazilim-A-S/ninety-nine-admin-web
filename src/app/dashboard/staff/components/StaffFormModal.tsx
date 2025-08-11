'use client'

import Modal from '@/app/components/ui/Modal'
import { StaffForm } from '@/components/staff'
import type { Staff, CreateStaffDto, UpdateStaffDto } from '@/services/types/staff.types'
import type { Department, Position } from '@/services/types/department.types'

interface StaffFormModalProps {
  open: boolean
  editingStaff: Staff | null
  departments: Department[]
  positions: Position[]
  managers: Staff[]
  onSubmit: (data: CreateStaffDto | UpdateStaffDto) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export default function StaffFormModal({
  open,
  editingStaff,
  departments,
  positions,
  managers,
  onSubmit,
  onClose,
  isLoading,
}: StaffFormModalProps) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={editingStaff ? 'Personel Düzenle' : 'Yeni Personel Ekle'}
      size="lg"
    >
      <StaffForm
        staff={editingStaff as Staff}
        departments={departments}
        positions={positions}
        managers={managers}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={!!isLoading}
      />
    </Modal>
  )
}


