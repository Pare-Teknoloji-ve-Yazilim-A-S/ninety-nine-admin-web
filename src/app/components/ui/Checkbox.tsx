import { forwardRef, InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
    error?: string
    helperText?: string
    indeterminate?: boolean
    size?: 'sm' | 'md' | 'lg'
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({
        label,
        error,
        helperText,
        indeterminate = false,
        size = 'md',
        className = '',
        ...props
    }, ref) => {
        const sizeClasses = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-6 h-6'
        }

        const baseClasses = 'rounded border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/50 focus:ring-offset-1 focus:ring-offset-background-primary'
        const normalClasses = 'border-primary-gold/30 hover:border-primary-gold/50'
        const checkedClasses = 'bg-primary-gold border-primary-gold'
        const errorClasses = error ? 'border-primary-red focus:ring-primary-red/50' : ''

        return (
            <div className="space-y-1">
                <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                        <input
                            ref={ref}
                            type="checkbox"
                            className={`
                ${baseClasses}
                ${sizeClasses[size]}
                ${error ? errorClasses : normalClasses}
                ${props.checked ? checkedClasses : ''}
                ${className}
                appearance-none cursor-pointer
              `}
                            {...props}
                        />

                        {(props.checked || indeterminate) && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {indeterminate ? (
                                    <div className="w-2 h-0.5 bg-primary-dark-gray rounded-full" />
                                ) : (
                                    <Check className="w-3 h-3 text-primary-dark-gray" />
                                )}
                            </div>
                        )}
                    </div>

                    {label && (
                        <label className="text-sm font-medium text-text-primary cursor-pointer font-inter" htmlFor={props.id}>
                            {label}
                        </label>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-primary-red ml-8 font-inter">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-text-secondary ml-8 font-inter">{helperText}</p>
                )}
            </div>
        )
    }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox 