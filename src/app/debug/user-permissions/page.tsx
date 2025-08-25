'use client';

import React, { useEffect, useState } from 'react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import {
  CREATE_BILLING_PERMISSION_ID,
  CREATE_PAYMENT_PERMISSION_ID,
  READ_BILLING_PERMISSION_ID
} from '@/app/components/ui/Sidebar';

const UserPermissionsDebug: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [rawPermissions, setRawPermissions] = useState<any>(null);
  const { hasPermission, userPermissions } = usePermissionCheck();

  useEffect(() => {
    setMounted(true);
    
    // localStorage'dan raw permissions'ı al
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('userPermissions');
        if (stored) {
          setRawPermissions(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error parsing permissions:', e);
      }
    }
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const testPermissions = [
    { id: CREATE_BILLING_PERMISSION_ID, name: 'CREATE_BILLING' },
    { id: CREATE_PAYMENT_PERMISSION_ID, name: 'CREATE_PAYMENT' },
    { id: READ_BILLING_PERMISSION_ID, name: 'READ_BILLING' }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Permissions Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Raw localStorage Data:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(rawPermissions, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Processed User Permissions:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(userPermissions, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Permission Tests:</h2>
          <div className="space-y-2">
            {testPermissions.map((perm) => (
              <div key={perm.id} className="flex items-center justify-between">
                <span className="font-mono text-sm">{perm.name}</span>
                <span className="font-mono text-sm">{perm.id}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  hasPermission(perm.id) 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {hasPermission(perm.id) ? 'ALLOWED' : 'DENIED'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Permission IDs:</h2>
          <div className="space-y-1 text-sm font-mono">
            <div>CREATE_BILLING_PERMISSION_ID: {CREATE_BILLING_PERMISSION_ID}</div>
            <div>CREATE_PAYMENT_PERMISSION_ID: {CREATE_PAYMENT_PERMISSION_ID}</div>
            <div>READ_BILLING_PERMISSION_ID: {READ_BILLING_PERMISSION_ID}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionsDebug;