// Basit permission debug scripti
const userPermissions = localStorage.getItem('userPermissions');
if (userPermissions) {
  const parsed = JSON.parse(userPermissions);
  const createStaffId = 'b4f49d5f-61ea-42ea-be3f-55fce8b6223d';
  const found = parsed.find(p => p.id === createStaffId);
  console.log('CREATE_STAFF izni:', found ? 'VAR' : 'YOK');
  if (found) {
    console.log('İzin detayı:', found);
  } else {
    console.log('Mevcut izin sayısı:', parsed.length);
    console.log('İlk 5 izin ID:');
    parsed.slice(0, 5).forEach((p, i) => console.log(`${i+1}: ${p.id}`));
  }
} else {
  console.log('userPermissions bulunamadı');
}