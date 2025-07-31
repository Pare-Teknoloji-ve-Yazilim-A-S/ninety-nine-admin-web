'use client';

import { useState } from 'react';
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

// Breadcrumb Items
const BREADCRUMB_ITEMS = [
  { label: 'Ana Sayfa', href: '/dashboard' },
  { label: 'Ayarlar', href: '/settings' },
  { label: 'Sistem Parametreleri', active: true }
];

// Tab Configuration
const TAB_ITEMS = [
  {
    id: 'general',
    label: 'Genel',
    icon: Settings,
    badge: undefined,
    content: <GeneralTab />
  },
  {
    id: 'financial',
    label: 'Finansal',
    icon: CreditCard,
    badge: undefined,
    content: <FinancialTab />
  },
  {
    id: 'notification',
    label: 'Bildirim',
    icon: Bell,
    badge: undefined,
    content: <NotificationTab />
  },
  {
    id: 'security',
    label: 'Güvenlik',
    icon: Shield,
    badge: undefined,
    content: <SecurityTab />
  },
  {
    id: 'operational',
    label: 'Operasyonel',
    icon: Wrench,
    badge: undefined,
    content: <OperationalTab />
  },
  {
    id: 'reporting',
    label: 'Raporlama',
    icon: BarChart3,
    badge: undefined,
    content: <ReportingTab />
  }
];

// Tab Components
function GeneralTab() {
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
            placeholder="NinetyNine Property Management"
          />
          <Input
            label="Site Sloganı"
            placeholder="Akıllı Apartman Yönetimi"
          />
          <Select
            label="Varsayılan Dil"
            options={[
              { value: 'tr', label: 'Türkçe' },
              { value: 'en', label: 'English' }
            ]}
          />
          <Select
            label="Zaman Dilimi"
            options={[
              { value: 'Europe/Istanbul', label: 'İstanbul (UTC+3)' },
              { value: 'Europe/London', label: 'Londra (UTC+0)' }
            ]}
          />
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
            defaultValue="#AC8D6A"
          />
          <Select
            label="Varsayılan Tema"
            options={[
              { value: 'light', label: 'Açık Tema' },
              { value: 'dark', label: 'Koyu Tema' },
              { value: 'auto', label: 'Sistem Tercihine Göre' }
            ]}
          />
        </div>
      </Card>
    </div>
  );
}

function FinancialTab() {
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
            placeholder="450.00"
          />
          <Input
            label="Villa"
            type="number"
            placeholder="850.00"
          />
          <Input
            label="Ticari Alan"
            type="number"
            placeholder="1200.00"
          />
          <Input
            label="Otopark"
            type="number"
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
            label="Gecikme Faiz Oranı"
            type="number"
            placeholder="2.5"
          />
          <Input
            label="Ödeme Vadesi"
            type="number"
            placeholder="10"
          />
          <Input
            label="Borç Uyarı Eşiği"
            type="number"
            placeholder="1000.00"
          />
        </div>
      </Card>
    </div>
  );
}

function NotificationTab() {
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
                defaultChecked
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
                defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Hatırlatma Günleri"
              placeholder="7,3,1"
            />
            <Select
              label="E-posta Şablonu"
              options={[
                { value: 'professional', label: 'Profesyonel' },
                { value: 'friendly', label: 'Samimi' },
                { value: 'formal', label: 'Resmi' }
              ]}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function SecurityTab() {
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
                defaultChecked
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
                defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-primary-gold focus:ring-primary-gold"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function OperationalTab() {
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
            label="Yanıtlama Süresi"
            type="number"
            placeholder="2"
          />
          <Input
            label="Çözüm Süresi"
            type="number"
            placeholder="24"
          />
          <Input
            label="Çalışma Başlangıcı"
            type="time"
            defaultValue="09:00"
          />
          <Input
            label="Çalışma Bitişi"
            type="time"
            defaultValue="18:00"
          />
        </div>
      </Card>
    </div>
  );
}

function ReportingTab() {
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
          <Select
            label="Varsayılan Rapor Formatı"
            options={[
              { value: 'pdf', label: 'PDF' },
              { value: 'excel', label: 'Excel' },
              { value: 'csv', label: 'CSV' }
            ]}
          />
          <Input
            label="Data Saklama Süresi"
            type="number"
            placeholder="12"
          />
          <Input
            label="Export Limiti"
            type="number"
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
              defaultChecked
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

  const handleSave = () => {
    console.log('Saving system parameters...');
    setHasChanges(false);
  };

  const handleReset = () => {
    console.log('Resetting to defaults...');
    setHasChanges(false);
  };

  const handlePreview = () => {
    console.log('Previewing changes...');
  };

  const handleExport = () => {
    console.log('Exporting parameters...');
  };

  const handleImport = () => {
    console.log('Importing parameters...');
  };

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