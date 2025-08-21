import { useState, useCallback } from 'react';
import { rolePermissionService, RolePermission } from '@/services/role-permission.service';
import { useToast } from './useToast';

export const useRolePermissions = (roleId?: string) => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Rol izinlerini getir
  const fetchRolePermissions = useCallback(async (targetRoleId?: string) => {
    const id = targetRoleId || roleId;
    if (!id) return;

    setLoading(true);
    setError(null);
    
    try {
      const permissions = await rolePermissionService.getRolePermissions(id);
      setRolePermissions(permissions);
    } catch (err: any) {
      console.error('Role permissions fetch error:', err);
      const errorMessage = err.response?.data?.message || 'Rol izinleri yüklenirken hata oluştu';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [roleId, showErrorToast]);

  // İzinleri ata
  const assignPermissions = useCallback(async (permissionIds: string[], targetRoleId?: string) => {
    const id = targetRoleId || roleId;
    if (!id) return;

    setLoading(true);
    setError(null);
    
    try {
      const result = await rolePermissionService.assignPermissions(id, permissionIds);
      
      if (result.success) {
        showSuccessToast('İzinler başarıyla atandı');
        // İzinleri yeniden yükle
        await fetchRolePermissions(id);
      } else {
        throw new Error(result.message || 'İzin atama başarısız');
      }
    } catch (err: any) {
      console.error('Assign permissions error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'İzinler atanırken hata oluştu';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [roleId, fetchRolePermissions, showSuccessToast, showErrorToast]);

  // İzinleri kaldır
  const removePermissions = useCallback(async (permissionIds: string[], targetRoleId?: string) => {
    const id = targetRoleId || roleId;
    if (!id) return;

    setLoading(true);
    setError(null);
    
    try {
      const result = await rolePermissionService.removePermissions(id, permissionIds);
      
      if (result.success) {
        showSuccessToast('İzinler başarıyla kaldırıldı');
        // İzinleri yeniden yükle
        await fetchRolePermissions(id);
      } else {
        throw new Error(result.message || 'İzin kaldırma başarısız');
      }
    } catch (err: any) {
      console.error('Remove permissions error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'İzinler kaldırılırken hata oluştu';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [roleId, fetchRolePermissions, showSuccessToast, showErrorToast]);

  // Tüm izinleri güncelle
  const updateRolePermissions = useCallback(async (permissionIds: string[], targetRoleId?: string) => {
    const id = targetRoleId || roleId;
    if (!id) return;

    setLoading(true);
    setError(null);
    
    try {
      const result = await rolePermissionService.updateRolePermissions(id, permissionIds);
      
      if (result.success) {
        showSuccessToast('Rol izinleri başarıyla güncellendi');
        // İzinleri yeniden yükle
        await fetchRolePermissions(id);
      } else {
        throw new Error(result.message || 'İzin güncelleme başarısız');
      }
    } catch (err: any) {
      console.error('Update role permissions error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Rol izinleri güncellenirken hata oluştu';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [roleId, fetchRolePermissions, showSuccessToast, showErrorToast]);

  // Mevcut izin ID'lerini al
  const getCurrentPermissionIds = useCallback(() => {
    return rolePermissions.map(rp => rp.permissionId);
  }, [rolePermissions]);

  return {
    rolePermissions,
    loading,
    error,
    fetchRolePermissions,
    assignPermissions,
    removePermissions,
    updateRolePermissions,
    getCurrentPermissionIds
  };
};
