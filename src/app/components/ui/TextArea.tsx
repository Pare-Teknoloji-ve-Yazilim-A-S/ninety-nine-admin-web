import { forwardRef, TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    label?: string
    error?: string
    helperText?: string
    variant?: 'default' | 'filled' | 'outlined'
    isRequired?: boolean
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'
    maxLength?: number
    showCount?: boolean
    onChange?: (value: string) => void
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({
        label,
        error,
        helperText,
        variant = 'default',
        isRequired = false,
        resize = 'vertical',
        maxLength,
        showCount = false,
        className = '',
        value,
        onChange,
        ...props
    }, ref) => {
        const baseClasses = 'w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/50 min-h-[100px]'

        const variantClasses = {
            default: 'border-primary-gold/30 bg-background-secondary text-text-primary hover:border-primary-gold/50 focus:border-primary-gold placeholder:text-text-secondary',
            filled: 'border-primary-gold/20 bg-background-card text-text-primary hover:bg-background-secondary focus:bg-background-secondary focus:border-primary-gold placeholder:text-text-secondary',
            outlined: 'border-primary-gold/40 bg-transparent text-text-primary hover:border-primary-gold/60 focus:border-primary-gold placeholder:text-text-secondary'
        }

        const resizeClasses = {
            none: 'resize-none',
            both: 'resize',
            horizontal: 'resize-x',
            vertical: 'resize-y'
        }

        const errorClasses = error ? 'border-primary-red focus:ring-primary-red/50 focus:border-primary-red' : ''

        const currentLength = typeof value === 'string' ? value.length : 0
        const showCounter = showCount && maxLength

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-text-primary font-inter">
                        {label}
                        {isRequired && <span className="text-primary-red ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <textarea
                        ref={ref}
                        maxLength={maxLength}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        className={`
              ${baseClasses}
              ${variantClasses[variant]}
              ${resizeClasses[resize]}
              ${errorClasses}
              ${className}
            `}
                        {...props}
                    />

                    {showCounter && (
                        <div className="absolute bottom-2 right-2 text-xs text-text-secondary bg-background-primary/80 px-2 py-1 rounded font-inter">
                            {currentLength}/{maxLength}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-primary-red font-inter">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-text-secondary font-inter">{helperText}</p>
                )}
            </div>
        )
    }
)

TextArea.displayName = 'TextArea'

export default TextArea 