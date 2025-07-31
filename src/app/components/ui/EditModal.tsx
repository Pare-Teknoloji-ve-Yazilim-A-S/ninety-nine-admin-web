'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import DatePicker from './DatePicker';
import { Edit, Save } from 'lucide-react';

export interface EditFormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role: 'resident' | 'tenant';
    membershipTier?: 'GOLD' | 'SILVER' | 'STANDARD';
    identityNumber?: string;
    gender?: string;
    birthDate?: string;
    birthPlace?: string;
    bloodType?: string;
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EditFormData) => Promise<void>;
    loading?: boolean;
    initialData?: EditFormData;
    userName?: string;
}

const EditModal: React.FC<EditModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    loading = false,
    initialData,
    userName = 'Kullanıcı'
}) => {
    const [formData, setFormData] = useState<EditFormData>(initialData || {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        role: 'resident',
        membershipTier: 'STANDARD',
        identityNumber: '',
        gender: '',
        birthDate: '',
        birthPlace: '',
        bloodType: ''
    });

    const [errors, setErrors] = useState<Partial<EditFormData>>({});

    const handleInputChange = (field: keyof EditFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<EditFormData> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Ad gereklidir';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Soyad gereklidir';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Telefon gereklidir';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'E-posta gereklidir';
        }
        if (!formData.identityNumber?.trim()) {
            newErrors.identityNumber = 'Ulusal kimlik numarası gereklidir';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Edit submission failed:', error);
        }
    };

    const roleOptions = [
        { value: 'resident', label: 'Mülk Sahibi' },
        { value: 'tenant', label: 'Kiracı' }
    ];

    const membershipTierOptions = [
        { value: 'STANDARD', label: 'Standart' },
        { value: 'SILVER', label: 'Gümüş' },
        { value: 'GOLD', label: 'Altın' }
    ];

    const genderOptions = [
        { value: '', label: 'Seçiniz' },
        { value: 'Erkek', label: 'Erkek' },
        { value: 'Kadın', label: 'Kadın' },
        { value: 'Diğer', label: 'Diğer' }
    ];

    const bloodTypeOptions = [
        { value: '', label: 'Seçiniz' },
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${userName} - Bilgileri Düzenle`}
            subtitle="Kullanıcı bilgilerini güncelleyin"
            icon={Edit}
            size="lg"
            closable={!loading}
        >
            <div className="space-y-6">
                {/* Ulusal kimlik numarası - En üstte tek başına */}
                <div>
                    <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                        Ulusal kimlik numarası / Pasaport numarası *
                    </label>
                    <Input
                        placeholder="12345678901 veya AA1234567"
                        value={formData.identityNumber || ''}
                        onChange={(e: any) => handleInputChange('identityNumber', e.target.value)}
                        error={errors.identityNumber}
                        disabled={loading}
                    />
                </div>

                {/* Name and Surname */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Ad *
                        </label>
                        <Input
                            value={formData.firstName}
                            onChange={(e: any) => handleInputChange('firstName', e.target.value)}
                            placeholder="Ad"
                            error={errors.firstName}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Soyad *
                        </label>
                        <Input
                            value={formData.lastName}
                            onChange={(e: any) => handleInputChange('lastName', e.target.value)}
                            placeholder="Soyad"
                            error={errors.lastName}
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Telefon *
                        </label>
                        <Input
                            value={formData.phone}
                            onChange={(e: any) => handleInputChange('phone', e.target.value)}
                            placeholder="0555 123 4567"
                            error={errors.phone}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            E-posta *
                        </label>
                        <Input
                            value={formData.email}
                            onChange={(e: any) => handleInputChange('email', e.target.value)}
                            placeholder="ornek@email.com"
                            error={errors.email}
                            disabled={loading}
                            type="email"
                        />
                    </div>
                </div>

                {/* Role and Membership Tier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Rol *
                        </label>
                        <Select
                            value={formData.role}
                            onChange={(e: any) => handleInputChange('role', e.target.value)}
                            options={roleOptions}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Üyelik Seviyesi
                        </label>
                        <Select
                            value={formData.membershipTier || 'STANDARD'}
                            onChange={(e: any) => handleInputChange('membershipTier', e.target.value)}
                            options={membershipTierOptions}
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Cinsiyet
                            </label>
                            <Select
                                value={formData.gender || ''}
                                onChange={(e: any) => handleInputChange('gender', e.target.value)}
                                options={genderOptions}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <DatePicker
                                label="Doğum Tarihi"
                                value={formData.birthDate || ''}
                                onChange={(e: any) => handleInputChange('birthDate', e.target.value)}
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
                                value={formData.birthPlace || ''}
                                onChange={(e: any) => handleInputChange('birthPlace', e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                Kan Grubu
                            </label>
                            <Select
                                value={formData.bloodType || ''}
                                onChange={(e: any) => handleInputChange('bloodType', e.target.value)}
                                options={bloodTypeOptions}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        İptal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        isLoading={loading}
                        icon={Save}
                    >
                        Kaydet
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditModal;