'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Checkbox from '@/app/components/ui/Checkbox';
import RadioButton from '@/app/components/ui/RadioButton';
import FileUpload from '@/app/components/ui/FileUpload';
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
    QrCode,
    Image,
    FileText
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

// API Types based on 99CLUB API
interface PersonalInfoDto {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
}

interface PropertyInfoDto {
    name: string;
    block: string;
    propertyNumber: string;
    propertyType: 'RESIDENCE' | 'VILLA' | 'COMMERCIAL' | 'OFFICE';
    ownershipType: 'owner' | 'tenant';
}

interface DocumentDto {
    type: string;
    url: string;
}

interface RegisterDto {
    personalInfo: PersonalInfoDto;
    propertyInfo: PropertyInfoDto;
    documents: DocumentDto[];
}

interface FormData {
    // Personal Info
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;

    // Property Info
    propertyName: string;
    block: string;
    propertyNumber: string;
    propertyType: 'RESIDENCE' | 'VILLA' | 'COMMERCIAL' | 'OFFICE';
    ownershipType: 'owner' | 'tenant';

    // Documents
    identityDocument: File[];
    propertyDocument: File[];

    // Quick Options
    startDuesToday: boolean;
    useStandardDues: boolean;
    sendMobileInvite: boolean;
    createQrCode: boolean;
}

interface Apartment {
    id: string;
    block: string;
    number: string;
    type: string;
    area: string;
    status: 'empty' | 'occupied';
    currentResident?: string;
}

// Mock apartment data
const mockApartments: Apartment[] = [
    { id: '1', block: 'A', number: '12', type: '3+1', area: '145m²', status: 'empty' },
    { id: '2', block: 'A', number: '13', type: '2+1', area: '120m²', status: 'occupied', currentResident: 'Ahmet Yılmaz' },
    { id: '3', block: 'B', number: '05', type: '3+1', area: '150m²', status: 'empty' },
    { id: '4', block: 'B', number: '06', type: '4+1', area: '180m²', status: 'empty' },
    { id: '5', block: 'B', number: '04', type: '4+1', area: '180m²', status: 'empty' },
    { id: '6', block: 'B', number: '07', type: '4+1', area: '180m²', status: 'empty' },
    { id: '7', block: 'B', number: '08', type: '4+1', area: '180m²', status: 'empty' },
    { id: '8', block: 'B', number: '09', type: '4+1', area: '180m²', status: 'empty' },
    { id: '9', block: 'B', number: '10', type: '4+1', area: '180m²', status: 'empty' },
    { id: '10', block: 'B', number: '11', type: '4+1', area: '180m²', status: 'empty' },
    { id: '11', block: 'B', number: '12', type: '4+1', area: '180m²', status: 'empty' },
    { id: '12', block: 'B', number: '13', type: '4+1', area: '180m²', status: 'empty' },
    { id: '13', block: 'B', number: '14', type: '4+1', area: '180m²', status: 'empty' },
    { id: '14', block: 'B', number: '15', type: '4+1', area: '180m²', status: 'empty' },
];

export default function AddResidentPage() {
    const router = useRouter();
    const { success: showSuccessToast, error: showErrorToast } = useToast();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        propertyName: 'Ninety Nine Club', // Default property name
        block: '',
        propertyNumber: '',
        propertyType: 'RESIDENCE',
        ownershipType: 'owner',
        identityDocument: [],
        propertyDocument: [],
        startDuesToday: true,
        useStandardDues: true,
        sendMobileInvite: true,
        createQrCode: true,
    });

    const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Breadcrumb for add resident page
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Sakinler', href: '/dashboard/residents' },
        { label: 'Yeni Sakin Ekle', active: true }
    ];

    // Get available blocks
    const availableBlocks = Array.from(new Set(mockApartments.map(apt => apt.block)));

    // Get apartments for selected block
    const getApartmentsForBlock = (block: string) => {
        return mockApartments.filter(apt => apt.block === block);
    };

    // Handle input changes
    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        // Handle apartment selection
        if (field === 'propertyNumber' && value) {
            const apartment = mockApartments.find(apt =>
                apt.block === formData.block && apt.number === value
            );
            setSelectedApartment(apartment || null);
        }
    };

    // Handle file uploads
    const handleFileChange = (field: 'identityDocument' | 'propertyDocument') =>
        (files: FileList | null) => {
            if (files) {
                setFormData(prev => ({
                    ...prev,
                    [field]: Array.from(files)
                }));
            }
        };

    const handleFileRemove = (field: 'identityDocument' | 'propertyDocument') =>
        (index: number) => {
            setFormData(prev => ({
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index)
            }));
        };

    // Validate Iraqi phone number
    const validateIraqiPhone = (phone: string): boolean => {
        return /^7\d{9}$/.test(phone.replace(/\s/g, ''));
    };

    // Validate email
    const validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Validate password
    const validatePassword = (password: string): boolean => {
        return password.length >= 8;
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Personal Info validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Ad zorunludur';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Soyad zorunludur';
        }
        if (!formData.phone) {
            newErrors.phone = 'Telefon numarası zorunludur';
        } else if (!validateIraqiPhone(formData.phone)) {
            newErrors.phone = 'Geçerli bir Irak telefon numarası giriniz (7 ile başlamalı)';
        }
        if (!formData.email) {
            newErrors.email = 'E-posta zorunludur';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi giriniz';
        }
        if (!formData.password) {
            newErrors.password = 'Şifre zorunludur';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Şifre en az 8 karakter olmalıdır';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Şifre tekrarı zorunludur';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        }

        // Property Info validation
        if (!formData.propertyName.trim()) {
            newErrors.propertyName = 'Emlak adı zorunludur';
        }
        if (!formData.block) {
            newErrors.block = 'Blok seçimi zorunludur';
        }
        if (!formData.propertyNumber) {
            newErrors.propertyNumber = 'Daire numarası zorunludur';
        }

        // Document validation
        if (formData.identityDocument.length === 0) {
            newErrors.identityDocument = 'Kimlik belgesi zorunludur';
        }
        if (formData.propertyDocument.length === 0) {
            newErrors.propertyDocument = 'Tapu belgesi zorunludur';
        }

        // Check if apartment is occupied
        if (selectedApartment?.status === 'occupied') {
            newErrors.propertyNumber = 'Seçilen daire dolu görünüyor';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

        // Upload documents to server
    const uploadDocuments = async (userId: string): Promise<DocumentDto[]> => {
        const documents: DocumentDto[] = [];
        
        try {
            // Upload identity document
            if (formData.identityDocument.length > 0) {
                const identityFormData = new FormData();
                identityFormData.append('file', formData.identityDocument[0]);
                identityFormData.append('documentType', 'identity');

                const identityResponse = await fetch(`/api/proxy/auth/upload-user-documents/${userId}`, {
                    method: 'POST',
                    body: identityFormData,
                });

                if (identityResponse.ok) {
                    const identityResult = await identityResponse.json();
                    if (identityResult.success && identityResult.files && identityResult.files.length > 0) {
                        documents.push({
                            type: 'identity',
                            url: identityResult.files[0].filePath,
                        });
                    }
                }
            }

            // Upload property document
            if (formData.propertyDocument.length > 0) {
                const propertyFormData = new FormData();
                propertyFormData.append('file', formData.propertyDocument[0]);
                propertyFormData.append('documentType', 'property');

                const propertyResponse = await fetch(`/api/proxy/auth/upload-user-documents/${userId}`, {
                    method: 'POST',
                    body: propertyFormData,
                });

                if (propertyResponse.ok) {
                    const propertyResult = await propertyResponse.json();
                    if (propertyResult.success && propertyResult.files && propertyResult.files.length > 0) {
                        documents.push({
                            type: 'property',
                            url: propertyResult.files[0].filePath,
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Document upload error:', error);
            throw new Error('Belgeler yüklenirken hata oluştu');
        }

        return documents;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Step 1: Register user
            const registerData: RegisterDto = {
                personalInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    email: formData.email,
                    password: formData.password,
                },
                propertyInfo: {
                    name: formData.propertyName,
                    block: formData.block,
                    propertyNumber: formData.propertyNumber,
                    propertyType: formData.propertyType,
                    ownershipType: formData.ownershipType,
                },
                documents: [], // Initially empty, will be updated after upload
            };

            const registerResponse = await fetch('/api/proxy/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (!registerResponse.ok) {
                const errorData = await registerResponse.json();
                throw new Error(errorData.message || 'Kullanıcı kaydı başarısız oldu');
            }

            const registerResult = await registerResponse.json();

            if (!registerResult.success || !registerResult.userId) {
                throw new Error('Kullanıcı kaydı başarısız oldu');
            }
            console.log("registerRESULt", registerResult);
            // Step 2: Upload documents
            const uploadedDocuments = await uploadDocuments(registerResult.userId);

            // Step 3: Show success and redirect
            showSuccessToast('Başarılı!', 'Sakin başarıyla kaydedildi');
            setShowSuccess(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/dashboard/residents');
            }, 2000);

        } catch (error: any) {
            console.error('Registration error:', error);
            showErrorToast('Hata!', error.message || 'Kayıt sırasında hata oluştu');
        } finally {
            setLoading(false);
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
                                        {formData.firstName} {formData.lastName} - {selectedApartment?.block} Blok, Daire {selectedApartment?.number}
                                    </p>
                                    <p className="text-sm text-text-light-muted dark:text-text-muted mb-6">
                                        Kayıt tamamlandı ve onay bekliyor.
                                    </p>

                                    <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4 mb-6">
                                        <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                            Sakin listesine yönlendiriliyorsunuz...
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link href="/dashboard/residents">
                                            <Button variant="primary">
                                                Sakin Listesine Dön
                                            </Button>
                                        </Link>
                                        <Button variant="secondary" onClick={() => setShowSuccess(false)}>
                                            Yeni Sakin Ekle
                                        </Button>
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
                        title="Yeni Sakin - Kayıt Formu"
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
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'Kaydediliyor...' : 'Sakini Kaydet'}
                                </Button>
                            </div>
                        </div>

                        {/* Info Banner */}
                        <div className="bg-primary-gold/10 dark:bg-primary-gold/20 border border-primary-gold/20 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-primary-gold mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                        Tüm bilgileri girerek sakini kaydedin
                                    </p>
                                    <p className="text-xs text-text-light-muted dark:text-text-muted mt-1">
                                        Kişisel bilgiler, emlak bilgileri ve kimlik/tapu belgeleri gereklidir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Form */}
                        <form onSubmit={handleSubmit}>
                            <Card>
                                <div className="p-6">
                                    <div className="space-y-8">
                                        {/* Personal Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <User className="h-5 w-5 text-primary-gold" />
                                                Kişisel Bilgiler
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* First Name */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Ad *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.firstName ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                }`}
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
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.lastName ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                }`}
                                                            placeholder="Yılmaz"
                                                            value={formData.lastName}
                                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                        />
                                                        {errors.lastName && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.lastName}</p>
                                                        )}
                                                    </div>

                                                    {/* Phone */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Telefon Numarası *
                                                        </label>
                                                        <div className="flex">
                                                            <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-200 dark:bg-gray-700 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-lg">
                                                                +964
                                                            </span>
                                                            <input
                                                                type="tel"
                                                                className={`flex-1 px-3 py-2 border rounded-r-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.phone ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                    }`}
                                                                placeholder="750 123 4567"
                                                                value={formData.phone}
                                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                            />
                                                        </div>
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
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                }`}
                                                            placeholder="ahmet@email.com"
                                                            value={formData.email}
                                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                                        />
                                                        {errors.email && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                                                        )}
                                                    </div>

                                                    {/* Password */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Şifre *
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                }`}
                                                            placeholder="En az 8 karakter"
                                                            value={formData.password}
                                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                                        />
                                                        {errors.password && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
                                                        )}
                                                    </div>

                                                    {/* Confirm Password */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Şifre Tekrarı *
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                }`}
                                                            placeholder="Şifreyi tekrar giriniz"
                                                            value={formData.confirmPassword}
                                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                        />
                                                        {errors.confirmPassword && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Property Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <Home className="h-5 w-5 text-primary-gold" />
                                                Emlak Bilgileri
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Property Name */}
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Emlak Adı *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.propertyName ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                }`}
                                                            placeholder="Ninety Nine Club"
                                                            value={formData.propertyName}
                                                            onChange={(e) => handleInputChange('propertyName', e.target.value)}
                                                        />
                                                        {errors.propertyName && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.propertyName}</p>
                                                        )}
                                                    </div>

                                                    {/* Property Type */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Emlak Tipi *
                                                        </label>
                                                        <select
                                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold"
                                                            value={formData.propertyType}
                                                            onChange={(e) => handleInputChange('propertyType', e.target.value as FormData['propertyType'])}
                                                        >
                                                            <option value="RESIDENCE">Residence</option>
                                                            <option value="VILLA">Villa</option>
                                                            <option value="COMMERCIAL">Commercial</option>
                                                            <option value="OFFICE">Office</option>
                                                        </select>
                                                    </div>

                                                    {/* Ownership Type */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Sahiplik Tipi *
                                                        </label>
                                                        <select
                                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold"
                                                            value={formData.ownershipType}
                                                            onChange={(e) => handleInputChange('ownershipType', e.target.value as FormData['ownershipType'])}
                                                        >
                                                            <option value="owner">Malik</option>
                                                            <option value="tenant">Kiracı</option>
                                                        </select>
                                                    </div>

                                                    {/* Block Selection */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Blok *
                                                        </label>
                                                        <select
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.block ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                }`}
                                                            value={formData.block}
                                                            onChange={(e) => {
                                                                handleInputChange('block', e.target.value);
                                                                handleInputChange('propertyNumber', ''); // Reset apartment selection
                                                            }}
                                                        >
                                                            <option value="">Seçiniz</option>
                                                            {availableBlocks.map(block => (
                                                                <option key={block} value={block}>{block} Blok</option>
                                                            ))}
                                                        </select>
                                                        {errors.block && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.block}</p>
                                                        )}
                                                    </div>

                                                    {/* Apartment Selection */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Daire No *
                                                        </label>
                                                        <select
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.propertyNumber ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                }`}
                                                            value={formData.propertyNumber}
                                                            onChange={(e) => handleInputChange('propertyNumber', e.target.value)}
                                                            disabled={!formData.block}
                                                        >
                                                            <option value="">Seçiniz</option>
                                                            {formData.block && getApartmentsForBlock(formData.block).map(apt => (
                                                                <option key={apt.id} value={apt.number}>
                                                                    Daire {apt.number} ({apt.type}) - {apt.status === 'empty' ? 'Boş' : 'Dolu'}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.propertyNumber && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.propertyNumber}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Selected Apartment Info */}
                                                {selectedApartment && (
                                                    <div className={`mt-4 p-3 rounded-lg border ${selectedApartment.status === 'empty'
                                                        ? 'bg-semantic-success-50 dark:bg-semantic-success-900/20 border-semantic-success-200 dark:border-semantic-success-700'
                                                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                                                        }`}>
                                                        <div className="flex items-start gap-2">
                                                            {selectedApartment.status === 'empty' ? (
                                                                <Info className="h-5 w-5 text-semantic-success-600 mt-0.5" />
                                                            ) : (
                                                                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                                            )}
                                                            <div>
                                                                <p className={`text-sm font-medium ${selectedApartment.status === 'empty'
                                                                    ? 'text-semantic-success-800 dark:text-semantic-success-200'
                                                                    : 'text-red-800 dark:text-red-200'
                                                                    }`}>
                                                                    {selectedApartment.block} Blok, Daire {selectedApartment.number} - {selectedApartment.type}, {selectedApartment.area}
                                                                </p>
                                                                <p className={`text-xs ${selectedApartment.status === 'empty'
                                                                    ? 'text-semantic-success-600 dark:text-semantic-success-300'
                                                                    : 'text-red-600 dark:text-red-300'
                                                                    }`}>
                                                                    {selectedApartment.status === 'empty'
                                                                        ? 'Durum: ✓ Boş ve Hazır'
                                                                        : `Durum: Dolu - Mevcut Sakin: ${selectedApartment.currentResident}`
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Document Upload */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-primary-gold" />
                                                Belge Yükleme
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Identity Document */}
                                                    <div>
                                                        <FileUpload
                                                            label="Kimlik Belgesi *"
                                                            helperText="Kimlik, pasaport veya ikamet kartı resmi"
                                                            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
                                                            maxSize={5}
                                                            selectedFiles={formData.identityDocument}
                                                            onFilesChange={handleFileChange('identityDocument')}
                                                            onFileRemove={handleFileRemove('identityDocument')}
                                                            error={errors.identityDocument}
                                                            isRequired
                                                        />
                                                    </div>

                                                    {/* Property Document */}
                                                    <div>
                                                        <FileUpload
                                                            label="Tapu Belgesi *"
                                                            helperText="Tapu, kira kontratı veya mülkiyet belgesi"
                                                            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']}
                                                            maxSize={5}
                                                            selectedFiles={formData.propertyDocument}
                                                            onFilesChange={handleFileChange('propertyDocument')}
                                                            onFileRemove={handleFileRemove('propertyDocument')}
                                                            error={errors.propertyDocument}
                                                            isRequired
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Options */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <Building className="h-5 w-5 text-primary-gold" />
                                                Hızlı Seçenekler
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Checkbox
                                                        checked={formData.startDuesToday}
                                                        onChange={(e) => handleInputChange('startDuesToday', e.target.checked)}
                                                        label="Aidat başlangıç tarihi: Bugün"
                                                    />

                                                    <Checkbox
                                                        checked={formData.useStandardDues}
                                                        onChange={(e) => handleInputChange('useStandardDues', e.target.checked)}
                                                        label="Standart aidat tutarını uygula"
                                                    />

                                                    <Checkbox
                                                        checked={formData.sendMobileInvite}
                                                        onChange={(e) => handleInputChange('sendMobileInvite', e.target.checked)}
                                                        label="Mobil uygulama daveti gönder"
                                                    />

                                                    <Checkbox
                                                        checked={formData.createQrCode}
                                                        onChange={(e) => handleInputChange('createQrCode', e.target.checked)}
                                                        label="QR kod oluştur ve aktifleştir"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex flex-col items-center gap-2">
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                type="submit"
                                                className="px-12"
                                                disabled={loading}
                                            >
                                                {loading ? 'Kaydediliyor...' : 'Sakini Kaydet'}
                                            </Button>
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