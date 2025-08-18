'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  Wrench, 
  BarChart3,
  Save,
  RotateCcw,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Tabs from '@/app/components/ui/Tabs';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Label from '@/app/components/ui/Label';
import { enumsService } from '@/services/enums.service';
import { EnumsResponse } from '@/services/enums.service';

// Breadcrumb Items
const BREADCRUMB_ITEMS = [
  { label: 'Ana Sayfa', href: '/dashboard' },
  { label: 'Ayarlar', href: '/settings' },
  { label: 'Sistem Parametreleri', active: true }
];

// System Parameters Interface
interface SystemParameters {
  // General Settings
  siteName: string;
  siteSlogan: string;
  defaultLanguage: string;
  timezone: string;
  primaryColor: string;
  defaultTheme: string;
  
  // Financial Settings
  apartmentDues: number;
  villaDues: number;
  commercialDues: number;
  parkingDues: number;
  lateInterestRate: number;
  paymentDueDays: number;
  debtWarningThreshold: number;
  
  // Notification Settings
  duesReminder: boolean;
  maintenanceNotification: boolean;
  reminderDays: string;
  emailTemplate: string;
  
  // Security Settings
  passwordMinLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  
  // Operational Settings
  responseTime: number;
  resolutionTime: number;
  workStartTime: string;
  workEndTime: string;
  
  // Reporting Settings
  defaultReportFormat: string;
  dataRetentionMonths: number;
  exportLimit: number;
  autoMonthlyReport: boolean;
}

// Default Values
const DEFAULT_PARAMETERS: SystemParameters = {
  siteName: 'NinetyNine Property Management',
  siteSlogan: 'Akıllı Apartman Yönetimi',
  defaultLanguage: 'tr',
  timezone: 'Europe/Istanbul',
  primaryColor: '#AC8D6A',
  defaultTheme: 'auto',
  apartmentDues: 450.00,
  villaDues: 850.00,
  commercialDues: 1200.00,
  parkingDues: 75.00,
  lateInterestRate: 2.5,
  paymentDueDays: 10,
  debtWarningThreshold: 1000.00,
  duesReminder: true,
  maintenanceNotification: true,
  reminderDays: '7,3,1',
  emailTemplate: 'professional',
  passwordMinLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  responseTime: 2,
  resolutionTime: 24,
  workStartTime: '09:00',
  workEndTime: '18:00',
  defaultReportFormat: 'pdf',
  dataRetentionMonths: 12,
  exportLimit: 1000,
  autoMonthlyReport: true,
};

// Tab Components with Props
function GeneralTab({ 
  parameters, 
  onParameterChange, 
  enumsData 
}: { 
  parameters: SystemParameters; 
  onParameterChange: (key: keyof SystemParameters, value: any) => void;
  enumsData: EnumsResponse | null;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
            Site Bilgileri
          </h3>
          <p className="text-sm text-text-light-secondary dark:text-text-secondary">
            Temel site ayarları ve görünüm tercihleri
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Site Adı"
            value={parameters.siteName}
            onChange={(e) => onParameterChange('siteName', e.target.value)}
            placeholder="NinetyNine Property Management"
          />
          <Input
            label="Site Sloganı"
            value={parameters.siteSlogan}
            onChange={(e) => onParameterChange('siteSlogan', e.target.value)}
            placeholder="Akıllı Apartman Yönetimi"
          />
          <div>
            <Label htmlFor="language" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
              Varsayılan Dil
            </Label>
            <Select
              value={parameters.defaultLanguage}
              onChange={(value) => onParameterChange('defaultLanguage', value)}
              options={[
                { value: 'tr', label: 'Türkçe' },
                { value: 'en', label: 'English' }
              ]}
            />
          </div>
          <div>
            <Label htmlFor="timezone" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
              Zaman Dilimi
            </Label>
            <Select
              value={parameters.timezone}
              onChange={(value) => onParameterChange('timezone', value)}
              options={[
                { value: 'Europe/Istanbul', label: 'İstanbul (UTC+3)' },
                { value: 'Europe/London', label: 'Londra (UTC+0)' }
              ]}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
            Tema & Görünüm
          </h3>
          <p className="text-sm text-text-light-secondary dark:text-text-secondary">
            Kullanıcı arayüzü ve renk şeması ayarları
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Birincil Renk"
            type="color"
            value={parameters.primaryColor}
            onChange={(e) => onParameterChange('primaryColor', e.target.value)}
          />
          <div>
            <Label htmlFor="theme" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
              Varsayılan Tema
            </Label>
            <Select
              value={parameters.defaultTheme}
              onChange={(value) => onParameterChange('defaultTheme', value)}
              options={[
                { value: 'light', label: 'Açık Tema' },
                { value: 'dark', label: 'Koyu Tema' },
                { value: 'auto', label: 'Sistem Tercihine Göre' }
              ]}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function FinancialTab({ 
  parameters, 
  onParameterChange, 
  enumsData 
}: { 
  parameters: SystemParameters; 
  onParameterChange: (key: keyof SystemParameters, value: any) => void;
  enumsData: EnumsResponse | null;
}) {
  // Get currency options from enums
  const currencyOptions = enumsData?.data?.billing?.currency?.map(currency => ({
    value: currency,
    label: currency.toUpperCase()
  })) || [
    { value: 'TRY', label: 'TRY' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
            Aidat Tutarları
          </h3>
          <p className="text-sm text-text-light-secondary dark:text-text-secondary">
            Daire türlerine göre aylık aidat miktarları
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Apartman Dairesi"
            type="number"
            value={parameters.apartmentDues}
            onChange={(e) => onParameterChange('apartmentDues', parseFloat(e.target.value) || 0)}
            placeholder="450.00"
          />
          <Input
            label="Villa"
            type="number"
            value={parameters.villaDues}
            onChange={(e) => onParameterChange('villaDues', parseFloat(e.target.value) || 0)}
            placeholder="850.00"
          />
          <Input
            label="Ticari Alan"
            type="number"
            value={parameters.commercialDues}
            onChange={(e) => onParameterChange('commercialDues', parseFloat(e.target.value) || 0)}
            placeholder="1200.00"
          />
          <Input
            label="Otopark"
            type="number"
            value={parameters.parkingDues}
            onChange={(e) => onParameterChange('parkingDues', parseFloat(e.target.value) || 0)}
            placeholder="75.00"
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
            Ödeme Koşulları
          </h3>
          <p className="text-sm text-text-light-secondary dark:text-text-secondary">
            Gecikme faizi ve ödeme süreleri
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Input
            label="Gecikme Faiz Oranı (%)"
            type="number"
            value={parameters.lateInterestRate}
            onChange={(e) => onParameterChange('lateInterestRate', parseFloat(e.target.value) || 0)}
            placeholder="2.5"
          />
          <Input
            label="Ödeme Vadesi (Gün)"
            type="number"
            value={parameters.paymentDueDays}
            onChange={(e) => onParameterChange('paymentDueDays', parseInt(e.target.value) || 0)}
            placeholder="10"
          />
          <Input
            label="Borç Uyarı Eşiği"
            type="number"
            value={parameters.debtWarningThreshold}
            onChange={(e) => onParameterChange('debtWarningThreshold', parseFloat(e.target.value) || 0)}
            placeholder="1000.00"
          />
        </div>
      </Card>
    </div>
  );
}

function NotificationTab({ 
  parameters, 
  onParameterChange, 
  enumsData 
}: { 
  parameters: SystemParameters; 
  onParameterChange: (key: keyof SystemParameters, value: any) => void;
  enumsData: EnumsResponse | null;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
            E-posta Bildirimleri
          </h3>
          <p className="text-sm text-text-light-secondary dark:text-text-secondary">
            Otomatik e-posta gönderimi ayarları
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                  Aidat Hatırlatması
                </label>
                <p className="text-xs text-text-light-muted dark:text-text-muted">
                  Ödeme vadesi yaklaştığında gönderilir
                </p>
              </div>
              <input
                type="checkbox"
                checked={parameters.duesReminder}
                onChange={(e) => onParameterChange('duesReminder', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                  Bakım Talebi Bildirimi
                </label>
                <p className="text-xs text-text-light-muted dark:text-text-muted">
                  Yeni talep oluşturulduğunda gönderilir
                </p>
              </div>
              <input
                type="checkbox"
                checked={parameters.maintenanceNotification}
                onChange={(e) => onParameterChange('maintenanceNotification', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Hatırlatma Günleri"
              value={parameters.reminderDays}
              onChange={(e) => onParameterChange('reminderDays', e.target.value)}
              placeholder="7,3,1"
            />
            <div>
              <Label htmlFor="emailTemplate" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                E-posta Şablonu
              </Label>
              <Select
                value={parameters.emailTemplate}
                onChange={(value) => onParameterChange('emailTemplate', value)}
                options={[
                  { value: 'professional', label: 'Profesyonel' },
                  { value: 'friendly', label: 'Samimi' },
                  { value: 'formal', label: 'Resmi' }
                ]}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SecurityTab({ 
  parameters, 
  onParameterChange, 
  enumsData 
}: { 
  parameters: SystemParameters; 
  onParameterChange: (key: keyof SystemParameters, value: any) => void;
  enumsData: EnumsResponse | null;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
            Şifre Politikası
          </h3>
          <p className="text-sm text-text-light-secondary dark:text-text-secondary">
            Güvenli şifre gereksinimleri
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Minimum Karakter Sayısı"
            type="number"
            value={parameters.passwordMinLength}
            onChange={(e) => onParameterChange('passwordMinLength', parseInt(e.target.value) || 0)}
            placeholder="8"
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                  Büyük Harf Zorunlu
                </label>
                <p className="text-xs text-text-light-muted dark:text-text-muted">
                  En az bir büyük harf içermeli
                </p>
              </div>
              <input
                type="checkbox"
                checked={parameters.requireUppercase}
                onChange={(e) => onParameterChange('requireUppercase', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                  Rakam Zorunlu
                </label>
                <p className="text-xs text-text-light-muted dark:text-text-muted">
                  En az bir rakam içermeli
                </p>
              </div>
              <input
                type="checkbox"
                checked={parameters.requireNumbers}
                onChange={(e) => onParameterChange('requireNumbers', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function OperationalTab({ 
  parameters, 
  onParameterChange, 
  enumsData 
}: { 
  parameters: SystemParameters; 
  onParameterChange: (key: keyof SystemParameters, value: any) => void;
  enumsData: EnumsResponse | null;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
            Bakım ve Talep Yönetimi
          </h3>
          <p className="text-sm text-text-light-secondary dark:text-text-secondary">
            Operasyonel süreçler ve SLA ayarları
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Yanıtlama Süresi (Saat)"
            type="number"
            value={parameters.responseTime}
            onChange={(e) => onParameterChange('responseTime', parseInt(e.target.value) || 0)}
            placeholder="2"
          />
          <Input
            label="Çözüm Süresi (Saat)"
            type="number"
            value={parameters.resolutionTime}
            onChange={(e) => onParameterChange('resolutionTime', parseInt(e.target.value) || 0)}
            placeholder="24"
          />
          <Input
            label="Çalışma Başlangıcı"
            type="time"
            value={parameters.workStartTime}
            onChange={(e) => onParameterChange('workStartTime', e.target.value)}
          />
          <Input
            label="Çalışma Bitişi"
            type="time"
            value={parameters.workEndTime}
            onChange={(e) => onParameterChange('workEndTime', e.target.value)}
          />
        </div>
      </Card>
    </div>
  );
}

function ReportingTab({ 
  parameters, 
  onParameterChange, 
  enumsData 
}: { 
  parameters: SystemParameters; 
  onParameterChange: (key: keyof SystemParameters, value: any) => void;
  enumsData: EnumsResponse | null;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-2">
            Rapor Ayarları
          </h3>
          <p className="text-sm text-text-light-secondary dark:text-text-secondary">
            Otomatik raporlama ve saklama süreleri
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="reportFormat" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
              Varsayılan Rapor Formatı
            </Label>
            <Select
              value={parameters.defaultReportFormat}
              onChange={(value) => onParameterChange('defaultReportFormat', value)}
              options={[
                { value: 'pdf', label: 'PDF' },
                { value: 'excel', label: 'Excel' },
                { value: 'csv', label: 'CSV' }
              ]}
            />
          </div>
          <Input
            label="Data Saklama Süresi (Ay)"
            type="number"
            value={parameters.dataRetentionMonths}
            onChange={(e) => onParameterChange('dataRetentionMonths', parseInt(e.target.value) || 0)}
            placeholder="12"
          />
          <Input
            label="Export Limiti"
            type="number"
            value={parameters.exportLimit}
            onChange={(e) => onParameterChange('exportLimit', parseInt(e.target.value) || 0)}
            placeholder="1000"
          />
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                Otomatik Aylık Rapor
              </label>
              <p className="text-xs text-text-light-muted dark:text-text-muted">
                Her ayın 1'inde otomatik rapor gönder
              </p>
            </div>
            <input
              type="checkbox"
              checked={parameters.autoMonthlyReport}
              onChange={(e) => onParameterChange('autoMonthlyReport', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function SystemParametersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enumsData, setEnumsData] = useState<EnumsResponse | null>(null);
  const [parameters, setParameters] = useState<SystemParameters>(DEFAULT_PARAMETERS);

  // Load enums data and parameters on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Load enums data
        console.log('🔄 Loading enums data...');
        const enums = await enumsService.getAllEnums();
        setEnumsData(enums);
        console.log('✅ Enums loaded:', enums);
        
        // Load parameters from localStorage
        const stored = localStorage.getItem('system_parameters');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setParameters(parsed);
            console.log('✅ System parameters loaded from localStorage');
          } catch (error) {
            console.error('❌ Failed to parse stored parameters:', error);
            setParameters(DEFAULT_PARAMETERS);
          }
        } else {
          console.log('ℹ️ No stored parameters found, using defaults');
          setParameters(DEFAULT_PARAMETERS);
        }
        
      } catch (error) {
        console.error('❌ Failed to initialize data:', error);
        setParameters(DEFAULT_PARAMETERS);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Handle parameter changes
  const handleParameterChange = (key: keyof SystemParameters, value: any) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  // Save parameters to localStorage and API
  const handleSave = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('system_parameters', JSON.stringify(parameters));
      
      // TODO: Save to API endpoint
      console.log('💾 Saving system parameters:', parameters);
      
      setHasChanges(false);
      console.log('✅ Parameters saved successfully');
    } catch (error) {
      console.error('❌ Failed to save parameters:', error);
    }
  };

  const handleReset = () => {
    setParameters(DEFAULT_PARAMETERS);
    setHasChanges(false);
    console.log('🔄 Parameters reset to defaults');
  };

  const handlePreview = () => {
    console.log('👁️ Previewing changes:', parameters);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(parameters, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system-parameters.json';
    link.click();
    URL.revokeObjectURL(url);
    console.log('📤 Parameters exported');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imported = JSON.parse(e.target?.result as string);
            setParameters(imported);
            setHasChanges(true);
            console.log('📥 Parameters imported:', imported);
          } catch (error) {
            console.error('❌ Failed to parse imported file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Create tab items with props
  const TAB_ITEMS = [
    {
      id: 'general',
      label: 'Genel',
      icon: Settings,
      badge: undefined,
      content: <GeneralTab parameters={parameters} onParameterChange={handleParameterChange} enumsData={enumsData} />
    },
    {
      id: 'financial',
      label: 'Finansal',
      icon: CreditCard,
      badge: undefined,
      content: <FinancialTab parameters={parameters} onParameterChange={handleParameterChange} enumsData={enumsData} />
    },
    {
      id: 'notification',
      label: 'Bildirim',
      icon: Bell,
      badge: undefined,
      content: <NotificationTab parameters={parameters} onParameterChange={handleParameterChange} enumsData={enumsData} />
    },
    {
      id: 'security',
      label: 'Güvenlik',
      icon: Shield,
      badge: undefined,
      content: <SecurityTab parameters={parameters} onParameterChange={handleParameterChange} enumsData={enumsData} />
    },
    {
      id: 'operational',
      label: 'Operasyonel',
      icon: Wrench,
      badge: undefined,
      content: <OperationalTab parameters={parameters} onParameterChange={handleParameterChange} enumsData={enumsData} />
    },
    {
      id: 'reporting',
      label: 'Raporlama',
      icon: BarChart3,
      badge: undefined,
      content: <ReportingTab parameters={parameters} onParameterChange={handleParameterChange} enumsData={enumsData} />
    }
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold mx-auto mb-4"></div>
            <p className="text-text-light-secondary dark:text-text-secondary">Sistem parametreleri yükleniyor...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content Area */}
        <div className="lg:ml-72">
          {/* Header */}
          <DashboardHeader 
            title="Sistem Parametreleri" 
            breadcrumbItems={BREADCRUMB_ITEMS}
          />
          
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header with Actions */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-1">
                  Sistem Parametreleri
                </h2>
                <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                  Sistem genelindeki parametreleri kategoriler halinde yönetin
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleImport}
                  icon={Upload}
                >
                  İçe Aktar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleExport}
                  icon={Download}
                >
                  Dışa Aktar
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePreview}
                  icon={Eye}
                  disabled={!hasChanges}
                >
                  Önizle
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                  icon={RotateCcw}
                >
                  Varsayılanlara Dön
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  icon={Save}
                  className={hasChanges ? 'animate-pulse' : ''}
                >
                  Kaydet
                </Button>
              </div>
            </div>

            {/* Tab Navigation & Content */}
            <Tabs
              items={TAB_ITEMS}
              variant="cards"
              size="md"
              fullWidth={false}
              defaultValue="general"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}