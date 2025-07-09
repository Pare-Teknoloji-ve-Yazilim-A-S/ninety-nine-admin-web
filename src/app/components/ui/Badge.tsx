import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'solid' | 'soft';
    color?: 'primary' | 'gold' | 'red' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    rounded?: boolean;
    dot?: boolean;
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    color = 'secondary',
    size = 'md',
    rounded = true,
    dot = false,
    className,
}) => {
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-1.5 text-sm',
        lg: 'px-3 py-2 text-base',
    };

    const colorClasses = {
        default: {
            primary: 'bg-background-primary/20 text-text-primary',
            gold: 'bg-primary-gold/20 text-text-accent',
            red: 'bg-primary-red/20 text-primary-red',
            secondary: 'bg-background-secondary text-text-primary',
            accent: 'bg-primary-gold-light text-text-accent',
        },
        outline: {
            primary: 'border border-background-primary text-text-primary bg-transparent',
            gold: 'border border-primary-gold text-text-accent bg-transparent',
            red: 'border border-primary-red text-primary-red bg-transparent',
            secondary: 'border border-primary-dark-gray text-text-secondary bg-transparent',
            accent: 'border border-text-accent text-text-accent bg-transparent',
        },
        solid: {
            primary: 'bg-background-primary text-text-primary',
            gold: 'bg-primary-gold text-background-primary',
            red: 'bg-primary-red text-text-primary',
            secondary: 'bg-background-secondary text-text-primary',
            accent: 'bg-text-accent text-background-primary',
        },
        soft: {
            primary: 'bg-background-primary/10 text-text-primary border border-background-primary/20',
            gold: 'bg-primary-gold/10 text-text-accent border border-primary-gold/20',
            red: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
            secondary: 'bg-background-secondary/50 text-text-primary border border-primary-dark-gray/20',
            accent: 'bg-primary-gold-light/50 text-text-accent border border-text-accent/20',
        },
    };

    const dotColors = {
        primary: 'bg-background-primary',
        gold: 'bg-primary-gold',
        red: 'bg-primary-red',
        secondary: 'bg-primary-gray-blue',
        accent: 'bg-text-accent',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center font-medium',
                sizeClasses[size],
                colorClasses[variant][color],
                rounded ? 'rounded-full' : 'rounded-lg',
                className
            )}
        >
            {dot && (
                <span
                    className={cn(
                        'w-2 h-2 rounded-full mr-1.5',
                        dotColors[color]
                    )}
                />
            )}
            {children}
        </span>
    );
};

export default Badge; 