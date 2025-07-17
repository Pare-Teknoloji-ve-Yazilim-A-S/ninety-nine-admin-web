# 👥 Sakinler Modülü - Sakin Listesi Bilgi Mimarisi

## 🏗️ Sayfa Yapısı

### 1. **Üst Başlık Alanı**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Sakinler (2,348 aktif)                    [+ Yeni Sakin] [⬇ İndir] │
│ Son güncelleme: 5 dakika önce            [🔄 Yenile]               │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. **Filtre ve Arama Bölümü**

#### **Hızlı Arama Çubuğu**

```
🔍 [Ad, soyad, TC/pasaport, telefon, daire no ile ara...]
```

#### **Gelişmiş Filtreler**

```
├── Konut Bilgileri
│   ├── Blok Seçimi (Çoklu)
│   ├── Daire Tipi (1+1, 2+1, 3+1, Villa)
│   ├── Kat Numarası
│   └── Konut Durumu (Dolu/Boş)
│
├── Sakin Durumu
│   ├── Tip (Malik/Kiracı/Aile Üyesi)
│   ├── Yaşam Durumu (Aktif/Taşındı/Askıda)
│   ├── Üyelik Tipi (Gold/Silver/Standart)
│   └── Kayıt Tarihi Aralığı
│
├── Finansal Durum
│   ├── Borç Durumu (Borçlu/Temiz/Ödeme Planı)
│   ├── Borç Aralığı (Min-Max)
│   ├── Son Ödeme Tarihi
│   └── Ödeme Yöntemi Tercihi
│
└── Özel Durumlar
    ├── Yaş Grubu (Çocuk/Genç/Yetişkin/Yaşlı)
    ├── Engelli Durumu
    ├── Araç Sahipliği
    └── Evcil Hayvan Sahipliği
```

### 3. **Hızlı İstatistikler Şeridi**

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Toplam Sakin │ Malik        │ Kiracı       │ Borçlu       │ Gold Üye     │
│ 2,348        │ 1,856 (%79)  │ 492 (%21)    │ 287 (%12)    │ 156 (%7)     │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### 4. **Ana Tablo Yapısı**

#### **Tablo Kolonları**

```
│ □ │ Fotoğraf │ Ad Soyad │ Konut │ Tip │ Telefon │ Borç │ Durum │ İşlemler │
```

#### **Detaylı Kolon Açıklamaları**

1. **Seçim Kutusu**: Toplu işlemler için
2. **Fotoğraf**:

   - Profil fotoğrafı thumbnail
   - Hover'da büyütme
   - Varsayılan avatar

3. **Ad Soyad**:

   - İsim + Soyisim
   - Altında TC/Pasaport No (maskelenmiş)
   - Üyelik rozeti (Gold/Silver)

4. **Konut Bilgisi**:

   - Blok + Daire No
   - Konut tipi ikonu
   - Malik/Kiracı etiketi

5. **Sakin Tipi**:

   - Malik (Yeşil)
   - Kiracı (Mavi)
   - Aile Üyesi (Gri)

6. **İletişim**:

   - Cep telefonu
   - WhatsApp ikonu
   - Arama ikonu

7. **Finansal Durum**:

   - Toplam borç
   - Renk kodlaması
   - Trend ikonu (↑↓)

8. **Durum**:

   - Aktif (Yeşil nokta)
   - Taşındı (Gri nokta)
   - Askıda (Sarı nokta)

9. **Hızlı İşlemler**:
   - Görüntüle (👁)
   - Düzenle (✏️)
   - Mesaj (💬)
   - Diğer (⋮)

### 5. **Satır Genişletme Detayları**

Tabloda satıra tıklandığında açılan ek bilgiler:

```
├── Aile Üyeleri (3 kişi)
├── Araçlar (2 araç - 34 ABC 123)
├── Son 3 Ödeme
├── Açık Talepler (2)
└── Notlar
```

### 6. **Toplu İşlemler Menüsü**

Seçili sakinler için:

```
[📧 Toplu Mail] [💬 SMS Gönder] [📄 PDF Oluştur] [🏷️ Etiket Ata] [🗑️ Sil]
```

### 7. **Sayfalama ve Görünüm Kontrolleri**

```
Göster: [25 ▼] kayıt     [◀ Önceki] Sayfa 1 / 94 [Sonraki ▶]
Görünüm: [▦ Grid] [☰ Liste] [📋 Kompakt]
```

## 📊 Veri Organizasyonu

### **Sıralama Seçenekleri**

- Ad Soyad (A-Z / Z-A)
- Kayıt Tarihi (Yeni-Eski / Eski-Yeni)
- Borç Miktarı (Çok-Az / Az-Çok)
- Blok-Daire No
- Son Aktivite

### **Gruplama Seçenekleri**

- Blok bazında
- Sakin tipi bazında
- Borç durumu bazında
- Üyelik tipi bazında

## 🎨 Görsel Hiyerarşi

### **Renk Kodlaması**

- **Yeşil**: Borcu olmayan, aktif sakinler
- **Sarı**: Ödeme planında olanlar
- **Kırmızı**: Yüksek borçlu (3 ay üzeri)
- **Mavi**: Yeni kayıtlar (30 gün içi)
- **Gri**: Pasif/taşınmış sakinler

### **İkon Sistemi**

- 👤 Malik
- 🏠 Kiracı
- 👨‍👩‍👧‍👦 Aile üyesi
- 🌟 Gold üye
- ⭐ Silver üye
- 🚗 Araç sahibi
- 🐕 Evcil hayvan sahibi
- ♿ Engelli sakini

## 🔄 Dinamik Özellikler

### **Gerçek Zamanlı Güncellemeler**

- Yeni sakin kayıtları
- Borç ödemeleri
- Durum değişiklikleri
- Taşınma bildirimleri

### **Akıllı Öneriler**

- Benzer sakinleri göster
- Aynı blokta yaşayanlar
- Borç hatırlatması gönderilecekler
- Doğum günü yaklaşanlar

## 📱 Responsive Tasarım

### **Desktop (1200px+)**

- Tüm kolonlar görünür
- Yan panel filtreler
- Genişletilmiş satır detayları

### **Tablet (768px-1199px)**

- Temel kolonlar
- Dropdown filtreler
- Swipe ile diğer kolonlar

### **Mobile (Acil Erişim)**

- İsim + Daire + Telefon
- Arama ve temel filtreler
- Kart bazlı görünüm

## ⚡ Performans Hedefleri

- İlk yükleme: < 2 saniye
- Arama sonuçları: < 500ms
- Filtre uygulaması: < 1 saniye
- Sayfa geçişi: < 500ms
- Excel export: < 5 saniye (2500 kayıt)

Bu bilgi mimarisi, yöneticilerin binlerce sakini etkin bir şekilde yönetmelerini, hızlı erişim sağlamalarını ve toplu işlemler yapmalarını kolaylaştıracak şekilde tasarlanmıştır.

---

# 📤 Sakin Listesi Dışa Aktarım (Export) Özelliği

## 1. Mimari Karar: Export İşlemi FE mi, BE mi?

### Backend Export (Önerilen Yaklaşım)
- Büyük veri setlerinde performanslı ve güvenli.
- Hassas veriler client'a taşınmaz.
- Tüm kullanıcılar için tutarlı çıktı.
- Gelişmiş PDF/Excel formatlama imkanı.

### Frontend Export
- Küçük veri setlerinde hızlı prototipleme için uygun.
- Büyük veri setlerinde tarayıcıyı yavaşlatır.
- Gelişmiş formatlama ve güvenlik kısıtlı.

**Karar:**
> Sakin Listesi gibi büyük ve hassas veri içeren modüllerde export işlemi backend'de yapılmalıdır.

## 2. API Endpoint Tasarımı

Export işlemleri için aşağıdaki endpointler önerilir:

```
GET /api/residents/export/pdf
GET /api/residents/export/excel
GET /api/residents/export/csv
GET /api/residents/export/json
```

- **Tüm filtreler, arama ve sıralama parametreleri** query string ile iletilir.
- **Kullanıcı hangi filtreleri seçtiyse, sadece o filtrelere uyan veriler indirilir.**
- Response: İlgili formatta dosya (Content-Disposition: attachment)

## 3. Frontend Entegrasyon

Export butonuna tıklandığında FE'de örnek kullanım:

```typescript
const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'json') => {
  const params = new URLSearchParams({
    ...filters, // Kullanıcının seçtiği tüm filtreler
    search: searchQuery,
    orderColumn: sortConfig.key,
    orderBy: sortConfig.direction
  });
  const response = await fetch(`/api/residents/export/${format}?${params}`);
  const blob = await response.blob();
  // Download logic
};
```

> **Not:** Export edilen dosya, kullanıcının o anda uyguladığı filtreler, arama ve sıralama ile birebir aynı verileri içermelidir.

## 4. Kullanıcı Deneyimi
- Export işlemi sırasında loading göstergesi.
- Büyük dosyalarda progress bar önerilir.
- Hata durumunda kullanıcıya bildirim.

## 5. Test ve Performans
- 2500+ kayıt için <5 sn hedefi.
- Farklı filtre ve sıralama kombinasyonları test edilmeli.

---
