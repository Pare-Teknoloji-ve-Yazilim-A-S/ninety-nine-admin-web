import { forwardRef, ButtonHTMLAttributes } from 'react'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    icon?: LucideIcon
    iconPosition?: 'left' | 'right'
    isLoading?: boolean
    fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'primary',
        size = 'md',
        icon: Icon,
        iconPosition = 'left',
        isLoading = false,
        fullWidth = false,
        children,
        className = '',
        disabled,
        ...props
    }, ref) => {
        const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed font-helvetica'

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
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-6 h-6',
            xl: 'w-7 h-7'
        }

        const widthClass = fullWidth ? 'w-full' : ''

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
                {isLoading ? (
                    <>
                        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`} />
                        {children && <span>Yükleniyor...</span>}
                    </>
                ) : (
                    <>
                        {Icon && iconPosition === 'left' && (
                            <Icon className={iconSizes[size]} />
                        )}
                        {children}
                        {Icon && iconPosition === 'right' && (
                            <Icon className={iconSizes[size]} />
                        )}
                    </>
                )}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button 