// Staff Service - Application Layer
import { BaseService } from './core/base.service'
import { apiClient } from './api/client'
import { apiConfig } from './config/api.config'
import { userService } from './user.service'
import {
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  StaffFilterParams,
  StaffListResponse,
  StaffStatsResponse,
  StaffProfileDto,
  StaffAssignmentDto,
  BulkStaffOperationDto,
  StaffAuditLogResponse,
  StaffExportDto,
  StaffImportDto,
  StaffHierarchyResponse,
  StaffPerformanceDto,
  StaffLeaveDto,
  StaffStatus,
  EmploymentType
} from './types/staff.types'
import {
  Department,
  Position,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentFilterParams,
  DepartmentListResponse,
  CreatePositionDto,
  UpdatePositionDto,
  PositionFilterParams,
  PositionListResponse,
  DepartmentTransferDto
} from './types/department.types'
import { ApiResponse, PaginatedResponse } from './core/types'
import { User } from './types/user.types'

class StaffService extends BaseService<Staff, CreateStaffDto, UpdateStaffDto> {
  protected baseEndpoint = '/admin/staff'

  constructor() {
    super('StaffService')
  }

  // Staff CRUD Operations
  async getAllStaff(params?: StaffFilterParams): Promise<PaginatedResponse<Staff>> {
    try {
      this.logger.info('Fetching all staff', params)

      const queryParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(key, String(v)))
            } else {
              queryParams.append(key, String(value))
            }
          }
        })
      }
      
      const queryString = queryParams.toString()
      const url = `${this.baseEndpoint}${queryString ? `?${queryString}` : ''}`
      
      const response = await apiClient.get<StaffListResponse>(url)

      this.logger.info('Staff list fetched successfully')
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        pagination: {
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages
        },
        success: response.success,
        message: response.message
      }
    } catch (error) {
      this.logger.error('Failed to fetch staff list', error)
      throw error
    }
  }

  async getStaffById(id: string | number): Promise<ApiResponse<Staff>> {
    try {
      this.logger.info('Fetching staff by ID', { id })

      const response = await apiClient.get<Staff>(`${this.baseEndpoint}/${id}`)

      this.logger.info('Staff fetched successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to fetch staff', error)
      throw error
    }
  }

  // Admin endpoint: GET /api/admin/staff/:id
  async getAdminStaffById(id: string | number): Promise<ApiResponse<any>> {
    try {
      this.logger.info('Fetching admin staff by ID', { id })

      const response = await apiClient.get<any>(`/api/admin/staff/${id}`)

      this.logger.info('Admin staff fetched successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to fetch admin staff', error)
      throw error
    }
  }

  async createStaff(data: CreateStaffDto): Promise<ApiResponse<Staff>> {
    try {
      this.logger.info('Creating new staff', data)

      // Use actual backend admin staff endpoint per spec: POST /api/admin/staff
      const response = await apiClient.post<Staff>('/api/admin/staff', data)

      this.logger.info('Staff created successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to create staff', error)
      throw error
    }
  }

  async updateStaff(id: string | number, data: UpdateStaffDto): Promise<ApiResponse<Staff>> {
    try {
      this.logger.info('Updating staff', { id, data })

      const response = await apiClient.put<Staff>(`${this.baseEndpoint}/${id}`, data)

      this.logger.info('Staff updated successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to update staff', error)
      throw error
    }
  }

  async deleteStaff(id: string | number): Promise<ApiResponse<void>> {
    try {
      this.logger.info('Deleting staff', { id })

      const response = await apiClient.delete<void>(`${this.baseEndpoint}/${id}`)

      this.logger.info('Staff deleted successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to delete staff', error)
      throw error
    }
  }

  // Admin endpoint: DELETE /api/admin/staff/:id
  async deleteAdminStaff(id: string | number): Promise<ApiResponse<void>> {
    try {
      this.logger.info('Deleting admin staff', { id })

      const response = await apiClient.delete<void>(`/api/admin/staff/${id}`)

      this.logger.info('Admin staff deleted successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to delete admin staff', error)
      throw error
    }
  }

  // Staff Profile Management
  async getStaffProfile(id: string | number): Promise<ApiResponse<StaffProfileDto>> {
    try {
      this.logger.info('Fetching staff profile', { id })

      const response = await apiClient.get<StaffProfileDto>(
        `${this.baseEndpoint}/${id}/profile`
      )

      this.logger.info('Staff profile fetched successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to fetch staff profile', error)
      throw error
    }
  }

  async updateStaffProfile(id: string | number, data: StaffProfileDto): Promise<ApiResponse<Staff>> {
    try {
      this.logger.info('Updating staff profile', { id, data })

      const response = await apiClient.put<Staff>(
        `${this.baseEndpoint}/${id}/profile`,
        data
      )

      this.logger.info('Staff profile updated successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to update staff profile', error)
      throw error
    }
  }

  // Staff Status Management
  async updateStaffStatus(id: string | number, status: StaffStatus): Promise<ApiResponse<Staff>> {
    try {
      this.logger.info('Updating staff status', { id, status })

      const response = await apiClient.patch<Staff>(
        `${this.baseEndpoint}/${id}/status`,
        { status }
      )

      this.logger.info('Staff status updated successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to update staff status', error)
      throw error
    }
  }

  async activateStaff(id: string | number): Promise<ApiResponse<Staff>> {
    return this.updateStaffStatus(id, StaffStatus.ACTIVE)
  }

  async deactivateStaff(id: string | number): Promise<ApiResponse<Staff>> {
    return this.updateStaffStatus(id, StaffStatus.INACTIVE)
  }

  async suspendStaff(id: string | number): Promise<ApiResponse<Staff>> {
    return this.updateStaffStatus(id, StaffStatus.SUSPENDED)
  }

  async terminateStaff(id: string | number): Promise<ApiResponse<Staff>> {
    return this.updateStaffStatus(id, StaffStatus.TERMINATED)
  }

  // Staff Assignment Management
  async assignStaffToDepartment(data: StaffAssignmentDto): Promise<ApiResponse<Staff>> {
    try {
      this.logger.info('Assigning staff to department', data)

      const response = await apiClient.post<Staff>(
        `${this.baseEndpoint}/assign-department`,
        data
      )

      this.logger.info('Staff assigned to department successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to assign staff to department', error)
      throw error
    }
  }

  async assignStaffToPosition(data: StaffAssignmentDto): Promise<ApiResponse<Staff>> {
    try {
      this.logger.info('Assigning staff to position', data)

      const response = await apiClient.post<Staff>(
        `${this.baseEndpoint}/assign-position`,
        data
      )

      this.logger.info('Staff assigned to position successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to assign staff to position', error)
      throw error
    }
  }

  async assignManager(staffId: string | number, managerId: string | number): Promise<ApiResponse<Staff>> {
    try {
      this.logger.info('Assigning manager to staff', { staffId, managerId })

      const response = await apiClient.post<Staff>(
        `${this.baseEndpoint}/${staffId}/assign-manager`,
        { managerId }
      )

      this.logger.info('Manager assigned successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to assign manager', error)
      throw error
    }
  }

  // Bulk Operations
  async bulkUpdateStaffStatus(data: BulkStaffOperationDto): Promise<ApiResponse<Staff[]>> {
    try {
      this.logger.info('Bulk updating staff status', data)

      const response = await apiClient.post<Staff[]>(
        `${this.baseEndpoint}/bulk/status`,
        data
      )

      this.logger.info('Bulk staff status update completed')
      return response
    } catch (error) {
      this.logger.error('Failed to bulk update staff status', error)
      throw error
    }
  }

  async bulkAssignDepartment(data: BulkStaffOperationDto): Promise<ApiResponse<Staff[]>> {
    try {
      this.logger.info('Bulk assigning staff to department', data)

      const response = await apiClient.post<Staff[]>(
        `${this.baseEndpoint}/bulk/assign-department`,
        data
      )

      this.logger.info('Bulk department assignment completed')
      return response
    } catch (error) {
      this.logger.error('Failed to bulk assign department', error)
      throw error
    }
  }

  async bulkDeleteStaff(staffIds: (string | number)[]): Promise<ApiResponse<void>> {
    try {
      this.logger.info('Bulk deleting staff', { staffIds })

      const response = await apiClient.post<void>(
        `${this.baseEndpoint}/bulk/delete`,
        { staffIds }
      )

      this.logger.info('Bulk staff deletion completed')
      return response
    } catch (error) {
      this.logger.error('Failed to bulk delete staff', error)
      throw error
    }
  }

  // Search and Filter
  async searchStaff(query: string, filters?: StaffFilterParams): Promise<PaginatedResponse<Staff>> {
    try {
      this.logger.info('Searching staff', { query, filters })

      const queryParams = new URLSearchParams()
      queryParams.append('q', query)
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(key, String(v)))
            } else {
              queryParams.append(key, String(value))
            }
          }
        })
      }
      
      const queryString = queryParams.toString()
      const url = `${this.baseEndpoint}/search${queryString ? `?${queryString}` : ''}`
      
      const response = await apiClient.get<StaffListResponse>(url)

      this.logger.info('Staff search completed')
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        pagination: {
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages
        },
        success: response.success,
        message: response.message
      }
    } catch (error) {
      this.logger.error('Failed to search staff', error)
      throw error
    }
  }

  async filterStaff(filters: StaffFilterParams): Promise<PaginatedResponse<Staff>> {
    try {
      this.logger.info('Filtering staff', filters)

      const queryParams = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(key, String(v)))
            } else {
              queryParams.append(key, String(value))
            }
          }
        })
      }
      
      const queryString = queryParams.toString()
      const url = `${this.baseEndpoint}/filter${queryString ? `?${queryString}` : ''}`
      
      const response = await apiClient.get<StaffListResponse>(url)

      this.logger.info('Staff filtering completed')
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        pagination: {
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages
        },
        success: response.success,
        message: response.message
      }
    } catch (error) {
      this.logger.error('Failed to filter staff', error)
      throw error
    }
  }

  // Admin search endpoint: GET /api/admin/staff/search
  async searchStaffAdmin(params: {
    q?: string
    positionTitle?: string
    employmentStatus?: string
    isOnDuty?: boolean
    isActive?: boolean
    isOnLeave?: boolean
    department?: string
    page?: number
    limit?: number
    orderColumn?: string
    orderBy?: 'ASC' | 'DESC'
  }): Promise<PaginatedResponse<Staff>> {
    try {
      this.logger.info('Admin search staff', params)

      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      })

      const url = `/api/admin/staff/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get<StaffListResponse>(url)
      const payload: any = response as any
      const list = payload?.data ?? payload?.results ?? []
      const total = payload?.total ?? payload?.pagination?.total ?? Array.isArray(list) ? list.length : 0
      const page = payload?.page ?? payload?.pagination?.page ?? 1
      const limit = payload?.limit ?? payload?.pagination?.limit ?? list.length
      const totalPages = payload?.totalPages ?? payload?.pagination?.totalPages ?? 1

      return {
        data: list,
        total,
        page,
        limit,
        totalPages,
        pagination: { total, page, limit, totalPages },
        success: payload?.success,
        message: payload?.message
      }
    } catch (error) {
      this.logger.error('Failed admin staff search', error)
      throw error
    }
  }

  // Statistics and Analytics
  async getStaffStats(): Promise<ApiResponse<StaffStatsResponse>> {
    try {
      this.logger.info('Fetching staff statistics')

      const response = await apiClient.get<StaffStatsResponse>(
        `${this.baseEndpoint}/stats`
      )

      this.logger.info('Staff statistics fetched successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to fetch staff statistics', error)
      throw error
    }
  }

  async getStaffCountByDepartment(): Promise<ApiResponse<Record<string, number>>> {
    try {
      this.logger.info('Fetching staff count by department')

      const response = await apiClient.get<Record<string, number>>(
        `${this.baseEndpoint}/stats/by-department`
      )

      this.logger.info('Staff count by department fetched successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to fetch staff count by department', error)
      throw error
    }
  }

  async getStaffCountByStatus(): Promise<ApiResponse<Record<StaffStatus, number>>> {
    try {
      this.logger.info('Fetching staff count by status')

      const response = await apiClient.get<Record<StaffStatus, number>>(
        `${this.baseEndpoint}/stats/by-status`
      )

      this.logger.info('Staff count by status fetched successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to fetch staff count by status', error)
      throw error
    }
  }

  // Staff Counts (Admin endpoints)
  async getTotalStaffCount(): Promise<number> {
    try {
      this.logger.info('Fetching total staff count')
      const response = await apiClient.get<{ count: number }>(`/api/admin/staff/count/total`)
      return (response.data as any)?.count ?? 0
    } catch (error) {
      this.logger.error('Failed to fetch total staff count', error)
      throw error
    }
  }

  async getActiveStaffCount(): Promise<number> {
    try {
      this.logger.info('Fetching active staff count')
      const response = await apiClient.get<{ count: number }>(`/api/admin/staff/count/active`)
      return (response.data as any)?.count ?? 0
    } catch (error) {
      this.logger.error('Failed to fetch active staff count', error)
      throw error
    }
  }

  async getOnLeaveStaffCount(): Promise<number> {
    try {
      this.logger.info('Fetching on-leave staff count')
      const response = await apiClient.get<{ count: number }>(`/api/admin/staff/count/on-leave`)
      return (response.data as any)?.count ?? 0
    } catch (error) {
      this.logger.error('Failed to fetch on-leave staff count', error)
      throw error
    }
  }

  // Hierarchy and Reporting
  async getStaffHierarchy(departmentId?: string): Promise<ApiResponse<StaffHierarchyResponse>> {
    try {
      this.logger.info('Fetching staff hierarchy', { departmentId })

      const queryParams = new URLSearchParams()
      if (departmentId) {
        queryParams.append('departmentId', String(departmentId))
      }
      
      const queryString = queryParams.toString()
      const url = `${this.baseEndpoint}/hierarchy${queryString ? `?${queryString}` : ''}`
      
      const response = await apiClient.get<StaffHierarchyResponse>(url)

      this.logger.info('Staff hierarchy fetched successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to fetch staff hierarchy', error)
      throw error
    }
  }

  async getDirectReports(managerId: string | number): Promise<ApiResponse<Staff[]>> {
    try {
      this.logger.info('Fetching direct reports', { managerId })

      const response = await apiClient.get<Staff[]>(
        `${this.baseEndpoint}/${managerId}/direct-reports`
      )

      this.logger.info('Direct reports fetched successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to fetch direct reports', error)
      throw error
    }
  }

  // Performance Management
  async updateStaffPerformance(id: string | number, data: StaffPerformanceDto): Promise<ApiResponse<Staff>> {
    try {
      this.logger.info('Updating staff performance', { id, data })

      const response = await apiClient.put<Staff>(
        `${this.baseEndpoint}/${id}/performance`,
        data
      )

      this.logger.info('Staff performance updated successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to update staff performance', error)
      throw error
    }
  }

  // Leave Management
  async requestLeave(id: string | number, data: StaffLeaveDto): Promise<ApiResponse<void>> {
    try {
      this.logger.info('Requesting leave for staff', { id, data })

      const response = await apiClient.post<void>(
        `${this.baseEndpoint}/${id}/leave`,
        data
      )

      this.logger.info('Leave request submitted successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to request leave', error)
      throw error
    }
  }

  async approveLeave(leaveId: string | number): Promise<ApiResponse<void>> {
    try {
      this.logger.info('Approving leave request', { leaveId })

      const response = await apiClient.patch<void>(
        `${this.baseEndpoint}/leave/${leaveId}/approve`
      )

      this.logger.info('Leave request approved successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to approve leave request', error)
      throw error
    }
  }

  async rejectLeave(leaveId: string | number, reason?: string): Promise<ApiResponse<void>> {
    try {
      this.logger.info('Rejecting leave request', { leaveId, reason })

      const response = await apiClient.patch<void>(
        `${this.baseEndpoint}/leave/${leaveId}/reject`,
        { reason }
      )

      this.logger.info('Leave request rejected successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to reject leave request', error)
      throw error
    }
  }

  // Audit Logs
  async getStaffAuditLogs(id: string | number): Promise<ApiResponse<StaffAuditLogResponse[]>> {
    try {
      this.logger.info('Fetching staff audit logs', { id })

      const response = await apiClient.get<StaffAuditLogResponse[]>(
        `${this.baseEndpoint}/${id}/audit-logs`
      )

      this.logger.info('Staff audit logs fetched successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to fetch staff audit logs', error)
      throw error
    }
  }

  // Export and Import
  async exportStaff(params?: StaffExportDto): Promise<Blob> {
    try {
      this.logger.info('Exporting staff data', params)

      const queryParams = new URLSearchParams()
      if (params?.format) queryParams.append('format', params.format)
      if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value))
          }
        })
      }
      
      const queryString = queryParams.toString()
      const url = `${this.baseEndpoint}/export${queryString ? `?${queryString}` : ''}`
      
      // Note: responseType 'blob' is not supported in current RequestConfig
      // This will need to be handled differently or the RequestConfig type needs to be extended
      const response = await apiClient.get(url)

      this.logger.info('Staff data exported successfully')
      return response.data
    } catch (error) {
      this.logger.error('Failed to export staff data', error)
      throw error
    }
  }

  async importStaff(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ success: number; errors: any[] }>> {
    try {
      this.logger.info('Importing staff data')

      const formData = new FormData()
      formData.append('file', file)

      // Note: headers and onUploadProgress are not supported in current RequestConfig
      // This will need to be handled differently or the RequestConfig type needs to be extended
      const response = await apiClient.post<{ success: number; errors: any[] }>(
        `${this.baseEndpoint}/import`,
        formData
      )
      
      // Progress tracking would need to be implemented differently
      if (onProgress) {
        onProgress(100) // Simplified progress indication
      }

      this.logger.info('Staff data imported successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to import staff data', error)
      throw error
    }
  }

  // Department Management
  async getAllDepartments(params?: DepartmentFilterParams): Promise<PaginatedResponse<Department>> {
    try {
      this.logger.info('Fetching all departments', params)

      const queryParams = new URLSearchParams()
      if (params?.search) queryParams.append('search', params.search)
      if (params?.page) queryParams.append('page', String(params.page))
      if (params?.limit) queryParams.append('limit', String(params.limit))
      
      const queryString = queryParams.toString()
      const url = `/api/departments${queryString ? `?${queryString}` : ''}`
      
      const response = await apiClient.get<DepartmentListResponse>(url)

      this.logger.info('Departments fetched successfully')
      return {
        data: response.data.departments,
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        totalPages: response.data.pagination.totalPages,
        pagination: response.data.pagination,
        success: response.success,
        message: response.message
      }
    } catch (error) {
      this.logger.error('Failed to fetch departments', error)
      throw error
    }
  }

  async getDepartmentById(id: string | number): Promise<ApiResponse<Department>> {
    try {
      this.logger.info('Fetching department by ID', { id })

      const response = await apiClient.get<Department>(`/api/departments/${id}`)

      this.logger.info('Department fetched successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to fetch department', error)
      throw error
    }
  }

  async createDepartment(data: CreateDepartmentDto): Promise<ApiResponse<Department>> {
    try {
      this.logger.info('Creating new department', data)

      const response = await apiClient.post<Department>('/api/departments', data)

      this.logger.info('Department created successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to create department', error)
      throw error
    }
  }

  async updateDepartment(id: string | number, data: UpdateDepartmentDto): Promise<ApiResponse<Department>> {
    try {
      this.logger.info('Updating department', { id, data })

      const response = await apiClient.put<Department>(`/api/departments/${id}`, data)

      this.logger.info('Department updated successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to update department', error)
      throw error
    }
  }

  async deleteDepartment(id: string | number): Promise<ApiResponse<void>> {
    try {
      this.logger.info('Deleting department', { id })

      const response = await apiClient.delete<void>(`/api/departments/${id}`)

      this.logger.info('Department deleted successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to delete department', error)
      throw error
    }
  }

  async transferStaffToDepartment(data: DepartmentTransferDto): Promise<ApiResponse<Staff[]>> {
    try {
      this.logger.info('Transferring staff to department', data)

      const response = await apiClient.post<Staff[]>(
        '/api/departments/transfer-staff',
        data
      )

      this.logger.info('Staff transferred to department successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to transfer staff to department', error)
      throw error
    }
  }

  // Position Management
  async getAllPositions(params?: PositionFilterParams): Promise<PaginatedResponse<Position>> {
    try {
      this.logger.info('Fetching all positions', params)

      const queryParams = new URLSearchParams()
      if (params?.search) queryParams.append('search', params.search)
      if (params?.page) queryParams.append('page', String(params.page))
      if (params?.limit) queryParams.append('limit', String(params.limit))
      if (params?.departmentId) queryParams.append('departmentId', String(params.departmentId))
      
      const queryString = queryParams.toString()
      const url = `/api/positions${queryString ? `?${queryString}` : ''}`
      
      const response = await apiClient.get<PositionListResponse>(url)

      this.logger.info('Positions fetched successfully')
      return {
        data: response.data.positions,
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        totalPages: response.data.pagination.totalPages,
        pagination: response.data.pagination,
        success: response.success,
        message: response.message
      }
    } catch (error) {
      this.logger.error('Failed to fetch positions', error)
      throw error
    }
  }

  async getPositionById(id: string | number): Promise<ApiResponse<Position>> {
    try {
      this.logger.info('Fetching position by ID', { id })

      const response = await apiClient.get<Position>(`/api/positions/${id}`)

      this.logger.info('Position fetched successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to fetch position', error)
      throw error
    }
  }

  async createPosition(data: CreatePositionDto): Promise<ApiResponse<Position>> {
    try {
      this.logger.info('Creating new position', data)

      const response = await apiClient.post<Position>('/api/positions', data)

      this.logger.info('Position created successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to create position', error)
      throw error
    }
  }

  async updatePosition(id: string | number, data: UpdatePositionDto): Promise<ApiResponse<Position>> {
    try {
      this.logger.info('Updating position', { id, data })

      const response = await apiClient.put<Position>(`/api/positions/${id}`, data)

      this.logger.info('Position updated successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to update position', error)
      throw error
    }
  }

  async deletePosition(id: string | number): Promise<ApiResponse<void>> {
    try {
      this.logger.info('Deleting position', { id })

      const response = await apiClient.delete<void>(`/api/positions/${id}`)

      this.logger.info('Position deleted successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to delete position', error)
      throw error
    }
  }

  // Integration with User Service
  async convertUserToStaff(userId: string | number, staffData: Omit<CreateStaffDto, 'userId'>): Promise<ApiResponse<Staff>> {
    try {
      this.logger.info('Converting user to staff', { userId, staffData })

      const response = await apiClient.post<Staff>(
        `${this.baseEndpoint}/convert-user/${userId}`,
        staffData
      )

      this.logger.info('User converted to staff successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to convert user to staff', error)
      throw error
    }
  }

  async syncWithUserService(staffId: string | number): Promise<ApiResponse<Staff>> {
    try {
      this.logger.info('Syncing staff with user service', { staffId })

      const response = await apiClient.post<Staff>(
        `${this.baseEndpoint}/${staffId}/sync-user`
      )

      this.logger.info('Staff synced with user service successfully')
      return response
    } catch (error) {
      this.logger.error('Failed to sync staff with user service', error)
      throw error
    }
  }
}

export const staffService = new StaffService()
export default staffService