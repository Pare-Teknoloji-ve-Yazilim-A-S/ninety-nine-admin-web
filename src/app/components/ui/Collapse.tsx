'use client'

import { forwardRef, HTMLAttributes, ReactNode, useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react'

interface CollapseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'> {
    isOpen?: boolean
    defaultOpen?: boolean
    onToggle?: (isOpen: boolean) => void
    trigger?: ReactNode
    title?: string
    subtitle?: string
    icon?: LucideIcon
    variant?: 'default' | 'bordered' | 'filled' | 'minimal'
    size?: 'sm' | 'md' | 'lg'
    direction?: 'down' | 'up' | 'left' | 'right'
    animated?: boolean
    disabled?: boolean
    collapsible?: boolean
    showIcon?: boolean
    iconPosition?: 'left' | 'right'
    headerAction?: ReactNode
    ghost?: boolean
}

const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
    ({
        isOpen: controlledOpen,
        defaultOpen = false,
        onToggle,
        trigger,
        title,
        subtitle,
        icon: Icon,
        variant = 'default',
        size = 'md',
        direction = 'down',
        animated = true,
        disabled = false,
        collapsible = true,
        showIcon = true,
        iconPosition = 'right',
        headerAction,
        ghost = false,
        children,
        className = '',
        ...props
    }, ref) => {
        const [internalOpen, setInternalOpen] = useState(defaultOpen)
        const contentRef = useRef<HTMLDivElement>(null)

        const isControlled = controlledOpen !== undefined
        const isOpen = isControlled ? controlledOpen : internalOpen

        useEffect(() => {
            if (!isControlled && defaultOpen !== undefined) {
                setInternalOpen(defaultOpen)
            }
        }, [defaultOpen, isControlled])

        const handleToggle = () => {
            if (disabled || !collapsible) return

            const newOpen = !isOpen
            if (!isControlled) {
                setInternalOpen(newOpen)
            }
            onToggle?.(newOpen)
        }

        const getChevronIcon = () => {
            switch (direction) {
                case 'up':
                    return isOpen ? ChevronDown : ChevronUp
                case 'left':
                    return isOpen ? ChevronRight : ChevronLeft
                case 'right':
                    return isOpen ? ChevronLeft : ChevronRight
                default:
                    return isOpen ? ChevronUp : ChevronDown
            }
        }

        const ChevronIcon = getChevronIcon()

        const sizeClasses = {
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg'
        }

        const paddingClasses = {
            sm: 'px-3 py-2',
            md: 'px-4 py-3',
            lg: 'px-6 py-4'
        }

        const variantClasses = {
            default: {
                container: 'border border-primary-gold/20 rounded-lg overflow-hidden',
                trigger: 'bg-background-card hover:bg-background-secondary',
                content: 'bg-background-card border-t border-primary-gold/20'
            },
            bordered: {
                container: 'border border-primary-gold/20 rounded-lg overflow-hidden',
                trigger: 'bg-background-card hover:bg-background-secondary',
                content: 'bg-background-card border-t border-primary-gold/20'
            },
            filled: {
                container: 'bg-background-card rounded-lg overflow-hidden',
                trigger: 'bg-background-secondary hover:bg-primary-gold/10',
                content: 'bg-background-card border-t border-primary-gold/20'
            },
            minimal: {
                container: 'border-b border-primary-gold/10',
                trigger: 'hover:bg-primary-gold/5',
                content: 'bg-transparent'
            }
        }

        const renderTrigger = () => {
            if (trigger) {
                return (
                    <div
                        onClick={handleToggle}
                        className={`
              ${collapsible ? 'cursor-pointer' : 'cursor-default'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        {trigger}
                    </div>
                )
            }

            if (title || Icon) {
                return (
                    <button
                        onClick={handleToggle}
                        disabled={disabled || !collapsible}
                        className={`
              w-full text-left transition-all duration-200 font-helvetica
              ${paddingClasses[size]}
              ${ghost ? 'bg-transparent hover:bg-primary-gold/5' : variantClasses[variant].trigger}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-primary-gold/50 focus:ring-inset
              flex items-center justify-between
            `}
                        aria-expanded={isOpen}
                        aria-controls={`collapse-content-${Math.random().toString(36).substr(2, 9)}`}
                    >
                        <div className="flex items-center space-x-3 flex-1">
                            {Icon && iconPosition === 'left' && (
                                <div className="p-1.5 bg-primary-gold/20 rounded-md flex-shrink-0">
                                    <Icon className={`text-primary-gold ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
                                        }`} />
                                </div>
                            )}
                            <div className="flex-1">
                                <span className={`font-semibold text-text-primary ${sizeClasses[size]}`}>
                                    {title}
                                </span>
                                {subtitle && (
                                    <p className="text-sm text-text-secondary mt-1 font-inter">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                            {Icon && iconPosition === 'right' && (
                                <div className="p-1.5 bg-primary-gold/20 rounded-md flex-shrink-0">
                                    <Icon className={`text-primary-gold ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
                                        }`} />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            {headerAction && (
                                <div className="flex-shrink-0">
                                    {headerAction}
                                </div>
                            )}
                            {showIcon && collapsible && (
                                <ChevronIcon
                                    className={`w-5 h-5 text-text-secondary transition-transform duration-200 flex-shrink-0 ${direction === 'left' || direction === 'right' ? '' : 'rotate-0'
                                        }`}
                                />
                            )}
                        </div>
                    </button>
                )
            }

            return null
        }

        return (
            <div
                ref={ref}
                className={`${ghost ? '' : variantClasses[variant].container} ${className}`}
                {...props}
            >
                {renderTrigger()}

                {/* Content */}
                <div
                    className={`
            ${ghost ? 'bg-transparent' : variantClasses[variant].content}
            overflow-hidden transition-all duration-200 ease-in-out
            ${animated ? (isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0') : (isOpen ? 'block' : 'hidden')}
          `}
                    aria-hidden={!isOpen}
                >
                    {(isOpen || !animated) && (
                        <div className={`${ghost ? 'py-2' : paddingClasses[size]} ${isOpen ? 'block' : 'hidden'}`}>
                            {children}
                        </div>
                    )}
                </div>
            </div>
        )
    }
)

Collapse.displayName = 'Collapse'

export default Collapse

// Alt component'ler
export const CollapseTrigger = ({
    children,
    className = '',
    isOpen = false,
    disabled = false,
    ...props
}: HTMLAttributes<HTMLButtonElement> & { isOpen?: boolean; disabled?: boolean }) => (
    <button
        className={`
      w-full text-left px-4 py-3 transition-all duration-200 font-helvetica
      bg-background-card hover:bg-background-secondary
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      focus:outline-none focus:ring-2 focus:ring-primary-gold/50 focus:ring-inset
      flex items-center justify-between
      ${className}
    `}
        disabled={disabled}
        aria-expanded={isOpen}
        {...props}
    >
        <span className="font-semibold text-text-primary">{children}</span>
        <ChevronDown
            className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                }`}
        />
    </button>
)

export const CollapseContent = ({
    children,
    className = '',
    isOpen = false,
    ...props
}: HTMLAttributes<HTMLDivElement> & { isOpen?: boolean }) => (
    <div
        className={`
      bg-background-card overflow-hidden transition-all duration-200 ease-in-out border-t border-primary-gold/20
      ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      ${className}
    `}
        {...props}
    >
        {isOpen && (
            <div className="px-4 py-3">
                {children}
            </div>
        )}
    </div>
) 