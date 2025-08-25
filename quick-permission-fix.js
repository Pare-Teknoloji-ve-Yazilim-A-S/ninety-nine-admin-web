// Hızlı Permission Sorunu Çözümü
// Bu script localStorage'ı temizler ve sayfayı yeniler

console.log('🚀 Hızlı Permission Fix Script');
console.log('==============================');

// Seçenek 1: localStorage'ı tamamen temizle
function clearAllStorage() {
  console.log('🧹 localStorage temizleniyor...');
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ Storage temizlendi!');
  console.log('🔄 Sayfa yenileniyor...');
  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
}

// Seçenek 2: Sadece permission verilerini temizle
function clearPermissionData() {
  console.log('🎯 Permission verileri temizleniyor...');
  localStorage.removeItem('userData');
  localStorage.removeItem('userPermissions');
  localStorage.removeItem('authToken');
  console.log('✅ Permission verileri temizlendi!');
  console.log('🔄 Sayfa yenileniyor...');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Seçenek 3: Read Billing permission'ını manuel ekle
function addReadBillingPermission() {
  console.log('➕ Read Billing permission ekleniyor...');
  
  const userData = localStorage.getItem('userData');
  if (!userData) {
    console.log('❌ userData bulunamadı. Önce login olun.');
    return;
  }
  
  try {
    const parsedUserData = JSON.parse(userData);
    
    if (parsedUserData.roles && Array.isArray(parsedUserData.roles)) {
      // Admin rolünü bul
      const adminRole = parsedUserData.roles.find(role => role.name === 'admin');
      
      if (adminRole && adminRole.permissions) {
        // Read Billing permission'ı ekle
        const readBillingPermission = {
          id: 'd3e4f5g6-7h8i-9j0k-1l2m-3n4o5p6q7r8s',
          name: 'Read Billing',
          description: 'Permission to view billing information',
          resource: 'billing',
          action: 'read'
        };
        
        // Zaten var mı kontrol et
        const exists = adminRole.permissions.some(p => 
          p.id === readBillingPermission.id || p.name === 'Read Billing'
        );
        
        if (!exists) {
          adminRole.permissions.push(readBillingPermission);
          localStorage.setItem('userData', JSON.stringify(parsedUserData));
          console.log('✅ Read Billing permission eklendi!');
          console.log('🔄 Sayfa yenileniyor...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.log('ℹ️ Read Billing permission zaten mevcut.');
        }
      } else {
        console.log('❌ Admin rolü bulunamadı.');
      }
    }
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

// Kullanım talimatları
console.log('\n📋 Kullanım Seçenekleri:');
console.log('1. clearAllStorage()     - Tüm localStorage\'ı temizle ve login sayfasına git');
console.log('2. clearPermissionData() - Sadece permission verilerini temizle');
console.log('3. addReadBillingPermission() - Read Billing permission\'ını manuel ekle');
console.log('\n💡 Önerilen sıra: Önce 3\'ü dene, işe yaramazsa 2\'yi, son çare olarak 1\'i kullan.');
console.log('\n🎯 Hızlı çözüm için şunu çalıştır: addReadBillingPermission()');

// Otomatik çözüm
console.log('\n🤖 Otomatik çözüm başlatılıyor...');
addReadBillingPermission();