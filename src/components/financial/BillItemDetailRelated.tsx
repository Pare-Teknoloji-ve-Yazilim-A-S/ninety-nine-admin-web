'use client'

import { Building, User, ExternalLink } from 'lucide-react'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
// Local BillItem interface
interface BillItem {
  id: string
  title: string
  amount: string | number
  currency?: string
  status?: string
  dueDate?: string
  createdAt?: string
  updatedAt?: string
  billType?: string
  unitId?: string
  residentId?: string
  paidAt?: string
  paymentMethod?: string
  notes?: string
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
  } | null
}

interface BillItemDetailRelatedProps {
  billItem: BillItem
}

export function BillItemDetailRelated({ billItem }: BillItemDetailRelatedProps) {
  // İlişkili kayıt yoksa bileşeni gösterme
  if (!billItem.unitId && !billItem.residentId) {
    return null
  }

  const handleViewUnit = () => {
    if (billItem.unitId) {
      window.open(`/dashboard/units/${billItem.unitId}`, '_blank')
    }
  }

  const handleViewResident = () => {
    if (billItem.residentId) {
      window.open(`/dashboard/residents/${billItem.residentId}`, '_blank')
    }
  }

  return (
    <Card className="bg-background-card border border-primary-gold/20 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-gold/20 rounded-lg">
          <Building className="h-5 w-5 text-primary-gold" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary font-helvetica">
          İlişkili Bilgiler
        </h2>
      </div>

      <div className="space-y-4">
        {/* Birim Bilgisi */}
        {billItem.unitId && (
          <div className="p-4 bg-background-secondary rounded-lg border border-primary-gold/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-primary-gold" />
                <div>
                  <p className="text-sm font-medium text-text-secondary font-inter">Birim</p>
                  <p className="text-text-primary font-medium font-helvetica">
                    {billItem.unitId}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewUnit}
                className="flex items-center space-x-2 border-primary-gold/30 text-primary-gold hover:bg-primary-gold/10"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Görüntüle</span>
              </Button>
            </div>
          </div>
        )}

        {/* Sakin Bilgisi */}
        {billItem.residentId && (
          <div className="p-4 bg-background-secondary rounded-lg border border-primary-gold/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-primary-gold" />
                <div>
                  <p className="text-sm font-medium text-text-secondary font-inter">Sakin</p>
                  <p className="text-text-primary font-medium font-helvetica">
                    {billItem.residentId}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewResident}
                className="flex items-center space-x-2 border-primary-gold/30 text-primary-gold hover:bg-primary-gold/10"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Görüntüle</span>
              </Button>
            </div>
          </div>
        )}

        {/* Bilgi Notu */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded border border-blue-200 dark:border-blue-800">
          <p>
            Bu fatura kaydı yukarıdaki birim ve/veya sakin kayıtlarıyla ilişkilendirilmiştir. 
            Detayları görüntülemek için "Görüntüle" butonlarını kullanabilirsiniz.
          </p>
        </div>
      </div>
    </Card>
  )
}