// Debug script to check READ_BILLING_PERMISSION in localStorage
// Run this in browser console on http://localhost:3000

console.log('=== READ BILLING PERMISSION DEBUG ===');

// Expected permission ID
const READ_BILLING_PERMISSION_ID = 'd3e4f5g6-7h8i-9j0k-1l2m-3n4o5p6q7r8s';
console.log('Expected READ_BILLING_PERMISSION_ID:', READ_BILLING_PERMISSION_ID);

// Get user data from localStorage
const userData = localStorage.getItem('user');
if (!userData) {
  console.error('❌ No user data found in localStorage');
} else {
  console.log('✅ User data found in localStorage');
  
  try {
    const user = JSON.parse(userData);
    console.log('User object:', user);
    
    // Check if user has roles
    if (!user.roles || !Array.isArray(user.roles)) {
      console.error('❌ No roles found in user data');
    } else {
      console.log('✅ User roles found:', user.roles.length);
      
      // Check each role for permissions
      user.roles.forEach((role, roleIndex) => {
        console.log(`\n--- Role ${roleIndex + 1}: ${role.name} ---`);
        
        if (!role.permissions || !Array.isArray(role.permissions)) {
          console.warn(`⚠️ No permissions found in role: ${role.name}`);
        } else {
          console.log(`✅ Role ${role.name} has ${role.permissions.length} permissions`);
          
          // Look for READ_BILLING_PERMISSION
          const readBillingPermission = role.permissions.find(p => 
            p.id === READ_BILLING_PERMISSION_ID || 
            p.name === 'Read Billing' ||
            p.name === 'Fatura Görüntüle'
          );
          
          if (readBillingPermission) {
            console.log(`🎉 READ BILLING PERMISSION FOUND in role ${role.name}:`, readBillingPermission);
          } else {
            console.warn(`❌ READ BILLING PERMISSION NOT FOUND in role ${role.name}`);
            console.log('Available permissions in this role:');
            role.permissions.forEach(p => {
              console.log(`  - ${p.name} (${p.id})`);
            });
          }
        }
      });
      
      // Check if any role has the READ_BILLING_PERMISSION
      const hasReadBillingPermission = user.roles.some(role => 
        role.permissions && role.permissions.some(p => 
          p.id === READ_BILLING_PERMISSION_ID || 
          p.name === 'Read Billing' ||
          p.name === 'Fatura Görüntüle'
        )
      );
      
      console.log('\n=== FINAL RESULT ===');
      if (hasReadBillingPermission) {
        console.log('🎉 USER HAS READ BILLING PERMISSION');
      } else {
        console.log('❌ USER DOES NOT HAVE READ BILLING PERMISSION');
        console.log('\n💡 To add this permission, you can run:');
        console.log(`
const userData = JSON.parse(localStorage.getItem('user'));
if (userData.roles && userData.roles[0] && userData.roles[0].permissions) {
  userData.roles[0].permissions.push({
    id: '${READ_BILLING_PERMISSION_ID}',
    name: 'Read Billing',
    description: 'Permission to read billing information'
  });
  localStorage.setItem('user', JSON.stringify(userData));
  console.log('✅ READ BILLING permission added!');
  window.location.reload();
}`);
      }
    }
  } catch (error) {
    console.error('❌ Error parsing user data:', error);
  }
}

console.log('\n=== DEBUG COMPLETE ===');