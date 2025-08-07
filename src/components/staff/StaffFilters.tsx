'use client'

import React, { useState } from 'react'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Label from '@/app/components/ui/Label'
import Select from '@/app/components/ui/Select'
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
  STAFF_STATUS_CONFIG,
  EMPLOYMENT_TYPE_CONFIG,
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
    
    updateFilter(key, newValues.length > 0 ? newValues : undefined)
  }

  // Handle date range
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range)
    updateFilter('hireDateFrom', range.from?.toISOString().split('T')[0])
    updateFilter('hireDateTo', range.to?.toISOString().split('T')[0])
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
    if (filters.departmentIds?.length) count++
    if (filters.positionIds?.length) count++
    if (filters.managerIds?.length) count++
    if (filters.hireDateFrom || filters.hireDateTo) count++
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
            Filtreler
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
              Temizle
            </Button>
            
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
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
            placeholder="Personel ara..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        {quickFilters.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Hızlı Filtreler</Label>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((quickFilter) => (
                <Button
                  key={quickFilter.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickFilterApply(quickFilter.id)}
                  className="h-8"
                >
                  {quickFilter.name}
                  <Badge variant="secondary" className="ml-2">
                    {quickFilter.count}
                  </Badge>
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
              <Label className="text-sm font-medium">Durum</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STAFF_STATUS_CONFIG).map(([status, config]) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={(filters.status || []).includes(status as StaffStatus)}
                      onCheckedChange={(checked) => 
                        handleArrayFilter('status', status, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`status-${status}`}
                      className="text-sm flex items-center"
                    >
                      <div 
                        className={cn(
                          "w-2 h-2 rounded-full mr-2",
                          config.color
                        )}
                      />
                      {config.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Employment Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">İstihdam Türü</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(EMPLOYMENT_TYPE_CONFIG).map(([type, config]) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`employment-${type}`}
                      checked={(filters.employmentType || []).includes(type as EmploymentType)}
                      onCheckedChange={(checked) => 
                        handleArrayFilter('employmentType', type, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`employment-${type}`}
                      className="text-sm flex items-center"
                    >
                      <div 
                        className={cn(
                          "w-2 h-2 rounded-full mr-2",
                          config.color
                        )}
                      />
                      {config.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Departman</Label>
              <Select
                value={(filters.departmentIds || [])[0] || ''}
                onValueChange={(value) => 
                  updateFilter('departmentIds', value ? [value] : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Departman seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tümü</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Position Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pozisyon</Label>
              <Select
                value={(filters.positionIds || [])[0] || ''}
                onValueChange={(value) => 
                  updateFilter('positionIds', value ? [value] : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pozisyon seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tümü</SelectItem>
                  {positions.map((pos) => (
                    <SelectItem key={pos.id} value={pos.id.toString()}>
                      {pos.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hire Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">İşe Başlama Tarihi</Label>
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
                      "Tarih aralığı seçiniz"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => handleDateRangeChange(range || { from: undefined, to: undefined })}
                    numberOfMonths={2}
                    locale={tr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Maaş Aralığı (TL)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.salaryMin || ''}
                  onChange={(e) => 
                    updateFilter('salaryMin', e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.salaryMax || ''}
                  onChange={(e) => 
                    updateFilter('salaryMax', e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Kayıtlı Filtreler</Label>
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
                          Uygula
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
                      Kaydet
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <Label htmlFor="filter-name">Filtre Adı</Label>
                      <Input
                        id="filter-name"
                        placeholder="Filtre adı giriniz"
                        value={saveFilterName}
                        onChange={(e) => setSaveFilterName(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSaveDialog(false)}
                        >
                          İptal
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveFilter}
                          disabled={!saveFilterName.trim()}
                        >
                          Kaydet
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button variant="outline" size="sm" onClick={onExportFilters}>
                  <Download className="h-4 w-4 mr-1" />
                  Dışa Aktar
                </Button>

                <Button variant="outline" size="sm" asChild>
                  <label>
                    <Upload className="h-4 w-4 mr-1" />
                    İçe Aktar
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