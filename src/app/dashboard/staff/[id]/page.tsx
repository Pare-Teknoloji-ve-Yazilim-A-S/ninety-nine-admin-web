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
import { transformApiStaffToStaff } from '../../staff/utils/transformations'
import type { Staff } from '@/services/types/staff.types'
import ConfirmationModal from '@/app/components/ui/ConfirmationModal'
import { ShieldAlert } from 'lucide-react'

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

  useEffect(() => {
    let isMounted = true
    const fetchDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await staffService.getAdminStaffById(staffId)
        if (!isMounted) return
        // Unwrap possible ApiResponse shapes then transform
        const payload: any = res as any
        const raw = payload?.data ?? payload?.result ?? payload
        const transformed = transformApiStaffToStaff(raw as any)
        setStaff(transformed)
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
              <Button variant="secondary" size="md" icon={Edit} onClick={() => { /* TODO: edit modal or route */ }}>
                Düzenle
              </Button>
              <Button variant="danger" size="md" icon={ShieldAlert} onClick={() => setShowDeleteModal(true)} disabled={deleting}>
                {deleting ? 'Siliniyor...' : 'Kaldır'}
              </Button>
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
                      <div>
                        <p className="text-text-light-muted dark:text-text-muted">Adres</p>
                        <p className="font-medium text-text-on-light dark:text-text-on-dark">{staff.address || '-'}</p>
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
                          {typeof staff.salary === 'number' ? `${staff.salary.toLocaleString('tr-TR')} ₺` : '-'}
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
    </ProtectedRoute>
  )
}



