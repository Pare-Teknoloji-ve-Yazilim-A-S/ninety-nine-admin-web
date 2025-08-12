'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import Sidebar from '@/app/components/ui/Sidebar';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';

interface StaffLayoutProps {
  children: React.ReactNode
}

function StaffLayout ({ children }: StaffLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Personel Yönetimi', href: '/dashboard/staff' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        {/* Sidebar - same structure as residents page */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="lg:ml-72">
          {/* Header - same component usage as residents */}
          <DashboardHeader
            title="Personel Yönetimi"
            breadcrumbItems={breadcrumbItems}
          />

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="px-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default StaffLayout


