import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';

export const residentsStatsService = {
  async getGoldResidentsCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(apiConfig.endpoints.admin.goldResidentsCount);
    const { count } = response as any;
    return count;
  },
  async getTotalResidentsCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(apiConfig.endpoints.admin.activeResidentsCount);
    const { count } = response as any;
    return count;
  },
  async getActiveUsersCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(apiConfig.endpoints.admin.activeUsersCount);
    const { count } = response as any;
    return count;
  },
  async getTenantsCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(apiConfig.endpoints.admin.tenantsCount);
    const { count } = response as any;
    return count;
  },
  async getOwnersCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(apiConfig.endpoints.admin.ownersCount);
    const { count } = response as any;
    return count;
  },
}; 