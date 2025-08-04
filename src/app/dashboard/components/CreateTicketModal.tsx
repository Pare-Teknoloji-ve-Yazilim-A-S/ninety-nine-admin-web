'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, AlertCircle, Plus, Upload } from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import TextArea from '@/app/components/ui/TextArea';
import Button from '@/app/components/ui/Button';

import Checkbox from '@/app/components/ui/Checkbox';
import FileUpload from '@/app/components/ui/FileUpload';
import { useAuth } from '@/app/components/auth/AuthProvider';
import { useToast } from '@/hooks/useToast';

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    defaultAssigneeId?: string; // Varsayılan atanacak kişi ID'si
    defaultAssigneeName?: string; // Varsayılan atanacak kişi adı
}

interface CreateTicketFormData {
    title: string;
    description: string;
    type: string;
    priority: string;
    status: string;
    category: string;
    creatorId: string;
    assigneeId: string;
    propertyId: string;
    initialComment: string;
    isInternalComment: boolean;
}

// Enum değerleri dokümantasyona göre
const ticketTypes = [
    { value: '', label: 'Seçiniz' },
    { value: 'REQUEST', label: 'İstek' },
    { value: 'COMPLAINT', label: 'Şikayet' },
    { value: 'FAULT_REPAIR', label: 'Arıza/Tamir' },
    { value: 'MAINTENANCE', label: 'Bakım' },
    { value: 'CLEANING', label: 'Temizlik' },
    { value: 'SUGGESTION', label: 'Öneri' },
    { value: 'OTHER', label: 'Diğer' }
];

const priorities = [
    { value: '', label: 'Seçiniz' },
    { value: 'LOW', label: 'Düşük' },
    { value: 'MEDIUM', label: 'Orta' },
    { value: 'HIGH', label: 'Yüksek' },
    { value: 'URGENT', label: 'Acil' }
];

const statuses = [
    { value: '', label: 'Seçiniz' },
    { value: 'OPEN', label: 'Açık' },
    { value: 'IN_PROGRESS', label: 'İşlemde' },
    { value: 'WAITING', label: 'Beklemede' },
    { value: 'RESOLVED', label: 'Çözüldü' },
    { value: 'CLOSED', label: 'Kapatıldı' },
    { value: 'CANCELLED', label: 'İptal Edildi' }
];

const categories = [
    { value: '', label: 'Seçiniz' },
    { value: 'Tesisat', label: 'Tesisat' },
    { value: 'Elektrik', label: 'Elektrik' },
    { value: 'Isıtma', label: 'Isıtma' },
    { value: 'Soğutma', label: 'Soğutma' },
    { value: 'Temizlik', label: 'Temizlik' },
    { value: 'Güvenlik', label: 'Güvenlik' },
    { value: 'Bahçe', label: 'Bahçe' },
    { value: 'Asansör', label: 'Asansör' },
    { value: 'İnternet', label: 'İnternet' },
    { value: 'Diğer', label: 'Diğer' }
];

export default function CreateTicketModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    defaultAssigneeId, 
    defaultAssigneeName 
}: CreateTicketModalProps) {
    const { user } = useAuth();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [properties, setProperties] = useState<{ value: string; label: string }[]>([]);
    const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
    const [loadingProperties, setLoadingProperties] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
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
            status: 'OPEN',
            category: '',

            creatorId: '',
            assigneeId: '',
            propertyId: '',
            initialComment: '',
            isInternalComment: false
        }
    });

    // Load properties and users when modal opens
    useEffect(() => {
        if (isOpen) {
            loadProperties();
            loadUsers();
            // Set current user as creator
            if (user?.id) {
                setValue('creatorId', user.id);
            }
            // Set default assignee if provided
            if (defaultAssigneeId) {
                setValue('assigneeId', defaultAssigneeId);
            }
        }
    }, [isOpen, user, defaultAssigneeId]);

    const loadProperties = async () => {
        setLoadingProperties(true);
        try {
            const response = await fetch('/api/proxy/admin/properties', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const propertyOptions = (data.data || []).map((property: any) => ({
                    value: property.id,
                    label: `${property.name || 'Konut'} - ${property.address || property.id}`
                }));
                setProperties(propertyOptions);
            }
        } catch (error) {
            console.error('Properties loading failed:', error);
        } finally {
            setLoadingProperties(false);
        }
    };

    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await fetch('/api/proxy/admin/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const userOptions = (data.data || []).map((user: any) => ({
                    value: user.id,
                    label: `${user.firstName} ${user.lastName}`
                }));
                setUsers(userOptions);
            }
        } catch (error) {
            console.error('Users loading failed:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleFilesChange = (files: FileList | null) => {
        if (files) {
            const fileArray = Array.from(files);
            
            // Validate each file
            const validFiles: File[] = [];
            const errors: string[] = [];
            
            fileArray.forEach(file => {
                // File size limit: 10MB
                if (file.size > 10 * 1024 * 1024) {
                    errors.push(`${file.name}: Dosya boyutu 10MB'dan büyük olamaz`);
                    return;
                }
                
                // File type validation
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
                if (!allowedTypes.includes(file.type)) {
                    errors.push(`${file.name}: Desteklenmeyen dosya türü`);
                    return;
                }
                
                validFiles.push(file);
            });
            
            if (errors.length > 0) {
                setError(errors.join(', '));
            } else {
                setError(null);
            }
            
            setSelectedFiles(prev => [...prev, ...validFiles]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadAttachments = async (ticketId: string) => {
        if (selectedFiles.length === 0) return;

        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
            formData.append('attachments', file);
        });

        try {
            const response = await fetch(`/api/proxy/admin/tickets/${ticketId}/attachments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Dosya yükleme başarısız');
            }

            console.log('Attachments uploaded successfully');
        } catch (error) {
            console.error('Error uploading attachments:', error);
            throw error;
        }
    };

    const onSubmit = async (data: CreateTicketFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            // Create ticket payload
            const ticketPayload: any = {
                title: data.title,
                description: data.description
            };

            // Add optional fields only if they have values
            if (data.type) ticketPayload.type = data.type;
            if (data.priority) ticketPayload.priority = data.priority;
            if (data.status) ticketPayload.status = data.status;
            if (data.category) ticketPayload.category = data.category;

            if (data.creatorId) ticketPayload.creatorId = data.creatorId;
            if (data.assigneeId) ticketPayload.assigneeId = data.assigneeId;
            if (data.propertyId) ticketPayload.propertyId = data.propertyId;
            if (data.initialComment) ticketPayload.initialComment = data.initialComment;
            if (data.isInternalComment !== undefined) ticketPayload.isInternalComment = data.isInternalComment;

            console.log('Creating ticket with payload:', ticketPayload);

            // Create ticket
            const response = await fetch('/api/proxy/admin/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(ticketPayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Talep oluşturma başarısız');
            }

            const result = await response.json();
            console.log('Ticket created successfully:', result);

            // Upload attachments if any
            if (result.data?.id && selectedFiles.length > 0) {
                try {
                    await uploadAttachments(result.data.id);
                } catch (uploadError) {
                    console.error('Attachment upload failed:', uploadError);
                    // Don't fail the whole process for attachment upload failure
                    toast.warning('Talep oluşturuldu ancak bazı dosyalar yüklenemedi.');
                }
            }

            // Success
            toast.success('Talep başarıyla oluşturuldu!');
            reset();
            setSelectedFiles([]);
            onSuccess?.();
            onClose();

        } catch (error: any) {
            console.error('Error creating ticket:', error);
            setError(error.message || 'Talep oluşturulurken bir hata oluştu');
        } finally {
            setIsLoading(false);
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
                <div className="flex-1 max-h-[70vh] overflow-y-auto px-1">
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
                        {/* Zorunlu Alanlar */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark border-b border-gray-200 dark:border-gray-700 pb-2">
                                Zorunlu Bilgiler
                            </h3>
                            
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    Talep Başlığı *
                                </label>
                                <Input
                                    {...register('title', { 
                                        required: 'Talep başlığı zorunludur',
                                        minLength: { value: 3, message: 'En az 3 karakter olmalıdır' }
                                    })}
                                    placeholder="Örn: Su tesisatı arızası"
                                    error={errors.title?.message}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    Açıklama *
                                </label>
                                <textarea
                                    {...register('description', { 
                                        required: 'Açıklama zorunludur',
                                        minLength: { value: 10, message: 'En az 10 karakter olmalıdır' }
                                    })}
                                    placeholder="Talep detaylarını açıklayın..."
                                    rows={4}
                                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/50 min-h-[100px] border-primary-gold/30 bg-background-secondary text-text-primary hover:border-primary-gold/50 focus:border-primary-gold placeholder:text-text-secondary resize-vertical ${
                                        errors.description ? 'border-primary-red focus:ring-primary-red/50 focus:border-primary-red' : ''
                                    }`}
                                />
                                {errors.description && (
                                    <p className="text-sm text-primary-red mt-1">{errors.description.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Opsiyonel Alanlar */}
                        <div className="space-y-4">

                            {/* Type, Priority, Status - Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                        Talep Türü
                                    </label>
                                    <Select
                                        {...register('type')}
                                        options={ticketTypes}
                                        error={errors.type?.message}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                        Öncelik
                                    </label>
                                    <Select
                                        {...register('priority')}
                                        options={priorities}
                                        error={errors.priority?.message}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                        Durum
                                    </label>
                                    <Select
                                        {...register('status')}
                                        options={statuses}
                                        error={errors.status?.message}
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    Kategori
                                </label>
                                <Select
                                    {...register('category')}
                                    options={categories}
                                    error={errors.category?.message}
                                />
                            </div>

                            {/* Property */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    Konut
                                </label>
                                <Select
                                    {...register('propertyId')}
                                    options={[{ value: '', label: loadingProperties ? 'Yükleniyor...' : 'Seçiniz' }, ...properties]}
                                    disabled={loadingProperties}
                                    error={errors.propertyId?.message}
                                />
                            </div>

                            {/* Assignee */}
                            {defaultAssigneeId && defaultAssigneeName ? (
                                <div>
                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                        Atanacak Kişi
                                    </label>
                                    <div className="p-3 bg-primary-gold-light/20 border border-primary-gold/30 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-primary-gold/20 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-primary-gold">
                                                    {defaultAssigneeName.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <span className="font-medium text-text-on-light dark:text-text-on-dark">
                                                {defaultAssigneeName}
                                            </span>
                                        </div>
                                    </div>
                                    <input type="hidden" {...register('assigneeId')} value={defaultAssigneeId} />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                        Atanacak Kişi
                                    </label>
                                    <Select
                                        {...register('assigneeId')}
                                        options={[{ value: '', label: loadingUsers ? 'Yükleniyor...' : 'Seçiniz' }, ...users]}
                                        disabled={loadingUsers}
                                        error={errors.assigneeId?.message}
                                    />
                                </div>
                            )}

                            {/* Initial Comment */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    İlk Yorum
                                </label>
                                <textarea
                                    {...register('initialComment')}
                                    placeholder="İlk yorumunuzu yazın..."
                                    rows={3}
                                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/50 min-h-[75px] border-primary-gold/30 bg-background-secondary text-text-primary hover:border-primary-gold/50 focus:border-primary-gold placeholder:text-text-secondary resize-vertical ${
                                        errors.initialComment ? 'border-primary-red focus:ring-primary-red/50 focus:border-primary-red' : ''
                                    }`}
                                />
                                {errors.initialComment && (
                                    <p className="text-sm text-primary-red mt-1">{errors.initialComment.message}</p>
                                )}
                            </div>

                            {/* Internal Comment Checkbox */}
                            <div>
                                <Checkbox
                                    {...register('isInternalComment')}
                                    label="Dahili yorum (sadece yöneticiler görebilir)"
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    Dosya Ekleri
                                </label>
                                <FileUpload
                                    onFilesChange={handleFilesChange}
                                    accept=".jpg,.jpeg,.png,.gif,.pdf,.txt"
                                    multiple
                                    maxSize={10 * 1024 * 1024} // 10MB
                                />
                                
                                {/* Selected Files Display */}
                                {selectedFiles.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                            Seçilen Dosyalar:
                                        </p>
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                                <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    Kaldır
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
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
                        disabled={isLoading || !watch('title') || !watch('description')}
                        icon={Plus}
                    >
                        {isLoading ? 'Talep Oluşturuluyor...' : 'Talep Oluştur'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}