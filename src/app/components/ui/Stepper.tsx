import React from 'react';
import { Check, Circle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperStep {
    id: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    status?: 'pending' | 'active' | 'completed' | 'error';
    optional?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

interface StepperProps {
    steps: StepperStep[];
    currentStep?: number;
    orientation?: 'horizontal' | 'vertical';
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'minimal' | 'numbered' | 'icon';
    showConnector?: boolean;
    clickable?: boolean;
    className?: string;
}

const Stepper: React.FC<StepperProps> = ({
    steps,
    currentStep = 0,
    orientation = 'horizontal',
    size = 'md',
    variant = 'default',
    showConnector = true,
    clickable = false,
    className,
}) => {
    const containerClasses = cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
    );

    return (
        <div className={containerClasses}>
            {steps.map((step, index) => {
                const stepStatus = step.status || (
                    index < currentStep ? 'completed' :
                        index === currentStep ? 'active' : 'pending'
                );

                return (
                    <React.Fragment key={step.id}>
                        <StepperItem
                            step={step}
                            index={index}
                            status={stepStatus}
                            orientation={orientation}
                            size={size}
                            variant={variant}
                            clickable={clickable}
                            isLast={index === steps.length - 1}
                        />

                        {showConnector && index < steps.length - 1 && (
                            <StepConnector
                                orientation={orientation}
                                size={size}
                                completed={stepStatus === 'completed'}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// Individual Step Item Component
const StepperItem: React.FC<{
    step: StepperStep;
    index: number;
    status: 'pending' | 'active' | 'completed' | 'error';
    orientation: 'horizontal' | 'vertical';
    size: 'sm' | 'md' | 'lg';
    variant: 'default' | 'minimal' | 'numbered' | 'icon';
    clickable: boolean;
    isLast: boolean;
}> = ({ step, index, status, orientation, size, variant, clickable, isLast }) => {
    const handleClick = () => {
        if (clickable && !step.disabled && step.onClick) {
            step.onClick();
        }
    };

    const sizeClasses = {
        sm: {
            circle: 'w-6 h-6',
            text: 'text-sm',
            icon: 'w-3 h-3',
        },
        md: {
            circle: 'w-8 h-8',
            text: 'text-base',
            icon: 'w-4 h-4',
        },
        lg: {
            circle: 'w-10 h-10',
            text: 'text-lg',
            icon: 'w-5 h-5',
        },
    };

    const containerClasses = cn(
        'flex items-center',
        orientation === 'vertical' && 'flex-col',
        clickable && !step.disabled && 'cursor-pointer',
        step.disabled && 'opacity-50 cursor-not-allowed',
    );

    const circleClasses = cn(
        'rounded-full flex items-center justify-center font-medium border-2 transition-all',
        sizeClasses[size].circle,
        status === 'pending' && 'border-primary-dark-gray bg-background-secondary text-text-secondary',
        status === 'active' && 'border-primary-gold bg-primary-gold text-background-primary',
        status === 'completed' && 'border-primary-gold bg-primary-gold text-background-primary',
        status === 'error' && 'border-primary-red bg-primary-red text-white',
    );

    const textClasses = cn(
        'transition-colors',
        sizeClasses[size].text,
        orientation === 'horizontal' ? 'ml-2' : 'mt-2 text-center',
        status === 'pending' && 'text-text-secondary',
        status === 'active' && 'text-text-primary font-medium',
        status === 'completed' && 'text-text-primary',
        status === 'error' && 'text-primary-red',
    );

    const renderStepIcon = () => {
        if (variant === 'icon' && step.icon) {
            return <span className={sizeClasses[size].icon}>{step.icon}</span>;
        }

        if (variant === 'numbered') {
            return <span className="text-xs font-bold">{index + 1}</span>;
        }

        switch (status) {
            case 'completed':
                return <Check className={sizeClasses[size].icon} />;
            case 'error':
                return <X className={sizeClasses[size].icon} />;
            case 'active':
                return variant === 'minimal' ?
                    <Circle className={cn(sizeClasses[size].icon, 'fill-current')} /> :
                    <span className="text-xs font-bold">{index + 1}</span>;
            default:
                return variant === 'minimal' ?
                    <Circle className={sizeClasses[size].icon} /> :
                    <span className="text-xs font-bold">{index + 1}</span>;
        }
    };

    return (
        <div
            className={containerClasses}
            onClick={handleClick}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable && !step.disabled ? 0 : undefined}
        >
            <div className={circleClasses}>
                {renderStepIcon()}
            </div>

            <div className={textClasses}>
                <div className="font-medium">{step.title}</div>
                {step.description && (
                    <div className="text-sm text-text-secondary mt-1">
                        {step.description}
                    </div>
                )}
                {step.optional && (
                    <div className="text-xs text-text-secondary mt-1">
                        (İsteğe bağlı)
                    </div>
                )}
            </div>
        </div>
    );
};

// Step Connector Component
const StepConnector: React.FC<{
    orientation: 'horizontal' | 'vertical';
    size: 'sm' | 'md' | 'lg';
    completed: boolean;
}> = ({ orientation, size, completed }) => {
    const sizeClasses = {
        sm: orientation === 'horizontal' ? 'h-0.5 w-8' : 'w-0.5 h-8',
        md: orientation === 'horizontal' ? 'h-0.5 w-12' : 'w-0.5 h-12',
        lg: orientation === 'horizontal' ? 'h-0.5 w-16' : 'w-0.5 h-16',
    };

    return (
        <div
            className={cn(
                'transition-colors',
                sizeClasses[size],
                completed ? 'bg-primary-gold' : 'bg-primary-dark-gray',
                orientation === 'horizontal' ? 'mx-2' : 'my-2 mx-auto',
            )}
        />
    );
};

// Predefined Stepper Patterns
export const StepperPatterns = {
    // Simple 3-step process
    Simple: (currentStep: number, props?: Partial<StepperProps>) => (
        <Stepper
            steps={[
                {
                    id: 'step1',
                    title: 'Başlangıç',
                    description: 'İlk adım',
                },
                {
                    id: 'step2',
                    title: 'İşlem',
                    description: 'Ana işlem',
                },
                {
                    id: 'step3',
                    title: 'Tamamlandı',
                    description: 'Son adım',
                },
            ]}
            currentStep={currentStep}
            {...props}
        />
    ),

    // Registration process
    Registration: (currentStep: number, props?: Partial<StepperProps>) => (
        <Stepper
            steps={[
                {
                    id: 'info',
                    title: 'Kişisel Bilgiler',
                    description: 'Ad, soyad ve iletişim bilgileri',
                },
                {
                    id: 'account',
                    title: 'Hesap Bilgileri',
                    description: 'Kullanıcı adı ve şifre',
                },
                {
                    id: 'verification',
                    title: 'Doğrulama',
                    description: 'E-posta doğrulama',
                },
                {
                    id: 'complete',
                    title: 'Tamamlandı',
                    description: 'Kayıt başarılı',
                },
            ]}
            currentStep={currentStep}
            {...props}
        />
    ),

    // Order process
    Order: (currentStep: number, props?: Partial<StepperProps>) => (
        <Stepper
            steps={[
                {
                    id: 'cart',
                    title: 'Sepet',
                    description: 'Ürün seçimi',
                },
                {
                    id: 'shipping',
                    title: 'Teslimat',
                    description: 'Adres bilgileri',
                },
                {
                    id: 'payment',
                    title: 'Ödeme',
                    description: 'Ödeme yöntemi',
                },
                {
                    id: 'confirmation',
                    title: 'Onay',
                    description: 'Sipariş onayı',
                },
            ]}
            currentStep={currentStep}
            {...props}
        />
    ),

    // Vertical minimal stepper
    Minimal: (currentStep: number, props?: Partial<StepperProps>) => (
        <Stepper
            steps={[
                {
                    id: 'step1',
                    title: 'Adım 1',
                },
                {
                    id: 'step2',
                    title: 'Adım 2',
                },
                {
                    id: 'step3',
                    title: 'Adım 3',
                },
            ]}
            currentStep={currentStep}
            variant="minimal"
            orientation="vertical"
            {...props}
        />
    ),
};

export default Stepper; 