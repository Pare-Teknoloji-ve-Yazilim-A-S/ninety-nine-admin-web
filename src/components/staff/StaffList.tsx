'use client'
import React, { useState, useMemo } from 'react'
import {
  Card,
  Button,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/components/ui'
import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/components/ui/DropdownMenu'
import { Staff, StaffStatus, EmploymentType } from '@/services/types/staff.types'
import { STAFF_STATUS_CONFIG, EMPLOYMENT_TYPE_CONFIG } from '@/services/types/ui.types'
import StaffCard from './StaffCard'
import {
  Search,
  Filter,
  Grid,
  List,
  Download,
  Upload,
  Plus,
  RefreshCw,
  Trash2,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewMode = 'table' | 'grid'

interface StaffListProps {
  staff: Staff[]
  totalCount: number
  currentPage: number
  totalPages: number
  pageSize: number
  isLoading?: boolean
  error?: string | null
  searchQuery?: string
  selectedStaff?: string[]
  viewMode?: ViewMode
  showSearchBar?: boolean
  showViewToggle?: boolean
  onSearch?: (query: string) => void
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  onSelectionChange?: (selectedIds: string[]) => void
  onViewModeChange?: (mode: ViewMode) => void
  onView?: (staff: Staff) => void
  onEdit?: (staff: Staff) => void
  onDelete?: (staff: Staff) => void
  onActivate?: (staff: Staff) => void
  onDeactivate?: (staff: Staff) => void
  onBulkAction?: (action: string, staffIds: string[]) => void
  onExport?: () => void
  onImport?: () => void
  onRefresh?: () => void
  onCreateNew?: () => void
  className?: string
}

export function StaffList({
  staff,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  isLoading = false,
  error = null,
  searchQuery = '',
  selectedStaff = [],
  viewMode = 'table',
  showSearchBar = true,
  showViewToggle = true,
  onSearch,
  onPageChange,
  onPageSizeChange,
  onSelectionChange,
  onViewModeChange,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onBulkAction,
  onExport,
  onImport,
  onRefresh,
  onCreateNew,
  className
}: StaffListProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  // Selection handlers
  const isAllSelected = selectedStaff.length === staff.length && staff.length > 0
  const isIndeterminate = selectedStaff.length > 0 && selectedStaff.length < staff.length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange?.(staff.map(s => s.id.toString()))
    } else {
      onSelectionChange?.([])
    }
  }

  const handleSelectStaff = (staffId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedStaff, staffId])
    } else {
      onSelectionChange?.(selectedStaff.filter(id => id !== staffId))
    }
  }

  // Search handler
  const handleSearch = (query: string) => {
    setLocalSearchQuery(query)
    onSearch?.(query)
  }

  // Utility functions
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  // Pagination component
  const PaginationControls = () => (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          {totalCount > 0 ? (
            <>Toplam {totalCount} kayıttan {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} arası gösteriliyor</>
          ) : (
            'Kayıt bulunamadı'
          )}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Sayfa başına:</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange?.(parseInt(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(1)}
            disabled={currentPage <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium">
              Sayfa {currentPage} / {totalPages}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <Card className={cn('w-full', className)}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Personel Listesi</h2>
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {onImport && (
              <Button variant="outline" size="sm" onClick={onImport}>
                <Upload className="h-4 w-4 mr-2" />
                İçe Aktar
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Dışa Aktar
              </Button>
            )}
            {onCreateNew && (
              <Button onClick={onCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Personel
              </Button>
            )}
          </div>
        </div>
        
        {/* Search + View Toggle + Bulk Actions */}
        <div className="flex items-center space-x-4 mt-4">
          {showSearchBar && (
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Personel ara..."
                  value={localSearchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {showViewToggle && (
              <div className="flex items-center rounded-md">
                <Button
                  variant={viewMode === 'table' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange?.('table')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange?.('grid')}
                  className="rounded-l-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Bulk Actions */}
            {selectedStaff.length > 0 && onBulkAction && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Toplu İşlemler ({selectedStaff.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onBulkAction('activate', selectedStaff)}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Aktifleştir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onBulkAction('deactivate', selectedStaff)}>
                    <UserX className="mr-2 h-4 w-4" />
                    Pasifleştir
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onBulkAction('delete', selectedStaff)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Sil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        {error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-destructive font-medium mb-2">Hata Oluştu</p>
              <p className="text-muted-foreground text-sm">{error}</p>
              {onRefresh && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRefresh}
                  className="mt-4"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tekrar Dene
                </Button>
              )}
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Yükleniyor...</span>
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Personel bulunamadı</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {staff.map((staffMember) => (
              <StaffCard
                key={staffMember.id}
                staff={staffMember}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      aria-label="Tümünü seç"
                      ref={(ref) => {
                        if (ref) ref.indeterminate = isIndeterminate
                      }}
                    />
                  </TableHead>
                  <TableHead>Personel</TableHead>
                  <TableHead>Pozisyon</TableHead>
                  <TableHead>Departman</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İstihdam Türü</TableHead>
                  <TableHead>İşe Başlama</TableHead>
                  <TableHead>Maaş</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((staffMember) => {
                  const statusConfig = STAFF_STATUS_CONFIG[staffMember.status]
                  const employmentConfig = EMPLOYMENT_TYPE_CONFIG[staffMember.employmentType]
                  const isSelected = selectedStaff.includes(staffMember.id.toString())
                  
                  return (
                    <TableRow key={staffMember.id} className={isSelected ? 'bg-muted/50' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => handleSelectStaff(staffMember.id.toString(), e.target.checked)}
                          aria-label={`${staffMember.firstName} ${staffMember.lastName} seç`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar 
                            src={staffMember.avatar}
                            alt={`${staffMember.firstName} ${staffMember.lastName}`}
                            fallback={getInitials(staffMember.firstName, staffMember.lastName)}
                            size="sm"
                            className="h-8 w-8"
                          />
                          <div>
                            <div className="font-medium">
                              {staffMember.firstName} {staffMember.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {staffMember.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {staffMember.position?.title || '-'}
                      </TableCell>
                      <TableCell>
                        {staffMember.department?.name || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant as any}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {employmentConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {staffMember.startDate ? formatDate(staffMember.startDate) : '-'}
                      </TableCell>
                      <TableCell>
                        {staffMember.salary ? formatSalary(staffMember.salary) : '-'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4">
            <PaginationControls />
          </div>
        )}
      </div>
    </Card>
  )
}

export default StaffList