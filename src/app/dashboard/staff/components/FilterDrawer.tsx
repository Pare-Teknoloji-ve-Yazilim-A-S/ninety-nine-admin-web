'use client'

import React, { useState, useEffect } from 'react';
import Drawer from '@/app/components/ui/Drawer'
import StaffFilters from '@/components/staff/StaffFilters'
import type { StaffFilterParams } from '@/services/types/staff.types'
import type { Department, Position } from '@/services/types/department.types'
import type { QuickFilter, SavedFilter } from '@/services/types/ui.types'

// Dil çevirileri
const translations = {
  tr: {
    filters: 'Filtreler'
  },
  en: {
    filters: 'Filters'
  },
  ar: {
    filters: 'المرشحات'
  }
};

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  filters: StaffFilterParams
  departments: Department[]
  positions: Position[]
  quickFilters: QuickFilter[]
  savedFilters: SavedFilter[]
  onFiltersChange: (filters: StaffFilterParams) => void
  onQuickFilterApply: (key: string) => void
  onSaveFilter: (name: string, filters: StaffFilterParams) => void
  onDeleteSavedFilter: (id: string) => void
  onExportFilters: () => void
  onImportFilters: (file: File) => void
  onReset: () => void
}

export default function FilterDrawer({
  open,
  onClose,
  filters,
  departments,
  positions,
  quickFilters,
  savedFilters,
  onFiltersChange,
  onQuickFilterApply,
  onSaveFilter,
  onDeleteSavedFilter,
  onExportFilters,
  onImportFilters,
  onReset,
}: FilterDrawerProps) {
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
    <Drawer isOpen={open} onClose={onClose} title={t.filters} size="lg" position="right">
      <StaffFilters
        filters={filters}
        departments={departments}
        positions={positions}
        quickFilters={quickFilters}
        savedFilters={savedFilters}
        onFiltersChange={onFiltersChange}
        onQuickFilterApply={onQuickFilterApply}
        onSaveFilter={onSaveFilter}
        onDeleteSavedFilter={onDeleteSavedFilter}
        onExportFilters={onExportFilters}
        onImportFilters={onImportFilters}
        onReset={onReset}
      />
    </Drawer>
  )
}




