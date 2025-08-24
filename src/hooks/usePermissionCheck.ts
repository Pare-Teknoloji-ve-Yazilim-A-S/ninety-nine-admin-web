import { useCallback, useState, useEffect } from 'react';
import { usePermissions } from './usePermissions';
import { useAuth } from '@/app/components/auth/AuthProvider';

export const usePermissionCheck = () => {
  const { permissions, loading } = usePermissions();
  const { refreshUserPermissions } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Permission değişikliklerini dinle
  useEffect(() => {
    const handlePermissionChange = async () => {
      console.log('Permission change detected, refreshing permissions...');
      try {
        await refreshUserPermissions();
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Failed to refresh permissions on change:', error);
      }
    };

    // Custom event listener ekle
    window.addEventListener('permission-changed', handlePermissionChange);

    // Cleanup
    return () => {
      window.removeEventListener('permission-changed', handlePermissionChange);
    };
  }, [refreshUserPermissions]);

  const hasPermission = useCallback((requiredPermission: string): boolean => {
    if (loading) return false;
    
    // Kullanıcının permission'larını localStorage'dan al
    const userPermissions = localStorage.getItem('userPermissions');
    
    if (!userPermissions) {
      console.warn('User permissions not found in localStorage');
      return false;
    }

    try {
      const userPerms = JSON.parse(userPermissions);
      console.log('User permissions from localStorage:', userPerms);
      console.log('Required permission:', requiredPermission);
      console.log('First few permissions:', userPerms.slice(0, 3));
      
      // Array ise kontrol et
      if (Array.isArray(userPerms)) {
        // İlk eleman string mi object mi kontrol et
        if (userPerms.length > 0) {
          const firstItem = userPerms[0];
          
          // String array ise direkt kontrol et
          if (typeof firstItem === 'string') {
            const hasPerm = userPerms.includes(requiredPermission);
            console.log('String array check result:', hasPerm);
            return hasPerm;
          }
          
          // Object array ise name field'ını kontrol et
          if (typeof firstItem === 'object' && firstItem !== null) {
            const hasPerm = userPerms.some((perm: any) => {
              const permName = perm.name || perm;
              return permName === requiredPermission;
            });
            console.log('Object array check result:', hasPerm);
            return hasPerm;
          }
        }
      }
      
      // Object ise name field'ını kontrol et
      if (typeof userPerms === 'object' && !Array.isArray(userPerms)) {
        const hasPerm = Object.values(userPerms).some((perm: any) => {
          const permName = typeof perm === 'string' ? perm : perm.name;
          return permName === requiredPermission;
        });
        console.log('Object check result:', hasPerm);
        return hasPerm;
      }
      
      return false;
    } catch (error) {
      console.error('Error parsing user permissions:', error);
      return false;
    }
  }, [loading, refreshKey]); // refreshKey dependency eklendi

  const hasAnyPermission = useCallback((requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  // Permission'ları yenile
  const refreshPermissions = useCallback(async () => {
    try {
      await refreshUserPermissions();
      setRefreshKey(prev => prev + 1); // Hook'u yeniden tetikle
    } catch (error) {
      console.error('Failed to refresh permissions:', error);
    }
  }, [refreshUserPermissions]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading,
    refreshPermissions
  };
};
