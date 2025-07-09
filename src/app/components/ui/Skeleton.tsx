import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    lines?: number;
    className?: string;
    animated?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    lines = 1,
    className,
    animated = true,
}) => {
    const baseClasses = cn(
        'bg-gradient-to-r from-background-secondary/50 to-background-secondary/30 border border-primary-dark-gray/10',
        animated && 'animate-pulse',
        className
    );

    const getVariantClasses = () => {
        switch (variant) {
            case 'text':
                return 'rounded h-4';
            case 'circular':
                return 'rounded-full';
            case 'rectangular':
                return 'rounded-none';
            case 'rounded':
                return 'rounded-lg';
            default:
                return 'rounded h-4';
        }
    };

    const getStyles = () => {
        const styles: React.CSSProperties = {};

        if (width) {
            styles.width = typeof width === 'number' ? `${width}px` : width;
        }

        if (height) {
            styles.height = typeof height === 'number' ? `${height}px` : height;
        }

        return styles;
    };

    // For text variant with multiple lines
    if (variant === 'text' && lines > 1) {
        return (
            <div className={cn('space-y-2', className)}>
                {Array.from({ length: lines }, (_, index) => (
                    <div
                        key={index}
                        className={cn(
                            baseClasses,
                            getVariantClasses(),
                            // Last line is typically shorter
                            index === lines - 1 && 'w-3/4'
                        )}
                        style={getStyles()}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={cn(baseClasses, getVariantClasses())}
            style={getStyles()}
        />
    );
};

// Predefined skeleton patterns
interface SkeletonPatternProps {
    className?: string;
    animated?: boolean;
}

export const SkeletonAvatar: React.FC<SkeletonPatternProps> = ({ className, animated = true }) => (
    <Skeleton
        variant="circular"
        width={40}
        height={40}
        animated={animated}
        className={className}
    />
);

export const SkeletonCard: React.FC<SkeletonPatternProps> = ({ className, animated = true }) => (
    <div className={cn('p-4 space-y-3', className)}>
        <Skeleton
            variant="rectangular"
            height={200}
            animated={animated}
            className="w-full"
        />
        <div className="space-y-2">
            <Skeleton
                variant="text"
                height={16}
                animated={animated}
                className="w-3/4"
            />
            <Skeleton
                variant="text"
                height={16}
                animated={animated}
                className="w-1/2"
            />
        </div>
    </div>
);

export const SkeletonList: React.FC<SkeletonPatternProps & { items?: number }> = ({
    className,
    animated = true,
    items = 3
}) => (
    <div className={cn('space-y-4', className)}>
        {Array.from({ length: items }, (_, index) => (
            <div key={index} className="flex items-center space-x-4">
                <SkeletonAvatar animated={animated} />
                <div className="flex-1 space-y-2">
                    <Skeleton
                        variant="text"
                        height={16}
                        animated={animated}
                        className="w-1/3"
                    />
                    <Skeleton
                        variant="text"
                        height={14}
                        animated={animated}
                        className="w-2/3"
                    />
                </div>
            </div>
        ))}
    </div>
);

export const SkeletonTable: React.FC<SkeletonPatternProps & { rows?: number; columns?: number }> = ({
    className,
    animated = true,
    rows = 5,
    columns = 4
}) => (
    <div className={cn('space-y-3', className)}>
        {/* Header */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }, (_, index) => (
                <Skeleton
                    key={index}
                    variant="text"
                    height={16}
                    animated={animated}
                    className="w-20"
                />
            ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }, (_, colIndex) => (
                    <Skeleton
                        key={colIndex}
                        variant="text"
                        height={14}
                        animated={animated}
                        className="w-full"
                    />
                ))}
            </div>
        ))}
    </div>
);

export const SkeletonText: React.FC<SkeletonPatternProps & { lines?: number }> = ({
    className,
    animated = true,
    lines = 3
}) => (
    <Skeleton
        variant="text"
        lines={lines}
        animated={animated}
        className={className}
    />
);

export default Skeleton; 