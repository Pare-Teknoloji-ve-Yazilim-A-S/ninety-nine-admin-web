'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import { unitPricesService } from '@/services/unit-prices.service';
import enumsService from '@/services/enums.service';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles
    pageTitle: 'Ayarlar',
    
    // Breadcrumb
    home: 'Ana Sayfa',
    settings: 'Ayarlar',
    
    // Section titles
    securitySettings: 'Güvenlik Ayarları',
    unitPrices: 'Birim Fiyatlar',
    systemEnums: 'Sistem Enum Değerleri',
    availableUnits: 'Kullanılabilir Birimler',
    priceTypes: 'Fiyat Türleri ve Birim Fiyatlar',
    
    // Security settings
    sessionTimeout: 'Oturum Zaman Aşımı',
    passwordExpiry: 'Şifre Geçerlilik Süresi',
    maxLoginAttempts: 'Maksimum Giriş Denemesi',
    twoFactorAuth: 'İki Faktörlü Kimlik Doğrulama',
    passwordMinLength: 'Minimum Şifre Uzunluğu',
    passwordRequireUppercase: 'Büyük Harf Gereksinimi',
    passwordRequireLowercase: 'Küçük Harf Gereksinimi',
    passwordRequireNumbers: 'Sayı Gereksinimi',
    passwordRequireSpecialChars: 'Özel Karakter Gereksinimi',
    accountLockoutThreshold: 'Hesap Kilitleme Eşiği',
    accountLockoutDuration: 'Hesap Kilitleme Süresi',
    passwordHistoryCount: 'Şifre Geçmişi Sayısı',
    
    // Unit price labels
    dues: 'Aidat',
    electricity: 'Elektrik',
    water: 'Su',
    gas: 'Doğalgaz',
    heating: 'Isıtma',
    
    // Unit price descriptions
    duesDescription: 'Metrekare başına aidat ücreti',
    electricityDescription: 'Kilowatt saat başına elektrik ücreti',
    waterDescription: 'Metreküp başına su ücreti',
    gasDescription: 'Metreküp başına doğalgaz ücreti',
    heatingDescription: 'Metrekare başına ısıtma ücreti',
    
    // Units
    squareMeter: 'Metrekare',
    squareMeterDesc: 'Metrekare cinsinden',
    kilowattHour: 'Kilowatt Saat',
    kilowattHourDesc: 'Elektrik tüketimi için',
    cubicMeter: 'Metreküp',
    cubicMeterDesc: 'Su ve doğalgaz için',
    piece: 'Adet',
    pieceDesc: 'Adet bazında ücretlendirme',
    
    // Buttons
    edit: 'Düzenle',
    save: 'Kaydet',
    cancel: 'İptal',
    add: 'Ekle',
    remove: 'Kaldır',
    createPosition: 'Pozisyon Oluştur',
    createEnumValues: 'Enum Değerlerini Ekle',
    adding: 'Ekleniyor...',
    
    // Form labels
    unitPrice: 'Birim Fiyat',
    unit: 'Birim',
    title: 'Başlık',
    code: 'Kod',
    description: 'Açıklama',
    department: 'Departman',
    level: 'Seviye',
    salaryMin: 'Minimum Maaş',
    salaryMax: 'Maksimum Maaş',
    requirements: 'Gereksinimler',
    responsibilities: 'Sorumluluklar',
    isActive: 'Aktif',
    sortOrder: 'Sıralama Numarası',
    
    // Placeholders
    unitPricePlaceholder: '0.00',
    titlePlaceholder: 'Pozisyon başlığı',
    codePlaceholder: 'Pozisyon kodu',
    descriptionPlaceholder: 'Pozisyon açıklaması',
    levelPlaceholder: 'Seviye',
    salaryMinPlaceholder: 'Minimum maaş',
    salaryMaxPlaceholder: 'Maksimum maaş',
    requirementPlaceholder: 'Gereksinim',
    responsibilityPlaceholder: 'Sorumluluk',
    enumCodePlaceholder: 'Enum değeri (örn: NEW_STATUS)',
    sortOrderPlaceholder: '1',
    
    // Messages
    loadingUnitPrices: 'Birim fiyatlar yükleniyor...',
    loadingEnums: 'Enum değerleri yükleniyor...',
    noEnumsFound: 'Enum değerleri bulunamadı.',
    noUnitPricesFound: 'Birim fiyat bulunamadı.',
    codeFormatInfo: 'Kod formatı: UPPER_CASE (örn: NEW_STATUS, PENDING_APPROVAL). Label otomatik olarak oluşturulacak.',
    preview: 'Önizleme:',
    categories: 'kategori',
    
    // System descriptions
    systemEnumsDescription: 'Sistem genelindeki ayarları, entegrasyonları ve bakımı yapılandırın',
    securitySettingsDescription: 'Uygulama için önceden tanımlı parametreleri kontrol edin ve güncelleyin.',
    unitPricesDescription: 'Sistemde kullanılan birim fiyatlarını yapılandırın. Aidat, elektrik, su, doğalgaz ve ısıtma fiyatlarını belirleyin.',
    
    // Device settings
    deviceSettings: 'Cihaz Ayarları',
    
    // Position form
    selectLevel: 'Seviye Seçin',
    junior: 'Junior',
    midLevel: 'Mid-Level',
    senior: 'Senior',
    lead: 'Lead',
    manager: 'Manager',
    director: 'Director',
    activePosition: 'Aktif Pozisyon',
    creatingPosition: 'Oluşturuluyor...',
    
    // Enum form
    module: 'Modül',
    category: 'Kategori',
    enumValues: 'Enum Değerleri',
    
    // Enum categories
    staffSettings: 'Personel Ayarları',
    propertySettings: 'Mülk Ayarları',
    ticketSettings: 'Talep Ayarları',
    billingSettings: 'Faturalama Ayarları',
    userSettings: 'Kullanıcı Ayarları',
    paymentSettings: 'Ödeme Ayarları',
    announcementSettings: 'Duyuru Ayarları',
    qrCodeSettings: 'QR Kod Ayarları',
    familyMemberSettings: 'Aile Üyesi Ayarları',
    userPropertySettings: 'Kullanıcı Mülk Ayarları',
    roleSettings: 'Rol Ayarları'
  },
  en: {
    // Page titles
    pageTitle: 'Settings',
    
    // Breadcrumb
    home: 'Home',
    settings: 'Settings',
    
    // Section titles
    securitySettings: 'Security Settings',
    unitPrices: 'Unit Prices',
    systemEnums: 'System Enum Values',
    availableUnits: 'Available Units',
    priceTypes: 'Price Types and Unit Prices',
    
    // Security settings
    sessionTimeout: 'Session Timeout',
    passwordExpiry: 'Password Expiry',
    maxLoginAttempts: 'Max Login Attempts',
    twoFactorAuth: 'Two Factor Authentication',
    passwordMinLength: 'Password Min Length',
    passwordRequireUppercase: 'Require Uppercase',
    passwordRequireLowercase: 'Require Lowercase',
    passwordRequireNumbers: 'Require Numbers',
    passwordRequireSpecialChars: 'Require Special Characters',
    accountLockoutThreshold: 'Account Lockout Threshold',
    accountLockoutDuration: 'Account Lockout Duration',
    passwordHistoryCount: 'Password History Count',
    
    // Unit price labels
    dues: 'Dues',
    electricity: 'Electricity',
    water: 'Water',
    gas: 'Gas',
    heating: 'Heating',
    
    // Unit price descriptions
    duesDescription: 'Dues per square meter',
    electricityDescription: 'Electricity per kilowatt hour',
    waterDescription: 'Water per cubic meter',
    gasDescription: 'Gas per cubic meter',
    heatingDescription: 'Heating per square meter',
    
    // Units
    squareMeter: 'Square Meter',
    squareMeterDesc: 'In square meters',
    kilowattHour: 'Kilowatt Hour',
    kilowattHourDesc: 'For electricity consumption',
    cubicMeter: 'Cubic Meter',
    cubicMeterDesc: 'For water and gas',
    piece: 'Piece',
    pieceDesc: 'Per piece pricing',
    
    // Buttons
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    add: 'Add',
    remove: 'Remove',
    createPosition: 'Create Position',
    createEnumValues: 'Add Enum Values',
    adding: 'Adding...',
    
    // Form labels
    unitPrice: 'Unit Price',
    unit: 'Unit',
    title: 'Title',
    code: 'Code',
    description: 'Description',
    department: 'Department',
    level: 'Level',
    salaryMin: 'Min Salary',
    salaryMax: 'Max Salary',
    requirements: 'Requirements',
    responsibilities: 'Responsibilities',
    isActive: 'Active',
    sortOrder: 'Sort Order',
    
    // Placeholders
    unitPricePlaceholder: '0.00',
    titlePlaceholder: 'Position title',
    codePlaceholder: 'Position code',
    descriptionPlaceholder: 'Position description',
    levelPlaceholder: 'Level',
    salaryMinPlaceholder: 'Min salary',
    salaryMaxPlaceholder: 'Max salary',
    requirementPlaceholder: 'Requirement',
    responsibilityPlaceholder: 'Responsibility',
    enumCodePlaceholder: 'Enum value (e.g.: NEW_STATUS)',
    sortOrderPlaceholder: '1',
    
    // Messages
    loadingUnitPrices: 'Loading unit prices...',
    loadingEnums: 'Loading enum values...',
    noEnumsFound: 'No enum values found.',
    noUnitPricesFound: 'No unit prices found.',
    codeFormatInfo: 'Code format: UPPER_CASE (e.g.: NEW_STATUS, PENDING_APPROVAL). Label will be generated automatically.',
    preview: 'Preview:',
    categories: 'categories',
    
    // System descriptions
    systemEnumsDescription: 'Configure system-wide settings, integrations and maintenance',
    securitySettingsDescription: 'Check and update predefined parameters for the application.',
    unitPricesDescription: 'Configure unit prices used in the system. Set prices for dues, electricity, water, gas and heating.',
    
    // Device settings
    deviceSettings: 'Device Settings',
    
    // Position form
    selectLevel: 'Select Level',
    junior: 'Junior',
    midLevel: 'Mid-Level',
    senior: 'Senior',
    lead: 'Lead',
    manager: 'Manager',
    director: 'Director',
    activePosition: 'Active Position',
    creatingPosition: 'Creating...',
    
    // Enum form
    module: 'Module',
    category: 'Category',
    enumValues: 'Enum Values',
    
    // Enum categories
    staffSettings: 'Staff Settings',
    propertySettings: 'Property Settings',
    ticketSettings: 'Ticket Settings',
    billingSettings: 'Billing Settings',
    userSettings: 'User Settings',
    paymentSettings: 'Payment Settings',
    announcementSettings: 'Announcement Settings',
    qrCodeSettings: 'QR Code Settings',
    familyMemberSettings: 'Family Member Settings',
    userPropertySettings: 'User Property Settings',
    roleSettings: 'Role Settings'
  },
  ar: {
    // Page titles
    pageTitle: 'الإعدادات',
    
    // Breadcrumb
    home: 'الرئيسية',
    settings: 'الإعدادات',
    
    // Section titles
    securitySettings: 'إعدادات الأمان',
    unitPrices: 'أسعار الوحدات',
    systemEnums: 'قيم التعداد النظامية',
    availableUnits: 'الوحدات المتاحة',
    priceTypes: 'أنواع الأسعار وأسعار الوحدات',
    
    // Security settings
    sessionTimeout: 'انتهاء صلاحية الجلسة',
    passwordExpiry: 'انتهاء صلاحية كلمة المرور',
    maxLoginAttempts: 'الحد الأقصى لمحاولات تسجيل الدخول',
    twoFactorAuth: 'المصادقة الثنائية',
    passwordMinLength: 'الحد الأدنى لطول كلمة المرور',
    passwordRequireUppercase: 'تتطلب أحرف كبيرة',
    passwordRequireLowercase: 'تتطلب أحرف صغيرة',
    passwordRequireNumbers: 'تتطلب أرقام',
    passwordRequireSpecialChars: 'تتطلب أحرف خاصة',
    accountLockoutThreshold: 'عتبة قفل الحساب',
    accountLockoutDuration: 'مدة قفل الحساب',
    passwordHistoryCount: 'عدد تاريخ كلمة المرور',
    
    // Unit price labels
    dues: 'الرسوم',
    electricity: 'الكهرباء',
    water: 'الماء',
    gas: 'الغاز',
    heating: 'التدفئة',
    
    // Unit price descriptions
    duesDescription: 'الرسوم لكل متر مربع',
    electricityDescription: 'الكهرباء لكل كيلوواط ساعة',
    waterDescription: 'الماء لكل متر مكعب',
    gasDescription: 'الغاز لكل متر مكعب',
    heatingDescription: 'التدفئة لكل متر مربع',
    
    // Units
    squareMeter: 'متر مربع',
    squareMeterDesc: 'بالمتر المربع',
    kilowattHour: 'كيلوواط ساعة',
    kilowattHourDesc: 'لاستهلاك الكهرباء',
    cubicMeter: 'متر مكعب',
    cubicMeterDesc: 'للماء والغاز',
    piece: 'قطعة',
    pieceDesc: 'التسعير لكل قطعة',
    
    // Buttons
    edit: 'تعديل',
    save: 'حفظ',
    cancel: 'إلغاء',
    add: 'إضافة',
    remove: 'إزالة',
    createPosition: 'إنشاء منصب',
    createEnumValues: 'إضافة قيم التعداد',
    adding: 'جاري الإضافة...',
    
    // Form labels
    unitPrice: 'سعر الوحدة',
    unit: 'الوحدة',
    title: 'العنوان',
    code: 'الرمز',
    description: 'الوصف',
    department: 'القسم',
    level: 'المستوى',
    salaryMin: 'الحد الأدنى للراتب',
    salaryMax: 'الحد الأقصى للراتب',
    requirements: 'المتطلبات',
    responsibilities: 'المسؤوليات',
    isActive: 'نشط',
    sortOrder: 'ترتيب الفرز',
    
    // Placeholders
    unitPricePlaceholder: '0.00',
    titlePlaceholder: 'عنوان المنصب',
    codePlaceholder: 'رمز المنصب',
    descriptionPlaceholder: 'وصف المنصب',
    levelPlaceholder: 'المستوى',
    salaryMinPlaceholder: 'الحد الأدنى للراتب',
    salaryMaxPlaceholder: 'الحد الأقصى للراتب',
    requirementPlaceholder: 'المتطلب',
    responsibilityPlaceholder: 'المسؤولية',
    enumCodePlaceholder: 'قيمة التعداد (مثال: NEW_STATUS)',
    sortOrderPlaceholder: '1',
    
    // Messages
    loadingUnitPrices: 'جاري تحميل أسعار الوحدات...',
    loadingEnums: 'جاري تحميل قيم التعداد...',
    noEnumsFound: 'لم يتم العثور على قيم التعداد.',
    noUnitPricesFound: 'لم يتم العثور على أسعار الوحدات.',
    codeFormatInfo: 'تنسيق الرمز: UPPER_CASE (مثال: NEW_STATUS, PENDING_APPROVAL). سيتم إنشاء التسمية تلقائياً.',
    preview: 'معاينة:',
    categories: 'فئات',
    
    // System descriptions
    systemEnumsDescription: 'تكوين الإعدادات النظامية والتفاعلات والصيانة',
    securitySettingsDescription: 'تحقق من المعاملات المحددة مسبقاً وتحديثها للتطبيق.',
    unitPricesDescription: 'تكوين أسعار الوحدات المستخدمة في النظام. تعيين الأسعار للرسوم والكهرباء والماء والغاز والتدفئة.',
    
    // Device settings
    deviceSettings: 'إعدادات الجهاز',
    
    // Position form
    selectLevel: 'اختر المستوى',
    junior: 'مبتدئ',
    midLevel: 'متوسط المستوى',
    senior: 'خبير',
    lead: 'قائد',
    manager: 'مدير',
    director: 'مدير تنفيذي',
    activePosition: 'منصب نشط',
    creatingPosition: 'جاري الإنشاء...',
    
    // Enum form
    module: 'الوحدة',
    category: 'الفئة',
    enumValues: 'قيم التعداد',
    
    // Enum categories
    staffSettings: 'إعدادات الموظفين',
    propertySettings: 'إعدادات العقارات',
    ticketSettings: 'إعدادات الطلبات',
    billingSettings: 'إعدادات الفواتير',
    userSettings: 'إعدادات المستخدمين',
    paymentSettings: 'إعدادات الدفع',
    announcementSettings: 'إعدادات الإعلانات',
    qrCodeSettings: 'إعدادات رمز QR',
    familyMemberSettings: 'إعدادات أفراد العائلة',
    userPropertySettings: 'إعدادات عقارات المستخدم',
    roleSettings: 'إعدادات الأدوار'
  }
};

export default function DashboardSettingsPage() {
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

  // Breadcrumb Items
  const breadcrumbItems = [
    { label: t.home, href: '/dashboard' },
    { label: t.settings, active: true }
  ];

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [securityCardOpen, setSecurityCardOpen] = useState<boolean>(false);
  const [unitPriceCardOpen, setUnitPriceCardOpen] = useState<boolean>(false);
  
  // Edit mode states for each price type
  const [editingPriceType, setEditingPriceType] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  
  // Loading state for unit prices
  const [unitPricesLoading, setUnitPricesLoading] = useState<boolean>(true);
  
  // Loading state for enums
  const [enumsLoading, setEnumsLoading] = useState<boolean>(true);
  const [enumsData, setEnumsData] = useState<any>(null);

  // Position creation modal state
  const [showPositionModal, setShowPositionModal] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [positionFormData, setPositionFormData] = useState({
    title: '',
    code: '',
    description: '',
    departmentId: '',
    level: '',
    salaryMin: '',
    salaryMax: '',
    requirements: [''],
    responsibilities: [''],
    isActive: true
  });
  const [positionLoading, setPositionLoading] = useState<boolean>(false);

  // Enum creation modal state
  const [showEnumModal, setShowEnumModal] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [enumFormData, setEnumFormData] = useState({
    codes: [''],
    sortOrder: 1
  });
  const [enumLoading, setEnumLoading] = useState<boolean>(false);
  const [enumError, setEnumError] = useState<string>('');

  // Dropdown cards state
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({
    staff: false,
    properties: false,
    tickets: false,
    billing: false,
    users: false,
    payment: false,
    announcements: false,
    qrcode: false,
    familyMembers: false,
    userProperties: false,
    roles: false
  });

  // Security settings from appEnums
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '60',
    passwordExpiry: '90',
    maxLoginAttempts: '5',
    twoFactorAuth: true,
    passwordMinLength: '8',
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    accountLockoutThreshold: '5',
    accountLockoutDuration: '15',
    passwordHistoryCount: '5'
  });

  const [unitPriceSettings, setUnitPriceSettings] = useState({
    DUES: { price: 10.50, unit: 'm²' },
    ELECTRICITY: { price: 2.50, unit: 'kWh' },
    WATER: { price: 1.80, unit: 'm³' },
    GAS: { price: 3.20, unit: 'm³' },
    HEATING: { price: 4.50, unit: 'm²' }
  });

  // Unit Price Enums from API Documentation - Now dynamic from backend
  const [priceTypes, setPriceTypes] = useState<Array<{
    value: string;
    label: string;
    description: string;
    defaultUnit: string;
    id: string; // UUID for API calls
  }>>([]);

  const units = [
    { value: 'm²', label: t.squareMeter, description: t.squareMeterDesc },
    { value: 'kWh', label: t.kilowattHour, description: t.kilowattHourDesc },
    { value: 'm³', label: t.cubicMeter, description: t.cubicMeterDesc },
    { value: 'piece', label: t.piece, description: t.pieceDesc }
  ];

  // Load appEnums from localStorage on component mount
  useEffect(() => {
    const loadAppEnums = () => {
      try {
        const storedEnums = localStorage.getItem('appEnums');
        if (storedEnums) {
          const enums = JSON.parse(storedEnums);
          
          // Update security settings with enum values
          setSecuritySettings(prev => ({
            ...prev,
            sessionTimeout: enums.SESSION_TIMEOUT?.toString() || prev.sessionTimeout,
            passwordExpiry: enums.PASSWORD_EXPIRY?.toString() || prev.passwordExpiry,
            maxLoginAttempts: enums.MAX_LOGIN_ATTEMPTS?.toString() || prev.maxLoginAttempts,
            passwordMinLength: enums.PASSWORD_MIN_LENGTH?.toString() || prev.passwordMinLength,
            accountLockoutThreshold: enums.ACCOUNT_LOCKOUT_THRESHOLD?.toString() || prev.accountLockoutThreshold,
            accountLockoutDuration: enums.ACCOUNT_LOCKOUT_DURATION?.toString() || prev.accountLockoutDuration,
            passwordHistoryCount: enums.PASSWORD_HISTORY_COUNT?.toString() || prev.passwordHistoryCount
          }));
        }
      } catch (error) {
        console.error('appEnums yüklenirken hata:', error);
      }
    };

    loadAppEnums();
  }, []);

  // Load unit prices from backend on component mount
  useEffect(() => {
    const loadUnitPrices = async () => {
      try {
        setUnitPricesLoading(true);
        
        const response = await unitPricesService.getAllUnitPrices();
        console.log('🔧 API Response:', response);
        console.log('🔧 Response type:', typeof response);
        console.log('🔧 Is Array:', Array.isArray(response));
        
        if (response && Array.isArray(response)) {
          // Transform the array into the expected object structure
          const transformedSettings = response.reduce((acc, unitPrice) => {
            acc[unitPrice.priceType] = { 
              price: typeof unitPrice.unitPrice === 'string' ? parseFloat(unitPrice.unitPrice) : unitPrice.unitPrice, 
              unit: unitPrice.unit 
            };
            return acc;
          }, {} as any);
          
          console.log('🔧 Transformed settings:', transformedSettings);
          setUnitPriceSettings(transformedSettings);
          // Create price type options with proper structure
          const priceTypeLabels: Record<string, string> = {
            DUES: t.dues,
            ELECTRICITY: t.electricity,
            WATER: t.water,
            GAS: t.gas,
            HEATING: t.heating
          };
          
          const priceTypeDescriptions: Record<string, string> = {
            DUES: t.duesDescription,
            ELECTRICITY: t.electricityDescription,
            WATER: t.waterDescription,
            GAS: t.gasDescription,
            HEATING: t.heatingDescription
          };
          
          const mappedPriceTypes = response.map(unitPrice => ({
            id: unitPrice.id,
            value: unitPrice.priceType,
            label: priceTypeLabels[unitPrice.priceType] || unitPrice.priceType,
            description: priceTypeDescriptions[unitPrice.priceType] || '',
            defaultUnit: unitPrice.unit
          }));
          
          console.log('🔧 Mapped price types:', mappedPriceTypes);
          console.log('🔧 Setting price types...');
          setPriceTypes(mappedPriceTypes);
          console.log('🔧 Price types set successfully');
        }
      } catch (error) {
        console.error('Error loading unit prices:', error);
              } finally {
          console.log('🔧 Setting loading to false');
          setUnitPricesLoading(false);
          console.log('🔧 Loading set to false');
        }
    };

    loadUnitPrices();
  }, []);

  // Load enums from backend on component mount
  useEffect(() => {
    const loadEnums = async () => {
      try {
        setEnumsLoading(true);
        console.log('🚀 Enum değerleri yükleniyor...');
        
        const response = await enumsService.refreshEnums();
        console.log('✅ Backend\'den gelen enum response:', response);
        console.log('📊 Response type:', typeof response);
        console.log('📋 Response keys:', response ? Object.keys(response) : 'No data');
        
        if (response && typeof response === 'object') {
          console.log('💾 Enum data set ediliyor...');
          setEnumsData(response);
          console.log('✅ Enum data state\'e set edildi');
        } else {
          console.log('❌ Response geçersiz:', response);
        }
      } catch (error) {
        console.error('❌ Enum değerleri yüklenirken hata:', error);
      } finally {
        setEnumsLoading(false);
        console.log('🏁 Enum loading tamamlandı, enumsLoading:', false);
      }
    };

    loadEnums();
  }, []);

  // Function to refresh enums data
  const fetchEnumsData = async () => {
    try {
      setEnumsLoading(true);
      console.log('🔄 Refreshing enums data after enum creation...');
      
      // Use refreshEnums to get fresh data from API
      const response = await enumsService.refreshEnums();
      if (response && typeof response === 'object') {
        setEnumsData(response);
        console.log('✅ Enums data refreshed successfully');
      }
    } catch (error) {
      console.error('Error fetching enums:', error);
    } finally {
      setEnumsLoading(false);
    }
  };

  const handlePriceChange = (priceType: string, field: 'price' | 'unit', value: string | number) => {
    setUnitPriceSettings(prev => ({
      ...prev,
      [priceType]: {
        ...prev[priceType as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Position creation functions
  const openPositionModal = (department: string) => {
    setSelectedDepartment(department);
    setPositionFormData(prev => ({
      ...prev,
      departmentId: department
    }));
    setShowPositionModal(true);
  };

  const closePositionModal = () => {
    setShowPositionModal(false);
    setSelectedDepartment('');
    setPositionFormData({
      title: '',
      code: '',
      description: '',
      departmentId: '',
      level: '',
      salaryMin: '',
      salaryMax: '',
      requirements: [''],
      responsibilities: [''],
      isActive: true
    });
  };

  const handlePositionFormChange = (field: string, value: any) => {
    setPositionFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRequirement = () => {
    setPositionFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    setPositionFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setPositionFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const addResponsibility = () => {
    setPositionFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, '']
    }));
  };

  const removeResponsibility = (index: number) => {
    setPositionFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const updateResponsibility = (index: number, value: string) => {
    setPositionFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.map((resp, i) => i === index ? value : resp)
    }));
  };

  const createPosition = async () => {
    try {
      setPositionLoading(true);
      
      // Get token from localStorage with multiple fallbacks
      let token = localStorage.getItem('auth_token');
      if (!token) token = localStorage.getItem('token');
      if (!token) token = localStorage.getItem('access_token');
      if (!token) token = localStorage.getItem('jwt_token');
      
      if (!token) {
        console.error('❌ No token found for position creation');
        return;
      }

      const response = await fetch('/api/proxy/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...positionFormData,
          requirements: positionFormData.requirements.filter(req => req.trim() !== ''),
          responsibilities: positionFormData.responsibilities.filter(resp => resp.trim() !== ''),
          salaryMin: positionFormData.salaryMin ? parseFloat(positionFormData.salaryMin) : undefined,
          salaryMax: positionFormData.salaryMax ? parseFloat(positionFormData.salaryMax) : undefined
        })
      });

      if (response.ok) {
        console.log('✅ Pozisyon başarıyla oluşturuldu');
        closePositionModal();
        // Enum değerlerini yeniden yükle
        const enumsResponse = await enumsService.refreshEnums();
        if (enumsResponse && typeof enumsResponse === 'object') {
          setEnumsData(enumsResponse);
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Pozisyon oluşturulurken hata:', response.status, errorData);
      }
    } catch (error) {
      console.error('❌ Pozisyon oluşturulurken hata:', error);
    } finally {
      setPositionLoading(false);
    }
  };

  // Enum creation functions
  const openEnumModal = (module: string, category: string) => {
    setSelectedModule(module);
    setSelectedCategory(category);
    setEnumFormData({
      codes: [''],
      sortOrder: 1
    });
    setEnumError('');
    setShowEnumModal(true);
  };

  const closeEnumModal = () => {
    setShowEnumModal(false);
    setSelectedModule('');
    setSelectedCategory('');
    setEnumFormData({
      codes: [''],
      sortOrder: 1
    });
    setEnumError('');
  };

  const handleEnumFormChange = (field: string, value: any) => {
    setEnumFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addEnumCode = () => {
    setEnumFormData(prev => ({
      ...prev,
      codes: [...prev.codes, '']
    }));
  };

  const removeEnumCode = (index: number) => {
    setEnumFormData(prev => ({
      ...prev,
      codes: prev.codes.filter((_, i) => i !== index)
    }));
  };

  const updateEnumCode = (index: number, value: string) => {
    setEnumFormData(prev => ({
      ...prev,
      codes: prev.codes.map((code, i) => i === index ? value : code)
    }));
  };

  // Token validation function
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/proxy/enums', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.status !== 401;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  const createEnumValues = async () => {
    try {
      setEnumLoading(true);
      setEnumError('');
      
      const filteredCodes = enumFormData.codes.filter(code => code.trim() !== '');
      
      if (filteredCodes.length === 0) {
        setEnumError('En az bir enum değeri girmelisiniz.');
        return;
      }

      // Get token from localStorage with multiple fallbacks
      let token = localStorage.getItem('auth_token');
      
      // Try alternative token keys if auth_token is not found
      if (!token) {
        token = localStorage.getItem('token');
      }
      if (!token) {
        token = localStorage.getItem('access_token');
      }
      if (!token) {
        token = localStorage.getItem('jwt_token');
      }
      
      console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
      console.log('🔑 Found token:', token ? token.substring(0, 50) + '...' : 'NOT FOUND');
      
      if (!token) {
        setEnumError('Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      // Validate token before making the request
      const isTokenValid = await validateToken(token);
      if (!isTokenValid) {
        setEnumError('Oturum süresi dolmuş. Lütfen sayfayı yenileyip tekrar giriş yapın.');
        return;
      }

      // Backend expects codes array with string values
      const requestPayload = {
        module: selectedModule,
        category: selectedCategory,
        codes: filteredCodes.map(code => code.trim()), // Send only codes as strings
        sortOrder: enumFormData.sortOrder
      };

      console.log('🔑 Token length:', token.length);
      console.log('🔑 Token starts with:', token.substring(0, 20));
      console.log('📤 Request payload:', requestPayload);
      console.log('📤 Full request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      const response = await fetch('/api/proxy/enums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestPayload)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response status text:', response.statusText);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok) {
        closeEnumModal();
        // Refresh enums data
        fetchEnumsData();
      } else {
        if (response.status === 401) {
          setEnumError('Oturum süresi dolmuş veya geçersiz. Lütfen sayfayı yenileyip tekrar giriş yapın.');
          console.error('❌ 401 Error - Token might be invalid or expired');
        } else if (response.status === 400) {
          setEnumError(data.message || 'Geçersiz veri formatı. Lütfen kontrol edin.');
          console.error('❌ 400 Error - Bad request format');
        } else if (response.status === 500) {
          setEnumError('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
          console.error('❌ 500 Error - Server error');
        } else {
          setEnumError(data.message || 'Enum değerleri eklenirken bir hata oluştu.');
        }
      }
    } catch (error) {
      console.error('Error creating enum values:', error);
      setEnumError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setEnumLoading(false);
    }
  };

  // Toggle dropdown function
  const toggleDropdown = (dropdownKey: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownKey]: !prev[dropdownKey]
    }));
  };

  // Edit functions
  const startEditing = (priceType: string) => {
    setEditingPriceType(priceType);
    setEditPrice(unitPriceSettings[priceType as keyof typeof unitPriceSettings]?.price?.toString() || '');
  };

  const cancelEditing = () => {
    setEditingPriceType(null);
    setEditPrice('');
  };

  const savePrice = async (priceType: string) => {
    try {
      const priceValue = parseFloat(editPrice);
      if (isNaN(priceValue) || priceValue < 0) {
        console.error('Geçersiz fiyat değeri');
        return;
      }

      // priceType'a göre ilgili priceType objesini bul
      const priceTypeObj = priceTypes.find(pt => pt.value === priceType);
      if (!priceTypeObj) {
        console.error('Price type bulunamadı:', priceType);
        return;
      }

      console.log('🔄 Güncellenecek price type:', priceTypeObj);

      // Service kullanarak güncelleme yap - UUID kullan
      console.log('🔄 Gönderilecek data:', {
        unitPrice: priceValue,
        priceValueType: typeof priceValue
      });
      
      const response = await unitPricesService.updateUnitPrice(priceTypeObj.id, {
        unitPrice: priceValue // Number olarak gönder
      });

      // Başarılı güncelleme
      setUnitPriceSettings(prev => ({
        ...prev,
        [priceType]: {
          ...prev[priceType as keyof typeof prev],
          price: priceValue
        }
      }));
      setEditingPriceType(null);
      setEditPrice('');
      
      console.log(`${priceType} fiyatı başarıyla güncellendi:`, response);
    } catch (error) {
      console.error('Fiyat güncellenirken hata oluştu:', error);
    }
  };

  // Security settings update function
  const updateSecuritySetting = (key: string, value: string | boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Update localStorage
    try {
      const storedEnums = localStorage.getItem('appEnums');
      if (storedEnums) {
        const enums = JSON.parse(storedEnums);
        enums[key.toUpperCase()] = value;
        localStorage.setItem('appEnums', JSON.stringify(enums));
      }
    } catch (error) {
      console.error('LocalStorage güncellenirken hata:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content Area */}
        <div className="lg:ml-72">
          {/* Header */}
          <DashboardHeader 
            title={t.pageTitle} 
            breadcrumbItems={breadcrumbItems}
          />
          
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2">
                  {t.systemEnums}
                </h2>
                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                  {t.systemEnumsDescription}
                </p>
              </div>
              <div className="flex gap-3">
                <LanguageSwitcher />
                <button
                  onClick={() => window.location.href = '/dashboard/settings/device-settings'}
                  className="inline-flex items-center px-4 py-2 bg-primary-gold text-white text-sm font-medium rounded-md hover:bg-primary-gold/80 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t.deviceSettings}
                </button>
              </div>
            </div>

            {/* Güvenlik Ayarları - Dropdown Card */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8 overflow-hidden">
              {/* Card Header - Always Visible */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setSecurityCardOpen(!securityCardOpen)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                      {t.securitySettings}
                    </h2>
                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                    {t.securitySettingsDescription}
                    </p>
                  </div>
                  <div className="w-6 h-6 transition-transform duration-200">
                    <svg className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${securityCardOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Content - Collapsible */}
              {securityCardOpen && (
                <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-6 pt-6">
                    {enumsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold mx-auto mb-4"></div>
                        <p className="text-text-light-secondary dark:text-text-secondary">
                          {t.loadingEnums}
                        </p>
                      </div>
                    ) : enumsData ? (
                      <div className="space-y-6">
                        {/* Staff Enums */}
                        {enumsData.staff && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                              onClick={() => toggleDropdown('staff')}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-primary-gold rounded-full mr-3"></span>
                                <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                                  {t.staffSettings}
                                </h3>
                                <span className="ml-3 text-sm text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                  {Object.keys(enumsData.staff).length} {t.categories}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-light-secondary dark:text-text-secondary transition-transform ${
                                  openDropdowns.staff ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openDropdowns.staff && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  {Object.entries(enumsData.staff).map(([category, values]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-text-on-light dark:text-text-on-dark capitalize text-sm">
                                          {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </h4>
                                        <button
                                          onClick={() => openEnumModal('staff', category)}
                                          className="text-xs bg-primary-gold text-white px-2 py-1 rounded hover:bg-primary-gold/80 transition-colors"
                                        >
                                          {t.add}
                                        </button>
                                      </div>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(values as string[]).map((value, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                              {value.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                                              {index + 1}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Properties Enums */}
                        {enumsData.properties && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                              onClick={() => toggleDropdown('properties')}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-primary-gold rounded-full mr-3"></span>
                                <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                                  {t.propertySettings}
                                </h3>
                                <span className="ml-3 text-sm text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                  {Object.keys(enumsData.properties).length} {t.categories}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-light-secondary dark:text-text-secondary transition-transform ${
                                  openDropdowns.properties ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openDropdowns.properties && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                  {Object.entries(enumsData.properties).map(([category, values]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-text-on-light dark:text-text-on-dark capitalize text-sm">
                                          {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </h4>
                                        <button
                                          onClick={() => openEnumModal('properties', category)}
                                          className="text-xs bg-primary-gold text-white px-2 py-1 rounded hover:bg-primary-gold/80 transition-colors"
                                        >
                                          {t.add}
                                        </button>
                                      </div>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(values as string[]).map((value, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                              {value.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                                              {index + 1}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tickets Enums */}
                        {enumsData.tickets && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                              onClick={() => toggleDropdown('tickets')}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-primary-gold rounded-full mr-3"></span>
                                <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                                  {t.ticketSettings}
                                </h3>
                                <span className="ml-3 text-sm text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                  {Object.keys(enumsData.tickets).length} {t.categories}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-light-secondary dark:text-text-secondary transition-transform ${
                                  openDropdowns.tickets ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openDropdowns.tickets && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {Object.entries(enumsData.tickets).map(([category, values]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-text-on-light dark:text-text-on-dark capitalize text-sm">
                                          {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </h4>
                                        <button
                                          onClick={() => openEnumModal('tickets', category)}
                                          className="text-xs bg-primary-gold text-white px-2 py-1 rounded hover:bg-primary-gold/80 transition-colors"
                                        >
                                          {t.add}
                                        </button>
                                      </div>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(values as string[]).map((value, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                              {value.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                                              {index + 1}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Billing Enums */}
                        {enumsData.billing && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                              onClick={() => toggleDropdown('billing')}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-primary-gold rounded-full mr-3"></span>
                                <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                                  {t.billingSettings}
                                </h3>
                                <span className="ml-3 text-sm text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                  {Object.keys(enumsData.billing).length} {t.categories}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-light-secondary dark:text-text-secondary transition-transform ${
                                  openDropdowns.billing ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openDropdowns.billing && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {Object.entries(enumsData.billing).map(([category, values]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <h4 className="font-medium text-text-on-light dark:text-text-on-dark mb-3 capitalize text-sm">
                                        {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </h4>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(values as string[]).map((value, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                              {value.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                                              {index + 1}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Users Enums */}
                        {enumsData.users && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                              onClick={() => toggleDropdown('users')}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-primary-gold rounded-full mr-3"></span>
                                <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                                  {t.userSettings}
                                </h3>
                                <span className="ml-3 text-sm text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                  {Object.keys(enumsData.users).length} {t.categories}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-light-secondary dark:text-text-secondary transition-transform ${
                                  openDropdowns.users ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openDropdowns.users && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {Object.entries(enumsData.users).map(([category, values]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <h4 className="font-medium text-text-on-light dark:text-text-on-dark mb-3 capitalize text-sm">
                                        {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </h4>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(values as string[]).map((value, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                              {value.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                                              {index + 1}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Payment Enums */}
                        {enumsData.payment && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                              onClick={() => toggleDropdown('payment')}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-primary-gold rounded-full mr-3"></span>
                                <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                                  {t.paymentSettings}
                                </h3>
                                <span className="ml-3 text-sm text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                  {Object.keys(enumsData.payment).length} {t.categories}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-light-secondary dark:text-text-secondary transition-transform ${
                                  openDropdowns.payment ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openDropdowns.payment && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                  {Object.entries(enumsData.payment).map(([category, values]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <h4 className="font-medium text-text-on-light dark:text-text-on-dark mb-3 capitalize text-sm">
                                        {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </h4>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(values as string[]).map((value, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                              {value.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                                              {index + 1}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Announcements Enums */}
                        {enumsData.announcements && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                              onClick={() => toggleDropdown('announcements')}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-primary-gold rounded-full mr-3"></span>
                                <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                                  {t.announcementSettings}
                                </h3>
                                <span className="ml-3 text-sm text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                  {Object.keys(enumsData.announcements).length} {t.categories}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-light-secondary dark:text-text-secondary transition-transform ${
                                  openDropdowns.announcements ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openDropdowns.announcements && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                  {Object.entries(enumsData.announcements).map(([category, values]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <h4 className="font-medium text-text-on-light dark:text-text-on-dark mb-3 capitalize text-sm">
                                        {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </h4>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(values as string[]).map((value, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                              {value.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                                              {index + 1}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* QR Code Enums */}
                        {enumsData.qrcode && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                              onClick={() => toggleDropdown('qrcode')}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-primary-gold rounded-full mr-3"></span>
                                <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                                  {t.qrCodeSettings}
                                </h3>
                                <span className="ml-3 text-sm text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                  {Object.keys(enumsData.qrcode).length} {t.categories}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-light-secondary dark:text-text-secondary transition-transform ${
                                  openDropdowns.qrcode ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openDropdowns.qrcode && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                  {Object.entries(enumsData.qrcode).map(([category, values]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <h4 className="font-medium text-text-on-light dark:text-text-on-dark mb-3 capitalize text-sm">
                                        {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </h4>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(values as string[]).map((value, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                              {value.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                                              {index + 1}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Family Members Enums */}
                        {enumsData.familyMembers && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                              onClick={() => toggleDropdown('familyMembers')}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-primary-gold rounded-full mr-3"></span>
                                <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                                  {t.familyMemberSettings}
                                </h3>
                                <span className="ml-3 text-sm text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                  {Object.keys(enumsData.familyMembers).length} {t.categories}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-light-secondary dark:text-text-secondary transition-transform ${
                                  openDropdowns.familyMembers ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openDropdowns.familyMembers && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                                  {Object.entries(enumsData.familyMembers).map(([category, values]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <h4 className="font-medium text-text-on-light dark:text-text-on-dark mb-3 capitalize text-sm">
                                        {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </h4>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(values as string[]).map((value, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                              {value.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                                              {index + 1}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* User Properties Enums */}
                        {enumsData.userProperties && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                              onClick={() => toggleDropdown('userProperties')}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-primary-gold rounded-full mr-3"></span>
                                <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                                  {t.userPropertySettings}
                                </h3>
                                <span className="ml-3 text-sm text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                  {Object.keys(enumsData.userProperties).length} {t.categories}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-light-secondary dark:text-text-secondary transition-transform ${
                                  openDropdowns.userProperties ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openDropdowns.userProperties && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {Object.entries(enumsData.userProperties).map(([category, values]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <h4 className="font-medium text-text-on-light dark:text-text-on-dark mb-3 capitalize text-sm">
                                        {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </h4>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(values as string[]).map((value, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                              {value.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                                              {index + 1}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Roles Enums */}
                        {enumsData.roles && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <button
                              onClick={() => toggleDropdown('roles')}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-primary-gold rounded-full mr-3"></span>
                                <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                                  {t.roleSettings}
                                </h3>
                                <span className="ml-3 text-sm text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                  {Object.keys(enumsData.roles).length} {t.categories}
                                </span>
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-light-secondary dark:text-text-secondary transition-transform ${
                                  openDropdowns.roles ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {openDropdowns.roles && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                                  {Object.entries(enumsData.roles).map(([category, values]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <h4 className="font-medium text-text-on-light dark:text-text-on-dark mb-3 capitalize text-sm">
                                        {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </h4>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(values as string[]).map((value, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                            <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                              {value.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-text-light-muted dark:text-text-muted bg-gray-100 dark:bg-gray-500 px-2 py-1 rounded">
                                              {index + 1}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-text-light-secondary dark:text-text-secondary">
                          {t.noEnumsFound}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Birim Fiyat Ayarları - Dropdown Card */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8 overflow-hidden">
              {/* Card Header - Always Visible */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setUnitPriceCardOpen(!unitPriceCardOpen)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                      {t.unitPrices}
                    </h2>
                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                      {t.unitPricesDescription}
                    </p>
                  </div>
                  <div className="w-6 h-6 transition-transform duration-200">
                    <svg className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${unitPriceCardOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Content - Collapsible */}
              {unitPriceCardOpen && (
                <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-6 pt-6">
                    {/* Units Reference Section - Now First */}
                    <div>
                      <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-4">
                        {t.availableUnits}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {units.map((unit) => (
                          <div key={unit.value} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                            <div className="text-2xl font-bold text-primary-gold mb-2">
                              {unit.value}
                            </div>
                            <div className="text-sm font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                              {unit.label}
                            </div>
                            <div className="text-xs text-text-light-muted dark:text-text-muted leading-relaxed">
                              {unit.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Types Section - Now Second */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                      <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-4">
                        {t.priceTypes}
                      </h3>
                      
                      {(() => {
                        console.log(' Render debug:', {
                          unitPricesLoading,
                          priceTypesLength: priceTypes.length,
                          priceTypes: priceTypes,
                          unitPriceSettings: unitPriceSettings
                        });
                        
                        if (unitPricesLoading) {
                          return (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold mx-auto mb-4"></div>
                              <p className="text-text-light-secondary dark:text-text-secondary">
                                {t.loadingUnitPrices}
                              </p>
                            </div>
                          );
                        } else if (priceTypes.length > 0) {
                          return (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {priceTypes.map((type) => (
                                <div key={type.value} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                  <div className="flex items-center justify-between mb-3">
                                    <div>
                                      <h4 className="font-medium text-text-on-light dark:text-text-on-dark">
                                        {type.label}
                                      </h4>
                                      <p className="text-sm text-text-light-muted dark:text-text-muted">
                                        {type.description}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => startEditing(type.value)}
                                      className="px-3 py-1 text-xs bg-primary-gold text-white rounded-md hover:bg-primary-gold/90 transition-colors"
                                    >
                                      {t.edit}
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                                        {t.unitPrice}
                                      </label>
                                      {editingPriceType === type.value ? (
                                        <div className="space-y-2">
                                          <input
                                            type="number"
                                            step="0.01"
                                            value={editPrice}
                                            onChange={(e) => setEditPrice(e.target.value)}
                                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                                            placeholder={t.unitPricePlaceholder}
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => savePrice(type.value)}
                                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                            >
                                              {t.save}
                                            </button>
                                            <button
                                              onClick={cancelEditing}
                                              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                            >
                                              {t.cancel}
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="w-full p-2 text-sm bg-white dark:bg-gray-600 rounded-md text-text-on-light dark:text-text-on-dark border border-gray-300 dark:border-gray-600">
                                          {unitPriceSettings[type.value as keyof typeof unitPriceSettings]?.price || 0} ₺
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                                        {t.unit}
                                      </label>
                                      <div className="w-full p-2 text-sm bg-gray-100 dark:bg-gray-600 rounded-md text-text-on-light dark:text-text-on-dark border border-gray-300 dark:border-gray-600">
                                        {unitPriceSettings[type.value as keyof typeof unitPriceSettings]?.unit || type.defaultUnit}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        } else {
                          return (
                            <div className="text-center py-8">
                              <p className="text-text-light-secondary dark:text-text-secondary">
                                {t.noUnitPricesFound}
                              </p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Position Creation Modal */}
      {showPositionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
                {t.createPosition}
              </h2>
              <button
                onClick={closePositionModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                    {t.title} *
                  </label>
                  <input
                    type="text"
                    value={positionFormData.title}
                    onChange={(e) => handlePositionFormChange('title', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    placeholder={t.titlePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                    {t.code} *
                  </label>
                  <input
                    type="text"
                    value={positionFormData.code}
                    onChange={(e) => handlePositionFormChange('code', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    placeholder={t.codePlaceholder}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                  {t.description}
                </label>
                <textarea
                  value={positionFormData.description}
                  onChange={(e) => handlePositionFormChange('description', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                  placeholder={t.descriptionPlaceholder}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                    {t.level} *
                  </label>
                  <select
                    value={positionFormData.level}
                    onChange={(e) => handlePositionFormChange('level', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                  >
                    <option value="">{t.selectLevel}</option>
                    <option value="JUNIOR">{t.junior}</option>
                    <option value="MID">{t.midLevel}</option>
                    <option value="SENIOR">{t.senior}</option>
                    <option value="LEAD">{t.lead}</option>
                    <option value="MANAGER">{t.manager}</option>
                    <option value="DIRECTOR">{t.director}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                    {t.salaryMin}
                  </label>
                  <input
                    type="number"
                    value={positionFormData.salaryMin}
                    onChange={(e) => handlePositionFormChange('salaryMin', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    placeholder={t.salaryMinPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                    {t.salaryMax}
                  </label>
                  <input
                    type="number"
                    value={positionFormData.salaryMax}
                    onChange={(e) => handlePositionFormChange('salaryMax', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    placeholder={t.salaryMaxPlaceholder}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                    {t.requirements}
                  </label>
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="text-xs bg-primary-gold text-white px-2 py-1 rounded hover:bg-primary-gold/80 transition-colors"
                  >
                    {t.add}
                  </button>
                </div>
                <div className="space-y-2">
                  {positionFormData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                        placeholder={t.requirementPlaceholder}
                      />
                      {positionFormData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                    {t.responsibilities}
                  </label>
                  <button
                    type="button"
                    onClick={addResponsibility}
                    className="text-xs bg-primary-gold text-white px-2 py-1 rounded hover:bg-primary-gold/80 transition-colors"
                  >
                    {t.add}
                  </button>
                </div>
                <div className="space-y-2">
                  {positionFormData.responsibilities.map((resp, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => updateResponsibility(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                        placeholder={t.responsibilityPlaceholder}
                      />
                      {positionFormData.responsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeResponsibility(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={positionFormData.isActive}
                  onChange={(e) => handlePositionFormChange('isActive', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-text-light-secondary dark:text-text-secondary">
                  {t.activePosition}
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closePositionModal}
                className="px-4 py-2 text-sm font-medium text-text-light-secondary dark:text-text-secondary bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={createPosition}
                disabled={positionLoading || !positionFormData.title || !positionFormData.code || !positionFormData.level}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-gold rounded-md hover:bg-primary-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {positionLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t.creatingPosition}
                  </div>
                ) : (
                  t.createPosition
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enum Creation Modal */}
      {showEnumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                  {t.createEnumValues}
                </h3>
                <button
                  onClick={closeEnumModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Module and Category Info */}
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                    <span className="font-medium">{t.module}:</span> {selectedModule}
                  </div>
                  <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                    <span className="font-medium">{t.category}:</span> {selectedCategory}
                  </div>
                </div>

                {/* Enum Codes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                      {t.enumValues}
                    </label>
                    <button
                      type="button"
                      onClick={addEnumCode}
                      className="text-xs bg-primary-gold text-white px-2 py-1 rounded hover:bg-primary-gold/80 transition-colors"
                    >
                      {t.add}
                    </button>
                  </div>
                  <p className="text-xs text-text-light-muted dark:text-text-muted mb-3">
                    {t.codeFormatInfo}
                  </p>
                  <div className="space-y-2">
                    {enumFormData.codes.map((code, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => updateEnumCode(index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                          placeholder={t.enumCodePlaceholder}
                        />
                        {enumFormData.codes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEnumCode(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Preview */}
                  {enumFormData.codes.filter(code => code.trim() !== '').length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-xs font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        {t.preview}:
                      </p>
                      <div className="space-y-1">
                        {enumFormData.codes.filter(code => code.trim() !== '').map((code, index) => (
                          <div key={index} className="text-xs text-text-light-muted dark:text-text-muted">
                            <span className="font-mono">{code.trim()}</span> → 
                            <span className="ml-1">{code.trim().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    {t.sortOrder}
                  </label>
                  <input
                    type="number"
                    value={enumFormData.sortOrder}
                    onChange={(e) => handleEnumFormChange('sortOrder', parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    placeholder={t.sortOrderPlaceholder}
                    min="1"
                  />
                </div>

                {/* Error Message */}
                {enumError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">{enumError}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeEnumModal}
                  className="px-4 py-2 text-sm font-medium text-text-light-secondary dark:text-text-secondary bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={createEnumValues}
                  disabled={enumLoading || enumFormData.codes.filter(code => code.trim() !== '').length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-gold rounded-md hover:bg-primary-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {enumLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t.adding}
                    </div>
                  ) : (
                    t.createEnumValues
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}


