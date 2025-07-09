# 🏠 Daire/Villa Listesi - Bilgi Mimarisi

## 🏗️ Sayfa Yapısı

### 1. **Üst Başlık ve Özet Bilgiler**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Konut Listesi (2,500 toplam)              [+ Yeni Konut] [⬇ İndir] │
│ Dolu: 2,348 (%94) | Boş: 127 (%5) | Bakımda: 25 (%1)             │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. **Hızlı İstatistik Kartları**

```
┌───────────────┬───────────────┬───────────────┬───────────────┐
│ 🏢 Apartman   │ 🏡 Villa      │ 🏪 Ticari     │ 🅿️ Otopark     │
│ 2,100 ünite   │ 350 ünite     │ 50 ünite      │ 1,800 alan    │
│ %95 dolu      │ %91 dolu      │ %88 dolu      │ %76 dolu      │
└───────────────┴───────────────┴───────────────┴───────────────┘
```

## 📊 Filtre ve Arama Sistemi

### **Arama Çubuğu**

```
🔍 [Blok, daire no, sakin adı, telefon veya özellik ile ara...]
```

### **Gelişmiş Filtreler**

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🏠 Konut Özellikleri          💰 Finansal Durum                    │
├─────────────────────────────────────────────────────────────────────┤
│ Konut Tipi:                   Borç Durumu:                         │
│ [✓] Daire                     ( ) Tümü                             │
│ [✓] Villa                     (•) Borçlu olanlar                   │
│ [ ] Ticari                    ( ) Temiz hesaplar                   │
│                               ( ) Ödeme planında                    │
│ Büyüklük:                                                          │
│ [ ] 1+1 (45-65 m²)           Borç Aralığı:                        │
│ [✓] 2+1 (75-95 m²)           Min: [_______] Max: [_______] ₺      │
│ [✓] 3+1 (110-145 m²)                                              │
│ [ ] 4+1 (150+ m²)            📍 Konum                             │
│                               Blok: [Tümü ▼]                       │
│ 👥 Doluluk Durumu             Kat: [Tümü ▼]                       │
│ (•) Tümü                      Yön: [Tümü ▼]                       │
│ ( ) Dolu                                                           │
│ ( ) Boş                       🏷️ Özel Durumlar                     │
│ ( ) Bakımda                   [ ] Deniz manzaralı                  │
│                               [ ] Bahçeli                          │
│                               [ ] Asansörlü                        │
│                               [ ] Engelli erişimli                 │
└─────────────────────────────────────────────────────────────────────┘
```

## 📋 Ana Tablo Görünümü

### **Tablo Başlıkları**

```
│ □ │ Konut │ Tip │ m² │ Sakin │ Durum │ Borç │ Son Ödeme │ İşlemler │
```

### **Örnek Satır Detayları**

```
┌─────────────────────────────────────────────────────────────────────┐
│ □  A-12   Daire  125  Ahmet YILMAZ    🟢 Dolu   0 ₺     15.12   ⋮ │
│    2+1    🛏️3    👤4   Malik          ✓ Temiz          ödedi      │
│                                                                     │
│ □  B-24   Villa  350  --              🔵 Boş    --      --      ⋮ │
│    4+1    🛏️5    🌳    Satılık        30 gün                       │
│                                                                     │
│ □  C-05   Daire  95   Mehmet ÖZKAN    🟡 Bakım  2,500 ₺ 01.11   ⋮ │
│    2+1    🛏️2    👤2   Kiracı         Su tesisatı     gecikmiş    │
└─────────────────────────────────────────────────────────────────────┘
```

### **Satır İçi Bilgiler**

- **Konut Kodu**: Blok-Daire kombinasyonu
- **Alt Bilgi**: Oda sayısı, özel özellikler
- **Sakin Bilgisi**: İsim, tip (Malik/Kiracı), aile sayısı
- **Durum Göstergeleri**:
  - 🟢 Dolu ve aktif
  - 🔵 Boş
  - 🟡 Bakımda
  - 🔴 Sorunlu (borç/dava)
- **Finansal Özet**: Güncel borç, son ödeme

## 🎨 Görünüm Modları

### **1. Tablo Görünümü** (Varsayılan)

Yukarıda detaylandırıldığı gibi

### **2. Kart Görünümü**

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ A-12        │ A-13        │ A-14        │ A-15        │
│ 🏠 3+1      │ 🏠 2+1      │ 🏠 1+1      │ 🏠 3+1      │
│ 125 m²      │ 95 m²       │ 65 m²       │ 125 m²      │
│             │             │             │             │
│ 👤 A.YILMAZ │ 👤 M.KAYA   │ 🔵 BOŞ      │ 👤 F.DEMIR  │
│ ✅ Ödendi   │ ⚠️ 2,500 ₺  │             │ ✅ Ödendi   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### **3. Blok Görünümü**

```
┌─────────────────────────────────────────────────────────┐
│ A BLOK (10 Kat, 40 Daire)          Doluluk: %95       │
├─────────────────────────────────────────────────────────┤
│ Kat 10: [12][11][10][09] - Tümü dolu                  │
│ Kat 9:  [12][11][10][09] - 3 dolu, 1 boş             │
│ Kat 8:  [12][11][10][09] - Tümü dolu                  │
│ ...                                                     │
│                                                         │
│ Özet: 38 Dolu | 2 Boş | 125.000 ₺ toplam borç        │
└─────────────────────────────────────────────────────────┘
```

### **4. Harita Görünümü**

```
┌─────────────────────────────────────────────────────────┐
│                    SİTE HARİTASI                        │
├─────────────────────────────────────────────────────────┤
│   [A BLOK]    [B BLOK]    [C BLOK]                    │
│    (%95)       (%92)       (%98)                      │
│                                                         │
│           [SOSYAL TESİS]                               │
│                                                         │
│   [D BLOK]    [OTOPARK]   [E BLOK]                   │
│    (%90)                   (%88)                      │
│                                                         │
│ [VİLLA BÖLGESİ - 350 ünite]                           │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Hızlı İşlemler

### **Satır Üzeri İşlemler**

```
[👁 Detay] [✏️ Düzenle] [👥 Sakin Ata] [💰 Borç] [📋 Rapor] [⋮]
```

### **Toplu İşlemler**

```
Seçili 15 konut için:
[📧 Toplu Bildirim] [💰 Borç Ata] [📊 Rapor Al] [🏷️ Etiketle]
```

### **Sağ Tık Menüsü**

```
┌─────────────────────────┐
│ Konut Detayları        │
│ Sakin Bilgileri        │
│ ─────────────────      │
│ Borç Ata               │
│ Ödeme Kaydet           │
│ ─────────────────      │
│ Bakıma Al              │
│ Boşalt                 │
│ ─────────────────      │
│ Geçmişi Görüntüle      │
│ Not Ekle               │
└─────────────────────────┘
```

## 📊 Konut Detay Modalı

```
┌─────────────────────────────────────────────────────────────────────┐
│ A Blok, Daire 12 - Detaylar                                  [✕]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ [Genel] [Sakinler] [Finansal] [Bakım] [Belgeler] [Geçmiş]        │
│                                                                     │
│ ───────────────── Konut Bilgileri ─────────────────               │
│ Tip: 3+1 Daire                    Brüt Alan: 145 m²               │
│ Kat: 5                            Net Alan: 125 m²                │
│ Blok: A                           Balkon: 2 adet                  │
│ Oda: 3                            Banyo: 2 adet                   │
│                                                                     │
│ ───────────────── Özellikler ─────────────────                    │
│ ✓ Asansör          ✓ Otopark (2)      ✓ Depo                     │
│ ✓ Güney cephe      ✓ Deniz manzara    ✓ Kapalı mutfak           │
│                                                                     │
│ ───────────────── Sayaç Bilgileri ─────────────────               │
│ Elektrik: 12345678    Su: 87654321    Doğalgaz: 11223344         │
│ Son okuma: 15.12.2024                                             │
│                                                                     │
│ [Düzenle] [Sakin Ata] [Bakıma Al] [Rapor]                        │
└─────────────────────────────────────────────────────────────────────┘
```

## 📈 Analiz Paneli (Sağ Sidebar)

```
┌─────────────────────────────┐
│ 📊 Hızlı Analiz            │
├─────────────────────────────┤
│ Doluluk Oranı              │
│ [████████░░] %94           │
│                            │
│ Konut Tipi Dağılımı        │
│ • 1+1: 420 (%17)          │
│ • 2+1: 840 (%34)          │
│ • 3+1: 840 (%34)          │
│ • 4+1: 250 (%10)          │
│ • Villa: 150 (%5)         │
│                            │
│ Borç Durumu                │
│ • Temiz: 2,100            │
│ • Borçlu: 248             │
│ • Toplam: 4.2M ₺          │
│                            │
│ Son 30 Gün                 │
│ • Yeni dolu: 12           │
│ • Boşalan: 8              │
│ • Bakıma giren: 3         │
└─────────────────────────────┘
```

## 🚀 Performans Özellikleri

### **Yükleme Stratejisi**

- İlk yükleme: 50 kayıt
- Scroll ile lazy loading
- Akıllı önbellekleme
- Virtual scrolling (1000+ kayıt)

### **Filtreleme**

- Client-side anlık filtreleme
- Debounced arama (300ms)
- Filtre kombinasyonlarını kaydetme
- Sık kullanılan filtreler

### **Export Seçenekleri**

- Excel (Detaylı/Özet)
- PDF (Görsel raporlar)
- CSV (Veri analizi)
- Özel rapor şablonları

## 📱 Responsive Tasarım

### **Desktop (1200px+)**

- Tam tablo görünümü
- Yan panel analizler
- Çoklu görünüm modları

### **Tablet (768px-1199px)**

- Sadece temel kolonlar
- Kart görünümü öncelikli
- Touch-friendly işlemler

### **Mobile**

- Sadece arama ve filtre
- Kart listesi
- Swipe aksiyonları

Bu bilgi mimarisi, 2,500 konutun etkin yönetimini sağlayacak, hızlı erişim ve analiz imkanları sunacak şekilde tasarlanmıştır. Kullanıcılar hem detaylı bilgilere ulaşabilecek hem de toplu işlemlerle verimliliği artırabilecektir.
