// Authentication Service - Application Layer - API-99CLUB Compatible
import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';
import { TokenManager } from './utils/token-manager';
import { createLogger } from './utils/logger';
import {
    LoginDto,
    LoginResponse,
    RegisterDto,
    RegisterResponse,
    RefreshTokenDto,
    RefreshTokenResponse,
    LogoutDto,
    AuthState,
    // Future implementation types
    ForgotPasswordDto,
    ResetPasswordDto,
    ChangePasswordDto,
    EmailVerificationDto,
    ResendVerificationDto,
    Enable2FAResponse,
    Verify2FADto,
    Disable2FADto,
    SocialLoginDto,
    SocialLoginResponse,
    SessionInfo,
    ActiveSessionsResponse,
    RevokeSessionDto,
    PermissionCheck,
    SecurityEventsResponse,
} from './types/auth.types';
import { User } from './types/user.types';
import { ApiResponse } from './core/types';

class AuthService {
    private tokenManager: TokenManager;
    private logger = createLogger('AuthService');
    private endpoints = apiConfig.endpoints.auth;

    constructor() {
        this.tokenManager = new TokenManager();
    }

    // Basic Authentication Methods - API-99CLUB Compatible
    async login(credentials: LoginDto): Promise<LoginResponse> {
        try {
            this.logger.info('Attempting login', { email: credentials.email });

            const response = await apiClient.post<LoginResponse>(
                this.endpoints.login,
                credentials,
                { skipAuth: true }
            );

            // Store tokens
            this.tokenManager.setTokens(
                response.data.accessToken,
                response.data.refreshToken
            );

            this.logger.info('Login successful');
            return response.data;
        } catch (error) {
            this.logger.error('Login failed', error);
            throw error;
        }
    }

    async register(userData: RegisterDto): Promise<RegisterResponse> {
        try {
            this.logger.info('Attempting registration', { email: userData.email });

            const response = await apiClient.post<RegisterResponse>(
                this.endpoints.register,
                userData,
                { skipAuth: true }
            );

            // Store tokens
            this.tokenManager.setTokens(
                response.data.accessToken,
                response.data.refreshToken
            );

            this.logger.info('Registration successful');
            return response.data;
        } catch (error) {
            this.logger.error('Registration failed', error);
            throw error;
        }
    }

    async logout(data?: LogoutDto): Promise<void> {
        try {
            this.logger.info('Attempting logout');

            await apiClient.post(this.endpoints.logout);

            // Clear local tokens
            this.tokenManager.clearTokens();

            this.logger.info('Logout successful');
        } catch (error) {
            // Clear tokens even if logout request fails
            this.tokenManager.clearTokens();
            this.logger.error('Logout failed', error);
            throw error;
        }
    }

    async refreshTokens(refreshToken?: string): Promise<RefreshTokenResponse> {
        try {
            const token = refreshToken || this.tokenManager.getRefreshToken();

            if (!token) {
                throw new Error('No refresh token available');
            }

            this.logger.info('Refreshing tokens');

            const response = await apiClient.post<RefreshTokenResponse>(
                this.endpoints.refresh,
                { refreshToken: token },
                { skipAuth: true }
            );

            // Update stored tokens
            this.tokenManager.setTokens(
                response.data.accessToken,
                response.data.refreshToken
            );

            this.logger.info('Tokens refreshed successfully');
            return response.data;
        } catch (error) {
            this.logger.error('Token refresh failed', error);
            this.tokenManager.clearTokens();
            throw error;
        }
    }

    async getCurrentUser(): Promise<User> {
        try {
            this.logger.info('Fetching current user');

            const response = await apiClient.get<User>(this.endpoints.me);

            this.logger.info('Current user fetched successfully');
            return response;
        } catch (error) {
            this.logger.error('Failed to fetch current user', error);
            throw error;
        }
    }

    // Future Implementation - Password Management
    async forgotPassword(data: ForgotPasswordDto): Promise<void> {
        throw new Error('Not implemented yet. Future feature.');
    }

    async resetPassword(data: ResetPasswordDto): Promise<void> {
        throw new Error('Not implemented yet. Future feature.');
    }

    async changePassword(data: ChangePasswordDto): Promise<void> {
        throw new Error('Not implemented yet. Future feature.');
    }

    // Future Implementation - Email Verification
    async verifyEmail(data: EmailVerificationDto): Promise<void> {
        throw new Error('Not implemented yet. Future feature.');
    }

    async resendVerificationEmail(data: ResendVerificationDto): Promise<void> {
        throw new Error('Not implemented yet. Future feature.');
    }

    // Future Implementation - Two-Factor Authentication
    async enable2FA(): Promise<Enable2FAResponse> {
        throw new Error('Not implemented yet. Future feature.');
    }

    async verify2FA(data: Verify2FADto): Promise<void> {
        throw new Error('Not implemented yet. Future feature.');
    }

    async disable2FA(data: Disable2FADto): Promise<void> {
        throw new Error('Not implemented yet. Future feature.');
    }

    // Future Implementation - Social Login
    async socialLogin(data: SocialLoginDto): Promise<SocialLoginResponse> {
        throw new Error('Not implemented yet. Future feature.');
    }

    // Future Implementation - Session Management
    async getActiveSessions(): Promise<ActiveSessionsResponse> {
        throw new Error('Not implemented yet. Future feature.');
    }

    async revokeSession(data: RevokeSessionDto): Promise<void> {
        throw new Error('Not implemented yet. Future feature.');
    }

    async revokeAllSessions(): Promise<void> {
        throw new Error('Not implemented yet. Future feature.');
    }

    // Permission checking - Basic implementation
    async hasPermission(check: PermissionCheck): Promise<boolean> {
        try {
            const user = await this.getCurrentUser();

            if (!user.role?.permissions) {
                return false;
            }

            return user.role.permissions.some(permission =>
                permission.resource === check.resource && permission.action === check.action
            );
        } catch (error) {
            this.logger.error('Permission check failed', error);
            return false;
        }
    }

    async hasAnyPermission(checks: PermissionCheck[]): Promise<boolean> {
        for (const check of checks) {
            if (await this.hasPermission(check)) {
                return true;
            }
        }
        return false;
    }

    async hasAllPermissions(checks: PermissionCheck[]): Promise<boolean> {
        for (const check of checks) {
            if (!(await this.hasPermission(check))) {
                return false;
            }
        }
        return true;
    }

    // Future Implementation - Security Events
    async getSecurityEvents(page: number = 1, limit: number = 20): Promise<SecurityEventsResponse> {
        throw new Error('Not implemented yet. Future feature.');
    }

    // Utility methods
    isAuthenticated(): boolean {
        return this.tokenManager.isTokenValid();
    }

    getUser(): any | null {
        // This should be implemented with proper state management
        return null;
    }

    getAccessToken(): string | null {
        return this.tokenManager.getAccessToken();
    }

    getRefreshToken(): string | null {
        return this.tokenManager.getRefreshToken();
    }

    shouldRefreshToken(): boolean {
        return this.tokenManager.shouldRefreshToken();
    }

    getAuthState(): AuthState {
        return {
            isAuthenticated: this.isAuthenticated(),
            user: this.getUser(),
            tokens: {
                accessToken: this.tokenManager.getAccessToken() || '',
                refreshToken: this.tokenManager.getRefreshToken() || '',
                tokenType: 'bearer',
                expiresIn: 3600
            },
            isLoading: false,
            error: null,
        };
    }

    clearAuthState(): void {
        this.tokenManager.clearTokens();
    }
}

// Export singleton instance
export const authService = new AuthService();
export default authService; 