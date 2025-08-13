'use client';

import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    loading?: boolean;
    itemName?: string;
    itemType?: string;
    icon?: React.ComponentType<{ className?: string }>
    customContent?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'İşlemi Onayla',
    description = 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz?',
    confirmText = 'Onayla',
    cancelText = 'İptal',
    variant = 'danger',
    loading = false,
    itemName,
    itemType = 'öğe',
    icon,
    customContent,
}) => {
    const getVariantConfig = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: Trash2,
                    iconBg: 'bg-primary-red/20',
                    iconColor: 'text-primary-red',
                    confirmVariant: 'danger' as const,
                    title: title || 'Silme İşlemi',
                    description: description || `${itemName ? `"${itemName}"` : 'Bu ' + itemType} kalıcı olarak silinecektir. Bu işlem geri alınamaz.`,
                    confirmText: confirmText || 'Sil',
                };
            case 'warning':
                return {
                    icon: AlertTriangle,
                    iconBg: 'bg-semantic-warning-100',
                    iconColor: 'text-semantic-warning-600',
                    confirmVariant: 'secondary' as const,
                    title: title || 'Uyarı',
                    description: description,
                    confirmText: confirmText || 'Devam Et',
                };
            case 'info':
                return {
                    icon: AlertTriangle,
                    iconBg: 'bg-primary-blue/20',
                    iconColor: 'text-primary-blue',
                    confirmVariant: 'primary' as const,
                    title: title || 'Bilgi',
                    description: description,
                    confirmText: confirmText || 'Tamam',
                };
            default:
                return {
                    icon: AlertTriangle,
                    iconBg: 'bg-primary-red/20',
                    iconColor: 'text-primary-red',
                    confirmVariant: 'danger' as const,
                    title: title || 'İşlemi Onayla',
                    description: description,
                    confirmText: confirmText || 'Onayla',
                };
        }
    };

    const config = getVariantConfig();
    const IconComponent = icon || config.icon;

    const handleConfirm = () => {
        if (!loading) {
            onConfirm();
        }
    };

    const handleCancel = () => {
        if (!loading) {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            variant="default"
            closable={!loading}
            closeOnOverlayClick={!loading}
            closeOnEscape={!loading}
        >
            <div className="text-center">
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${config.iconBg}`}>
                        <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                    {config.title}
                </h3>

                {/* Description / Custom */}
                {customContent ? (
                    <div className="mb-6">{customContent}</div>
                ) : (
                    <p className="text-sm text-text-light-secondary dark:text-text-secondary mb-6 leading-relaxed whitespace-pre-line">
                        {config.description}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 justify-center">
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={handleCancel}
                        disabled={loading}
                        className="order-2 sm:order-1"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={config.confirmVariant}
                        size="md"
                        onClick={handleConfirm}
                        isLoading={loading}
                        disabled={loading}
                        className="order-1 sm:order-2"
                    >
                        {config.confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal; 