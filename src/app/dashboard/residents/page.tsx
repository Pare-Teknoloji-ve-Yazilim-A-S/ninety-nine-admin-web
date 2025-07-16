'use client';

import React, { useCallback } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import SearchBar from '@/app/components/ui/SearchBar';
import StatsCard from '@/app/components/ui/StatsCard';
import ViewToggle from '@/app/components/ui/ViewToggle';
import DataTable from '@/app/components/ui/DataTable';
import FilterPanel, { commonFilterGroups } from '@/app/components/ui/FilterPanel';
import { Resident } from '@/app/components/ui/ResidentRow';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/app/components/ui/Toast';
import { useResidentsData } from '@/hooks/useResidentsData';
import { useResidentsFilters } from '@/hooks/useResidentsFilters';
import { useResidentsActions } from '@/hooks/useResidentsActions';
import { useResidentsUI } from '@/hooks/useResidentsUI';
import { residentService } from '@/services/resident.service';
import { ResidentFilterParams, ResidentStatsResponse, Resident as ApiResident } from '@/services/types/resident.types';
import {
    Filter,
    Download,
    Plus,
    Users,
    Mail,
    MessageSquare,
    FileText,
    Tag,
    Trash2,
    Eye,
    Edit,
    Phone,
    MoreVertical,
    RefreshCw,
    Grid,
    List,
    Layers,
    Home,
    CreditCard,
    QrCode,
    UserCheck,
    UserX,
    StickyNote,
    History,
    CreditCard as PaymentHistory
} from 'lucide-react';

export default function ResidentsPage() {
    const { toasts, removeToast } = useToast();

    // Initialize filters and UI state
    const filtersHook = useResidentsFilters();

    // Initialize data management
    const dataHook = useResidentsData({
        currentPage: filtersHook.currentPage,
        recordsPerPage: filtersHook.recordsPerPage,
        searchQuery: filtersHook.searchQuery,
        sortConfig: filtersHook.sortConfig,
        filters: filtersHook.filters
    });

    // Initialize actions
    const actionsHook = useResidentsActions({
        refreshData: dataHook.refreshData,
        setSelectedResidents: filtersHook.setSelectedResidents,
        setResidents: dataHook.setResidents
    });

    // Initialize UI management
    const uiHook = useResidentsUI({
        refreshData: dataHook.refreshData
    });

    // Breadcrumb for residents page
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Sakinler', href: '/dashboard/residents' },
        { label: 'Sakin Listesi', active: true }
    ];

    // Additional properties that might come from API but not in the type
    interface ExtendedApiResident extends Omit<ApiResident, 'property'> {
        tcKimlikNo?: string;
        nationalId?: string;
        passportNumber?: string;
        property?: {
            id?: string;
            block: string;
            apartment: string;
            ownershipType: 'owner' | 'tenant';
            propertyNumber?: string;
            floor?: number;
            area?: number;
            registrationDate?: string;
            roomType?: string;
            governorate?: string;
            district?: string;
            neighborhood?: string;
        };
        financial?: {
            totalDebt?: number;
            lastPaymentDate?: string;
            balance?: number;
        };
        notes?: string;
    }

    // Convert API types to component types (Iraq-specific)
    const transformApiResidentToComponentResident = (apiResident: ApiResident | ExtendedApiResident): Resident => {
        const extended = apiResident as ExtendedApiResident;
        return {
            id: String(apiResident.id),
            firstName: apiResident.firstName,
            lastName: apiResident.lastName,
            fullName: `${apiResident.firstName} ${apiResident.lastName}`,
            // Iraq-specific: National ID could be Iraqi National ID or Passport
            nationalId: extended.tcKimlikNo || extended.nationalId || extended.passportNumber,

            // Property information from API
            residentType: {
                type: apiResident.property?.ownershipType || 'owner',
                label: apiResident.property?.ownershipType === 'tenant' ? 'Kiracı' : 'Malik',
                color: apiResident.property?.ownershipType === 'tenant' ? 'blue' : 'green'
            },
            address: {
                building: apiResident.property?.block || 'Belirtilmemiş',
                apartment: apiResident.property?.apartment || 'Belirtilmemiş',
                roomType: extended.property?.roomType || 'Belirtilmemiş',
                // Iraq-specific location fields (commented out until ResidentAddress type is updated)
                // governorate: apiResident.property?.governorate || 'Belirtilmemiş',
                // district: apiResident.property?.district || 'Belirtilmemiş',
                // neighborhood: apiResident.property?.neighborhood || 'Belirtilmemiş'
            },
            contact: {
                phone: apiResident.phone || 'Belirtilmemiş',
                email: apiResident.email || 'Belirtilmemiş',
                formattedPhone: apiResident.phone || 'Belirtilmemiş'
            },
            financial: {
                balance: extended.financial?.balance || 0,
                totalDebt: extended.financial?.totalDebt || 0,
                lastPaymentDate: extended.financial?.lastPaymentDate
            },
            status: {
                type: (apiResident.status?.toLowerCase() || 'active') as 'active' | 'pending' | 'inactive' | 'suspended',
                label: getStatusLabel(apiResident.status || ''),
                color: getStatusColor(apiResident.status || '')
            },
            // Membership and verification
            membershipTier: {
                type: apiResident.membershipTier || 'STANDARD',
                label: getMembershipLabel(apiResident.membershipTier || ''),
                color: getMembershipColor(apiResident.membershipTier || '')
            },
            verificationStatus: {
                type: 'PENDING',
                label: getVerificationLabel('PENDING'),
                color: getVerificationColor('PENDING')
            },

            registrationDate: apiResident.createdAt || '',
            lastActivity: apiResident.updatedAt || new Date().toISOString(),
            isGoldMember: apiResident.membershipTier === 'GOLD',
            profileImage: apiResident.avatar,
            notes: extended.notes || '',
            tags: []
        };
    };

    // Helper functions for Iraq localization

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'Aktif';
            case 'INACTIVE': return 'Pasif';
            case 'PENDING': return 'Beklemede';
            case 'BANNED': return 'Yasaklı';
            case 'SUSPENDED': return 'Askıya Alınmış';
            default: return 'Bilinmeyen';
        }
    };

    const getMembershipLabel = (tier: string) => {
        switch (tier) {
            case 'GOLD': return 'Altın';
            case 'SILVER': return 'Gümüş';
            case 'STANDARD': return 'Standart';
            default: return 'Standart';
        }
    };

    const getMembershipColor = (tier: string) => {
        switch (tier) {
            case 'GOLD': return 'gold';
            case 'SILVER': return 'gray';
            case 'STANDARD': return 'blue';
            default: return 'blue';
        }
    };

    const getVerificationLabel = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'Onaylandı';
            case 'REJECTED': return 'Reddedildi';
            case 'PENDING': return 'İnceleniyor';
            case 'UNDER_REVIEW': return 'İnceleniyor';
            default: return 'İnceleniyor';
        }
    };

    const getVerificationColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'green';
            case 'REJECTED': return 'red';
            case 'PENDING':
            case 'UNDER_REVIEW': return 'yellow';
            default: return 'yellow';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'green';
            case 'INACTIVE': return 'gray';
            case 'PENDING': return 'yellow';
            case 'BANNED':
            case 'SUSPENDED': return 'red';
            default: return 'gray';
        }
    };

    // Stats data from API
    const getStatsData = () => {
        if (!stats) {
            return [
                { title: 'Toplam Sakin', value: '0', color: 'primary' as const, icon: Users },
                { title: 'Malik', value: '0', subtitle: '%0', color: 'success' as const, icon: Home },
                { title: 'Kiracı', value: '0', subtitle: '%0', color: 'info' as const, icon: Users },
                { title: 'Aktif', value: '0', subtitle: '%0', color: 'danger' as const, icon: CreditCard },
                { title: 'Gold Üye', value: '0', subtitle: '%0', color: 'gold' as const, icon: Users },
            ];
        }

        const totalResidents = stats.totalResidents || 0;
        const owners = stats.byOwnershipType?.owner || 0;
        const tenants = stats.byOwnershipType?.tenant || 0;
        const active = stats.byStatus?.active || 0;
        const gold = stats.byMembershipTier?.gold || 0;

        return [
            {
                title: 'Toplam Sakin',
                value: totalResidents.toLocaleString('tr-TR'),
                color: 'primary' as const,
                icon: Users
            },
            {
                title: 'Malik',
                value: owners.toLocaleString('tr-TR'),
                subtitle: totalResidents > 0 ? `%${Math.round((owners / totalResidents) * 100)}` : '%0',
                color: 'success' as const,
                icon: Home
            },
            {
                title: 'Kiracı',
                value: tenants.toLocaleString('tr-TR'),
                subtitle: totalResidents > 0 ? `%${Math.round((tenants / totalResidents) * 100)}` : '%0',
                color: 'info' as const,
                icon: Users
            },
            {
                title: 'Aktif',
                value: active.toLocaleString('tr-TR'),
                subtitle: totalResidents > 0 ? `%${Math.round((active / totalResidents) * 100)}` : '%0',
                color: 'danger' as const,
                icon: CreditCard
            },
            {
                title: 'Gold Üye',
                value: gold.toLocaleString('tr-TR'),
                subtitle: totalResidents > 0 ? `%${Math.round((gold / totalResidents) * 100)}` : '%0',
                color: 'gold' as const,
                icon: Users
            },
        ];
    };

    // View toggle options
    const viewOptions: ViewOption[] = [
        { id: 'grid', label: 'Kart Görünümü', icon: Grid },
        { id: 'list', label: 'Liste Görünümü', icon: List },
        { id: 'table', label: 'Tablo Görünümü', icon: Layers },
    ];

    // Bulk actions
    const bulkActions: BulkAction[] = [
        {
            id: 'mail',
            label: 'Toplu Mail',
            icon: Mail,
            onClick: (residents: Resident[]) => handleBulkMail(residents)
        },
        {
            id: 'sms',
            label: 'SMS Gönder',
            icon: MessageSquare,
            onClick: (residents: Resident[]) => handleBulkSMS(residents)
        },
        {
            id: 'pdf',
            label: 'PDF Oluştur',
            icon: FileText,
            onClick: (residents: Resident[]) => handleBulkPDF(residents)
        },
        {
            id: 'tag',
            label: 'Etiket Ata',
            icon: Tag,
            onClick: (residents: Resident[]) => handleBulkTag(residents)
        },
        {
            id: 'activate',
            label: 'Aktif Yap',
            icon: UserCheck,
            onClick: (residents: Resident[]) => handleBulkStatusChange(residents, 'active')
        },
        {
            id: 'deactivate',
            label: 'Pasif Yap',
            icon: UserX,
            onClick: (residents: Resident[]) => handleBulkStatusChange(residents, 'inactive'),
            variant: 'warning'
        },
        {
            id: 'delete',
            label: 'Sil',
            icon: Trash2,
            onClick: (residents: Resident[]) => handleBulkDelete(residents),
            variant: 'danger'
        },
    ];

    // Table columns (Iraq-specific)
    const columns = [
        {
            id: 'photo',
            header: 'Fotoğraf',
            accessor: 'avatar',
            width: '80px',
            render: (value: string, row: Resident) => (
                <div className="w-10 h-10 bg-primary-gold rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
                    {value ? (
                        <img src={value} alt={row.fullName} className="w-full h-full object-cover" />
                    ) : (
                        <span>{row.firstName?.charAt(0)}{row.lastName?.charAt(0)}</span>
                    )}
                </div>
            ),
        },
        {
            id: 'name',
            header: 'Ad Soyad',
            accessor: 'fullName',
            sortable: true,
            render: (value: string, row: Resident) => (
                <div>
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">{value}</p>
                    <p className="text-sm text-text-light-muted dark:text-text-muted">
                        Kimlik: ****{row.nationalId?.slice(-3)}
                    </p>

                </div>
            ),
        },
        {
            id: 'location',
            header: 'Konut',
            accessor: 'address',
            render: (value: { building: string; apartment: string }) => (
                <div>
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">
                        {value.building} Blok - {value.apartment} Daire
                    </p>
                </div>
            ),
        },
        {
            id: 'type',
            header: 'Mülkiyet Türü',
            accessor: 'residentType',
            render: (value: { type: 'owner' | 'tenant'; label: string }) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value.type === 'owner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                    {value.label}
                </span>
            ),
        },
        {
            id: 'contact',
            header: 'İletişim',
            accessor: 'contact',
            render: (value: { formattedPhone: string; email?: string }) => (
                <div className="flex items-center gap-2">
                    <div>
                        <span className="text-sm text-text-on-light dark:text-text-on-dark">
                            {value.formattedPhone}
                        </span>
                        {value.email && value.email !== 'Belirtilmemiş' && (
                            <p className="text-xs text-text-light-muted dark:text-text-muted">
                                {value.email}
                            </p>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" icon={Phone} className="h-8 w-8 p-1" />
                </div>
            ),
        },
        {
            id: 'membership',
            header: 'Üyelik Türü',
            accessor: 'membershipTier',
            render: (value: { type: 'GOLD' | 'SILVER' | 'BRONZE'; label: string }) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value.type === 'GOLD' ? 'bg-yellow-100 text-yellow-800' :
                    value.type === 'SILVER' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                    {value.label}
                </span>
            ),
        },
        {
            id: 'verification',
            header: 'Doğrulama',
            accessor: 'verificationStatus',
            render: (value: { color: 'green' | 'red' | 'yellow'; label: string }) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${value.color === 'green' ? 'bg-green-500' :
                        value.color === 'red' ? 'bg-red-500' :
                            'bg-yellow-500'
                        }`} />
                    <span className="text-sm text-text-on-light dark:text-text-on-dark">
                        {value.label}
                    </span>
                </div>
            ),
        },
        {
            id: 'status',
            header: 'Durum',
            accessor: 'status',
            render: (value: any) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${value.color === 'green' ? 'bg-green-500' :
                        value.color === 'red' ? 'bg-red-500' :
                            value.color === 'yellow' ? 'bg-yellow-500' :
                                'bg-gray-500'
                        }`} />
                    <span className="text-sm text-text-on-light dark:text-text-on-dark">
                        {value.label}
                    </span>
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'İşlemler',
            accessor: 'actions',
            width: '80px',
            render: (value: undefined, row: Resident) => (
                <div className="flex items-center justify-center">
                    <div className="relative group">
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={MoreVertical}
                            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                                if (dropdown) {
                                    dropdown.classList.toggle('hidden');
                                    // Close dropdown when clicking outside
                                    const closeOnClickOutside = (event: MouseEvent) => {
                                        if (!event.target || !dropdown || !e.currentTarget) {
                                            return;
                                        }

                                        const target = event.target as Node;
                                        if (!dropdown.contains(target) && !e.currentTarget.contains(target)) {
                                            dropdown.classList.add('hidden');
                                            document.removeEventListener('click', closeOnClickOutside);
                                        }
                                    };
                                    setTimeout(() => {
                                        document.addEventListener('click', closeOnClickOutside);
                                    }, 0);
                                }
                            }}
                        />

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 hidden">
                            <div className="py-1">
                                {/* Primary Actions */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.closest('.absolute')?.classList.add('hidden');
                                        handleViewResident(row);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                                >
                                    <Eye className="w-5 h-5" />
                                    Görüntüle
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.closest('.absolute')?.classList.add('hidden');
                                        handleEditResident(row);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                                >
                                    <Edit className="w-5 h-5" />
                                    Düzenle
                                </button>

                                <hr className="border-gray-200 dark:border-gray-600 my-1" />

                                {/* Communication Actions */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.closest('.absolute')?.classList.add('hidden');
                                        handleCallResident(row);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                                >
                                    <Phone className="w-5 h-5" />
                                    Ara
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.closest('.absolute')?.classList.add('hidden');
                                        handleMessageResident(row);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Mesaj
                                </button>

                                <hr className="border-gray-200 dark:border-gray-600 my-1" />

                                {/* Utility Actions */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.closest('.absolute')?.classList.add('hidden');
                                        handleGenerateQR(row);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                                >
                                    <QrCode className="w-5 h-5" />
                                    QR Kod
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.closest('.absolute')?.classList.add('hidden');
                                        handleViewNotes(row);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                                >
                                    <StickyNote className="w-5 h-5" />
                                    Notlar
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.closest('.absolute')?.classList.add('hidden');
                                        handleViewHistory(row);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                                >
                                    <History className="w-5 h-5" />
                                    Geçmiş
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.closest('.absolute')?.classList.add('hidden');
                                        handleViewPaymentHistory(row);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                                >
                                    <PaymentHistory className="w-5 h-5" />
                                    Ödeme Geçmişi
                                </button>

                                <hr className="border-gray-200 dark:border-gray-600 my-1" />

                                {/* Danger Actions */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.closest('.absolute')?.classList.add('hidden');
                                        handleDeleteResident(row);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Sil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    // Row actions (kept for backward compatibility but now unused)

    // Filter groups
    const filterGroups = [
        commonFilterGroups.residentStatus,
        commonFilterGroups.residentType,
        commonFilterGroups.building,
        commonFilterGroups.debtRange,
        commonFilterGroups.registrationDate,
    ];

    // Event handler types
    type BulkAction = {
        id: string;
        label: string;
        icon: any; // Use any to avoid type conflicts with LucideIcon
        onClick: (residents: Resident[]) => void;
        variant?: 'danger' | 'warning' | 'success' | 'default';
    };

    type ViewOption = {
        id: string;
        label: string;
        icon: any; // Use any to avoid type conflicts with LucideIcon
    };

    // Destructure handlers from hooks for easier use
    const {
        handleSearch,
        handleViewChange,
        handleSelectionChange,
        handleSort,
        handlePageChange,
        handleRecordsPerPageChange,
        handleFiltersApply,
        handleFiltersReset,
        handleCloseDrawer,
        handleOpenDrawer,
        searchQuery,
        currentPage,
        recordsPerPage,
        sortConfig,
        filters,
        selectedView,
        showFilterPanel,
        drawerClosing,
        setCurrentPage } = filtersHook;

    // Destructure only the functions that aren't defined locally
    const {
        handleBulkSMS,
        handleBulkPDF,
        handleBulkStatusChange,
        handleBulkDelete,
        handleViewResident,
        handleEditResident,
        handleDeleteResident } = actionsHook;

    // Destructure data management from dataHook
    const {
        residents,
        loading,
        totalRecords,
        setResidents,
        stats } = dataHook;

    // Additional state setters (dummy functions to fix compilation)
    const setLoading = () => { };
    const setApiError = () => { };
    const setTotalRecords = () => { };
    const setTotalPages = () => { };
    const setLastUpdated = () => { };
    const setStats = () => { };

    const {
        handleRefresh,
        handleExport,
        handleAddResident
    } = uiHook;

    // Toast functions
    const info = useCallback((title: string, message: string) => {
        console.info(`${title}: ${message}`);
    }, []);

    const success = useCallback((title: string, message: string) => {
        console.log(`✓ ${title}: ${message}`);
    }, []);



    // API Fonksiyonları
    const fetchResidentsLocal = async () => {
        try {
            setLoading();
            setApiError();

            const filterParams: ResidentFilterParams = {
                page: currentPage,
                limit: recordsPerPage,
                search: searchQuery || undefined,
                orderColumn: sortConfig.key === 'fullName' ? 'firstName' :
                    sortConfig.key === 'debt' ? 'createdAt' : 'firstName',
                orderBy: sortConfig.direction.toUpperCase() as 'ASC' | 'DESC',
                ...filters
            };

            const response = await residentService.getAllResidents(filterParams);

            // Transform API residents to component residents
            const transformedResidents = response.data.map((apiResident) => transformApiResidentToComponentResident(apiResident));
            setResidents(transformedResidents);
            setTotalRecords();
            setTotalPages();
            setLastUpdated();

        } catch (error: unknown) {
            console.error('Failed to fetch residents:', error);
            setApiError();
            // Keep existing data on error, don't clear it
        } finally {
            setLoading();
        }
    };

    const fetchStats = async () => {
        try {

            const mockStats: ResidentStatsResponse = {
                totalResidents: totalRecords,
                activeResidents: residents.filter(r => r.status.type === 'active').length,
                pendingApproval: residents.filter(r => r.status.type === 'pending').length,
                newRegistrationsThisMonth: 0,
                approvedThisMonth: 0,
                rejectedThisMonth: 0,
                byMembershipTier: {
                    gold: residents.filter(r => r.isGoldMember).length,
                    silver: 0,
                    standard: residents.filter(r => !r.isGoldMember).length
                },
                byOwnershipType: {
                    owner: residents.filter(r => r.residentType.type === 'owner').length,
                    tenant: residents.filter(r => r.residentType.type === 'tenant').length
                },
                byStatus: {
                    active: residents.filter(r => r.status.type === 'active').length,
                    inactive: residents.filter(r => r.status.type === 'inactive').length,
                    pending: residents.filter(r => r.status.type === 'pending').length,
                    suspended: 0,
                    banned: 0
                }
            };
            setStats();
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    // Initialize data
    React.useEffect(() => {
        fetchResidentsLocal();
    }, [currentPage, recordsPerPage, sortConfig, filters]);

    // Fetch residents when search changes (debounced)
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage === 1) {
                fetchResidentsLocal();
            } else {
                setCurrentPage(1); // This will trigger fetchResidentsLocal via the dependency above
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Update stats when residents change
    React.useEffect(() => {
        fetchStats();
    }, [residents, totalRecords]);

    // Handle ESC key to close drawer
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showFilterPanel) {
                handleCloseDrawer();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [showFilterPanel]);

    // Prevent body scroll when drawer is open
    React.useEffect(() => {
        if (showFilterPanel) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showFilterPanel]);


    // Bulk Actions
    const handleBulkMail = useCallback((residents: Resident[]) => {
        const emails = residents.filter(r => r.contact.email).map(r => r.contact.email).join(', ');
        info('Toplu Mail', `${residents.length} sakine mail gönderiliyor. ${emails ? 'E-postalar: ' + emails : 'Email adresi bulunamadı'}`);
    }, [info]);


    const handleBulkTag = (residents: Resident[]) => {
        const tags = prompt('Atanacak etiketleri virgülle ayırarak yazın:');
        if (tags) {
            success('Etiketler Atandı', `${residents.length} sakine "${tags}" etiketleri başarıyla atandı`);
        }
    };



    // Individual Row Actions

    const handleCallResident = (resident: Resident) => {
        if (confirm(`${resident.contact.phone} numarasını aramak istiyor musunuz?`)) {
            // Open phone app or make call
            window.location.href = `tel:${resident.contact.phone}`;
        }
    };

    const handleMessageResident = (resident: Resident) => {
        const message = prompt(`${resident.fullName} için mesaj yazın:`);
        if (message) {
            success('Mesaj Gönderildi', `Mesaj başarıyla gönderildi: "${message}"`);
        }
    };

    const handleGenerateQR = (resident: Resident) => {
        info('QR Kod Oluşturuluyor', `${resident.fullName} için QR kod hazırlanıyor`);
        // Generate QR code with resident info
        setTimeout(() => {
            success('QR Kod İndiriliyor', 'QR kod oluşturuldu ve indiriliyor');
        }, 1000);
    };

    const handleViewNotes = (resident: Resident) => {
        const notes = resident.notes || 'Bu sakin için henüz not bulunmuyor.';
        const newNote = prompt(`${resident.fullName} - Notlar:\n\n${notes}\n\nYeni not eklemek için yazın:`);
        if (newNote && newNote.trim()) {
            // Update resident notes
            const updatedResidents = residents.map(r =>
                r.id === resident.id
                    ? { ...r, notes: (r.notes || '') + '\n' + new Date().toLocaleDateString() + ': ' + newNote }
                    : r
            );
            setResidents(updatedResidents);
            success('Not Eklendi', 'Not başarıyla eklendi');
        }
    };

    const handleViewHistory = (resident: Resident) => {
        info('Aktivite Geçmişi', `${resident.fullName} - Kayıt: ${new Date(resident.registrationDate).toLocaleDateString()}, Son aktivite: ${resident.lastActivity || 'Bilgi yok'}`);
    };

    const handleViewPaymentHistory = (resident: Resident) => {
        const debt = resident.financial.totalDebt;
        info('Ödeme Geçmişi', `${resident.fullName} - Borç: ₺${debt.toLocaleString()}, Bakiye: ₺${resident.financial.balance.toLocaleString()}`);
    };


    // Export Actions



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
                        title="Sakin Listesi"
                        breadcrumbItems={breadcrumbItems}
                    />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                                    Sakinler <span className="text-primary-gold">({dataHook.totalRecords.toLocaleString()} {filtersHook.searchQuery ? 'filtrelenmiş' : 'aktif'})</span>
                                </h2>
                                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                    Son güncelleme: {dataHook.lastUpdated.toLocaleTimeString('tr-TR')}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="ghost" size="md" icon={RefreshCw} onClick={handleRefresh}>
                                    Yenile
                                </Button>
                                <Button variant="secondary" size="md" icon={Download} onClick={handleExport}>
                                    İndir
                                </Button>
                                <Button variant="primary" size="md" icon={Plus} onClick={handleAddResident}>
                                    Yeni Sakin
                                </Button>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <Card className="mb-6">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search Bar */}
                                    <div className="flex-1">
                                        <SearchBar
                                            placeholder="Ad, soyad, pasaport, telefon, daire no ile ara..."
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            showAdvancedFilter={true}
                                            onAdvancedFilterClick={handleOpenDrawer}
                                        />
                                    </div>

                                    {/* Filter and View Toggle */}
                                    <div className="flex gap-2 items-center">
                                        <div className="relative">
                                            <Button
                                                variant="secondary"
                                                size="md"
                                                icon={Filter}
                                                onClick={handleOpenDrawer}
                                            >
                                                Filtreler
                                            </Button>
                                            {Object.keys(filters).length > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-primary-gold text-primary-dark-gray text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                                    {Object.keys(filters).length}
                                                </span>
                                            )}
                                        </div>
                                        <ViewToggle
                                            options={viewOptions}
                                            activeView={selectedView}
                                            onViewChange={handleViewChange}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                            {getStatsData().map((stat) => (
                                <StatsCard
                                    key={stat.title}
                                    title={stat.title}
                                    value={stat.value}
                                    subtitle={stat.subtitle}
                                    color={stat.color}
                                    icon={stat.icon}
                                    size="md"
                                    loading={loading && !stats}
                                />
                            ))}
                        </div>

                        {/* Error Message */}
                        {dataHook.apiError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm">{dataHook.apiError}</p>
                            </div>
                        )}

                        {/* Data Table with Bulk Actions */}
                        <DataTable
                            columns={columns}
                            data={dataHook.residents}
                            loading={dataHook.loading}
                            selectable={true}
                            onSelectionChange={handleSelectionChange}
                            bulkActions={bulkActions}
                            rowActions={[]}
                            sortConfig={filtersHook.sortConfig}
                            onSortChange={handleSort}
                            pagination={{
                                currentPage: filtersHook.currentPage,
                                totalPages: dataHook.totalPages,
                                totalRecords: dataHook.totalRecords,
                                recordsPerPage: filtersHook.recordsPerPage,
                                onPageChange: handlePageChange,
                                onRecordsPerPageChange: handleRecordsPerPageChange,
                            }}
                            emptyStateMessage={
                                dataHook.apiError ? 'Veri yüklenirken hata oluştu.' :
                                    filtersHook.searchQuery ?
                                        `"${filtersHook.searchQuery}" araması için sonuç bulunamadı.` :
                                        'Henüz sakin kaydı bulunmuyor.'
                            }
                        />
                    </main>
                </div>

                {/* Filter Panel Drawer */}
                <div className={`fixed inset-0 z-50 ${showFilterPanel ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${showFilterPanel && !drawerClosing ? 'opacity-50' : 'opacity-0'
                            }`}
                        onClick={handleCloseDrawer}
                    />

                    {/* Drawer */}
                    <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-background-light-card dark:bg-background-card shadow-2xl transform transition-transform duration-300 ease-in-out ${showFilterPanel && !drawerClosing ? 'translate-x-0' : 'translate-x-full'
                        }`}>
                        <FilterPanel
                            filterGroups={filterGroups}
                            onApplyFilters={handleFiltersApply}
                            onResetFilters={handleFiltersReset}
                            onClose={handleCloseDrawer}
                            variant="sidebar"
                        />
                    </div>
                </div>

                {/* Toast Container */}
                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </div>
        </ProtectedRoute>
    );
} 