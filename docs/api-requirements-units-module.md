# 🏠 Units Modülü - API Geliştirme Brief Dokümanı

## 📋 Genel Bakış

Bu doküman, **NinetyNine Admin Web Dashboard** Units (Konutlar) modülü için eksik olan API endpoint'lerinin geliştirilmesi amacıyla hazırlanmıştır.

**Mevcut API Durumu:** `/admin/properties` endpoint'leri mevcut ancak analytics, bulk operations ve advanced filtering özellikleri eksik.

**Hedef:** Daire/Villa listesi sayfasının tüm özelliklerinin API desteğini sağlamak.

---

## 🎯 Öncelik Matrisi

### **🔴 Kritik (Hemen) - Sprint 1**

1. İstatistik ve Analytics Endpoint'leri
2. Dashboard Widget'ları için Quick Stats
3. Borç Analiz Endpoint'leri

### **🟡 Önemli (1-2 Sprint) - Sprint 2-3**

4. Gelişmiş Filtreleme Endpoint'leri
5. Bulk Operations
6. Export/Import İşlemleri

### **🟢 Nice-to-Have (Gelecek) - Sprint 4+**

7. Bakım Yönetimi Entegrasyonu
8. Real-time Notifications
9. Advanced Reporting

---

## 🔴 **KRİTİK ENDPOINT'LER (Sprint 1)**

### 1. **İstatistik ve Analytics**

#### **`GET /admin/properties/statistics`**

```json
{
  "method": "GET",
  "url": "/admin/properties/statistics",
  "description": "Konut modülü için genel istatistikleri döner",
  "parameters": {
    "query": {
      "dateRange": "string (optional) - '30d', '90d', '1y'",
      "propertyGroup": "string (optional) - Blok filtrelemesi"
    }
  },
  "response": {
    "statusCode": 200,
    "data": {
      "totalUnits": "number - Toplam konut sayısı",
      "occupancyRate": "number - Doluluk oranı (0-100)",
      "unitsByType": {
        "RESIDENCE": "number",
        "VILLA": "number",
        "COMMERCIAL": "number",
        "OFFICE": "number"
      },
      "unitsByStatus": {
        "AVAILABLE": "number",
        "OCCUPIED": "number",
        "UNDER_MAINTENANCE": "number",
        "RESERVED": "number"
      },
      "occupancyTrend": {
        "currentMonth": "number",
        "previousMonth": "number",
        "changePercentage": "number"
      }
    }
  }
}
```

#### **`GET /admin/properties/occupancy-stats`**

```json
{
  "method": "GET",
  "url": "/admin/properties/occupancy-stats",
  "description": "Son 30 gün doluluk aktivite istatistikleri",
  "parameters": {
    "query": {
      "days": "number (optional, default: 30) - Kaç günlük veri"
    }
  },
  "response": {
    "statusCode": 200,
    "data": {
      "period": "string - Tarih aralığı",
      "newOccupied": "number - Yeni dolan konut sayısı",
      "vacated": "number - Boşalan konut sayısı",
      "maintenanceStarted": "number - Bakıma giren konut sayısı",
      "maintenanceCompleted": "number - Bakım tamamlanan konut sayısı",
      "dailyStats": [
        {
          "date": "string (YYYY-MM-DD)",
          "occupied": "number",
          "vacated": "number",
          "maintenance": "number"
        }
      ]
    }
  }
}
```

#### **`GET /admin/billing/debt-summary`**

```json
{
  "method": "GET",
  "url": "/admin/billing/debt-summary",
  "description": "Borç durum özeti ve analizi",
  "parameters": {
    "query": {
      "propertyGroup": "string (optional) - Blok filtrelemesi"
    }
  },
  "response": {
    "statusCode": 200,
    "data": {
      "totalDebt": "number - Toplam borç miktarı",
      "debtedUnitsCount": "number - Borçlu konut sayısı",
      "cleanUnitsCount": "number - Temiz hesap konut sayısı",
      "averageDebtPerUnit": "number - Konut başına ortalama borç",
      "debtAging": {
        "0-30days": "number - 0-30 gün arası borç miktarı",
        "31-60days": "number",
        "61-90days": "number",
        "90plus": "number - 90+ gün borç miktarı"
      },
      "topDebtors": [
        {
          "propertyId": "string",
          "propertyNumber": "string",
          "debtAmount": "number",
          "daysPastDue": "number"
        }
      ]
    }
  }
}
```

### 2. **Dashboard Widget'ları**

#### **`GET /admin/properties/quick-stats`**

```json
{
  "method": "GET",
  "url": "/admin/properties/quick-stats",
  "description": "Dashboard için hızlı istatistik kartları",
  "response": {
    "statusCode": 200,
    "data": {
      "apartmentUnits": {
        "total": "number",
        "occupied": "number",
        "occupancyRate": "number"
      },
      "villaUnits": {
        "total": "number",
        "occupied": "number",
        "occupancyRate": "number"
      },
      "commercialUnits": {
        "total": "number",
        "occupied": "number",
        "occupancyRate": "number"
      },
      "parkingSpaces": {
        "total": "number",
        "occupied": "number",
        "occupancyRate": "number"
      }
    }
  }
}
```

#### **`GET /admin/properties/recent-activities`**

```json
{
  "method": "GET",
  "url": "/admin/properties/recent-activities",
  "description": "Son aktiviteler (durum değişiklikleri, yeni eklemeler)",
  "parameters": {
    "query": {
      "limit": "number (optional, default: 20)",
      "days": "number (optional, default: 7)"
    }
  },
  "response": {
    "statusCode": 200,
    "data": [
      {
        "id": "string",
        "propertyId": "string",
        "propertyNumber": "string",
        "activityType": "string - 'STATUS_CHANGED', 'OWNER_ASSIGNED', 'TENANT_ASSIGNED', 'CREATED'",
        "description": "string - Aktivite açıklaması",
        "oldValue": "string (optional)",
        "newValue": "string (optional)",
        "performedBy": {
          "id": "string",
          "name": "string"
        },
        "createdAt": "string (ISO date)"
      }
    ]
  }
}
```

---

## 🟡 **ÖNEMLİ ENDPOINT'LER (Sprint 2-3)**

### 3. **Gelişmiş Filtreleme**

#### **`GET /admin/properties/by-block/{blockNumber}`**

```json
{
  "method": "GET",
  "url": "/admin/properties/by-block/{blockNumber}",
  "description": "Belirli blok konutlarını getirir",
  "parameters": {
    "path": {
      "blockNumber": "string - Blok numarası/adı"
    },
    "query": {
      "includeStats": "boolean (optional) - Blok istatistiklerini dahil et"
    }
  },
  "response": {
    "statusCode": 200,
    "data": {
      "blockInfo": {
        "blockNumber": "string",
        "totalUnits": "number",
        "occupiedUnits": "number",
        "totalFloors": "number"
      },
      "properties": "Array<ResponsePropertyDto>",
      "stats": {
        "occupancyByFloor": [
          {
            "floor": "number",
            "total": "number",
            "occupied": "number"
          }
        ]
      }
    }
  }
}
```

#### **`GET /admin/properties/filter-options`**

```json
{
  "method": "GET",
  "url": "/admin/properties/filter-options",
  "description": "Filtreleme için mevcut seçenekleri döner",
  "response": {
    "statusCode": 200,
    "data": {
      "blocks": ["string"] - Mevcut bloklar,
      "floors": {
        "min": "number",
        "max": "number"
      },
      "areaRanges": {
        "min": "number",
        "max": "number"
      },
      "roomCounts": ["string"] - Mevcut oda sayıları,
      "propertyGroups": ["string"]
    }
  }
}
```

### 4. **Bulk Operations**

#### **`POST /admin/properties/bulk-update`**

```json
{
  "method": "POST",
  "url": "/admin/properties/bulk-update",
  "description": "Çoklu konut güncelleme işlemi",
  "requestBody": {
    "propertyIds": ["string"] - Güncellenecek konut ID'leri,
    "updates": {
      "status": "string (optional)",
      "propertyGroup": "string (optional)",
      "ownerId": "string (optional)",
      "tenantId": "string (optional)"
    }
  },
  "response": {
    "statusCode": 200,
    "data": {
      "successCount": "number",
      "failedCount": "number",
      "errors": [
        {
          "propertyId": "string",
          "error": "string"
        }
      ]
    }
  }
}
```

#### **`POST /admin/properties/bulk-assign-tenants`**

```json
{
  "method": "POST",
  "url": "/admin/properties/bulk-assign-tenants",
  "description": "Toplu kiracı atama",
  "requestBody": {
    "assignments": [
      {
        "propertyId": "string",
        "tenantId": "string",
        "startDate": "string (ISO date)",
        "endDate": "string (optional, ISO date)"
      }
    ]
  },
  "response": {
    "statusCode": 200,
    "data": {
      "successCount": "number",
      "failedCount": "number",
      "errors": ["object"]
    }
  }
}
```

### 5. **Export/Import İşlemleri**

#### **`GET /admin/properties/export`**

```json
{
  "method": "GET",
  "url": "/admin/properties/export",
  "description": "Konut listesi export işlemi",
  "parameters": {
    "query": {
      "format": "string - 'excel', 'csv', 'pdf'",
      "filters": "string (optional) - JSON stringified filters",
      "columns": "string (optional) - Dahil edilecek kolonlar"
    }
  },
  "response": {
    "statusCode": 200,
    "headers": {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=properties_export.xlsx"
    }
  }
}
```

#### **`POST /admin/properties/import`**

```json
{
  "method": "POST",
  "url": "/admin/properties/import",
  "description": "Toplu konut import işlemi",
  "requestBody": {
    "type": "multipart/form-data",
    "fields": {
      "file": "File - Excel/CSV dosyası",
      "options": {
        "updateExisting": "boolean - Mevcut kayıtları güncelle",
        "skipErrors": "boolean - Hatalı satırları atla"
      }
    }
  },
  "response": {
    "statusCode": 200,
    "data": {
      "totalRows": "number",
      "successCount": "number",
      "errorCount": "number",
      "errors": [
        {
          "row": "number",
          "error": "string",
          "data": "object"
        }
      ]
    }
  }
}
```

---

## 🟢 **GELECEK ENDPOINT'LER (Sprint 4+)**

### 6. **Bakım Yönetimi**

#### **`POST /admin/properties/{id}/maintenance`**

```json
{
  "method": "POST",
  "url": "/admin/properties/{id}/maintenance",
  "description": "Konutu bakıma alma",
  "requestBody": {
    "reason": "string - Bakım sebebi",
    "estimatedDuration": "number - Tahmini süre (gün)",
    "priority": "string - 'LOW', 'MEDIUM', 'HIGH'",
    "description": "string",
    "assignedTo": "string (optional) - Sorumlu kişi ID"
  }
}
```

#### **`DELETE /admin/properties/{id}/maintenance`**

```json
{
  "method": "DELETE",
  "url": "/admin/properties/{id}/maintenance",
  "description": "Konutu bakımdan çıkarma",
  "requestBody": {
    "completionNotes": "string",
    "actualDuration": "number"
  }
}
```

### 7. **Advanced Reporting**

#### **`GET /admin/properties/reports/occupancy-trends`**

```json
{
  "method": "GET",
  "url": "/admin/properties/reports/occupancy-trends",
  "description": "Detaylı doluluk trend raporu",
  "parameters": {
    "query": {
      "startDate": "string (ISO date)",
      "endDate": "string (ISO date)",
      "groupBy": "string - 'daily', 'weekly', 'monthly'"
    }
  }
}
```

---

## 🛠️ **Teknik Gereksinimler**

### **Authentication & Authorization**

- Tüm endpoint'ler `Bearer Token` authentication gerektirir
- Admin yetkisi kontrolü (`@RequirePermissions('admin:properties:read|write')`)
- Rate limiting: 100 request/minute per user

### **Response Format Standardı**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### **Error Handling**

```json
{
  "success": false,
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "Invalid request parameters",
  "details": [
    {
      "field": "propertyId",
      "message": "Property ID is required"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### **Pagination Standard**

- Default: `page=1, limit=10`
- Maximum limit: `100`
- Response format: `{ data: [], pagination: {} }`

### **Caching Strategy**

- Statistics endpoint'leri: `5 minutes TTL`
- Filter options: `1 hour TTL`
- Property list: `1 minute TTL`
- Redis cache kullanımı önerilir

---

## 📊 **Veritabanı Considerations**

### **İndeksler**

```sql
-- Performans için gerekli indeksler
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_block ON properties(block_number);
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_tenant ON properties(tenant_id);
CREATE INDEX idx_properties_created_at ON properties(created_at);

-- Kompozit indeksler
CREATE INDEX idx_properties_status_type ON properties(status, type);
CREATE INDEX idx_properties_block_floor ON properties(block_number, floor);
```

### **Yeni Tablolar (Gerekirse)**

```sql
-- Property activities tracking
CREATE TABLE property_activities (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  old_value JSONB,
  new_value JSONB,
  performed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Maintenance records
CREATE TABLE property_maintenance (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  status VARCHAR(20) DEFAULT 'ACTIVE',
  assigned_to UUID REFERENCES users(id),
  started_at TIMESTAMP DEFAULT NOW(),
  estimated_completion TIMESTAMP,
  completed_at TIMESTAMP,
  completion_notes TEXT
);
```

---

## 🚀 **Implementation Timeline**

### **Sprint 1 (1-2 hafta)**

- [ ] `GET /admin/properties/statistics`
- [ ] `GET /admin/properties/occupancy-stats`
- [ ] `GET /admin/billing/debt-summary`
- [ ] `GET /admin/properties/quick-stats`

### **Sprint 2 (2-3 hafta)**

- [ ] `GET /admin/properties/recent-activities`
- [ ] `GET /admin/properties/by-block/{blockNumber}`
- [ ] `GET /admin/properties/filter-options`
- [ ] `POST /admin/properties/bulk-update`

### **Sprint 3 (2-3 hafta)**

- [ ] `POST /admin/properties/bulk-assign-tenants`
- [ ] `GET /admin/properties/export`
- [ ] `POST /admin/properties/import`

### **Sprint 4+ (Gelecek)**

- [ ] Bakım yönetimi endpoint'leri
- [ ] Advanced reporting
- [ ] Real-time features

---

## 📋 **Testing Requirements**

### **Unit Tests**

- Her endpoint için pozitif/negatif test case'ler
- Input validation testleri
- Authorization testleri

### **Integration Tests**

- Database integration testleri
- External service testleri
- Performance testleri

### **Performance Benchmarks**

- Statistics endpoint'leri: `< 500ms`
- List endpoint'leri: `< 1000ms`
- Export işlemleri: `< 5 seconds` (small datasets)

---

## 📞 **İletişim & Support**

**Frontend Developer:**

- UI integration için koordinasyon
- Response format feedback

**DevOps:**

- Caching setup (Redis)
- Database optimization
- API rate limiting

**QA Team:**

- Test case preparation
- Acceptance criteria validation

---

## 📝 **Notes & Assumptions**

1. **Existing Property Schema:** Mevcut `properties` tablosu şemasının yeterli olduğu varsayılıyor
2. **User Permissions:** Admin/Manager seviyesinde yetki kontrolü
3. **Performance:** 10K+ konut verisi ile test edilmeli
4. **Scalability:** Future microservice migration uyumlu olmalı
5. **Mobile Support:** API response'lar mobile app ile uyumlu olmalı

---

**Son Güncelleme:** 2024-01-15  
**Doküman Versiyonu:** 1.0  
**Hazırlayan:** AI Assistant  
**İncelenmeli:** Backend Lead Developer
