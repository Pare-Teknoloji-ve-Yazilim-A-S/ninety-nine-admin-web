'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import TextArea from '@/app/components/ui/TextArea';
import Select from '@/app/components/ui/Select';
import Checkbox from '@/app/components/ui/Checkbox';
import DatePicker from '@/app/components/ui/DatePicker';
import FileUpload from '@/app/components/ui/FileUpload';
import Label from '@/app/components/ui/Label';
import { Save, X, Calendar, Image as ImageIcon, AlertTriangle, Pin } from 'lucide-react';
import {
    AnnouncementType,
    AnnouncementStatus,
    ANNOUNCEMENT_TYPE_OPTIONS,
    ANNOUNCEMENT_STATUS_OPTIONS,
    type AnnouncementFormData,
    type Announcement
} from '@/services/types/announcement.types';

interface AnnouncementFormProps {
    initialData?: Partial<Announcement>;
    onSubmit: (data: AnnouncementFormData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    mode: 'create' | 'edit';
}

const defaultFormData: AnnouncementFormData = {
    title: '',
    content: '',
    type: AnnouncementType.GENERAL,
    status: AnnouncementStatus.DRAFT,
    publishDate: undefined,
    expiryDate: undefined,
    isPinned: false,
    isEmergency: false,
    image: undefined,
    imageUrl: '',
    propertyIds: [],
};

export default function AnnouncementForm({
    initialData,
    onSubmit,
    onCancel,
    loading = false,
    mode
}: AnnouncementFormProps) {
    const [formData, setFormData] = useState<AnnouncementFormData>(defaultFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string>('');

    // Initialize form data
    useEffect(() => {
        if (initialData && mode === 'edit') {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                type: initialData.type || AnnouncementType.GENERAL,
                status: initialData.status || AnnouncementStatus.DRAFT,
                publishDate: initialData.publishDate ? new Date(initialData.publishDate) : undefined,
                expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate) : undefined,
                isPinned: initialData.isPinned || false,
                isEmergency: initialData.isEmergency || false,
                image: undefined,
                imageUrl: initialData.imageUrl || '',
                propertyIds: initialData.properties?.map(p => p.id) || [],
            });
            setImagePreview(initialData.imageUrl || '');
        }
    }, [initialData, mode]);

    // Validation
    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Başlık zorunludur';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Başlık en az 3 karakter olmalıdır';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'İçerik zorunludur';
        } else if (formData.content.trim().length < 10) {
            newErrors.content = 'İçerik en az 10 karakter olmalıdır';
        }

        if (formData.publishDate && formData.expiryDate) {
            if (formData.publishDate >= formData.expiryDate) {
                newErrors.expiryDate = 'Bitiş tarihi, yayınlanma tarihinden sonra olmalıdır';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Form handlers
    const handleInputChange = useCallback((field: keyof AnnouncementFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const handleImageChange = useCallback((files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            handleInputChange('image', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [handleInputChange]);

    const handleRemoveImage = useCallback(() => {
        handleInputChange('image', undefined);
        handleInputChange('imageUrl', '');
        setImagePreview('');
    }, [handleInputChange]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    }, [formData, validateForm, onSubmit]);

    // Type options for select
    const typeOptions = ANNOUNCEMENT_TYPE_OPTIONS.map(option => ({
        value: option.value,
        label: option.label
    }));

    // Status options for select
    const statusOptions = ANNOUNCEMENT_STATUS_OPTIONS.map(option => ({
        value: option.value,
        label: option.label
    }));

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-6">
                        Temel Bilgiler
                    </h3>
                    
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <Input
                                label="Başlık"
                                value={formData.title}
                                onChange={(e: any) => handleInputChange('title', e.target.value)}
                                error={errors.title}
                                placeholder="Duyuru başlığını girin..."
                                required
                                maxLength={200}
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <TextArea
                                label="İçerik"
                                value={formData.content}
                                onChange={(e: any) => handleInputChange('content', e.target.value)}
                                error={errors.content}
                                placeholder="Duyuru içeriğini girin..."
                                required
                                rows={8}
                                maxLength={5000}
                            />
                        </div>

                        {/* Type and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="type" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                    Duyuru Tipi *
                                </Label>
                                <Select
                                    value={formData.type}
                                    onChange={(e: any) => handleInputChange('type', e.target.value)}
                                    options={typeOptions}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="status" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                    Durum *
                                </Label>
                                <Select
                                    value={formData.status}
                                    onChange={(e: any) => handleInputChange('status', e.target.value)}
                                    options={statusOptions}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Dates */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-6">
                        Tarih Ayarları
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Publish Date */}
                        <div>
                            <DatePicker
                                label="Yayınlanma Tarihi"
                                value={formData.publishDate?.toISOString().split('T')[0]}
                                onChange={(e: any) => handleInputChange('publishDate', e.target.value ? new Date(e.target.value) : undefined)}
                                placeholder="Yayınlanma tarihini seçin..."
                            />
                            <p className="text-xs text-text-light-secondary dark:text-text-secondary mt-1">
                                Boş bırakılırsa hemen yayınlanır
                            </p>
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <DatePicker
                                label="Bitiş Tarihi"
                                value={formData.expiryDate?.toISOString().split('T')[0]}
                                onChange={(e: any) => handleInputChange('expiryDate', e.target.value ? new Date(e.target.value) : undefined)}
                                error={errors.expiryDate}
                                placeholder="Bitiş tarihini seçin..."
                            />
                            <p className="text-xs text-text-light-secondary dark:text-text-secondary mt-1">
                                Boş bırakılırsa süresiz olur
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Options */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-6">
                        Ek Ayarlar
                    </h3>
                    
                    <div className="space-y-4">
                        {/* Pin and Emergency Checkboxes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <Checkbox
                                    checked={formData.isPinned}
                                    onChange={(checked) => handleInputChange('isPinned', checked)}
                                />
                                <div className="flex items-center gap-2">
                                    <Pin className="w-5 h-5 text-primary-gold" />
                                    <div>
                                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                            Sabitle
                                        </p>
                                        <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                                            Duyuru listesinin en üstünde gösterilir
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <Checkbox
                                    checked={formData.isEmergency}
                                    onChange={(checked) => handleInputChange('isEmergency', checked)}
                                />
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                            Acil Durum
                                        </p>
                                        <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                                            Acil durum duyurusu olarak işaretlenir
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Image Upload */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-6">
                        Görsel
                    </h3>
                    
                    {imagePreview ? (
                        <div className="space-y-4">
                            <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                <img
                                    src={imagePreview}
                                    alt="Duyuru görseli"
                                    className="w-full h-48 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemoveImage}
                                icon={X}
                            >
                                Görseli Kaldır
                            </Button>
                        </div>
                    ) : (
                        <FileUpload
                            onFilesChange={(fileList) => {
                                const files = fileList ? Array.from(fileList) : [];
                                handleImageChange(files);
                            }}
                            accept="image/*"
                            title="Görsel Yükle"
                            description="PNG, JPG formatında en fazla 5MB"
                        />
                    )}
                </div>
            </Card>

            {/* Action Buttons */}
            <Card>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            size="md"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            icon={Save}
                            isLoading={loading}
                        >
                            {mode === 'create' ? 'Duyuru Oluştur' : 'Değişiklikleri Kaydet'}
                        </Button>
                    </div>
                </div>
            </Card>
        </form>
    );
}