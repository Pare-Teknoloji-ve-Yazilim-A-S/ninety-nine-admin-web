import { forwardRef, InputHTMLAttributes } from 'react'
import { Calendar } from 'lucide-react'

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
    error?: string
    helperText?: string
    variant?: 'default' | 'filled' | 'outlined'
    isRequired?: boolean
    minDate?: string
    maxDate?: string
    showIcon?: boolean
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
    ({
        label,
        error,
        helperText,
        variant = 'default',
        isRequired = false,
        minDate,
        maxDate,
        showIcon = true,
        className = '',
        ...props
    }, ref) => {
        const baseClasses = 'w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/50'

        const variantClasses = {
            default: 'border-primary-gold/30 bg-background-secondary text-text-primary hover:border-primary-gold/50 focus:border-primary-gold',
            filled: 'border-primary-gold/20 bg-background-card text-text-primary hover:bg-background-secondary focus:bg-background-secondary focus:border-primary-gold',
            outlined: 'border-primary-gold/40 bg-transparent text-text-primary hover:border-primary-gold/60 focus:border-primary-gold'
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
                    {showIcon && (
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5 pointer-events-none" />
                    )}

                    <input
                        ref={ref}
                        type="date"
                        min={minDate}
                        max={maxDate}
                        className={`
              ${baseClasses}
              ${variantClasses[variant]}
              ${errorClasses}
              ${showIcon ? 'pl-10' : ''}
              ${className}
              [color-scheme:dark]
            `}
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

DatePicker.displayName = 'DatePicker'

export default DatePicker 