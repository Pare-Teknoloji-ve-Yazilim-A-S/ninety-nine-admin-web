'use client'

import { Calendar, Clock } from 'lucide-react'
import Card from '@/app/components/ui/Card'
interface BillItem {
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
  billType?: string
}

interface BillItemDetailDatesProps {
  billItem: BillItem
}

export function BillItemDetailDates({ billItem }: BillItemDetailDatesProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Bugün'
    if (diffInDays === 1) return 'Dün'
    if (diffInDays < 7) return `${diffInDays} gün önce`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} hafta önce`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} ay önce`
    return `${Math.floor(diffInDays / 365)} yıl önce`
  }

  return (
    <Card className="bg-background-card border border-primary-gold/20 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-gold/20 rounded-lg">
          <Calendar className="h-5 w-5 text-primary-gold" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary font-helvetica">
          Tarih Bilgileri
        </h2>
      </div>

      <div className="space-y-6">
        {/* Oluşturulma Tarihi */}
        <div>
          <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
            Oluşturulma Tarihi
          </label>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-text-primary">
              <Clock className="h-4 w-4 text-primary-gold" />
              <span className="font-inter">{formatDate(billItem.createdAt)}</span>
            </div>
            <p className="text-sm text-text-secondary">
              {formatRelativeDate(billItem.createdAt)}
            </p>
          </div>
        </div>

        {/* Güncellenme Tarihi */}
        <div>
          <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
            Son Güncellenme
          </label>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-text-primary">
              <Clock className="h-4 w-4 text-primary-gold" />
              <span className="font-inter">{formatDate(billItem.updatedAt)}</span>
            </div>
            <p className="text-sm text-text-secondary">
              {formatRelativeDate(billItem.updatedAt)}
            </p>
          </div>
        </div>

        {/* Vade Tarihi */}
        {billItem.dueDate && (
          <div>
            <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
              Vade Tarihi
            </label>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-text-primary">
                <Calendar className="h-4 w-4 text-primary-gold" />
                <span className="font-inter">{formatDate(billItem.dueDate)}</span>
              </div>
              <p className="text-sm text-text-secondary">
                {new Date(billItem.dueDate) > new Date() 
                  ? `${Math.ceil((new Date(billItem.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} gün kaldı`
                  : 'Vadesi geçmiş'
                }
              </p>
            </div>
          </div>
        )}

        {/* Ödeme Tarihi */}
        {billItem.paidAt && (
          <div>
            <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
              Ödeme Tarihi
            </label>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-text-primary">
                <Calendar className="h-4 w-4 text-green-500" />
                <span className="font-inter">{formatDate(billItem.paidAt)}</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Ödeme tamamlandı
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}