'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Label from '@/app/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui'
import SearchableDropdown, { type SearchableOption } from '@/app/components/ui/SearchableDropdown'
import Avatar from '@/app/components/ui/Avatar'
import Separator from '@/app/components/ui/Separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/Form'
import Textarea from '@/app/components/ui/TextArea'
import {
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  StaffStatus,
  EmploymentType
} from '@/services/types/staff.types'
import { Department, Position } from '@/services/types/department.types'
import { getStaffStatusConfig, getEmploymentTypeConfig } from '@/services/types/ui.types'
import {
  User,
  Phone,
  Briefcase,
  Upload,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Dil çevirileri
const translations = {
  tr: {
    // Form titles
    editStaff: 'Personel Düzenle',
    addNewStaff: 'Yeni Personel Ekle',
    
    // Section titles
    personalInfo: 'Kişisel Bilgiler',
    employmentInfo: 'İstihdam Bilgileri',
    emergencyContact: 'Acil Durum İletişim',
    
    // Form labels
    profilePhoto: 'Profil Fotoğrafı',
    firstName: 'Ad',
    lastName: 'Soyad',
    email: 'E-posta',
    phone: 'Telefon',
    dateOfBirth: 'Doğum Tarihi',
    nationalId: 'TC Kimlik No',
    address: 'Adres',
    department: 'Departman',
    position: 'Pozisyon',
    manager: 'Yönetici',
    status: 'Durum',
    employmentType: 'İstihdam Türü',
    startDate: 'İşe Başlama Tarihi',
    salary: 'Maaş (TL)',
    notes: 'Notlar',
    emergencyContactName: 'Ad Soyad',
    emergencyContactPhone: 'Telefon',
    emergencyContactRelation: 'Yakınlık',
    
    // Placeholders
    firstNamePlaceholder: 'Ad',
    lastNamePlaceholder: 'Soyad',
    emailPlaceholder: 'ornek@email.com',
    phonePlaceholder: '+90 555 123 45 67',
    nationalIdPlaceholder: '12345678901',
    addressPlaceholder: 'Tam adres',
    departmentPlaceholder: 'Departman seçiniz',
    positionPlaceholder: 'Pozisyon seçiniz',
    managerPlaceholder: 'Yönetici seçiniz',
    statusPlaceholder: 'Durum seçiniz',
    employmentTypePlaceholder: 'İstihdam türü seçiniz',
    salaryPlaceholder: '0',
    emergencyContactNamePlaceholder: 'Acil durum kişisi',
    emergencyContactPhonePlaceholder: '+90 555 123 45 67',
    emergencyContactRelationPlaceholder: 'Eş, kardeş, anne, baba vb.',
    notesPlaceholder: 'Ek bilgiler ve notlar',
    
    // Buttons
    upload: 'Yükle',
    remove: 'Kaldır',
    cancel: 'İptal',
    save: 'Kaydet',
    update: 'Güncelle',
    saving: 'Kaydediliyor...',
    
    // Options
    noManager: 'Yönetici yok',
    
    // Validation messages
    firstNameRequired: 'Ad gereklidir',
    lastNameRequired: 'Soyad gereklidir',
    validEmail: 'Geçerli bir e-posta adresi giriniz',
    departmentRequired: 'Departman seçiniz',
    startDateRequired: 'İşe başlama tarihi gereklidir',
    salaryMin: 'Maaş 0\'dan büyük olmalıdır'
  },
  en: {
    // Form titles
    editStaff: 'Edit Staff',
    addNewStaff: 'Add New Staff',
    
    // Section titles
    personalInfo: 'Personal Information',
    employmentInfo: 'Employment Information',
    emergencyContact: 'Emergency Contact',
    
    // Form labels
    profilePhoto: 'Profile Photo',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    dateOfBirth: 'Date of Birth',
    nationalId: 'National ID',
    address: 'Address',
    department: 'Department',
    position: 'Position',
    manager: 'Manager',
    status: 'Status',
    employmentType: 'Employment Type',
    startDate: 'Start Date',
    salary: 'Salary (TL)',
    notes: 'Notes',
    emergencyContactName: 'Full Name',
    emergencyContactPhone: 'Phone',
    emergencyContactRelation: 'Relationship',
    
    // Placeholders
    firstNamePlaceholder: 'First Name',
    lastNamePlaceholder: 'Last Name',
    emailPlaceholder: 'example@email.com',
    phonePlaceholder: '+90 555 123 45 67',
    nationalIdPlaceholder: '12345678901',
    addressPlaceholder: 'Full address',
    departmentPlaceholder: 'Select department',
    positionPlaceholder: 'Select position',
    managerPlaceholder: 'Select manager',
    statusPlaceholder: 'Select status',
    employmentTypePlaceholder: 'Select employment type',
    salaryPlaceholder: '0',
    emergencyContactNamePlaceholder: 'Emergency contact person',
    emergencyContactPhonePlaceholder: '+90 555 123 45 67',
    emergencyContactRelationPlaceholder: 'Spouse, sibling, parent, etc.',
    notesPlaceholder: 'Additional information and notes',
    
    // Buttons
    upload: 'Upload',
    remove: 'Remove',
    cancel: 'Cancel',
    save: 'Save',
    update: 'Update',
    saving: 'Saving...',
    
    // Options
    noManager: 'No Manager',
    
    // Validation messages
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    validEmail: 'Please enter a valid email address',
    departmentRequired: 'Please select a department',
    startDateRequired: 'Start date is required',
    salaryMin: 'Salary must be greater than 0'
  },
  ar: {
    // Form titles
    editStaff: 'تعديل الموظف',
    addNewStaff: 'إضافة موظف جديد',
    
    // Section titles
    personalInfo: 'المعلومات الشخصية',
    employmentInfo: 'معلومات التوظيف',
    emergencyContact: 'جهة الاتصال في الطوارئ',
    
    // Form labels
    profilePhoto: 'صورة الملف الشخصي',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    dateOfBirth: 'تاريخ الميلاد',
    nationalId: 'رقم الهوية الوطنية',
    address: 'العنوان',
    department: 'القسم',
    position: 'المنصب',
    manager: 'المدير',
    status: 'الحالة',
    employmentType: 'نوع التوظيف',
    startDate: 'تاريخ البدء',
    salary: 'الراتب (TL)',
    notes: 'ملاحظات',
    emergencyContactName: 'الاسم الكامل',
    emergencyContactPhone: 'الهاتف',
    emergencyContactRelation: 'العلاقة',
    
    // Placeholders
    firstNamePlaceholder: 'الاسم الأول',
    lastNamePlaceholder: 'اسم العائلة',
    emailPlaceholder: 'example@email.com',
    phonePlaceholder: '+90 555 123 45 67',
    nationalIdPlaceholder: '12345678901',
    addressPlaceholder: 'العنوان الكامل',
    departmentPlaceholder: 'اختر القسم',
    positionPlaceholder: 'اختر المنصب',
    managerPlaceholder: 'اختر المدير',
    statusPlaceholder: 'اختر الحالة',
    employmentTypePlaceholder: 'اختر نوع التوظيف',
    salaryPlaceholder: '0',
    emergencyContactNamePlaceholder: 'شخص الاتصال في الطوارئ',
    emergencyContactPhonePlaceholder: '+90 555 123 45 67',
    emergencyContactRelationPlaceholder: 'زوج، شقيق، والد، إلخ',
    notesPlaceholder: 'معلومات إضافية وملاحظات',
    
    // Buttons
    upload: 'رفع',
    remove: 'إزالة',
    cancel: 'إلغاء',
    save: 'حفظ',
    update: 'تحديث',
    saving: 'جاري الحفظ...',
    
    // Options
    noManager: 'لا يوجد مدير',
    
    // Validation messages
    firstNameRequired: 'الاسم الأول مطلوب',
    lastNameRequired: 'اسم العائلة مطلوب',
    validEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    departmentRequired: 'يرجى اختيار قسم',
    startDateRequired: 'تاريخ البدء مطلوب',
    salaryMin: 'يجب أن يكون الراتب أكبر من 0'
  }
};

// Form validation schema - will be created dynamically based on language
const createStaffFormSchema = (t: any) => z.object({
  firstName: z.string().min(1, t.firstNameRequired),
  lastName: z.string().min(1, t.lastNameRequired),
  email: z.string().email(t.validEmail),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationalId: z.string().optional(),
  department: z.string().min(1, t.departmentRequired), // Department enum code
  positionTitle: z.string().optional(), // Position enum/title
  managerId: z.string().optional(),
  status: z.nativeEnum(StaffStatus),
  employmentType: z.nativeEnum(EmploymentType),
  startDate: z.string().min(1, t.startDateRequired),
  salary: z.number().min(0, t.salaryMin).optional(),
  notes: z.string().optional(),
  // Emergency contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional()
})

type StaffFormData = z.infer<ReturnType<typeof createStaffFormSchema>>

interface StaffFormProps {
  staff?: Staff
  departments: Department[]
  positions: Position[]
  managers: Staff[]
  onSubmit: (data: CreateStaffDto | UpdateStaffDto) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  className?: string
  // Optional: override dropdown options (e.g., enum-based)
  departmentOptions?: SearchableOption[]
  positionOptions?: SearchableOption[]
}

export function StaffForm({
  staff,
  departments,
  positions,
  managers,
  onSubmit,
  onCancel,
  isLoading = false,
  className,
  departmentOptions,
  positionOptions
}: StaffFormProps) {
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

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(staff?.avatar || null)
  const [filteredPositions, setFilteredPositions] = useState<Position[]>(positions)
  const [filteredManagers, setFilteredManagers] = useState<Staff[]>(managers)
  const [salaryInput, setSalaryInput] = useState<string>('')

  const isEditing = !!staff

  const staffFormSchema = createStaffFormSchema(t);
  
  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      firstName: staff?.firstName || '',
      lastName: staff?.lastName || '',
      email: staff?.email || '',
      phone: staff?.phone || '',
      address: staff?.address || '',
      dateOfBirth: staff?.dateOfBirth || '',
      nationalId: staff?.nationalId || '',
      department: staff?.department?.id?.toString() || '',
      positionTitle: staff?.position?.id?.toString() || '',
      managerId: staff?.manager?.id?.toString() || '',
      status: staff?.status || StaffStatus.ACTIVE,
      employmentType: staff?.employmentType || EmploymentType.FULL_TIME,
      startDate: staff?.startDate || '',
      salary: staff?.salary || undefined,
      notes: staff?.notes || '',
      emergencyContactName: staff?.emergencyContact?.name || '',
      emergencyContactPhone: staff?.emergencyContact?.phone || '',
      emergencyContactRelation: staff?.emergencyContact?.relationship || ''
    }
  })

  const watchedDepartmentId = form.watch('department')
  const watchedSalary = form.watch('salary')

  // Keep local salary text in sync if form value changes programmatically
  useEffect(() => {
    setSalaryInput(watchedSalary !== undefined && watchedSalary !== null ? String(watchedSalary) : '')
  }, [watchedSalary])

  // Filter positions based on selected department (skip when custom position options are provided)
  useEffect(() => {
    if (positionOptions) return
    if (watchedDepartmentId) {
      const filtered = positions.filter(pos => pos.departmentId === watchedDepartmentId)
      setFilteredPositions(filtered)
      const currentPositionId = form.getValues('positionTitle')
      if (currentPositionId && !filtered.find(pos => pos.id === currentPositionId)) {
        form.setValue('positionTitle', '')
      }
    } else {
      setFilteredPositions(positions)
    }
  }, [watchedDepartmentId, positions, form, positionOptions])

  // Filter managers (exclude current staff member if editing)
  useEffect(() => {
    let filtered = managers
    if (isEditing && staff) {
      filtered = managers.filter(manager => manager.id !== staff.id)
    }
    setFilteredManagers(filtered)
  }, [managers, isEditing, staff])

  // Handle avatar upload
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  // Form submission
  const handleSubmit = async (data: StaffFormData) => {
    try {
      const formData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        nationalId: data.nationalId,
        // enum-based mapping for admin API
        department: data.department,
        positionTitle: data.positionTitle || undefined,
        // managerId can be included if provided
        managerId: data.managerId || undefined,
        status: data.status,
        employmentType: data.employmentType,
        startDate: data.startDate,
        salary: data.salary,
        notes: data.notes,
        emergencyContact: {
          name: data.emergencyContactName || '',
          phone: data.emergencyContactPhone || '',
          relationship: data.emergencyContactRelation || ''
        }
      }

      // Add avatar if uploaded
      if (avatarFile) {
        // In a real implementation, you would upload the file to a storage service
        // and get back a URL. For now, we'll use the preview URL.
        formData.avatar = avatarPreview || undefined
      }

      await onSubmit(formData as unknown as CreateStaffDto)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Card className={cn('w-full max-w-4xl mx-auto', className)}>
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? t.editStaff : t.addNewStaff}
        </h2>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <Avatar 
                src={avatarPreview || undefined}
                alt="Profile"
                fallback={form.watch('firstName') && form.watch('lastName') 
                  ? getInitials(form.watch('firstName'), form.watch('lastName'))
                  : 'U'
                }
                size="lg"
                className="h-20 w-20"
              />
              
              <div className="space-y-2">
                <Label htmlFor="avatar">{t.profilePhoto}</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('avatar')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {t.upload}
                  </Button>
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeAvatar}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {t.remove}
                    </Button>
                  )}
                </div>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <User className="h-5 w-5 mr-2" />
                {t.personalInfo}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.firstName} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t.firstNamePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.lastName} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t.lastNamePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.email} *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t.emailPlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.phone}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.phonePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.dateOfBirth}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.nationalId}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.nationalIdPlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>{t.address}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t.addressPlaceholder} 
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                {t.employmentInfo}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <SearchableDropdown
                        label={t.department}
                        value={field.value || ''}
                        onChange={field.onChange}
                        options={(departmentOptions && departmentOptions.length > 0)
                          ? departmentOptions
                          : (departments.map(d => ({ value: d.code, label: d.name, description: d.code })) as SearchableOption[])}
                        placeholder={t.departmentPlaceholder}
                        searchable={false}
                        showSelectedSummary={false}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="positionTitle"
                  render={({ field }) => (
                    <FormItem>
                      <SearchableDropdown
                        label={t.position}
                        value={field.value || ''}
                        onChange={field.onChange}
                        options={(positionOptions && positionOptions.length > 0)
                          ? positionOptions
                          : (filteredPositions.map(p => ({ value: p.code || p.title, label: p.title, description: p.department?.name })) as SearchableOption[])}
                        placeholder={t.positionPlaceholder}
                        searchable={false}
                        showSelectedSummary={false}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="managerId"
                  render={({ field }) => (
                    <FormItem>
                      <SearchableDropdown
                        label={t.manager}
                        value={field.value || ''}
                        onChange={field.onChange}
                        options={[{ value: '', label: t.noManager }, ...filteredManagers.map(m => ({ value: m.id.toString(), label: `${m.firstName} ${m.lastName}`, description: m.position?.title }))] as SearchableOption[]}
                        placeholder={t.managerPlaceholder}
                        allowEmpty
                        emptyLabel={t.noManager}
                        searchable={false}
                        showSelectedSummary={false}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <SearchableDropdown
                        label={t.status}
                        value={field.value}
                        onChange={field.onChange}
                        options={Object.entries(staffStatusConfig || {}).map(([key, cfg]) => ({ value: key, label: cfg.label })) as SearchableOption[]}
                        placeholder={t.statusPlaceholder}
                        searchable={false}
                        showSelectedSummary={false}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <SearchableDropdown
                        label={t.employmentType}
                        value={field.value}
                        onChange={field.onChange}
                        options={Object.entries(employmentTypeConfig || {}).map(([key, cfg]) => ({ value: key, label: cfg.label })) as SearchableOption[]}
                        placeholder={t.employmentTypePlaceholder}
                        searchable={false}
                        showSelectedSummary={false}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.startDate} *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.salary} (TL)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t.salaryPlaceholder}
                          inputMode="decimal"
                          value={salaryInput}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const raw = e.target.value
                            // Allow only digits, comma, dot
                            const sanitized = raw.replace(/[^0-9.,]/g, '')
                            setSalaryInput(sanitized)
                            if (sanitized === '') {
                              field.onChange(undefined)
                              return
                            }
                            // Accept partial numeric like "12.", "12,"
                            const numericPattern = /^\d+([.,]\d*)?$/
                            if (numericPattern.test(sanitized)) {
                              const normalized = sanitized.replace(',', '.')
                              const asNumber = Number(normalized)
                              if (!Number.isNaN(asNumber)) {
                                field.onChange(asNumber)
                              }
                            }
                          }}
                          onBlur={() => {
                            if (salaryInput === '') return
                            const normalized = salaryInput.replace(',', '.')
                            const asNumber = Number(normalized)
                            if (!Number.isNaN(asNumber)) {
                              // Normalize display (remove trailing separators)
                              setSalaryInput(String(asNumber))
                              field.onChange(asNumber)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                {t.emergencyContact}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.emergencyContactName}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.emergencyContactNamePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.emergencyContactPhone}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.emergencyContactPhonePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContactRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.emergencyContactRelation}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.emergencyContactRelationPlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.notes}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t.notesPlaceholder} 
                      className="min-h-[100px]"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  {t.cancel}
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t.saving : (isEditing ? t.update : t.save)}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  )
}

export default StaffForm