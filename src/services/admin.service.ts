import { BaseService } from './core/base.service'
import { apiClient } from './api/client'
import type { EnumsResponse } from './types/ui.types'

class AdminService extends BaseService<any> {
	protected baseEndpoint = '/admin'

	constructor() {
		super('AdminService')
	}

	async getEnums(): Promise<EnumsResponse> {
		try {
			this.logger.info('Fetching enums')
			// Enums are served from root: GET /enums
			const res = await apiClient.get<EnumsResponse>(`/enums`)
			return res as any
		} catch (error) {
			this.logger.error('Failed to fetch enums', error)
			throw error
		}
	}
}

export const adminService = new AdminService()
export default adminService


