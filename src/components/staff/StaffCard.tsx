'use client'

import React from 'react'
import Card from '@/app/components/ui/Card'
import Badge from '@/app/components/ui/Badge'
import Button from '@/app/components/ui/Button'
import Avatar from '@/app/components/ui/Avatar'
import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/components/ui/DropdownMenu'
import { Staff, StaffStatus, EmploymentType } from '@/services/types/staff.types'
import { STAFF_STATUS_CONFIG, EMPLOYMENT_TYPE_CONFIG } from '@/services/types/ui.types'
import {
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  User,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StaffCardProps {
  staff: Staff
  onView?: (staff: Staff) => void
  onEdit?: (staff: Staff) => void
  onDelete?: (staff: Staff) => void
  onActivate?: (staff: Staff) => void
  onDeactivate?: (staff: Staff) => void
  className?: string
  showActions?: boolean
  compact?: boolean
}

export function StaffCard({
  staff,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  className,
  showActions = true,
  compact = false
}: StaffCardProps) {
  const statusConfig = STAFF_STATUS_CONFIG[staff.status]
  const employmentConfig = EMPLOYMENT_TYPE_CONFIG[staff.employmentType]

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'IQD'
    }).format(amount)
  }

  return (
    <Card 
      className={cn(
        'relative transition-all duration-200 hover:shadow-md',
        className
      )}
      padding={compact ? 'sm' : 'md'}
    >
      <div className={cn(
        'flex flex-row items-center space-y-0',
        compact ? 'pb-2' : 'pb-3'
      )}>
        <div className="flex items-center space-x-3 flex-1">
          <Avatar 
            src={staff.avatar} 
            alt={`${staff.firstName} ${staff.lastName}`}
            fallback={getInitials(staff.firstName, staff.lastName)}
            size={compact ? 'sm' : 'md'}
            className="bg-primary/10 text-primary font-medium"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className={cn(
                'font-semibold text-foreground truncate',
                compact ? 'text-sm' : 'text-base'
              )}>
                {staff.firstName} {staff.lastName}
              </h3>
              <Badge
                variant={statusConfig.variant as any}
                className={cn(
                  'text-xs',
                  compact && 'px-1.5 py-0.5'
                )}
              >
                {statusConfig.label}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              {staff.position && (
                <span className={cn(
                  'text-muted-foreground truncate',
                  compact ? 'text-xs' : 'text-sm'
                )}>
                  {staff.position.title}
                </span>
              )}
              {staff.department && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className={cn(
                    'text-muted-foreground truncate',
                    compact ? 'text-xs' : 'text-sm'
                  )}>
                    {staff.department.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menüyü aç</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onView && (
                <DropdownMenuItem onClick={() => onView(staff)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Görüntüle
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(staff)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Düzenle
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {staff.status === StaffStatus.ACTIVE && onDeactivate && (
                <DropdownMenuItem onClick={() => onDeactivate(staff)}>
                  <UserX className="mr-2 h-4 w-4" />
                  Pasifleştir
                </DropdownMenuItem>
              )}
              {staff.status === StaffStatus.INACTIVE && onActivate && (
                <DropdownMenuItem onClick={() => onActivate(staff)}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Aktifleştir
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(staff)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Sil
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {!compact && (
        <div className="pt-0">
          <div className="space-y-3">
            {/* Contact Information */}
            <div className="space-y-2">
              {staff.email && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{staff.email}</span>
                </div>
              )}
              {staff.phone && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{staff.phone}</span>
                </div>
              )}

            </div>

            {/* Employment Details */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {employmentConfig.label}
              </Badge>
              {staff.startDate && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>İşe başlama: {formatDate(staff.startDate)}</span>
                </div>
              )}
            </div>

            {/* Salary Information */}
            {staff.salary && (
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Maaş</span>
                <span className="text-sm font-medium">
                  {formatSalary(staff.salary)}
                </span>
              </div>
            )}

            {/* Manager Information */}
            {staff.managerId && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4 flex-shrink-0" />
                <span>Yönetici: {staff.manager?.firstName} {staff.manager?.lastName}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

export default StaffCard