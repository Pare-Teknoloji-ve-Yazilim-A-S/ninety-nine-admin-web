import { forwardRef, InputHTMLAttributes } from 'react'
import { LucideIcon } from 'lucide-react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string
    error?: string
    helperText?: string
    icon?: LucideIcon
    variant?: 'default' | 'filled' | 'outlined'
    isRequired?: boolean
    onChange?: (value: string) => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
        label,
        error,
        helperText,
        icon: Icon,
        variant = 'default',
        isRequired = false,
        className = '',
        onChange,
        ...props
    }, ref) => {
        const baseClasses = 'w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/50'

        const variantClasses = {
            default: 'border-primary-gold/30 bg-background-secondary text-text-primary hover:border-primary-gold/50 focus:border-primary-gold placeholder:text-text-secondary',
            filled: 'border-primary-gold/20 bg-background-card text-text-primary hover:bg-background-secondary focus:bg-background-secondary focus:border-primary-gold placeholder:text-text-secondary',
            outlined: 'border-primary-gold/40 bg-transparent text-text-primary hover:border-primary-gold/60 focus:border-primary-gold placeholder:text-text-secondary'
        }

        const errorClasses = error ? 'border-primary-red focus:ring-primary-red/50 focus:border-primary-red' : ''

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-text-primary font-inter">
                        {label}
                        {isRequired && <span className="text-primary-red ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {Icon && (
                        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                    )}

                    <input
                        ref={ref}
                        className={`
              ${baseClasses}
              ${variantClasses[variant]}
              ${errorClasses}
              ${Icon ? 'pl-10' : ''}
              ${className}
            `}
                        onChange={(e) => onChange?.(e.target.value)}
                        {...props}
                    />
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

Input.displayName = 'Input'

export default Input 