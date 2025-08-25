// Payment Permission Kontrolü
console.log('=== PAYMENT PERMISSION KONTROLÜ ===');

// Mevcut localStorage permission'larını al
const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
console.log('Mevcut userPermissions:', userPermissions);

// Gerekli payment permission ID'leri
const requiredPermissions = {
  'CREATE_PAYMENT': 'fb1d69ae-ba26-47b8-b366-2da6a1a1c83d',
  'READ_PAYMENT': '93127240-7cfc-4d8b-a1b6-806d6d3e61fd',
  'UPDATE_PAYMENT': '95473791-20a7-429c-b083-2934872af40d',
  'DELETE_PAYMENT': '7be7dadf-8b96-4706-9be6-758c4d106000'
};

console.log('Gerekli permission ID\'leri:', requiredPermissions);

// Her permission'ı kontrol et
Object.entries(requiredPermissions).forEach(([name, id]) => {
  const hasPermission = userPermissions.some(perm => {
    if (typeof perm === 'string') {
      return perm === id || perm === name;
    }
    if (typeof perm === 'object' && perm !== null) {
      return perm.id === id || perm.name === name;
    }
    return false;
  });
  
  console.log(`${name} (${id}): ${hasPermission ? '✅ VAR' : '❌ YOK'}`);
});

// Eksik permission'ları ekle
const missingPermissions = [];
Object.entries(requiredPermissions).forEach(([name, id]) => {
  const hasPermission = userPermissions.some(perm => {
    if (typeof perm === 'string') {
      return perm === id || perm === name;
    }
    if (typeof perm === 'object' && perm !== null) {
      return perm.id === id || perm.name === name;
    }
    return false;
  });
  
  if (!hasPermission) {
    missingPermissions.push({ id, name });
  }
});

if (missingPermissions.length > 0) {
  console.log('\n=== EKSİK PERMISSION\'LAR EKLENIYOR ===');
  
  const updatedPermissions = [...userPermissions];
  missingPermissions.forEach(perm => {
    updatedPermissions.push(perm);
    console.log(`${perm.name} eklendi`);
  });
  
  localStorage.setItem('userPermissions', JSON.stringify(updatedPermissions));
  console.log('\n✅ Tüm payment permission\'ları eklendi!');
  console.log('Sayfayı yenileyin (F5)');
  
  // Permission değişikliği event'i gönder
  window.dispatchEvent(new Event('permission-changed'));
} else {
  console.log('\n✅ Tüm payment permission\'ları mevcut!');
}

console.log('\n=== GÜNCEL PERMISSION LISTESI ===');
const finalPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
console.log(finalPermissions);