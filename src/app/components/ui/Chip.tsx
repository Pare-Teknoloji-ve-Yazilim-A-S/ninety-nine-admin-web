import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChipProps {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'solid';
    color?: 'primary' | 'gold' | 'red' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    avatar?: string;
    removable?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    onRemove?: () => void;
    className?: string;
}

const Chip: React.FC<ChipProps> = ({
    children,
    variant = 'default',
    color = 'secondary',
    size = 'md',
    avatar,
    removable = false,
    disabled = false,
    onClick,
    onRemove,
    className,
}) => {
    const sizeClasses = {
        sm: {
            container: 'h-6 px-2 text-xs',
            avatar: 'h-4 w-4',
            icon: 'h-3 w-3',
        },
        md: {
            container: 'h-8 px-3 text-sm',
            avatar: 'h-6 w-6',
            icon: 'h-4 w-4',
        },
        lg: {
            container: 'h-10 px-4 text-base',
            avatar: 'h-8 w-8',
            icon: 'h-5 w-5',
        },
    };

    const colorClasses = {
        default: {
            primary: 'bg-background-primary/20 text-text-primary hover:bg-background-primary/30',
            gold: 'bg-primary-gold/20 text-text-accent hover:bg-primary-gold/30',
            red: 'bg-primary-red/20 text-primary-red hover:bg-primary-red/30',
            secondary: 'bg-background-secondary text-text-primary hover:bg-background-secondary/80',
            accent: 'bg-primary-gold-light text-text-accent hover:bg-primary-gold-light/80',
        },
        outline: {
            primary: 'border border-background-primary text-text-primary bg-transparent hover:bg-background-primary/10',
            gold: 'border border-primary-gold text-text-accent bg-transparent hover:bg-primary-gold/10',
            red: 'border border-primary-red text-primary-red bg-transparent hover:bg-primary-red/10',
            secondary: 'border border-primary-dark-gray text-text-secondary bg-transparent hover:bg-background-secondary/30',
            accent: 'border border-text-accent text-text-accent bg-transparent hover:bg-primary-gold-light/30',
        },
        solid: {
            primary: 'bg-background-primary text-text-primary hover:bg-background-primary/90',
            gold: 'bg-primary-gold text-background-primary hover:bg-primary-gold/90',
            red: 'bg-primary-red text-text-primary hover:bg-primary-red/90',
            secondary: 'bg-background-secondary text-text-primary hover:bg-background-secondary/80',
            accent: 'bg-text-accent text-background-primary hover:bg-text-accent/90',
        },
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove?.();
    };

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
                sizeClasses[size].container,
                colorClasses[variant][color],
                onClick && !disabled && 'cursor-pointer',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            onClick={!disabled ? onClick : undefined}
        >
            {/* Avatar */}
            {avatar && (
                <img
                    src={avatar}
                    alt=""
                    className={cn(
                        'rounded-full object-cover flex-shrink-0',
                        sizeClasses[size].avatar
                    )}
                />
            )}

            {/* Content */}
            <span className="truncate">{children}</span>

            {/* Remove Button */}
            {removable && !disabled && (
                <button
                    onClick={handleRemove}
                    className={cn(
                        'flex-shrink-0 rounded-full p-0.5 hover:bg-black/10 transition-colors',
                        variant === 'solid' && 'hover:bg-white/20'
                    )}
                >
                    <X className={sizeClasses[size].icon} />
                </button>
            )}
        </div>
    );
};

export default Chip; 