'use client';

import React, { useState, useEffect } from 'react';
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

// Dil çevirileri
const translations = {
  tr: {
    // Page titles and headers
    pageTitle: 'Yeni Sakin - Hızlı Kayıt',
    successTitle: 'Başarılı!',
    successMessage: 'Sakin başarıyla kaydedildi!',
    
    // Breadcrumb
    home: 'Ana Sayfa',
    residents: 'Sakinler',
    
    // Form sections
    requiredInfo: 'ZORUNLU BİLGİLER',
    identityInfo: 'Kimlik Bilgileri',
    contactInfo: 'İletişim',
    personalInfo: 'Kişisel Bilgiler',
    
    // Form fields
    identityNumber: 'Kimlik Numarası',
    firstName: 'Ad',
    lastName: 'Soyad',
    phone: 'Telefon',
    email: 'E-posta',
    dateOfBirth: 'Doğum Tarihi',
    gender: 'Cinsiyet',
    
    // Form placeholders
    identityNumberPlaceholder: '12345678901',
    firstNamePlaceholder: 'Ahmet',
    lastNamePlaceholder: 'Yılmaz',
    phonePlaceholder: '5XX XXX XX XX',
    emailPlaceholder: 'ahmet@email.com',
    
    // Gender options
    selectGender: 'Seçiniz',
    male: 'Erkek',
    female: 'Kadın',
    other: 'Diğer',
    
    // Buttons
    back: 'Geri Dön',
    cancel: 'İptal',
    save: 'Kaydet',
    saveResident: 'Sakini Kaydet',
    addNewResident: 'Yeni Sakin Ekle',
    backToResidents: 'Sakin Listesine Dön',
    
    // Info banner
    infoTitle: 'Temel bilgileri girerek sakini kaydedin, detayları sonra ekleyin',
    infoDescription: 'Sakin kaydedildikten sonra detay sayfasından tüm bilgileri ekleyebilir ve düzenleyebilirsiniz.',
    
    // Success modal
    recordNumber: 'Kayıt No:',
    temporaryPassword: 'Geçici Şifre',
    temporaryPasswordInfo: 'Bu şifre ile giriş yapabilirsiniz.',
    whatNext: 'Şimdi ne yapmak istersiniz?',
    
    // Validation messages
    identityNumberRequired: 'Kimlik numarası zorunludur',
    identityNumberInvalid: 'TC kimlik numarası 11 haneli olmalıdır',
    firstNameRequired: 'Ad zorunludur',
    lastNameRequired: 'Soyad zorunludur',
    phoneRequired: 'Telefon numarası zorunludur',
    emailRequired: 'E-posta zorunludur',
    dateOfBirthRequired: 'Doğum tarihi zorunludur',
    genderRequired: 'Cinsiyet zorunludur',
    residentCreationFailed: 'Sakin oluşturulamadı',
    residentCreationError: 'Sakin oluşturulurken bir hata oluştu'
  },
  en: {
    // Page titles and headers
    pageTitle: 'New Resident - Quick Registration',
    successTitle: 'Success!',
    successMessage: 'Resident saved successfully!',
    
    // Breadcrumb
    home: 'Home',
    residents: 'Residents',
    
    // Form sections
    requiredInfo: 'REQUIRED INFORMATION',
    identityInfo: 'Identity Information',
    contactInfo: 'Contact',
    personalInfo: 'Personal Information',
    
    // Form fields
    identityNumber: 'Identity Number',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    email: 'Email',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    
    // Form placeholders
    identityNumberPlaceholder: '12345678901',
    firstNamePlaceholder: 'John',
    lastNamePlaceholder: 'Doe',
    phonePlaceholder: '5XX XXX XX XX',
    emailPlaceholder: 'john@email.com',
    
    // Gender options
    selectGender: 'Select',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    
    // Buttons
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    saveResident: 'Save Resident',
    addNewResident: 'Add New Resident',
    backToResidents: 'Back to Residents',
    
    // Info banner
    infoTitle: 'Enter basic information to register the resident, add details later',
    infoDescription: 'After the resident is registered, you can add and edit all information from the detail page.',
    
    // Success modal
    recordNumber: 'Record No:',
    temporaryPassword: 'Temporary Password',
    temporaryPasswordInfo: 'You can login with this password.',
    whatNext: 'What would you like to do now?',
    
    // Validation messages
    identityNumberRequired: 'Identity number is required',
    identityNumberInvalid: 'TC identity number must be 11 digits',
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    phoneRequired: 'Phone number is required',
    emailRequired: 'Email is required',
    dateOfBirthRequired: 'Date of birth is required',
    genderRequired: 'Gender is required',
    residentCreationFailed: 'Resident creation failed',
    residentCreationError: 'An error occurred while creating the resident'
  },
  ar: {
    // Page titles and headers
    pageTitle: 'ساكن جديد - تسجيل سريع',
    successTitle: 'نجح!',
    successMessage: 'تم حفظ الساكن بنجاح!',
    
    // Breadcrumb
    home: 'الرئيسية',
    residents: 'السكان',
    
    // Form sections
    requiredInfo: 'المعلومات المطلوبة',
    identityInfo: 'معلومات الهوية',
    contactInfo: 'جهة الاتصال',
    personalInfo: 'المعلومات الشخصية',
    
    // Form fields
    identityNumber: 'رقم الهوية',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    dateOfBirth: 'تاريخ الميلاد',
    gender: 'الجنس',
    
    // Form placeholders
    identityNumberPlaceholder: '12345678901',
    firstNamePlaceholder: 'أحمد',
    lastNamePlaceholder: 'محمد',
    phonePlaceholder: '5XX XXX XX XX',
    emailPlaceholder: 'ahmed@email.com',
    
    // Gender options
    selectGender: 'اختر',
    male: 'ذكر',
    female: 'أنثى',
    other: 'آخر',
    
    // Buttons
    back: 'رجوع',
    cancel: 'إلغاء',
    save: 'حفظ',
    saveResident: 'حفظ الساكن',
    addNewResident: 'إضافة ساكن جديد',
    backToResidents: 'العودة إلى السكان',
    
    // Info banner
    infoTitle: 'أدخل المعلومات الأساسية لتسجيل الساكن، أضف التفاصيل لاحقاً',
    infoDescription: 'بعد تسجيل الساكن، يمكنك إضافة وتعديل جميع المعلومات من صفحة التفاصيل.',
    
    // Success modal
    recordNumber: 'رقم السجل:',
    temporaryPassword: 'كلمة المرور المؤقتة',
    temporaryPasswordInfo: 'يمكنك تسجيل الدخول بهذه كلمة المرور.',
    whatNext: 'ماذا تريد أن تفعل الآن؟',
    
    // Validation messages
    identityNumberRequired: 'رقم الهوية مطلوب',
    identityNumberInvalid: 'رقم الهوية التركي يجب أن يكون 11 رقم',
    firstNameRequired: 'الاسم الأول مطلوب',
    lastNameRequired: 'اسم العائلة مطلوب',
    phoneRequired: 'رقم الهاتف مطلوب',
    emailRequired: 'البريد الإلكتروني مطلوب',
    dateOfBirthRequired: 'تاريخ الميلاد مطلوب',
    genderRequired: 'الجنس مطلوب',
    residentCreationFailed: 'فشل في إنشاء الساكن',
    residentCreationError: 'حدث خطأ أثناء إنشاء الساكن'
  }
};


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

    // Dil tercihini localStorage'dan al
    const [currentLanguage, setCurrentLanguage] = useState('tr');
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Çevirileri al
    const t = translations[currentLanguage as keyof typeof translations];


    // Breadcrumb for add resident page
    const breadcrumbItems = [
        { label: t.home, href: '/dashboard' },
        { label: t.residents, href: '/dashboard/residents' },
        { label: t.addNewResident, active: true }
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
            newErrors.identityNumber = t.identityNumberRequired;
        } else if (!validateTurkishId(formData.identityNumber)) {
            newErrors.identityNumber = t.identityNumberInvalid;
        }

        // Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = t.firstNameRequired;
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = t.lastNameRequired;
        }

        // Phone validation
        if (!formData.phone) {
            newErrors.phone = t.phoneRequired;
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = t.emailRequired;
        }

        // Date of birth validation
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = t.dateOfBirthRequired;
        }

        // Gender validation
        if (!formData.gender) {
            newErrors.gender = t.genderRequired;
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
                    const errorMessage = errorData.message || t.residentCreationFailed;
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
                const errorMessage = error.message || t.residentCreationError;
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
                        <DashboardHeader title={t.successTitle} breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="text-center">
                                <div className="p-8">
                                    <div className="w-16 h-16 bg-semantic-success-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="h-8 w-8 text-semantic-success-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2">
                                        {t.successMessage}
                                    </h2>
                                    <p className="text-text-light-secondary dark:text-text-secondary mb-2">
                                        {formData.firstName} {formData.lastName}
                                    </p>
                                    <p className="text-sm text-text-light-muted dark:text-text-muted mb-6">
                                        {t.recordNumber} #2024-{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}
                                    </p>

                                    {temporaryPassword && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                                            <div className="flex items-start gap-2">
                                                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                                        {t.temporaryPassword}
                                                    </p>
                                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                                        <strong>{temporaryPassword}</strong> - {t.temporaryPasswordInfo}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4 mb-6">
                                        <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                            {t.whatNext}
                                        </p>
                                    </div>

                                                                         <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                         <Button variant="secondary" onClick={() => setShowSuccess(false)}>
                                             {t.addNewResident}
                                         </Button>
                                         <Link href="/dashboard/residents">
                                             <Button variant="secondary">
                                                 {t.backToResidents}
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
                        title={t.pageTitle}
                        breadcrumbItems={breadcrumbItems}
                    />

                    {/* Main Content */}
                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header Actions */}
                        <div className="flex justify-between items-center mb-6">
                            <Link href="/dashboard/residents">
                                <Button variant="ghost" icon={ArrowLeft}>
                                    {t.back}
                                </Button>
                            </Link>

                            <div className="flex gap-3">
                                <Link href="/dashboard/residents">
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
                            <Card>
                                <div className="p-6">
                                    <div className="text-center mb-8">
                                        <h2 className="text-xl font-bold text-text-on-light dark:text-text-on-dark">
                                            {t.requiredInfo}
                                        </h2>
                                        <div className="w-24 h-1 bg-primary-gold rounded mx-auto mt-2"></div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Identity Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <User className="h-5 w-5 text-primary-gold" />
                                                {t.identityInfo}
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">

                                                {/* Kimlik Numarası - Tek başına en üstte */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                        {t.identityNumber} *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.identityNumber ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                        placeholder={t.identityNumberPlaceholder}
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
                                                            {t.firstName} *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.firstName ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            placeholder={t.firstNamePlaceholder}
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
                                                            {t.lastName} *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.lastName ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            placeholder={t.lastNamePlaceholder}
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
                                                {t.contactInfo}
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Phone */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            {t.phone} *
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.phone ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            placeholder={t.phonePlaceholder}
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
                                                            {t.email} *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            placeholder={t.emailPlaceholder}
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
                                                {t.personalInfo}
                                            </h3>
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Date of Birth */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                                            {t.dateOfBirth} *
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
                                                            {t.gender} *
                                                        </label>
                                                        <select
                                                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.gender ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                                                            value={formData.gender}
                                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                                        >
                                                            <option value="">{t.selectGender}</option>
                                                            <option value="MALE">{t.male}</option>
                                                            <option value="FEMALE">{t.female}</option>
                                                            <option value="OTHER">{t.other}</option>
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
                                                {t.saveResident}
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