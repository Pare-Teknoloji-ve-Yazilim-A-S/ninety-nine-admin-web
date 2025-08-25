// Browser console'da çalıştırın - Create Ticket permission durumunu kontrol eder

console.log('🔍 === Create Ticket Permission Debug ===');

// localStorage'dan mevcut permissions'ları al
const permissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
console.log('📋 Toplam permission sayısı:', permissions.length);
console.log('📋 Mevcut permissions:', permissions);

// Create Ticket permission kontrolü
const CREATE_TICKET_ID = 'h7i8j9k0-1l2m-3n4o-5p6q-7r8s9t0u1v2w';
const CREATE_TICKET_NAME = 'Create Ticket';
const CREATE_TICKET_TR = 'Talep Oluştur';

console.log('\n🎯 Create Ticket Permission Kontrolü:');
console.log('🔑 Aranan ID:', CREATE_TICKET_ID);
console.log('🔑 Aranan Name (EN):', CREATE_TICKET_NAME);
console.log('🔑 Aranan Name (TR):', CREATE_TICKET_TR);

// ID tabanlı kontrol
const hasById = permissions.some(p => 
    typeof p === 'object' && p.id === CREATE_TICKET_ID
);
console.log('✅ ID ile bulundu mu?', hasById);

// Name tabanlı kontrol (object - EN)
const hasByNameObjectEN = permissions.some(p => 
    typeof p === 'object' && p.name === CREATE_TICKET_NAME
);
console.log('✅ Name ile bulundu mu? (object-EN):', hasByNameObjectEN);

// Name tabanlı kontrol (object - TR)
const hasByNameObjectTR = permissions.some(p => 
    typeof p === 'object' && p.name === CREATE_TICKET_TR
);
console.log('✅ Name ile bulundu mu? (object-TR):', hasByNameObjectTR);

// Name tabanlı kontrol (string - EN)
const hasByNameStringEN = permissions.some(p => 
    typeof p === 'string' && p === CREATE_TICKET_NAME
);
console.log('✅ Name ile bulundu mu? (string-EN):', hasByNameStringEN);

// Name tabanlı kontrol (string - TR)
const hasByNameStringTR = permissions.some(p => 
    typeof p === 'string' && p === CREATE_TICKET_TR
);
console.log('✅ Name ile bulundu mu? (string-TR):', hasByNameStringTR);

// Genel sonuç
const hasCreateTicket = hasById || hasByNameObjectEN || hasByNameObjectTR || hasByNameStringEN || hasByNameStringTR;
console.log('\n🎯 SONUÇ - Create Ticket permission var mı?', hasCreateTicket);

if (!hasCreateTicket) {
    console.log('\n❌ Create Ticket permission bulunamadı!');
    console.log('💡 Çözüm önerileri:');
    console.log('1. Admin panelinden kullanıcıya Create Ticket izni verin');
    console.log('2. Veritabanında doğru izin ID\'sini kontrol edin');
    console.log('3. Permission cache\'ini temizlemek için logout/login yapın');
} else {
    console.log('\n✅ Create Ticket permission mevcut!');
    console.log('💡 Eğer buton hala görünüyorsa:');
    console.log('1. Sayfayı yenileyin (F5)');
    console.log('2. Browser cache\'ini temizleyin');
    console.log('3. usePermissionCheck hook\'unun doğru çalıştığını kontrol edin');
}

// Detaylı permission listesi
console.log('\n📝 Detaylı Permission Listesi:');
if (permissions.length > 0) {
    permissions.forEach((perm, index) => {
        if (typeof perm === 'object') {
            console.log(`${index + 1}. ID: ${perm.id}, Name: ${perm.name}`);
        } else {
            console.log(`${index + 1}. String: ${perm}`);
        }
    });
} else {
    console.log('Hiç permission bulunamadı!');
}

console.log('\n=== Debug Tamamlandı ===');