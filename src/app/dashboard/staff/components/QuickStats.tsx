'use client'

import StaffStats from '@/components/staff/StaffStats'
import type { StaffStats as StaffStatsType } from '@/services/types/staff.types'

interface QuickStatsProps {
  stats: StaffStatsType
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <StaffStats stats={stats} showDetailed={false} />
  )
}




