'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Label from '@/app/components/ui/Label'
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select'
import Avatar from '@/app/components/ui/Avatar'
import Separator from '@/app/components/ui/Separator'
import {
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
import { STAFF_STATUS_CONFIG, EMPLOYMENT_TYPE_CONFIG } from '@/services/types/ui.types'
import {
  User,
  Phone,
  Briefcase,
  Upload,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Form validation schema
const staffFormSchema = z.object({
  firstName: z.string().min(1, 'Ad gereklidir'),
  lastName: z.string().min(1, 'Soyad gereklidir'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationalId: z.string().optional(),
  departmentId: z.string().min(1, 'Departman seçiniz'),
  positionId: z.string().min(1, 'Pozisyon seçiniz'),
  managerId: z.string().optional(),
  status: z.nativeEnum(StaffStatus),
  employmentType: z.nativeEnum(EmploymentType),
  startDate: z.string().min(1, 'İşe başlama tarihi gereklidir'),
  salary: z.number().min(0, 'Maaş 0\'dan büyük olmalıdır').optional(),
  notes: z.string().optional(),
  // Emergency contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional()
})

type StaffFormData = z.infer<typeof staffFormSchema>

interface StaffFormProps {
  staff?: Staff
  departments: Department[]
  positions: Position[]
  managers: Staff[]
  onSubmit: (data: CreateStaffDto | UpdateStaffDto) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

export function StaffForm({
  staff,
  departments,
  positions,
  managers,
  onSubmit,
  onCancel,
  isLoading = false,
  className
}: StaffFormProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(staff?.avatar || null)
  const [filteredPositions, setFilteredPositions] = useState<Position[]>(positions)
  const [filteredManagers, setFilteredManagers] = useState<Staff[]>(managers)

  const isEditing = !!staff

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
      departmentId: staff?.department?.id?.toString() || '',
      positionId: staff?.position?.id?.toString() || '',
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

  const watchedDepartmentId = form.watch('departmentId')

  // Filter positions based on selected department
  useEffect(() => {
    if (watchedDepartmentId) {
      const filtered = positions.filter(pos => pos.departmentId === watchedDepartmentId)
      setFilteredPositions(filtered)
      
      // Reset position if it doesn't belong to the selected department
      const currentPositionId = form.getValues('positionId')
      if (currentPositionId && !filtered.find(pos => pos.id === currentPositionId)) {
        form.setValue('positionId', '')
      }
    } else {
      setFilteredPositions(positions)
    }
  }, [watchedDepartmentId, positions, form])

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
      const formData: CreateStaffDto | UpdateStaffDto = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        nationalId: data.nationalId,
        departmentId: data.departmentId,
        positionId: data.positionId,
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

      await onSubmit(formData)
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
          {isEditing ? 'Personel Düzenle' : 'Yeni Personel Ekle'}
        </h2>
      </div>

      <div>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                <Label htmlFor="avatar">Profil Fotoğrafı</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('avatar')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Yükle
                  </Button>
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeAvatar}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Kaldır
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
                Kişisel Bilgiler
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ad" {...field} />
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
                      <FormLabel>Soyad *</FormLabel>
                      <FormControl>
                        <Input placeholder="Soyad" {...field} />
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
                      <FormLabel>E-posta *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="ornek@email.com" {...field} />
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
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="+90 555 123 45 67" {...field} />
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
                      <FormLabel>Doğum Tarihi</FormLabel>
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
                      <FormLabel>TC Kimlik No</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678901" {...field} />
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
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tam adres" 
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
                İstihdam Bilgileri
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departman *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Departman seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="positionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pozisyon *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pozisyon seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredPositions.map((pos) => (
                            <SelectItem key={pos.id} value={pos.id.toString()}>
                              {pos.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="managerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yönetici</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Yönetici seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Yönetici yok</SelectItem>
                          {filteredManagers.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id.toString()}>
                              {manager.firstName} {manager.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durum *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Durum seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STAFF_STATUS_CONFIG && Object.entries(STAFF_STATUS_CONFIG).map(([status, config]) => (
                            <SelectItem key={status} value={status}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İstihdam Türü *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="İstihdam türü seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EMPLOYMENT_TYPE_CONFIG && Object.entries(EMPLOYMENT_TYPE_CONFIG).map(([type, config]) => (
                            <SelectItem key={type} value={type}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İşe Başlama Tarihi *</FormLabel>
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
                      <FormLabel>Maaş (TL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(value: string) => field.onChange(value ? parseFloat(value) : undefined)}
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
                Acil Durum İletişim
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Soyad</FormLabel>
                      <FormControl>
                        <Input placeholder="Acil durum kişisi" {...field} />
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
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="+90 555 123 45 67" {...field} />
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
                      <FormLabel>Yakınlık</FormLabel>
                      <FormControl>
                        <Input placeholder="Eş, kardeş, anne, baba vb." {...field} />
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
                  <FormLabel>Notlar</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ek bilgiler ve notlar" 
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
                  İptal
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Kaydet')}
              </Button>
            </div>
          </form>
      </div>
    </Card>
  )
}

export default StaffForm