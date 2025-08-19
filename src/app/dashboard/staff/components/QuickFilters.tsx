'use client'

import React, { useState, useEffect } from 'react';
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Label from '@/app/components/ui/Label'
import type { QuickFilter } from '@/services/types/ui.types'

// Dil çevirileri
const translations = {
  tr: {
    quickFilters: 'Hızlı Filtreler'
  },
  en: {
    quickFilters: 'Quick Filters'
  },
  ar: {
    quickFilters: 'المرشحات السريعة'
  }
};

interface QuickFiltersProps {
  quickFilters: QuickFilter[]
  onApply: (key: string) => void
}

export default function QuickFilters({ quickFilters, onApply }: QuickFiltersProps) {
  // Dil tercihini localStorage'dan al
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

  if (!quickFilters?.length) return null
  return (
    <Card className="w-full" padding="md">
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t.quickFilters}</Label>
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




