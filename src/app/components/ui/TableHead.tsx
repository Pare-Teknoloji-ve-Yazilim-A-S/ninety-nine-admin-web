'use client'
import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg'
  sortable?: boolean
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, align = 'left', size = 'md', sortable = false, ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-xs',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-base',
    }

    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }

    return (
      <th
        ref={ref}
        className={cn(
          'border-b border-border bg-muted/50 font-semibold text-muted-foreground',
          sizeClasses[size],
          alignClasses[align],
          sortable && 'cursor-pointer hover:bg-muted/80 transition-colors',
          className
        )}
        {...props}
      >
        {children}
      </th>
    )
  }
)

TableHead.displayName = 'TableHead'

export default TableHead
export type { TableHeadProps }