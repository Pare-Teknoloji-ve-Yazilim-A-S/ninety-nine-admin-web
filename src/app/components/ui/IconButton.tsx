import { forwardRef, ButtonHTMLAttributes } from 'react'
import { LucideIcon } from 'lucide-react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: LucideIcon
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    shape?: 'square' | 'circle'
    tooltip?: string
    isLoading?: boolean
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({
        icon: Icon,
        variant = 'secondary',
        size = 'md',
        shape = 'square',
        tooltip,
        isLoading = false,
        className = '',
        disabled,
        ...props
    }, ref) => {
        const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed relative'

        const sizeClasses = {
            sm: 'w-8 h-8 text-xs',
            md: 'w-10 h-10 text-sm',
            lg: 'w-12 h-12 text-base',
            xl: 'w-14 h-14 text-lg'
        }

        const shapeClasses = {
            square: 'rounded-lg',
            circle: 'rounded-full'
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

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${shapeClasses[shape]}
          ${variantClasses[variant]}
          ${className}
          group
        `}
                title={tooltip}
                {...props}
            >
                {isLoading ? (
                    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`} />
                ) : (
                    <Icon className={iconSizes[size]} />
                )}

                {/* Tooltip */}
                {tooltip && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-background-primary text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-primary-gold/20">
                        {tooltip}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background-primary"></div>
                    </div>
                )}
            </button>
        )
    }
)

IconButton.displayName = 'IconButton'

export default IconButton 