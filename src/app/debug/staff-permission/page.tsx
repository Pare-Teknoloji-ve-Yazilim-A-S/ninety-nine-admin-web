'use client'

import React, { useState, useEffect } from 'react'
import { usePermissionCheck } from '@/hooks/usePermissionCheck'
import { CREATE_STAFF_PERMISSION_ID } from '@/app/components/ui/Sidebar'

export default function StaffPermissionDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const { hasPermission, userPermissions, loading } = usePermissionCheck()
  const hasCreateStaffPermission = hasPermission(CREATE_STAFF_PERMISSION_ID)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPermissions = localStorage.getItem('user_permissions')
      const parsedPermissions = storedPermissions ? JSON.parse(storedPermissions) : []
      
      const createStaffPerm = parsedPermissions.find((p: any) => 
        p.id === CREATE_STAFF_PERMISSION_ID || p.name === 'Create Staff'
      )
      
      const createStaffPermissionExists = userPermissions.some(p => 
        p.id === CREATE_STAFF_PERMISSION_ID || p.name === 'Create Staff'
      )
      
      setDebugInfo({
        storedPermissions: parsedPermissions,
        createStaffPermission: createStaffPerm,
        createStaffPermissionExists,
        hookUserPermissions: userPermissions,
        hasCreateStaffPermission,
        loading,
        CREATE_STAFF_PERMISSION_ID
      })
      
      setDebugInfo({
        storedPermissions: parsedPermissions,
        createStaffPermission: createStaffPerm,
        hookUserPermissions: userPermissions,
        hasCreateStaffPermission,
        loading,
        CREATE_STAFF_PERMISSION_ID
      })
    }
  }, [userPermissions, hasCreateStaffPermission, loading])

  if (loading) {
    return <div className="p-8">Loading permissions...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Staff Permission Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Permission Check Result</h2>
          <p className="text-sm">
            <strong>Has CREATE_STAFF Permission:</strong> 
            <span className={hasCreateStaffPermission ? 'text-green-600' : 'text-red-600'}>
              {hasCreateStaffPermission ? 'YES' : 'NO'}
            </span>
          </p>
          <p className="text-sm mt-1">
            <strong>Permission ID:</strong> {CREATE_STAFF_PERMISSION_ID}
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-96">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Test Button</h2>
          <p className="text-sm mb-2">Bu buton CREATE_STAFF izni varsa görünür olmalı:</p>
          {hasCreateStaffPermission ? (
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Yeni Personel Oluştur (İzin Var)
            </button>
          ) : (
            <p className="text-red-600">Buton görünmüyor - İzin yok</p>
          )}
        </div>
      </div>
    </div>
  )
}