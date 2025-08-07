'use client'
import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string
  asChild?: boolean
}

const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('block truncate', className)}
        {...props}
      >
        {children || (
          <span className="text-muted-foreground">
            {placeholder}
          </span>
        )}
      </span>
    )
  }
)

SelectValue.displayName = 'SelectValue'

export default SelectValue
export { SelectValue }
export type { SelectValueProps }