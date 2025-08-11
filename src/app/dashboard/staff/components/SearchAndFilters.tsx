'use client'

import React from 'react'
import Card from '@/app/components/ui/Card'
import Input from '@/app/components/ui/Input'
import Button from '@/app/components/ui/Button'
import { Grid, List, Search, Filter } from 'lucide-react'

interface SearchAndFiltersProps {
  searchQuery: string
  onSearch: (query: string) => void
  viewMode: 'table' | 'grid'
  onViewModeChange: (mode: 'table' | 'grid') => void
  onOpenFilters: () => void
}

export default function SearchAndFilters({
  searchQuery,
  onSearch,
  viewMode,
  onViewModeChange,
  onOpenFilters,
}: SearchAndFiltersProps) {
  return (
    <Card className="w-full" padding="md">
      <div className="flex items-center gap-3">
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
        <Button variant="outline" size="sm" onClick={onOpenFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Filtreler
        </Button>
        <div className="flex items-center rounded-md">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="rounded-r-none"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-l-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}


