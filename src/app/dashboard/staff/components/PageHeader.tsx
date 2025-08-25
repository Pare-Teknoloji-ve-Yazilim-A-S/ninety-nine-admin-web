'use client'

import React, { useState, useEffect } from 'react';
import Button from '@/app/components/ui/Button'
import { Plus, RefreshCw } from 'lucide-react'
import { usePermissionCheck } from '@/hooks/usePermissionCheck'
import { CREATE_STAFF_PERMISSION_ID } from '@/app/components/ui/Sidebar'

// Dil çevirileri
const translations = {
  tr: {
    refresh: 'Yenile',
    addNewStaff: 'Yeni Personel Ekle'
  },
  en: {
    refresh: 'Refresh',
    addNewStaff: 'Add New Staff'
  },
  ar: {
    refresh: 'تحديث',
    addNewStaff: 'إضافة موظف جديد'
  }
};

interface PageHeaderProps {
  title: string
  totalLabel?: string
  summary?: string
  onRefresh?: () => void
  onCreateNew?: () => void
}

export default function PageHeader({
  title,
  totalLabel,
  summary,
  onRefresh,
  onCreateNew,
}: PageHeaderProps) {
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

  // Permission kontrolü
  const { hasPermission } = usePermissionCheck();
  const hasCreateStaffPermission = hasPermission(CREATE_STAFF_PERMISSION_ID);

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
            {t.refresh}
          </Button>
        )}

        {onCreateNew && hasCreateStaffPermission && (
          <Button variant="primary" size="md" icon={Plus} onClick={onCreateNew}>
            {t.addNewStaff}
          </Button>
        )}
      </div>
    </div>
  )
}




