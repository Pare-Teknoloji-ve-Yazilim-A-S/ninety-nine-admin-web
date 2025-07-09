# 99Club Admin Panel - Dashboard Bilgi Mimarisi

## 🏗️ Dashboard Ana Yapısı

### 1. **Üst Navigasyon Barı**

- **Logo & Proje Adı** (Sol üst)
- **Arama Çubuğu** (Global arama: sakinler, daireler, ödemeler)
- **Bildirim İkonu** (Yeni başvurular, kritik uyarılar)
- **Kullanıcı Profili** (Çıkış, ayarlar, profil)
- **Dil Seçimi** (TR/EN/AR)

### 2. **Sol Yan Menü (Sidebar)**

```
📊 Dashboard (Ana Sayfa)
👥 Sakinler
   └─ Sakin Listesi
   └─ Yeni Sakin Ekle
   └─ Onay Bekleyenler
🏠 Konutlar
   └─ Daire/Villa Listesi
   └─ Boş Konutlar
   └─ Bakım Durumu
💰 Finansal İşlemler
   └─ Aidat Takibi
   └─ Ödeme Geçmişi
   └─ Borç Raporları
   └─ Fatura Yönetimi
📢 Duyurular
   └─ Aktif Duyurular
   └─ Yeni Duyuru
   └─ Duyuru Arşivi
🔧 Hizmet Talepleri
   └─ Açık Talepler
   └─ İşlem Bekleyenler
   └─ Tamamlananlar
📈 Raporlar
   └─ Mali Raporlar
   └─ Doluluk Raporları
   └─ Hizmet Raporları
⚙️ Ayarlar
   └─ Site Bilgileri
   └─ Kullanıcı Yönetimi
   └─ Sistem Ayarları
```

### 3. **Dashboard Ana İçerik Alanı**

#### **Özet Kartları (Top Metrics)**

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Toplam      │ Dolu        │ Bu Ay       │ Açık        │
│ Konut       │ Konutlar    │ Tahsilat    │ Talepler    │
│ 2,500       │ 2,350       │ ₺4.2M       │ 47          │
│             │ (%94)       │ ↑ %12       │ ↓ %8        │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

#### **Kritik Bilgi Alanları**

**Sol Kolon (60%)**

- **Aidat Tahsilat Grafiği** (Son 6 ay trendi)
- **Son İşlemler Tablosu**
  - Tarih | İşlem Tipi | Konut No | Tutar | Durum
- **Bakım/Arıza Talepleri**
  - Acil (Kırmızı badge)
  - Normal (Sarı badge)
  - Düşük öncelik (Yeşil badge)

**Sağ Kolon (40%)**

- **Hızlı İşlemler**
  - [+ Yeni Duyuru]
  - [+ Ödeme Kaydı]
  - [+ Sakin Ekle]
  - [+ Talep Oluştur]
- **Doluluk Haritası** (Bloklar bazında görsel)
- **Bugünün Ajandası**
  - Planlı bakımlar
  - Randevular
  - Önemli tarihler
- **Son Aktiviteler Feed**
  - Yeni kayıtlar
  - Sistem logları
  - Kullanıcı işlemleri

### 4. **Alt Bilgi Çubuğu (Footer)**

- Sistem durumu (Online/Offline sakin sayısı)
- Son yedekleme zamanı
- Versiyon bilgisi
- Destek linki

## 📐 Responsive Tasarım Notları

### Desktop (1920px+)

- 3 kolonlu grid yapısı
- Tam genişlikte grafikler
- Detaylı tablolar

### Tablet (768px-1024px)

- 2 kolonlu grid
- Collapse olan yan menü
- Dokunmatik optimizasyon

### Mobile (Yönetici Acil Erişim)

- Tek kolon
- Kritik metriklere öncelik
- Hamburger menü
- Swipe navigasyon

## 🎨 UI Öncelikleri

1. **Renk Kodlaması**

   - Yeşil: Tamamlanan/Ödenen
   - Sarı: Bekleyen/Uyarı
   - Kırmızı: Acil/Gecikmiş
   - Mavi: Bilgi/Normal

2. **Tipografi Hiyerarşisi**

   - H1: Dashboard başlıkları
   - H2: Bölüm başlıkları
   - Body: Veri ve açıklamalar
   - Caption: Tarih, badge, küçük notlar

3. **İnteraktif Elementler**
   - Hover durumları
   - Loading states
   - Empty states
   - Error states

## 🔄 Veri Yenileme Stratejisi

- **Gerçek Zamanlı**: Kritik uyarılar, acil talepler
- **5 Dakika**: Finansal özet, doluluk oranı
- **15 Dakika**: Grafikler, raporlar
- **Manuel**: Detaylı raporlar

Bu bilgi mimarisi, yöneticilerin site operasyonlarını etkin bir şekilde takip etmelerini ve hızlı aksiyonlar almalarını sağlayacak şekilde tasarlanmıştır.
