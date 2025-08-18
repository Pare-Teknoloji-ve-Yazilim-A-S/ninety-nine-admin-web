import React from 'react';
import Button from '@/app/components/ui/Button';
import { Plus, RefreshCw, Wrench } from 'lucide-react';
import { TicketSummary } from '../hooks/useTicketSummary';

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
              Hizmet Talepleri
            </h1>
            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
              Bakım ve Arıza Yönetimi
            </p>
          </div>
        </div>
        
        {/* Summary Stats */}
        {summary && (
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div>
              <span className="text-text-light-muted dark:text-text-muted">Toplam: </span>
              <span className="font-semibold text-primary-gold">
                {loading ? '...' : summary.totalTickets}
              </span>
            </div>
            <div className="w-1 h-1 bg-text-light-muted dark:bg-text-muted rounded-full"></div>
            <div>
              <span className="text-text-light-muted dark:text-text-muted">Açık: </span>
              <span className="font-semibold text-semantic-info-600">
                {loading ? '...' : summary.openTickets}
              </span>
            </div>
            <div className="w-1 h-1 bg-text-light-muted dark:bg-text-muted rounded-full"></div>
            <div>
              <span className="text-text-light-muted dark:text-text-muted">İşlemde: </span>
              <span className="font-semibold text-semantic-warning-600">
                {loading ? '...' : summary.inProgressTickets}
              </span>
            </div>
            <div className="w-1 h-1 bg-text-light-muted dark:bg-text-muted rounded-full"></div>
            <div>
              <span className="text-text-light-muted dark:text-text-muted">Çözülen: </span>
              <span className="font-semibold text-semantic-success-600">
                {loading ? '...' : summary.resolvedTickets}
              </span>
            </div>
            {summary.overdueTickets > 0 && (
              <>
                <div className="w-1 h-1 bg-text-light-muted dark:bg-text-muted rounded-full"></div>
                <div>
                  <span className="text-text-light-muted dark:text-text-muted">Gecikmiş: </span>
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
          Yenile
        </Button>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={onCreateRequest}
          disabled={loading}
        >
          Yeni Talep
        </Button>
      </div>
    </div>
  );
}