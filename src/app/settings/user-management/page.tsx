'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';

// Breadcrumb Items
const BREADCRUMB_ITEMS = [
  { label: 'Ana Sayfa', href: '/dashboard' },
  { label: 'Ayarlar', href: '/settings' },
  { label: 'Kullanıcı Yönetimi', active: true }
];

export default function UserManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userSettings, setUserSettings] = useState({
    defaultRole: 'resident',
    registrationApproval: true,
    passwordResetEmail: true,
    userAccountLocking: true
  });

  const [teamSettings, setTeamSettings] = useState({
    maxAdminUsers: '5',
    roleBasedAccess: true,
    auditLogging: true,
    sessionTracking: true
  });

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleSave = () => {
    console.log('Saving user management settings...');
  };

  const handleAddUser = () => {
    console.log('Adding user:', { name: newUserName, email: newUserEmail });
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
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
            title="Kullanıcı Yönetimi" 
            breadcrumbItems={BREADCRUMB_ITEMS}
          />
          
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                  Kullanıcı Yönetimi
                </h2>
                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                  Takım üyelerini, rollerini ve erişim izinlerini yönetin
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/90"
                >
                  Yeni Kullanıcı Ekle
                </button>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-text-light-muted dark:text-text-muted">Toplam Kullanıcı</h3>
                <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">1,247</p>
                <p className="text-xs text-text-light-muted dark:text-text-muted">Geçen aydan +12%</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-text-light-muted dark:text-text-muted">Aktif Kullanıcılar</h3>
                <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">1,189</p>
                <p className="text-xs text-text-light-muted dark:text-text-muted">%95.3 aktiflik oranı</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-text-light-muted dark:text-text-muted">Yönetici Kullanıcılar</h3>
                <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">5</p>
                <p className="text-xs text-text-light-muted dark:text-text-muted">Maksimum limit: 10</p>
              </div>
            </div>

            {/* Kullanıcı Hesap Ayarları */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-6">
                Kullanıcı Hesap Ayarları
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                      Yeni Kullanıcılar İçin Varsayılan Rol
                    </label>
                    <select 
                      value={userSettings.defaultRole}
                      onChange={(e) => setUserSettings({...userSettings, defaultRole: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                    >
                      <option value="resident">Sakin</option>
                      <option value="manager">Emlak Uzmanı</option>
                      <option value="maintenance">Bakım Personeli</option>
                      <option value="admin">Yönetici</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                        Manuel Onay Gereksinimi
                      </label>
                      <p className="text-xs text-text-light-muted dark:text-text-muted">
                        Yeni kayıtlar yönetici onayı gerektirir
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={userSettings.registrationApproval}
                      onChange={(e) => setUserSettings({...userSettings, registrationApproval: e.target.checked})}
                      className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                        Şifre Sıfırlama E-postası
                      </label>
                      <p className="text-xs text-text-light-muted dark:text-text-muted">
                        Şifre değişiklikleri için e-posta bildirimi gönder
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={userSettings.passwordResetEmail}
                      onChange={(e) => setUserSettings({...userSettings, passwordResetEmail: e.target.checked})}
                      className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                        Hesap Kilitleme
                      </label>
                      <p className="text-xs text-text-light-muted dark:text-text-muted">
                        Başarısız giriş denemelerinden sonra hesapları kilitle
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={userSettings.userAccountLocking}
                      onChange={(e) => setUserSettings({...userSettings, userAccountLocking: e.target.checked})}
                      className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Takım Yönetimi Ayarları */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-6">
                Takım Yönetimi Ayarları
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                      Maksimum Yönetici Kullanıcı Sayısı
                    </label>
                    <select 
                      value={teamSettings.maxAdminUsers}
                      onChange={(e) => setTeamSettings({...teamSettings, maxAdminUsers: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                    >
                      <option value="3">3 kullanıcı</option>
                      <option value="5">5 kullanıcı</option>
                      <option value="10">10 kullanıcı</option>
                      <option value="unlimited">Sınırsız</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                        Rol Tabanlı Erişim Kontrolü
                      </label>
                      <p className="text-xs text-text-light-muted dark:text-text-muted">
                        Ayrıntılı izin sistemini etkinleştir
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={teamSettings.roleBasedAccess}
                      onChange={(e) => setTeamSettings({...teamSettings, roleBasedAccess: e.target.checked})}
                      className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                        Denetim Günlükleri
                      </label>
                      <p className="text-xs text-text-light-muted dark:text-text-muted">
                        Tüm kullanıcı eylemlerini ve değişiklikleri takip et
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={teamSettings.auditLogging}
                      onChange={(e) => setTeamSettings({...teamSettings, auditLogging: e.target.checked})}
                      className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                        Oturum İzleme
                      </label>
                      <p className="text-xs text-text-light-muted dark:text-text-muted">
                        Aktif kullanıcı oturumlarını izle
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={teamSettings.sessionTracking}
                      onChange={(e) => setTeamSettings({...teamSettings, sessionTracking: e.target.checked})}
                      className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mevcut Takım Üyeleri */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-6">
                Mevcut Takım Üyeleri
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">Ad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">E-posta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">Son Aktiflik</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-on-light dark:text-text-on-dark">Ahmet Yılmaz</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light-secondary dark:text-text-secondary">ahmet@ninetynine.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-primary-gold-light text-primary-gold rounded-full">Yönetici</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Aktif</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light-secondary dark:text-text-secondary">2 saat önce</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary-gold hover:text-primary-gold/80 mr-4">Düzenle</button>
                        <button className="text-primary-red hover:text-primary-red/80">Kaldır</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-on-light dark:text-text-on-dark">Ayşe Demir</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light-secondary dark:text-text-secondary">ayse@ninetynine.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Emlak Uzmanı</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Aktif</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light-secondary dark:text-text-secondary">1 gün önce</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary-gold hover:text-primary-gold/80 mr-4">Düzenle</button>
                        <button className="text-primary-red hover:text-primary-red/80">Kaldır</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-on-light dark:text-text-on-dark">Mehmet Öz</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light-secondary dark:text-text-secondary">mehmet@ninetynine.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Bakım</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Çevrimdışı</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light-secondary dark:text-text-secondary">3 gün önce</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary-gold hover:text-primary-gold/80 mr-4">Düzenle</button>
                        <button className="text-primary-red hover:text-primary-red/80">Kaldır</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kaydetme İşlemleri */}
            <div className="flex justify-end space-x-4">
              <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-text-light-secondary dark:text-text-secondary rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                Varsayılanlara Dön
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/90"
              >
                Değişiklikleri Kaydet
              </button>
            </div>

            {/* Kullanıcı Ekleme Modal'ı */}
            {showAddUserModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">Yeni Kullanıcı Ekle</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                        placeholder="Ad ve soyadı girin"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        E-posta Adresi
                      </label>
                      <input
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-text-on-light dark:text-text-on-dark"
                        placeholder="E-posta adresini girin"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowAddUserModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-text-light-secondary dark:text-text-secondary rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleAddUser}
                      className="px-4 py-2 bg-primary-gold text-white rounded-md hover:bg-primary-gold/90"
                    >
                      Kullanıcı Ekle
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 