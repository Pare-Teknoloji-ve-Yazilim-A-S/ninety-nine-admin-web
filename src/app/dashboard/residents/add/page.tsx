'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Checkbox from '@/app/components/ui/Checkbox';
import RadioButton from '@/app/components/ui/RadioButton';
import {
    ArrowLeft,
    Check,
    AlertCircle,
    Info,
    Phone,
    MessageSquare,
    Building,
    User,
    Home,
    Calendar,
    CreditCard,
    Smartphone,
    QrCode
} from 'lucide-react';


interface FormData {
    // Identity
    identityNumber: string;
    firstName: string;
    lastName: string;

    // Contact
    phone: string;
    email: string;

    // Personal Info
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | '';

    // Quick Options
    startDuesToday: boolean;
    useStandardDues: boolean;
    sendMobileInvite: boolean;
    createQrCode: boolean;
}



export default function AddResidentPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        identityNumber: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        startDuesToday: true,
        useStandardDues: true,
        sendMobileInvite: true,
        createQrCode: true,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [temporaryPassword, setTemporaryPassword] = useState<string>('');



    // Breadcrumb for add resident page
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Sakinler', href: '/dashboard/residents' },
        { label: 'Yeni Sakin Ekle', active: true }
    ];



    // Handle input changes
    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }


    };

    // Validate Turkish National ID (11 digits)
    const validateTurkishId = (id: string): boolean => {
        return /^\d{11}$/.test(id.replace(/\s/g, ''));
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Identity Number validation
        if (!formData.identityNumber) {
            newErrors.identityNumber = 'Kimlik numarası zorunludur';
        } else if (!validateTurkishId(formData.identityNumber)) {
            newErrors.identityNumber = 'TC kimlik numarası 11 haneli olmalıdır';
        }

        // Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Ad zorunludur';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Soyad zorunludur';
        }

        // Phone validation
        if (!formData.phone) {
            newErrors.phone = 'Telefon numarası zorunludur';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'E-posta zorunludur';
        }

        // Date of birth validation
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Doğum tarihi zorunludur';
        }

        // Gender validation
        if (!formData.gender) {
            newErrors.gender = 'Cinsiyet zorunludur';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                // Prepare payload for POST /admin/residents endpoint
                const payload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    tcKimlikNo: formData.identityNumber
                };
                
                console.log('🔍 Form Data:', formData);
                console.log('🚀 API Payload:', payload);
                
                const response = await fetch('/api/proxy/admin/residents', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || 'Sakin oluşturulamadı';
                    console.error('Resident creation failed:', errorData);
                    throw new Error(errorMessage);
                }

                const residentData = await response.json();
                console.log('Resident created successfully:', residentData);
                
                // Show temporary password
                if (residentData.temporaryPassword) {
                    setTemporaryPassword(residentData.temporaryPassword);
                }
                
                setShowSuccess(true);
            } catch (error: any) {
                console.error('Error in handleSubmit:', error);
                const errorMessage = error.message || 'Sakin oluşturulurken bir hata oluştu';
                // Hata mesajını göster
                setErrors({ submit: errorMessage });
            }
        }
    };

    // Success modal/message
    if (showSuccess) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader title="Başarılı!" breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="text-center">
                                <div className="p-8">
                                    <div className="w-16 h-16 bg-semantic-success-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="h-8 w-8 text-semantic-success-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2">
                                        Sakin başarıyla kaydedildi!
                                    </h2>
                                    <p className="text-text-light-secondary dark:text-text-secondary mb-2">
                                        {formData.firstName} {formData.lastName}
                                    </p>
                                    <p className="text-sm text-text-light-muted dark:text-text-muted mb-6">
                                        Kayıt No: #2024-{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}
                                    </p>

                                    {temporaryPassword && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                                            <div className="flex items-start gap-2">
                                                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                                        Geçici Şifre
                                                    </p>
                                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                                        <strong>{temporaryPassword}</strong> - Bu şifre ile giriş yapabilirsiniz.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4 mb-6">
                                        <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                            Şimdi ne yapmak istersiniz?
                                        </p>
                                    </div>

                                                                         <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                         <Button variant="secondary" onClick={() => setShowSuccess(false)}>
                                             Yeni Sakin Ekle
                                         </Button>
                                         <Link href="/dashboard/residents">
                                             <Button variant="secondary">
                                                 Sakin Listesine Dön
                                             </Button>
                                         </Link>
                                     </div>
                                </div>
                            </Card>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div className="lg:ml-72">
                    {/* Header */}
                    <DashboardHeader
                        title="Yeni Sakin - Hızlı Kayıt"
                        breadcrumbItems={breadcrumbItems}
                    />

                    {/* Main Content */}
                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header Actions */}
                        <div className="flex justify-between items-center mb-6">
                            <Link href="/dashboard/residents">
                                <Button variant="ghost" icon={ArrowLeft}>
                                    Geri Dön
                                </Button>
                            </Link>

                            <div className="flex gap-3">
                                <Link href="/dashboard/residents">
                                    <Button variant="secondary">
                                        İptal
                                    </Button>
                                </Link>
                                <Button variant="primary" onClick={handleSubmit}>
                                    Kaydet
                                </Button>
                            </div>
                        </div>

                        {/* Info Banner */}
                        <div className="bg-primary-gold/10 dark:bg-primary-gold/20 border border-primary-gold/20 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-primary-gold mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                        Temel bilgileri girerek sakini kaydedin, detayları sonra ekleyin
                                    </p>
                                    <p className="text-xs text-text-light-muted dark:text-text-muted mt-1">
                                        Sakin kaydedildikten sonra detay sayfasından tüm bilgileri ekleyebilir ve düzenleyebilirsiniz.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Form */}
                        <form onSubmit={handleSubmit}>
                            <Card>
                                <div className="p-6">
                                    <div className="text-center mb-8">
                                        <h2 className="text-xl font-bold text-text-on-light dark:text-text-on-dark">
                                            ZORUNLU BİLGİLER
                                        </h2>
                                        <div className="w-24 h-1 bg-primary-gold rounded mx-auto mt-2"></div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Identity Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <User className="h-5 w-5 text-primary-gold" />
                                                Kimlik Bilgileri
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">

                                                {/* Kimlik Numarası - Tek başına en üstte */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                        Kimlik Numarası *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.identityNumber ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                        placeholder="12345678901"
                                                        value={formData.identityNumber}
                                                        onChange={(e) => handleInputChange('identityNumber', e.target.value)}
                                                    />
                                                    {errors.identityNumber && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.identityNumber}</p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* First Name */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Ad *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.firstName ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            placeholder="Ahmet"
                                                            value={formData.firstName}
                                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                        />
                                                        {errors.firstName && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.firstName}</p>
                                                        )}
                                                    </div>

                                                    {/* Last Name */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Soyad *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.lastName ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            placeholder="Yılmaz"
                                                            value={formData.lastName}
                                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                        />
                                                        {errors.lastName && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.lastName}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <Phone className="h-5 w-5 text-primary-gold" />
                                                İletişim
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Phone */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Telefon *
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.phone ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            placeholder="5XX XXX XX XX"
                                                            value={formData.phone}
                                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                                        />
                                                        {errors.phone && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone}</p>
                                                        )}
                                                    </div>

                                                    {/* Email */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            E-posta *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            placeholder="ahmet@email.com"
                                                            value={formData.email}
                                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                                        />
                                                        {errors.email && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Personal Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-primary-gold" />
                                                Kişisel Bilgiler
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Date of Birth */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Doğum Tarihi *
                                                        </label>
                                                        <input
                                                            type="date"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.dateOfBirth ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            value={formData.dateOfBirth}
                                                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                        />
                                                        {errors.dateOfBirth && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.dateOfBirth}</p>
                                                        )}
                                                    </div>

                                                    {/* Gender */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Cinsiyet *
                                                        </label>
                                                        <select
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.gender ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            value={formData.gender}
                                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                                        >
                                                            <option value="">Seçiniz</option>
                                                            <option value="MALE">Erkek</option>
                                                            <option value="FEMALE">Kadın</option>
                                                            <option value="OTHER">Diğer</option>
                                                        </select>
                                                        {errors.gender && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.gender}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex flex-col items-center gap-2">
                                            <Button variant="primary" size="lg" type="submit" className="px-12">
                                                Sakini Kaydet
                                            </Button>
                                            {errors.submit && (
                                                <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errors.submit}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </form>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
} 