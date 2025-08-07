'use client'
import {
    Home,
    Users,
    Building,
    DollarSign,
    Megaphone,
    Wrench,
    BarChart3,
    Settings,
    ChevronRight,
    ChevronDown,
    UserPlus,
    Clock,
    List,
    MapPin,
    Activity,
    FileText,
    Receipt,
    CreditCard,
    MessageSquare,
    CheckCircle,
    PieChart,
    Building2,
    UserCog,
    UserCheck,
    Briefcase,
    Users2
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Header from './Header'

interface SubMenuItem {
    label: string;
    href: string;
    icon?: any;
}

interface MenuItem {
    icon: any;
    label: string;
    href?: string;
    hasSubmenu?: boolean;
    submenu?: SubMenuItem[];
}

export default function Sidebar() {
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard']);
    const pathname = usePathname();

    const toggleMenu = (menuLabel: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuLabel)
                ? prev.filter(item => item !== menuLabel)
                : [...prev, menuLabel]
        );
    };

    const navigationItems: MenuItem[] = [
        {
            icon: Home,
            label: 'Dashboard',
            href: '/dashboard'
        },
        {
            icon: Users,
            label: 'Sakinler',
            hasSubmenu: true,
            submenu: [
                { label: 'Sakin Listesi', href: '/sakinler', icon: List },
                { label: 'Yeni Sakin Ekle', href: '/sakinler/yeni', icon: UserPlus },
                { label: 'Onay Bekleyenler', href: '/sakinler/onay-bekleyenler', icon: Clock }
            ]
        },
        {
            icon: UserCheck,
            label: 'Personel',
            hasSubmenu: true,
            submenu: [
                { label: 'Personel Listesi', href: '/staff', icon: Users2 },
                { label: 'Departmanlar', href: '/staff?tab=departments', icon: Building2 },
                { label: 'Pozisyonlar', href: '/staff?tab=positions', icon: Briefcase },
                { label: 'Raporlar', href: '/staff?tab=reports', icon: BarChart3 }
            ]
        },
        {
            icon: Building,
            label: 'Konutlar',
            hasSubmenu: true,
            submenu: [
                { label: 'Daire/Villa Listesi', href: '/konutlar', icon: Building2 },
                { label: 'Boş Konutlar', href: '/konutlar/bos', icon: MapPin },
                { label: 'Bakım Durumu', href: '/konutlar/bakim', icon: Activity }
            ]
        },
        {
            icon: DollarSign,
            label: 'Finansal İşlemler',
            hasSubmenu: true,
            submenu: [
                { label: 'Aidat Takibi', href: '/finans/aidat', icon: FileText },
                { label: 'Ödeme Geçmişi', href: '/finans/odeme-gecmisi', icon: Receipt },
                { label: 'Borç Raporları', href: '/finans/borc-raporlari', icon: CreditCard },
                { label: 'Fatura Yönetimi', href: '/finans/faturalar', icon: FileText }
            ]
        },
        {
            icon: Megaphone,
            label: 'Duyurular',
            hasSubmenu: true,
            submenu: [
                { label: 'Aktif Duyurular', href: '/duyurular', icon: MessageSquare },
                { label: 'Yeni Duyuru', href: '/duyurular/yeni', icon: UserPlus },
                { label: 'Duyuru Arşivi', href: '/duyurular/arsiv', icon: List }
            ]
        },
        {
            icon: Wrench,
            label: 'Hizmet Talepleri',
            hasSubmenu: true,
            submenu: [
                { label: 'Açık Talepler', href: '/hizmet-talepleri/acik', icon: Clock },
                { label: 'İşlem Bekleyenler', href: '/hizmet-talepleri/bekleyen', icon: Activity },
                { label: 'Tamamlananlar', href: '/hizmet-talepleri/tamamlanan', icon: CheckCircle }
            ]
        },
        {
            icon: BarChart3,
            label: 'Raporlar',
            hasSubmenu: true,
            submenu: [
                { label: 'Mali Raporlar', href: '/raporlar/mali', icon: DollarSign },
                { label: 'Doluluk Raporları', href: '/raporlar/doluluk', icon: PieChart },
                { label: 'Hizmet Raporları', href: '/raporlar/hizmet', icon: Wrench }
            ]
        },
        {
            icon: Settings,
            label: 'Ayarlar',
            hasSubmenu: true,
            submenu: [
                { label: 'Site Bilgileri', href: '/ayarlar/site', icon: Building },
                { label: 'Kullanıcı Yönetimi', href: '/ayarlar/kullanicilar', icon: UserCog },
                { label: 'Sistem Ayarları', href: '/ayarlar/sistem', icon: Settings }
            ]
        }
    ];

    const renderMenuItem = (item: MenuItem, index: number) => {
        const IconComponent = item.icon;
        const isExpanded = expandedMenus.includes(item.label);
        const hasSubmenu = item.hasSubmenu && item.submenu;
        const isActive = item.href === pathname;

        const menuContent = (
            <div
                onClick={() => hasSubmenu ? toggleMenu(item.label) : null}
                className={`
                    group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
                    ${isActive
                        ? 'bg-primary-gold/10 text-text-accent border border-primary-gold/30'
                        : 'text-text-primary hover:bg-background-secondary/50 hover:text-text-accent'
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    <div className={`
                        p-1.5 rounded-lg transition-colors duration-200
                        ${isActive
                            ? 'bg-primary-gold/20'
                            : 'bg-background-secondary/50 group-hover:bg-primary-gold/20'
                        }
                    `}>
                        <IconComponent className={`
                            w-4 h-4 transition-colors duration-200
                            ${isActive
                                ? 'text-text-accent'
                                : 'text-text-secondary group-hover:text-text-accent'
                            }
                        `} />
                    </div>
                    <span className="font-inter">{item.label}</span>
                </div>

                {hasSubmenu ? (
                    isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-text-secondary transition-transform duration-200" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-text-secondary transition-transform duration-200" />
                    )
                ) : isActive ? (
                    <ChevronRight className="w-4 h-4 text-text-accent" />
                ) : null}
            </div>
        );

        return (
            <div key={index} className="space-y-1">
                {/* Ana menu - Link veya div */}
                {!hasSubmenu && item.href ? (
                    <Link href={item.href}>
                        {menuContent}
                    </Link>
                ) : (
                    menuContent
                )}

                {/* Submenu */}
                {hasSubmenu && isExpanded && (
                    <div className="ml-6 space-y-1 border-l border-primary-dark-gray/20 pl-4">
                        {item.submenu?.map((subItem, subIndex) => {
                            const SubIconComponent = subItem.icon;
                            return (
                                <Link
                                    key={subIndex}
                                    href={subItem.href}
                                    className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-secondary hover:bg-background-secondary/30 hover:text-text-accent rounded-lg transition-all duration-200"
                                >
                                    {SubIconComponent && (
                                        <div className="p-1 rounded-md bg-background-secondary/30 group-hover:bg-primary-gold/20 transition-colors duration-200">
                                            <SubIconComponent className="w-3 h-3 text-text-secondary group-hover:text-text-accent transition-colors duration-200" />
                                        </div>
                                    )}
                                    <span className="font-inter text-xs">{subItem.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-80 bg-background-card border-r border-primary-dark-gray/20 flex flex-col h-full">
            <Header />

            {/* Navigation */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
                <nav className="space-y-2">
                    {/* Main Navigation */}
                    <div className="space-y-2">
                        <div className="px-3 pb-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide font-inter">
                                    99Club Admin Panel
                                </h3>
                            </div>
                        </div>

                        {navigationItems.map((item, index) => renderMenuItem(item, index))}
                    </div>
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="px-6 py-4 border-t border-primary-dark-gray/20">
                <div className="bg-gradient-to-r from-primary-gold/10 to-text-accent/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-primary-gold rounded-full animate-pulse"></div>
                        <h4 className="text-sm font-semibold text-text-primary font-helvetica">
                            99Club Admin
                        </h4>
                    </div>
                    <p className="text-xs text-text-secondary font-inter leading-relaxed">
                        Site yönetim paneli ile tüm işlemlerinizi kolayca takip edin
                    </p>
                </div>
            </div>
        </div>
    );
}