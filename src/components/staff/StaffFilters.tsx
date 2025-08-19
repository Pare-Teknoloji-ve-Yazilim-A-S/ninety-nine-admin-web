'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Label from '@/app/components/ui/Label'
import Select, { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/Select'
import RadioButton from '@/app/components/ui/RadioButton'
import Badge from '@/app/components/ui/Badge'
import Separator from '@/app/components/ui/Separator'
import Collapsible, { CollapsibleTrigger, CollapsibleContent } from '@/app/components/ui/Collapsible'
import Popover, { PopoverTrigger, PopoverContent } from '@/app/components/ui/Popover'
import Calendar from '@/app/components/ui/Calendar'
import Checkbox from '@/app/components/ui/Checkbox'
import {
  StaffStatus,
  EmploymentType,
  StaffFilterParams
} from '@/services/types/staff.types'
import { Department, Position } from '@/services/types/department.types'
import {
  getStaffStatusConfig,
  getEmploymentTypeConfig,
  FilterOption,
  QuickFilter,
  SavedFilter
} from '@/services/types/ui.types'
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Calendar as CalendarIcon,
  Save,
  Trash2,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

// Dil çevirileri
const translations = {
  tr: {
    // Filter labels
    employmentType: 'İstihdam Türü',
    employmentStatus: 'Çalışma Durumu',
    department: 'Departman',
    all: 'Tümü',
    
    // Actions
    saveFilter: 'Filtreyi Kaydet',
    deleteFilter: 'Filtreyi Sil',
    exportFilters: 'Filtreleri Dışa Aktar',
    importFilters: 'Filtreleri İçe Aktar',
    reset: 'Sıfırla',
    clear: 'Temizle',
    apply: 'Uygula',
    cancel: 'İptal',
    
    // Placeholders
    searchStaff: 'Personel ara...',
    filterName: 'Filtre adı...',
    selectDateRange: 'Tarih aralığı seçiniz',
    min: 'Min',
    max: 'Max',
    
    // Section titles
    filters: 'Filtreler',
    quickFilters: 'Hızlı Filtreler',
    status: 'Durum',
    position: 'Pozisyon',
    startDate: 'İşe Başlama Tarihi',
    salaryRange: 'Maaş Aralığı (TL)',
    savedFilters: 'Kayıtlı Filtreler',
    filterNameLabel: 'Filtre Adı',
    advancedFilters: 'Gelişmiş Filtreler'
  },
  en: {
    // Filter labels
    employmentType: 'Employment Type',
    employmentStatus: 'Employment Status',
    department: 'Department',
    all: 'All',
    
    // Actions
    saveFilter: 'Save Filter',
    deleteFilter: 'Delete Filter',
    exportFilters: 'Export Filters',
    importFilters: 'Import Filters',
    reset: 'Reset',
    clear: 'Clear',
    apply: 'Apply',
    cancel: 'Cancel',
    
    // Placeholders
    searchStaff: 'Search staff...',
    filterName: 'Filter name...',
    selectDateRange: 'Select date range',
    min: 'Min',
    max: 'Max',
    
    // Section titles
    filters: 'Filters',
    quickFilters: 'Quick Filters',
    status: 'Status',
    position: 'Position',
    startDate: 'Start Date',
    salaryRange: 'Salary Range (TL)',
    savedFilters: 'Saved Filters',
    filterNameLabel: 'Filter Name',
    advancedFilters: 'Advanced Filters'
  },
  ar: {
    // Filter labels
    employmentType: 'نوع التوظيف',
    employmentStatus: 'حالة التوظيف',
    department: 'القسم',
    all: 'الكل',
    
    // Actions
    saveFilter: 'حفظ المرشح',
    deleteFilter: 'حذف المرشح',
    exportFilters: 'تصدير المرشحات',
    importFilters: 'استيراد المرشحات',
    reset: 'إعادة تعيين',
    clear: 'مسح',
    apply: 'تطبيق',
    cancel: 'إلغاء',
    
    // Placeholders
    searchStaff: 'البحث في الموظفين...',
    filterName: 'اسم المرشح...',
    selectDateRange: 'اختر نطاق التاريخ',
    min: 'الحد الأدنى',
    max: 'الحد الأقصى',
    
    // Section titles
    filters: 'المرشحات',
    quickFilters: 'المرشحات السريعة',
    status: 'الحالة',
    position: 'المنصب',
    startDate: 'تاريخ البدء',
    salaryRange: 'نطاق الراتب (TL)',
    savedFilters: 'المرشحات المحفوظة',
    filterNameLabel: 'اسم المرشح',
    advancedFilters: 'المرشحات المتقدمة'
  }
};

interface StaffFiltersProps {
  filters: StaffFilterParams
  departments: Department[]
  positions: Position[]
  quickFilters: QuickFilter[]
  savedFilters: SavedFilter[]
  onFiltersChange: (filters: StaffFilterParams) => void
  onQuickFilterApply: (filterId: string) => void
  onSaveFilter: (name: string, filters: StaffFilterParams) => void
  onDeleteSavedFilter: (filterId: string) => void
  onExportFilters: () => void
  onImportFilters: (file: File) => void
  onReset: () => void
  className?: string
}

export function StaffFilters({
  filters,
  departments,
  positions,
  quickFilters,
  savedFilters,
  onFiltersChange,
  onQuickFilterApply,
  onSaveFilter,
  onDeleteSavedFilter,
  onExportFilters,
  onImportFilters,
  onReset,
  className
}: StaffFiltersProps) {
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
  
  // i18n config'leri al
  const staffStatusConfig = getStaffStatusConfig(currentLanguage);
  const employmentTypeConfig = getEmploymentTypeConfig(currentLanguage);

  const [isExpanded, setIsExpanded] = useState(false)
  const [saveFilterName, setSaveFilterName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })

  // Update filters
  const updateFilter = (key: keyof StaffFilterParams, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  // Handle multiple selection for arrays
  const handleArrayFilter = (key: keyof StaffFilterParams, value: string, checked: boolean) => {
    const currentValues = (filters[key] as string[]) || []
    let newValues: string[]
    
    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter(v => v !== value)
    }
    
    updateFilter(key, newValues)
  }

  // Handle date range
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range)
    updateFilter('startDateFrom', range.from?.toISOString().split('T')[0])
    updateFilter('startDateTo', range.to?.toISOString().split('T')[0])
  }

  // Save current filters
  const handleSaveFilter = () => {
    if (saveFilterName.trim()) {
      onSaveFilter(saveFilterName.trim(), filters)
      setSaveFilterName('')
      setShowSaveDialog(false)
    }
  }

  // Import filters from file
  const handleImportFilters = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImportFilters(file)
      event.target.value = '' // Reset input
    }
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.status?.length) count++
    if (filters.employmentType?.length) count++
    if (filters.departmentId?.length) count++
    if (filters.positionId?.length) count++
    if (filters.managerId) count++
    if (filters.startDateFrom || filters.startDateTo) count++
    if (filters.salaryMin || filters.salaryMax) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <Card className={cn('w-full', className)} padding="md">
      <div className="pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg flex items-center font-semibold">
            <Filter className="h-5 w-5 mr-2" />
            {t.filters}
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={activeFilterCount === 0}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {t.clear}
            </Button>
            
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                          <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                <span>{t.advancedFilters}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform ml-2",
                  isExpanded && "rotate-180"
                )} />
              </Button>
            </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.searchStaff}
            value={filters.search || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFilter('search', e.target.value || undefined)}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        {quickFilters.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t.quickFilters}</Label>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((quickFilter) => (
                <Button
                  key={quickFilter.key}
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickFilterApply(quickFilter.key)}
                  className="h-8"
                >
                  <span>
                    {quickFilter.label}
                    <span className="ml-1 text-xs text-text-light-muted dark:text-text-muted">({quickFilter.count})</span>
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            <Separator />

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.status}</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(staffStatusConfig).map(([status, config]) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={(filters.status || []).includes(status as StaffStatus)}
                      onChange={(e) =>
                        handleArrayFilter('status', status, e.target.checked)
                      }
                    />
                    <Label 
                      htmlFor={`status-${status}`}
                      className="text-sm"
                    >
                      {config.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Employment Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.employmentType}</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(employmentTypeConfig).map(([type, config]) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`employment-${type}`}
                      checked={(filters.employmentType || []).includes(type as EmploymentType)}
                      onChange={(e) => 
                        handleArrayFilter('employmentType', type, e.target.checked)
                      }
                    />
                    <Label 
                      htmlFor={`employment-${type}`}
                      className="text-sm flex items-center"
                    >
                      <div 
                        className={cn(
                          "w-2 h-2 rounded-full mr-2",
                          "bg-primary-gold"
                        )}
                      />
                      {config.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Employment Status (Admin) */}
            <RadioButton
              label={t.employmentStatus}
              name="employmentStatus"
              value={(filters.employmentStatus || [])[0] || ''}
              onChange={(e) => updateFilter('employmentStatus', e.currentTarget.value ? [e.currentTarget.value] : undefined)}
              options={[{ value: '', label: t.all }, ...Object.entries(staffStatusConfig).map(([key, cfg]) => ({ value: key, label: cfg.label }))]}
              direction="vertical"
            />

            {/* Department Radio */}
            <RadioButton
              label={t.department}
              name="department"
              value={(filters.department || [])[0] || ''}
              onChange={(e) => updateFilter('department', e.currentTarget.value ? [e.currentTarget.value] : undefined)}
              options={[{ value: '', label: t.all }, ...departments.map(d => ({ value: String(d.id), label: d.name }))]}
              direction="vertical"
            />

            {/* Position Radio */}
            <RadioButton
              label={t.position}
              name="positionTitle"
              value={filters.positionTitle || ''}
              onChange={(e) => updateFilter('positionTitle', e.currentTarget.value || undefined)}
              options={[{ value: '', label: t.all }, ...positions.map(p => ({ value: p.title, label: p.title }))]}
              direction="vertical"
            />

            {/* Hire Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.startDate}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd MMM yyyy", { locale: tr })} -{" "}
                          {format(dateRange.to, "dd MMM yyyy", { locale: tr })}
                        </>
                      ) : (
                        format(dateRange.from, "dd MMM yyyy", { locale: tr })
                      )
                    ) : (
                      t.selectDateRange
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    value={dateRange.from}
                    onChange={(date) => handleDateRangeChange({ from: date, to: dateRange.to })}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.salaryRange}</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder={t.min}
                  value={filters.salaryMin || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFilter('salaryMin', e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                />
                <Input
                  type="number"
                  placeholder={t.max}
                  value={filters.salaryMax || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFilter('salaryMax', e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.savedFilters}</Label>
                <div className="space-y-2">
                  {savedFilters.map((savedFilter) => (
                    <div key={savedFilter.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{savedFilter.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(savedFilter.createdAt), "dd MMM yyyy", { locale: tr })}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onQuickFilterApply(savedFilter.id)}
                        >
                          {t.apply}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteSavedFilter(savedFilter.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <Popover open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      {t.saveFilter}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <Label htmlFor="filter-name">{t.filterNameLabel}</Label>
                      <Input
                        id="filter-name"
                        placeholder={t.filterName}
                        value={saveFilterName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSaveFilterName(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSaveDialog(false)}
                        >
                          {t.cancel}
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveFilter}
                          disabled={!saveFilterName.trim()}
                        >
                          {t.saveFilter}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button variant="outline" size="sm" onClick={onExportFilters}>
                  <Download className="h-4 w-4 mr-1" />
                  {t.exportFilters}
                </Button>

                <Button variant="outline" size="sm">
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-1" />
                    {t.importFilters}
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFilters}
                      className="hidden"
                    />
                  </label>
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  )
}

export default StaffFilters