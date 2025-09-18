// API Configuration - Infrastructure Layer
export const apiConfig = {
    // Base URLs - Next.js proxy kullanıyoruz (CORS bypass için)
    baseURL: '/api/proxy',
    version: '', // API-99CLUB'da version yok

    // Timeout settings
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),

    // Retry settings
    maxRetries: parseInt(process.env.NEXT_PUBLIC_API_MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000'),

    // Authentication
    authTokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',

    // Cache settings
    defaultCacheTime: 5 * 60 * 1000, // 5 minutes

    // Headers
    defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },

    // Endpoints - API-99CLUB Compatible
    endpoints: {
        auth: {
            login: '/auth/login-v2',
            logout: '/auth/logout',
            refresh: '/auth/refresh-token',
            register: '/auth/register',
            me: '/auth/me-v2',
        },
        admin: {
            users: '/admin/users',
            adminStaff: '/admin/users/admin-staff',
            adminStaffCount: '/admin/users/admin-staff-count',
            goldResidentsCount: '/admin/users/gold-residents/count',
            activeResidentsCount: '/admin/users/active-residents/count',
            activeUsersCount: '/admin/users/active-users/count',
            tenantsCount: '/admin/users/tenants/count',
            ownersCount: '/admin/users/owners/count',
            activeApprovedResidents: '/admin/users/active-approved-residents',
            staff: (id: string) => `/admin/staff/${id}`,
            roles: '/admin/roles',
            permissions: '/admin/permissions',
            configs: '/admin/configs',
            auditLogs: '/admin/logging/audit-logs',
        },
        mobile: {
            users: '/mobile/users',
            profile: '/mobile/users/profile',
        },
        user: {
            // User Profile Management
            base: '/admin/users',
            profile: '/users/me',
            avatar: '/users/me/avatar',
            password: '/users/me/password',
            settings: '/users/me/settings',
        },
        i18n: {
            locales: '/admin/i18n/locales',
            translations: '/admin/i18n/translations',
        },
        residents: {
            // Admin Panel - Resident Management
            admin: {
                base: '/admin/users',
                pendingVerification: '/admin/users/pending-verification',
                approve: (id: string) => `/admin/users/${id}/approve`,
                bulkAction: '/admin/users/bulk-action',
                byId: (id: string) => `/admin/users/${id}`,
                stats: '/admin/users/stats',
                // Document endpoints
                nationalIdDocument: (id: string) => `/admin/users/${id}/documents/national_id`,
                ownershipDocument: (id: string) => `/admin/users/${id}/documents/ownership_document`,
                uploadNationalId: (id: string) => `/admin/users/${id}/documents/national_id/upload`,
                uploadOwnershipDocument: (id: string) => `/admin/users/${id}/documents/ownership_document/upload`,
                // Extended document endpoints
                purchaseContract: (id: string) => `/admin/users/${id}/documents/purchase_contract`,
                serviceContract: (id: string) => `/admin/users/${id}/documents/service_contract`,
                documentsIds: (id: string) => `/admin/users/${id}/documents/documents_ids`,
                handoverReport: (id: string) => `/admin/users/${id}/documents/handover_report`,
                securityForm: (id: string) => `/admin/users/${id}/documents/security_form`,
                vehicleSticker: (id: string) => `/admin/users/${id}/documents/vehicle_sticker`,
                otherDocument: (id: string) => `/admin/users/${id}/documents/other`,
                uploadPurchaseContract: (id: string) => `/admin/users/${id}/documents/purchase_contract/upload`,
                uploadServiceContract: (id: string) => `/admin/users/${id}/documents/service_contract/upload`,
                uploadDocumentsIds: (id: string) => `/admin/users/${id}/documents/documents_ids/upload`,
                uploadHandoverReport: (id: string) => `/admin/users/${id}/documents/handover_report/upload`,
                uploadSecurityForm: (id: string) => `/admin/users/${id}/documents/security_form/upload`,
                uploadVehicleSticker: (id: string) => `/admin/users/${id}/documents/vehicle_sticker/upload`,
                uploadOtherDocument: (id: string) => `/admin/users/${id}/documents/other/upload`,
            },
            // Mobile/Resident Panel - Resident Operations
            mobile: {
                base: '/users',
                me: '/users/me',
                uploadAvatar: (id: string) => `/users/${id}/upload-avatar`,
                deleteAvatar: (id: string) => `/users/${id}/avatar`,
                byId: (id: string) => `/users/${id}`,
                documents: (id: string) => `/users/${id}/documents`,
                uploadDocuments: (id: string) => `/users/${id}/upload-documents`,
                deleteDocument: (id: string, docId: string) => `/users/${id}/documents/${docId}`,
                properties: (id: string) => `/users/${id}/properties`,
                updateProperty: (id: string) => `/users/${id}/property`,
            },
        },
        properties: {
            // Admin Panel - Property Management (API-99CLUB Compatible)
            admin: {
                base: '/admin/properties',
                search: '/admin/properties/search',
                byStatus: '/admin/properties/by-status',
                byOwner: (ownerId: string) => `/admin/properties/owner/${ownerId}`,
                byTenant: '/admin/properties/by-tenant',
                byId: (id: string) => `/admin/properties/${id}`,
                removeOwner: '/admin/properties/remove-owner',

                // Future Endpoints (to be implemented)
                statistics: '/admin/properties/statistics',
                occupancyStats: '/admin/properties/occupancy-stats',
                quickStats: '/admin/properties/quick-stats',
                recentActivities: '/admin/properties/recent-activities',
                byBlock: (blockNumber: string) => `/admin/properties/by-block/${blockNumber}`,
                filterOptions: '/admin/properties/filter-options',
                bulkUpdate: '/admin/properties/bulk-update',
                bulkAssignTenants: '/admin/properties/bulk-assign-tenants',
                export: '/admin/properties/export',
                import: '/admin/properties/import',
                setMaintenance: (id: string) => `/admin/properties/${id}/maintenance`,
                completeMaintenance: (id: string) => `/admin/properties/${id}/maintenance`,
                // Added endpoints for counts
                residentCount: '/admin/properties/residence/count',
                villaCount: '/admin/properties/villa/count',
                availableCount: '/admin/properties/available/count',
                totalCount: '/admin/properties/count',
                assignedCount: '/admin/properties/assigned/count',
            },
        },
        billing: {
            // Admin Panel - Billing Management (API-99CLUB Compatible)
            admin: {
                base: '/admin/billing',
                pending: '/admin/billing/pending',
                overdue: '/admin/billing/overdue',
                debtSummary: '/admin/billing/debt-summary',
                byProperty: (propertyId: string) => `/admin/billing/property/${propertyId}`,
            },
            payments: {
                base: '/admin/payments',
                pending: '/admin/payments/pending',
            },
        },
        files: {
            upload: '/admin/files/upload',
        },
        unitPrices: {
            base: '/unit-prices',
            admin: '/admin/unit-prices',
        },
        tickets: {
            base: '/admin/tickets',
            summary: '/admin/tickets/summary',
            monthlyStats: '/admin/tickets/monthly-stats',
            attachments: (ticketId: string) => `/admin/tickets/${ticketId}/attachments`,
            comments: (ticketId: string) => `/admin/tickets/${ticketId}/comments`,
            // Ticket status actions
            resolve: (ticketId: string) => `/admin/tickets/${ticketId}/resolve`,
            close: (ticketId: string) => `/admin/tickets/${ticketId}/close`,
            cancel: (ticketId: string) => `/admin/tickets/${ticketId}/cancel`,
            startProgress: (ticketId: string) => `/admin/tickets/${ticketId}/start-progress`,
            markWaiting: (ticketId: string) => `/admin/tickets/${ticketId}/mark-waiting`,
            reopen: (ticketId: string) => `/admin/tickets/${ticketId}/reopen`,
        },
        announcements: {
            // Admin Panel - Announcement Management (API-99CLUB Compatible)
            admin: {
                base: '/admin/announcements',
                active: '/admin/announcements/active',
                expired: '/admin/announcements/expired',
                emergency: '/admin/announcements/emergency',
                byStatus: (status: string) => `/admin/announcements/status/${status}`,
                byProperty: (propertyId: string) => `/admin/announcements/property/${propertyId}`,
                byUser: (userId: string) => `/admin/announcements/user/${userId}`,
                byId: (id: string) => `/admin/announcements/${id}`,
                publish: (id: string) => `/admin/announcements/${id}/publish`,
                archive: (id: string) => `/admin/announcements/${id}/archive`,
                bulkAction: '/admin/announcements/bulk-action',
                uploadImage: (id: string) => `/admin/announcements/${id}/upload-image`,
                stats: '/admin/announcements/stats',
                search: '/admin/announcements/search',
            },
            // Mobile/Tenant Panel - Announcement Reading (Future Implementation)
            mobile: {
                base: '/mobile/announcements',
                active: '/mobile/announcements/active',
                emergency: '/mobile/announcements/emergency',
                byProperty: (propertyId: string) => `/mobile/announcements/property/${propertyId}`,
                byId: (id: string) => `/mobile/announcements/${id}`,
            },
        },
    },
} as const;

export type ApiEndpoints = typeof apiConfig.endpoints;

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Feature flags
export const features = {
    enableCache: process.env.NEXT_PUBLIC_ENABLE_CACHE === 'true',
    enableMocking: process.env.NEXT_PUBLIC_ENABLE_MOCKING === 'true',
    enableDebugLogs: isDevelopment,
} as const;