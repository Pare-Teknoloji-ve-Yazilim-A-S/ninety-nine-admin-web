'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role?: string
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Client-side kontrolü
      if (typeof window !== 'undefined') {
        // localStorage'dan kullanıcı bilgilerini al
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (err) {
      setError('Kullanıcı bilgileri yüklenirken hata oluştu')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Gerçek login API çağrısı - AuthProvider.tsx'teki gerçek authentication kullanılmalı
      // Bu context sadece basit state management için kullanılıyor
      // Gerçek authentication için /src/app/components/auth/AuthProvider.tsx kullanın
      throw new Error('Bu context mock amaçlı. Gerçek authentication için AuthProvider.tsx kullanın.')
    } catch (err) {
      setError('Giriş yapılırken hata oluştu')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('userPermissions')
    }
    setUser(null)
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext