'use client'

import React from 'react'
import Card from '@/app/components/ui/Card'
import  Badge  from '@/app/components/ui/Badge'
import Progress from '@/app/components/ui/Progress'
import { Separator } from '@/app/components/ui/Separator'
import {
  StaffStats as StaffStatsType,
  StaffStatus,
  EmploymentType
} from '@/services/types/staff.types'
import {
  STAFF_STATUS_CONFIG,
  EMPLOYMENT_TYPE_CONFIG
} from '@/services/types/ui.types'
import {
  Users,
  UserPlus,
  UserMinus,
  Building,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Clock,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StaffStatsProps {
  stats: StaffStatsType
  className?: string
  showDetailed?: boolean
}

export function StaffStats({
  stats,
  className,
  showDetailed = true
}: StaffStatsProps) {
  // Handle undefined stats
  if (!stats) {
    return (
      <div className={cn('grid gap-4', className)}>
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <p>İstatistik verileri yükleniyor...</p>
          </div>
        </Card>
      </div>
    )
  }
  // Calculate percentages for status distribution
  const getStatusPercentage = (count: number) => {
    return stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
  }

  // Calculate percentages for employment type distribution
  const getEmploymentTypePercentage = (count: number) => {
    return stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format number with thousand separators
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num)
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Staff */}
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Toplam Personel</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{formatNumber(stats.total)}</div>
            {stats.growth && (
              <div className="flex items-center text-xs text-muted-foreground">
                {stats.growth.total > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={cn(
                  stats.growth.total > 0 ? 'text-green-500' : 'text-red-500'
                )}>
                  {Math.abs(stats.growth.total)}%
                </span>
                <span className="ml-1">geçen aya göre</span>
              </div>
            )}
          </div>
        </Card>

        {/* Active Staff */}
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Aktif Personel</h3>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{formatNumber(stats.byStatus.ACTIVE)}</div>
            <div className="text-xs text-muted-foreground">
              {getStatusPercentage(stats.byStatus.ACTIVE)}% toplam personelin
            </div>
          </div>
        </Card>

        {/* Departments */}
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Departman Sayısı</h3>
            <Building className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.departmentCount}</div>
            <div className="text-xs text-muted-foreground">
              Aktif departman
            </div>
          </div>
        </Card>

        {/* Average Salary */}
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Ortalama Maaş</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageSalary)}</div>
            <div className="text-xs text-muted-foreground">
              Aylık ortalama
            </div>
          </div>
        </Card>
      </div>

      {showDetailed && (
        <>
          {/* Status Distribution */}
          <Card className="p-6">
            <div className="pb-4">
              <h3 className="text-lg font-semibold">Personel Durumu Dağılımı</h3>
            </div>
            <div>
              <div className="space-y-4">
                {Object.entries(stats.byStatus).map(([status, count]) => {
                  const statusConfig = STAFF_STATUS_CONFIG[status as StaffStatus]
                  const percentage = getStatusPercentage(count)
                  
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant={statusConfig.variant as any}>
                            {statusConfig.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(count)} personel
                          </span>
                        </div>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Employment Type Distribution */}
          <Card className="p-6">
            <div className="pb-4">
              <h3 className="text-lg font-semibold">İstihdam Türü Dağılımı</h3>
            </div>
            <div>
              <div className="space-y-4">
                {Object.entries(stats.byEmploymentType).map(([type, count]) => {
                  const typeConfig = EMPLOYMENT_TYPE_CONFIG[type as EmploymentType]
                  const percentage = getEmploymentTypePercentage(count)
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant={typeConfig.variant as any}>
                            {typeConfig.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(count)} personel
                          </span>
                        </div>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Recent Hires */}
          {stats.recentHires && stats.recentHires.length > 0 && (
            <Card className="p-6">
              <div className="pb-4">
                <h3 className="text-lg font-semibold">Son İşe Alınanlar</h3>
                <p className="text-sm text-muted-foreground">
                  Son 30 gün içinde işe alınan personel
                </p>
              </div>
              <div>
                <div className="space-y-3">
                  {stats.recentHires.slice(0, 5).map((hire) => (
                    <div key={hire.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {hire.firstName[0]}{hire.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {hire.firstName} {hire.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {hire.position?.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(hire.hireDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  ))}
                </div>
                {stats.recentHires.length > 5 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      +{stats.recentHires.length - 5} kişi daha
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Department Stats */}
          {stats.byDepartment && Object.keys(stats.byDepartment).length > 0 && (
            <Card className="p-6">
              <div className="pb-4">
                <h3 className="text-lg font-semibold">Departman Bazında Dağılım</h3>
              </div>
              <div>
                <div className="space-y-4">
                  {Object.entries(stats.byDepartment)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([department, count]) => {
                      const percentage = getStatusPercentage(count)
                      
                      return (
                        <div key={department} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{department}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">
                                {formatNumber(count)} personel
                              </span>
                              <span className="text-sm font-medium">{percentage}%</span>
                            </div>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default StaffStats