'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ChevronLeft, ChevronRight, Wrench, MessageCircle, User, Clock } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import { loggingService, AuditLog } from '@/services/logging.service';

interface TicketActivityLogProps {
  ticketId: string;
  title?: string;
  subtitle?: string;
  ticketData?: any; // Current ticket data for comparison
}

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} saniye önce`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} dakika önce`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} saat önce`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} gün önce`;
  }
};

// Helper function to get activity description
const getActivityDescription = (log: AuditLog): { text: string; icon: React.ReactNode; color: string } => {
  console.log('=== START PROCESSING LOG ===');
  console.log('Processing log:', {
    id: log.id,
    entityType: log.entityType,
    action: log.action,
    newValue: log.newValue,
    metadata: log.metadata
  });

  // Ticket status changes
  console.log('Checking if ticket update:', log.entityType === 'ticket' && log.action === 'update');
  if (log.entityType === 'ticket' && log.action === 'update') {
    console.log('✅ Ticket update condition met');
    // Check metadata for specific actions FIRST (more specific)
    console.log('Checking metadata action:', log.metadata?.action);
    if (log.metadata?.action) {
      console.log('✅ Metadata action found:', log.metadata.action);
      const actionMap: Record<string, { text: string; color: string }> = {
        'resolve': { text: 'Bakım talebi çözüldü', color: 'text-green-600' },
        'start-progress': { text: 'İşleme alındı', color: 'text-blue-600' },
        'mark-waiting': { text: 'Beklemeye alındı', color: 'text-yellow-600' },
        'close': { text: 'Bakım talebi kapatıldı', color: 'text-gray-600' },
        'cancel': { text: 'Bakım talebi iptal edildi', color: 'text-red-600' }
      };

      console.log('Action check:', log.metadata?.action, 'Action map:', actionMap);
      console.log('Action info found:', actionMap[log.metadata.action]);

      const actionInfo = actionMap[log.metadata.action];
      console.log('Action info found:', actionInfo);
      if (actionInfo) {
        console.log('✅ Returning action info:', actionInfo);
        return {
          text: actionInfo.text,
          icon: <Wrench className="h-4 w-4" />,
          color: actionInfo.color
        };
      } else {
        console.log('❌ No action info found for:', log.metadata.action);
      }
    } else {
      console.log('❌ No metadata action found');
    }

    // Check if status changed
    console.log('Checking newValue status:', log.newValue?.status);
    if (log.newValue?.status) {
      console.log('✅ Status found:', log.newValue.status);
      const statusMap: Record<string, string> = {
        'OPEN': 'Açık',
        'IN_PROGRESS': 'İşlemde',
        'WAITING': 'Beklemede',
        'RESOLVED': 'Çözüldü',
        'CLOSED': 'Kapalı',
        'CANCELLED': 'İptal Edildi'
      };

      const newStatus = statusMap[log.newValue.status] || log.newValue.status;
      
      let color = 'text-blue-600';
      if (log.newValue.status === 'RESOLVED' || log.newValue.status === 'CLOSED') {
        color = 'text-green-600';
      } else if (log.newValue.status === 'CANCELLED') {
        color = 'text-red-600';
      }

      console.log('✅ Returning status update:', `Status '${newStatus}' e güncellendi`);
      return {
        text: `Status '${newStatus}' e güncellendi`,
        icon: <Wrench className="h-4 w-4" />,
        color
      };
    } else {
      console.log('❌ No status found in newValue');
    }

    // Check for priority changes
    if (log.newValue?.priority) {
      const priorityMap: Record<string, string> = {
        'LOW': 'Düşük',
        'MEDIUM': 'Orta',
        'HIGH': 'Yüksek',
        'URGENT': 'Acil'
      };

      const newPriority = priorityMap[log.newValue.priority] || log.newValue.priority;

      return {
        text: `Priority '${newPriority}' e güncellendi`,
        icon: <Wrench className="h-4 w-4" />,
        color: 'text-orange-600'
      };
    }

    // Check for title changes
    if (log.newValue?.title) {
      return {
        text: `Title '${log.newValue.title}' e güncellendi`,
        icon: <Wrench className="h-4 w-4" />,
        color: 'text-blue-600'
      };
    }

    // Check for description changes
    if (log.newValue?.description) {
      return {
        text: `Description '${log.newValue.description.length > 30 ? log.newValue.description.substring(0, 30) + '...' : log.newValue.description}' e güncellendi`,
        icon: <Wrench className="h-4 w-4" />,
        color: 'text-blue-600'
      };
    }

    // Check for ticket number
    if (log.newValue?.ticketNumber) {
      return {
        text: `Ticket '${log.newValue.ticketNumber}' e güncellendi`,
        icon: <Wrench className="h-4 w-4" />,
        color: 'text-blue-600'
      };
    }

    // Check for category
    if (log.newValue?.category) {
      return {
        text: `Category '${log.newValue.category}' e güncellendi`,
        icon: <Wrench className="h-4 w-4" />,
        color: 'text-blue-600'
      };
    }

    // Check for type
    if (log.newValue?.type) {
      return {
        text: `Type '${log.newValue.type}' e güncellendi`,
        icon: <Wrench className="h-4 w-4" />,
        color: 'text-blue-600'
      };
    }

    // Check for due date
    if (log.newValue?.dueDate) {
      const dueDate = new Date(log.newValue.dueDate).toLocaleDateString('tr-TR');
      return {
        text: `Due date '${dueDate}' e güncellendi`,
        icon: <Wrench className="h-4 w-4" />,
        color: 'text-blue-600'
      };
    }

    // Generic ticket update with available fields
    const availableFields = Object.keys(log.newValue || {}).filter(key => 
      log.newValue[key] !== null && log.newValue[key] !== undefined
    );

    if (availableFields.length > 0) {
      const fieldNames = availableFields.map(field => {
        const fieldMap: Record<string, string> = {
          'title': 'Title',
          'status': 'Status',
          'priority': 'Priority',
          'description': 'Description',
          'category': 'Category',
          'type': 'Type',
          'ticketNumber': 'Ticket Number',
          'dueDate': 'Due Date'
        };
        return fieldMap[field] || field;
      });

      return {
        text: `${fieldNames.join(', ')} güncellendi`,
        icon: <Wrench className="h-4 w-4" />,
        color: 'text-blue-600'
      };
    }

    console.log('❌ Falling back to generic update message');
    return {
      text: 'Bakım talebi güncellendi',
      icon: <Wrench className="h-4 w-4" />,
      color: 'text-blue-600'
    };
  }

  // Ticket comments
  if (log.entityType === 'ticket_comment' && log.action === 'create') {
    const commentText = log.newValue?.content || log.newValue?.text || log.newValue?.comment || 'Yorum eklendi';
    return {
      text: `Yorum eklendi: "${commentText.length > 50 ? commentText.substring(0, 50) + '...' : commentText}"`,
      icon: <MessageCircle className="h-4 w-4" />,
      color: 'text-purple-600'
    };
  }

  // Ticket creation
  if (log.entityType === 'ticket' && log.action === 'create') {
    const ticketTitle = log.newValue?.title || log.newValue?.subject || 'Bakım talebi';
    return {
      text: `Bakım talebi oluşturuldu: "${ticketTitle}"`,
      icon: <Activity className="h-4 w-4" />,
      color: 'text-green-600'
    };
  }

  // Default fallback with more detail
  return {
    text: `${log.entityType} ${log.action === 'create' ? 'oluşturuldu' : log.action === 'update' ? 'güncellendi' : log.action}`,
    icon: <Activity className="h-4 w-4" />,
    color: 'text-gray-600'
  };
};

// Helper function to get activity background color
const getActivityBgColor = (log: AuditLog): string => {
  if (log.entityType === 'ticket_comment') {
    return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
  }
  
  if (log.action === 'create') {
    return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
  }
  
  if (log.action === 'update') {
    return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
  }
  
  return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
};

export default function TicketActivityLog({ 
  ticketId, 
  title = "Son Aktiviteler", 
  subtitle = "Bakım talebi güncellemeleri" 
}: TicketActivityLogProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDebug, setShowDebug] = useState(false);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = logs.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Fetch ticket-specific audit logs
  useEffect(() => {
    const fetchTicketLogs = async () => {
      if (!ticketId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch logs for this specific ticket
        const response = await loggingService.getAuditLogsByEntity('ticket', ticketId, 50);
        
        console.log('Ticket audit logs response:', response);
        console.log('Raw logs data:', JSON.stringify(response, null, 2));
        
        // Filter for ticket and ticket_comment activities
        const ticketLogs = response.filter(log => 
          (log.entityType === 'ticket' && log.entityId === ticketId) ||
          (log.entityType === 'ticket_comment' && log.newValue?.ticketId === ticketId)
        );
        
        console.log('Filtered ticket logs:', ticketLogs);
        
        // Sort by creation date (newest first)
        const sortedLogs = ticketLogs.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        console.log('Sorted logs:', sortedLogs);
        setLogs(sortedLogs);
      } catch (err) {
        console.error('Error fetching ticket audit logs:', err);
        setError(err instanceof Error ? err.message : 'Aktivite günlükleri yüklenemedi');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketLogs();
  }, [ticketId]);

  return (
    <div className="bg-background-light-card dark:bg-background-card rounded-xl border border-primary-gold/10 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary-gold" />
          <div>
            <h3 className="font-semibold text-text-on-light dark:text-text-on-dark">{title}</h3>
            <p className="text-sm text-text-light-secondary dark:text-text-secondary">{subtitle}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs"
        >
          {showDebug ? 'Gizle' : 'Debug'}
        </Button>
      </div>

      {/* Debug Section */}
      {showDebug && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Debug: Raw Log Data</h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 max-h-40 overflow-y-auto">
            <pre>{JSON.stringify(logs, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-32 mb-1" />
                <div className="h-3 bg-gray-300 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && logs.length === 0 && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Henüz aktivite bulunmuyor.</p>
        </div>
      )}

      {/* Activity Logs */}
      {!loading && !error && logs.length > 0 && (
        <div className="space-y-3">
          {currentLogs.map((log) => {
            const activityInfo = getActivityDescription(log);
            const bgColor = getActivityBgColor(log);
            
            return (
              <div key={log.id} className={`p-3 rounded-lg border ${bgColor} transition-all hover:shadow-sm`}>
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${activityInfo.color.replace('text-', 'bg-')} bg-opacity-10 flex-shrink-0`}>
                    {activityInfo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${activityInfo.color}`}>
                      {activityInfo.text}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {log.username || 'Sistem'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(log.createdAt)}
                        </span>
                      </div>
                    </div>
                    {showDebug && (
                      <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded text-xs">
                        <div><strong>Action:</strong> {log.action}</div>
                        <div><strong>Entity:</strong> {log.entityType}</div>
                        <div><strong>New Value:</strong> {JSON.stringify(log.newValue)}</div>
                        <div><strong>Meta:</strong> {JSON.stringify(log.metadata)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Sayfa {currentPage} / {totalPages} ({logs.length} toplam)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 