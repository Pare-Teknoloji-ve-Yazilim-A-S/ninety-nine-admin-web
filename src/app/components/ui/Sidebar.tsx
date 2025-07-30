'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/components/auth/AuthProvider';
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
    MoreVertical
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

const menuItems: MenuItemProps[] = [
    {
        title: 'Dashboard',
        icon: BarChart3,
        href: '/dashboard'
    },
    {
        title: 'Konut Yönetimi',
        icon: Building,
        href: '/dashboard/units'
    },
    {
        title: 'Sakin Yönetimi',
        icon: User,
        href: '/dashboard/residents'
    },
    {
        title: 'Hizmet/Talep Yönetimi',
        icon: Wrench,
        href: '/dashboard/requests'
    },
    {
        title: 'Finansal İşlemler',
        icon: DollarSign,
        href: '/dashboard/financial'
    },
    {
        title: 'Duyurular',
        icon: Megaphone,
        href: '/dashboard/announcements'
    },
    {
        title: 'Ayarlar',
        icon: Settings,
        href: '/dashboard/settings'
    }
    // {
    //     title: 'Finansal İşlemler',
    //     icon: DollarSign,
    //     children: [
    //         { title: 'Aidat Takibi', icon: CreditCard, href: '/dashboard/financial/dues' },
    //         { title: 'Ödeme Geçmişi', icon: History, href: '/dashboard/financial/payments' },
    //         { title: 'Borç Raporları', icon: FileText, href: '/dashboard/financial/debts' },
    //         { title: 'Fatura Yönetimi', icon: Receipt, href: '/dashboard/financial/bills' }
    //     ]
    // },
    // {
    //     title: 'Duyurular',
    //     icon: Megaphone,
    //     children: [
    //         { title: 'Aktif Duyurular', icon: Bell, href: '/dashboard/announcements' },
    //         { title: 'Yeni Duyuru', icon: Plus, href: '/dashboard/announcements/create' },
    //         { title: 'Duyuru Arşivi', icon: Archive, href: '/dashboard/announcements/archive' }
    //     ]
    // },
    // {
    //     title: 'Hizmet Talepleri',
    //     icon: Wrench,
    //     children: [
    //         { title: 'Açık Talepler', icon: AlertCircle, href: '/dashboard/requests' },
    //         { title: 'İşlem Bekleyenler', icon: Clock, href: '/dashboard/requests/waiting' },
    //         { title: 'Tamamlananlar', icon: CheckCircle, href: '/dashboard/requests/resolved' }
    //     ]
    // },
    // {
    //     title: 'Raporlar',
    //     icon: TrendingUp,
    //     children: [
    //         { title: 'Mali Raporlar', icon: FileBarChart, href: '/dashboard/reports/financial' },
    //         { title: 'Doluluk Raporları', icon: PieChart, href: '/dashboard/reports/occupancy' },
    //         { title: 'Hizmet Raporları', icon: Activity, href: '/dashboard/reports/services' }
    //     ]
    // },
    // {
    //     title: 'Ayarlar',
    //     icon: Settings,
    //     children: [
    //         { title: 'Site Bilgileri', icon: Info, href: '/settings/website-info' },
    //         { title: 'Kullanıcı Yönetimi', icon: Shield, href: '/settings/user-management' },
    //         { title: 'Sistem Ayarları', icon: Cog, href: '/settings/system-settings' }
    //     ]
    // }
];

function MenuItem({ title, icon: Icon, href, children, isOpen, onToggle }: MenuItemProps) {
    const pathname = usePathname();
    const isActive = href ? pathname === href : children?.some(child => pathname === child.href);
    const hasChildren = children && children.length > 0;

    if (!hasChildren && href) {
        return (
            <Link
                href={href}
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
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 h-screen w-72 bg-background-light-card dark:bg-background-card',
                    'border-r border-border-light dark:border-border-dark',
                    'shadow-xl backdrop-blur-xl bg-background-light-card/95 dark:bg-background-card/95',
                    'transform transition-transform duration-300 ease-in-out z-50',
                    'lg:translate-x-0 lg:z-auto flex flex-col',
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
                                    {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Admin Kullanıcısı'}
                                </p>
                                <p className="text-xs text-text-light-muted dark:text-text-muted truncate">
                                    {user?.role?.name || 'Yönetici'}
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
                                Profil
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-text-light-secondary dark:text-text-secondary hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg hover:text-primary-red transition-colors"
                            >
                                <LogOut className="h-3 w-3" />
                                Çıkış
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
} 