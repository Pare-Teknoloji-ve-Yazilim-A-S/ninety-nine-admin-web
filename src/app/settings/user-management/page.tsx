'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import { userService } from '@/services';
import { User } from '@/services/types/user.types';

// Admin Staff API response interface
interface AdminStaffUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BANNED';
  verificationStatus?: string;
  role: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// API Response wrapper
interface AdminStaffResponse {
  data: AdminStaffUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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
  
  // Admin Staff State
  const [adminStaff, setAdminStaff] = useState<AdminStaffUser[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Sayfa başına 5 item
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Total User Count State
  const [totalUserCount, setTotalUserCount] = useState<number>(0);
  const [userCountLoading, setUserCountLoading] = useState(true);

  // Debug state changes
  console.log('Current component state:', { adminStaff, pagination, loading, error });

  // Fetch admin staff function
  const fetchAdminStaff = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.getAdminStaff(page, pageSize);
      console.log('Admin staff response:', response);
      console.log('Response type:', typeof response);
      console.log('Is array:', Array.isArray(response));
      
      if (response && response.data) {
        // Response'da data array'i var
        console.log('Staff data from response.data:', response.data);
        console.log('Pagination info:', response.pagination);
        setAdminStaff(response.data);
        setPagination(response.pagination);
        setCurrentPage(page);
        setError(null); // Clear any previous error
      } else if (response) {
        // Fallback: direkt response
        const staffData = Array.isArray(response) ? response : [response];
        console.log('Staff data after processing (fallback):', staffData);
        setAdminStaff(staffData);
        setError(null);
      } else {
        console.log('No response received');
        setError('Admin staff verisi alınamadı');
      }
    } catch (err: any) {
      console.error('Error fetching admin staff:', err);
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Fetch total user count function
  const fetchTotalUserCount = async () => {
    try {
      setUserCountLoading(true);
      const response = await userService.getAdminStaffCount();
      console.log('Total user count response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));
      console.log('Response.data:', response?.data);
      console.log('Response.data type:', typeof response?.data);
      
      // API'den gelen response'u kontrol et
      let count = 0;
      if (response && typeof response === 'object') {
        // Eğer response.data sayı ise
        if (typeof response.data === 'number') {
          count = response.data;
        }
        // Eğer response.data object ise ve count property'si varsa
        else if (response.data && typeof response.data === 'object' && 'count' in response.data) {
          count = response.data.count;
        }
        // Eğer response direkt sayı ise
        else if (typeof response === 'number') {
          count = response;
        }
        // Eğer response'da count property'si varsa
        else if ('count' in response) {
          count = response.count;
        }
      }
      
      console.log('Final count value:', count);
      setTotalUserCount(count);
    } catch (error) {
      console.error('Failed to fetch total user count:', error);
      setTotalUserCount(0);
    } finally {
      setUserCountLoading(false);
    }
  };

  // Fetch admin staff on component mount
  useEffect(() => {
    fetchAdminStaff(currentPage);
    fetchTotalUserCount();
  }, []);

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
                {userCountLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-gold"></div>
                ) : (
                  <p className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                    {Number(totalUserCount || 0).toLocaleString()}
                  </p>
                )}
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
                      onChange={(e: any) => setUserSettings({...userSettings, defaultRole: e.target.value})}
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
                      onChange={(e: any) => setUserSettings({...userSettings, registrationApproval: e.target.checked})}
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
                      onChange={(e: any) => setUserSettings({...userSettings, passwordResetEmail: e.target.checked})}
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
                      onChange={(e: any) => setUserSettings({...userSettings, userAccountLocking: e.target.checked})}
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
                      onChange={(e: any) => setTeamSettings({...teamSettings, maxAdminUsers: e.target.value})}
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
                      onChange={(e: any) => setTeamSettings({...teamSettings, roleBasedAccess: e.target.checked})}
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
                      onChange={(e: any) => setTeamSettings({...teamSettings, auditLogging: e.target.checked})}
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
                      onChange={(e: any) => setTeamSettings({...teamSettings, sessionTracking: e.target.checked})}
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

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <div className="flex items-center space-x-2 text-text-light-secondary dark:text-text-secondary">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-gold"></div>
                    <span>Admin staff verileri yükleniyor...</span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
                  <div className="text-red-800 dark:text-red-200 text-sm">
                    <strong>Hata:</strong> {error}
                  </div>
                </div>
              )}

              {/* Table with API Data */}
              {!loading && !error && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">Ad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">E-posta</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">Rol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">Telefon</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                      {(() => {
                        console.log('Rendering table with adminStaff:', adminStaff);
                        console.log('adminStaff length:', adminStaff.length);
                        return null;
                      })()}
                      {adminStaff.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-text-light-secondary dark:text-text-secondary">
                            Henüz admin staff üyesi bulunmuyor.
                          </td>
                        </tr>
                      ) : (
                        adminStaff.map((user) => {
                          console.log('Rendering user:', user);
                          return (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-on-light dark:text-text-on-dark">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light-secondary dark:text-text-secondary">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.role?.slug === 'admin' 
                                  ? 'bg-primary-gold-light text-primary-gold'
                                  : user.role?.slug === 'super_admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role?.name || 'Belirtilmemiş'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.status === 'ACTIVE' 
                                  ? 'bg-green-100 text-green-800'
                                  : user.status === 'INACTIVE'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : user.status === 'BANNED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.status === 'ACTIVE' ? 'Aktif' :
                                 user.status === 'INACTIVE' ? 'Pasif' :
                                 user.status === 'BANNED' ? 'Engellenmiş' :
                                 user.status === 'PENDING' ? 'Beklemede' :
                                 user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light-secondary dark:text-text-secondary">
                              {user.phone || 'Belirtilmemiş'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button className="text-primary-gold hover:text-primary-gold/80 mr-4">
                                Düzenle
                              </button>
                              <button className="text-primary-red hover:text-primary-red/80">
                                Kaldır
                              </button>
                            </td>
                          </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {pagination && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-600 pt-4">
                  {/* Pagination Info */}
                  <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                    <span>Toplam </span>
                    <span className="font-medium text-text-on-light dark:text-text-on-dark">{pagination.total}</span>
                    <span> takım üyesi</span>
                  </div>

                  {/* Pagination Buttons - Her zaman göster */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => fetchAdminStaff(currentPage - 1)}
                      disabled={currentPage <= 1 || loading || (pagination?.total || 0) <= 5}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage <= 1 || loading || (pagination?.total || 0) <= 5
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                          : 'bg-white text-text-on-light border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-text-on-dark dark:border-gray-600 dark:hover:bg-gray-700'
                      }`}
                    >
                      ← Önceki
                    </button>

                    {/* Page Numbers - Sadece birden fazla sayfa varsa */}
                    {pagination?.totalPages > 1 && (
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => fetchAdminStaff(pageNum)}
                            disabled={loading}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-primary-gold text-white shadow-sm'
                                : loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                : 'bg-white text-text-on-light border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-text-on-dark dark:border-gray-600 dark:hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Next Button */}
                    <button
                      onClick={() => fetchAdminStaff(currentPage + 1)}
                      disabled={currentPage >= (pagination?.totalPages || 1) || loading || (pagination?.total || 0) <= 5}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage >= (pagination?.totalPages || 1) || loading || (pagination?.total || 0) <= 5
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                          : 'bg-white text-text-on-light border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-text-on-dark dark:border-gray-600 dark:hover:bg-gray-700'
                      }`}
                    >
                      Sonraki →
                    </button>
                  </div>
                </div>
              )}

              {/* Simple Info for Single Page - Removed, artık yukarıda her zaman gösteriyoruz */}
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
                        onChange={(e: any) => setNewUserName(e.target.value)}
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
                        onChange={(e: any) => setNewUserEmail(e.target.value)}
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