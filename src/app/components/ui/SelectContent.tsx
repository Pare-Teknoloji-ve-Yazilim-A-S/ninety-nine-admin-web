'use client'
import React, { forwardRef, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useSelect } from './SelectContext'

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
}

const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, side = 'bottom', align = 'start', ...props }, ref) => {
    const { open, onOpenChange } = useSelect()
    const contentRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          onOpenChange?.(false)
        }
      }
      
      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open, onOpenChange])
    
    if (!open) return null
    
    return (
      <div
        ref={(node) => {
          if (contentRef && 'current' in contentRef) {
            (contentRef as any).current = node
          }
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn(
          'absolute z-[9999] max-h-60 w-full overflow-y-auto rounded-md border bg-background-light-card dark:bg-background-card border-border-light-primary dark:border-border-primary text-text-light-primary dark:text-text-primary shadow-lg animate-in fade-in-0 zoom-in-95',
          side === 'bottom' && 'top-full mt-1',
          side === 'top' && 'bottom-full mb-1',
          className
        )}
        {...props}
      >
        <div className="p-1">
          {children}
        </div>
      </div>
    )
  }
)

SelectContent.displayName = 'SelectContent'

export default SelectContent
export { SelectContent }
export type { SelectContentProps }