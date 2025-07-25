// Core Types - Clean Architecture Domain Layer
export interface BaseEntity {
    id: string | number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T = any> {
    results: { results: any; };
    pagination: { total: number; page: number; limit: number; totalPages: number; };
    count: ApiResponse<{ count: number; }> | PromiseLike<ApiResponse<{ count: number; }>>;
    data: T;
    message?: string;
    success: boolean;
    status: number;
}

export interface PaginatedResponse<T = any> {
    data: any;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    success?: boolean;
    message?: string;
}

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
    details?: Record<string, any>;
}

export interface RequestConfig {
    timeout?: number;
    retries?: number;
    cache?: boolean;
    skipAuth?: boolean;
}

export interface FilterParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
}

export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export type ServiceMethod<TParams = any, TResult = any> = (
    params?: TParams
) => Promise<TResult>;

export type Repository<TEntity, TCreateDto = Partial<TEntity>, TUpdateDto = Partial<TEntity>> = {
    getAll: (params?: FilterParams) => Promise<PaginatedResponse<TEntity>>;
    getById: (id: string | number) => Promise<ApiResponse<TEntity>>;
    create: (data: TCreateDto) => Promise<ApiResponse<TEntity>>;
    update: (id: string | number, data: TUpdateDto) => Promise<ApiResponse<TEntity>>;
    delete: (id: string | number) => Promise<ApiResponse<void>>;
}; 