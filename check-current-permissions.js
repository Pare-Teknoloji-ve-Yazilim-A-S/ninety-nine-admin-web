// Browser console'da çalıştırın - Mevcut permission durumunu kontrol eder

console.log('🔍 === Mevcut Permission Durumu Kontrolü ===');

// localStorage'dan mevcut permissions'ları al
const permissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
console.log('📋 Toplam permission sayısı:', permissions.length);
console.log('📋 Mevcut permissions:', permissions);

// Read Property permission kontrolü
const READ_PROPERTY_ID = 'b2c8f4e1-9a7d-4f3e-8b5c-1d2e3f4a5b6c';
const READ_PROPERTY_NAME = 'Read Property';

console.log('\n🎯 Read Property Permission Kontrolü:');
console.log('🔑 Aranan ID:', READ_PROPERTY_ID);
console.log('🔑 Aranan Name:', READ_PROPERTY_NAME);

// ID tabanlı kontrol
const hasById = permissions.some(p => 
    typeof p === 'object' && p.id === READ_PROPERTY_ID
);
console.log('✅ ID ile bulundu mu?', hasById);

// Name tabanlı kontrol (object)
const hasByNameObject = permissions.some(p => 
    typeof p === 'object' && p.name === READ_PROPERTY_NAME
);
console.log('✅ Name ile bulundu mu? (object):', hasByNameObject);

// Name tabanlı kontrol (string)
const hasByNameString = permissions.some(p => 
    typeof p === 'string' && p === READ_PROPERTY_NAME
);
console.log('✅ Name ile bulundu mu? (string):', hasByNameString);

// Genel sonuç
const hasReadProperty = hasById || hasByNameObject || hasByNameString;
console.log('\n🎯 SONUÇ - Read Property permission var mı?', hasReadProperty);

if (!hasReadProperty) {
    console.log('\n❌ Read Property permission bulunamadı!');
    console.log('💡 Çözüm: Aşağıdaki kodlardan birini çalıştırın:');
    
    console.log('\n🥇 Çözüm 1 (ID tabanlı - Önerilen):');
    console.log(`const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermission = {
  id: '${READ_PROPERTY_ID}',
  name: '${READ_PROPERTY_NAME}',
  description: 'Permission to view property information',
  action: 'read',
  resource: 'property'
};
const newPermissions = [...currentPermissions, newPermission];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('✅ Permission eklendi!');
location.reload();`);
    
    console.log('\n🥈 Çözüm 2 (String tabanlı):');
    console.log(`const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermissions = [...currentPermissions, '${READ_PROPERTY_NAME}'];
localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
console.log('✅ Permission eklendi!');
location.reload();`);
} else {
    console.log('\n✅ Read Property permission mevcut!');
    console.log('🔄 Eğer sidebar\'da hala görünmüyorsa sayfayı yenileyin (F5)');
    console.log('🧹 Veya browser cache\'ini temizleyin');
}

console.log('\n🔍 === Kontrol Tamamlandı ===');