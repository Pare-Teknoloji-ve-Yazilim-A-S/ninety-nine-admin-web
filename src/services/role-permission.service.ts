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
    const response = await apiClient.post(`${this.baseUrl}/${roleId}/permissions`, {
      permissionIds
    });
    
    return response.data || { success: true, message: 'Permissions assigned successfully' };
  }

  /**
   * Bir rolden izinleri kaldır
   */
  async removePermissions(roleId: string, permissionIds: string[]): Promise<{ success: boolean; message: string }> {
    const params = new URLSearchParams();
    permissionIds.forEach(id => params.append('permissionIds', id));
    
    const response = await apiClient.delete(`${this.baseUrl}/${roleId}/permissions?${params.toString()}`);
    
    return response.data || { success: true, message: 'Permissions removed successfully' };
  }

  /**
   * Bir rolün tüm izinlerini güncelle (mevcut izinleri kaldır, yeni izinleri ata)
   */
  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<{ success: boolean; message: string }> {
    // Önce mevcut izinleri al
    const currentPermissions = await this.getRolePermissions(roleId);
    const currentPermissionIds = currentPermissions.map(p => p.permissionId);
    
    // Kaldırılacak izinleri bul
    const permissionsToRemove = currentPermissionIds.filter(id => !permissionIds.includes(id));
    
    // Eklenmesi gereken izinleri bul
    const permissionsToAdd = permissionIds.filter(id => !currentPermissionIds.includes(id));
    
    // İşlemleri yap
    if (permissionsToRemove.length > 0) {
      await this.removePermissions(roleId, permissionsToRemove);
    }
    
    if (permissionsToAdd.length > 0) {
      await this.assignPermissions(roleId, permissionsToAdd);
    }
    
    return { success: true, message: 'Role permissions updated successfully' };
  }
}

export const rolePermissionService = new RolePermissionService();
