# 🔐 RBAC Endpoint'leri - Frontend Entegrasyon Rehberi

Bu dokümantasyon, frontend'de rol ve yetki yönetimi için kullanılacak tüm API endpoint'lerini içerir.

## 📋 İçindekiler

- [Rol Yönetimi Endpoint'leri](#rol-yönetimi-endpointleri)
- [İzin Yönetimi Endpoint'leri](#izin-yönetimi-endpointleri)
- [Rol-İzin İlişki Endpoint'leri](#rol-izin-ilişki-endpointleri)
- [Frontend Kullanım Örnekleri](#frontend-kullanım-örnekleri)
- [Hata Kodları](#hata-kodları)

---

## 🎯 Rol Yönetimi Endpoint'leri

### 1. Rolleri Listele
**Endpoint:** `GET /api/admin/roles`

**Açıklama:** Sistemdeki tüm rolleri sayfalama ile getirir.

**Query Parametreleri:**
- `page` (number, optional): Sayfa numarası (varsayılan: 1)
- `limit` (number, optional): Sayfa başına kayıt sayısı (varsayılan: 10)
- `search` (string, optional): Rol adında arama yapar
- `orderBy` (string, optional): Sıralama yönü (ASC/DESC, varsayılan: DESC)
- `orderColumn` (string, optional): Sıralama kolonu (varsayılan: createdAt)

**Örnek İstek:**
```bash
GET /api/admin/roles?page=1&limit=10&search=admin&orderBy=DESC
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Admin",
      "slug": "admin",
      "description": "Sistem yöneticisi",
      "isSystem": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Staff",
      "slug": "staff",
      "description": "Personel",
      "isSystem": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 2. Tek Rol Getir
**Endpoint:** `GET /api/admin/roles/{roleId}`

**Açıklama:** Belirli bir rolün detaylarını getirir.

**Path Parametreleri:**
- `roleId` (string, required): Rol ID'si (UUID)

**Örnek İstek:**
```bash
GET /api/admin/roles/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Admin",
  "slug": "admin",
  "description": "Sistem yöneticisi",
  "isSystem": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 3. Yeni Rol Oluştur
**Endpoint:** `POST /api/admin/roles`

**Açıklama:** Yeni bir rol oluşturur.

**Request Body:**
```json
{
  "name": "Content Manager",
  "slug": "content-manager",
  "description": "İçerik yönetimi yetkisi"
}
```

**Örnek İstek:**
```bash
POST /api/admin/roles
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Content Manager",
  "slug": "content-manager",
  "description": "İçerik yönetimi yetkisi"
}
```

**Başarılı Yanıt (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Content Manager",
  "slug": "content-manager",
  "description": "İçerik yönetimi yetkisi",
  "isSystem": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. Rol Güncelle
**Endpoint:** `PUT /api/admin/roles/{roleId}`

**Açıklama:** Mevcut bir rolü günceller.

**Path Parametreleri:**
- `roleId` (string, required): Rol ID'si (UUID)

**Request Body:**
```json
{
  "name": "Updated Content Manager",
  "description": "Güncellenmiş açıklama"
}
```

**Örnek İstek:**
```bash
PUT /api/admin/roles/550e8400-e29b-41d4-a716-446655440002
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Updated Content Manager",
  "description": "Güncellenmiş açıklama"
}
```

**Başarılı Yanıt (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Updated Content Manager",
  "slug": "content-manager",
  "description": "Güncellenmiş açıklama",
  "isSystem": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 5. Rol Sil
**Endpoint:** `DELETE /api/admin/roles/{roleId}`

**Açıklama:** Bir rolü siler (soft delete).

**Path Parametreleri:**
- `roleId` (string, required): Rol ID'si (UUID)

**Örnek İstek:**
```bash
DELETE /api/admin/roles/550e8400-e29b-41d4-a716-446655440002
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
{
  "success": true
}
```

---

## 🔑 İzin Yönetimi Endpoint'leri

### 1. İzinleri Listele
**Endpoint:** `GET /api/admin/permissions`

**Açıklama:** Sistemdeki tüm izinleri sayfalama ile getirir.

**Query Parametreleri:**
- `page` (number, optional): Sayfa numarası (varsayılan: 1)
- `limit` (number, optional): Sayfa başına kayıt sayısı (varsayılan: 10)
- `search` (string, optional): İzin adında arama yapar
- `orderBy` (string, optional): Sıralama yönü (ASC/DESC, varsayılan: DESC)
- `orderColumn` (string, optional): Sıralama kolonu (varsayılan: createdAt)

**Örnek İstek:**
```bash
GET /api/admin/permissions?page=1&limit=10&search=user&orderBy=DESC
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Create User",
      "action": "create",
      "resource": "user",
      "description": "Kullanıcı oluşturma izni",
      "isSystem": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "name": "Update User",
      "action": "update",
      "resource": "user",
      "description": "Kullanıcı güncelleme izni",
      "isSystem": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

### 2. Yeni İzin Oluştur
**Endpoint:** `POST /api/admin/permissions`

**Açıklama:** Yeni bir izin oluşturur.

**Request Body:**
```json
{
  "name": "Delete Property",
  "action": "delete",
  "resource": "property",
  "description": "Mülk silme izni"
}
```

**Örnek İstek:**
```bash
POST /api/admin/permissions
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Delete Property",
  "action": "delete",
  "resource": "property",
  "description": "Mülk silme izni"
}
```

**Başarılı Yanıt (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "name": "Delete Property",
  "action": "delete",
  "resource": "property",
  "description": "Mülk silme izni",
  "isSystem": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 3. İzin Güncelle
**Endpoint:** `PUT /api/admin/permissions/{permissionId}`

**Açıklama:** Mevcut bir izni günceller.

**Path Parametreleri:**
- `permissionId` (string, required): İzin ID'si (UUID)

**Request Body:**
```json
{
  "name": "Updated Delete Property",
  "description": "Güncellenmiş açıklama"
}
```

**Örnek İstek:**
```bash
PUT /api/admin/permissions/550e8400-e29b-41d4-a716-446655440005
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Updated Delete Property",
  "description": "Güncellenmiş açıklama"
}
```

**Başarılı Yanıt (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "name": "Updated Delete Property",
  "action": "delete",
  "resource": "property",
  "description": "Güncellenmiş açıklama",
  "isSystem": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. İzin Sil
**Endpoint:** `DELETE /api/admin/permissions/{permissionId}`

**Açıklama:** Bir izni siler (soft delete).

**Path Parametreleri:**
- `permissionId` (string, required): İzin ID'si (UUID)

**Örnek İstek:**
```bash
DELETE /api/admin/permissions/550e8400-e29b-41d4-a716-446655440005
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
{
  "success": true
}
```

---

### 5. Kaynağa Göre İzinleri Getir
**Endpoint:** `GET /api/admin/permissions/by-resource`

**Açıklama:** Belirli bir kaynağa ait tüm izinleri getirir.

**Query Parametreleri:**
- `resource` (string, required): Kaynak adı (örn: user, property, role)

**Örnek İstek:**
```bash
GET /api/admin/permissions/by-resource?resource=user
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "Create User",
    "action": "create",
    "resource": "user",
    "description": "Kullanıcı oluşturma izni",
    "isSystem": true,
    "roles": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Admin"
      }
    ]
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "name": "Update User",
    "action": "update",
    "resource": "user",
    "description": "Kullanıcı güncelleme izni",
    "isSystem": true,
    "roles": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Admin"
      }
    ]
  }
]
```

---

## 🔗 Rol-İzin İlişki Endpoint'leri

### 1. Rolün İzinlerini Getir
**Endpoint:** `GET /api/admin/roles/{roleId}/permissions`

**Açıklama:** Belirli bir rolün sahip olduğu tüm izinleri getirir.

**Path Parametreleri:**
- `roleId` (string, required): Rol ID'si (UUID)

**Örnek İstek:**
```bash
GET /api/admin/roles/550e8400-e29b-41d4-a716-446655440000/permissions
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "Create User",
    "action": "create",
    "resource": "user",
    "description": "Kullanıcı oluşturma izni",
    "isSystem": true
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "name": "Update User",
    "action": "update",
    "resource": "user",
    "description": "Kullanıcı güncelleme izni",
    "isSystem": true
  }
]
```

---

### 2. Role İzin Ata
**Endpoint:** `POST /api/admin/roles/{roleId}/permissions`

**Açıklama:** Bir role yeni izinler atar (mevcut izinlere ekler).

**Path Parametreleri:**
- `roleId` (string, required): Rol ID'si (UUID)

**Request Body:**
```json
{
  "permissionIds": ["550e8400-e29b-41d4-a716-446655440003", "550e8400-e29b-41d4-a716-446655440004"]
}
```

**Örnek İstek:**
```bash
POST /api/admin/roles/550e8400-e29b-41d4-a716-446655440000/permissions
Content-Type: application/json
Authorization: Bearer <token>

{
  "permissionIds": ["550e8400-e29b-41d4-a716-446655440003", "550e8400-e29b-41d4-a716-446655440004"]
}
```

**Başarılı Yanıt (201):**
```json
{
  "success": true,
  "message": "Permissions assigned successfully"
}
```

---

### 3. Rolden İzin Çıkar
**Endpoint:** `DELETE /api/admin/roles/{roleId}/permissions/{permissionId}`

**Açıklama:** Bir rolden belirli bir izni çıkarır.

**Path Parametreleri:**
- `roleId` (string, required): Rol ID'si (UUID)
- `permissionId` (string, required): İzin ID'si (UUID)

**Örnek İstek:**
```bash
DELETE /api/admin/roles/550e8400-e29b-41d4-a716-446655440000/permissions/550e8400-e29b-41d4-a716-446655440003
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "message": "Permission removed successfully"
}
```

---

### 4. Rolün Tüm İzinlerini Güncelle
**Endpoint:** `PUT /api/admin/roles/{roleId}/permissions`

**Açıklama:** Bir rolün tüm izinlerini değiştirir (mevcut izinleri siler, yeni izinleri atar).

**Path Parametreleri:**
- `roleId` (string, required): Rol ID'si (UUID)

**Request Body:**
```json
{
  "permissionIds": ["550e8400-e29b-41d4-a716-446655440005", "550e8400-e29b-41d4-a716-446655440006"]
}
```

**Örnek İstek:**
```bash
PUT /api/admin/roles/550e8400-e29b-41d4-a716-446655440000/permissions
Content-Type: application/json
Authorization: Bearer <token>

{
  "permissionIds": ["550e8400-e29b-41d4-a716-446655440005", "550e8400-e29b-41d4-a716-446655440006"]
}
```

**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "message": "Role permissions updated successfully"
}
```

---

## 🎨 Frontend Kullanım Örnekleri

### JavaScript/TypeScript Örnekleri

#### 1. Rolleri Listele
```javascript
const fetchRoles = async (page = 1, search = '') => {
  try {
    const response = await fetch(`/api/admin/roles?page=${page}&search=${search}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Roller yüklenemedi');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hata:', error);
    throw error;
  }
};
```

#### 2. Yeni Rol Oluştur
```javascript
const createRole = async (roleData) => {
  try {
    const response = await fetch('/api/admin/roles', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(roleData)
    });
    
    if (!response.ok) {
      throw new Error('Rol oluşturulamadı');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hata:', error);
    throw error;
  }
};
```

#### 3. Role İzin Ata
```javascript
const assignPermissions = async (roleId, permissionIds) => {
  try {
    const response = await fetch(`/api/admin/roles/${roleId}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ permissionIds })
    });
    
    if (!response.ok) {
      throw new Error('İzinler atanamadı');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hata:', error);
    throw error;
  }
};
```

#### 4. Rolün İzinlerini Getir
```javascript
const getRolePermissions = async (roleId) => {
  try {
    const response = await fetch(`/api/admin/roles/${roleId}/permissions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Rol izinleri yüklenemedi');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hata:', error);
    throw error;
  }
};
```

### Axios Örnekleri

#### 1. Axios Instance Oluştur
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Request interceptor - token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz, login sayfasına yönlendir
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 2. Rol Yönetimi Fonksiyonları
```javascript
// Rolleri listele
export const getRoles = (params = {}) => {
  return api.get('/admin/roles', { params });
};

// Yeni rol oluştur
export const createRole = (roleData) => {
  return api.post('/admin/roles', roleData);
};

// Rol güncelle
export const updateRole = (roleId, roleData) => {
  return api.put(`/admin/roles/${roleId}`, roleData);
};

// Rol sil
export const deleteRole = (roleId) => {
  return api.delete(`/admin/roles/${roleId}`);
};

// Rolün izinlerini getir
export const getRolePermissions = (roleId) => {
  return api.get(`/admin/roles/${roleId}/permissions`);
};

// Role izin ata
export const assignPermissions = (roleId, permissionIds) => {
  return api.post(`/admin/roles/${roleId}/permissions`, { permissionIds });
};

// Rolden izin çıkar
export const removePermission = (roleId, permissionId) => {
  return api.delete(`/admin/roles/${roleId}/permissions/${permissionId}`);
};

// Rolün tüm izinlerini güncelle
export const updateRolePermissions = (roleId, permissionIds) => {
  return api.put(`/admin/roles/${roleId}/permissions`, { permissionIds });
};
```

#### 3. İzin Yönetimi Fonksiyonları
```javascript
// İzinleri listele
export const getPermissions = (params = {}) => {
  return api.get('/admin/permissions', { params });
};

// Yeni izin oluştur
export const createPermission = (permissionData) => {
  return api.post('/admin/permissions', permissionData);
};

// İzin güncelle
export const updatePermission = (permissionId, permissionData) => {
  return api.put(`/admin/permissions/${permissionId}`, permissionData);
};

// İzin sil
export const deletePermission = (permissionId) => {
  return api.delete(`/admin/permissions/${permissionId}`);
};

// Kaynağa göre izinleri getir
export const getPermissionsByResource = (resource) => {
  return api.get('/admin/permissions/by-resource', { params: { resource } });
};
```

---

## ❌ Hata Kodları

### Genel Hata Yanıt Formatı
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/admin/roles",
  "method": "POST",
  "error": "Bad Request",
  "message": "Role with name 'Admin' already exists"
}
```

### Yaygın Hata Kodları

| Kod | Açıklama | Çözüm |
|-----|----------|-------|
| 400 | Bad Request | İstek verisi hatalı veya eksik |
| 401 | Unauthorized | Token geçersiz veya eksik |
| 403 | Forbidden | Yetki yetersiz |
| 404 | Not Found | Kaynak bulunamadı |
| 409 | Conflict | Çakışma (örn: aynı isimde rol var) |
| 422 | Unprocessable Entity | Validation hatası |
| 500 | Internal Server Error | Sunucu hatası |

### Özel Hata Mesajları

#### Rol Yönetimi
- `"Role with name 'Admin' already exists"` - Aynı isimde rol zaten var
- `"Role with slug 'admin' already exists"` - Aynı slug'da rol zaten var
- `"Cannot change name or slug of a system role"` - Sistem rolü değiştirilemez
- `"Cannot delete a system role"` - Sistem rolü silinemez

#### İzin Yönetimi
- `"Permission with name 'Create User' already exists"` - Aynı isimde izin zaten var
- `"Permission for action 'create' on resource 'user' already exists"` - Aynı action/resource kombinasyonu zaten var
- `"Cannot change name, action, or resource of a system permission"` - Sistem izni değiştirilemez
- `"Cannot delete a system permission"` - Sistem izni silinemez

#### Rol-İzin İlişkisi
- `"Role with id 'uuid' not found"` - Rol bulunamadı
- `"Some permissions not found"` - Bazı izinler bulunamadı

---

## 🔒 Güvenlik Notları

1. **Authentication:** Tüm endpoint'ler JWT token gerektirir
2. **Authorization:** Sadece ADMIN ve SUPER_ADMIN rolleri erişebilir
3. **Validation:** Tüm input'lar server-side validate edilir
4. **Rate Limiting:** API rate limiting uygulanır
5. **Audit Log:** Tüm işlemler loglanır

---

## 📝 Notlar

- Tüm ID'ler UUID formatındadır
- Tarih formatı ISO 8601 standardındadır
- Sayfalama varsayılan olarak 10 kayıt döner
- Sistem rolleri ve izinleri değiştirilemez/silinemez
- Soft delete kullanılır (kayıtlar tamamen silinmez)

---

**🚀 Bu endpoint'lerle frontend'de tam özellikli RBAC yönetim sistemi kurabilirsiniz!**
