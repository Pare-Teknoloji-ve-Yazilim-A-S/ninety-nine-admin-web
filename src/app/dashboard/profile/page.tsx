'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import { useAuth } from '@/app/components/auth/AuthProvider';
import { useToast } from '@/hooks/useToast';
import { useUserProfile } from '@/hooks/useUserProfile';
import Card, { CardHeader, CardTitle, CardBody } from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import Avatar from '@/app/components/ui/Avatar';
import Tabs from '@/app/components/ui/Tabs';
import Input from '@/app/components/ui/Input';
import Label from '@/app/components/ui/Label';
import TextArea from '@/app/components/ui/TextArea';
import Skeleton from '@/app/components/ui/Skeleton';
import {
  User,
  Camera,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Dil çevirileri
const translations = {
  tr: {
    pageTitle: 'Profil',
    profileSettings: 'Profil Ayarları',
    personalInfo: 'Kişisel Bilgiler',
    home: 'Ana Sayfa',
    profile: 'Profil',
    personalInfoTitle: 'Kişisel Bilgiler',
    personalInfoDescription: 'Hesap bilgilerinizi görüntüleyin',
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
    active: 'Aktif',
    verified: 'Doğrulanmış',
    photoUploaded: 'Fotoğraf başarıyla yüklendi',
    enterFirstName: 'Adınızı girin',
    enterLastName: 'Soyadınızı girin',
    enterEmail: 'E-posta adresinizi girin',
    enterPhone: 'Telefon numaranızı girin',
    enterBio: 'Kendiniz hakkında kısa bir açıklama yazın',
  },
  en: {
    pageTitle: 'Profile',
    profileSettings: 'Profile Settings',
    personalInfo: 'Personal Information',
    home: 'Home',
    profile: 'Profile',
    personalInfoTitle: 'Personal Information',
    personalInfoDescription: 'View your account information',
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
    active: 'Active',
    verified: 'Verified',
    photoUploaded: 'Photo uploaded successfully',
    enterFirstName: 'Enter your first name',
    enterLastName: 'Enter your last name',
    enterEmail: 'Enter your email address',
    enterPhone: 'Enter your phone number',
    enterBio: 'Write a short description about yourself',
  }
};

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { user: profileUser, loading, error, refetch } = useUserProfile();
  const { success } = useToast();
  const [locale, setLocale] = useState('tr');
  const [activeTab, setActiveTab] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Form states - populated from API data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    location: '',
    bio: '',
  });

  // Update form data when profile user data is loaded
  useEffect(() => {
    if (profileUser) {
      setFormData({
        firstName: profileUser.firstName || '',
        lastName: profileUser.lastName || '',
        email: profileUser.email || '',
        phone: profileUser.phone || '',
        position: profileUser.role?.name || '',
        location: 'Istanbul, Turkey', // Default value as this field might not be in API
        bio: 'System Administrator with expertise in property management systems.', // Default value
      });
    }
  }, [profileUser]);

  const t = translations[locale as keyof typeof translations];

  // Handler functions
  const handlePhotoUpload = () => {
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
            <div>
              <CardTitle className="text-text-on-light dark:text-text-on-dark">
                {t.personalInfoTitle}
              </CardTitle>
              <p className="text-text-light-secondary dark:text-text-secondary">
                {t.personalInfoDescription}
              </p>
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
                  disabled={true}
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t.lastName}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder={t.enterLastName}
                  disabled={true}
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
                  disabled={true}
                />
              </div>
              <div>
                <Label htmlFor="phone">{t.phone}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t.enterPhone}
                  disabled={true}
                />
              </div>
              <div>
                <Label htmlFor="position">{t.position}</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  disabled={true}
                />
              </div>

            </div>
            <div>
              <Label htmlFor="location">{t.location}</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={true}
              />
            </div>
            <div>
              <Label htmlFor="bio">{t.bio}</Label>
              <TextArea
                id="bio"
                value={formData.bio}
                onChange={(value) => setFormData({ ...formData, bio: value })}
                placeholder={t.enterBio}
                disabled={true}
                rows={4}
              />
            </div>
          </CardBody>
        </Card>
      )
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="lg:ml-72">
          <DashboardHeader />
          
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
                     {loading ? (
                       <div className="text-center">
                         <div className="relative inline-block mb-4">
                           <Skeleton className="w-24 h-24 rounded-full" />
                         </div>
                         <Skeleton className="h-6 w-32 mb-1 mx-auto" />
                         <Skeleton className="h-4 w-24 mb-2 mx-auto" />
                         <Skeleton className="h-4 w-20 mb-4 mx-auto" />
                         <div className="flex flex-wrap gap-2 justify-center mb-4">
                           <Skeleton className="h-6 w-16" />
                           <Skeleton className="h-6 w-20" />
                         </div>
                         <div className="space-y-3">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-full" />
                         </div>
                       </div>
                     ) : error ? (
                       <div className="flex flex-col items-center justify-center py-8">
                         <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                         <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">Failed to load profile</h3>
                         <p className="text-text-light-secondary dark:text-text-secondary mb-4">{error}</p>
                         <button
                           onClick={refetch}
                           className="flex items-center gap-2 px-4 py-2 bg-primary-gold text-white rounded-lg hover:bg-primary-gold/90 transition-colors"
                         >
                           <RefreshCw className="h-4 w-4" />
                           Retry
                         </button>
                       </div>
                     ) : (
                       <div className="text-center">
                         <div className="relative inline-block mb-4">
                           <Avatar
                             size="xl"
                             fallback={`${profileUser?.firstName?.[0] || 'A'}${profileUser?.lastName?.[0] || 'U'}`}
                           />
                           <button
                             onClick={handlePhotoUpload}
                             className="absolute bottom-0 right-0 p-2 bg-primary-gold text-white rounded-full hover:bg-primary-gold/90 transition-colors"
                           >
                             <Camera className="h-4 w-4" />
                           </button>
                         </div>
                         
                         <h3 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                           {formData.firstName} {formData.lastName}
                         </h3>
                         <p className="text-text-light-secondary dark:text-text-secondary mb-4">
                           {formData.position}
                         </p>
                         
                         <div className="flex flex-wrap gap-2 justify-center mb-4">
                           <Badge variant="soft" color="gold">
                             {t.active}
                           </Badge>
                           <Badge variant="soft" color="primary">
                             {t.verified}
                           </Badge>
                           {profileUser?.status && (
                             <Badge variant="soft" color={profileUser.status === 'ACTIVE' ? 'success' : 'warning'}>
                               {profileUser.status}
                             </Badge>
                           )}
                         </div>
                         
                         <div className="space-y-3 text-left">
                           <div className="flex items-center justify-between">
                             <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                               {t.joinDate}
                             </span>
                             <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                               {profileUser?.createdAt ? formatDate(new Date(profileUser.createdAt)) : formatDate(new Date('2024-01-15'))}
                             </span>
                           </div>
                           <div className="flex items-center justify-between">
                             <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                               {t.lastLogin}
                             </span>
                             <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                               {profileUser?.updatedAt ? formatDate(new Date(profileUser.updatedAt)) : formatDate(new Date())}
                             </span>
                           </div>
                         </div>
                       </div>
                     )}
                   </CardBody>
                 </Card>
              </div>

              {/* Main Content Tabs */}
              <div className="lg:col-span-2">
                <Tabs
                  items={tabItems}
                  value={activeTab}
                  onValueChange={setActiveTab}
                  variant="default"
                  fullWidth={true}
                  className="w-full"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
