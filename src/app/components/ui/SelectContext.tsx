'use client'
import React, { createContext, useContext } from 'react'

interface SelectContextType {
  value?: string
  onValueChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const SelectContext = createContext<SelectContextType | undefined>(undefined)

export const useSelect = () => {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error('useSelect must be used within a Select')
  }
  return context
}

export type { SelectContextType }