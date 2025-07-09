import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'gold' | 'red' | 'white' | 'secondary';
    variant?: 'default' | 'dots' | 'bars' | 'pulse' | 'ring';
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    color = 'primary',
    variant = 'default',
    className,
}) => {
    const sizeClasses = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
    };

    const colorClasses = {
        primary: 'border-background-primary',
        gold: 'border-primary-gold',
        red: 'border-primary-red',
        white: 'border-white',
        secondary: 'border-text-secondary',
    };

    const dotSizes = {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
        xl: 'w-6 h-6',
    };

    const barSizes = {
        xs: 'w-0.5 h-3',
        sm: 'w-1 h-4',
        md: 'w-1 h-6',
        lg: 'w-1.5 h-8',
        xl: 'w-2 h-12',
    };

    if (variant === 'dots') {
        return (
            <div className={cn('flex items-center space-x-1', className)}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            'rounded-full animate-bounce',
                            dotSizes[size],
                            colorClasses[color].replace('border-', 'bg-')
                        )}
                        style={{
                            animationDelay: `${i * 0.1}s`,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'bars') {
        return (
            <div className={cn('flex items-center space-x-1', className)}>
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            'rounded-sm animate-pulse',
                            barSizes[size],
                            colorClasses[color].replace('border-', 'bg-')
                        )}
                        style={{
                            animationDelay: `${i * 0.15}s`,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'pulse') {
        return (
            <div
                className={cn(
                    'rounded-full animate-ping',
                    sizeClasses[size],
                    colorClasses[color].replace('border-', 'bg-'),
                    className
                )}
            />
        );
    }

    if (variant === 'ring') {
        return (
            <div
                className={cn(
                    'rounded-full border-2 border-solid animate-spin',
                    sizeClasses[size],
                    colorClasses[color],
                    'border-t-transparent',
                    className
                )}
            />
        );
    }

    // Default variant
    return (
        <div
            className={cn(
                'rounded-full border-2 border-solid animate-spin',
                sizeClasses[size],
                colorClasses[color],
                'border-t-transparent border-r-transparent',
                className
            )}
        />
    );
};

// Predefined spinner patterns
interface SpinnerPatternProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'gold' | 'red' | 'white' | 'secondary';
    className?: string;
}

export const SpinnerOverlay: React.FC<SpinnerPatternProps & { children?: React.ReactNode }> = ({
    size = 'lg',
    color = 'gold',
    className,
    children,
}) => (
    <div className={cn('relative', className)}>
        {children}
        <div className="absolute inset-0 flex items-center justify-center bg-background-primary/80 backdrop-blur-sm">
            <Spinner size={size} color={color} />
        </div>
    </div>
);

export const SpinnerButton: React.FC<SpinnerPatternProps & { text?: string }> = ({
    size = 'sm',
    color = 'white',
    text = 'Yükleniyor...',
    className,
}) => (
    <div className={cn('flex items-center space-x-2', className)}>
        <Spinner size={size} color={color} />
        <span className="text-sm text-text-primary">{text}</span>
    </div>
);

export const SpinnerCard: React.FC<SpinnerPatternProps & {
    title?: string;
    description?: string;
}> = ({
    size = 'lg',
    color = 'gold',
    title = 'Yükleniyor...',
    description = 'Lütfen bekleyiniz',
    className,
}) => (
        <div className={cn('flex flex-col items-center text-center p-8 space-y-4', className)}>
            <Spinner size={size} color={color} />
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                <p className="text-sm text-text-secondary">{description}</p>
            </div>
        </div>
    );

export const SpinnerInline: React.FC<SpinnerPatternProps & { text?: string }> = ({
    size = 'xs',
    color = 'gold',
    text,
    className,
}) => (
    <div className={cn('inline-flex items-center space-x-2', className)}>
        <Spinner size={size} color={color} />
        {text && <span className="text-sm text-text-secondary">{text}</span>}
    </div>
);

export default Spinner; 