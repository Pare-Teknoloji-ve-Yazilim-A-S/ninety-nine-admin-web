'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Skeleton from '@/app/components/ui/Skeleton';
import ConfirmationModal from '@/app/components/ui/ConfirmationModal';
import { useRequestDetail } from '../hooks/useRequestDetail';
import { useRequestsActions } from '../hooks/useRequestsActions';

// Import detail components
import RequestDetailHeader from '../components/detail/RequestDetailHeader';
import RequestDetailInfo from '../components/detail/RequestDetailInfo';
import RequestDetailApartment from '../components/detail/RequestDetailApartment';
import RequestDetailAssignee from '../components/detail/RequestDetailAssignee';
import RequestDetailTimeline from '../components/detail/RequestDetailTimeline';
import RequestDetailStatus from '../components/detail/RequestDetailStatus';
import RequestDetailComments from '../components/detail/RequestDetailComments';
import RequestDetailImages from '../components/detail/RequestDetailImages';
import RequestDetailCost from '../components/detail/RequestDetailCost';

export default function RequestDetailPage() {
    const router = useRouter();
    const params = useParams();
    const requestId = params.id as string;

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Use the new detail hook
    const {
        request,
        loading,
        error,
        handleEdit,
        handleDelete,
        handleStatusChange
    } = useRequestDetail(requestId);

    // Actions hook for confirmation modal
    const {
        isDeleting,
        confirmationDialog,
        hideConfirmation,
        confirmDelete
    } = useRequestsActions({
        refreshData: () => {},
        setSelectedRequests: () => {},
        setRequests: () => {}
    });

    // Breadcrumb
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Hizmet Talepleri', href: '/dashboard/requests' },
        { label: 'Talep Detayı', active: true }
    ];

    // Loading state
    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader
                            title="Talep Detayı"
                            breadcrumbItems={breadcrumbItems}
                        />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="space-y-6">
                                {/* Header skeleton */}
                                <Skeleton className="h-32 w-full" />
                                
                                {/* Content grid skeleton */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-6">
                                        <Skeleton className="h-48 w-full" />
                                        <Skeleton className="h-32 w-full" />
                                    </div>
                                    <div className="space-y-6">
                                        <Skeleton className="h-64 w-full" />
                                        <Skeleton className="h-48 w-full" />
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    // Error state
    if (error || !request) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader
                            title="Talep Detayı"
                            breadcrumbItems={breadcrumbItems}
                        />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="p-6">
                                <div className="text-center">
                                    <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                        {error || 'Talep Bulunamadı'}  
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {error || 'Aradığınız talep bulunamadı veya erişim yetkiniz bulunmuyor.'}
                                    </p>
                                    <div className="mt-6">
                                        <Button
                                            variant="primary"
                                            onClick={() => router.push('/dashboard/requests')}
                                        >
                                            Talep Listesine Dön
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    // Main render with modular components
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                
                <div className="lg:ml-72">
                    <DashboardHeader
                        title={`Talep: ${request.requestId}`}
                        breadcrumbItems={breadcrumbItems}
                    />

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="space-y-6">
                            {/* Header */}
                            <RequestDetailHeader
                                request={request}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onBack={() => router.back()}
                                loading={loading}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Request Info */}
                                    <RequestDetailInfo request={request} />

                                    {/* Status Actions */}
                                    <RequestDetailStatus
                                        request={request}
                                        onStatusChange={handleStatusChange}
                                        loading={loading}
                                    />

                                    {/* Comments */}
                                    <RequestDetailComments
                                        requestId={request.id}
                                        commentsCount={request.commentsCount}
                                    />

                                    {/* Images */}
                                    {request.hasImages && (
                                        <RequestDetailImages
                                            requestId={request.id}
                                            imagesCount={request.imagesCount}
                                        />
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Apartment Info */}
                                    <RequestDetailApartment apartment={request.apartment} />

                                    {/* Assignee Info */}
                                    <RequestDetailAssignee assignee={request.assignee} />

                                    {/* Timeline */}
                                    <RequestDetailTimeline request={request} />

                                    {/* Cost Info */}
                                    <RequestDetailCost
                                        cost={request.cost}
                                        canViewCosts={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmationDialog.isOpen}
                onClose={hideConfirmation}
                onConfirm={async () => {
                    await confirmDelete();
                    // Navigate back to requests list if deletion was successful
                    if (!confirmationDialog.isOpen) {
                        router.push('/dashboard/requests');
                    }
                }}
                title="Talebi Sil"
                description={
                    confirmationDialog.ticket 
                        ? `"${confirmationDialog.ticket.title}" adlı talep kalıcı olarak silinecektir. Bu işlem geri alınamaz.`
                        : "Bu talebi silmek istediğinizden emin misiniz?"
                }
                confirmText="Sil"
                cancelText="İptal"
                variant="danger"
                loading={isDeleting}
                itemName={confirmationDialog.ticket?.title}
                itemType="talep"
            />
        </ProtectedRoute>
    );
} 