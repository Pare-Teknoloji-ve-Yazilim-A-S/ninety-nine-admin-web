'use client'
import React, { forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSelect } from './SelectContext'

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
  textValue?: string
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, disabled, value, textValue, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useSelect()
    const isSelected = selectedValue === value
    
    const handleClick = () => {
      if (!disabled) {
        onValueChange?.(value)
      }
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          disabled && 'pointer-events-none opacity-50',
          isSelected && 'bg-accent text-accent-foreground',
          !disabled && 'cursor-pointer hover:bg-accent hover:text-accent-foreground',
          className
        )}
        data-value={value}
        data-disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <Check className="h-4 w-4" />}
        </span>
        {children}
      </div>
    )
  }
)

SelectItem.displayName = 'SelectItem'

export default SelectItem
export { SelectItem }
export type { SelectItemProps }