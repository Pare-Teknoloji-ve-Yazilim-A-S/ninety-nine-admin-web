'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Staff, CreateStaffDto, UpdateStaffDto } from '@/services/types/staff.types'
import type { StaffActions } from '../types'
import { STAFF_BULK_ACTIONS, EXPORT_FILENAMES, type StaffBulkAction } from '../constants/staff'
import { staffService } from '@/services/staff.service'
import { downloadBlobAsFile } from '@/lib/download'

interface UseStaffActionsProps {
  onRefresh: () => Promise<void>
  importInputRef: React.RefObject<HTMLInputElement>
  clearSelected: () => void
  getEditingId?: () => string | number | undefined
}

export function useStaffActions({
  onRefresh,
  importInputRef,
  clearSelected,
  getEditingId
}: UseStaffActionsProps) {
  const router = useRouter()

  const onCreate = useCallback(async (data: CreateStaffDto) => {
    try {
      await staffService.createStaff(data)
      await onRefresh()
    } catch (error: unknown) {
      console.error('Failed to create staff:', error)
      throw error
    }
  }, [onRefresh])

  const onUpdate = useCallback(async (data: UpdateStaffDto) => {
    try {
      const id = getEditingId?.()
      if (id === undefined) throw new Error('Editing staff id not available')
      await staffService.updateStaff(id, data)
      await onRefresh()
    } catch (error: unknown) {
      console.error('Failed to update staff:', error)
      throw error
    }
  }, [onRefresh, getEditingId])

  const onDelete = useCallback(async (staff: Staff) => {
    try {
      await staffService.deleteStaff(staff.id)
      await onRefresh()
    } catch (error: unknown) {
      console.error('Failed to delete staff:', error)
      throw error
    }
  }, [onRefresh])

  const onActivate = useCallback(async (staff: Staff) => {
    try {
      await staffService.activateStaff(staff.id)
      await onRefresh()
    } catch (error: unknown) {
      console.error('Failed to activate staff:', error)
      throw error
    }
  }, [onRefresh])

  const onDeactivate = useCallback(async (staff: Staff) => {
    try {
      await staffService.deactivateStaff(staff.id)
      await onRefresh()
    } catch (error: unknown) {
      console.error('Failed to deactivate staff:', error)
      throw error
    }
  }, [onRefresh])

  const onBulk = useCallback(async (action: StaffBulkAction, ids: string[]) => {
    try {
      switch (action) {
        case STAFF_BULK_ACTIONS.ACTIVATE:
          await staffService.bulkUpdateStaffStatus({ staffIds: ids, operation: 'update', data: { status: 'ACTIVE' as any } })
          break
        case STAFF_BULK_ACTIONS.DEACTIVATE:
          await staffService.bulkUpdateStaffStatus({ staffIds: ids, operation: 'update', data: { status: 'INACTIVE' as any } })
          break
        case STAFF_BULK_ACTIONS.DELETE:
          await staffService.bulkDeleteStaff(ids)
          break
        case STAFF_BULK_ACTIONS.EXPORT:
          await onExport()
          return // Don't refresh for export
        default:
          throw new Error(`Unknown bulk action: ${action}`)
      }
      
      clearSelected()
      await onRefresh()
    } catch (error: unknown) {
      console.error('Failed to perform bulk action:', error)
      throw error
    }
  }, [onRefresh, clearSelected])

  const onExport = useCallback(async () => {
    try {
      const blob = await staffService.exportStaff({ format: 'csv' })
      downloadBlobAsFile(blob, EXPORT_FILENAMES.STAFF_LIST)
    } catch (error: unknown) {
      console.error('Failed to export staff:', error)
      throw error
    }
  }, [])

  const onImportClick = useCallback(() => {
    importInputRef.current?.click()
  }, [importInputRef])

  const onImportFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await staffService.importStaff(file)
      await onRefresh()
      
      // Reset input
      if (importInputRef.current) {
        importInputRef.current.value = ''
      }
    } catch (error: unknown) {
      console.error('Failed to import staff:', error)
      throw error
    }
  }, [onRefresh, importInputRef])

  const onView = useCallback((staff: Staff) => {
    router.push(`/dashboard/staff/${staff.id}`)
  }, [router])

  const openSettings = useCallback(() => {
    router.push('/dashboard/staff/settings')
  }, [router])

  const actions: Omit<StaffActions, 'openCreate' | 'openEdit' | 'closeForm' | 'applyQuickFilter' | 'setSearchQuery' | 'setPage' | 'setLimit' | 'setViewMode' | 'setSelected' | 'setFilters' | 'openFilters' | 'closeFilters' | 'refresh'> = {
    onCreate,
    onUpdate,
    onDelete,
    onActivate,
    onDeactivate,
    onBulk,
    onExport,
    onImportClick,
    onImportFile,
    onView,
    openSettings
  }

  return {
    actions
  }
}