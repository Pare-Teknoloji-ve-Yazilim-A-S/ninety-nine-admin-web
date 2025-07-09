# ⏳ Onay Bekleyenler - Sayfa Bilgi Mimarisi

## 🏗️ Sayfa Yapısı

### 1. **Üst Başlık ve Özet Bilgiler**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Onay Bekleyen Sakinler (47)                       [🔄 Yenile]      │
│ Son 24 saat: 12 | Bu hafta: 28 | Bu ay: 47                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. **Kritik Uyarılar Bölümü**

```
┌─────────────────────────────────────────────────────────────────────┐
│ ⚠️ DİKKAT GEREKTİRENLER                                           │
├─────────────────────────────────────────────────────────────────────┤
│ 🔴 3 başvuru 48 saatten uzun süredir bekliyor                     │
│ 🟡 5 başvuruda eksik belge var                                    │
│ 🔵 2 başvuru mükerrer kayıt uyarısı içeriyor                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 📊 Ana İçerik Alanı

### **Filtre ve Arama**

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🔍 [İsim, TC, telefon veya daire no ile ara...]                   │
│                                                                     │
│ Hızlı Filtreler:                                                   │
│ [Tümü (47)] [Bugün (12)] [Eksik Belge (5)] [Çift Kayıt (2)]      │
│                                                                     │
│ Sıralama: [En Yeni ▼] [En Eski] [Blok Sırası] [Öncelik]          │
└─────────────────────────────────────────────────────────────────────┘
```

### **Onay Bekleyen Kartları**

```
┌─────────────────────────────────────────────────────────────────────┐
│ □ Mehmet ÖZKAN                            🔴 2 gün 14 saat bekliyor│
│ ┌─────────────────┬─────────────────────────────────────────────┐ │
│ │ 📷              │ TC: 12345***901                             │ │
│ │ [Fotoğraf]      │ 📱: 0532 123 45 67                         │ │
│ │                 │ 🏠: B Blok, Daire 24 (Kiracı)              │ │
│ │                 │ Kayıt: 06.01.2025 14:30                    │ │
│ └─────────────────┴─────────────────────────────────────────────┘ │
│                                                                     │
│ ⚠️ Uyarılar:                                                       │
│ • Kira sözleşmesi yüklenmemiş                                     │
│ • Malik onayı bekleniyor (Ali YILMAZ)                            │
│                                                                     │
│ [✓ Onayla] [✕ Reddet] [💬 Not Ekle] [📧 Bilgi İste] [👁 İncele]  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ □ Fatma KAYA                              🟡 18 saat bekliyor     │
│ ┌─────────────────┬─────────────────────────────────────────────┐ │
│ │ 📷              │ TC: 98765***210                             │ │
│ │ [Fotoğraf]      │ 📱: 0555 987 65 43                         │ │
│ │                 │ 🏠: A Blok, Daire 8 (Malik)                │ │
│ │ ✓               │ Kayıt: 07.01.2025 09:15                    │ │
│ └─────────────────┴─────────────────────────────────────────────┘ │
│                                                                     │
│ ✅ Tüm belgeler tam                                                │
│ 📎 Eklenen: Tapu, Kimlik, İkametgah                              │
│                                                                     │
│ [✓ Onayla] [✕ Reddet] [💬 Not Ekle] [👁 İncele]                  │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔍 Detaylı İnceleme Modalı

```
┌─────────────────────────────────────────────────────────────────────┐
│ Başvuru İnceleme - Mehmet ÖZKAN                             [✕]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ [Kişisel] [Konut] [Belgeler] [Kontroller] [Notlar]               │
│                                                                     │
│ ─────────────────── Kişisel Bilgiler ─────────────────────        │
│ TC Kimlik No: 12345678901 ✓ (MERNİS doğrulandı)                  │
│ Ad Soyad: Mehmet ÖZKAN                                            │
│ Doğum: 15.03.1985 - İstanbul                                     │
│ Tel: 0532 123 45 67 (WhatsApp ✓)                                 │
│ E-posta: mehmet.ozkan@email.com                                   │
│                                                                     │
│ ─────────────────── Konut Bilgileri ─────────────────────         │
│ Talep Edilen: B Blok, Daire 24                                    │
│ Konut Durumu: Dolu (Malik: Ali YILMAZ)                           │
│ Sakin Tipi: Kiracı                                                │
│ Kira Başlangıç: 15.01.2025                                       │
│                                                                     │
│ ─────────────────── Sistem Kontrolleri ─────────────────────      │
│ ✓ TC kimlik geçerli                                               │
│ ✓ Yaş uygun (18+)                                                │
│ ⚠️ Malik onayı bekleniyor                                         │
│ ❌ Kira sözleşmesi eksik                                          │
│ ✓ Mükerrer kayıt yok                                             │
│                                                                     │
│ [✓ Onayla] [✕ Reddet] [⏸ Beklet] [📧 Bilgi İste]                │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎯 Toplu İşlem Özellikleri

### **Toplu Onaylama**

```
┌─────────────────────────────────────────────────────────────────────┐
│ 5 başvuru seçildi                                                  │
│                                                                     │
│ Toplu İşlem:                                                       │
│ [✓ Tümünü Onayla] [✕ Tümünü Reddet] [📧 Toplu Bilgi İste]       │
│                                                                     │
│ ⚠️ Dikkat: 2 başvuruda eksik belge var. Yine de onaylansın mı?   │
└─────────────────────────────────────────────────────────────────────┘
```

## 📋 İşlem Formları

### **Onaylama Formu**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Başvuru Onaylama                                            [✕]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Mehmet ÖZKAN - B Blok, Daire 24                                   │
│                                                                     │
│ Onay Seçenekleri:                                                 │
│ (•) Tam onay - Tüm haklara sahip                                 │
│ ( ) Şartlı onay - Kısıtlı erişim                                 │
│ ( ) Geçici onay - 30 gün deneme süresi                           │
│                                                                     │
│ Otomatik İşlemler:                                                │
│ [✓] QR kod oluştur ve aktifleştir                                │
│ [✓] Mobil uygulama erişimi ver                                   │
│ [✓] Hoşgeldin mesajı gönder                                      │
│ [✓] Aidat borcu oluştur (Başlangıç: 15.01.2025)                 │
│                                                                     │
│ Onay Notu (Opsiyonel):                                           │
│ [____________________________________________]                    │
│                                                                     │
│ [İptal] [Onayla ve Bilgilendir]                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### **Reddetme Formu**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Başvuru Reddetme                                            [✕]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Red Nedeni*:                                                       │
│ ( ) Eksik belge                                                   │
│ ( ) Yanlış/sahte bilgi                                           │
│ ( ) Malik onayı alınamadı                                         │
│ ( ) Konut uygun değil                                            │
│ ( ) Diğer: [_________________]                                    │
│                                                                     │
│ Detaylı Açıklama*:                                                │
│ [____________________________________________]                    │
│ [____________________________________________]                    │
│                                                                     │
│ Başvuru Sahibine:                                                │
│ [✓] Red nedenini SMS ile bildir                                  │
│ [✓] Red nedenini e-posta ile bildir                              │
│ [ ] Yeniden başvuru hakkı tanı                                   │
│                                                                     │
│ [İptal] [Reddet ve Bilgilendir]                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### **Bilgi İsteme Formu**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Eksik Bilgi/Belge Talebi                                    [✕]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Eksik Olan:                                                        │
│ [✓] Kira sözleşmesi                                              │
│ [ ] Kimlik fotokopisi                                            │
│ [ ] İkametgah belgesi                                            │
│ [ ] Maaş bordrosu                                                │
│ [✓] Malik onay yazısı                                            │
│ [ ] Diğer: [_________________]                                    │
│                                                                     │
│ Son Teslim Tarihi: [GG/AA/YYYY]                                  │
│                                                                     │
│ Ek Not:                                                           │
│ [____________________________________________]                    │
│                                                                     │
│ İletişim Kanalı:                                                 │
│ [✓] SMS    [✓] E-posta    [ ] Telefon araması                   │
│                                                                     │
│ [İptal] [Gönder]                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

## 📊 Durum Paneli (Sağ Sidebar)

```
┌─────────────────────────────────────────────┐
│ 📈 Bugünün İstatistikleri                   │
├─────────────────────────────────────────────┤
│ Toplam Başvuru: 12                         │
│ Onaylanan: 7                               │
│ Reddedilen: 2                              │
│ Bekleyen: 3                                │
│                                                │
│ 📊 Haftalık Trend                          │
│ [Grafik Alanı]                             │
│                                                │
│ ⏱️ Ortalama İşlem Süresi                   │
│ 2 saat 45 dakika                           │
│                                                │
│ 👥 İşlem Yapan Yöneticiler                 │
│ • Admin1: 5 onay, 1 red                    │
│ • Admin2: 2 onay, 1 red                    │
└─────────────────────────────────────────────┘
```

## 🔔 Bildirim Sistemi

### **Otomatik Hatırlatmalar**

- 24 saat bekleyen başvurular için sarı uyarı
- 48 saat bekleyen başvurular için kırmızı uyarı
- Eksik belge 3 gün tamamlanmazsa otomatik red

### **Yönetici Bildirimleri**

- Yeni başvuru bildirimi
- Acil onay gerektiren durumlar
- Malik onayı gelen başvurular
- Sistem kontrol uyarıları

## 📱 Responsive Tasarım

### **Desktop**

- Kart bazlı liste görünümü
- Sağda sabit istatistik paneli
- Hover'da hızlı önizleme

### **Tablet**

- Tek kolon kart görünümü
- Swipe ile hızlı onay/red
- Dokunmatik optimizasyon

### **Mobile**

- Kompakt kart tasarımı
- Temel bilgiler ön planda
- Tek dokunuş aramalar

Bu bilgi mimarisi, yöneticilerin bekleyen başvuruları hızlıca değerlendirmelerini, eksikleri takip etmelerini ve toplu işlemlerle verimliliği artırmalarını sağlayacak şekilde tasarlanmıştır.
