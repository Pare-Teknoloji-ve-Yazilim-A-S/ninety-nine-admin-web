'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/components/auth/AuthProvider';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import {
    BarChart3,
    Users,
    Home,
    DollarSign,
    Megaphone,
    Wrench,
    TrendingUp,
    Settings,
    ChevronDown,
    ChevronRight,
    User,
    UserPlus,
    UserCheck,
    Building,
    MapPin,
    RotateCcw,
    CreditCard,
    History,
    FileText,
    Receipt,
    Bell,
    Plus,
    Archive,
    AlertCircle,
    Clock,
    CheckCircle,
    FileBarChart,
    PieChart,
    Activity,
    Info,
    Shield,
    Cog,
    LogOut,
    MoreVertical,
    Briefcase,
    Users2
} from 'lucide-react';

interface MenuItemProps {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    children?: SubMenuItemProps[];
    isOpen?: boolean;
    onToggle?: () => void;
}

interface SubMenuItemProps {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
}

// Dil çevirileri
const translations = {
    tr: {
        dashboard: 'Dashboard',
        unitManagement: 'Konut Yönetimi',
        residentManagement: 'Sakin Yönetimi',
        serviceRequestManagement: 'Hizmet/Talep Yönetimi',
        financialOperations: 'Finansal İşlemler',
        staffManagement: 'Personel Yönetimi',
        announcements: 'Duyurular',
        settings: 'Ayarlar',
        profile: 'Profil',
        logout: 'Çıkış',
        adminUser: 'Admin Kullanıcısı',
        manager: 'Yönetici'
    },
    en: {
        dashboard: 'Dashboard',
        unitManagement: 'Unit Management',
        residentManagement: 'Resident Management',
        serviceRequestManagement: 'Service/Request Management',
        financialOperations: 'Financial Operations',
        staffManagement: 'Staff Management',
        announcements: 'Announcements',
        settings: 'Settings',
        profile: 'Profile',
        logout: 'Logout',
        adminUser: 'Admin User',
        manager: 'Manager'
    },
    ar: {
        dashboard: 'لوحة التحكم',
        unitManagement: 'إدارة الوحدات',
        residentManagement: 'إدارة السكان',
        serviceRequestManagement: 'إدارة الخدمات/الطلبات',
        financialOperations: 'العمليات المالية',
        staffManagement: 'إدارة الموظفين',
        announcements: 'الإعلانات',
        settings: 'الإعدادات',
        profile: 'الملف الشخصي',
        logout: 'تسجيل الخروج',
        adminUser: 'مستخدم الإدارة',
        manager: 'مدير'
    }
};

// Permission constants
const READ_PROPERTY_PERMISSION_ID = '0996201f-5a5c-43df-917e-fbd75778b018'; // UUID for Read Property permission

const CREATE_UNIT_PERMISSION_ID = 'b3da94e4-f732-473b-b6ea-0b7ae56e179d'; // UUID for Create Unit permission

const READ_UNIT_DETAIL_PERMISSION_ID = '48403acc-7b9a-445d-b014-5677143bdc9f'; // UUID for Read Unit Detail permission

const UPDATE_UNIT_PERMISSION_ID = '48403acc-7b9a-445d-b014-5677143bdc9f'; // UUID for Update Unit permission

const VIEW_USER_PERMISSION_ID = '43d16f31-d6d8-4635-a068-8be1b4501fc3'; // UUID for View User permission

const READ_TICKET_PERMISSION_ID = 'e7a003db-3312-4549-97e3-1947a2af92a9'; // UUID for Read Ticket permission

const READ_BILLING_PERMISSION_ID = 'e71a2cd0-bf8f-4457-a61a-fd4d50492f49'; // UUID for Read Billing permission
const READ_BILLING_PERMISSION_NAME = 'Read Billing'; // Name for backward compatibility

const READ_STAFF_PERMISSION_ID = 'be598b8a-4d77-4373-993e-62907b5f59e7'; // UUID for Read Staff permission
const READ_STAFF_PERMISSION_NAME = 'Read Staff'; // Name for backward compatibility

const CREATE_STAFF_PERMISSION_ID = 'e811976e-8594-4d8a-b6c4-7636dd404959'; // UUID for Create Staff permission
const CREATE_STAFF_PERMISSION_NAME = 'Create Staff'; // Name for backward compatibility

const UPDATE_STAFF_PERMISSION_ID = '4b5b6ea7-2ce4-414d-ad0a-272eae1d9e93'; // UUID for Update Staff permission
const UPDATE_STAFF_PERMISSION_NAME = 'Update Staff'; // Name for backward compatibility

const DELETE_STAFF_PERMISSION_ID = '525d1a57-b786-4c38-a6c1-768f45b6196e'; // UUID for Delete Staff permission
const DELETE_STAFF_PERMISSION_NAME = 'Delete Staff'; // Name for backward compatibility

const READ_ANNOUNCEMENT_PERMISSION_ID = '9e6974bd-55e8-439e-a295-97486ffffdf9'; // UUID for Read Announcement permission
const READ_ANNOUNCEMENT_PERMISSION_NAME = 'Read Announcement'; // Name for backward compatibility

const CREATE_ANNOUNCEMENT_PERMISSION_ID = 'ae1ed96c-230e-41f6-bc16-c1db0ff9e71a'; // UUID for Create Announcement permission
const CREATE_ANNOUNCEMENT_PERMISSION_NAME = 'Create Announcement'; // Name for backward compatibility

const UPDATE_ANNOUNCEMENT_PERMISSION_ID = '6ec1de38-b579-4445-802a-11efc5a2dc0c'; // UUID for Update Announcement permission
const UPDATE_ANNOUNCEMENT_PERMISSION_NAME = 'Update Announcement'; // Name for backward compatibility

const DELETE_ANNOUNCEMENT_PERMISSION_ID = '832841a0-5891-4e93-b164-cb94355e2fce'; // UUID for Delete Announcement permission
const DELETE_ANNOUNCEMENT_PERMISSION_NAME = 'Delete Announcement'; // Name for backward compatibility

const READ_ROLE_PERMISSION_ID = '816d6f35-3089-4c36-955c-3a195ae7bb63'; // UUID for Read Role permission
const READ_ROLE_PERMISSION_NAME = 'Read Role'; // Name for backward compatibility

const CREATE_TICKET_PERMISSION_ID = 'h7i8j9k0-1l2m-3n4o-5p6q-7r8s9t0u1v2w'; // UUID for Create Ticket permission
const CREATE_TICKET_PERMISSION_NAME = 'Create Ticket'; // Name for backward compatibility

const UPDATE_TICKET_PERMISSION_ID = 'i8j9k0l1-2m3n-4o5p-6q7r-8s9t0u1v2w3x'; // UUID for Update Ticket permission
const UPDATE_TICKET_PERMISSION_NAME = 'Update Ticket'; // Name for backward compatibility

const CREATE_BILLING_PERMISSION_ID = '59d68129-66f3-4608-8568-552eed089b43'; // UUID for Manage Billing permission
const CREATE_BILLING_PERMISSION_NAME = 'Manage Billing'; // Name for backward compatibility

const UPDATE_BILLING_PERMISSION_ID = 'm2n3o4p5-6q7r-8s9t-0u1v-2w3x4y5z6a7b'; // UUID for Update Billing permission
const UPDATE_BILLING_PERMISSION_NAME = 'Update Billing'; // Name for backward compatibility

const CREATE_PAYMENT_PERMISSION_ID = '47c85bcb-188f-4f02-bfc0-1364c52fc883'; // UUID for Manage Payment permission
const CREATE_PAYMENT_PERMISSION_NAME = 'Manage Payment'; // Name for backward compatibility

const READ_PAYMENT_PERMISSION_ID = 'o4p5q6r7-8s9t-0u1v-2w3x-4y5z6a7b8c9d'; // UUID for Read Payment permission
const READ_PAYMENT_PERMISSION_NAME = 'Read Payment'; // Name for backward compatibility

const UPDATE_PAYMENT_PERMISSION_ID = 'p5q6r7s8-9t0u-1v2w-3x4y-5z6a7b8c9d0e'; // UUID for Update Payment permission
const UPDATE_PAYMENT_PERMISSION_NAME = 'Update Payment'; // Name for backward compatibility

const DELETE_PAYMENT_PERMISSION_ID = 'q6r7s8t9-0u1v-2w3x-4y5z-6a7b8c9d0e1f'; // UUID for Delete Payment permission
const DELETE_PAYMENT_PERMISSION_NAME = 'Delete Payment'; // Name for backward compatibility

const getMenuItems = (currentLanguage: string, hasReadPropertyPermission: boolean, hasViewUserPermission: boolean, hasReadTicketPermission: boolean, hasReadBillingPermission: boolean, hasReadStaffPermission: boolean, hasReadAnnouncementPermission: boolean, hasReadRolePermission: boolean): MenuItemProps[] => {
    const t = translations[currentLanguage as keyof typeof translations];
    
    const allMenuItems = [
        {
            title: t.dashboard,
            icon: BarChart3,
            href: '/dashboard'
        },
        {
            title: t.unitManagement,
            icon: Building,
            href: '/dashboard/units'
        },
        {
            title: t.residentManagement,
            icon: User,
            href: '/dashboard/residents'
        },
        {
            title: t.serviceRequestManagement,
            icon: Wrench,
            href: '/dashboard/requests'
        },
        {
            title: t.financialOperations,
            icon: DollarSign,
            href: '/dashboard/financial'
        },
        {
            title: t.staffManagement,
            icon: UserCheck,
            href: '/dashboard/staff'
        },
        {
            title: t.announcements,
            icon: Megaphone,
            href: '/dashboard/announcements'
        },
        {
            title: t.settings,
            icon: Settings,
            href: '/dashboard/settings'
        }
    ];

    // Filter out menu items based on permissions
    return allMenuItems.filter(item => {
        if (item.href === '/dashboard/units') {
            console.log('Sidebar - Checking Read Property permission for Unit Management');
            console.log('Sidebar - hasReadPropertyPermission:', hasReadPropertyPermission);
            return hasReadPropertyPermission;
        }
        if (item.href === '/dashboard/residents') {
            console.log('Sidebar - Checking View User permission for Resident Management');
            console.log('Sidebar - hasViewUserPermission:', hasViewUserPermission);
            return hasViewUserPermission;
        }
        if (item.href === '/dashboard/requests') {
            console.log('Sidebar - Checking Read Ticket permission for Service Request Management');
            console.log('Sidebar - hasReadTicketPermission:', hasReadTicketPermission);
            return hasReadTicketPermission;
        }
        if (item.href === '/dashboard/financial') {
            console.log('Sidebar - Checking Read Billing permission for Financial Operations');
            console.log('Sidebar - hasReadBillingPermission:', hasReadBillingPermission);
            return hasReadBillingPermission;
        }
        if (item.href === '/dashboard/staff') {
            console.log('Sidebar - Checking Read Staff permission for Staff Management');
            console.log('Sidebar - hasReadStaffPermission:', hasReadStaffPermission);
            return hasReadStaffPermission;
        }
        if (item.href === '/dashboard/announcements') {
            console.log('Sidebar - Checking Read Announcement permission for Announcements');
            console.log('Sidebar - hasReadAnnouncementPermission:', hasReadAnnouncementPermission);
            return hasReadAnnouncementPermission;
        }
        if (item.href === '/dashboard/settings') {
            console.log('Sidebar - Checking Read Role permission for Settings');
            console.log('Sidebar - hasReadRolePermission:', hasReadRolePermission);
            return hasReadRolePermission;
        }
        return true;
    });
};

function MenuItem({ title, icon: Icon, href, children, isOpen, onToggle }: MenuItemProps) {
    const pathname = usePathname();
    const isActive = href ? pathname === href : children?.some(child => pathname === child.href);
    const hasChildren = children && children.length > 0;

    if (!hasChildren && href) {
        return (
            <Link
                href={href}
                onClick={(e) => {
                    // If we are on staff page, force hard navigation to bypass any stuck client state
                    if (pathname?.startsWith('/dashboard/staff')) {
                        e.preventDefault();
                        try { document.body.style.overflow = 'unset'; } catch {}
                        window.location.assign(href);
                    }
                }}
                className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                    'hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg',
                    isActive
                        ? 'bg-primary-gold/10 dark:bg-primary-gold/20 text-primary-gold border-r-2 border-primary-gold'
                        : 'text-text-light-secondary dark:text-text-secondary hover:text-primary-gold'
                )}
            >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{title}</span>
            </Link>
        );
    }

    return (
        <div className="space-y-1">
            <button
                onClick={onToggle}
                className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                    'hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg',
                    isActive
                        ? 'bg-primary-gold/10 dark:bg-primary-gold/20 text-primary-gold'
                        : 'text-text-light-secondary dark:text-text-secondary hover:text-primary-gold'
                )}
            >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-left">{title}</span>
                {hasChildren && (
                    isOpen ? (
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    ) : (
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )
                )}
            </button>

            {/* Sub Menu */}
            {hasChildren && isOpen && (
                <div className="ml-4 space-y-1 transition-all duration-200 ease-in-out">
                    {children?.map((subItem) => (
                        <SubMenuItem key={subItem.href} {...subItem} />
                    ))}
                </div>
            )}
        </div>
    );
}

function SubMenuItem({ title, icon: Icon, href }: SubMenuItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            onClick={(e) => {
                if (pathname?.startsWith('/dashboard/staff')) {
                    e.preventDefault();
                    try { document.body.style.overflow = 'unset'; } catch {}
                    window.location.assign(href);
                }
            }}
            className={cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200',
                'hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg',
                isActive
                    ? 'bg-primary-gold/15 dark:bg-primary-gold/25 text-primary-gold font-medium'
                    : 'text-text-light-muted dark:text-text-muted hover:text-text-light-secondary dark:hover:text-text-secondary'
            )}
        >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span>{title}</span>
        </Link>
    );
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [openMenus, setOpenMenus] = useState<Set<string>>(new Set(['Dashboard']));
    const { user, logout } = useAuth();
    const [currentLanguage, setCurrentLanguage] = useState('tr');

    // Permission kontrolü için usePermissionCheck hook'unu kullan
    const permissionCheck = usePermissionCheck()
    
    // Read Property izni kontrolü - sadece ID ile kontrol et
    const hasReadPropertyPermission = permissionCheck.hasPermission(READ_PROPERTY_PERMISSION_ID)
    
    // View User izni kontrolü - sadece ID ile kontrol et
    const hasViewUserPermission = permissionCheck.hasPermission(VIEW_USER_PERMISSION_ID)
    
    // Read Ticket izni kontrolü - sadece ID ile kontrol et
    const hasReadTicketPermission = permissionCheck.hasPermission(READ_TICKET_PERMISSION_ID)
    
    // Read Billing izni kontrolü - sadece ID ile kontrol et
    const hasReadBillingPermission = permissionCheck.hasPermission(READ_BILLING_PERMISSION_ID)
    
    // Read Staff izni kontrolü - hem ID hem de name ile kontrol et
    const hasReadStaffPermission = permissionCheck.hasPermission(READ_STAFF_PERMISSION_ID) || permissionCheck.hasPermission(READ_STAFF_PERMISSION_NAME)
    
    // Read Announcement izni kontrolü - hem ID hem de name ile kontrol et
    const hasReadAnnouncementPermission = permissionCheck.hasPermission(READ_ANNOUNCEMENT_PERMISSION_ID) || permissionCheck.hasPermission(READ_ANNOUNCEMENT_PERMISSION_NAME)
    
    // Read Role izni kontrolü - hem ID hem de name ile kontrol et
    const hasReadRolePermission = permissionCheck.hasPermission(READ_ROLE_PERMISSION_ID) || permissionCheck.hasPermission(READ_ROLE_PERMISSION_NAME)
    
    console.log('Sidebar - READ_PROPERTY_PERMISSION_ID:', READ_PROPERTY_PERMISSION_ID)
    console.log('Sidebar - hasReadPropertyPermission:', hasReadPropertyPermission)
    console.log('Sidebar - VIEW_USER_PERMISSION_ID:', VIEW_USER_PERMISSION_ID)
    console.log('Sidebar - hasViewUserPermission:', hasViewUserPermission)
    console.log('Sidebar - READ_TICKET_PERMISSION_ID:', READ_TICKET_PERMISSION_ID)
    console.log('Sidebar - hasReadTicketPermission:', hasReadTicketPermission)
    console.log('Sidebar - READ_BILLING_PERMISSION_ID:', READ_BILLING_PERMISSION_ID)
    console.log('Sidebar - hasReadBillingPermission:', hasReadBillingPermission)
    console.log('Sidebar - READ_STAFF_PERMISSION_ID:', READ_STAFF_PERMISSION_ID)
    console.log('Sidebar - READ_STAFF_PERMISSION_NAME:', READ_STAFF_PERMISSION_NAME)
    console.log('Sidebar - hasReadStaffPermission:', hasReadStaffPermission)
    console.log('Sidebar - READ_ANNOUNCEMENT_PERMISSION_ID:', READ_ANNOUNCEMENT_PERMISSION_ID)
    console.log('Sidebar - READ_ANNOUNCEMENT_PERMISSION_NAME:', READ_ANNOUNCEMENT_PERMISSION_NAME)
    console.log('Sidebar - hasReadAnnouncementPermission:', hasReadAnnouncementPermission)
    console.log('Sidebar - READ_ROLE_PERMISSION_ID:', READ_ROLE_PERMISSION_ID)
    console.log('Sidebar - READ_ROLE_PERMISSION_NAME:', READ_ROLE_PERMISSION_NAME)
    console.log('Sidebar - hasReadRolePermission:', hasReadRolePermission)
    console.log('Sidebar - permissionCheck loading:', permissionCheck.loading)

    // Dil tercihini localStorage'dan al
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Menü öğelerini dil ve izin bazlı al
    const menuItems = getMenuItems(currentLanguage, hasReadPropertyPermission, hasViewUserPermission, hasReadTicketPermission, hasReadBillingPermission, hasReadStaffPermission, hasReadAnnouncementPermission, hasReadRolePermission);
    const t = translations[currentLanguage as keyof typeof translations];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Çıkış yapma hatası:', error);
        }
    };

    const toggleMenu = (menuTitle: string) => {
        setOpenMenus(prev => {
            const newSet = new Set(prev);
            if (newSet.has(menuTitle)) {
                newSet.delete(menuTitle);
            } else {
                newSet.add(menuTitle);
            }
            return newSet;
        });
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1500] lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 h-screen w-72 bg-background-light-card dark:bg-background-card',
                    'border-r border-border-light dark:border-border-dark',
                    'shadow-xl backdrop-blur-xl bg-background-light-card/95 dark:bg-background-card/95',
                    'transform transition-transform duration-300 ease-in-out z-[2000] pointer-events-auto',
                    // Keep Sidebar above any page overlays on large screens as well
                    'lg:translate-x-0 lg:z-[2000] flex flex-col',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo Area */}
                <div className="h-24 flex items-center px-6 border-b border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/NinetyNine Logo.png"
                            alt="NinetyNine Logo"
                            className="h-12 w-auto"
                        />
                        <div>
                            <h1 className="text-lg font-bold gradient-gold-start text-primary-gold">
                                NinetyNine
                            </h1>
                            <p className="text-xs text-text-light-muted dark:text-text-muted">
                                Admin Panel
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.title}
                            {...item}
                            isOpen={openMenus.has(item.title)}
                            onToggle={() => toggleMenu(item.title)}
                        />
                    ))}
                </nav>

                {/* Bottom Section - Profile */}
                <div className="p-4 border-t border-border-light dark:border-border-dark">
                    <div className="bg-background-light-soft dark:bg-background-soft rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-primary-gold rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.firstName?.[0] || 'A'}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-on-light dark:text-text-on-dark truncate">
                                    {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || t.adminUser}
                                </p>
                                <p className="text-xs text-text-light-muted dark:text-text-muted truncate">
                                    {user?.role?.name || t.manager}
                                </p>
                            </div>

                            {/* Profile Menu */}
                            <div className="relative">
                                <button className="p-1 rounded-lg hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg transition-colors">
                                    <MoreVertical className="h-4 w-4 text-text-light-secondary dark:text-text-secondary" />
                                </button>
                            </div>
                        </div>

                        {/* Profile Actions */}
                        <div className="flex gap-2">
                            <Link
                                href="/dashboard/profile"
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-primary-gold/10 dark:bg-primary-gold/20 text-primary-gold hover:bg-primary-gold/20 dark:hover:bg-primary-gold/30 transition-colors"
                            >
                                <User className="h-3 w-3" />
                                {t.profile}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-text-light-secondary dark:text-text-secondary hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg hover:text-primary-red transition-colors"
                            >
                                <LogOut className="h-3 w-3" />
                                {t.logout}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

// Export permission constants for use in other components
export {
    READ_PROPERTY_PERMISSION_ID,
    CREATE_UNIT_PERMISSION_ID,
    READ_UNIT_DETAIL_PERMISSION_ID,
    UPDATE_UNIT_PERMISSION_ID,
    VIEW_USER_PERMISSION_ID,
    READ_TICKET_PERMISSION_ID,
    CREATE_TICKET_PERMISSION_ID,
    CREATE_TICKET_PERMISSION_NAME,
    UPDATE_TICKET_PERMISSION_ID,
    UPDATE_TICKET_PERMISSION_NAME,
    CREATE_BILLING_PERMISSION_ID,
    CREATE_BILLING_PERMISSION_NAME,
    UPDATE_BILLING_PERMISSION_ID,
    UPDATE_BILLING_PERMISSION_NAME,
    READ_BILLING_PERMISSION_ID,
    READ_BILLING_PERMISSION_NAME,
    CREATE_PAYMENT_PERMISSION_ID,
    CREATE_PAYMENT_PERMISSION_NAME,
    READ_PAYMENT_PERMISSION_ID,
    READ_PAYMENT_PERMISSION_NAME,
    UPDATE_PAYMENT_PERMISSION_ID,
    UPDATE_PAYMENT_PERMISSION_NAME,
    DELETE_PAYMENT_PERMISSION_ID,
    DELETE_PAYMENT_PERMISSION_NAME,
    CREATE_ANNOUNCEMENT_PERMISSION_ID,
    CREATE_ANNOUNCEMENT_PERMISSION_NAME,
    UPDATE_ANNOUNCEMENT_PERMISSION_ID,
    UPDATE_ANNOUNCEMENT_PERMISSION_NAME,
    DELETE_ANNOUNCEMENT_PERMISSION_ID,
    DELETE_ANNOUNCEMENT_PERMISSION_NAME,
    READ_ANNOUNCEMENT_PERMISSION_ID,
    READ_ANNOUNCEMENT_PERMISSION_NAME,
    CREATE_STAFF_PERMISSION_ID,
    CREATE_STAFF_PERMISSION_NAME,
    UPDATE_STAFF_PERMISSION_ID,
    UPDATE_STAFF_PERMISSION_NAME,
    DELETE_STAFF_PERMISSION_ID,
    DELETE_STAFF_PERMISSION_NAME,
    READ_STAFF_PERMISSION_ID,
    READ_STAFF_PERMISSION_NAME,
    READ_ROLE_PERMISSION_ID,
    READ_ROLE_PERMISSION_NAME
};

// Delete Ticket permission constants
export const DELETE_TICKET_PERMISSION_ID = 'j9k0l1m2-3n4o-5p6q-7r8s-9t0u1v2w3x4y';
export const DELETE_TICKET_PERMISSION_NAME = 'Delete Ticket';

// Cancel Ticket permission constants
export const CANCEL_TICKET_PERMISSION_ID = 'k0l1m2n3-4o5p-6q7r-8s9t-0u1v2w3x4y5z';
export const CANCEL_TICKET_PERMISSION_NAME = 'Cancel Ticket';