import { useState, useEffect, useCallback } from 'react';
import { permissionService, Permission, PermissionFilters } from '@/services/permission.service';
import { useToast } from './useToast';

export const usePermissions = (initialFilters?: PermissionFilters) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsByResource, setPermissionsByResource] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [filters, setFilters] = useState<PermissionFilters>({
    page: 1,
    limit: 10,
    orderBy: 'DESC',
    orderColumn: 'createdAt',
    ...initialFilters
  });

  const { error: showErrorToast, success: showSuccessToast } = useToast();

  // İzinleri getir (tümünü)
  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const permissionsData = await permissionService.getAllPermissions();
      
      // Her izin objesinin gerekli alanları var mı kontrol et
      const validPermissions = permissionsData.filter(permission => 
        permission && 
        typeof permission === 'object' && 
        permission.id && 
        permission.name && 
        permission.action && 
        permission.resource
      );
      
      console.log('Permissions API Response:', permissionsData);
      console.log('Valid permissions:', validPermissions);
      
      setPermissions(validPermissions);
      
      // Resource'a göre gruplandır
      const groupedByResource = validPermissions.reduce((acc, permission) => {
        const resource = permission.resource;
        if (!acc[resource]) {
          acc[resource] = [];
        }
        acc[resource].push(permission);
        return acc;
      }, {} as Record<string, Permission[]>);
      
      console.log('Permissions grouped by resource:', groupedByResource);
      setPermissionsByResource(groupedByResource);
      
      // Pagination'ı güncelle
      setPagination({
        total: validPermissions.length,
        page: 1,
        limit: validPermissions.length,
        totalPages: 1
      });
      
    } catch (err: any) {
      console.error('Permissions fetch error:', err);
      const errorMessage = err.response?.data?.message || 'İzinler yüklenirken hata oluştu';
      setError(errorMessage);
      setPermissions([]); // Hata durumunda boş array
      setPermissionsByResource({});
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showErrorToast]);

  // Filtreleri güncelle
  const updateFilters = useCallback((newFilters: Partial<PermissionFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1 // Filtre değiştiğinde sayfa 1'e dön
    }));
  }, []);

  // Sayfa değiştir
  const updatePagination = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // İzin oluştur
  const createPermission = useCallback(async (data: { name: string; action: string; resource: string; description?: string }) => {
    try {
      const newPermission = await permissionService.createPermission(data);
      
      // Yeni izni listeye ekle
      setPermissions(prev => [newPermission, ...prev]);
      
      // Resource gruplandırmasını güncelle
      setPermissionsByResource(prev => {
        const resource = newPermission.resource;
        const updated = { ...prev };
        if (!updated[resource]) {
          updated[resource] = [];
        }
        updated[resource] = [newPermission, ...updated[resource]];
        return updated;
      });
      
      // Pagination'ı güncelle
      setPagination(prev => ({
        ...prev,
        total: prev.total + 1
      }));
      
      showSuccessToast('İzin başarıyla oluşturuldu');
      return newPermission;
    } catch (err: any) {
      console.error('Create permission error:', err);
      const errorMessage = err.response?.data?.message || 'İzin oluşturulurken hata oluştu';
      showErrorToast(errorMessage);
      throw err;
    }
  }, [showSuccessToast, showErrorToast]);

  // İzinleri yenile
  const refreshPermissions = useCallback(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // İzin güncelle
  const updatePermission = useCallback(async (permissionId: string, data: { name?: string; action?: string; resource?: string; description?: string }) => {
    try {
      const updatedPermission = await permissionService.updatePermission(permissionId, data);
      setPermissions(prev => prev.map(permission => permission.id === permissionId ? updatedPermission : permission));
      showSuccessToast('İzin başarıyla güncellendi');
      return updatedPermission;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'İzin güncellenirken hata oluştu';
      showErrorToast(errorMessage);
      throw err;
    }
  }, [showSuccessToast, showErrorToast]);

  // İzin sil
  const deletePermission = useCallback(async (permissionId: string) => {
    try {
      await permissionService.deletePermission(permissionId);
      
      // İzni listeden kaldır
      setPermissions(prev => prev.filter(permission => permission.id !== permissionId));
      
      // Resource gruplandırmasından da kaldır
      setPermissionsByResource(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(resource => {
          updated[resource] = updated[resource].filter(permission => permission.id !== permissionId);
        });
        return updated;
      });
      
      showSuccessToast('İzin başarıyla silindi');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'İzin silinirken hata oluştu';
      showErrorToast(errorMessage);
      throw err;
    }
  }, [showSuccessToast, showErrorToast]);

  // İlk yükleme
  useEffect(() => {
    // Tüm izinleri getir
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    permissionsByResource,
    loading,
    error,
    pagination,
    filters,
    fetchPermissions,
    updateFilters,
    updatePagination,
    createPermission,
    updatePermission,
    deletePermission,
    refreshPermissions
  };
};
