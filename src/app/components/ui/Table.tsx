'use client'
import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import TableBody from './TableBody'
import TableCell from './TableCell'
import TableHead from './TableHead'
import TableHeader from './TableHeader'
import TableRow from './TableRow'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode
  bordered?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, bordered = true, size = 'md', ...props }, ref) => {

    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    }

    return (
      <div className={cn('relative w-full overflow-auto', className)}>
        <table
          ref={ref}
          className={cn(
            'w-full caption-bottom border-collapse',
            bordered && 'border border-border',
            sizeClasses[size]
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    )
  }
)

Table.displayName = 'Table'

// Export compound components
Table.Body = TableBody
Table.Cell = TableCell
Table.Head = TableHead
Table.Header = TableHeader
Table.Row = TableRow

export default Table
export type { TableProps }
export { TableBody, TableCell, TableHead, TableHeader, TableRow }