'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Select from './Select';
import { CheckCircle, UserX, AlertCircle, X, Save } from 'lucide-react';

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
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (formData.decision === 'rejected' && !formData.reason.trim()) {
            newErrors.reason = 'Red nedeni gereklidir';
        }

        if (formData.decision === 'approved') {
            if (!formData.assignedRole) {
                newErrors.assignedRole = 'Rol seçimi gereklidir';
            }
            if (!formData.initialMembershipTier) {
                newErrors.initialMembershipTier = 'Üyelik seviyesi gereklidir';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            await onSubmit(formData);
            setFormData({
                decision: 'approved',
                reason: '',
                assignedRole: 'resident',
                initialMembershipTier: 'STANDARD'
            });
            setErrors({});
            // Başarılı kayıttan sonra modal'ı otomatik kapat
            onClose();
        } catch (error) {
            console.error('Approval submission failed:', error);
        }
    };

    const roleOptions = [
        { value: 'resident', label: 'Sakin' },
        { value: 'tenant', label: 'Kiracı' }
    ];

    const membershipTierOptions = [
        { value: 'GOLD', label: 'Altın Üyelik' },
        { value: 'SILVER', label: 'Gümüş Üyelik' },
        { value: 'STANDARD', label: 'Standart Üyelik' }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                        Kullanıcı Onayı
                    </h2>
                    <p className="text-text-light-secondary dark:text-text-secondary">
                        <strong>{userName}</strong> kullanıcısının başvurusunu değerlendirin
                    </p>
                </div>

                {/* Decision Radio Buttons */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-3">
                        Karar *
                    </label>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="decision"
                                value="approved"
                                checked={formData.decision === 'approved'}
                                onChange={(e: any) => handleInputChange('decision', e.target.value)}
                                className="w-4 h-4 text-primary-gold border-gray-300 focus:ring-primary-gold"
                            />
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-semantic-success-500" />
                                <span className="text-text-on-light dark:text-text-on-dark font-medium">
                                    Onayla
                                </span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="decision"
                                value="rejected"
                                checked={formData.decision === 'rejected'}
                                onChange={(e: any) => handleInputChange('decision', e.target.value)}
                                className="w-4 h-4 text-primary-gold border-gray-300 focus:ring-primary-gold"
                            />
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