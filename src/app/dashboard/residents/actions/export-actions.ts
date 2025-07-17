import { ExportHandlers } from '../types';
import { EXPORT_FORMATS } from '../constants';
import { residentsApiService } from '../services/residents-api.service';
import { ResidentFilterParams } from '@/services/types/resident.types';

function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

/**
 * Toast notification functions interface
 */
interface ToastFunctions {
    success: (title: string, message: string) => void;
    info: (title: string, message: string) => void;
    error: (title: string, message: string) => void;
}

/**
 * Export action handlers class
 */
export class ExportActionHandlers {
    private toast: ToastFunctions;

    constructor(toast: ToastFunctions) {
        this.toast = toast;
    }

    /**
     * Simulate export delay
     */
    private simulateExport = async (format: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    };

    /**
     * Handle PDF export
     */
    handleExportPDF = async (filters?: ResidentFilterParams): Promise<void> => {
        try {
            this.toast.success('PDF İndiriliyor', 'Sakin listesi PDF formatında hazırlanıyor...');
            const blob = await residentsApiService.exportResidents('pdf', filters);
            downloadBlob(blob, `sakinler_${new Date().toISOString().slice(0,10)}.pdf`);
            this.toast.success('PDF İndirildi', 'Sakin listesi başarıyla PDF olarak indirildi');
        } catch (error: any) {
            this.toast.error('PDF İndirme Hatası', error?.message || 'PDF indirme sırasında bir hata oluştu');
        }
    };

    /**
     * Handle Excel export
     */
    handleExportExcel = async (filters?: ResidentFilterParams): Promise<void> => {
        try {
            this.toast.success('Excel İndiriliyor', 'Sakin listesi Excel formatında hazırlanıyor...');
            const blob = await residentsApiService.exportResidents('excel', filters);
            downloadBlob(blob, `sakinler_${new Date().toISOString().slice(0,10)}.xlsx`);
            this.toast.success('Excel İndirildi', 'Sakin listesi başarıyla Excel olarak indirildi');
        } catch (error: any) {
            this.toast.error('Excel İndirme Hatası', error?.message || 'Excel indirme sırasında bir hata oluştu');
        }
    };

    /**
     * Handle CSV export
     */
    handleExportCSV = async (filters?: ResidentFilterParams): Promise<void> => {
        try {
            this.toast.success('CSV İndiriliyor', 'Sakin listesi CSV formatında hazırlanıyor...');
            const blob = await residentsApiService.exportResidents('csv', filters);
            downloadBlob(blob, `sakinler_${new Date().toISOString().slice(0,10)}.csv`);
            this.toast.success('CSV İndirildi', 'Sakin listesi başarıyla CSV olarak indirildi');
        } catch (error: any) {
            this.toast.error('CSV İndirme Hatası', error?.message || 'CSV indirme sırasında bir hata oluştu');
        }
    };

    /**
     * Handle JSON export
     */
    handleExportJSON = async (filters?: ResidentFilterParams): Promise<void> => {
        try {
            this.toast.success('JSON İndiriliyor', 'Sakin listesi JSON formatında hazırlanıyor...');
            const blob = await residentsApiService.exportResidents('json', filters);
            downloadBlob(blob, `sakinler_${new Date().toISOString().slice(0,10)}.json`);
            this.toast.success('JSON İndirildi', 'Sakin listesi başarıyla JSON olarak indirildi');
        } catch (error: any) {
            this.toast.error('JSON İndirme Hatası', error?.message || 'JSON indirme sırasında bir hata oluştu');
        }
    };

    /**
     * Get all export handlers
     */
    getExportHandlers = (): ExportHandlers => {
        return {
            handleExportPDF: this.handleExportPDF,
            handleExportExcel: this.handleExportExcel,
            handleExportCSV: this.handleExportCSV,
            handleExportJSON: this.handleExportJSON,
        };
    };
}

/**
 * Create export action handlers instance
 */
export const createExportActionHandlers = (toast: ToastFunctions): ExportHandlers => {
    const handlers = new ExportActionHandlers(toast);
    return handlers.getExportHandlers();
}; 