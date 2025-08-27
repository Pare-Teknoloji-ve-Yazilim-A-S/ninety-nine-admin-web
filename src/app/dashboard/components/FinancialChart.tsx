'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { TrendingUp, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import billingService from '@/services/billing.service';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface FinancialChartProps {
  title?: string;
  subtitle?: string;
}

// Dil çevirileri
const translations = {
  tr: {
    title: 'Aidat Tahsilat Trendi',
    subtitle: 'Yıllık görünüm',
    monthLabels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    seriesName: 'Tahsilat (DUES • PAID)',
    months: 'Ay'
  },
  en: {
    title: 'Dues Collection Trend',
    subtitle: 'Annual view',
    monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    seriesName: 'Collection (DUES • PAID)',
    months: 'Months'
  },
  ar: {
    title: 'اتجاه تحصيل الرسوم',
    subtitle: 'عرض سنوي',
    monthLabels: ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'],
    seriesName: 'التحصيل (DUES • PAID)',
    months: 'أشهر'
  }
};

export default function FinancialChart({
  title,
  subtitle
}: FinancialChartProps) {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 5;
  const [year, setYear] = useState<number>(currentYear);
  const [monthlyTotals, setMonthlyTotals] = useState<number[]>(Array(12).fill(0));
  const [loading, setLoading] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  
  // Permission kontrolü - ID tabanlı (öncelikli) ve name tabanlı (geriye dönük uyumluluk)
  const { hasPermission, loading: permissionLoading, refreshPermissions } = usePermissionCheck();
  
  // Önce ID ile kontrol et, sonra name ile
  const billingStatsPermissionId = '4158aedc-5ae7-4a79-a746-a8268dd1510e'; // Billing Statistics ID
  const billingStatsPermissionName = 'billing:stats:read'; // Eski name tabanlı
  
  const canViewFinancialChartById = hasPermission(billingStatsPermissionId);
  const canViewFinancialChartByName = hasPermission(billingStatsPermissionName);
  const canViewFinancialChart = canViewFinancialChartById || canViewFinancialChartByName;
  
  // Debug için detaylı log'lar
  console.log('=== FinancialChart Debug ===');
  console.log('FinancialChart - canViewFinancialChart (final):', canViewFinancialChart);
  console.log('FinancialChart - canViewFinancialChartById:', canViewFinancialChartById);
  console.log('FinancialChart - canViewFinancialChartByName:', canViewFinancialChartByName);
  console.log('FinancialChart - permissionLoading:', permissionLoading);
  console.log('FinancialChart - Required permission ID:', billingStatsPermissionId);
  console.log('FinancialChart - Required permission name:', billingStatsPermissionName);
  
  // localStorage'daki permission'ları kontrol et
  const userPermissions = localStorage.getItem('userPermissions');
  console.log('FinancialChart - userPermissions from localStorage:', userPermissions);
  
  if (userPermissions) {
    try {
      const parsedPermissions = JSON.parse(userPermissions);
      console.log('FinancialChart - Parsed permissions:', parsedPermissions);
      console.log('FinancialChart - Permissions type:', typeof parsedPermissions);
      console.log('FinancialChart - Is array:', Array.isArray(parsedPermissions));
      
      if (Array.isArray(parsedPermissions) && parsedPermissions.length > 0) {
        console.log('FinancialChart - First permission item:', parsedPermissions[0]);
        console.log('FinancialChart - All permissions:', parsedPermissions);
        
        // billing:stats permission'ını ID ve name ile ara
        const hasBillingStatsById = parsedPermissions.some(perm => {
          if (typeof perm === 'object' && perm !== null) {
            return perm.id === billingStatsPermissionId;
          }
          return false;
        });
        
        const hasBillingStatsByName = parsedPermissions.some(perm => {
          if (typeof perm === 'string') {
            return perm === billingStatsPermissionName;
          } else if (typeof perm === 'object' && perm !== null) {
            return perm.name === billingStatsPermissionName;
          }
          return false;
        });
        
        console.log('FinancialChart - Manual permission check by ID:', hasBillingStatsById);
        console.log('FinancialChart - Manual permission check by name:', hasBillingStatsByName);
        console.log('FinancialChart - Manual permission check result (combined):', hasBillingStatsById || hasBillingStatsByName);
      }
    } catch (error) {
      console.error('FinancialChart - Permission parsing error:', error);
    }
  } else {
    console.warn('FinancialChart - No userPermissions found in localStorage');
  }
  
  console.log('=== End FinancialChart Debug ===');

  // Dil tercihini localStorage'dan al
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

  useEffect(() => {
    // Permission yoksa veri yükleme
    if (!canViewFinancialChart) return;
    
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await billingService.getDuesMonthlyPaidTotals(year);
        // data: [{ month: 1..12, totalPaid: number }]
        const arr = Array(12).fill(0) as number[];
        if (Array.isArray(data)) {
          data.forEach((item) => {
            const idx = Math.min(12, Math.max(1, Number(item.month))) - 1;
            arr[idx] = Number(item.totalPaid) || 0;
          });
        }
        if (mounted) setMonthlyTotals(arr);
      } catch (e) {
        if (mounted) setMonthlyTotals(Array(12).fill(0));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [year, canViewFinancialChart]);
  const gold = '#AC8D6A';
  const gray200 = '#E7E5E4';
  const gray300 = '#D6D3D1';
  const textSecondary = '#78716C';

  const monthLabels = t.monthLabels;

  const options: ApexOptions = useMemo(() => ({
    chart: {
      toolbar: { show: false },
      sparkline: { enabled: false },
      foreColor: textSecondary,
      animations: { enabled: true },
    },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.30,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          { offset: 0, color: gold, opacity: 0.30 },
          { offset: 100, color: gold, opacity: 0.05 },
        ],
      },
    },
    colors: [gold],
    grid: {
      strokeDashArray: 4,
      borderColor: gray200,
      padding: { left: 8, right: 8 },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: monthLabels,
      axisTicks: { show: false },
      axisBorder: { color: gray300 },
      labels: { style: { colors: textSecondary } },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${Math.round(val)} IQD`,
        style: { colors: textSecondary },
      },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val: number) => `${Math.round(val)} IQD` },
    },
    legend: { show: false },
    markers: { size: 0 },
    theme: { mode: 'light' },
  }), [gray300, monthLabels, textSecondary, gold, gray200]);

  const series = useMemo(() => (
    [ { name: `${year} ${t.seriesName}`, data: monthlyTotals } ]
  ), [year, monthlyTotals, t.seriesName]);

  // Permission yoksa erişim reddedildi mesajı göster
  if (!canViewFinancialChart) {
    return (
      <Card
        title={title || t.title}
        subtitle="Erişim Kısıtlı"
        icon={Lock}
      >
        <div className="h-64 bg-background-light-card dark:bg-background-card rounded-lg p-8 flex flex-col items-center justify-center">
          <Lock className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
            Erişim Kısıtlı
          </h3>
          <p className="text-sm text-text-light-secondary dark:text-text-secondary text-center">
            Bu grafiği görüntülemek için gerekli izinlere sahip değilsiniz.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={title || t.title}
      subtitle={`${year} • 12 ${t.months}`}
      icon={TrendingUp}
      headerAction={(
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronLeft}
            onClick={() => setYear(prev => Math.max(minYear, prev - 1))}
            disabled={year <= minYear}
          />
          <span className="text-sm text-text-on-light dark:text-text-on-dark min-w-[3.5rem] text-center">{year}</span>
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronRight}
            onClick={() => setYear(prev => Math.min(currentYear, prev + 1))}
            disabled={year >= currentYear}
          />
        </div>
      )}
    >
      <div className="h-64 bg-background-light-card dark:bg-background-card rounded-lg p-2">
        <Chart type="area" height="100%" options={options} series={series} />
        {(loading || permissionLoading) && <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-gold border-t-transparent" />
        </div>}
      </div>
    </Card>
  );
}