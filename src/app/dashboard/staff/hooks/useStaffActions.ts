'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Staff, CreateStaffDto, UpdateStaffDto } from '@/services/types/staff.types'
import type { StaffActions } from '../types'
import { STAFF_BULK_ACTIONS, EXPORT_FILENAMES, type StaffBulkAction } from '../constants/staff'

interface UseStaffActionsProps {
  onRefresh: () => Promise<void>
  importInputRef: React.RefObject<HTMLInputElement>
  clearSelected: () => void
}

export function useStaffActions({
  onRefresh,
  importInputRef,
  clearSelected
}: UseStaffActionsProps) {
  const router = useRouter()

  const onCreate = useCallback(async (data: CreateStaffDto) => {
    try {
      // TODO: Implement actual API call
      // await staffService.createStaff(data)
      await onRefresh()
    } catch (error: unknown) {
      console.error('Failed to create staff:', error)
      throw error
    }
  }, [onRefresh])

  const onUpdate = useCallback(async (data: UpdateStaffDto) => {
    try {
      // TODO: Implement actual API call
      // await staffService.updateStaff(data.id, data)
      await onRefresh()
    } catch (error: unknown) {
      console.error('Failed to update staff:', error)
      throw error
    }
  }, [onRefresh])

  const onDelete = useCallback(async (staff: Staff) => {
    try {
      // TODO: Implement actual API call
      // await staffService.deleteStaff(staff.id)
      await onRefresh()
    } catch (error: unknown) {
      console.error('Failed to delete staff:', error)
      throw error
    }
  }, [onRefresh])

  const onActivate = useCallback(async (staff: Staff) => {
    try {
      // TODO: Implement actual API call
      // await staffService.activateStaff(staff.id)
      await onRefresh()
    } catch (error: unknown) {
      console.error('Failed to activate staff:', error)
      throw error
    }
  }, [onRefresh])

  const onDeactivate = useCallback(async (staff: Staff) => {
    try {
      // TODO: Implement actual API call
      // await staffService.deactivateStaff(staff.id)
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
          // TODO: Implement bulk activate
          // await staffService.bulkActivate(ids)
          break
        case STAFF_BULK_ACTIONS.DEACTIVATE:
          // TODO: Implement bulk deactivate
          // await staffService.bulkDeactivate(ids)
          break
        case STAFF_BULK_ACTIONS.DELETE:
          // TODO: Implement bulk delete
          // await staffService.bulkDelete(ids)
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
      // TODO: Implement actual export
      // const data = await staffService.exportStaff()
      // downloadFile(data, EXPORT_FILENAMES.STAFF_LIST)
      console.log('Exporting staff data...')
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
      // TODO: Implement actual import
      // const formData = new FormData()
      // formData.append('file', file)
      // await staffService.importStaff(formData)
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