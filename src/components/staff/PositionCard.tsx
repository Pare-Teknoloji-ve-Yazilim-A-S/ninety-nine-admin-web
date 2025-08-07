'use client'

import React from 'react'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Badge from '@/app/components/ui/Badge'
import DropdownMenu, { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/app/components/ui/DropdownMenu'
import { Position } from '@/services/types/department.types'
import { Department } from '@/services/types/department.types'
import {
  Briefcase,
  Users,
  DollarSign,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  BarChart3,
  Building,
  TrendingUp,
  Clock,

} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PositionCardProps {
  position: Position
  department?: Department
  staffCount?: number
  onView?: (position: Position) => void
  onEdit?: (position: Position) => void
  onDelete?: (position: Position) => void
  onAddStaff?: (position: Position) => void
  onViewStats?: (position: Position) => void
  className?: string
  compact?: boolean
}

export function PositionCard({
  position,
  department,
  staffCount = 0,
  onView,
  onEdit,
  onDelete,
  onAddStaff,
  onViewStats,
  className,
  compact = false
}: PositionCardProps) {
  const formatSalary = (amount?: number) => {
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

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'junior':
        return 'bg-blue-100 text-blue-800'
      case 'mid':
      case 'middle':
        return 'bg-yellow-100 text-yellow-800'
      case 'senior':
        return 'bg-green-100 text-green-800'
      case 'lead':
      case 'manager':
        return 'bg-purple-100 text-purple-800'
      case 'director':
      case 'executive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (compact) {
    return (
      <Card className={cn('hover:shadow-md transition-shadow cursor-pointer', className)} padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-sm truncate">{position.title}</h3>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    getStatusColor(position.isActive)
                  )} />
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {staffCount}
                  </span>
                  {position.level && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {position.level}
                    </Badge>
                  )}
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
                  <DropdownMenuItem onClick={() => onView(position)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Görüntüle
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(position)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Düzenle
                  </DropdownMenuItem>
                )}
                {onAddStaff && (
                  <DropdownMenuItem onClick={() => onAddStaff(position)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Personel Ekle
                  </DropdownMenuItem>
                )}
                {onViewStats && (
                  <DropdownMenuItem onClick={() => onViewStats(position)}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    İstatistikler
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(position)}
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
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">{position.title}</h3>
                <Badge 
                  variant={position.isActive ? 'default' : 'secondary'}
                  className={cn(
                    'text-xs',
                    position.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  )}
                >
                  {getStatusText(position.isActive)}
                </Badge>
              </div>
              
              {position.code && (
                <div className="text-sm text-muted-foreground mt-1">
                  Kod: {position.code}
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
                <DropdownMenuItem onClick={() => onView(position)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Görüntüle
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(position)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Düzenle
                </DropdownMenuItem>
              )}
              {onAddStaff && (
                <DropdownMenuItem onClick={() => onAddStaff(position)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Personel Ekle
                </DropdownMenuItem>
              )}
              {onViewStats && (
                <DropdownMenuItem onClick={() => onViewStats(position)}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  İstatistikler
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(position)}
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
        {position.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {position.description}
          </p>
        )}

        {/* Department */}
        {department && (
          <div className="flex items-center space-x-2 text-sm">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{department.name}</span>
          </div>
        )}

        {/* Level and Requirements */}
        <div className="flex items-center space-x-2">
          {position.level && (
            <Badge className={cn('text-xs', getLevelColor(position.level))}>
              {position.level}
            </Badge>
          )}
          {position.requirements && position.requirements.length > 0 && (
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {position.requirements.length} gereksinim
              </span>
            </div>
          )}
        </div>

        {/* Salary Range */}
        {(position.salaryMin || position.salaryMax) && (
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {position.salaryMin && position.salaryMax
                ? `${formatSalary(position.salaryMin)} - ${formatSalary(position.salaryMax)}`
                : position.salaryMin
                ? `${formatSalary(position.salaryMin)}+`
                : formatSalary(position.salaryMax)
              }
            </span>
          </div>
        )}

        {/* Requirements */}
        {position.requirements && position.requirements.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Gereksinimler:</div>
            <div className="flex flex-wrap gap-1">
              {position.requirements.slice(0, 3).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
              {position.requirements.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{position.requirements.length - 3} daha
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{staffCount}</div>
            <div className="text-xs text-muted-foreground">Mevcut Personel</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {position.maxHeadcount || '∞'}
            </div>
            <div className="text-xs text-muted-foreground">Maksimum Kapasite</div>
          </div>
        </div>

        {/* Capacity Indicator */}
        {position.maxHeadcount && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Kapasite Kullanımı</span>
              <span>{Math.round((staffCount / position.maxHeadcount) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all",
                  staffCount / position.maxHeadcount > 0.9 
                    ? "bg-red-500" 
                    : staffCount / position.maxHeadcount > 0.7 
                    ? "bg-yellow-500" 
                    : "bg-green-500"
                )}
                style={{ width: `${Math.min((staffCount / position.maxHeadcount) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(position)}>
              <Eye className="h-4 w-4 mr-1" />
              Görüntüle
            </Button>
          )}
          {onAddStaff && (
            <Button variant="outline" size="sm" onClick={() => onAddStaff(position)}>
              <UserPlus className="h-4 w-4 mr-1" />
              Personel Ekle
            </Button>
          )}
          {onViewStats && (
            <Button variant="outline" size="sm" onClick={() => onViewStats(position)}>
              <BarChart3 className="h-4 w-4 mr-1" />
              İstatistikler
            </Button>
          )}
        </div>

        {/* Created/Updated Info */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div className="flex justify-between">
            <span>Oluşturulma: {new Date(position.createdAt).toLocaleDateString('tr-TR')}</span>
            <span>Güncelleme: {new Date(position.updatedAt).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
        </div>
    </Card>
  )
}

export default PositionCard