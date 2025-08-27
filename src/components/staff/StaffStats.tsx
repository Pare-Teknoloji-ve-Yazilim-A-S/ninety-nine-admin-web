'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/app/components/ui/Card'
import  Badge  from '@/app/components/ui/Badge'
import Progress from '@/app/components/ui/Progress'
import Separator from '@/app/components/ui/Separator'
import {
  StaffStats as StaffStatsType,
  StaffStatus,
  EmploymentType
} from '@/services/types/staff.types'
import {
  getStaffStatusConfig,
  getEmploymentTypeConfig
} from '@/services/types/ui.types'
import {
  Users,
  UserPlus,
  UserMinus,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Dil çevirileri
const translations = {
  tr: {
    // Loading state
    loadingStats: 'İstatistik verileri yükleniyor...',
    
    // Card titles
    totalStaff: 'Toplam Personel',
    activeStaff: 'Aktif Personel',
    onLeaveStaff: 'İzinli Personel',
    
    // Growth labels
    comparedToLastMonth: 'geçen aya göre',
    ofTotalStaff: '% toplam personelin',
    currentlyOnLeave: 'Şu an izinli',
    
    // Section titles
    statusDistribution: 'Personel Durumu Dağılımı',
    employmentTypeDistribution: 'İstihdam Türü Dağılımı',
    recentHires: 'Son İşe Alınanlar',
    recentHiresDesc: 'Son 30 gün içinde işe alınan personel',
    departmentDistribution: 'Departman Bazında Dağılım',
    
    // Labels
    staff: 'personel',
    morePeople: 'kişi daha'
  },
  en: {
    // Loading state
    loadingStats: 'Loading statistics...',
    
    // Card titles
    totalStaff: 'Total Staff',
    activeStaff: 'Active Staff',
    onLeaveStaff: 'On Leave Staff',
    
    // Growth labels
    comparedToLastMonth: 'vs last month',
    ofTotalStaff: '% of total staff',
    currentlyOnLeave: 'Currently on leave',
    
    // Section titles
    statusDistribution: 'Staff Status Distribution',
    employmentTypeDistribution: 'Employment Type Distribution',
    recentHires: 'Recent Hires',
    recentHiresDesc: 'Staff hired in the last 30 days',
    departmentDistribution: 'Department Distribution',
    
    // Labels
    staff: 'staff',
    morePeople: 'more people'
  },
  ar: {
    // Loading state
    loadingStats: 'جاري تحميل الإحصائيات...',
    
    // Card titles
    totalStaff: 'إجمالي الموظفين',
    activeStaff: 'الموظفون النشطون',
    onLeaveStaff: 'الموظفون في الإجازة',
    
    // Growth labels
    comparedToLastMonth: 'مقارنة بالشهر الماضي',
    ofTotalStaff: '% من إجمالي الموظفين',
    currentlyOnLeave: 'حالياً في الإجازة',
    
    // Section titles
    statusDistribution: 'توزيع حالة الموظفين',
    employmentTypeDistribution: 'توزيع نوع التوظيف',
    recentHires: 'التوظيفات الأخيرة',
    recentHiresDesc: 'الموظفون المعينون في آخر 30 يوم',
    departmentDistribution: 'توزيع الأقسام',
    
    // Labels
    staff: 'موظف',
    morePeople: 'أشخاص آخرين'
  }
};

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
  
  // i18n config'leri al
  const staffStatusConfig = getStaffStatusConfig(currentLanguage);
  const employmentTypeConfig = getEmploymentTypeConfig(currentLanguage);

  // Handle undefined stats
  if (!stats) {
    return (
      <div className={cn('grid gap-4', className)}>
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <p>{t.loadingStats}</p>
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
      currency: 'IQD',
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
            <h3 className="text-sm font-medium">{t.totalStaff}</h3>
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
                <span className="ml-1">{t.comparedToLastMonth}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Active Staff */}
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">{t.activeStaff}</h3>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{formatNumber(stats.byStatus.ACTIVE)}</div>
            <div className="text-xs text-muted-foreground">
              {getStatusPercentage(stats.byStatus.ACTIVE)}% {t.ofTotalStaff}
            </div>
          </div>
        </Card>

        {/* On Leave Staff */}
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">{t.onLeaveStaff}</h3>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{formatNumber(stats.byStatus.ON_LEAVE)}</div>
            <div className="text-xs text-muted-foreground">{t.currentlyOnLeave}</div>
          </div>
        </Card>
      </div>

      {showDetailed && (
        <>
          {/* Status Distribution */}
          <Card className="p-6">
            <div className="pb-4">
              <h3 className="text-lg font-semibold">{t.statusDistribution}</h3>
            </div>
            <div>
              <div className="space-y-4">
                {Object.entries(stats.byStatus).map(([status, count]) => {
                  const statusConfig = staffStatusConfig[status as StaffStatus]
                  const percentage = getStatusPercentage(count)
                  
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant={statusConfig.variant as any}>
                            {statusConfig.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(count)} {t.staff}
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
              <h3 className="text-lg font-semibold">{t.employmentTypeDistribution}</h3>
            </div>
            <div>
              <div className="space-y-4">
                {Object.entries(stats.byEmploymentType).map(([type, count]) => {
                  const typeConfig = employmentTypeConfig[type as EmploymentType]
                  const percentage = getEmploymentTypePercentage(count)
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant={typeConfig.variant as any}>
                            {typeConfig.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(count)} {t.staff}
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
                <h3 className="text-lg font-semibold">{t.recentHires}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.recentHiresDesc}
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
                        {new Date(hire.startDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  ))}
                </div>
                {stats.recentHires.length > 5 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      +{stats.recentHires.length - 5} {t.morePeople}
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
                <h3 className="text-lg font-semibold">{t.departmentDistribution}</h3>
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
                                {formatNumber(count)} {t.staff}
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