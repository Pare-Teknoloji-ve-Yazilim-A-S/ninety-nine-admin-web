'use client'
import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode
  hoverable?: boolean
  striped?: boolean
  clickable?: boolean
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, hoverable = true, striped = false, clickable = false, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b border-border transition-colors',
          hoverable && 'hover:bg-muted/50',
          striped && 'even:bg-muted/25',
          clickable && 'cursor-pointer',
          'data-[state=selected]:bg-muted',
          className
        )}
        {...props}
      >
        {children}
      </tr>
    )
  }
)

TableRow.displayName = 'TableRow'

export default TableRow
export type { TableRowProps }