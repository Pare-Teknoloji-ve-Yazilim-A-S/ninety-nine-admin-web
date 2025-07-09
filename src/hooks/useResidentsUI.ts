'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseResidentsUIReturn {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    handleRefresh: () => Promise<void>;
    handleExport: () => void;
    handleAddResident: () => void;
}

interface UseResidentsUIProps {
    refreshData: () => Promise<void>;
}

export const useResidentsUI = ({ refreshData }: UseResidentsUIProps): UseResidentsUIReturn => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleRefresh = useCallback(async () => {
        try {
            await refreshData();
        } catch (error) {
            console.error('Failed to refresh residents:', error);
        }
    }, [refreshData]);

    const handleExport = useCallback(() => {
        const options = [
            'Excel (.xlsx)',
            'CSV (.csv)',
            'PDF',
            'Yazdır'
        ];

        const choice = prompt(`Dışa aktarma formatını seçin:\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\nSeçiminizi yazın (1-${options.length}):`);
        
        const choiceNum = choice ? parseInt(choice) - 1 : null;
        
        switch (choiceNum) {
            case 0:
                // handleExportExcel(); // Will be called from actions hook
                break;
            case 1:
                // handleExportCSV(); // Will be called from actions hook
                break;
            case 2:
                // handleExportPDF(); // Will be called from actions hook
                break;
            case 3:
                // handlePrint(); // Will be called from actions hook
                break;
            default:
                if (choice !== null) {
                    // warning('Geçersiz seçim!'); // Will be called from actions hook
                }
        }
    }, []);

    const handleAddResident = useCallback(() => {
        // Navigate to add resident page
        // router.push('/dashboard/residents/add');
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return {
        sidebarOpen,
        setSidebarOpen,
        handleRefresh,
        handleExport,
        handleAddResident
    };
};