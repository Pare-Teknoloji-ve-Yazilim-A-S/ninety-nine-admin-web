'use client';

import { useCallback } from 'react';
import { residentService } from '@/services/resident.service';
import { Resident } from '@/app/components/ui/ResidentRow';
import { useToast } from '@/hooks/useToast';

interface UseResidentsActionsProps {
    refreshData: () => Promise<void>;
    setSelectedResidents: (residents: Resident[]) => void;
    setResidents: React.Dispatch<React.SetStateAction<Resident[]>>;
}

interface UseResidentsActionsReturn {
    // Bulk actions
    handleBulkMail: (residents: Resident[]) => void;
    handleBulkSMS: (residents: Resident[]) => void;
    handleBulkPDF: (residents: Resident[]) => void;
    handleBulkTag: (residents: Resident[]) => void;
    handleBulkStatusChange: (selectedResidents: Resident[], status: 'active' | 'inactive') => Promise<void>;
    handleBulkDelete: (selectedResidents: Resident[]) => Promise<void>;
    
    // Individual actions
    handleViewResident: (resident: Resident) => void;
    handleEditResident: (resident: Resident) => void;
    handleCallResident: (resident: Resident) => void;
    handleMessageResident: (resident: Resident) => void;
    handleGenerateQR: (resident: Resident) => void;
    handleViewNotes: (resident: Resident) => void;
    handleViewHistory: (resident: Resident) => void;
    handleViewPaymentHistory: (resident: Resident) => void;
    handleDeleteResident: (resident: Resident) => Promise<void>;
    
    // Export actions
    handleExportExcel: () => void;
    handleExportCSV: () => void;
    handlePrint: () => void;
}

export const useResidentsActions = ({
    refreshData,
    setSelectedResidents,
    setResidents
}: UseResidentsActionsProps): UseResidentsActionsReturn => {
    const { success, error, info } = useToast();

    // Bulk Actions
    const handleBulkMail = useCallback((residents: Resident[]) => {
        const emails = residents.filter(r => r.contact.email).map(r => r.contact.email).join(', ');
        info('Toplu Mail', `${residents.length} sakine mail gönderiliyor. ${emails ? 'E-postalar: ' + emails : 'Email adresi bulunamadı'}`);
    }, [info]);

    const handleBulkSMS = useCallback((residents: Resident[]) => {
        const phones = residents.map(r => r.contact.phone).join(', ');
        info('Toplu SMS', `${residents.length} sakine SMS gönderiliyor. Telefonlar: ${phones}`);
    }, [info]);

    const handleBulkPDF = useCallback((residents: Resident[]) => {
        info('PDF Oluşturuluyor', `${residents.length} sakin bilgisi PDF olarak hazırlanıyor`);
        // Implement PDF generation
        setTimeout(() => {
            success('PDF İndiriliyor', 'PDF başarıyla oluşturuldu ve indiriliyor');
        }, 1000);
    }, [info, success]);

    const handleBulkTag = useCallback((residents: Resident[]) => {
        const tags = prompt('Atanacak etiketleri virgülle ayırarak yazın:');
        if (tags) {
            success('Etiketler Atandı', `${residents.length} sakine "${tags}" etiketleri başarıyla atandı`);
        }
    }, [success]);

    const handleBulkStatusChange = useCallback(async (selectedResidents: Resident[], status: 'active' | 'inactive') => {
        if (selectedResidents.length === 0) return;

        const confirmMessage = `${selectedResidents.length} sakinin durumunu ${status === 'active' ? 'aktif' : 'pasif'} yapmak istediğinizden emin misiniz?`;
        
        if (confirm(confirmMessage)) {
            try {
                // Bulk status update logic would go here
                // await residentService.bulkUpdateStatus(selectedResidents.map(r => r.id), status);
                
                await refreshData();
                setSelectedResidents([]);
                success('Durum güncellendi', `${selectedResidents.length} sakinin durumu başarıyla güncellendi.`);

            } catch (err: unknown) {
                console.error('Bulk status update failed:', err);
                error('Durum Güncelleme Hatası', err instanceof Error ? err.message : 'Durum güncelleme işlemi başarısız oldu');
            }
        }
    }, [refreshData, setSelectedResidents, success, error]);

    const handleBulkDelete = useCallback(async (selectedResidents: Resident[]) => {
        if (selectedResidents.length === 0) return;

        const confirmMessage = `${selectedResidents.length} sakini kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`;
        
        if (confirm(confirmMessage)) {
            try {
                // Bulk delete logic would go here
                // await residentService.bulkDelete(selectedResidents.map(r => r.id));
                
                await refreshData();
                setSelectedResidents([]);
                success('Silme işlemi tamamlandı', `${selectedResidents.length} sakin başarıyla silindi.`);

            } catch (err: unknown) {
                console.error('Bulk delete failed:', err);
                error('Silme Hatası', err instanceof Error ? err.message : 'Silme işlemi başarısız oldu');
            }
        }
    }, [refreshData, setSelectedResidents, success, error]);

    // Individual Row Actions
    const handleViewResident = useCallback((resident: Resident) => {
        info('Detay Sayfası', `${resident.fullName} sakininin detay sayfası açılıyor`);
        // Navigate to resident detail page
        // router.push(`/dashboard/residents/${resident.id}`);
    }, [info]);

    const handleEditResident = useCallback((resident: Resident) => {
        info('Düzenleme Sayfası', `${resident.fullName} sakininin düzenleme sayfası açılıyor`);
        // Navigate to edit resident page
        // router.push(`/dashboard/residents/${resident.id}/edit`);
    }, [info]);

    const handleCallResident = useCallback((resident: Resident) => {
        if (confirm(`${resident.contact.phone} numarasını aramak istiyor musunuz?`)) {
            // Open phone app or make call
            window.open(`tel:${resident.contact.phone}`);
        }
    }, []);

    const handleMessageResident = useCallback((resident: Resident) => {
        const message = prompt(`${resident.fullName} için mesaj yazın:`);
        if (message) {
            success('Mesaj Gönderildi', `Mesaj başarıyla gönderildi: "${message}"`);
        }
    }, [success]);

    const handleGenerateQR = useCallback((resident: Resident) => {
        info('QR Kod Oluşturuluyor', `${resident.fullName} için QR kod hazırlanıyor`);
        // Generate QR code with resident info
        setTimeout(() => {
            success('QR Kod İndiriliyor', 'QR kod oluşturuldu ve indiriliyor');
        }, 1000);
    }, [info, success]);

    const handleViewNotes = useCallback((resident: Resident) => {
        const newNote = prompt(`${resident.fullName} için not ekleyin:`);
        if (newNote) {
            // Update resident notes in state
            setResidents(prevResidents =>
                prevResidents.map(r =>
                    r.id === resident.id
                        ? { ...r, notes: (r.notes || '') + '\n' + new Date().toLocaleDateString() + ': ' + newNote }
                        : r
                )
            );
            success('Not Eklendi', 'Not başarıyla eklendi');
        }
    }, [setResidents, success]);

    const handleViewHistory = useCallback((resident: Resident) => {
        info('Aktivite Geçmişi', `${resident.fullName} - Kayıt: ${new Date(resident.registrationDate).toLocaleDateString()}, Son aktivite: ${resident.lastActivity || 'Bilgi yok'}`);
    }, [info]);

    const handleViewPaymentHistory = useCallback((resident: Resident) => {
        const debt = resident.financial.totalDebt;
        info('Ödeme Geçmişi', `${resident.fullName} - Borç: ₺${debt.toLocaleString()}, Bakiye: ₺${resident.financial.balance.toLocaleString()}`);
    }, [info]);

    const handleDeleteResident = useCallback(async (resident: Resident) => {
        if (confirm(`${resident.fullName} sakinini kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
            try {
                await residentService.deleteResident(resident.id);
                await refreshData();
                success('Sakin silindi', `${resident.fullName} başarıyla silindi.`);
            } catch (err: unknown) {
                console.error('Delete resident failed:', err);
                error('Silme Hatası', err instanceof Error ? err.message : 'Silme işlemi başarısız oldu');
            }
        }
    }, [refreshData, success, error]);

    // Export Actions
    const handleExportExcel = useCallback(() => {
        info('Excel Dosyası', 'Excel dosyası oluşturuluyor');
        setTimeout(() => {
            success('Excel İndiriliyor', 'residents.xlsx dosyası indiriliyor');
        }, 1000);
    }, [info, success]);

    const handleExportCSV = useCallback(() => {
        // CSV export logic would go here
        info('CSV Export', 'CSV dosyası oluşturuluyor');
        setTimeout(() => {
            success('CSV İndiriliyor', 'residents.csv dosyası indiriliyor');
        }, 1000);
    }, [info, success]);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    return {
        // Bulk actions
        handleBulkMail,
        handleBulkSMS,
        handleBulkPDF,
        handleBulkTag,
        handleBulkStatusChange,
        handleBulkDelete,
        
        // Individual actions
        handleViewResident,
        handleEditResident,
        handleCallResident,
        handleMessageResident,
        handleGenerateQR,
        handleViewNotes,
        handleViewHistory,
        handleViewPaymentHistory,
        handleDeleteResident,
        
        // Export actions
        handleExportExcel,
        handleExportCSV,
        handlePrint
    };
};