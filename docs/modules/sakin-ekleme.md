# 👤 Yeni Sakin Ekle - Hızlı Kayıt Bilgi Mimarisi

## 🏗️ Sayfa Yapısı

### 1. **Üst Başlık**

```
┌─────────────────────────────────────────────────────────────────────┐
│ [←] Yeni Sakin - Hızlı Kayıt                      [Kaydet] [İptal] │
│ Temel bilgileri girerek sakini kaydedin, detayları sonra ekleyin  │
└─────────────────────────────────────────────────────────────────────┘
```

## 📋 Hızlı Kayıt Formu

### **Tek Sayfa Form Yapısı**

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ZORUNLU BİLGİLER                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ 👤 Kimlik Bilgileri                                               │
│ ─────────────────────                                             │
│ Kimlik Tipi: (•) TC Kimlik  ( ) Pasaport  ( ) Geçici Kimlik      │
│                                                                     │
│ TC/Kimlik No*: [___________] ✓                                    │
│ Ad*: [_________________]    Soyad*: [_________________]           │
│                                                                     │
│ 📱 İletişim                                                        │
│ ─────────────────────                                             │
│ Cep Telefonu*: [+90] [5XX XXX XX XX]  [✓ WhatsApp]               │
│ E-posta: [_____________________@________]                          │
│                                                                     │
│ 🏠 Konut Atama                                                     │
│ ─────────────────────                                             │
│ Sakin Tipi*: (•) Malik  ( ) Kiracı  ( ) Aile Üyesi               │
│                                                                     │
│ Blok*: [Seçiniz ▼]  Daire No*: [Seçiniz ▼]                      │
│                                                                     │
│ ℹ️ A Blok, Daire 12 - 3+1, 145m² (Boş)                           │
│                                                                     │
│ ⚡ Hızlı Seçenekler                                                │
│ ─────────────────────                                             │
│ [ ] Aidat başlangıç tarihi: Bugün                                 │
│ [ ] Standart aidat tutarını uygula (2,500 ₺)                     │
│ [ ] Mobil uygulama daveti gönder                                  │
│ [ ] QR kod oluştur ve aktifleştir                                 │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ 💡 İpucu: Sakin kaydedildikten sonra detay sayfasından tüm        │
│ bilgileri ekleyebilir ve düzenleyebilirsiniz.                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎯 Form Özellikleri

### **Validasyon**

- TC kimlik algoritma kontrolü
- Telefon format kontrolü (5XXXXXXXXX)
- Çakışma kontrolü (TC ve Daire)
- Zorunlu alan kontrolleri (\*)

### **Otomatik İşlemler**

- TC doğrulama servisi (opsiyonel)
- Konut müsaitlik kontrolü
- Benzer kayıt uyarısı
- Otomatik büyük harf dönüşümü (ad/soyad)

### **Hata Yönetimi**

```
⚠️ Bu TC kimlik numarası ile kayıtlı sakin bulunmaktadır.
   [Mevcut Kaydı Görüntüle] [Yine de Devam Et]

❌ Seçilen daire dolu görünüyor. Lütfen kontrol edin.
   Mevcut Sakin: Mehmet ÖZTÜRK (Malik)
```

## 💾 Kayıt Sonrası Yönlendirme

### **Başarılı Kayıt Sonrası**

```
┌─────────────────────────────────────────────────────────────────────┐
│ ✅ Sakin başarıyla kaydedildi!                                     │
│                                                                     │
│ Ahmet YILMAZ - A Blok, Daire 12                                   │
│ Kayıt No: #2024-1234                                               │
│                                                                     │
│ Şimdi ne yapmak istersiniz?                                        │
│                                                                     │
│ [Detayları Düzenle] [Yeni Sakin Ekle] [Sakin Listesine Dön]      │
└─────────────────────────────────────────────────────────────────────┘
```

## 📄 Sakin Detay Sayfası Yapısı

Hızlı kayıt sonrası yönlendirilen detay sayfası:

### **Üst Bilgi Alanı**

```
┌─────────────────────────────────────────────────────────────────────┐
│ [←] Ahmet YILMAZ                          [✏️ Düzenle] [⋮ Diğer]   │
│ A Blok, Daire 12 • Malik • Aktif                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### **Tab Yapısı**

```
[Genel Bilgiler] [Finansal] [Aile & Araçlar] [Belgeler] [Aktiviteler]
```

### **Tab 1: Genel Bilgiler**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Kişisel Bilgiler                                      [✏️ Düzenle] │
│ ─────────────────────────────────────────────────────             │
│ 📷 [Fotoğraf]  TC No: 12345678901                                 │
│                Ad: Ahmet                                           │
│                Soyad: YILMAZ                                       │
│                Doğum Tarihi: -- [Ekle]                            │
│                Kan Grubu: -- [Ekle]                               │
│                                                                     │
│ İletişim Bilgileri                                   [✏️ Düzenle] │
│ ─────────────────────────────────────────────────────             │
│ 📱 Cep: 0532 123 45 67 (WhatsApp ✓)                              │
│ ✉️ E-posta: --                                       [Ekle]       │
│ 🏠 Adres: --                                         [Ekle]       │
│                                                                     │
│ Konut Bilgileri                                      [✏️ Düzenle] │
│ ─────────────────────────────────────────────────────             │
│ 🏠 A Blok, Daire 12 (3+1, 145m²)                                 │
│ Sakin Tipi: Malik                                                 │
│ Giriş Tarihi: 08.01.2025                                          │
│ Tapu No: --                                          [Ekle]       │
└─────────────────────────────────────────────────────────────────────┘
```

### **Tab 2: Finansal**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Aidat ve Ödemeler                                    [✏️ Düzenle] │
│ ─────────────────────────────────────────────────────             │
│ Aidat Başlangıcı: 08.01.2025                                      │
│ Aylık Aidat: 2,500 ₺ (Standart)                                  │
│ Güncel Borç: 0 ₺                                                  │
│ Üyelik Tipi: Standart                               [Yükselt]     │
│                                                                     │
│ Fatura Bilgileri                                     [✏️ Düzenle] │
│ ─────────────────────────────────────────────────────             │
│ Fatura Tipi: Şahıs                                                │
│ Vergi No: --                                         [Ekle]       │
└─────────────────────────────────────────────────────────────────────┘
```

### **Tab 3: Aile & Araçlar**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Aile Üyeleri (0)                                     [+ Ekle]     │
│ ─────────────────────────────────────────────────────             │
│ Henüz aile üyesi eklenmemiş.                                      │
│                                                                     │
│ Araçlar (0)                                          [+ Ekle]     │
│ ─────────────────────────────────────────────────────             │
│ Henüz araç kaydı eklenmemiş.                                      │
│                                                                     │
│ Özel Durumlar                                        [✏️ Düzenle] │
│ ─────────────────────────────────────────────────────             │
│ [ ] Engelli sakini                                                │
│ [ ] Evcil hayvan sahibi                                          │
│ Acil Durum İrtibat: --                              [Ekle]       │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔧 Düzenleme Modal Örnekleri

### **Hızlı Düzenleme Modal**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Kişisel Bilgileri Düzenle                           [✕]           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Doğum Tarihi: [GG/AA/YYYY]                                        │
│ Doğum Yeri: [_________________]                                   │
│ Kan Grubu: [Seçiniz ▼]                                            │
│ Medeni Durum: [Seçiniz ▼]                                         │
│                                                                     │
│ [İptal] [Kaydet]                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

## 🚀 Avantajlar

### **Hızlı Kayıt**

- 30 saniyede sakin kaydı
- Sadece 5 zorunlu alan
- Anında aktif kayıt
- Minimum validasyon

### **Esnek Düzenleme**

- İstenen zaman detay ekleme
- Alan bazında düzenleme
- Toplu güncelleme imkanı
- Versiyon takibi

### **Kullanıcı Deneyimi**

- Tek sayfa basitlik
- Açık ve net yönlendirmeler
- Contextual yardımlar
- Progressive disclosure

Bu yaklaşım, yöneticilerin acil durumlarda hızlıca sakin kaydı yapmalarını sağlarken, detaylı bilgileri sonradan eklemelerine olanak tanır. Böylece kayıt süreci hızlanır ve kullanıcı deneyimi iyileşir.
