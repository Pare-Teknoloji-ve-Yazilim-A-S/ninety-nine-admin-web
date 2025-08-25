// Direkt Permission Kontrol ve Düzeltme Scripti
// Bu scripti tarayıcı console'unda çalıştırın

console.log('=== Direkt Permission Kontrol ve Düzeltme ===');

// Mevcut permission verilerini kontrol et
const userPermissions = localStorage.getItem('userPermissions');
console.log('Mevcut userPermissions:', userPermissions);

if (userPermissions) {
  try {
    const parsed = JSON.parse(userPermissions);
    console.log('Parse edilmiş permissions:', parsed);
    
    const assignPropertyId = 'e5f6g7h8-i9j0-1234-efgh-ij5678901234';
    const assignPropertyName = 'Assign Property';
    
    // Assign Property permission'ını ara
    let hasAssignProperty = false;
    
    if (Array.isArray(parsed)) {
      // ID ile kontrol
      const foundById = parsed.find(p => p.id === assignPropertyId);
      // Name ile kontrol
      const foundByName = parsed.find(p => p.name === assignPropertyName || p === assignPropertyName);
      
      hasAssignProperty = !!(foundById || foundByName);
      
      console.log('ID ile bulunan:', foundById);
      console.log('Name ile bulunan:', foundByName);
      console.log('Assign Property var mı?', hasAssignProperty);
      
      // Eğer permission yoksa ekle
      if (!hasAssignProperty) {
        console.log('Assign Property permission bulunamadı, ekleniyor...');
        
        // Permission objesini ekle
        const newPermission = {
          id: assignPropertyId,
          name: assignPropertyName
        };
        
        parsed.push(newPermission);
        localStorage.setItem('userPermissions', JSON.stringify(parsed));
        
        console.log('Assign Property permission eklendi!');
        console.log('Yeni permission listesi:', parsed);
        
        // Permission değişikliği event'ini tetikle
        window.dispatchEvent(new Event('permission-changed'));
        
        console.log('Sayfa yenileniyor...');
        window.location.reload();
      } else {
        console.log('Assign Property permission zaten mevcut!');
        
        // Permission var ama butonlar gözükmüyorsa, permission-changed event'ini tetikle
        console.log('Permission-changed event tetikleniyor...');
        window.dispatchEvent(new Event('permission-changed'));
        
        // 1 saniye sonra sayfayı yenile
        setTimeout(() => {
          console.log('Sayfa yenileniyor...');
          window.location.reload();
        }, 1000);
      }
    } else {
      console.error('Permission verisi array formatında değil!');
    }
    
  } catch (error) {
    console.error('Permission parse hatası:', error);
  }
} else {
  console.log('userPermissions bulunamadı, yeni liste oluşturuluyor...');
  
  // Yeni permission listesi oluştur
  const newPermissions = [
    {
      id: 'e5f6g7h8-i9j0-1234-efgh-ij5678901234',
      name: 'Assign Property'
    }
  ];
  
  localStorage.setItem('userPermissions', JSON.stringify(newPermissions));
  console.log('Yeni permission listesi oluşturuldu:', newPermissions);
  
  // Permission değişikliği event'ini tetikle
  window.dispatchEvent(new Event('permission-changed'));
  
  console.log('Sayfa yenileniyor...');
  window.location.reload();
}

console.log('=== Kontrol Tamamlandı ===');