'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { Edit, Save } from 'lucide-react';

export interface EditFormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role: 'resident' | 'tenant';
    membershipTier: 'GOLD' | 'SILVER' | 'STANDARD';
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
        membershipTier: 'STANDARD'
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
        { value: 'GOLD', label: 'Altın' },
        { value: 'SILVER', label: 'Gümüş' },
        { value: 'STANDARD', label: 'Standart' }
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
                {/* Name and Surname */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Ad *
                        </label>
                        <Input
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
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
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                            onChange={(e) => handleInputChange('phone', e.target.value)}
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
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="ornek@email.com"
                            error={errors.email}
                            disabled={loading}
                            type="email"
                        />
                    </div>
                </div>

                {/* Role and Membership */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Rol *
                        </label>
                        <Select
                            value={formData.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            options={roleOptions}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Üyelik Seviyesi *
                        </label>
                        <Select
                            value={formData.membershipTier}
                            onChange={(e) => handleInputChange('membershipTier', e.target.value)}
                            options={membershipTierOptions}
                            disabled={loading}
                        />
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