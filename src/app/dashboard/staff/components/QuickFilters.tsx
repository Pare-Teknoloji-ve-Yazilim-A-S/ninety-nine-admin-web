'use client'

import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Label from '@/app/components/ui/Label'
import type { QuickFilter } from '@/services/types/ui.types'

interface QuickFiltersProps {
  quickFilters: QuickFilter[]
  onApply: (key: string) => void
}

export default function QuickFilters({ quickFilters, onApply }: QuickFiltersProps) {
  if (!quickFilters?.length) return null
  return (
    <Card className="w-full" padding="md">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Hızlı Filtreler</Label>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((qf) => (
            <Button key={qf.key} variant="outline" size="sm" onClick={() => onApply(qf.key)} className="h-8">
              <span>
                {qf.label}
                <span className="ml-1 text-xs text-text-light-muted dark:text-text-muted">({qf.count})</span>
              </span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}



