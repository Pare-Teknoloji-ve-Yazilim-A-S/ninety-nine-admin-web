// Aidat Tahsilat Trendi - Permission Debug Script (ID Tabanlı)
// Bu script'i browser console'da çalıştırın

console.log('=== Aidat Tahsilat Trendi Permission Debug (ID Tabanlı) ===');

// Permission ID ve name tanımları
const BILLING_STATS_PERMISSION_ID = '4158aedc-5ae7-4a79-a746-a8268dd1510e';
const BILLING_STATS_PERMISSION_NAME = 'billing:stats:read';

console.log('Aranan Permission ID:', BILLING_STATS_PERMISSION_ID);
console.log('Aranan Permission Name (geriye dönük uyumluluk):', BILLING_STATS_PERMISSION_NAME);

// 1. localStorage'dan userPermissions'ı kontrol et
const userPermissions = localStorage.getItem('userPermissions');
console.log('1. Raw userPermissions:', userPermissions);

if (!userPermissions) {
  console.error('❌ userPermissions localStorage\'da bulunamadı!');
  console.log('🔧 Çözüm: Giriş yapın veya sayfayı yenileyin.');
} else {
  try {
    const parsedPermissions = JSON.parse(userPermissions);
    console.log('2. Parsed permissions:', parsedPermissions);
    console.log('3. Permissions type:', typeof parsedPermissions);
    console.log('4. Is array:', Array.isArray(parsedPermissions));
    
    if (Array.isArray(parsedPermissions)) {
      console.log('5. Array length:', parsedPermissions.length);
      console.log('6. First few permissions:', parsedPermissions.slice(0, 3));
      
      // ID tabanlı permission kontrolü
      let hasBillingStatsById = false;
      let hasBillingStatsByName = false;
      
      if (parsedPermissions.length > 0) {
        const firstItem = parsedPermissions[0];
        
        // ID tabanlı kontrol (öncelikli)
        hasBillingStatsById = parsedPermissions.some(perm => 
          typeof perm === 'object' && perm !== null && perm.id === BILLING_STATS_PERMISSION_ID
        );
        console.log('7a. ID tabanlı kontrol - Billing Statistics found:', hasBillingStatsById);
        
        // Name tabanlı kontrol (geriye dönük uyumluluk)
        if (typeof firstItem === 'string') {
          // String array format
          hasBillingStatsByName = parsedPermissions.includes(BILLING_STATS_PERMISSION_NAME);
          console.log('7b. String array check - billing:stats:read found:', hasBillingStatsByName);
        } else if (typeof firstItem === 'object' && firstItem !== null) {
          // Object array format
          hasBillingStatsByName = parsedPermissions.some(perm => 
            perm.name === BILLING_STATS_PERMISSION_NAME
          );
          console.log('7b. Object array check - billing:stats:read found:', hasBillingStatsByName);
        }
      }
      
      const hasAnyBillingStatsPermission = hasBillingStatsById || hasBillingStatsByName;
      
      if (hasAnyBillingStatsPermission) {
        console.log('✅ Billing Statistics permission bulundu!');
        if (hasBillingStatsById) {
          console.log('   ✅ ID tabanlı permission mevcut');
        }
        if (hasBillingStatsByName) {
          console.log('   ✅ Name tabanlı permission mevcut');
        }
        console.log('🔍 Diğer olası sorunlar:');
        console.log('   - usePermissionCheck hook\'u doğru çalışmıyor olabilir');
        console.log('   - Component render sırasında bir hata oluyor olabilir');
        console.log('   - Permission loading durumu kontrol edin');
      } else {
        console.log('❌ Billing Statistics permission bulunamadı!');
        console.log('🔧 Hızlı çözüm için aşağıdaki kodlardan birini çalıştırın:');
        
        // ID tabanlı çözüm (önerilen)
        console.log(`\n// ID tabanlı çözüm (önerilen):
const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
const newPermission = {
  id: '${BILLING_STATS_PERMISSION_ID}',
  name: 'Billing Statistics',
  description: 'Permission to view billing statistics',
  action: 'read',
  resource: 'billing',
  isSystem: false
};
currentPermissions.push(newPermission);
localStorage.setItem('userPermissions', JSON.stringify(currentPermissions));
console.log('ID tabanlı permission eklendi');
location.reload();`);
        
        // Name tabanlı çözümler
        if (typeof parsedPermissions[0] === 'string') {
          console.log(`\n// String format için (geriye dönük uyumluluk):
const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
currentPermissions.push('${BILLING_STATS_PERMISSION_NAME}');
localStorage.setItem('userPermissions', JSON.stringify(currentPermissions));
location.reload();`);
        } else {
          console.log(`\n// Object format için (name tabanlı):
const currentPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
currentPermissions.push({ name: '${BILLING_STATS_PERMISSION_NAME}', description: 'Billing statistics permission' });
localStorage.setItem('userPermissions', JSON.stringify(currentPermissions));
location.reload();`);
        }
      }
    } else {
      console.error('❌ userPermissions array formatında değil!');
      console.log('🔧 Çözüm: localStorage\'ı temizleyin ve tekrar giriş yapın.');
    }
  } catch (error) {
    console.error('❌ userPermissions parse edilemedi:', error);
    console.log('🔧 Çözüm: localStorage\'ı temizleyin ve tekrar giriş yapın.');
  }
}

// 2. Mevcut kullanıcı bilgilerini kontrol et
const userInfo = localStorage.getItem('userInfo');
console.log('\n=== KULLANICI BİLGİLERİ ===');
console.log('User info:', userInfo ? JSON.parse(userInfo) : 'Bulunamadı');

// 3. Auth token kontrolü
const authToken = localStorage.getItem('authToken');
console.log('\n=== AUTH TOKEN ===');
console.log('Auth token exists:', !!authToken);
console.log('Token length:', authToken ? authToken.length : 0);

// 4. Console'daki mevcut log'ları kontrol et
console.log('\n=== MEVCUT CONSOLE LOG\'LARI ===');
console.log('FinancialChart debug log\'larını kontrol edin:');
console.log('- FinancialChart - canViewFinancialChart: ?');
console.log('- FinancialChart - permissionLoading: ?');
console.log('- User permissions from localStorage: ?');
console.log('- Required permission: billing:stats:read');

console.log('\n=== DEBUG TAMAMLANDI ===');
console.log('Yukarıdaki bilgileri inceleyerek sorunu tespit edebilirsiniz.');