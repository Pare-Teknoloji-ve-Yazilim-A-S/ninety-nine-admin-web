'use client'
import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg'
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, align = 'left', size = 'md', ...props }, ref) => {
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
      <td
        ref={ref}
        className={cn(
          'border-b border-border text-text-primary transition-colors',
          sizeClasses[size],
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </td>
    )
  }
)

TableCell.displayName = 'TableCell'

export default TableCell
export type { TableCellProps }