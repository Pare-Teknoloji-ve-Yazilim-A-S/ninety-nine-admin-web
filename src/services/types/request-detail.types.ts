// Request Detail Page Type Definitions
// Adapted from JSON structure in request-detail-view.json

export interface ServiceRequestDetail {
  id: string;
  requestId: string;
  title: string;
  description: string;
  apartment: ApartmentInfo;
  category: CategoryInfo;
  priority: PriorityInfo;
  status: StatusInfo;
  assignee?: AssigneeInfo;
  createdDate: string;
  updatedDate: string;
  dueDate: string;
  estimatedCompletion?: string;
  completedDate?: string;
  responseTime?: string;
  completionTime?: string;
  imagesCount: number;
  commentsCount: number;
  cost: CostInfo;
  customerRating?: number;
  tags: string[];
  isOverdue: boolean;
  isUrgent: boolean;
  hasImages: boolean;
  hasComments: boolean;
}

export interface ApartmentInfo {
  number: string;
  block: string;
  floor: number;
  owner: string;
  tenant?: string;
  phone?: string;
}

export interface CategoryInfo {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface PriorityInfo {
  id: string;
  label: string;
  level: number;
  color: string;
  icon: string;
}

export interface StatusInfo {
  id: string;
  label: string;
  color: string;
  bgColor: string;
}

export interface AssigneeInfo {
  id: string;
  name: string;
  company: string;
  phone: string;
  avatar: string;
  rating: number;
}

export interface CostInfo {
  estimated: number;
  actual?: number;
  currency: string;
}

// Component Props Interfaces
export interface RequestDetailHeaderProps {
  request: ServiceRequestDetail;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  loading?: boolean;
}

export interface RequestDetailInfoProps {
  request: ServiceRequestDetail;
}

export interface RequestDetailApartmentProps {
  apartment: ApartmentInfo;
}

export interface RequestDetailAssigneeProps {
  assignee?: AssigneeInfo;
}

export interface RequestDetailTimelineProps {
  request: ServiceRequestDetail;
}

export interface RequestDetailStatusProps {
  request: ServiceRequestDetail;
  onStatusChange: (action: RequestDetailAction) => void;
  loading?: boolean;
}

export interface RequestDetailCommentsProps {
  requestId: string;
  commentsCount: number;
}

export interface RequestDetailImagesProps {
  requestId: string;
  imagesCount: number;
}

export interface RequestDetailCostProps {
  cost: CostInfo;
  canViewCosts?: boolean;
}

// Hook Return Type
export interface UseRequestDetailResult {
  request: ServiceRequestDetail | null;
  loading: boolean;
  error: string | null;
  handleEdit: () => void;
  handleDelete: () => void;
  handleStatusChange: (action: RequestDetailAction) => Promise<void>;
  refetch: () => Promise<void>;
}

// Action Types
export type RequestDetailAction = 
  | 'start-progress'
  | 'mark-waiting'
  | 'resolve'
  | 'close'
  | 'cancel'
  | 'reopen';

// Status Configuration
export interface StatusConfig {
  label: string;
  color: string;
  icon: string;
  allowedActions: RequestDetailAction[];
}

export const STATUS_CONFIGS: Record<string, StatusConfig> = {
  'OPEN': {
    label: 'Açık',
    color: 'info',
    icon: 'AlertCircle',
    allowedActions: ['start-progress', 'resolve', 'cancel']
  },
  'IN_PROGRESS': {
    label: 'İşlemde', 
    color: 'warning',
    icon: 'RotateCcw',
    allowedActions: ['resolve', 'mark-waiting']
  },
  'WAITING': {
    label: 'Beklemede',
    color: 'secondary', 
    icon: 'PauseCircle',
    allowedActions: ['start-progress', 'resolve', 'cancel']
  },
  'RESOLVED': {
    label: 'Çözüldü',
    color: 'success',
    icon: 'CheckCircle', 
    allowedActions: ['close', 'reopen']
  },
  'CLOSED': {
    label: 'Kapalı',
    color: 'secondary',
    icon: 'CheckCircle',
    allowedActions: ['reopen']
  },
  'CANCELLED': {
    label: 'İptal',
    color: 'red',
    icon: 'X',
    allowedActions: ['reopen']
  }
};

// Priority Configuration
export const PRIORITY_CONFIGS: Record<string, { color: string; level: number }> = {
  'LOW': { color: 'success', level: 1 },
  'MEDIUM': { color: 'warning', level: 2 },
  'HIGH': { color: 'red', level: 3 },
  'URGENT': { color: 'red', level: 4 }
};

// Category Configuration
export const CATEGORY_CONFIGS: Record<string, { color: string; icon: string }> = {
  'FAULT_REPAIR': { color: 'red', icon: '🔧' },
  'MAINTENANCE': { color: 'warning', icon: '⚙️' },
  'CLEANING': { color: 'info', icon: '🧹' },
  'SECURITY': { color: 'red', icon: '🔒' },
  'COMPLAINT': { color: 'warning', icon: '📢' },
  'SUGGESTION': { color: 'success', icon: '💡' },
  'OTHER': { color: 'secondary', icon: '📝' }
};