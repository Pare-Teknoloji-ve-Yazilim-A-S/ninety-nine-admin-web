// Base Service - Application Layer
import { apiClient } from '../api/client';
import { ApiResponse, PaginatedResponse, FilterParams, Repository } from './types';
import { Logger, createLogger } from '../utils/logger';

export abstract class BaseService<TEntity, TCreateDto = Partial<TEntity>, TUpdateDto = Partial<TEntity>>
    implements Repository<TEntity, TCreateDto, TUpdateDto> {

    protected logger: Logger;
    protected abstract baseEndpoint: string;

    constructor(serviceName: string) {
        this.logger = createLogger(serviceName);
    }

    /**
     * Tüm kayıtları getirir (pagination ile)
     */
    async getAll(params?: FilterParams): Promise<PaginatedResponse<TEntity>> {
        this.logger.info(`Fetching all ${this.baseEndpoint}`, params);

        const queryParams = this.buildQueryParams(params);
        const response = await apiClient.get<PaginatedResponse<TEntity>>(
            `${this.baseEndpoint}${queryParams}`
        );

        this.logger.info(`Fetched ${response.data.data.length} items`);
        return response.data;
    }

    /**
     * ID'ye göre tek kayıt getirir
     */
    async getById(id: string | number): Promise<ApiResponse<TEntity>> {
        this.logger.info(`Fetching ${this.baseEndpoint} with ID: ${id}`);

        const response = await apiClient.get<TEntity>(`${this.baseEndpoint}/${id}`);

        this.logger.info(`Fetched ${this.baseEndpoint} successfully`);
        return response;
    }

    /**
     * Yeni kayıt oluşturur
     */
    async create(data: TCreateDto): Promise<ApiResponse<TEntity>> {
        this.logger.info(`Creating new ${this.baseEndpoint}`, data);

        const response = await apiClient.post<TEntity>(this.baseEndpoint, data);

        this.logger.info(`Created ${this.baseEndpoint} successfully`);
        return response;
    }

    /**
     * Mevcut kaydı günceller
     */
    async update(id: string | number, data: TUpdateDto): Promise<ApiResponse<TEntity>> {
        this.logger.info(`Updating ${this.baseEndpoint} with ID: ${id}`, data);

        const response = await apiClient.put<TEntity>(`${this.baseEndpoint}/${id}`, data);

        this.logger.info(`Updated ${this.baseEndpoint} successfully`);
        return response;
    }

    /**
     * Partial update (PATCH)
     */
    async patch(id: string | number, data: Partial<TUpdateDto>): Promise<ApiResponse<TEntity>> {
        this.logger.info(`Patching ${this.baseEndpoint} with ID: ${id}`, data);

        const response = await apiClient.patch<TEntity>(`${this.baseEndpoint}/${id}`, data);

        this.logger.info(`Patched ${this.baseEndpoint} successfully`);
        return response;
    }

    /**
     * Kaydı siler
     */
    async delete(id: string | number): Promise<ApiResponse<void>> {
        this.logger.info(`Deleting ${this.baseEndpoint} with ID: ${id}`);

        const response = await apiClient.delete<void>(`${this.baseEndpoint}/${id}`);

        this.logger.info(`Deleted ${this.baseEndpoint} successfully`);
        return response;
    }

    /**
     * Bulk operations
     */
    async bulkCreate(data: TCreateDto[]): Promise<ApiResponse<TEntity[]>> {
        this.logger.info(`Bulk creating ${data.length} ${this.baseEndpoint} items`);

        const response = await apiClient.post<TEntity[]>(`${this.baseEndpoint}/bulk`, data);

        this.logger.info(`Bulk created ${this.baseEndpoint} successfully`);
        return response;
    }

    async bulkUpdate(updates: Array<{ id: string | number; data: TUpdateDto }>): Promise<ApiResponse<TEntity[]>> {
        this.logger.info(`Bulk updating ${updates.length} ${this.baseEndpoint} items`);

        const response = await apiClient.put<TEntity[]>(`${this.baseEndpoint}/bulk`, updates);

        this.logger.info(`Bulk updated ${this.baseEndpoint} successfully`);
        return response;
    }

    async bulkDelete(ids: (string | number)[]): Promise<ApiResponse<void>> {
        this.logger.info(`Bulk deleting ${ids.length} ${this.baseEndpoint} items`);

        const response = await apiClient.delete<void>(`${this.baseEndpoint}/bulk`, {
            data: { ids }
        } as any);

        this.logger.info(`Bulk deleted ${this.baseEndpoint} successfully`);
        return response;
    }

    /**
     * Search functionality
     */
    async search(query: string, filters?: FilterParams): Promise<PaginatedResponse<TEntity>> {
        this.logger.info(`Searching ${this.baseEndpoint} with query: ${query}`, filters);

        const params = { ...filters, search: query };
        const queryParams = this.buildQueryParams(params);

        const response = await apiClient.get<PaginatedResponse<TEntity>>(
            `${this.baseEndpoint}/search${queryParams}`
        );

        this.logger.info(`Search returned ${response.data.data.length} results`);
        return response.data;
    }

    /**
     * Count records
     */
    async count(filters?: Omit<FilterParams, 'page' | 'limit'>): Promise<ApiResponse<number>> {
        this.logger.info(`Counting ${this.baseEndpoint} records`, filters);

        const queryParams = this.buildQueryParams(filters);
        const response = await apiClient.get<number>(`${this.baseEndpoint}/count${queryParams}`);

        this.logger.info(`Count result: ${response.data}`);
        return response;
    }

    /**
     * Check if record exists
     */
    async exists(id: string | number): Promise<ApiResponse<boolean>> {
        this.logger.info(`Checking if ${this.baseEndpoint} exists with ID: ${id}`);

        const response = await apiClient.get<boolean>(`${this.baseEndpoint}/${id}/exists`);

        this.logger.info(`Exists check result: ${response.data}`);
        return response;
    }

    /**
     * Upload file for entity
     */
    async uploadFile(
        id: string | number,
        file: File,
        fieldName: string = 'file',
        onProgress?: (progress: number) => void
    ): Promise<ApiResponse<TEntity>> {
        this.logger.info(`Uploading file for ${this.baseEndpoint} with ID: ${id}`);

        const response = await apiClient.uploadFile<TEntity>(
            `${this.baseEndpoint}/${id}/upload/${fieldName}`,
            file,
            onProgress
        );

        this.logger.info(`File uploaded successfully`);
        return response;
    }

    /**
     * Query parametrelerini build eder
     */
    protected buildQueryParams(params?: Record<string, any>): string {
        if (!params || Object.keys(params).length === 0) {
            return '';
        }

        const cleanParams = Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        return cleanParams ? `?${cleanParams}` : '';
    }

    /**
     * Cache key generator
     */
    protected getCacheKey(method: string, ...args: any[]): string {
        const argsString = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join('_');

        return `${this.baseEndpoint}_${method}_${argsString}`;
    }

    /**
     * Generic error handler
     */
    protected handleError(error: any, operation: string): never {
        this.logger.error(`Error during ${operation}:`, error);
        throw error;
    }
} 