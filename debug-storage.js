// Debug script to check browser storage for hardcoded ID
console.log('=== BROWSER STORAGE DEBUG ===');

const targetId = 'c9a4578a-b9c0-461a-8cb3-7b9dfc615886';

// Check localStorage
console.log('\n--- localStorage ---');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}: ${value}`);
  
  if (value && value.includes(targetId)) {
    console.log(`🔴 FOUND HARDCODED ID IN localStorage[${key}]: ${value}`);
  }
}

// Check sessionStorage
console.log('\n--- sessionStorage ---');
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  const value = sessionStorage.getItem(key);
  console.log(`${key}: ${value}`);
  
  if (value && value.includes(targetId)) {
    console.log(`🔴 FOUND HARDCODED ID IN sessionStorage[${key}]: ${value}`);
  }
}

// Check current URL and params
console.log('\n--- URL INFO ---');
console.log('Current URL:', window.location.href);
console.log('Pathname:', window.location.pathname);
console.log('Search params:', window.location.search);

// Check if URL contains the hardcoded ID
if (window.location.href.includes(targetId)) {
  console.log(`🔴 FOUND HARDCODED ID IN URL: ${window.location.href}`);
}

// Check React Router params (if available)
if (window.React && window.React.version) {
  console.log('React version:', window.React.version);
}

console.log('\n=== END DEBUG ===');

// Instructions
console.log('\n📋 INSTRUCTIONS:');
console.log('1. Copy this script to browser console');
console.log('2. Navigate to any property page');
console.log('3. Run the script to check for hardcoded ID');
console.log('4. Check Network tab for actual API requests');
console.log('5. Look for requests to /api/proxy/admin/properties/' + targetId);