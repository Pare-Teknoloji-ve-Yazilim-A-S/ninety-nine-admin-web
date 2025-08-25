// CREATE_ANNOUNCEMENT izin kontrolü için hata ayıklama betiği
// Bu betiği tarayıcı konsolunda çalıştırın

console.log('=== CREATE_ANNOUNCEMENT İzin Kontrolü ===');

// localStorage'dan userPermissions'ı al
const userPermissionsStr = localStorage.getItem('userPermissions');
console.log('localStorage userPermissions (raw):', userPermissionsStr);

if (userPermissionsStr) {
    try {
        const userPermissions = JSON.parse(userPermissionsStr);
        console.log('Parsed userPermissions:', userPermissions);
        
        // CREATE_ANNOUNCEMENT izin kontrolü
        const createAnnouncementPermissionId = 'Create Announcement';
        const createAnnouncementPermissionName = 'Create Announcement';
        
        console.log('\n=== İzin Kontrolü ===');
        console.log('Aranan izin ID:', createAnnouncementPermissionId);
        console.log('Aranan izin Name:', createAnnouncementPermissionName);
        
        // ID ile kontrol
        const hasPermissionById = userPermissions.some(permission => 
            permission.id === createAnnouncementPermissionId || 
            permission.name === createAnnouncementPermissionId
        );
        
        // Name ile kontrol
        const hasPermissionByName = userPermissions.some(permission => 
            permission.id === createAnnouncementPermissionName || 
            permission.name === createAnnouncementPermissionName
        );
        
        console.log('ID ile izin var mı?:', hasPermissionById);
        console.log('Name ile izin var mı?:', hasPermissionByName);
        console.log('Genel sonuç:', hasPermissionById || hasPermissionByName);
        
        // Tüm izin ID'lerini listele
        console.log('\n=== Mevcut İzinler ===');
        userPermissions.forEach((permission, index) => {
            console.log(`${index + 1}. ID: "${permission.id}", Name: "${permission.name}"`);
        });
        
        // CREATE ile başlayan izinleri filtrele
        const createPermissions = userPermissions.filter(permission => 
            (permission.id && permission.id.toLowerCase().includes('create')) ||
            (permission.name && permission.name.toLowerCase().includes('create'))
        );
        
        console.log('\n=== CREATE İzinleri ===');
        createPermissions.forEach((permission, index) => {
            console.log(`${index + 1}. ID: "${permission.id}", Name: "${permission.name}"`);
        });
        
        // ANNOUNCEMENT ile ilgili izinleri filtrele
        const announcementPermissions = userPermissions.filter(permission => 
            (permission.id && permission.id.toLowerCase().includes('announcement')) ||
            (permission.name && permission.name.toLowerCase().includes('announcement'))
        );
        
        console.log('\n=== ANNOUNCEMENT İzinleri ===');
        announcementPermissions.forEach((permission, index) => {
            console.log(`${index + 1}. ID: "${permission.id}", Name: "${permission.name}"`);
        });
        
    } catch (error) {
        console.error('userPermissions parse hatası:', error);
    }
} else {
    console.log('localStorage\'da userPermissions bulunamadı!');
}

console.log('\n=== Test Tamamlandı ===');