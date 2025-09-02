import React, { useState, useEffect } from 'react'
import type { Staff } from '@/services/types/staff.types'
import type { Column } from '@/app/components/ui/DataTable'
import Button from '@/app/components/ui/Button'
import { ChevronRight } from 'lucide-react'
import Avatar from '@/app/components/ui/Avatar'
import Badge from '@/app/components/ui/Badge'
import { getStaffStatusConfig, getEmploymentTypeConfig } from '@/services/types/ui.types'

// Dil çevirileri
const translations = {
  tr: {
    // Table headers
    staff: 'Personel',
    position: 'Pozisyon',
    department: 'Departman',
    status: 'Durum',
    employmentType: 'İstihdam Türü',
    startDate: 'İşe Başlama',
    
    // Tooltips
    detail: 'Detay'
  },
  en: {
    // Table headers
    staff: 'Staff',
    position: 'Position',
    department: 'Department',
    status: 'Status',
    employmentType: 'Employment Type',
    startDate: 'Start Date',
    
    // Tooltips
    detail: 'Detail'
  },
  ar: {
    // Table headers
    staff: 'الموظف',
    position: 'المنصب',
    department: 'القسم',
    status: 'الحالة',
    employmentType: 'نوع التوظيف',
    startDate: 'تاريخ البدء',
    
    // Tooltips
    detail: 'التفاصيل'
  }
};

export function getTableColumns({ onView, canViewDetail = true }: { onView: (s: Staff) => void, canViewDetail?: boolean }): Column[] {
  // Dil tercihini localStorage'dan al
  const currentLanguage = typeof window !== 'undefined' ? localStorage.getItem('preferredLanguage') || 'tr' : 'tr';
  const t = translations[currentLanguage as keyof typeof translations];
  
  // i18n config'leri al
  const staffStatusConfig = getStaffStatusConfig(currentLanguage);
  const employmentTypeConfig = getEmploymentTypeConfig(currentLanguage);

  const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString('tr-TR') : '-')

  return [
    {
      id: 'personel',
      header: t.staff,
      accessor: (row: Staff) => row,
      minWidth: '200px',
      render: (_: any, row: Staff) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={row.avatar}
            alt={`${row.firstName} ${row.lastName}`}
            fallback={`${row.firstName?.[0] ?? ''}${row.lastName?.[0] ?? ''}`.toUpperCase()}
            size="sm"
            className="h-7 w-7 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{row.firstName} {row.lastName}</div>
            <div className="text-xs text-text-light-muted dark:text-text-muted truncate">{row.email || '-'}</div>
          </div>
        </div>
      )
    },
    {
      id: 'position',
      header: t.position,
      accessor: (row: Staff) => row.position?.title || '-',
      minWidth: '140px'
    },
    {
      id: 'department',
      header: t.department,
      accessor: (row: Staff) => row.department?.name || '-',
      minWidth: '140px'
    },
    {
      id: 'status',
      header: t.status,
      accessor: (row: Staff) => row.status,
      render: (value: any) => {
        const cfg = staffStatusConfig[value as keyof typeof staffStatusConfig] || { label: String(value), variant: 'default' }
        return <Badge variant={cfg.variant as any}>{cfg.label}</Badge>
      },
      minWidth: '120px'
    },
    {
      id: 'employmentType',
      header: t.employmentType,
      accessor: (row: Staff) => row.employmentType,
      render: (value: any) => {
        const cfg = employmentTypeConfig[value as keyof typeof employmentTypeConfig] || { label: String(value), variant: 'outline' }
        return <Badge variant={cfg.variant as any}>{cfg.label}</Badge>
      },
      minWidth: '120px'
    },
    {
      id: 'startDate',
      header: t.startDate,
      accessor: (row: Staff) => row.startDate,
      render: (value: string) => formatDate(value),
      minWidth: '100px'
    },
    {
      id: 'actions',
      header: '',
      accessor: (row: Staff) => row,
      minWidth: '80px',
      render: (_: any, row: Staff) => {
        if (!canViewDetail) {
          return <div className="flex items-center justify-end" />
        }
        const targetId = String((row as any)?.id ?? (row as any)?.employeeId)
        return (
          <div className="flex items-center justify-end">
            <a href={`/dashboard/staff/${targetId}`} title={t.detail} className="inline-flex">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation()
                  onView(row)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        )
      }
    }
  ]
}


