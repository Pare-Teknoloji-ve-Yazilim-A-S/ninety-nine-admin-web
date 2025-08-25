import { apiClient } from './api/client';

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permission: {
    id: string;
    name: string;
    action: string;
    resource: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AssignPermissionsRequest {
  permissionIds: string[];
}

export interface RemovePermissionsRequest {
  permissionIds: string[];
}

class RolePermissionService {
  private baseUrl = '/admin/roles';

  /**
   * Bir rolün mevcut izinlerini getir
   */
  async getRolePermissions(roleId: string): Promise<RolePermission[]> {
    const response = await apiClient.get(`${this.baseUrl}/${roleId}/permissions`);
    
    console.log('🔧 Role Permissions API Response:', response);
    
    // API response yapısını kontrol et
    if (Array.isArray(response)) {
      // Direkt array response: [...]
      return response.map(permission => ({
        id: `temp-${permission.id}`,
        roleId: roleId,
        permissionId: permission.id,
        permission: permission,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    } else if (response && response.data && Array.isArray(response.data)) {
      // Standart paginated response: { data: [...], pagination: {...} }
      return response.data.map(permission => ({
        id: `temp-${permission.id}`,
        roleId: roleId,
        permissionId: permission.id,
        permission: permission,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    } else {
      return [];
    }
  }

  /**
   * Bir role yeni izinler ata
   */
  async assignPermissions(roleId: string, permissionIds: string[]): Promise<{ success: boolean; message: string }> {
    console.log('Assigning permissions:', { roleId, permissionIds });
    
    const response = await apiClient.post(`${this.baseUrl}/${roleId}/permissions`, {
      permissionIds
    });
    
    console.log('Assign permissions response:', response.data);
    return response.data || { success: true, message: 'Permissions assigned successfully' };
  }

  /**
   * Bir rolden izinleri kaldır
   */
  async removePermissions(roleId: string, permissionIds: string[]): Promise<{ success: boolean; message: string }> {
    console.log('Removing permissions:', { roleId, permissionIds });
    
    try {
      // Backend tek izin silme endpoint'ini destekliyor: DELETE /api/admin/roles/{roleId}/permissions/{permissionId}
      // Çoklu izin silme için her izni ayrı ayrı sil
      const deletePromises = permissionIds.map(permissionId => 
        apiClient.delete(`${this.baseUrl}/${roleId}/permissions/${permissionId}`)
      );
      
      await Promise.all(deletePromises);
      
      console.log('All permissions removed successfully');
      return { success: true, message: 'Permissions removed successfully' };
    } catch (error) {
      console.error('Error removing permissions:', error);
      throw error;
    }
  }

  /**
   * Bir rolün tüm izinlerini güncelle (mevcut izinleri kaldır, yeni izinleri ata)
   */
  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<{ success: boolean; message: string }> {
    console.log('Updating role permissions:', { roleId, permissionIds });
    
    try {
      // Önce mevcut izinleri al
      const currentPermissions = await this.getRolePermissions(roleId);
      const currentPermissionIds = currentPermissions.map(p => p.permissionId);
      
      console.log('Current permissions:', currentPermissionIds);
      
      // Kaldırılacak izinleri bul
      const permissionsToRemove = currentPermissionIds.filter(id => !permissionIds.includes(id));
      
      // Eklenmesi gereken izinleri bul
      const permissionsToAdd = permissionIds.filter(id => !currentPermissionIds.includes(id));
      
      console.log('Permissions to remove:', permissionsToRemove);
      console.log('Permissions to add:', permissionsToAdd);
      
      // İşlemleri sırayla yap (await ile)
      if (permissionsToRemove.length > 0) {
        console.log('Removing permissions...');
        await this.removePermissions(roleId, permissionsToRemove);
        console.log('Permissions removed successfully');
      }
      
      if (permissionsToAdd.length > 0) {
        console.log('Adding permissions...');
        await this.assignPermissions(roleId, permissionsToAdd);
        console.log('Permissions added successfully');
      }
      
      console.log('Role permissions updated successfully');
      return { success: true, message: 'Role permissions updated successfully' };
    } catch (error) {
      console.error('Error updating role permissions:', error);
      throw error;
    }
  }
}

export const rolePermissionService = new RolePermissionService();
