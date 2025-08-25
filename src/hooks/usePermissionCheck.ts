import { useCallback, useState, useEffect } from 'react';
import { usePermissions } from './usePermissions';
import { useAuth } from '@/app/components/auth/AuthProvider';

export const usePermissionCheck = () => {
  const { permissions, loading } = usePermissions();
  const { refreshUserPermissions } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Permission değişikliklerini dinle
  useEffect(() => {
    // SSR sırasında window erişimini kontrol et
    if (typeof window === 'undefined') {
      return;
    }
    
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
    
    if (loading) {
      return false;
    }
    
    // SSR sırasında localStorage erişimini kontrol et
    if (typeof window === 'undefined') {
      return false;
    }
    
    // Kullanıcının permission'larını localStorage'dan al
    const userPermissions = localStorage.getItem('userPermissions');
    
    if (!userPermissions) {
      return false;
    }
    
    // Permission ID'sinin farklı varyasyonlarını oluştur
    const permissionVariations = [
      requiredPermission,
      requiredPermission.toLowerCase(),
      requiredPermission.toUpperCase(),
      requiredPermission.replace(/-/g, '_'),
      requiredPermission.replace(/_/g, '-'),
      requiredPermission.toLowerCase().replace(/-/g, '_'),
      requiredPermission.toLowerCase().replace(/_/g, '-')
    ];
    
    // Permission name mapping (ID'den name'e çeviri)
    const permissionNameMap: { [key: string]: string } = {
      'e5f6g7h8-i9j0-1234-efgh-ij5678901234': 'Assign Property',
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890': 'Update Property',
      'create_resident': 'Create Resident',
      'manage_residents': 'Manage Residents',
      'da1b5308-72ee-4b07-9a59-5a4bb99e0ce9': 'Kullanıcı Oluştur',
      '27c9019e-5b8e-4dd7-a702-db47d3fc6bca': 'Create User'
    };
    
    // Name varyasyonlarını da ekle
    const permissionName = permissionNameMap[requiredPermission];
    if (permissionName) {
      permissionVariations.push(
        permissionName,
        permissionName.toLowerCase(),
        permissionName.toUpperCase(),
        permissionName.replace(/\s+/g, '_'),
        permissionName.replace(/\s+/g, '-'),
        permissionName.toLowerCase().replace(/\s+/g, '_'),
        permissionName.toLowerCase().replace(/\s+/g, '-')
      );
    }
    
    try {
      const userPerms = JSON.parse(userPermissions);
      
      // Array ise kontrol et
      if (Array.isArray(userPerms)) {
        // İlk eleman string mi object mi kontrol et
        if (userPerms.length > 0) {
          const firstItem = userPerms[0];
          
          // String array ise direkt kontrol et
          if (typeof firstItem === 'string') {
            // Tüm varyasyonları kontrol et
            return permissionVariations.some(variation => userPerms.includes(variation));
          }
          
          // Object array ise name ve id field'larını kontrol et
          if (typeof firstItem === 'object' && firstItem !== null) {
            return userPerms.some((perm: any) => {
              // ID kontrolü - tüm varyasyonları kontrol et
              if (perm.id && permissionVariations.includes(perm.id)) {
                return true;
              }
              // Name kontrolü - tüm varyasyonları kontrol et
              const permName = perm.name || perm;
              if (permName && permissionVariations.includes(permName)) {
                return true;
              }
              return false;
            });
          }
        }
      }
      
      // Object ise name field'ını kontrol et
      if (typeof userPerms === 'object' && !Array.isArray(userPerms)) {
        return Object.values(userPerms).some((perm: any) => {
          const permName = typeof perm === 'string' ? perm : perm.name;
          const permId = typeof perm === 'object' ? perm.id : null;
          
          // ID kontrolü
          if (permId && permissionVariations.includes(permId)) {
            return true;
          }
          
          // Name kontrolü
          if (permName && permissionVariations.includes(permName)) {
            return true;
          }
          
          return false;
        });
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
