'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import { useAuth } from '@/app/components/auth/AuthProvider';
import { useToast } from '@/hooks/useToast';
import Card, { CardHeader, CardTitle, CardBody } from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Avatar from '@/app/components/ui/Avatar';
import Tabs from '@/app/components/ui/Tabs';
import Input from '@/app/components/ui/Input';
import Label from '@/app/components/ui/Label';
import TextArea from '@/app/components/ui/TextArea';
import Switch from '@/app/components/ui/Switch';
import Separator from '@/app/components/ui/Separator';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Lock,
  Camera,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Globe,
  Building,
  Award,
  Clock,

  FileText,
  CreditCard,
  History,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles
    pageTitle: 'Profil',
    profileSettings: 'Profil Ayarları',
    personalInfo: 'Kişisel Bilgiler',
    securitySettings: 'İş Bilgileri',
    
    // Breadcrumb
    home: 'Ana Sayfa',
    profile: 'Profil',
    
    // Personal Info
    personalInfoTitle: 'Kişisel Bilgiler',
    personalInfoDescription: 'Hesap bilgilerinizi güncelleyin',
    firstName: 'Ad',
    lastName: 'Soyad',
    email: 'E-posta',
    phone: 'Telefon',
    position: 'Pozisyon',
    department: 'Departman',
    location: 'Konum',
    bio: 'Hakkımda',
    joinDate: 'Katılım Tarihi',
    lastLogin: 'Son Giriş',
    
    // Security
    securityTitle: 'İş Bilgileri',
    securityDescription: 'İş bilgilerinizi ve güvenlik ayarlarınızı yönetin',
    currentPassword: 'Mevcut Şifre',
    newPassword: 'Yeni Şifre',
    confirmPassword: 'Şifre Tekrarı',
    twoFactorAuth: 'İki Faktörlü Kimlik Doğrulama',
    twoFactorAuthDescription: 'Hesabınızı daha güvenli hale getirin',
    sessionTimeout: 'Oturum Zaman Aşımı',
    sessionTimeoutDescription: 'Oturumunuzun ne kadar süre açık kalacağını belirleyin',
    
    // Preferences
    preferencesTitle: 'Tercihler',
    preferencesDescription: 'Uygulama tercihlerinizi özelleştirin',
    language: 'Dil',
    theme: 'Tema',
    notifications: 'Bildirimler',
    emailNotifications: 'E-posta Bildirimleri',
    pushNotifications: 'Push Bildirimleri',
    smsNotifications: 'SMS Bildirimleri',
    
    // Actions
    saveChanges: 'Değişiklikleri Kaydet',
    cancel: 'İptal',
    edit: 'Düzenle',
    update: 'Güncelle',
    changePassword: 'Şifre Değiştir',
    enable2FA: '2FA Etkinleştir',
    disable2FA: '2FA Devre Dışı Bırak',
    uploadPhoto: 'Fotoğraf Yükle',
    removePhoto: 'Fotoğrafı Kaldır',
    
    // Status
    active: 'Aktif',
    inactive: 'Pasif',
    verified: 'Doğrulanmış',
    unverified: 'Doğrulanmamış',
    enabled: 'Etkin',
    disabled: 'Devre Dışı',
    
    // Messages
    profileUpdated: 'Profil başarıyla güncellendi',
    passwordChanged: 'Şifre başarıyla değiştirildi',
    photoUploaded: 'Fotoğraf başarıyla yüklendi',
    changesSaved: 'Değişiklikler kaydedildi',
    errorOccurred: 'Bir hata oluştu',
    
    // Placeholders
    enterFirstName: 'Adınızı girin',
    enterLastName: 'Soyadınızı girin',
    enterEmail: 'E-posta adresinizi girin',
    enterPhone: 'Telefon numaranızı girin',
    enterBio: 'Kendiniz hakkında kısa bir açıklama yazın',
    enterCurrentPassword: 'Mevcut şifrenizi girin',
    enterNewPassword: 'Yeni şifrenizi girin',
    confirmNewPassword: 'Yeni şifrenizi tekrar girin',
  },
  en: {
    // Page titles
    pageTitle: 'Profile',
    profileSettings: 'Profile Settings',
    personalInfo: 'Personal Information',
    securitySettings: 'Security Settings',
    activityLog: 'Activity Log',
    
    // Breadcrumb
    home: 'Home',
    profile: 'Profile',
    
    // Personal Info
    personalInfoTitle: 'Personal Information',
    personalInfoDescription: 'Update your account information',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    position: 'Position',
    department: 'Department',
    location: 'Location',
    bio: 'Bio',
    joinDate: 'Join Date',
    lastLogin: 'Last Login',
    
    // Security
    securityTitle: 'Security Settings',
    securityDescription: 'Manage your account security',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    twoFactorAuth: 'Two-Factor Authentication',
    twoFactorAuthDescription: 'Make your account more secure',
    sessionTimeout: 'Session Timeout',
    sessionTimeoutDescription: 'Set how long your session stays active',
    
    // Preferences
    preferencesTitle: 'Preferences',
    preferencesDescription: 'Customize your application preferences',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    smsNotifications: 'SMS Notifications',
    
    // Actions
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    edit: 'Edit',
    update: 'Update',
    changePassword: 'Change Password',
    enable2FA: 'Enable 2FA',
    disable2FA: 'Disable 2FA',
    uploadPhoto: 'Upload Photo',
    removePhoto: 'Remove Photo',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    verified: 'Verified',
    unverified: 'Unverified',
    enabled: 'Enabled',
    disabled: 'Disabled',
    
    // Messages
    profileUpdated: 'Profile updated successfully',
    passwordChanged: 'Password changed successfully',
    photoUploaded: 'Photo uploaded successfully',
    changesSaved: 'Changes saved successfully',
    errorOccurred: 'An error occurred',
    
    // Placeholders
    enterFirstName: 'Enter your first name',
    enterLastName: 'Enter your last name',
    enterEmail: 'Enter your email address',
    enterPhone: 'Enter your phone number',
    enterBio: 'Write a short description about yourself',
    enterCurrentPassword: 'Enter your current password',
    enterNewPassword: 'Enter your new password',
    confirmNewPassword: 'Confirm your new password',
  },
  ar: {
    // Page titles
    pageTitle: 'الملف الشخصي',
    profileSettings: 'إعدادات الملف الشخصي',
    personalInfo: 'المعلومات الشخصية',
    securitySettings: 'إعدادات الأمان',
    activityLog: 'سجل النشاط',
    
    // Breadcrumb
    home: 'الرئيسية',
    profile: 'الملف الشخصي',
    
    // Personal Info
    personalInfoTitle: 'المعلومات الشخصية',
    personalInfoDescription: 'تحديث معلومات حسابك',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    position: 'المنصب',
    department: 'القسم',
    location: 'الموقع',
    bio: 'السيرة الذاتية',
    joinDate: 'تاريخ الانضمام',
    lastLogin: 'آخر تسجيل دخول',
    
    // Security
    securityTitle: 'إعدادات الأمان',
    securityDescription: 'إدارة أمان حسابك',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    twoFactorAuth: 'المصادقة الثنائية',
    twoFactorAuthDescription: 'اجعل حسابك أكثر أماناً',
    sessionTimeout: 'انتهاء صلاحية الجلسة',
    sessionTimeoutDescription: 'حدد مدة بقاء جلستك نشطة',
    
    // Preferences
    preferencesTitle: 'التفضيلات',
    preferencesDescription: 'تخصيص تفضيلات التطبيق',
    language: 'اللغة',
    theme: 'المظهر',
    notifications: 'الإشعارات',
    emailNotifications: 'إشعارات البريد الإلكتروني',
    pushNotifications: 'الإشعارات الفورية',
    smsNotifications: 'إشعارات الرسائل النصية',
    
    // Actions
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    edit: 'تعديل',
    update: 'تحديث',
    changePassword: 'تغيير كلمة المرور',
    enable2FA: 'تفعيل المصادقة الثنائية',
    disable2FA: 'إلغاء تفعيل المصادقة الثنائية',
    uploadPhoto: 'رفع صورة',
    removePhoto: 'إزالة الصورة',
    
    // Status
    active: 'نشط',
    inactive: 'غير نشط',
    verified: 'متحقق',
    unverified: 'غير متحقق',
    enabled: 'مفعل',
    disabled: 'معطل',
    
    // Messages
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح',
    passwordChanged: 'تم تغيير كلمة المرور بنجاح',
    photoUploaded: 'تم رفع الصورة بنجاح',
    changesSaved: 'تم حفظ التغييرات بنجاح',
    errorOccurred: 'حدث خطأ',
    
    // Placeholders
    enterFirstName: 'أدخل اسمك الأول',
    enterLastName: 'أدخل اسم العائلة',
    enterEmail: 'أدخل عنوان بريدك الإلكتروني',
    enterPhone: 'أدخل رقم هاتفك',
    enterBio: 'اكتب وصفاً قصيراً عن نفسك',
    enterCurrentPassword: 'أدخل كلمة المرور الحالية',
    enterNewPassword: 'أدخل كلمة المرور الجديدة',
    confirmNewPassword: 'أكد كلمة المرور الجديدة',
  }
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { success, error: showError, warning, info } = useToast();
  const [locale, setLocale] = useState('tr');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: 'Talat',
    lastName: 'Abdel Wahab',
    email: 'talatafandy@3steps.com.iq',
    phone: '',
    position: 'Admin',
    department: 'IT Department',
    location: 'Istanbul, Turkey',
    bio: 'System Administrator with expertise in property management systems.',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  });

  const t = translations[locale as keyof typeof translations];

  // Handler functions
  const handleSaveProfile = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      success(t.profileUpdated);
    } catch (error) {
      showError(t.errorOccurred);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Şifreler eşleşmiyor');
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      success(t.passwordChanged);
    } catch (error) {
      showError(t.errorOccurred);
    }
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    success(t.photoUploaded);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Tab items for the Tabs component
  const tabItems = [
    {
      id: 'personal',
      label: t.personalInfo,
      icon: User,
      content: (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-text-on-light dark:text-text-on-dark">
                  {t.personalInfoTitle}
                </CardTitle>
                <p className="text-text-light-secondary dark:text-text-secondary">
                  {t.personalInfoDescription}
                </p>
              </div>
              <Button
                variant={isEditing ? "outline" : "primary"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    {t.cancel}
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    {t.edit}
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t.firstName}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder={t.enterFirstName}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t.lastName}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder={t.enterLastName}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t.enterEmail}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">{t.phone}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t.enterPhone}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="position">{t.position}</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="department">{t.department}</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">{t.location}</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">{t.bio}</Label>
              <TextArea
                 id="bio"
                 value={formData.bio}
                 onChange={(value) => setFormData({ ...formData, bio: value })}
                 placeholder={t.enterBio}
                 disabled={!isEditing}
                 rows={4}
               />
            </div>
            {isEditing && (
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  {t.cancel}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t.saveChanges}
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      )
    },
    {
      id: 'security',
      label: t.securitySettings,
      icon: Shield,
      content: (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-text-on-light dark:text-text-on-dark">
              {t.securityTitle}
            </CardTitle>
            <p className="text-text-light-secondary dark:text-text-secondary">
              {t.securityDescription}
            </p>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Password Change Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                  {t.changePassword}
                </h3>
                <Button
                  variant={isChangingPassword ? "outline" : "primary"}
                  size="sm"
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                >
                  {isChangingPassword ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      {t.cancel}
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      {t.changePassword}
                    </>
                  )}
                </Button>
              </div>
              
              {isChangingPassword && (
                <div className="grid grid-cols-1 gap-4 p-4 bg-background-secondary rounded-lg">
                  <div>
                    <Label htmlFor="currentPassword">{t.currentPassword}</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder={t.enterCurrentPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light-secondary hover:text-text-primary"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword">{t.newPassword}</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder={t.enterNewPassword}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder={t.confirmNewPassword}
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsChangingPassword(false)}
                    >
                      {t.cancel}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleChangePassword}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {t.update}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Security Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                Security Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-primary-gold" />
                    <div>
                      <p className="font-medium text-text-on-light dark:text-text-on-dark">
                        {t.twoFactorAuth}
                      </p>
                      <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                        {t.twoFactorAuthDescription}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary-gold" />
                    <div>
                      <p className="font-medium text-text-on-light dark:text-text-on-dark">
                        {t.sessionTimeout}
                      </p>
                      <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                        {t.sessionTimeoutDescription}
                      </p>
                    </div>
                  </div>
                  <select
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                    className="px-3 py-2 border border-primary-gold/30 rounded-md bg-background-card text-text-on-light dark:text-text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-gold/50"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )
    },
  ];



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
          <DashboardHeader />
          
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
              <nav className="flex items-center space-x-2 text-sm text-text-light-secondary dark:text-text-secondary">
                <span>{t.home}</span>
                <span>/</span>
                <span className="text-text-on-light dark:text-text-on-dark font-medium">{t.profile}</span>
              </nav>
            </div>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-on-light dark:text-text-on-dark mb-2">
                {t.pageTitle}
              </h1>
              <p className="text-text-light-secondary dark:text-text-secondary">
                {t.profileSettings}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <Card className="shadow-lg">
                  <CardBody className="p-6">
                    <div className="text-center">
                      {/* Avatar */}
                      <div className="relative inline-block mb-4">
                        <Avatar
                          size="xl"
                          fallback={`${user?.firstName?.[0] || 'A'}${user?.lastName?.[0] || 'U'}`}
                          className="w-24 h-24 mx-auto"
                        />
                        <button
                          onClick={handlePhotoUpload}
                          className="absolute bottom-0 right-0 p-2 bg-primary-gold rounded-full text-white hover:bg-primary-gold/90 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>

                      {/* User Info */}
                      <h2 className="text-xl font-bold text-text-on-light dark:text-text-on-dark mb-1">
                        Talat Abdel Wahab
                      </h2>
                      <p className="text-text-light-secondary dark:text-text-secondary mb-3">
                        Admin
                      </p>

                      {/* Status Badges */}
                      <div className="flex justify-center gap-2 mb-4">
                        <Badge variant="soft" color="gold">
                          {t.active}
                        </Badge>
                        <Badge variant="soft" color="primary">
                          {t.verified}
                        </Badge>
                      </div>

                      {/* Quick Stats */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-light-secondary dark:text-text-secondary">
                            {t.joinDate}
                          </span>
                          <span className="text-text-on-light dark:text-text-on-dark font-medium">
                            {formatDate(new Date('2024-01-15'))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-light-secondary dark:text-text-secondary">
                            {t.lastLogin}
                          </span>
                          <span className="text-text-on-light dark:text-text-on-dark font-medium">
                            {formatDate(new Date())}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2">
                <Tabs 
                  items={tabItems}
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="space-y-6"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
