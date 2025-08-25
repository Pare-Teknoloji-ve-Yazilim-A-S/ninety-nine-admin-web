// Enhanced debugging script for announcement permissions
console.log('=== ANNOUNCEMENT PERMISSIONS DEBUG ===');

// 1. Check localStorage user data
const userDataStr = localStorage.getItem('userData');
console.log('1. Raw userData from localStorage:', userDataStr);

if (!userDataStr) {
    console.error('❌ No userData found in localStorage');
} else {
    try {
        const userData = JSON.parse(userDataStr);
        console.log('2. Parsed userData:', userData);
        
        // Check permissions array
        const permissions = userData.permissions || [];
        console.log('3. User permissions array:', permissions);
        console.log('4. Total permissions count:', permissions.length);
        
        // List all permission IDs and names
        console.log('5. All permission IDs:', permissions.map(p => p.id));
        console.log('6. All permission names:', permissions.map(p => p.name));
        
        // Check for UPDATE_ANNOUNCEMENT permission with exact constants
        const UPDATE_ANNOUNCEMENT_PERMISSION_ID = 'UPDATE_ANNOUNCEMENT';
        const UPDATE_ANNOUNCEMENT_PERMISSION_NAME = 'UPDATE_ANNOUNCEMENT';
        const DELETE_ANNOUNCEMENT_PERMISSION_ID = 'DELETE_ANNOUNCEMENT';
        const DELETE_ANNOUNCEMENT_PERMISSION_NAME = 'DELETE_ANNOUNCEMENT';
        
        const updatePermissionById = permissions.find(p => p.id === UPDATE_ANNOUNCEMENT_PERMISSION_ID);
        const updatePermissionByName = permissions.find(p => p.name === UPDATE_ANNOUNCEMENT_PERMISSION_NAME);
        console.log('7. UPDATE_ANNOUNCEMENT permission by ID:', updatePermissionById);
        console.log('8. UPDATE_ANNOUNCEMENT permission by name:', updatePermissionByName);
        
        // Check for DELETE_ANNOUNCEMENT permission
        const deletePermissionById = permissions.find(p => p.id === DELETE_ANNOUNCEMENT_PERMISSION_ID);
        const deletePermissionByName = permissions.find(p => p.name === DELETE_ANNOUNCEMENT_PERMISSION_NAME);
        console.log('9. DELETE_ANNOUNCEMENT permission by ID:', deletePermissionById);
        console.log('10. DELETE_ANNOUNCEMENT permission by name:', deletePermissionByName);
        
        // Simulate exact permission check logic from usePermissionCheck
        const hasUpdatePermission = !!(updatePermissionById || updatePermissionByName);
        const hasDeletePermission = !!(deletePermissionById || deletePermissionByName);
        
        console.log('11. Simulated hasUpdateAnnouncementPermission:', hasUpdatePermission);
        console.log('12. Simulated hasDeleteAnnouncementPermission:', hasDeletePermission);
        
        // Check all announcement-related permissions
        const announcementPermissions = permissions.filter(p => 
            (p.id && p.id.includes('ANNOUNCEMENT')) || (p.name && p.name.includes('ANNOUNCEMENT'))
        );
        console.log('13. All announcement-related permissions:', announcementPermissions);
        
        // Check for CREATE_ANNOUNCEMENT permission for comparison
        const createPermissionById = permissions.find(p => p.id === 'CREATE_ANNOUNCEMENT');
        const createPermissionByName = permissions.find(p => p.name === 'CREATE_ANNOUNCEMENT');
        console.log('14. CREATE_ANNOUNCEMENT permission by ID:', createPermissionById);
        console.log('15. CREATE_ANNOUNCEMENT permission by name:', createPermissionByName);
        const hasCreatePermission = !!(createPermissionById || createPermissionByName);
        console.log('16. Simulated hasCreateAnnouncementPermission:', hasCreatePermission);
        
    } catch (error) {
        console.error('❌ Error parsing userData:', error);
    }
}

// Get user permissions from localStorage (legacy check)
const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
console.log('\n17. Legacy userPermissions count:', userPermissions.length);
console.log('Legacy permissions:', userPermissions);

// Check for UPDATE_ANNOUNCEMENT permission
const updateAnnouncementById = userPermissions.find(p => p.id === 'UPDATE_ANNOUNCEMENT');
const updateAnnouncementByName = userPermissions.find(p => p.name === 'UPDATE_ANNOUNCEMENT');

console.log('\n2. UPDATE_ANNOUNCEMENT checks:');
console.log('- By ID:', updateAnnouncementById ? 'FOUND' : 'NOT FOUND');
console.log('- By name:', updateAnnouncementByName ? 'FOUND' : 'NOT FOUND');
if (updateAnnouncementById) console.log('- Permission object:', updateAnnouncementById);
if (updateAnnouncementByName) console.log('- Permission object:', updateAnnouncementByName);

// Check for DELETE_ANNOUNCEMENT permission
const deleteAnnouncementById = userPermissions.find(p => p.id === 'DELETE_ANNOUNCEMENT');
const deleteAnnouncementByName = userPermissions.find(p => p.name === 'DELETE_ANNOUNCEMENT');

console.log('\n3. DELETE_ANNOUNCEMENT checks:');
console.log('- By ID:', deleteAnnouncementById ? 'FOUND' : 'NOT FOUND');
console.log('- By name:', deleteAnnouncementByName ? 'FOUND' : 'NOT FOUND');
if (deleteAnnouncementById) console.log('- Permission object:', deleteAnnouncementById);
if (deleteAnnouncementByName) console.log('- Permission object:', deleteAnnouncementByName);

// Simulate permission check logic
function hasPermission(permissionId, permissionName) {
    return userPermissions.some(permission => 
        permission.id === permissionId || permission.name === permissionName
    );
}

const hasUpdatePermission = hasPermission('UPDATE_ANNOUNCEMENT', 'UPDATE_ANNOUNCEMENT');
const hasDeletePermission = hasPermission('DELETE_ANNOUNCEMENT', 'DELETE_ANNOUNCEMENT');

console.log('\n4. PERMISSION CHECK RESULTS:');
console.log('- Has UPDATE_ANNOUNCEMENT permission:', hasUpdatePermission);
console.log('- Has DELETE_ANNOUNCEMENT permission:', hasDeletePermission);

// Check if buttons should be visible
console.log('\n5. BUTTON VISIBILITY:');
console.log('- Edit button should be visible:', hasUpdatePermission);
console.log('- Delete button should be visible:', hasDeletePermission);

// List all announcement-related permissions
const announcementPermissions = userPermissions.filter(p => 
    (p.id && p.id.includes('ANNOUNCEMENT')) || (p.name && p.name.includes('ANNOUNCEMENT'))
);
console.log('\n6. ALL ANNOUNCEMENT PERMISSIONS:');
console.log('- Count:', announcementPermissions.length);
console.log('- Permissions:', announcementPermissions);

// Check current page URL
console.log('\n7. CURRENT PAGE INFO:');
console.log('- URL:', window.location.href);
console.log('- Pathname:', window.location.pathname);

// Check if we're on the right page
const isAnnouncementDetailPage = window.location.pathname.includes('/announcements/') && !window.location.pathname.includes('/edit');
console.log('- Is announcement detail page:', isAnnouncementDetailPage);

// Try to find the buttons on the page
const editButton = document.querySelector('button:contains("Düzenle")');
const deleteButton = document.querySelector('button:contains("Kaldır")');
console.log('\n8. BUTTON ELEMENTS ON PAGE:');
console.log('- Edit button found:', !!editButton);
console.log('- Delete button found:', !!deleteButton);

// Alternative button search
const allButtons = document.querySelectorAll('button');
const buttonTexts = Array.from(allButtons).map(btn => btn.textContent?.trim());
console.log('- All button texts:', buttonTexts);

console.log('\n=== DEBUG COMPLETE ===');
console.log('If buttons are still visible despite no permissions, there might be an issue with the permission check implementation.');