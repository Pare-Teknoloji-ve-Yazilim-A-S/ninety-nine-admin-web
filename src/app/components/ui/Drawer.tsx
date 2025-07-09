'use client'
import { forwardRef, HTMLAttributes, ReactNode, useEffect, useRef } from 'react'
import { X, LucideIcon } from 'lucide-react'

interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean
    onClose: () => void
    title?: string
    subtitle?: string
    icon?: LucideIcon
    position?: 'left' | 'right' | 'top' | 'bottom'
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    variant?: 'default' | 'glass' | 'dark'
    closable?: boolean
    closeOnOverlayClick?: boolean
    closeOnEscape?: boolean
    header?: ReactNode
    footer?: ReactNode
    headerAction?: ReactNode
    showCloseButton?: boolean
    overlay?: boolean
    push?: boolean // Push mode - sayfayı iter
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
    ({
        isOpen,
        onClose,
        title,
        subtitle,
        icon: Icon,
        position = 'right',
        size = 'md',
        variant = 'default',
        closable = true,
        closeOnOverlayClick = true,
        closeOnEscape = true,
        header,
        footer,
        headerAction,
        showCloseButton = true,
        overlay = true,
        push = false,
        children,
        className = '',
        ...props
    }, ref) => {
        const drawerRef = useRef<HTMLDivElement>(null)

        // Escape key handler
        useEffect(() => {
            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === 'Escape' && closeOnEscape && closable) {
                    onClose()
                }
            }

            if (isOpen) {
                document.addEventListener('keydown', handleEscape)
                if (!push) {
                    document.body.style.overflow = 'hidden'
                }
            }

            return () => {
                document.removeEventListener('keydown', handleEscape)
                if (!push) {
                    document.body.style.overflow = 'unset'
                }
            }
        }, [isOpen, onClose, closeOnEscape, closable, push])

        // Focus management
        useEffect(() => {
            if (isOpen && drawerRef.current) {
                drawerRef.current.focus()
            }
        }, [isOpen])

        const sizeClasses = {
            left: {
                sm: 'w-64',
                md: 'w-80',
                lg: 'w-96',
                xl: 'w-1/3',
                full: 'w-full'
            },
            right: {
                sm: 'w-64',
                md: 'w-80',
                lg: 'w-96',
                xl: 'w-1/3',
                full: 'w-full'
            },
            top: {
                sm: 'h-48',
                md: 'h-64',
                lg: 'h-80',
                xl: 'h-96',
                full: 'h-full'
            },
            bottom: {
                sm: 'h-48',
                md: 'h-64',
                lg: 'h-80',
                xl: 'h-96',
                full: 'h-full'
            }
        }

        const positionClasses = {
            left: 'left-0 top-0 h-full',
            right: 'right-0 top-0 h-full',
            top: 'top-0 left-0 w-full',
            bottom: 'bottom-0 left-0 w-full'
        }

        const transformClasses = {
            left: isOpen ? 'translate-x-0' : '-translate-x-full',
            right: isOpen ? 'translate-x-0' : 'translate-x-full',
            top: isOpen ? 'translate-y-0' : '-translate-y-full',
            bottom: isOpen ? 'translate-y-0' : 'translate-y-full'
        }

        const variantClasses = {
            default: 'bg-background-card border-primary-gold/20',
            glass: 'bg-background-card/90 backdrop-blur-sm border-primary-gold/30',
            dark: 'bg-background-primary border-primary-gold/20'
        }

        const borderClasses = {
            left: 'border-r',
            right: 'border-l',
            top: 'border-b',
            bottom: 'border-t'
        }

        const handleOverlayClick = (event: React.MouseEvent) => {
            if (event.target === event.currentTarget && closeOnOverlayClick && closable) {
                onClose()
            }
        }

        const handleClose = () => {
            if (closable) {
                onClose()
            }
        }

        const renderHeader = () => {
            if (!header && !title && !Icon) return null

            return (
                <div className="flex items-start justify-between p-6 border-b border-primary-gold/20">
                    <div className="flex items-center space-x-3">
                        {Icon && (
                            <div className="p-2 bg-primary-gold/20 rounded-lg flex-shrink-0">
                                <Icon className="w-5 h-5 text-primary-gold" />
                            </div>
                        )}
                        <div>
                            {title && (
                                <h2 className="text-xl font-semibold text-text-primary font-helvetica">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="text-sm text-text-secondary font-inter mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {headerAction && (
                            <div className="flex-shrink-0">
                                {headerAction}
                            </div>
                        )}
                        {showCloseButton && closable && (
                            <button
                                onClick={handleClose}
                                className="p-2 text-text-secondary hover:text-text-primary hover:bg-primary-gold/10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-gold/50"
                                aria-label="Drawer'ı kapat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            )
        }

        const renderFooter = () => {
            if (!footer) return null

            return (
                <div className="p-6 border-t border-primary-gold/20">
                    {footer}
                </div>
            )
        }

        if (!isOpen && !push) return null

        return (
            <div className={`fixed inset-0 z-40 ${push ? 'relative' : ''}`}>
                {/* Overlay */}
                {overlay && !push && (
                    <div
                        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        onClick={handleOverlayClick}
                        aria-hidden="true"
                    />
                )}

                {/* Drawer */}
                <div
                    ref={drawerRef}
                    className={`
            ${push ? 'relative' : 'fixed'}
            ${positionClasses[position]}
            ${sizeClasses[position][size]}
            ${variantClasses[variant]}
            ${borderClasses[position]}
            ${transformClasses[position]}
            shadow-xl transform transition-all duration-300 ease-in-out
            ${className}
          `}
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? 'drawer-title' : undefined}
                    {...props}
                >
                    {/* Header */}
                    {header && <div>{header}</div>}
                    {renderHeader()}

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto">
                        {children && (
                            <div className="p-6">
                                {children}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {renderFooter()}
                </div>
            </div>
        )
    }
)

Drawer.displayName = 'Drawer'

export default Drawer

// Alt component'ler
export const DrawerHeader = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`p-6 border-b border-primary-gold/20 ${className}`} {...props}>
        {children}
    </div>
)

export const DrawerBody = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`p-6 flex-1 overflow-y-auto ${className}`} {...props}>
        {children}
    </div>
)

export const DrawerFooter = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`p-6 border-t border-primary-gold/20 ${className}`} {...props}>
        {children}
    </div>
)

export const DrawerTitle = ({ children, className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 id="drawer-title" className={`text-xl font-semibold text-text-primary font-helvetica ${className}`} {...props}>
        {children}
    </h2>
)

export const DrawerSubtitle = ({ children, className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`text-sm text-text-secondary font-inter ${className}`} {...props}>
        {children}
    </p>
) 