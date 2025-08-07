'use client'

import React, { useState, createContext, useContext, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface PopoverContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
  contentRef: React.RefObject<HTMLDivElement>
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined)

const usePopover = () => {
  const context = useContext(PopoverContext)
  if (!context) {
    throw new Error('usePopover must be used within a Popover')
  }
  return context
}

interface PopoverProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

const Popover = ({ 
  children, 
  open: controlledOpen, 
  onOpenChange, 
  defaultOpen = false 
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        contentRef.current &&
        triggerRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleOpenChange(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        handleOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, handleOpenChange])

  return (
    <PopoverContext.Provider value={{ open, onOpenChange: handleOpenChange, triggerRef, contentRef }}>
      <div className="relative">
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  asChild?: boolean
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ children, asChild = false, className, onClick, ...props }, ref) => {
    const { open, onOpenChange, triggerRef } = usePopover()
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(!open)
      onClick?.(event)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...children.props,
        ref: (node: HTMLElement) => {
          if (triggerRef && 'current' in triggerRef) {
            (triggerRef as any).current = node
          }
          if (typeof ref === 'function') ref(node as any)
          else if (ref) ref.current = node as any
        },
        onClick: handleClick,
        'aria-expanded': open,
        'data-state': open ? 'open' : 'closed'
      })
    }

    return (
      <button
        ref={(node) => {
          if (triggerRef && 'current' in triggerRef) {
            (triggerRef as any).current = node
          }
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        type="button"
        aria-expanded={open}
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)

PopoverTrigger.displayName = 'PopoverTrigger'

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  alignOffset?: number
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ 
    children, 
    className, 
    align = 'center', 
    side = 'bottom', 
    sideOffset = 4,
    alignOffset = 0,
    ...props 
  }, ref) => {
    const { open, contentRef } = usePopover()

    if (!open) return null

    return (
      <div
        ref={(node) => {
          if (contentRef && 'current' in contentRef) {
            (contentRef as any).current = node
          }
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        data-state={open ? 'open' : 'closed'}
        data-side={side}
        data-align={align}
        className={cn(
          'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          side === 'bottom' && 'data-[side=bottom]:slide-in-from-top-2',
          side === 'left' && 'data-[side=left]:slide-in-from-right-2',
          side === 'right' && 'data-[side=right]:slide-in-from-left-2',
          side === 'top' && 'data-[side=top]:slide-in-from-bottom-2',
          side === 'bottom' && `top-full mt-${sideOffset}`,
          side === 'top' && `bottom-full mb-${sideOffset}`,
          side === 'right' && `left-full ml-${sideOffset}`,
          side === 'left' && `right-full mr-${sideOffset}`,
          align === 'start' && 'left-0',
          align === 'center' && 'left-1/2 -translate-x-1/2',
          align === 'end' && 'right-0',
          className
        )}
        style={{
          marginTop: side === 'bottom' ? sideOffset : undefined,
          marginBottom: side === 'top' ? sideOffset : undefined,
          marginLeft: side === 'right' ? sideOffset : undefined,
          marginRight: side === 'left' ? sideOffset : undefined,
          left: align === 'center' ? '50%' : align === 'start' ? alignOffset : undefined,
          right: align === 'end' ? alignOffset : undefined,
          transform: align === 'center' ? 'translateX(-50%)' : undefined
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

PopoverContent.displayName = 'PopoverContent'

export default Popover
export { PopoverTrigger, PopoverContent }