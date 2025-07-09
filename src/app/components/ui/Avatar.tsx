import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarProps {
    src?: string;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    fallback?: string;
    shape?: 'circle' | 'square' | 'rounded';
    status?: 'online' | 'offline' | 'away' | 'busy';
    showStatus?: boolean;
    border?: boolean;
    className?: string;
    onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    size = 'md',
    fallback,
    shape = 'circle',
    status,
    showStatus = false,
    border = false,
    className,
    onClick,
}) => {
    const sizeClasses = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
        '2xl': 'w-20 h-20 text-2xl',
    };

    const shapeClasses = {
        circle: 'rounded-full',
        square: 'rounded-none',
        rounded: 'rounded-lg',
    };

    const statusClasses = {
        online: 'bg-green-500',
        offline: 'bg-gray-500',
        away: 'bg-yellow-500',
        busy: 'bg-primary-red',
    };

    const statusSizeClasses = {
        xs: 'w-2 h-2',
        sm: 'w-2.5 h-2.5',
        md: 'w-3 h-3',
        lg: 'w-3.5 h-3.5',
        xl: 'w-4 h-4',
        '2xl': 'w-5 h-5',
    };

    const containerClasses = cn(
        'relative inline-flex items-center justify-center flex-shrink-0 font-medium overflow-hidden bg-background-secondary text-text-primary transition-colors',
        sizeClasses[size],
        shapeClasses[shape],
        border && 'border-2 border-primary-dark-gray/20',
        onClick && 'cursor-pointer hover:bg-background-secondary/80',
        className
    );

    const renderFallback = () => {
        if (fallback) {
            return (
                <span className="uppercase font-semibold">
                    {fallback.slice(0, 2)}
                </span>
            );
        }
        return <User className="w-1/2 h-1/2" />;
    };

    const renderStatusIndicator = () => {
        if (!showStatus || !status) return null;

        return (
            <div
                className={cn(
                    'absolute bottom-0 right-0 rounded-full border-2 border-background-primary',
                    statusClasses[status],
                    statusSizeClasses[size]
                )}
            />
        );
    };

    return (
        <div className={containerClasses} onClick={onClick}>
            {src ? (
                <img
                    src={src}
                    alt={alt || 'Avatar'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            ) : (
                renderFallback()
            )}
            {renderStatusIndicator()}
        </div>
    );
};

// Avatar Group Component
interface AvatarGroupProps {
    avatars: Array<{
        src?: string;
        alt?: string;
        fallback?: string;
    }>;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    max?: number;
    spacing?: 'none' | 'sm' | 'md' | 'lg';
    shape?: 'circle' | 'square' | 'rounded';
    showCount?: boolean;
    className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    avatars,
    size = 'md',
    max = 5,
    spacing = 'sm',
    shape = 'circle',
    showCount = true,
    className,
}) => {
    const displayAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    const spacingClasses = {
        none: 'space-x-0',
        sm: 'space-x-1',
        md: 'space-x-2',
        lg: 'space-x-3',
    };

    return (
        <div className={cn('flex items-center', spacingClasses[spacing], className)}>
            {displayAvatars.map((avatar, index) => (
                <Avatar
                    key={index}
                    src={avatar.src}
                    alt={avatar.alt}
                    fallback={avatar.fallback}
                    size={size}
                    shape={shape}
                    border
                    className={index > 0 ? '-ml-2' : ''}
                />
            ))}
            {showCount && remainingCount > 0 && (
                <Avatar
                    size={size}
                    shape={shape}
                    fallback={`+${remainingCount}`}
                    border
                    className="bg-primary-gold text-background-primary -ml-2"
                />
            )}
        </div>
    );
};

// Predefined Avatar Patterns
export const AvatarPatterns = {
    // User avatar with online status
    Online: (props: Partial<AvatarProps>) => (
        <Avatar
            status="online"
            showStatus
            {...props}
        />
    ),

    // Admin avatar with special styling
    Admin: (props: Partial<AvatarProps>) => (
        <Avatar
            border
            className="ring-2 ring-primary-gold"
            {...props}
        />
    ),

    // Team avatar group
    Team: (avatars: AvatarGroupProps['avatars'], props?: Partial<AvatarGroupProps>) => (
        <AvatarGroup
            avatars={avatars}
            max={4}
            spacing="sm"
            {...props}
        />
    ),

    // Large profile avatar
    Profile: (props: Partial<AvatarProps>) => (
        <Avatar
            size="2xl"
            shape="circle"
            border
            {...props}
        />
    ),

    // Small notification avatar
    Notification: (props: Partial<AvatarProps>) => (
        <Avatar
            size="sm"
            shape="circle"
            {...props}
        />
    ),
};

export default Avatar; 