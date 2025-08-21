'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Search } from 'lucide-react';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { RolePermission } from '@/services/role-permission.service';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/services/permission.service';
import { useToast } from '@/hooks/useToast';

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: {
    id: string;
    name: string;
    description?: string;
  } | null;
}

export default function RolePermissionsModal({ isOpen, onClose, role }: RolePermissionsModalProps) {
  const [selectedCurrentPermissions, setSelectedCurrentPermissions] = useState<string[]>([]);
  const [selectedAvailablePermissions, setSelectedAvailablePermissions] = useState<string[]>([]);
  const [searchCurrent, setSearchCurrent] = useState('');
  const [searchAvailable, setSearchAvailable] = useState('');
  
  // Modal içindeki geçici state'ler (API'ye gönderilmeden önce)
  const [tempRolePermissions, setTempRolePermissions] = useState<RolePermission[]>([]);
  const [tempAvailablePermissions, setTempAvailablePermissions] = useState<Permission[]>([]);

  const {
    rolePermissions,
    loading: rolePermissionsLoading,
    error: rolePermissionsError,
    fetchRolePermissions,
    updateRolePermissions
  } = useRolePermissions();

  const {
    permissions,
    permissionsByResource,
    loading: permissionsLoading,
    error: permissionsError
  } = usePermissions();

  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Modal açıldığında rol izinlerini yükle ve geçici state'leri başlat
  useEffect(() => {
    if (isOpen && role?.id) {
      fetchRolePermissions(role.id);
    }
  }, [isOpen, role?.id, fetchRolePermissions]);

  // rolePermissions ve permissions değiştiğinde geçici state'leri güncelle
  useEffect(() => {
    if (rolePermissions.length > 0 || permissions.length > 0) {
      setTempRolePermissions([...rolePermissions]);
      
      // Atanabilecek izinleri hesapla (mevcut olmayanlar)
      const currentPermissionIds = rolePermissions.map(rp => rp.permissionId);
      const available = permissions.filter(permission => !currentPermissionIds.includes(permission.id));
      setTempAvailablePermissions(available);
    }
  }, [rolePermissions, permissions]);

  // Modal kapandığında state'leri temizle
  useEffect(() => {
    if (!isOpen) {
      setSelectedCurrentPermissions([]);
      setSelectedAvailablePermissions([]);
      setSearchCurrent('');
      setSearchAvailable('');
      setTempRolePermissions([]);
      setTempAvailablePermissions([]);
    }
  }, [isOpen]);

  // Mevcut izinleri filtrele
  const filteredCurrentPermissions = tempRolePermissions.filter(rolePerm => 
    rolePerm?.permission?.name?.toLowerCase().includes(searchCurrent.toLowerCase()) ||
    rolePerm?.permission?.resource?.toLowerCase().includes(searchCurrent.toLowerCase())
  );

  // Mevcut izinleri resource'a göre grupla
  const groupedCurrentPermissions = filteredCurrentPermissions.reduce((groups, rolePerm) => {
    const resource = rolePerm?.permission?.resource;
    if (resource && !groups[resource]) {
      groups[resource] = [];
    }
    if (resource) {
      groups[resource].push(rolePerm);
    }
    return groups;
  }, {} as Record<string, RolePermission[]>);

  // Atanabilecek izinleri filtrele
  const filteredAvailablePermissions = tempAvailablePermissions.filter(permission => 
    permission?.name?.toLowerCase().includes(searchAvailable.toLowerCase()) ||
    permission?.resource?.toLowerCase().includes(searchAvailable.toLowerCase())
  );

  // Atanabilecek izinleri resource'a göre grupla
  const groupedAvailablePermissions = filteredAvailablePermissions.reduce((groups, permission) => {
    const resource = permission?.resource;
    if (resource && !groups[resource]) {
      groups[resource] = [];
    }
    if (resource) {
      groups[resource].push(permission);
    }
    return groups;
  }, {} as Record<string, Permission[]>);

  // İzinleri sağa taşı (mevcut → atanabilecek)
  const moveToAvailable = () => {
    if (selectedCurrentPermissions.length === 0) return;
    
    // Seçili izinleri bul
    const permissionsToMove = tempRolePermissions.filter(rp => 
      selectedCurrentPermissions.includes(rp.permissionId)
    );
    
    // Mevcut izinlerden kaldır
    setTempRolePermissions(prev => 
      prev.filter(rp => !selectedCurrentPermissions.includes(rp.permissionId))
    );
    
    // Atanabilecek izinlere ekle
    setTempAvailablePermissions(prev => [
      ...prev,
      ...permissionsToMove.map(rp => rp.permission).filter((permission): permission is Permission => 
        Boolean(permission) && 
        typeof permission === 'object' && 
        'id' in permission && 
        'name' in permission && 
        'action' in permission && 
        'resource' in permission
      )
    ]);
    
    // Seçimi temizle
    setSelectedCurrentPermissions([]);
  };

  // İzinleri sola taşı (atanabilecek → mevcut)
  const moveToCurrent = () => {
    if (selectedAvailablePermissions.length === 0) return;
    
    // Seçili izinleri bul
    const permissionsToMove = tempAvailablePermissions.filter(p => 
      selectedAvailablePermissions.includes(p.id)
    );
    
    // Atanabilecek izinlerden kaldır
    setTempAvailablePermissions(prev => 
      prev.filter(p => !selectedAvailablePermissions.includes(p.id))
    );
    
    // Mevcut izinlere ekle (RolePermission formatında)
    setTempRolePermissions(prev => [
      ...prev,
      ...permissionsToMove.map(permission => ({
        id: `temp-${permission.id}`,
        roleId: role?.id || '',
        permissionId: permission.id,
        permission: permission,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
    ]);
    
    // Seçimi temizle
    setSelectedAvailablePermissions([]);
  };

  // Tümünü seç/kaldır
  const toggleAllCurrent = () => {
    if (selectedCurrentPermissions.length === filteredCurrentPermissions.length) {
      setSelectedCurrentPermissions([]);
    } else {
      setSelectedCurrentPermissions(filteredCurrentPermissions.map(rp => rp.permissionId));
    }
  };

  const toggleAllAvailable = () => {
    if (selectedAvailablePermissions.length === filteredAvailablePermissions.length) {
      setSelectedAvailablePermissions([]);
    } else {
      setSelectedAvailablePermissions(filteredAvailablePermissions.map(p => p.id));
    }
  };

  // Kaydet
  const handleSave = async () => {
    if (!role?.id) return;

    // Geçici state'lerden final permission ID'lerini al
    const finalPermissionIds = tempRolePermissions.map(rp => rp.permissionId);
    
    try {
      await updateRolePermissions(finalPermissionIds, role.id);
      showSuccessToast('Rol izinleri başarıyla güncellendi');
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      showErrorToast('Rol izinleri güncellenirken hata oluştu');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
              Rol İzinleri Yönetimi
            </h3>
            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
              {role?.name} - İzinleri düzenleyin
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          {rolePermissionsLoading || permissionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
              <span className="ml-2 text-text-light-secondary dark:text-text-secondary">
                İzinler yükleniyor...
              </span>
            </div>
          ) : rolePermissionsError || permissionsError ? (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">
                {rolePermissionsError || permissionsError}
              </p>
            </div>
          ) : (
                         <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
               {/* Mevcut İzinler */}
               <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-text-on-light dark:text-text-on-dark">
                    Mevcut İzinler ({filteredCurrentPermissions.length})
                  </h4>
                  <button
                    onClick={toggleAllCurrent}
                    className="text-xs text-primary-gold hover:text-primary-gold/80"
                  >
                    {selectedCurrentPermissions.length === filteredCurrentPermissions.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="İzin ara..."
                    value={searchCurrent}
                    onChange={(e) => setSearchCurrent(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                  />
                </div>

                                 {/* İzin Listesi */}
                 <div className="border border-gray-200 dark:border-gray-600 rounded-md max-h-[500px] overflow-y-auto p-4">
                   {filteredCurrentPermissions.length > 0 ? (
                     <div className="space-y-4">
                                               {Object.entries(groupedCurrentPermissions).map(([resource, permissions]) => (
                          <details key={resource} className="group">
                           <summary className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                             <div className="flex items-center space-x-2">
                               <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                 {resource}
                               </span>
                               <span className="text-xs text-text-light-secondary dark:text-text-secondary bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                                 {permissions.length}
                               </span>
                             </div>
                             <div className="text-text-light-secondary dark:text-text-secondary group-open:rotate-180 transition-transform">
                               ▼
                             </div>
                           </summary>
                                                               <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                             {permissions.map((rolePerm) => (
                               rolePerm?.permission ? (
                                                               <div
                                  key={rolePerm.permissionId}
                                  className={`p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-h-[80px] ${
                                    selectedCurrentPermissions.includes(rolePerm.permissionId)
                                      ? 'bg-primary-gold-light/20 border-primary-gold/30 ring-2 ring-primary-gold/20'
                                      : ''
                                  }`}
                                 onClick={() => {
                                   setSelectedCurrentPermissions(prev =>
                                     prev.includes(rolePerm.permissionId)
                                       ? prev.filter(id => id !== rolePerm.permissionId)
                                       : [...prev, rolePerm.permissionId]
                                   );
                                 }}
                               >
                                                                   <div className="flex items-start justify-between h-full">
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-text-on-light dark:text-text-on-dark leading-tight mb-2">
                                        {rolePerm.permission.name}
                                      </div>
                                      <div className="text-xs text-text-light-secondary dark:text-text-secondary">
                                        <span className="inline-block bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                          {rolePerm.permission.action}
                                        </span>
                                      </div>
                                    </div>
                                   {selectedCurrentPermissions.includes(rolePerm.permissionId) && (
                                     <Check className="w-4 h-4 text-primary-gold flex-shrink-0 ml-2" />
                                   )}
                                 </div>
                               </div>
                               ) : null
                             ))}
                           </div>
                         </details>
                       ))}
                     </div>
                   ) : (
                     <div className="p-8 text-center text-text-light-secondary dark:text-text-secondary">
                       {searchCurrent ? 'Arama sonucu bulunamadı' : 'Henüz izin atanmamış'}
                     </div>
                   )}
                 </div>
              </div>

              {/* Transfer Buttons */}
              <div className="flex lg:flex-col items-center justify-center gap-4 lg:gap-2">
                <button
                  onClick={moveToAvailable}
                  disabled={selectedCurrentPermissions.length === 0}
                  className="p-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Seçili izinleri kaldır"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={moveToCurrent}
                  disabled={selectedAvailablePermissions.length === 0}
                  className="p-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Seçili izinleri ekle"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

                             {/* Atanabilecek İzinler */}
               <div className="lg:col-span-2">
                                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-medium text-text-on-light dark:text-text-on-dark">
                            Atanabilecek İzinler ({filteredAvailablePermissions.length})
                          </h4>
                  <button
                    onClick={toggleAllAvailable}
                    className="text-xs text-primary-gold hover:text-primary-gold/80"
                  >
                                                {selectedAvailablePermissions.length === filteredAvailablePermissions.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="İzin ara..."
                    value={searchAvailable}
                    onChange={(e) => setSearchAvailable(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                  />
                </div>

                                                                                                                                 {/* İzin Listesi */}
                         <div className="border border-gray-200 dark:border-gray-600 rounded-md max-h-[500px] overflow-y-auto p-4">
                           {filteredAvailablePermissions.length > 0 ? (
                             <div className="space-y-4">
                                                               {Object.entries(groupedAvailablePermissions).map(([resource, permissions]) => (
                                  <details key={resource} className="group">
                                   <summary className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                     <div className="flex items-center space-x-2">
                                       <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                         {resource}
                                       </span>
                                       <span className="text-xs text-text-light-secondary dark:text-text-secondary bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                                         {permissions.length}
                                       </span>
                                     </div>
                                     <div className="text-text-light-secondary dark:text-text-secondary group-open:rotate-180 transition-transform">
                                       ▼
                                     </div>
                                   </summary>
                                   <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                     {permissions.map((permission) => (
                                       permission ? (
                                                                               <div
                                          key={permission.id}
                                          className={`p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-h-[80px] ${
                                            selectedAvailablePermissions.includes(permission.id)
                                              ? 'bg-primary-gold-light/20 border-primary-gold/30 ring-2 ring-primary-gold/20'
                                              : ''
                                          }`}
                                         onClick={() => {
                                           setSelectedAvailablePermissions(prev =>
                                             prev.includes(permission.id)
                                               ? prev.filter(id => id !== permission.id)
                                               : [...prev, permission.id]
                                           );
                                         }}
                                       >
                                                                                   <div className="flex items-start justify-between h-full">
                                            <div className="flex-1 min-w-0">
                                              <div className="text-sm font-medium text-text-on-light dark:text-text-on-dark leading-tight mb-2">
                                                {permission.name}
                                              </div>
                                              <div className="text-xs text-text-light-secondary dark:text-text-secondary">
                                                <span className="inline-block bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                                  {permission.action}
                                                </span>
                                              </div>
                                            </div>
                                           {selectedAvailablePermissions.includes(permission.id) && (
                                             <Check className="w-4 h-4 text-primary-gold flex-shrink-0 ml-2" />
                                           )}
                                         </div>
                                       </div>
                                       ) : null
                                     ))}
                                   </div>
                                 </details>
                               ))}
                             </div>
                           ) : (
                             <div className="p-8 text-center text-text-light-secondary dark:text-text-secondary">
                               {searchAvailable ? 'Arama sonucu bulunamadı' : 'Atanabilecek izin kalmadı'}
                             </div>
                           )}
                         </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={rolePermissionsLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-gold rounded-md hover:bg-primary-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {rolePermissionsLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
