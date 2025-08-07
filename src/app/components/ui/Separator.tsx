'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={orientation}
        className={cn(
          'shrink-0 bg-border',
          {
            'h-px w-full': orientation === 'horizontal' && size === 'sm',
            'h-0.5 w-full': orientation === 'horizontal' && size === 'md',
            'h-1 w-full': orientation === 'horizontal' && size === 'lg',
            'w-px h-full': orientation === 'vertical' && size === 'sm',
            'w-0.5 h-full': orientation === 'vertical' && size === 'md',
            'w-1 h-full': orientation === 'vertical' && size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Separator.displayName = 'Separator'

export default Separator