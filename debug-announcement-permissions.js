// Debug script for announcement permissions
console.log('=== ANNOUNCEMENT PERMISSIONS DEBUG ===');

// Get user permissions from localStorage
const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
console.log('All user permissions:', userPermissions);

// Check for UPDATE_ANNOUNCEMENT permission
const updateAnnouncementById = userPermissions.find(p => p.id === 'UPDATE_ANNOUNCEMENT');
const updateAnnouncementByName = userPermissions.find(p => p.name === 'UPDATE_ANNOUNCEMENT');

console.log('UPDATE_ANNOUNCEMENT by ID:', updateAnnouncementById);
console.log('UPDATE_ANNOUNCEMENT by name:', updateAnnouncementByName);

// Check for DELETE_ANNOUNCEMENT permission
const deleteAnnouncementById = userPermissions.find(p => p.id === 'DELETE_ANNOUNCEMENT');
const deleteAnnouncementByName = userPermissions.find(p => p.name === 'DELETE_ANNOUNCEMENT');

console.log('DELETE_ANNOUNCEMENT by ID:', deleteAnnouncementById);
console.log('DELETE_ANNOUNCEMENT by name:', deleteAnnouncementByName);

// Check permission constants from Sidebar
const UPDATE_ANNOUNCEMENT_PERMISSION_ID = 'UPDATE_ANNOUNCEMENT';
const UPDATE_ANNOUNCEMENT_PERMISSION_NAME = 'UPDATE_ANNOUNCEMENT';
const DELETE_ANNOUNCEMENT_PERMISSION_ID = 'DELETE_ANNOUNCEMENT';
const DELETE_ANNOUNCEMENT_PERMISSION_NAME = 'DELETE_ANNOUNCEMENT';

console.log('Permission constants:');
console.log('UPDATE_ANNOUNCEMENT_PERMISSION_ID:', UPDATE_ANNOUNCEMENT_PERMISSION_ID);
console.log('UPDATE_ANNOUNCEMENT_PERMISSION_NAME:', UPDATE_ANNOUNCEMENT_PERMISSION_NAME);
console.log('DELETE_ANNOUNCEMENT_PERMISSION_ID:', DELETE_ANNOUNCEMENT_PERMISSION_ID);
console.log('DELETE_ANNOUNCEMENT_PERMISSION_NAME:', DELETE_ANNOUNCEMENT_PERMISSION_NAME);

// Simulate permission check logic
function hasPermission(permissionId, permissionName) {
    return userPermissions.some(permission => 
        permission.id === permissionId || permission.name === permissionName
    );
}

const hasUpdatePermission = hasPermission(UPDATE_ANNOUNCEMENT_PERMISSION_ID, UPDATE_ANNOUNCEMENT_PERMISSION_NAME);
const hasDeletePermission = hasPermission(DELETE_ANNOUNCEMENT_PERMISSION_ID, DELETE_ANNOUNCEMENT_PERMISSION_NAME);

console.log('\n=== PERMISSION CHECK RESULTS ===');
console.log('Has UPDATE_ANNOUNCEMENT permission:', hasUpdatePermission);
console.log('Has DELETE_ANNOUNCEMENT permission:', hasDeletePermission);

// Check if buttons should be visible
console.log('\n=== BUTTON VISIBILITY ===');
console.log('Edit button should be visible:', hasUpdatePermission);
console.log('Delete button should be visible:', hasDeletePermission);

// List all announcement-related permissions
const announcementPermissions = userPermissions.filter(p => 
    p.id?.includes('ANNOUNCEMENT') || p.name?.includes('ANNOUNCEMENT')
);
console.log('\n=== ALL ANNOUNCEMENT PERMISSIONS ===');
console.log('Announcement-related permissions:', announcementPermissions);