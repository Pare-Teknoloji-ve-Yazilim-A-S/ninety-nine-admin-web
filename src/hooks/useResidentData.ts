'use client';

import { useState, useCallback, useEffect } from 'react';
import { residentService } from '@/services/resident.service';
import { Resident } from '@/app/components/ui/ResidentRow';
import { 
    Resident as ApiResident, 
    UpdateResidentDto, 
    CreateResidentDto 
} from '@/services/types/resident.types';

interface UseResidentDataProps {
    residentId?: string;
    autoFetch?: boolean;
}

interface UseResidentDataReturn {
    resident: Resident | null;
    loading: boolean;
    error: string | null;
    saving: boolean;
    saveError: string | null;
    fetchResident: (id: string) => Promise<void>;
    updateResident: (id: string, data: UpdateResidentDto) => Promise<void>;
    createResident: (data: CreateResidentDto) => Promise<string>;
    refreshData: () => Promise<void>;
    clearError: () => void;
    clearSaveError: () => void;
}

// Transform API resident to component resident (Iraq-specific)
const transformApiResidentToComponentResident = (apiResident: ApiResident): Resident => {
    return {
        id: apiResident.id.toString(),
        firstName: apiResident.firstName,
        lastName: apiResident.lastName,
        fullName: `${apiResident.firstName} ${apiResident.lastName}`,
        nationalId: apiResident.phone || 'Belirtilmemiş',

        // Property information from API
        residentType: {
            type: apiResident.property?.ownershipType || 'owner',
            label: apiResident.property?.ownershipType === 'tenant' ? 'Kiracı' : 'Malik',
            color: apiResident.property?.ownershipType === 'tenant' ? 'blue' : 'green'
        },
        address: {
            building: apiResident.property?.block || 'Belirtilmemiş',
            apartment: apiResident.property?.apartment || 'Belirtilmemiş',
            roomType: apiResident.property?.propertyNumber || 'Belirtilmemiş'
        },
        contact: {
            phone: apiResident.phone || 'Belirtilmemiş',
            email: apiResident.email || 'Belirtilmemiş',
            formattedPhone: apiResident.phone ? `+964 ${apiResident.phone}` : 'Belirtilmemiş'
        },
        financial: {
            balance: 0,
            totalDebt: 0,
            lastPaymentDate: undefined
        },
        status: {
            type: apiResident.status === 'ACTIVE' ? 'active' : 'inactive',
            label: apiResident.status === 'ACTIVE' ? 'Aktif' : 'Pasif',
            color: apiResident.status === 'ACTIVE' ? 'green' : 'red'
        },
        membershipTier: apiResident.membershipTier === 'GOLD' ? 'Altın Üye' : 
                       apiResident.membershipTier === 'SILVER' ? 'Gümüş Üye' : 'Standart Üye',
        verificationStatus: apiResident.verificationStatus === 'APPROVED' ? 'Onaylandı' : 
                           apiResident.verificationStatus === 'REJECTED' ? 'Reddedildi' : 'Beklemede',
        registrationDate: apiResident.registrationDate || apiResident.createdAt || new Date().toISOString(),
        lastActivity: apiResident.lastLoginDate,
        notes: '',
        profileImage: apiResident.avatar
    };
};

export const useResidentData = ({
    residentId,
    autoFetch = true
}: UseResidentDataProps = {}): UseResidentDataReturn => {
    const [resident, setResident] = useState<Resident | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const fetchResident = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await residentService.getResidentById(id);
            
            if (response.data) {
                const transformedResident = transformApiResidentToComponentResident(response.data);
                setResident(transformedResident);
            } else {
                setError('Sakin bulunamadı');
            }

        } catch (error: unknown) {
            console.error('Failed to fetch resident:', error);
            setError(error instanceof Error ? error.message : 'Sakin bilgileri yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateResident = useCallback(async (id: string, data: UpdateResidentDto) => {
        try {
            setSaving(true);
            setSaveError(null);

            const response = await residentService.updateResident(id, data);
            
            if (response.data) {
                const transformedResident = transformApiResidentToComponentResident(response.data);
                setResident(transformedResident);
            }

        } catch (error: unknown) {
            console.error('Failed to update resident:', error);
            setSaveError(error instanceof Error ? error.message : 'Sakin bilgileri güncellenirken bir hata oluştu.');
            throw error;
        } finally {
            setSaving(false);
        }
    }, []);

    const createResident = useCallback(async (data: CreateResidentDto): Promise<string> => {
        try {
            setSaving(true);
            setSaveError(null);

            const response = await residentService.createResident(data);
            
            if (response.data) {
                const transformedResident = transformApiResidentToComponentResident(response.data);
                setResident(transformedResident);
                return response.data.id.toString();
            }

            throw new Error('Sakin oluşturulamadı');

        } catch (error: unknown) {
            console.error('Failed to create resident:', error);
            setSaveError(error instanceof Error ? error.message : 'Sakin oluşturulurken bir hata oluştu.');
            throw error;
        } finally {
            setSaving(false);
        }
    }, []);

    const refreshData = useCallback(async () => {
        if (residentId) {
            await fetchResident(residentId);
        }
    }, [residentId, fetchResident]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearSaveError = useCallback(() => {
        setSaveError(null);
    }, []);

    // Auto-fetch when residentId changes
    useEffect(() => {
        if (autoFetch && residentId) {
            fetchResident(residentId);
        }
    }, [residentId, autoFetch, fetchResident]);

    return {
        resident,
        loading,
        error,
        saving,
        saveError,
        fetchResident,
        updateResident,
        createResident,
        refreshData,
        clearError,
        clearSaveError
    };
}; 