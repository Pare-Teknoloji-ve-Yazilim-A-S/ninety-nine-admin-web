// Assign Property Permission Debug Script
// Bu script'i browser console'da çalıştırın

console.log('=== Assign Property Permission Debug ===');

// Permission ID ve name tanımları (page.tsx'den alındı)
const ASSIGN_PROPERTY_PERMISSION_ID = 'e5f6g7h8-i9j0-1234-efgh-ij5678901234';
const ASSIGN_PROPERTY_PERMISSION_NAME = 'Assign Property';

console.log('🔑 Aranan Permission ID:', ASSIGN_PROPERTY_PERMISSION_ID);
console.log('🔑 Aranan Permission Name:', ASSIGN_PROPERTY_PERMISSION_NAME);

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
      let hasAssignPropertyById = false;
      let hasAssignPropertyByName = false;
      
      if (parsedPermissions.length > 0) {
        const firstItem = parsedPermissions[0];
        
        // ID tabanlı kontrol (öncelikli)
        hasAssignPropertyById = parsedPermissions.some(perm => 
          typeof perm === 'object' && perm !== null && perm.id === ASSIGN_PROPERTY_PERMISSION_ID
        );
        console.log('\n✅ ID tabanlı kontrol - Assign Property found:', hasAssignPropertyById);
        
        // Name tabanlı kontrol (geriye dönük uyumluluk)
        if (typeof firstItem === 'string') {
          // String array format
          hasAssignPropertyByName = parsedPermissions.includes(ASSIGN_PROPERTY_PERMISSION_NAME);
          console.log('✅ String array check - Assign Property found:', hasAssignPropertyByName);
        } else if (typeof firstItem === 'object' && firstItem !== null) {
          // Object array format
          hasAssignPropertyByName = parsedPermissions.some(perm => 
            perm.name === ASSIGN_PROPERTY_PERMISSION_NAME
          );
          console.log('✅ Object array check - Assign Property found:', hasAssignPropertyByName);
        }
      }
      
      const hasAnyAssignPropertyPermission = hasAssignPropertyById || hasAssignPropertyByName;
      
      if (hasAnyAssignPropertyPermission) {
        console.log('\n✅ Assign Property permission bulundu!');
        if (hasAssignPropertyById) {
          console.log('   ✅ ID tabanlı permission mevcut');
        }
        if (hasAssignPropertyByName) {
          console.log('   ✅ Name tabanlı permission mevcut');
        }
        console.log('\n🎯 Malik Ekle ve Kiracı Ekle butonları görünmelidir.');
        console.log('\n🔍 Eğer hala görünmüyorsa:');
        console.log('   1. Sayfayı yenileyin (F5)');
        console.log('   2. Browser cache\'ini temizleyin');
        console.log('   3. Console\'da component debug loglarını kontrol edin');
      } else {
        console.log('\n❌ Assign Property permission bulunamadı!');
        console.log('\n🚀 Hızlı Çözüm Seçenekleri:');
        
        console.log('\n📋 Seçenek 1: ID tabanlı permission ekle (Önerilen)');
        console.log(`const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermission = {
  id: '${ASSIGN_PROPERTY_PERMISSION_ID}',
  name: '${ASSIGN_PROPERTY_PERMISSION_NAME}',
  description: 'Permission to assign property to users',
  action: 'assign',
  resource: 'property',
  isSystem: false
};
const newPermissions = [...currentPermissions, newPermission];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('ID tabanlı permission eklendi, sayfa yenileniyor...');
location.reload();`);
        
        console.log('\n📋 Seçenek 2: String tabanlı permission ekle (Geriye dönük uyumluluk)');
        console.log(`const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermissions = [...currentPermissions, '${ASSIGN_PROPERTY_PERMISSION_NAME}'];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('String permission eklendi, sayfa yenileniyor...');
location.reload();`);
        
        console.log('\n📋 Seçenek 3: Object tabanlı permission ekle (Name field ile)');
        console.log(`const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermission = {
  name: '${ASSIGN_PROPERTY_PERMISSION_NAME}',
  description: 'Permission to assign property to users',
  action: 'assign',
  resource: 'property'
};
const newPermissions = [...currentPermissions, newPermission];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('Object permission eklendi, sayfa yenileniyor...');
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

console.log('\n' + '='.repeat(60));
console.log('🔍 Assign Property Permission Debug Script Tamamlandı.');
console.log('\n💡 İpucu: Yukarıdaki çözümlerden birini kopyalayıp console\'a yapıştırın.');