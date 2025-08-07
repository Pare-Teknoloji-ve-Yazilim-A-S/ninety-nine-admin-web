'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, X, AlertCircle, FileText } from 'lucide-react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import TextArea from '@/app/components/ui/TextArea';
import Button from '@/app/components/ui/Button';
import Skeleton from '@/app/components/ui/Skeleton';
import Label from '@/app/components/ui/Label';
import { ticketService, Ticket, UpdateTicketRequest } from '@/services/ticket.service';
import propertyService from '@/services/property.service';
import { Property } from '@/services/types/property.types';

interface EditTicketFormData {
    title: string;
    description: string;
    type: string;
    priority: string;
    category: string;
    propertyId: string;
    status: string;
}

const ticketTypes = [
    { value: 'FAULT_REPAIR', label: 'Arıza Tamiri' },
    { value: 'MAINTENANCE', label: 'Bakım' },
    { value: 'CLEANING', label: 'Temizlik' },
    { value: 'SECURITY', label: 'Güvenlik' },
    { value: 'COMPLAINT', label: 'Şikayet' },
    { value: 'SUGGESTION', label: 'Öneri' },
    { value: 'OTHER', label: 'Diğer' }
];

const priorities = [
    { value: 'LOW', label: 'Düşük' },
    { value: 'MEDIUM', label: 'Orta' },
    { value: 'HIGH', label: 'Yüksek' },
    { value: 'URGENT', label: 'Acil' }
];

const categories = [
    { value: 'ELECTRICAL', label: 'Elektrik' },
    { value: 'PLUMBING', label: 'Su Tesisatı' },
    { value: 'HEATING', label: 'Isıtma' },
    { value: 'GENERAL', label: 'Genel' },
    { value: 'STRUCTURAL', label: 'Yapısal' },
    { value: 'APPLIANCE', label: 'Beyaz Eşya' },
    { value: 'OTHER', label: 'Diğer' }
];

const statuses = [
    { value: 'OPEN', label: 'Açık' },
    { value: 'IN_PROGRESS', label: 'İşlemde' },
    { value: 'WAITING', label: 'Beklemede' },
    { value: 'RESOLVED', label: 'Çözüldü' },
    { value: 'CLOSED', label: 'Kapalı' },
    { value: 'CANCELLED', label: 'İptal' }
];

export default function EditTicketPage() {
    const router = useRouter();
    const params = useParams();
    const ticketId = params.id as string;

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data State
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);

    // Form
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isDirty },
        reset,
        watch
    } = useForm<EditTicketFormData>();

    // Breadcrumb
    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Hizmet Talepleri', href: '/dashboard/requests' },
        { label: 'Talep Düzenle', active: true }
    ];

    // Load ticket data
    useEffect(() => {
        const fetchTicketData = async () => {
            if (!ticketId) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch ticket and properties in parallel
                const [ticketResponse, propertiesResponse] = await Promise.all([
                    ticketService.getTicketById(ticketId),
                    propertyService.getAllProperties()
                ]);

                setTicket(ticketResponse);
                setProperties(propertiesResponse.data || []);

                // Populate form with ticket data
                reset({
                    title: ticketResponse.title,
                    description: ticketResponse.description,
                    type: ticketResponse.type,
                    priority: ticketResponse.priority,
                    category: ticketResponse.category,
                    propertyId: ticketResponse.property?.id || '',
                    status: ticketResponse.status
                });

            } catch (err) {
                console.error('Error fetching ticket:', err);
                setError('Talep verisi yüklenirken hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchTicketData();
    }, [ticketId, reset]);

    // Form submit handler
    const onSubmit = async (data: EditTicketFormData) => {
        if (!ticket) return;

        try {
            setSaving(true);
            setError(null);

            const updateData: UpdateTicketRequest = {
                title: data.title,
                description: data.description,
                type: data.type,
                priority: data.priority,
                category: data.category,
                propertyId: data.propertyId,
                status: data.status
            };

            await ticketService.updateTicket(ticket.id, updateData);

            // Navigate back to requests list
            router.push('/dashboard/requests');

        } catch (err) {
            console.error('Error updating ticket:', err);
            setError('Talep güncellenirken hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setSaving(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (isDirty) {
            const isConfirmed = window.confirm(
                'Değişiklikleriniz kaydedilmedi. Çıkmak istediğinizden emin misiniz?'
            );
            if (!isConfirmed) return;
        }
        router.back();
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader
                            title="Talep Düzenle"
                            breadcrumbItems={breadcrumbItems}
                        />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="p-6">
                                <div className="space-y-6">
                                    <Skeleton className="h-8 w-1/3" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-32 w-full" />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            </Card>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error && !ticket) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader
                            title="Talep Düzenle"
                            breadcrumbItems={breadcrumbItems}
                        />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="p-6">
                                <div className="text-center">
                                    <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Hata Oluştu
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {error}
                                    </p>
                                    <div className="mt-6">
                                        <Button
                                            variant="primary"
                                            onClick={() => router.back()}
                                        >
                                            Geri Dön
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

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                
                <div className="lg:ml-72">
                    <DashboardHeader
                        title={`Talep Düzenle: ${ticket?.title || ''}`}
                        breadcrumbItems={breadcrumbItems}
                    />

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Card className="p-6">
                                <div className="space-y-6">
                                    {/* Form Header */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
                                                Talep Bilgileri
                                            </h2>
                                            <p className="text-text-light-secondary dark:text-text-secondary">
                                                Talep detaylarını düzenleyin
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                icon={ArrowLeft}
                                                onClick={handleCancel}
                                                disabled={saving}
                                            >
                                                İptal
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                icon={Save}
                                                isLoading={saving}
                                                disabled={saving || !isDirty}
                                            >
                                                {saving ? 'Kaydediliyor...' : 'Kaydet'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                                            <div className="flex">
                                                <AlertCircle className="h-5 w-5 text-red-400" />
                                                <div className="ml-3">
                                                    <p className="text-sm text-red-800 dark:text-red-200">
                                                        {error}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 gap-6">
                                        <Input
                                            label="Talep Başlığı"
                                            placeholder="Talep başlığını girin"
                                            {...register('title', {
                                                required: 'Talep başlığı zorunludur',
                                                minLength: {
                                                    value: 3,
                                                    message: 'Başlık en az 3 karakter olmalıdır'
                                                }
                                            })}
                                            error={errors.title?.message}
                                            icon={FileText}
                                        />

                                        <TextArea
                                            label="Açıklama"
                                            placeholder="Talep açıklamasını girin"
                                            rows={4}
                                            value={watch('description')}
                                            onChange={(e: any) => setValue('description', e.target.value)}
                                            error={errors.description?.message}
                                        />
                                    </div>

                                    {/* Categories and Priority */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="type" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                Talep Tipi *
                                            </Label>
                                            <Select
                                                options={ticketTypes}
                                                placeholder="Tip seçin"
                                                {...register('type', {
                                                    required: 'Talep tipi seçmelisiniz'
                                                })}
                                                error={errors.type?.message}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="priority" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                Öncelik *
                                            </Label>
                                            <Select
                                                options={priorities}
                                                placeholder="Öncelik seçin"
                                                {...register('priority', {
                                                    required: 'Öncelik seçmelisiniz'
                                                })}
                                                error={errors.priority?.message}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="category" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                Kategori *
                                            </Label>
                                            <Select
                                                options={categories}
                                                placeholder="Kategori seçin"
                                                {...register('category', {
                                                    required: 'Kategori seçmelisiniz'
                                                })}
                                                error={errors.category?.message}
                                            />
                                        </div>
                                    </div>

                                    {/* Property and Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="propertyId" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                Emlak *
                                            </Label>
                                            <Select
                                                options={properties.map(p => ({
                                                    value: String(p.id),
                                                    label: `${p.name || p.propertyNumber}${p.blockNumber ? ` - Blok ${p.blockNumber}` : ''}${p.floor ? ` - Kat ${p.floor}` : ''}`
                                                }))}
                                                placeholder="Emlak seçin"
                                                {...register('propertyId', {
                                                    required: 'Emlak seçmelisiniz'
                                                })}
                                                error={errors.propertyId?.message}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="status" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                Durum *
                                            </Label>
                                            <Select
                                                options={statuses}
                                                placeholder="Durum seçin"
                                                {...register('status', {
                                                    required: 'Durum seçmelisiniz'
                                                })}
                                                error={errors.status?.message}
                                            />
                                        </div>
                                    </div>

                                    {/* Ticket Info */}
                                    {ticket && (
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                Talep Bilgileri
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium">Talep No:</span> {ticket.ticketNumber}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Oluşturan:</span> {ticket.creator?.firstName} {ticket.creator?.lastName}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Oluşturma:</span> {new Date(ticket.createdAt).toLocaleString('tr-TR')}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </form>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
} 