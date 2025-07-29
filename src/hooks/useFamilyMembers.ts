import { useState, useCallback, useEffect } from 'react';
import { familyMemberService } from '@/services/family-member.service';
import { FamilyMember, CreateFamilyMemberDto, UpdateFamilyMemberDto } from '@/services/types/family-member.types';

interface UseFamilyMembersProps {
    userId?: string;
    autoFetch?: boolean;
}

interface UseFamilyMembersReturn {
    familyMembers: FamilyMember[];
    loading: boolean;
    error: string | null;
    saving: boolean;
    saveError: string | null;
    fetchFamilyMembers: (userId: string) => Promise<void>;
    createFamilyMember: (userId: string, data: CreateFamilyMemberDto) => Promise<FamilyMember>;
    updateFamilyMember: (id: string, data: UpdateFamilyMemberDto) => Promise<FamilyMember>;
    deleteFamilyMember: (id: string) => Promise<void>;
    refreshData: () => Promise<void>;
    clearError: () => void;
    clearSaveError: () => void;
}

export const useFamilyMembers = ({
    userId,
    autoFetch = true
}: UseFamilyMembersProps = {}): UseFamilyMembersReturn => {
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const fetchFamilyMembers = useCallback(async (userIdParam: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await familyMemberService.getFamilyMembersByUserId(userIdParam);
            
            if (response?.data) {
                // Transform isMinor based on age if not provided by API
                const transformedData = response.data.map(member => ({
                    ...member,
                    isMinor: member.isMinor ?? member.age < 18
                }));
                setFamilyMembers(transformedData);
            } else {
                setFamilyMembers([]);
            }

        } catch (error: unknown) {
            console.error('Failed to fetch family members:', error);
            setError(error instanceof Error ? error.message : 'Aile üyeleri yüklenirken bir hata oluştu.');
            setFamilyMembers([]); // Clear data on error
        } finally {
            setLoading(false);
        }
    }, []);

    const createFamilyMember = useCallback(async (userIdParam: string, data: CreateFamilyMemberDto): Promise<FamilyMember> => {
        try {
            setSaving(true);
            setSaveError(null);

            const response = await familyMemberService.createFamilyMemberForUser(userIdParam, data);
            
            if (response?.data) {
                const newMember = {
                    ...response.data,
                    isMinor: response.data.isMinor ?? response.data.age < 18
                };
                
                // Add new family member to the list
                setFamilyMembers(prevMembers => [...prevMembers, newMember]);
                return newMember;
            }

            throw new Error('Aile üyesi oluşturulamadı');

        } catch (error: unknown) {
            console.error('Failed to create family member:', error);
            setSaveError(error instanceof Error ? error.message : 'Aile üyesi oluşturulurken bir hata oluştu.');
            throw error;
        } finally {
            setSaving(false);
        }
    }, []);

    const updateFamilyMember = useCallback(async (id: string, data: UpdateFamilyMemberDto): Promise<FamilyMember> => {
        try {
            setSaving(true);
            setSaveError(null);

            const response = await familyMemberService.updateFamilyMember(id, data);
            
            if (response?.data) {
                const updatedMember = {
                    ...response.data,
                    isMinor: response.data.isMinor ?? response.data.age < 18
                };
                
                // Update family member in the list
                setFamilyMembers(prevMembers => 
                    prevMembers.map(member => 
                        member.id === id ? updatedMember : member
                    )
                );
                return updatedMember;
            }

            throw new Error('Aile üyesi güncellenemedi');

        } catch (error: unknown) {
            console.error('Failed to update family member:', error);
            setSaveError(error instanceof Error ? error.message : 'Aile üyesi güncellenirken bir hata oluştu.');
            throw error;
        } finally {
            setSaving(false);
        }
    }, []);

    const deleteFamilyMember = useCallback(async (id: string): Promise<void> => {
        try {
            setSaving(true);
            setSaveError(null);

            await familyMemberService.deleteFamilyMember(id);
            
            // Remove family member from the list
            setFamilyMembers(prevMembers => 
                prevMembers.filter(member => member.id !== id)
            );

        } catch (error: unknown) {
            console.error('Failed to delete family member:', error);
            setSaveError(error instanceof Error ? error.message : 'Aile üyesi silinirken bir hata oluştu.');
            throw error;
        } finally {
            setSaving(false);
        }
    }, []);

    const refreshData = useCallback(async () => {
        if (userId) {
            await fetchFamilyMembers(userId);
        }
    }, [userId, fetchFamilyMembers]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearSaveError = useCallback(() => {
        setSaveError(null);
    }, []);

    // Auto-fetch when userId changes
    useEffect(() => {
        if (autoFetch && userId) {
            fetchFamilyMembers(userId);
        }
    }, [userId, autoFetch, fetchFamilyMembers]);

    return {
        familyMembers,
        loading,
        error,
        saving,
        saveError,
        fetchFamilyMembers,
        createFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        refreshData,
        clearError,
        clearSaveError
    };
}; 