// Debug script to check user permissions in localStorage
console.log('=== USER PERMISSIONS DEBUG ===');

// Get userPermissions from localStorage
const userPermissions = localStorage.getItem('userPermissions');
console.log('Raw userPermissions from localStorage:', userPermissions);

if (userPermissions) {
  try {
    const parsed = JSON.parse(userPermissions);
    console.log('Parsed userPermissions:', parsed);
    console.log('Type:', typeof parsed);
    console.log('Is Array:', Array.isArray(parsed));
    
    if (Array.isArray(parsed)) {
      console.log('Total permissions count:', parsed.length);
      console.log('First 10 permissions:');
      parsed.slice(0, 10).forEach((perm, index) => {
        console.log(`${index + 1}:`, perm);
      });
      
      // Check for CREATE_STAFF permission
      const createStaffPermissionId = 'b4f49d5f-61ea-42ea-be3f-55fce8b6223d';
      const createStaffFound = parsed.find(perm => {
        if (typeof perm === 'string') {
          return perm === createStaffPermissionId || perm === 'CREATE_STAFF' || perm === 'Create Staff';
        }
        if (typeof perm === 'object' && perm !== null) {
          return perm.id === createStaffPermissionId || 
                 perm.name === 'CREATE_STAFF' || 
                 perm.name === 'Create Staff';
        }
        return false;
      });
      
      console.log('\n=== CREATE_STAFF PERMISSION CHECK ===');
      console.log('Looking for ID:', createStaffPermissionId);
      console.log('CREATE_STAFF permission found:', createStaffFound);
      
      if (!createStaffFound) {
        console.log('\n❌ CREATE_STAFF permission NOT FOUND!');
        console.log('Available permission IDs:');
        parsed.forEach((perm, index) => {
          if (typeof perm === 'object' && perm !== null && perm.id) {
            console.log(`${index + 1}: ${perm.id} - ${perm.name || 'No name'}`);
          }
        });
      } else {
        console.log('\n✅ CREATE_STAFF permission FOUND:', createStaffFound);
      }
    }
  } catch (e) {
    console.error('Error parsing userPermissions:', e);
  }
} else {
  console.log('❌ No userPermissions found in localStorage');
}

console.log('\n=== END DEBUG ===');