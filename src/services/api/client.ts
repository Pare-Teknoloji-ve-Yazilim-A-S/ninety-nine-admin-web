// API Client - Infrastructure Layer
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiConfig, features } from '../config/api.config';
import { ApiResponse, ApiError, RequestConfig } from '../core/types';
import { TokenManager } from '../utils/token-manager';
import { Logger } from '../utils/logger';
import { captureException, addBreadcrumb, setContext } from '@/lib/sentry';

class ApiClient {
    private client: AxiosInstance;
    private tokenManager: TokenManager;
    private logger: Logger;

    constructor() {
        this.tokenManager = new TokenManager();
        this.logger = new Logger('ApiClient');

        this.client = axios.create({
            baseURL: apiConfig.version ? `${apiConfig.baseURL}/${apiConfig.version}` : apiConfig.baseURL,
            timeout: apiConfig.timeout,
            headers: apiConfig.defaultHeaders,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add auth token
                if (!config.headers?.skipAuth) {
                    const token = this.tokenManager.getAccessToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }

                // Add request ID for tracking
                config.headers['X-Request-ID'] = this.generateRequestId();

                // Log request in development
                if (features.enableDebugLogs) {
                    this.logger.info('Request:', {
                        method: config.method?.toUpperCase(),
                        url: config.url,
                        data: config.data,
                    });
                }

                // Add breadcrumb for Sentry
                addBreadcrumb({
                    message: `API Request: ${config.method?.toUpperCase()} ${config.url}`,
                    level: 'info',
                    category: 'http',
                    data: {
                        method: config.method?.toUpperCase(),
                        url: config.url,
                        requestId: config.headers['X-Request-ID'],
                    },
                });

                return config;
            },
            (error) => {
                this.logger.error('Request error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                // Log response in development
                if (features.enableDebugLogs) {
                    this.logger.info('Response:', {
                        status: response.status,
                        url: response.config.url,
                        data: response.data,
                    });
                }

                return response;
            },
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                // Handle 401 Unauthorized
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        await this.refreshToken();
                        const token = this.tokenManager.getAccessToken();

                        if (token && originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return this.client(originalRequest);
                        }
                    } catch (refreshError) {
                        this.tokenManager.clearTokens();
                        this.redirectToLogin();
                        return Promise.reject(refreshError);
                    }
                }

                // Transform error
                const apiError = this.transformError(error);
                this.logger.error('API Error:', apiError);

                // Send API errors to Sentry
                this.reportApiErrorToSentry(error, apiError);

                return Promise.reject(apiError);
            }
        );
    }

    private async refreshToken(): Promise<void> {
        const refreshToken = this.tokenManager.getRefreshToken();

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await this.client.post(apiConfig.endpoints.auth.refresh, {
            refreshToken,
        }, {
            headers: { skipAuth: true },
        });

        // API-99CLUB response format: {accessToken, refreshToken, tokenType, expiresIn}
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        this.tokenManager.setTokens(accessToken, newRefreshToken);
    }

    private transformError(error: AxiosError): ApiError {
        if (error.response) {
            // Server responded with error status
            const responseData = error.response.data as any;
            return {
                message: responseData?.message || error.message,
                code: responseData?.code,
                status: error.response.status,
                details: responseData?.details,
            };
        } else if (error.request) {
            // Request was made but no response received
            return {
                message: 'Network error: No response from server',
                code: 'NETWORK_ERROR',
                status: 0,
            };
        } else {
            // Something else happened
            return {
                message: error.message || 'Unknown error occurred',
                code: 'UNKNOWN_ERROR',
                status: 0,
            };
        }
    }

    private generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private redirectToLogin(): void {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    private reportApiErrorToSentry(axiosError: AxiosError, apiError: ApiError): void {
        // Don't report 401 errors (authentication issues)
        if (apiError.status === 401) {
            return;
        }

        // Don't report network errors in development
        if (process.env.NODE_ENV === 'development' && apiError.code === 'NETWORK_ERROR') {
            return;
        }

        // Create enhanced error for Sentry
        const sentryError = new Error(`API Error: ${apiError.message}`);
        sentryError.name = 'ApiError';

        // Set context for Sentry
        setContext('api_error', {
            status: apiError.status,
            code: apiError.code,
            message: apiError.message,
            details: apiError.details,
            url: axiosError.config?.url,
            method: axiosError.config?.method?.toUpperCase(),
            requestId: axiosError.config?.headers?.['X-Request-ID'],
        });

        // Add breadcrumb
        addBreadcrumb({
            message: `API Error: ${apiError.status} ${apiError.message}`,
            level: 'error',
            category: 'http',
            data: {
                status: apiError.status,
                code: apiError.code,
                url: axiosError.config?.url,
                method: axiosError.config?.method?.toUpperCase(),
            },
        });

        // Capture exception
        captureException(sentryError);
    }

    // Public API methods
    async get<T = any>(
        url: string,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.client.get(url, this.mergeConfig(config));
        return response.data;
    }

    async post<T = any>(
        url: string,
        data?: any,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        const merged = this.mergeConfig(config);
        if (isFormData) {
            merged.headers = {
                ...(merged.headers || {}),
                'Content-Type': 'multipart/form-data',
            } as any;
        }
        const response = await this.client.post(url, data, merged);
        return response.data;
    }

    async put<T = any>(
        url: string,
        data?: any,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.client.put(url, data, this.mergeConfig(config));
        return response.data;
    }

    async patch<T = any>(
        url: string,
        data?: any,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.client.patch(url, data, this.mergeConfig(config));
        return response.data;
    }

    async delete<T = any>(
        url: string,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.client.delete(url, this.mergeConfig(config));
        return response.data;
    }

    private mergeConfig(config?: RequestConfig): AxiosRequestConfig {
        return {
            timeout: config?.timeout,
            headers: config?.skipAuth ? { skipAuth: true } : {},
            ...config,
        };
    }

    // Upload file method
    async uploadFile<T = any>(
        url: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<ApiResponse<T>> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await this.client.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    onProgress(Math.round(progress));
                }
            },
        });

        return response.data;
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient; 