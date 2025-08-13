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
import Card from '@/app/components/ui/Card';
import Calendar, { CalendarEventDetail } from '@/app/components/ui/Calendar';
import Modal from '@/app/components/ui/Modal';
import { announcementService } from '@/services';
import type { Announcement } from '@/services/types/announcement.types';
import RecentActivities from './components/RecentActivities';

// Hooks
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useMaintenanceRequests } from '@/hooks/useMaintenanceRequests';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { useTicketStats } from '@/hooks/useTicketStats';

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState<Record<string, { count: number; hasEmergency?: boolean; hasPinned?: boolean; items?: CalendarEventDetail[] }>>({});
    const [dayModalOpen, setDayModalOpen] = useState(false);
    const [dayModalDate, setDayModalDate] = useState<string>('');
    const [dayModalItems, setDayModalItems] = useState<CalendarEventDetail[]>([]);

    // Fetch dashboard metrics
    const { totalProperties, assignedProperties, loading, error } = useDashboardMetrics();
    
    // Fetch maintenance requests
    const { requests: maintenanceRequests, loading: maintenanceLoading, error: maintenanceError, totalCount: maintenanceTotalCount } = useMaintenanceRequests(50);

    // Fetch audit logs
    const { logs: auditLogs, loading: auditLogsLoading, error: auditLogsError, totalCount: auditLogsTotalCount } = useAuditLogs({}, 25, true);

    // Fetch ticket stats
    const { stats: ticketStats, loading: ticketStatsLoading, error: ticketStatsError } = useTicketStats();

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/dashboard' },
    ];

    React.useEffect(() => {
        const fetchMonthAnnouncements = async () => {
            try {
                const today = new Date();
                const start = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));
                const end = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 0));

                const map: Record<string, { count: number; hasEmergency?: boolean; hasPinned?: boolean; items?: any[] }> = {};
                const toKey = (d?: string) => (d ? d.slice(0, 10) : '');
                const add = (d?: string, a?: Announcement) => {
                    const key = toKey(d);
                    if (!key) return;
                    if (!map[key]) map[key] = { count: 0, hasEmergency: false, hasPinned: false, items: [] };
                    map[key].count += 1;
                    if (a?.isEmergency) map[key].hasEmergency = true;
                    if (a?.isPinned) map[key].hasPinned = true;
                    if (a) map[key].items!.push({ id: a.id, title: a.title, description: a.content, isEmergency: a.isEmergency, isPinned: a.isPinned, publishDate: a.publishDate, expiryDate: a.expiryDate });
                };

                // Respect API limit (<= 100) and paginate if needed
                let page = 1;
                let totalPages = 1;
                do {
                    const res = await announcementService.getAllAnnouncements({
                        page,
                        limit: 100,
                        publishDateFrom: start.toISOString().slice(0, 10),
                        publishDateTo: end.toISOString().slice(0, 10),
                    } as any);
                (res.data || []).forEach((a: Announcement) => {
                    // Only mark publishDate on calendar (do not mark expiryDate)
                    add(a.publishDate, a);
                });
                    totalPages = res.totalPages || 1;
                    page += 1;
                } while (page <= totalPages && page <= 3); // safety cap
                setCalendarEvents(map);
            } catch {
                setCalendarEvents({});
            }
        };
        fetchMonthAnnouncements();
    }, []);

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

                                    {/* Monthly Calendar between Quick Actions and Recent Activities */}
                                    <Card>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">Aylık Takvim</h3>
                                            </div>
                                            <Calendar
                                                showSelectedSummary={false}
                                                eventsByDate={calendarEvents}
                                                onDateSelect={(key, items) => {
                                                    if (items && items.length > 0) {
                                                        setDayModalDate(key);
                                                        setDayModalItems(items);
                                                        setDayModalOpen(true);
                                                    }
                                                }}
                                            />
                                            {/* Day Events Modal */}
                                            <Modal
                                                isOpen={dayModalOpen}
                                                onClose={() => setDayModalOpen(false)}
                                                title={`${dayModalDate ? new Date(dayModalDate).toLocaleDateString('tr-TR') : ''} Etkinlikleri`}
                                                size="md"
                                            >
                                                <div className="space-y-3">
                                                    {dayModalItems.length === 0 && (
                                                        <p className="text-sm text-text-light-secondary dark:text-text-secondary">Bu gün için kayıtlı etkinlik bulunamadı.</p>
                                                    )}
                                                    {dayModalItems.map((it, idx) => (
                                                        <div key={(it.id as string) || idx} className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-background-light-card dark:bg-background-card">
                                                            <div className="flex items-start justify-between">
                                                                <div className="pr-4">
                                                                    <p className="text-sm font-semibold text-text-on-light dark:text-text-on-dark">{it.title || 'Duyuru'}</p>
                                                                    {it.description && (
                                                                        <p className="text-xs text-text-light-secondary dark:text-text-secondary mt-1 line-clamp-3">{it.description}</p>
                                                                    )}
                                                                    <div className="mt-2 flex items-center gap-4 text-xs text-text-light-secondary dark:text-text-secondary">
                                                                        <span>Yayın: {it.publishDate ? new Date(it.publishDate).toLocaleDateString('tr-TR') : (dayModalDate ? new Date(dayModalDate).toLocaleDateString('tr-TR') : '-')}</span>
                                                                        {it.expiryDate && <span>Bitiş: {new Date(it.expiryDate).toLocaleDateString('tr-TR')}</span>}
                                                                        {it.time && <span>Saat: {it.time}</span>}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2 whitespace-nowrap">
                                                                    {it.isEmergency && (
                                                                        <span className="inline-flex items-center text-xs px-2 py-1 rounded bg-primary-red/15 text-primary-red">Acil</span>
                                                                    )}
                                                                    {it.isPinned && (
                                                                        <span className="inline-flex items-center text-xs px-2 py-1 rounded bg-primary-gold/20 text-primary-gold">Sabit</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Modal>
                                        </div>
                                    </Card>

                                    {/* Occupancy Status */}
                                    {/* <OccupancyStatus /> */}

                                    {/* Today's Agenda */}
                                    {/* <TodaysAgenda /> */}

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