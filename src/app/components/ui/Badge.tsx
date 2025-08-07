import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'solid' | 'soft' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
    color?: 'primary' | 'gold' | 'red' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
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
            success: 'bg-semantic-success-50 text-semantic-success-600',
            warning: 'bg-semantic-warning-50 text-semantic-warning-600',
            danger: 'bg-primary-red/20 text-primary-red',
            info: 'bg-primary-blue/20 text-primary-blue',
        },
        outline: {
            primary: 'border border-background-primary text-text-primary bg-transparent',
            gold: 'border border-primary-gold text-text-accent bg-transparent',
            red: 'border border-primary-red text-primary-red bg-transparent',
            secondary: 'border border-primary-dark-gray text-text-secondary bg-transparent',
            accent: 'border border-text-accent text-text-accent bg-transparent',
            success: 'border border-semantic-success-600 text-semantic-success-600 bg-transparent',
            warning: 'border border-semantic-warning-600 text-semantic-warning-600 bg-transparent',
            danger: 'border border-primary-red text-primary-red bg-transparent',
            info: 'border border-primary-blue text-primary-blue bg-transparent',
        },
        solid: {
            primary: 'bg-background-primary text-text-primary',
            gold: 'bg-primary-gold text-background-primary',
            red: 'bg-primary-red text-text-primary',
            secondary: 'bg-background-secondary text-text-primary',
            accent: 'bg-text-accent text-background-primary',
            success: 'bg-semantic-success-600 text-text-on-dark',
            warning: 'bg-semantic-warning-600 text-text-on-dark',
            danger: 'bg-primary-red text-text-on-dark',
            info: 'bg-primary-blue text-text-on-dark',
        },
        soft: {
            primary: 'bg-background-primary/10 text-text-primary border border-background-primary/20',
            gold: 'bg-primary-gold/10 text-text-accent border border-primary-gold/20',
            red: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
            secondary: 'bg-background-secondary/50 text-text-primary border border-primary-dark-gray/20',
            accent: 'bg-primary-gold-light/50 text-text-accent border border-text-accent/20',
            success: 'bg-semantic-success-50 text-semantic-success-600 border border-semantic-success-200',
            warning: 'bg-semantic-warning-50 text-semantic-warning-600 border border-semantic-warning-200',
            danger: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
            info: 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20',
        },
        danger: {
            primary: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
            gold: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
            red: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
            secondary: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
            accent: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
            success: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
            warning: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
            danger: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
            info: 'bg-primary-red/10 text-primary-red border border-primary-red/20',
        },
        warning: {
            primary: 'bg-semantic-warning-50 text-semantic-warning-600 border border-semantic-warning-200',
            gold: 'bg-semantic-warning-50 text-semantic-warning-600 border border-semantic-warning-200',
            red: 'bg-semantic-warning-50 text-semantic-warning-600 border border-semantic-warning-200',
            secondary: 'bg-semantic-warning-50 text-semantic-warning-600 border border-semantic-warning-200',
            accent: 'bg-semantic-warning-50 text-semantic-warning-600 border border-semantic-warning-200',
            success: 'bg-semantic-warning-50 text-semantic-warning-600 border border-semantic-warning-200',
            warning: 'bg-semantic-warning-50 text-semantic-warning-600 border border-semantic-warning-200',
            danger: 'bg-semantic-warning-50 text-semantic-warning-600 border border-semantic-warning-200',
            info: 'bg-semantic-warning-50 text-semantic-warning-600 border border-semantic-warning-200',
        },
        success: {
            primary: 'bg-semantic-success-50 text-semantic-success-600 border border-semantic-success-200',
            gold: 'bg-semantic-success-50 text-semantic-success-600 border border-semantic-success-200',
            red: 'bg-semantic-success-50 text-semantic-success-600 border border-semantic-success-200',
            secondary: 'bg-semantic-success-50 text-semantic-success-600 border border-semantic-success-200',
            accent: 'bg-semantic-success-50 text-semantic-success-600 border border-semantic-success-200',
            success: 'bg-semantic-success-50 text-semantic-success-600 border border-semantic-success-200',
            warning: 'bg-semantic-success-50 text-semantic-success-600 border border-semantic-success-200',
            danger: 'bg-semantic-success-50 text-semantic-success-600 border border-semantic-success-200',
            info: 'bg-semantic-success-50 text-semantic-success-600 border border-semantic-success-200',
        },
        info: {
            primary: 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20',
            gold: 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20',
            red: 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20',
            secondary: 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20',
            accent: 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20',
            success: 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20',
            warning: 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20',
            danger: 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20',
            info: 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20',
        },
    };

    const dotColors = {
        primary: 'bg-background-primary',
        gold: 'bg-primary-gold',
        red: 'bg-primary-red',
        secondary: 'bg-primary-gray-blue',
        accent: 'bg-text-accent',
        success: 'bg-semantic-success-600',
        warning: 'bg-semantic-warning-600',
        danger: 'bg-primary-red',
        info: 'bg-primary-blue',
    };

    // Semantic variant'lar için sabit stiller (NinetyNine tasarım sistemi)
    const getSemanticClasses = (variant: string) => {
        switch (variant) {
            case 'success':
                return 'bg-semantic-success-50 text-semantic-success-600 border border-semantic-success-200';
            case 'warning':
                return 'bg-semantic-warning-50 text-semantic-warning-600 border border-semantic-warning-200';
            case 'danger':
                return 'bg-primary-red/10 text-primary-red border border-primary-red/20';
            case 'info':
                return 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20';
            case 'secondary':
                return 'bg-primary-blue/10 text-primary-blue border border-primary-yellow/20';
            default:
                return null;
        }
    };

    const semanticClasses = getSemanticClasses(variant);

    return (
        <span
            className={cn(
                'inline-flex items-center font-medium',
                sizeClasses[size],
                semanticClasses || colorClasses[variant]?.[color] || colorClasses.default.secondary,
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