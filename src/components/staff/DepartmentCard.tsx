'use client'

import React from 'react'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Badge from '@/app/components/ui/Badge'
import Avatar from '@/app/components/ui/Avatar'
import DropdownMenu, { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/app/components/ui/DropdownMenu'
import { Department } from '@/services/types/department.types'
import { Staff } from '@/services/types/staff.types'
import {
  Building,
  Users,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Settings,
  BarChart3,
  MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DepartmentCardProps {
  department: Department
  manager?: Staff
  staffCount?: number
  positionCount?: number
  onView?: (department: Department) => void
  onEdit?: (department: Department) => void
  onDelete?: (department: Department) => void
  onAddStaff?: (department: Department) => void
  onViewStats?: (department: Department) => void
  onManagePositions?: (department: Department) => void
  className?: string
  compact?: boolean
}

export function DepartmentCard({
  department,
  manager,
  staffCount = 0,
  positionCount = 0,
  onView,
  onEdit,
  onDelete,
  onAddStaff,
  onViewStats,
  onManagePositions,
  className,
  compact = false
}: DepartmentCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatBudget = (amount?: number) => {
    if (!amount) return 'Belirtilmemiş'
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-500' : 'bg-gray-400'
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Aktif' : 'Pasif'
  }

  if (compact) {
    return (
      <Card className={cn('hover:shadow-md transition-shadow cursor-pointer', className)} padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-sm truncate">{department.name}</h3>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    getStatusColor(department.isActive)
                  )} />
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {staffCount}
                  </span>
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {positionCount}
                  </span>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onView && (
                  <DropdownMenuItem onClick={() => onView(department)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Görüntüle
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(department)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Düzenle
                  </DropdownMenuItem>
                )}
                {onAddStaff && (
                  <DropdownMenuItem onClick={() => onAddStaff(department)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Personel Ekle
                  </DropdownMenuItem>
                )}
                {onManagePositions && (
                  <DropdownMenuItem onClick={() => onManagePositions(department)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Pozisyonları Yönet
                  </DropdownMenuItem>
                )}
                {onViewStats && (
                  <DropdownMenuItem onClick={() => onViewStats(department)}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    İstatistikler
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(department)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Sil
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </Card>
    )
  }

  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)} padding="lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">{department.name}</h3>
                <Badge 
                  variant={department.isActive ? 'default' : 'secondary'}
                  className={cn(
                    'text-xs',
                    department.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  )}
                >
                  {getStatusText(department.isActive)}
                </Badge>
              </div>
              
              {department.code && (
                <div className="text-sm text-muted-foreground mt-1">
                  Kod: {department.code}
                </div>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(department)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Görüntüle
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(department)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </DropdownMenuItem>
              )}
              {onAddStaff && (
                <DropdownMenuItem onClick={() => onAddStaff(department)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Personel Ekle
                </DropdownMenuItem>
              )}
              {onManagePositions && (
                <DropdownMenuItem onClick={() => onManagePositions(department)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Pozisyonları Yönet
                </DropdownMenuItem>
              )}
              {onViewStats && (
                <DropdownMenuItem onClick={() => onViewStats(department)}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  İstatistikler
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(department)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Sil
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-4 mt-4">
        {/* Description */}
        {department.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {department.description}
          </p>
        )}

        {/* Manager */}
        {manager && (
          <div className="flex items-center space-x-3">
            <Avatar
              src={manager.avatar}
              fallback={getInitials(`${manager.firstName} ${manager.lastName}`)}
              size="sm"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">
                {manager.firstName} {manager.lastName}
              </div>
              <div className="text-xs text-muted-foreground">
                Departman Müdürü
              </div>
            </div>
          </div>
        )}

        {/* Location */}
        {department.location && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{department.location}</span>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{staffCount}</div>
            <div className="text-xs text-muted-foreground">Personel</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{positionCount}</div>
            <div className="text-xs text-muted-foreground">Pozisyon</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {department.budget ? formatBudget(department.budget) : '-'}
            </div>
            <div className="text-xs text-muted-foreground">Bütçe</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(department)}>
              <Eye className="h-4 w-4 mr-1" />
              Görüntüle
            </Button>
          )}
          {onAddStaff && (
            <Button variant="outline" size="sm" onClick={() => onAddStaff(department)}>
              <UserPlus className="h-4 w-4 mr-1" />
              Personel Ekle
            </Button>
          )}
          {onViewStats && (
            <Button variant="outline" size="sm" onClick={() => onViewStats(department)}>
              <BarChart3 className="h-4 w-4 mr-1" />
              İstatistikler
            </Button>
          )}
        </div>

        {/* Created/Updated Info */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div className="flex justify-between">
            <span>Oluşturulma: {new Date(department.createdAt).toLocaleDateString('tr-TR')}</span>
            <span>Güncelleme: {new Date(department.updatedAt).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
        </div>
    </Card>
  )
}

export default DepartmentCard