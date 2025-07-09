import { forwardRef, ButtonHTMLAttributes } from 'react'
import { LucideIcon, Loader2 } from 'lucide-react'

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    icon?: LucideIcon
    iconPosition?: 'left' | 'right'
    isLoading?: boolean
    loadingText?: string
    loadingIcon?: LucideIcon
    progress?: number // 0-100 arası değer
    fullWidth?: boolean
    keepOriginalContent?: boolean // Loading sırasında orijinal içeriği göster
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        icon: Icon,
        iconPosition = 'left',
        isLoading = false,
        loadingText = 'Yükleniyor...',
        loadingIcon: LoadingIcon = Loader2,
        progress,
        fullWidth = false,
        keepOriginalContent = false,
        children,
        className = '',
        disabled,
        ...props
    }, ref) => {
        const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed font-helvetica relative overflow-hidden'

        const sizeClasses = {
            sm: 'px-3 py-1.5 text-xs gap-1.5',
            md: 'px-4 py-2 text-sm gap-2',
            lg: 'px-6 py-3 text-base gap-2',
            xl: 'px-8 py-4 text-lg gap-3'
        }

        const variantClasses = {
            primary: 'bg-gradient-gold text-primary-dark-gray hover:opacity-90 focus:ring-primary-gold/50 shadow-md hover:shadow-lg',
            secondary: 'bg-background-card border border-primary-gold/30 text-text-primary hover:bg-background-secondary hover:border-primary-gold/50 focus:ring-primary-gold/50',
            danger: 'bg-primary-red text-text-primary hover:bg-primary-red/90 focus:ring-primary-red/50 shadow-md hover:shadow-lg',
            ghost: 'text-text-accent hover:bg-primary-gold/10 hover:text-primary-gold focus:ring-primary-gold/50'
        }

        const iconSizes = {
            sm: 'w-3 h-3',
            md: 'w-4 h-4',
            lg: 'w-5 h-5',
            xl: 'w-6 h-6'
        }

        const widthClass = fullWidth ? 'w-full' : ''

        const renderContent = () => {
            if (isLoading && !keepOriginalContent) {
                return (
                    <>
                        <LoadingIcon className={`animate-spin ${iconSizes[size]}`} />
                        <span>{loadingText}</span>
                    </>
                )
            }

            if (isLoading && keepOriginalContent) {
                return (
                    <>
                        <LoadingIcon className={`animate-spin ${iconSizes[size]}`} />
                        {Icon && iconPosition === 'left' && !isLoading && (
                            <Icon className={iconSizes[size]} />
                        )}
                        {children}
                        {Icon && iconPosition === 'right' && !isLoading && (
                            <Icon className={iconSizes[size]} />
                        )}
                    </>
                )
            }

            return (
                <>
                    {Icon && iconPosition === 'left' && (
                        <Icon className={iconSizes[size]} />
                    )}
                    {children}
                    {Icon && iconPosition === 'right' && (
                        <Icon className={iconSizes[size]} />
                    )}
                </>
            )
        }

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${widthClass}
          ${className}
        `}
                {...props}
            >
                {/* Progress Bar */}
                {progress !== undefined && isLoading && (
                    <div className="absolute inset-0 bg-primary-gold/20 rounded-lg overflow-hidden">
                        <div
                            className="h-full bg-primary-gold/40 transition-all duration-300 ease-out"
                            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                        />
                    </div>
                )}

                {/* Content */}
                <div className={`relative z-10 flex items-center ${sizeClasses[size].split(' ')[2]}`}>
                    {renderContent()}
                </div>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-current opacity-10 rounded-lg" />
                )}
            </button>
        )
    }
)

LoadingButton.displayName = 'LoadingButton'

export default LoadingButton 