'use client'
import React, { useState, useRef, useEffect } from 'react';
import {
    User,
    Settings,
    LogOut,
    Bell,
    Heart,
    HelpCircle,
    CreditCard,
    Shield,
    Moon,
    Sun,
    Globe,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Avatar from './Avatar';
import Badge from './Badge';

interface ProfileDropdownItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    badge?: string | number;
    variant?: 'default' | 'danger' | 'success' | 'warning';
    disabled?: boolean;
    children?: ProfileDropdownItem[];
    divider?: boolean;
}

interface ProfileDropdownProps {
    user: {
        name: string;
        email?: string;
        avatar?: string;
        role?: string;
        status?: 'online' | 'offline' | 'away' | 'busy';
    };
    items?: ProfileDropdownItem[];
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    trigger?: 'click' | 'hover';
    showUserInfo?: boolean;
    showStatus?: boolean;
    compact?: boolean;
    className?: string;
    onClose?: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
    user,
    items = [],
    position = 'bottom-right',
    trigger = 'click',
    showUserInfo = true,
    showStatus = true,
    compact = false,
    className,
    onClose,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (dropdownRef.current && target && !dropdownRef.current.contains(target)) {
                setIsOpen(false);
                setOpenSubmenu(null);
                onClose?.();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleMouseEnter = () => {
        if (trigger === 'hover') {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (trigger === 'hover') {
            setIsOpen(false);
            setOpenSubmenu(null);
        }
    };

    const positionClasses = {
        'bottom-right': 'top-full right-0 mt-2',
        'bottom-left': 'top-full left-0 mt-2',
        'top-right': 'bottom-full right-0 mb-2',
        'top-left': 'bottom-full left-0 mb-2',
    };

    const renderTrigger = () => {
        if (compact) {
            return (
                <button
                    onClick={handleToggle}
                    onMouseEnter={handleMouseEnter}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-background-light-card/80 dark:bg-background-card/80 border border-gray-200 dark:border-gray-700 hover:border-primary-gold/60 hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg transition-all duration-200"
                >
                    <Avatar
                        src={user.avatar}
                        fallback={user.name}
                        size="sm"
                        status={user.status}
                        showStatus={showStatus}
                    />
                    <ChevronDown size={16} className={cn('transition-transform text-text-light-secondary dark:text-text-secondary', isOpen && 'rotate-180')} />
                </button>
            );
        }

        return (
            <button
                onClick={handleToggle}
                onMouseEnter={handleMouseEnter}
                className="flex items-center space-x-3 p-3 rounded-xl bg-background-light-card/90 dark:bg-background-card/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-primary-gold/60 dark:hover:border-primary-gold/60 hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg transition-all duration-200 shadow-sm hover:shadow-md"
            >
                <Avatar
                    src={user.avatar}
                    fallback={user.name}
                    size="md"
                    status={user.status}
                    showStatus={showStatus}
                />
                <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-text-on-light dark:text-text-on-dark">{user.name}</div>
                    {user.role && (
                        <div className="text-xs text-primary-gold dark:text-primary-gold font-medium">{user.role}</div>
                    )}
                </div>
                <ChevronDown size={16} className={cn('transition-transform text-text-light-secondary dark:text-text-secondary', isOpen && 'rotate-180')} />
            </button>
        );
    };

    const renderItem = (item: ProfileDropdownItem, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isSubmenuOpen = openSubmenu === item.id;

        const handleClick = (e: React.MouseEvent) => {
            if (hasChildren) {
                e.preventDefault();
                setOpenSubmenu(isSubmenuOpen ? null : item.id);
            } else {
                item.onClick?.();
                setIsOpen(false);
                setOpenSubmenu(null);
            }
        };

        const variantClasses = {
            default: 'text-text-light-secondary dark:text-text-secondary hover:text-text-on-light dark:hover:text-text-on-dark hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg',
            danger: 'text-primary-red dark:text-primary-red hover:text-primary-red-dark dark:hover:text-red-300 hover:bg-primary-red-light/70 dark:hover:bg-red-900/20',
            success: 'text-semantic-success-600 dark:text-semantic-success-500 hover:text-semantic-success-700 dark:hover:text-semantic-success-400 hover:bg-semantic-success-50/70 dark:hover:bg-semantic-success-900/20',
            warning: 'text-semantic-warning-600 dark:text-semantic-warning-500 hover:text-semantic-warning-700 dark:hover:text-semantic-warning-400 hover:bg-semantic-warning-50/70 dark:hover:bg-semantic-warning-900/20',
        };

        return (
            <div key={item.id}>
                {item.divider && (
                    <div className="my-3 border-t border-gray-200 dark:border-gray-700" />
                )}

                <button
                    onClick={handleClick}
                    disabled={item.disabled}
                    className={cn(
                        'w-full flex items-center justify-between px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all duration-200',
                        depth > 0 && 'ml-6',
                        item.disabled && 'opacity-50 cursor-not-allowed',
                        variantClasses[item.variant || 'default']
                    )}
                >
                    <div className="flex items-center space-x-3">
                        {item.icon && (
                            <span className="flex-shrink-0">
                                {item.icon}
                            </span>
                        )}
                        <span>{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {item.badge && (
                            <Badge
                                variant="soft"
                                size="sm"
                                color={item.variant === 'danger' ? 'red' : 'primary'}
                            >
                                {item.badge}
                            </Badge>
                        )}
                        {hasChildren && <ChevronRight size={16} />}
                    </div>
                </button>

                {hasChildren && isSubmenuOpen && (
                    <div className="mt-1 space-y-1">
                        {item.children!.map((child) => renderItem(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            ref={dropdownRef}
            className={cn('relative', className)}
            onMouseLeave={handleMouseLeave}
        >
            {renderTrigger()}

            {isOpen && (
                <div
                    className={cn(
                        'absolute z-50 w-80 bg-background-light-card/95 dark:bg-background-card/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl py-3',
                        positionClasses[position]
                    )}
                >
                    {showUserInfo && (
                        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-gold-light/30 to-primary-gold/20 dark:from-primary-gold/10 dark:to-primary-gold/5 rounded-t-2xl">
                            <div className="flex items-center space-x-4">
                                <Avatar
                                    src={user.avatar}
                                    fallback={user.name}
                                    size="lg"
                                    status={user.status}
                                    showStatus={showStatus}
                                />
                                <div className="flex-1">
                                    <div className="font-semibold text-text-on-light dark:text-text-on-dark text-base">{user.name}</div>
                                    {user.email && (
                                        <div className="text-sm text-text-light-secondary dark:text-text-secondary">{user.email}</div>
                                    )}
                                    {user.role && (
                                        <div className="inline-block mt-1 px-2 py-1 text-xs font-medium text-text-on-gold dark:text-text-on-gold bg-primary-gold-light/60 dark:bg-primary-gold/20 rounded-lg">
                                            {user.role}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="py-3">
                        {items.map((item) => renderItem(item))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Predefined ProfileDropdown Patterns
export const ProfileDropdownPatterns = {
    // Standard user dropdown
    Standard: (user: ProfileDropdownProps['user'], props?: Partial<ProfileDropdownProps>) => (
        <ProfileDropdown
            user={user}
            items={[
                {
                    id: 'profile',
                    label: 'Profil',
                    icon: <User size={16} />,
                    onClick: () => console.log('Profile clicked'),
                },
                {
                    id: 'settings',
                    label: 'Ayarlar',
                    icon: <Settings size={16} />,
                    onClick: () => console.log('Settings clicked'),
                },
                {
                    id: 'notifications',
                    label: 'Bildirimler',
                    icon: <Bell size={16} />,
                    badge: 3,
                    onClick: () => console.log('Notifications clicked'),
                },
                {
                    id: 'help',
                    label: 'Yardım',
                    icon: <HelpCircle size={16} />,
                    onClick: () => console.log('Help clicked'),
                },
                {
                    id: 'logout',
                    label: 'Çıkış Yap',
                    icon: <LogOut size={16} />,
                    variant: 'danger',
                    divider: true,
                    onClick: () => console.log('Logout clicked'),
                },
            ]}
            {...props}
        />
    ),

    // Admin dropdown with more options
    Admin: (user: ProfileDropdownProps['user'], props?: Partial<ProfileDropdownProps>) => (
        <ProfileDropdown
            user={user}
            items={[
                {
                    id: 'profile',
                    label: 'Profil',
                    icon: <User size={16} />,
                    onClick: () => console.log('Profile clicked'),
                },
                {
                    id: 'admin',
                    label: 'Yönetim',
                    icon: <Shield size={16} />,
                    children: [
                        {
                            id: 'users',
                            label: 'Kullanıcılar',
                            onClick: () => console.log('Users clicked'),
                        },
                        {
                            id: 'roles',
                            label: 'Roller',
                            onClick: () => console.log('Roles clicked'),
                        },
                        {
                            id: 'permissions',
                            label: 'İzinler',
                            onClick: () => console.log('Permissions clicked'),
                        },
                    ],
                },
                {
                    id: 'settings',
                    label: 'Ayarlar',
                    icon: <Settings size={16} />,
                    children: [
                        {
                            id: 'account',
                            label: 'Hesap',
                            onClick: () => console.log('Account clicked'),
                        },
                        {
                            id: 'billing',
                            label: 'Faturalandırma',
                            icon: <CreditCard size={16} />,
                            onClick: () => console.log('Billing clicked'),
                        },
                        {
                            id: 'preferences',
                            label: 'Tercihler',
                            onClick: () => console.log('Preferences clicked'),
                        },
                    ],
                },
                {
                    id: 'help',
                    label: 'Yardım',
                    icon: <HelpCircle size={16} />,
                    onClick: () => console.log('Help clicked'),
                },
                {
                    id: 'logout',
                    label: 'Çıkış Yap',
                    icon: <LogOut size={16} />,
                    variant: 'danger',
                    divider: true,
                    onClick: () => console.log('Logout clicked'),
                },
            ]}
            {...props}
        />
    ),

    // Compact dropdown for mobile
    Compact: (user: ProfileDropdownProps['user'], props?: Partial<ProfileDropdownProps>) => (
        <ProfileDropdown
            user={user}
            compact
            items={[
                {
                    id: 'profile',
                    label: 'Profil',
                    icon: <User size={16} />,
                    onClick: () => console.log('Profile clicked'),
                },
                {
                    id: 'settings',
                    label: 'Ayarlar',
                    icon: <Settings size={16} />,
                    onClick: () => console.log('Settings clicked'),
                },
                {
                    id: 'logout',
                    label: 'Çıkış Yap',
                    icon: <LogOut size={16} />,
                    variant: 'danger',
                    divider: true,
                    onClick: () => console.log('Logout clicked'),
                },
            ]}
            {...props}
        />
    ),

    // Simple dropdown
    Simple: (user: ProfileDropdownProps['user'], props?: Partial<ProfileDropdownProps>) => (
        <ProfileDropdown
            user={user}
            showUserInfo={false}
            items={[
                {
                    id: 'profile',
                    label: 'Profil',
                    onClick: () => console.log('Profile clicked'),
                },
                {
                    id: 'settings',
                    label: 'Ayarlar',
                    onClick: () => console.log('Settings clicked'),
                },
                {
                    id: 'logout',
                    label: 'Çıkış Yap',
                    variant: 'danger',
                    onClick: () => console.log('Logout clicked'),
                },
            ]}
            {...props}
        />
    ),
};

export default ProfileDropdown; 