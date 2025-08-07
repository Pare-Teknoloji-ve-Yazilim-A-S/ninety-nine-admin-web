'use client'

import { useState, useCallback } from 'react'
import { staffService } from '@/services/staff.service'
import {
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  StaffProfileDto,
  StaffAssignmentDto,
  BulkStaffOperationDto,
  StaffPerformanceDto,
  StaffLeaveDto,
  StaffStatus
} from '@/services/types/staff.types'
import { useToast } from './useToast'

interface UseStaffActionsOptions {
  onSuccess?: (action: string, data?: any) => void
  onError?: (action: string, error: Error) => void
  showToasts?: boolean
}

interface UseStaffActionsReturn {
  // Loading states
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  isAssigning: boolean
  isBulkOperating: boolean
  isExporting: boolean
  isImporting: boolean
  loading : boolean
  
  // CRUD Operations
  createStaff: (data: CreateStaffDto) => Promise<Staff | null>
  updateStaff: (id: string | number, data: UpdateStaffDto) => Promise<Staff | null>
  deleteStaff: (id: string | number) => Promise<boolean>
  
  // Profile Management
  updateStaffProfile: (id: string | number, data: StaffProfileDto) => Promise<Staff | null>
  
  // Status Management
  updateStaffStatus: (id: string | number, status: StaffStatus) => Promise<Staff | null>
  activateStaff: (id: string | number) => Promise<Staff | null>
  deactivateStaff: (id: string | number) => Promise<Staff | null>
  suspendStaff: (id: string | number) => Promise<Staff | null>
  terminateStaff: (id: string | number) => Promise<Staff | null>
  
  // Assignment Operations
  assignStaffToDepartment: (data: StaffAssignmentDto) => Promise<Staff | null>
  assignStaffToPosition: (data: StaffAssignmentDto) => Promise<Staff | null>
  assignManager: (staffId: string | number, managerId: string | number) => Promise<Staff | null>
  
  // Bulk Operations
  bulkUpdateStaffStatus: (data: BulkStaffOperationDto) => Promise<Staff[] | null>
  bulkAssignDepartment: (data: BulkStaffOperationDto) => Promise<Staff[] | null>
  bulkDeleteStaff: (staffIds: (string | number)[]) => Promise<boolean>
  
  // Performance Management
  updateStaffPerformance: (id: string | number, data: StaffPerformanceDto) => Promise<Staff | null>
  
  // Leave Management
  requestLeave: (id: string | number, data: StaffLeaveDto) => Promise<boolean>
  approveLeave: (leaveId: string | number) => Promise<boolean>
  rejectLeave: (leaveId: string | number, reason?: string) => Promise<boolean>
  
  // Export/Import
  exportStaff: (filters?: any) => Promise<Blob | null>
  importStaff: (file: File, onProgress?: (progress: number) => void) => Promise<{ success: number; errors: any[] } | null>
  
  // User Integration
  convertUserToStaff: (userId: string | number, staffData: Omit<CreateStaffDto, 'userId'>) => Promise<Staff | null>
  syncWithUserService: (staffId: string | number) => Promise<Staff | null>
}

export function useStaffActions(options: UseStaffActionsOptions = {}): UseStaffActionsReturn {
  const {
    onSuccess,
    onError,
    showToasts = true
  } = options

  const { success, error: toastError, warning, info } = useToast()

  // Loading states
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)
  const [isBulkOperating, setIsBulkOperating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Handle success
  const handleSuccess = useCallback((action: string, data?: any, message?: string) => {
    if (onSuccess) {
      onSuccess(action, data)
    }
    
    if (showToasts && message) {
      success(message, 'Başarılı')
    }
  }, [onSuccess, showToasts, success])

  // Handle error
  const handleError = useCallback((action: string, err: any, defaultMessage: string) => {
    const errorMessage = err?.response?.data?.message || err?.message || defaultMessage
    
    if (onError) {
      onError(action, err)
    }
    
    if (showToasts) {
      toastError(errorMessage, 'Hata')
    }
  }, [onError, showToasts, toastError])

  // CRUD Operations
  const createStaff = useCallback(async (data: CreateStaffDto): Promise<Staff | null> => {
    try {
      setIsCreating(true)
      const response = await staffService.createStaff(data)
      
      if (response.success && response.data) {
        handleSuccess('create', response.data, 'Personel başarıyla oluşturuldu')
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('create', err, 'Personel oluşturulurken hata oluştu')
      return null
    } finally {
      setIsCreating(false)
    }
  }, [handleSuccess, handleError])

  const updateStaff = useCallback(async (id: string | number, data: UpdateStaffDto): Promise<Staff | null> => {
    try {
      setIsUpdating(true)
      const response = await staffService.updateStaff(id, data)
      
      if (response.success && response.data) {
        handleSuccess('update', response.data, 'Personel bilgileri güncellendi')
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('update', err, 'Personel güncellenirken hata oluştu')
      return null
    } finally {
      setIsUpdating(false)
    }
  }, [handleSuccess, handleError])

  const deleteStaff = useCallback(async (id: string | number): Promise<boolean> => {
    try {
      setIsDeleting(true)
      const response = await staffService.deleteStaff(id)
      
      if (response.success) {
        handleSuccess('delete', null, 'Personel başarıyla silindi')
        return true
      }
      return false
    } catch (err: any) {
      handleError('delete', err, 'Personel silinirken hata oluştu')
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [handleSuccess, handleError])

  // Profile Management
  const updateStaffProfile = useCallback(async (id: string | number, data: StaffProfileDto): Promise<Staff | null> => {
    try {
      setIsUpdating(true)
      const response = await staffService.updateStaffProfile(id, data)
      
      if (response.success && response.data) {
        handleSuccess('updateProfile', response.data, 'Personel profili güncellendi')
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('updateProfile', err, 'Profil güncellenirken hata oluştu')
      return null
    } finally {
      setIsUpdating(false)
    }
  }, [handleSuccess, handleError])

  // Status Management
  const updateStaffStatus = useCallback(async (id: string | number, status: StaffStatus): Promise<Staff | null> => {
    try {
      setIsUpdating(true)
      const response = await staffService.updateStaffStatus(id, status)
      
      if (response.success && response.data) {
        handleSuccess('updateStatus', response.data, 'Personel durumu güncellendi')
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('updateStatus', err, 'Durum güncellenirken hata oluştu')
      return null
    } finally {
      setIsUpdating(false)
    }
  }, [handleSuccess, handleError])

  const activateStaff = useCallback(async (id: string | number): Promise<Staff | null> => {
    return updateStaffStatus(id, StaffStatus.ACTIVE)
  }, [updateStaffStatus])

  const deactivateStaff = useCallback(async (id: string | number): Promise<Staff | null> => {
    return updateStaffStatus(id, StaffStatus.INACTIVE)
  }, [updateStaffStatus])

  const suspendStaff = useCallback(async (id: string | number): Promise<Staff | null> => {
    return updateStaffStatus(id, StaffStatus.SUSPENDED)
  }, [updateStaffStatus])

  const terminateStaff = useCallback(async (id: string | number): Promise<Staff | null> => {
    return updateStaffStatus(id, StaffStatus.TERMINATED)
  }, [updateStaffStatus])

  // Assignment Operations
  const assignStaffToDepartment = useCallback(async (data: StaffAssignmentDto): Promise<Staff | null> => {
    try {
      setIsAssigning(true)
      const response = await staffService.assignStaffToDepartment(data)
      
      if (response.success && response.data) {
        handleSuccess('assignDepartment', response.data, 'Personel departmana atandı')
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('assignDepartment', err, 'Departman ataması sırasında hata oluştu')
      return null
    } finally {
      setIsAssigning(false)
    }
  }, [handleSuccess, handleError])

  const assignStaffToPosition = useCallback(async (data: StaffAssignmentDto): Promise<Staff | null> => {
    try {
      setIsAssigning(true)
      const response = await staffService.assignStaffToPosition(data)
      
      if (response.success && response.data) {
        handleSuccess('assignPosition', response.data, 'Personel pozisyona atandı')
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('assignPosition', err, 'Pozisyon ataması sırasında hata oluştu')
      return null
    } finally {
      setIsAssigning(false)
    }
  }, [handleSuccess, handleError])

  const assignManager = useCallback(async (staffId: string | number, managerId: string | number): Promise<Staff | null> => {
    try {
      setIsAssigning(true)
      const response = await staffService.assignManager(staffId, managerId)
      
      if (response.success && response.data) {
        handleSuccess('assignManager', response.data, 'Yönetici atandı')
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('assignManager', err, 'Yönetici ataması sırasında hata oluştu')
      return null
    } finally {
      setIsAssigning(false)
    }
  }, [handleSuccess, handleError])

  // Bulk Operations
  const bulkUpdateStaffStatus = useCallback(async (data: BulkStaffOperationDto): Promise<Staff[] | null> => {
    try {
      setIsBulkOperating(true)
      const response = await staffService.bulkUpdateStaffStatus(data)
      
      if (response.success && response.data) {
        handleSuccess('bulkUpdateStatus', response.data, `${response.data.length} personelin durumu güncellendi`)
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('bulkUpdateStatus', err, 'Toplu durum güncellemesi sırasında hata oluştu')
      return null
    } finally {
      setIsBulkOperating(false)
    }
  }, [handleSuccess, handleError])

  const bulkAssignDepartment = useCallback(async (data: BulkStaffOperationDto): Promise<Staff[] | null> => {
    try {
      setIsBulkOperating(true)
      const response = await staffService.bulkAssignDepartment(data)
      
      if (response.success && response.data) {
        handleSuccess('bulkAssignDepartment', response.data, `${response.data.length} personel departmana atandı`)
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('bulkAssignDepartment', err, 'Toplu departman ataması sırasında hata oluştu')
      return null
    } finally {
      setIsBulkOperating(false)
    }
  }, [handleSuccess, handleError])

  const bulkDeleteStaff = useCallback(async (staffIds: (string | number)[]): Promise<boolean> => {
    try {
      setIsBulkOperating(true)
      const response = await staffService.bulkDeleteStaff(staffIds)
      
      if (response.success) {
        handleSuccess('bulkDelete', null, `${staffIds.length} personel silindi`)
        return true
      }
      return false
    } catch (err: any) {
      handleError('bulkDelete', err, 'Toplu silme işlemi sırasında hata oluştu')
      return false
    } finally {
      setIsBulkOperating(false)
    }
  }, [handleSuccess, handleError])

  // Performance Management
  const updateStaffPerformance = useCallback(async (id: string | number, data: StaffPerformanceDto): Promise<Staff | null> => {
    try {
      setIsUpdating(true)
      const response = await staffService.updateStaffPerformance(id, data)
      
      if (response.success && response.data) {
        handleSuccess('updatePerformance', response.data, 'Performans değerlendirmesi güncellendi')
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('updatePerformance', err, 'Performans güncellenirken hata oluştu')
      return null
    } finally {
      setIsUpdating(false)
    }
  }, [handleSuccess, handleError])

  // Leave Management
  const requestLeave = useCallback(async (id: string | number, data: StaffLeaveDto): Promise<boolean> => {
    try {
      setIsUpdating(true)
      const response = await staffService.requestLeave(id, data)
      
      if (response.success) {
        handleSuccess('requestLeave', null, 'İzin talebi gönderildi')
        return true
      }
      return false
    } catch (err: any) {
      handleError('requestLeave', err, 'İzin talebi gönderilirken hata oluştu')
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [handleSuccess, handleError])

  const approveLeave = useCallback(async (leaveId: string | number): Promise<boolean> => {
    try {
      setIsUpdating(true)
      const response = await staffService.approveLeave(leaveId)
      
      if (response.success) {
        handleSuccess('approveLeave', null, 'İzin talebi onaylandı')
        return true
      }
      return false
    } catch (err: any) {
      handleError('approveLeave', err, 'İzin onaylanırken hata oluştu')
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [handleSuccess, handleError])

  const rejectLeave = useCallback(async (leaveId: string | number, reason?: string): Promise<boolean> => {
    try {
      setIsUpdating(true)
      const response = await staffService.rejectLeave(leaveId, reason)
      
      if (response.success) {
        handleSuccess('rejectLeave', null, 'İzin talebi reddedildi')
        return true
      }
      return false
    } catch (err: any) {
      handleError('rejectLeave', err, 'İzin reddedilirken hata oluştu')
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [handleSuccess, handleError])

  // Export/Import
  const exportStaff = useCallback(async (filters?: any): Promise<Blob | null> => {
    try {
      setIsExporting(true)
      const blob = await staffService.exportStaff(filters)
      
      handleSuccess('export', null, 'Personel verileri dışa aktarıldı')
      return blob
    } catch (err: any) {
      handleError('export', err, 'Dışa aktarma sırasında hata oluştu')
      return null
    } finally {
      setIsExporting(false)
    }
  }, [handleSuccess, handleError])

  const importStaff = useCallback(async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ success: number; errors: any[] } | null> => {
    try {
      setIsImporting(true)
      const response = await staffService.importStaff(file, onProgress)
      
      if (response.success && response.data) {
        handleSuccess('import', response.data, `${response.data.success} personel başarıyla içe aktarıldı`)
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('import', err, 'İçe aktarma sırasında hata oluştu')
      return null
    } finally {
      setIsImporting(false)
    }
  }, [handleSuccess, handleError])

  // User Integration
  const convertUserToStaff = useCallback(async (
    userId: string | number,
    staffData: Omit<CreateStaffDto, 'userId'>
  ): Promise<Staff | null> => {
    try {
      setIsCreating(true)
      const response = await staffService.convertUserToStaff(userId, staffData)
      
      if (response.success && response.data) {
        handleSuccess('convertUser', response.data, 'Kullanıcı personele dönüştürüldü')
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('convertUser', err, 'Kullanıcı dönüştürülürken hata oluştu')
      return null
    } finally {
      setIsCreating(false)
    }
  }, [handleSuccess, handleError])

  const syncWithUserService = useCallback(async (staffId: string | number): Promise<Staff | null> => {
    try {
      setIsUpdating(true)
      const response = await staffService.syncWithUserService(staffId)
      
      if (response.success && response.data) {
        handleSuccess('syncUser', response.data, 'Kullanıcı servisi ile senkronize edildi')
        return response.data
      }
      return null
    } catch (err: any) {
      handleError('syncUser', err, 'Senkronizasyon sırasında hata oluştu')
      return null
    } finally {
      setIsUpdating(false)
    }
  }, [handleSuccess, handleError])

  return {
    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    isAssigning,
    isBulkOperating,
    isExporting,
    isImporting,
    
    // CRUD Operations
    createStaff,
    updateStaff,
    deleteStaff,
    
    // Profile Management
    updateStaffProfile,
    
    // Status Management
    updateStaffStatus,
    activateStaff,
    deactivateStaff,
    suspendStaff,
    terminateStaff,
    
    // Assignment Operations
    assignStaffToDepartment,
    assignStaffToPosition,
    assignManager,
    
    // Bulk Operations
    bulkUpdateStaffStatus,
    bulkAssignDepartment,
    bulkDeleteStaff,
    
    // Performance Management
    updateStaffPerformance,
    
    // Leave Management
    requestLeave,
    approveLeave,
    rejectLeave,
    
    // Export/Import
    exportStaff,
    importStaff,
    
    // User Integration
    convertUserToStaff,
    syncWithUserService
  }
}

export default useStaffActions