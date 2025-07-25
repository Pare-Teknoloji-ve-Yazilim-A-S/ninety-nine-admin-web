'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';

// Breadcrumb Items
const BREADCRUMB_ITEMS = [
  { label: 'Ana Sayfa', href: '/dashboard' },
  { label: 'Ayarlar', href: '/settings' },
  { label: 'Site Bilgileri', active: true }
];

export default function WebsiteInfoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyName, setCompanyName] = useState('NinetyNine Property Management');
  const [companyEmail, setCompanyEmail] = useState('info@ninetynine.com');
  const [companyPhone, setCompanyPhone] = useState('+1 (555) 123-4567');
  const [companyAddress, setCompanyAddress] = useState('123 Business St, City, State 12345');
  const [websiteUrl, setWebsiteUrl] = useState('https://ninetynine.com');
  const [description, setDescription] = useState('Premium property management solutions for modern real estate');

  const handleSave = () => {
    console.log('Saving website info...');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Logo uploaded:', file.name);
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
            title="Site Bilgileri" 
            breadcrumbItems={BREADCRUMB_ITEMS}
          />
          
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                  Site Bilgileri
                </h2>
                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                  Şirket detaylarınızı, markanızı ve genel bilgilerinizi yönetin
                </p>
              </div>
              
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-text-light-secondary dark:text-text-secondary rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  Değişiklikleri Önizle
                </button>
                <button className="px-4 py-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/90">
                  Yayınla
                </button>
              </div>
            </div>

            {/* Şirket Bilgileri */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                Şirket Bilgileri
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Şirket E-postası
                  </label>
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                  />
                </div>
              </div>
            </div>

            {/* Marka Ayarları */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                Marka Ayarları
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Ana Renk
                  </label>
                  <input
                    type="color"
                    defaultValue="#AC8D6A"
                    className="w-20 h-10 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Logo Yükleme
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                        </svg>
                      </div>
                      <p className="text-text-light-secondary dark:text-text-secondary">
                        Logonuzu buraya sürükleyin veya tıklayarak seçin
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-gold bg-primary-gold-light hover:bg-primary-gold/20 cursor-pointer"
                      >
                        Dosya Seç
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                İletişim Bilgileri
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Website URL'i
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    İş Adresi
                  </label>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Şirket Açıklaması
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                    placeholder="Ziyaretçilere şirketiniz hakkında bilgi verin..."
                  />
                </div>
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                Sosyal Medya Bağlantıları
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/sayfaniz"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/hesabiniz"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/company/sirketiniz"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/hesabiniz"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                  />
                </div>
              </div>
            </div>

            {/* SEO Ayarları */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                SEO Ayarları
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Meta Başlık
                  </label>
                  <input
                    type="text"
                    defaultValue="NinetyNine Emlak Yönetimi - Premium Gayrimenkul Çözümleri"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Meta Açıklama
                  </label>
                  <textarea
                    defaultValue="NinetyNine ile premium emlak yönetimi çözümlerini keşfedin. Modern mülk sahipleri ve sakinler için kapsamlı gayrimenkul hizmetleri sunuyoruz."
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Anahtar Kelimeler
                  </label>
                  <input
                    type="text"
                    defaultValue="emlak yönetimi, gayrimenkul, konut, ticari, NinetyNine"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                    placeholder="Anahtar kelimeleri virgülle ayırın"
                  />
                </div>
              </div>
            </div>

            {/* Kaydetme İşlemleri */}
            <div className="flex justify-end space-x-4">
              <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-text-light-secondary dark:text-text-secondary rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                Değişiklikleri Sıfırla
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/90"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 