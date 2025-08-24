# 🔍 Aidat Tahsilat Trendi Kartı Debug Rehberi

## 📋 Sorun Özeti
"Aidat Tahsilat Trendi" kartında "Erişim Kısıtlı" hatası alıyorsunuz. Bu rehber sorunu adım adım çözmenize yardımcı olacak.

## 🚀 Hızlı Çözüm Adımları

### 1️⃣ Debug Modunu Aktifleştirin

1. **Dashboard sayfasını açın**: `http://localhost:3001/dashboard`
2. **Developer Tools'u açın**: `F12` tuşuna basın
3. **Console sekmesine** geçin
4. **Sayfayı yenileyin**: `F5` tuşuna basın

### 2️⃣ Console Log'larını İnceleyin

Sayfayı yeniledikten sonra console'da şu log'ları arayın:

```
=== FinancialChart Debug ===
FinancialChart - canViewFinancialChart: false/true
FinancialChart - permissionLoading: false/true
FinancialChart - Required permission: billing:stats:read
...
=== usePermissionCheck.hasPermission Debug ===
...
```

### 3️⃣ Permission Durumunu Kontrol Edin

Console'da şu komutu çalıştırın:

```javascript
// Permission'ları kontrol et
const permissions = localStorage.getItem('userPermissions');
console.log('Current permissions:', permissions);
if (permissions) {
  const parsed = JSON.parse(permissions);
  console.log('Parsed permissions:', parsed);
  console.log('Has billing:stats:read:', 
    Array.isArray(parsed) 
      ? parsed.includes('billing:stats:read') || parsed.some(p => p.name === 'billing:stats:read')
      : false
  );
}
```

## 🛠️ Çözüm Senaryoları

### Senaryo 1: Permission Eksik (ID Tabanlı - Önerilen)

**Belirti**: Console'da `billing:stats:read` permission'ı bulunamıyor.

**Çözüm**:
```javascript
// Console'da çalıştırın (ID tabanlı):
const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermission = {
  id: '4158aedc-5ae7-4a79-a746-a8268dd1510e',
  name: 'Billing Statistics',
  description: 'Permission to view billing statistics',
  action: 'read',
  resource: 'billing',
  isSystem: false
};
const newPermissions = [...currentPermissions, newPermission];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('ID tabanlı permission eklendi, sayfa yenileniyor...');
location.reload();
```

### Senaryo 2: Permission Eksik (String Format - Geriye Dönük Uyumluluk)

**Belirti**: Eski string formatında permission gerekiyor.

**Çözüm**:
```javascript
// Console'da çalıştırın:
const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermissions = [...currentPermissions, 'billing:stats:read'];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('String permission eklendi, sayfa yenileniyor...');
location.reload();
```

### Senaryo 3: Permission Formatı Object (Name Tabanlı)

**Belirti**: Permission'lar object formatında ve `name` field'ı var.

**Çözüm**:
```javascript
// Console'da çalıştırın:
const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermission = {
  name: 'billing:stats:read',
  action: 'read',
  resource: 'billing:stats'
};
const newPermissions = [...currentPermissions, newPermission];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('Object permission eklendi, sayfa yenileniyor...');
location.reload();
```

### Senaryo 3: localStorage Bozuk

**Belirti**: Permission parsing hatası alıyorsunuz.

**Çözüm**:
```javascript
// Console'da çalıştırın:
localStorage.removeItem('userPermissions');
localStorage.removeItem('userInfo');
console.log('localStorage temizlendi. Lütfen tekrar giriş yapın.');
// Tekrar giriş yapın
```

### Senaryo 4: Loading Durumu

**Belirti**: `permissionLoading: true` sürekli kalıyor.

**Çözüm**:
```javascript
// Console'da çalıştırın:
// Permission refresh tetikle
window.dispatchEvent(new CustomEvent('permission-changed'));
console.log('Permission refresh tetiklendi.');
```

## 🔧 Manuel Debug Script

Aşağıdaki script'i console'da çalıştırarak detaylı analiz yapabilirsiniz:

```javascript
// Kapsamlı debug script
console.log('=== AIDAT TAHSILAT TRENDİ DEBUG ===');

// 1. localStorage kontrolü
const userPermissions = localStorage.getItem('userPermissions');
const userInfo = localStorage.getItem('userInfo');
const authToken = localStorage.getItem('authToken');

console.log('1. localStorage Durumu:');
console.log('  - userPermissions:', !!userPermissions);
console.log('  - userInfo:', !!userInfo);
console.log('  - authToken:', !!authToken);

if (userPermissions) {
  try {
    const parsed = JSON.parse(userPermissions);
    console.log('2. Permission Analizi:');
    console.log('  - Type:', typeof parsed);
    console.log('  - Is Array:', Array.isArray(parsed));
    console.log('  - Length/Keys:', Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length);
    console.log('  - Sample:', Array.isArray(parsed) ? parsed.slice(0, 3) : Object.entries(parsed).slice(0, 3));
    
    // billing:stats:read arama
    let hasBillingStats = false;
    if (Array.isArray(parsed)) {
      hasBillingStats = parsed.some(p => 
        (typeof p === 'string' && p === 'billing:stats:read') ||
        (typeof p === 'object' && p && p.name === 'billing:stats:read')
      );
    } else if (typeof parsed === 'object') {
      hasBillingStats = Object.values(parsed).some(p => 
        (typeof p === 'string' && p === 'billing:stats:read') ||
        (typeof p === 'object' && p && p.name === 'billing:stats:read')
      );
    }
    
    console.log('3. Permission Kontrolü:');
    console.log('  - billing:stats:read var mı:', hasBillingStats);
    
    if (!hasBillingStats) {
      console.log('4. ÇÖZÜMLERİ DENE:');
      console.log('  A) String array için:');
      console.log('     localStorage.setItem("userPermissions", JSON.stringify([...JSON.parse(localStorage.getItem("userPermissions")), "billing:stats:read"])); location.reload();');
      console.log('  B) Object array için:');
      console.log('     localStorage.setItem("userPermissions", JSON.stringify([...JSON.parse(localStorage.getItem("userPermissions")), {name: "billing:stats:read", action: "read", resource: "billing:stats"}])); location.reload();');
    }
    
  } catch (error) {
    console.error('Permission parsing hatası:', error);
    console.log('ÇÖZÜMLERİ DENE:');
    console.log('localStorage.clear(); // Sonra tekrar giriş yap');
  }
} else {
  console.log('2. userPermissions bulunamadı!');
  console.log('ÇÖZÜMLERİ DENE:');
  console.log('Tekrar giriş yapın veya permission\'ları manuel ekleyin.');
}

console.log('=== DEBUG TAMAMLANDI ===');
```

## 📊 Beklenen Sonuçlar

### ✅ Başarılı Durum
```
FinancialChart - canViewFinancialChart: true
FinancialChart - permissionLoading: false
usePermissionCheck - String/Object array check result: true
```

### ❌ Başarısız Durum
```
FinancialChart - canViewFinancialChart: false
FinancialChart - permissionLoading: false
usePermissionCheck - String/Object array check result: false
```

## 🔄 Kalıcı Çözüm

Geçici çözümler işe yaradıktan sonra:

1. **Backend'de** kullanıcı rolünüze `billing:stats:read` permission'ını ekletin
2. **Admin panelinden** permission'ları kontrol edin
3. **Tekrar giriş** yaparak permission'ların doğru yüklendiğini doğrulayın

## 📞 Destek

Eğer sorun devam ederse:

1. Console'daki tüm debug log'larını kopyalayın
2. Kullanıcı rolünüzü ve permission'larınızı kontrol edin
3. Backend API'sinin permission servisini kontrol edin

---

**Not**: Bu debug işlemleri geliştirme ortamı içindir. Production'da bu log'lar kaldırılmalıdır.