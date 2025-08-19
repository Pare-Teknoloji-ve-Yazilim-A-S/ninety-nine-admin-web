'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/app/components/ui/Card'
import Input from '@/app/components/ui/Input'
import Button from '@/app/components/ui/Button'
import { Search, Filter } from 'lucide-react'

// Dil çevirileri
const translations = {
  tr: {
    searchPlaceholder: 'Personel ara...',
    filters: 'Filtreler'
  },
  en: {
    searchPlaceholder: 'Search staff...',
    filters: 'Filters'
  },
  ar: {
    searchPlaceholder: 'البحث في الموظفين...',
    filters: 'المرشحات'
  }
};

interface SearchAndFiltersProps {
  searchQuery: string
  onSearch: (query: string) => void
  onOpenFilters: () => void
}

export default function SearchAndFilters({
  searchQuery,
  onSearch,
  onOpenFilters,
}: SearchAndFiltersProps) {
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

  return (
    <Card className="w-full" padding="md">
      <div className="flex items-center gap-3 relative z-[1]">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light-muted dark:text-text-muted" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenFilters} className="relative z-[5]">
          <Filter className="h-4 w-4 mr-2" />
          {t.filters}
        </Button>
      </div>
    </Card>
  )
}


