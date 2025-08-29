import { useState, useCallback, useEffect } from 'react';
import { roleService, Role, RoleFilters } from '@/services/role.service';
import { useToast } from './useToast';

export const useRoles = (initialFilters?: Partial<RoleFilters>) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [filters, setFilters] = useState<RoleFilters>({
    page: 1,
    limit: 10,
    search: '',
    orderBy: 'ASC',
    orderColumn: 'createdAt',
    ...initialFilters
  });

  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Rolleri getir (tümünü)
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const rolesData = await roleService.getAllRoles();
      
      // Her rol objesinin gerekli alanları var mı kontrol et
      const validRoles = rolesData.filter(role => 
        role && 
        typeof role === 'object' && 
        role.id && 
        role.name && 
        role.slug
      );
      
      console.log('Roles API Response:', rolesData);
      console.log('Valid roles:', validRoles);
      
      setRoles(validRoles);
      
      // Pagination'ı güncelle
      setPagination({
        total: validRoles.length,
        page: 1,
        limit: validRoles.length,
        totalPages: 1
      });
      
    } catch (err: any) {
      console.error('Roles fetch error:', err);
      const errorMessage = err.response?.data?.message || 'Roller yüklenirken hata oluştu';
      setError(errorMessage);
      setRoles([]); // Hata durumunda boş array
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showErrorToast]);

  // Filtreleri güncelle
  const updateFilters = useCallback((newFilters: Partial<RoleFilters>) => {
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

  // Rol oluştur
  const createRole = useCallback(async (data: { name: string; description?: string }) => {
    console.log('🎯 useRoles: Creating role with data:', data);
    
    try {
      console.log('🚀 useRoles: Calling roleService.createRole...');
      const newRole = await roleService.createRole(data);
      console.log('✅ useRoles: Role created successfully:', newRole);
      
      // Yeni rolü listeye ekle - güvenli bir şekilde
      if (newRole && typeof newRole === 'object') {
        setRoles(prev => {
          console.log('🔄 useRoles: Updating roles state, prev roles:', prev);
          // Eğer rol zaten varsa ekleme
          const roleExists = prev.some(role => role.id === newRole.id);
          if (roleExists) {
            console.log('⚠️ useRoles: Role already exists in state, not adding duplicate');
            return prev;
          }
          const updatedRoles = [newRole, ...prev];
          console.log('🔄 useRoles: Updated roles:', updatedRoles);
          return updatedRoles;
        });
        
        // Pagination'ı güncelle
        setPagination(prev => ({
          ...prev,
          total: prev.total + 1
        }));
        
        console.log('✅ useRoles: Success toast will be shown');
        showSuccessToast('Rol başarıyla oluşturuldu');
        return newRole;
      } else {
        throw new Error('Geçersiz rol verisi alındı');
      }
    } catch (err: any) {
      console.error('❌ useRoles: Create role error:', err);
      console.error('❌ useRoles: Error details:', {
        message: err.message,
        response: err.response,
        responseData: err.response?.data,
        status: err.response?.status
      });
      
      const errorMessage = err.response?.data?.message || err.message || 'Rol oluşturulurken hata oluştu';
      console.error('❌ useRoles: Error message to show:', errorMessage);
      
      showErrorToast(errorMessage);
      throw err;
    }
  }, [showSuccessToast, showErrorToast]);

  // Rolleri yenile (rol oluşturduktan sonra kullanılabilir)
  const refreshRoles = useCallback(() => {
    console.log('🔄 useRoles: refreshRoles called');
    fetchRoles();
  }, [fetchRoles]);

  // Rol güncelle
  const updateRole = useCallback(async (roleId: string, data: { name?: string; description?: string }) => {
    try {
      const updatedRole = await roleService.updateRole(roleId, data);
      setRoles(prev => prev.map(role => role.id === roleId ? updatedRole : role));
      showSuccessToast('Rol başarıyla güncellendi');
      return updatedRole;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Rol güncellenirken hata oluştu';
      showErrorToast(errorMessage);
      throw err;
    }
  }, [showSuccessToast, showErrorToast]);

  // Rol sil
  const deleteRole = useCallback(async (roleId: string) => {
    try {
      await roleService.deleteRole(roleId);
      
      // Rolü listeden kaldır
      setRoles(prev => prev.filter(role => role.id !== roleId));
      
      // Pagination'ı güncelle
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }));
      
      showSuccessToast('Rol başarıyla silindi');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Rol silinirken hata oluştu';
      showErrorToast(errorMessage);
      throw err;
    }
  }, [showSuccessToast, showErrorToast]);

  // İlk yükleme
  useEffect(() => {
    // Tüm rolleri getir
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    pagination,
    filters,
    fetchRoles,
    updateFilters,
    updatePagination,
    createRole,
    updateRole,
    deleteRole,
    refreshRoles
  };
};
