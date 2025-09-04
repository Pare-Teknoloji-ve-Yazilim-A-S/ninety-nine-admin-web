import React, { useState, useEffect } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import SearchBar from '@/app/components/ui/SearchBar';
import ViewToggle from '@/app/components/ui/ViewToggle';
import Badge from '@/app/components/ui/Badge';
import Select from '@/app/components/ui/Select';
import { RequestsFiltersBarProps } from '@/services/types/request-list.types';
import { useMaintenanceTechnicians } from '@/hooks/useMaintenanceTechnicians';
import { Filter, List, Grid3X3, X, Search } from 'lucide-react';

// Dil çevirileri
const translations = {
  tr: {
    // Search
    searchPlaceholder: 'Talep ID, açıklama veya daire numarası ile ara...',
    
    // View toggle
    table: 'Tablo',
    grid: 'Kart',
    
    // Filter labels
    category: 'Kategori',
    priority: 'Öncelik',
    status: 'Durum',
    technician: 'Teknisyen',
    
    // Filter placeholders
    allCategories: 'Tüm kategoriler',
    allPriorities: 'Tüm öncelikler',
    allStatuses: 'Tüm durumlar',
    allTechnicians: 'Tüm teknisyenler',
    
    // Category options
    plumbing: 'Su Tesisatı',
    electrical: 'Elektrik',
    heating: 'Isıtma',
    cleaning: 'Temizlik',
    security: 'Güvenlik',
    other: 'Diğer',
    
    // Priority options
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
    urgent: 'Acil',
    
    // Status options
    open: 'Açık',
    inProgress: 'İşlemde',
    waiting: 'Bekliyor',
    resolved: 'Çözüldü',
    closed: 'Kapalı',
    
    // Technician options
    unassigned: 'Atanmamış',
    tech1: 'Ahmet Yılmaz',
    tech2: 'Mehmet Demir',
    tech3: 'Ali Kaya',
    
    // Active filters
    activeFilters: 'filtre aktif',
    clearFilters: 'Filtreleri Temizle'
  },
  en: {
    // Search
    searchPlaceholder: 'Search by Request ID, description or apartment number...',
    
    // View toggle
    table: 'Table',
    grid: 'Grid',
    
    // Filter labels
    category: 'Category',
    priority: 'Priority',
    status: 'Status',
    technician: 'Technician',
    
    // Filter placeholders
    allCategories: 'All categories',
    allPriorities: 'All priorities',
    allStatuses: 'All statuses',
    allTechnicians: 'All technicians',
    
    // Category options
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    heating: 'Heating',
    cleaning: 'Cleaning',
    security: 'Security',
    other: 'Other',
    
    // Priority options
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
    
    // Status options
    open: 'Open',
    inProgress: 'In Progress',
    waiting: 'Waiting',
    resolved: 'Resolved',
    closed: 'Closed',
    
    // Technician options
    unassigned: 'Unassigned',
    tech1: 'Ahmet Yılmaz',
    tech2: 'Mehmet Demir',
    tech3: 'Ali Kaya',
    
    // Active filters
    activeFilters: 'filters active',
    clearFilters: 'Clear Filters'
  },
  ar: {
    // Search
    searchPlaceholder: 'البحث برقم الطلب أو الوصف أو رقم الشقة...',
    
    // View toggle
    table: 'جدول',
    grid: 'شبكة',
    
    // Filter labels
    category: 'الفئة',
    priority: 'الأولوية',
    status: 'الحالة',
    technician: 'الفني',
    
    // Filter placeholders
    allCategories: 'جميع الفئات',
    allPriorities: 'جميع الأولويات',
    allStatuses: 'جميع الحالات',
    allTechnicians: 'جميع الفنيين',
    
    // Category options
    plumbing: 'السباكة',
    electrical: 'الكهرباء',
    heating: 'التدفئة',
    cleaning: 'التنظيف',
    security: 'الأمان',
    other: 'أخرى',
    
    // Priority options
    low: 'منخفض',
    medium: 'متوسط',
    high: 'عالي',
    urgent: 'عاجل',
    
    // Status options
    open: 'مفتوح',
    inProgress: 'قيد التنفيذ',
    waiting: 'في الانتظار',
    resolved: 'تم الحل',
    closed: 'مغلق',
    
    // Technician options
    unassigned: 'غير محدد',
    tech1: 'أحمد يلماز',
    tech2: 'محمد ديمير',
    tech3: 'علي كايا',
    
    // Active filters
    activeFilters: 'مرشح نشط',
    clearFilters: 'مسح المرشحات'
  }
};

export default function RequestsFiltersBar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  activeFiltersCount,
  viewMode,
  onViewModeChange,
  filters,
  onApplyFilters,
  onResetFilters
}: RequestsFiltersBarProps & {
  filters?: any;
  onApplyFilters?: (filters: any) => void;
  onResetFilters?: () => void;
}) {
  // Dil tercihini localStorage'dan al
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Fetch maintenance technicians
  const { technicians, loading: techniciansLoading } = useMaintenanceTechnicians();

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

  const [localFilters, setLocalFilters] = useState({
    category: '',
    priority: '',
    status: '',
    assignee: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Apply filters immediately
    if (onApplyFilters) {
      onApplyFilters(newFilters);
    }
  };

  const handleResetFilters = () => {
    setLocalFilters({
      category: '',
      priority: '',
      status: '',
      assignee: ''
    });
    
    if (onResetFilters) {
      onResetFilters();
    }
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <Card className="mb-6 relative">
      <div className="p-6">
        {/* Search Bar and View Toggle */}
        <div className="flex items-center gap-64 mb-4">
          <div className="flex-1 max-w-[70%]">
            <SearchBar
              placeholder={t.searchPlaceholder}
              value={searchValue}
              onChange={onSearchChange}
              onSearch={onSearchSubmit}
              debounceMs={500}
            />
          </div>
          
          {/* View Toggle */}
          <div className="flex-shrink-0">
            <ViewToggle
              options={[
                { id: 'table', label: t.table, icon: List },
                { id: 'grid', label: t.grid, icon: Grid3X3 },
              ]}
              activeView={viewMode}
              onViewChange={(viewId) => onViewModeChange(viewId as 'table' | 'grid')}
              size="sm"
            />
          </div>
        </div>

        {/* Inline Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Kategori Filtresi */}
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              {t.category}
            </label>
            <Select
              value={localFilters.category}
              onChange={(e: any) => handleFilterChange('category', e.target.value)}
              placeholder={t.allCategories}
              options={[
                { value: '', label: t.allCategories },
                { value: 'plumbing', label: t.plumbing },
                { value: 'electrical', label: t.electrical },
                { value: 'heating', label: t.heating },
                { value: 'cleaning', label: t.cleaning },
                { value: 'security', label: t.security },
                { value: 'other', label: t.other }
              ]}
            />
          </div>

          {/* Öncelik Filtresi */}
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              {t.priority}
            </label>
            <Select
              value={localFilters.priority}
              onChange={(e: any) => handleFilterChange('priority', e.target.value)}
              placeholder={t.allPriorities}
              options={[
                { value: '', label: t.allPriorities },
                { value: 'low', label: t.low },
                { value: 'medium', label: t.medium },
                { value: 'high', label: t.high },
                { value: 'urgent', label: t.urgent }
              ]}
            />
          </div>

          {/* Durum Filtresi */}
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              {t.status}
            </label>
            <Select
              value={localFilters.status}
              onChange={(e: any) => handleFilterChange('status', e.target.value)}
              placeholder={t.allStatuses}
              options={[
                { value: '', label: t.allStatuses },
                { value: 'open', label: t.open },
                { value: 'in_progress', label: t.inProgress },
                { value: 'waiting', label: t.waiting },
                { value: 'resolved', label: t.resolved },
                { value: 'closed', label: t.closed }
              ]}
            />
          </div>

          {/* Teknisyen Filtresi */}
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              {t.technician}
            </label>
            <Select
              value={localFilters.assignee}
              onChange={(e: any) => handleFilterChange('assignee', e.target.value)}
              placeholder={t.allTechnicians}
              options={[
                  { value: '', label: t.allTechnicians },
                  ...(technicians?.map(tech => ({
                    value: tech.value,
                    label: tech.label
                  })) || [])
                ]}
                disabled={techniciansLoading}
            />
          </div>
        </div>

        {/* Bottom Bar - Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-3 pt-4 border-t border-background-light-secondary dark:border-background-secondary">
            <Badge variant="soft" color="primary" className="text-xs">
              {Object.values(localFilters).filter(v => v !== '').length} {t.activeFilters}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={handleResetFilters}
              className="text-text-light-muted dark:text-text-muted hover:text-primary-red"
            >
              {t.clearFilters}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}