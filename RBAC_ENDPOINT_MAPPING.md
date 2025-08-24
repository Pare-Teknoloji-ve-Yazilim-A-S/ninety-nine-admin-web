# NinetyNine Admin Web - RBAC Endpoint Mapping

Bu doküman, NinetyNine Admin Web uygulamasındaki her sayfa, modal ve bileşenin hangi API endpoint'lerini kullandığını detaylandırır. Bu bilgiler RBAC (Role-Based Access Control) implementasyonu için kullanılacaktır.

## 📋 Genel API Endpoint Yapısı

### Base URL
- **Base URL**: `/api/proxy`
- **API Version**: Yok (API-99CLUB uyumlu)

### Ana Endpoint Kategorileri
- **Auth**: `/auth/*`
- **Admin**: `/admin/*`
- **Mobile**: `/mobile/*`
- **User**: `/users/*`
- **Properties**: `/admin/properties/*`
- **Tickets**: `/admin/tickets/*`
- **Announcements**: `/admin/announcements/*`
- **Staff**: `/api/staff/*`
- **Billing**: `/admin/billing/*`
- **Payments**: `/admin/payments/*`

---

## 🏠 Dashboard Ana Sayfa (`/dashboard`)

### Sayfa Bileşenleri
- **DashboardHeader** - Sayfa başlığı ve navigasyon
- **TopMetricsGrid** - Üst metrik kartları
- **FinancialChart** - Finansal grafik
- **RecentTransactions** - Son işlemler
- **MaintenanceRequests** - Bakım talepleri
- **QuickActions** - Hızlı işlemler
- **OccupancyStatus** - Doluluk durumu
- **TodaysAgenda** - Günlük ajanda
- **RecentActivities** - Son aktiviteler

### Kullanılan Endpoint'ler

#### 1. Dashboard Metrikleri
```typescript
// useDashboardMetrics hook
- GET /admin/properties/count (Toplam konut sayısı)
- GET /admin/properties/assigned/count (Atanmış konut sayısı)
```

#### 2. Bakım Talepleri
```typescript
// useMaintenanceRequests hook
- GET /admin/tickets (Bakım talepleri listesi)
```

#### 3. Denetim Kayıtları
```typescript
// useAuditLogs hook
- GET /admin/logging/audit-logs (Son aktiviteler)
```

#### 4. Ticket İstatistikleri
```typescript
// useTicketStats hook
- GET /admin/tickets/monthly-stats (Aylık ticket istatistikleri)
```

#### 5. Duyuru İstatistikleri
```typescript
// useExpiringAnnouncements hook
- GET /admin/announcements/count/expiring-in-1d (Süresi dolacak duyurular)
```

#### 6. Duyuru Listesi
```typescript
// announcementService
- GET /admin/announcements/active (Aktif duyurular)
```

#### 7. Finansal Grafik
```typescript
// billingService
- GET /admin/billing/dues/monthly-paid-totals/{year} (Aylık aidat tahsilat toplamları - FinancialChart)
// Required Permission: billing:stats:read
```

### Modal'lar
- **Day Events Modal** - Günlük etkinlikler detayı

---

## 🎫 Hizmet Talepleri (`/dashboard/requests`)

### Ana Sayfa Bileşenleri
- **RequestsPageHeader** - Sayfa başlığı
- **RequestsSummaryStats** - Özet istatistikler
- **RequestsQuickStats** - Hızlı istatistikler
- **RequestsFiltersBar** - Filtre çubuğu
- **RequestsGridView** - Grid görünümü
- **RequestsBulkActionsBar** - Toplu işlemler

### Alt Sayfalar
- **Bekleyen Talepler** (`/dashboard/requests/waiting`)
- **Çözümlenen Talepler** (`/dashboard/requests/resolved`)

### Kullanılan Endpoint'ler

#### 1. Ticket Listesi
```typescript
// ticketService
- GET /admin/tickets (Ana ticket listesi)
- GET /admin/tickets/user/{userId} (Kullanıcıya ait ticket'lar)
```

#### 2. Ticket İstatistikleri
```typescript
// useTicketSummary hook
- GET /admin/tickets/summary (Ticket özet istatistikleri)
```

#### 3. Ticket CRUD İşlemleri
```typescript
// ticketService
- POST /admin/tickets (Yeni ticket oluştur)
- GET /admin/tickets/{id} (Ticket detayı)
- PUT /admin/tickets/{id} (Ticket güncelle)
- DELETE /admin/tickets/{id} (Ticket sil)
```

#### 4. Ticket Durum Güncellemeleri
```typescript
// ticketService
- PUT /admin/tickets/{id}/start-progress (İşleme başla)
- PUT /admin/tickets/{id}/mark-waiting (Beklemede işaretle)
- PUT /admin/tickets/{id}/resolve (Çözüldü işaretle)
- PUT /admin/tickets/{id}/close (Kapat)
- PUT /admin/tickets/{id}/cancel (İptal et)
```

#### 5. Ticket Yorumları
```typescript
// ticketService
- GET /admin/tickets/{id}/comments (Yorumları getir)
- POST /admin/tickets/{id}/comments (Yorum ekle)
```

#### 6. Ticket Ekleri
```typescript
// ticketService
- GET /admin/tickets/{id}/attachments (Ekleri getir)
- POST /admin/tickets/{id}/attachments (Ek ekle)
```

### Modal'lar
- **RequestDetailModal** - Ticket detay modal'ı
- **CreateTicketModal** - Yeni ticket oluşturma modal'ı
- **ConfirmationModal** - Onay modal'ı (silme işlemleri için)

---

## 👥 Personel Yönetimi (`/dashboard/staff`)

### Ana Sayfa Bileşenleri
- **PageHeader** - Sayfa başlığı
- **QuickStats** - Hızlı istatistikler
- **SearchAndFilters** - Arama ve filtreler
- **QuickFilters** - Hızlı filtreler
- **FilterDrawer** - Gelişmiş filtre çekmecesi
- **ContentArea** - İçerik alanı

### Kullanılan Endpoint'ler

#### 1. Personel Listesi
```typescript
// staffService
- GET /api/staff (Personel listesi)
- GET /api/staff/{id} (Personel detayı)
```

#### 2. Personel İstatistikleri
```typescript
// staffService
- GET /api/staff/stats (Personel istatistikleri)
```

#### 3. Personel CRUD İşlemleri
```typescript
// staffService
- POST /api/staff (Yeni personel oluştur)
- PUT /api/staff/{id} (Personel güncelle)
- DELETE /api/staff/{id} (Personel sil)
```

#### 4. Personel Profil İşlemleri
```typescript
// staffService
- PUT /api/staff/{id}/profile (Profil güncelle)
- PUT /api/staff/{id}/status (Durum güncelle)
```

#### 5. Departman İşlemleri
```typescript
// staffService
- GET /api/staff/departments (Departman listesi)
- POST /api/staff/departments (Departman oluştur)
- PUT /api/staff/departments/{id} (Departman güncelle)
- DELETE /api/staff/departments/{id} (Departman sil)
- POST /api/staff/assign-department (Departmana ata)
```

#### 6. Pozisyon İşlemleri
```typescript
// staffService
- GET /api/staff/positions (Pozisyon listesi)
- POST /api/staff/positions (Pozisyon oluştur)
- PUT /api/staff/positions/{id} (Pozisyon güncelle)
- DELETE /api/staff/positions/{id} (Pozisyon sil)
- POST /api/staff/assign-position (Pozisyona ata)
```

#### 7. Toplu İşlemler
```typescript
// staffService
- POST /api/staff/bulk-update-status (Toplu durum güncelle)
- POST /api/staff/bulk-assign-department (Toplu departman ata)
- POST /api/staff/bulk-delete (Toplu sil)
```

#### 8. İçe/Dışa Aktarma
```typescript
// staffService
- GET /api/staff/export (Dışa aktar)
- POST /api/staff/import (İçe aktar)
```

### Modal'lar
- **StaffFormModal** - Personel oluşturma/düzenleme modal'ı
- **ImportFileInput** - Dosya içe aktarma modal'ı

---

## 🏘️ Sakin Listesi (`/dashboard/residents`)

### Ana Sayfa Bileşenleri
- **GenericListView** - Liste görünümü
- **GenericGridView** - Grid görünümü
- **BulkActionsBar** - Toplu işlemler
- **FilterPanel** - Filtre paneli
- **StatsCard** - İstatistik kartları

### Alt Sayfalar
- **Bekleyen Sakinler** (`/dashboard/residents/pending`)

### Kullanılan Endpoint'ler

#### 1. Sakin Listesi
```typescript
// residentService
- GET /admin/users (Sakin listesi)
- GET /admin/users/{id} (Sakin detayı)
```

#### 2. Sakin İstatistikleri
```typescript
// residentService
- GET /admin/users/stats (Sakin istatistikleri)
```

#### 3. Sakin CRUD İşlemleri
```typescript
// adminResidentService
- POST /admin/users (Yeni sakin oluştur)
- PUT /admin/users/{id} (Sakin güncelle)
- DELETE /admin/users/{id} (Sakin sil)
```

#### 4. Sakin Onay İşlemleri
```typescript
// adminResidentService
- GET /admin/users/pending-verification (Bekleyen onaylar)
- PUT /admin/users/{id}/approve (Sakin onayla)
```

#### 5. Toplu İşlemler
```typescript
// adminResidentService
- POST /admin/users/bulk-action (Toplu işlemler)
- POST /admin/users/bulk-activate (Toplu aktifleştir)
- POST /admin/users/bulk-deactivate (Toplu deaktifleştir)
```

#### 6. Belge İşlemleri
```typescript
// adminResidentService
- GET /admin/users/{id}/documents/national_id (Kimlik belgesi)
- GET /admin/users/{id}/documents/ownership_document (Mülkiyet belgesi)
- POST /admin/users/{id}/documents/national_id/upload (Kimlik yükle)
- POST /admin/users/{id}/documents/ownership_document/upload (Mülkiyet belgesi yükle)
```

#### 7. Fatura İşlemleri
```typescript
// billingService
- GET /admin/billing/user/{userId} (Kullanıcı faturaları)
```

### Modal'lar
- **BulkMessageModal** - Toplu mesaj modal'ı
- **ConfirmationModal** - Onay modal'ı
- **PaymentHistoryModal** - Ödeme geçmişi modal'ı

---

## 📢 Duyuru Listesi (`/dashboard/announcements`)

### Ana Sayfa Bileşenleri
- **GenericListView** - Liste görünümü
- **GenericGridView** - Grid görünümü
- **BulkActionsBar** - Toplu işlemler
- **FilterPanel** - Filtre paneli
- **StatsCard** - İstatistik kartları

### Alt Sayfalar
- **Duyuru Ekle** (`/dashboard/announcements/add`)
- **Duyuru Düzenle** (`/dashboard/announcements/[id]/edit`)

### Kullanılan Endpoint'ler

#### 1. Duyuru Listesi
```typescript
// announcementService
- GET /admin/announcements (Duyuru listesi)
- GET /admin/announcements/{id} (Duyuru detayı)
```

#### 2. Duyuru CRUD İşlemleri
```typescript
// announcementService
- POST /admin/announcements (Yeni duyuru oluştur)
- PUT /admin/announcements/{id} (Duyuru güncelle)
- DELETE /admin/announcements/{id} (Duyuru sil)
```

#### 3. Duyuru Durum İşlemleri
```typescript
// announcementService
- PUT /admin/announcements/{id}/publish (Yayınla)
- PUT /admin/announcements/{id}/archive (Arşivle)
```

#### 4. Duyuru Filtreleme
```typescript
// announcementService
- GET /admin/announcements/active (Aktif duyurular)
- GET /admin/announcements/expired (Süresi dolmuş duyurular)
- GET /admin/announcements/emergency (Acil duyurular)
- GET /admin/announcements/status/{status} (Duruma göre)
- GET /admin/announcements/property/{propertyId} (Konuta göre)
- GET /admin/announcements/user/{userId} (Kullanıcıya göre)
```

#### 5. Toplu İşlemler
```typescript
// announcementService
- POST /admin/announcements/bulk-action (Toplu işlemler)
```

#### 6. Medya İşlemleri
```typescript
// announcementService
- POST /admin/announcements/{id}/upload-image (Resim yükle)
```

#### 7. İstatistikler
```typescript
// announcementService
- GET /admin/announcements/stats (Duyuru istatistikleri)
```

### Modal'lar
- **ConfirmationModal** - Onay modal'ı (silme işlemleri için)

---

## 🏢 Konut Yönetimi (`/dashboard/units`)

### Ana Sayfa Bileşenleri
- **UnitsQuickStats** - Hızlı istatistikler
- **UnitsFilters** - Filtreler
- **UnitsAnalytics** - Analitik
- **GenericListView** - Liste görünümü
- **GenericGridView** - Grid görünümü

### Alt Sayfalar
- **Konut Detayı** (`/dashboard/units/[id]`)
- **Konut Ekle** (`/dashboard/units/add`)
- **Bakım** (`/dashboard/units/maintenance`)

### Kullanılan Endpoint'ler

#### 1. Konut Listesi
```typescript
// unitsService
- GET /admin/properties (Konut listesi)
- GET /admin/properties/{id} (Konut detayı)
```

#### 2. Konut CRUD İşlemleri
```typescript
// unitsService
- POST /admin/properties (Yeni konut oluştur)
- PUT /admin/properties/{id} (Konut güncelle)
- DELETE /admin/properties/{id} (Konut sil)
```

#### 3. Konut İstatistikleri
```typescript
// unitsService
- GET /admin/properties/statistics (Konut istatistikleri)
- GET /admin/properties/occupancy-stats (Doluluk istatistikleri)
- GET /admin/properties/quick-stats (Hızlı istatistikler)
```

#### 4. Konut Filtreleme
```typescript
// unitsService
- GET /admin/properties/search (Arama)
- GET /admin/properties/by-status (Duruma göre)
- GET /admin/properties/by-block/{blockNumber} (Bloka göre)
- GET /admin/properties/owner/{ownerId} (Malike göre)
- GET /admin/properties/by-tenant (Kiracıya göre)
```

#### 5. Konut Sayıları
```typescript
// unitsService
- GET /admin/properties/residence/count (Daire sayısı)
- GET /admin/properties/villa/count (Villa sayısı)
- GET /admin/properties/available/count (Müsait sayısı)
- GET /admin/properties/count (Toplam sayı)
- GET /admin/properties/assigned/count (Atanmış sayı)
```

#### 6. Bakım İşlemleri
```typescript
// unitsService
- PUT /admin/properties/{id}/maintenance (Bakıma al)
- PUT /admin/properties/{id}/maintenance (Bakımı tamamla)
```

#### 7. Toplu İşlemler
```typescript
// unitsService
- POST /admin/properties/bulk-update (Toplu güncelle)
- POST /admin/properties/bulk-assign-tenants (Toplu kiracı ata)
```

#### 8. İçe/Dışa Aktarma
```typescript
// unitsService
- GET /admin/properties/export (Dışa aktar)
- POST /admin/properties/import (İçe aktar)
```

### Modal'lar
- **AddTenantModal** - Kiracı ekleme modal'ı
- **AddOwnerModal** - Malik ekleme modal'ı
- **ConfirmationModal** - Onay modal'ı

---

## 💰 Finansal İşlemler (`/dashboard/financial`)

### Ana Sayfa Bileşenleri
- **GenericListView** - Liste görünümü
- **GenericGridView** - Grid görünümü
- **BulkActionsBar** - Toplu işlemler
- **FilterPanel** - Filtre paneli
- **StatsCard** - İstatistik kartları

### Alt Sayfalar
- **İşlem Detayı** (`/dashboard/financial/[id]`)
- **Fatura Oluştur** (`/dashboard/financial/create/bill`)
- **Ödeme Oluştur** (`/dashboard/financial/create/payment`)

### Kullanılan Endpoint'ler

#### 1. Fatura İşlemleri
```typescript
// billingService
- GET /admin/billing (Fatura listesi)
- GET /admin/billing/{id} (Fatura detayı)
- POST /admin/billing (Yeni fatura oluştur)
- PUT /admin/billing/{id} (Fatura güncelle)
- DELETE /admin/billing/{id} (Fatura sil)
```

#### 2. Fatura Filtreleme
```typescript
// billingService
- GET /admin/billing/pending (Bekleyen faturalar)
- GET /admin/billing/overdue (Vadesi geçen faturalar)
- GET /admin/billing/property/{propertyId} (Konuta göre)
```

#### 3. Borç Özeti
```typescript
// billingService
- GET /admin/billing/debt-summary (Borç özeti)
```

#### 4. Aidat İstatistikleri
```typescript
// billingService
- GET /admin/billing/dues/monthly-paid-totals/{year} (Aylık aidat tahsilat toplamları)
// Required Permission: billing:stats:read
```

#### 4. Ödeme İşlemleri
```typescript
// paymentService
- GET /admin/payments (Ödeme listesi)
- GET /admin/payments/{id} (Ödeme detayı)
- POST /admin/payments (Yeni ödeme oluştur)
- PUT /admin/payments/{id} (Ödeme güncelle)
- DELETE /admin/payments/{id} (Ödeme sil)
```

#### 5. Ödeme Filtreleme
```typescript
// paymentService
- GET /admin/payments/pending (Bekleyen ödemeler)
- GET /admin/payments/date-range (Tarih aralığına göre)
```

#### 6. Birim Fiyatları
```typescript
// unitPricesService
- GET /unit-prices (Birim fiyat listesi)
- GET /admin/unit-prices (Admin birim fiyatları)
- POST /unit-prices (Yeni birim fiyat oluştur)
- PUT /unit-prices/{id} (Birim fiyat güncelle)
- DELETE /unit-prices/{id} (Birim fiyat sil)
```

### Modal'lar
- **CreateBillForm** - Fatura oluşturma modal'ı
- **CreatePaymentForm** - Ödeme oluşturma modal'ı
- **TransactionTypeSelector** - İşlem tipi seçici modal'ı

---

## ⚙️ Sistem Ayarları (`/dashboard/settings`)

### Ana Sayfa Bileşenleri
- **RolePermissionsModal** - Rol izinleri modal'ı
- **FilterPanel** - Filtre paneli
- **DataTable** - Veri tablosu

### Kullanılan Endpoint'ler

#### 1. Rol İşlemleri
```typescript
// roleService
- GET /admin/roles (Rol listesi)
- GET /admin/roles/{id} (Rol detayı)
- POST /admin/roles (Yeni rol oluştur)
- PUT /admin/roles/{id} (Rol güncelle)
- DELETE /admin/roles/{id} (Rol sil)
```

#### 2. İzin İşlemleri
```typescript
// permissionService
- GET /admin/permissions (İzin listesi)
- GET /admin/permissions/{id} (İzin detayı)
- POST /admin/permissions (Yeni izin oluştur)
- PUT /admin/permissions/{id} (İzin güncelle)
- DELETE /admin/permissions/{id} (İzin sil)
```

#### 3. Rol-İzin İlişkileri
```typescript
// rolePermissionService
- GET /admin/roles/{id}/permissions (Rol izinleri)
- POST /admin/roles/{id}/permissions/assign (İzin ata)
- DELETE /admin/roles/{id}/permissions/remove (İzin kaldır)
- PUT /admin/roles/{id}/permissions/update (İzinleri güncelle)
```

#### 4. Sistem Konfigürasyonları
```typescript
// adminService
- GET /admin/configs (Sistem konfigürasyonları)
```

#### 5. Denetim Kayıtları
```typescript
// loggingService
- GET /admin/logging/audit-logs (Denetim kayıtları)
```

### Modal'lar
- **RolePermissionsModal** - Rol izinleri yönetimi modal'ı
- **ConfirmationModal** - Onay modal'ı

---

## 🔐 Kimlik Doğrulama ve Kullanıcı Yönetimi

### Kullanılan Endpoint'ler

#### 1. Kimlik Doğrulama
```typescript
// authService
- POST /auth/login-v2 (Giriş)
- POST /auth/logout (Çıkış)
- POST /auth/refresh-token (Token yenile)
- POST /auth/register (Kayıt)
- GET /auth/me-v2 (Kullanıcı bilgileri)
```

#### 2. Kullanıcı Profili
```typescript
// userService
- GET /users/me (Profil bilgileri)
- PUT /users/me (Profil güncelle)
- POST /users/me/avatar (Avatar yükle)
- DELETE /users/me/avatar (Avatar sil)
- PUT /users/me/password (Şifre değiştir)
- PUT /users/me/settings (Ayarları güncelle)
```

#### 3. Admin Kullanıcı Yönetimi
```typescript
// adminService
- GET /admin/users (Kullanıcı listesi)
- GET /admin/users/admin-staff (Admin personel)
- GET /admin/users/admin-staff-count (Admin personel sayısı)
- GET /admin/users/gold-residents/count (Altın sakin sayısı)
- GET /admin/users/active-residents/count (Aktif sakin sayısı)
- GET /admin/users/active-users/count (Aktif kullanıcı sayısı)
- GET /admin/users/tenants/count (Kiracı sayısı)
- GET /admin/users/owners/count (Malik sayısı)
- GET /admin/users/active-approved-residents (Aktif onaylı sakinler)
```

---

## 📁 Dosya Yönetimi

### Kullanılan Endpoint'ler

#### 1. Dosya Yükleme
```typescript
// fileUploadService
- POST /admin/files/upload (Dosya yükle)
```

#### 2. QR Kod
```typescript
// qrCodeService
- GET /qr/generate (QR kod oluştur)
```

---

## 🌐 Çoklu Dil Desteği

### Kullanılan Endpoint'ler

#### 1. Dil Yönetimi
```typescript
// i18n endpoints
- GET /admin/i18n/locales (Desteklenen diller)
- GET /admin/i18n/translations (Çeviriler)
```

---

## 📊 RBAC İzin Matrisi

### Sayfa Bazlı İzinler

| Sayfa | Endpoint Kategorisi | Gerekli İzinler |
|-------|-------------------|-----------------|
| Dashboard | Dashboard, Billing | `dashboard:read`, `billing:stats:read` |
| Hizmet Talepleri | Tickets | `tickets:read`, `tickets:write`, `tickets:delete` |
| Personel Yönetimi | Staff | `staff:read`, `staff:write`, `staff:delete` |
| Sakin Listesi | Residents | `residents:read`, `residents:write`, `residents:delete` |
| Duyuru Listesi | Announcements | `announcements:read`, `announcements:write`, `announcements:delete` |
| Konut Yönetimi | Properties | `properties:read`, `properties:write`, `properties:delete` |
| Finansal İşlemler | Billing, Payments | `billing:read`, `billing:write`, `billing:stats:read`, `payments:read`, `payments:write` |
| Sistem Ayarları | Roles, Permissions | `roles:read`, `roles:write`, `permissions:read`, `permissions:write` |

### Modal Bazlı İzinler

| Modal | Endpoint Kategorisi | Gerekli İzinler |
|-------|-------------------|-----------------|
| CreateTicketModal | Tickets | `tickets:write` |
| StaffFormModal | Staff | `staff:write` |
| BulkMessageModal | Residents | `residents:write` |
| CreateBillForm | Billing | `billing:write` |
| CreatePaymentForm | Payments | `payments:write` |
| RolePermissionsModal | Roles, Permissions | `roles:write`, `permissions:read` |

### Bileşen Bazlı İzinler

| Bileşen | Endpoint Kategorisi | Gerekli İzinler |
|---------|-------------------|-----------------|
| BulkActionsBar | Various | İlgili modülün `write` izni |
| ExportDropdown | Various | İlgili modülün `read` izni |
| FilterPanel | Various | İlgili modülün `read` izni |
| StatsCard | Various | İlgili modülün `read` izni |

---

## 🔧 RBAC Implementasyon Önerileri

### 1. İzin Kontrolü Middleware
```typescript
// Her API çağrısında izin kontrolü
const checkPermission = (requiredPermission: string) => {
  const userPermissions = getUserPermissions();
  return userPermissions.includes(requiredPermission);
};
```

### 2. Sayfa Erişim Kontrolü
```typescript
// Sayfa bazlı erişim kontrolü
const PageAccessControl = ({ requiredPermissions, children }) => {
  const hasAccess = checkPermissions(requiredPermissions);
  return hasAccess ? children : <AccessDenied />;
};
```

### 3. Bileşen Erişim Kontrolü
```typescript
// Bileşen bazlı erişim kontrolü
const ComponentAccessControl = ({ permission, children }) => {
  const hasPermission = checkPermission(permission);
  return hasPermission ? children : null;
};
```

### 4. API Endpoint Güvenliği
```typescript
// Backend'de endpoint güvenliği
@UseGuards(PermissionGuard)
@RequirePermissions(['tickets:read'])
@Get()
async getTickets() {
  // Implementation
}
```

---

## 📝 Notlar

1. **Endpoint Güvenliği**: Tüm endpoint'ler backend'de RBAC ile korunmalıdır
2. **Frontend Kontrolü**: Frontend'de sadece UI gizleme yapılmalı, güvenlik backend'de olmalı
3. **İzin Hiyerarşisi**: İzinler modül bazında organize edilmelidir
4. **Audit Logging**: Tüm işlemler loglanmalıdır
5. **Token Yönetimi**: JWT token'ları güvenli şekilde yönetilmelidir

Bu doküman, RBAC implementasyonu için gerekli tüm endpoint ve izin bilgilerini içermektedir. Her yeni özellik eklendiğinde bu doküman güncellenmelidir.
