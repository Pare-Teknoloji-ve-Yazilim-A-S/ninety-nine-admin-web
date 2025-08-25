// Bu kodu browser console'da çalıştırarak localStorage'daki izinleri kontrol edebilirsiniz

console.log('=== USER PERMISSIONS DEBUG ===');

// localStorage'dan raw permissions'ı al
const rawPermissions = localStorage.getItem('userPermissions');
console.log('Raw localStorage data:', rawPermissions);

if (rawPermissions) {
  try {
    const parsed = JSON.parse(rawPermissions);
    console.log('Parsed permissions:', parsed);
    console.log('Type:', typeof parsed);
    console.log('Is Array:', Array.isArray(parsed));
    
    if (Array.isArray(parsed)) {
      console.log('Permission count:', parsed.length);
      console.log('First 10 permissions:', parsed.slice(0, 10));
    } else if (typeof parsed === 'object') {
      console.log('Object keys:', Object.keys(parsed));
      console.log('Object values:', Object.values(parsed));
    }
  } catch (e) {
    console.error('Error parsing permissions:', e);
  }
} else {
  console.log('No permissions found in localStorage');
}

// Permission ID'leri kontrol et
console.log('\n=== PERMISSION IDS ===');
console.log('CREATE_BILLING_PERMISSION_ID should be:', 'create-billing');
console.log('CREATE_PAYMENT_PERMISSION_ID should be:', 'create-payment');
console.log('READ_BILLING_PERMISSION_ID should be:', 'read-billing');

// Test permission check function
function testPermissionCheck(requiredPermission) {
  try {
    let userPerms = null;
    const stored = localStorage.getItem('userPermissions');
    if (stored) {
      userPerms = JSON.parse(stored);
    }

    if (!userPerms) {
      return false;
    }

    // Create variations of the permission
    const variations = [
      requiredPermission,
      requiredPermission.toLowerCase(),
      requiredPermission.toUpperCase(),
      requiredPermission.replace(/-/g, '_'),
      requiredPermission.replace(/_/g, '-')
    ];

    console.log(`Testing permission: ${requiredPermission}`);
    console.log('Variations:', variations);

    if (Array.isArray(userPerms)) {
      const found = variations.some(variation => userPerms.includes(variation));
      console.log(`Found in array: ${found}`);
      return found;
    }

    if (typeof userPerms === 'object') {
      const values = Object.values(userPerms);
      const found = variations.some(variation => values.includes(variation));
      console.log(`Found in object values: ${found}`);
      return found;
    }

    return false;
  } catch (error) {
    console.error('Error in permission check:', error);
    return false;
  }
}

// Test specific permissions
console.log('\n=== PERMISSION TESTS ===');
testPermissionCheck('create-billing');
testPermissionCheck('create-payment');
testPermissionCheck('read-billing');

console.log('\n=== DEBUG COMPLETE ===');