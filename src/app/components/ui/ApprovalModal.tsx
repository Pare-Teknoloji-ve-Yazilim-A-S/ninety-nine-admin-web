'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { UserCheck, UserX, AlertCircle } from 'lucide-react';

export interface ApprovalFormData {
    decision: 'approved' | 'rejected';
    reason: string;
    assignedRole: 'resident' | 'tenant';
    initialMembershipTier: 'GOLD' | 'SILVER' | 'STANDARD';
}

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ApprovalFormData) => Promise<void>;
    loading?: boolean;
    userName?: string;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    loading = false,
    userName = 'Kullanıcı'
}) => {
    const [formData, setFormData] = useState<ApprovalFormData>({
        decision: 'approved',
        reason: '',
        assignedRole: 'resident',
        initialMembershipTier: 'STANDARD'
    });

    const [errors, setErrors] = useState<Partial<ApprovalFormData>>({});

    const handleInputChange = (field: keyof ApprovalFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ApprovalFormData> = {};

        if (!formData.reason.trim()) {
            newErrors.reason = 'Açıklama gereklidir';
        }

        if (!formData.assignedRole) {
            newErrors.assignedRole = 'Rol seçimi gereklidir';
        }

        if (!formData.initialMembershipTier) {
            newErrors.initialMembershipTier = 'Üyelik seviyesi seçimi gereklidir';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (decision: 'approved' | 'rejected') => {
        const submitData = { ...formData, decision };
        
        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(submitData);
            // Reset form on success
            setFormData({
                decision: 'approved',
                reason: '',
                assignedRole: 'resident',
                initialMembershipTier: 'STANDARD'
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Approval submission failed:', error);
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
            title={`${userName} - Kullanıcı Onayı`}
            subtitle="Kullanıcının üyelik durumunu onaylayın veya reddedin"
            icon={UserCheck}
            size="lg"
            closable={!loading}
        >
            <div className="space-y-6">
                {/* Decision Radio Buttons */}
                <div>
                    <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-3">
                        Karar
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="decision"
                                value="approved"
                                checked={formData.decision === 'approved'}
                                onChange={(e) => handleInputChange('decision', e.target.value as 'approved' | 'rejected')}
                                className="w-4 h-4 text-primary-gold focus:ring-0 focus:ring-offset-0 outline-none"
                                disabled={loading}
                            />
                            <UserCheck className="h-4 w-4 text-semantic-success-500" />
                            <span className="text-text-on-light dark:text-text-on-dark">Onayla</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="decision"
                                value="rejected"
                                checked={formData.decision === 'rejected'}
                                onChange={(e) => handleInputChange('decision', e.target.value as 'approved' | 'rejected')}
                                className="w-4 h-4 text-primary-red focus:ring-0 focus:ring-offset-0 outline-none"
                                disabled={loading}
                            />
                            <UserX className="h-4 w-4 text-primary-red" />
                            <span className="text-text-on-light dark:text-text-on-dark">Reddet</span>
                        </label>
                    </div>
                </div>

                {/* Reason Textarea */}
                <div>
                    <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                        Açıklama *
                    </label>
                    <textarea
                        value={formData.reason}
                        onChange={(e) => handleInputChange('reason', e.target.value)}
                        placeholder="Onay/red nedeninizi açıklayın..."
                        rows={3}
                        disabled={loading}
                        className={`
                            w-full px-3 py-2 border rounded-lg resize-none
                            focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold
                            disabled:opacity-50 disabled:cursor-not-allowed
                            bg-background-light-card dark:bg-background-card
                            text-text-on-light dark:text-text-on-dark
                            ${errors.reason ? 'border-primary-red' : 'border-gray-200 dark:border-gray-700'}
                        `}
                    />
                    {errors.reason && (
                        <div className="flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4 text-primary-red" />
                            <span className="text-sm text-primary-red">{errors.reason}</span>
                        </div>
                    )}
                </div>

                {/* Assigned Role Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                        Atanacak Rol *
                    </label>
                    <Select
                        value={formData.assignedRole}
                        onChange={(e) => handleInputChange('assignedRole', e.target.value)}
                        options={roleOptions}
                        placeholder="Rol seçin"
                        disabled={loading}
                        error={errors.assignedRole}
                    />
                </div>

                {/* Membership Tier Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                        Üyelik Seviyesi *
                    </label>
                    <Select
                        value={formData.initialMembershipTier}
                        onChange={(e) => handleInputChange('initialMembershipTier', e.target.value)}
                        options={membershipTierOptions}
                        placeholder="Üyelik seviyesi seçin"
                        disabled={loading}
                        error={errors.initialMembershipTier}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="primary"
                        onClick={() => handleSubmit('approved')}
                        disabled={loading}
                        isLoading={loading}
                        icon={UserCheck}
                        className="flex-1"
                    >
                        Onayla
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleSubmit('rejected')}
                        disabled={loading}
                        isLoading={loading}
                        icon={UserX}
                        className="flex-1"
                    >
                        Reddet
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ApprovalModal;