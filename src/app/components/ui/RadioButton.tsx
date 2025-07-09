import { forwardRef, InputHTMLAttributes } from 'react'

interface RadioOption {
    value: string
    label: string
    disabled?: boolean
}

interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
    error?: string
    helperText?: string
    options: RadioOption[]
    radioSize?: 'sm' | 'md' | 'lg'
    direction?: 'horizontal' | 'vertical'
}

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
    ({
        label,
        error,
        helperText,
        options,
        radioSize = 'md',
        direction = 'vertical',
        className = '',
        ...props
    }, ref) => {
        const sizeClasses = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-6 h-6'
        }

        const baseClasses = 'rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/50 focus:ring-offset-1 focus:ring-offset-background-primary'
        const normalClasses = 'border-primary-gold/30 hover:border-primary-gold/50'
        const checkedClasses = 'bg-primary-gold border-primary-gold'
        const errorClasses = error ? 'border-primary-red focus:ring-primary-red/50' : ''

        const containerClasses = direction === 'horizontal' ? 'flex flex-wrap gap-6' : 'space-y-3'

        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-text-primary font-inter">
                        {label}
                    </label>
                )}

                <div className={containerClasses}>
                    {options.map((option, index) => (
                        <div key={option.value} className="flex items-center space-x-3">
                            <div className="relative flex-shrink-0">
                                <input
                                    ref={index === 0 ? ref : undefined}
                                    type="radio"
                                    value={option.value}
                                    disabled={option.disabled}
                                    className={`
                    ${baseClasses}
                    ${sizeClasses[radioSize]}
                    ${error ? errorClasses : normalClasses}
                    ${className}
                    appearance-none cursor-pointer
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                                    {...props}
                                />

                                {props.value === option.value && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-2 h-2 bg-primary-dark-gray rounded-full" />
                                    </div>
                                )}
                            </div>

                            <label
                                className={`text-sm font-medium cursor-pointer font-inter ${option.disabled ? 'text-text-secondary opacity-50' : 'text-text-primary'
                                    }`}
                                htmlFor={`${props.name}-${option.value}`}
                            >
                                {option.label}
                            </label>
                        </div>
                    ))}
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

RadioButton.displayName = 'RadioButton'

export default RadioButton 