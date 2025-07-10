import { ExportHandlers } from '../types';
import { EXPORT_FORMATS } from '../constants';

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
    handleExportPDF = async (): Promise<void> => {
        try {
            this.toast.success('PDF İndiriliyor', 'Sakin listesi PDF formatında hazırlanıyor...');
            await this.simulateExport(EXPORT_FORMATS.PDF);
            this.toast.success('PDF İndirildi', 'Sakin listesi başarıyla PDF olarak indirildi');
        } catch (error) {
            this.toast.error('PDF İndirme Hatası', 'PDF indirme sırasında bir hata oluştu');
        }
    };

    /**
     * Handle Excel export
     */
    handleExportExcel = async (): Promise<void> => {
        try {
            this.toast.success('Excel İndiriliyor', 'Sakin listesi Excel formatında hazırlanıyor...');
            await this.simulateExport(EXPORT_FORMATS.EXCEL);
            this.toast.success('Excel İndirildi', 'Sakin listesi başarıyla Excel olarak indirildi');
        } catch (error) {
            this.toast.error('Excel İndirme Hatası', 'Excel indirme sırasında bir hata oluştu');
        }
    };

    /**
     * Handle CSV export
     */
    handleExportCSV = async (): Promise<void> => {
        try {
            this.toast.success('CSV İndiriliyor', 'Sakin listesi CSV formatında hazırlanıyor...');
            await this.simulateExport(EXPORT_FORMATS.CSV);
            this.toast.success('CSV İndirildi', 'Sakin listesi başarıyla CSV olarak indirildi');
        } catch (error) {
            this.toast.error('CSV İndirme Hatası', 'CSV indirme sırasında bir hata oluştu');
        }
    };

    /**
     * Handle JSON export
     */
    handleExportJSON = async (): Promise<void> => {
        try {
            this.toast.success('JSON İndiriliyor', 'Sakin listesi JSON formatında hazırlanıyor...');
            await this.simulateExport(EXPORT_FORMATS.JSON);
            this.toast.success('JSON İndirildi', 'Sakin listesi başarıyla JSON olarak indirildi');
        } catch (error) {
            this.toast.error('JSON İndirme Hatası', 'JSON indirme sırasında bir hata oluştu');
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