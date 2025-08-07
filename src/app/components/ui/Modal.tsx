'use client'
import { forwardRef, HTMLAttributes, ReactNode, useEffect, useRef } from 'react'
import { X, LucideIcon } from 'lucide-react'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean
    onClose: () => void
    title?: string
    subtitle?: string
    icon?: LucideIcon
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' 
    variant?: 'default' | 'glass' | 'dark'
    closable?: boolean
    closeOnOverlayClick?: boolean
    closeOnEscape?: boolean
    header?: ReactNode
    footer?: ReactNode
    headerAction?: ReactNode
    showCloseButton?: boolean
    centered?: boolean
    scrollable?: boolean
    maxHeight?: string
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
    ({
        isOpen,
        onClose,
        title,
        subtitle,
        icon: Icon,
        size = 'md',
        variant = 'default',
        closable = true,
        closeOnOverlayClick = true,
        closeOnEscape = true,
        header,
        footer,
        headerAction,
        showCloseButton = true,
        centered = true,
        scrollable = true,
        maxHeight = 'calc(100vh - 2rem)',
        children,
        className = '',
        ...props
    }, ref) => {
        const modalRef = useRef<HTMLDivElement>(null)

        // Escape key handler
        useEffect(() => {
            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === 'Escape' && closeOnEscape && closable) {
                    onClose()
                }
            }

            if (isOpen) {
                document.addEventListener('keydown', handleEscape)
                document.body.style.overflow = 'hidden'
            }

            return () => {
                document.removeEventListener('keydown', handleEscape)
                document.body.style.overflow = 'unset'
            }
        }, [isOpen, onClose, closeOnEscape, closable])

        // Focus management
        useEffect(() => {
            if (isOpen && modalRef.current) {
                modalRef.current.focus()
            }
        }, [isOpen])

        const sizeClasses = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            full: 'max-w-none mx-4'
        }

        const variantClasses = {
            default: 'bg-background-card border border-primary-gold/20',
            glass: 'bg-background-card/90 backdrop-blur-sm border border-primary-gold/30',
            dark: 'bg-background-primary border border-primary-gold/20'
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
                                aria-label="Modal'ı kapat"
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

        if (!isOpen) return null

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                />

                {/* Modal */}
                <div
                    ref={modalRef}
                    className={`
            relative w-full mx-4 rounded-xl shadow-xl transform transition-all duration-300 scale-100
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${centered ? 'my-8' : ''}
            ${className}
          `}
                    style={{ maxHeight }}
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? 'modal-title' : undefined}
                    {...props}
                >
                    {/* Header */}
                    {header && <div>{header}</div>}
                    {renderHeader()}

                    {/* Body */}
                    <div className={`${scrollable ? 'overflow-y-auto' : ''} ${!header && !title && !Icon ? 'pt-6' : ''}`}>
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

Modal.displayName = 'Modal'

export default Modal

// Alt component'ler
export const ModalHeader = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`p-6 border-b border-primary-gold/20 ${className}`} {...props}>
        {children}
    </div>
)

export const ModalBody = ({ children, className = '', scrollable = true, ...props }: HTMLAttributes<HTMLDivElement> & { scrollable?: boolean }) => (
    <div className={`p-6 ${scrollable ? 'overflow-y-auto' : ''} ${className}`} {...props}>
        {children}
    </div>
)

export const ModalFooter = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`p-6 border-t border-primary-gold/20 ${className}`} {...props}>
        {children}
    </div>
)

export const ModalTitle = ({ children, className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 id="modal-title" className={`text-xl font-semibold text-text-primary font-helvetica ${className}`} {...props}>
        {children}
    </h2>
)

export const ModalSubtitle = ({ children, className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`text-sm text-text-secondary font-inter ${className}`} {...props}>
        {children}
    </p>
) 