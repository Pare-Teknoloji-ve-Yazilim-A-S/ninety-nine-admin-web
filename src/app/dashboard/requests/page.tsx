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
import RequestsFilterPanel from './components/RequestsFilterPanel';
import RequestsTableView from './components/RequestsTableView';
import RequestsGridView from './components/RequestsGridView';
import RequestsBulkActionsBar from './components/RequestsBulkActionsBar';

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
  const [showFilters, setShowFilters] = useState(false);
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
    error,
    refetch,
    updateFilters,
    resetFilters
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
    updateFilters(filters);
  };

  const handleResetFilters = () => {
    resetFilters();
    setSearchValue('');
  };

  const handleViewModeChange = (mode: 'table' | 'grid') => {
    setViewMode(mode);
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
    // This would be calculated based on actual active filters
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
              onShowFilters={() => setShowFilters(true)}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
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
                  <RequestsTableView
                    requests={data.requests}
                    columns={data.tableColumns}
                    loading={loading}
                    selectedRequests={selectedRequests}
                    onSelectionChange={(e: any) => setSelectedRequests(e.target.value)}
                    onRequestAction={handleRequestAction}
                    sortOptions={data.sortOptions}
                    onSortChange={(sort) => console.log('Sort changed:', sort)}
                  />
                ) : (
                  <RequestsGridView
                    requests={data.requests}
                    loading={loading}
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

        {/* Filter Panel Sidebar */}
        <div className={`fixed inset-0 z-50 ${showFilters ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${showFilters ? 'opacity-50' : 'opacity-0'
              }`}
            onClick={() => setShowFilters(false)}
          />
          {/* Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] shadow-2xl transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'
              }`}
          >
            <RequestsFilterPanel
              filters={data.filters}
              activeFilters={{}}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              onClose={() => setShowFilters(false)}
              isOpen={showFilters}
            />
          </div>
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