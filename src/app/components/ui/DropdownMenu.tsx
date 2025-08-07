'use client'
import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Portal from './Portal'

interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

interface DropdownMenuSeparatorProps {
  className?: string
}

const DropdownMenuContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
}>({ 
  isOpen: false, 
  setIsOpen: () => {}, 
  triggerRef: { current: null } 
})

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className={cn('relative inline-block', className)}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ 
  asChild, 
  children, 
  className 
}) => {
  const { setIsOpen, triggerRef } = React.useContext(DropdownMenuContext)

  const handleClick = () => {
    setIsOpen(prev => !prev)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      className: cn(children.props.className, className)
    })
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
      className={cn('inline-flex items-center justify-center', className)}
    >
      {children}
    </button>
  )
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ 
  children, 
  align = 'end', 
  side = 'bottom', 
  className 
}) => {
  const { isOpen, triggerRef } = React.useContext(DropdownMenuContext)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const menuWidth = 200 // Estimated menu width
      const menuHeight = 300 // Estimated menu height
      
      let top = triggerRect.bottom + window.scrollY
      let left = triggerRect.left + window.scrollX

      // Adjust horizontal position based on align
      if (align === 'end') {
        left = triggerRect.right + window.scrollX - menuWidth
      } else if (align === 'center') {
        left = triggerRect.left + window.scrollX + (triggerRect.width / 2) - (menuWidth / 2)
      }

      // Adjust if menu would go off screen
      if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 10
      }
      if (left < 10) {
        left = 10
      }
      if (top + menuHeight > window.innerHeight + window.scrollY) {
        top = triggerRect.top + window.scrollY - menuHeight
      }

      setPosition({ top, left })
    }
  }, [isOpen, align, triggerRef])

  if (!isOpen) return null

  return (
    <Portal>
      <div
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          zIndex: 50
        }}
        className={cn(
          'min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1',
          'max-h-72 overflow-auto',
          className
        )}
      >
        {children}
      </div>
    </Portal>
  )
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ 
  children, 
  onClick, 
  disabled, 
  className 
}) => {
  const { setIsOpen } = React.useContext(DropdownMenuContext)

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
      setIsOpen(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
        'flex items-center gap-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  )
}

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ className }) => {
  return (
    <div className={cn('h-px bg-gray-200 dark:bg-gray-700 my-1', className)} />
  )
}

export default DropdownMenu
export { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator }