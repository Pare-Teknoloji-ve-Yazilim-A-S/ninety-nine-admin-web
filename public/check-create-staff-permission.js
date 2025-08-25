console.log('=== CREATE STAFF Permission Check ===');

// localStorage'dan izinleri al
const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
console.log('Total permissions:', userPermissions.length);
console.log('All permissions:', userPermissions);

// CREATE_STAFF iznini ara
const createStaffPermission = userPermissions.find(p => 
  p.id === 'Create Staff' || 
  p.name === 'Create Staff' ||
  p.id === 'b4f49d5f-61ea-42ea-be3f-55fce8b6223d'
);

console.log('CREATE_STAFF permission found:', createStaffPermission);

// Tüm izin ID'lerini listele
console.log('All permission IDs:');
userPermissions.forEach((p, index) => {
  console.log(`${index + 1}. ID: "${p.id}", Name: "${p.name}"`);
});

// String karşılaştırması test et
const testId = 'Create Staff';
const hasPermission = userPermissions.some(p => p.id === testId || p.name === testId);
console.log(`Has permission for "${testId}":`, hasPermission);

console.log('=== End Check ===');