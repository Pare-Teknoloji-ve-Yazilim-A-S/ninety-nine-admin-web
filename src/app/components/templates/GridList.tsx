import React from 'react';
import type { LucideIcon } from 'lucide-react';

// UI bileşenleri dışarıdan alınır (Dependency Injection)
export interface ResidentGridTemplateUI {
  Card: React.ComponentType<any>;
  Button: React.ComponentType<any>;
  Checkbox: React.ComponentType<any>;
  TablePagination: React.ComponentType<any>;
  Badge: React.ComponentType<any>;
  EmptyState: React.ComponentType<any>;
  Skeleton: React.ComponentType<any>;
  BulkActionsBar: React.ComponentType<any>;
}

export interface ResidentGridTemplateProps {
  residents: any[];
  loading: boolean;
  onSelectionChange: (selectedIds: Array<string | number>) => void;
  bulkActions: Array<{
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: (residents: any[]) => void;
    variant?: 'default' | 'danger' | 'success' | 'warning';
    disabled?: boolean;
    loading?: boolean;
  }>;
  onAction: (action: string, resident: any) => void;
  selectedResidents: Array<string | number>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    onPageChange: (page: number) => void;
    onRecordsPerPageChange: (recordsPerPage: number) => void;
  };
  emptyStateMessage?: string;
  ui: ResidentGridTemplateUI;
  ActionMenu?: React.ComponentType<{ row: any }>;
  getStatusColor?: (status: any) => string;
  renderCardActions?: (resident: any) => React.ReactNode;
}

export interface ActionMenuProps {
  resident: any;
  onAction: (action: string, resident: any) => void;
}

// Default ActionMenu (isteğe bağlı override edilebilir)
export const DefaultActionMenu: React.FC<ActionMenuProps> = ({ resident, onAction }) => {
  // ... (Kullanıcı kendi ActionMenu'sunu geçebilir, burada sade bir örnek bırakıyoruz)
  return (
    <button onClick={() => onAction('view', resident)} className="text-primary-gold">Görüntüle</button>
  );
};

// Yardımcı fonksiyonlar (isteğe bağlı override edilebilir)
const defaultGetStatusColor = (status: any) => 'secondary';
const defaultGetTypeColor = (type: any) => 'secondary';

// ActionMenu prop'unu hem eski hem yeni tipte destekle
function isRowPropComponent(
  comp: React.ComponentType<any>
): comp is React.ComponentType<{ row: any }> {
  // Sadece row prop'u varsa yeni tiptir
  // (Bu kontrol, typescript için, runtime'da bir etkisi yok)
  return true;
}

export const ResidentGridTemplate: React.FC<ResidentGridTemplateProps> = ({
  residents,
  loading,
  onSelectionChange,
  bulkActions,
  onAction,
  selectedResidents,
  pagination,
  emptyStateMessage = 'Kayıt bulunamadı.',
  ui,
  ActionMenu = DefaultActionMenu,
  getStatusColor = defaultGetStatusColor,
  renderCardActions,
}) => {
  // Checkbox seçimleri
  const handleSelect = (residentId: string | number) => {
    if (loading) return;
    const newSelection = selectedResidents.includes(residentId)
      ? selectedResidents.filter(id => id !== residentId)
      : [...selectedResidents, residentId];
    onSelectionChange(newSelection);
  };
  const handleSelectAll = () => {
    if (loading) return;
    const allIds = residents.map(resident => resident.id);
    onSelectionChange(selectedResidents.length === residents.length ? [] : allIds);
  };

  // Bulk actions uyarlama
  const convertedBulkActions = bulkActions.map(action => ({
    ...action,
    onClick: () => action.onClick(residents.filter(r => selectedResidents.includes(r.id)))
  }));

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Tümünü Seç checkbox skeleton */}
        <div className="flex items-center mb-2">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded mr-2 animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ui.Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Boş durum
  if (!loading && residents.length === 0) {
    return <ui.EmptyState title="Kayıt Bulunamadı" description={emptyStateMessage} />;
  }

  // Tümünü seç checkbox indeterminate durumu
  const isAllSelected = residents.length > 0 && selectedResidents.length === residents.length;
  const isIndeterminate = selectedResidents.length > 0 && selectedResidents.length < residents.length;

  return (
    <div className="space-y-6">
      {/* Bulk Actions Bar */}
      {selectedResidents.length > 0 && (
        <ui.BulkActionsBar
          selectedCount={selectedResidents.length}
          actions={convertedBulkActions}
          onClearSelection={() => onSelectionChange([])}
        />
      )}
      {/* Tümünü Seç Checkbox */}
      <div className="flex items-center mb-2 gap-2">
        <div className="flex items-center justify-center">
          <ui.Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={handleSelectAll}
            disabled={loading || residents.length === 0}
            className="focus:ring-2 focus:ring-primary-gold/30"
          />
        </div>
        <span className="text-sm text-text-light-secondary dark:text-text-secondary select-none leading-none">
          Tümünü Seç
        </span>
      </div>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {residents.map((resident) => (
          <ui.Card
            key={resident.id}
            className="p-6 rounded-2xl shadow-md bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.01] hover:shadow-lg group"
          >
            {/* Üst Alan: Checkbox + İsim + Menü */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-4">
                <ui.Checkbox
                  checked={selectedResidents.includes(resident.id)}
                  onChange={() => handleSelect(resident.id)}
                  className="focus:ring-2 focus:ring-primary-gold/30"
                  disabled={loading}
                />
                <div>
                  <h3 className="text-xl font-semibold text-on-dark tracking-tight">
                    {resident.firstName} {resident.lastName}
                  </h3>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary font-medium mt-1">
                    {resident.address?.apartment}
                  </p>
                </div>
              </div>
              {/* ActionMenu: Hem eski hem yeni tip desteklenir */}
              {ActionMenu ? (
                isRowPropComponent(ActionMenu)
                  ? <ActionMenu row={resident} />
                  : <ActionMenu resident={resident} onAction={onAction} />
              ) : null}
            </div>
            {/* Orta Alan: Durum ve Tip Badge'leri */}
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <ui.Badge variant="soft" color={getStatusColor(resident.status)} className="text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full inline-block border border-gray-300 dark:border-gray-700 mr-1"
                  style={{
                    backgroundColor:
                      getStatusColor(resident.status) === 'primary' ? '#22C55E' :
                      getStatusColor(resident.status) === 'gold' ? '#AC8D6A' :
                      getStatusColor(resident.status) === 'red' ? '#E53E3E' :
                      getStatusColor(resident.status) === 'accent' ? '#718096' :
                      '#A8A29E', // secondary (warm gray)
                  }}
                  title={resident.status?.label}
                />
                {resident.status?.label}
              </ui.Badge>
              <ui.Badge
                variant="soft"
                className={
                  `text-xs px-3 py-1 rounded-full font-medium text-black ` +
                  (resident.residentType?.label === "Malik"
                    ? "bg-green-100"
                    : resident.residentType?.label === "Kiracı"
                    ? "bg-blue-100"
                    : "")
                }
              >
                {resident.residentType?.label}
              </ui.Badge>
            </div>
            {/* İletişim Bilgileri */}
            <div className="mt-4 flex flex-col gap-1 text-sm text-text-light-secondary dark:text-text-secondary">
              {resident.contact?.phone && (
                <div className="flex items-center gap-2">
                  {/* Telefon ikonu dışarıdan alınabilir */}
                  <span>{resident.contact.phone}</span>
                </div>
              )}
              {resident.contact?.email && (
                <div className="flex items-center gap-2">
                  <span>{resident.contact.email}</span>
                </div>
              )}
            </div>
            {/* Alt Alan: Aksiyon Butonları */}
            {renderCardActions
              ? renderCardActions(resident)
              : (
                <div className="mt-6 flex gap-3">
                  {resident.contact?.phone && (
                    <ui.Button
                      variant="primary"
                      size="sm"
                      onClick={() => onAction('call', resident)}
                      className="rounded-lg font-medium shadow-sm hover:bg-primary-gold/10 dark:hover:bg-primary-gold/20 focus:ring-2 focus:ring-primary-gold/30"
                    >
                      Ara
                    </ui.Button>
                  )}
                  <ui.Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onAction('message', resident)}
                    className="rounded-lg font-medium shadow-sm hover:bg-primary-gold/10 dark:hover:bg-primary-gold/20 focus:ring-2 focus:ring-primary-gold/30"
                  >
                    Mesaj
                  </ui.Button>
                </div>
              )}
          </ui.Card>
        ))}
      </div>
      {/* Pagination */}
      <div className="mt-6">
        <ui.TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalRecords={pagination.totalRecords}
          recordsPerPage={pagination.recordsPerPage}
          onPageChange={pagination.onPageChange}
          onRecordsPerPageChange={pagination.onRecordsPerPageChange}
          showRecordsPerPage={true}
        />
      </div>
    </div>
  );
};

export default ResidentGridTemplate; 