'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';

// Dashboard Components
import DashboardHeader from './components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import TopMetricsGrid from './components/TopMetricsGrid';
import FinancialChart from './components/FinancialChart';
import RecentTransactions from './components/RecentTransactions';
import MaintenanceRequests from './components/MaintenanceRequests';
import QuickActions from './components/QuickActions';
import OccupancyStatus from './components/OccupancyStatus';
import TodaysAgenda from './components/TodaysAgenda';
import RecentActivities from './components/RecentActivities';

// Hooks
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useMaintenanceRequests } from '@/hooks/useMaintenanceRequests';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { useTicketStats } from '@/hooks/useTicketStats';

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch dashboard metrics
    const { totalProperties, assignedProperties, loading, error } = useDashboardMetrics();
    
    // Fetch maintenance requests
    const { requests: maintenanceRequests, loading: maintenanceLoading, error: maintenanceError, totalCount: maintenanceTotalCount } = useMaintenanceRequests(50);

    // Fetch audit logs
    const { logs: auditLogs, loading: auditLogsLoading, error: auditLogsError, totalCount: auditLogsTotalCount } = useAuditLogs({}, 25);

    // Fetch ticket stats
    const { stats: ticketStats, loading: ticketStatsLoading, error: ticketStatsError } = useTicketStats();

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/dashboard' },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div className="lg:ml-72">
                    {/* Header */}
                    <DashboardHeader title="Dashboard" breadcrumbItems={breadcrumbItems} />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 sm:px-0">

                            {/* Top Metrics Cards */}
                            <TopMetricsGrid 
                                totalProperties={totalProperties}
                                assignedProperties={assignedProperties}
                                loading={loading}
                                ticketStats={ticketStats}
                                ticketStatsLoading={ticketStatsLoading}
                            />
                            
                            {/* Error Display */}
                            {(error || ticketStatsError) && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{error || ticketStatsError}</p>
                                </div>
                            )}



                            {/* Two Column Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* Left Column - 60% */}
                                <div className="lg:col-span-2 space-y-6">

                                    {/* Financial Chart */}
                                    <FinancialChart />

                                    {/* Recent Transactions */}
                                    <RecentTransactions />

                                    {/* Maintenance Requests */}
                                    <MaintenanceRequests 
                                        requests={maintenanceRequests}
                                        loading={maintenanceLoading}
                                        error={maintenanceError}
                                        totalCount={maintenanceTotalCount}
                                    />



                                </div>

                                {/* Right Column - 40% */}
                                <div className="space-y-6">

                                    {/* Quick Actions */}
                                    <QuickActions />

                                    {/* Occupancy Status */}
                                    <OccupancyStatus />

                                    {/* Today's Agenda */}
                                    <TodaysAgenda />

                                    {/* Recent Activities */}
                                    <RecentActivities 
                                        logs={auditLogs}
                                        loading={auditLogsLoading}
                                        error={auditLogsError}
                                    />

                                </div>
                            </div> 
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
} 