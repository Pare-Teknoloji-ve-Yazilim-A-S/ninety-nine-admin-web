'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Permission {
  id: string
  name: string
  description?: string
}

interface PermissionContextType {
  permissions: Permission[] | null
  loading: boolean
  error: string | null
  refreshPermissions: () => Promise<void>
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

interface PermissionProviderProps {
  children: ReactNode
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const [permissions, setPermissions] = useState<Permission[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Client-side kontrolü
      if (typeof window !== 'undefined') {
        // localStorage'dan kullanıcı izinlerini al
        const storedPermissions = localStorage.getItem('userPermissions')
        if (storedPermissions) {
          const parsedPermissions = JSON.parse(storedPermissions)
          setPermissions(parsedPermissions)
        } else {
          setPermissions([])
        }
      } else {
        setPermissions([])
      }
    } catch (err) {
      setError('İzinler yüklenirken hata oluştu')
      setPermissions([])
    } finally {
      setLoading(false)
    }
  }

  const refreshPermissions = async () => {
    await fetchPermissions()
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  const value: PermissionContextType = {
    permissions,
    loading,
    error,
    refreshPermissions
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

// usePermissions hook kaldırıldı - usePermissionCheck hook'u kullanın

export default PermissionContext