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
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="lg:ml-72">
          {/* Header */}
          <DashboardHeader 
            title="Personel Yönetimi" 
            breadcrumbItems={breadcrumbItems} 
          />

          {/* Main Content */}
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default StaffLayout


