'use client'

import React, { useState, useEffect } from 'react'
import { X, User, Building2, Shield } from 'lucide-react'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import type { Staff } from '@/services/types/staff.types'
import { roleService } from '@/services/role.service'
import { apiClient } from '@/services/api/client'

interface EditStaffModalProps {
  isOpen: boolean
  onClose: () => void
  staff: Staff | null
  onSave: (updatedStaff: Partial<Staff>) => void
}

type TabType = 'personal' | 'department' | 'roles'

export default function EditStaffModal({ isOpen, onClose, staff, onSave }: EditStaffModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('personal')
  const [formData, setFormData] = useState<Partial<Staff>>({})
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<any[]>([])
  const [positions, setPositions] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    if (staff) {
      setFormData({
        firstName: staff.firstName || '',
        lastName: staff.lastName || '',
        email: staff.email || '',
        phone: staff.phone || '',
        nationalId: staff.nationalId || '',
        dateOfBirth: staff.dateOfBirth || '',
        address: staff.address || '',
        salary: staff.salary || 0,
        startDate: staff.startDate || '',
        department: staff.department,
        position: staff.position,
        // roles will be handled separately
      })
    }
  }, [staff])

  // Fetch dropdown data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData()
    }
  }, [isOpen])

  const fetchDropdownData = async () => {
    setLoadingData(true)
    try {
      // Fetch all enums for departments and positions
      const enumsResponse = await apiClient.get('/enums')
      console.log('Enums response:', enumsResponse)
      
      // Extract departments and positions from enums response
      const enumsData = enumsResponse.data?.data || enumsResponse.data || {}
      console.log('Enums data:', enumsData)
      
      setDepartments(enumsData.staff?.department || [])
      setPositions(enumsData.staff?.position || [])

      // Fetch roles separately from role service
      const rolesResponse = await roleService.getNonAdminRoles()
      console.log('Roles response:', rolesResponse)
      setRoles(rolesResponse || [])
    } catch (error) {
      console.error('Error fetching dropdown data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleInputChange = (field: keyof Staff, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const tabs = [
    { id: 'personal' as TabType, label: 'Kişisel Bilgiler', icon: User },
    { id: 'department' as TabType, label: 'Departman & Pozisyon', icon: Building2 },
    { id: 'roles' as TabType, label: 'Rol Bilgileri', icon: Shield },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
            <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
              Personel Düzenle
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background-light-hover dark:hover:bg-background-hover rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-border-light dark:border-border-dark">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-gold text-primary-gold'
                        : 'border-transparent text-text-light-muted dark:text-text-muted hover:text-text-on-light dark:hover:text-text-on-dark hover:border-border-light dark:hover:border-border-dark'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'personal' && (
              <PersonalInfoTab
                formData={formData}
                onChange={handleInputChange}
              />
            )}
            
            {activeTab === 'department' && (
              <DepartmentTab
                formData={formData}
                onChange={handleInputChange}
                departments={departments}
                positions={positions}
                loading={loadingData}
              />
            )}
            
            {activeTab === 'roles' && (
              <RolesTab
                staff={staff}
                formData={formData}
                onChange={handleInputChange}
                roles={roles}
                loading={loadingData}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border-light dark:border-border-dark">
            <Button variant="ghost" onClick={onClose}>
              İptal
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Personal Info Tab Component
function PersonalInfoTab({ formData, onChange }: { formData: Partial<Staff>, onChange: (field: keyof Staff, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
            Ad
          </label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => onChange('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-gold"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
            Soyad
          </label>
          <input
            type="text"
            value={formData.lastName || ''}
            onChange={(e) => onChange('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-gold"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
            E-posta
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-gold"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
            Telefon
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-gold"
          />
        </div>
        

        
        <div>
          <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
            Doğum Tarihi
          </label>
          <input
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={(e) => onChange('dateOfBirth', e.target.value)}
            className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-gold"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
          Adres
        </label>
        <textarea
          value={formData.address || ''}
          onChange={(e) => onChange('address', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-gold"
        />
      </div>
    </div>
  )
}

// Department Tab Component
function DepartmentTab({ 
  formData, 
  onChange, 
  departments, 
  positions, 
  loading 
}: { 
  formData: Partial<Staff>, 
  onChange: (field: keyof Staff, value: any) => void,
  departments: any[],
  positions: any[],
  loading: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
            Departman
          </label>
          <select
            value={formData.department || ''}
            onChange={(e) => onChange('department', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-gold disabled:opacity-50"
          >
            <option value="">{loading ? 'Yükleniyor...' : 'Departman Seçin'}</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
            Pozisyon
          </label>
          <select
            value={formData.position || ''}
            onChange={(e) => onChange('position', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-gold disabled:opacity-50"
          >
            <option value="">{loading ? 'Yükleniyor...' : 'Pozisyon Seçin'}</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
            Maaş (IQD)
          </label>
          <input
            type="number"
            value={formData.salary || ''}
            onChange={(e) => onChange('salary', Number(e.target.value))}
            className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-gold"
          />
        </div>
        

      </div>
    </div>
  )
}

// Roles Tab Component
function RolesTab({ 
  staff, 
  formData, 
  onChange, 
  roles, 
  loading 
}: { 
  staff: Staff | null, 
  formData: Partial<Staff>, 
  onChange: (field: keyof Staff, value: any) => void,
  roles: any[],
  loading: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="bg-background-light-card dark:bg-background-card rounded-lg p-4">
        <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark mb-4">
          Rol Yönetimi
        </h3>
        <p className="text-text-light-muted dark:text-text-muted mb-4">
          Bu personele atanacak rolleri seçin. Roller, personelin sistemde hangi işlemleri yapabileceğini belirler.
        </p>
        
        {loading ? (
          <div className="text-text-light-muted dark:text-text-muted">
            Roller yükleniyor...
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
              Rol Seçin
            </label>
            <select
              value={formData.role || ''}
              onChange={(e) => onChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-gold"
            >
              <option value="">Rol Seçin</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}