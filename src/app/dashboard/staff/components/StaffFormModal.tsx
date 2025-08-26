'use client'

import React, { useState, useEffect } from 'react';
import Modal from '@/app/components/ui/Modal'
import { StaffForm } from '@/components/staff'
import type { Staff, CreateStaffDto, UpdateStaffDto } from '@/services/types/staff.types'
import type { Department, Position } from '@/services/types/department.types'
import type { Role } from '@/types/role'
import type { SearchableOption } from '@/app/components/ui/SearchableDropdown'
import { DepartmentCode, PositionCode } from '@/services/types/organization.enums'
import { enumsService } from '@/services/enums.service'
import { roleService } from '@/services/role.service'

// Dil çevirileri
const translations = {
  tr: {
    editStaff: 'Personel Düzenle',
    addNewStaff: 'Yeni Personel Ekle'
  },
  en: {
    editStaff: 'Edit Staff',
    addNewStaff: 'Add New Staff'
  },
  ar: {
    editStaff: 'تعديل الموظف',
    addNewStaff: 'إضافة موظف جديد'
  }
};

interface StaffFormModalProps {
  open: boolean
  editingStaff: Staff | null
  departments: Department[]
  positions: Position[]
  managers: Staff[]
  onSubmit: (data: CreateStaffDto | UpdateStaffDto) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export default function StaffFormModal({
  open,
  editingStaff,
  departments,
  positions,
  managers,
  onSubmit,
  onClose,
  isLoading,
}: StaffFormModalProps) {
  // Dil tercihini localStorage'dan al
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);
  
  // Fetch roles when modal opens
  useEffect(() => {
    if (open && roles.length === 0) {
      const fetchRoles = async () => {
        try {
          setRolesLoading(true);
          const rolesData = await roleService.getNonAdminRoles();
          setRoles(rolesData);
        } catch (error) {
          console.error('Error fetching roles:', error);
          setRoles([]);
        } finally {
          setRolesLoading(false);
        }
      };
      fetchRoles();
    }
  }, [open, roles.length]);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

  const appEnums = (typeof window !== 'undefined') ? enumsService.getFromCache() : null
  // Build fallback enum-based options when API lists are empty
  const trDepartmentLabels: Record<string, string> = {
    MANAGEMENT: 'Yönetim',
    SECURITY: 'Güvenlik',
    MAINTENANCE: 'Bakım',
    CLEANING: 'Temizlik',
    LANDSCAPING: 'Peyzaj',
    ACCOUNTING: 'Muhasebe',
    FRONT_OFFICE: 'Ön Büro',
    RESIDENT_RELATIONS: 'Sakin İlişkileri',
    LOGISTICS: 'Lojistik',
    IT: 'Bilgi Teknolojileri',
    HEALTH_SAFETY: 'İş Sağlığı ve Güvenliği',
    SOCIAL_FACILITIES: 'Sosyal Tesisler',
    WASTE_MANAGEMENT: 'Atık Yönetimi',
    PROCUREMENT: 'Satın Alma',
    PARKING: 'Otopark'
  }
  const buildDepartmentEnumOptions = (): SearchableOption[] => {
    const codes = (appEnums?.data?.staff?.department as string[] | undefined) || (Object.values(DepartmentCode) as string[])
    return codes.map((code) => ({ value: code, label: trDepartmentLabels[code] || code.replace(/_/g, ' '), description: code }))
  }

  const trPositionLabels: Record<string, string> = {
    SITE_MANAGER: 'Site Müdürü',
    ASSISTANT_SITE_MANAGER: 'Site Müdür Yardımcısı',
    SECURITY_SUPERVISOR: 'Güvenlik Amiri',
    SECURITY_OFFICER: 'Güvenlik Görevlisi',
    MAINTENANCE_SUPERVISOR: 'Bakım Amiri',
    TECHNICIAN_ELECTRICAL: 'Teknisyen (Elektrik)',
    TECHNICIAN_PLUMBING: 'Teknisyen (Sıhhi Tesisat)',
    TECHNICIAN_HVAC: 'Teknisyen (HVAC)',
    CLEANING_SUPERVISOR: 'Temizlik Şefi',
    CLEANER: 'Temizlik Personeli',
    GARDENER: 'Bahçıvan',
    LANDSCAPE_SUPERVISOR: 'Peyzaj Sorumlusu',
    ACCOUNTANT: 'Muhasebeci',
    CASHIER: 'Kasiyer',
    FRONT_DESK_AGENT: 'Resepsiyon Görevlisi',
    RESIDENT_RELATIONS_SPECIALIST: 'Sakin İlişkileri Uzmanı',
    LOGISTICS_COORDINATOR: 'Lojistik Koordinatörü',
    IT_SUPPORT: 'IT Destek Uzmanı',
    HSE_OFFICER: 'İSG Uzmanı',
    FACILITY_SUPERVISOR: 'Tesis Sorumlusu',
    POOL_ATTENDANT: 'Havuz Görevlisi',
    FITNESS_TRAINER: 'Fitness Eğitmeni',
    WASTE_COLLECTION_STAFF: 'Atık Toplama Personeli',
    PROCUREMENT_SPECIALIST: 'Satın Alma Uzmanı',
    PARKING_ATTENDANT: 'Otopark Görevlisi'
  }
  const buildPositionEnumOptions = (): SearchableOption[] => {
    const codes = (appEnums?.data?.staff?.position as string[] | undefined) || (Object.values(PositionCode) as string[])
    return codes.map((code) => ({ value: code, label: trPositionLabels[code] || code.replace(/_/g, ' '), description: code }))
  }

  const departmentOptions: SearchableOption[] = (departments && departments.length > 0)
    ? departments.map(d => ({ value: d.code, label: d.name, description: d.code }))
    : buildDepartmentEnumOptions()

  const positionOptions: SearchableOption[] = (positions && positions.length > 0)
    ? positions.map(p => ({ value: (p.code ?? p.id.toString()), label: p.title, description: (p.code ?? p.department?.name) }))
    : buildPositionEnumOptions()

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={editingStaff ? t.editStaff : t.addNewStaff}
      size="xl"
      className="max-w-5xl"
    >
      <StaffForm
        staff={editingStaff as Staff}
        departments={departments}
        positions={positions}
        managers={managers}
        roles={roles}
        departmentOptions={departmentOptions}
        positionOptions={positionOptions}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={!!isLoading || rolesLoading}
      />
    </Modal>
  )
}


