"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";
import DashboardHeader from "@/app/dashboard/components/DashboardHeader";
import Sidebar from "@/app/components/ui/Sidebar";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import { useUnitDetail } from "@/hooks/useUnitDetail";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/app/components/ui/Toast";
import BasicInfoSection from "./components/BasicInfoSection";
import OwnerInfoSection from "./components/OwnerInfoSection";
import TenantInfoSection from "./components/TenantInfoSection";
import ResidentsSection from "./components/ResidentsSection";
import FinancialSummarySection from "./components/FinancialSummarySection";
import AddTenantModal from "./components/AddTenantModal";
import AddOwnerModal from "./components/AddOwnerModal";
import {
  Building,
  Home,
  Store,
  Car,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Calendar,
  Edit,
  Phone,
  MessageSquare,
  Settings,
  Users,
  DollarSign,
  Zap,
  Wrench,
  UserCheck,
  FileText,
  UserX
} from "lucide-react";

import Modal from "@/app/components/ui/Modal";
import { UpdateBasicInfoDto, UpdateOwnerInfoDto, UpdateTenantInfoDto } from "@/services/types/unit-detail.types";
import propertyService from "@/services/property.service";
import { userService } from "@/services/user.service";
import { usePermissionCheck } from '@/hooks/usePermissionCheck';

// Property permission constants
const UPDATE_PROPERTY_PERMISSION_ID = 'Update Property';
const UPDATE_PROPERTY_PERMISSION_NAME = 'Update Property';
const ASSIGN_PROPERTY_PERMISSION_ID = 'Assign Property';
const ASSIGN_PROPERTY_PERMISSION_NAME = 'Assign Property';

// Dil çevirileri
const translations = {
  tr: {
    title: 'Konut Detayı',
    welcome: 'Konut detay sayfası',
    home: 'Ana Sayfa',
    units: 'Konutlar',
    unitDetail: 'Konut Detayı',
    back: 'Geri Dön',
    loading: 'Yükleniyor...',
    error: 'Hata',
    unitNotFound: 'Konut bulunamadı',
    unitDetailError: 'Konut detayı yüklenemedi.',
    backToList: 'Konut Listesine Dön',
    block: 'Blok',
    floor: 'Kat',
    area: 'Alan',
    status: 'Durum',
    available: 'Müsait',
    occupied: 'Dolu',
    residents: 'Sakinler',
    financial: 'Finansal',
    consumption: 'Tüketim',
    maintenance: 'Bakım',
    visitors: 'Ziyaretçiler',
    documents: 'Belgeler',
    financialDetails: 'Finansal Detaylar',
    financialDetailsDesc: 'Bu konut için finansal detaylar burada görüntülenecek.',
    consumptionData: 'Tüketim Verileri',
    consumptionDataDesc: 'Elektrik, su ve gaz tüketim verileri burada görüntülenecek.',
    maintenanceHistory: 'Bakım Geçmişi',
    maintenanceHistoryDesc: 'Bu konut için bakım kayıtları burada görüntülenecek.',
    visitorHistory: 'Ziyaretçi Geçmişi',
    visitorHistoryDesc: 'Bu konut için ziyaretçi kayıtları burada görüntülenecek.',
    documentsDesc: 'Bu konut için belgeler burada görüntülenecek.',
    financialStatus: 'Finansal Durum',
    totalDebt: 'Toplam Borç',
    notes: 'Notlar',
    removeTenant: 'Kiracıyı Kaldır',
    removeTenantConfirm: 'Kiracıyı kaldırmak istediğinizden emin misiniz?',
    removeTenantWarning: 'Bu işlem geri alınamaz. Kiracı bu konuttan kaldırılacak ve konut durumu "Uygun" olarak değiştirilecektir.',
    tenant: 'Kiracı',
    removeOwner: 'Maliki Kaldır',
    removeOwnerConfirm: 'Maliki kaldırmak istediğinizden emin misiniz?',
    removeOwnerWarning: 'Bu işlem geri alınamaz. Malik bu konuttan kaldırılacaktır.',
    owner: 'Malik',
    cancel: 'İptal',
    removing: 'Kaldırılıyor...',
    removeTenantAction: 'Kiracıyı Kaldır',
    removeOwnerAction: 'Maliki Kaldır',
    tenantRemovalSuccess: 'Kiracı kaldırma işlemi tamamlandı!',
    ownerRemovalSuccess: 'Malik kaldırma işlemi tamamlandı!',
    tenantRemovalError: 'Kiracı kaldırılırken bir hata oluştu',
    ownerRemovalError: 'Malik kaldırılırken bir hata oluştu',
    tenantIdNotFound: 'Kiracı ID\'si bulunamadı. Backend\'de tenantId field\'ı eksik olabilir.',
    ownerIdNotFound: 'Malik ID\'si bulunamadı. Backend\'de ownerId field\'ı eksik olabilir.',
    activeApprovedResidentsFound: 'aktif onaylı sakin bulundu.',
    activeApprovedResidentsError: 'Aktif onaylı sakinler yüklenemedi',
    unknownError: 'Bilinmeyen hata',
    updateSuccess: 'başarıyla güncellendi!',
    updateError: 'Güncelleme sırasında bir hata oluştu',
    updateFailed: 'Güncelleme başarısız',
    basicInfoUpdateSuccess: 'Konut bilgileri başarıyla güncellendi!',
    ownerInfoUpdateSuccess: 'Malik bilgileri başarıyla güncellendi!',
    tenantInfoUpdateSuccess: 'Kiracı bilgileri başarıyla güncellendi!',
    ownerInfoUpdateError: 'Malik bilgileri güncellenemedi: Malik kimliği bulunamadı',
    tenantInfoUpdateError: 'Kiracı bilgileri güncellenemedi: Kiracı kimliği bulunamadı',
    noChanges: 'Değişiklik yok',
    apiError: 'API hatası',
    propertyType: {
      RESIDENCE: 'Daire',
      VILLA: 'Villa',
      COMMERCIAL: 'Ticari',
      OFFICE: 'Ofis'
    }
  },
  en: {
    title: 'Unit Detail',
    welcome: 'Unit detail page',
    home: 'Home',
    units: 'Units',
    unitDetail: 'Unit Detail',
    back: 'Go Back',
    loading: 'Loading...',
    error: 'Error',
    unitNotFound: 'Unit not found',
    unitDetailError: 'Unit detail could not be loaded.',
    backToList: 'Back to Unit List',
    block: 'Block',
    floor: 'Floor',
    area: 'Area',
    status: 'Status',
    available: 'Available',
    occupied: 'Occupied',
    residents: 'Residents',
    financial: 'Financial',
    consumption: 'Consumption',
    maintenance: 'Maintenance',
    visitors: 'Visitors',
    documents: 'Documents',
    financialDetails: 'Financial Details',
    financialDetailsDesc: 'Financial details for this unit will be displayed here.',
    consumptionData: 'Consumption Data',
    consumptionDataDesc: 'Electricity, water and gas consumption data will be displayed here.',
    maintenanceHistory: 'Maintenance History',
    maintenanceHistoryDesc: 'Maintenance records for this unit will be displayed here.',
    visitorHistory: 'Visitor History',
    visitorHistoryDesc: 'Visitor records for this unit will be displayed here.',
    documentsDesc: 'Documents for this unit will be displayed here.',
    financialStatus: 'Financial Status',
    totalDebt: 'Total Debt',
    notes: 'Notes',
    removeTenant: 'Remove Tenant',
    removeTenantConfirm: 'Are you sure you want to remove the tenant?',
    removeTenantWarning: 'This action cannot be undone. The tenant will be removed from this unit and the unit status will be changed to "Available".',
    tenant: 'Tenant',
    removeOwner: 'Remove Owner',
    removeOwnerConfirm: 'Are you sure you want to remove the owner?',
    removeOwnerWarning: 'This action cannot be undone. The owner will be removed from this unit.',
    owner: 'Owner',
    cancel: 'Cancel',
    removing: 'Removing...',
    removeTenantAction: 'Remove Tenant',
    removeOwnerAction: 'Remove Owner',
    tenantRemovalSuccess: 'Tenant removal completed!',
    ownerRemovalSuccess: 'Owner removal completed!',
    tenantRemovalError: 'An error occurred while removing the tenant',
    ownerRemovalError: 'An error occurred while removing the owner',
    tenantIdNotFound: 'Tenant ID not found. The tenantId field may be missing in the backend.',
    ownerIdNotFound: 'Owner ID not found. The ownerId field may be missing in the backend.',
    activeApprovedResidentsFound: 'active approved residents found.',
    activeApprovedResidentsError: 'Active approved residents could not be loaded',
    unknownError: 'Unknown error',
    updateSuccess: 'updated successfully!',
    updateError: 'An error occurred during update',
    updateFailed: 'Update failed',
    basicInfoUpdateSuccess: 'Unit information updated successfully!',
    ownerInfoUpdateSuccess: 'Owner information updated successfully!',
    tenantInfoUpdateSuccess: 'Tenant information updated successfully!',
    ownerInfoUpdateError: 'Owner information could not be updated: Owner ID not found',
    tenantInfoUpdateError: 'Tenant information could not be updated: Tenant ID not found',
    noChanges: 'No changes',
    apiError: 'API error',
    propertyType: {
      RESIDENCE: 'Residence',
      VILLA: 'Villa',
      COMMERCIAL: 'Commercial',
      OFFICE: 'Office'
    }
  },
  ar: {
    title: 'تفاصيل الوحدة',
    welcome: 'صفحة تفاصيل الوحدة',
    home: 'الرئيسية',
    units: 'الوحدات',
    unitDetail: 'تفاصيل الوحدة',
    back: 'العودة',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    unitNotFound: 'الوحدة غير موجودة',
    unitDetailError: 'لا يمكن تحميل تفاصيل الوحدة.',
    backToList: 'العودة إلى قائمة الوحدات',
    block: 'كتلة',
    floor: 'طابق',
    area: 'مساحة',
    status: 'الحالة',
    available: 'متاح',
    occupied: 'مشغول',
    residents: 'المقيمون',
    financial: 'مالي',
    consumption: 'الاستهلاك',
    maintenance: 'الصيانة',
    visitors: 'الزوار',
    documents: 'المستندات',
    financialDetails: 'التفاصيل المالية',
    financialDetailsDesc: 'ستعرض التفاصيل المالية لهذه الوحدة هنا.',
    consumptionData: 'بيانات الاستهلاك',
    consumptionDataDesc: 'ستعرض بيانات استهلاك الكهرباء والماء والغاز هنا.',
    maintenanceHistory: 'تاريخ الصيانة',
    maintenanceHistoryDesc: 'ستعرض سجلات الصيانة لهذه الوحدة هنا.',
    visitorHistory: 'تاريخ الزوار',
    visitorHistoryDesc: 'ستعرض سجلات الزوار لهذه الوحدة هنا.',
    documentsDesc: 'ستعرض المستندات لهذه الوحدة هنا.',
    financialStatus: 'الحالة المالية',
    totalDebt: 'إجمالي الدين',
    notes: 'ملاحظات',
    removeTenant: 'إزالة المستأجر',
    removeTenantConfirm: 'هل أنت متأكد من إزالة المستأجر؟',
    removeTenantWarning: 'لا يمكن التراجع عن هذا الإجراء. سيتم إزالة المستأجر من هذه الوحدة وتغيير حالة الوحدة إلى "متاح".',
    tenant: 'المستأجر',
    removeOwner: 'إزالة المالك',
    removeOwnerConfirm: 'هل أنت متأكد من إزالة المالك؟',
    removeOwnerWarning: 'لا يمكن التراجع عن هذا الإجراء. سيتم إزالة المالك من هذه الوحدة.',
    owner: 'المالك',
    cancel: 'إلغاء',
    removing: 'جاري الإزالة...',
    removeTenantAction: 'إزالة المستأجر',
    removeOwnerAction: 'إزالة المالك',
    tenantRemovalSuccess: 'تم إكمال إزالة المستأجر!',
    ownerRemovalSuccess: 'تم إكمال إزالة المالك!',
    tenantRemovalError: 'حدث خطأ أثناء إزالة المستأجر',
    ownerRemovalError: 'حدث خطأ أثناء إزالة المالك',
    tenantIdNotFound: 'معرف المستأجر غير موجود. قد يكون حقل tenantId مفقود في الخلفية.',
    ownerIdNotFound: 'معرف المالك غير موجود. قد يكون حقل ownerId مفقود في الخلفية.',
    activeApprovedResidentsFound: 'مقيم نشط معتمد تم العثور عليه.',
    activeApprovedResidentsError: 'لا يمكن تحميل المقيمين النشطين المعتمدين',
    unknownError: 'خطأ غير معروف',
    updateSuccess: 'تم التحديث بنجاح!',
    updateError: 'حدث خطأ أثناء التحديث',
    updateFailed: 'فشل التحديث',
    basicInfoUpdateSuccess: 'تم تحديث معلومات الوحدة بنجاح!',
    ownerInfoUpdateSuccess: 'تم تحديث معلومات المالك بنجاح!',
    tenantInfoUpdateSuccess: 'تم تحديث معلومات المستأجر بنجاح!',
    ownerInfoUpdateError: 'لا يمكن تحديث معلومات المالك: معرف المالك غير موجود',
    tenantInfoUpdateError: 'لا يمكن تحديث معلومات المستأجر: معرف المستأجر غير موجود',
    noChanges: 'لا توجد تغييرات',
    apiError: 'خطأ في API',
    propertyType: {
      RESIDENCE: 'سكني',
      VILLA: 'فيلا',
      COMMERCIAL: 'تجاري',
      OFFICE: 'مكتب'
    }
  }
};

export default function UnitDetailPage() {
  const params = useParams();
  const unitId = params.id as string;
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  
  // Permission checks
  const { hasPermission } = usePermissionCheck();
  const hasUpdatePropertyPermission = hasPermission(UPDATE_PROPERTY_PERMISSION_ID);
  const hasAssignPropertyPermission = hasPermission(ASSIGN_PROPERTY_PERMISSION_ID);

  // Debug: Console log permission values
  console.log('Unit Detail Page Debug:', {
    hasUpdatePropertyPermission,
    hasAssignPropertyPermission,
    UPDATE_PROPERTY_PERMISSION_ID,
    ASSIGN_PROPERTY_PERMISSION_ID
  });
  
  // Debug: localStorage'daki izinleri kontrol et
  React.useEffect(() => {
    const userPermissions = localStorage.getItem('userPermissions');
    console.log('🔍 localStorage userPermissions:', userPermissions);
    if (userPermissions) {
      try {
        const parsed = JSON.parse(userPermissions);
        console.log('🔍 Parsed userPermissions:', parsed);
        console.log('🔍 Type of parsed:', typeof parsed);
        console.log('🔍 Is array:', Array.isArray(parsed));
        console.log('🔍 Permission array length:', parsed?.length);
        
        if (Array.isArray(parsed)) {
          parsed.forEach((perm, index) => {
            console.log(`🔍 Permission ${index}:`, perm);
            if (typeof perm === 'object' && perm !== null) {
              console.log(`  - ID: ${perm.id}`);
              console.log(`  - Name: ${perm.name}`);
              console.log(`  - Action: ${perm.action}`);
              console.log(`  - Resource: ${perm.resource}`);
            }
          });
          
          // Özellikle 'Property' ile ilgili izinleri ara
          const propertyPermissions = parsed.filter(p => 
            (p.name && p.name.toLowerCase().includes('property')) ||
            (p.action && p.action.toLowerCase().includes('property')) ||
            (p.resource && p.resource.toLowerCase().includes('property'))
          );
          console.log('🏠 Property related permissions:', propertyPermissions);
          
          // 'Update' ve 'Assign' action'larını ara
          const updatePermissions = parsed.filter(p => 
            (p.action && p.action.toLowerCase().includes('update')) ||
            (p.name && p.name.toLowerCase().includes('update'))
          );
          const assignPermissions = parsed.filter(p => 
            (p.action && p.action.toLowerCase().includes('assign')) ||
            (p.name && p.name.toLowerCase().includes('assign'))
          );
          console.log('✏️ Update permissions:', updatePermissions);
          console.log('📌 Assign permissions:', assignPermissions);
        }
      } catch (e) {
        console.error('❌ Error parsing userPermissions:', e);
      }
    }
  }, []);

  // Dil tercihini localStorage'dan al
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];
  
  // DEBUG: Log params and unitId
  console.log('📄 UnitDetailPage - params:', params);
  console.log('📄 UnitDetailPage - params.id:', params.id);
  console.log('📄 UnitDetailPage - unitId:', unitId);
  console.log('📄 UnitDetailPage - typeof unitId:', typeof unitId);
  console.log('📄 UnitDetailPage - unitId length:', unitId?.length);
  
  // Initialize PropertyService
  // const propertyService = new PropertyService();
  
  // Helper function to format UUID (add hyphens if missing)
  const formatUUID = (uuid: string): string => {
    if (!uuid) return uuid;
    // If UUID is 32 characters (no hyphens), add hyphens
    if (uuid.length === 32) {
      return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
    }
    return uuid;
  };
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'residents' | 'financial' | 'consumption' | 'maintenance' | 'visitors' | 'documents'>('residents');
  const toast = useToast();

  // Add state for total debt
  const [totalDebt, setTotalDebt] = useState<number | null>(null);
  const [debtLoading, setDebtLoading] = useState(false);
  const [debtError, setDebtError] = useState<string | null>(null);
  
  // Add state for tenant removal
  const [removingTenant, setRemovingTenant] = useState(false);
  const [showRemoveTenantModal, setShowRemoveTenantModal] = useState(false);
  
  // Add state for owner removal
  const [removingOwner, setRemovingOwner] = useState(false);
  const [showRemoveOwnerModal, setShowRemoveOwnerModal] = useState(false);
  
  // Add state for tenant addition
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  
  // Add state for owner addition
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(false);
  
  // Add state for active approved residents API call
  const [activeApprovedResidents, setActiveApprovedResidents] = useState<any[]>([]);
  const [residentsLoading, setResidentsLoading] = useState(false);
  const [residentsError, setResidentsError] = useState<string | null>(null);
  
  const { 
    unit, 
    loading, 
    error, 
    refetch,
    updateBasicInfo,
    updateNotes
  } = useUnitDetail(unitId);

  // Helper function to get property type label
  const getPropertyTypeLabel = (type: string) => {
    return t.propertyType[type as keyof typeof t.propertyType] || type;
  };

  // Helper function to get status info
  const getStatusInfo = (status: string) => {
    if (status === 'occupied') {
      return { label: t.occupied, color: 'red' as const };
    } else {
      return { label: t.available, color: 'success' as const };
    }
  };

  // Fetch total debt for unit
  React.useEffect(() => {
    if (unitId) {
      setDebtLoading(true);
      setDebtError(null);
      fetch(`/api/proxy/admin/billing/total-debt/${unitId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
        .then(async (res) => {
          if (!res.ok) {
            setTotalDebt(0);
            return;
          }
          const data = await res.json();
          setTotalDebt(typeof data?.data === 'number' ? data.data : 0);
        })
        .catch(() => setTotalDebt(0))
        .finally(() => setDebtLoading(false));
    }
  }, [unitId]);

  // Fetch active approved residents when page loads
  useEffect(() => {
    const fetchActiveApprovedResidents = async () => {
      setResidentsLoading(true);
      setResidentsError(null);
      
      try {
        console.log('🧪 Fetching active approved residents on unit detail page...');
        const response = await userService.getActiveApprovedResidents();
        
        console.log('✅ Active approved residents response:', response);
        setActiveApprovedResidents(response.data || []);
        
        toast.success(`✅ ${response.data?.length || 0} ${t.activeApprovedResidentsFound}`);
      } catch (error: any) {
        console.error('❌ Failed to fetch active approved residents:', error);
        setResidentsError(error.message || t.activeApprovedResidentsError);
        toast.error(`❌ ${t.activeApprovedResidentsError}: ${error.message || t.unknownError}`);
      } finally {
        setResidentsLoading(false);
      }
    };

    fetchActiveApprovedResidents();
  }, []); // Run only once when component mounts

  // Handle tenant removal request (show modal)
  const handleRemoveTenantRequest = async () => {
    setShowRemoveTenantModal(true);
  };

  // Handle tenant addition request (show modal)
  const handleAddTenantRequest = async () => {
    setShowAddTenantModal(true);
  };

  const handleAddOwnerRequest = async () => {
    // Owner ekleme modal'ını aç
    setShowAddOwnerModal(true);
  };

  // Handle owner removal request (show modal)
  const handleRemoveOwnerRequest = async () => {
    setShowRemoveOwnerModal(true);
  };

  // Handle basic info update
  const handleUpdateBasicInfo = async (data: UpdateBasicInfoDto) => {
    if (!unitId) return;

    try {
      console.log('Updating basic info:', data);
      
      // Map frontend data to API format
      const updatePayload: any = {};
      
      if (data.apartmentNumber) updatePayload.propertyNumber = data.apartmentNumber;
      if (data.block) updatePayload.blockNumber = data.block;
      if (data.floor !== undefined) updatePayload.floor = data.floor;
      if (data.area !== undefined) updatePayload.area = data.area;
      if (data.propertyType) updatePayload.type = data.propertyType;
      if (data.status) {
        // Map frontend status to backend status
        const statusMap: Record<string, string> = {
          'occupied': 'OCCUPIED',
          'available': 'AVAILABLE'
        };
        updatePayload.status = statusMap[data.status] || data.status.toUpperCase();
      }

      console.log('API payload:', updatePayload);

      const response = await fetch(`/api/proxy/admin/properties/${unitId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t.updateFailed);
      }

      const result = await response.json();
      console.log('Update successful:', result);

      // Refresh unit data
      await refetch();
      
      toast.success(t.basicInfoUpdateSuccess);
    } catch (error: any) {
              console.error('Error updating basic info:', error);
        toast.error(error.message || t.updateError);
        throw error; // Re-throw to handle in component
    }
  };

  // Handle owner info update
  const handleUpdateOwnerInfo = async (data: UpdateOwnerInfoDto) => {
    if (!unitId || !unit?.ownerInfo) return;

    try {
      console.log('Updating owner info:', data);
      
      // Import the admin resident service
      const { adminResidentService, unitsService } = await import('@/services');
      
      // Prepare the update data for the resident
      const updateData: any = {};
      
      if (data.fullName) {
        const nameParts = data.fullName.split(' ');
        if (nameParts.length > 0) {
          updateData.firstName = nameParts[0];
          if (nameParts.length > 1) {
            updateData.lastName = nameParts.slice(1).join(' ');
          }
        }
      }
      
      // Format phone number - remove validation, just clean the format
      if (data.phone) {
        // Remove any non-digit characters except +
        let cleanPhone = data.phone.replace(/[^\d+]/g, '');
        // If it doesn't start with +, add +964 prefix for Iraqi numbers
        if (!cleanPhone.startsWith('+')) {
          if (cleanPhone.startsWith('0')) {
            cleanPhone = '+964' + cleanPhone.substring(1);
          } else if (cleanPhone.length === 10) {
            cleanPhone = '+964' + cleanPhone;
          } else {
            cleanPhone = '+964' + cleanPhone;
          }
        }
        updateData.phone = cleanPhone;
      }
      
      // Email - send as is without validation
      if (data.email) {
        updateData.email = data.email;
      }
      if (data.nationalId) updateData.identityNumber = data.nationalId;
      
      console.log('Resident update payload:', updateData);
      
      // First, get the current property data to extract the owner ID
      try {
        const propertyResponse = await unitsService.getPropertyById(unitId);
        const propertyData = propertyResponse;
        
        // Check if owner exists in the property data
        if (!propertyData || !propertyData.owner || !propertyData.owner.id) {
          console.error('Property owner ID not found');
          toast.error(t.ownerInfoUpdateError);
          return;
        }
        
        // Extract the owner ID from the owner object in API response
        const ownerId = propertyData.owner.id;
        console.log('Using owner ID from API:', ownerId);
        
        // Prepare property update data with formatted phone
        const propertyUpdateData: any = {
          ownerName: data.fullName,
          ownerPhone: updateData.phone || data.phone, // Use formatted phone if available
          ownerEmail: updateData.email || data.email, // Use email as is
          ownerIdentityNumber: data.nationalId,
          ownerId: ownerId // Use the owner ID from API
        };
        
        // Update the property owner information
        await unitsService.updateUnit(unitId, propertyUpdateData);
        console.log('Property owner info updated successfully with API owner ID');
        
        // Refresh unit data after successful update
        await refetch();
        
        toast.success(t.ownerInfoUpdateSuccess);
        return;
      } catch (propertyError) {
        console.error('Error updating property owner info:', propertyError);
        // Continue with the resident update as fallback
      }
      
      // Fallback: Try to update the resident record if property update fails
      try {
        // Get the current property data to extract the owner ID
        const propertyResponse = await unitsService.getPropertyById(unitId);
        const propertyData = propertyResponse;
        
        // Check if owner exists in the property data
        if (!propertyData || !propertyData.owner || !propertyData.owner.id) {
          console.error('Property owner ID not found for fallback');
          toast.error(t.ownerInfoUpdateError);
          return;
        }
        
        // Extract the owner ID from the owner object in API response
        const ownerId = propertyData.owner.id;
        console.log('Using owner ID from API for resident update:', ownerId);
        
        // If we have update data, update the resident with the API owner ID
        if (Object.keys(updateData).length > 0) {
          await adminResidentService.updateResident(ownerId, updateData);
          console.log('Owner info updated successfully with API owner ID');
          
          // Refresh unit data after successful update
          await refetch();
          
          toast.success(t.ownerInfoUpdateSuccess);
        } else {
          console.warn('Could not update owner info: no changes to make');
          toast.error(`${t.ownerInfoUpdateError}: ${t.noChanges}`);
        }
      } catch (residentError) {
        console.error('Error updating resident with API owner ID:', residentError);
        toast.error(`${t.ownerInfoUpdateError}: ${t.apiError}`);
      }
    } catch (error: any) {
      console.error('Error updating owner info:', error);
      toast.error(error.message || 'Güncelleme sırasında bir hata oluştu');
      throw error; // Re-throw to handle in component
    }
  };

  // Handle tenant info update
  const handleUpdateTenantInfo = async (data: UpdateTenantInfoDto) => {
    if (!unitId || !unit?.tenantInfo) return;

    try {
      console.log('Updating tenant info:', data);
      
      // Import the admin resident service
      const { adminResidentService, unitsService } = await import('@/services');
      
      // Prepare the update data for the resident
      const updateData: any = {};
      
      if (data.tenantName) {
        const nameParts = data.tenantName.split(' ');
        if (nameParts.length > 0) {
          updateData.firstName = nameParts[0];
          if (nameParts.length > 1) {
            updateData.lastName = nameParts.slice(1).join(' ');
          }
        }
      }
      
      // Format phone number - remove validation, just clean the format
      if (data.tenantPhone) {
        // Remove any non-digit characters except +
        let cleanPhone = data.tenantPhone.replace(/[^\d+]/g, '');
        // If it doesn't start with +, add +964 prefix for Iraqi numbers
        if (!cleanPhone.startsWith('+')) {
          if (cleanPhone.startsWith('0')) {
            cleanPhone = '+964' + cleanPhone.substring(1);
          } else if (cleanPhone.length === 10) {
            cleanPhone = '+964' + cleanPhone;
          } else {
            cleanPhone = '+964' + cleanPhone;
          }
        }
        updateData.phone = cleanPhone;
      }
      
      // Email - send as is without validation
      if (data.tenantEmail) {
        updateData.email = data.tenantEmail;
      }
      
      console.log('Tenant update payload:', updateData);
      
      // Get the current property data to extract the tenant ID
      try {
        const propertyResponse = await unitsService.getPropertyById(unitId);
        const propertyData = propertyResponse;
        
        // Check if tenant exists in the property data
        if (!propertyData || !propertyData.tenant || !propertyData.tenant.id) {
          console.error('Property tenant ID not found');
          toast.error(t.tenantInfoUpdateError);
          return;
        }
        
        // Extract the tenant ID from the tenant object in API response
        const tenantId = propertyData.tenant.id;
        console.log('Using tenant ID from API:', tenantId);
        
        // Update the resident with the API tenant ID
        if (Object.keys(updateData).length > 0) {
          await adminResidentService.updateResident(tenantId, updateData);
          console.log('Tenant info updated successfully with API tenant ID');
          
          // Refresh unit data after successful update
          await refetch();
          
          toast.success(t.tenantInfoUpdateSuccess);
        } else {
          console.warn('Could not update tenant info: no changes to make');
          toast.error(`${t.tenantInfoUpdateError}: ${t.noChanges}`);
        }
      } catch (error) {
        console.error('Error updating tenant with API tenant ID:', error);
        toast.error(`${t.tenantInfoUpdateError}: ${t.apiError}`);
      }
    } catch (error: any) {
      console.error('Error updating tenant info:', error);
      toast.error(error.message || 'Güncelleme sırasında bir hata oluştu');
      throw error; // Re-throw to handle in component
    }
  };

  // Handle tenant removal confirmation
  const handleRemoveTenantConfirm = async () => {
    let tenantId = unit?.tenantId;
    
    console.log('Unit tenantId from properties table:', tenantId);
    

    
    // If tenantId not in property data, try to find it via email
    if (!tenantId && unit?.tenantInfo?.data?.tenantEmail?.value) {
      const tenantEmail = unit.tenantInfo.data.tenantEmail.value;
      console.log('Trying to find tenant by email:', tenantEmail);
      console.log('All tenant info data:', unit.tenantInfo.data);
      
      try {
        const userResponse = await fetch(`/api/proxy/admin/users?email=${encodeURIComponent(tenantEmail)}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('User search result:', userData);
          
          if (userData.data && userData.data.length > 0) {
            // Find the user with matching email
            const matchingUser = userData.data.find((user: any) => 
              user.email === tenantEmail
            );
            
            if (matchingUser) {
              tenantId = matchingUser.id;
              console.log('Found matching tenant by email:', matchingUser);
              console.log('Found tenant ID via email:', tenantId);
            } else {
              console.log('No user found with matching email:', tenantEmail);
              
              // Try to find by tenant name as fallback
              const tenantName = unit?.tenantInfo?.data?.tenantName?.value;
              if (tenantName) {
                console.log('Trying to find tenant by name:', tenantName);
                const nameMatchUser = userData.data.find((user: any) => {
                  const fullName = `${user.firstName} ${user.lastName}`.trim();
                  return fullName === tenantName || 
                         user.firstName === tenantName.split(' ')[0] ||
                         fullName.toLowerCase() === tenantName.toLowerCase();
                });
                
                if (nameMatchUser) {
                  tenantId = nameMatchUser.id;
                  console.log('Found tenant by name match:', nameMatchUser);
                  console.log('Found tenant ID via name:', tenantId);
                }
              }
            }
          }
        } else {
          console.log('User search failed:', userResponse.status);
        }
      } catch (error) {
        console.error('Error searching for user:', error);
      }
    }
    
    if (!tenantId) {
      toast.error(t.tenantIdNotFound);
      return;
    }
    
    setRemovingTenant(true);
    try {
      console.log('Removing tenant from property:', { unitId, tenantId });
      
             // Try different approaches to remove tenant
       const removeTenantPayload = {
         tenantId: null,
         tenant: null,
         isRented: false,
         status: 'AVAILABLE',
         removeTenant: true,
         hasTenant: false,
         // Try additional fields that might work
         clearTenant: true,
         unassignTenant: true,
         tenantRemoved: true
       };
      
      console.log('Sending tenant removal payload:', removeTenantPayload);
      
      // First try the new endpoint
      let response = await fetch(`/api/proxy/admin/properties/${unitId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(removeTenantPayload)
      });
      
      // If new endpoint doesn't work, try the old endpoint
      if (!response.ok) {
        console.log('New endpoint failed, trying old endpoint...');
        response = await fetch(`/api/proxy/admin/properties/${unitId}/tenant`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t.tenantRemovalError);
      }

      const result = await response.json();
      console.log('Tenant removal response:', result);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check if tenant was actually removed
      if (result.data?.property?.tenantId || result.data?.property?.tenant) {
        console.warn('Tenant still exists in response:', {
          tenantId: result.data?.property?.tenantId,
          tenant: result.data?.property?.tenant
        });
      } else {
        console.log('✅ Tenant appears to be removed from response');
      }

      // Force refresh unit data with cache busting
      console.log('Forcing unit data refresh...');
      await refetch();
      
      // Wait a bit and check if data updated
      setTimeout(async () => {
        console.log('Unit data after refresh:', unit);
        if (unit?.tenantInfo?.isRented && unit?.tenantInfo?.data?.tenantName?.value) {
          console.warn('Frontend still shows tenant after removal');
          // Force another refresh
          await refetch();
        }
      }, 1000);
      
      // Additional refresh after 3 seconds
      setTimeout(async () => {
        console.log('Final refresh check...');
        await refetch();
      }, 3000);
      
      toast.success(t.tenantRemovalSuccess);
      setShowRemoveTenantModal(false);
    } catch (error: any) {
      console.error('Error removing tenant:', error);
      toast.error(error.message || t.tenantRemovalError);
    } finally {
      setRemovingTenant(false);
    }
  };

  // Handle owner removal confirmation
  const handleRemoveOwnerConfirm = async () => {
    let ownerId = unit?.ownerId;
    
    console.log('Unit ownerId from properties table:', ownerId);
    
    // If ownerId not in property data, try to find it via email
    if (!ownerId && unit?.ownerInfo?.data?.email?.value) {
      const ownerEmail = unit.ownerInfo.data.email.value;
      console.log('Trying to find owner by email:', ownerEmail);
      console.log('All owner info data:', unit.ownerInfo.data);
      
      try {
        const userResponse = await fetch(`/api/proxy/admin/users?email=${encodeURIComponent(ownerEmail)}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('User search result:', userData);
          
          if (userData.data && userData.data.length > 0) {
            // Find the user with matching email
            const matchingUser = userData.data.find((user: any) => 
              user.email === ownerEmail
            );
            
            if (matchingUser) {
              ownerId = matchingUser.id;
              console.log('Found matching owner by email:', matchingUser);
              console.log('Found owner ID via email:', ownerId);
            } else {
              console.log('No user found with matching email:', ownerEmail);
              
              // Try to find by owner name as fallback
              const ownerName = unit?.ownerInfo?.data?.fullName?.value;
              if (ownerName) {
                console.log('Trying to find owner by name:', ownerName);
                const nameMatchUser = userData.data.find((user: any) => {
                  const fullName = `${user.firstName} ${user.lastName}`.trim();
                  return fullName === ownerName || 
                         user.firstName === ownerName.split(' ')[0] ||
                         fullName.toLowerCase() === ownerName.toLowerCase();
                });
                
                if (nameMatchUser) {
                  ownerId = nameMatchUser.id;
                  console.log('Found owner by name match:', nameMatchUser);
                  console.log('Found owner ID via name:', ownerId);
                }
              }
            }
          }
        } else {
          console.log('User search failed:', userResponse.status);
        }
      } catch (error) {
        console.error('Error searching for user:', error);
      }
    }
    
    if (!ownerId) {
      toast.error(t.ownerIdNotFound);
      return;
    }
    
    setRemovingOwner(true);
    try {
      console.log('Removing owner from property:', { unitId, ownerId });
      
      // Format UUIDs to ensure they have hyphens
      const formattedUnitId = formatUUID(unitId);
      const formattedOwnerId = formatUUID(ownerId);
      
      console.log('Formatted UUIDs:', { formattedUnitId, formattedOwnerId });
      
      // Use PropertyService instead of direct fetch
      await propertyService.removeOwner(formattedUnitId, formattedOwnerId);
      
      console.log('Owner removal successful via PropertyService');

      // Force refresh unit data with cache busting
      console.log('Forcing unit data refresh...');
      await refetch();
      
      // Wait a bit and check if data updated
      setTimeout(async () => {
        console.log('Unit data after refresh:', unit);
        if (unit?.ownerInfo?.data?.fullName?.value) {
          console.warn('Frontend still shows owner after removal');
          // Force another refresh
          await refetch();
        }
      }, 1000);
      
      toast.success(t.ownerRemovalSuccess);
      setShowRemoveOwnerModal(false);
    } catch (error: any) {
      console.error('Error removing owner:', error);
      toast.error(error.message || t.ownerRemovalError);
    } finally {
      setRemovingOwner(false);
    }
  };

  const breadcrumbItems = [
    { label: t.home, href: "/dashboard" },
    { label: t.units, href: "/dashboard/units" },
    { label: unit?.apartmentNumber || t.unitDetail, active: true },
  ];

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-semantic-success-500" />;
      case 'maintenance': return <RotateCcw className="h-4 w-4 text-semantic-warning-500" />;
      case 'renovation': return <Settings className="h-4 w-4 text-primary-gold" />;
      case 'inactive': return <AlertCircle className="h-4 w-4 text-primary-red" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string): 'primary' | 'secondary' | 'gold' | 'red' => {
    switch (status) {
      case 'active': return 'primary';
      case 'maintenance': return 'gold';
      case 'renovation': return 'secondary';
      case 'inactive': return 'red';
      default: return 'secondary';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="lg:ml-72">
            <DashboardHeader title={t.title} breadcrumbItems={breadcrumbItems} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-6">
                  <div className="h-64 bg-gray-200 rounded"></div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !unit) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="lg:ml-72">
            <DashboardHeader title={t.error} breadcrumbItems={breadcrumbItems} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Card className="text-center">
                <div className="p-8">
                  <AlertCircle className="h-12 w-12 text-primary-red mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                    {t.unitNotFound}
                  </h2>
                  <p className="text-text-light-secondary dark:text-text-secondary mb-6">
                    {error || t.unitDetailError}
                  </p>
                  <Link href="/dashboard/units">
                    <Button variant="primary">{t.backToList}</Button>
                  </Link>
                </div>
              </Card>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="lg:ml-72">
          {/* Header */}
          <DashboardHeader
            title={unit?.apartmentNumber || t.title}
            breadcrumbItems={breadcrumbItems}
          />

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Link href="/dashboard/units">
                  <Button variant="ghost" icon={ArrowLeft}>
                    {t.back}
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                      {unit?.apartmentNumber || t.loading}
                    </h1>
                    {unit && (
                      <>
                        {getStatusIcon(unit.status)}
                        <Badge variant="soft" color={getStatusColor(unit.status)}>
                          {unit.basicInfo.data.status.options.find(opt => 
                            typeof opt === 'object' && opt.value === unit.status
                          )?.label || unit.status}
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                    {unit?.block} {t.block} • {unit?.floor}. {t.floor} • {unit?.area} m²
                  </p>
                </div>
              </div>

              {hasUpdatePropertyPermission && (
                <div className="flex gap-3">
                  <Button variant="secondary" icon={Phone}>
                    İletişim
                  </Button>
                  <Button variant="secondary" icon={MessageSquare}>
                    Note Ekle
                  </Button>
                </div>
              )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Unit Summary */}
                <Card className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-lg bg-primary-gold/10 flex items-center justify-center">
                        <Building className="h-12 w-12 text-primary-gold" />
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
                          {unit?.apartmentNumber}
                        </h2>
                        <Badge variant="soft" color="primary">
                          {getPropertyTypeLabel(unit?.type || '')}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-text-light-muted dark:text-text-muted">{t.block}</p>
                          <p className="font-medium text-text-on-light dark:text-text-on-dark">
                            {unit?.block}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-light-muted dark:text-text-muted">{t.floor}</p>
                          <p className="font-medium text-text-on-light dark:text-text-on-dark">
                            {unit?.floor}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-light-muted dark:text-text-muted">{t.area}</p>
                          <p className="font-medium text-text-on-light dark:text-text-on-dark">
                            {unit?.area} m²
                          </p>
                        </div>
                        <div>
                          <p className="text-text-light-muted dark:text-text-muted">{t.status}</p>
                          <Badge variant="soft" color={getStatusInfo(unit?.status || '').color}>
                            {getStatusInfo(unit?.status || '').label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Basic Info Section */}
                {unit?.basicInfo && (
                  <BasicInfoSection
                    basicInfo={unit.basicInfo}
                    onUpdate={handleUpdateBasicInfo}
                    loading={loading}
                    canEdit={unit.permissions.canEdit && hasUpdatePropertyPermission}
                  />
                )}

                {/* Tabbed Content Section */}
                <Card className="mt-6">
                  <div className="p-0">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 pt-6">
                      <nav className="flex space-x-4" aria-label="Tabs">
                        {[
                          { label: t.residents, key: "residents", icon: Users },
                          { label: t.financial, key: "financial", icon: DollarSign },
                          { label: t.consumption, key: "consumption", icon: Zap },
                          { label: t.maintenance, key: "maintenance", icon: Wrench },
                          { label: t.visitors, key: "visitors", icon: UserCheck },
                          { label: t.documents, key: "documents", icon: FileText }
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            className={
                              (activeTab === tab.key
                                ? "text-primary-gold border-primary-gold"
                                : "text-text-light-secondary dark:text-text-secondary border-transparent hover:text-primary-gold hover:border-primary-gold/60") +
                              " px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2"
                            }
                            onClick={() => setActiveTab(tab.key as any)}
                            type="button"
                          >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                          </button>
                        ))}
                      </nav>
                    </div>
                    <div className="px-6 py-6">
                      {activeTab === "residents" && unit && (
                        <ResidentsSection
                          residents={unit.residents}
                          loading={loading}
                          canEdit={unit.permissions.canManageResidents}
                        />
                      )}
                      {activeTab === "financial" && (
                        <div className="text-center py-8">
                          <DollarSign className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                          <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            {t.financialDetails}
                          </h3>
                          <p className="text-sm text-text-light-muted dark:text-text-muted">
                            {t.financialDetailsDesc}
                          </p>
                        </div>
                      )}
                      {activeTab === "consumption" && (
                        <div className="text-center py-8">
                          <Zap className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                          <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            {t.consumptionData}
                          </h3>
                          <p className="text-sm text-text-light-muted dark:text-text-muted">
                            {t.consumptionDataDesc}
                          </p>
                        </div>
                      )}
                      {activeTab === "maintenance" && (
                        <div className="text-center py-8">
                          <Wrench className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                          <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            {t.maintenanceHistory}
                          </h3>
                          <p className="text-sm text-text-light-muted dark:text-text-muted">
                            {t.maintenanceHistoryDesc}
                          </p>
                        </div>
                      )}
                      {activeTab === "visitors" && (
                        <div className="text-center py-8">
                          <UserCheck className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                          <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            {t.visitorHistory}
                          </h3>
                          <p className="text-sm text-text-light-muted dark:text-text-muted">
                            {t.visitorHistoryDesc}
                          </p>
                        </div>
                      )}
                      {activeTab === "documents" && (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                          <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            {t.documents}
                          </h3>
                          <p className="text-sm text-text-light-muted dark:text-text-muted">
                            {t.documentsDesc}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Owner Information */}
                {unit?.ownerInfo && (
                  <OwnerInfoSection
                    ownerInfo={unit.ownerInfo}
                    onUpdate={handleUpdateOwnerInfo}
                    onRemove={handleRemoveOwnerRequest}
                    onAddOwner={handleAddOwnerRequest}
                    onOpenAddOwnerModal={() => setShowAddOwnerModal(true)}
                    loading={loading || removingOwner}
                    canEdit={unit.permissions.canEdit && hasUpdatePropertyPermission}
                    canAssign={hasAssignPropertyPermission}
                    residentId={unit.ownerId}
                    propertyId={unitId}
                  />
                )}

                {/* Tenant Information */}
                <TenantInfoSection
                  tenantInfo={unit?.tenantInfo}
                  onUpdate={handleUpdateTenantInfo}
                  loading={loading || removingTenant}
                  canEdit={unit?.permissions.canEdit && hasUpdatePropertyPermission}
                  canAssign={hasAssignPropertyPermission}
                  onRemove={handleRemoveTenantRequest}
                  onAddTenant={handleAddTenantRequest}
                />

                {/* Financial Summary Sidebar */}
                {unit?.financialSummary && (
                  <Card>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary-gold" />
                        {t.financialStatus}
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4">
                          <p className="text-sm text-text-light-muted dark:text-text-muted">{t.totalDebt}</p>
                          {debtLoading ? (
                            <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          ) : (
                            <p className={`text-lg font-semibold ${(totalDebt ?? 0) > 0 ? 'text-primary-red' : 'text-text-on-light dark:text-text-on-dark'}`}>
                              {typeof totalDebt === 'number' ? `${totalDebt} ع.د` : '0 ع.د'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Notes */}
                {unit?.notes.data.generalNotes?.value && (
                  <Card>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary-gold" />
                        {t.notes}
                      </h3>
                      <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                        {unit.notes.data.generalNotes.value}
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add Tenant Modal */}
      <AddTenantModal
        isOpen={showAddTenantModal}
        onClose={() => setShowAddTenantModal(false)}
        onSuccess={() => {
          setShowAddTenantModal(false);
          refetch(); // This will refresh the tenant info card
        }}
        propertyId={unitId}
      />

      {/* Remove Tenant Confirmation Modal */}
      <Modal
        isOpen={showRemoveTenantModal}
        onClose={() => setShowRemoveTenantModal(false)}
        title={t.removeTenant}
        icon={UserX}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-primary-red" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                {t.removeTenantConfirm}
              </h3>
              <p className="mt-2 text-sm text-text-light-secondary dark:text-text-secondary">
                {t.removeTenantWarning}
              </p>
              {unit?.tenantInfo?.data?.tenantName?.value && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium text-text-on-light dark:text-text-on-dark">{t.tenant}: </span>
                    <span className="text-text-light-secondary dark:text-text-secondary">
                      {unit.tenantInfo.data.tenantName.value}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="ghost"
            onClick={() => setShowRemoveTenantModal(false)}
            disabled={removingTenant}
          >
            {t.cancel}
          </Button>
          <Button
            variant="danger"
            onClick={handleRemoveTenantConfirm}
            isLoading={removingTenant}
            disabled={removingTenant}
            icon={UserX}
          >
            {removingTenant ? t.removing : t.removeTenantAction}
          </Button>
        </div>
      </Modal>

      {/* Remove Owner Confirmation Modal */}
      <Modal
        isOpen={showRemoveOwnerModal}
        onClose={() => setShowRemoveOwnerModal(false)}
        title={t.removeOwner}
        icon={UserX}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-primary-red" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                {t.removeOwnerConfirm}
              </h3>
              <p className="mt-2 text-sm text-text-light-secondary dark:text-text-secondary">
                {t.removeOwnerWarning}
              </p>
              {unit?.ownerInfo?.data?.fullName?.value && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium text-text-on-light dark:text-text-on-dark">{t.owner}: </span>
                    <span className="text-text-light-secondary dark:text-text-secondary">
                      {unit.ownerInfo.data.fullName.value}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="ghost"
            onClick={() => setShowRemoveOwnerModal(false)}
            disabled={removingOwner}
          >
            {t.cancel}
          </Button>
          <Button
            variant="danger"
            onClick={handleRemoveOwnerConfirm}
            isLoading={removingOwner}
            disabled={removingOwner}
            icon={UserX}
          >
            {removingOwner ? t.removing : t.removeOwnerAction}
          </Button>
        </div>
      </Modal>

      {/* Add Owner Modal */}
      <AddOwnerModal
        isOpen={showAddOwnerModal}
        onClose={() => setShowAddOwnerModal(false)}
        onSuccess={() => {
          setShowAddOwnerModal(false);
          refetch();
        }}
        propertyId={unitId}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </ProtectedRoute>
  );
}

