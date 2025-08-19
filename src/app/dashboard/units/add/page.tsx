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
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

// Dil çevirileri
const translations = {
  tr: {
    title: 'Yeni Konut Ekle',
    welcome: 'Konut ekleme formu',
    home: 'Ana Sayfa',
    units: 'Konutlar',
    addUnit: 'Yeni Konut Ekle',
    back: 'Geri Dön',
    cancel: 'İptal',
    save: 'Kaydet',
    success: 'Başarılı!',
    unitSaved: 'Konut başarıyla kaydedildi!',
    whatNext: 'Şimdi ne yapmak istersiniz?',
    addNewUnit: 'Yeni Konut Ekle',
    backToList: 'Konut Listesine Dön',
    infoTitle: 'Temel bilgileri girerek konutu kaydedin, detayları sonra ekleyin',
    infoDescription: 'Konut kaydedildikten sonra detay sayfasından tüm bilgileri ekleyebilir ve düzenleyebilirsiniz.',
    requiredInfo: 'ZORUNLU BİLGİLER',
    basicInfo: 'Temel Bilgiler',
    locationArea: 'Konum ve Alan',
    roomInfo: 'Oda Bilgileri',
    features: 'Özellikler',
    amenities: 'Olanaklar',
    technicalFeatures: 'Teknik Özellikler',
    specialFeatures: 'Özel Özellikler',
    customAmenities: 'Özel Olanaklar',
    unitName: 'Konut Adı',
    unitNumber: 'Konut Numarası',
    unitType: 'Konut Tipi',
    unitStatus: 'Konut Durumu',
    propertyGroup: 'Konut Grubu',
    blockNumber: 'Blok Numarası',
    floorNumber: 'Kat Numarası',
    area: 'Alan (m²)',
    villaFloorCount: 'Villa Kat Sayısı',
    bedrooms: 'Yatak Odası',
    bathrooms: 'Banyo',
    living: 'Salon',
    kitchen: 'Mutfak',
    pool: 'Havuz',
    smartHome: 'Akıllı Ev',
    gym: 'Spor Salonu',
    spa: 'Spa',
    garden: 'Bahçe',
    generator: 'Jeneratör',
    solarPanel: 'Güneş Paneli',
    securitySystem: 'Güvenlik Sistemi',
    seaView: 'Deniz Manzarası',
    beachAccess: 'Plaj Erişimi',
    vipLocation: 'VIP Konum',
    privateElevator: 'Özel Asansör',
    addCustomAmenity: 'Özel olanak ekle',
    saveUnit: 'Konutu Kaydet',
    selectOption: 'Seçiniz',
    residence: 'Konut',
    villa: 'Villa',
    commercial: 'Ticari',
    office: 'Ofis',
    empty: 'Boş',
    forSale: 'Satılık',
    forRent: 'Kiralık',
    occupied: 'Dolu',
    ownerOccupied: 'Malik Dolu',
    tenantOccupied: 'Kiracı Dolu',
    guestOccupied: 'Misafir Dolu',
    underMaintenance: 'Bakımda',
    reserved: 'Rezerve',
    legalIssue: 'Yasal Sorun',
    underConstruction: 'İnşaat Halinde',
    emergencyLock: 'Acil Kilit',
    other: 'Diğer',
    required: 'zorunludur',
    areaValidation: 'Alan 0-999999 arasında olmalıdır',
    floorValidation: 'Kat numarası 0-999 arasında olmalıdır',
    villaFloorValidation: 'Villa kat sayısı 1-50 arasında olmalıdır',
    unitCreationError: 'Konut oluşturulamadı',
    unitCreationFailed: 'Konut oluşturulurken bir hata oluştu',
    unitNumberLabel: 'Konut No'
  },
  en: {
    title: 'Add New Unit',
    welcome: 'Unit addition form',
    home: 'Home',
    units: 'Units',
    addUnit: 'Add New Unit',
    back: 'Go Back',
    cancel: 'Cancel',
    save: 'Save',
    success: 'Success!',
    unitSaved: 'Unit saved successfully!',
    whatNext: 'What would you like to do now?',
    addNewUnit: 'Add New Unit',
    backToList: 'Back to Unit List',
    infoTitle: 'Save the unit by entering basic information, add details later',
    infoDescription: 'After the unit is saved, you can add and edit all information from the detail page.',
    requiredInfo: 'REQUIRED INFORMATION',
    basicInfo: 'Basic Information',
    locationArea: 'Location and Area',
    roomInfo: 'Room Information',
    features: 'Features',
    amenities: 'Amenities',
    technicalFeatures: 'Technical Features',
    specialFeatures: 'Special Features',
    customAmenities: 'Custom Amenities',
    unitName: 'Unit Name',
    unitNumber: 'Unit Number',
    unitType: 'Unit Type',
    unitStatus: 'Unit Status',
    propertyGroup: 'Property Group',
    blockNumber: 'Block Number',
    floorNumber: 'Floor Number',
    area: 'Area (m²)',
    villaFloorCount: 'Villa Floor Count',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    living: 'Living Room',
    kitchen: 'Kitchen',
    pool: 'Pool',
    smartHome: 'Smart Home',
    gym: 'Gym',
    spa: 'Spa',
    garden: 'Garden',
    generator: 'Generator',
    solarPanel: 'Solar Panel',
    securitySystem: 'Security System',
    seaView: 'Sea View',
    beachAccess: 'Beach Access',
    vipLocation: 'VIP Location',
    privateElevator: 'Private Elevator',
    addCustomAmenity: 'Add custom amenity',
    saveUnit: 'Save Unit',
    selectOption: 'Select',
    residence: 'Residence',
    villa: 'Villa',
    commercial: 'Commercial',
    office: 'Office',
    empty: 'Empty',
    forSale: 'For Sale',
    forRent: 'For Rent',
    occupied: 'Occupied',
    ownerOccupied: 'Owner Occupied',
    tenantOccupied: 'Tenant Occupied',
    guestOccupied: 'Guest Occupied',
    underMaintenance: 'Under Maintenance',
    reserved: 'Reserved',
    legalIssue: 'Legal Issue',
    underConstruction: 'Under Construction',
    emergencyLock: 'Emergency Lock',
    other: 'Other',
    required: 'is required',
    areaValidation: 'Area must be between 0-999999',
    floorValidation: 'Floor number must be between 0-999',
    villaFloorValidation: 'Villa floor count must be between 1-50',
    unitCreationError: 'Unit could not be created',
    unitCreationFailed: 'An error occurred while creating the unit',
    unitNumberLabel: 'Unit No'
  },
  ar: {
    title: 'إضافة وحدة جديدة',
    welcome: 'نموذج إضافة الوحدة',
    home: 'الرئيسية',
    units: 'الوحدات',
    addUnit: 'إضافة وحدة جديدة',
    back: 'العودة',
    cancel: 'إلغاء',
    save: 'حفظ',
    success: 'نجح!',
    unitSaved: 'تم حفظ الوحدة بنجاح!',
    whatNext: 'ماذا تريد أن تفعل الآن؟',
    addNewUnit: 'إضافة وحدة جديدة',
    backToList: 'العودة إلى قائمة الوحدات',
    infoTitle: 'احفظ الوحدة بإدخال المعلومات الأساسية، أضف التفاصيل لاحقاً',
    infoDescription: 'بعد حفظ الوحدة، يمكنك إضافة وتحرير جميع المعلومات من صفحة التفاصيل.',
    requiredInfo: 'المعلومات المطلوبة',
    basicInfo: 'المعلومات الأساسية',
    locationArea: 'الموقع والمساحة',
    roomInfo: 'معلومات الغرف',
    features: 'الميزات',
    amenities: 'المرافق',
    technicalFeatures: 'الميزات التقنية',
    specialFeatures: 'الميزات الخاصة',
    customAmenities: 'المرافق المخصصة',
    unitName: 'اسم الوحدة',
    unitNumber: 'رقم الوحدة',
    unitType: 'نوع الوحدة',
    unitStatus: 'حالة الوحدة',
    propertyGroup: 'مجموعة العقار',
    blockNumber: 'رقم الكتلة',
    floorNumber: 'رقم الطابق',
    area: 'المساحة (م²)',
    villaFloorCount: 'عدد طوابق الفيلا',
    bedrooms: 'غرف النوم',
    bathrooms: 'الحمامات',
    living: 'غرفة المعيشة',
    kitchen: 'المطبخ',
    pool: 'المسبح',
    smartHome: 'المنزل الذكي',
    gym: 'صالة رياضية',
    spa: 'سبا',
    garden: 'الحديقة',
    generator: 'مولد',
    solarPanel: 'لوحة شمسية',
    securitySystem: 'نظام الأمان',
    seaView: 'إطلالة على البحر',
    beachAccess: 'الوصول للشاطئ',
    vipLocation: 'موقع VIP',
    privateElevator: 'مصعد خاص',
    addCustomAmenity: 'إضافة مرفق مخصص',
    saveUnit: 'حفظ الوحدة',
    selectOption: 'اختر',
    residence: 'سكني',
    villa: 'فيلا',
    commercial: 'تجاري',
    office: 'مكتب',
    empty: 'فارغ',
    forSale: 'للبيع',
    forRent: 'للإيجار',
    occupied: 'مشغول',
    ownerOccupied: 'مالك مشغول',
    tenantOccupied: 'مستأجر مشغول',
    guestOccupied: 'ضيف مشغول',
    underMaintenance: 'تحت الصيانة',
    reserved: 'محجوز',
    legalIssue: 'مشكلة قانونية',
    underConstruction: 'قيد الإنشاء',
    emergencyLock: 'قفل طوارئ',
    other: 'أخرى',
    required: 'مطلوب',
    areaValidation: 'يجب أن تكون المساحة بين 0-999999',
    floorValidation: 'يجب أن يكون رقم الطابق بين 0-999',
    villaFloorValidation: 'يجب أن يكون عدد طوابق الفيلا بين 1-50',
    unitCreationError: 'لا يمكن إنشاء الوحدة',
    unitCreationFailed: 'حدث خطأ أثناء إنشاء الوحدة',
    unitNumberLabel: 'رقم الوحدة'
  }
};

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
    const [currentLanguage, setCurrentLanguage] = useState('tr');

    // Dil tercihini localStorage'dan al
    React.useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Çevirileri al
    const t = translations[currentLanguage as keyof typeof translations];
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
        { label: t.home, href: '/dashboard' },
        { label: t.units, href: '/dashboard/units' },
        { label: t.addUnit, active: true }
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
            newErrors.name = `${t.unitName} ${t.required}`;
        }

        if (!formData.propertyNumber.trim()) {
            newErrors.propertyNumber = `${t.unitNumber} ${t.required}`;
        }

        if (!formData.type) {
            newErrors.type = `${t.unitType} ${t.required}`;
        }

        if (!formData.status) {
            newErrors.status = `${t.unitStatus} ${t.required}`;
        }

        // Alan validasyonu
        if (formData.area !== '' && (formData.area < 0 || formData.area > 999999)) {
            newErrors.area = t.areaValidation;
        }

        // Kat validasyonu
        if (formData.floor !== '' && (formData.floor < 0 || formData.floor > 999)) {
            newErrors.floor = t.floorValidation;
        }

        // Villa kat sayısı validasyonu
        if (formData.floorCount !== '' && (formData.floorCount < 1 || formData.floorCount > 50)) {
            newErrors.floorCount = t.villaFloorValidation;
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
                    const errorMessage = errorData.message || t.unitCreationError;
                    console.error('Property creation failed:', errorData);
                    throw new Error(errorMessage);
                }

                const propertyData = await response.json();
                console.log('Property created successfully:', propertyData);
                
                setShowSuccess(true);
            } catch (error: any) {
                console.error('Error in handleSubmit:', error);
                const errorMessage = error.message || t.unitCreationFailed;
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
                        <DashboardHeader title={t.success} breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="text-center">
                                <div className="p-8">
                                    <div className="w-16 h-16 bg-semantic-success-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="h-8 w-8 text-semantic-success-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2">
                                        {t.unitSaved}
                                    </h2>
                                    <p className="text-text-light-secondary dark:text-text-secondary mb-2">
                                        {formData.name}
                                    </p>
                                    <p className="text-sm text-text-light-muted dark:text-text-muted mb-6">
                                        {t.unitNumberLabel}: {formData.propertyNumber}
                                    </p>

                                    <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4 mb-6">
                                        <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                            {t.whatNext}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Button variant="secondary" onClick={() => setShowSuccess(false)}>
                                            {t.addNewUnit}
                                        </Button>
                                        <Link href="/dashboard/units">
                                            <Button variant="secondary">
                                                {t.backToList}
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
                        title={t.title}
                        breadcrumbItems={breadcrumbItems}
                    />

                    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Header with Language Switcher */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-text-on-light dark:text-text-on-dark">
                                    {t.title}
                                </h1>
                                <p className="mt-2 text-text-light-secondary dark:text-text-secondary">
                                    {t.welcome}
                                </p>
                            </div>
                            <LanguageSwitcher />
                        </div>

                        {/* Page Header Actions */}
                        <div className="flex justify-between items-center mb-6">
                            <Link href="/dashboard/units">
                                <Button variant="ghost" icon={ArrowLeft}>
                                    {t.back}
                                </Button>
                            </Link>

                            <div className="flex gap-3">
                                <Link href="/dashboard/units">
                                    <Button variant="secondary">
                                        {t.cancel}
                                    </Button>
                                </Link>
                                <Button variant="primary" onClick={handleSubmit}>
                                    {t.save}
                                </Button>
                            </div>
                        </div>

                        {/* Info Banner */}
                        <div className="bg-primary-gold/10 dark:bg-primary-gold/20 border border-primary-gold/20 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-primary-gold mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                        {t.infoTitle}
                                    </p>
                                    <p className="text-xs text-text-light-muted dark:text-text-muted mt-1">
                                        {t.infoDescription}
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
                                                    {t.requiredInfo}
                                                </h2>
                                                <div className="w-24 h-1 bg-primary-gold rounded mx-auto mt-2"></div>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Temel Bilgiler */}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                        <Building className="h-5 w-5 text-primary-gold" />
                                                        {t.basicInfo}
                                                    </h3>
                                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {/* Konut Adı */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    {t.unitName} *
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
                                                                    {t.unitNumber} *
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
                                                                    {t.unitType} *
                                                                </label>
                                                                <select
                                                                    className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.type ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                                    value={formData.type}
                                                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                                                >
                                                                    <option value="">{t.selectOption}</option>
                                                                    <option value="RESIDENCE">{t.residence}</option>
                                                                    <option value="VILLA">{t.villa}</option>
                                                                    <option value="COMMERCIAL">{t.commercial}</option>
                                                                    <option value="OFFICE">{t.office}</option>
                                                                </select>
                                                                {errors.type && (
                                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.type}</p>
                                                                )}
                                                            </div>

                                                            {/* Konut Durumu */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    {t.unitStatus} *
                                                                </label>
                                                                <select
                                                                    className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.status ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                                    value={formData.status}
                                                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                                                >
                                                                    <option value="">{t.selectOption}</option>
                                                                    <optgroup label={t.empty}>
                                                                        <option value="AVAILABLE">{t.empty}</option>
                                                                        <option value="FOR_SALE">{t.forSale}</option>
                                                                        <option value="FOR_RENT">{t.forRent}</option>
                                                                    </optgroup>
                                                                    <optgroup label={t.occupied}>
                                                                        <option value="OCCUPIED">{t.occupied}</option>
                                                                        <option value="OWNER_OCCUPIED">{t.ownerOccupied}</option>
                                                                        <option value="TENANT_OCCUPIED">{t.tenantOccupied}</option>
                                                                        <option value="GUEST_OCCUPIED">{t.guestOccupied}</option>
                                                                    </optgroup>
                                                                    <optgroup label={t.other}>
                                                                        <option value="UNDER_MAINTENANCE">{t.underMaintenance}</option>
                                                                        <option value="RESERVED">{t.reserved}</option>
                                                                        <option value="LEGAL_ISSUE">{t.legalIssue}</option>
                                                                        <option value="UNDER_CONSTRUCTION">{t.underConstruction}</option>
                                                                        <option value="EMERGENCY_LOCK">{t.emergencyLock}</option>
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
                                                        {t.locationArea}
                                                    </h3>
                                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            {/* Property Group */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                                    {t.propertyGroup}
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
                                                                    {t.blockNumber}
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
                                                                    {t.floorNumber}
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
                                                                    {t.area}
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
                                                                    {t.villaFloorCount}
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
                                                {t.roomInfo}
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                                                            {t.bedrooms}
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
                                                            {t.bathrooms}
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
                                                            {t.living}
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
                                                            {t.kitchen}
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
                                                {t.features}
                                            </h3>
                                            <div className="space-y-4">
                                                {/* Amenities */}
                                                <div>
                                                    <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                        {t.amenities}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.amenities.pool}
                                                                onChange={(e) => handleNestedChange('features', 'amenities', 'pool', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.pool}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.amenities.smartHome}
                                                                onChange={(e) => handleNestedChange('features', 'amenities', 'smartHome', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.smartHome}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.amenities.gym}
                                                                onChange={(e) => handleNestedChange('features', 'amenities', 'gym', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.gym}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.amenities.spa}
                                                                onChange={(e) => handleNestedChange('features', 'amenities', 'spa', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.spa}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.amenities.garden}
                                                                onChange={(e) => handleNestedChange('features', 'amenities', 'garden', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.garden}</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Technical */}
                                                <div>
                                                    <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                        {t.technicalFeatures}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.technical.generator}
                                                                onChange={(e) => handleNestedChange('features', 'technical', 'generator', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.generator}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.technical.solarPanel}
                                                                onChange={(e) => handleNestedChange('features', 'technical', 'solarPanel', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.solarPanel}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.technical.securitySystem}
                                                                onChange={(e) => handleNestedChange('features', 'technical', 'securitySystem', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.securitySystem}</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Special */}
                                                <div>
                                                    <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                        {t.specialFeatures}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.special.seaView}
                                                                onChange={(e) => handleNestedChange('features', 'special', 'seaView', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.seaView}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.special.beachAccess}
                                                                onChange={(e) => handleNestedChange('features', 'special', 'beachAccess', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.beachAccess}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.special.vipLocation}
                                                                onChange={(e) => handleNestedChange('features', 'special', 'vipLocation', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.vipLocation}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.features.special.privateElevator}
                                                                onChange={(e) => handleNestedChange('features', 'special', 'privateElevator', e.target.checked)}
                                                                className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                                                            />
                                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">{t.privateElevator}</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Custom Amenities */}
                                                <div>
                                                    <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                        {t.customAmenities}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                className="flex-1 px-2 py-1 border rounded bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold border-gray-200 dark:border-gray-700"
                                                                placeholder={t.addCustomAmenity}
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
                                        {t.saveUnit}
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