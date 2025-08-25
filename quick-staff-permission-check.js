// Hızlı CREATE STAFF Permission Kontrolü
// Bu kodu tarayıcı console'unda çalıştırın

console.log('🔍 CREATE STAFF Permission Hızlı Kontrol');
console.log('=' .repeat(50));

// Permission sabitleri
const CREATE_STAFF_ID = 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6';
const CREATE_STAFF_NAME = 'Create Staff';

// localStorage'dan permissions al
const userPermissions = localStorage.getItem('userPermissions');
console.log('📋 userPermissions:', userPermissions);

if (userPermissions) {
  try {
    const permissions = JSON.parse(userPermissions);
    console.log('📋 Parsed permissions:', permissions);
    console.log('📋 Array length:', permissions.length);
    
    // Permission kontrolü
    let hasPermission = false;
    
    permissions.forEach((perm, index) => {
      if (typeof perm === 'object' && perm !== null) {
        if (perm.id === CREATE_STAFF_ID || perm.name === CREATE_STAFF_NAME) {
          hasPermission = true;
          console.log(`✅ CREATE STAFF permission bulundu! Index: ${index}`, perm);
        }
      } else if (typeof perm === 'string' && perm === CREATE_STAFF_NAME) {
        hasPermission = true;
        console.log(`✅ CREATE STAFF permission bulundu! (String) Index: ${index}`, perm);
      }
    });
    
    console.log('\n🎯 SONUÇ:', hasPermission ? '✅ İzin VAR' : '❌ İzin YOK');
    
    if (!hasPermission) {
      console.log('\n🚀 HIZLI ÇÖZÜM - Bu kodu çalıştırın:');
      console.log('const perms = JSON.parse(localStorage.getItem("userPermissions") || "[]");');
      console.log('perms.push({id: "' + CREATE_STAFF_ID + '", name: "' + CREATE_STAFF_NAME + '"});');
      console.log('localStorage.setItem("userPermissions", JSON.stringify(perms));');
      console.log('location.reload();');
      
      console.log('\n📋 Veya tek satırda:');
      console.log('const p=JSON.parse(localStorage.getItem("userPermissions")||"[]");p.push({id:"a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",name:"Create Staff"});localStorage.setItem("userPermissions",JSON.stringify(p));location.reload();');
    }
  } catch (e) {
    console.error('❌ Parse hatası:', e);
  }
} else {
  console.log('❌ userPermissions bulunamadı!');
  console.log('\n🚀 HIZLI ÇÖZÜM:');
  console.log('localStorage.setItem("userPermissions", JSON.stringify([{id:"a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",name:"Create Staff"}]));location.reload();');
}

console.log('\n' + '='.repeat(50));
console.log('✅ Kontrol tamamlandı!');