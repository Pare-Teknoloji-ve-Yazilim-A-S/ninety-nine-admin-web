'use client'

import Button from '@/app/components/ui/Button'
import { Plus, RefreshCw, Settings } from 'lucide-react'

interface PageHeaderProps {
  title: string
  totalLabel?: string
  summary?: string
  onRefresh?: () => void
  onOpenSettings?: () => void
  onCreateNew?: () => void
}

export default function PageHeader({
  title,
  totalLabel,
  summary,
  onRefresh,
  onOpenSettings,
  onCreateNew,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
          {title} {totalLabel && (<span className="text-primary-gold">({totalLabel})</span>)}
        </h2>
        {summary && (
          <p className="text-text-light-secondary dark:text-text-secondary">{summary}</p>
        )}
      </div>
      <div className="flex gap-3">
        {onRefresh && (
          <Button variant="ghost" size="md" icon={RefreshCw} onClick={onRefresh}>
            Yenile
          </Button>
        )}
        {onOpenSettings && (
          <Button variant="primary" size="md" icon={Settings} onClick={onOpenSettings}>
            Rol Ayarları
          </Button>
        )}
        {onCreateNew && (
          <Button variant="primary" size="md" icon={Plus} onClick={onCreateNew}>
            Yeni Personel
          </Button>
        )}
      </div>
    </div>
  )
}



