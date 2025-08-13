import React from 'react'
import type { Staff } from '@/services/types/staff.types'
import type { Column } from '@/app/components/ui/DataTable'
import Button from '@/app/components/ui/Button'
import { ChevronRight } from 'lucide-react'
import Avatar from '@/app/components/ui/Avatar'
import Badge from '@/app/components/ui/Badge'
import { STAFF_STATUS_CONFIG, EMPLOYMENT_TYPE_CONFIG } from '@/services/types/ui.types'

export function getTableColumns({ onView }: { onView: (s: Staff) => void }): Column[] {
  const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString('tr-TR') : '-')
  const formatSalary = (n?: number) => (typeof n === 'number' ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(n) : '-')

  return [
    {
      id: 'personel',
      header: 'Personel',
      accessor: (row: Staff) => row,
      minWidth: '220px',
      render: (_: any, row: Staff) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.avatar}
            alt={`${row.firstName} ${row.lastName}`}
            fallback={`${row.firstName?.[0] ?? ''}${row.lastName?.[0] ?? ''}`.toUpperCase()}
            size="sm"
            className="h-8 w-8"
          />
          <div>
            <div className="font-medium">{row.firstName} {row.lastName}</div>
            <div className="text-xs text-text-light-muted dark:text-text-muted">{row.email || '-'}</div>
          </div>
        </div>
      )
    },
    {
      id: 'position',
      header: 'Pozisyon',
      accessor: (row: Staff) => row.position?.title || '-',
      minWidth: '160px'
    },
    {
      id: 'department',
      header: 'Departman',
      accessor: (row: Staff) => row.department?.name || '-',
      minWidth: '160px'
    },
    {
      id: 'status',
      header: 'Durum',
      accessor: (row: Staff) => row.status,
      render: (value: any) => {
        const cfg = STAFF_STATUS_CONFIG[value] || { label: String(value), variant: 'default' }
        return <Badge variant={cfg.variant as any}>{cfg.label}</Badge>
      },
      minWidth: '120px'
    },
    {
      id: 'employmentType',
      header: 'İstihdam Türü',
      accessor: (row: Staff) => row.employmentType,
      render: (value: any) => <Badge variant="outline">{EMPLOYMENT_TYPE_CONFIG[value]?.label || String(value)}</Badge>,
      minWidth: '140px'
    },
    {
      id: 'startDate',
      header: 'İşe Başlama',
      accessor: (row: Staff) => row.startDate,
      render: (value: string) => formatDate(value),
      minWidth: '120px'
    },
    {
      id: 'salary',
      header: 'Maaş',
      accessor: (row: Staff) => row.salary,
      render: (value: number) => formatSalary(value),
      minWidth: '120px',
      align: 'right'
    },
    {
      id: 'actions',
      header: '',
      accessor: (row: Staff) => row,
      minWidth: '48px',
      render: (_: any, row: Staff) => {
        const targetId = String((row as any)?.id ?? (row as any)?.employeeId)
        return (
          <div className="flex items-center justify-end">
            <a href={`/dashboard/staff/${targetId}`} title="Detay" className="inline-flex">
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


