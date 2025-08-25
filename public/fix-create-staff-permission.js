// CREATE STAFF Permission Düzeltme Script'i
console.log('CREATE STAFF izni kontrol ediliyor...');

const CREATE_STAFF_PERMISSION_ID = 'Create Staff';
const CREATE_STAFF_PERMISSION_NAME = 'Create Staff';

try {
    const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
    console.log('Toplam izin sayısı:', userPermissions.length);
    
    // CREATE_STAFF iznini kontrol et
    const hasCreateStaffPermission = userPermissions.some(p => 
        p.id === CREATE_STAFF_PERMISSION_ID || p.name === CREATE_STAFF_PERMISSION_NAME
    );
    
    if (hasCreateStaffPermission) {
        console.log('✅ CREATE STAFF izni mevcut!');
        console.log('Sayfa yenileniyor...');
        window.location.reload();
    } else {
        console.log('❌ CREATE STAFF izni bulunamadı, ekleniyor...');
        
        // İzni ekle
        userPermissions.push({
            id: CREATE_STAFF_PERMISSION_ID,
            name: CREATE_STAFF_PERMISSION_NAME,
            action: 'create',
            resource: 'staff',
            description: 'Permission to create new staff members'
        });
        
        localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
        console.log('✅ CREATE STAFF izni başarıyla eklendi!');
        console.log('Sayfa yenileniyor...');
        window.location.reload();
    }
} catch (error) {
    console.error('Hata:', error);
    console.log('localStorage temizleniyor ve yeniden denenecek...');
    localStorage.removeItem('userPermissions');
    window.location.reload();
}