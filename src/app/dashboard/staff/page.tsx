'use client'

/**
 * Personel Yönetimi sayfası:
 * - Listeleme, arama, filtreleme, sayfalandırma
 * - Personel oluşturma/düzenleme (modal)
 * - Toplu işlemler (aktif/pasif/sil)
 * - Dışa aktarma / içe aktarma
 * - Hızlı filtreler ve gelişmiş filtre çekmecesi
 */

import PageHeader from './components/PageHeader'
import QuickStats from './components/QuickStats'
import SearchAndFilters from './components/SearchAndFilters'
import QuickFilters from './components/QuickFilters'
import FilterDrawer from './components/FilterDrawer'
import ContentArea from './components/ContentArea'
import StaffFormModal from './components/StaffFormModal'
import ImportFileInput from './components/ImportFileInput'
import { useStaffPageViewModel } from './hooks/useStaffPageViewModel'
import type { CreateStaffDto, UpdateStaffDto } from '@/services/types/staff.types'

function StaffPage () {
  const { ui, data, refs, actions } = useStaffPageViewModel()

  const totalCount = (typeof data.pagination?.total === 'number' && data.pagination.total >= 0)
    ? data.pagination.total
    : Array.isArray(data.staff)
      ? data.staff.length
      : 0
  const totalCountLabel = `${totalCount.toLocaleString()} kişi`

  return (
    <div className="space-y-6 text-on-light dark:text-on-dark max-w-full">
             <PageHeader
         title="Personel Yönetimi"
         totalLabel={totalCountLabel}
         summary={data.statsSummary}
         onCreateNew={actions.openCreate}
       />

      <StaffFormModal
        open={ui.isStaffFormOpen}
        editingStaff={ui.editingStaff}
        departments={data.departments}
        positions={data.positions}
        managers={data.managers}
        onSubmit={(payload: CreateStaffDto | UpdateStaffDto) => (
          ui.editingStaff ? actions.onUpdate(payload as UpdateStaffDto) : actions.onCreate(payload as CreateStaffDto)
        )}
        onClose={actions.closeForm}
        isLoading={data.isLoading}
      />

      <QuickStats stats={data.quickStats} />

      <SearchAndFilters
        searchQuery={data.searchQuery}
        onSearch={actions.setSearchQuery}
        onOpenFilters={actions.openFilters}
      />

      <QuickFilters quickFilters={data.quickFilters} onApply={actions.applyQuickFilter} />

      <ContentArea
        staff={data.staff}
        totalCount={data.pagination.total}
        currentPage={data.pagination.page}
        totalPages={data.pagination.totalPages}
        pageSize={data.pagination.limit}
        isLoading={data.isLoading}
        error={data.error}
        searchQuery={data.searchQuery}
        selectedStaff={ui.selectedStaffIds}
        viewMode={'table'}
        onSearch={actions.setSearchQuery}
        onPageChange={actions.setPage}
        onPageSizeChange={actions.setLimit}
        onSelectionChange={actions.setSelected}
        onViewModeChange={() => { /* grid disabled */ }}
        onView={actions.onView}
        onEdit={actions.openEdit}
        onDelete={actions.onDelete}
        onActivate={actions.onActivate}
        onDeactivate={actions.onDeactivate}
        onBulkAction={(action, ids) => actions.onBulk(action as any, ids)}
      />

      <ImportFileInput inputRef={refs.importInputRef} onChange={actions.onImportFile} />

      <FilterDrawer
        open={ui.filtersOpen}
        onClose={actions.closeFilters}
        filters={data.filters as any}
        departments={data.departments}
        positions={data.positions}
        quickFilters={data.quickFilters}
        savedFilters={data.savedFilters}
        onFiltersChange={(f) => actions.setFilters(f as any)}
        onQuickFilterApply={actions.applyQuickFilter}
        onSaveFilter={() => { /* no-op */ }}
        onDeleteSavedFilter={() => { /* no-op */ }}
        onExportFilters={actions.onExport}
        onImportFilters={() => { /* handled via hidden input in component */ }}
        onReset={() => actions.setFilters({})}
      />
    </div>
  )
}

export default StaffPage


