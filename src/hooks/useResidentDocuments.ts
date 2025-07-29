'use client';

import { useState, useCallback, useEffect } from 'react';
import { adminResidentService } from '@/services/admin-resident.service';

export interface DocumentState {
    loading: boolean;
    error: string | null;
    url?: string;
}

export interface UploadState {
    uploading: boolean;
    progress: number;
    error: string | null;
}

interface UseResidentDocumentsProps {
    residentId: string;
    autoFetch?: boolean;
}

interface UseResidentDocumentsReturn {
    nationalIdDoc: DocumentState;
    ownershipDoc: DocumentState;
    uploadStates: {
        nationalId: UploadState;
        ownership: UploadState;
    };
    fetchNationalIdDocument: () => Promise<void>;
    fetchOwnershipDocument: () => Promise<void>;
    uploadNationalIdDocument: (file: File) => Promise<void>;
    uploadOwnershipDocument: (file: File) => Promise<void>;
    clearDocumentError: (type: 'nationalId' | 'ownership') => void;
    refreshDocuments: () => Promise<void>;
}

export const useResidentDocuments = ({
    residentId,
    autoFetch = true
}: UseResidentDocumentsProps): UseResidentDocumentsReturn => {
    // Document states
    const [nationalIdDoc, setNationalIdDoc] = useState<DocumentState>({
        loading: false,
        error: null,
        url: undefined
    });

    const [ownershipDoc, setOwnershipDoc] = useState<DocumentState>({
        loading: false,
        error: null,
        url: undefined
    });

    // Upload states
    const [uploadStates, setUploadStates] = useState({
        nationalId: { uploading: false, progress: 0, error: null },
        ownership: { uploading: false, progress: 0, error: null }
    });

    // Fetch national ID document
    const fetchNationalIdDocument = useCallback(async () => {
        try {
            setNationalIdDoc(prev => ({ ...prev, loading: true, error: null }));
            
            const response = await adminResidentService.getNationalIdDocument(residentId);
            
            if (response?.data) {
                // If response contains a blob or URL, create object URL
                const url = response.data instanceof Blob 
                    ? URL.createObjectURL(response.data)
                    : response.data;
                    
                setNationalIdDoc({ loading: false, error: null, url });
            } else {
                setNationalIdDoc({ loading: false, error: 'Belge bulunamadı', url: undefined });
            }
        } catch (error: any) {
            console.error('Failed to fetch national ID document:', error);
            const errorMessage = error?.response?.status === 404 
                ? 'Belge bulunamadı' 
                : error?.message || 'Belge yüklenirken hata oluştu';
            setNationalIdDoc({ loading: false, error: errorMessage, url: undefined });
        }
    }, [residentId]);

    // Fetch ownership document
    const fetchOwnershipDocument = useCallback(async () => {
        try {
            setOwnershipDoc(prev => ({ ...prev, loading: true, error: null }));
            
            const response = await adminResidentService.getOwnershipDocument(residentId);
            
            if (response?.data) {
                // If response contains a blob or URL, create object URL
                const url = response.data instanceof Blob 
                    ? URL.createObjectURL(response.data)
                    : response.data;
                    
                setOwnershipDoc({ loading: false, error: null, url });
            } else {
                setOwnershipDoc({ loading: false, error: 'Belge bulunamadı', url: undefined });
            }
        } catch (error: any) {
            console.error('Failed to fetch ownership document:', error);
            const errorMessage = error?.response?.status === 404 
                ? 'Belge bulunamadı' 
                : error?.message || 'Belge yüklenirken hata oluştu';
            setOwnershipDoc({ loading: false, error: errorMessage, url: undefined });
        }
    }, [residentId]);

    // Upload national ID document
    const uploadNationalIdDocument = useCallback(async (file: File) => {
        try {
            setUploadStates(prev => ({
                ...prev,
                nationalId: { uploading: true, progress: 0, error: null }
            }));

            await adminResidentService.uploadNationalIdDocument(
                residentId,
                file,
                (progress) => {
                    setUploadStates(prev => ({
                        ...prev,
                        nationalId: { ...prev.nationalId, progress }
                    }));
                }
            );

            setUploadStates(prev => ({
                ...prev,
                nationalId: { uploading: false, progress: 100, error: null }
            }));

            // Refresh the document after successful upload
            await fetchNationalIdDocument();
        } catch (error: any) {
            console.error('Failed to upload national ID document:', error);
            setUploadStates(prev => ({
                ...prev,
                nationalId: { 
                    uploading: false, 
                    progress: 0, 
                    error: error?.message || 'Belge yüklenirken hata oluştu' 
                }
            }));
        }
    }, [residentId, fetchNationalIdDocument]);

    // Upload ownership document
    const uploadOwnershipDocument = useCallback(async (file: File) => {
        try {
            setUploadStates(prev => ({
                ...prev,
                ownership: { uploading: true, progress: 0, error: null }
            }));

            await adminResidentService.uploadOwnershipDocument(
                residentId,
                file,
                (progress) => {
                    setUploadStates(prev => ({
                        ...prev,
                        ownership: { ...prev.ownership, progress }
                    }));
                }
            );

            setUploadStates(prev => ({
                ...prev,
                ownership: { uploading: false, progress: 100, error: null }
            }));

            // Refresh the document after successful upload
            await fetchOwnershipDocument();
        } catch (error: any) {
            console.error('Failed to upload ownership document:', error);
            setUploadStates(prev => ({
                ...prev,
                ownership: { 
                    uploading: false, 
                    progress: 0, 
                    error: error?.message || 'Belge yüklenirken hata oluştu' 
                }
            }));
        }
    }, [residentId, fetchOwnershipDocument]);

    // Clear document error
    const clearDocumentError = useCallback((type: 'nationalId' | 'ownership') => {
        if (type === 'nationalId') {
            setNationalIdDoc(prev => ({ ...prev, error: null }));
        } else {
            setOwnershipDoc(prev => ({ ...prev, error: null }));
        }
    }, []);

    // Refresh all documents
    const refreshDocuments = useCallback(async () => {
        await Promise.all([
            fetchNationalIdDocument(),
            fetchOwnershipDocument()
        ]);
    }, [fetchNationalIdDocument, fetchOwnershipDocument]);

    // Auto-fetch on mount
    useEffect(() => {
        if (autoFetch && residentId) {
            refreshDocuments();
        }
    }, [autoFetch, residentId, refreshDocuments]);

    return {
        nationalIdDoc,
        ownershipDoc,
        uploadStates,
        fetchNationalIdDocument,
        fetchOwnershipDocument,
        uploadNationalIdDocument,
        uploadOwnershipDocument,
        clearDocumentError,
        refreshDocuments
    };
}; 