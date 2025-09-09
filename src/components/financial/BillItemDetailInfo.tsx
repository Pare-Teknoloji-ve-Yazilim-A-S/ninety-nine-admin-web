'use client'

import { FileText } from 'lucide-react'
import Card from '@/app/components/ui/Card'
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
  notes?: string
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
  } | null
}

interface BillItemDetailInfoProps {
  billItem: BillItem
}

export function BillItemDetailInfo({ billItem }: BillItemDetailInfoProps) {
  return (
    <Card className="bg-background-card border border-primary-gold/20 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-gold/20 rounded-lg">
          <FileText className="h-5 w-5 text-primary-gold" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary font-helvetica">
          Temel Bilgiler
        </h2>
      </div>

      <div className="space-y-6">
        {/* Fatura ID */}
        <div>
          <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
            Fatura Kimliği
          </label>
          <p className="text-sm font-mono text-text-primary bg-background-secondary p-2 rounded border border-primary-gold/20">
            {billItem.id}
          </p>
        </div>

        {/* Başlık */}
        <div>
          <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
            Başlık
          </label>
          <p className="text-text-primary font-medium font-helvetica">
            {billItem.title}
          </p>
        </div>

        {/* Açıklama */}
        {billItem.description && (
          <div>
            <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
              Açıklama
            </label>
            <p className="text-text-primary font-inter">
              {billItem.description}
            </p>
          </div>
        )}

        {/* Notlar */}
        {billItem.notes && (
          <div>
            <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
              Notlar
            </label>
            <p className="text-text-primary font-inter">
              {billItem.notes}
            </p>
          </div>
        )}

        {/* Ödeme Yöntemi */}
        {billItem.paymentMethod && (
          <div>
            <label className="block text-sm font-medium text-text-secondary font-inter mb-1">
              Ödeme Yöntemi
            </label>
            <p className="text-text-primary font-inter">
              {billItem.paymentMethod}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}