'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, DollarSign, User, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Separator from '@/app/components/ui/Separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { StaffForm } from '@/components/staff'
import { useStaffActions } from '@/hooks'
import { staffService } from '@/services/staff.service'
import type { Staff } from '@/services/types/staff.types'
import { STAFF_STATUS_CONFIG, EMPLOYMENT_TYPE_CONFIG } from '@/services/types/ui.types'

function StaffDetailPage () {
  const params = useParams()
  const router = useRouter()
  const staffId = params.id as string

  const [staff, setStaff] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    updateStaff,
    deleteStaff,
    loading: actionsLoading
  } = useStaffActions()

  useEffect(() => {
    loadStaff()
  }, [staffId])

  const loadStaff = async () => {
    try {
      setLoading(true)
      setError(null)
      const staffData = await staffService.getById(staffId)
      setStaff(staffData.data)
    } catch (err) {
      setError('Personel bilgileri yüklenirken hata oluştu')
      console.error('Error loading staff:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStaff = async (data: any) => {
    const success = await updateStaff(staffId, data)
    if (success) {
      setIsEditFormOpen(false)
      loadStaff()
    }
  }

  const handleDeleteStaff = async () => {
    const success = await deleteStaff(staffId)
    if (success) {
      router.push('/dashboard/staff')
    }
  }

  const getStatusConfig = (status: string) => {
    return STAFF_STATUS_CONFIG[status as keyof typeof STAFF_STATUS_CONFIG] || {
      label: status,
      color: 'default' as const
    }
  }

  const getEmploymentTypeConfig = (type: string) => {
    return EMPLOYMENT_TYPE_CONFIG[type as keyof typeof EMPLOYMENT_TYPE_CONFIG] || {
      label: type,
      color: 'default' as const
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !staff) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive mb-4">{error || 'Personel bulunamadı'}</p>
            <Button onClick={() => router.push('/dashboard/staff')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusConfig = getStatusConfig(staff.status)
  const employmentTypeConfig = getEmploymentTypeConfig(staff.employmentType)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/staff')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {staff.firstName} {staff.lastName}
            </h1>
            <p className="text-muted-foreground">
              {staff.position?.title} - {staff.department?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditFormOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Düzenle
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Sil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={staff.avatar} alt={`${staff.firstName} ${staff.lastName}`} />
              <AvatarFallback className="text-2xl">
                {staff.firstName[0]}{staff.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{staff.firstName} {staff.lastName}</CardTitle>
            <CardDescription>{staff.position?.title}</CardDescription>
            <div className="flex justify-center space-x-2 mt-4">
              <Badge variant={statusConfig.variant}>
                {statusConfig.label}
              </Badge>
              <Badge variant={employmentTypeConfig.variant}>
                {employmentTypeConfig.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{staff.email}</span>
            </div>
            {staff.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{staff.phone}</span>
              </div>
            )}
            {staff.address && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{staff.address}</span>
              </div>
            )}

            {staff.salary && (
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Maaş: {staff.salary.toLocaleString('tr-TR')} ₺
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Kişisel Bilgiler</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staff.dateOfBirth && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Doğum Tarihi</label>
                  <p className="text-sm">{new Date(staff.dateOfBirth).toLocaleDateString('tr-TR')}</p>
                </div>
              )}
              {staff.nationalId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">TC Kimlik No</label>
                  <p className="text-sm">{staff.nationalId}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>İş Bilgileri</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Departman</label>
                <p className="text-sm">{staff.department?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Pozisyon</label>
                <p className="text-sm">{staff.position?.title}</p>
              </div>
              {staff.manager && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Yönetici</label>
                  <p className="text-sm">{staff.manager.firstName} {staff.manager.lastName}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Çalışma Türü</label>
                <p className="text-sm">{employmentTypeConfig.label}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Durum</label>
                <p className="text-sm">{statusConfig.label}</p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {staff.emergencyContact && (
            <Card>
              <CardHeader>
                <CardTitle>Acil Durum İletişim</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ad Soyad</label>
                  <p className="text-sm">{staff.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Yakınlık</label>
                  <p className="text-sm">{staff.emergencyContact.relationship}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telefon</label>
                  <p className="text-sm">{staff.emergencyContact.phone}</p>
                </div>
                {staff.emergencyContact.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">E-posta</label>
                    <p className="text-sm">{staff.emergencyContact.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {staff.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{staff.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Personel Düzenle</DialogTitle>
          </DialogHeader>
          <StaffForm
            staff={staff}
            departments={[]}
            positions={[]}
            managers={[]}
            onSubmit={handleUpdateStaff}
            onCancel={() => setIsEditFormOpen(false)}
            isLoading={actionsLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Personeli Sil</AlertDialogTitle>
            <AlertDialogDescription>
              {staff.firstName} {staff.lastName} adlı personeli silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStaff}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default StaffDetailPage


