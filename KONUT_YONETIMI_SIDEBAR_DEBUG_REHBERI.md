# Konut Yönetimi Sidebar Görünmeme Sorunu Debug Rehberi

## 🎯 Sorun Tanımı
Konut Yönetimi (Unit Management) butonu sidebar'da görünmüyor. Bu durum kullanıcının "Read Property" iznine sahip olmamasından kaynaklanmaktadır.

## 🔍 Debug Süreci

### Adım 1: Debug Script'ini Çalıştır
```javascript
// Browser console'da çalıştırın:
// debug-property-permissions.js dosyasının içeriğini kopyalayıp yapıştırın
```

### Adım 2: Console Loglarını İncele
Sidebar yüklendiğinde console'da şu logları arayın:
```
=== Sidebar Permission Debug ===
Sidebar - READ_PROPERTY_PERMISSION_ID: b2c8f4e1-9a7d-4f3e-8b5c-1d2e3f4a5b6c
Sidebar - READ_PROPERTY_PERMISSION_NAME: Read Property
Sidebar - canViewPropertyById: false/true
Sidebar - canViewPropertyByName: false/true
Sidebar - hasReadPropertyPermission (combined): false/true
=== End Sidebar Permission Debug ===
```

### Adım 3: usePermissionCheck Debug Loglarını İncele
```
=== usePermissionCheck Debug ===
usePermissionCheck - Checking permission: b2c8f4e1-9a7d-4f3e-8b5c-1d2e3f4a5b6c
usePermissionCheck - Raw userPermissions: [...]
usePermissionCheck - Parsed userPermissions: [...]
=== End usePermissionCheck Debug ===
```

## 🚀 Hızlı Çözümler

### Senaryo 1: Permission Eksik (ID Tabanlı - Önerilen)

**Belirti**: Console'da `Read Property` permission'ı bulunamıyor.

**Çözüm**:
```javascript
// Console'da çalıştırın (ID tabanlı):
const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermission = {
  id: 'b2c8f4e1-9a7d-4f3e-8b5c-1d2e3f4a5b6c',
  name: 'Read Property',
  description: 'Permission to view property information',
  action: 'read',
  resource: 'property',
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
const newPermissions = [...currentPermissions, 'Read Property'];
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
  name: 'Read Property',
  description: 'Permission to view property information',
  action: 'read',
  resource: 'property'
};
const newPermissions = [...currentPermissions, newPermission];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('Object permission eklendi, sayfa yenileniyor...');
location.reload();
```

## 🔧 Teknik Detaylar

### Permission Kontrol Sistemi
- **ID Tabanlı Kontrol**: `b2c8f4e1-9a7d-4f3e-8b5c-1d2e3f4a5b6c` UUID'si ile kontrol
- **Name Tabanlı Kontrol**: `Read Property` string'i ile kontrol
- **Dual Approach**: Her iki yöntem de desteklenir, ID önceliklidir

### Sidebar Filtreleme Mantığı
```javascript
// getMenuItems fonksiyonunda:
return allMenuItems.filter(item => {
    if (item.href === '/dashboard/units') {
        return hasReadPropertyPermission; // ID || Name kontrolü
    }
    return true;
});
```

### usePermissionCheck Hook Kullanımı
```javascript
const canViewPropertyById = usePermissionCheck('b2c8f4e1-9a7d-4f3e-8b5c-1d2e3f4a5b6c');
const canViewPropertyByName = usePermissionCheck('Read Property');
const hasReadPropertyPermission = canViewPropertyById || canViewPropertyByName;
```

## 🐛 Yaygın Sorunlar ve Çözümleri

### 1. Permission Var Ama Sidebar'da Görünmüyor
**Çözüm**: Sayfayı yenileyin (F5) veya browser cache'ini temizleyin.

### 2. Console'da Permission Debug Logları Görünmüyor
**Çözüm**: Sidebar bileşeninin yüklendiğinden emin olun.

### 3. localStorage'da userPermissions Yok
**Çözüm**: Yukarıdaki hızlı çözümlerden birini kullanarak permission ekleyin.

### 4. Permission Format Uyumsuzluğu
**Çözüm**: Debug script'ini çalıştırarak mevcut formatı tespit edin ve uygun çözümü uygulayın.

## 📊 Test Senaryoları

### Test 1: ID Tabanlı Permission
```javascript
localStorage.setItem('userPermissions', JSON.stringify([
  {
    id: 'b2c8f4e1-9a7d-4f3e-8b5c-1d2e3f4a5b6c',
    name: 'Read Property'
  }
]));
location.reload();
```

### Test 2: String Tabanlı Permission
```javascript
localStorage.setItem('userPermissions', JSON.stringify(['Read Property']));
location.reload();
```

### Test 3: Mixed Format
```javascript
localStorage.setItem('userPermissions', JSON.stringify([
  'Read Property',
  { id: 'other-id', name: 'Other Permission' }
]));
location.reload();
```

## 🎯 Başarı Kriterleri

✅ Konut Yönetimi butonu sidebar'da görünür  
✅ Console'da permission debug logları pozitif  
✅ `/dashboard/units` sayfasına erişim mümkün  
✅ Permission kontrolü hem ID hem name ile çalışır  

## 📞 Destek

Bu rehber sorununuzu çözmezse:
1. Debug script çıktısını kaydedin
2. Console loglarının ekran görüntüsünü alın
3. localStorage'daki userPermissions değerini paylaşın

---

**Not**: Bu sistem FinancialChart bileşenindeki permission sistemi ile aynı yaklaşımı kullanır ve geriye dönük uyumluluğu korur.