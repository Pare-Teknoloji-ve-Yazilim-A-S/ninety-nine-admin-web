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
    purchaseContractDoc: DocumentState;
    serviceContractDoc: DocumentState;
    documentsIdsDoc: DocumentState;
    handoverReportDoc: DocumentState;
    securityFormDoc: DocumentState;
    vehicleStickerDoc: DocumentState;
    otherDoc: DocumentState;
    uploadStates: {
        nationalId: UploadState;
        ownership: UploadState;
        purchaseContract: UploadState;
        serviceContract: UploadState;
        documentsIds: UploadState;
        handoverReport: UploadState;
        securityForm: UploadState;
        vehicleSticker: UploadState;
        other: UploadState;
    };
    fetchNationalIdDocument: () => Promise<void>;
    fetchOwnershipDocument: () => Promise<void>;
    fetchPurchaseContract: () => Promise<void>;
    fetchServiceContract: () => Promise<void>;
    fetchDocumentsIds: () => Promise<void>;
    fetchHandoverReport: () => Promise<void>;
    fetchSecurityForm: () => Promise<void>;
    fetchVehicleSticker: () => Promise<void>;
    fetchOtherDocument: () => Promise<void>;
    uploadNationalIdDocument: (file: File) => Promise<void>;
    uploadOwnershipDocument: (file: File) => Promise<void>;
    uploadPurchaseContract: (file: File) => Promise<void>;
    uploadServiceContract: (file: File) => Promise<void>;
    uploadDocumentsIds: (file: File) => Promise<void>;
    uploadHandoverReport: (file: File) => Promise<void>;
    uploadSecurityForm: (file: File) => Promise<void>;
    uploadVehicleSticker: (file: File) => Promise<void>;
    uploadOtherDocument: (file: File) => Promise<void>;
    clearDocumentError: (type: keyof UseResidentDocumentsReturn['uploadStates']) => void;
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

    const [purchaseContractDoc, setPurchaseContractDoc] = useState<DocumentState>({ loading: false, error: null, url: undefined });
    const [serviceContractDoc, setServiceContractDoc] = useState<DocumentState>({ loading: false, error: null, url: undefined });
    const [documentsIdsDoc, setDocumentsIdsDoc] = useState<DocumentState>({ loading: false, error: null, url: undefined });
    const [handoverReportDoc, setHandoverReportDoc] = useState<DocumentState>({ loading: false, error: null, url: undefined });
    const [securityFormDoc, setSecurityFormDoc] = useState<DocumentState>({ loading: false, error: null, url: undefined });
    const [vehicleStickerDoc, setVehicleStickerDoc] = useState<DocumentState>({ loading: false, error: null, url: undefined });
    const [otherDoc, setOtherDoc] = useState<DocumentState>({ loading: false, error: null, url: undefined });

    // Upload states
    const [uploadStates, setUploadStates] = useState({
        nationalId: { uploading: false, progress: 0, error: null },
        ownership: { uploading: false, progress: 0, error: null },
        purchaseContract: { uploading: false, progress: 0, error: null },
        serviceContract: { uploading: false, progress: 0, error: null },
        documentsIds: { uploading: false, progress: 0, error: null },
        handoverReport: { uploading: false, progress: 0, error: null },
        securityForm: { uploading: false, progress: 0, error: null },
        vehicleSticker: { uploading: false, progress: 0, error: null },
        other: { uploading: false, progress: 0, error: null }
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
                    : response.data.staticUrl || response.data; // Use staticUrl if available
                    
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
                    : response.data.staticUrl || response.data; // Use staticUrl if available
                    
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

    // Fetch extended types
    const fetchPurchaseContract = useCallback(async () => {
        try {
            setPurchaseContractDoc(prev => ({ ...prev, loading: true, error: null }));
            const response = await adminResidentService.getPurchaseContract(residentId);
            const url = response?.data ? (response.data instanceof Blob ? URL.createObjectURL(response.data) : response.data.staticUrl || response.data) : undefined;
            setPurchaseContractDoc({ loading: false, error: url ? null : 'Belge bulunamadı', url });
        } catch (error: any) {
            setPurchaseContractDoc({ loading: false, error: error?.response?.status === 404 ? 'Belge bulunamadı' : (error?.message || 'Belge yüklenirken hata oluştu'), url: undefined });
        }
    }, [residentId]);

    const fetchServiceContract = useCallback(async () => {
        try {
            setServiceContractDoc(prev => ({ ...prev, loading: true, error: null }));
            const response = await adminResidentService.getServiceContract(residentId);
            const url = response?.data ? (response.data instanceof Blob ? URL.createObjectURL(response.data) : response.data.staticUrl || response.data) : undefined;
            setServiceContractDoc({ loading: false, error: url ? null : 'Belge bulunamadı', url });
        } catch (error: any) {
            setServiceContractDoc({ loading: false, error: error?.response?.status === 404 ? 'Belge bulunamadı' : (error?.message || 'Belge yüklenirken hata oluştu'), url: undefined });
        }
    }, [residentId]);

    const fetchDocumentsIds = useCallback(async () => {
        try {
            setDocumentsIdsDoc(prev => ({ ...prev, loading: true, error: null }));
            const response = await adminResidentService.getDocumentsIds(residentId);
            const url = response?.data ? (response.data instanceof Blob ? URL.createObjectURL(response.data) : response.data.staticUrl || response.data) : undefined;
            setDocumentsIdsDoc({ loading: false, error: url ? null : 'Belge bulunamadı', url });
        } catch (error: any) {
            setDocumentsIdsDoc({ loading: false, error: error?.response?.status === 404 ? 'Belge bulunamadı' : (error?.message || 'Belge yüklenirken hata oluştu'), url: undefined });
        }
    }, [residentId]);

    const fetchHandoverReport = useCallback(async () => {
        try {
            setHandoverReportDoc(prev => ({ ...prev, loading: true, error: null }));
            const response = await adminResidentService.getHandoverReport(residentId);
            const url = response?.data ? (response.data instanceof Blob ? URL.createObjectURL(response.data) : response.data.staticUrl || response.data) : undefined;
            setHandoverReportDoc({ loading: false, error: url ? null : 'Belge bulunamadı', url });
        } catch (error: any) {
            setHandoverReportDoc({ loading: false, error: error?.response?.status === 404 ? 'Belge bulunamadı' : (error?.message || 'Belge yüklenirken hata oluştu'), url: undefined });
        }
    }, [residentId]);

    const fetchSecurityForm = useCallback(async () => {
        try {
            setSecurityFormDoc(prev => ({ ...prev, loading: true, error: null }));
            const response = await adminResidentService.getSecurityForm(residentId);
            const url = response?.data ? (response.data instanceof Blob ? URL.createObjectURL(response.data) : response.data.staticUrl || response.data) : undefined;
            setSecurityFormDoc({ loading: false, error: url ? null : 'Belge bulunamadı', url });
        } catch (error: any) {
            setSecurityFormDoc({ loading: false, error: error?.response?.status === 404 ? 'Belge bulunamadı' : (error?.message || 'Belge yüklenirken hata oluştu'), url: undefined });
        }
    }, [residentId]);

    const fetchVehicleSticker = useCallback(async () => {
        try {
            setVehicleStickerDoc(prev => ({ ...prev, loading: true, error: null }));
            const response = await adminResidentService.getVehicleSticker(residentId);
            const url = response?.data ? (response.data instanceof Blob ? URL.createObjectURL(response.data) : response.data.staticUrl || response.data) : undefined;
            setVehicleStickerDoc({ loading: false, error: url ? null : 'Belge bulunamadı', url });
        } catch (error: any) {
            setVehicleStickerDoc({ loading: false, error: error?.response?.status === 404 ? 'Belge bulunamadı' : (error?.message || 'Belge yüklenirken hata oluştu'), url: undefined });
        }
    }, [residentId]);

    const fetchOtherDocument = useCallback(async () => {
        try {
            setOtherDoc(prev => ({ ...prev, loading: true, error: null }));
            const response = await adminResidentService.getOtherDocument(residentId);
            const url = response?.data ? (response.data instanceof Blob ? URL.createObjectURL(response.data) : response.data.staticUrl || response.data) : undefined;
            setOtherDoc({ loading: false, error: url ? null : 'Belge bulunamadı', url });
        } catch (error: any) {
            setOtherDoc({ loading: false, error: error?.response?.status === 404 ? 'Belge bulunamadı' : (error?.message || 'Belge yüklenirken hata oluştu'), url: undefined });
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

    // Upload extended types
    const uploadPurchaseContract = useCallback(async (file: File) => {
        try {
            setUploadStates(prev => ({ ...prev, purchaseContract: { uploading: true, progress: 0, error: null } }));
            await adminResidentService.uploadPurchaseContract(residentId, file, (progress) => {
                setUploadStates(prev => ({ ...prev, purchaseContract: { ...prev.purchaseContract, progress } }));
            });
            setUploadStates(prev => ({ ...prev, purchaseContract: { uploading: false, progress: 100, error: null } }));
            await fetchPurchaseContract();
        } catch (error: any) {
            setUploadStates(prev => ({ ...prev, purchaseContract: { uploading: false, progress: 0, error: error?.message || 'Belge yüklenirken hata oluştu' } }));
        }
    }, [residentId, fetchPurchaseContract]);

    const uploadServiceContract = useCallback(async (file: File) => {
        try {
            setUploadStates(prev => ({ ...prev, serviceContract: { uploading: true, progress: 0, error: null } }));
            await adminResidentService.uploadServiceContract(residentId, file, (progress) => {
                setUploadStates(prev => ({ ...prev, serviceContract: { ...prev.serviceContract, progress } }));
            });
            setUploadStates(prev => ({ ...prev, serviceContract: { uploading: false, progress: 100, error: null } }));
            await fetchServiceContract();
        } catch (error: any) {
            setUploadStates(prev => ({ ...prev, serviceContract: { uploading: false, progress: 0, error: error?.message || 'Belge yüklenirken hata oluştu' } }));
        }
    }, [residentId, fetchServiceContract]);

    const uploadDocumentsIds = useCallback(async (file: File) => {
        try {
            setUploadStates(prev => ({ ...prev, documentsIds: { uploading: true, progress: 0, error: null } }));
            await adminResidentService.uploadDocumentsIds(residentId, file, (progress) => {
                setUploadStates(prev => ({ ...prev, documentsIds: { ...prev.documentsIds, progress } }));
            });
            setUploadStates(prev => ({ ...prev, documentsIds: { uploading: false, progress: 100, error: null } }));
            await fetchDocumentsIds();
        } catch (error: any) {
            setUploadStates(prev => ({ ...prev, documentsIds: { uploading: false, progress: 0, error: error?.message || 'Belge yüklenirken hata oluştu' } }));
        }
    }, [residentId, fetchDocumentsIds]);

    const uploadHandoverReport = useCallback(async (file: File) => {
        try {
            setUploadStates(prev => ({ ...prev, handoverReport: { uploading: true, progress: 0, error: null } }));
            await adminResidentService.uploadHandoverReport(residentId, file, (progress) => {
                setUploadStates(prev => ({ ...prev, handoverReport: { ...prev.handoverReport, progress } }));
            });
            setUploadStates(prev => ({ ...prev, handoverReport: { uploading: false, progress: 100, error: null } }));
            await fetchHandoverReport();
        } catch (error: any) {
            setUploadStates(prev => ({ ...prev, handoverReport: { uploading: false, progress: 0, error: error?.message || 'Belge yüklenirken hata oluştu' } }));
        }
    }, [residentId, fetchHandoverReport]);

    const uploadSecurityForm = useCallback(async (file: File) => {
        try {
            setUploadStates(prev => ({ ...prev, securityForm: { uploading: true, progress: 0, error: null } }));
            await adminResidentService.uploadSecurityForm(residentId, file, (progress) => {
                setUploadStates(prev => ({ ...prev, securityForm: { ...prev.securityForm, progress } }));
            });
            setUploadStates(prev => ({ ...prev, securityForm: { uploading: false, progress: 100, error: null } }));
            await fetchSecurityForm();
        } catch (error: any) {
            setUploadStates(prev => ({ ...prev, securityForm: { uploading: false, progress: 0, error: error?.message || 'Belge yüklenirken hata oluştu' } }));
        }
    }, [residentId, fetchSecurityForm]);

    const uploadVehicleSticker = useCallback(async (file: File) => {
        try {
            setUploadStates(prev => ({ ...prev, vehicleSticker: { uploading: true, progress: 0, error: null } }));
            await adminResidentService.uploadVehicleSticker(residentId, file, (progress) => {
                setUploadStates(prev => ({ ...prev, vehicleSticker: { ...prev.vehicleSticker, progress } }));
            });
            setUploadStates(prev => ({ ...prev, vehicleSticker: { uploading: false, progress: 100, error: null } }));
            await fetchVehicleSticker();
        } catch (error: any) {
            setUploadStates(prev => ({ ...prev, vehicleSticker: { uploading: false, progress: 0, error: error?.message || 'Belge yüklenirken hata oluştu' } }));
        }
    }, [residentId, fetchVehicleSticker]);

    const uploadOtherDocument = useCallback(async (file: File) => {
        try {
            setUploadStates(prev => ({ ...prev, other: { uploading: true, progress: 0, error: null } }));
            await adminResidentService.uploadOtherDocument(residentId, file, (progress) => {
                setUploadStates(prev => ({ ...prev, other: { ...prev.other, progress } }));
            });
            setUploadStates(prev => ({ ...prev, other: { uploading: false, progress: 100, error: null } }));
            await fetchOtherDocument();
        } catch (error: any) {
            setUploadStates(prev => ({ ...prev, other: { uploading: false, progress: 0, error: error?.message || 'Belge yüklenirken hata oluştu' } }));
        }
    }, [residentId, fetchOtherDocument]);

    // Clear document error
    const clearDocumentError = useCallback((type: keyof UseResidentDocumentsReturn['uploadStates']) => {
        switch (type) {
            case 'nationalId':
                setNationalIdDoc(prev => ({ ...prev, error: null }));
                break;
            case 'ownership':
                setOwnershipDoc(prev => ({ ...prev, error: null }));
                break;
            case 'purchaseContract':
                setPurchaseContractDoc(prev => ({ ...prev, error: null }));
                break;
            case 'serviceContract':
                setServiceContractDoc(prev => ({ ...prev, error: null }));
                break;
            case 'documentsIds':
                setDocumentsIdsDoc(prev => ({ ...prev, error: null }));
                break;
            case 'handoverReport':
                setHandoverReportDoc(prev => ({ ...prev, error: null }));
                break;
            case 'securityForm':
                setSecurityFormDoc(prev => ({ ...prev, error: null }));
                break;
            case 'vehicleSticker':
                setVehicleStickerDoc(prev => ({ ...prev, error: null }));
                break;
            case 'other':
                setOtherDoc(prev => ({ ...prev, error: null }));
                break;
            default:
                break;
        }
    }, []);

    // Refresh all documents
    const refreshDocuments = useCallback(async () => {
        await Promise.all([
            fetchNationalIdDocument(),
            fetchOwnershipDocument(),
            fetchPurchaseContract(),
            fetchServiceContract(),
            fetchDocumentsIds(),
            fetchHandoverReport(),
            fetchSecurityForm(),
            fetchVehicleSticker(),
            fetchOtherDocument(),
        ]);
    }, [
        fetchNationalIdDocument,
        fetchOwnershipDocument,
        fetchPurchaseContract,
        fetchServiceContract,
        fetchDocumentsIds,
        fetchHandoverReport,
        fetchSecurityForm,
        fetchVehicleSticker,
        fetchOtherDocument,
    ]);

    // Auto-fetch on mount
    useEffect(() => {
        if (autoFetch && residentId) {
            refreshDocuments();
        }
    }, [autoFetch, residentId, refreshDocuments]);

    return {
        nationalIdDoc,
        ownershipDoc,
        purchaseContractDoc,
        serviceContractDoc,
        documentsIdsDoc,
        handoverReportDoc,
        securityFormDoc,
        vehicleStickerDoc,
        otherDoc,
        uploadStates,
        fetchNationalIdDocument,
        fetchOwnershipDocument,
        fetchPurchaseContract,
        fetchServiceContract,
        fetchDocumentsIds,
        fetchHandoverReport,
        fetchSecurityForm,
        fetchVehicleSticker,
        fetchOtherDocument,
        uploadNationalIdDocument,
        uploadOwnershipDocument,
        uploadPurchaseContract,
        uploadServiceContract,
        uploadDocumentsIds,
        uploadHandoverReport,
        uploadSecurityForm,
        uploadVehicleSticker,
        uploadOtherDocument,
        clearDocumentError,
        refreshDocuments
    };
}; 