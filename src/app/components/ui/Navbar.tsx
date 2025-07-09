'use client'
import React, { useState } from 'react';
import { Menu, X, Search, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
    badge?: number;
    children?: NavItem[];
    onClick?: () => void;
}

interface NavbarProps {
    brand?: {
        logo?: string;
        name: string;
        href?: string;
    };
    items?: NavItem[];
    actions?: React.ReactNode;
    user?: {
        name: string;
        email?: string;
        avatar?: string;
    };
    searchable?: boolean;
    fixed?: boolean;
    transparent?: boolean;
    onMenuClick?: () => void;
    className?: string;
}

const Navbar: React.FC<NavbarProps> = ({
    brand,
    items = [],
    actions,
    user,
    searchable = false,
    fixed = false,
    transparent = false,
    onMenuClick,
    className,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        onMenuClick?.();
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    return (
        <nav
            className={cn(
                'w-full z-40 transition-all duration-200',
                fixed && 'fixed top-0 left-0 right-0',
                transparent
                    ? 'bg-transparent backdrop-blur-md border-b border-primary-dark-gray/20'
                    : 'bg-background-card border-b border-primary-dark-gray/20',
                className
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Brand & Menu */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMenu}
                            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 transition-colors"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Brand */}
                        {brand && (
                            <div className="flex items-center space-x-3">
                                {brand.logo && (
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="h-8 w-8 object-contain"
                                    />
                                )}
                                <span className="text-xl font-bold text-text-primary">
                                    {brand.name}
                                </span>
                            </div>
                        )}

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {items.map((item, index) => (
                                <NavbarItem key={index} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Center - Search */}
                    {searchable && (
                        <div className="hidden md:block flex-1 max-w-md mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Ara..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-primary-dark-gray/20 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold"
                                />
                            </div>
                        </div>
                    )}

                    {/* Right side - Actions & User */}
                    <div className="flex items-center space-x-3">
                        {/* Custom actions */}
                        {actions}

                        {/* Notifications */}
                        <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 rounded-lg transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-red text-white text-xs rounded-full flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {/* User Menu */}
                        {user && (
                            <div className="relative">
                                <button
                                    onClick={toggleUserMenu}
                                    className="flex items-center space-x-2 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 transition-colors"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 bg-primary-gold rounded-full flex items-center justify-center">
                                            <span className="text-background-primary text-sm font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <span className="hidden md:block text-sm font-medium">
                                        {user.name}
                                    </span>
                                    <ChevronDown size={16} />
                                </button>

                                {/* User Dropdown */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-background-card border border-primary-dark-gray/20 rounded-lg shadow-lg py-2">
                                        <div className="px-4 py-3 border-b border-primary-dark-gray/20">
                                            <p className="text-sm font-medium text-text-primary">{user.name}</p>
                                            {user.email && (
                                                <p className="text-sm text-text-secondary">{user.email}</p>
                                            )}
                                        </div>
                                        <div className="py-2">
                                            <button className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 transition-colors flex items-center space-x-2">
                                                <User size={16} />
                                                <span>Profil</span>
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 transition-colors flex items-center space-x-2">
                                                <LogOut size={16} />
                                                <span>Çıkış Yap</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-primary-dark-gray/20 pt-4 pb-4">
                        {searchable && (
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Ara..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-primary-dark-gray/20 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <MobileNavItem key={index} item={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// Desktop Nav Item Component
const NavbarItem: React.FC<{ item: NavItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (item.children && item.children.length > 0) {
        return (
            <div className="relative group">
                <button
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 transition-colors"
                >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                    <ChevronDown size={16} />
                </button>

                {isOpen && (
                    <div
                        className="absolute top-full left-0 mt-1 w-48 bg-background-card border border-primary-dark-gray/20 rounded-lg shadow-lg py-2 z-50"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        {item.children.map((child, index) => (
                            <button
                                key={index}
                                onClick={child.onClick}
                                className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 transition-colors flex items-center space-x-2"
                            >
                                {child.icon}
                                <span>{child.label}</span>
                                {child.badge && (
                                    <span className="ml-auto bg-primary-gold text-background-primary text-xs px-2 py-1 rounded-full">
                                        {child.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={item.onClick}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 transition-colors"
        >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
            {item.badge && (
                <span className="bg-primary-gold text-background-primary text-xs px-2 py-1 rounded-full">
                    {item.badge}
                </span>
            )}
        </button>
    );
};

// Mobile Nav Item Component
const MobileNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (item.children && item.children.length > 0) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 transition-colors"
                >
                    <div className="flex items-center space-x-2">
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronDown
                        size={16}
                        className={cn('transition-transform', isOpen && 'rotate-180')}
                    />
                </button>

                {isOpen && (
                    <div className="ml-4 mt-2 space-y-1">
                        {item.children.map((child, index) => (
                            <button
                                key={index}
                                onClick={child.onClick}
                                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 transition-colors"
                            >
                                {child.icon}
                                <span className="text-sm">{child.label}</span>
                                {child.badge && (
                                    <span className="ml-auto bg-primary-gold text-background-primary text-xs px-2 py-1 rounded-full">
                                        {child.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={item.onClick}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 transition-colors"
        >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
            {item.badge && (
                <span className="ml-auto bg-primary-gold text-background-primary text-xs px-2 py-1 rounded-full">
                    {item.badge}
                </span>
            )}
        </button>
    );
};

export default Navbar; 