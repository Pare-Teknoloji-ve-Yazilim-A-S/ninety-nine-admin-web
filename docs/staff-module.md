# Staff Management Module

Bu dokümantasyon, Ninety Nine Admin Web uygulamasının Personel Yönetimi modülünü açıklamaktadır.

## Genel Bakış

Personel Yönetimi modülü, şirket çalışanlarının, departmanların ve pozisyonların yönetimini sağlayan kapsamlı bir sistemdir. Modern React teknolojileri kullanılarak geliştirilmiş olup, kullanıcı dostu arayüz ve güçlü özellikler sunar.

## Özellikler

### 🧑‍💼 Personel Yönetimi
- Personel CRUD işlemleri (Oluştur, Oku, Güncelle, Sil)
- Detaylı personel profilleri
- Personel durumu yönetimi (Aktif, Pasif, İzinli, vb.)
- Çalışma türü yönetimi (Tam zamanlı, Yarı zamanlı, Sözleşmeli, vb.)
- Acil durum iletişim bilgileri
- Personel fotoğrafı yükleme
- Personel notları

### 🏢 Departman Yönetimi
- Departman CRUD işlemleri
- Departman hiyerarşisi
- Departman bütçe takibi
- Departman istatistikleri
- Personel transfer işlemleri

### 💼 Pozisyon Yönetimi
- Pozisyon CRUD işlemleri
- Maaş aralığı tanımlama
- Pozisyon gereksinimleri
- Pozisyon seviyeleri
- Maksimum kadro sayısı

### 📊 Raporlama ve İstatistikler
- Personel istatistikleri
- Departman dağılımı
- Maaş analizleri
- Son işe alımlar
- Performans metrikleri

### 🔍 Gelişmiş Filtreleme ve Arama
- Çoklu filtre seçenekleri
- Hızlı filtreler
- Kaydedilmiş filtreler
- Gelişmiş arama
- Tarih aralığı filtreleri

### 📤 İçe/Dışa Aktarma
- Excel formatında dışa aktarma
- Toplu personel içe aktarma
- Filtre konfigürasyonları dışa aktarma

### ⚡ Toplu İşlemler
- Toplu aktivasyon/deaktivasyon
- Toplu silme
- Toplu rol atama
- Toplu departman değişikliği

## Teknik Mimari

### Dosya Yapısı

```
src/
├── app/
│   └── staff/
│       ├── page.tsx              # Ana staff sayfası
│       ├── layout.tsx            # Staff layout
│       └── [id]/
│           └── page.tsx          # Staff detay sayfası
├── components/
│   └── staff/
│       ├── StaffCard.tsx         # Personel kartı bileşeni
│       ├── StaffList.tsx         # Personel listesi bileşeni
│       ├── StaffForm.tsx         # Personel formu bileşeni
│       ├── StaffFilters.tsx      # Filtreleme bileşeni
│       ├── StaffStats.tsx        # İstatistikler bileşeni
│       ├── DepartmentCard.tsx    # Departman kartı bileşeni
│       ├── PositionCard.tsx      # Pozisyon kartı bileşeni
│       └── index.ts              # Export dosyası
├── hooks/
│   ├── useStaff.ts              # Personel veri yönetimi hook'u
│   ├── useStaffActions.ts       # Personel işlemleri hook'u
│   ├── useStaffFilters.ts       # Filtreleme hook'u
│   ├── useDepartments.ts        # Departman hook'u
│   ├── usePositions.ts          # Pozisyon hook'u
│   └── index.ts                 # Export dosyası
├── services/
│   ├── staff.service.ts         # Staff API servisi
│   └── types/
│       ├── staff.types.ts       # Personel tipleri
│       ├── department.types.ts  # Departman tipleri
│       └── ui.types.ts          # UI tipleri
└── docs/
    └── staff-module.md          # Bu dokümantasyon
```

### Kullanılan Teknolojiler

- **React 18**: Modern React özellikleri
- **Next.js 14**: App Router ile
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI bileşenleri
- **React Hook Form**: Form yönetimi
- **Zod**: Schema validasyonu
- **Zustand**: State yönetimi (gerektiğinde)
- **Lucide React**: İkonlar

## Kullanım Kılavuzu

### Personel Ekleme

1. Staff sayfasına gidin (`/staff`)
2. "Yeni Personel" butonuna tıklayın
3. Formu doldurun:
   - Kişisel bilgiler (Ad, Soyad, E-posta, Telefon)
   - İş bilgileri (Departman, Pozisyon, Yönetici)
   - Acil durum iletişim bilgileri
   - Notlar (opsiyonel)
4. "Kaydet" butonuna tıklayın

### Personel Düzenleme

1. Personel listesinde düzenlemek istediğiniz personeli bulun
2. Personel kartındaki "Düzenle" butonuna tıklayın
3. Gerekli değişiklikleri yapın
4. "Güncelle" butonuna tıklayın

### Filtreleme ve Arama

1. Sayfanın üst kısmındaki filtre alanını kullanın
2. Arama kutusuna personel adı, e-posta veya telefon yazın
3. Durum, çalışma türü, departman gibi filtreleri seçin
4. Tarih aralığı filtrelerini kullanın
5. "Filtrele" butonuna tıklayın

### Toplu İşlemler

1. Listede işlem yapmak istediğiniz personelleri seçin
2. Sayfanın üst kısmında beliren toplu işlemler menüsünü kullanın
3. İstediğiniz işlemi seçin (Aktifleştir, Pasifleştir, Sil, vb.)
4. Onay verin

## API Entegrasyonu

### Staff Service

```typescript
import { staffService } from '@/services'

// Personel listesi getir
const staff = await staffService.getAll({
  page: 1,
  limit: 20,
  status: 'active'
})

// Personel oluştur
const newStaff = await staffService.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  departmentId: 'dept-1',
  positionId: 'pos-1'
})

// Personel güncelle
const updatedStaff = await staffService.update('staff-1', {
  status: 'inactive'
})
```

### Hooks Kullanımı

```typescript
import { useStaff, useStaffActions } from '@/hooks'

function StaffComponent() {
  const {
    staff,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    refreshStaff
  } = useStaff()

  const {
    createStaff,
    updateStaff,
    deleteStaff,
    loading: actionsLoading
  } = useStaffActions()

  // Component logic here
}
```

## Tip Tanımları

### Staff Interface

```typescript
interface Staff extends User, BaseEntity {
  employeeId: string
  departmentId: string
  department?: Department
  positionId: string
  position?: Position
  managerId?: string
  manager?: Staff
  status: StaffStatus
  employmentType: EmploymentType
  hireDate: string
  terminationDate?: string
  salary?: number
  emergencyContact?: EmergencyContact
  notes?: string
}
```

### Department Interface

```typescript
interface Department extends BaseEntity {
  name: string
  code: string
  description?: string
  managerId?: string
  manager?: Staff
  parentId?: string
  parent?: Department
  children?: Department[]
  location?: string
  budget?: number
  status: 'active' | 'inactive'
}
```

### Position Interface

```typescript
interface Position extends BaseEntity {
  title: string
  code: string
  description?: string
  departmentId: string
  department?: Department
  level: number
  minSalary?: number
  maxSalary?: number
  requirements?: string[]
  maxHeadcount?: number
  currentHeadcount: number
  status: 'active' | 'inactive'
}
```

## Performans Optimizasyonları

- **React.memo**: Gereksiz re-render'ları önlemek için
- **useCallback**: Fonksiyon referanslarını optimize etmek için
- **useMemo**: Pahalı hesaplamaları cache'lemek için
- **Lazy Loading**: Büyük listelerde performans için
- **Virtual Scrolling**: Çok sayıda kayıt için
- **Debounced Search**: Arama performansı için

## Güvenlik

- **Input Validation**: Zod schema ile
- **XSS Protection**: Sanitized inputs
- **CSRF Protection**: Token-based
- **Role-based Access**: Yetki kontrolü
- **Data Encryption**: Hassas veriler için

## Test Stratejisi

### Unit Tests
- Component testleri
- Hook testleri
- Service testleri
- Utility function testleri

### Integration Tests
- API entegrasyon testleri
- Form submission testleri
- Navigation testleri

### E2E Tests
- Kullanıcı senaryoları
- Kritik iş akışları

## Gelecek Geliştirmeler

- [ ] Personel performans değerlendirme sistemi
- [ ] İzin yönetimi sistemi
- [ ] Bordro entegrasyonu
- [ ] Organizasyon şeması görselleştirme
- [ ] Mobil uygulama desteği
- [ ] Real-time bildirimler
- [ ] Advanced analytics dashboard
- [ ] AI-powered insights

## Sorun Giderme

### Yaygın Sorunlar

1. **Personel listesi yüklenmiyor**
   - API bağlantısını kontrol edin
   - Network sekmesinde hata mesajlarını inceleyin
   - Token'ın geçerli olduğundan emin olun

2. **Form validasyon hataları**
   - Zod schema tanımlarını kontrol edin
   - Required field'ların dolu olduğundan emin olun
   - Email formatının doğru olduğunu kontrol edin

3. **Filtreleme çalışmıyor**
   - Filter state'ini kontrol edin
   - API endpoint'inin filter parametrelerini desteklediğinden emin olun
   - URL query parameters'ı kontrol edin

### Debug İpuçları

- React Developer Tools kullanın
- Network sekmesini inceleyin
- Console log'larını kontrol edin
- Redux DevTools (eğer kullanılıyorsa)

## Katkıda Bulunma

1. Feature branch oluşturun
2. Değişikliklerinizi yapın
3. Test yazın
4. Dokümantasyonu güncelleyin
5. Pull request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.