'use client'

import React from 'react'
import Card from '@/app/components/ui/Card'
import Input from '@/app/components/ui/Input'
import Button from '@/app/components/ui/Button'
import { Search, Filter } from 'lucide-react'

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
  return (
    <Card className="w-full" padding="md">
      <div className="flex items-center gap-3 relative z-[1]">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light-muted dark:text-text-muted" />
            <Input
              placeholder="Personel ara..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenFilters} className="relative z-[5]">
          <Filter className="h-4 w-4 mr-2" />
          Filtreler
        </Button>
      </div>
    </Card>
  )
}


