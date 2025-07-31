'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';

// Breadcrumb Items
const BREADCRUMB_ITEMS = [
  { label: 'Ana Sayfa', href: '/dashboard' },
  { label: 'Ayarlar', href: '/settings' },
  { label: 'Sistem Ayarları', active: true }
];

export default function SystemSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@ninetynine.com',
    smtpPassword: '',
    fromEmail: 'noreply@ninetynine.com',
    fromName: 'NinetyNine Property Management'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: '60',
    passwordExpiry: '90',
    maxLoginAttempts: '5'
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: 'daily',
    time: '02:00',
    retention: '30'
  });

  const handleTestEmail = () => {
    console.log('Testing email settings...');
  };

  const handleBackupNow = () => {
    console.log('Starting backup...');
  };

  const handleSave = () => {
    console.log('Saving settings...');
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
            title="Sistem Ayarları" 
            breadcrumbItems={BREADCRUMB_ITEMS}
          />
          
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                  Sistem Ayarları
                </h2>
                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                  Sistem genelindeki ayarları, entegrasyonları ve bakımı yapılandırın
                </p>
              </div>
              
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-text-light-secondary dark:text-text-secondary rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  Ayarları Dışa Aktar
                </button>
                <button className="px-4 py-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/90">
                  Tümünü Senkronize Et
                </button>
              </div>
            </div>

            {/* Sistem Genel Bakış */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-gold-light rounded-lg flex items-center justify-center">
                      <span className="text-primary-gold font-semibold">v</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-text-light-muted dark:text-text-muted">Sürüm</h3>
                    <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">2.1.3</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-text-light-muted dark:text-text-muted">Durum</h3>
                    <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">Sağlıklı</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">💾</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-text-light-muted dark:text-text-muted">Depolama</h3>
                    <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">%47</p>
                    <p className="text-xs text-text-light-muted dark:text-text-muted">234 GB / 500 GB</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">⏱</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-text-light-muted dark:text-text-muted">Çalışma Süresi</h3>
                    <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">45g</p>
                    <p className="text-xs text-text-light-muted dark:text-text-muted">12s 34d</p>
                  </div>
                </div>
              </div>
            </div>

            {/* E-posta Yapılandırması */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
                    E-posta Yapılandırması
                  </h2>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                    Sistem e-postaları için SMTP ayarlarını yapılandırın
                  </p>
                </div>
                <button 
                  onClick={handleTestEmail}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-text-light-secondary dark:text-text-secondary rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Bağlantıyı Test Et
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                      SMTP Sunucusu
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtpHost}
                      onChange={(e: any) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        SMTP Portu
                      </label>
                      <input
                        type="text"
                        value={emailSettings.smtpPort}
                        onChange={(e: any) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                        placeholder="587"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Güvenlik
                      </label>
                      <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors">
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                        <option value="none">Hiçbiri</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                      Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtpUser}
                      onChange={(e: any) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                      Şifre
                    </label>
                    <input
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e: any) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                      placeholder="••••••••••"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Gönderen E-posta
                      </label>
                      <input
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e: any) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Gönderen Adı
                      </label>
                      <input
                        type="text"
                        value={emailSettings.fromName}
                        onChange={(e: any) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Güvenlik ve Yedekleme Ayarları */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Güvenlik Ayarları */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
                    Güvenlik Ayarları
                  </h2>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                    Kimlik doğrulama ve erişim kontrollerini yapılandırın
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                        İki Faktörlü Kimlik Doğrulama
                      </label>
                      <p className="text-xs text-text-light-muted dark:text-text-muted">
                        Yönetici kullanıcılar için 2FA gerektirir
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e: any) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                      Oturum Zaman Aşımı
                    </label>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e: any) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    >
                      <option value="30">30 dakika</option>
                      <option value="60">1 saat</option>
                      <option value="120">2 saat</option>
                      <option value="480">8 saat</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                      Şifre Geçerlilik Süresi
                    </label>
                    <select
                      value={securitySettings.passwordExpiry}
                      onChange={(e: any) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    >
                      <option value="30">30 gün</option>
                      <option value="60">60 gün</option>
                      <option value="90">90 gün</option>
                      <option value="365">1 yıl</option>
                      <option value="never">Hiçbir zaman</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                      Maksimum Giriş Denemesi
                    </label>
                    <select
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e: any) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    >
                      <option value="3">3 deneme</option>
                      <option value="5">5 deneme</option>
                      <option value="10">10 deneme</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Yedekleme Ayarları */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
                      Yedekleme Ayarları
                    </h2>
                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                      Otomatik yedeklemeleri ve saklama süresini yapılandırın
                    </p>
                  </div>
                  <button 
                    onClick={handleBackupNow}
                    className="px-4 py-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/90 transition-colors"
                  >
                    Şimdi Yedekle
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                        Otomatik Yedekleme
                      </label>
                      <p className="text-xs text-text-light-muted dark:text-text-muted">
                        Zamanlanmış yedeklemeleri etkinleştir
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={backupSettings.autoBackup}
                      onChange={(e: any) => setBackupSettings({...backupSettings, autoBackup: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                      Yedekleme Sıklığı
                    </label>
                    <select 
                      value={backupSettings.frequency}
                      onChange={(e: any) => setBackupSettings({...backupSettings, frequency: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    >
                      <option value="hourly">Saatlik</option>
                      <option value="daily">Günlük</option>
                      <option value="weekly">Haftalık</option>
                      <option value="monthly">Aylık</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                      Yedekleme Zamanı
                    </label>
                    <input
                      type="time"
                      value={backupSettings.time}
                      onChange={(e: any) => setBackupSettings({...backupSettings, time: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                      Saklama Süresi
                    </label>
                    <select 
                      value={backupSettings.retention}
                      onChange={(e: any) => setBackupSettings({...backupSettings, retention: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold focus:border-primary-gold transition-colors"
                    >
                      <option value="7">7 gün</option>
                      <option value="30">30 gün</option>
                      <option value="90">90 gün</option>
                      <option value="365">1 yıl</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Entegrasyonlar */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
                  Üçüncü Taraf Entegrasyonlar
                </h2>
                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                  Harici hizmetlere bağlantıları yönetin
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-primary-gold transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">💳</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-text-on-light dark:text-text-on-dark">Ödeme Geçidi</h3>
                        <p className="text-sm text-text-light-secondary dark:text-text-secondary">Stripe</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Bağlı
                      </span>
                      <button className="p-1 text-gray-400 hover:text-primary-gold transition-colors">
                        ⚙️
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-primary-gold transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-semibold">📧</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-text-on-light dark:text-text-on-dark">E-posta Servisi</h3>
                        <p className="text-sm text-text-light-secondary dark:text-text-secondary">SendGrid</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Bağlı
                      </span>
                      <button className="p-1 text-gray-400 hover:text-primary-gold transition-colors">
                        ⚙️
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-primary-gold transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">📱</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-text-on-light dark:text-text-on-dark">SMS Sağlayıcısı</h3>
                        <p className="text-sm text-text-light-secondary dark:text-text-secondary">Twilio</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Bağlı
                      </span>
                      <button className="p-1 text-gray-400 hover:text-primary-gold transition-colors">
                        ⚙️
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-primary-gold transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">☁️</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-text-on-light dark:text-text-on-dark">Bulut Depolama</h3>
                        <p className="text-sm text-text-light-secondary dark:text-text-secondary">AWS S3</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Bağlantı Kesildi
                      </span>
                      <button className="p-1 text-gray-400 hover:text-primary-gold transition-colors">
                        ⚙️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kaydetme İşlemleri */}
            <div className="flex justify-end space-x-4">
              <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-text-light-secondary dark:text-text-secondary rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Varsayılanlara Dön
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/90 transition-colors shadow-md"
              >
                Tüm Ayarları Kaydet
              </button>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 