# 🔐 RBAC Endpoint'leri - Frontend Entegrasyon Rehberi

Bu dokümantasyon, frontend'de rol ve yetki yönetimi için kullanılacak tüm API endpoint'lerini içerir.

## 📋 İçindekiler

- [Rol Yönetimi Endpoint'leri](#rol-yönetimi-endpointleri)
- [İzin Yönetimi Endpoint'leri](#izin-yönetimi-endpointleri)
- [Rol-İzin İlişki Endpoint'leri](#rol-izin-ilişki-endpointleri)
- [Kullanıcı-Rol Atama Endpoint'leri](#kullanıcı-rol-atama-endpointleri)
- [RBAC İstatistikleri Endpoint'leri](#rbac-istatistikleri-endpointleri)
- [RBAC Arama ve Filtreleme Endpoint'leri](#rbac-arama-ve-filtreleme-endpointleri)
- [Frontend Kullanım Örnekleri](#frontend-kullanım-örnekleri)
- [Hata Kodları](#hata-kodları)

---

## 🎯 Rol Yönetimi Endpoint'leri

### 1. Rolleri Listele
**Endpoint:** `GET /api/admin/roles`

**Kullanım Alanı:** Ayarlar sayfasındaki "Rol Yönetimi" sekmesinde rol tablosunu doldurmak için kullanılır.

**Açıklama:** Sistemdeki tüm rolleri sayfalama ile getirir. Bu endpoint, admin panelinde rol listesi görüntülemek, rol arama yapmak ve rol yönetimi işlemlerini gerçekleştirmek için kullanılır.

**Frontend Kullanımı:** 
- Rol tablosunda tüm rolleri listeler
- Rol arama fonksiyonu için kullanılır
- Rol düzenleme/silme işlemleri için rol seçimi yapar
- Rol-izin atama sayfasında rol listesi gösterir

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

**Kullanım Alanı:** Rol düzenleme modalında veya rol detay sayfasında rol bilgilerini göstermek için kullanılır.

**Açıklama:** Belirli bir rolün detaylarını getirir. Bu endpoint, rol düzenleme formunu doldurmak, rol detaylarını görüntülemek ve rol-izin atama sayfasında rol bilgilerini göstermek için kullanılır.

**Frontend Kullanımı:**
- Rol düzenleme modalında mevcut rol bilgilerini yükler
- Rol detay sayfasında rol bilgilerini gösterir
- Rol-izin atama sayfasında rol başlığını ve açıklamasını gösterir
- Rol silme onay modalında rol bilgilerini gösterir

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

**Kullanım Alanı:** "Yeni Rol Ekle" butonuna tıklandığında açılan modal formunda yeni rol oluşturmak için kullanılır.

**Açıklama:** Yeni bir rol oluşturur. Bu endpoint, admin panelinde yeni rol tanımlamak, özel yetkiler için rol oluşturmak ve sistem yönetimi için gerekli rolleri eklemek için kullanılır.

**Frontend Kullanımı:**
- "Yeni Rol Ekle" modalında form submit işlemi
- Rol oluşturma başarılı olduğunda rol listesini yeniler
- Rol oluşturma sonrası başarı mesajı gösterir
- Rol oluşturma sonrası otomatik olarak rol-izin atama sayfasına yönlendirir

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

**Kullanım Alanı:** Rol tablosundaki "Düzenle" butonuna tıklandığında açılan modal formunda rol bilgilerini güncellemek için kullanılır.

**Açıklama:** Mevcut bir rolü günceller. Bu endpoint, rol adını, açıklamasını veya diğer özelliklerini değiştirmek için kullanılır. Sistem rolleri (isSystem: true) güncellenemez.

**Frontend Kullanımı:**
- Rol düzenleme modalında form submit işlemi
- Rol güncelleme başarılı olduğunda rol listesini yeniler
- Rol güncelleme sonrası başarı mesajı gösterir
- Sistem rolleri için düzenleme butonunu devre dışı bırakır

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

**Kullanım Alanı:** Rol tablosundaki "Sil" butonuna tıklandığında açılan onay modalında rolü silmek için kullanılır.

**Açıklama:** Bir rolü siler (soft delete). Bu endpoint, artık kullanılmayan rolleri sistemden kaldırmak için kullanılır. Sistem rolleri (isSystem: true) silinemez. Silinen roller tamamen kaldırılmaz, sadece pasif hale getirilir.

**Frontend Kullanımı:**
- Rol silme onay modalında "Sil" butonuna tıklandığında
- Rol silme başarılı olduğunda rol listesini yeniler
- Rol silme sonrası başarı mesajı gösterir
- Sistem rolleri için silme butonunu devre dışı bırakır
- Kullanıcılara atanmış rolleri silmeye izin vermez

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

**Kullanım Alanı:** Ayarlar sayfasındaki "İzin Yönetimi" sekmesinde izin tablosunu doldurmak ve rol-izin atama sayfasında izin listesini göstermek için kullanılır.

**Açıklama:** Sistemdeki tüm izinleri sayfalama ile getirir. Bu endpoint, admin panelinde izin listesi görüntülemek, izin arama yapmak, izin yönetimi işlemlerini gerçekleştirmek ve rol-izin atama işlemlerinde kullanılır.

**Frontend Kullanımı:**
- İzin tablosunda tüm izinleri listeler
- İzin arama fonksiyonu için kullanılır
- İzin düzenleme/silme işlemleri için izin seçimi yapar
- Rol-izin atama sayfasında izin listesi gösterir
- İzin gruplandırma (resource bazında) için kullanılır

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

**Kullanım Alanı:** "Yeni İzin Ekle" butonuna tıklandığında açılan modal formunda yeni izin oluşturmak için kullanılır.

**Açıklama:** Yeni bir izin oluşturur. Bu endpoint, sistemde yeni özellikler eklendiğinde gerekli izinleri tanımlamak, özel yetkiler oluşturmak ve sistem güvenliğini sağlamak için kullanılır.

**Frontend Kullanımı:**
- "Yeni İzin Ekle" modalında form submit işlemi
- İzin oluşturma başarılı olduğunda izin listesini yeniler
- İzin oluşturma sonrası başarı mesajı gösterir
- İzin oluşturma sonrası otomatik olarak izin listesine döner
- Resource ve Action kombinasyonunun benzersiz olduğunu kontrol eder

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

**Kullanım Alanı:** İzin tablosundaki "Düzenle" butonuna tıklandığında açılan modal formunda izin bilgilerini güncellemek için kullanılır.

**Açıklama:** Mevcut bir izni günceller. Bu endpoint, izin adını, açıklamasını veya diğer özelliklerini değiştirmek için kullanılır. Sistem izinleri (isSystem: true) güncellenemez.

**Frontend Kullanımı:**
- İzin düzenleme modalında form submit işlemi
- İzin güncelleme başarılı olduğunda izin listesini yeniler
- İzin güncelleme sonrası başarı mesajı gösterir
- Sistem izinleri için düzenleme butonunu devre dışı bırakır
- Action ve Resource alanlarını salt okunur yapar (sistem izinleri için)

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

**Kullanım Alanı:** İzin tablosundaki "Sil" butonuna tıklandığında açılan onay modalında izni silmek için kullanılır.

**Açıklama:** Bir izni siler (soft delete). Bu endpoint, artık kullanılmayan izinleri sistemden kaldırmak için kullanılır. Sistem izinleri (isSystem: true) silinemez. Silinen izinler tamamen kaldırılmaz, sadece pasif hale getirilir.

**Frontend Kullanımı:**
- İzin silme onay modalında "Sil" butonuna tıklandığında
- İzin silme başarılı olduğunda izin listesini yeniler
- İzin silme sonrası başarı mesajı gösterir
- Sistem izinleri için silme butonunu devre dışı bırakır
- Rollere atanmış izinleri silmeye izin vermez

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

**Kullanım Alanı:** Rol-izin atama sayfasında izinleri kaynak bazında gruplandırmak ve izin yönetimi sayfasında filtreleme yapmak için kullanılır.

**Açıklama:** Belirli bir kaynağa ait tüm izinleri getirir. Bu endpoint, izinleri modül bazında gruplandırmak, rol-izin atama işlemlerinde kolaylık sağlamak ve izin yönetimini organize etmek için kullanılır.

**Frontend Kullanımı:**
- Rol-izin atama sayfasında izinleri kaynak bazında gruplandırır
- İzin yönetimi sayfasında kaynak bazında filtreleme yapar
- İzin oluşturma formunda mevcut kaynakları listeler
- İzin istatistiklerinde kaynak bazında sayım yapar

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

**Kullanım Alanı:** Rol-izin atama sayfasında mevcut rol izinlerini göstermek ve rol detay sayfasında rol yetkilerini listelemek için kullanılır.

**Açıklama:** Belirli bir rolün sahip olduğu tüm izinleri getirir. Bu endpoint, rol-izin atama işlemlerinde mevcut izinleri kontrol etmek, rol detaylarını görüntülemek ve izin yönetimi işlemlerini gerçekleştirmek için kullanılır.

**Frontend Kullanımı:**
- Rol-izin atama sayfasında mevcut izinleri işaretler
- Rol detay sayfasında rol yetkilerini listeler
- İzin atama/çıkarma işlemlerinde mevcut durumu gösterir
- Rol yetki raporlarında kullanılır

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

**Kullanım Alanı:** Rol-izin atama sayfasında "İzin Ekle" butonuna tıklandığında role yeni izinler eklemek için kullanılır.

**Açıklama:** Bir role yeni izinler atar (mevcut izinlere ekler). Bu endpoint, role yeni yetkiler vermek, kısmi izin güncellemeleri yapmak ve rol yetkilerini genişletmek için kullanılır.

**Frontend Kullanımı:**
- Rol-izin atama sayfasında "İzin Ekle" işlemi
- İzin atama başarılı olduğunda rol izinlerini yeniler
- İzin atama sonrası başarı mesajı gösterir
- Mevcut izinlere ek olarak yeni izinler ekler
- Toplu izin atama işlemlerinde kullanılır

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

**Kullanım Alanı:** Rol-izin atama sayfasında izin listesindeki "Çıkar" butonuna tıklandığında veya rol detay sayfasında izin silme işlemi için kullanılır.

**Açıklama:** Bir rolden belirli bir izni çıkarır. Bu endpoint, rol yetkilerini azaltmak, gereksiz izinleri kaldırmak ve rol güvenliğini artırmak için kullanılır.

**Frontend Kullanımı:**
- Rol-izin atama sayfasında tek izin çıkarma işlemi
- İzin çıkarma başarılı olduğunda rol izinlerini yeniler
- İzin çıkarma sonrası başarı mesajı gösterir
- Sistem rolleri için kritik izinleri çıkarmaya izin vermez
- İzin çıkarma onay modalında kullanılır

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

**Kullanım Alanı:** Rol-izin atama sayfasında "Tümünü Güncelle" butonuna tıklandığında rolün tüm izinlerini toplu olarak değiştirmek için kullanılır.

**Açıklama:** Bir rolün tüm izinlerini değiştirir (mevcut izinleri siler, yeni izinleri atar). Bu endpoint, rol yetkilerini tamamen yeniden tanımlamak, toplu izin güncellemeleri yapmak ve rol yapısını değiştirmek için kullanılır.

**Frontend Kullanımı:**
- Rol-izin atama sayfasında toplu izin güncelleme işlemi
- İzin güncelleme başarılı olduğunda rol izinlerini yeniler
- İzin güncelleme sonrası başarı mesajı gösterir
- Mevcut tüm izinleri siler ve yeni izinleri atar
- Sistem rolleri için kritik izinleri korur
- Toplu izin değişikliklerinde kullanılır

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

## 👥 Kullanıcı-Rol Atama Endpoint'leri

### 1. Kullanıcının Rollerini Getir
**Endpoint:** `GET /api/admin/users/{userId}/roles`

**Kullanım Alanı:** Kullanıcı detay sayfasında veya kullanıcı-rol atama modalında kullanıcının mevcut rollerini göstermek için kullanılır.

**Açıklama:** Belirli bir kullanıcının sahip olduğu tüm rolleri getirir. Bu endpoint, kullanıcı yetki yönetimi, rol atama işlemleri ve kullanıcı detay görüntüleme için kullanılır.

**Frontend Kullanımı:**
- Kullanıcı detay sayfasında rol listesi gösterir
- Kullanıcı-rol atama modalında mevcut rolleri işaretler
- Kullanıcı yetki raporlarında kullanılır
- Rol değişiklik geçmişini takip eder

**Path Parametreleri:**
- `userId` (string, required): Kullanıcı ID'si (UUID)

**Örnek İstek:**
```bash
GET /api/admin/users/550e8400-e29b-41d4-a716-446655440010/roles
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Admin",
    "slug": "admin",
    "description": "Sistem yöneticisi",
    "isSystem": true,
    "assignedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Staff",
    "slug": "staff",
    "description": "Personel",
    "isSystem": true,
    "assignedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 2. Kullanıcıya Rol Ata
**Endpoint:** `POST /api/admin/users/{userId}/roles`

**Kullanım Alanı:** Kullanıcı-rol atama modalında "Rol Ata" butonuna tıklandığında kullanıcıya yeni roller eklemek için kullanılır.

**Açıklama:** Bir kullanıcıya yeni roller atar (mevcut rollere ekler). Bu endpoint, kullanıcı yetki yönetimi, rol atama işlemleri ve kullanıcı erişim kontrolü için kullanılır.

**Frontend Kullanımı:**
- Kullanıcı-rol atama modalında "Rol Ata" işlemi
- Rol atama başarılı olduğunda kullanıcı rollerini yeniler
- Rol atama sonrası başarı mesajı gösterir
- Mevcut rollere ek olarak yeni roller ekler
- Toplu rol atama işlemlerinde kullanılır

**Path Parametreleri:**
- `userId` (string, required): Kullanıcı ID'si (UUID)

**Request Body:**
```json
{
  "roleIds": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
}
```

**Örnek İstek:**
```bash
POST /api/admin/users/550e8400-e29b-41d4-a716-446655440010/roles
Content-Type: application/json
Authorization: Bearer <token>

{
  "roleIds": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
}
```

**Başarılı Yanıt (201):**
```json
{
  "success": true,
  "message": "Roles assigned successfully"
}
```

---

### 3. Kullanıcıdan Rol Çıkar
**Endpoint:** `DELETE /api/admin/users/{userId}/roles/{roleId}`

**Kullanım Alanı:** Kullanıcı detay sayfasında veya kullanıcı-rol atama modalında "Rol Çıkar" butonuna tıklandığında kullanıcıdan rol kaldırmak için kullanılır.

**Açıklama:** Bir kullanıcıdan belirli bir rolü çıkarır. Bu endpoint, kullanıcı yetkilerini azaltmak, gereksiz roller kaldırmak ve kullanıcı güvenliğini artırmak için kullanılır.

**Frontend Kullanımı:**
- Kullanıcı-rol atama sayfasında tek rol çıkarma işlemi
- Rol çıkarma başarılı olduğunda kullanıcı rollerini yeniler
- Rol çıkarma sonrası başarı mesajı gösterir
- Sistem kullanıcıları için kritik roller çıkarmaya izin vermez
- Rol çıkarma onay modalında kullanılır

**Path Parametreleri:**
- `userId` (string, required): Kullanıcı ID'si (UUID)
- `roleId` (string, required): Rol ID'si (UUID)

**Örnek İstek:**
```bash
DELETE /api/admin/users/550e8400-e29b-41d4-a716-446655440010/roles/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "message": "Role removed successfully"
}
```

---

### 4. Kullanıcının Tüm Rollerini Güncelle
**Endpoint:** `PUT /api/admin/users/{userId}/roles`

**Kullanım Alanı:** Kullanıcı-rol atama modalında "Tümünü Güncelle" butonuna tıklandığında kullanıcının tüm rollerini toplu olarak değiştirmek için kullanılır.

**Açıklama:** Bir kullanıcının tüm rollerini değiştirir (mevcut rolleri siler, yeni rolleri atar). Bu endpoint, kullanıcı yetkilerini tamamen yeniden tanımlamak, toplu rol güncellemeleri yapmak ve kullanıcı yapısını değiştirmek için kullanılır.

**Frontend Kullanımı:**
- Kullanıcı-rol atama sayfasında toplu rol güncelleme işlemi
- Rol güncelleme başarılı olduğunda kullanıcı rollerini yeniler
- Rol güncelleme sonrası başarı mesajı gösterir
- Mevcut tüm rolleri siler ve yeni rolleri atar
- Sistem kullanıcıları için kritik roller korur
- Toplu rol değişikliklerinde kullanılır

**Path Parametreleri:**
- `userId` (string, required): Kullanıcı ID'si (UUID)

**Request Body:**
```json
{
  "roleIds": ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"]
}
```

**Örnek İstek:**
```bash
PUT /api/admin/users/550e8400-e29b-41d4-a716-446655440010/roles
Content-Type: application/json
Authorization: Bearer <token>

{
  "roleIds": ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"]
}
```

**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "message": "User roles updated successfully"
}
```

---

### 5. Kullanıcının İzinlerini Getir
**Endpoint:** `GET /api/admin/users/{userId}/permissions`

**Kullanım Alanı:** Kullanıcı detay sayfasında kullanıcının tüm yetkilerini göstermek ve yetki kontrolü yapmak için kullanılır.

**Açıklama:** Belirli bir kullanıcının sahip olduğu tüm izinleri getirir (rollerinden türetilen). Bu endpoint, kullanıcı yetki kontrolü, detay görüntüleme ve güvenlik kontrolü için kullanılır.

**Frontend Kullanımı:**
- Kullanıcı detay sayfasında yetki listesi gösterir
- Kullanıcı yetki kontrolü yapar
- Yetki raporlarında kullanılır
- Kullanıcı erişim loglarında kullanılır

**Path Parametreleri:**
- `userId` (string, required): Kullanıcı ID'si (UUID)

**Örnek İstek:**
```bash
GET /api/admin/users/550e8400-e29b-41d4-a716-446655440010/permissions
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
    "sourceRole": "Admin"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "name": "Update User",
    "action": "update",
    "resource": "user",
    "description": "Kullanıcı güncelleme izni",
    "isSystem": true,
    "sourceRole": "Admin"
  }
]
```

---

## 📊 RBAC İstatistikleri Endpoint'leri

### 1. Rol İstatistikleri
**Endpoint:** `GET /api/admin/rbac/statistics/roles`

**Kullanım Alanı:** RBAC dashboard'unda rol istatistiklerini göstermek ve rol yönetimi sayfasında özet bilgileri göstermek için kullanılır.

**Açıklama:** Sistemdeki rol istatistiklerini getirir. Bu endpoint, rol yönetimi dashboard'u, istatistik raporları ve sistem genel durumu için kullanılır.

**Frontend Kullanımı:**
- RBAC dashboard'unda rol istatistiklerini gösterir
- Rol yönetimi sayfasında özet bilgileri gösterir
- İstatistik kartlarında kullanılır
- Rapor sayfalarında kullanılır

**Örnek İstek:**
```bash
GET /api/admin/rbac/statistics/roles
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
{
  "totalRoles": 10,
  "systemRoles": 3,
  "customRoles": 7,
  "activeRoles": 8,
  "inactiveRoles": 2,
  "rolesWithPermissions": 9,
  "rolesWithoutPermissions": 1,
  "mostUsedRoles": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Admin",
      "userCount": 5
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Staff",
      "userCount": 12
    }
  ]
}
```

---

### 2. İzin İstatistikleri
**Endpoint:** `GET /api/admin/rbac/statistics/permissions`

**Kullanım Alanı:** RBAC dashboard'unda izin istatistiklerini göstermek ve izin yönetimi sayfasında özet bilgileri göstermek için kullanılır.

**Açıklama:** Sistemdeki izin istatistiklerini getirir. Bu endpoint, izin yönetimi dashboard'u, istatistik raporları ve sistem güvenlik durumu için kullanılır.

**Frontend Kullanımı:**
- RBAC dashboard'unda izin istatistiklerini gösterir
- İzin yönetimi sayfasında özet bilgileri gösterir
- İstatistik kartlarında kullanılır
- Güvenlik raporlarında kullanılır

**Örnek İstek:**
```bash
GET /api/admin/rbac/statistics/permissions
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
{
  "totalPermissions": 50,
  "systemPermissions": 30,
  "customPermissions": 20,
  "activePermissions": 48,
  "inactivePermissions": 2,
  "permissionsByResource": {
    "user": 8,
    "role": 6,
    "property": 12,
    "resident": 10,
    "financial": 14
  },
  "mostUsedPermissions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Create User",
      "roleCount": 3
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "name": "Update User",
      "roleCount": 4
    }
  ]
}
```

---

### 3. Kullanıcı İstatistikleri
**Endpoint:** `GET /api/admin/rbac/statistics/users`

**Kullanım Alanı:** RBAC dashboard'unda kullanıcı istatistiklerini göstermek ve kullanıcı yönetimi sayfasında özet bilgileri göstermek için kullanılır.

**Açıklama:** Sistemdeki kullanıcı istatistiklerini getirir. Bu endpoint, kullanıcı yönetimi dashboard'u, istatistik raporları ve sistem kullanım durumu için kullanılır.

**Frontend Kullanımı:**
- RBAC dashboard'unda kullanıcı istatistiklerini gösterir
- Kullanıcı yönetimi sayfasında özet bilgileri gösterir
- İstatistik kartlarında kullanılır
- Kullanım raporlarında kullanılır

**Örnek İstek:**
```bash
GET /api/admin/rbac/statistics/users
Authorization: Bearer <token>
```

**Başarılı Yanıt (200):**
```json
{
  "totalUsers": 25,
  "usersWithRoles": 23,
  "usersWithoutRoles": 2,
  "usersByRole": {
    "Admin": 5,
    "Staff": 12,
    "Manager": 6
  },
  "recentRoleAssignments": [
    {
      "userId": "550e8400-e29b-41d4-a716-446655440010",
      "userName": "John Doe",
      "roleName": "Staff",
      "assignedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 🔍 RBAC Arama ve Filtreleme Endpoint'leri

### 1. Rol Arama
**Endpoint:** `GET /api/admin/rbac/search/roles`

**Kullanım Alanı:** Rol yönetimi sayfasında gelişmiş arama yapmak ve rol filtreleme işlemleri için kullanılır.

**Açıklama:** Rolleri çeşitli kriterlere göre aramak ve filtrelemek için kullanılır. Bu endpoint, büyük rol listelerinde hızlı arama yapmak ve belirli kriterlere uyan rolleri bulmak için kullanılır.

**Frontend Kullanımı:**
- Rol yönetimi sayfasında gelişmiş arama
- Rol filtreleme işlemleri
- Rol arama sonuçlarını gösterme
- Rol önerileri sunma

**Query Parametreleri:**
- `q` (string, optional): Arama terimi
- `type` (string, optional): Rol tipi (system, custom, all)
- `hasPermissions` (boolean, optional): İzinleri olan roller
- `userCount` (number, optional): Minimum kullanıcı sayısı

**Örnek İstek:**
```bash
GET /api/admin/rbac/search/roles?q=admin&type=system&hasPermissions=true
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
      "userCount": 5,
      "permissionCount": 25
    }
  ],
  "total": 1,
  "filters": {
    "applied": ["q=admin", "type=system", "hasPermissions=true"]
  }
}
```

---

### 2. İzin Arama
**Endpoint:** `GET /api/admin/rbac/search/permissions`

**Kullanım Alanı:** İzin yönetimi sayfasında gelişmiş arama yapmak ve izin filtreleme işlemleri için kullanılır.

**Açıklama:** İzinleri çeşitli kriterlere göre aramak ve filtrelemek için kullanılır. Bu endpoint, büyük izin listelerinde hızlı arama yapmak ve belirli kriterlere uyan izinleri bulmak için kullanılır.

**Frontend Kullanımı:**
- İzin yönetimi sayfasında gelişmiş arama
- İzin filtreleme işlemleri
- İzin arama sonuçlarını gösterme
- İzin önerileri sunma

**Query Parametreleri:**
- `q` (string, optional): Arama terimi
- `resource` (string, optional): Kaynak adı
- `action` (string, optional): Eylem adı
- `type` (string, optional): İzin tipi (system, custom, all)

**Örnek İstek:**
```bash
GET /api/admin/rbac/search/permissions?q=user&resource=user&action=create
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
      "roleCount": 3
    }
  ],
  "total": 1,
  "filters": {
    "applied": ["q=user", "resource=user", "action=create"]
  }
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

// Kullanıcı-rol yönetimi fonksiyonları
export const getUserRoles = (userId) => {
  return api.get(`/admin/users/${userId}/roles`);
};

export const assignUserRoles = (userId, roleIds) => {
  return api.post(`/admin/users/${userId}/roles`, { roleIds });
};

export const removeUserRole = (userId, roleId) => {
  return api.delete(`/admin/users/${userId}/roles/${roleId}`);
};

export const updateUserRoles = (userId, roleIds) => {
  return api.put(`/admin/users/${userId}/roles`, { roleIds });
};

export const getUserPermissions = (userId) => {
  return api.get(`/admin/users/${userId}/permissions`);
};

// RBAC istatistikleri fonksiyonları
export const getRoleStatistics = () => {
  return api.get('/admin/rbac/statistics/roles');
};

export const getPermissionStatistics = () => {
  return api.get('/admin/rbac/statistics/permissions');
};

export const getUserStatistics = () => {
  return api.get('/admin/rbac/statistics/users');
};

// RBAC arama fonksiyonları
export const searchRoles = (params = {}) => {
  return api.get('/admin/rbac/search/roles', { params });
};

export const searchPermissions = (params = {}) => {
  return api.get('/admin/rbac/search/permissions', { params });
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

#### Kullanıcı-Rol İlişkisi
- `"User with id 'uuid' not found"` - Kullanıcı bulunamadı
- `"Some roles not found"` - Bazı roller bulunamadı
- `"Cannot remove last role from user"` - Kullanıcıdan son rol çıkarılamaz
- `"Cannot assign role to system user"` - Sistem kullanıcısına rol atanamaz

#### RBAC İstatistikleri
- `"Statistics not available"` - İstatistikler mevcut değil
- `"Invalid date range"` - Geçersiz tarih aralığı

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
