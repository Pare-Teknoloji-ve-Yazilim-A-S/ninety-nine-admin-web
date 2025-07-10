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
    identityType: 'nationalId' | 'passport' | 'citizenship' | 'residence';
    identityNumber: string;
    firstName: string;
    lastName: string;

    // Contact
    mobilePhone: string;
    hasWhatsApp: boolean;
    email: string;

    // Housing
    residentType: 'owner' | 'tenant' | 'family';
    block: string;
    apartmentNumber: string;

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
];

export default function AddResidentPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        identityType: 'nationalId',
        identityNumber: '',
        firstName: '',
        lastName: '',
        mobilePhone: '',
        hasWhatsApp: true,
        email: '',
        residentType: 'owner',
        block: '',
        apartmentNumber: '',
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
        if (field === 'apartmentNumber' && value) {
            const apartment = mockApartments.find(apt =>
                apt.block === formData.block && apt.number === value
            );
            setSelectedApartment(apartment || null);
        }
    };

    // Validate Iraqi National ID (basic format: 12 digits)
    const validateIraqiId = (id: string, type: string): boolean => {
        switch (type) {
            case 'nationalId':
                return /^\d{12}$/.test(id.replace(/\s/g, ''));
            case 'citizenship':
                return /^\d{10}$/.test(id.replace(/\s/g, ''));
            case 'passport':
                return /^[A-Z]\d{7,9}$/.test(id.replace(/\s/g, ''));
            case 'residence':
                return /^\d{8,10}$/.test(id.replace(/\s/g, ''));
            default:
                return false;
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Identity Number validation
        if (!formData.identityNumber) {
            newErrors.identityNumber = 'Kimlik numarası zorunludur';
        } else if (!validateIraqiId(formData.identityNumber, formData.identityType)) {
            switch (formData.identityType) {
                case 'nationalId':
                    newErrors.identityNumber = 'Ulusal kimlik numarası 12 haneli olmalıdır';
                    break;
                case 'citizenship':
                    newErrors.identityNumber = 'Vatandaşlık belgesi 10 haneli olmalıdır';
                    break;
                case 'passport':
                    newErrors.identityNumber = 'Pasaport formatı geçersiz (örnek: A1234567)';
                    break;
                case 'residence':
                    newErrors.identityNumber = 'İkamet kartı 8-10 haneli olmalıdır';
                    break;
            }
        }

        // Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Ad zorunludur';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Soyad zorunludur';
        }

        // Phone validation (Iraqi format)
        if (!formData.mobilePhone) {
            newErrors.mobilePhone = 'Cep telefonu zorunludur';
        } else if (!/^7\d{9}$/.test(formData.mobilePhone.replace(/\s/g, ''))) {
            newErrors.mobilePhone = 'Geçerli bir Irak telefon numarası giriniz (7 ile başlamalı)';
        }

        // Housing validation
        if (!formData.block) {
            newErrors.block = 'Blok seçimi zorunludur';
        }
        if (!formData.apartmentNumber) {
            newErrors.apartmentNumber = 'Daire seçimi zorunludur';
        }

        // Check if apartment is occupied
        if (selectedApartment?.status === 'occupied') {
            newErrors.apartmentNumber = 'Seçilen daire dolu görünüyor';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            // Mock successful save
            console.log('Form submitted:', formData);
            setShowSuccess(true);
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
                                        Kayıt No: #2024-{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}
                                    </p>

                                    <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4 mb-6">
                                        <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                            Şimdi ne yapmak istersiniz?
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link href="/dashboard/residents/1">
                                            <Button variant="primary">
                                                Detayları Düzenle
                                            </Button>
                                        </Link>
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

                                                {/* Identity Type */}
                                                <div className="mb-4">
                                                    <RadioButton
                                                        label="Kimlik Tipi"
                                                        name="identityType"
                                                        value={formData.identityType}
                                                        onChange={(e) => handleInputChange('identityType', e.target.value)}
                                                        direction="horizontal"
                                                        options={[
                                                            { value: 'nationalId', label: 'Ulusal Kimlik' },
                                                            { value: 'citizenship', label: 'Vatandaşlık Belgesi' },
                                                            { value: 'passport', label: 'Pasaport' },
                                                            { value: 'residence', label: 'İkamet Kartı' }
                                                        ]}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {/* Identity Number */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            Kimlik No *
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                className={`flex-1 px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.identityNumber ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                    }`}
                                                                placeholder={
                                                                    formData.identityType === 'nationalId' ? '123456789012' :
                                                                        formData.identityType === 'citizenship' ? '1234567890' :
                                                                            formData.identityType === 'passport' ? 'A1234567' : '12345678'
                                                                }
                                                                value={formData.identityNumber}
                                                                onChange={(e) => handleInputChange('identityNumber', e.target.value)}
                                                            />
                                                            <Button variant="secondary" size="sm" type="button">
                                                                ✓
                                                            </Button>
                                                        </div>
                                                        {errors.identityNumber && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.identityNumber}</p>
                                                        )}
                                                    </div>

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
                                                                className={`flex-1 px-3 py-2 border rounded-r-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.mobilePhone ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                    }`}
                                                                placeholder="750 123 4567"
                                                                value={formData.mobilePhone}
                                                                onChange={(e) => handleInputChange('mobilePhone', e.target.value)}
                                                            />
                                                        </div>
                                                        {errors.mobilePhone && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.mobilePhone}</p>
                                                        )}
                                                        <div className="mt-2">
                                                            <Checkbox
                                                                checked={formData.hasWhatsApp}
                                                                onChange={(e) => handleInputChange('hasWhatsApp', e.target.checked)}
                                                                label="WhatsApp"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Email */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            E-posta
                                                        </label>
                                                        <input
                                                            type="email"
                                                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold"
                                                            placeholder="ahmet@email.com"
                                                            value={formData.email}
                                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Housing Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <Home className="h-5 w-5 text-primary-gold" />
                                                Konut Atama
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
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.block ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                }`}
                                                            value={formData.block}
                                                            onChange={(e) => {
                                                                handleInputChange('block', e.target.value);
                                                                handleInputChange('apartmentNumber', ''); // Reset apartment selection
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
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.apartmentNumber ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                                                                }`}
                                                            value={formData.apartmentNumber}
                                                            onChange={(e) => handleInputChange('apartmentNumber', e.target.value)}
                                                            disabled={!formData.block}
                                                        >
                                                            <option value="">Seçiniz</option>
                                                            {formData.block && getApartmentsForBlock(formData.block).map(apt => (
                                                                <option key={apt.id} value={apt.number}>
                                                                    Daire {apt.number} ({apt.type}) - {apt.status === 'empty' ? 'Boş' : 'Dolu'}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.apartmentNumber && (
                                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.apartmentNumber}</p>
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
                                                        label="Standart aidat tutarını uygula (250,000)"
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
                                        <div className="flex justify-center">
                                            <Button variant="primary" size="lg" type="submit" className="px-12">
                                                Sakini Kaydet
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