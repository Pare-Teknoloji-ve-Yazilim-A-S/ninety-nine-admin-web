'use client'
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
    id?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    closable?: boolean;
    onClose?: () => void;
    className?: string;
}

const Toast: React.FC<ToastProps> = ({
    id,
    type = 'info',
    title,
    message,
    duration = 5000,
    position = 'top-right',
    closable = true,
    onClose,
    className,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 200);
    };

    const typeConfig = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-600/20',
            borderColor: 'border-green-600/40',
            iconColor: 'text-green-400',
            titleColor: 'text-green-300',
        },
        error: {
            icon: AlertCircle,
            bgColor: 'bg-primary-red/20',
            borderColor: 'border-primary-red/40',
            iconColor: 'text-primary-red',
            titleColor: 'text-primary-red',
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-yellow-600/20',
            borderColor: 'border-yellow-600/40',
            iconColor: 'text-yellow-400',
            titleColor: 'text-yellow-300',
        },
        info: {
            icon: Info,
            bgColor: 'bg-primary-gold/20',
            borderColor: 'border-primary-gold/40',
            iconColor: 'text-primary-gold',
            titleColor: 'text-primary-gold',
        },
    };

    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };

    const animationClasses = {
        'top-right': isAnimating ? 'animate-slideOutRight' : 'animate-slideInRight',
        'top-left': isAnimating ? 'animate-slideOutLeft' : 'animate-slideInLeft',
        'bottom-right': isAnimating ? 'animate-slideOutRight' : 'animate-slideInRight',
        'bottom-left': isAnimating ? 'animate-slideOutLeft' : 'animate-slideInLeft',
        'top-center': isAnimating ? 'animate-slideOutUp' : 'animate-slideInDown',
        'bottom-center': isAnimating ? 'animate-slideOutDown' : 'animate-slideInUp',
    };

    const config = typeConfig[type];
    const IconComponent = config.icon;

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                'fixed z-50 min-w-80 max-w-md p-4 rounded-lg shadow-lg border backdrop-blur-sm',
                config.bgColor,
                config.borderColor,
                positionClasses[position],
                animationClasses[position],
                className
            )}
        >
            <div className="flex items-start gap-3">
                <IconComponent className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconColor)} />

                <div className="flex-1 min-w-0">
                    {title && (
                        <h4 className={cn('font-semibold text-sm mb-1', config.titleColor)}>
                            {title}
                        </h4>
                    )}
                    <p className="text-sm text-text-primary">
                        {message}
                    </p>
                </div>

                {closable && (
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 p-1 rounded-full hover:bg-background-secondary/50 transition-colors"
                    >
                        <X className="h-4 w-4 text-text-secondary" />
                    </button>
                )}
            </div>

            {/* Progress bar */}
            {duration > 0 && (
                <div className="mt-3 h-1 bg-background-secondary/30 rounded-full overflow-hidden">
                    <div
                        className={cn('h-full rounded-full', config.iconColor.replace('text-', 'bg-'))}
                        style={{
                            animation: `toast-progress ${duration}ms linear forwards`
                        }}
                    />
                </div>
            )}
        </div>
    );
};

// Toast Container component
interface ToastContainerProps {
    toasts: (ToastProps & { id: string })[];
    onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    return (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={() => onRemove(toast.id)}
                />
            ))}
        </>
    );
};

export default Toast; 