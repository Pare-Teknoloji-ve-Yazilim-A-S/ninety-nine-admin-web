// localStorage Permission Kontrol Scripti
// Bu scripti tarayıcı console'unda çalıştırın

console.log('=== localStorage Permission Kontrol ===');

// localStorage'dan userPermissions'ı al
const userPermissions = localStorage.getItem('userPermissions');
console.log('Raw userPermissions:', userPermissions);

if (userPermissions) {
  try {
    const parsed = JSON.parse(userPermissions);
    console.log('Parsed permissions:', parsed);
    console.log('Type:', typeof parsed);
    console.log('Is Array:', Array.isArray(parsed));
    
    if (Array.isArray(parsed)) {
      console.log('Length:', parsed.length);
      console.log('All permissions:', parsed);
      
      // Assign Property permission'ını ara
      const assignPropertyId = 'e5f6g7h8-i9j0-1234-efgh-ij5678901234';
      const assignPropertyName = 'Assign Property';
      
      console.log('\n--- Assign Property Permission Arama ---');
      console.log('Aranan ID:', assignPropertyId);
      console.log('Aranan Name:', assignPropertyName);
      
      // ID ile ara
      const foundById = parsed.find(p => p.id === assignPropertyId);
      console.log('ID ile bulunan:', foundById);
      
      // Name ile ara
      const foundByName = parsed.find(p => p.name === assignPropertyName || p === assignPropertyName);
      console.log('Name ile bulunan:', foundByName);
      
      // Tüm permission'ları listele
      console.log('\n--- Tüm Permission Listesi ---');
      parsed.forEach((perm, index) => {
        if (typeof perm === 'object') {
          console.log(`${index + 1}. ID: ${perm.id}, Name: ${perm.name}`);
        } else {
          console.log(`${index + 1}. String: ${perm}`);
        }
      });
    }
  } catch (error) {
    console.error('Parse error:', error);
  }
} else {
  console.log('userPermissions bulunamadı!');
}

console.log('\n=== Kontrol Tamamlandı ===');