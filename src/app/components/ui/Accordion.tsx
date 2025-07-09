'use client'

import { forwardRef, HTMLAttributes, ReactNode, useState, useEffect } from 'react'
import { ChevronDown, LucideIcon } from 'lucide-react'

interface AccordionItem {
    id: string
    title: string
    content: ReactNode
    icon?: LucideIcon
    disabled?: boolean
    badge?: string | number
    subtitle?: string
}

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
    items: AccordionItem[]
    defaultValue?: string | string[]
    value?: string | string[]
    onValueChange?: (value: string | string[]) => void
    type?: 'single' | 'multiple'
    variant?: 'default' | 'bordered' | 'filled' | 'minimal'
    size?: 'sm' | 'md' | 'lg'
    collapsible?: boolean // For single type - allow closing all
    animated?: boolean
    keepMounted?: boolean
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
    ({
        items,
        defaultValue,
        value,
        onValueChange,
        type = 'single',
        variant = 'default',
        size = 'md',
        collapsible = true,
        animated = true,
        keepMounted = false,
        className = '',
        ...props
    }, ref) => {
        const [openItems, setOpenItems] = useState<string[]>(() => {
            if (value) {
                return Array.isArray(value) ? value : [value]
            }
            if (defaultValue) {
                return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
            }
            return []
        })

        useEffect(() => {
            if (value !== undefined) {
                setOpenItems(Array.isArray(value) ? value : [value])
            }
        }, [value])

        const handleItemToggle = (itemId: string) => {
            const item = items.find(item => item.id === itemId)
            if (item && item.disabled) return

            let newOpenItems: string[]

            if (type === 'single') {
                if (openItems.includes(itemId)) {
                    newOpenItems = collapsible ? [] : [itemId]
                } else {
                    newOpenItems = [itemId]
                }
            } else {
                if (openItems.includes(itemId)) {
                    newOpenItems = openItems.filter(id => id !== itemId)
                } else {
                    newOpenItems = [...openItems, itemId]
                }
            }

            setOpenItems(newOpenItems)
            onValueChange?.(type === 'single' ? newOpenItems[0] || '' : newOpenItems)
        }

        const sizeClasses = {
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg'
        }

        const variantClasses = {
            default: {
                container: 'border border-primary-gold/20 rounded-lg overflow-hidden',
                item: 'border-b border-primary-gold/20 last:border-b-0',
                trigger: 'bg-background-card hover:bg-background-secondary',
                content: 'bg-background-card'
            },
            bordered: {
                container: 'space-y-2',
                item: 'border border-primary-gold/20 rounded-lg overflow-hidden',
                trigger: 'bg-background-card hover:bg-background-secondary',
                content: 'bg-background-card'
            },
            filled: {
                container: 'space-y-2',
                item: 'bg-background-card rounded-lg overflow-hidden',
                trigger: 'bg-background-secondary hover:bg-primary-gold/10',
                content: 'bg-background-card'
            },
            minimal: {
                container: 'space-y-1',
                item: 'border-b border-primary-gold/10 last:border-b-0',
                trigger: 'hover:bg-primary-gold/5',
                content: 'bg-transparent'
            }
        }

        const paddingClasses = {
            sm: 'px-3 py-2',
            md: 'px-4 py-3',
            lg: 'px-6 py-4'
        }

        const isItemOpen = (itemId: string) => openItems.includes(itemId)

        return (
            <div
                ref={ref}
                className={`${variantClasses[variant].container} ${className}`}
                {...props}
            >
                {items.map((item) => {
                    const isOpen = isItemOpen(item.id)
                    const Icon = item.icon

                    return (
                        <div
                            key={item.id}
                            className={`${variantClasses[variant].item}`}
                        >
                            {/* Trigger */}
                            <button
                                onClick={() => handleItemToggle(item.id)}
                                disabled={item.disabled}
                                className={`
                  w-full text-left transition-all duration-200 font-helvetica
                  ${paddingClasses[size]}
                  ${variantClasses[variant].trigger}
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  focus:outline-none focus:ring-2 focus:ring-primary-gold/50 focus:ring-inset
                  flex items-center justify-between
                `}
                                aria-expanded={isOpen}
                                aria-controls={`accordion-content-${item.id}`}
                            >
                                <div className="flex items-center space-x-3 flex-1">
                                    {Icon && (
                                        <div className="p-1.5 bg-primary-gold/20 rounded-md flex-shrink-0">
                                            <Icon className={`text-primary-gold ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
                                                }`} />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className={`font-semibold text-text-primary ${sizeClasses[size]}`}>
                                                {item.title}
                                            </span>
                                            {item.badge && (
                                                <span className="px-2 py-0.5 text-xs bg-primary-gold/20 text-primary-gold rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        {item.subtitle && (
                                            <p className="text-sm text-text-secondary mt-1 font-inter">
                                                {item.subtitle}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <ChevronDown
                                    className={`w-5 h-5 text-text-secondary transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Content */}
                            <div
                                id={`accordion-content-${item.id}`}
                                className={`
                  ${variantClasses[variant].content}
                  overflow-hidden transition-all duration-200 ease-in-out
                  ${animated ? (isOpen ? 'max-h-96' : 'max-h-0') : (isOpen ? 'block' : 'hidden')}
                `}
                                aria-hidden={!isOpen}
                            >
                                {(isOpen || keepMounted) && (
                                    <div className={`${paddingClasses[size]} pt-0 ${isOpen ? 'block' : 'hidden'}`}>
                                        {item.content}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
)

Accordion.displayName = 'Accordion'

export default Accordion

// Alt component'ler
export const AccordionItem = ({
    children,
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div className={`border-b border-primary-gold/20 last:border-b-0 ${className}`} {...props}>
        {children}
    </div>
)

export const AccordionTrigger = ({
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

export const AccordionContent = ({
    children,
    className = '',
    isOpen = false,
    ...props
}: HTMLAttributes<HTMLDivElement> & { isOpen?: boolean }) => (
    <div
        className={`
      bg-background-card overflow-hidden transition-all duration-200 ease-in-out
      ${isOpen ? 'max-h-96' : 'max-h-0'}
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