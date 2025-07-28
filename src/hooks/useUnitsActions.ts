import { useState, useCallback } from 'react';
import { unitsService, Property } from '@/services';
import { useToast } from '@/hooks/useToast';

interface UseUnitsActionsOptions {
    onDeleteSuccess?: (deletedUnit: Property) => void;
    onDeleteError?: (error: any, unit: Property) => void;
    onUpdateSuccess?: (updatedUnit: Property) => void;
    onUpdateError?: (error: any, unit: Property) => void;
    onRefreshNeeded?: () => void;
}

interface UseUnitsActionsReturn {
    // States
    isDeleting: boolean;
    isUpdating: boolean;
    error: string | null;
    confirmationDialog: {
        isOpen: boolean;
        unit: Property | null;
        type: 'delete' | null;
    };

    // Actions
    showDeleteConfirmation: (unit: Property) => void;
    hideConfirmation: () => void;
    confirmDelete: () => Promise<void>;
    updateUnit: (id: string, data: Partial<Property>) => Promise<void>;
}

export function useUnitsActions(options: UseUnitsActionsOptions = {}): UseUnitsActionsReturn {
    const { 
        onDeleteSuccess, 
        onDeleteError, 
        onUpdateSuccess, 
        onUpdateError,
        onRefreshNeeded 
    } = options;

    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmationDialog, setConfirmationDialog] = useState<{
        isOpen: boolean;
        unit: Property | null;
        type: 'delete' | null;
    }>({
        isOpen: false,
        unit: null,
        type: null
    });

    const { addToast } = useToast();

    const showDeleteConfirmation = useCallback((unit: Property) => {
        setConfirmationDialog({
            isOpen: true,
            unit,
            type: 'delete'
        });
    }, []);

    const hideConfirmation = useCallback(() => {
        setConfirmationDialog({
            isOpen: false,
            unit: null,
            type: null
        });
        setError(null);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!confirmationDialog.unit) return;

        const unit = confirmationDialog.unit;
        setIsDeleting(true);
        setError(null);

        try {
            await unitsService.deleteUnit(String(unit.id));
            
            // Success feedback
            addToast({
                type: 'success',
                title: 'Başarılı',
                message: `${unit.propertyNumber || unit.name || 'Konut'} başarıyla silindi`
            });

            // Hide confirmation dialog
            hideConfirmation();

            // Trigger callbacks
            onDeleteSuccess?.(unit);
            onRefreshNeeded?.();

        } catch (err: any) {
            console.error('❌ Failed to delete unit:', err);
            
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Konut silinirken bir hata oluştu';

            setError(errorMessage);
            
            addToast({
                type: 'error',
                title: 'Hata',
                message: errorMessage
            });

            onDeleteError?.(err, unit);
        } finally {
            setIsDeleting(false);
        }
    }, [confirmationDialog.unit, addToast, hideConfirmation, onDeleteSuccess, onDeleteError, onRefreshNeeded]);

    const updateUnit = useCallback(async (id: string, data: Partial<Property>) => {
        setIsUpdating(true);
        setError(null);

        try {
            const response = await unitsService.updateUnit(id, data);
            const updatedUnit = response.data;

            // Success feedback
            addToast({
                type: 'success',
                title: 'Başarılı',
                message: `${data.propertyNumber || data.name || 'Konut'} başarıyla güncellendi`
            });

            // Trigger callbacks
            onUpdateSuccess?.(updatedUnit);
            onRefreshNeeded?.();

        } catch (err: any) {
            console.error('❌ Failed to update unit:', err);
            
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Konut güncellenirken bir hata oluştu';

            setError(errorMessage);
            
            addToast({
                type: 'error',
                title: 'Hata',
                message: errorMessage
            });

            onUpdateError?.(err, { id, ...data } as Property);
        } finally {
            setIsUpdating(false);
        }
    }, [addToast, onUpdateSuccess, onUpdateError, onRefreshNeeded]);

    return {
        // States
        isDeleting,
        isUpdating,
        error,
        confirmationDialog,

        // Actions
        showDeleteConfirmation,
        hideConfirmation,
        confirmDelete,
        updateUnit
    };
} 