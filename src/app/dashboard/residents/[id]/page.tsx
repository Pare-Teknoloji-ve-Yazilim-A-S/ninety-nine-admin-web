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
    IdCard
} from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import axios from 'axios'; // Added axios import
import apiClient from '@/services/api/client';

export default function ResidentViewPage() {
    const params = useParams();
    const residentId = params.id as string;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'family' | 'documents' | 'requests' | 'activity'>('family');
    // Document states
    const [nationalIdDocLoading, setNationalIdDocLoading] = useState(false);
    const [ownershipDocLoading, setOwnershipDocLoading] = useState(false);
    const [nationalIdDocError, setNationalIdDocError] = useState<string | null>(null);
    const [ownershipDocError, setOwnershipDocError] = useState<string | null>(null);

    // Görüntüle butonları için handler
    const handleViewDocument = async (type: 'national_id' | 'ownership_document') => {
        const setLoading = type === 'national_id' ? setNationalIdDocLoading : setOwnershipDocLoading;
        const setError = type === 'national_id' ? setNationalIdDocError : setOwnershipDocError;
        setLoading(true);
        setError(null);
        try {
            // apiClient ile blob olarak çek
            const response = await apiClient['client'].get(`/admin/users/${residentId}/documents/${type}`, { responseType: 'blob' });
            const fileUrl = URL.createObjectURL(response.data); // Doğrudan kullan
            window.open(fileUrl, '_blank');
        } catch (err: any) {
            setError(err?.message || 'Belge alınamadı.');
        } finally {
            setLoading(false);
        }
    };

    const { resident, loading, error } = useResidentData({
        residentId,
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
                        title={resident.fullName}
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
                                        {resident.fullName}
                                    </h1>
                                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                        Sakin ID: #{resident.id}
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
                                <Link href={`/dashboard/residents/${resident.id}/edit`}>
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
                                                {resident.profileImage ? (
                                                    <img
                                                        src={resident.profileImage}
                                                        alt={resident.fullName}
                                                        className="w-24 h-24 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-full bg-primary-gold flex items-center justify-center text-white text-xl font-bold">
                                                        {getInitials(resident.firstName, resident.lastName)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Basic Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
                                                        {resident.fullName}
                                                    </h2>
                                                    <Badge
                                                        variant="soft"
                                                        color={getTypeColor(resident.residentType.type)}
                                                    >
                                                        {resident.residentType.label}
                                                    </Badge>
                                                </div>

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
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Contact Information */}
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
                                                                                                    {/* Aile Üyeleri Tab Content */}
                                                <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark mb-2">Aile Üyeleri</h4>
                                                <div className="text-sm text-text-light-muted dark:text-text-muted">
                                                    Bu sakinle ilgili aile üyesi bilgileri burada görüntülenecek. (Yakında)
                                                </div>
                                                </div>
                                            )}
                                            {activeTab === "documents" && (
                                                <div>
                                                    {/* Belgeler Tab Content */}
                                                    <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark mb-2">Belgeler</h4>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <IdCard className="h-5 w-5 text-primary-gold" />
                                                            <span className="flex-1">Kimlik Belgesi</span>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => handleViewDocument('national_id')}
                                                                isLoading={nationalIdDocLoading}
                                                            >
                                                                Görüntüle
                                                            </Button>
                                                        </div>
                                                        {nationalIdDocError && (
                                                            <div className="text-xs text-primary-red mt-1">{nationalIdDocError}</div>
                                                        )}
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-5 w-5 text-primary-gold" />
                                                            <span className="flex-1">Tapu / Mülkiyet Belgesi</span>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => handleViewDocument('ownership_document')}
                                                                isLoading={ownershipDocLoading}
                                                            >
                                                                Görüntüle
                                                            </Button>
                                                        </div>
                                                        {ownershipDocError && (
                                                            <div className="text-xs text-primary-red mt-1">{ownershipDocError}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {activeTab === "requests" && (
                                                <div>
                                                    {/* Talepler Tab Content */}
                                                    <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark mb-2">Talepler</h4>
                                                    <div className="text-sm text-text-light-muted dark:text-text-muted">
                                                        Bu sakinle ilgili talepler burada listelenecek. (Yakında)
                                                    </div>
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
                                {/* Tab State */}
                                {/*
                                    Tab state is managed in the parent component.
                                    Add this to the ResidentViewPage component:
                                    const [activeTab, setActiveTab] = useState<'family' | 'documents' | 'requests' | 'activity'>('family');
                                */}

                                {/* Housing Information */}

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
                                                            {/* {resident.address.building} */}
                                                            Villa 13
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                                        <Home className="h-5 w-5 text-primary-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-text-light-muted dark:text-text-muted">Daire No</p>
                                                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                            {resident.address.apartment}
                                                        </p>
                                                    </div>
                                                </div> */}
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

                                                {/* <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                                        <User className="h-5 w-5 text-primary-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-text-light-muted dark:text-text-muted">Sakin Tipi</p>
                                                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                            {resident.residentType.label}
                                                        </p>
                                                    </div>
                                                </div> */}
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
                                                            {resident.contact.formattedPhone}
                                                        </p>
                                                    </div>
                                                </div>

                                                {resident.contact.email && (
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

                                            <div className="space-y-4">
                                                

                                                {resident.lastActivity && (
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
                                {resident.notes && (
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
            {/* Modal for Documents */}
            <Modal
                isOpen={showDocumentsModal}
                onClose={() => setShowDocumentsModal(false)}
                title="Belgeleri Görüntüle"
                icon={FileText}
                size="md"
            >
                <div className="py-4 space-y-6">
                    {/* National ID */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2 text-text-on-light dark:text-text-on-dark">National ID</h4>
                        <Button
                            variant="secondary"
                            onClick={() => handleViewDocument('national_id')}
                            disabled={nationalIdDocLoading}
                            className="mb-2"
                        >
                            {nationalIdDocLoading ? 'Yükleniyor...' : 'Görüntüle'}
                        </Button>
                        {nationalIdDocError && <p className="text-sm text-primary-red">{nationalIdDocError}</p>}
                    </div>
                    {/* Ownership Document */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2 text-text-on-light dark:text-text-on-dark">Ownership Document</h4>
                        <Button
                            variant="secondary"
                            onClick={() => handleViewDocument('ownership_document')}
                            disabled={ownershipDocLoading}
                            className="mb-2"
                        >
                            {ownershipDocLoading ? 'Yükleniyor...' : 'Görüntüle'}
                        </Button>
                        {ownershipDocError && <p className="text-sm text-primary-red">{ownershipDocError}</p>}
                    </div>
                </div>
            </Modal>
        </ProtectedRoute>
    );
} 