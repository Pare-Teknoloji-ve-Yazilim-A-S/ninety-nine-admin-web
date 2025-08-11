'use client'

interface QuickStatsProps {
  stats: Array<{ label: string; value: number }>
}

export default function QuickStats({ stats }: QuickStatsProps) {
  if (!stats?.length) return null
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl bg-background-light-card dark:bg-background-card p-4 shadow">
          <div className="text-sm text-text-light-secondary dark:text-text-secondary">{s.label}</div>
          <div className="text-2xl font-semibold text-text-on-light dark:text-text-on-dark">{s.value}</div>
        </div>
      ))}
    </div>
  )
}


