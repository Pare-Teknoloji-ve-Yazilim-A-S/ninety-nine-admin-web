'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/app/components/ui/Toast';

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
import { ServiceRequest } from '@/services/types/request-list.types';

// Existing modals
import RequestDetailModal from './RequestDetailModal';
import CreateTicketModal from '@/app/dashboard/components/CreateTicketModal';
import ConfirmationModal from '@/app/components/ui/ConfirmationModal';

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
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    request: null as ServiceRequest | null
  });

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

  // Breadcrumb configuration
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/dashboard' },
    { label: 'Hizmet Talepleri', href: '/dashboard/requests' },
    { label: 'Aktif Talepler', active: true }
  ];

  // Event Handlers
  const handleRefresh = () => {
    refetch();
    // Summary artık liste verisinden hesaplanıyor; ekstra istek yok
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
      case 'edit':
        // Handle edit action
        console.log('Edit request:', request.id);
        break;
      case 'delete':
        setConfirmationDialog({ isOpen: true, request });
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Action handlers for DataTable
  const handleViewRequest = (request: ServiceRequest) => {
    setDetailModal({ open: true, item: request });
  };

  const handleEditRequest = (request: ServiceRequest) => {
    console.log('Edit request:', request.id);
  };

  const handleDeleteRequest = (request: ServiceRequest) => {
    setConfirmationDialog({ isOpen: true, request });
  };

  const handleBulkAction = (actionId: string) => {
    console.log('Bulk action:', actionId, 'for', selectedRequests.length, 'requests');
    // Handle bulk actions
    toast.success('Toplu işlem', `${actionId} işlemi ${selectedRequests.length} talep için gerçekleştirildi`);
    setSelectedRequests([]);
  };

  const handleConfirmDelete = () => {
    if (confirmationDialog.request) {
      console.log('Delete confirmed for:', confirmationDialog.request.id);
      toast.success('Talep silindi', 'Talep başarıyla silindi');
      setConfirmationDialog({ isOpen: false, request: null });
      refetch();
    }
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
            title="Hizmet Talepleri"
            breadcrumbItems={breadcrumbItems}
          />

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <RequestsPageHeader
              summary={data.summary}
              onRefresh={handleRefresh}
              onCreateRequest={handleCreateRequest}
              loading={loading}
            />

            {/* Summary Stats */}
            {/* <RequestsSummaryStats
              summary={data.summary}
              loading={loading}
            /> */}

            {/* Quick Stats */}
            <RequestsQuickStats
              quickStats={data.quickStats}
              loading={loading}
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
                <p className="text-primary-red">{error}</p>
              </div>
            ) : (
              <>
                {viewMode === 'table' ? (
                  <DataTable
                    columns={getTableColumns({
                      handleViewRequest,
                      handleEditRequest,
                      handleDeleteRequest
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
                    emptyStateMessage="Henüz talep bulunmuyor"
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
          }}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationDialog.isOpen}
          onClose={() => setConfirmationDialog({ isOpen: false, request: null })}
          onConfirm={handleConfirmDelete}
          title="Talebi Sil"
          description={
            confirmationDialog.request
              ? `"${confirmationDialog.request.title}" adlı talep kalıcı olarak silinecektir. Bu işlem geri alınamaz.`
              : "Bu talebi silmek istediğinizden emin misiniz?"
          }
          confirmText="Sil"
          cancelText="İptal"
          variant="danger"
          loading={false}
          itemName={confirmationDialog.request?.title}
          itemType="talep"
        />

        {/* Toast Container */}
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </div>
    </ProtectedRoute>
  );
}