import React, { useState, useEffect } from 'react';
import Button from '@/app/components/ui/Button';
import { Plus, RefreshCw, Wrench } from 'lucide-react';
import { TicketSummary } from '../hooks/useTicketSummary';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { CREATE_TICKET_PERMISSION_ID, CREATE_TICKET_PERMISSION_NAME } from '@/app/components/ui/Sidebar';

// New Request butonu için permission
const CREATE_REQUEST_PERMISSION_ID = '7b9ef408-4452-4a11-ad99-10682afabff6';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles
    serviceRequests: 'Hizmet Talepleri',
    maintenanceAndFaultManagement: 'Bakım ve Arıza Yönetimi',
    
    // Summary labels
    total: 'Toplam',
    open: 'Açık',
    inProgress: 'İşlemde',
    resolved: 'Çözülen',
    overdue: 'Gecikmiş',
    
    // Buttons
    refresh: 'Yenile',
    newRequest: 'Yeni Talep'
  },
  en: {
    // Page titles
    serviceRequests: 'Service Requests',
    maintenanceAndFaultManagement: 'Maintenance and Fault Management',
    
    // Summary labels
    total: 'Total',
    open: 'Open',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    overdue: 'Overdue',
    
    // Buttons
    refresh: 'Refresh',
    newRequest: 'New Request'
  },
  ar: {
    // Page titles
    serviceRequests: 'طلبات الخدمة',
    maintenanceAndFaultManagement: 'إدارة الصيانة والأعطال',
    
    // Summary labels
    total: 'المجموع',
    open: 'مفتوح',
    inProgress: 'قيد التنفيذ',
    resolved: 'تم الحل',
    overdue: 'متأخر',
    
    // Buttons
    refresh: 'تحديث',
    newRequest: 'طلب جديد'
  }
};

interface RequestsPageHeaderProps {
  summary: TicketSummary | null;
  onRefresh: () => void;
  onCreateRequest: () => void;
  loading: boolean;
}

export default function RequestsPageHeader({
  summary,
  onRefresh,
  onCreateRequest,
  loading = false
}: RequestsPageHeaderProps) {
  // Dil tercihini localStorage'dan al
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Create Ticket izin kontrolü
  const { hasPermission } = usePermissionCheck();
  const hasCreateTicketPermission = hasPermission(CREATE_TICKET_PERMISSION_NAME);
  
  // New Request butonu için permission kontrolü
  const hasCreateRequestPermission = hasPermission(CREATE_REQUEST_PERMISSION_ID);

  // Debug log
  console.log('Requests Page Header - CREATE_REQUEST_PERMISSION_ID:', CREATE_REQUEST_PERMISSION_ID);
  console.log('Requests Page Header - hasCreateRequestPermission:', hasCreateRequestPermission);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      {/* Left side - Title and Summary */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
            <Wrench className="h-6 w-6 text-primary-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
              {t.serviceRequests}
            </h1>
            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
              {t.maintenanceAndFaultManagement}
            </p>
          </div>
        </div>
        
        {/* Summary Stats */}
        {summary && (
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div>
              <span className="text-text-light-muted dark:text-text-muted">{t.total}: </span>
              <span className="font-semibold text-primary-gold">
                {loading ? '...' : summary.totalTickets}
              </span>
            </div>
            <div className="w-1 h-1 bg-text-light-muted dark:bg-text-muted rounded-full"></div>
            <div>
              <span className="text-text-light-muted dark:text-text-muted">{t.open}: </span>
              <span className="font-semibold text-semantic-info-600">
                {loading ? '...' : summary.openTickets}
              </span>
            </div>
            <div className="w-1 h-1 bg-text-light-muted dark:bg-text-muted rounded-full"></div>
            <div>
              <span className="text-text-light-muted dark:text-text-muted">{t.inProgress}: </span>
              <span className="font-semibold text-semantic-warning-600">
                {loading ? '...' : summary.inProgressTickets}
              </span>
            </div>
            <div className="w-1 h-1 bg-text-light-muted dark:bg-text-muted rounded-full"></div>
            <div>
              <span className="text-text-light-muted dark:text-text-muted">{t.resolved}: </span>
              <span className="font-semibold text-semantic-success-600">
                {loading ? '...' : summary.resolvedTickets}
              </span>
            </div>
            {summary.overdueTickets > 0 && (
              <>
                <div className="w-1 h-1 bg-text-light-muted dark:bg-text-muted rounded-full"></div>
                <div>
                  <span className="text-text-light-muted dark:text-text-muted">{t.overdue}: </span>
                  <span className="font-semibold text-primary-red">
                    {loading ? '...' : summary.overdueTickets}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right side - Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="secondary" 
          size="md" 
          icon={RefreshCw} 
          onClick={onRefresh}
          disabled={loading}
          isLoading={loading}
        >
          {t.refresh}
        </Button>
        {hasCreateRequestPermission && (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={onCreateRequest}
            disabled={loading}
          >
            {t.newRequest}
          </Button>
        )}
      </div>
    </div>
  );
}