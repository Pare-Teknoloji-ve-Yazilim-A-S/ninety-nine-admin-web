// Role type definitions
export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleFilters {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: 'ASC' | 'DESC';
  orderColumn?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}