'use client'

import { ArrowLeft } from 'lucide-react'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Badge from '@/app/components/ui/Badge'
// Local BillItem interface
interface BillItem {
  id: string
  title: string
  amount: number | string
  currency?: string
  status?: string
  dueDate?: string
  createdAt?: string
  updatedAt?: string
  description?: string
  billType?: string
  paidAt?: string
  paymentMethod?: string
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
  } | null
}

interface BillItemDetailHeaderProps {
  billItem: BillItem
  onGoBack: () => void
}

export function BillItemDetailHeader({ billItem, onGoBack }: BillItemDetailHeaderProps) {
  const getStatusVariant = (status: string) => {
    const s = status?.toLowerCase?.() || ''
    if (s === 'paid' || s === 'ödendi') return 'success'
    if (s === 'pending' || s === 'beklemede') return 'warning'
    if (s === 'overdue' || s === 'gecikmiş') return 'destructive'
    return 'secondary'
  }

  const formatAmount = (amount: string | number, currency?: string) => {
    const currencyCode = currency || 'IQD'
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return `${numAmount.toLocaleString('tr-TR')} ${currencyCode}`
  }

  return (
    <Card className="bg-background-card border border-primary-gold/20 shadow-card">
      <div className="flex flex-col space-y-4">
        {/* Back button and title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoBack}
              className="flex items-center space-x-2 text-text-primary hover:text-primary-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Geri Dön</span>
            </Button>
          </div>
          <Badge variant="success">
            Ödendi
          </Badge>
        </div>

        {/* Main header content */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary font-helvetica">
              Toplu Fatura Detayı
            </h1>
            <p className="text-lg text-text-secondary font-inter mt-1">
              {billItem.title}
            </p>
            {billItem.description && (
              <p className="text-sm text-text-muted font-inter mt-2">
                {billItem.description}
              </p>
            )}
          </div>
          
          {/* Amount display */}
          <div className="text-right">
            <div className="text-sm text-text-secondary font-inter">Toplam Tutar</div>
            <div className="text-3xl font-bold text-primary-gold font-helvetica">
              {formatAmount(billItem.amount, billItem.currency)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}