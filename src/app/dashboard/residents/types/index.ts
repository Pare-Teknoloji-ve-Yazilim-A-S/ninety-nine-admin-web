import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Resident } from '@/app/components/ui/ResidentRow';

// API Response Types
export interface ApiResident {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    tcKimlikNo?: string;
    nationalId?: string;
    passportNumber?: string;
    property?: {
        ownershipType?: 'owner' | 'tenant';
        block?: string;
        apartment?: string;
        roomType?: string;
        governorate?: string;
        district?: string;
        neighborhood?: string;
    };
    registrationDate?: string;
    lastActivity?: string;
    financial?: {
        totalDebt?: number;
        lastPaymentDate?: string;
        balance?: number;
    };
    status?: string;
    membershipTier?: string;
    notes?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

// UI Component Types
export interface BulkAction {
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: (residents: Resident[]) => void;
    variant?: 'danger' | 'warning' | 'success' | 'default';
}

export interface ViewOption {
    id: string;
    label: string;
    icon: LucideIcon;
}

export interface TableColumn {
    id: string;
    header: string;
    accessor: string;
    width?: string;
    sortable?: boolean;
    render?: (value: any, row: Resident) => ReactNode;
}

// Stats Types
export interface StatsData {
    title: string;
    value: string;
    subtitle?: string;
    color: 'primary' | 'success' | 'info' | 'danger' | 'gold';
    icon: LucideIcon;
}

// Status and Membership Types
export interface StatusConfig {
    label: string;
    color: 'green' | 'red' | 'yellow' | 'blue' | 'gray';
}

export interface MembershipConfig {
    label: string;
    color: 'gold' | 'gray' | 'blue';
}

// Action Handler Types
export interface ResidentActionHandlers {
    handleViewResident: (resident: Resident) => void;
    handleEditResident: (resident: Resident) => void;
    handleDeleteResident: (resident: Resident) => void;
    handleCallResident: (resident: Resident) => void;
    handleMessageResident: (resident: Resident) => void;
    handleGenerateQR: (resident: Resident) => void;
    handleViewNotes: (resident: Resident) => void;
    handleViewHistory: (resident: Resident) => void;
    handleViewPaymentHistory: (resident: Resident) => void;
}

export interface BulkActionHandlers {
    handleBulkMail: (residents: Resident[]) => void;
    handleBulkSMS: (residents: Resident[]) => void;
    handleBulkPDF: (residents: Resident[]) => void;
    handleBulkTag: (residents: Resident[]) => void;
    handleBulkStatusChange: (residents: Resident[], status: string) => void;
    handleBulkDelete: (residents: Resident[]) => void;
}

export interface ExportHandlers {
    handleExportPDF: () => Promise<void>;
    handleExportExcel: () => Promise<void>;
    handleExportCSV: () => Promise<void>;
    handleExportJSON: () => Promise<void>;
}

// Page Props and State Types
export interface ResidentsPageProps {
    initialData?: {
        residents: Resident[];
        stats: any;
        totalRecords: number;
    };
}

export interface ResidentsPageState {
    loading: boolean;
    error: string | null;
    residents: Resident[];
    totalRecords: number;
    stats: any;
    selectedResidents: Resident[];
    filters: Record<string, any>;
    searchQuery: string;
    currentPage: number;
    recordsPerPage: number;
    selectedView: string;
    showFilterPanel: boolean;
    drawerClosing: boolean;
} 