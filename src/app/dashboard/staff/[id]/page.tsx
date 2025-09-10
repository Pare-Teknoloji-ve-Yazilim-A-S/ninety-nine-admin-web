'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute'
import Sidebar from '@/app/components/ui/Sidebar'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Badge from '@/app/components/ui/Badge'
import Avatar from '@/app/components/ui/Avatar'
import { AlertCircle, ArrowLeft, Briefcase, Calendar, Mail, Phone, User, Building2, Edit } from 'lucide-react'
import { staffService } from '@/services/staff.service'
import { roleService } from '@/services/role.service'
import { apiClient } from '@/services/api/client'
import { transformApiStaffToStaff } from '../../staff/utils/transformations'
import type { Staff, UpdateStaffDto } from '@/services/types/staff.types'
import ConfirmationModal from '@/app/components/ui/ConfirmationModal'
import EditStaffModal from '@/components/staff/EditStaffModal'
import Modal from '@/app/components/ui/Modal'
import { ShieldAlert, Clock } from 'lucide-react'
import { usePermissionCheck } from '@/hooks/usePermissionCheck'
import { UPDATE_STAFF_PERMISSION_ID, DELETE_STAFF_PERMISSION_ID } from '@/app/components/ui/Sidebar'

export default function StaffDetailPage() {
  const params = useParams()
  const router = useRouter()
  const staffId = params.id as string

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [staff, setStaff] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)

  // Permission checks
  const { hasPermission } = usePermissionCheck()
  const hasUpdateStaffPermission = hasPermission(UPDATE_STAFF_PERMISSION_ID)
  const hasDeleteStaffPermission = hasPermission(DELETE_STAFF_PERMISSION_ID)

  useEffect(() => {
    let isMounted = true
    const fetchDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch staff details
        const res = await staffService.getAdminStaffById(staffId)
        if (!isMounted) return
        // Unwrap possible ApiResponse shapes then transform
        const payload: any = res as any
        const raw = payload?.data ?? payload?.result ?? payload
        const transformed = transformApiStaffToStaff(raw as any)
        setStaff(transformed)
        
        // Fetch non-admin roles - this will call /api/admin/roles/non-admin
        await roleService.getNonAdminRoles()
        
        // Fetch departments - this will call /api/enums/departments
        await apiClient.get('/api/enums/departments')
        
        // Fetch positions - this will call /api/enums/positions
        await apiClient.get('/api/enums/positions')
        
      } catch (err: any) {
        if (!isMounted) return
        setError(err?.message || 'Personel yüklenemedi')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }
    if (staffId) fetchDetail()
    return () => { isMounted = false }
  }, [staffId])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="lg:ml-72">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="space-y-6">
                  <div className="h-64 bg-gray-200 rounded" />
                  <div className="h-48 bg-gray-200 rounded" />
                  <div className="h-32 bg-gray-200 rounded" />
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="lg:ml-72">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Card className="text-center">
                <div className="p-8">
                  <AlertCircle className="h-12 w-12 text-primary-red mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                    Personel yüklenemedi
                  </h2>
                  <p className="text-text-light-secondary dark:text-text-secondary mb-6">{error}</p>
                  <Link href="/dashboard/staff">
                    <Button variant="primary">Listeye Dön</Button>
                  </Link>
                </div>
              </Card>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!staff) return null

  const fullName = `${staff.firstName ?? ''} ${staff.lastName ?? ''}`.trim()

  // Handle permission modal open
  const handlePermissionModalOpen = () => {
    setShowPermissionModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!staff?.id) return
    try {
      setDeleting(true)
      await staffService.deleteAdminStaff(staff.id)
      setShowDeleteModal(false)
      router.push('/dashboard/staff')
    } catch (e) {
      console.error('Delete staff failed', e)
    } finally {
      setDeleting(false)
    }
  }

  const handleSaveStaff = async (updatedStaff: Partial<Staff>) => {
    if (!staff?.id) return
    try {
      // Combine all data into a single UpdateStaffDto object
      const updateData: UpdateStaffDto = {}
      
      // Personal information fields
      if (updatedStaff.firstName !== undefined) updateData.firstName = updatedStaff.firstName
      if (updatedStaff.lastName !== undefined) updateData.lastName = updatedStaff.lastName
      if (updatedStaff.email !== undefined) updateData.email = updatedStaff.email
      if (updatedStaff.phone !== undefined) updateData.phone = updatedStaff.phone
      if (updatedStaff.nationalId !== undefined) updateData.nationalId = updatedStaff.nationalId
      if (updatedStaff.dateOfBirth !== undefined) updateData.dateOfBirth = updatedStaff.dateOfBirth

      if (updatedStaff.emergencyContact !== undefined) updateData.emergencyContact = updatedStaff.emergencyContact
      
      // Employment data
      if (updatedStaff.employeeId !== undefined) updateData.employeeId = updatedStaff.employeeId
      if (updatedStaff.department !== undefined) {
        updateData.departmentId = typeof updatedStaff.department === 'string' ? updatedStaff.department : String(updatedStaff.department?.id || '')
      }
      if (updatedStaff.position !== undefined) {
        // ÖNEMLİ: position alanı backend'de positionTitle olarak saklanıyor
        updateData.positionTitle = typeof updatedStaff.position === 'string' ? updatedStaff.position : updatedStaff.position?.title
      }
      if (updatedStaff.employmentType !== undefined) updateData.employmentType = updatedStaff.employmentType
      if (updatedStaff.startDate !== undefined) updateData.startDate = updatedStaff.startDate
      if (updatedStaff.endDate !== undefined) updateData.endDate = updatedStaff.endDate
      // ÖNEMLİ: salary alanı backend'de monthlySalary olarak saklanıyor
      if (updatedStaff.salary !== undefined) updateData.monthlySalary = updatedStaff.salary
      if (updatedStaff.managerId !== undefined) updateData.managerId = updatedStaff.managerId
      if (updatedStaff.isManager !== undefined) updateData.isManager = updatedStaff.isManager
      // ÖNEMLİ: status alanı backend'de employmentStatus olarak saklanıyor
      if (updatedStaff.status !== undefined) updateData.employmentStatus = updatedStaff.status
      
      // Role handling - prioritize roleId if available, otherwise extract from role object
      if (updatedStaff.roleId !== undefined) {
        updateData.roleId = updatedStaff.roleId
      } else if (updatedStaff.role !== undefined) {
        updateData.roleId = typeof updatedStaff.role === 'string' ? updatedStaff.role : updatedStaff.role?.id
      }
      
      console.log('Updating staff with:', updateData)
      
      // Update staff data using the single endpoint
      const response = await staffService.updateStaff(staff.id, updateData)
      if (!response.success) {
        throw new Error('Failed to update staff')
      }
      
      // Fetch updated staff data
      const updatedResponse = await staffService.getStaffById(staff.id)
      if (updatedResponse.success && updatedResponse.data) {
        // Transform the response data before updating local state
        const transformedStaff = transformApiStaffToStaff(updatedResponse.data as any)
        
        // Ensure salary is properly updated from the local form data
        if (updatedStaff.salary !== undefined) {
          transformedStaff.salary = updatedStaff.salary
        }
        
        setStaff(transformedStaff)
        console.log('Staff updated successfully')
      }
    } catch (error) {
      console.error('Update staff failed:', error)
      throw error
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:ml-72">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <div className="mb-6">
              <Link href="/dashboard/staff">
                <Button variant="ghost" size="md" icon={ArrowLeft}>Geri Dön</Button>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="mb-4 flex justify-end gap-3">
              <Button variant="outline" size="md" icon={Clock} onClick={handlePermissionModalOpen}>
                İzin İşlemleri
              </Button>
              {hasUpdateStaffPermission && (
                <Button variant="secondary" size="md" icon={Edit} onClick={() => setShowEditModal(true)}>
                  Düzenle
                </Button>
              )}
              {hasDeleteStaffPermission && (
                <Button variant="danger" size="md" icon={ShieldAlert} onClick={() => setShowDeleteModal(true)} disabled={deleting}>
                  {deleting ? 'Siliniyor...' : 'Kaldır'}
                </Button>
              )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-6">Profil</h2>
                {/* Profile Summary */}
                <Card className="shadow-lg">
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <Avatar
                          src={staff.avatar}
                          alt={fullName}
                          fallback={`${staff.firstName?.[0] ?? ''}${staff.lastName?.[0] ?? ''}`.toUpperCase()}
                          size="lg"
                          className="h-24 w-24"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">{fullName}</h2>
                            {staff.status && (
                              <Badge variant="soft">{String(staff.status)}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-text-light-muted dark:text-text-muted">Pozisyon</p>
                            <p className="font-medium text-text-on-light dark:text-text-on-dark flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-primary-gold" />
                              {staff.position?.title || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-light-muted dark:text-text-muted">Departman</p>
                            <p className="font-medium text-text-on-light dark:text-text-on-dark flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-primary-gold" />
                              {staff.department?.name || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-light-muted dark:text-text-muted">İşe Başlama</p>
                            <p className="font-medium text-text-on-light dark:text-text-on-dark flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary-gold" />
                              {staff.startDate ? new Date(staff.startDate).toLocaleDateString('tr-TR') : '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-light-muted dark:text-text-muted">E-Posta</p>
                            <p className="font-medium text-text-on-light dark:text-text-on-dark flex items-center gap-2">
                              <Mail className="h-4 w-4 text-primary-gold" />
                              {staff.email || '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Personal Info */}
                <Card className="shadow-md">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary-gold" />
                      Kişisel Bilgiler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-light-muted dark:text-text-muted">Telefon</p>
                        <p className="font-medium text-text-on-light dark:text-text-on-dark">{staff.phone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-text-light-muted dark:text-text-muted">TC Kimlik No</p>
                        <p className="font-medium text-text-on-light dark:text-text-on-dark">{staff.nationalId || '-'}</p>
                      </div>
                      <div>
                        <p className="text-text-light-muted dark:text-text-muted">Doğum Tarihi</p>
                        <p className="font-medium text-text-on-light dark:text-text-on-dark">{staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString('tr-TR') : '-'}</p>
                      </div>

                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column */}
              <div className="lg:sticky lg:top-24 space-y-6">
                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-6">Personel Bilgileri</h2>
                {/* Work Summary */}
                <Card className="shadow-md">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary-gold" />
                      İş Bilgileri
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-text-light-muted dark:text-text-muted">Pozisyon</div>
                        <div className="font-medium text-text-on-light dark:text-text-on-dark">{staff.position?.title || '-'}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-text-light-muted dark:text-text-muted">Departman</div>
                        <div className="font-medium text-text-on-light dark:text-text-on-dark">{staff.department?.name || '-'}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-text-light-muted dark:text-text-muted">Maaş</div>
                        <div className="font-bold text-text-on-light dark:text-text-on-dark">
                          {typeof staff.salary === 'number' ? `${staff.salary.toLocaleString('tr-TR')} IQD` : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="shadow-md">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary-gold" />
                      İletişim Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                            <Phone className="h-5 w-5 text-primary-gold" />
                          </div>
                          <div>
                            <p className="text-sm text-text-light-muted dark:text-text-muted">Cep Telefonu</p>
                            <p className="font-medium text-text-on-light dark:text-text-on-dark">{staff.phone || 'Belirtilmemiş'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                            <Mail className="h-5 w-5 text-primary-gold" />
                          </div>
                          <div>
                            <p className="text-sm text-text-light-muted dark:text-text-muted">E-posta</p>
                            <p className="font-medium text-text-on-light dark:text-text-on-dark">{staff.email || 'Belirtilmemiş'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Personeli Kaldır"
        icon={ShieldAlert}
        customContent={(
          <div className="space-y-4">
            <div className="bg-background-light-card dark:bg-background-card rounded-xl p-4 text-left">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-light-muted dark:text-text-muted">Ad Soyad</span>
                  <span className="font-medium text-text-on-light dark:text-text-on-dark">{fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-light-muted dark:text-text-muted">Pozisyon</span>
                  <span className="font-medium text-text-on-light dark:text-text-on-dark">{staff.position?.title || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-light-muted dark:text-text-muted">Departman</span>
                  <span className="font-medium text-text-on-light dark:text-text-on-dark">{staff.department?.name || '-'}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-text-light-secondary dark:text-text-secondary text-left">
              Bu personeli kaldırmak istediğinize emin misiniz?
            </p>
          </div>
        )}
        confirmText="Kaldır"
        cancelText="Vazgeç"
        variant="danger"
        loading={deleting}
      />
      <EditStaffModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        staff={staff}
        onSave={handleSaveStaff}
      />
      
      {/* Permission Modal */}
      <Modal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title="İzin ve Mesai İşlemleri"
        size="md"
      >
        <div className="space-y-6">
          {/* Staff Info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium text-text-on-light dark:text-text-on-dark mb-3">Personel Bilgileri</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-light-muted dark:text-text-muted">Ad Soyad:</span>
                <span className="ml-2 font-medium text-text-on-light dark:text-text-on-dark">
                  {staff?.firstName} {staff?.lastName}
                </span>
              </div>
              <div>
                <span className="text-text-light-muted dark:text-text-muted">Email:</span>
                <span className="ml-2 font-medium text-text-on-light dark:text-text-on-dark">
                  {staff?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-text-on-light dark:text-text-on-dark">Durum Bilgileri</h4>
            
            {/* Is Active Status */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  staff?.isActive ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-text-on-light dark:text-text-on-dark">Aktif Durumu</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  staff?.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {staff?.isActive ? 'Aktif' : 'Pasif'}
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={async () => {
                    try {
                      // Optimistic update - immediately update UI
                      const newActiveStatus = !staff?.isActive
                      setStaff(prev => prev ? { 
                        ...prev, 
                        isActive: newActiveStatus,
                        // If becoming inactive, also set duty to false
                        isOnDuty: newActiveStatus ? prev.isOnDuty : false
                      } : prev)
                      
                      await staffService.toggleActiveStatus(staff?.id!)
                      
                      // Refresh staff data to ensure consistency
                      const response = await staffService.getAdminStaffById(params.id as string)
                      if (response.success && response.data) {
                        const transformedStaff = transformApiStaffToStaff(response.data)
                        setStaff(transformedStaff)
                      }
                    } catch (error) {
                      console.error('Failed to toggle active status:', error)
                      // Revert optimistic update on error
                      setStaff(prev => prev ? { ...prev, isActive: !prev.isActive } : prev)
                    }
                  }}
                >
                  {staff?.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                </Button>
              </div>
            </div>

            {/* Is On Duty */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  staff?.isOnDuty ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-text-on-light dark:text-text-on-dark">Görev Durumu</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  staff?.isOnDuty 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {staff?.isOnDuty ? 'Görevde' : 'Görevde Değil'}
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={async () => {
                    try {
                      // Optimistic update - immediately update UI
                      setStaff(prev => prev ? { ...prev, isOnDuty: !prev.isOnDuty } : prev)
                      
                      await staffService.toggleDutyStatus(staff?.id!)
                      
                      // Refresh staff data to ensure consistency
                      const response = await staffService.getAdminStaffById(params.id as string)
                      if (response.success && response.data) {
                        const transformedStaff = transformApiStaffToStaff(response.data)
                        setStaff(transformedStaff)
                      }
                    } catch (error) {
                      console.error('Failed to toggle duty status:', error)
                      // Revert optimistic update on error
                      setStaff(prev => prev ? { ...prev, isOnDuty: !prev.isOnDuty } : prev)
                    }
                  }}
                >
                  {staff?.isOnDuty ? 'Görevden Al' : 'Göreve Ver'}
                </Button>
              </div>
            </div>

            {/* Is On Leave */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  staff?.isOnLeave ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-text-on-light dark:text-text-on-dark">İzin Durumu</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  staff?.isOnLeave 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {staff?.isOnLeave ? 'İzinde' : 'İzinde Değil'}
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={async () => {
                    try {
                      // Optimistic update - immediately update UI
                      const newLeaveStatus = !staff?.isOnLeave
                      setStaff(prev => prev ? { 
                        ...prev, 
                        isOnLeave: newLeaveStatus,
                        // If going on leave, also set duty to false
                        isOnDuty: newLeaveStatus ? false : prev.isOnDuty
                      } : prev)
                      
                      await staffService.toggleLeaveStatus(staff?.id!)
                      
                      // Refresh staff data to ensure consistency
                      const response = await staffService.getAdminStaffById(params.id as string)
                      if (response.success && response.data) {
                        const transformedStaff = transformApiStaffToStaff(response.data)
                        setStaff(transformedStaff)
                      }
                    } catch (error) {
                      console.error('Failed to toggle leave status:', error)
                      // Revert optimistic update on error
                      setStaff(prev => prev ? { ...prev, isOnLeave: !prev.isOnLeave } : prev)
                    }
                  }}
                >
                  {staff?.isOnLeave ? 'İzni Bitir' : 'İzin Ver'}
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border-light dark:border-border">
            <Button
              onClick={() => setShowPermissionModal(false)}
              variant="outline"
              size="md"
            >
              Kapat
            </Button>
          </div>
        </div>
      </Modal>
    </ProtectedRoute>
  )
}



