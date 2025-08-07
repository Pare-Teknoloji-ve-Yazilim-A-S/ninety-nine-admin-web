# 🎨 Personel Tanımlaması Modülü - Frontend Geliştirme Planı

## 📋 Proje Özeti

Ninety-Nine Admin Web uygulaması için personel tanımlaması modülünün sadece frontend geliştirme planı. Mevcut backend API'leri kullanılarak geliştirilecektir.

## 🔍 Mevcut Frontend Yapısı

### Teknoloji Stack
- **Framework**: Next.js 14 App Router
- **UI Library**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI + Radix UI
- **State Management**: Context API + Custom Hooks
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion (gerekirse)

### Mevcut Bileşen Yapısı
```
src/app/components/
├── auth/                    # Auth bileşenleri
├── providers/               # Context providers
├── templates/               # Sayfa şablonları
└── ui/                      # Temel UI bileşenleri
```

## 🎯 Frontend Geliştirme Hedefleri

### Fonksiyonel Gereksinimler
- ✅ Personel listesi (arama, filtreleme, pagination)
- ✅ Personel ekleme formu (modal/sayfa)
- ✅ Personel düzenleme formu
- ✅ Personel detay sayfası
- ✅ Toplu işlemler (bulk actions)
- ✅ Rol ve izin yönetimi UI
- ✅ Profil fotoğrafı yükleme
- ✅ Export/Import işlemleri
- ✅ Responsive tasarım

### UI/UX Gereksinimleri
- 📱 Mobile-first responsive design
- ♿ Accessibility (WCAG 2.1 AA)
- 🌙 Dark mode desteği
- 🌍 Çoklu dil desteği (TR, EN, AR)
- ⚡ Optimistic updates
- 🔄 Loading states
- ❌ Error handling
- ✅ Success feedback

## 🏗️ Frontend Dosya Yapısı

```
src/
├── app/
│   └── dashboard/
│       └── staff/                           # YENİ: Personel modülü
│           ├── page.tsx                     # Ana liste sayfası
│           ├── create/
│           │   └── page.tsx                 # Personel ekleme sayfası
│           ├── [id]/
│           │   ├── page.tsx                 # Personel detay sayfası
│           │   └── edit/
│           │       └── page.tsx             # Personel düzenleme sayfası
│           ├── components/
│           │   ├── StaffList/
│           │   │   ├── StaffList.tsx        # Ana liste bileşeni
│           │   │   ├── StaffListItem.tsx    # Liste öğesi
│           │   │   ├── StaffListHeader.tsx  # Liste başlığı
│           │   │   └── StaffList.module.styl
│           │   ├── StaffForm/
│           │   │   ├── StaffForm.tsx        # Ana form bileşeni
│           │   │   ├── BasicInfoSection.tsx # Temel bilgiler
│           │   │   ├── JobInfoSection.tsx   # İş bilgileri
│           │   │   ├── PermissionsSection.tsx # Yetki bilgileri
│           │   │   └── StaffForm.module.styl
│           │   ├── StaffDetail/
│           │   │   ├── StaffDetail.tsx      # Detay sayfası
│           │   │   ├── StaffProfile.tsx     # Profil bilgileri
│           │   │   ├── StaffActivity.tsx    # Aktivite geçmişi
│           │   │   ├── StaffPermissions.tsx # Yetki görüntüleme
│           │   │   └── StaffDetail.module.styl
│           │   ├── StaffFilters/
│           │   │   ├── StaffFilters.tsx     # Filtreleme bileşeni
│           │   │   ├── DepartmentFilter.tsx # Departman filtresi
│           │   │   ├── RoleFilter.tsx       # Rol filtresi
│           │   │   ├── StatusFilter.tsx     # Durum filtresi
│           │   │   └── StaffFilters.module.styl
│           │   ├── StaffActions/
│           │   │   ├── StaffBulkActions.tsx # Toplu işlemler
│           │   │   ├── StaffExport.tsx      # Export işlemleri
│           │   │   ├── StaffImport.tsx      # Import işlemleri
│           │   │   └── StaffActions.module.styl
│           │   └── shared/
│           │       ├── AvatarUpload.tsx     # Profil fotoğrafı
│           │       ├── PermissionSelector.tsx # İzin seçici
│           │       ├── DepartmentSelector.tsx # Departman seçici
│           │       └── RoleSelector.tsx     # Rol seçici
│           └── hooks/
│               ├── useStaff.ts              # Ana staff hook
│               ├── useStaffActions.ts       # CRUD işlemleri
│               ├── useStaffFilters.ts       # Filtreleme
│               ├── useStaffBulkActions.ts   # Toplu işlemler
│               ├── useStaffPermissions.ts   # Yetki kontrolü
│               ├── useStaffExport.ts        # Export işlemleri
│               └── useStaffForm.ts          # Form yönetimi
├── components/
│   └── ui/
│       ├── data-table/                      # Genel tablo bileşenleri
│       │   ├── DataTable.tsx
│       │   ├── DataTablePagination.tsx
│       │   ├── DataTableToolbar.tsx
│       │   └── DataTableColumnHeader.tsx
│       ├── forms/                           # Form bileşenleri
│       │   ├── FormField.tsx
│       │   ├── FormSelect.tsx
│       │   ├── FormDatePicker.tsx
│       │   └── FormFileUpload.tsx
│       └── feedback/                        # Geri bildirim bileşenleri
│           ├── LoadingSpinner.tsx
│           ├── ErrorBoundary.tsx
│           ├── EmptyState.tsx
│           └── SuccessToast.tsx
└── services/
    └── types/
        ├── staff.types.ts                   # YENİ: Staff tipleri
        ├── department.types.ts              # YENİ: Departman tipleri
        └── ui.types.ts                      # YENİ: UI tipleri
```

## 🎨 UI Bileşenleri Detayı

### 1. StaffList Bileşeni

```typescript
// StaffList.tsx
interface StaffListProps {
  staff: Staff[]
  loading: boolean
  error: string | null
  onStaffSelect: (staff: Staff) => void
  onStaffEdit: (id: string) => void
  onStaffDelete: (id: string) => void
}

function StaffList({ staff, loading, error, onStaffSelect, onStaffEdit, onStaffDelete }: StaffListProps) {
  const { selectedStaff, toggleStaffSelection, selectAllStaff, clearSelection } = useStaffSelection()
  const { filters, updateFilter, clearFilters } = useStaffFilters()
  const { pagination, goToPage, changePageSize } = useStaffPagination()

  if (loading) return <StaffListSkeleton />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
  if (!staff.length) return <EmptyState message="Henüz personel eklenmemiş" />

  return (
    <div className="space-y-4">
      <StaffListHeader 
        selectedCount={selectedStaff.length}
        totalCount={staff.length}
        onSelectAll={selectAllStaff}
        onClearSelection={clearSelection}
      />
      
      <StaffFilters 
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map(staffMember => (
          <StaffListItem
            key={staffMember.id}
            staff={staffMember}
            selected={selectedStaff.includes(staffMember.id)}
            onSelect={() => toggleStaffSelection(staffMember.id)}
            onEdit={() => onStaffEdit(staffMember.id)}
            onDelete={() => onStaffDelete(staffMember.id)}
            onClick={() => onStaffSelect(staffMember)}
          />
        ))}
      </div>
      
      <DataTablePagination
        pagination={pagination}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
      />
    </div>
  )
}
```

### 2. StaffForm Bileşeni

```typescript
// StaffForm.tsx
interface StaffFormProps {
  staff?: Staff
  mode: 'create' | 'edit'
  onSubmit: (data: StaffFormData) => Promise<void>
  onCancel: () => void
}

function StaffForm({ staff, mode, onSubmit, onCancel }: StaffFormProps) {
  const { form, isSubmitting, errors } = useStaffForm({ staff, mode })
  const { departments } = useDepartments()
  const { roles } = useRoles()
  const { positions } = usePositions(form.watch('departmentId'))

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <BasicInfoSection 
          form={form}
          errors={errors}
        />
        
        <JobInfoSection 
          form={form}
          departments={departments}
          positions={positions}
          errors={errors}
        />
      </div>
      
      <PermissionsSection 
        form={form}
        roles={roles}
        errors={errors}
      />
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {mode === 'create' ? 'Personel Ekle' : 'Güncelle'}
        </Button>
      </div>
    </form>
  )
}
```

### 3. StaffDetail Bileşeni

```typescript
// StaffDetail.tsx
interface StaffDetailProps {
  staffId: string
}

function StaffDetail({ staffId }: StaffDetailProps) {
  const { staff, loading, error } = useStaff(staffId)
  const { auditLogs } = useStaffAuditLogs(staffId)
  const { hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState('general')

  if (loading) return <StaffDetailSkeleton />
  if (error) return <ErrorState message={error} />
  if (!staff) return <NotFoundState />

  return (
    <div className="space-y-6">
      <StaffProfile 
        staff={staff}
        canEdit={hasPermission('staff.update')}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
          <TabsTrigger value="permissions">Yetkiler</TabsTrigger>
          <TabsTrigger value="activity">Aktivite</TabsTrigger>
          <TabsTrigger value="notes">Notlar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <StaffGeneralInfo staff={staff} />
        </TabsContent>
        
        <TabsContent value="permissions">
          <StaffPermissions 
            staff={staff}
            canEdit={hasPermission('staff.assign_role')}
          />
        </TabsContent>
        
        <TabsContent value="activity">
          <StaffActivity auditLogs={auditLogs} />
        </TabsContent>
        
        <TabsContent value="notes">
          <StaffNotes 
            staffId={staffId}
            canEdit={hasPermission('staff.update')}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

## 🔧 Custom Hooks

### 1. useStaff Hook

```typescript
// useStaff.ts
interface UseStaffOptions {
  filters?: StaffFilters
  pagination?: PaginationOptions
  enabled?: boolean
}

function useStaff(options: UseStaffOptions = {}) {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await staffService.getStaff({
        ...options.filters,
        ...options.pagination
      })
      
      setStaff(response.data)
      setTotalCount(response.meta.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }, [options.filters, options.pagination])

  useEffect(() => {
    if (options.enabled !== false) {
      fetchStaff()
    }
  }, [fetchStaff, options.enabled])

  return {
    staff,
    loading,
    error,
    totalCount,
    refetch: fetchStaff
  }
}
```

### 2. useStaffActions Hook

```typescript
// useStaffActions.ts
function useStaffActions() {
  const { toast } = useToast()
  const router = useRouter()

  const createStaff = useCallback(async (data: CreateStaffDto) => {
    try {
      const response = await staffService.createStaff(data)
      toast({
        title: 'Başarılı',
        description: 'Personel başarıyla eklendi',
        variant: 'success'
      })
      router.push(`/dashboard/staff/${response.data.id}`)
      return response.data
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Personel eklenirken bir hata oluştu',
        variant: 'destructive'
      })
      throw error
    }
  }, [toast, router])

  const updateStaff = useCallback(async (id: string, data: UpdateStaffDto) => {
    try {
      const response = await staffService.updateStaff(id, data)
      toast({
        title: 'Başarılı',
        description: 'Personel bilgileri güncellendi',
        variant: 'success'
      })
      return response.data
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Güncelleme sırasında bir hata oluştu',
        variant: 'destructive'
      })
      throw error
    }
  }, [toast])

  const deleteStaff = useCallback(async (id: string) => {
    try {
      await staffService.deleteStaff(id)
      toast({
        title: 'Başarılı',
        description: 'Personel silindi',
        variant: 'success'
      })
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Silme işlemi sırasında bir hata oluştu',
        variant: 'destructive'
      })
      throw error
    }
  }, [toast])

  return {
    createStaff,
    updateStaff,
    deleteStaff
  }
}
```

### 3. useStaffFilters Hook

```typescript
// useStaffFilters.ts
interface StaffFilters {
  search?: string
  departmentId?: string
  roleId?: string
  status?: StaffStatus
  startDate?: string
  endDate?: string
}

function useStaffFilters(initialFilters: StaffFilters = {}) {
  const [filters, setFilters] = useState<StaffFilters>(initialFilters)
  const [debouncedFilters, setDebouncedFilters] = useState<StaffFilters>(initialFilters)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 300)

    return () => clearTimeout(timer)
  }, [filters])

  const updateFilter = useCallback((key: keyof StaffFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== undefined && value !== '')
  }, [filters])

  return {
    filters: debouncedFilters,
    rawFilters: filters,
    updateFilter,
    clearFilters,
    hasActiveFilters
  }
}
```

## 🎨 Styling Stratejisi

### 1. Tailwind + Stylus Hybrid Yaklaşımı

```stylus
// StaffList.module.styl
.staffGrid
  display: grid
  gap: 1rem
  
  @media (min-width: 768px)
    grid-template-columns: repeat(2, 1fr)
    
  @media (min-width: 1024px)
    grid-template-columns: repeat(3, 1fr)

.staffCard
  background: white
  border-radius: 0.5rem
  border: 1px solid #e5e7eb
  padding: 1.5rem
  transition: all 0.2s ease
  
  &:hover
    border-color: #3b82f6
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
    
  &.selected
    border-color: #3b82f6
    background: #eff6ff

.staffAvatar
  width: 3rem
  height: 3rem
  border-radius: 50%
  object-fit: cover
  border: 2px solid #e5e7eb
  
.staffInfo
  flex: 1
  min-width: 0
  
.staffName
  font-weight: 600
  color: #111827
  margin-bottom: 0.25rem
  
.staffRole
  font-size: 0.875rem
  color: #6b7280
  margin-bottom: 0.5rem
  
.staffDepartment
  font-size: 0.75rem
  color: #9ca3af
  
.statusBadge
  display: inline-flex
  align-items: center
  padding: 0.25rem 0.5rem
  border-radius: 0.375rem
  font-size: 0.75rem
  font-weight: 500
  
  &.active
    background: #dcfce7
    color: #166534
    
  &.inactive
    background: #fef3c7
    color: #92400e
    
  &.suspended
    background: #fee2e2
    color: #991b1b
```

### 2. Dark Mode Desteği

```stylus
// Dark mode variants
.staffCard
  .dark &
    background: #1f2937
    border-color: #374151
    
    &:hover
      border-color: #60a5fa
      background: #111827
      
    &.selected
      border-color: #60a5fa
      background: #1e3a8a

.staffName
  .dark &
    color: #f9fafb
    
.staffRole
  .dark &
    color: #d1d5db
    
.staffDepartment
  .dark &
    color: #9ca3af
```

## 📱 Responsive Design

### 1. Mobile-First Yaklaşımı

```typescript
// StaffListItem.tsx - Mobile optimized
function StaffListItem({ staff, selected, onSelect, onEdit, onDelete, onClick }: StaffListItemProps) {
  return (
    <div className={cn(
      "p-4 border rounded-lg transition-all duration-200",
      "hover:border-primary hover:shadow-md",
      "md:p-6", // Larger padding on desktop
      selected && "border-primary bg-primary/5"
    )}>
      {/* Mobile Layout */}
      <div className="flex items-start space-x-3 md:hidden">
        <Checkbox 
          checked={selected}
          onCheckedChange={onSelect}
          className="mt-1"
        />
        <Avatar className="w-10 h-10">
          <AvatarImage src={staff.avatar} />
          <AvatarFallback>{staff.firstName[0]}{staff.lastName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{staff.firstName} {staff.lastName}</h3>
          <p className="text-sm text-muted-foreground truncate">{staff.position.title}</p>
          <p className="text-xs text-muted-foreground">{staff.department.name}</p>
          <div className="flex items-center justify-between mt-2">
            <StatusBadge status={staff.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onClick()}>
                  Detayları Görüntüle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit()}>
                  Düzenle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete()} className="text-destructive">
                  Sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:flex md:items-center md:space-x-4">
        <Checkbox 
          checked={selected}
          onCheckedChange={onSelect}
        />
        <Avatar className="w-12 h-12">
          <AvatarImage src={staff.avatar} />
          <AvatarFallback>{staff.firstName[0]}{staff.lastName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 grid grid-cols-4 gap-4">
          <div>
            <h3 className="font-medium">{staff.firstName} {staff.lastName}</h3>
            <p className="text-sm text-muted-foreground">{staff.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium">{staff.department.name}</p>
            <p className="text-sm text-muted-foreground">{staff.position.title}</p>
          </div>
          <div>
            <StatusBadge status={staff.status} />
          </div>
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onClick()}>
                  Detayları Görüntüle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit()}>
                  Düzenle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete()} className="text-destructive">
                  Sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 🔄 State Management

### 1. Context API Kullanımı

```typescript
// StaffContext.tsx
interface StaffContextType {
  // State
  staff: Staff[]
  selectedStaff: string[]
  filters: StaffFilters
  pagination: PaginationState
  loading: boolean
  error: string | null
  
  // Actions
  fetchStaff: () => Promise<void>
  selectStaff: (id: string) => void
  selectAllStaff: () => void
  clearSelection: () => void
  updateFilters: (filters: Partial<StaffFilters>) => void
  updatePagination: (pagination: Partial<PaginationState>) => void
}

const StaffContext = createContext<StaffContextType | undefined>(undefined)

function StaffProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StaffState>({
    staff: [],
    selectedStaff: [],
    filters: {},
    pagination: { page: 1, limit: 20, total: 0 },
    loading: false,
    error: null
  })

  const fetchStaff = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await staffService.getStaff({
        ...state.filters,
        page: state.pagination.page,
        limit: state.pagination.limit
      })
      
      setState(prev => ({
        ...prev,
        staff: response.data,
        pagination: { ...prev.pagination, total: response.meta.total },
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Bir hata oluştu',
        loading: false
      }))
    }
  }, [state.filters, state.pagination.page, state.pagination.limit])

  const value = {
    ...state,
    fetchStaff,
    selectStaff: (id: string) => {
      setState(prev => ({
        ...prev,
        selectedStaff: prev.selectedStaff.includes(id)
          ? prev.selectedStaff.filter(staffId => staffId !== id)
          : [...prev.selectedStaff, id]
      }))
    },
    selectAllStaff: () => {
      setState(prev => ({
        ...prev,
        selectedStaff: prev.selectedStaff.length === prev.staff.length
          ? []
          : prev.staff.map(s => s.id)
      }))
    },
    clearSelection: () => {
      setState(prev => ({ ...prev, selectedStaff: [] }))
    },
    updateFilters: (filters: Partial<StaffFilters>) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
        pagination: { ...prev.pagination, page: 1 }
      }))
    },
    updatePagination: (pagination: Partial<PaginationState>) => {
      setState(prev => ({
        ...prev,
        pagination: { ...prev.pagination, ...pagination }
      }))
    }
  }

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  )
}

function useStaffContext() {
  const context = useContext(StaffContext)
  if (!context) {
    throw new Error('useStaffContext must be used within StaffProvider')
  }
  return context
}
```

## 📋 Form Yönetimi

### 1. React Hook Form + Zod

```typescript
// staff-form.schema.ts
import { z } from 'zod'

export const staffFormSchema = z.object({
  firstName: z.string()
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(50, 'Ad en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Geçersiz karakter'),
    
  lastName: z.string()
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .max(50, 'Soyad en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Geçersiz karakter'),
    
  email: z.string()
    .email('Geçerli bir e-posta adresi giriniz')
    .max(100, 'E-posta en fazla 100 karakter olabilir'),
    
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Geçerli bir telefon numarası giriniz')
    .optional(),
    
  departmentId: z.string()
    .uuid('Geçerli bir departman seçiniz'),
    
  positionId: z.string()
    .uuid('Geçerli bir pozisyon seçiniz'),
    
  roleId: z.string()
    .uuid('Geçerli bir rol seçiniz'),
    
  startDate: z.string()
    .min(1, 'İşe başlama tarihi gereklidir'),
    
  managerId: z.string()
    .uuid()
    .optional(),
    
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED']),
  
  notes: z.string()
    .max(500, 'Notlar en fazla 500 karakter olabilir')
    .optional()
})

export type StaffFormData = z.infer<typeof staffFormSchema>
```

```typescript
// useStaffForm.ts
function useStaffForm({ staff, mode }: { staff?: Staff, mode: 'create' | 'edit' }) {
  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      firstName: staff?.firstName || '',
      lastName: staff?.lastName || '',
      email: staff?.email || '',
      phone: staff?.phone || '',
      departmentId: staff?.department.id || '',
      positionId: staff?.position.id || '',
      roleId: staff?.role.id || '',
      startDate: staff?.startDate || '',
      managerId: staff?.manager?.id || '',
      status: staff?.status || 'ACTIVE',
      notes: staff?.notes || ''
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createStaff, updateStaff } = useStaffActions()

  const onSubmit = async (data: StaffFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        await createStaff(data)
      } else if (staff) {
        await updateStaff(staff.id, data)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit,
    errors: form.formState.errors
  }
}
```

## 🎯 Accessibility (a11y)

### 1. Keyboard Navigation

```typescript
// StaffListItem.tsx - Keyboard accessible
function StaffListItem({ staff, onSelect, onEdit, onDelete }: StaffListItemProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        onSelect()
        break
      case 'e':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          onEdit()
        }
        break
      case 'Delete':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          onDelete()
        }
        break
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Personel: ${staff.firstName} ${staff.lastName}, ${staff.position.title}`}
      onKeyDown={handleKeyDown}
      className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {/* Content */}
    </div>
  )
}
```

### 2. Screen Reader Support

```typescript
// StaffList.tsx - Screen reader friendly
function StaffList({ staff }: StaffListProps) {
  return (
    <div>
      <div className="sr-only" aria-live="polite">
        {staff.length} personel listeleniyor
      </div>
      
      <div 
        role="grid"
        aria-label="Personel listesi"
        className="space-y-4"
      >
        {staff.map((staffMember, index) => (
          <div
            key={staffMember.id}
            role="gridcell"
            aria-rowindex={index + 1}
          >
            <StaffListItem staff={staffMember} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 🌍 Internationalization (i18n)

### 1. Çoklu Dil Desteği

```typescript
// i18n/tr.json
{
  "staff": {
    "title": "Personel Yönetimi",
    "add": "Yeni Personel Ekle",
    "edit": "Personel Düzenle",
    "delete": "Personel Sil",
    "search": "Personel ara...",
    "filters": {
      "department": "Departman",
      "role": "Rol",
      "status": "Durum",
      "all": "Tümü"
    },
    "status": {
      "active": "Aktif",
      "inactive": "Pasif",
      "suspended": "Askıya Alınmış",
      "terminated": "İşten Çıkarılmış"
    },
    "form": {
      "firstName": "Ad",
      "lastName": "Soyad",
      "email": "E-posta",
      "phone": "Telefon",
      "department": "Departman",
      "position": "Pozisyon",
      "role": "Rol",
      "startDate": "İşe Başlama Tarihi",
      "manager": "Yönetici",
      "notes": "Notlar"
    },
    "messages": {
      "createSuccess": "Personel başarıyla eklendi",
      "updateSuccess": "Personel bilgileri güncellendi",
      "deleteSuccess": "Personel silindi",
      "createError": "Personel eklenirken bir hata oluştu",
      "updateError": "Güncelleme sırasında bir hata oluştu",
      "deleteError": "Silme işlemi sırasında bir hata oluştu"
    }
  }
}
```

```typescript
// useTranslation.ts
function useTranslation() {
  const [locale, setLocale] = useState('tr')
  const [translations, setTranslations] = useState({})

  useEffect(() => {
    import(`../i18n/${locale}.json`).then(setTranslations)
  }, [locale])

  const t = useCallback((key: string, params?: Record<string, any>) => {
    const keys = key.split('.')
    let value = translations
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value !== 'string') {
      return key
    }
    
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match
      })
    }
    
    return value
  }, [translations])

  return { t, locale, setLocale }
}
```

## 📅 Geliştirme Timeline

### Hafta 1: Temel Bileşenler
- **Gün 1-2**: Proje yapısı kurulumu, temel types
- **Gün 3-4**: StaffList bileşeni ve hooks
- **Gün 5**: StaffFilters ve arama functionality

### Hafta 2: Form ve CRUD
- **Gün 1-2**: StaffForm bileşeni (create/edit)
- **Gün 3-4**: Form validation ve error handling
- **Gün 5**: CRUD operations integration

### Hafta 3: Detay ve Gelişmiş Özellikler
- **Gün 1-2**: StaffDetail sayfası ve tabs
- **Gün 3**: Bulk actions ve export/import
- **Gün 4**: Avatar upload ve file handling
- **Gün 5**: Permission management UI

### Hafta 4: Polish ve Optimizasyon
- **Gün 1-2**: Responsive design ve mobile optimization
- **Gün 3**: Accessibility improvements
- **Gün 4**: Performance optimization
- **Gün 5**: Testing ve bug fixes

## 🧪 Testing Stratejisi

### 1. Component Testing

```typescript
// StaffList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { StaffList } from '../StaffList'
import { mockStaffData } from '../../__mocks__/staff'

describe('StaffList', () => {
  test('renders staff list correctly', () => {
    render(
      <StaffList 
        staff={mockStaffData}
        loading={false}
        error={null}
        onStaffSelect={jest.fn()}
        onStaffEdit={jest.fn()}
        onStaffDelete={jest.fn()}
      />
    )
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@company.com')).toBeInTheDocument()
  })
  
  test('handles staff selection', () => {
    const onStaffSelect = jest.fn()
    
    render(
      <StaffList 
        staff={mockStaffData}
        loading={false}
        error={null}
        onStaffSelect={onStaffSelect}
        onStaffEdit={jest.fn()}
        onStaffDelete={jest.fn()}
      />
    )
    
    fireEvent.click(screen.getByLabelText('Select John Doe'))
    expect(onStaffSelect).toHaveBeenCalledWith(mockStaffData[0])
  })
  
  test('shows loading state', () => {
    render(
      <StaffList 
        staff={[]}
        loading={true}
        error={null}
        onStaffSelect={jest.fn()}
        onStaffEdit={jest.fn()}
        onStaffDelete={jest.fn()}
      />
    )
    
    expect(screen.getByTestId('staff-list-skeleton')).toBeInTheDocument()
  })
  
  test('shows error state', () => {
    render(
      <StaffList 
        staff={[]}
        loading={false}
        error="Network error"
        onStaffSelect={jest.fn()}
        onStaffEdit={jest.fn()}
        onStaffDelete={jest.fn()}
      />
    )
    
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })
})
```

### 2. Hook Testing

```typescript
// useStaff.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useStaff } from '../useStaff'
import { staffService } from '../../services/staff.service'

jest.mock('../../services/staff.service')

describe('useStaff', () => {
  test('fetches staff data successfully', async () => {
    const mockResponse = {
      data: mockStaffData,
      meta: { total: 2, page: 1, limit: 20 }
    }
    
    ;(staffService.getStaff as jest.Mock).mockResolvedValue(mockResponse)
    
    const { result } = renderHook(() => useStaff())
    
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.staff).toEqual(mockStaffData)
    expect(result.current.totalCount).toBe(2)
    expect(result.current.error).toBeNull()
  })
  
  test('handles fetch error', async () => {
    const errorMessage = 'Network error'
    ;(staffService.getStaff as jest.Mock).mockRejectedValue(new Error(errorMessage))
    
    const { result } = renderHook(() => useStaff())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.staff).toEqual([])
  })
})
```

## 🚀 Performance Optimizasyonu

### 1. React.memo ve useMemo

```typescript
// StaffListItem.tsx - Memoized component
const StaffListItem = React.memo(function StaffListItem({ 
  staff, 
  selected, 
  onSelect, 
  onEdit, 
  onDelete 
}: StaffListItemProps) {
  const handleSelect = useCallback(() => {
    onSelect(staff.id)
  }, [staff.id, onSelect])
  
  const handleEdit = useCallback(() => {
    onEdit(staff.id)
  }, [staff.id, onEdit])
  
  const handleDelete = useCallback(() => {
    onDelete(staff.id)
  }, [staff.id, onDelete])
  
  const statusBadgeColor = useMemo(() => {
    switch (staff.status) {
      case 'ACTIVE': return 'green'
      case 'INACTIVE': return 'yellow'
      case 'SUSPENDED': return 'red'
      case 'TERMINATED': return 'gray'
      default: return 'gray'
    }
  }, [staff.status])
  
  return (
    <div className="staff-card">
      {/* Component content */}
    </div>
  )
})
```

### 2. Virtual Scrolling (Büyük Listeler İçin)

```typescript
// VirtualizedStaffList.tsx
import { FixedSizeList as List } from 'react-window'

interface VirtualizedStaffListProps {
  staff: Staff[]
  height: number
  itemHeight: number
  onStaffSelect: (staff: Staff) => void
}

function VirtualizedStaffList({ staff, height, itemHeight, onStaffSelect }: VirtualizedStaffListProps) {
  const Row = useCallback(({ index, style }: { index: number, style: React.CSSProperties }) => {
    const staffMember = staff[index]
    
    return (
      <div style={style}>
        <StaffListItem
          staff={staffMember}
          onSelect={() => onStaffSelect(staffMember)}
        />
      </div>
    )
  }, [staff, onStaffSelect])
  
  return (
    <List
      height={height}
      itemCount={staff.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

## 📊 Başarı Kriterleri

### Fonksiyonel Kriterler
- ✅ Tüm CRUD operasyonları çalışıyor
- ✅ Arama ve filtreleme çalışıyor
- ✅ Responsive tasarım tüm cihazlarda çalışıyor
- ✅ Form validasyonu çalışıyor
- ✅ Error handling aktif
- ✅ Loading states gösteriliyor

### Teknik Kriterler
- ✅ TypeScript strict mode
- ✅ %90+ test coverage
- ✅ Accessibility WCAG 2.1 AA
- ✅ Performance: LCP < 2.5s, FID < 100ms
- ✅ Bundle size optimized

### Kullanıcı Deneyimi
- ✅ Intuitive interface
- ✅ Clear navigation
- ✅ Helpful error messages
- ✅ Smooth animations
- ✅ Mobile-friendly

---

*Bu doküman, Ninety-Nine Admin Web uygulaması Personel Tanımlaması Modülü frontend geliştirme sürecinin detaylı planını içermektedir.*