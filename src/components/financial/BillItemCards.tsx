'use client'

import { useState, useEffect } from 'react'
import { FileText, ExternalLink } from 'lucide-react'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Skeleton from '@/app/components/ui/Skeleton'
import { apiClient } from '@/services/api/client'
import type { ResponseBillDto } from '@/services/types/billing.types'

interface BillItemCardsProps {
  billIds: string[]
}

interface BillCardData {
  id: string
  title: string
  amount: string
  status: string
  dueDate: string
  billType: string
  property?: {
    id: string
    name: string
    propertyNumber: string
  }
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
  } | null
}

export function BillItemCards({ billIds }: BillItemCardsProps) {
  const [bills, setBills] = useState<BillCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBills = async () => {
      if (!billIds || billIds.length === 0) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const billPromises = billIds.map(async (billId) => {
          try {
            const response = await apiClient.get<ResponseBillDto>(`/admin/billing/${billId}`)
            return (response as any)?.data || response
          } catch (err) {
            console.warn(`Could not fetch bill ${billId}:`, err)
            return null
          }
        })
        
        const billResults = await Promise.all(billPromises)
        const validBills = billResults.filter((bill): bill is ResponseBillDto => bill !== null)
        
        setBills(validBills.map(bill => ({
          id: bill.id,
          title: bill.title,
          amount: bill.amount,
          status: String(bill.status),
          dueDate: bill.dueDate,
          billType: String(bill.billType),
          property: bill.property,
          assignedTo: bill.assignedTo || null
        })))
      } catch (err) {
        console.error('Error fetching bills:', err)
        setError('Faturalar yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchBills()
  }, [billIds])

  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount)
    return `${numAmount.toLocaleString('tr-TR')} IQD`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'PAID': { label: 'Ödendi', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      'PENDING': { label: 'Beklemede', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      'OVERDUE': { label: 'Gecikmiş', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
      'PARTIALLY_PAID': { label: 'Kısmi Ödendi', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      'CANCELLED': { label: 'İptal', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' }
    }
    
    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  const getBillTypeLabel = (billType: string) => {
    const typeMap: Record<string, string> = {
      'DUES': 'Aidat',
      'MAINTENANCE': 'Bakım',
      'UTILITY': 'Fayda',
      'PENALTY': 'Ceza',
      'OTHER': 'Diğer'
    }
    return typeMap[billType] || billType
  }

  const handleViewBill = (billId: string) => {
    window.location.href = `/dashboard/financial/${billId}`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {billIds.map((_, index) => (
          <Skeleton key={index} className="h-48 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="text-red-500 mb-2">{error}</div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
        >
          Tekrar Dene
        </Button>
      </Card>
    )
  }

  if (bills.length === 0) {
    return (
      <Card className="p-6 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">Fatura Bulunamadı</h3>
        <p className="text-text-secondary">Bu toplu ödeme için fatura bilgileri bulunamadı.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bills.map((bill, index) => (
        <Card key={bill.id} className="bg-background-card border border-primary-gold/20 shadow-card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-gold/20 rounded-lg">
                <FileText className="h-5 w-5 text-primary-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary font-helvetica">
                  Fatura #{index + 1}
                </h3>
                <p className="text-sm text-text-secondary">
                  {getBillTypeLabel(bill.billType)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(bill.status)}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewBill(bill.id)}
                className="ml-2"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Detay
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fatura Bilgileri */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
                  Fatura Başlığı
                </label>
                <p className="text-text-primary font-medium font-helvetica">
                  {bill.title}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
                  Tutar
                </label>
                <p className="text-xl font-bold text-primary-gold font-helvetica">
                  {formatAmount(bill.amount)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
                  Vade Tarihi
                </label>
                <p className="text-text-primary font-inter">
                  {formatDate(bill.dueDate)}
                </p>
              </div>
            </div>

            {/* Mülk ve Kişi Bilgileri */}
            <div className="space-y-3">
              {bill.property && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
                    Mülk
                  </label>
                  <p className="text-text-primary font-inter">
                    {bill.property.propertyNumber} - {bill.property.name}
                  </p>
                </div>
              )}
              
              {bill.assignedTo && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
                    Atanan Kişi
                  </label>
                  <p className="text-text-primary font-inter">
                    {bill.assignedTo.firstName} {bill.assignedTo.lastName}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
                  Fatura ID
                </label>
                <p className="text-xs font-mono text-text-secondary bg-background-secondary p-2 rounded border border-primary-gold/20">
                  {bill.id}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}