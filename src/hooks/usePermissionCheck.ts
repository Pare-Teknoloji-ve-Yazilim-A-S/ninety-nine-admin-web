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
    console.log('=== usePermissionCheck.hasPermission Debug ===');
    console.log('Loading state:', loading);
    console.log('Required permission:', requiredPermission);
    
    if (loading) {
      console.log('Still loading, returning false');
      return false;
    }
    
    // Kullanıcının permission'larını localStorage'dan al
    const userPermissions = localStorage.getItem('userPermissions');
    console.log('Raw userPermissions from localStorage:', userPermissions);
    
    if (!userPermissions) {
      console.warn('usePermissionCheck - User permissions not found in localStorage');
      return false;
    }

    try {
      const userPerms = JSON.parse(userPermissions);
      console.log('usePermissionCheck - Parsed permissions:', userPerms);
      console.log('usePermissionCheck - Permissions type:', typeof userPerms);
      console.log('usePermissionCheck - Is array:', Array.isArray(userPerms));
      console.log('usePermissionCheck - Required permission:', requiredPermission);
      
      if (Array.isArray(userPerms)) {
        console.log('usePermissionCheck - Array length:', userPerms.length);
        console.log('usePermissionCheck - First few permissions:', userPerms.slice(0, 5));
      }
      
      // Array ise kontrol et
      if (Array.isArray(userPerms)) {
        // İlk eleman string mi object mi kontrol et
        if (userPerms.length > 0) {
          const firstItem = userPerms[0];
          
          // String array ise direkt kontrol et
          if (typeof firstItem === 'string') {
            console.log('usePermissionCheck - Checking string array');
            const hasPerm = userPerms.includes(requiredPermission);
            console.log('usePermissionCheck - String array check result:', hasPerm);
            console.log('usePermissionCheck - All permissions in array:', userPerms);
            console.log('=== End usePermissionCheck Debug ===');
            return hasPerm;
          }
          
          // Object array ise name ve id field'larını kontrol et
          if (typeof firstItem === 'object' && firstItem !== null) {
            console.log('usePermissionCheck - Checking object array');
            console.log('usePermissionCheck - First item structure:', firstItem);
            const hasPerm = userPerms.some((perm: any) => {
              // ID kontrolü öncelikli (daha güvenli)
              if (perm.id && perm.id === requiredPermission) {
                console.log('usePermissionCheck - Permission found by ID:', perm.id);
                return true;
              }
              // Name kontrolü (geriye dönük uyumluluk için)
              const permName = perm.name || perm;
              console.log('usePermissionCheck - Checking permission by name:', permName, 'against required:', requiredPermission);
              return permName === requiredPermission;
            });
            console.log('usePermissionCheck - Object array check result:', hasPerm);
            console.log('=== End usePermissionCheck Debug ===');
            return hasPerm;
          }
        }
      }
      
      // Object ise name field'ını kontrol et
      if (typeof userPerms === 'object' && !Array.isArray(userPerms)) {
        console.log('usePermissionCheck - Checking object (non-array)');
        console.log('usePermissionCheck - Object values:', Object.values(userPerms));
        const hasPerm = Object.values(userPerms).some((perm: any) => {
          const permName = typeof perm === 'string' ? perm : perm.name;
          console.log('usePermissionCheck - Checking object permission:', permName, 'against required:', requiredPermission);
          return permName === requiredPermission;
        });
        console.log('usePermissionCheck - Object check result:', hasPerm);
        console.log('=== End usePermissionCheck Debug ===');
        return hasPerm;
      }
      
      console.log('usePermissionCheck - No valid permission format found');
      console.log('=== End usePermissionCheck Debug ===');
      return false;
    } catch (error) {
      console.error('usePermissionCheck - Error parsing user permissions:', error);
      console.log('=== End usePermissionCheck Debug ===');
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
