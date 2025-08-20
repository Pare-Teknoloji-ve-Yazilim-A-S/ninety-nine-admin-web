'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, CheckCircle, X } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Checkbox from '@/app/components/ui/Checkbox';
import Card from '@/app/components/ui/Card';
import Spinner from '@/app/components/ui/Spinner';
import { useAuth } from './AuthProvider';

interface LoginFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { login: contextLogin, error: authError } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setError,
        watch
    } = useForm<LoginFormData>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        }
    });

    // Form alanlarını izle ve değişiklik olduğunda hata mesajını temizle
    const emailValue = watch('email');
    const passwordValue = watch('password');

    React.useEffect(() => {
        // Sadece form alanları tamamen boş olduğunda hata mesajını temizle
        // Bu sayede kullanıcı hatalı bilgi girdiğinde hata mesajı kalır
        if (errorMessage && !emailValue && !passwordValue) {
            setErrorMessage(null);
        }
    }, [emailValue, passwordValue, errorMessage]);

    // AuthProvider'dan gelen hatayı da kullan
    React.useEffect(() => {
        if (authError && !errorMessage) {
            setErrorMessage(authError);
        }
    }, [authError, errorMessage]);

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        // Hata mesajını sadece yeni bir giriş denemesi yapıldığında temizle
        // setErrorMessage(null); // Bu satırı kaldırıyoruz

        try {
            const email = data.email.trim();
            const password = data.password;

            if (contextLogin) {
                await contextLogin(email, password);
            }

            // Başarılı giriş durumunda hata mesajını temizle
            setErrorMessage(null);
            reset();
            onSuccess?.();

        } catch (error: any) {
            console.error('Login error:', error);

            let message = 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.';

            if (error?.response?.status === 401) {
                message = 'E-posta veya şifre hatalı.';
            } else if (error?.response?.status === 403) {
                message = 'Hesabınız engellendi. Lütfen yöneticinizle iletişime geçin.';
            } else if (error?.response?.status === 429) {
                message = 'Çok fazla deneme. Lütfen bir süre bekleyip tekrar deneyin.';
            } else if (error?.response?.status >= 500) {
                message = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
            } else if (error?.response?.data?.message) {
                message = error.response.data.message;
            } else if (error?.message) {
                message = error.message;
            }

            if (error?.response?.status === 401) {
                setError('email', {
                    type: 'manual',
                    message: 'E-posta veya şifre hatalı'
                });
                setError('password', {
                    type: 'manual',
                    message: 'E-posta veya şifre hatalı'
                });
            }

            setErrorMessage(message);
            onError?.(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-primary flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-background-secondary to-background-card relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-gold"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-gold rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-gold-light rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 py-16">
                    {/* Logo */}
                    <div className="mb-12">
                        <div className="inline-flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center shadow-lg">
                                <Shield className="w-6 h-6 text-primary-dark-gray" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary font-helvetica">99Club</h1>
                                <p className="text-xs text-text-accent font-inter">Admin Panel</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-text-primary font-helvetica leading-tight">
                            Konut Yönetim<br />
                            <span className="text-transparent bg-clip-text bg-gradient-gold">
                                Sistemi
                            </span>
                        </h2>

                        <p className="text-lg text-text-secondary font-inter leading-relaxed max-w-md">
                            Modern konut yönetimi için güçlü araçlar ve kapsamlı çözümler
                        </p>

                        {/* Features */}
                        <div className="space-y-4 pt-6">
                            {[
                                'Güvenli giriş sistemi',
                                'Gerçek zamanlı veriler',
                                'Mobil uyumlu tasarım'
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-primary-gold flex-shrink-0" />
                                    <span className="text-text-secondary font-inter">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md bg-gradient-to-br from-background-secondary to-background-card rounded-lg">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="inline-flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center shadow-lg">
                                <Shield className="w-6 h-6 text-primary-dark-gray" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-text-primary font-helvetica">99Club</h1>
                                <p className="text-xs text-text-accent font-inter">Admin Panel</p>
                            </div>
                        </div>
                    </div>

                    <Card
                        variant="bordered"
                        padding="xl"
                        className="border-primary-gold/20 bg-background-card/50 backdrop-blur-sm"
                    >
                        {/* Form Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-text-primary font-helvetica mb-2">
                                Hesabınıza Giriş Yapın
                            </h2>
                            <p className="text-text-secondary font-inter">
                                Yönetim paneline erişmek için bilgilerinizi girin
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <Input
                                    label="E-posta Adresi"
                                    type="email"
                                    placeholder="admin@99club.com"
                                    autoComplete="email"
                                    icon={Mail}
                                    variant="outlined"
                                    isRequired
                                    {...register('email', {
                                        required: 'E-posta adresi gereklidir',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Geçerli bir e-posta adresi girin'
                                        }
                                    })}
                                    error={errors.email?.message}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <Input
                                        label="Şifre"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Şifrenizi girin"
                                        autoComplete="current-password"
                                        icon={Lock}
                                        variant="outlined"
                                        isRequired
                                        {...register('password', {
                                            required: 'Şifre gereklidir',
                                            minLength: {
                                                value: 6,
                                                message: 'Şifre en az 6 karakter olmalıdır'
                                            }
                                        })}
                                        error={errors.password?.message}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-9 text-text-secondary hover:text-text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/50 rounded-md p-1"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Options Row */}
                            <div className="flex items-center justify-between">
                                <Checkbox
                                    {...register('rememberMe')}
                                    label="Beni hatırla"
                                    checkboxSize="sm"
                                    disabled={isLoading}
                                />

                                <button
                                    type="button"
                                    className="text-sm text-text-accent hover:text-primary-gold transition-colors font-inter"
                                    onClick={() => {
                                        alert('Şifre sıfırlama özelliği henüz hazır değil');
                                    }}
                                    disabled={isLoading}
                                >
                                    Şifremi unuttum
                                </button>
                            </div>



                            {/* Error Message */}
                            {errorMessage && (
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 relative transition-all duration-300 ease-in-out">
                                    <button
                                        type="button"
                                        onClick={() => setErrorMessage(null)}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-100"
                                        aria-label="Hata mesajını kapat"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-start space-x-3 pr-6">
                                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2 animate-pulse" />
                                        <div>
                                            <p className="text-sm text-red-700 font-medium font-inter">Hata</p>
                                            <p className="text-sm text-red-600 font-inter mt-1">{errorMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                disabled={!isValid || isLoading}
                                isLoading={isLoading}
                                icon={ArrowRight}
                                iconPosition="right"
                                className="mt-6"
                            >
                                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-primary-gold/20">
                            <div className="flex items-center justify-center space-x-2 text-center">
                                <div className="w-2 h-2 bg-gradient-gold rounded-full animate-pulse" />
                                <p className="text-xs text-text-secondary font-inter">
                                    API-99CLUB entegrasyonu aktif • Güvenli bağlantı
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
} 