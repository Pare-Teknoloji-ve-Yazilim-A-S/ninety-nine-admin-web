// Browser console'da çalıştırın - Cancel Ticket permission durumunu kontrol eder

console.log('🔍 === Cancel Ticket Permission Debug ===');

// localStorage'dan mevcut permissions'ları al
const permissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
console.log('📋 Toplam permission sayısı:', permissions.length);
console.log('📋 Mevcut permissions:', permissions);

// Cancel Ticket permission kontrolü
const CANCEL_TICKET_ID = 'k0l1m2n3-4o5p-6q7r-8s9t-0u1v2w3x4y5z';
const CANCEL_TICKET_NAME = 'Cancel Ticket';
const CANCEL_TICKET_TR = 'Talep İptal Et';

console.log('\n🎯 Cancel Ticket Permission Kontrolü:');
console.log('🔑 Aranan ID:', CANCEL_TICKET_ID);
console.log('🔑 Aranan Name (EN):', CANCEL_TICKET_NAME);
console.log('🔑 Aranan Name (TR):', CANCEL_TICKET_TR);

// ID tabanlı kontrol
const hasById = permissions.some(p => 
    typeof p === 'object' && p.id === CANCEL_TICKET_ID
);
console.log('✅ ID ile bulundu mu?', hasById);

// Name tabanlı kontrol (object - EN)
const hasByNameObjectEN = permissions.some(p => 
    typeof p === 'object' && p.name === CANCEL_TICKET_NAME
);
console.log('✅ Name ile bulundu mu? (object-EN):', hasByNameObjectEN);

// Name tabanlı kontrol (object - TR)
const hasByNameObjectTR = permissions.some(p => 
    typeof p === 'object' && p.name === CANCEL_TICKET_TR
);
console.log('✅ Name ile bulundu mu? (object-TR):', hasByNameObjectTR);

// Name tabanlı kontrol (string - EN)
const hasByNameStringEN = permissions.some(p => 
    typeof p === 'string' && p === CANCEL_TICKET_NAME
);
console.log('✅ Name ile bulundu mu? (string-EN):', hasByNameStringEN);

// Name tabanlı kontrol (string - TR)
const hasByNameStringTR = permissions.some(p => 
    typeof p === 'string' && p === CANCEL_TICKET_TR
);
console.log('✅ Name ile bulundu mu? (string-TR):', hasByNameStringTR);

// Genel sonuç
const hasCancelTicket = hasById || hasByNameObjectEN || hasByNameObjectTR || hasByNameStringEN || hasByNameStringTR;
console.log('\n🎯 SONUÇ - Cancel Ticket permission var mı?', hasCancelTicket);

if (!hasCancelTicket) {
    console.log('\n❌ Cancel Ticket permission bulunamadı!');
    console.log('💡 Çözüm önerileri:');
    console.log('1. Admin panelinden kullanıcıya Cancel Ticket izni verin');
    console.log('2. Veritabanında doğru izin ID\'sini kontrol edin');
    console.log('3. Permission cache\'ini temizlemek için logout/login yapın');
    console.log('4. Veritabanında Cancel Ticket izni oluşturulmuş mu kontrol edin');
} else {
    console.log('\n✅ Cancel Ticket permission mevcut!');
    console.log('💡 Eğer İptal Et butonu hala görünmüyorsa:');
    console.log('1. Sayfayı yenileyin (F5)');
    console.log('2. Browser cache\'ini temizleyin');
    console.log('3. usePermissionCheck hook\'unun doğru çalıştığını kontrol edin');
}

// Update Ticket permission de kontrol et
const UPDATE_TICKET_ID = 'i8j9k0l1-2m3n-4o5p-6q7r-8s9t0u1v2w3x';
const UPDATE_TICKET_NAME = 'Update Ticket';

const hasUpdateTicket = permissions.some(p => 
    (typeof p === 'object' && (p.id === UPDATE_TICKET_ID || p.name === UPDATE_TICKET_NAME)) ||
    (typeof p === 'string' && p === UPDATE_TICKET_NAME)
);

console.log('\n🔄 Update Ticket permission var mı?', hasUpdateTicket);

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
console.log('\n💡 Sonraki adımlar:');
console.log('1. Eğer Cancel Ticket permission yoksa, admin panelinden ekleyin');
console.log('2. Eğer varsa ama buton görünmüyorsa, component kodunu kontrol edin');
console.log('3. Permission cache problemi varsa logout/login yapın');