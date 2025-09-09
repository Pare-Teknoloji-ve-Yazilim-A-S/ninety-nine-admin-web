'use client'

import { DollarSign, CreditCard, TrendingUp, Calendar } from 'lucide-react'
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

interface BillItemDetailFinancialProps {
  billItem: BillItem
}

export function BillItemDetailFinancial({ billItem }: BillItemDetailFinancialProps) {
  const formatAmount = (amount: string | number, currency?: string) => {
    const currencyCode = currency || 'IQD'
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return `${numAmount.toLocaleString('tr-TR')} ${currencyCode}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusVariant = (status?: string) => {
    const s = status?.toLowerCase?.() || ''
    if (s === 'paid' || s === 'ödendi') return 'success'
    if (s === 'pending' || s === 'beklemede') return 'warning'
    if (s === 'overdue' || s === 'gecikmiş') return 'danger'
    return 'secondary'
  }

  return (
    <Card className="bg-background-card border border-primary-gold/20 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-gold/20 rounded-lg">
          <DollarSign className="h-5 w-5 text-primary-gold" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary font-helvetica">
          Mali Bilgiler
        </h2>
      </div>

      <div className="space-y-6">
        {/* Durum */}
        <div>
          <label className="block text-sm font-medium text-text-secondary font-inter mb-2">
            Durum
          </label>
          <Badge variant={getStatusVariant(billItem.status)} className="text-sm">
            {billItem.status}
          </Badge>
        </div>

        {/* Tutar */}
        <div>
          <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
            Toplam Tutar
          </label>
          <p className="text-2xl font-bold text-primary-gold font-helvetica">
            {formatAmount(billItem.amount, billItem.currency)}
          </p>
        </div>

        {/* Vade Tarihi */}
        {billItem.dueDate && (
          <div>
            <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
              Vade Tarihi
            </label>
            <div className="flex items-center space-x-2 text-text-primary">
              <Calendar className="h-4 w-4 text-primary-gold" />
              <span className="font-inter">{formatDate(billItem.dueDate)}</span>
            </div>
          </div>
        )}

        {/* Ödeme Tarihi */}
        {billItem.paidAt && (
          <div>
            <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
              Ödeme Tarihi
            </label>
            <div className="flex items-center space-x-2 text-text-primary">
              <Calendar className="h-4 w-4 text-primary-gold" />
              <span className="font-inter">{formatDate(billItem.paidAt)}</span>
            </div>
          </div>
        )}

        {/* Ödeme Yöntemi */}
        {billItem.paymentMethod && (
          <div>
            <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
              Ödeme Yöntemi
            </label>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-primary-gold" />
              <span className="text-text-primary font-inter">{billItem.paymentMethod}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}