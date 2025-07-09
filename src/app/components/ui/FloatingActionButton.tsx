import { forwardRef, ButtonHTMLAttributes } from 'react'
import { LucideIcon, Plus } from 'lucide-react'

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: LucideIcon
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center' | 'top-center'
    offset?: 'sm' | 'md' | 'lg' | 'xl'
    tooltip?: string
    isLoading?: boolean
    badge?: string | number
    extended?: boolean // Extended FAB with text
    label?: string
}

const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
    ({
        icon: Icon = Plus,
        variant = 'primary',
        size = 'md',
        position = 'bottom-right',
        offset = 'md',
        tooltip,
        isLoading = false,
        badge,
        extended = false,
        label,
        className = '',
        disabled,
        children,
        ...props
    }, ref) => {
        const baseClasses = 'fixed inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed font-helvetica shadow-lg hover:shadow-xl z-50 group'

        const sizeClasses = {
            sm: extended ? 'h-10 px-4 text-xs gap-2' : 'w-10 h-10 text-xs',
            md: extended ? 'h-12 px-6 text-sm gap-2' : 'w-12 h-12 text-sm',
            lg: extended ? 'h-14 px-8 text-base gap-3' : 'w-14 h-14 text-base',
            xl: extended ? 'h-16 px-10 text-lg gap-3' : 'w-16 h-16 text-lg'
        }

        const shapeClasses = extended ? 'rounded-full' : 'rounded-full'

        const positionClasses = {
            'bottom-right': 'bottom-6 right-6',
            'bottom-left': 'bottom-6 left-6',
            'top-right': 'top-6 right-6',
            'top-left': 'top-6 left-6',
            'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
            'top-center': 'top-6 left-1/2 transform -translate-x-1/2'
        }

        const offsetClasses = {
            sm: position.includes('bottom') ? 'bottom-4' : position.includes('top') ? 'top-4' : '',
            md: position.includes('bottom') ? 'bottom-6' : position.includes('top') ? 'top-6' : '',
            lg: position.includes('bottom') ? 'bottom-8' : position.includes('top') ? 'top-8' : '',
            xl: position.includes('bottom') ? 'bottom-12' : position.includes('top') ? 'top-12' : ''
        }

        const variantClasses = {
            primary: 'bg-gradient-gold text-primary-dark-gray hover:opacity-90 focus:ring-primary-gold/50',
            secondary: 'bg-background-card border border-primary-gold/30 text-text-primary hover:bg-background-secondary hover:border-primary-gold/50 focus:ring-primary-gold/50',
            danger: 'bg-primary-red text-text-primary hover:bg-primary-red/90 focus:ring-primary-red/50'
        }

        const iconSizes = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-6 h-6',
            xl: 'w-7 h-7'
        }

        const customPositionClass = positionClasses[position].replace(
            position.includes('bottom') ? /bottom-\d+/ : /top-\d+/,
            offsetClasses[offset]
        )

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${shapeClasses}
          ${variantClasses[variant]}
          ${customPositionClass}
          ${className}
        `}
                title={tooltip}
                {...props}
            >
                {/* Badge */}
                {badge && (
                    <div className="absolute -top-2 -right-2 bg-primary-red text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-md">
                        {badge}
                    </div>
                )}

                {/* Content */}
                {isLoading ? (
                    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`} />
                ) : (
                    <>
                        <Icon className={iconSizes[size]} />
                        {extended && (label || children) && (
                            <span className="whitespace-nowrap">
                                {label || children}
                            </span>
                        )}
                    </>
                )}

                {/* Tooltip */}
                {tooltip && !extended && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-background-primary text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-primary-gold/20">
                        {tooltip}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background-primary"></div>
                    </div>
                )}
            </button>
        )
    }
)

FloatingActionButton.displayName = 'FloatingActionButton'

export default FloatingActionButton 