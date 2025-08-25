'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

export const usePermissionCheck = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Client-side mount kontrolü
  useEffect(() => {
    setIsClient(true)
    setMounted(true)
    setLoading(false)
  }, [])

  // Permission değişikliklerini dinle
  useEffect(() => {
    const handlePermissionChange = () => {
      setRefreshKey(prev => prev + 1)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('permission-changed', handlePermissionChange)
      return () => {
        window.removeEventListener('permission-changed', handlePermissionChange)
      }
    }
  }, [])

  const hasPermission = useCallback((requiredPermission: string): boolean => {
    // SSR sırasında güvenli varsayılan değer döndür
    if (!mounted || !isClient) {
      return false
    }

    if (loading) {
      return false
    }

    if (!requiredPermission) {
      return true
    }

    try {
      // localStorage'dan userPermissions'ı güvenli şekilde al
      let userPermissions = null
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const stored = localStorage.getItem('userPermissions')
          if (stored) {
            userPermissions = JSON.parse(stored)
          }
        } catch (e) {
          // localStorage erişim hatası - sessizce devam et
        }
      }

      // userPermissions yoksa false döndür

      if (!userPermissions) {
        return false
      }

      // Permission varyasyonları oluştur
      const permissionVariations = [
        requiredPermission,
        requiredPermission.toLowerCase(),
        requiredPermission.toUpperCase(),
        requiredPermission.replace(/[_-]/g, ''),
        requiredPermission.replace(/[_-]/g, '').toLowerCase(),
        requiredPermission.replace(/[_-]/g, '').toUpperCase()
      ]

      // userPermissions string ise JSON parse et
      let userPerms = userPermissions
      if (typeof userPermissions === 'string') {
        try {
          userPerms = JSON.parse(userPermissions)
        } catch (e) {
          userPerms = userPermissions
        }
      }

      // Array ise direkt kontrol et
      if (Array.isArray(userPerms)) {
        return userPerms.some((perm: any) => {
          if (typeof perm === 'string') {
            return permissionVariations.includes(perm)
          }
          
          if (typeof perm === 'object' && perm !== null) {
            // ID kontrolü
            if (perm.id && permissionVariations.includes(perm.id)) {
              return true
            }
            
            // Name kontrolü
            const permName = perm.name || perm
            if (permName && permissionVariations.includes(permName)) {
              return true
            }
          }
          
          return false
        })
      }
      
      // Object ise values'ları kontrol et
      if (typeof userPerms === 'object' && userPerms !== null && !Array.isArray(userPerms)) {
        return Object.values(userPerms).some((perm: any) => {
          if (typeof perm === 'string') {
            return permissionVariations.includes(perm)
          }
          
          if (typeof perm === 'object' && perm !== null) {
            // ID kontrolü
            if (perm.id && permissionVariations.includes(perm.id)) {
              return true
            }
            
            // Name kontrolü
            if (perm.name && permissionVariations.includes(perm.name)) {
              return true
            }
          }
          
          return false
        })
      }
      
      // String ise direkt kontrol et
      if (typeof userPerms === 'string') {
        return permissionVariations.includes(userPerms)
      }
      
      return false
    } catch (error) {
      return false
    }
  }, [loading, refreshKey, isClient, mounted])

  const hasAnyPermission = useCallback((requiredPermissions: string[]): boolean => {
    if (!mounted) return false
    return requiredPermissions.some(permission => hasPermission(permission))
  }, [hasPermission, mounted])

  const hasAllPermissions = useCallback((requiredPermissions: string[]): boolean => {
    if (!mounted) return false
    return requiredPermissions.every(permission => hasPermission(permission))
  }, [hasPermission, mounted])

  const userPermissions = useMemo(() => {
    if (!mounted || !isClient) {
      return []
    }

    try {
      let userPerms = null
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const stored = localStorage.getItem('userPermissions')
          if (stored) {
            userPerms = JSON.parse(stored)
          }
        } catch (e) {
          // localStorage erişim hatası
        }
      }

      if (!userPerms) {
        return []
      }

      if (Array.isArray(userPerms)) {
        return userPerms
      }

      if (typeof userPerms === 'object') {
        return Object.values(userPerms)
      }

      return []
    } catch (error) {
      console.error('Error getting user permissions:', error)
      return []
    }
  }, [mounted, isClient, refreshKey])

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions,
    loading: !mounted,
    refreshPermissions: () => setRefreshKey(prev => prev + 1)
  }
}

export default usePermissionCheck