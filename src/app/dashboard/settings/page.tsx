'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import { unitPricesService } from '@/services/unit-prices.service';
import enumsService from '@/services/enums.service';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import Tabs from '@/app/components/ui/Tabs';
import { DollarSign, Settings, Shield } from 'lucide-react';

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

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('unit-prices');
  
  // Unit Prices states
  const [unitPricesLoading, setUnitPricesLoading] = useState<boolean>(true);
  const [unitPriceSettings, setUnitPriceSettings] = useState({
    DUES: { price: 10.50, unit: 'm²' },
    ELECTRICITY: { price: 2.50, unit: 'kWh' },
    WATER: { price: 1.80, unit: 'm³' },
    GAS: { price: 3.20, unit: 'm³' },
    HEATING: { price: 4.50, unit: 'm²' }
  });
  
  // Price types from API
  const [priceTypes, setPriceTypes] = useState<Array<{
    value: string;
    label: string;
    description: string;
    defaultUnit: string;
    id: string;
  }>>([]);
  
  // Edit mode states
  const [editingPriceType, setEditingPriceType] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  
  // System Enums states
  const [enumsLoading, setEnumsLoading] = useState<boolean>(true);
  const [enumCategories, setEnumCategories] = useState<Array<{
    id: string;
    module: string;
    category: string;
    enumValues: Array<{
      id: string;
      code: string;
      label: string;
      sortOrder: number;
      isActive: boolean;
    }>;
  }>>([]);
  
  // Enum form states
  const [showEnumForm, setShowEnumForm] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newEnumCode, setNewEnumCode] = useState<string>('');
  const [newEnumLabel, setNewEnumLabel] = useState<string>('');
  const [newEnumSortOrder, setNewEnumSortOrder] = useState<string>('1');
  const [isCreatingEnum, setIsCreatingEnum] = useState<boolean>(false);
  
  // Breadcrumb Items
  const breadcrumbItems = [
    { label: t.home, href: '/dashboard' },
    { label: t.settings, active: true }
  ];

  // Load unit prices from backend on component mount
  useEffect(() => {
    const loadUnitPrices = async () => {
      try {
        setUnitPricesLoading(true);
        
        const response = await unitPricesService.getAllUnitPrices();
        console.log('🔧 API Response:', response);
        
        if (response && Array.isArray(response)) {
          // Transform the array into the expected object structure
          const transformedSettings = response.reduce((acc, unitPrice) => {
            acc[unitPrice.priceType] = { 
              price: typeof unitPrice.unitPrice === 'string' ? parseFloat(unitPrice.unitPrice) : unitPrice.unitPrice, 
              unit: unitPrice.unit 
            };
            return acc;
          }, {} as any);
          
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
          
          setPriceTypes(mappedPriceTypes);
        }
      } catch (error) {
        console.error('Error loading unit prices:', error);
      } finally {
        setUnitPricesLoading(false);
      }
    };

    loadUnitPrices();
  }, [t]);

  // Load system enums function
  const loadSystemEnums = async () => {
    try {
      setEnumsLoading(true);
      
      const response = await enumsService.getAllEnums();
      console.log('🔧 Enums API Response:', response);
      console.log('🔧 Response type:', typeof response);
      console.log('🔧 Response keys:', Object.keys(response || {}));
      console.log('🔧 Response.success:', response?.success);
      console.log('🔧 Response.data:', response?.data);
      
      // API'den gelen response yapısını kontrol et
      let enumData;
      
      if (response && response.success && response.data) {
        // Standart response yapısı: { success: true, data: {...} }
        enumData = response.data;
      } else if (response && response.data) {
        // Direkt data objesi: { data: {...} }
        enumData = response.data;
      } else if (response && typeof response === 'object' && !response.success) {
        // Direkt enum objesi: {...}
        enumData = response;
      } else {
        console.error('❌ Unexpected response structure:', response);
        return;
      }
      
      console.log('🔧 Processed enum data:', enumData);
      
      if (enumData && typeof enumData === 'object') {
        // Transform the API response structure
        const transformedCategories: Array<{
          id: string;
          module: string;
          category: string;
          enumValues: Array<{
            id: string;
            code: string;
            label: string;
            sortOrder: number;
            isActive: boolean;
          }>;
        }> = [];

        // Process each module
        Object.entries(enumData).forEach(([moduleName, moduleData]) => {
          console.log(`🔧 Processing module: ${moduleName}`, moduleData);
          
          if (typeof moduleData === 'object' && moduleData !== null) {
            Object.entries(moduleData).forEach(([categoryName, enumValues]) => {
              console.log(`🔧 Processing category: ${categoryName}`, enumValues);
              
              if (Array.isArray(enumValues)) {
                const categoryId = `${moduleName}-${categoryName}`;
                
                const transformedEnumValues = enumValues.map((value, index) => ({
                  id: `${categoryId}-${index}`,
                  code: value,
                  label: value.toLowerCase().split('_').map((word: string) => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' '),
                  sortOrder: index + 1,
                  isActive: true
                }));

                transformedCategories.push({
                  id: categoryId,
                  module: moduleName,
                  category: categoryName,
                  enumValues: transformedEnumValues
                });
                
                console.log(`✅ Added category: ${categoryId} with ${transformedEnumValues.length} values`);
              }
            });
          }
        });
        
        console.log('🔧 Final transformed categories:', transformedCategories);
        setEnumCategories(transformedCategories);
      } else {
        console.error('❌ Invalid enum data structure:', enumData);
      }
    } catch (error) {
      console.error('❌ Error loading system enums:', error);
    } finally {
      setEnumsLoading(false);
    }
  };

  // Load system enums from backend
  useEffect(() => {
    // Cache'i temizle ve yeniden yükle
    enumsService.clearCache();
    loadSystemEnums();
  }, []);

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

      // Service kullanarak güncelleme yap - UUID kullan
      const response = await unitPricesService.updateUnitPrice(priceTypeObj.id, {
        unitPrice: priceValue
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

  // Enum form functions
  const openEnumForm = () => {
    setShowEnumForm(true);
    setSelectedModule('');
    setSelectedCategory('');
    setNewEnumCode('');
    setNewEnumLabel('');
    setNewEnumSortOrder('1');
  };

  const closeEnumForm = () => {
    setShowEnumForm(false);
    setSelectedModule('');
    setSelectedCategory('');
    setNewEnumCode('');
    setNewEnumLabel('');
    setNewEnumSortOrder('1');
  };

  const generateLabelFromCode = (code: string) => {
    return code
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getModuleDisplayName = (moduleName: string): string => {
    const moduleNames: Record<string, string> = {
      'announcements': 'Duyurular',
      'billing': 'Faturalama',
      'familyMembers': 'Aile Üyeleri',
      'payment': 'Ödeme',
      'properties': 'Mülkler',
      'qrcode': 'QR Kod',
      'roles': 'Roller',
      'staff': 'Personel',
      'tickets': 'Talepler',
      'userProperties': 'Kullanıcı Mülkleri',
      'users': 'Kullanıcılar'
    };
    return moduleNames[moduleName] || moduleName;
  };

  const getCategoryDisplayName = (categoryName: string): string => {
    const categoryNames: Record<string, string> = {
      'announcementStatus': 'Duyuru Durumu',
      'announcementType': 'Duyuru Türü',
      'billStatus': 'Fatura Durumu',
      'billType': 'Fatura Türü',
      'price_types': 'Fiyat Türleri',
      'relationshipType': 'İlişki Türü',
      'paymentMethod': 'Ödeme Yöntemi',
      'paymentStatus': 'Ödeme Durumu',
      'propertyStatus': 'Mülk Durumu',
      'propertyType': 'Mülk Türü',
      'qrcodeStatus': 'QR Kod Durumu',
      'qrcodeType': 'QR Kod Türü',
      'role': 'Rol',
      'department': 'Departman',
      'employmentType': 'İstihdam Türü',
      'position': 'Pozisyon',
      'staffStatus': 'Personel Durumu',
      'ticketPriority': 'Talep Önceliği',
      'ticketStatus': 'Talep Durumu',
      'ticketType': 'Talep Türü',
      'billResponsibility': 'Fatura Sorumluluğu',
      'contractType': 'Sözleşme Türü',
      'propertyRelationship': 'Mülk İlişkisi',
      'approvalDecision': 'Onay Kararı',
      'bulkActionType': 'Toplu İşlem Türü',
      'gender': 'Cinsiyet',
      'membershipTier': 'Üyelik Seviyesi',
      'privacyLevel': 'Gizlilik Seviyesi',
      'userStatus': 'Kullanıcı Durumu',
      'verificationStatus': 'Doğrulama Durumu'
    };
    return categoryNames[categoryName] || categoryName;
  };

  const handleCodeChange = (code: string) => {
    setNewEnumCode(code);
    if (!newEnumLabel) {
      setNewEnumLabel(generateLabelFromCode(code));
    }
  };

  const createEnumValue = async () => {
    try {
      if (!selectedModule || !selectedCategory || !newEnumCode || !newEnumLabel) {
        console.error('Tüm alanlar doldurulmalı');
        return;
      }

      setIsCreatingEnum(true);

      const response = await enumsService.createEnum({
        module: selectedModule,
        category: selectedCategory,
        code: newEnumCode.toUpperCase(),
        label: newEnumLabel,
        sortOrder: parseInt(newEnumSortOrder) || 1,
        isActive: true
      });

      console.log('Enum değeri başarıyla oluşturuldu:', response);

      // Reload enums
      await loadSystemEnums();

      closeEnumForm();
    } catch (error) {
      console.error('Enum değeri oluşturulurken hata:', error);
    } finally {
      setIsCreatingEnum(false);
    }
  };

  // Enum düzenleme ve silme fonksiyonları
  const [editingEnum, setEditingEnum] = useState<string | null>(null);
  const [editEnumCode, setEditEnumCode] = useState<string>('');
  const [editEnumLabel, setEditEnumLabel] = useState<string>('');
  const [editEnumSortOrder, setEditEnumSortOrder] = useState<string>('');

  const startEditingEnum = (enumValue: any) => {
    setEditingEnum(enumValue.id);
    setEditEnumCode(enumValue.code);
    setEditEnumLabel(enumValue.label);
    setEditEnumSortOrder(enumValue.sortOrder.toString());
  };

  const cancelEditingEnum = () => {
    setEditingEnum(null);
    setEditEnumCode('');
    setEditEnumLabel('');
    setEditEnumSortOrder('');
  };

  const saveEnumEdit = async (enumValue: any) => {
    try {
      const response = await enumsService.updateEnum(enumValue.id, {
        code: editEnumCode.toUpperCase(),
        label: editEnumLabel,
        sortOrder: parseInt(editEnumSortOrder) || 1
      });

      console.log('Enum değeri başarıyla güncellendi:', response);

      // Reload enums
      await loadSystemEnums();

      cancelEditingEnum();
    } catch (error) {
      console.error('Enum değeri güncellenirken hata:', error);
    }
  };

  const deleteEnumValue = async (enumValue: any) => {
    if (!confirm('Bu enum değerini silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await enumsService.deleteEnum(enumValue.id);

      console.log('Enum değeri başarıyla silindi:', response);

      // Reload enums
      await loadSystemEnums();
    } catch (error) {
      console.error('Enum değeri silinirken hata:', error);
    }
  };

  // Tab items
  const tabItems = [
    {
      id: 'unit-prices',
      label: t.unitPrices,
      icon: DollarSign,
             content: (
         <div className="space-y-6 p-6">
           {/* Available Units Section */}
           <div>
             <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-4">
               {t.availableUnits}
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { value: 'm²', label: t.squareMeter, description: t.squareMeterDesc },
                 { value: 'kWh', label: t.kilowattHour, description: t.kilowattHourDesc },
                 { value: 'm³', label: t.cubicMeter, description: t.cubicMeterDesc },
                 { value: 'piece', label: t.piece, description: t.pieceDesc }
               ].map((unit) => (
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

           {/* Price Types Section */}
           <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
             <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-4">
               {t.priceTypes}
             </h3>
             {unitPricesLoading ? (
               <div className="text-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold mx-auto mb-4"></div>
                 <p className="text-text-light-secondary dark:text-text-secondary">
                   {t.loadingUnitPrices}
                 </p>
               </div>
             ) : priceTypes.length > 0 ? (
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
             ) : (
               <div className="text-center py-8">
                 <p className="text-text-light-secondary dark:text-text-secondary">
                   {t.noUnitPricesFound}
                 </p>
               </div>
             )}
           </div>
         </div>
       )
    },
    {
      id: 'security',
      label: t.securitySettings,
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
              {t.securitySettings}
            </h3>
            <p className="text-text-light-secondary dark:text-text-secondary">
              {t.securitySettingsDescription}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'system-enums',
      label: t.systemEnums,
      icon: Settings,
             content: (
         <div className="space-y-6 p-6">
           {/* Header with Add Button */}
           <div className="flex justify-between items-center">
             <div>
               <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-2">
                 {t.systemEnums}
               </h3>
               <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                 {t.systemEnumsDescription}
               </p>
             </div>
             <button
               onClick={openEnumForm}
               className="inline-flex items-center px-4 py-2 bg-primary-gold text-white text-sm font-medium rounded-md hover:bg-primary-gold/80 transition-colors"
             >
               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
               </svg>
               {t.createEnumValues}
             </button>
           </div>

           {/* Enum Categories */}
           {enumsLoading ? (
             <div className="text-center py-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold mx-auto mb-4"></div>
               <p className="text-text-light-secondary dark:text-text-secondary">
                 {t.loadingEnums}
               </p>
             </div>
           ) : enumCategories.length > 0 ? (
             <div className="space-y-6">
               {enumCategories.map((category) => (
                 <div key={category.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                       <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-text-on-light dark:text-text-on-dark">
                          {getModuleDisplayName(category.module)} - {getCategoryDisplayName(category.category)}
                        </h4>
                        <p className="text-sm text-text-light-muted dark:text-text-muted">
                          {category.enumValues.length} {t.categories}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedModule(category.module);
                          setSelectedCategory(category.category);
                          setNewEnumCode('');
                          setNewEnumLabel('');
                          setNewEnumSortOrder((category.enumValues.length + 1).toString());
                          setShowEnumForm(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 bg-primary-gold text-white text-xs font-medium rounded-md hover:bg-primary-gold/80 transition-colors"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t.add}
                      </button>
                    </div>
                   
                                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                             {category.enumValues.map((enumValue) => (
                         <div key={enumValue.id} className="bg-white dark:bg-gray-600 p-3 rounded-md border border-gray-200 dark:border-gray-500">
                           <div className="flex items-center justify-between">
                             <div className="flex-1">
                               <div className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                 {enumValue.label}
                               </div>
                               <div className="text-xs text-text-light-muted dark:text-text-muted font-mono">
                                 {enumValue.code}
                               </div>
                             </div>
                             <div className="flex items-center gap-2">
                               <span className={`px-2 py-1 text-xs rounded-full ${
                                 enumValue.isActive 
                                   ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                   : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                               }`}>
                                 {enumValue.isActive ? 'Aktif' : 'Pasif'}
                               </span>
                               <span className="text-xs text-text-light-muted dark:text-text-muted">
                                 #{enumValue.sortOrder}
                               </span>
                             </div>
                           </div>
                         </div>
                       ))}
                    </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-center py-8">
               <p className="text-text-light-secondary dark:text-text-secondary">
                 {t.noEnumsFound}
               </p>
             </div>
           )}

           {/* Add Enum Modal */}
           {showEnumForm && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                                   <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-4">
                    {selectedModule && selectedCategory 
                      ? `${getModuleDisplayName(selectedModule)} - ${getCategoryDisplayName(selectedCategory)} ${t.createEnumValues}`
                      : t.createEnumValues
                    }
                  </h3>
                 
                 <div className="space-y-4">
                                       <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                        {t.module}
                      </label>
                      <div className="w-full p-2 bg-gray-100 dark:bg-gray-600 rounded-md text-text-on-light dark:text-text-on-dark border border-gray-300 dark:border-gray-600">
                        {selectedModule ? getModuleDisplayName(selectedModule) : t.module + ' seçin'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                        {t.category}
                      </label>
                      <div className="w-full p-2 bg-gray-100 dark:bg-gray-600 rounded-md text-text-on-light dark:text-text-on-dark border border-gray-300 dark:border-gray-600">
                        {selectedCategory ? getCategoryDisplayName(selectedCategory) : 'Kategori adı'}
                      </div>
                    </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                       {t.code}
                     </label>
                     <input
                       type="text"
                       value={newEnumCode}
                       onChange={(e) => handleCodeChange(e.target.value)}
                       className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                       placeholder={t.enumCodePlaceholder}
                     />
                     <p className="text-xs text-text-light-muted dark:text-text-muted mt-1">
                       {t.codeFormatInfo}
                     </p>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                       {t.title}
                     </label>
                     <input
                       type="text"
                       value={newEnumLabel}
                       onChange={(e) => setNewEnumLabel(e.target.value)}
                       className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                       placeholder="Enum etiketi"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                       {t.sortOrder}
                     </label>
                     <input
                       type="number"
                       value={newEnumSortOrder}
                       onChange={(e) => setNewEnumSortOrder(e.target.value)}
                       className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                       placeholder={t.sortOrderPlaceholder}
                     />
                   </div>
                 </div>
                 
                 <div className="flex gap-3 mt-6">
                   <button
                     onClick={createEnumValue}
                     disabled={isCreatingEnum || !selectedModule || !selectedCategory || !newEnumCode || !newEnumLabel}
                     className="flex-1 px-4 py-2 bg-primary-gold text-white text-sm font-medium rounded-md hover:bg-primary-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     {isCreatingEnum ? t.creatingPosition : t.add}
                   </button>
                   <button
                     onClick={closeEnumForm}
                     className="flex-1 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
                   >
                     {t.cancel}
                   </button>
                 </div>
               </div>
             </div>
           )}
         </div>
       )
    }
  ];

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

            {/* Tabs Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Tabs
                items={tabItems}
                value={activeTab}
                onValueChange={setActiveTab}
                variant="cards"
                size="md"
                fullWidth={false}
                defaultValue="unit-prices"
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
