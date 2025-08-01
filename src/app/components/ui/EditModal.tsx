'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import DatePicker from './DatePicker';
import { Edit, Save } from 'lucide-react';
import { adminResidentService } from '@/services/admin-resident.service';
import { userService } from '@/services/user.service';

export interface EditFormData {
    id?: string;
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
    const [formData, setFormData] = useState<EditFormData>({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        role: initialData?.role || 'resident',
        identityNumber: initialData?.identityNumber || '',
        gender: initialData?.gender || '',
        birthDate: initialData?.birthDate || '',
        birthPlace: initialData?.birthPlace || '',
        bloodType: initialData?.bloodType || ''
    });

    const [errors, setErrors] = useState<Partial<EditFormData>>({});
    const [roles, setRoles] = useState<{ label: string; value: string }[]>([]);
    const [rolesLoading, setRolesLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                role: 'resident',
                identityNumber: '',
                gender: '',
                birthDate: '',
                birthPlace: '',
                bloodType: ''
            });
            setErrors({});
        }
        if (!isOpen) {
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                role: 'resident',
                identityNumber: '',
                gender: '',
                birthDate: '',
                birthPlace: '',
                bloodType: ''
            });
            setErrors({});
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        setRolesLoading(true);
        userService.getAllRoles()
            .then(res => {
                setRoles(
                    (res.data || [])
                        .filter(role => ['resident', 'tenant'].includes(role.slug))
                        .map(role => ({ label: role.name, value: role.id }))
                );
            })
            .catch(() => setRoles([]))
            .finally(() => setRolesLoading(false));
    }, []);

    const handleInputChange = (field: keyof EditFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        // No required fields, only validate if identityNumber is present and not numeric
        const newErrors: Partial<EditFormData> = {};
        if (formData.identityNumber && !/^[0-9]+$/.test(formData.identityNumber)) {
            newErrors.identityNumber = 'Ulusal kimlik numarası sadece rakamlardan oluşmalıdır';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        if (!initialData?.id) {
            console.error('Kullanıcı ID bulunamadı, güncelleme yapılamaz.');
            setErrors(prev => ({ ...prev, form: 'Kullanıcı ID bulunamadı, güncelleme yapılamaz.' }));
            return;
        }
        try {
            // Only include changed fields in the payload, and skip empty strings
            const payload: any = {};
            if (formData.firstName !== initialData?.firstName && formData.firstName) payload.firstName = formData.firstName;
            if (formData.lastName !== initialData?.lastName && formData.lastName) payload.lastName = formData.lastName;
            if (formData.phone !== initialData?.phone && formData.phone) payload.phone = formData.phone;
            if (formData.gender && formData.gender !== initialData?.gender) payload.gender = formData.gender === 'Erkek' ? 'MALE' : formData.gender === 'Kadın' ? 'FEMALE' : 'OTHER';
            if (formData.birthPlace && formData.birthPlace !== initialData?.birthPlace) payload.placeOfBirth = formData.birthPlace;
            if (formData.bloodType && formData.bloodType !== initialData?.bloodType) payload.bloodType = formData.bloodType;
            if (formData.birthDate && formData.birthDate !== initialData?.birthDate) payload.dateOfBirth = formData.birthDate;
            if (formData.role !== initialData?.role && formData.role) payload.roleId = formData.role;
            if (formData.identityNumber && formData.identityNumber !== initialData?.identityNumber) payload.identityNumber = formData.identityNumber;
            await adminResidentService.updateResident(initialData.id, payload);
            onClose();
        } catch (error) {
            console.error('Edit submission failed:', error);
        }
    };

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
                        placeholder="12345678901"
                        value={formData.identityNumber || ''}
                        onChange={(e: any) => handleInputChange('identityNumber', e.target.value.replace(/[^0-9]/g, ''))}
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

                {/* Role (remove Membership Tier) */}
                <div>
                    <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                        Rol *
                    </label>
                    <Select
                        value={formData.role}
                        onChange={(e: any) => handleInputChange('role', e.target.value)}
                        options={roles}
                        disabled={loading || rolesLoading}
                    />
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