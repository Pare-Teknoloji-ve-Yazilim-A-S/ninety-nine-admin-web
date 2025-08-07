'use client'
import React, { useState } from 'react'
import { SelectContext, useSelect } from './SelectContext'
import SelectContent from './SelectContent'
import SelectItem from './SelectItem'
import SelectTrigger from './SelectTrigger'
import SelectValue from './SelectValue'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onChange?: (e: { target: { value: string } }) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  name?: string
  required?: boolean
  children?: React.ReactNode
  options?: SelectOption[]
  placeholder?: string
  error?: string
}

const Select = ({
  value,
  defaultValue,
  onValueChange,
  onChange,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  name,
  required,
  children,
  options,
  placeholder = 'Seçiniz...',
  error
}: SelectProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const [internalOpen, setInternalOpen] = useState(defaultOpen)

  const currentValue = value !== undefined ? value : internalValue
  const currentOpen = open !== undefined ? open : internalOpen

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
    onChange?.({ target: { value: newValue } })
    handleOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (disabled) return
    
    if (open === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  // If options are provided, render a simple select with options
  if (options) {
    return (
      <div className="relative">
        <select
          value={currentValue}
          onChange={(e) => handleValueChange(e.target.value)}
          disabled={disabled}
          name={name}
          required={required}
          className={`
            w-full px-3 py-2 border rounded-lg text-sm
            bg-background-light-card dark:bg-background-card
            text-text-on-light dark:text-text-on-dark
            border-background-light-secondary dark:border-background-secondary
            focus:border-primary-gold focus:ring-2 focus:ring-primary-gold/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-primary-red' : ''}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-primary-red">{error}</p>
        )}
      </div>
    )
  }

  // Original compound component behavior
  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open: currentOpen,
        onOpenChange: handleOpenChange
      }}
    >
      <div className="relative">
        {children}
        {name && (
          <input
            type="hidden"
            name={name}
            value={currentValue}
            required={required}
          />
        )}
      </div>
    </SelectContext.Provider>
  )
}

Select.displayName = 'Select'

// Export compound components
export default Select
export { SelectContent, SelectItem, SelectTrigger, SelectValue, useSelect }
export type { SelectProps }