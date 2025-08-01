'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useResidentData } from '@/hooks/useResidentData';
import { ResidentsApiService } from '../services/residents-api.service';
import {
    ArrowLeft,
    Edit,
    Phone,
    MessageSquare,
    Building,
    User,
    Home,
    Calendar,
    CreditCard,
    QrCode,
    FileText,
    Settings,
    AlertCircle,
    CheckCircle,
    Clock,
    MapPin,
    Mail,
    IdCard,
    Plus,
    ChevronRight,
    Wrench,
    ExternalLink,
    Trash2,
    Upload,
    Tag
} from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';
import DocumentUploadModal from '@/app/components/ui/DocumentUploadModal';
import ApprovalModal, { ApprovalFormData } from '@/app/components/ui/ApprovalModal';
import EditModal, { EditFormData } from '@/app/components/ui/EditModal';
import { useResidentDocuments } from '@/hooks/useResidentDocuments';
import { useResidentTickets } from '@/hooks/useResidentTickets';
import { useToast } from '@/hooks/useToast';
import RequestDetailModal from '../../requests/RequestDetailModal';
import CreateTicketModal from '../../components/CreateTicketModal';
import { ToastContainer } from '@/app/components/ui/Toast';
import { Ticket } from '@/services/ticket.service';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { CreateFamilyMemberDto, FamilyMember } from '@/services/types/family-member.types';
import { useMyProperties } from '@/hooks/useMyProperties';
import { adminResidentService } from '@/services/admin-resident.service';
import qrCodeService, { GuestQrCode } from '@/services/qr-code.service';
import { useRouter } from 'next/navigation';


export default function ResidentViewPage() {
    const params = useParams();
    const residentId = params.id as string;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
    const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [uploadDocumentType, setUploadDocumentType] = useState<'national_id' | 'ownership' | null>(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0, arrowLeft: 0 });
    const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
    const [showTicketDetailModal, setShowTicketDetailModal] = useState(false);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [approvalLoading, setApprovalLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [activeTab, setActiveTab] = useState<'family' | 'properties' | 'documents' | 'requests' | 'activity' | 'guestqrcodes'>('family');

    const [guestQRCodes, setGuestQRCodes] = useState<GuestQrCode[]>([]);
    const [qrLoading, setQrLoading] = useState(false);
    const [qrError, setQrError] = useState<string | null>(null);

    // QRCode Audit Logs State
    const [qrAuditLogs, setQrAuditLogs] = useState<any[]>([]);
    const [qrAuditLoading, setQrAuditLoading] = useState(false);
    const [qrAuditError, setQrAuditError] = useState<string | null>(null);

    // Toast system
    const toast = useToast();

    // Family member form data
    const [familyFormData, setFamilyFormData] = useState({
        firstName: '',
        lastName: '',
        relationship: '',
        age: '',
        phone: '',
        identityNumber: '',
        gender: '',
        birthDate: '',
        birthPlace: '',
        bloodType: ''
    });

    // Use document management hook
    const {
        nationalIdDoc,
        ownershipDoc,
        uploadStates,
        uploadNationalIdDocument,
        uploadOwnershipDocument,
        refreshDocuments
    } = useResidentDocuments({
        residentId,
        autoFetch: true
    });

    // Use resident tickets hook
    const {
        tickets: residentTickets,
        loading: ticketsLoading,
        error: ticketsError,
        refreshTickets
    } = useResidentTickets({
        residentId,
        autoFetch: true
    });

    const { resident, loading, error, refreshData } = useResidentData({
        residentId,
        autoFetch: true
    });

    // Use family members hook
    const {
        familyMembers,
        loading: familyMembersLoading,
        error: familyMembersError,
        saving: familyMembersSaving,
        saveError: familyMembersSaveError,
        createFamilyMember,
        refreshData: refreshFamilyMembers,
        clearSaveError: clearFamilyMembersSaveError
    } = useFamilyMembers({
        userId: residentId,
        autoFetch: true
    });

    // Use properties hook
    const {
        properties,
        loading: propertiesLoading,
        error: propertiesError,
        refreshData: refreshProperties
    } = useMyProperties({
        ownerId: residentId,
        autoFetch: true
    });

    // Property info state for sidebar
    const [propertyInfo, setPropertyInfo] = useState<any>(null);
    const [propertyLoading, setPropertyLoading] = useState(false);
    const [propertyError, setPropertyError] = useState<string | null>(null);

    // Add state for total debt
    const [totalDebt, setTotalDebt] = useState<number | null>(null);
    const [debtLoading, setDebtLoading] = useState(false);
    const [debtError, setDebtError] = useState<string | null>(null);

    useEffect(() => {
        if (residentId) {
            setPropertyLoading(true);
            setPropertyError(null);
            fetch(`/api/proxy/admin/properties/by-user/${residentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error('Konut bilgisi yüklenemedi');
                    const data = await res.json();
                    setPropertyInfo(data?.data || null);
                })
                .catch(() => setPropertyError('Konut bilgisi yüklenemedi'))
                .finally(() => setPropertyLoading(false));
        }
    }, [residentId]);

    // Update debt fetch to use propertyInfo.id
    useEffect(() => {
        if (propertyInfo?.id) {
            setDebtLoading(true);
            setDebtError(null);
            fetch(`/api/proxy/admin/billing/total-debt/${propertyInfo.id}`, {
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
    }, [propertyInfo?.id]);

    const router = useRouter();

    useEffect(() => {
        if (activeTab === 'guestqrcodes' && residentId) {
            setQrLoading(true);
            setQrError(null);
            qrCodeService.getGuestQRCodesByUser(residentId)
                .then(setGuestQRCodes)
                .catch(() => setQrError('QR kodlar yüklenemedi'))
                .finally(() => setQrLoading(false));
        }
    }, [activeTab, residentId]);

    useEffect(() => {
        if (activeTab === 'activity' && residentId) {
            setQrAuditLoading(true);
            setQrAuditError(null);
            fetch(`/api/proxy/admin/logging/audit-logs/user/${residentId}/qrcode?limit=10&page=1`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error('Loglar yüklenemedi');
                    const data = await res.json();
                    setQrAuditLogs(data?.data?.data || []);
                })
                .catch(() => setQrAuditError('Loglar yüklenemedi'))
                .finally(() => setQrAuditLoading(false));
        }
    }, [activeTab, residentId]);

    // Refresh resident data when edit modal closes
    const prevShowEditModal = React.useRef(showEditModal);
    useEffect(() => {
        if (prevShowEditModal.current && !showEditModal) {
            refreshData();
        }
        prevShowEditModal.current = showEditModal;
    }, [showEditModal]);

    // Breadcrumb for resident view page
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Sakinler', href: '/dashboard/residents' },
        { label: resident?.fullName || 'Sakin Detayı', active: true }
    ];

    // Yeni: Status ikonunu type'a göre göster
    const getStatusIcon = (type: string) => {
        switch (type) {
            case 'active':
                return <CheckCircle className="h-4 w-4 text-semantic-success-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-semantic-warning-500" />;
            case 'inactive':
            case 'suspended':
                return null; // Remove icon for inactive/pasif status
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    // Yeni: Status badge rengini color'a göre göster
    const getStatusColor = (color: string) => {
        switch (color) {
            case 'green':
                return 'primary';
            case 'yellow':
                return 'secondary';
            case 'red':
                return 'red';
            default:
                return 'secondary';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'owner':
                return 'primary';
            case 'tenant':
                return 'primary';
            default:
                return 'secondary';
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getFamilyMemberInitials = (member: FamilyMember) => {
        return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
    };

    // Handle edit submission
    const handleEditSubmit = async (data: EditFormData) => {
        try {
            setEditLoading(true);
            // TODO: API call to update resident data
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
            toast.success('Kullanıcı bilgileri başarıyla güncellendi!');
            await refreshData(); // Refresh resident data after update
        } catch (error: any) {
            console.error('Edit failed:', error);
            toast.error(
                error?.response?.data?.message ||
                'Güncelleme işlemi başarısız oldu. Lütfen tekrar deneyin.'
            );
        } finally {
            setEditLoading(false);
        }
    };

    // Handle approval submission
    const handleApprovalSubmit = async (data: ApprovalFormData) => {
        try {
            setApprovalLoading(true);

            const approvalData = {
                decision: data.decision,
                reason: data.reason,
                assignedRole: data.assignedRole,
                initialMembershipTier: data.initialMembershipTier
            };

            await adminResidentService.approveResident(residentId, approvalData);

            toast.success(
                data.decision === 'approved'
                    ? 'Kullanıcı başarıyla onaylandı!'
                    : 'Kullanıcı başarıyla reddedildi!'
            );

            // Refresh resident data to update verification status
            await refreshData();

        } catch (error: any) {
            console.error('Approval failed:', error);
            toast.error(
                error?.response?.data?.message ||
                'Onaylama işlemi başarısız oldu. Lütfen tekrar deneyin.'
            );
        } finally {
            setApprovalLoading(false);
        }
    };

    // Handle add family member
    const handleAddFamilyMember = async () => {
        if (familyFormData.firstName && familyFormData.lastName && familyFormData.relationship && familyFormData.phone && familyFormData.identityNumber) {
            try {
                const newMemberData: CreateFamilyMemberDto = {
                    firstName: familyFormData.firstName,
                    lastName: familyFormData.lastName,
                    relationship: familyFormData.relationship,
                    age: 0, // Yaş alanı kaldırıldığı için default değer
                    phone: familyFormData.phone,
                    identityNumber: familyFormData.identityNumber
                };

                await createFamilyMember(residentId, newMemberData);

                // Clear form data
                setFamilyFormData({
                    firstName: '',
                    lastName: '',
                    relationship: '',
                    age: '',
                    phone: '',
                    identityNumber: '',
                    gender: '',
                    birthDate: '',
                    birthPlace: '',
                    bloodType: ''
                });
                setShowAddFamilyModal(false);
                toast.success('Aile üyesi başarıyla eklendi!');
            } catch (error) {
                toast.error('Aile üyesi eklenirken bir hata oluştu.');
            }
        }
    };

    // Handle ticket detail view
    const handleViewTicketDetail = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setShowTicketDetailModal(true);
    };

    // Handle create ticket modal
    const handleCreateTicket = () => {
        setShowCreateTicketModal(true);
    };

    // Handle ticket creation success
    const handleTicketCreated = () => {
        setShowCreateTicketModal(false);
        refreshTickets(); // Refresh the tickets list
        toast.success('Talep başarıyla oluşturuldu!');
    };

    // Delete resident handler
    const handleDeleteResident = async () => {
        if (!residentId) return;
        if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
        try {
            await adminResidentService.deleteResident(residentId);
            toast.success('Kullanıcı başarıyla silindi!');
            router.push('/dashboard/residents');
        } catch (error) {
            toast.error('Kullanıcı silinirken bir hata oluştu.');
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader title="Sakin Detayı" breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="space-y-6">
                                    <div className="h-64 bg-gray-200 rounded"></div>
                                    <div className="h-48 bg-gray-200 rounded"></div>
                                    <div className="h-32 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader title="Hata" breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="text-center">
                                <div className="p-8">
                                    <AlertCircle className="h-12 w-12 text-primary-red mx-auto mb-4" />
                                    <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                                        Sakin bulunamadı
                                    </h2>
                                    <p className="text-text-light-secondary dark:text-text-secondary mb-6">
                                        {error}
                                    </p>
                                    <Link href="/dashboard/residents">
                                        <Button variant="primary">
                                            Sakin Listesine Dön
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!resident) {
        return null;
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
                        title={resident?.fullName || 'Sakin Detayı'}
                        breadcrumbItems={breadcrumbItems}
                    />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard/residents">
                                    <Button variant="ghost" icon={ArrowLeft}>
                                        Geri Dön
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                        {resident?.fullName || 'Yükleniyor...'}
                                    </h1>
                                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                        Sakin ID: #{resident?.id || residentId}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="secondary" icon={Phone}>
                                    Ara
                                </Button>
                                <Button variant="secondary" icon={MessageSquare}>
                                    Mesaj
                                </Button>
                                <Link href="#" onClick={e => { e.preventDefault(); handleDeleteResident(); }}>
                                    <Button variant="danger" icon={Trash2}>
                                        Kaldır
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Main Info */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Profile Summary */}
                                <Card>
                                    <div className="p-6">
                                        <div className="flex items-start gap-6">
                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                {resident?.profileImage ? (
                                                    <img
                                                        src={resident.profileImage}
                                                        alt={resident.fullName}
                                                        className="w-24 h-24 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-full bg-primary-gold flex items-center justify-center text-white text-xl font-bold">
                                                        {resident ? getInitials(resident.firstName, resident.lastName) : 'U'}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Basic Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
                                                            {resident?.fullName || 'Yükleniyor...'}
                                                        </h2>
                                                        {resident && (
                                                            <Badge
                                                                variant="soft"
                                                                color={getTypeColor(resident.residentType.type)}
                                                            >
                                                                {resident.residentType.label}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Edit Button - Same level as name */}
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                        onClick={() => setShowEditModal(true)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Düzenle
                                                    </Button>
                                                </div>

                                                {resident && (
                                                    <>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            {/* Hide status icon when user is pending */}
                                                            {resident.status.label !== 'Beklemede' && getStatusIcon(resident.status.type)}
                                                            {/* Hide "beklemede" text when user is pending */}
                                                            {resident.status.label !== 'Beklemede' && (
                                                                <Badge
                                                                    variant="soft"
                                                                    color={getStatusColor(resident.status.color)}
                                                                >
                                                                    {resident.status.label}
                                                                </Badge>
                                                            )}
                                                            {resident.verificationStatus && resident.verificationStatus.color === 'yellow' && (
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="primary"
                                                                        size="sm"
                                                                        onClick={() => setShowApprovalModal(true)}
                                                                        disabled={resident.status.label === 'Beklemede'}
                                                                    >
                                                                        Onayla
                                                                    </Button>
                                                                    {resident.status.label === 'Beklemede' && (
                                                                        <span className="text-sm text-text-light-muted dark:text-text-muted">
                                                                            Belgelerin yüklenmesi gerek
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <p className="text-text-light-muted dark:text-text-muted">Üyelik Seviyesi</p>
                                                                <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                    {resident.membershipTier}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-text-light-muted dark:text-text-muted">Kayıt Tarihi</p>
                                                                <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                    {new Date(resident.registrationDate).toLocaleDateString('tr-TR')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Tabbed Contact/Resident Info Section */}
                                <Card className="mt-6">
                                    <div className="p-0">
                                        <div className="border-b border-gray-200 dark:border-gray-700 px-6 pt-6">
                                            <nav className="flex space-x-4" aria-label="Tabs">
                                                {[
                                                    { label: `Aile Üyeleri (${familyMembers.length})`, key: "family" },
                                                    { label: `Belgeler (${[nationalIdDoc.url, ownershipDoc.url].filter(Boolean).length})`, key: "documents" },
                                                    { label: `Talepler (${residentTickets.length})`, key: "requests" },
                                                    { label: `Aktivite (${qrAuditLogs.length})`, key: "activity" }
                                                ].map((tab, idx) => (
                                                    <button
                                                        key={tab.key}
                                                        className={
                                                            (activeTab === tab.key
                                                                ? "text-primary-gold border-primary-gold"
                                                                : "text-text-light-secondary dark:text-text-secondary border-transparent hover:text-primary-gold hover:border-primary-gold/60") +
                                                            " px-3 py-2 text-sm font-medium border-b-2 transition-colors"
                                                        }
                                                        onClick={() => setActiveTab(tab.key as 'family' | 'documents' | 'requests' | 'activity')}
                                                        type="button"
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </nav>
                                        </div>
                                        <div className="px-6 py-6">
                                            {activeTab === "family" && (
                                                <div>
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">Aile Üyeleri</h4>
                                                        <Button
                                                            variant="primary"
                                                            icon={Plus}
                                                            onClick={() => setShowAddFamilyModal(true)}
                                                            disabled={familyMembersSaving}
                                                        >
                                                            Aile Üyesi Ekle
                                                        </Button>
                                                    </div>

                                                    {familyMembersLoading ? (
                                                        <div className="space-y-4">
                                                            {[1, 2, 3].map((i) => (
                                                                <div key={i} className="animate-pulse">
                                                                    <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                                                        <div className="flex-1">
                                                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                                                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : familyMembersError ? (
                                                        <div className="text-center py-8">
                                                            <AlertCircle className="h-12 w-12 text-primary-red mx-auto mb-4" />
                                                            <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                                Aile üyeleri yüklenemedi
                                                            </h3>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted mb-4">
                                                                {familyMembersError}
                                                            </p>
                                                            <Button variant="secondary" size="sm" onClick={refreshFamilyMembers}>
                                                                Tekrar Dene
                                                            </Button>
                                                        </div>
                                                    ) : familyMembers.length > 0 ? (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead>
                                                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">Foto</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">Ad Soyad</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">İlişki</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">Yaş</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">Telefon</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">İşlem</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {familyMembers.map((member) => (
                                                                        <tr key={member.id} className="border-b border-background-light-soft dark:border-background-soft hover:bg-background-light-soft dark:hover:bg-background-soft transition-colors">
                                                                            <td className="py-4 px-4">
                                                                                <div className="w-10 h-10 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold font-medium">
                                                                                    {getFamilyMemberInitials(member)}
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-4 px-4">
                                                                                <div className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                                    {member.firstName} {member.lastName}
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-4 px-4">
                                                                                <span className="text-text-light-secondary dark:text-text-secondary">
                                                                                    {member.relationship}
                                                                                </span>
                                                                            </td>
                                                                            <td className="py-4 px-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-text-on-light dark:text-text-on-dark">
                                                                                        {member.age}
                                                                                    </span>
                                                                                    {member.isMinor && (
                                                                                        <Badge variant="soft" color="secondary" className="text-xs">
                                                                                            Reşit Değil
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-4 px-4">
                                                                                <span className="text-text-light-secondary dark:text-text-secondary">
                                                                                    {member.phone || '-'}
                                                                                </span>
                                                                            </td>
                                                                            <td className="py-4 px-4">
                                                                                <Link href={`/dashboard/residents/${member.id}`}>
                                                                                    <button className="p-2 hover:bg-background-light-soft dark:hover:bg-background-soft rounded-lg transition-colors">
                                                                                        <ChevronRight className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                                                                                    </button>
                                                                                </Link>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <User className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                                                            <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                                Henüz aile üyesi eklenmemiş
                                                            </h3>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted">
                                                                Bu sakin için aile üyesi bilgilerini ekleyebilirsiniz.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {activeTab === "documents" && (
                                                <div>
                                                    <div className="mb-6">
                                                        <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">Belgeler</h4>
                                                    </div>
                                                    <div className="space-y-6">
                                                        {/* National ID Document */}
                                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <IdCard className="h-5 w-5 text-primary-gold" />
                                                                    <h5 className="font-medium text-text-on-light dark:text-text-on-dark">Kimlik Belgesi</h5>
                                                                    {/* Status indicator */}
                                                                    {nationalIdDoc.url ? (
                                                                        <span className="ml-2 w-3 h-3 rounded-full bg-green-500 inline-block" title="Yüklü"></span>
                                                                    ) : (
                                                                        <span className="ml-2 w-3 h-3 rounded-full bg-red-500 inline-block" title="Eksik"></span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {!nationalIdDoc.url && (
                                                                        <Button
                                                                            variant="primary"
                                                                            size="sm"
                                                                            icon={Upload}
                                                                            onClick={(e) => {
                                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                                const buttonCenter = rect.width / 2;
                                                                                setPopupPosition({
                                                                                    top: rect.top - 200,
                                                                                    left: rect.left,
                                                                                    arrowLeft: buttonCenter - 8
                                                                                });
                                                                                setUploadDocumentType('national_id');
                                                                                setShowUploadPopup(true);
                                                                            }}
                                                                            disabled={nationalIdDoc.loading}
                                                                        >
                                                                            Yükle
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        disabled={!nationalIdDoc.url}
                                                                        onClick={() => nationalIdDoc.url && window.open(nationalIdDoc.url, '_blank')}
                                                                    >
                                                                        Görüntüle
                                                                    </Button>
                                                                    {nationalIdDoc.loading && (
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-gold"></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Ownership Document */}
                                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <FileText className="h-5 w-5 text-primary-gold" />
                                                                    <h5 className="font-medium text-text-on-light dark:text-text-on-dark">Tapu / Mülkiyet Belgesi</h5>
                                                                    {/* Status indicator */}
                                                                    {ownershipDoc.url ? (
                                                                        <span className="ml-2 w-3 h-3 rounded-full bg-green-500 inline-block" title="Yüklü"></span>
                                                                    ) : (
                                                                        <span className="ml-2 w-3 h-3 rounded-full bg-red-500 inline-block" title="Eksik"></span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {!ownershipDoc.url && (
                                                                        <Button
                                                                            variant="primary"
                                                                            size="sm"
                                                                            icon={Upload}
                                                                            onClick={(e) => {
                                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                                const buttonCenter = rect.width / 2;
                                                                                setPopupPosition({
                                                                                    top: rect.top - 200,
                                                                                    left: rect.left,
                                                                                    arrowLeft: buttonCenter - 8
                                                                                });
                                                                                setUploadDocumentType('ownership');
                                                                                setShowUploadPopup(true);
                                                                            }}
                                                                            disabled={ownershipDoc.loading}
                                                                        >
                                                                            Yükle
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        disabled={!ownershipDoc.url}
                                                                        onClick={() => ownershipDoc.url && window.open(ownershipDoc.url, '_blank')}
                                                                    >
                                                                        Görüntüle
                                                                    </Button>
                                                                    {ownershipDoc.loading && (
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-gold"></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {activeTab === "requests" && (
                                                <div>
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">
                                                            Talep Listesi
                                                        </h4>
                                                        <Button
                                                            variant="primary"
                                                            size="md"
                                                            icon={Plus}
                                                            onClick={handleCreateTicket}
                                                        >
                                                            Yeni Talep
                                                        </Button>
                                                    </div>

                                                    {ticketsLoading ? (
                                                        <div className="space-y-4">
                                                            {[1, 2, 3].map((i) => (
                                                                <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                                                    </div>
                                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : ticketsError ? (
                                                        <div className="text-center py-8">
                                                            <AlertCircle className="h-12 w-12 text-primary-red mx-auto mb-4" />
                                                            <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                                Talepler yüklenemedi
                                                            </h3>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted mb-4">
                                                                {ticketsError}
                                                            </p>
                                                            <Button variant="secondary" size="sm" onClick={refreshTickets}>
                                                                Tekrar Dene
                                                            </Button>
                                                        </div>
                                                    ) : residentTickets.length > 0 ? (
                                                        <div className="space-y-4">
                                                            {residentTickets.map((ticket) => (
                                                                <div
                                                                    key={ticket.id}
                                                                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-gold/30 transition-colors cursor-pointer"
                                                                    onClick={() => handleViewTicketDetail(ticket)}
                                                                >
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                                                                <Wrench className="h-4 w-4 text-primary-gold" />
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                                    {ticket.title}
                                                                                </h5>
                                                                                <p className="text-xs text-text-light-muted dark:text-text-muted">
                                                                                    {ticket.ticketNumber}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge
                                                                                variant="soft"
                                                                                color={
                                                                                    ticket.status === 'OPEN' ? 'gold' :
                                                                                        ticket.status === 'IN_PROGRESS' ? 'accent' :
                                                                                            ticket.status === 'RESOLVED' ? 'primary' :
                                                                                                ticket.status === 'CLOSED' ? 'primary' :
                                                                                                    'secondary'
                                                                                }
                                                                            >
                                                                                {ticket.status === 'OPEN' ? 'Açık' :
                                                                                    ticket.status === 'IN_PROGRESS' ? 'İşlemde' :
                                                                                        ticket.status === 'RESOLVED' ? 'Çözüldü' :
                                                                                            ticket.status === 'CLOSED' ? 'Kapatıldı' :
                                                                                                ticket.status}
                                                                            </Badge>
                                                                            <ExternalLink className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                                                                        </div>
                                                                    </div>

                                                                    <p className="text-sm text-text-light-secondary dark:text-text-secondary mb-3" style={{
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden'
                                                                    }}>
                                                                        {ticket.description}
                                                                    </p>

                                                                    <div className="flex items-center justify-between text-xs text-text-light-muted dark:text-text-muted">
                                                                        <div className="flex items-center gap-4">
                                                                            <span className="flex items-center gap-1">
                                                                                <Building className="h-3 w-3" />
                                                                                {ticket.property?.name || ticket.property?.propertyNumber || 'Konut Belirtilmemiş'}
                                                                            </span>
                                                                            <Badge variant="outline" color="secondary" className="text-xs">
                                                                                {ticket.type === 'FAULT_REPAIR' ? 'Arıza/Tamir' :
                                                                                    ticket.type === 'COMPLAINT' ? 'Şikayet' :
                                                                                        ticket.type === 'REQUEST' ? 'Talep' :
                                                                                            ticket.type === 'MAINTENANCE' ? 'Bakım' :
                                                                                                ticket.type}
                                                                            </Badge>
                                                                        </div>
                                                                        <span className="flex items-center gap-1">
                                                                            <Calendar className="h-3 w-3" />
                                                                            {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <Wrench className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                                                            <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                                Henüz talep bulunmuyor
                                                            </h3>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted">
                                                                Bu sakin için henüz bir hizmet talebi oluşturulmamış.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {activeTab === "activity" && (
                                                <div>
                                                    <div className="mb-6">
                                                        <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">QR Kod Aktivite Günlüğü</h4>
                                                    </div>
                                                    {qrAuditLoading ? (
                                                        <div className="text-center py-8">Yükleniyor...</div>
                                                    ) : qrAuditError ? (
                                                        <div className="text-center py-8 text-primary-red">{qrAuditError}</div>
                                                    ) : qrAuditLogs.length === 0 ? (
                                                        <div className="text-center py-8 text-text-light-muted dark:text-text-muted">Henüz QR kod aktivitesi yok.</div>
                                                    ) : (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead>
                                                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">Tarih</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">Aksiyon</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">Tip</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">QR Kod ID</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {qrAuditLogs.map((log) => (
                                                                        <tr key={log.id} className="border-b border-background-light-soft dark:border-background-soft hover:bg-background-light-soft dark:hover:bg-background-soft transition-colors">
                                                                            <td className="py-4 px-4">{new Date(log.createdAt).toLocaleString('tr-TR')}</td>
                                                                            <td className="py-4 px-4">{log.action}</td>
                                                                            <td className="py-4 px-4">{log.metadata?.type || '-'}</td>
                                                                            <td className="py-4 px-4">{log.metadata?.qrcodeId || '-'}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="space-y-6">
                                {/* Property Information */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                            <Home className="h-5 w-5 text-primary-gold" />
                                            Konut Bilgileri
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {/* Konut Adı Başlık + Kart */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Tag className="h-5 w-5 text-primary-gold" />
                                                    <span className="text-base font-semibold text-text-on-light dark:text-text-on-dark">Konut Adı</span>
                                                </div>
                                                <Card className="bg-background-light-soft dark:bg-background-soft rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[80px]">
                                                    {propertyLoading ? (
                                                        <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                                                    ) : propertyError ? (
                                                        <div className="text-primary-red text-sm">{propertyError}</div>
                                                    ) : propertyInfo ? (
                                                        <span className="text-2xl font-bold text-primary-gold">{propertyInfo.name || '-'}</span>
                                                    ) : (
                                                        <span className="text-text-light-muted dark:text-text-muted text-sm">Konut bilgisi bulunamadı.</span>
                                                    )}
                                                </Card>
                                            </div>
                                            {/* Borç Başlık + Kart */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CreditCard className="h-5 w-5 text-primary-red" />
                                                    <span className="text-base font-semibold text-text-on-light dark:text-text-on-dark">Borç</span>
                                                </div>
                                                <Card className="bg-background-light-soft dark:bg-background-soft rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[80px]">
                                                    {debtLoading ? (
                                                        <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                                                    ) : (
                                                        <span className={`text-2xl font-bold ${(totalDebt ?? 0) > 0 ? 'text-primary-red' : 'text-text-on-light dark:text-text-on-dark'}`}>{`${(totalDebt ?? 0)} ع.د`}</span>
                                                    )}
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Quick Actions */}
                                {/* <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                            <Settings className="h-5 w-5 text-primary-gold" />
                                            Hızlı İşlemler
                                        </h3>
                                        
                                        <div className="space-y-3">
                                            <Link href={`/dashboard/residents/${resident.id}/edit`}>
                                                <Button variant="secondary" className="w-full justify-start" icon={Edit}>
                                                    Bilgileri Düzenle
                                                </Button>
                                            </Link>
                                            
                                            <Button variant="secondary" className="w-full justify-start" icon={QrCode}>
                                                QR Kod Oluştur
                                            </Button>
                                            
                                            <Button variant="secondary" className="w-full justify-start" icon={FileText}>
                                                Rapor Oluştur
                                            </Button>
                                            <Button variant="secondary" className="w-full justify-start" icon={FileText} onClick={() => setShowDocumentsModal(true)}>
                                                Belgeleri Görüntüle
                                            </Button>
                                        </div>
                                    </div>
                                </Card> */}
                                <Card>
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
                                                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                            {resident?.contact.formattedPhone || 'Belirtilmemiş'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {resident?.contact.email && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                                            <Mail className="h-5 w-5 text-primary-gold" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted">E-posta</p>
                                                            <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                {resident.contact.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-6">


                                                {resident?.lastActivity && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                                            <Calendar className="h-5 w-5 text-primary-gold" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted">Son Aktivite</p>
                                                            <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                {new Date(resident.lastActivity).toLocaleDateString('tr-TR')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                {/* Notes */}
                                {resident?.notes && (
                                    <Card>
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-primary-gold" />
                                                Notlar
                                            </h3>
                                            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                {resident.notes}
                                            </p>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Add Family Member Modal */}
            <Modal
                isOpen={showAddFamilyModal}
                onClose={() => setShowAddFamilyModal(false)}
                title="Aile Üyesi Ekle"
                icon={User}
                size="lg"
            >
                <div className="space-y-6">
                    {/* Ulusal kimlik numarası - En üstte tek başına */}
                    <div>
                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                            Ulusal kimlik numarası / Pasaport numarası *
                        </label>
                        <Input
                            placeholder="12345678901 veya AA1234567"
                            value={familyFormData.identityNumber}
                            onChange={(e: any) => setFamilyFormData({ ...familyFormData, identityNumber: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Ad *
                            </label>
                            <Input
                                placeholder="Ayşe"
                                value={familyFormData.firstName}
                                onChange={(e: any) => setFamilyFormData({ ...familyFormData, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Soyad *
                            </label>
                            <Input
                                placeholder="Yılmaz"
                                value={familyFormData.lastName}
                                onChange={(e: any) => setFamilyFormData({ ...familyFormData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Yakınlık derecesi *
                            </label>
                            <Select
                                value={familyFormData.relationship}
                                onChange={(e: any) => setFamilyFormData({ ...familyFormData, relationship: e.target.value })}
                                options={[
                                    { value: '', label: 'Seçiniz' },
                                    { value: 'Eş', label: 'Eş' },
                                    { value: 'Çocuk', label: 'Çocuk' },
                                    { value: 'Anne', label: 'Anne' },
                                    { value: 'Baba', label: 'Baba' },
                                    { value: 'Kardeş', label: 'Kardeş' },
                                    { value: 'Diğer', label: 'Diğer' }
                                ]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Telefon *
                            </label>
                            <Input
                                placeholder="0555 123 4567"
                                value={familyFormData.phone}
                                onChange={(e: any) => setFamilyFormData({ ...familyFormData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h5 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-4">
                            Ek Bilgiler (Opsiyonel)
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    Cinsiyet
                                </label>
                                <Select
                                    value={familyFormData.gender}
                                    onChange={(e: any) => setFamilyFormData({ ...familyFormData, gender: e.target.value })}
                                    options={[
                                        { value: '', label: 'Seçiniz' },
                                        { value: 'Erkek', label: 'Erkek' },
                                        { value: 'Kadın', label: 'Kadın' },
                                        { value: 'Diğer', label: 'Diğer' }
                                    ]}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    label="Doğum Tarihi"
                                    value={familyFormData.birthDate}
                                    onChange={(e: any) => setFamilyFormData({ ...familyFormData, birthDate: e.target.value })}
                                    maxDate={new Date().toISOString().split('T')[0]}
                                    variant="default"
                                    showIcon={true}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    Doğum Yeri
                                </label>
                                <Input
                                    placeholder="İstanbul, Türkiye"
                                    value={familyFormData.birthPlace}
                                    onChange={(e: any) => setFamilyFormData({ ...familyFormData, birthPlace: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    Kan Grubu
                                </label>
                                <Select
                                    value={familyFormData.bloodType}
                                    onChange={(e: any) => setFamilyFormData({ ...familyFormData, bloodType: e.target.value })}
                                    options={[
                                        { value: '', label: 'Seçiniz' },
                                        { value: 'A+', label: 'A+' },
                                        { value: 'A-', label: 'A-' },
                                        { value: 'B+', label: 'B+' },
                                        { value: 'B-', label: 'B-' },
                                        { value: 'AB+', label: 'AB+' },
                                        { value: 'AB-', label: 'AB-' },
                                        { value: 'O+', label: 'O+' },
                                        { value: 'O-', label: 'O-' }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAddFamilyModal(false)}
                        >
                            İptal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddFamilyMember}
                            disabled={
                                !familyFormData.firstName ||
                                !familyFormData.lastName ||
                                !familyFormData.relationship ||
                                !familyFormData.phone ||
                                !familyFormData.identityNumber ||
                                familyMembersSaving
                            }
                            isLoading={familyMembersSaving}
                        >
                            {familyMembersSaving ? 'Ekleniyor...' : 'Aile Üyesi Ekle'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Document Upload Modal */}
            <DocumentUploadModal
                isOpen={showDocumentUploadModal}
                onClose={() => setShowDocumentUploadModal(false)}
                onUploadNationalId={uploadNationalIdDocument}
                onUploadOwnership={uploadOwnershipDocument}
                uploadStates={uploadStates}
            />

            {/* Upload Popup */}
            {showUploadPopup && (
                <>
                    {/* Backdrop - clicking outside closes popup */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => {
                            setShowUploadPopup(false);
                            setUploadDocumentType(null);
                            setPopupPosition({ top: 0, left: 0, arrowLeft: 0 });
                        }}
                    />

                    {/* Popup Content */}
                    <div
                        className="fixed z-50 w-80 bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-in slide-in-from-bottom-2 duration-200"
                        style={{
                            top: `${popupPosition.top}px`,
                            left: `${popupPosition.left}px`,
                        }}
                    >
                        {/* Arrow pointing down to button */}
                        <div
                            className="absolute -bottom-2 w-4 h-4 bg-background-light-card dark:bg-background-card border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"
                            style={{ left: `${popupPosition.arrowLeft}px` }}
                        ></div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-text-on-light dark:text-text-on-dark">
                                    {uploadDocumentType === 'national_id' ? 'Kimlik Belgesi' : 'Tapu / Mülkiyet Belgesi'}
                                </h4>
                                <button
                                    onClick={() => {
                                        setShowUploadPopup(false);
                                        setUploadDocumentType(null);
                                        setPopupPosition({ top: 0, left: 0, arrowLeft: 0 });
                                    }}
                                    className="text-text-light-muted dark:text-text-muted hover:text-text-on-light dark:hover:text-text-on-dark"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="
                                    relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
                                    border-primary-gold/30 hover:border-primary-gold/50
                                    bg-background-light-secondary dark:bg-background-secondary
                                ">
                                    <input
                                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                console.log('Dosya seçildi:', file.name);
                                                // Burada dosya yükleme işlemi yapılacak
                                                setShowUploadPopup(false);
                                                setUploadDocumentType(null);
                                                setPopupPosition({ top: 0, left: 0, arrowLeft: 0 });
                                            }
                                        }}
                                    />
                                    <div className="space-y-2">
                                        <Upload className="mx-auto h-8 w-8 text-text-light-secondary dark:text-text-secondary" />
                                        <div className="text-xs text-text-on-light dark:text-text-on-dark">
                                            <span className="font-medium">Dosya seçin</span>
                                            <span className="text-text-light-secondary dark:text-text-secondary"> veya sürükleyin</span>
                                        </div>
                                        <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                                            JPEG, PNG, PDF • Max 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Create Ticket Modal */}
            <CreateTicketModal
                isOpen={showCreateTicketModal}
                onClose={() => setShowCreateTicketModal(false)}
                onSuccess={handleTicketCreated}
            />

            {/* Ticket Detail Modal */}
            <RequestDetailModal
                open={showTicketDetailModal}
                onClose={() => {
                    setShowTicketDetailModal(false);
                    setSelectedTicket(null);
                }}
                item={selectedTicket}
                onActionComplete={() => {
                    setShowTicketDetailModal(false);
                    setSelectedTicket(null);
                    refreshTickets();
                }}
                toast={toast}
            />

            {/* Approval Modal */}
            <ApprovalModal
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                onSubmit={handleApprovalSubmit}
                loading={approvalLoading}
                userName={resident?.fullName || 'Kullanıcı'}
            />

            {/* Edit Modal */}
            <EditModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEditSubmit}
                loading={editLoading}
                userName={resident?.fullName}
                initialData={resident ? {
                    id: String(resident.id),
                    firstName: resident.firstName || '',
                    lastName: resident.lastName || '',
                    phone: resident.contact?.formattedPhone || '',
                    email: resident.contact?.email || '',
                    role: resident.residentType.type as 'resident' | 'tenant',
                    identityNumber: '',
                    gender: '',
                    birthDate: '',
                    birthPlace: '',
                    bloodType: ''
                } : undefined}
            />

            {/* Toast Container */}
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
        </ProtectedRoute>
    );
} 