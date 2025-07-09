import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered' | 'elevated' | 'glass'
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    hover?: boolean
    clickable?: boolean
    disabled?: boolean
    header?: ReactNode
    footer?: ReactNode
    icon?: LucideIcon
    title?: string
    subtitle?: string
    headerAction?: ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({
        variant = 'default',
        padding = 'md',
        rounded = 'lg',
        shadow = 'md',
        hover = false,
        clickable = false,
        disabled = false,
        header,
        footer,
        icon: Icon,
        title,
        subtitle,
        headerAction,
        children,
        className = '',
        ...props
    }, ref) => {
        const baseClasses = 'transition-all duration-200 font-helvetica'

        const variantClasses = {
            default: 'bg-background-card border border-primary-gold/20',
            bordered: 'bg-background-card border-2 border-primary-gold/30',
            elevated: 'bg-background-card border border-primary-gold/20',
            glass: 'bg-background-card/80 backdrop-blur-sm border border-primary-gold/30'
        }

        const paddingClasses = {
            none: 'p-0',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
            xl: 'p-8'
        }

        const roundedClasses = {
            none: 'rounded-none',
            sm: 'rounded-sm',
            md: 'rounded-md',
            lg: 'rounded-lg',
            xl: 'rounded-xl',
            full: 'rounded-full'
        }

        const shadowClasses = {
            none: 'shadow-none',
            sm: 'shadow-sm',
            md: 'shadow-card',
            lg: 'shadow-lg',
            xl: 'shadow-xl'
        }

        const hoverClasses = hover ? 'hover:shadow-lg hover:border-primary-gold/40 hover:-translate-y-1' : ''
        const clickableClasses = clickable ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-gold/50 focus:ring-offset-2 focus:ring-offset-background-primary' : ''
        const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

        const renderHeader = () => {
            if (!header && !title && !Icon) return null

            return (
                <div className={`flex items-start justify-between ${padding !== 'none' ? 'pb-4 border-b border-primary-gold/20' : ''}`}>
                    <div className="flex items-center space-x-3">
                        {Icon && (
                            <div className="p-2 bg-primary-gold/20 rounded-lg">
                                <Icon className="w-5 h-5 text-primary-gold" />
                            </div>
                        )}
                        <div>
                            {title && (
                                <h3 className="text-lg font-semibold text-text-primary font-helvetica">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-text-secondary font-inter">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {headerAction && (
                        <div className="flex-shrink-0">
                            {headerAction}
                        </div>
                    )}
                </div>
            )
        }

        const renderFooter = () => {
            if (!footer) return null

            return (
                <div className={`pt-4 border-t border-primary-gold/20 ${padding !== 'none' ? 'mt-4' : ''}`}>
                    {footer}
                </div>
            )
        }

        const cardContent = (
            <>
                {header && <div className={padding !== 'none' ? 'mb-4' : ''}>{header}</div>}
                {renderHeader()}
                {children && (
                    <div className={`${(header || title || Icon) && padding !== 'none' ? 'pt-4' : ''}`}>
                        {children}
                    </div>
                )}
                {renderFooter()}
            </>
        )

        return (
            <div
                ref={ref}
                className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${paddingClasses[padding]}
          ${roundedClasses[rounded]}
          ${shadowClasses[shadow]}
          ${hoverClasses}
          ${clickableClasses}
          ${disabledClasses}
          ${className}
        `}
                {...props}
            >
                {cardContent}
            </div>
        )
    }
)

Card.displayName = 'Card'

export default Card

// Alt component'ler
export const CardHeader = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`pb-4 border-b border-primary-gold/20 ${className}`} {...props}>
        {children}
    </div>
)

export const CardBody = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`py-4 ${className}`} {...props}>
        {children}
    </div>
)

export const CardFooter = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`pt-4 border-t border-primary-gold/20 ${className}`} {...props}>
        {children}
    </div>
)

export const CardTitle = ({ children, className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={`text-lg font-semibold text-text-primary font-helvetica ${className}`} {...props}>
        {children}
    </h3>
)

export const CardSubtitle = ({ children, className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`text-sm text-text-secondary font-inter ${className}`} {...props}>
        {children}
    </p>
) 