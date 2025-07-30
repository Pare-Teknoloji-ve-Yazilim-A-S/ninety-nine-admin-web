import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from './Card';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        isPositive?: boolean;
        isPercentage?: boolean;
    };
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'minimal' | 'bordered' | 'gradient';
    onClick?: () => void;
    className?: string;
    loading?: boolean;
    prefix?: string;
    suffix?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = 'primary',
    size = 'md',
    variant = 'default',
    onClick,
    className,
    loading = false,
    prefix = '',
    suffix = '',
}) => {
    const sizeClasses = {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const valueSizes = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl',
    };

    const titleSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    const colorClasses = {
        primary: {
            icon: 'text-primary-gold bg-primary-gold/10',
            value: 'text-text-on-light dark:text-text-on-dark',
            trend: 'text-primary-gold',
        },
        success: {
            icon: 'text-semantic-success-600 bg-semantic-success-100 dark:bg-semantic-success-900/20',
            value: 'text-semantic-success-600',
            trend: 'text-semantic-success-600',
        },
        warning: {
            icon: 'text-semantic-warning-600 bg-semantic-warning-100 dark:bg-semantic-warning-900/20',
            value: 'text-semantic-warning-600',
            trend: 'text-semantic-warning-600',
        },
        danger: {
            icon: 'text-primary-red bg-primary-red/10',
            value: 'text-primary-red',
            trend: 'text-primary-red',
        },
        info: {
            icon: 'text-primary-blue bg-primary-blue/10',
            value: 'text-primary-blue',
            trend: 'text-primary-blue',
        },
        gold: {
            icon: 'text-primary-gold bg-primary-gold/10',
            value: 'text-primary-gold',
            trend: 'text-primary-gold',
        },
    };

    const variantClasses = {
        default: 'bg-background-card border border-primary-gold/20',
        minimal: 'bg-transparent border-0 shadow-none',
        bordered: 'bg-background-card border-2 border-primary-gold/30',
        gradient: 'bg-gradient-to-br from-primary-gold/5 to-primary-gold/20 border border-primary-gold/30',
    };

    const getTrendIcon = () => {
        if (!trend) return null;
        
        if (trend.value > 0) return TrendingUp;
        if (trend.value < 0) return TrendingDown;
        return Minus;
    };

    const TrendIcon = getTrendIcon();

    const formatValue = (val: string | number) => {
        if (loading) return '---';
        
        if (typeof val === 'number') {
            return val.toLocaleString('tr-TR');
        }
        
        return val;
    };

    const formatTrendValue = (val: number) => {
        if (!trend) return '';
        const formatted = Math.abs(val).toLocaleString('tr-TR');
        return trend.isPercentage ? `${formatted}%` : formatted;
    };

    return (
        <Card
            className={cn(
                'transition-all duration-200 hover:shadow-lg',
                variantClasses[variant],
                sizeClasses[size],
                onClick && 'cursor-pointer hover:scale-[1.02]',
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* Title */}
                    <p className={cn(
                        'font-medium text-text-light-secondary dark:text-text-secondary mb-1',
                        titleSizes[size]
                    )}>
                        {title}
                    </p>

                    {/* Value */}
                    <div className="flex items-baseline gap-1 mb-1">
                        {loading ? (
                            <div className="animate-pulse">
                                <div className={cn('bg-gray-300 rounded h-6', 
                                    size === 'sm' ? 'w-12' : size === 'md' ? 'w-16' : 'w-20'
                                )} />
                            </div>
                        ) : (
                            <>
                                {prefix && (
                                    <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                        {prefix}
                                    </span>
                                )}
                                <span className={cn(
                                    'font-bold',
                                    valueSizes[size],
                                    colorClasses[color].value
                                )}>
                                    {formatValue(value)}
                                </span>
                                {suffix && (
                                    <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                        {suffix}
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {/* Trend */}
                    {trend && !loading && (
                        <div className="flex items-center gap-1">
                            {TrendIcon && (
                                <TrendIcon 
                                    size={12} 
                                    className={cn(
                                        trend.value > 0 ? 'text-semantic-success-600' : 
                                        trend.value < 0 ? 'text-primary-red' : 'text-text-light-secondary dark:text-text-secondary'
                                    )}
                                />
                            )}
                            <span className={cn(
                                'text-xs font-medium',
                                trend.value > 0 ? 'text-semantic-success-600' : 
                                trend.value < 0 ? 'text-primary-red' : 'text-text-light-secondary dark:text-text-secondary'
                            )}>
                                {trend.value > 0 ? '+' : ''}{formatTrendValue(trend.value)}
                            </span>
                        </div>
                    )}

                    {/* Subtitle */}
                    {subtitle && (
                        <p className={cn(
                            'text-text-light-muted dark:text-text-muted mt-1',
                            titleSizes[size]
                        )}>
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Icon */}
                {Icon && (
                    <div className={cn(
                        'flex items-center justify-center rounded-lg flex-shrink-0',
                        colorClasses[color].icon,
                        size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12'
                    )}>
                        <Icon size={iconSizes[size]} />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatsCard;