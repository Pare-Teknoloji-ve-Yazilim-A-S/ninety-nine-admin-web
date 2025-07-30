// Unit Detail Types based on property-view.json structure

export interface UnitDetail {
  id: string;
  apartmentNumber: string;
  block: string;
  floor: number;
  type: string;
  area: number;
  status: 'active' | 'inactive' | 'maintenance' | 'renovation';
  createdDate: string;
  lastUpdated: string;
  basicInfo: BasicInfo;
  ownerInfo: OwnerInfo;
  tenantInfo?: TenantInfo;
  residents: Resident[];
  billingInfo: BillingInfo;
  financialSummary: FinancialSummary;
  consumptionData: ConsumptionData;
  maintenanceHistory: MaintenanceRecord[];
  visitorHistory: VisitorRecord[];
  notes: Notes;
  documents: Document[];
  permissions: Permissions;
  systemInfo: SystemInfo;
}

export interface BasicInfo {
  title: string;
  icon: string;
  data: {
    apartmentNumber: FieldData<string>;
    block: SelectFieldData;
    floor: FieldData<number>;
    apartmentType: SelectFieldData;
    area: FieldData<number>;
    status: StatusFieldData;
  };
}

export interface OwnerInfo {
  title: string;
  icon: string;
  data: {
    fullName: FieldData<string>;
    phone: FieldData<string>;
    email: FieldData<string>;
    nationalId: FieldData<string>;
    address: FieldData<string>;
    ownershipType: OwnershipTypeFieldData;
  };
}

export interface TenantInfo {
  title: string;
  icon: string;
  isRented: boolean;
  data: {
    isRented: FieldData<boolean>;
    tenantName: FieldData<string>;
    tenantPhone: FieldData<string>;
    tenantEmail?: FieldData<string>;
    leaseStartDate: FieldData<string>;
    leaseEndDate: FieldData<string>;
    monthlyRent: CurrencyFieldData;
    deposit?: CurrencyFieldData;
  };
}

export interface Resident {
  id: string;
  name: string;
  role: 'owner' | 'tenant' | 'family_member';
  roleLabel: string;
  phone?: string;
  email?: string;
  age?: number;
  nationalId?: string;
  isMainResident: boolean;
  moveInDate: string;
  relation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface BillingInfo {
  title: string;
  icon: string;
  data: {
    monthlyDues: CurrencyFieldData;
    electricityMeterNo?: FieldData<string>;
    waterMeterNo?: FieldData<string>;
    gasMeterNo?: FieldData<string>;
    internetConnection?: FieldData<boolean>;
    parkingSpace?: FieldData<string>;
  };
}

export interface FinancialSummary {
  title: string;
  icon: string;
  data: {
    currentBalance: BalanceFieldData;
    lastPaymentDate?: FieldData<string>;
    lastPaymentAmount?: CurrencyFieldData;
    overdueAmount?: BalanceFieldData;
    nextDueDate?: FieldData<string>;
  };
}

export interface ConsumptionData {
  title: string;
  icon: string;
  period: 'monthly' | 'yearly';
  data: {
    electricity?: ConsumptionItem;
    water?: ConsumptionItem;
    gas?: ConsumptionItem;
  };
}

export interface ConsumptionItem {
  label: string;
  currentMonth: {
    consumption: number;
    unit: string;
    cost: number;
    currency: string;
  };
  previousMonth: {
    consumption: number;
    unit: string;
    cost: number;
    currency: string;
  };
  trend: 'increase' | 'decrease' | 'stable';
  percentage: number;
}

export interface MaintenanceRecord {
  id: string;
  type: string;
  category: 'electrical' | 'plumbing' | 'hvac' | 'general' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdDate: string;
  completedDate?: string;
  assignedTo?: string;
  company?: string;
  estimatedCompletion?: string;
  cost?: number;
  currency?: string;
  description: string;
}

export interface VisitorRecord {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  visitDate: string;
  exitDate?: string;
  duration?: string;
  purpose: string;
  authorizedBy: string;
  qrCode?: string;
  status: 'active' | 'completed';
}

export interface Notes {
  title: string;
  icon: string;
  data: {
    generalNotes?: TextareaFieldData;
    maintenanceNotes?: TextareaFieldData;
    specialRequests?: TextareaFieldData;
    accessRestrictions?: TextareaFieldData;
  };
}

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'identity' | 'handover' | 'other';
  format: string;
  size: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'active' | 'expired';
  downloadUrl: string;
}

export interface Permissions {
  canEdit: boolean;
  canDelete: boolean;
  canViewFinancials: boolean;
  canManageResidents: boolean;
  canAccessDocuments: boolean;
  role: string;
}

export interface SystemInfo {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  version: string;
  syncStatus: 'synced' | 'pending' | 'error';
  backupDate?: string;
}

// Field Types
export interface FieldData<T> {
  label: string;
  value: T;
  type: string;
  required?: boolean;
  validation?: string;
  format?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  dependsOn?: string;
}

export interface SelectFieldData extends FieldData<string> {
  options: string[] | SelectOption[];
}

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
}

export interface StatusFieldData extends SelectFieldData {
  type: 'select';
  options: StatusOption[];
}

export interface StatusOption extends SelectOption {
  value: 'active' | 'inactive' | 'maintenance' | 'renovation';
  color: 'green' | 'red' | 'orange' | 'blue';
}

export interface OwnershipTypeFieldData extends SelectFieldData {
  type: 'select';
  options: OwnershipOption[];
}

export interface OwnershipOption extends SelectOption {
  value: 'owner' | 'investor' | 'inherited';
  color: 'blue' | 'purple' | 'green';
}

export interface CurrencyFieldData extends FieldData<number> {
  type: 'currency';
  currency: string;
}

export interface BalanceFieldData extends CurrencyFieldData {
  status?: 'debt' | 'credit' | 'overdue';
}

export interface TextareaFieldData extends FieldData<string> {
  type: 'textarea';
  maxLength: number;
}

// DTOs for API operations
export interface UpdateBasicInfoDto {
  apartmentNumber?: string;
  block?: string;
  floor?: number;
  apartmentType?: string;
  area?: number;
  status?: 'active' | 'inactive' | 'maintenance' | 'renovation';
}

export interface UpdateOwnerInfoDto {
  fullName?: string;
  phone?: string;
  email?: string;
  nationalId?: string;
  address?: string;
  ownershipType?: 'owner' | 'investor' | 'inherited';
}

export interface UpdateTenantInfoDto {
  isRented?: boolean;
  tenantName?: string;
  tenantPhone?: string;
  tenantEmail?: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  monthlyRent?: number;
  deposit?: number;
}

export interface AddResidentDto {
  name: string;
  role: 'owner' | 'tenant' | 'family_member';
  phone?: string;
  email?: string;
  age?: number;
  nationalId?: string;
  relation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface UpdateBillingInfoDto {
  monthlyDues?: number;
  electricityMeterNo?: string;
  waterMeterNo?: string;
  gasMeterNo?: string;
  internetConnection?: boolean;
  parkingSpace?: string;
}

export interface CreateMaintenanceDto {
  type: string;
  category: 'electrical' | 'plumbing' | 'hvac' | 'general' | 'other';
  priority: 'low' | 'medium' | 'high';
  description: string;
  assignedTo?: string;
  estimatedCompletion?: string;
}

export interface AddVisitorDto {
  visitorName: string;
  visitorPhone?: string;
  purpose: string;
  authorizedBy: string;
}

export interface UpdateNotesDto {
  generalNotes?: string;
  maintenanceNotes?: string;
  specialRequests?: string;
  accessRestrictions?: string;
}