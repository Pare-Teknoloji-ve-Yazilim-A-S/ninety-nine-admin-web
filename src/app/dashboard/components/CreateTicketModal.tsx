'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, FileText, AlertCircle, Plus, Image } from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import TextArea from '@/app/components/ui/TextArea';
import Button from '@/app/components/ui/Button';
import FileUpload from '@/app/components/ui/FileUpload';
import { ticketService } from '@/services/ticket.service';
import { fileUploadService } from '@/services/file-upload.service';
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
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch,
        setValue
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

        // Handle file upload
    const handleFilesChange = (files: FileList | null) => {
        if (files) {
            const fileArray = Array.from(files);
            
            // Validate each file
            const validFiles: File[] = [];
            const errors: string[] = [];
            
            fileArray.forEach(file => {
                const validation = fileUploadService.validateFile(file, {
                    maxSize: 5,
                    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
                });
                
                if (validation.isValid) {
                    validFiles.push(file);
                } else {
                    errors.push(`${file.name}: ${validation.error}`);
                }
            });
            
            if (errors.length > 0) {
                setError(`Dosya hatası: ${errors.join(', ')}`);
                return;
            }
            
            setSelectedFiles(prev => [...prev, ...validFiles]);
        }
    };

    // Handle file removal
    const handleFileRemove = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Upload files as attachments
    const uploadAttachments = async (ticketId: string) => {
        if (selectedFiles.length === 0) return;

        console.log(`Uploading ${selectedFiles.length} attachments for ticket ${ticketId}`);

        try {
            // First, upload files to get URLs
            const uploadedFiles = await fileUploadService.uploadFiles(selectedFiles);
            console.log('Files uploaded successfully:', uploadedFiles);

            // Then, attach them to the ticket
            const attachmentPromises = uploadedFiles.map(async (uploadedFile) => {
                const attachmentData = {
                    fileName: uploadedFile.file.fileName,
                    fileUrl: uploadedFile.file.fileUrl,
                    fileType: uploadedFile.file.fileType,
                    fileSize: uploadedFile.file.fileSize
                };

                const result = await ticketService.addAttachment(ticketId, attachmentData);
                console.log(`Attachment added to ticket successfully:`, result);
                return result;
            });

            await Promise.all(attachmentPromises);
            console.log('All attachments added to ticket successfully');
        } catch (error) {
            console.error('Error uploading attachments:', error);
            // Don't throw error here - ticket was created successfully
            // Just log the attachment upload error
        }
    };

    const onSubmit = async (data: CreateTicketFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!user?.id) {
                throw new Error('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
            }

            // Create ticket first
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
            
            console.log('Full ticket creation response:', ticketResponse);
            console.log('Ticket response type:', typeof ticketResponse);
            console.log('Ticket response keys:', Object.keys(ticketResponse || {}));
            console.log('Ticket response id:', ticketResponse?.id);
            
            // If ticket creation is successful and there are files, upload attachments
            if (ticketResponse?.id && selectedFiles.length > 0) {
                console.log('Uploading attachments for ticket:', ticketResponse.id);
                await uploadAttachments(ticketResponse.id);
            } else if (selectedFiles.length > 0) {
                console.log('No ticket ID found or no files to upload:', {
                    ticketId: ticketResponse?.id,
                    filesCount: selectedFiles.length,
                    ticketResponse: ticketResponse
                });
            }

            reset();
            setSelectedFiles([]);
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
            setSelectedFiles([]);
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                {/* Scrollable Content Area */}
                <div className="flex-1 max-h-[60vh] overflow-y-auto px-1">
                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-red-600 font-medium">Hata</p>
                                    <p className="text-sm text-red-500 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
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
                    value={watch('description')}
                    onChange={(e: any) => setValue('description', e.target.value)}
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
                    value={watch('initialComment')}
                    onChange={(e: any) => setValue('initialComment', e.target.value)}
                    error={errors.initialComment?.message}
                    disabled={isLoading}
                />

                {/* File Upload */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-text-primary">
                        <Image className="w-4 h-4" />
                        <span>Resim Ekle (Opsiyonel)</span>
                    </label>
                    <FileUpload
                        acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                        maxSize={5}
                        multiple={true}
                        onFilesChange={handleFilesChange}
                        selectedFiles={selectedFiles}
                        onFileRemove={handleFileRemove}
                        helperText="JPG, PNG, WEBP formatlarında maksimum 5MB boyutunda resimler ekleyebilirsiniz"
                        disabled={isLoading}
                        showPreview={true}
                    />
                    {selectedFiles.length > 0 && (
                        <p className="text-sm text-primary-gold">
                            {selectedFiles.length} resim seçildi
                        </p>
                    )}
                </div>
                    </div>
                </div>

                {/* Fixed Form Actions */}
                <div className="flex-shrink-0 flex items-center justify-end space-x-3 pt-4 border-t border-primary-gold/20 bg-background-light-card dark:bg-background-card">
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