'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import billingService from '@/services/billing.service';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface FinancialChartProps {
  title?: string;
  subtitle?: string;
}

export default function FinancialChart({
  title = 'Aidat Tahsilat Trendi',
  subtitle = 'Yıllık görünüm',
}: FinancialChartProps) {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 5;
  const [year, setYear] = useState<number>(currentYear);
  const [monthlyTotals, setMonthlyTotals] = useState<number[]>(Array(12).fill(0));
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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
  }, [year]);
  const gold = '#AC8D6A';
  const gray200 = '#E7E5E4';
  const gray300 = '#D6D3D1';
  const textSecondary = '#78716C';

  const monthLabels = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

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
        formatter: (val: number) => `${Math.round(val)}₺`,
        style: { colors: textSecondary },
      },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val: number) => `${Math.round(val)}₺` },
    },
    legend: { show: false },
    markers: { size: 0 },
    theme: { mode: 'light' },
  }), [gray300, monthLabels, textSecondary, gold, gray200]);

  const series = useMemo(() => (
    [ { name: `${year} Tahsilat (DUES • PAID)`, data: monthlyTotals } ]
  ), [year, monthlyTotals]);

  return (
    <Card
      title={title}
      subtitle={`${year} • 12 Ay`}
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
        {loading && <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-gold border-t-transparent" />
        </div>}
      </div>
    </Card>
  );
}