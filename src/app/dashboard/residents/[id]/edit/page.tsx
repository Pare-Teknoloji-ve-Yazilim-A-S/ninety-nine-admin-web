'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Checkbox from '@/app/components/ui/Checkbox';
import RadioButton from '@/app/components/ui/RadioButton';
import { useResidentData } from '@/hooks/useResidentData';
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
    Save,
    X
} from 'lucide-react';

interface FormData {
    // Identity
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    
    // Housing
    residentType: 'owner' | 'tenant' | 'family';
    block: string;
    apartmentNumber: string;
    
    // Status
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    membershipTier: 'GOLD' | 'SILVER' | 'STANDARD';
    
    // Notes
    notes: string;
}

export default function ResidentEditPage() {
    const params = useParams();
    const router = useRouter();
    const residentId = params.id as string;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        residentType: 'owner',
        block: '',
        apartmentNumber: '',
        status: 'ACTIVE',
        membershipTier: 'STANDARD',
        notes: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [hasChanges, setHasChanges] = useState(false);

    const { resident, loading, error, updateResident, saving, saveError } = useResidentData({
        residentId,
        autoFetch: true
    });

    // Breadcrumb for resident edit page
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Sakinler', href: '/dashboard/residents' },
        { label: resident?.fullName || 'Sakin', href: `/dashboard/residents/${residentId}` },
        { label: 'Düzenle', active: true }
    ];

    // Mock apartment data (in real app, this would come from API)
    const mockApartments = [
        { id: '1', block: 'A', number: '12', type: '3+1', area: '145m²', status: 'occupied' },
        { id: '2', block: 'A', number: '13', type: '2+1', area: '120m²', status: 'empty' },
        { id: '3', block: 'B', number: '05', type: '3+1', area: '150m²', status: 'empty' },
        { id: '4', block: 'B', number: '06', type: '4+1', area: '180m²', status: 'occupied' },
    ];

    // Get available blocks
    const availableBlocks = Array.from(new Set(mockApartments.map(apt => apt.block)));

    // Get apartments for selected block
    const getApartmentsForBlock = (block: string) => {
        return mockApartments.filter(apt => apt.block === block);
    };

    // Populate form when resident data is loaded
    useEffect(() => {
        if (resident) {
            setFormData({
                firstName: resident.firstName,
                lastName: resident.lastName,
                email: resident.contact.email || '',
                phone: resident.contact.phone,
                residentType: resident.residentType.type,
                block: resident.address.building,
                apartmentNumber: resident.address.apartment,
                status: resident.status.type === 'active' ? 'ACTIVE' : 'INACTIVE',
                membershipTier: resident.membershipTier?.includes('Altın') ? 'GOLD' : 
                               resident.membershipTier?.includes('Gümüş') ? 'SILVER' : 'STANDARD',
                notes: resident.notes || ''
            });
        }
    }, [resident]);

    // Handle input changes
    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Ad zorunludur';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Soyad zorunludur';
        }

        // Phone validation (Iraqi format)
        if (!formData.phone) {
            newErrors.phone = 'Cep telefonu zorunludur';
        } else if (!/^7\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Geçerli bir Irak telefon numarası giriniz (7 ile başlamalı)';
        }

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi giriniz';
        }

        // Housing validation
        if (!formData.block) {
            newErrors.block = 'Blok seçimi zorunludur';
        }
        if (!formData.apartmentNumber) {
            newErrors.apartmentNumber = 'Daire seçimi zorunludur';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await updateResident(residentId, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                status: formData.status,
                membershipTier: formData.membershipTier,
                // Add property update if needed
                propertyIdentification: `${formData.block}-${formData.apartmentNumber}`
            });

            setShowSuccess(true);
            setHasChanges(false);
        } catch (error) {
            console.error('Failed to update resident:', error);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (hasChanges) {
            const confirmed = confirm('Değişiklikler kaydedilmedi. Çıkmak istediğinizden emin misiniz?');
            if (!confirmed) return;
        }
        router.push(`/dashboard/residents/${residentId}`);
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
                                        Sakin bilgileri güncellendi!
                                    </h2>
                                    <p className="text-text-light-secondary dark:text-text-secondary mb-6">
                                        {formData.firstName} {formData.lastName} - {formData.block} Blok, Daire {formData.apartmentNumber}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link href={`/dashboard/residents/${residentId}`}>
                                            <Button variant="primary">
                                                Sakin Detayını Görüntüle
                                            </Button>
                                        </Link>
                                        <Button variant="secondary" onClick={() => setShowSuccess(false)}>
                                            Düzenlemeye Devam Et
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

    // Loading state
    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader title="Yükleniyor..." breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="space-y-6">
                                    <div className="h-64 bg-gray-200 rounded"></div>
                                    <div className="h-48 bg-gray-200 rounded"></div>
                                    <div className="h-32 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    // Error state
    if (error) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader title="Hata" breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="text-center">
                                <div className="p-8">
                                    <AlertCircle className="h-12 w-12 text-primary-red mx-auto mb-4" />
                                    <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                                        Sakin bulunamadı
                                    </h2>
                                    <p className="text-text-light-secondary dark:text-text-secondary mb-6">
                                        {error}
                                    </p>
                                    <Link href="/dashboard/residents">
                                        <Button variant="primary">
                                            Sakin Listesine Dön
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!resident) {
        return null;
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
                        title={`${resident.fullName} - Düzenle`}
                        breadcrumbItems={breadcrumbItems}
                    />

                    {/* Main Content */}
                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header Actions */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <Link href={`/dashboard/residents/${residentId}`}>
                                    <Button variant="ghost" icon={ArrowLeft}>
                                        Geri Dön
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                        Sakin Bilgilerini Düzenle
                                    </h1>
                                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                        {resident.fullName} - ID: #{resident.id}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={handleCancel} icon={X}>
                                    İptal
                                </Button>
                                <Button 
                                    variant="primary" 
                                    onClick={handleSubmit}
                                    loading={saving}
                                    icon={Save}
                                >
                                    Kaydet
                                </Button>
                            </div>
                        </div>

                        {/* Save Error */}
                        {saveError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    <p className="text-red-800 text-sm">{saveError}</p>
                                </div>
                            </div>
                        )}

                        {/* Changes Warning */}
                        {hasChanges && (
                            <div className="mb-6 p-4 bg-primary-gold/10 border border-primary-gold/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Info className="h-5 w-5 text-primary-gold" />
                                    <p className="text-text-on-light dark:text-text-on-dark text-sm">
                                        Kaydedilmemiş değişiklikler var. Sayfadan ayrılmadan önce kaydetmeyi unutmayın.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Main Form */}
                        <form onSubmit={handleSubmit}>
                            <Card>
                                <div className="p-6">
                                    <div className="space-y-8">
                                        {/* Identity Information */}
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
                                                    {/* Mobile Phone */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Cep Telefonu *
                                                        </label>
                                                        <div className="flex">
                                                            <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-200 dark:bg-gray-700 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-lg">
                                                                +964
                                                            </span>
                                                            <input
                                                                type="tel"
                                                                className={`flex-1 px-3 py-2 border rounded-r-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.phone ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
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
                                                            E-posta
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

                                        {/* Housing Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <Home className="h-5 w-5 text-primary-gold" />
                                                Konut Bilgileri
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                {/* Resident Type */}
                                                <div className="mb-4">
                                                    <RadioButton
                                                        label="Sakin Tipi *"
                                                        name="residentType"
                                                        value={formData.residentType}
                                                        onChange={(e) => handleInputChange('residentType', e.target.value)}
                                                        direction="horizontal"
                                                        options={[
                                                            { value: 'owner', label: 'Malik' },
                                                            { value: 'tenant', label: 'Kiracı' },
                                                            { value: 'family', label: 'Aile Üyesi' }
                                                        ]}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Block Selection */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Blok *
                                                        </label>
                                                        <select
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.block ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            value={formData.block}
                                                            onChange={(e) => handleInputChange('block', e.target.value)}
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
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.apartmentNumber ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            value={formData.apartmentNumber}
                                                            onChange={(e) => handleInputChange('apartmentNumber', e.target.value)}
                                                            disabled={!formData.block}
                                                        >
                                                            <option value="">Seçiniz</option>
                                                            {formData.block && getApartmentsForBlock(formData.block).map(apt => (
                                                                <option key={apt.id} value={apt.number}>
                                                                    Daire {apt.number} ({apt.type})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.apartmentNumber && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.apartmentNumber}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <Building className="h-5 w-5 text-primary-gold" />
                                                Durum ve Üyelik
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Status */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Durum
                                                        </label>
                                                        <select
                                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold"
                                                            value={formData.status}
                                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                                        >
                                                            <option value="ACTIVE">Aktif</option>
                                                            <option value="INACTIVE">Pasif</option>
                                                            <option value="PENDING">Beklemede</option>
                                                        </select>
                                                    </div>

                                                    {/* Membership Tier */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Üyelik Seviyesi
                                                        </label>
                                                        <select
                                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold"
                                                            value={formData.membershipTier}
                                                            onChange={(e) => handleInputChange('membershipTier', e.target.value)}
                                                        >
                                                            <option value="STANDARD">Standart</option>
                                                            <option value="SILVER">Gümüş</option>
                                                            <option value="GOLD">Altın</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <MessageSquare className="h-5 w-5 text-primary-gold" />
                                                Notlar
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                        Ek Notlar
                                                    </label>
                                                    <textarea
                                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold"
                                                        rows={4}
                                                        placeholder="Bu sakinle ilgili özel notlar..."
                                                        value={formData.notes}
                                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                {hasChanges && (
                                                    <Badge variant="soft" color="warning">
                                                        Kaydedilmemiş değişiklikler
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
                                                <Button variant="secondary" onClick={handleCancel}>
                                                    İptal
                                                </Button>
                                                <Button 
                                                    variant="primary" 
                                                    size="lg" 
                                                    type="submit"
                                                    loading={saving}
                                                    className="px-12"
                                                >
                                                    Değişiklikleri Kaydet
                                                </Button>
                                            </div>
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