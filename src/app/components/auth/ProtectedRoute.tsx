'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import Spinner from '@/app/components/ui/Spinner';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredPermissions?: Array<{
        resource: string;
        action: string;
    }>;
    requiredRoles?: string[];
    requireAll?: boolean; // true: must have ALL permissions, false: must have ANY permission
    fallback?: ReactNode;
    loadingFallback?: ReactNode;
}

export function ProtectedRoute({
    children,
    requiredPermissions = [],
    requiredRoles = [],
    requireAll = true,
    fallback,
    loadingFallback
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user, hasPermission, hasRole } = useAuth();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || isLoading) {
            setHasAccess(null);
            return;
        }

        checkAccess();
    }, [isAuthenticated, isLoading, user, requiredPermissions, requiredRoles]);

    const checkAccess = async () => {
        setIsCheckingPermissions(true);

        try {
            // Check roles first (synchronous)
            if (requiredRoles.length > 0) {
                const roleCheck = requireAll
                    ? requiredRoles.every(role => hasRole(role))
                    : requiredRoles.some(role => hasRole(role));

                if (!roleCheck) {
                    setHasAccess(false);
                    return;
                }
            }

            // Check permissions (asynchronous)
            if (requiredPermissions.length > 0) {
                if (requireAll) {
                    // Must have ALL permissions
                    const permissionChecks = await Promise.all(
                        requiredPermissions.map(perm => hasPermission(perm.resource, perm.action))
                    );
                    const hasAllPermissions = permissionChecks.every(Boolean);
                    setHasAccess(hasAllPermissions);
                } else {
                    // Must have ANY permission
                    const permissionChecks = await Promise.all(
                        requiredPermissions.map(perm => hasPermission(perm.resource, perm.action))
                    );
                    const hasAnyPermission = permissionChecks.some(Boolean);
                    setHasAccess(hasAnyPermission);
                }
            } else {
                // No specific permissions required, just authentication
                setHasAccess(true);
            }
        } catch (error) {
            console.error('Permission check failed:', error);
            setHasAccess(false);
        } finally {
            setIsCheckingPermissions(false);
        }
    };

    // Loading states
    if (isLoading || isCheckingPermissions) {
        return loadingFallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="mb-4">
                            <svg
                                className="mx-auto h-12 w-12 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 17.333 3.924 19 5.464 19z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Giriş Gerekli
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Bu sayfaya erişmek için giriş yapmanız gerekiyor.
                        </p>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Giriş Yap
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No access (insufficient permissions)
    if (hasAccess === false) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="mb-4">
                            <svg
                                className="mx-auto h-12 w-12 text-orange-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Erişim Engellendi
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                            Bu sayfaya erişmek için gerekli yetkilere sahip değilsiniz.
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Rol: <span className="font-medium">{user?.role?.name || 'Belirsiz'}</span>
                        </div>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Geri Dön
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Has access
    return <>{children}</>;
}

// Utility components for common role checks
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <ProtectedRoute
            requiredRoles={['Super Admin', 'Admin']}
            requireAll={false}
            fallback={fallback}
        >
            {children}
        </ProtectedRoute>
    );
}

export function FinanceOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <ProtectedRoute
            requiredRoles={['Super Admin', 'Admin', 'Finance Manager']}
            requireAll={false}
            fallback={fallback}
        >
            {children}
        </ProtectedRoute>
    );
}

export function OperatorOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <ProtectedRoute
            requiredRoles={['Super Admin', 'Admin', 'Operator']}
            requireAll={false}
            fallback={fallback}
        >
            {children}
        </ProtectedRoute>
    );
}

// Permission check utility component
export function PermissionGate({
    resource,
    action,
    children,
    fallback
}: {
    resource: string;
    action: string;
    children: ReactNode;
    fallback?: ReactNode;
}) {
    return (
        <ProtectedRoute
            requiredPermissions={[{ resource, action }]}
            fallback={fallback}
        >
            {children}
        </ProtectedRoute>
    );
} 