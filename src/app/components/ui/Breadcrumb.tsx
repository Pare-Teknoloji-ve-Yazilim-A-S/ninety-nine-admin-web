import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
    showHome?: boolean;
    maxItems?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    separator = <ChevronRight size={16} />,
    showHome = true,
    maxItems,
    size = 'md',
    className,
}) => {
    // Add home item if showHome is true and first item is not home
    const breadcrumbItems = showHome && items.length > 0 && items[0].label !== 'Ana Sayfa'
        ? [{ label: 'Ana Sayfa', href: '/', icon: <Home size={16} /> }, ...items]
        : items;

    // Handle maxItems truncation
    const displayItems = maxItems && breadcrumbItems.length > maxItems
        ? [
            ...breadcrumbItems.slice(0, 1),
            { label: '...', href: undefined, icon: undefined },
            ...breadcrumbItems.slice(-(maxItems - 2))
        ]
        : breadcrumbItems;

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <nav className={cn('flex items-center space-x-2', sizeClasses[size], className)}>
            {displayItems.map((item, index) => (
                <React.Fragment key={index}>
                    <BreadcrumbItem
                        item={item}
                        isLast={index === displayItems.length - 1}
                        size={size}
                    />
                    {index < displayItems.length - 1 && (
                        <span className="text-text-secondary flex-shrink-0">
                            {separator}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

// Individual Breadcrumb Item Component
const BreadcrumbItem: React.FC<{
    item: BreadcrumbItem;
    isLast: boolean;
    size: 'sm' | 'md' | 'lg';
}> = ({ item, isLast, size }) => {
    const handleClick = (e: React.MouseEvent) => {
        if (item.onClick) {
            e.preventDefault();
            item.onClick();
        }
    };

    const baseClasses = cn(
        'flex items-center space-x-1 transition-colors',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg',
    );

    const linkClasses = cn(
        baseClasses,
        'hover:text-primary-gold cursor-pointer',
        isLast || item.active
            ? 'text-text-primary font-medium'
            : 'text-text-secondary'
    );

    const textClasses = cn(
        baseClasses,
        isLast || item.active
            ? 'text-text-primary font-medium'
            : 'text-text-secondary'
    );

    // Handle ellipsis
    if (item.label === '...') {
        return (
            <span className="text-text-secondary px-2">
                {item.label}
            </span>
        );
    }

    // Render as link if href or onClick is provided
    if (item.href || item.onClick) {
        return (
            <a
                href={item.href}
                onClick={handleClick}
                className={linkClasses}
                aria-current={isLast ? 'page' : undefined}
            >
                {item.icon && (
                    <span className="flex-shrink-0">
                        {item.icon}
                    </span>
                )}
                <span className="truncate">{item.label}</span>
            </a>
        );
    }

    // Render as text
    return (
        <span className={textClasses} aria-current={isLast ? 'page' : undefined}>
            {item.icon && (
                <span className="flex-shrink-0">
                    {item.icon}
                </span>
            )}
            <span className="truncate">{item.label}</span>
        </span>
    );
};

// Predefined Breadcrumb Patterns
export const BreadcrumbPatterns = {
    // Simple page breadcrumb
    Simple: (currentPage: string, props?: Partial<BreadcrumbProps>) => (
        <Breadcrumb
            items={[
                { label: currentPage, active: true }
            ]}
            {...props}
        />
    ),

    // Two-level breadcrumb
    TwoLevel: (section: string, page: string, props?: Partial<BreadcrumbProps>) => (
        <Breadcrumb
            items={[
                { label: section, href: `/${section.toLowerCase()}` },
                { label: page, active: true }
            ]}
            {...props}
        />
    ),

    // Three-level breadcrumb
    ThreeLevel: (section: string, subsection: string, page: string, props?: Partial<BreadcrumbProps>) => (
        <Breadcrumb
            items={[
                { label: section, href: `/${section.toLowerCase()}` },
                { label: subsection, href: `/${section.toLowerCase()}/${subsection.toLowerCase()}` },
                { label: page, active: true }
            ]}
            {...props}
        />
    ),

    // Dashboard breadcrumb
    Dashboard: (path: string[], props?: Partial<BreadcrumbProps>) => (
        <Breadcrumb
            items={path.map((item, index) => ({
                label: item,
                href: index < path.length - 1 ? `/${path.slice(0, index + 1).join('/')}` : undefined,
                active: index === path.length - 1,
            }))}
            {...props}
        />
    ),
};

export default Breadcrumb; 