// Property Management (Konut Yönetimi) Sidebar Permission Debug Script
// Bu script, Konut Yönetimi sayfasının sidebar'da görünmeme sorununu debug etmek için kullanılır

// Read Property permission constants
const READ_PROPERTY_PERMISSION_ID = 'b2c8f4e1-9a7d-4f3e-8b5c-1d2e3f4a5b6c'; // UUID for Read Property permission
const READ_PROPERTY_PERMISSION_NAME = 'Read Property'; // Name for backward compatibility

console.log('🔍 Property Management Sidebar Permission Debug Script Başlatılıyor...');
console.log('='.repeat(60));

// 1. localStorage'dan userPermissions'ı al
console.log('1. localStorage kontrolü:');
const userPermissionsRaw = localStorage.getItem('userPermissions');
console.log('   Raw userPermissions:', userPermissionsRaw);

if (!userPermissionsRaw) {
  console.log('❌ userPermissions localStorage\'da bulunamadı!');
  console.log('\n🚀 Hızlı Çözüm (ID tabanlı - Önerilen):');
  console.log(`
const newPermission = {
  id: '${READ_PROPERTY_PERMISSION_ID}',
  name: '${READ_PROPERTY_PERMISSION_NAME}',
  description: 'Permission to view property information',
  action: 'read',
  resource: 'property',
  isSystem: false
};
localStorage.setItem('userPermissions', JSON.stringify([newPermission]));
location.reload();`);
  
  console.log('\n🔄 Alternatif Çözüm (String tabanlı):');
  console.log(`localStorage.setItem('userPermissions', JSON.stringify(['${READ_PROPERTY_PERMISSION_NAME}']));
location.reload();`);
} else {
  // 2. Parse et
  console.log('\n2. userPermissions parse edildi:');
  let parsedPermissions;
  try {
    parsedPermissions = JSON.parse(userPermissionsRaw);
    console.log('   Parsed permissions:', parsedPermissions);
    console.log('   Type:', typeof parsedPermissions);
    console.log('   Is Array:', Array.isArray(parsedPermissions));
    console.log('   Length:', parsedPermissions.length);
  } catch (error) {
    console.log('❌ Parse hatası:', error);
    return;
  }

  // 3. Permission formatını kontrol et
  console.log('\n3. Permission format analizi:');
  if (parsedPermissions.length > 0) {
    const firstItem = parsedPermissions[0];
    console.log('   İlk item:', firstItem);
    console.log('   İlk item type:', typeof firstItem);
    
    if (typeof firstItem === 'string') {
      console.log('   ✅ Format: String Array');
    } else if (typeof firstItem === 'object' && firstItem !== null) {
      console.log('   ✅ Format: Object Array');
      console.log('   Object keys:', Object.keys(firstItem));
      if (firstItem.id) console.log('   Has ID field:', firstItem.id);
      if (firstItem.name) console.log('   Has name field:', firstItem.name);
    }
  }

  // 4. Read Property permission kontrolü
  console.log('\n4. Read Property permission kontrolü:');
  console.log(`   Aranan ID: ${READ_PROPERTY_PERMISSION_ID}`);
  console.log(`   Aranan Name: ${READ_PROPERTY_PERMISSION_NAME}`);
  
  let hasReadPropertyById = false;
  let hasReadPropertyByName = false;
  
  if (parsedPermissions.length > 0) {
    const firstItem = parsedPermissions[0];
    
    // ID tabanlı kontrol (öncelikli)
    hasReadPropertyById = parsedPermissions.some(perm => 
      typeof perm === 'object' && perm !== null && perm.id === READ_PROPERTY_PERMISSION_ID
    );
    console.log('   ID tabanlı kontrol - Read Property found:', hasReadPropertyById);
    
    // Name tabanlı kontrol (geriye dönük uyumluluk)
    if (typeof firstItem === 'string') {
      // String array format
      hasReadPropertyByName = parsedPermissions.includes(READ_PROPERTY_PERMISSION_NAME);
      console.log('   String array check - Read Property found:', hasReadPropertyByName);
    } else if (typeof firstItem === 'object' && firstItem !== null) {
      // Object array format
      hasReadPropertyByName = parsedPermissions.some(perm => 
        perm.name === READ_PROPERTY_PERMISSION_NAME
      );
      console.log('   Object array check - Read Property found:', hasReadPropertyByName);
    }
  }
  
  const hasAnyReadPropertyPermission = hasReadPropertyById || hasReadPropertyByName;
  
  if (hasAnyReadPropertyPermission) {
    console.log('\n✅ Read Property permission bulundu!');
    if (hasReadPropertyById) {
      console.log('   ✅ ID tabanlı permission mevcut');
    }
    if (hasReadPropertyByName) {
      console.log('   ✅ Name tabanlı permission mevcut');
    }
    console.log('\n🎯 Konut Yönetimi butonu sidebar\'da görünmelidir.');
    console.log('\n🔍 Eğer hala görünmüyorsa:');
    console.log('   1. Sayfayı yenileyin (F5)');
    console.log('   2. Browser cache\'ini temizleyin');
    console.log('   3. Console\'da Sidebar debug loglarını kontrol edin');
  } else {
    console.log('\n❌ Read Property permission bulunamadı!');
    console.log('\n🚀 Hızlı Çözüm Seçenekleri:');
    
    console.log('\n📋 Seçenek 1: ID tabanlı permission ekle (Önerilen)');
    console.log(`const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermission = {
  id: '${READ_PROPERTY_PERMISSION_ID}',
  name: '${READ_PROPERTY_PERMISSION_NAME}',
  description: 'Permission to view property information',
  action: 'read',
  resource: 'property',
  isSystem: false
};
const newPermissions = [...currentPermissions, newPermission];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('ID tabanlı permission eklendi, sayfa yenileniyor...');
location.reload();`);
    
    console.log('\n📋 Seçenek 2: String tabanlı permission ekle (Geriye dönük uyumluluk)');
    console.log(`const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermissions = [...currentPermissions, '${READ_PROPERTY_PERMISSION_NAME}'];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('String permission eklendi, sayfa yenileniyor...');
location.reload();`);
    
    console.log('\n📋 Seçenek 3: Object tabanlı permission ekle (Name field ile)');
    console.log(`const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermission = {
  name: '${READ_PROPERTY_PERMISSION_NAME}',
  description: 'Permission to view property information',
  action: 'read',
  resource: 'property'
};
const newPermissions = [...currentPermissions, newPermission];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('Object permission eklendi, sayfa yenileniyor...');
location.reload();`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('🔍 Property Management Permission Debug Script Tamamlandı.');
console.log('\n💡 İpucu: Yukarıdaki çözümlerden birini kopyalayıp console\'a yapıştırın.');