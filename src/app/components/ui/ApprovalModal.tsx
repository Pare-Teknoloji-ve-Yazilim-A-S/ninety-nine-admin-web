'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { UserCheck, UserX, AlertCircle, Save, X } from 'lucide-react';

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

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: keyof ApprovalFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.reason.trim()) {
            newErrors.reason = 'Açıklama gereklidir';
        }

        if (formData.decision === 'approved') {
            if (!formData.assignedRole) {
                newErrors.assignedRole = 'Rol seçimi gereklidir';
            }

            if (!formData.initialMembershipTier) {
                newErrors.initialMembershipTier = 'Üyelik seviyesi seçimi gereklidir';
            }
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
                    <div className="flex gap-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="decision"
                                    value="approved"
                                    checked={formData.decision === 'approved'}
                                    onChange={(e) => handleInputChange('decision', e.target.value as 'approved' | 'rejected')}
                                    className="sr-only"
                                    disabled={loading}
                                />
                                <div className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    transition-all duration-200
                                    ${formData.decision === 'approved' 
                                        ? 'border-primary-gold bg-primary-gold' 
                                        : 'border-gray-300 dark:border-gray-600 bg-transparent'
                                    }
                                    ${!loading && 'group-hover:border-primary-gold/60'}
                                    ${loading && 'opacity-50 cursor-not-allowed'}
                                `}>
                                    {formData.decision === 'approved' && (
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-semantic-success-500" />
                                <span className="text-text-on-light dark:text-text-on-dark font-medium">
                                    Onayla
                                </span>
                            </div>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="decision"
                                    value="rejected"
                                    checked={formData.decision === 'rejected'}
                                    onChange={(e) => handleInputChange('decision', e.target.value as 'approved' | 'rejected')}
                                    className="sr-only"
                                    disabled={loading}
                                />
                                <div className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    transition-all duration-200
                                    ${formData.decision === 'rejected' 
                                        ? 'border-primary-red bg-primary-red' 
                                        : 'border-gray-300 dark:border-gray-600 bg-transparent'
                                    }
                                    ${!loading && 'group-hover:border-primary-red/60'}
                                    ${loading && 'opacity-50 cursor-not-allowed'}
                                `}>
                                    {formData.decision === 'rejected' && (
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserX className="h-4 w-4 text-primary-red" />
                                <span className="text-text-on-light dark:text-text-on-dark font-medium">
                                    Reddet
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Conditional Content Based on Decision */}
                {formData.decision === 'rejected' ? (
                    /* Rejection Form - Only Reason Textarea */
                    <div>
                        <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Açıklama *
                        </label>
                        <textarea
                            value={formData.reason}
                            onChange={(e: any) => handleInputChange('reason', e.target.value)}
                            placeholder="Red nedeninizi açıklayın..."
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
                ) : (
                    /* Approval Form - Role and Membership Tier */
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                Atanacak Rol *
                            </label>
                            <Select
                                value={formData.assignedRole}
                                onChange={(e: any) => handleInputChange('assignedRole', e.target.value)}
                                options={roleOptions}
                                placeholder="Rol seçin"
                                disabled={loading}
                                error={errors.assignedRole}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                Üyelik Seviyesi *
                            </label>
                            <Select
                                value={formData.initialMembershipTier}
                                onChange={(e: any) => handleInputChange('initialMembershipTier', e.target.value)}
                                options={membershipTierOptions}
                                placeholder="Üyelik seviyesi seçin"
                                disabled={loading}
                                error={errors.initialMembershipTier}
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                        icon={X}
                        className="flex-1"
                    >
                        Vazgeç
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        isLoading={loading}
                        icon={Save}
                        className="flex-1"
                    >
                        Kaydet
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ApprovalModal;