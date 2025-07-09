import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    color?: 'gold' | 'primary' | 'red' | 'secondary' | 'accent';
    showValue?: boolean;
    showPercentage?: boolean;
    label?: string;
    striped?: boolean;
    animated?: boolean;
    className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    size = 'md',
    color = 'gold',
    showValue = false,
    showPercentage = false,
    label,
    striped = false,
    animated = false,
    className,
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    };

    const colorClasses = {
        gold: 'bg-primary-gold',
        primary: 'bg-background-primary',
        red: 'bg-primary-red',
        secondary: 'bg-background-secondary',
        accent: 'bg-text-accent',
    };

    const stripedClasses = {
        gold: 'bg-gradient-to-r from-primary-gold to-primary-gold-light',
        primary: 'bg-gradient-to-r from-background-primary to-primary-dark-gray',
        red: 'bg-gradient-to-r from-primary-red to-red-400',
        secondary: 'bg-gradient-to-r from-background-secondary to-primary-dark-gray',
        accent: 'bg-gradient-to-r from-text-accent to-primary-gold-light',
    };

    return (
        <div className={cn('w-full', className)}>
            {/* Label */}
            {label && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text-primary">{label}</span>
                    {(showValue || showPercentage) && (
                        <span className="text-sm text-text-secondary">
                            {showValue && `${value}/${max}`}
                            {showValue && showPercentage && ' - '}
                            {showPercentage && `${percentage.toFixed(1)}%`}
                        </span>
                    )}
                </div>
            )}

            {/* Progress Bar */}
            <div
                className={cn(
                    'w-full bg-background-secondary/50 rounded-full overflow-hidden',
                    sizeClasses[size]
                )}
            >
                <div
                    className={cn(
                        'h-full transition-all duration-500 ease-out',
                        striped ? stripedClasses[color] : colorClasses[color],
                        striped && 'bg-stripes',
                        animated && 'animate-pulse'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Value/Percentage below bar */}
            {!label && (showValue || showPercentage) && (
                <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-text-secondary">
                        {showValue && `${value}/${max}`}
                        {showValue && showPercentage && ' - '}
                        {showPercentage && `${percentage.toFixed(1)}%`}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProgressBar; 