'use client'
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    size?: 'sm' | 'md' | 'lg';
    delay?: number;
    disabled?: boolean;
    className?: string;
    contentClassName?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    size = 'md',
    delay = 300,
    disabled = false,
    className,
    contentClassName,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
    };

    const arrowClasses = {
        top: 'bottom-[-4px] left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-background-secondary',
        bottom: 'top-[-4px] left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-background-secondary',
        left: 'right-[-4px] top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-background-secondary',
        right: 'left-[-4px] top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-background-secondary',
    };

    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    };

    const handleMouseEnter = () => {
        if (disabled) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            setTimeout(() => setShowTooltip(true), 10);
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setShowTooltip(false);
        setTimeout(() => setIsVisible(false), 150);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!content || disabled) {
        return <>{children}</>;
    }

    return (
        <div
            className={cn('relative inline-block', className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={cn(
                        'absolute z-50 whitespace-nowrap rounded-lg bg-background-secondary border border-primary-dark-gray/20 text-text-primary shadow-lg transition-all duration-150',
                        positionClasses[position],
                        sizeClasses[size],
                        showTooltip ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
                        contentClassName
                    )}
                >
                    {content}

                    {/* Arrow */}
                    <div
                        className={cn(
                            'absolute w-0 h-0',
                            arrowClasses[position]
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip; 