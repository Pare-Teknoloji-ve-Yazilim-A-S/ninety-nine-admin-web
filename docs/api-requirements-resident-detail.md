# Sakin Detay Sayfası - Eksik API Endpointleri

## 🎯 Genel Bakış
Sakin detay sayfası için yeni tasarım ile birlikte aşağıdaki API endpointleri geliştirilmelidir.

## 📋 Gerekli Endpointler

### 1. Aile Üyeleri Yönetimi

#### 1.1 Aile Üyelerini Listele
```http
GET /admin/residents/{residentId}/family
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "fullName": "string",
      "firstName": "string", 
      "lastName": "string",
      "relationship": "string", // "Eş", "Çocuk", "Anne", "Baba", etc.
      "age": number,
      "birthDate": "string", // ISO date
      "phone": "string",
      "email": "string",
      "isMinor": boolean,
      "profileImage": "string", // URL
      "nationalId": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

#### 1.2 Aile Üyesi Ekle
```http
POST /admin/residents/{residentId}/family
```

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string", 
  "relationship": "string",
  "birthDate": "string",
  "phone": "string",
  "email": "string",
  "nationalId": "string",
  "profileImage": "string"
}
```

#### 1.3 Aile Üyesi Güncelle
```http
PUT /admin/residents/{residentId}/family/{familyMemberId}
```

#### 1.4 Aile Üyesi Sil
```http
DELETE /admin/residents/{residentId}/family/{familyMemberId}
```

---

### 2. Villa Bilgileri

#### 2.1 Villa Bilgilerini Getir
```http
GET /admin/residents/{residentId}/villa
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string", // "VILLA-001"
    "block": "string", // "A Blok"
    "apartment": "string",
    "type": "string", // "Malik", "Kiracı"
    "startDate": "string", // "15.01.2023"
    "endDate": "string",
    "contractNumber": "string", // "KNT-2023-001"
    "contractStatus": "string", // "Aktif", "Sona Erdi", "İptal"
    "monthlyFee": number,
    "deposit": number,
    "unitDetails": {
      "roomCount": number,
      "floor": number,
      "area": number, // m²
      "hasBalcony": boolean,
      "hasGarden": boolean,
      "hasParkingSpace": boolean
    }
  }
}
```

---

### 3. Acil Durum Bilgileri

#### 3.1 Acil Durum Bilgilerini Getir
```http
GET /admin/residents/{residentId}/emergency-contact
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "relationship": "string", // "Eş", "Çocuk", "Anne", etc.
    "phone": "string",
    "alternativePhone": "string",
    "email": "string",
    "address": "string",
    "medicalInfo": {
      "allergies": "string",
      "medications": "string",
      "medicalConditions": "string",
      "bloodType": "string",
      "doctorName": "string",
      "doctorPhone": "string",
      "hospitalPreference": "string"
    },
    "specialNotes": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### 3.2 Acil Durum Bilgilerini Güncelle
```http
PUT /admin/residents/{residentId}/emergency-contact
```

**Request Body:** (Same as response data structure)

---

### 4. QR Kod Yönetimi

#### 4.1 Erişim QR Kodu Oluştur
```http
POST /admin/residents/{residentId}/generate-qr
```

**Request Body:**
```json
{
  "type": "string", // "access", "visitor", "emergency"
  "validUntil": "string", // ISO date, opsiyonel
  "purpose": "string", // "Daimi Erişim", "Ziyaretçi", etc.
  "restrictions": {
    "timeSlots": ["string"], // ["09:00-18:00"]
    "areas": ["string"], // ["pool", "gym", "garden"]
    "maxUsage": number
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": "string", // Base64 encoded QR image
    "qrCodeUrl": "string", // Direct URL to QR image
    "accessToken": "string",
    "validUntil": "string",
    "qrCodeData": "string", // The actual QR code data
    "downloadUrl": "string" // PDF download link
  }
}
```

#### 4.2 QR Kod Geçmişi
```http
GET /admin/residents/{residentId}/qr-codes
```

---

### 5. Ödeme Geçmişi

#### 5.1 Ödeme Geçmişini Getir
```http
GET /admin/residents/{residentId}/payment-history
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `startDate`: string (ISO date)
- `endDate`: string (ISO date)
- `status`: string ("paid", "pending", "overdue")

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "string",
        "date": "string",
        "amount": number,
        "description": "string",
        "type": "string", // "monthly_fee", "maintenance", "penalty"
        "status": "string", // "paid", "pending", "overdue"
        "paymentMethod": "string", // "credit_card", "bank_transfer", "cash"
        "referenceNumber": "string",
        "dueDate": "string",
        "paidDate": "string",
        "createdAt": "string"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    },
    "summary": {
      "totalPaid": number,
      "totalPending": number,
      "totalOverdue": number,
      "lastPaymentDate": "string",
      "nextDueDate": "string"
    }
  }
}
```

---

### 6. Belge Yönetimi

#### 6.1 Tüm Belgeleri Zip Olarak İndir
```http
GET /admin/residents/{residentId}/documents/download-all
```

**Response:** ZIP file download

#### 6.2 Belge Yükle
```http
POST /admin/residents/{residentId}/documents
```

**Request:** Multipart form data
- `file`: File
- `type`: string ("national_id", "ownership_document", "contract", "other")
- `description`: string

---

### 7. Aktivite ve Talep Yönetimi

#### 7.1 Bakım Talebi Oluştur
```http
POST /admin/residents/{residentId}/maintenance-requests
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string", // "plumbing", "electrical", "general"
  "priority": "string", // "low", "medium", "high", "urgent"
  "location": "string", // "kitchen", "bathroom", "living_room"
  "images": ["string"], // Array of image URLs
  "preferredDate": "string",
  "contactPhone": "string"
}
```

#### 7.2 Sakin Aktivite Geçmişi
```http
GET /admin/residents/{residentId}/activity-log
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "type": "string", // "login", "payment", "request", "document_upload"
      "description": "string",
      "details": "object", // Additional details
      "timestamp": "string",
      "ipAddress": "string",
      "userAgent": "string"
    }
  ]
}
```

---

### 8. Erişim Kontrolü

#### 8.1 Erişim Logları
```http
GET /admin/residents/{residentId}/access-logs
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "entryTime": "string",
      "exitTime": "string",
      "accessPoint": "string", // "main_gate", "pool_area", "gym"
      "accessMethod": "string", // "qr_code", "card", "manual"
      "status": "string", // "granted", "denied"
      "notes": "string"
    }
  ]
}
```

---

## 🔧 Geliştirme Notları

### Öncelik Sırası:
1. **Yüksek Öncelik**: Aile üyeleri, Villa bilgileri, Acil durum bilgileri
2. **Orta Öncelik**: QR kod oluşturma, Ödeme geçmişi
3. **Düşük Öncelik**: Aktivite logları, Erişim kontrolü

### Güvenlik Gereksinimleri:
- Tüm endpointler admin authentication gerektirir
- Sensitive data için encryption kullanılmalı
- Rate limiting uygulanmalı
- Audit logging yapılmalı

### Performans Notları:
- Pagination tüm listeleme endpointlerinde zorunlu
- Image upload için file size limits
- Cache stratejisi belirlenmeliş (Redis recommended)

### Test Verileri:
Her endpoint için mock data hazırlanmalı ve test edilmelidir. 