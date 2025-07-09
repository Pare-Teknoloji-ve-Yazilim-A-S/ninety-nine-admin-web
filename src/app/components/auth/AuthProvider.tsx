'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { User } from '@/services/types/user.types';
import { AuthTokens, AuthState } from '@/services/types/auth.types';

interface AuthContextType {
    // State
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshTokens: () => Promise<void>;
    clearError: () => void;

    // Permissions
    hasPermission: (resource: string, action: string) => Promise<boolean>;
    hasRole: (roleName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<AuthTokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        setIsLoading(true);
        try {
            if (authService.isAuthenticated()) {
                // Try to get current user
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);

                // Set tokens from storage
                const accessToken = authService.getAccessToken();
                const refreshToken = authService.getRefreshToken();

                if (accessToken && refreshToken) {
                    setTokens({
                        accessToken,
                        refreshToken,
                        tokenType: 'bearer',
                        expiresIn: 3600
                    });
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // Clear invalid tokens
            await logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login({ email, password });

            // Set tokens
            setTokens({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                tokenType: response.tokenType,
                expiresIn: response.expiresIn
            });

            // Get user data
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);

        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Giriş yapılamadı';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear state regardless of logout result
            setUser(null);
            setTokens(null);
            setError(null);
            setIsLoading(false);
        }
    };

    const refreshTokens = async () => {
        try {
            const response = await authService.refreshTokens();

            setTokens({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                tokenType: response.tokenType,
                expiresIn: response.expiresIn
            });
        } catch (error) {
            console.error('Token refresh failed:', error);
            await logout();
            throw error;
        }
    };

    const clearError = () => {
        setError(null);
    };

    const hasPermission = async (resource: string, action: string): Promise<boolean> => {
        try {
            return await authService.hasPermission({ resource, action });
        } catch (error) {
            console.error('Permission check failed:', error);
            return false;
        }
    };

    const hasRole = (roleName: string): boolean => {
        return user?.role?.name?.toLowerCase() === roleName.toLowerCase();
    };

    const value: AuthContextType = {
        // State
        user,
        tokens,
        isAuthenticated: !!user && !!tokens,
        isLoading,
        error,

        // Actions
        login,
        logout,
        refreshTokens,
        clearError,

        // Permissions
        hasPermission,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

// HOC for protected components
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function AuthenticatedComponent(props: P) {
        const { isAuthenticated, isLoading } = useAuth();

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Erişim Reddedildi
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Bu sayfaya erişmek için giriş yapmanız gerekiyor.
                        </p>
                    </div>
                </div>
            );
        }

        return <Component {...props} />;
    };
} 