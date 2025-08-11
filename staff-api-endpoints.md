# Staff Modülü API Endpointleri

Bu dokümanda `src/app/dashboard/staff` modülü için gerekli tüm API endpointleri detaylandırılmıştır.

## 📋 İçindekiler

1. [Temel CRUD İşlemleri](#temel-crud-işlemleri)
2. [Arama ve Filtreleme](#arama-ve-filtreleme)
3. [Toplu İşlemler](#toplu-işlemler)
4. [İstatistikler](#istatistikler)
5. [Departman Yönetimi](#departman-yönetimi)
6. [Pozisyon Yönetimi](#pozisyon-yönetimi)
7. [Hiyerarşi ve Yönetici İlişkileri](#hiyerarşi-ve-yönetici-ilişkileri)
8. [İçe/Dışa Aktarma](#içedışa-aktarma)
9. [Performans ve İzin Yönetimi](#performans-ve-izin-yönetimi)
10. [Audit ve Loglama](#audit-ve-loglama)

---

## 🔧 Temel CRUD İşlemleri

### 1. Personel Listesi
```http
GET /api/staff
```

**Query Parameters:**
- `page` (number): Sayfa numarası (varsayılan: 1)
- `limit` (number): Sayfa başına kayıt sayısı (varsayılan: 20)
- `search` (string): Arama terimi
- `status[]` (StaffStatus[]): Durum filtresi
- `employmentType[]` (EmploymentType[]): İstihdam türü filtresi
- `departmentId[]` (string[]): Departman ID filtresi
- `positionId[]` (string[]): Pozisyon ID filtresi
- `managerId` (string): Yönetici ID filtresi
- `salaryMin` (number): Minimum maaş
- `salaryMax` (number): Maksimum maaş
- `startDateFrom` (string): Başlangıç tarihi (başlangıç)
- `startDateTo` (string): Başlangıç tarihi (bitiş)
- `isManager` (boolean): Yönetici mi?
- `hasAvatar` (boolean): Avatar var mı?
- `sortBy` (string): Sıralama alanı
- `sortOrder` (string): Sıralama yönü (asc/desc)

**Response:**
```typescript
{
  data: Staff[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
}
```

### 2. Personel Detayı
```http
GET /api/staff/{id}
```

**Response:**
```typescript
{
  data: Staff
}
```

### 3. Personel Oluşturma
```http
POST /api/staff
```

**Request Body:**
```typescript
{
  // Kişisel Bilgiler
  firstName: string,
  lastName: string,
  email: string,
  phone?: string,
  nationalId?: string,
  dateOfBirth?: string,
  address?: string,
  emergencyContact?: {
    name: string,
    relationship: string,
    phone: string,
    email?: string
  },
  
  // İstihdam Bilgileri
  employeeId: string,
  departmentId: string,
  positionId: string,
  employmentType: EmploymentType,
  startDate: string,
  salary?: number,
  managerId?: string,
  
  // Ek Bilgiler
  avatar?: string,
  notes?: string,
  isManager?: boolean,
  
  // Kullanıcı Hesabı
  username: string,
  password: string,
  role: UserRole,
  permissions?: Permission[]
}
```

### 4. Personel Güncelleme
```http
PUT /api/staff/{id}
```

**Request Body:** (Tüm alanlar opsiyonel)
```typescript
{
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string,
  nationalId?: string,
  dateOfBirth?: string,
  address?: string,
  emergencyContact?: EmergencyContact,
  employeeId?: string,
  departmentId?: string,
  positionId?: string,
  employmentType?: EmploymentType,
  startDate?: string,
  endDate?: string,
  salary?: number,
  managerId?: string,
  avatar?: string,
  notes?: string,
  isManager?: boolean,
  status?: StaffStatus,
  username?: string,
  role?: UserRole,
  permissions?: Permission[]
}
```

### 5. Personel Silme
```http
DELETE /api/staff/{id}
```

---

## 🔍 Arama ve Filtreleme

### 6. Personel Arama
```http
GET /api/staff/search
```

**Query Parameters:**
- `q` (string): Arama terimi (zorunlu)
- Diğer filtreleme parametreleri (yukarıdaki liste ile aynı)

### 7. Gelişmiş Filtreleme
```http
POST /api/staff/filter
```

**Request Body:**
```typescript
{
  filters: StaffFilterParams,
  pagination: {
    page: number,
    limit: number
  },
  sorting: {
    field: string,
    order: 'asc' | 'desc'
  }
}
```

---

## 📦 Toplu İşlemler

### 8. Toplu Durum Güncelleme
```http
POST /api/staff/bulk/status
```

**Request Body:**
```typescript
{
  staffIds: string[],
  operation: 'activate' | 'deactivate' | 'suspend' | 'terminate',
  data?: {
    status: StaffStatus,
    endDate?: string,
    reason?: string
  }
}
```

### 9. Toplu Departman Atama
```http
POST /api/staff/bulk/department
```

**Request Body:**
```typescript
{
  staffIds: string[],
  operation: 'transfer',
  data: {
    departmentId: string,
    positionId?: string,
    startDate?: string
  }
}
```

### 10. Toplu Silme
```http
DELETE /api/staff/bulk
```

**Request Body:**
```typescript
{
  staffIds: string[]
}
```

---

## 📊 İstatistikler

### 11. Genel İstatistikler
```http
GET /api/staff/stats
```

**Response:**
```typescript
{
  total: number,
  byStatus: Record<StaffStatus, number>,
  byEmploymentType: Record<EmploymentType, number>,
  byDepartment?: Record<string, number>,
  departmentCount: number,
  averageSalary: number,
  recentHires?: Staff[],
  growth?: {
    total: number,
    byStatus: Record<StaffStatus, number>
  }
}
```

### 12. Departmana Göre Personel Sayısı
```http
GET /api/staff/stats/by-department
```

**Response:**
```typescript
{
  data: Record<string, number>
}
```

### 13. Duruma Göre Personel Sayısı
```http
GET /api/staff/stats/by-status
```

**Response:**
```typescript
{
  data: Record<StaffStatus, number>
}
```

---

## 🏢 Departman Yönetimi

### 14. Departman Listesi
```http
GET /api/departments
```

**Query Parameters:**
- `page` (number): Sayfa numarası
- `limit` (number): Sayfa başına kayıt sayısı
- `search` (string): Arama terimi
- `isActive` (boolean): Aktif departmanlar
- `hasStaff` (boolean): Personeli olan departmanlar

### 15. Departman Detayı
```http
GET /api/departments/{id}
```

### 16. Departman Oluşturma
```http
POST /api/departments
```

**Request Body:**
```typescript
{
  name: string,
  code: string,
  description?: string,
  managerId?: string,
  parentDepartmentId?: string,
  budget?: number,
  location?: string,
  isActive?: boolean
}
```

### 17. Departman Güncelleme
```http
PUT /api/departments/{id}
```

### 18. Departman Silme
```http
DELETE /api/departments/{id}
```

### 19. Departman Personel Transferi
```http
POST /api/departments/{id}/transfer
```

**Request Body:**
```typescript
{
  staffIds: string[],
  targetDepartmentId: string,
  transferDate: string,
  reason?: string
}
```

---

## 💼 Pozisyon Yönetimi

### 20. Pozisyon Listesi
```http
GET /api/positions
```

**Query Parameters:**
- `page` (number): Sayfa numarası
- `limit` (number): Sayfa başına kayıt sayısı
- `search` (string): Arama terimi
- `departmentId` (string): Departman ID
- `level` (string): Pozisyon seviyesi
- `isActive` (boolean): Aktif pozisyonlar

### 21. Pozisyon Detayı
```http
GET /api/positions/{id}
```

### 22. Pozisyon Oluşturma
```http
POST /api/positions
```

**Request Body:**
```typescript
{
  title: string,
  code: string,
  description?: string,
  departmentId: string,
  level: string,
  salaryMin?: number,
  salaryMax?: number,
  requirements?: string[],
  responsibilities?: string[],
  isActive?: boolean
}
```

### 23. Pozisyon Güncelleme
```http
PUT /api/positions/{id}
```

### 24. Pozisyon Silme
```http
DELETE /api/positions/{id}
```

---

## 🌳 Hiyerarşi ve Yönetici İlişkileri

### 25. Organizasyon Hiyerarşisi
```http
GET /api/staff/hierarchy
```

**Query Parameters:**
- `departmentId` (string): Belirli departman hiyerarşisi

**Response:**
```typescript
{
  data: {
    staff: Staff,
    directReports: StaffHierarchyResponse[],
    level: number
  }
}
```

### 26. Direkt Raporlar
```http
GET /api/staff/{managerId}/direct-reports
```

### 27. Yönetici Atama
```http
POST /api/staff/{staffId}/assign-manager
```

**Request Body:**
```typescript
{
  managerId: string,
  startDate?: string
}
```

### 28. Departman Atama
```http
POST /api/staff/{staffId}/assign-department
```

**Request Body:**
```typescript
{
  departmentId: string,
  positionId?: string,
  startDate?: string
}
```

### 29. Pozisyon Atama
```http
POST /api/staff/{staffId}/assign-position
```

**Request Body:**
```typescript
{
  positionId: string,
  startDate?: string
}
```

---

## 📤📥 İçe/Dışa Aktarma

### 30. Personel Dışa Aktarma
```http
POST /api/staff/export
```

**Request Body:**
```typescript
{
  format: 'csv' | 'xlsx' | 'pdf',
  fields?: (keyof Staff)[],
  filters?: StaffFilterParams,
  includeHeaders?: boolean,
  fileName?: string
}
```

**Response:** File download

### 31. Personel İçe Aktarma
```http
POST /api/staff/import
```

**Request:** Multipart form data
- `file` (File): CSV/Excel dosyası
- `validateOnly` (boolean): Sadece doğrulama yap
- `skipDuplicates` (boolean): Duplikatları atla
- `updateExisting` (boolean): Mevcut kayıtları güncelle

**Response:**
```typescript
{
  imported: Staff[],
  failed: Array<{
    row: number,
    data: StaffImportData,
    errors: string[]
  }>,
  total: number,
  importedCount: number,
  failedCount: number
}
```

### 32. İçe Aktarma Şablonu
```http
GET /api/staff/import/template
```

**Query Parameters:**
- `format` (string): csv | xlsx

---

## 🎯 Performans ve İzin Yönetimi

### 33. Performans Değerlendirmesi Güncelleme
```http
PUT /api/staff/{id}/performance
```

**Request Body:**
```typescript
{
  reviewerId: string,
  period: string,
  score: number,
  goals: string[],
  achievements: string[],
  improvements: string[],
  comments?: string,
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED'
}
```

### 34. İzin Talebi
```http
POST /api/staff/{id}/leave
```

**Request Body:**
```typescript
{
  type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID',
  startDate: string,
  endDate: string,
  days: number,
  reason?: string
}
```

### 35. İzin Onaylama
```http
POST /api/staff/leave/{leaveId}/approve
```

### 36. İzin Reddetme
```http
POST /api/staff/leave/{leaveId}/reject
```

**Request Body:**
```typescript
{
  reason?: string
}
```

---

## 📋 Audit ve Loglama

### 37. Personel Audit Logları
```http
GET /api/staff/{id}/audit-logs
```

**Response:**
```typescript
{
  data: Array<{
    id: string,
    staffId: string,
    action: string,
    changes: Record<string, unknown>,
    performedBy: string,
    performedAt: string,
    ipAddress?: string
  }>
}
```

---

## 🔄 Durum Yönetimi

### 38. Personel Aktifleştirme
```http
POST /api/staff/{id}/activate
```

### 39. Personel Pasifleştirme
```http
POST /api/staff/{id}/deactivate
```

### 40. Personel Askıya Alma
```http
POST /api/staff/{id}/suspend
```

### 41. Personel İşten Çıkarma
```http
POST /api/staff/{id}/terminate
```

**Request Body:**
```typescript
{
  endDate: string,
  reason?: string
}
```

### 42. Durum Güncelleme
```http
PUT /api/staff/{id}/status
```

**Request Body:**
```typescript
{
  status: StaffStatus,
  endDate?: string,
  reason?: string
}
```

---

## 👤 Profil Yönetimi

### 43. Personel Profili Görüntüleme
```http
GET /api/staff/{id}/profile
```

### 44. Personel Profili Güncelleme
```http
PUT /api/staff/{id}/profile
```

**Request Body:**
```typescript
{
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string,
  nationalId?: string,
  dateOfBirth?: string,
  address?: string,
  emergencyContact?: EmergencyContact,
  avatar?: string,
  notes?: string
}
```

---

## 🔗 Kullanıcı Entegrasyonu

### 45. Kullanıcıyı Personele Dönüştürme
```http
POST /api/staff/convert-user/{userId}
```

**Request Body:**
```typescript
{
  employeeId: string,
  departmentId: string,
  positionId: string,
  employmentType: EmploymentType,
  startDate: string,
  salary?: number,
  managerId?: string,
  isManager?: boolean
}
```

### 46. Kullanıcı Servisi ile Senkronizasyon
```http
POST /api/staff/{id}/sync-user
```

---

## 📝 Notlar

### Enum Değerleri:

**StaffStatus:**
- `ACTIVE`: Aktif
- `INACTIVE`: Pasif
- `ON_LEAVE`: İzinli
- `TERMINATED`: İşten Çıkarılmış
- `SUSPENDED`: Askıya Alınmış

**EmploymentType:**
- `FULL_TIME`: Tam Zamanlı
- `PART_TIME`: Yarı Zamanlı
- `CONTRACT`: Sözleşmeli
- `INTERN`: Stajyer
- `CONSULTANT`: Danışman
- `FREELANCE`: Serbest Çalışan

### Hata Kodları:
- `400`: Bad Request - Geçersiz istek
- `401`: Unauthorized - Yetkilendirme gerekli
- `403`: Forbidden - Erişim reddedildi
- `404`: Not Found - Kayıt bulunamadı
- `409`: Conflict - Çakışma (örn: email zaten kullanımda)
- `422`: Unprocessable Entity - Doğrulama hatası
- `500`: Internal Server Error - Sunucu hatası

### Güvenlik:
- Tüm endpointler JWT token ile korunmalıdır
- Rol bazlı erişim kontrolü uygulanmalıdır
- Hassas veriler (maaş, kişisel bilgiler) için ek yetkilendirme gereklidir
- Audit logları tüm değişiklikler için tutulmalıdır

### Performans:
- Listeleme endpointleri sayfalandırma desteklemeli
- Büyük veri setleri için cache mekanizması kullanılmalı
- Dosya yükleme/indirme işlemleri asenkron olmalı
- Database sorguları optimize edilmeli