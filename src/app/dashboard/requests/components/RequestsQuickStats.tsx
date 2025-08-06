import React from 'react';
import Card from '@/app/components/ui/Card';
import Skeleton from '@/app/components/ui/Skeleton';
import { RequestsQuickStatsProps } from '@/services/types/request-list.types';

export default function RequestsQuickStats({
  quickStats,
  loading = false
}: RequestsQuickStatsProps) {
  console.log('🔍 RequestsQuickStats render:', { quickStats, loading });
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {quickStats.map((stat, index) => {
        return (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
                             {/* Header with Icon and Value */}
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div
                     className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                     style={{ backgroundColor: `${stat.color}20` }}
                   >
                     <span>{stat.icon}</span>
                   </div>
                   <div
                     className="text-3xl font-bold"
                     style={{ color: stat.color }}
                   >
                     {stat.value}
                   </div>
                 </div>
               </div>

              {/* Label */}
              <div>
                <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                  {stat.label}
                </p>
              </div>
            </div>

            {/* Optional Progress Bar for Visual Enhancement */}
            <div className="mt-4">
              <div className="w-full bg-background-light-secondary dark:bg-background-secondary rounded-full h-1">
                <div
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: stat.color,
                    width: `${Math.min((stat.value / 100) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}