import React from 'react';
import { InboxIcon, SearchIcon, FileTextIcon, Users2Icon, PackageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon?: 'inbox' | 'search' | 'file' | 'users' | 'package' | React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'inbox',
    title,
    description,
    action,
    size = 'md',
    className,
}) => {
    const sizeClasses = {
        sm: {
            container: 'py-8',
            icon: 'h-12 w-12',
            title: 'text-base',
            description: 'text-sm',
        },
        md: {
            container: 'py-12',
            icon: 'h-16 w-16',
            title: 'text-lg',
            description: 'text-base',
        },
        lg: {
            container: 'py-16',
            icon: 'h-20 w-20',
            title: 'text-xl',
            description: 'text-lg',
        },
    };

    const iconMap: Record<'inbox' | 'search' | 'file' | 'users' | 'package', React.ComponentType<{ className?: string }>> = {
        inbox: InboxIcon,
        search: SearchIcon,
        file: FileTextIcon,
        users: Users2Icon,
        package: PackageIcon,
    };

    const renderIcon = () => {
        if (React.isValidElement(icon)) {
            return icon;
        }

        if (typeof icon === 'string' && icon in iconMap) {
            const IconComponent = iconMap[icon as keyof typeof iconMap];
            return (
                <IconComponent
                    className={cn('text-primary-gray-blue', sizeClasses[size].icon)}
                />
            );
        }

        return (
            <InboxIcon
                className={cn('text-primary-gray-blue', sizeClasses[size].icon)}
            />
        );
    };

    return (
        <div className={cn('text-center', sizeClasses[size].container, className)}>
            <div className="flex justify-center mb-4">
                {renderIcon()}
            </div>

            <h3 className={cn('font-semibold text-text-primary mb-2', sizeClasses[size].title)}>
                {title}
            </h3>

            {description && (
                <p className={cn('text-text-secondary mb-6', sizeClasses[size].description)}>
                    {description}
                </p>
            )}

            {action && (
                <div className="flex justify-center">
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState; 