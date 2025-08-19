'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/app/components/ui/Toast';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles
    pageTitle: 'Hizmet Talepleri',
    activeRequests: 'Aktif Talepler',
    
    // Breadcrumb
    home: 'Ana Sayfa',
    serviceRequests: 'Hizmet Talepleri',
    
    // Actions
    bulkAction: 'Toplu işlem',
    bulkActionSuccess: 'işlemi {count} talep için gerçekleştirildi',
    unknownAction: 'Bilinmeyen işlem',
    
    // Empty states
    noRequestsYet: 'Henüz talep bulunmuyor',
    
    // Error messages
    error: 'Hata'
  },
  en: {
    // Page titles
    pageTitle: 'Service Requests',
    activeRequests: 'Active Requests',
    
    // Breadcrumb
    home: 'Home',
    serviceRequests: 'Service Requests',
    
    // Actions
    bulkAction: 'Bulk action',
    bulkActionSuccess: 'action completed for {count} requests',
    unknownAction: 'Unknown action',
    
    // Empty states
    noRequestsYet: 'No requests yet',
    
    // Error messages
    error: 'Error'
  },
  ar: {
    // Page titles
    pageTitle: 'طلبات الخدمة',
    activeRequests: 'الطلبات النشطة',
    
    // Breadcrumb
    home: 'الرئيسية',
    serviceRequests: 'طلبات الخدمة',
    
    // Actions
    bulkAction: 'إجراء جماعي',
    bulkActionSuccess: 'تم إكمال الإجراء لـ {count} طلب',
    unknownAction: 'إجراء غير معروف',
    
    // Empty states
    noRequestsYet: 'لا توجد طلبات بعد',
    
    // Error messages
    error: 'خطأ'
  }
};

// New modular components
import RequestsPageHeader from './components/RequestsPageHeader';
import RequestsSummaryStats from './components/RequestsSummaryStats';
import RequestsQuickStats from './components/RequestsQuickStats';
import RequestsFiltersBar from './components/RequestsFiltersBar';
import RequestsGridView from './components/RequestsGridView';
import RequestsBulkActionsBar from './components/RequestsBulkActionsBar';
import DataTable from '@/app/components/ui/DataTable';
import { getTableColumns } from './components/table-columns';

// Hooks and types
import { useRequestsList } from './hooks/useRequestsList';
import { useTicketSummary } from './hooks/useTicketSummary';
import { ServiceRequest } from '@/services/types/request-list.types';

// Existing modals
import RequestDetailModal from './RequestDetailModal';
import CreateTicketModal from '@/app/dashboard/components/CreateTicketModal';

export default function RequestsListPage() {
  const toast = useToast();

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedRequests, setSelectedRequests] = useState<ServiceRequest[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // Modal states
  const [detailModal, setDetailModal] = useState<{ open: boolean, item: ServiceRequest | null }>({
    open: false,
    item: null
  });
  const [createTicketModal, setCreateTicketModal] = useState(false);

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

  // Main data hook
  const {
    data,
    loading,
    tableLoading,
    error,
    refetch,
    updateFilters,
    resetFilters,
    updatePagination
  } = useRequestsList();

  // Ticket summary hook
  const {
    summary: ticketSummary,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary
  } = useTicketSummary();

  // Debug logging
  console.log('🔍 RequestsPage - Ticket Summary State:', {
    ticketSummary,
    summaryLoading,
    summaryError,
    hasSummary: !!ticketSummary,
    summaryType: typeof ticketSummary
  });

  // Breadcrumb configuration
  const breadcrumbItems = [
    { label: t.home, href: '/dashboard' },
    { label: t.serviceRequests, href: '/dashboard/requests' },
    { label: t.activeRequests, active: true }
  ];

  // Event Handlers
  const handleRefresh = () => {
    refetch();
    refetchSummary();
  };

  const handleCreateRequest = () => {
    setCreateTicketModal(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchSubmit = (value: string) => {
    updateFilters({ search: value });
  };

  const handleApplyFilters = (filters: any) => {
    console.log('=== HANDLE APPLY FILTERS ===');
    console.log('Raw filters received:', filters);
    
    // Process filters to ensure they are strings
    const processedFilters: any = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      let processedValue: string | undefined;
      
      if (typeof value === 'string') {
        processedValue = value === 'all' ? undefined : value;
      } else if (value && typeof value === 'object' && 'target' in value && value.target) {
        // This is an event object, extract the value
        const target = value.target as { value: string };
        processedValue = target.value === 'all' ? undefined : target.value;
      } else {
        processedValue = undefined;
      }
      
      if (processedValue !== undefined && processedValue !== null && processedValue !== '') {
        processedFilters[key] = processedValue;
      }
    });
    
    console.log('Processed filters to update:', processedFilters);
    updateFilters(processedFilters);
  };

  const handleResetFilters = () => {
    resetFilters();
    setSearchValue('');
  };

  const handleViewModeChange = (mode: 'table' | 'grid') => {
    setViewMode(mode);
  };

  const handlePageChange = (page: number) => {
    console.log('handlePageChange called with page:', page);
    updatePagination(page);
  };

  const handleRecordsPerPageChange = (recordsPerPage: number) => {
    console.log('handleRecordsPerPageChange called with recordsPerPage:', recordsPerPage);
    updatePagination(1, recordsPerPage);
  };

  const handleRequestAction = (action: string, request: ServiceRequest) => {
    switch (action) {
      case 'view':
        setDetailModal({ open: true, item: request });
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Action handlers for DataTable
  const handleViewRequest = (request: ServiceRequest) => {
    setDetailModal({ open: true, item: request });
  };

  const handleBulkAction = (actionId: string) => {
    console.log('Bulk action:', actionId, 'for', selectedRequests.length, 'requests');
    // Handle bulk actions
    toast.success(t.bulkAction, t.bulkActionSuccess.replace('{count}', selectedRequests.length.toString()));
    setSelectedRequests([]);
  };



  const getActiveFiltersCount = () => {
    // This is now handled by the RequestsFiltersBar component internally
    return 0;
  };

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
          <DashboardHeader
            title={t.pageTitle}
            breadcrumbItems={breadcrumbItems}
          />

          {/* Language Switcher */}
          <div className="lg:ml-72 flex justify-end px-4 sm:px-6 lg:px-8 py-2">
            <LanguageSwitcher />
          </div>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <RequestsPageHeader
              summary={ticketSummary}
              onRefresh={handleRefresh}
              onCreateRequest={handleCreateRequest}
              loading={summaryLoading}
            />

            {/* Summary Stats */}
            {/* <RequestsSummaryStats
              summary={data.summary}
              loading={loading}
            /> */}

            {/* Quick Stats */}
            <RequestsQuickStats
              summary={ticketSummary}
              loading={summaryLoading}
            />

            {/* Filters Bar */}
            <RequestsFiltersBar
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              activeFiltersCount={getActiveFiltersCount()}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />

            {/* Bulk Actions Bar */}
            {selectedRequests.length > 0 && (
              <RequestsBulkActionsBar
                selectedCount={selectedRequests.length}
                bulkActions={data.bulkActions.actions}
                onBulkAction={handleBulkAction}
                onClearSelection={() => setSelectedRequests([])}
                loading={loading}
              />
            )}

            {/* Content Area */}
                          {error ? (
                <div className="text-center py-8">
                  <p className="text-primary-red">{t.error}</p>
                </div>
            ) : (
              <>
                {viewMode === 'table' ? (
                                     <DataTable
                     columns={getTableColumns({
                       handleViewRequest
                     })}
                    data={data.requests}
                    loading={tableLoading}
                    selectable={true}
                    onSelectionChange={setSelectedRequests}
                    pagination={{
                      currentPage: data.pagination.currentPage,
                      totalPages: data.pagination.totalPages,
                      totalRecords: data.pagination.totalItems,
                      recordsPerPage: data.pagination.itemsPerPage,
                      onPageChange: handlePageChange,
                      onRecordsPerPageChange: handleRecordsPerPageChange,
                      recordsPerPageOptions: data.pagination.pageSizeOptions
                    }}
                    sortConfig={{
                      key: 'createdDate',
                      direction: 'desc'
                    }}
                    onSortChange={(key: string, direction: 'asc' | 'desc') => {
                      console.log('Sort changed:', key, direction);
                    }}
                    emptyStateMessage={t.noRequestsYet}
                    className="mt-6"
                  />
                ) : (
                  <RequestsGridView
                    requests={data.requests}
                    loading={tableLoading}
                    selectedRequests={selectedRequests}
                    onSelectionChange={(e: any) => setSelectedRequests(e.target.value)}
                    onRequestAction={handleRequestAction}
                    loadingCardCount={8}
                  />
                )}
              </>
            )}
          </main>
        </div>



        {/* Modals */}

        {/* Detail Modal */}
        <RequestDetailModal
          open={detailModal.open}
          onClose={() => setDetailModal({ open: false, item: null })}
          item={detailModal.item as any}
          onActionComplete={() => {
            setDetailModal({ open: false, item: null });
            refetch();
            refetchSummary(); // Summary kartlarını da güncelle
          }}
          toast={toast}
        />

        {/* Create Ticket Modal */}
        <CreateTicketModal
          isOpen={createTicketModal}
          onClose={() => setCreateTicketModal(false)}
          onSuccess={() => {
            setCreateTicketModal(false);
            refetch();
            refetchSummary(); // Summary kartlarını da güncelle
          }}
        />



        {/* Toast Container */}
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </div>
    </ProtectedRoute>
  );
}