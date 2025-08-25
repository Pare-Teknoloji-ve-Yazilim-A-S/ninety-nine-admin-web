// CREATE STAFF Permission Debug Script
// Bu script'i browser console'da çalıştırın

console.log('=== CREATE STAFF Permission Debug ===');

// Permission ID ve name tanımları
const CREATE_STAFF_PERMISSION_ID = 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6';
const CREATE_STAFF_PERMISSION_NAME = 'Create Staff';

console.log('🔑 Aranan Permission ID:', CREATE_STAFF_PERMISSION_ID);
console.log('🔑 Aranan Permission Name:', CREATE_STAFF_PERMISSION_NAME);

// 1. localStorage'dan userPermissions'ı kontrol et
const userPermissions = localStorage.getItem('userPermissions');
console.log('\n📋 Raw userPermissions:', userPermissions);

if (!userPermissions) {
  console.error('❌ userPermissions localStorage\'da bulunamadı!');
  console.log('🔧 Çözüm: Giriş yapın veya sayfayı yenileyin.');
} else {
  try {
    const parsedPermissions = JSON.parse(userPermissions);
    console.log('\n📋 Parsed permissions:', parsedPermissions);
    console.log('📋 Permissions type:', typeof parsedPermissions);
    console.log('📋 Is array:', Array.isArray(parsedPermissions));
    
    if (Array.isArray(parsedPermissions)) {
      console.log('📋 Array length:', parsedPermissions.length);
      console.log('📋 First few permissions:', parsedPermissions.slice(0, 3));
      
      // ID tabanlı permission kontrolü
      let hasCreateStaffById = false;
      let hasCreateStaffByName = false;
      
      parsedPermissions.forEach((permission, index) => {
        if (typeof permission === 'object' && permission !== null) {
          // Object format: {id: 'xxx', name: 'yyy'}
          if (permission.id === CREATE_STAFF_PERMISSION_ID) {
            hasCreateStaffById = true;
            console.log(`✅ CREATE STAFF permission bulundu (ID ile) - Index: ${index}`, permission);
          }
          if (permission.name === CREATE_STAFF_PERMISSION_NAME) {
            hasCreateStaffByName = true;
            console.log(`✅ CREATE STAFF permission bulundu (Name ile) - Index: ${index}`, permission);
          }
        } else if (typeof permission === 'string') {
          // String format: 'Create Staff'
          if (permission === CREATE_STAFF_PERMISSION_NAME) {
            hasCreateStaffByName = true;
            console.log(`✅ CREATE STAFF permission bulundu (String) - Index: ${index}`, permission);
          }
        }
      });
      
      console.log('\n🔍 SONUÇ:');
      console.log('Has CREATE STAFF by ID:', hasCreateStaffById);
      console.log('Has CREATE STAFF by Name:', hasCreateStaffByName);
      
      if (!hasCreateStaffById && !hasCreateStaffByName) {
        console.log('\n❌ CREATE STAFF permission bulunamadı!');
        console.log('\n🚀 Hızlı Çözümler:');
        
        console.log('\n📋 Seçenek 1: ID tabanlı permission ekle (Önerilen)');
        console.log(`const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermission = {
  id: '${CREATE_STAFF_PERMISSION_ID}',
  name: '${CREATE_STAFF_PERMISSION_NAME}',
  description: 'Permission to create new staff members'
};
const newPermissions = [...currentPermissions, newPermission];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('ID tabanlı permission eklendi, sayfa yenileniyor...');
location.reload();`);
        
        console.log('\n📋 Seçenek 2: String tabanlı permission ekle');
        console.log(`const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermissions = [...currentPermissions, '${CREATE_STAFF_PERMISSION_NAME}'];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('String permission eklendi, sayfa yenileniyor...');
location.reload();`);
      }
    } else {
      console.error('❌ userPermissions array formatında değil!');
      console.log('🔧 Çözüm: localStorage\'ı temizleyin ve tekrar giriş yapın.');
    }
  } catch (error) {
    console.error('❌ userPermissions parse edilemedi:', error);
    console.log('🔧 Çözüm: localStorage\'ı temizleyin ve tekrar giriş yapın.');
  }
}

// 2. usePermissionCheck hook'unun nasıl çalıştığını simüle et
console.log('\n=== usePermissionCheck Simülasyonu ===');
if (userPermissions) {
  try {
    const parsedPermissions = JSON.parse(userPermissions);
    
    // Hook'un hasPermission fonksiyonunu simüle et
    const hasPermission = (permissionId) => {
      if (!Array.isArray(parsedPermissions)) return false;
      
      return parsedPermissions.some(permission => {
        if (typeof permission === 'string') {
          return permission === permissionId || permission === CREATE_STAFF_PERMISSION_NAME;
        }
        if (typeof permission === 'object' && permission !== null) {
          return permission.id === permissionId || permission.name === permissionId;
        }
        return false;
      });
    };
    
    const result = hasPermission(CREATE_STAFF_PERMISSION_ID);
    console.log('hasPermission result:', result);
    
    if (!result) {
      console.log('❌ usePermissionCheck hook CREATE_STAFF permission\'ını bulamıyor!');
    } else {
      console.log('✅ usePermissionCheck hook CREATE_STAFF permission\'ını buluyor!');
    }
  } catch (error) {
    console.error('❌ Hook simülasyonu başarısız:', error);
  }
}

console.log('\n' + '='.repeat(60));
console.log('🔍 CREATE STAFF Permission Debug Script Tamamlandı.');
console.log('\n💡 İpucu: Yukarıdaki çözümlerden birini kopyalayıp console\'a yapıştırın.');