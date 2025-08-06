'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import {
    ArrowLeft,
    Check,
    Info,
    Building,
    Home,
    Store,
    Car,
    Calendar,
    User,
    MapPin,
    Ruler,
    FileText,
    Settings,
    Plus,
    Minus
} from 'lucide-react';

interface PropertyFormData {
    // Zorunlu alanlar
    name: string;
    propertyNumber: string;
    type: 'RESIDENCE' | 'VILLA' | 'COMMERCIAL' | 'OFFICE' | '';
    status: 'AVAILABLE' | 'OCCUPIED' | 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'GUEST_OCCUPIED' | 'FOR_SALE' | 'FOR_RENT' | 'UNDER_MAINTENANCE' | 'RESERVED' | 'LEGAL_ISSUE' | 'UNDER_CONSTRUCTION' | 'EMERGENCY_LOCK' | '';

    // Opsiyonel alanlar
    propertyGroup: string;
    area: number | '';
    blockNumber: string;
    floor: number | '';
    floorCount: number | '';
    villaType: string;

    // Features
    features: {
        rooms: {
            bedrooms: number | '';
            bathrooms: number | '';
            living: number | '';
            kitchen: number | '';
            study: number | '';
        };
        amenities: {
            pool: boolean;
            garage: number | '';
            smartHome: boolean;
            gym: boolean;
            spa: boolean;
            garden: boolean;
        };
        technical: {
            acSystem: string;
            generator: boolean;
            solarPanel: boolean;
            securitySystem: boolean;
            internetSpeed: string;
        };
        special: {
            seaView: boolean;
            beachAccess: boolean;
            vipLocation: boolean;
            privateElevator: boolean;
            customAmenities: string[];
        };
    };
}

export default function AddPropertyPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState<PropertyFormData>({
        name: '',
        propertyNumber: '',
        type: '',
        status: '',
        propertyGroup: '',
        area: '',
        blockNumber: '',
        floor: '',
        floorCount: '',
        villaType: '',
        features: {
            rooms: {
                bedrooms: '',
                bathrooms: '',
                living: '',
                kitchen: '',
                study: ''
            },
            amenities: {
                pool: false,
                garage: '',
                smartHome: false,
                gym: false,
                spa: false,
                garden: false
            },
            technical: {
                acSystem: '',
                generator: false,
                solarPanel: false,
                securitySystem: false,
                internetSpeed: ''
            },
            special: {
                seaView: false,
                beachAccess: false,
                vipLocation: false,
                privateElevator: false,
                customAmenities: []
            }
        }
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [customAmenity, setCustomAmenity] = useState('');

    // Breadcrumb for add property page
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Konutlar', href: '/dashboard/units' },
        { label: 'Yeni Konut Ekle', active: true }
    ];

    // Handle input changes
    const handleInputChange = (field: keyof PropertyFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Handle nested object changes
    const handleNestedChange = (section: string, subsection: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...(prev as any)[section],
                [subsection]: {
                    ...(prev as any)[section]?.[subsection],
                    [field]: value
                }
            }
        }));
    };

    // Handle array changes
    const handleArrayChange = (section: string, subsection: string, field: string, value: string[]) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...(prev as any)[section],
                [subsection]: {
                    ...(prev as any)[section]?.[subsection],
                    [field]: value
                }
            }
        }));
    };

    // Add custom amenity
    const addCustomAmenity = () => {
        if (customAmenity.trim()) {
            const currentAmenities = formData.features.special.customAmenities;
            if (!currentAmenities.includes(customAmenity.trim())) {
                handleArrayChange('features', 'special', 'customAmenities', [...currentAmenities, customAmenity.trim()]);
                setCustomAmenity('');
            }
        }
    };

    // Remove custom amenity
    const removeCustomAmenity = (amenity: string) => {
        const currentAmenities = formData.features.special.customAmenities;
        handleArrayChange('features', 'special', 'customAmenities', currentAmenities.filter(a => a !== amenity));
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Zorunlu alanlar
        if (!formData.name.trim()) {
            newErrors.name = 'Konut adı zorunludur';
        }

        if (!formData.propertyNumber.trim()) {
            newErrors.propertyNumber = 'Konut numarası zorunludur';
        }

        if (!formData.type) {
            newErrors.type = 'Konut tipi zorunludur';
        }

        if (!formData.status) {
            newErrors.status = 'Konut durumu zorunludur';
        }

        // Alan validasyonu
        if (formData.area !== '' && (formData.area < 0 || formData.area > 999999)) {
            newErrors.area = 'Alan 0-999999 arasında olmalıdır';
        }

        // Kat validasyonu
        if (formData.floor !== '' && (formData.floor < 0 || formData.floor > 999)) {
            newErrors.floor = 'Kat numarası 0-999 arasında olmalıdır';
        }

        // Villa kat sayısı validasyonu
        if (formData.floorCount !== '' && (formData.floorCount < 1 || formData.floorCount > 50)) {
            newErrors.floorCount = 'Villa kat sayısı 1-50 arasında olmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                // Prepare payload for POST /admin/properties endpoint
                const payload: any = {
                    name: formData.name,
                    propertyNumber: formData.propertyNumber,
                    type: formData.type,
                    status: formData.status
                };

                // Opsiyonel alanları ekle
                if (formData.propertyGroup) payload.propertyGroup = formData.propertyGroup;
                if (formData.area !== '') payload.area = Number(formData.area);
                if (formData.blockNumber) payload.blockNumber = formData.blockNumber;
                if (formData.floor !== '') payload.floor = Number(formData.floor);
                if (formData.floorCount !== '') payload.floorCount = Number(formData.floorCount);
                if (formData.villaType) payload.villaType = formData.villaType;

                // Features'ları temizle ve ekle
                const features: any = {};
                
                // Rooms
                const rooms: any = {};
                if (formData.features.rooms.bedrooms !== '') rooms.bedrooms = Number(formData.features.rooms.bedrooms);
                if (formData.features.rooms.bathrooms !== '') rooms.bathrooms = Number(formData.features.rooms.bathrooms);
                if (formData.features.rooms.living !== '') rooms.living = Number(formData.features.rooms.living);
                if (formData.features.rooms.kitchen !== '') rooms.kitchen = Number(formData.features.rooms.kitchen);
                if (formData.features.rooms.study !== '') rooms.study = Number(formData.features.rooms.study);
                if (Object.keys(rooms).length > 0) features.rooms = rooms;

                // Amenities
                const amenities: any = {};
                if (formData.features.amenities.pool) amenities.pool = true;
                if (formData.features.amenities.garage !== '') amenities.garage = Number(formData.features.amenities.garage);
                if (formData.features.amenities.smartHome) amenities.smartHome = true;
                if (formData.features.amenities.gym) amenities.gym = true;
                if (formData.features.amenities.spa) amenities.spa = true;
                if (formData.features.amenities.garden) amenities.garden = true;
                if (Object.keys(amenities).length > 0) features.amenities = amenities;

                // Technical
                const technical: any = {};
                if (formData.features.technical.acSystem) technical.acSystem = formData.features.technical.acSystem;
                if (formData.features.technical.generator) technical.generator = true;
                if (formData.features.technical.solarPanel) technical.solarPanel = true;
                if (formData.features.technical.securitySystem) technical.securitySystem = true;
                if (formData.features.technical.internetSpeed) technical.internetSpeed = formData.features.technical.internetSpeed;
                if (Object.keys(technical).length > 0) features.technical = technical;

                // Special
                const special: any = {};
                if (formData.features.special.seaView) special.seaView = true;
                if (formData.features.special.beachAccess) special.beachAccess = true;
                if (formData.features.special.vipLocation) special.vipLocation = true;
                if (formData.features.special.privateElevator) special.privateElevator = true;
                if (formData.features.special.customAmenities.length > 0) special.customAmenities = formData.features.special.customAmenities;
                if (Object.keys(special).length > 0) features.special = special;

                if (Object.keys(features).length > 0) payload.features = features;

                console.log('🔍 Form Data:', formData);
                console.log('🚀 API Payload:', payload);

                const response = await fetch('/api/proxy/admin/properties', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || 'Konut oluşturulamadı';
                    console.error('Property creation failed:', errorData);
                    throw new Error(errorMessage);
                }

                const propertyData = await response.json();
                console.log('Property created successfully:', propertyData);
                
                setShowSuccess(true);
            } catch (error: any) {
                console.error('Error in handleSubmit:', error);
                const errorMessage = error.message || 'Konut oluşturulurken bir hata oluştu';
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
                                        Konut başarıyla kaydedildi!
                                    </h2>
                                    <p className="text-text-light-secondary dark:text-text-secondary mb-2">
                                        {formData.name}
                                    </p>
                                    <p className="text-sm text-text-light-muted dark:text-text-muted mb-6">
                                        Konut No: {formData.propertyNumber}
                                    </p>

                                    <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4 mb-6">
                                        <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                            Şimdi ne yapmak istersiniz?
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Button variant="secondary" onClick={() => setShowSuccess(false)}>
                                            Yeni Konut Ekle
                                        </Button>
                                        <Link href="/dashboard/units">
                                            <Button variant="secondary">
                                                Konut Listesine Dön
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
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="lg:ml-72">
                    <DashboardHeader
                        title="Yeni Konut Ekle"
                        breadcrumbItems={breadcrumbItems}
                    />

                    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header Actions */}
                        <div className="flex justify-between items-center mb-6">
                            <Link href="/dashboard/units">
                                <Button variant="ghost" icon={ArrowLeft}>
                                    Geri Dön
                                </Button>
                            </Link>

                            <div className="flex gap-3">
                                <Link href="/dashboard/units">
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
                                        Temel bilgileri girerek konutu kaydedin, detayları sonra ekleyin
                                    </p>
                                    <p className="text-xs text-text-light-muted dark:text-text-muted mt-1">
                                        Konut kaydedildikten sonra detay sayfasından tüm bilgileri ekleyebilir ve düzenleyebilirsiniz.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Sol Kolon - Zorunlu Bilgiler */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Zorunlu Bilgiler */}
                                    <Card>
                                        <div className="p-6">
                                            <div className="text-center mb-6">
                                                <h2 className="text-xl font-bold text-text-on-light dark:text-text-on-dark">
                                                    ZORUNLU BİLGİLER
                                                </h2>
                                                <div className="w-24 h-1 bg-primary-gold rounded mx-auto mt-2"></div>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Temel Bilgiler */}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                        <Building className="h-5 w-5 text-primary-gold" />
                                                        Temel Bilgiler
                                                    </h3>
                                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {/* Konut Adı */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    Konut Adı *
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                                    placeholder="A1 Dairesi"
                                                                    value={formData.name}
                                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                                />
                                                                {errors.name && (
                                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                                                                )}
                                                            </div>

                                                            {/* Konut Numarası */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    Konut Numarası *
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.propertyNumber ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                                    placeholder="A1-101"
                                                                    value={formData.propertyNumber}
                                                                    onChange={(e) => handleInputChange('propertyNumber', e.target.value)}
                                                                />
                                                                {errors.propertyNumber && (
                                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.propertyNumber}</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                            {/* Konut Tipi */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    Konut Tipi *
                                                                </label>
                                                                <select
                                                                    className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.type ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                                    value={formData.type}
                                                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                                                >
                                                                    <option value="">Seçiniz</option>
                                                                    <option value="RESIDENCE">Konut</option>
                                                                    <option value="VILLA">Villa</option>
                                                                    <option value="COMMERCIAL">Ticari</option>
                                                                    <option value="OFFICE">Ofis</option>
                                                                </select>
                                                                {errors.type && (
                                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.type}</p>
                                                                )}
                                                            </div>

                                                            {/* Konut Durumu */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    Konut Durumu *
                                                                </label>
                                                                <select
                                                                    className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.status ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                                    value={formData.status}
                                                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                                                >
                                                                    <option value="">Seçiniz</option>
                                                                    <optgroup label="Boş">
                                                                        <option value="AVAILABLE">Boş</option>
                                                                        <option value="FOR_SALE">Satılık</option>
                                                                        <option value="FOR_RENT">Kiralık</option>
                                                                    </optgroup>
                                                                    <optgroup label="Dolu">
                                                                        <option value="OCCUPIED">Dolu</option>
                                                                        <option value="OWNER_OCCUPIED">Malik Dolu</option>
                                                                        <option value="TENANT_OCCUPIED">Kiracı Dolu</option>
                                                                        <option value="GUEST_OCCUPIED">Misafir Dolu</option>
                                                                    </optgroup>
                                                                    <optgroup label="Diğer">
                                                                        <option value="UNDER_MAINTENANCE">Bakımda</option>
                                                                        <option value="RESERVED">Rezerve</option>
                                                                        <option value="LEGAL_ISSUE">Yasal Sorun</option>
                                                                        <option value="UNDER_CONSTRUCTION">İnşaat Halinde</option>
                                                                        <option value="EMERGENCY_LOCK">Acil Kilit</option>
                                                                    </optgroup>
                                                                </select>
                                                                {errors.status && (
                                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.status}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Konum ve Alan Bilgileri */}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                        <MapPin className="h-5 w-5 text-primary-gold" />
                                                        Konum ve Alan
                                                    </h3>
                                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            {/* Property Group */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    Konut Grubu
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold border-gray-200 dark:border-gray-700"
                                                                    placeholder="A Block"
                                                                    value={formData.propertyGroup}
                                                                    onChange={(e) => handleInputChange('propertyGroup', e.target.value)}
                                                                />
                                                            </div>

                                                            {/* Blok Numarası */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    Blok Numarası
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold border-gray-200 dark:border-gray-700"
                                                                    placeholder="A"
                                                                    value={formData.blockNumber}
                                                                    onChange={(e) => handleInputChange('blockNumber', e.target.value)}
                                                                />
                                                            </div>

                                                            {/* Kat Numarası */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    Kat Numarası
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.floor ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                                    placeholder="3"
                                                                    value={formData.floor}
                                                                    onChange={(e) => handleInputChange('floor', e.target.value)}
                                                                />
                                                                {errors.floor && (
                                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.floor}</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                            {/* Alan */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    Alan (m²)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.area ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                                    placeholder="125.5"
                                                                    value={formData.area}
                                                                    onChange={(e) => handleInputChange('area', e.target.value)}
                                                                />
                                                                {errors.area && (
                                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.area}</p>
                                                                )}
                                                            </div>

                                                            {/* Villa Kat Sayısı */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    Villa Kat Sayısı
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.floorCount ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                                    placeholder="2"
                                                                    value={formData.floorCount}
                                                                    onChange={(e) => handleInputChange('floorCount', e.target.value)}
                                                                />
                                                                {errors.floorCount && (
                                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.floorCount}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Sağ Kolon - Opsiyonel Bilgiler */}
                                <div className="space-y-6">
                                    {/* Oda Bilgileri */}
                                    <Card>
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <Home className="h-5 w-5 text-primary-gold" />
                                                Oda Bilgileri
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                                                            Yatak Odası
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="w-full px-2 py-1 border rounded bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold border-gray-200 dark:border-gray-700"
                                                            placeholder="3"
                                                            value={formData.features.rooms.bedrooms}
                                                            onChange={(e) => handleNestedChange('features', 'rooms', 'bedrooms', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                                                            Banyo
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="w-full px-2 py-1 border rounded bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold border-gray-200 dark:border-gray-700"
                                                            placeholder="2"
                                                            value={formData.features.rooms.bathrooms}
                                                            onChange={(e) => handleNestedChange('features', 'rooms', 'bathrooms', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                                                            Salon
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="w-full px-2 py-1 border rounded bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold border-gray-200 dark:border-gray-700"
                                                            placeholder="1"
                                                            value={formData.features.rooms.living}
                                                            onChange={(e) => handleNestedChange('features', 'rooms', 'living', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                                                            Mutfak
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="w-full px-2 py-1 border rounded bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold border-gray-200 dark:border-gray-700"
                                                            placeholder="1"
                                                            value={formData.features.rooms.kitchen}
                                                            onChange={(e) => handleNestedChange('features', 'rooms', 'kitchen', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Özellikler */}
                                    <Card>
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <Settings className="h-5 w-5 text-primary-gold" />
                                                Özellikler
                                            </h3>
                                            <div className="space-y-4">
                                                {/* Amenities */}
                                                <div>
                                                    <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                        Olanaklar
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.amenities.pool}
                                                                onChange={(e) => handleNestedChange('features', 'amenities', 'pool', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">Havuz</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.amenities.smartHome}
                                                                onChange={(e) => handleNestedChange('features', 'amenities', 'smartHome', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">Akıllı Ev</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.amenities.gym}
                                                                onChange={(e) => handleNestedChange('features', 'amenities', 'gym', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">Spor Salonu</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.amenities.spa}
                                                                onChange={(e) => handleNestedChange('features', 'amenities', 'spa', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">Spa</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.amenities.garden}
                                                                onChange={(e) => handleNestedChange('features', 'amenities', 'garden', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">Bahçe</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Technical */}
                                                <div>
                                                    <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                        Teknik Özellikler
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.technical.generator}
                                                                onChange={(e) => handleNestedChange('features', 'technical', 'generator', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">Jeneratör</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.technical.solarPanel}
                                                                onChange={(e) => handleNestedChange('features', 'technical', 'solarPanel', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">Güneş Paneli</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.technical.securitySystem}
                                                                onChange={(e) => handleNestedChange('features', 'technical', 'securitySystem', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">Güvenlik Sistemi</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Special */}
                                                <div>
                                                    <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                        Özel Özellikler
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.special.seaView}
                                                                onChange={(e) => handleNestedChange('features', 'special', 'seaView', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">Deniz Manzarası</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.special.beachAccess}
                                                                onChange={(e) => handleNestedChange('features', 'special', 'beachAccess', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">Plaj Erişimi</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.special.vipLocation}
                                                                onChange={(e) => handleNestedChange('features', 'special', 'vipLocation', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">VIP Konum</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.special.privateElevator}
                                                                onChange={(e) => handleNestedChange('features', 'special', 'privateElevator', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">Özel Asansör</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Custom Amenities */}
                                                <div>
                                                    <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                        Özel Olanaklar
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                className="flex-1 px-2 py-1 border rounded bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold border-gray-200 dark:border-gray-700"
                                                                placeholder="Özel olanak ekle"
                                                                value={customAmenity}
                                                                onChange={(e) => setCustomAmenity(e.target.value)}
                                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={addCustomAmenity}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        {formData.features.special.customAmenities.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {formData.features.special.customAmenities.map((amenity, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary-gold/10 text-primary-gold rounded text-xs"
                                                                    >
                                                                        {amenity}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeCustomAmenity(amenity)}
                                                                            className="hover:text-primary-red"
                                                                        >
                                                                            <Minus className="h-3 w-3" />
                                                                        </button>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col items-center gap-2">
                                    <Button variant="primary" size="lg" type="submit" className="px-12">
                                        Konutu Kaydet
                                    </Button>
                                    {errors.submit && (
                                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errors.submit}</p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}