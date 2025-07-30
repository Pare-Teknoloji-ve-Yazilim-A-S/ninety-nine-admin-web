import { forwardRef, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string
    error?: string
    helperText?: string
    placeholder?: string
    options?: SelectOption[] // Optional yapıyoruz
    isRequired?: boolean
    onChange?: (value: string) => void
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({
        label,
        error,
        helperText,
        placeholder = 'Seçiniz...',
        options = [], // Default değer ekliyoruz
        isRequired = false,
        className = '',
        onChange,
        ...props
    }, ref) => {
        const baseClasses = 'w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/50 appearance-none bg-background-secondary text-text-primary'

        const normalClasses = 'border-primary-gold/30 hover:border-primary-gold/50 focus:border-primary-gold'
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
                    <select
                        ref={ref}
                        className={`
              ${baseClasses}
              ${error ? errorClasses : normalClasses}
              ${className}
            `}
                        onChange={(e) => onChange?.(e.target.value)}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled className="text-text-secondary">
                                {placeholder}
                            </option>
                        )}
                        {/* Güvenli map kontrolü ekliyoruz */}
                        {options && options.length > 0 && options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                                className="bg-background-secondary text-text-primary"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5 pointer-events-none" />
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

Select.displayName = 'Select'

export default Select 