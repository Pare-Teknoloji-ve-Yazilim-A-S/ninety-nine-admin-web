'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, FileText, AlertCircle, Plus } from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import TextArea from '@/app/components/ui/TextArea';
import Button from '@/app/components/ui/Button';
import { ticketService } from '@/services/ticket.service';
import propertyService from '@/services/property.service';
import { useAuth } from '@/app/components/auth/AuthProvider';
import { Property } from '@/services/types/property.types';

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface CreateTicketFormData {
    title: string;
    description: string;
    type: string;
    priority: string;
    category: string;
    propertyId: string;
    initialComment: string;
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
    { value: 'Tesisat', label: 'Tesisat' },
    { value: 'Elektrik', label: 'Elektrik' },
    { value: 'Isıtma', label: 'Isıtma' },
    { value: 'Temizlik', label: 'Temizlik' },
    { value: 'Güvenlik', label: 'Güvenlik' },
    { value: 'Bahçe', label: 'Bahçe' },
    { value: 'Asansör', label: 'Asansör' },
    { value: 'Diğer', label: 'Diğer' }
];

// Properties will be loaded from API

export default function CreateTicketModal({ isOpen, onClose, onSuccess }: CreateTicketModalProps) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [properties, setProperties] = useState<{ value: string; label: string }[]>([]);
    const [loadingProperties, setLoadingProperties] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch
    } = useForm<CreateTicketFormData>({
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            type: '',
            priority: 'MEDIUM',
            category: '',
            propertyId: '',
            initialComment: ''
        }
    });



    const onSubmit = async (data: CreateTicketFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!user?.id) {
                throw new Error('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
            }

            // Create ticket
            const ticketData = {
                title: data.title,
                description: data.description,
                type: data.type,
                priority: data.priority,
                category: data.category,
                propertyId: data.propertyId,
                creatorId: String(user.id),
                initialComment: data.initialComment || undefined
            };

            console.log('Creating ticket with data:', ticketData);
            const ticketResponse = await ticketService.createTicket(ticketData);
            
            console.log('Ticket created successfully:', ticketResponse);
            
            reset();
            onSuccess?.();
            onClose();
            
        } catch (error: any) {
            console.error('Error creating ticket:', error);
            console.error('Error response:', error?.response);
            console.error('Error response data:', error?.response?.data);
            
            let errorMessage = 'Talep oluşturulurken bir hata oluştu.';
            
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Load properties when modal opens
    React.useEffect(() => {
        if (isOpen && properties.length === 0) {
            loadProperties();
        }
    }, [isOpen]);

    const loadProperties = async () => {
        setLoadingProperties(true);
        try {
            const response = await propertyService.getAllProperties({ limit: 100 });
            console.log('Properties loaded:', response.data);
            const propertyOptions = response.data.map((property: Property) => ({
                value: property.id,
                label: property.name
            }));
            console.log('Property options:', propertyOptions);
            setProperties(propertyOptions);
        } catch (error) {
            console.error('Error loading properties:', error);
            // Fallback to mock data if API fails
            const mockProperties = [
                { value: '123e4567-e89b-12d3-a456-426614174000', label: 'A Blok - Daire 1' },
                { value: '123e4567-e89b-12d3-a456-426614174001', label: 'A Blok - Daire 2' },
                { value: '123e4567-e89b-12d3-a456-426614174002', label: 'B Blok - Daire 1' },
                { value: '123e4567-e89b-12d3-a456-426614174003', label: 'B Blok - Daire 2' }
            ];
            setProperties(mockProperties);
            console.log('Using mock properties as fallback');
        } finally {
            setLoadingProperties(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            reset();
            setError(null);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Yeni Talep Oluştur"
            subtitle="Talep detaylarını doldurun"
            icon={FileText}
            size="xl"
            closable={!isLoading}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Error Display */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-red-600 font-medium">Hata</p>
                                <p className="text-sm text-red-500 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Talep Başlığı"
                        placeholder="Örn: Su Tesisatı Arızası"
                        isRequired
                        {...register('title', {
                            required: 'Talep başlığı gereklidir',
                            minLength: {
                                value: 3,
                                message: 'Başlık en az 3 karakter olmalıdır'
                            }
                        })}
                        error={errors.title?.message}
                        disabled={isLoading}
                    />

                    <Select
                        label="Talep Türü"
                        placeholder="Talep türünü seçin"
                        options={ticketTypes}
                        isRequired
                        {...register('type', {
                            required: 'Talep türü gereklidir'
                        })}
                        error={errors.type?.message}
                        disabled={isLoading}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        label="Öncelik"
                        placeholder="Öncelik seviyesi"
                        options={priorities}
                        isRequired
                        {...register('priority', {
                            required: 'Öncelik seviyesi gereklidir'
                        })}
                        error={errors.priority?.message}
                        disabled={isLoading}
                    />

                    <Select
                        label="Kategori"
                        placeholder="Kategori seçin"
                        options={categories}
                        isRequired
                        {...register('category', {
                            required: 'Kategori gereklidir'
                        })}
                        error={errors.category?.message}
                        disabled={isLoading}
                    />

                    <Select
                        label="Mülk"
                        placeholder={loadingProperties ? "Yükleniyor..." : properties.length === 0 ? "Mülk bulunamadı" : "Mülk seçin"}
                        options={properties}
                        isRequired
                        {...register('propertyId', {
                            required: 'Mülk seçimi gereklidir'
                        })}
                        error={errors.propertyId?.message}
                        disabled={isLoading || loadingProperties || properties.length === 0}
                    />
                </div>

                {/* Description */}
                <TextArea
                    label="Açıklama"
                    placeholder="Talebin detaylı açıklamasını yazın..."
                    isRequired
                    resize="vertical"
                    maxLength={1000}
                    showCount
                    {...register('description', {
                        required: 'Açıklama gereklidir',
                        minLength: {
                            value: 10,
                            message: 'Açıklama en az 10 karakter olmalıdır'
                        }
                    })}
                    error={errors.description?.message}
                    disabled={isLoading}
                />

                {/* Initial Comment */}
                <TextArea
                    label="İlk Yorum (Opsiyonel)"
                    placeholder="Ek bilgi veya not ekleyin..."
                    resize="vertical"
                    maxLength={500}
                    showCount
                    {...register('initialComment')}
                    error={errors.initialComment?.message}
                    disabled={isLoading}
                />



                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-primary-gold/20">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        İptal
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={!isValid || isLoading}
                        icon={Plus}
                    >
                        {isLoading ? 'Talep Oluşturuluyor...' : 'Talep Oluştur'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
} 