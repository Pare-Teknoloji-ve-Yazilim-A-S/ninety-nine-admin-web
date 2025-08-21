'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import { unitPricesService } from '@/services/unit-prices.service';
import enumsService from '@/services/enums.service';
import { useRoles } from '@/hooks/useRoles';
import { usePermissions } from '@/hooks/usePermissions';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import Tabs from '@/app/components/ui/Tabs';
import RolePermissionsModal from '@/app/components/ui/RolePermissionsModal';
import { DollarSign, Settings, Shield, Users, Lock, Eye, Edit, Trash2, Plus, UserCheck, Building, CreditCard, FileText, Bell, QrCode, Home, ChevronDown, Key } from 'lucide-react';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles
    pageTitle: 'Ayarlar',
    
    // Breadcrumb
    home: 'Ana Sayfa',
    settings: 'Ayarlar',
    
        // Section titles
     securitySettings: 'Rol ayarları',
     unitPrices: 'Birim Fiyatlar',
     systemEnums: 'Sistem parametre ayarları',
     availableUnits: 'Kullanılabilir Birimler',
    priceTypes: 'Fiyat Türleri ve Birim Fiyatlar',
    rbacDemo: 'Rol Bazlı Erişim Kontrolü',
    
    // RBAC Demo
    rbacDemoTitle: 'Rol Bazlı Erişim Kontrolü Demo',
    rbacDemoDescription: 'Farklı rollerin sistemdeki yetkilerini test edin ve görün',
    selectRole: 'Kullanıcı Rolü Seçin:',
    currentRole: 'Mevcut Rol:',
    rolePermissions: 'Rol Yetkileri',
    availableActions: 'Kullanılabilir İşlemler',
    restrictedActions: 'Kısıtlı İşlemler',
    permissionMatrix: 'İzin Matrisi',
    moduleAccess: 'Modül Erişimi',
    demoActions: 'Demo İşlemler',
    
    // Roles
    superAdmin: 'Süper Admin',
    admin: 'Admin',
    financeManager: 'Mali İşler Müdürü',
    hrManager: 'İK Müdürü',
    operator: 'Operatör',
    viewer: 'Görüntüleyici',
    user: 'Kullanıcı',
    
    // Permissions
    canView: 'Görüntüleyebilir',
    canCreate: 'Oluşturabilir',
    canEdit: 'Düzenleyebilir',
    canDelete: 'Silebilir',
    canApprove: 'Onaylayabilir',
    canExport: 'Dışa Aktarabilir',
    canManageUsers: 'Kullanıcı Yönetebilir',
    canManageRoles: 'Rol Yönetebilir',
    canViewFinancials: 'Finansal Verileri Görebilir',
    canManageSettings: 'Ayarları Yönetebilir',
    
    // Modules
    dashboard: 'Dashboard',
    residents: 'Sakinler',
    staff: 'Personel',
    financial: 'Finansal',
    requests: 'Talepler',
    announcements: 'Duyurular',
    reports: 'Raporlar',
    
    // Actions
    viewProfile: 'Profili Görüntüle',
    editProfile: 'Profili Düzenle',
    deleteUser: 'Kullanıcıyı Sil',
    createUser: 'Kullanıcı Oluştur',
    viewReports: 'Raporları Görüntüle',
    exportData: 'Veriyi Dışa Aktar',
    manageSettings: 'Ayarları Yönet',
    approveRequests: 'Talepleri Onayla',
    viewFinancials: 'Finansal Verileri Görüntüle',
    manageUsers: 'Kullanıcıları Yönet',
    manageRoles: 'Rolleri Yönet',
    
    // Messages
    actionSuccess: 'İşlem başarılı!',
    actionDenied: 'Bu işlem için yetkiniz bulunmuyor.',
    roleChanged: 'Rol değiştirildi',
    permissionCheck: 'Yetki kontrolü yapılıyor...',
    
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
    securitySettings: 'Role Settings',
    unitPrices: 'Unit Prices',
    systemEnums: 'System Parameter Settings',
    availableUnits: 'Available Units',
    priceTypes: 'Price Types and Unit Prices',
    rbacDemo: 'Role-Based Access Control',
    
    // RBAC Demo
    rbacDemoTitle: 'Role-Based Access Control Demo',
    rbacDemoDescription: 'Test and visualize different role permissions in the system',
    selectRole: 'Select User Role:',
    currentRole: 'Current Role:',
    rolePermissions: 'Role Permissions',
    availableActions: 'Available Actions',
    restrictedActions: 'Restricted Actions',
    permissionMatrix: 'Permission Matrix',
    moduleAccess: 'Module Access',
    demoActions: 'Demo Actions',
    
    // Roles
    superAdmin: 'Super Admin',
    admin: 'Admin',
    financeManager: 'Finance Manager',
    hrManager: 'HR Manager',
    operator: 'Operator',
    viewer: 'Viewer',
    user: 'User',
    
    // Permissions
    canView: 'Can View',
    canCreate: 'Can Create',
    canEdit: 'Can Edit',
    canDelete: 'Can Delete',
    canApprove: 'Can Approve',
    canExport: 'Can Export',
    canManageUsers: 'Can Manage Users',
    canManageRoles: 'Can Manage Roles',
    canViewFinancials: 'Can View Financials',
    canManageSettings: 'Can Manage Settings',
    
    // Modules
    dashboard: 'Dashboard',
    residents: 'Residents',
    staff: 'Staff',
    financial: 'Financial',
    requests: 'Requests',
    announcements: 'Announcements',
    reports: 'Reports',
    
    // Actions
    viewProfile: 'View Profile',
    editProfile: 'Edit Profile',
    deleteUser: 'Delete User',
    createUser: 'Create User',
    viewReports: 'View Reports',
    exportData: 'Export Data',
    manageSettings: 'Manage Settings',
    approveRequests: 'Approve Requests',
    viewFinancials: 'View Financials',
    manageUsers: 'Manage Users',
    manageRoles: 'Manage Roles',
    
    // Messages
    actionSuccess: 'Action successful!',
    actionDenied: 'You do not have permission for this action.',
    roleChanged: 'Role changed',
    permissionCheck: 'Checking permissions...',
    
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
    securitySettings: 'إعدادات الأدوار',
    unitPrices: 'أسعار الوحدات',
    systemEnums: 'إعدادات معاملات النظام',
    availableUnits: 'الوحدات المتاحة',
    priceTypes: 'أنواع الأسعار وأسعار الوحدات',
    rbacDemo: 'التحكم في الوصول القائم على الأدوار',
    
    // RBAC Demo
    rbacDemoTitle: 'عرض توضيحي للتحكم في الوصول القائم على الأدوار',
    rbacDemoDescription: 'اختبر وتصور صلاحيات الأدوار المختلفة في النظام',
    selectRole: 'اختر دور المستخدم:',
    currentRole: 'الدور الحالي:',
    rolePermissions: 'صلاحيات الدور',
    availableActions: 'الإجراءات المتاحة',
    restrictedActions: 'الإجراءات المقيدة',
    permissionMatrix: 'مصفوفة الأذونات',
    moduleAccess: 'الوصول إلى الوحدات',
    demoActions: 'إجراءات العرض التوضيحي',
    
    // Roles
    superAdmin: 'مدير النظام',
    admin: 'مدير',
    financeManager: 'مدير المالية',
    hrManager: 'مدير الموارد البشرية',
    operator: 'مشغل',
    viewer: 'عارض',
    user: 'مستخدم',
    
    // Permissions
    canView: 'يمكنه العرض',
    canCreate: 'يمكنه الإنشاء',
    canEdit: 'يمكنه التعديل',
    canDelete: 'يمكنه الحذف',
    canApprove: 'يمكنه الموافقة',
    canExport: 'يمكنه التصدير',
    canManageUsers: 'يمكنه إدارة المستخدمين',
    canManageRoles: 'يمكنه إدارة الأدوار',
    canViewFinancials: 'يمكنه عرض البيانات المالية',
    canManageSettings: 'يمكنه إدارة الإعدادات',
    
    // Modules
    dashboard: 'لوحة التحكم',
    residents: 'المقيمون',
    staff: 'الموظفون',
    financial: 'المالية',
    requests: 'الطلبات',
    announcements: 'الإعلانات',
    reports: 'التقارير',
    
    // Actions
    viewProfile: 'عرض الملف الشخصي',
    editProfile: 'تعديل الملف الشخصي',
    deleteUser: 'حذف المستخدم',
    createUser: 'إنشاء مستخدم',
    viewReports: 'عرض التقارير',
    exportData: 'تصدير البيانات',
    manageSettings: 'إدارة الإعدادات',
    approveRequests: 'الموافقة على الطلبات',
    viewFinancials: 'عرض البيانات المالية',
    manageUsers: 'إدارة المستخدمين',
    manageRoles: 'إدارة الأدوار',
    
    // Messages
    actionSuccess: 'تم تنفيذ الإجراء بنجاح!',
    actionDenied: 'ليس لديك إذن لهذا الإجراء.',
    roleChanged: 'تم تغيير الدور',
    permissionCheck: 'جاري التحقق من الأذونات...',
    
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
  const [activeTab, setActiveTab] = useState<string>('rbac-demo');
  
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
  const [newEnumSortOrder, setNewEnumSortOrder] = useState<string>('1');
  const [isCreatingEnum, setIsCreatingEnum] = useState<boolean>(false);
  
  // RBAC Demo states
  const [selectedRole, setSelectedRole] = useState<string>('user');
  const [actionMessage, setActionMessage] = useState<string>('');
  const [showActionMessage, setShowActionMessage] = useState<boolean>(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [newRoleDescription, setNewRoleDescription] = useState<string>('');
  const [isAddingRole, setIsAddingRole] = useState<boolean>(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [roleToDelete, setRoleToDelete] = useState<string>('');
  
  // Permission Management states
  const [showAddPermissionModal, setShowAddPermissionModal] = useState<boolean>(false);
  const [newPermissionName, setNewPermissionName] = useState<string>('');
  const [newPermissionAction, setNewPermissionAction] = useState<string>('');
  const [newPermissionResource, setNewPermissionResource] = useState<string>('');
  const [newPermissionDescription, setNewPermissionDescription] = useState<string>('');
  const [isAddingPermission, setIsAddingPermission] = useState<boolean>(false);
  
  // Role Permissions Modal states
  const [showRolePermissionsModal, setShowRolePermissionsModal] = useState<boolean>(false);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<any>(null);
  
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
    setNewEnumSortOrder('1');
  };

  const closeEnumForm = () => {
    setShowEnumForm(false);
    setSelectedModule('');
    setSelectedCategory('');
    setNewEnumCode('');
    setNewEnumSortOrder('1');
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



  const createEnumValue = async () => {
    try {
      if (!selectedModule || !selectedCategory || !newEnumCode) {
        console.error('Modül, kategori ve kod alanları doldurulmalı');
        return;
      }

      setIsCreatingEnum(true);

      // Kodu otomatik olarak UPPER_CASE formatına çevir
      const formattedCode = newEnumCode.toUpperCase().replace(/\s+/g, '_');

      const response = await enumsService.createEnum({
        module: selectedModule,
        category: selectedCategory,
        codes: [formattedCode],
        sortOrder: parseInt(newEnumSortOrder) || 1
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

  // RBAC Demo Functions - Mock data for demo purposes
  const rolePermissions = {
    superAdmin: {
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: true,
      canExport: true,
      canManageUsers: true,
      canManageRoles: true,
      canViewFinancials: true,
      canManageSettings: true
    },
    admin: {
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: true,
      canExport: true,
      canManageUsers: true,
      canManageRoles: false,
      canViewFinancials: true,
      canManageSettings: true
    },
    financeManager: {
      canView: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: true,
      canExport: true,
      canManageUsers: false,
      canManageRoles: false,
      canViewFinancials: true,
      canManageSettings: false
    },
    hrManager: {
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: true,
      canExport: true,
      canManageUsers: true,
      canManageRoles: false,
      canViewFinancials: false,
      canManageSettings: false
    },
    operator: {
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canExport: false,
      canManageUsers: false,
      canManageRoles: false,
      canViewFinancials: false,
      canManageSettings: false
    },
    viewer: {
      canView: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: false,
      canExport: false,
      canManageUsers: false,
      canManageRoles: false,
      canViewFinancials: false,
      canManageSettings: false
    },
    user: {
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: false,
      canExport: false,
      canManageUsers: false,
      canManageRoles: false,
      canViewFinancials: false,
      canManageSettings: false
    }
  };

  const moduleAccess = {
    superAdmin: ['dashboard', 'residents', 'staff', 'financial', 'requests', 'announcements', 'settings', 'reports'],
    admin: ['dashboard', 'residents', 'staff', 'financial', 'requests', 'announcements', 'settings', 'reports'],
    financeManager: ['dashboard', 'financial', 'reports'],
    hrManager: ['dashboard', 'staff', 'requests'],
    operator: ['dashboard', 'residents', 'requests'],
    viewer: ['dashboard', 'residents'],
    user: ['dashboard']
  };

  // Real API integration for role management
  const {
    roles,
    loading: rolesLoading,
    error: rolesError,
    createRole,
    updateRole,
    deleteRole,
    refreshRoles
  } = useRoles();

  // Real API integration for permission management
  const {
    permissions,
    permissionsByResource,
    loading: permissionsLoading,
    error: permissionsError,
    createPermission,
    updatePermission,
    deletePermission,
    refreshPermissions
  } = usePermissions();

  const handleDemoAction = (action: string) => {
    const permissions = rolePermissions[selectedRole as keyof typeof rolePermissions];
    
    if (permissions && permissions[action as keyof typeof permissions]) {
      setActionMessage(t.actionSuccess);
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
    } else {
      setActionMessage(t.actionDenied);
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
    }
  };

  const getModuleIcon = (module: string) => {
    const icons: Record<string, any> = {
      dashboard: Home,
      residents: Users,
      staff: UserCheck,
      financial: CreditCard,
      requests: FileText,
      announcements: Bell,
      settings: Settings,
      reports: FileText
    };
    return icons[module] || Settings;
  };

  // Role Management Functions
  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      setActionMessage('Rol adı boş olamaz');
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
      return;
    }

    setIsAddingRole(true);
    try {
      await createRole({
        name: newRoleName.trim(),
        description: newRoleDescription.trim() || undefined
      });
      
      // Rol oluşturduktan sonra listeyi yenile
      setTimeout(() => {
        refreshRoles();
      }, 500);
      
      setActionMessage('Rol başarıyla eklendi');
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
      
      setShowAddRoleModal(false);
      setNewRoleName('');
      setNewRoleDescription('');
    } catch (error) {
      setActionMessage('Rol eklenirken hata oluştu');
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
    } finally {
      setIsAddingRole(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await deleteRole(roleId);
      setActionMessage('Rol başarıyla silindi');
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
    } catch (error) {
      setActionMessage('Rol silinirken hata oluştu');
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
    }
  };

  const handleEditRole = (role: any) => {
    // TODO: Implement role editing functionality
    console.log('Edit role:', role);
    setActionMessage('Rol düzenleme özelliği yakında eklenecek');
    setShowActionMessage(true);
    setTimeout(() => setShowActionMessage(false), 3000);
  };

  // Permission Management Functions
  const handleAddPermission = async () => {
    if (!newPermissionName.trim() || !newPermissionAction.trim() || !newPermissionResource.trim()) {
      setActionMessage('İzin adı, eylem ve kaynak alanları boş olamaz');
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
      return;
    }

    setIsAddingPermission(true);
    try {
      await createPermission({
        name: newPermissionName.trim(),
        action: newPermissionAction.trim(),
        resource: newPermissionResource.trim(),
        description: newPermissionDescription.trim() || undefined
      });
      
      // İzin oluşturduktan sonra listeyi yenile
      setTimeout(() => {
        refreshPermissions();
      }, 500);
      
      setActionMessage('İzin başarıyla eklendi');
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
      
      setShowAddPermissionModal(false);
      setNewPermissionName('');
      setNewPermissionAction('');
      setNewPermissionResource('');
      setNewPermissionDescription('');
    } catch (error) {
      setActionMessage('İzin eklenirken hata oluştu');
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
    } finally {
      setIsAddingPermission(false);
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    try {
      await deletePermission(permissionId);
      setActionMessage('İzin başarıyla silindi');
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
    } catch (error) {
      setActionMessage('İzin silinirken hata oluştu');
      setShowActionMessage(true);
      setTimeout(() => setShowActionMessage(false), 3000);
    }
  };

  const handleEditPermission = (permission: any) => {
    // TODO: Implement permission editing functionality
    console.log('Edit permission:', permission);
    setActionMessage('İzin düzenleme özelliği yakında eklenecek');
    setShowActionMessage(true);
    setTimeout(() => setShowActionMessage(false), 3000);
  };

  // Role Permissions Management Functions
  const handleManageRolePermissions = (role: any) => {
    setSelectedRoleForPermissions(role);
    setShowRolePermissionsModal(true);
  };

  const handleCloseRolePermissionsModal = () => {
    setShowRolePermissionsModal(false);
    setSelectedRoleForPermissions(null);
  };





  // Tab items
  const tabItems = [
    {
      id: 'rbac-demo',
      label: t.rbacDemo,
      icon: Lock,
      content: (
        <div className="space-y-6 p-6">
          {/* Header */}
          <div>
            <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-2">
              {t.rbacDemoTitle}
            </h3>
            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
              {t.rbacDemoDescription}
            </p>
          </div>

                     {/* Role Management */}
           <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
             <div className="flex items-center justify-between mb-4">
               <h4 className="text-md font-medium text-text-on-light dark:text-text-on-dark">
                 Rol Yönetimi
               </h4>
               <button
                 onClick={() => setShowAddRoleModal(true)}
                 className="inline-flex items-center px-3 py-1.5 bg-primary-gold text-white text-xs font-medium rounded-md hover:bg-primary-gold/80 transition-colors"
               >
                 <Plus className="w-3 h-3 mr-1" />
                 Rol Ekle
               </button>
             </div>
             
             {rolesLoading ? (
               <div className="flex items-center justify-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
                 <span className="ml-2 text-text-light-secondary dark:text-text-secondary">Roller yükleniyor...</span>
               </div>
             ) : rolesError ? (
               <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                 <p className="text-red-800 dark:text-red-200 text-sm">{rolesError}</p>
               </div>
                                         ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {roles && roles.length > 0 ? (
                    roles.map((role) => {
                      // Güvenli kontrol - role objesi ve gerekli alanları var mı?
                      if (!role || !role.id || !role.name || !role.slug) {
                        console.warn('Invalid role object:', role);
                        return null;
                      }
                      
                      return (
                        <div key={role.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
                          <div className="flex items-center space-x-2 flex-1">
                            <input
                              type="radio"
                              id={role.id}
                              name="selectedRole"
                              value={role.slug}
                              checked={selectedRole === role.slug}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="text-primary-gold focus:ring-primary-gold"
                            />
                            <div className="flex flex-col">
                              <label htmlFor={role.id} className="text-sm font-medium text-text-on-light dark:text-text-on-dark cursor-pointer">
                                {role.name}
                              </label>
                              {role.description && (
                                <span className="text-xs text-text-light-secondary dark:text-text-secondary">
                                  {role.description}
                                </span>
                              )}
                              {role.isSystem && (
                                <span className="text-xs text-primary-gold bg-primary-gold-light/20 px-2 py-0.5 rounded-full">
                                  Sistem Rolü
                                </span>
                              )}
                            </div>
                          </div>
                                                     <div className="flex items-center ml-auto space-x-2">
                             <button
                               onClick={() => handleManageRolePermissions(role)}
                               className="text-primary-gold hover:text-primary-gold/80 transition-colors"
                               title="İzinleri Yönet"
                             >
                               <Key className="w-4 h-4" />
                             </button>
                             <button
                               onClick={() => handleEditRole(role)}
                               className="text-primary-blue hover:text-primary-blue/80 transition-colors"
                               title="Rolü Düzenle"
                             >
                               <Edit className="w-4 h-4" />
                             </button>
                             {!role.isSystem && (
                               <button
                                 onClick={() => handleDeleteRole(role.id)}
                                 className="text-red-500 hover:text-red-700 transition-colors"
                                 title="Rolü Sil"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             )}
                           </div>
                        </div>
                      );
                    }).filter(Boolean) // null değerleri filtrele
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-text-light-secondary dark:text-text-secondary">
                        Henüz rol bulunmuyor
                      </p>
                    </div>
                  )}
                </div>
              )}
                       </div>

                         {/* Permission Management */}
             <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
               <div className="flex items-center justify-between mb-4">
                 <h4 className="text-md font-medium text-text-on-light dark:text-text-on-dark">
                   İzin Yönetimi
                 </h4>
                 <button
                   onClick={() => setShowAddPermissionModal(true)}
                   className="inline-flex items-center px-3 py-1.5 bg-primary-gold text-white text-xs font-medium rounded-md hover:bg-primary-gold/80 transition-colors"
                 >
                   <Plus className="w-3 h-3 mr-1" />
                   İzin Ekle
                 </button>
               </div>
               
               <details className="bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-primary-gold/30 overflow-hidden shadow-sm">
                 <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                   <div className="flex items-center space-x-3">
                     <div className="p-2 bg-primary-gold/20 rounded-lg">
                       <Shield className="w-5 h-5 text-primary-gold" />
                     </div>
                     <div>
                       <h5 className="text-base font-bold text-text-on-light dark:text-text-on-dark">
                         Tüm İzinler
                       </h5>
                       <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                         İzinleri görüntüle ve yönet
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center space-x-3">
                     <span className="text-sm bg-primary-gold text-white px-3 py-1 rounded-full font-medium">
                       {permissions ? permissions.length : 0}
                     </span>
                     <ChevronDown className="w-5 h-5 text-primary-gold transition-transform group-open:rotate-180" />
                   </div>
                 </summary>
               
               {permissionsLoading ? (
                 <div className="flex items-center justify-center py-8">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
                   <span className="ml-2 text-text-light-secondary dark:text-text-secondary">İzinler yükleniyor...</span>
                 </div>
               ) : permissionsError ? (
                 <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                   <p className="text-red-800 dark:text-red-200 text-sm">{permissionsError}</p>
                 </div>
                               ) : (
                  <div className="overflow-y-auto max-h-[600px] p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#AC8D6A #E5E7EB' }}>
                    <div className="space-y-4">
                      {permissionsByResource && Object.keys(permissionsByResource).length > 0 ? (
                        Object.entries(permissionsByResource).map(([resource, resourcePermissions]) => (
                          <details key={resource} className="bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 overflow-hidden">
                            <summary className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                              <div className="flex items-center space-x-2">
                                <Shield className="w-4 h-4 text-primary-gold" />
                                <div>
                                  <h5 className="text-sm font-semibold text-text-on-light dark:text-text-on-dark">
                                    {resource.charAt(0).toUpperCase() + resource.slice(1)}
                                  </h5>
                                  <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                                    {resourcePermissions.length} izin
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs bg-primary-gold-light/20 text-primary-gold px-2 py-0.5 rounded-full">
                                  {resourcePermissions.length}
                                </span>
                                <ChevronDown className="w-4 h-4 text-text-light-secondary dark:text-text-secondary transition-transform group-open:rotate-180" />
                              </div>
                            </summary>
                            
                            <div className="border-t border-gray-200 dark:border-gray-500 p-3 bg-gray-50 dark:bg-gray-700">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {resourcePermissions.map((permission) => {
                                  // Güvenli kontrol - permission objesi ve gerekli alanları var mı?
                                  if (!permission || !permission.id || !permission.name || !permission.action || !permission.resource) {
                                    console.warn('Invalid permission object:', permission);
                                    return null;
                                  }
                                  
                                  return (
                                    <div key={permission.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
                                      <div className="flex items-center space-x-2 flex-1">
                                        <div className="w-2 h-2 bg-primary-gold rounded-full flex-shrink-0"></div>
                                        <div className="flex flex-col">
                                          <label className="text-sm font-medium text-text-on-light dark:text-text-on-dark cursor-pointer">
                                            {permission.name}
                                          </label>
                                          <div className="text-xs text-text-light-secondary dark:text-text-secondary">
                                            <span className="font-medium">Eylem:</span> {permission.action}
                                          </div>
                                          {permission.description && (
                                            <div className="text-xs text-text-light-muted dark:text-text-muted line-clamp-1">
                                              {permission.description}
                                            </div>
                                          )}
                                          {permission.isSystem && (
                                            <span className="text-xs text-primary-gold bg-primary-gold-light/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                                              Sistem İzni
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center ml-auto space-x-2">
                                        <button
                                          onClick={() => handleEditPermission(permission)}
                                          className="text-primary-blue hover:text-primary-blue/80 transition-colors"
                                          title="İzni Düzenle"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        {!permission.isSystem && (
                                          <button
                                            onClick={() => handleDeletePermission(permission.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            title="İzni Sil"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }).filter(Boolean) // null değerleri filtrele
                              }
                              </div>
                            </div>
                          </details>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Shield className="w-12 h-12 text-text-light-secondary dark:text-text-secondary mx-auto mb-3" />
                          <p className="text-text-light-secondary dark:text-text-secondary">
                            Henüz izin bulunmuyor
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                 </details>
             </div>

           {/* Action Message */}
          {showActionMessage && (
            <div className={`p-4 rounded-lg ${
              actionMessage === t.actionSuccess 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {actionMessage}
            </div>
          )}

          {/* Module Access */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-md font-medium text-text-on-light dark:text-text-on-dark mb-4">
              {t.moduleAccess}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['dashboard', 'residents', 'staff', 'financial', 'requests', 'announcements', 'reports'].map((module) => {
                const IconComponent = getModuleIcon(module);
                const hasAccess = moduleAccess[selectedRole as keyof typeof moduleAccess]?.includes(module);
                return (
                  <div key={module} className={`p-3 rounded-lg border-2 transition-colors ${
                    hasAccess 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-4 h-4 ${
                        hasAccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        hasAccess ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                      }`}>
                        {t[module as keyof typeof t]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-md font-medium text-text-on-light dark:text-text-on-dark mb-4">
              {t.permissionMatrix}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(rolePermissions[selectedRole as keyof typeof rolePermissions] || {}).map(([permission, hasPermission]) => (
                <div key={permission} className={`p-3 rounded-lg border-2 transition-colors ${
                  hasPermission 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                }`}>
                  <div className="text-center">
                    <div className={`text-sm font-medium ${
                      hasPermission ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}>
                      {t[permission as keyof typeof t]}
                    </div>
                    <div className={`text-xs mt-1 ${
                      hasPermission ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {hasPermission ? '✓' : '✗'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Actions */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-md font-medium text-text-on-light dark:text-text-on-dark mb-4">
              {t.demoActions}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { action: 'canView', label: t.viewProfile, icon: Eye },
                { action: 'canEdit', label: t.editProfile, icon: Edit },
                { action: 'canCreate', label: t.createUser, icon: Plus },
                { action: 'canDelete', label: t.deleteUser, icon: Trash2 },
                { action: 'canViewFinancials', label: t.viewFinancials, icon: CreditCard },
                { action: 'canExport', label: t.exportData, icon: FileText },
                { action: 'canManageUsers', label: t.manageUsers, icon: Users },
                { action: 'canManageRoles', label: t.manageRoles, icon: Lock }
              ].map(({ action, label, icon: IconComponent }) => {
                const permissions = rolePermissions[selectedRole as keyof typeof rolePermissions];
                const hasPermission = permissions && permissions[action as keyof typeof permissions];
                return (
                  <button
                    key={action}
                    onClick={() => handleDemoAction(action)}
                    disabled={!hasPermission}
                    className={`p-3 rounded-lg border-2 transition-colors flex items-center space-x-2 ${
                      hasPermission 
                        ? 'bg-primary-gold/10 border-primary-gold/30 hover:bg-primary-gold/20 text-primary-gold' 
                        : 'bg-gray-100 border-gray-300 dark:bg-gray-600 dark:border-gray-500 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

                     {/* Add Role Modal */}
           {showAddRoleModal && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                 <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-4">
                   Yeni Rol Ekle
                 </h3>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                       Rol Adı
                     </label>
                     <input
                       type="text"
                       value={newRoleName}
                       onChange={(e) => setNewRoleName(e.target.value)}
                       className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                       placeholder="Örn: Editör"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                       Açıklama
                     </label>
                     <textarea
                       value={newRoleDescription}
                       onChange={(e) => setNewRoleDescription(e.target.value)}
                       className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                       placeholder="Rol açıklaması (opsiyonel)"
                       rows={3}
                     />
                   </div>
                 </div>
                 
                 <div className="flex gap-3 mt-6">
                   <button
                     onClick={handleAddRole}
                     disabled={isAddingRole || !newRoleName.trim()}
                     className="flex-1 px-4 py-2 bg-primary-gold text-white text-sm font-medium rounded-md hover:bg-primary-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     {isAddingRole ? 'Ekleniyor...' : 'Ekle'}
                   </button>
                   <button
                     onClick={() => {
                       setShowAddRoleModal(false);
                       setNewRoleName('');
                       setNewRoleDescription('');
                     }}
                     className="flex-1 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
                   >
                     İptal
                   </button>
                 </div>
               </div>
             </div>
                       )}

            {/* Add Permission Modal */}
            {showAddPermissionModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-4">
                    Yeni İzin Ekle
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                        İzin Adı
                      </label>
                      <input
                        type="text"
                        value={newPermissionName}
                        onChange={(e) => setNewPermissionName(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                        placeholder="Örn: Kullanıcı Oluştur"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                        Eylem
                      </label>
                      <input
                        type="text"
                        value={newPermissionAction}
                        onChange={(e) => setNewPermissionAction(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                        placeholder="Örn: create"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                        Kaynak
                      </label>
                      <input
                        type="text"
                        value={newPermissionResource}
                        onChange={(e) => setNewPermissionResource(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                        placeholder="Örn: user"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                        Açıklama
                      </label>
                      <textarea
                        value={newPermissionDescription}
                        onChange={(e) => setNewPermissionDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                        placeholder="İzin açıklaması (opsiyonel)"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleAddPermission}
                      disabled={isAddingPermission || !newPermissionName.trim() || !newPermissionAction.trim() || !newPermissionResource.trim()}
                      className="flex-1 px-4 py-2 bg-primary-gold text-white text-sm font-medium rounded-md hover:bg-primary-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isAddingPermission ? 'Ekleniyor...' : 'Ekle'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddPermissionModal(false);
                        setNewPermissionName('');
                        setNewPermissionAction('');
                        setNewPermissionResource('');
                        setNewPermissionDescription('');
                      }}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
           {showDeleteConfirmModal && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                 <div className="flex items-center space-x-3 mb-4">
                   <div className="flex-shrink-0">
                     <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                       <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                     </div>
                   </div>
                   <div>
                     <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                       Rolü Sil
                     </h3>
                     <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                       Bu işlem geri alınamaz
                     </p>
                   </div>
                 </div>
                 
                 <div className="mb-6">
                   <p className="text-sm text-text-on-light dark:text-text-on-dark">
                     <span className="font-medium">{roleToDelete}</span> rolünü silmek istediğinizden emin misiniz?
                   </p>
                 </div>
                 
                                   <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirmModal(false);
                        setRoleToDelete('');
                      }}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteRole(roleToDelete);
                        setShowDeleteConfirmModal(false);
                        setRoleToDelete('');
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                    >
                      Evet, Sil
                    </button>
                  </div>
               </div>
             </div>
                        )}

             {/* Role Permissions Modal */}
             <RolePermissionsModal
               isOpen={showRolePermissionsModal}
               onClose={handleCloseRolePermissionsModal}
               role={selectedRoleForPermissions}
             />
         </div>
       )
     },
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
      id: 'system-enums',
      label: t.systemEnums,
      icon: Settings,
             content: (
         <div className="space-y-6 p-6">
                       {/* Header */}
            <div>
              <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-2">
                {t.systemEnums}
              </h3>
              <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                {t.systemEnumsDescription}
              </p>
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
                        onChange={(e) => setNewEnumCode(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold"
                        placeholder="Örn: Yeni Departman"
                      />
                      <p className="text-xs text-text-light-muted dark:text-text-muted mt-1">
                        Sadece adını yazın, sistem otomatik olarak UPPER_CASE formatına çevirecek
                      </p>
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
                      disabled={isCreatingEnum || !selectedModule || !selectedCategory || !newEnumCode}
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
                  {t.rbacDemoTitle}
                </h2>
                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                  {t.rbacDemoDescription}
                </p>
              </div>
                             <div className="flex gap-3">
                 <LanguageSwitcher />
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
