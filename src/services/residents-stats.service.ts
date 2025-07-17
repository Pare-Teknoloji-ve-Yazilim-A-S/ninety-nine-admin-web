import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';

export const residentsStatsService = {
  async getGoldResidentsCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(apiConfig.endpoints.admin.goldResidentsCount);
    const count = response?.data?.count ?? 0;
    return count;
  },
  async getTotalResidentsCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(apiConfig.endpoints.admin.activeResidentsCount);
    const count = response?.data?.count ?? 0;
    return count;
  },
  async getActiveUsersCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(apiConfig.endpoints.admin.activeUsersCount);
    const count = response?.data?.count ?? 0;
    return count;
  },
  async getTenantsCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(apiConfig.endpoints.admin.tenantsCount);
    const count = response?.data?.count ?? 0;
    return count;
  },
  async getOwnersCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(apiConfig.endpoints.admin.ownersCount);
    const count = response?.data?.count ?? 0;
    return count;
  },
}; 