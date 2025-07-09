'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/app/components/auth/LoginForm';
import { useAuth } from '@/app/components/auth/AuthProvider';

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleLoginSuccess = () => {
        router.push('/dashboard');
    };

    const handleLoginError = (error: string) => {
        console.error('Login error:', error);
    };

    if (isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            {/* Login Form */}
            <LoginForm
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
            />
        </>
    );
} 