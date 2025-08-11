'use client'

import { useModulePageViewModel } from './hooks/useModulePageViewModel'
import PageHeader from './components/PageHeader'
import SearchAndFilters from './components/SearchAndFilters'
import QuickStats from './components/QuickStats'
import ContentArea from './components/ContentArea'

export default function IlanPage() {
  const vm = useModulePageViewModel()

  return (
    <div className="space-y-6 text-on-light dark:text-on-dark">
      <PageHeader
        title="İlanlar"
        totalLabel={`${vm.data.pagination.total.toLocaleString()} kayıt`}
        onRefresh={vm.data.refetch}
        onCreateNew={() => { /* route to add page when ready */ }}
      />

      <QuickStats stats={vm.quickStats} />

      <SearchAndFilters
        searchQuery={(vm.data as any).search || ''}
        onSearch={(q) => vm.data.fetchData({ search: q, page: 1 })}
        viewMode={vm.ui.viewMode}
        onViewModeChange={(m) => vm.ui.setViewMode(m)}
        onOpenFilters={vm.actions.openFilters}
      />

      <ContentArea
        data={vm.data.data}
        loading={vm.data.loading}
        error={vm.data.error}
        viewMode={vm.ui.viewMode}
        pagination={vm.data.pagination}
        onPageChange={(p) => vm.data.fetchData({ page: p })}
        onPageSizeChange={(s) => vm.data.fetchData({ limit: s, page: 1 })}
      />
    </div>
  )
}


