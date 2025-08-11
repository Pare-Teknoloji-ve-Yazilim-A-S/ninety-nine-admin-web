'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import Card from '@/app/components/ui/Card';
import { TrendingUp } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface FinancialChartProps {
  title?: string;
  subtitle?: string;
}

export default function FinancialChart({
  title = 'Aidat Tahsilat Trendi',
  subtitle = 'Son 6 ay',
}: FinancialChartProps) {
  const gold = '#AC8D6A';
  const gray200 = '#E7E5E4';
  const gray300 = '#D6D3D1';
  const textSecondary = '#78716C';

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
      categories: ['May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki'],
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
  }), []);

  const series = useMemo(
    () => [
      {
        name: 'Tahsilat',
        data: [12000, 15000, 17000, 16500, 19000, 21500],
      },
    ],
    []
  );

  return (
    <Card title={title} subtitle={subtitle} icon={TrendingUp}>
      <div className="h-64 bg-background-light-card dark:bg-background-card rounded-lg p-2">
        <Chart type="area" height="100%" options={options} series={series} />
      </div>
    </Card>
  );
}