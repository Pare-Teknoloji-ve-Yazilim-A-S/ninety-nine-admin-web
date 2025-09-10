'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Skeleton from '@/app/components/ui/Skeleton'
import EmptyState from '@/app/components/ui/EmptyState'
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute'
import DashboardHeader from '@/app/dashboard/components/DashboardHeader'
import Sidebar from '@/app/components/ui/Sidebar'
import billingService from '@/services/billing.service'

// Import detail components
import { BillItemDetailHeader } from '@/components/financial/BillItemDetailHeader'
import { BillItemCards } from '@/components/financial/BillItemCards'
import { BillItemDetailFinancial } from '@/components/financial/BillItemDetailFinancial'
import { BillItemDetailDates } from '@/components/financial/BillItemDetailDates'
import { BillItemDetailRelated } from '@/components/financial/BillItemDetailRelated'

interface BillItemDetail {
  id: string
  billIds?: string[]
  title: string
  description?: string
  amount: string
  currency?: string
  createdAt: string
  updatedAt: string
  status?: string
  unitId?: string
  residentId?: string
  dueDate?: string
  paidAt?: string
  paymentMethod?: string
  notes?: string
}

function BillItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [billItem, setBillItem] = useState<BillItemDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const billItemId = params.id as string

  useEffect(() => {
    const fetchBillItemDetail = async () => {
      if (!billItemId) return

      try {
        setLoading(true)
        setError(null)
        
        const resp = await billingService.getBillItemById(billItemId)
        // ...
        const root: any = resp as any
        const item = root?.data?.data ?? root?.data ?? root
         if (item && item.id) {
           setBillItem(item as BillItemDetail)
         } else {
           setError('Aradığınız fatura bulunamadı veya erişim yetkiniz bulunmuyor.')
         }
      } catch (err) {
        console.error('Error fetching bill item detail:', err)
        setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchBillItemDetail()
  }, [billItemId])

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleGoBack = () => {
    router.back()
  }

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/dashboard' },
    { label: 'Finansal İşlemler', href: '/dashboard/financial' },
    { label: 'Fatura Detayı', active: true }
  ]

  // Loading durumu
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="lg:ml-72">
            <DashboardHeader
              title="Fatura Detayı"
              breadcrumbItems={breadcrumbItems}
            />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-6">
                {/* Header skeleton */}
                <Skeleton className="h-32 w-full" />
                
                {/* Content grid skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                  <div className="space-y-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Hata durumu veya fatura bulunamadı
  if (error || !billItem) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="lg:ml-72">
            <DashboardHeader
              title="Fatura Detayı"
              breadcrumbItems={breadcrumbItems}
            />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Card className="p-6">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    {error ? 'Hata Oluştu' : 'Fatura Bulunamadı'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {error || 'Aradığınız fatura bulunamadı veya erişim yetkiniz bulunmuyor.'}
                  </p>
                  <div className="mt-6">
                    <Button
                      variant="primary"
                      onClick={handleGoBack}
                    >
                      Geri Dön
                    </Button>
                  </div>
                </div>
              </Card>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:ml-72">
          <DashboardHeader
            title="Fatura Detayı"
            breadcrumbItems={breadcrumbItems}
          />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {/* Header */}
              <BillItemDetailHeader
                billItem={billItem}
                onGoBack={handleGoBack}
              />

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Bill Cards */}
                  {billItem.billIds && billItem.billIds.length > 0 ? (
                    <BillItemCards billIds={billItem.billIds} />
                  ) : (
                    <Card className="p-6 text-center">
                      <p className="text-text-secondary">Bu toplu ödeme için fatura bilgileri bulunamadı.</p>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Dates */}
                  <BillItemDetailDates billItem={billItem} />
                  
                  {/* Related Records */}
                  <BillItemDetailRelated billItem={billItem} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default BillItemDetailPage