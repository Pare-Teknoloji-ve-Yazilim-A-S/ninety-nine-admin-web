'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import SearchBar from '@/app/components/ui/SearchBar';
import StatsCard from '@/app/components/ui/StatsCard';
import ViewToggle from '@/app/components/ui/ViewToggle';
import DataTable from '@/app/components/ui/DataTable';
import FilterPanel from '@/app/components/ui/FilterPanel';
import ExportDropdown from '@/app/components/ui/ExportDropdown';
import { ToastContainer } from '@/app/components/ui/Toast';
import BulkMessageModal from '@/app/components/ui/BulkMessageModal';
import ConfirmationModal from '@/app/components/ui/ConfirmationModal';
import { useToast } from '@/hooks/useToast';
import { useResidentsData } from '@/hooks/useResidentsData';
import { useResidentsFilters } from '@/hooks/useResidentsFilters';
import { useResidentsActions } from '@/hooks/useResidentsActions';
import { useResidentsUI } from '@/hooks/useResidentsUI';
import { useResidentsStats } from '@/hooks/useResidentsStats';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { generateStatsCardsDataFromCounts } from './utils/stats';

// Sakin oluşturma izinleri için sabitler
const CREATE_RESIDENT_PERMISSION_ID = 'da1b5308-72ee-4b07-9a59-5a4bb99e0ce9';
const CREATE_RESIDENT_PERMISSION_NAME = 'Kullanıcı Oluştur';
const MANAGE_RESIDENTS_PERMISSION_ID = '27c9019e-5b8e-4dd7-a702-db47d3fc6bca';
const MANAGE_RESIDENTS_PERMISSION_NAME = 'Create User';
import {
    Filter, Download, Plus, RefreshCw,
    ChevronRight, Eye, Edit, Phone, MessageSquare, QrCode, StickyNote, History, CreditCard, Trash2, UserCheck, UserX, CheckCircle, Users, Home, DollarSign, Calendar
} from 'lucide-react';
import { Resident } from '@/app/components/ui/ResidentRow';

// Import view components
import GenericListView from '@/app/components/templates/GenericListView';
import GenericGridView from '@/app/components/templates/GenericGridView';
import Checkbox from '@/app/components/ui/Checkbox';
import TablePagination from '@/app/components/ui/TablePagination';
import Badge from '@/app/components/ui/Badge';
import EmptyState from '@/app/components/ui/EmptyState';
import Skeleton from '@/app/components/ui/Skeleton';
import BulkActionsBar from '@/app/components/ui/BulkActionsBar';
import PaymentHistoryModal from '@/app/components/ui/PaymentHistoryModal';
import { Bill } from '@/services/billing.service';

// Import our extracted utilities and configurations
import {
    VIEW_OPTIONS,
    BREADCRUMB_ITEMS,
    DEFAULT_VALUES
} from './constants';
import { createBulkActionHandlers } from './actions/bulk-actions';
import { createResidentActionHandlers } from './actions/resident-actions';
import { createExportActionHandlers } from './actions/export-actions';
import { getTableColumns } from './components/table-columns';
import Portal from '@/app/components/ui/Portal';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles and headers
    pageTitle: 'Sakin Listesi',
    filtered: 'filtrelenmiş',
    activeHeader: 'aktif',
    lastUpdate: 'Son güncelleme:',
    newResident: 'Yeni Sakin',
    refresh: 'Yenile',
    
    // Search and filters
    searchPlaceholder: 'Ad, soyad, pasaport, telefon, daire no ile ara...',
    filters: 'Filtreler',
    noResultsFound: 'araması için sonuç bulunamadı.',
    noResidentsYet: 'Henüz sakin kaydı bulunmuyor.',
    
    // Status labels
    statusLabel: 'Durum',
    activeStatus: 'Aktif',
    pendingStatus: 'Beklemede',
    inactiveStatus: 'Pasif',
    suspendedStatus: 'Askıya Alınmış',
    
    // Resident types
    residentType: 'Sakin Tipi',
    ownerType: 'Malik',
    tenantType: 'Kiracı',
    guest: 'Misafir',
    
    // Action buttons
    call: 'Ara',
    message: 'Mesaj',
    
    // Modal titles and messages
    deleteResident: 'Sakin Silme',
    bulkDelete: 'Toplu Silme İşlemi',
    bulkDeleteDescription: 'sakin kalıcı olarak silinecektir. Bu işlem geri alınamaz.',
    deleteAll: 'Hepsini Sil',
    resident: 'sakin',
    residents: 'sakinler',
    
         // Membership tiers
     standardTier: 'Standart',
     goldTier: 'Altın',
     silverTier: 'Gümüş',
     
     // Stats card titles
     totalResidents: 'Toplam Sakin',
     pendingApproval: 'Onay Bekleyen',
     goldMember: 'Gold Üye',
     
           // Table column headers
      photo: 'Fotoğraf',
      name: 'Ad Soyad',
      location: 'Konut',
      ownershipType: 'Mülkiyet Türü',
      contact: 'İletişim',
      membershipType: 'Üyelik Türü',
      verification: 'Doğrulama',
      status: 'Durum',
      nationalId: 'Kimlik',
      unspecified: 'Belirtilmemiş',
      block: 'Blok',
      apartment: 'Daire',
      unknown: 'Bilinmiyor',
      
      // Badge and status translations
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      underReview: 'İnceleniyor',
      active: 'Aktif',
      pending: 'Beklemede',
      inactive: 'Pasif',
      suspended: 'Askıya Alınmış',
      standard: 'Standart',
      gold: 'Altın',
      silver: 'Gümüş',
      owner: 'Malik',
      tenant: 'Kiracı'
   },
  en: {
    // Page titles and headers
    pageTitle: 'Residents List',
    filtered: 'filtered',
    activeHeader: 'active',
    lastUpdate: 'Last update:',
    newResident: 'New Resident',
    refresh: 'Refresh',
    
    // Search and filters
    searchPlaceholder: 'Search by name, surname, passport, phone, apartment number...',
    filters: 'Filters',
    noResultsFound: 'search found no results.',
    noResidentsYet: 'No residents found yet.',
    
    // Status labels
    statusLabel: 'Status',
    activeStatus: 'Active',
    pendingStatus: 'Pending',
    inactiveStatus: 'Inactive',
    suspendedStatus: 'Suspended',
    
    // Resident types
    residentType: 'Resident Type',
    ownerType: 'Owner',
    tenantType: 'Tenant',
    guest: 'Guest',
    
    // Action buttons
    call: 'Call',
    message: 'Message',
    
    // Modal titles and messages
    deleteResident: 'Delete Resident',
    bulkDelete: 'Bulk Delete Operation',
    bulkDeleteDescription: 'residents will be permanently deleted. This action cannot be undone.',
    deleteAll: 'Delete All',
    resident: 'resident',
    residents: 'residents',
    
         // Membership tiers
     standardTier: 'Standard',
     goldTier: 'Gold',
     silverTier: 'Silver',
     
     // Stats card titles
     totalResidents: 'Total Residents',
     pendingApproval: 'Pending Approval',
     goldMember: 'Gold Member',
     
           // Table column headers
      photo: 'Photo',
      name: 'Full Name',
      location: 'Residence',
      ownershipType: 'Ownership Type',
      contact: 'Contact',
      membershipType: 'Membership Type',
      verification: 'Verification',
      status: 'Status',
      nationalId: 'ID',
      unspecified: 'Not Specified',
      block: 'Block',
      apartment: 'Apartment',
      unknown: 'Unknown',
      
      // Badge and status translations
      approved: 'Approved',
      rejected: 'Rejected',
      underReview: 'Under Review',
      active: 'Active',
      pending: 'Pending',
      inactive: 'Inactive',
      suspended: 'Suspended',
      standard: 'Standard',
      gold: 'Gold',
      silver: 'Silver',
      owner: 'Owner',
      tenant: 'Tenant'
   },
  ar: {
    // Page titles and headers
    pageTitle: 'قائمة السكان',
    filtered: 'مفلتر',
    activeHeader: 'نشط',
    lastUpdate: 'آخر تحديث:',
    newResident: 'ساكن جديد',
    refresh: 'تحديث',
    
    // Search and filters
    searchPlaceholder: 'البحث بالاسم، اللقب، جواز السفر، الهاتف، رقم الشقة...',
    filters: 'المرشحات',
    noResultsFound: 'البحث لم يجد نتائج.',
    noResidentsYet: 'لم يتم العثور على سكان بعد.',
    
    // Status labels
    statusLabel: 'الحالة',
    activeStatus: 'نشط',
    pendingStatus: 'في الانتظار',
    inactiveStatus: 'غير نشط',
    suspendedStatus: 'معلق',
    
    // Resident types
    residentType: 'نوع الساكن',
    ownerType: 'مالك',
    tenantType: 'مستأجر',
    guest: 'ضيف',
    
    // Action buttons
    call: 'اتصال',
    message: 'رسالة',
    
    // Modal titles and messages
    deleteResident: 'حذف الساكن',
    bulkDelete: 'عملية الحذف المجمعة',
    bulkDeleteDescription: 'سيتم حذف السكان نهائياً. لا يمكن التراجع عن هذا الإجراء.',
    deleteAll: 'حذف الكل',
    resident: 'ساكن',
    residents: 'سكان',
    
         // Membership tiers
     standardTier: 'قياسي',
     goldTier: 'ذهبي',
     silverTier: 'فضي',
     
     // Stats card titles
     totalResidents: 'إجمالي السكان',
     pendingApproval: 'في انتظار الموافقة',
     goldMember: 'عضو ذهبي',
     
           // Table column headers
      photo: 'صورة',
      name: 'الاسم الكامل',
      location: 'السكن',
      ownershipType: 'نوع الملكية',
      contact: 'جهة الاتصال',
      membershipType: 'نوع العضوية',
      verification: 'التحقق',
      status: 'الحالة',
      nationalId: 'الهوية',
      unspecified: 'غير محدد',
      block: 'البلوك',
      apartment: 'الشقة',
      unknown: 'غير معروف',
      
      // Badge and status translations
      approved: 'تمت الموافقة',
      rejected: 'مرفوض',
      underReview: 'قيد المراجعة',
      active: 'نشط',
      pending: 'في الانتظار',
      inactive: 'غير نشط',
      suspended: 'معلق',
      standard: 'قياسي',
      gold: 'ذهبي',
      silver: 'فضي',
      owner: 'مالك',
      tenant: 'مستأجر'
   }
};



/**
 * Main Residents Page Component
 * 
 * This component follows SOLID principles:
 * - Single Responsibility: Only handles orchestration of the residents page
 * - Open/Closed: Extensible through configuration and dependency injection
 * - Dependency Inversion: Depends on abstractions (hooks, services) not concrete implementations
 */
export default function ResidentsPage() {
    const router = useRouter();
    const { toasts, removeToast } = useToast();
    
    // İzin kontrolleri
    const { hasPermission } = usePermissionCheck();
    const hasCreateResidentPermission = hasPermission(CREATE_RESIDENT_PERMISSION_ID) || hasPermission(CREATE_RESIDENT_PERMISSION_NAME);
    const hasManageResidentsPermission = hasPermission(MANAGE_RESIDENTS_PERMISSION_ID) || hasPermission(MANAGE_RESIDENTS_PERMISSION_NAME);
    
    // Kullanıcı bu iki izinden birine sahip olmalı
    const canCreateResident = hasCreateResidentPermission || hasManageResidentsPermission;
    
    // Debug logları
    console.log('Residents Page Debug:', {
        hasCreateResidentPermission,
        hasManageResidentsPermission,
        canCreateResident,
        CREATE_RESIDENT_PERMISSION_ID,
        CREATE_RESIDENT_PERMISSION_NAME,
        MANAGE_RESIDENTS_PERMISSION_ID,
        MANAGE_RESIDENTS_PERMISSION_NAME
    });

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

    // Add message modal state
    const [messageState, setMessageState] = useState<{
        isOpen: boolean;
        type: 'email' | 'sms' | null;
        recipients: Resident[];
    }>({
        isOpen: false,
        type: null,
        recipients: []
    });

    // Add confirmation modal state
    const [confirmationState, setConfirmationState] = useState<{
        isOpen: boolean;
        resident: Resident | null;
        loading: boolean;
    }>({
        isOpen: false,
        resident: null,
        loading: false
    });

    // Add bulk delete modal state
    const [bulkDeleteState, setBulkDeleteState] = useState<{
        isOpen: boolean;
        residents: Resident[];
        loading: boolean;
    }>({
        isOpen: false,
        residents: [],
        loading: false
    });

    // Ödeme geçmişi modalı için state
    const [paymentHistoryModal, setPaymentHistoryModal] = useState<{
        isOpen: boolean;
        resident: Resident | null;
        bills: Bill[];
        loading: boolean;
        error: string | null;
    }>({
        isOpen: false,
        resident: null,
        bills: [],
        loading: false,
        error: null,
    });

    // Initialize all hooks for data management
    const filtersHook = useResidentsFilters();
    const dataHook = useResidentsData({
        currentPage: filtersHook.currentPage,
        recordsPerPage: filtersHook.recordsPerPage,
        searchQuery: filtersHook.searchQuery,
        sortConfig: filtersHook.sortConfig,
        filters: filtersHook.filters // This will be handled by refs in the hook
    });
    const actionsHook = useResidentsActions({
        refreshData: dataHook.refreshData,
        setSelectedResidents: filtersHook.setSelectedResidents,
        setResidents: dataHook.setResidents
    });
    const uiHook = useResidentsUI({
        refreshData: dataHook.refreshData
    });

    // NEW: Use the new stats hook
    const stats = useResidentsStats();
    const statsData = generateStatsCardsDataFromCounts({
        ...stats,
        translations: {
            totalResidents: t.totalResidents,
            owner: t.owner,
            tenant: t.tenant,
            pendingApproval: t.pendingApproval,
            goldMember: t.goldMember
        }
    });

    // Create action handlers with dependency injection
    const toastFunctions = {
        success: useCallback((title: string, message: string) => {
            console.log(`✓ ${title}: ${message}`);
        }, []),
        info: useCallback((title: string, message: string) => {
            console.info(`${title}: ${message}`);
        }, []),
        error: useCallback((title: string, message: string) => {
            console.error(`✗ ${title}: ${message}`);
        }, [])
    };

    const dataUpdateFunctions = {
        setResidents: dataHook.setResidents,
        refreshData: dataHook.refreshData
    };

    // Initialize action handlers
    const bulkActionHandlers = createBulkActionHandlers(
        toastFunctions,
        messageState,
        setMessageState,
        dataUpdateFunctions,
        bulkDeleteState,
        setBulkDeleteState
    );
    const residentActionHandlers = createResidentActionHandlers(
        toastFunctions,
        dataUpdateFunctions,
        dataHook.residents
    );
    const exportActionHandlers = createExportActionHandlers(toastFunctions);

    // Generate configuration data - regenerate when selected residents change
    const bulkActions = useMemo(() => 
        bulkActionHandlers.getBulkActions(filtersHook.selectedResidents),
        [filtersHook.selectedResidents, bulkActionHandlers]
    );

    // Create wrapper for table actions - only need view action for detail navigation
    const tableActionHandlers = {
        handleViewResident: residentActionHandlers.handleViewResident,
    };

    const tableColumns = getTableColumns(tableActionHandlers, undefined, {
        photo: t.photo,
        name: t.name,
        location: t.location,
        ownershipType: t.ownershipType,
        contact: t.contact,
        membershipType: t.membershipType,
        verification: t.verification,
        status: t.status,
        nationalId: t.nationalId,
        unspecified: t.unspecified,
        block: t.block,
        apartment: t.apartment,
        unknown: t.unknown,
        approved: t.approved,
        rejected: t.rejected,
        underReview: t.underReview,
        active: t.active,
        pending: t.pending,
        inactive: t.inactive,
        suspended: t.suspended,
        standard: t.standardTier,
        gold: t.goldTier,
        silver: t.silverTier,
        owner: t.ownerType,
        tenant: t.tenantType
    });

    // Handle delete confirmation
    const handleDeleteConfirmation = useCallback(async () => {
        if (!confirmationState.resident) return;

        setConfirmationState(prev => ({ ...prev, loading: true }));

        try {
            await residentActionHandlers.handleDeleteResident(confirmationState.resident);
            setConfirmationState({ isOpen: false, resident: null, loading: false });
        } catch (error) {
            setConfirmationState(prev => ({ ...prev, loading: false }));
        }
    }, [confirmationState.resident, residentActionHandlers]);

    // Handle bulk delete confirmation
    const handleBulkDeleteConfirmation = useCallback(async () => {
        await bulkActionHandlers.executeBulkDelete();
    }, [bulkActionHandlers]);

    // Create unified action handler for view components
    const handleResidentAction = useCallback(async (action: string, resident: Resident) => {
        switch (action) {
            case 'view':
                residentActionHandlers.handleViewResident(resident);
                break;
            case 'edit':
                residentActionHandlers.handleEditResident(resident);
                break;
            case 'delete':
                // Open confirmation modal instead of direct deletion
                setConfirmationState({
                    isOpen: true,
                    resident: resident,
                    loading: false
                });
                break;
            case 'call':
                residentActionHandlers.handleCallResident(resident);
                break;
            case 'message':
                residentActionHandlers.handleMessageResident(resident);
                break;
            case 'more':
                // Handle more actions menu
                console.log('More actions for resident:', resident.fullName);
                break;
            case 'deactivate':
                residentActionHandlers.handleUpdateResidentStatus &&
                    residentActionHandlers.handleUpdateResidentStatus(resident, 'INACTIVE');
                break;
            case 'activate':
                residentActionHandlers.handleUpdateResidentStatus &&
                    residentActionHandlers.handleUpdateResidentStatus(resident, 'ACTIVE');
                break;
            case 'payment-history': {
                setPaymentHistoryModal({
                    isOpen: true,
                    resident,
                    bills: [],
                    loading: true,
                    error: null,
                });
                try {
                    const { bills, error } = await actionsHook.handleViewPaymentHistory(resident);
                    setPaymentHistoryModal(prev => ({
                        ...prev,
                        bills,
                        loading: false,
                        error: error || null,
                    }));
                } catch (err: any) {
                    setPaymentHistoryModal(prev => ({
                        ...prev,
                        loading: false,
                        error: err?.message || 'Ödeme geçmişi alınamadı.',
                    }));
                }
                break;
            }
            default:
                console.warn('Unknown action:', action);
        }
    }, [residentActionHandlers, actionsHook]);

    // Filter groups configuration - regenerate when language changes
    const filterGroups = useMemo(() => [
        {
            id: 'status',
            label: t.status,
            type: 'multiselect' as const,
            icon: CheckCircle,
            options: [
                { id: 'active', label: t.activeStatus, value: 'active' },
                { id: 'pending', label: t.pendingStatus, value: 'pending' },
                { id: 'inactive', label: t.inactiveStatus, value: 'inactive' },
                { id: 'suspended', label: t.suspendedStatus, value: 'suspended' },
            ],
        },
        {
            id: 'type',
            label: t.residentType,
            type: 'multiselect' as const,
            icon: Users,
            options: [
                { id: 'owner', label: t.owner, value: 'resident' },
                { id: 'tenant', label: t.tenant, value: 'tenant' },
                { id: 'guest', label: t.guest, value: 'guest' },
            ],
        },
    ], [t]);

    // Event handlers (orchestration only)
    const handleAddNewResident = useCallback(() => {
        router.push('/dashboard/residents/add');
    }, [router]);

    const handleRefresh = useCallback(() => {
        uiHook.handleRefresh();
    }, [uiHook]);

    // 1. Local search input state
    const [searchInput, setSearchInput] = useState(filtersHook.searchQuery || "");

    // 2. Input değişimini yöneten handler
    const handleSearchInputChange = useCallback((value: string) => {
        setSearchInput(value);
    }, []);

    // 3. Debounce sonrası API çağrısını tetikleyen handler
    const handleSearchSubmit = useCallback((value: string) => {
        filtersHook.handleSearch(value); // Sadece burada API çağrısı yapılmalı
    }, [filtersHook]);

    // Lifecycle effects
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && filtersHook.showFilterPanel) {
                filtersHook.handleCloseDrawer();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [filtersHook.showFilterPanel, filtersHook.handleCloseDrawer]);

    useEffect(() => {
        if (filtersHook.showFilterPanel) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [filtersHook.showFilterPanel]);

    // Resident card renderer for grid view
    const renderResidentCard = (resident: Resident, selectedItems: Array<string | number>, onSelect: (id: string | number) => void, ui: any, ActionMenu?: React.ComponentType<{ row: Resident }>) => {
        return (
            <ui.Card
                key={resident.id}
                className="p-6 rounded-2xl shadow-md bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.01] hover:shadow-lg group"
            >
                {/* Header: Checkbox + Name + Menu */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-4">
                        <ui.Checkbox
                            checked={selectedItems.includes(resident.id)}
                            onChange={() => onSelect(resident.id)}
                            className="focus:ring-2 focus:ring-primary-gold/30"
                        />
                        <div>
                            <h3 className="text-xl font-semibold text-on-dark tracking-tight">
                                {resident.firstName} {resident.lastName}
                            </h3>
                            <p className="text-sm text-text-light-secondary dark:text-text-secondary font-medium mt-1">
                                {resident.address?.apartment}
                            </p>
                            {/* Membership Tier Badge */}
                            {(() => {
                                const membershipTier = resident.membershipTier || t.standard;
                                if (membershipTier === t.gold || membershipTier === 'Altın') {
                                    return (
                                        <ui.Badge
                                            variant="soft"
                                            color="gold"
                                            className="min-w-[88px] text-center justify-center text-xs px-3 py-1 rounded-full font-medium mt-2"
                                        >
                                            {membershipTier}
                                        </ui.Badge>
                                    );
                                } else if (membershipTier === t.silver || membershipTier === 'Gümüş') {
                                    return (
                                        <ui.Badge
                                            variant="soft"
                                            color="secondary"
                                            className="min-w-[88px] text-center justify-center text-xs px-3 py-1 rounded-full font-medium mt-2"
                                        >
                                            {membershipTier}
                                        </ui.Badge>
                                    );
                                } else {
                                    return (
                                        <ui.Badge className="min-w-[88px] text-center justify-center text-xs px-3 py-1 rounded-full font-medium mt-2">
                                            {membershipTier}
                                        </ui.Badge>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                    {ActionMenu && <ActionMenu row={resident} />}
                </div>
                
                {/* Status and Type Badges */}
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                    <ui.Badge variant="soft" color={getStatusColor(resident.status)} className="text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <span
                            className="w-2 h-2 rounded-full inline-block border border-gray-300 dark:border-gray-700 mr-1"
                            style={{
                                backgroundColor:
                                    getStatusColor(resident.status) === 'primary' ? '#22C55E' :
                                    getStatusColor(resident.status) === 'gold' ? '#AC8D6A' :
                                    getStatusColor(resident.status) === 'red' ? '#E53E3E' :
                                    getStatusColor(resident.status) === 'accent' ? '#718096' :
                                    '#A8A29E',
                            }}
                            title={resident.status?.label}
                        />
                        {resident.status?.label}
                    </ui.Badge>
                    
                    {resident.verificationStatus && (
                        <ui.Badge
                            variant="outline"
                            color={
                                resident.verificationStatus.color === 'green' ? 'primary' :
                                resident.verificationStatus.color === 'yellow' ? 'gold' :
                                resident.verificationStatus.color === 'red' ? 'red' :
                                'secondary'
                            }
                            className="text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1"
                        >
                            {resident.verificationStatus.label}
                        </ui.Badge>
                    )}
                    
                    <ui.Badge
                        variant="soft"
                        className={
                            `text-xs px-3 py-1 rounded-full font-medium text-black ` +
                            (resident.residentType?.label === "Malik"
                                ? "bg-green-100"
                                : resident.residentType?.label === "Kiracı"
                                ? "bg-blue-100"
                                : "")
                        }
                    >
                        {resident.residentType?.label}
                    </ui.Badge>
                </div>
                
                {/* Contact Information */}
                <div className="mt-4 flex flex-col gap-1 text-sm text-text-light-secondary dark:text-text-secondary">
                    {resident.contact?.phone && (
                        <div className="flex items-center gap-2">
                            <span>{resident.contact.phone}</span>
                        </div>
                    )}
                    {resident.contact?.email && (
                        <div className="flex items-center gap-2">
                            <span>{resident.contact.email}</span>
                        </div>
                    )}
                </div>
                
                {/* Action Buttons */}
                {/* <div className="mt-6 flex gap-3">
                    {resident.contact?.phone && (
                        <ui.Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleResidentAction('call', resident)}
                            className="rounded-lg font-medium shadow-sm hover:bg-primary-gold/10 dark:hover:bg-primary-gold/20 focus:ring-2 focus:ring-primary-gold/30"
                        >
                            Ara
                        </ui.Button>
                    )}
                    <ui.Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleResidentAction('message', resident)}
                        className="rounded-lg font-medium shadow-sm hover:bg-primary-gold/10 dark:hover:bg-primary-gold/20 focus:ring-2 focus:ring-primary-gold/30"
                    >
                        Mesaj
                    </ui.Button>
                </div> */}
            </ui.Card>
        );
    };
    const getStatusColor = (status: any) => {
        switch (status?.color) {
            case 'green': return 'primary';
            case 'yellow': return 'gold';
            case 'red': return 'red';
            case 'blue': return 'accent';
            default: return 'secondary';
        }
    };
    const getTypeColor = (type: any) => {
        switch (type?.color) {
            case 'blue': return 'primary';
            case 'green': return 'accent';
            case 'purple': return 'accent';
            default: return 'secondary';
        }
    };

    // Resident Action Menu Component - Simplified to only show detail view
    const ResidentActionMenu: React.FC<{ resident: Resident; onAction: (action: string, resident: Resident) => void }> = ({ resident, onAction }) => {
        const handleDetailView = (e: React.MouseEvent) => {
            e.stopPropagation();
            onAction('view', resident);
        };

        return (
            <div className="flex items-center justify-center">
                <button
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                    onClick={handleDetailView}
                    type="button"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    };

    // Wrapper: ActionMenuComponent tipi { row: Resident }
    const ResidentActionMenuWrapper: React.FC<{ row: Resident }> = ({ row }) => (
        <ResidentActionMenu resident={row} onAction={handleResidentAction} />
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                {/* Sidebar */}
                <Sidebar
                    isOpen={uiHook.sidebarOpen}
                    onClose={() => uiHook.setSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div className="lg:ml-72">
                    {/* Header */}
                    <DashboardHeader
                        title={t.pageTitle}
                        breadcrumbItems={BREADCRUMB_ITEMS}
                    />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                                    {t.residents} <span className="text-primary-gold">
                                        ({dataHook.totalRecords.toLocaleString()} {filtersHook.searchQuery ? t.filtered : t.active})
                                    </span>
                                </h2>
                                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                    {t.lastUpdate} {dataHook.lastUpdated.toLocaleTimeString('tr-TR')}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="ghost" size="md" icon={RefreshCw} onClick={handleRefresh}>
                                    {t.refresh}
                                </Button>
                                <ExportDropdown
                                    onExportCSV={() => exportActionHandlers.handleExportCSV({
                                        ...filtersHook.filters,
                                        search: filtersHook.searchQuery,
                                        orderColumn: !filtersHook.searchQuery ? 'firstName' : filtersHook.sortConfig.key,
                                        orderBy: filtersHook.sortConfig.direction ? filtersHook.sortConfig.direction.toUpperCase() as 'ASC' | 'DESC' : undefined,
                                        // page ve limit gönderme
                                    })}
                                    variant="secondary"
                                    size="md"
                                />
                                {canCreateResident && (
                                    <Button 
                                        variant="primary" 
                                        size="md" 
                                        icon={Plus} 
                                        onClick={handleAddNewResident}
                                        data-testid="add-resident-button"
                                    >
                                        {t.newResident}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                            {statsData.map((stat) => (
                                <StatsCard
                                    key={stat.title}
                                    title={stat.title}
                                    value={stat.value}
                                    subtitle={stat.subtitle}
                                    color={stat.color}
                                    icon={stat.icon}
                                    size="md"
                                    loading={stats.loading}
                                />
                            ))}
                        </div>

                        {/* Search and Filters */}
                        <Card className="mb-6">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search Bar */}
                                    <div className="flex-1">
                                        <SearchBar
                                            placeholder={t.searchPlaceholder}
                                            value={searchInput}
                                            onChange={handleSearchInputChange}
                                            onSearch={handleSearchSubmit}
                                            showAdvancedFilter={true}
                                            onAdvancedFilterClick={filtersHook.handleOpenDrawer}
                                            debounceMs={500}
                                        />
                                    </div>

                                    {/* Filter and View Toggle */}
                                    <div className="flex gap-2 items-center">
                                        <div className="relative">
                                            <Button
                                                variant="secondary"
                                                size="md"
                                                icon={Filter}
                                                onClick={filtersHook.handleOpenDrawer}
                                            >
                                                {t.filters}
                                            </Button>
                                            {Object.keys(filtersHook.filters).length > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-primary-gold text-primary-dark-gray text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                                    {Object.keys(filtersHook.filters).length}
                                                </span>
                                            )}
                                        </div>
                                        <ViewToggle
                                            options={VIEW_OPTIONS}
                                            activeView={filtersHook.selectedView}
                                            onViewChange={filtersHook.handleViewChange}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Error Message */}
                        {dataHook.apiError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm">{dataHook.apiError}</p>
                            </div>
                        )}

                        {/* Residents Views */}
                        {filtersHook.selectedView === 'table' && (
                            <GenericListView
                                data={dataHook.residents}
                                loading={dataHook.loading}
                                error={dataHook.apiError}
                                                                 columns={getTableColumns(tableActionHandlers, ResidentActionMenuWrapper, {
                                     photo: t.photo,
                                     name: t.name,
                                     location: t.location,
                                     ownershipType: t.ownershipType,
                                     contact: t.contact,
                                     membershipType: t.membershipType,
                                     verification: t.verification,
                                     status: t.status,
                                     nationalId: t.nationalId,
                                     unspecified: t.unspecified,
                                     block: t.block,
                                     apartment: t.apartment,
                                     unknown: t.unknown,
                                     // Badge and status translations
                                     approved: t.approved,
                                     rejected: t.rejected,
                                     underReview: t.underReview,
                                     active: t.active,
                                     pending: t.pending,
                                     inactive: t.inactive,
                                     suspended: t.suspended,
                                     standard: t.standard,
                                     gold: t.gold,
                                     silver: t.silver,
                                     owner: t.owner,
                                     tenant: t.tenant
                                 })}
                                sortConfig={filtersHook.sortConfig}
                                onSortChange={filtersHook.handleSort}
                                pagination={{
                                    currentPage: filtersHook.currentPage,
                                    totalPages: dataHook.totalPages,
                                    totalRecords: dataHook.totalRecords,
                                    recordsPerPage: filtersHook.recordsPerPage,
                                    onPageChange: (page) => {
                                        filtersHook.handlePageChange(page);
                                    },
                                    onRecordsPerPageChange: filtersHook.handleRecordsPerPageChange,
                                    preventScroll: true, // Prevent auto-scroll to top
                                }}
                                emptyStateMessage={
                                    filtersHook.searchQuery ?
                                        `"${filtersHook.searchQuery}" ${t.noResultsFound}` :
                                        t.noResidentsYet
                                }
                                ActionMenuComponent={ResidentActionMenuWrapper}
                            />
                        )}

                        {filtersHook.selectedView === 'grid' && (
                            <GenericGridView
                                data={dataHook.residents}
                                loading={dataHook.loading}
                                error={dataHook.apiError}
                                onSelectionChange={(selectedIds) => {
                                    const selectedResidents = dataHook.residents.filter(r => selectedIds.includes(r.id));
                                    filtersHook.handleSelectionChange(selectedResidents);
                                }}
                                bulkActions={bulkActions}
                                onAction={handleResidentAction}
                                selectedItems={filtersHook.selectedResidents.map(r => r.id)}
                                pagination={{
                                    currentPage: filtersHook.currentPage,
                                    totalPages: dataHook.totalPages,
                                    totalRecords: dataHook.totalRecords,
                                    recordsPerPage: filtersHook.recordsPerPage,
                                    onPageChange: (page) => {
                                        filtersHook.handlePageChange(page);
                                    },
                                    onRecordsPerPageChange: filtersHook.handleRecordsPerPageChange,
                                    preventScroll: true, // Prevent auto-scroll to top
                                }}
                                emptyStateMessage={
                                    filtersHook.searchQuery ?
                                        `"${filtersHook.searchQuery}" ${t.noResultsFound}` :
                                        t.noResidentsYet
                                }
                                ui={{
                                    Card,
                                    Button,
                                    Checkbox,
                                    TablePagination,
                                    Badge,
                                    EmptyState,
                                    Skeleton,
                                    BulkActionsBar,
                                }}
                                ActionMenu={ResidentActionMenuWrapper}
                                renderCard={renderResidentCard}
                                getItemId={(resident) => resident.id}
                            />
                        )}
                    </main>
                </div>

                {/* Filter Panel Drawer */}
                <div className={`fixed inset-0 z-50 ${filtersHook.showFilterPanel ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${filtersHook.showFilterPanel && !filtersHook.drawerClosing ? 'opacity-50' : 'opacity-0'
                            }`}
                        onClick={filtersHook.handleCloseDrawer}
                    />

                    {/* Drawer */}
                    <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-background-light-card dark:bg-background-card shadow-2xl transform transition-transform duration-300 ease-in-out ${filtersHook.showFilterPanel && !filtersHook.drawerClosing ? 'translate-x-0' : 'translate-x-full'
                        }`}>
                        <FilterPanel
                            filterGroups={filterGroups}
                            onApplyFilters={filtersHook.handleFiltersApply}
                            onResetFilters={filtersHook.handleFiltersReset}
                            onClose={filtersHook.handleCloseDrawer}
                            variant="sidebar"
                        />
                    </div>
                </div>

                {/* Bulk Message Modal */}
                <BulkMessageModal
                    isOpen={messageState.isOpen}
                    onClose={() => setMessageState(prev => ({ ...prev, isOpen: false }))}
                    onSend={bulkActionHandlers.handleSendMessage}
                    type={messageState.type || 'email'}
                    recipientCount={messageState.recipients.length}
                />

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={confirmationState.isOpen}
                    onClose={() => setConfirmationState({ isOpen: false, resident: null, loading: false })}
                    onConfirm={handleDeleteConfirmation}
                    title={t.deleteResident}
                    variant="danger"
                    loading={confirmationState.loading}
                    itemName={confirmationState.resident?.fullName}
                    itemType={t.resident}
                />

                {/* Bulk Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={bulkDeleteState.isOpen}
                    onClose={() => setBulkDeleteState({ isOpen: false, residents: [], loading: false })}
                    onConfirm={handleBulkDeleteConfirmation}
                    title={t.bulkDelete}
                    description={`${bulkDeleteState.residents.length} ${t.bulkDeleteDescription}`}
                    confirmText={t.deleteAll}
                    variant="danger"
                    loading={bulkDeleteState.loading}
                    itemType={t.residents}
                />

                {/* Payment History Modal */}
                <PaymentHistoryModal
                    isOpen={paymentHistoryModal.isOpen}
                    onClose={() => setPaymentHistoryModal(prev => ({ ...prev, isOpen: false }))}
                    bills={paymentHistoryModal.bills}
                    residentName={paymentHistoryModal.resident?.fullName || ''}
                    loading={paymentHistoryModal.loading}
                    error={paymentHistoryModal.error}
                />

                {/* Toast Container */}
                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </div>
        </ProtectedRoute>
    );
}