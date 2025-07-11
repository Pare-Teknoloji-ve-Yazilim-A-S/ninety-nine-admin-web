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

        // Border ve focus efektleri kaldırıldı
        const baseClasses = 'rounded-full transition-colors';
        const normalClasses = '';
        const checkedClasses = 'bg-primary-gold';
        const errorClasses = error ? 'bg-primary-red' : '';

        const containerClasses = direction === 'horizontal' ? 'flex flex-wrap gap-6' : 'space-y-3';

        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-text-primary font-inter">
                        {label}
                    </label>
                )}

                <div className={containerClasses}>
                    {options.map((option, index) => (
                        <div key={option.value} className="flex items-center gap-2 min-h-6">
                            <label
                                htmlFor={`${props.name}-${option.value}`}
                                className={`text-sm font-medium cursor-pointer font-inter flex items-center ${option.disabled ? 'text-text-secondary opacity-50' : 'text-text-primary'}`}
                                style={{ lineHeight: 1.5 }}
                            >
                                <span className="relative flex items-center justify-center">
                                    <input
                                        ref={index === 0 ? ref : undefined}
                                        id={`${props.name}-${option.value}`}
                                        type="radio"
                                        value={option.value}
                                        disabled={option.disabled}
                                        className={`
                        ${baseClasses}
                        ${sizeClasses[radioSize]}
                        ${error ? errorClasses : normalClasses}
                        ${props.value === option.value ? checkedClasses : ''}
                        ${className}
                        cursor-pointer
                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        peer
                    `}
                                        checked={props.value === option.value}
                                        onChange={props.onChange}
                                        name={props.name}
                                    />
                                    {/* Custom dot for checked state, premium gold */}
                                    <span
                                        className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150
                        ${props.value === option.value ?
                                                radioSize === 'lg' ? 'w-3 h-3' : radioSize === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
                                                : 'w-0 h-0'}
                        ${props.value === option.value ? 'bg-primary-dark-gray' : ''}
                    `}
                                        style={{
                                            backgroundColor: props.value === option.value ? '#ac8d6a' : 'transparent'
                                        }}
                                    />
                                </span>
                                <span className="ml-2 select-none flex items-center" style={{ minHeight: '1.5rem' }}>{option.label}</span>
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