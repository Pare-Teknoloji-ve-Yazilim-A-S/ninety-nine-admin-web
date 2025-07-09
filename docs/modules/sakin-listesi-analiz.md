# Sakin Listesi Modülü - Analiz Raporu

## Dosya Konumu
`src/app/dashboard/residents/page.tsx`

## Mevcut Aksiyonlar

### 1. Üst Seviye Aksiyonlar
- **Yenile** - Listeyi güncelleme
- **İndir** - Veriyi dışa aktarma
- **Yeni Sakin** - Yeni sakin ekleme

### 2. Arama ve Filtreleme
- **Arama** - Ad, soyad, TC/pasaport, telefon, daire no ile arama
- **Gelişmiş Filtre** - Detaylı filtreleme seçenekleri
- **Gruplama** - Veriyi gruplandırma

### 3. Toplu İşlemler
- **Toplu Mail** - Seçili sakinlere mail gönderme
- **SMS Gönder** - Seçili sakinlere SMS gönderme
- **PDF Oluştur** - Seçili verileri PDF'e aktarma
- **Etiket Ata** - Seçili sakinlere etiket atama

### 4. Satır Bazlı İşlemler
- **Görüntüle** (Eye icon)
- **Düzenle** (Edit icon)
- **Mesaj Gönder** (MessageSquare icon)
- **Diğer İşlemler** (MoreVertical icon)
- **Telefon Et** (Phone icon)

### 5. Görünüm Kontrolleri
- **Sayfa başına kayıt sayısı** (25/50/100)
- **Grid görünümü**
- **Liste görünümü**
- **Katmanlı görünüm**

## Eksik Olabilecek Aksiyonlar

1. **Sakin Silme** - Trash2 icon import edilmiş ama kullanılmamış
2. **Dışa Aktarma Formatları** - Excel, CSV seçenekleri
3. **Yazdırma** - Print işlevi
4. **Sakin Durumu Değiştirme** - Aktif/Pasif yapma
5. **Not Ekleme** - Sakinle ilgili not tutma
6. **Belge Yönetimi** - Sakin belgeleri
7. **Ödeme Geçmişi** - Borç detayı görüntüleme
8. **Sakin Geçmişi** - Log/aktivite takibi
9. **QR Kod** - Sakin kartı oluşturma
10. **Toplu Durum Güncelleme** - Seçili sakinlerin durumunu değiştirme

## Reusable Component Önerileri

### Mevcut Kullanılan Componentler
- **ProtectedRoute** - Auth koruması
- **DashboardHeader** - Sayfa başlığı ve breadcrumb
- **Sidebar** - Sol menü
- **Card** - Kart container
- **Button** - Buton komponenti
- **Badge** - Durum/tip gösterimi

### Oluşturulabilecek Reusable Componentler

#### 1. SearchBar Component
```typescript
interface SearchBarProps {
  placeholder: string;
  onSearch: (value: string) => void;
  icon?: React.ComponentType;
}
```

#### 2. StatsCard Component
```typescript
interface StatsCardProps {
  value: number | string;
  label: string;
  percentage?: string;
  color?: string;
}
```

#### 3. BulkActionsBar Component
```typescript
interface BulkActionsBarProps {
  selectedCount: number;
  actions: Array<{
    label: string;
    icon: React.ComponentType;
    onClick: () => void;
  }>;
}
```

#### 4. DataTable Component
```typescript
interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowAction: (action: string, row: any) => void;
  selectable?: boolean;
  pagination?: PaginationProps;
}
```

#### 5. TablePagination Component
```typescript
interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
}
```

#### 6. ViewToggle Component
```typescript
interface ViewToggleProps {
  views: ['grid', 'list', 'layers'];
  activeView: string;
  onViewChange: (view: string) => void;
}
```

#### 7. ResidentRow Component
```typescript
interface ResidentRowProps {
  resident: Resident;
  onAction: (action: string) => void;
  selectable?: boolean;
}
```

#### 8. FilterPanel Component
```typescript
interface FilterPanelProps {
  filters: Filter[];
  onApply: (filters: any) => void;
  onReset: () => void;
}
```

## Sayfa Yapısı ve İstatistikler

### Mevcut İstatistikler
- **Toplam Sakin**: 2,348 aktif
- **Malik**: 1,856 (%79)
- **Kiracı**: 492 (%21)
- **Borçlu**: 287 (%12)
- **Gold Üye**: 156 (%7)

### Tablo Kolonları
- Fotoğraf
- Ad Soyad (TC/pasaport ile)
- Konut (Blok - Daire no, daire tipi)
- Tip (Malik/Kiracı)
- Telefon (arama butonu ile)
- Borç (₺ tutarı)
- Durum (Aktif/Beklemede)
- İşlemler (Görüntüle, Düzenle, Mesaj, Diğer)

## Geliştirme Önerileri

1. **Component Ayrıştırma**: Büyük sayfa componentini daha küçük, yeniden kullanılabilir componentlere ayırın
2. **State Management**: Sakin verilerini ve filtreleri yönetmek için uygun state management çözümü
3. **API Integration**: Gerçek veri entegrasyonu için service layer kullanımı
4. **Responsive Design**: Mobil uyumluluğu artırma
5. **Accessibility**: Klavye navigasyonu ve screen reader desteği
6. **Performance**: Büyük veri setleri için virtual scrolling veya infinite scroll
7. **Error Handling**: Hata durumlarında kullanıcı dostu mesajlar

## Tarih
Analiz Tarihi: 2025-07-08