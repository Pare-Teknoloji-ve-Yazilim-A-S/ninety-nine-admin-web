'use client'

import { useEffect, useState } from 'react'
import { usePermissionCheck } from '@/hooks/usePermissionCheck'
import { 
  READ_BILLING_PERMISSION_ID, 
  READ_BILLING_PERMISSION_NAME,
  CREATE_BILLING_PERMISSION_ID,
  CREATE_BILLING_PERMISSION_NAME,
  UPDATE_BILLING_PERMISSION_ID,
  UPDATE_BILLING_PERMISSION_NAME
} from '@/app/components/ui/Sidebar'

interface Permission {
  id: string
  name: string
  description?: string
  action: string
  resource: string
  isSystem: boolean
}

export default function PermissionsDebugPage() {
  const { hasPermission, permissionLoading, mounted } = usePermissionCheck()
  const [localStorageData, setLocalStorageData] = useState<any>(null)
  const [parsedPermissions, setParsedPermissions] = useState<Permission[]>([])
  const [permissionIds, setPermissionIds] = useState<string[]>([])
  const [permissionNames, setPermissionNames] = useState<string[]>([])

  useEffect(() => {
    if (mounted) {
      try {
        const userPermissions = localStorage.getItem('userPermissions')
        setLocalStorageData(userPermissions)
        
        if (userPermissions) {
          const parsed = JSON.parse(userPermissions)
          setParsedPermissions(parsed)
          
          // Extract permission IDs and names
          if (Array.isArray(parsed)) {
            const ids = parsed.map((p: Permission) => p.id)
            const names = parsed.map((p: Permission) => p.name)
            setPermissionIds(ids)
            setPermissionNames(names)
          }
        }
      } catch (error) {
        console.error('Error parsing localStorage permissions:', error)
      }
    }
  }, [mounted])

  if (!mounted) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">İzin Debug Sayfası</h1>
      
      <div className="space-y-6">
        {/* Permission Loading Status */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Permission Hook Durumu</h2>
          <p>Loading: {permissionLoading ? 'Evet' : 'Hayır'}</p>
          <p>Mounted: {mounted ? 'Evet' : 'Hayır'}</p>
        </div>

        {/* LocalStorage Raw Data */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">LocalStorage Raw Data</h2>
          <pre className="text-sm bg-white p-2 rounded border overflow-auto max-h-40">
            {localStorageData || 'Veri bulunamadı'}
          </pre>
        </div>

        {/* Permission IDs and Names */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Kullanıcının İzin ID'leri</h2>
          <div className="text-sm space-y-1">
            {permissionIds.length > 0 ? (
              permissionIds.map((id, index) => (
                <div key={id} className="flex justify-between p-1 bg-white rounded">
                  <span className="font-mono">{id}</span>
                  <span className="text-gray-600">{permissionNames[index]}</span>
                </div>
              ))
            ) : (
              <p>İzin bulunamadı</p>
            )}
          </div>
        </div>

        {/* Billing Permission Check */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Fatura İzinleri Kontrolü</h2>
          <div className="text-sm space-y-2">
            <div className="p-2 bg-white rounded">
              <p className="font-semibold">READ_BILLING_PERMISSION_ID: {READ_BILLING_PERMISSION_ID}</p>
              <p>İzin listesinde var mı: {permissionIds.includes(READ_BILLING_PERMISSION_ID) ? '✅ Evet' : '❌ Hayır'}</p>
              <p>hasPermission sonucu: {hasPermission(READ_BILLING_PERMISSION_ID) ? '✅ True' : '❌ False'}</p>
            </div>
          </div>
        </div>

        {/* Parsed Permissions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Parse Edilmiş İzinler (Detaylı)</h2>
          <pre className="text-sm bg-white p-2 rounded border overflow-auto max-h-60">
            {JSON.stringify(parsedPermissions, null, 2) || 'Veri bulunamadı'}
          </pre>
        </div>

        {/* Specific Permission Checks */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-4">Belirli İzin Kontrolleri</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span>READ_BILLING ({READ_BILLING_PERMISSION_ID})</span>
              <span className={`px-2 py-1 rounded text-sm ${
                hasPermission(READ_BILLING_PERMISSION_ID) ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {hasPermission(READ_BILLING_PERMISSION_ID) ? 'GRANTED' : 'DENIED'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span>CREATE_BILLING ({CREATE_BILLING_PERMISSION_ID})</span>
              <span className={`px-2 py-1 rounded text-sm ${
                hasPermission(CREATE_BILLING_PERMISSION_ID) ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {hasPermission(CREATE_BILLING_PERMISSION_ID) ? 'GRANTED' : 'DENIED'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span>UPDATE_BILLING ({UPDATE_BILLING_PERMISSION_ID})</span>
              <span className={`px-2 py-1 rounded text-sm ${
                hasPermission(UPDATE_BILLING_PERMISSION_ID) ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {hasPermission(UPDATE_BILLING_PERMISSION_ID) ? 'GRANTED' : 'DENIED'}
              </span>
            </div>
          </div>
        </div>

        {/* Permission Constants */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">İzin Sabitleri</h2>
          <div className="text-sm space-y-1">
            <p>READ_BILLING_PERMISSION_ID: {READ_BILLING_PERMISSION_ID}</p>
            <p>READ_BILLING_PERMISSION_NAME: {READ_BILLING_PERMISSION_NAME}</p>
            <p>CREATE_BILLING_PERMISSION_ID: {CREATE_BILLING_PERMISSION_ID}</p>
            <p>CREATE_BILLING_PERMISSION_NAME: {CREATE_BILLING_PERMISSION_NAME}</p>
            <p>UPDATE_BILLING_PERMISSION_ID: {UPDATE_BILLING_PERMISSION_ID}</p>
            <p>UPDATE_BILLING_PERMISSION_NAME: {UPDATE_BILLING_PERMISSION_NAME}</p>
          </div>
        </div>
      </div>
    </div>
  )
}