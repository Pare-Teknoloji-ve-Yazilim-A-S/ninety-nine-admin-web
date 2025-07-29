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
    ExternalLink
} from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import DocumentUploadModal from '@/app/components/ui/DocumentUploadModal';
import { useResidentDocuments } from '@/hooks/useResidentDocuments';
import { useResidentTickets } from '@/hooks/useResidentTickets';
import { useToast } from '@/hooks/useToast';
import RequestDetailModal from '../../requests/RequestDetailModal';
import CreateTicketModal from '../../components/CreateTicketModal';
import { ToastContainer } from '@/app/components/ui/Toast';
import { Ticket } from '@/services/ticket.service';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { CreateFamilyMemberDto, FamilyMember } from '@/services/types/family-member.types';



export default function ResidentViewPage() {
    const params = useParams();
    const residentId = params.id as string;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
    const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);
    const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
    const [showTicketDetailModal, setShowTicketDetailModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [activeTab, setActiveTab] = useState<'family' | 'documents' | 'requests' | 'activity'>('family');
    
    // Toast system
    const toast = useToast();
    
    // Family member form data
    const [familyFormData, setFamilyFormData] = useState({
        firstName: '',
        lastName: '',
        relationship: '',
        age: '',
        phone: '',
        identityNumber: ''
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

    const { resident, loading, error } = useResidentData({
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
                return <AlertCircle className="h-4 w-4 text-primary-red" />;
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

    // Handle add family member
    const handleAddFamilyMember = async () => {
        if (familyFormData.firstName && familyFormData.lastName && familyFormData.relationship && familyFormData.age) {
            try {
                const newMemberData: CreateFamilyMemberDto = {
                    firstName: familyFormData.firstName,
                    lastName: familyFormData.lastName,
                    relationship: familyFormData.relationship,
                    age: parseInt(familyFormData.age),
                    phone: familyFormData.phone || undefined,
                    identityNumber: familyFormData.identityNumber || undefined
                };
                
                await createFamilyMember(residentId, newMemberData);
                
                // Clear form data
                setFamilyFormData({
                    firstName: '',
                    lastName: '',
                    relationship: '',
                    age: '',
                    phone: '',
                    identityNumber: ''
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
                                <Link href={`/dashboard/residents/${residentId}/edit`}>
                                    <Button variant="danger" icon={Edit}>
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
                                                <div className="flex items-center gap-3 mb-2">
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

                                                {resident && (
                                                    <>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            {getStatusIcon(resident.status.type)}
                                                            <Badge
                                                                variant="soft"
                                                                color={getStatusColor(resident.status.color)}
                                                            >
                                                                {resident.status.label}
                                                            </Badge>
                                                            {resident.verificationStatus && (
                                                                <Badge variant="outline" color={
                                                                    resident.verificationStatus.color === 'green' ? 'primary' :
                                                                        resident.verificationStatus.color === 'yellow' ? 'secondary' :
                                                                            resident.verificationStatus.color === 'red' ? 'red' :
                                                                                'secondary'
                                                                }>
                                                                    {resident.verificationStatus.label}
                                                                </Badge>
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
                                                    { label: "Aile Üyeleri", key: "family" },
                                                    { label: "Belgeler", key: "documents" },
                                                    { label: "Talepler", key: "requests" },
                                                    { label: "Aktivite Günlüğü", key: "activity" }
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
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">Belgeler</h4>
                                                        <Button variant="primary" icon={Plus} onClick={() => setShowDocumentUploadModal(true)}>
                                                            Belge Ekle
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-6">
                                                        {/* National ID Document */}
                                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <IdCard className="h-5 w-5 text-primary-gold" />
                                                                <h5 className="font-medium text-text-on-light dark:text-text-on-dark">Kimlik Belgesi</h5>
                                                            </div>
                                                            
                                                            {nationalIdDoc.loading ? (
                                                                <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
                                                                </div>
                                                            ) : nationalIdDoc.error ? (
                                                                <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                                    <div className="text-center">
                                                                        <AlertCircle className="h-8 w-8 text-text-light-muted dark:text-text-muted mx-auto mb-2" />
                                                                        <p className="text-sm text-text-light-muted dark:text-text-muted">{nationalIdDoc.error}</p>
                                                                    </div>
                                                                </div>
                                                            ) : nationalIdDoc.url ? (
                                                                <div className="relative">
                                                                    <img
                                                                        src={nationalIdDoc.url}
                                                                        alt="Kimlik Belgesi"
                                                                        className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer"
                                                                        onClick={() => window.open(nationalIdDoc.url, '_blank')}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                                    <div className="text-center">
                                                                        <FileText className="h-8 w-8 text-text-light-muted dark:text-text-muted mx-auto mb-2" />
                                                                        <p className="text-sm text-text-light-muted dark:text-text-muted">Belge bulunamadı</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Ownership Document */}
                                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <FileText className="h-5 w-5 text-primary-gold" />
                                                                <h5 className="font-medium text-text-on-light dark:text-text-on-dark">Tapu / Mülkiyet Belgesi</h5>
                                                            </div>
                                                            
                                                            {ownershipDoc.loading ? (
                                                                <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
                                                                </div>
                                                            ) : ownershipDoc.error ? (
                                                                <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                                    <div className="text-center">
                                                                        <AlertCircle className="h-8 w-8 text-text-light-muted dark:text-text-muted mx-auto mb-2" />
                                                                        <p className="text-sm text-text-light-muted dark:text-text-muted">{ownershipDoc.error}</p>
                                                                    </div>
                                                                </div>
                                                            ) : ownershipDoc.url ? (
                                                                <div className="relative">
                                                                    <img
                                                                        src={ownershipDoc.url}
                                                                        alt="Mülkiyet Belgesi"
                                                                        className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer"
                                                                        onClick={() => window.open(ownershipDoc.url, '_blank')}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                                    <div className="text-center">
                                                                        <FileText className="h-8 w-8 text-text-light-muted dark:text-text-muted mx-auto mb-2" />
                                                                        <p className="text-sm text-text-light-muted dark:text-text-muted">Belge bulunamadı</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {activeTab === "requests" && (
                                                <div>
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">
                                                            Talepler <span className="text-primary-gold">({residentTickets.length})</span>
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
                                                    {/* Aktivite Günlüğü Tab Content */}
                                                    <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark mb-2">Aktivite Günlüğü</h4>
                                                    <div className="text-sm text-text-light-muted dark:text-text-muted">
                                                        Bu sakinle ilgili aktiviteler burada görüntülenecek. (Yakında)
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="space-y-6">
                                {/* Financial Summary */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                            <Home className="h-5 w-5 text-primary-gold" />
                                            Konut Bilgileri
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                                        <Building className="h-5 w-5 text-primary-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-text-light-muted dark:text-text-muted">Konut</p>
                                                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                            Villa 13
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                                        <CreditCard className="h-5 w-5 text-primary-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-text-light-muted dark:text-text-muted">Borç Durumu</p>
                                                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                            $20
                                                        </p>
                                                    </div>
                                                </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Ad *
                            </label>
                            <Input
                                placeholder="Ayşe"
                                value={familyFormData.firstName}
                                onChange={(e) => setFamilyFormData({...familyFormData, firstName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Soyad *
                            </label>
                            <Input
                                placeholder="Yılmaz"
                                value={familyFormData.lastName}
                                onChange={(e) => setFamilyFormData({...familyFormData, lastName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                İlişki *
                            </label>
                            <Select
                                value={familyFormData.relationship}
                                onChange={(e) => setFamilyFormData({...familyFormData, relationship: e.target.value})}
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
                                Yaş *
                            </label>
                            <Input
                                type="number"
                                placeholder="25"
                                value={familyFormData.age}
                                onChange={(e) => setFamilyFormData({...familyFormData, age: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Telefon
                            </label>
                            <Input
                                placeholder="0555 123 4567"
                                value={familyFormData.phone}
                                onChange={(e) => setFamilyFormData({...familyFormData, phone: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Kimlik No
                            </label>
                            <Input
                                placeholder="12345678901"
                                value={familyFormData.identityNumber}
                                onChange={(e) => setFamilyFormData({...familyFormData, identityNumber: e.target.value})}
                            />
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
                                !familyFormData.age ||
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

            {/* Toast Container */}
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
        </ProtectedRoute>
    );
} 