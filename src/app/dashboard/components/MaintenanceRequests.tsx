'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import { Ticket } from '@/services/ticket.service';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface MaintenanceRequestsProps {
    requests?: Ticket[];
    title?: string;
    subtitle?: string;
    loading?: boolean;
    error?: string | null;
    totalCount?: number;
}

// Helper function to get priority color
const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
        case 'URGENT':
        case 'HIGH':
            return 'red';
        case 'MEDIUM':
            return 'gold';
        case 'LOW':
            return 'primary';
        default:
            return 'secondary';
    }
};

// Helper function to get status color
const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'OPEN':
            return 'red';
        case 'IN_PROGRESS':
        case 'WAITING':
            return 'gold';
        case 'RESOLVED':
        case 'CLOSED':
            return 'primary';
        default:
            return 'secondary';
    }
};

// Helper function to get status label
const getStatusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'OPEN':
            return 'Açık';
        case 'IN_PROGRESS':
            return 'Devam Ediyor';
        case 'WAITING':
            return 'Bekliyor';
        case 'RESOLVED':
            return 'Çözüldü';
        case 'CLOSED':
            return 'Kapalı';
        default:
            return status || 'Bilinmiyor';
    }
};

// Helper function to get priority label
const getPriorityLabel = (priority: string) => {
    switch (priority?.toUpperCase()) {
        case 'URGENT':
            return 'Acil';
        case 'HIGH':
            return 'Yüksek';
        case 'MEDIUM':
            return 'Normal';
        case 'LOW':
            return 'Düşük';
        default:
            return priority || 'Bilinmiyor';
    }
};

export default function MaintenanceRequests({
    requests = [],
    title = "Bakım & Arıza Talepleri",
    subtitle = "Aktif servis talepleri",
    loading = false,
    error = null,
    totalCount = 0
}: MaintenanceRequestsProps) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calculate pagination
    const totalPages = Math.ceil(requests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRequests = requests.slice(startIndex, endIndex);

    const handleViewAll = () => {
        router.push('/dashboard/requests');
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };
    return (
        <Card title={title} subtitle={`${subtitle} (${totalCount} toplam)`}>
            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                                <div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2" />
                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24" />
                                </div>
                            </div>
                            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16" />
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {!loading && !error && requests.length === 0 && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <p>Henüz bakım talebi bulunmuyor.</p>
                </div>
            )}

            {!loading && !error && requests.length > 0 && (
                <div className="space-y-3">
                    {currentRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                    getPriorityColor(request.priority) === 'red' ? 'bg-red-500' :
                                    getPriorityColor(request.priority) === 'gold' ? 'bg-yellow-500' :
                                    'bg-green-500'
                                }`} />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {request.title}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {request.property?.name || request.property?.propertyNumber || 'Bilinmeyen Konut'} - {getPriorityLabel(request.priority)} öncelik
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="soft"
                                color={getStatusColor(request.status)}
                                size="sm"
                            >
                                {getStatusLabel(request.status)}
                            </Badge>
                        </div>
                    ))}
                    
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Sayfa {currentPage} / {totalPages} ({requests.length} toplam)
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className="p-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-2"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {/* View All Button */}
                    {totalCount > requests.length && (
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleViewAll}
                                className="w-full text-primary-gold hover:text-primary-gold/80 hover:bg-primary-gold/10"
                            >
                                Tümünü Görüntüle ({totalCount - requests.length} daha)
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
} 