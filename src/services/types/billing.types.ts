// Billing and Payment Types for API Integration

// Bill Types
export type BillType = 'DUES' | 'MAINTENANCE' | 'UTILITY' | 'PENALTY' | 'OTHER';
export type BillStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

// Payment Types
export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  DIRECT_DEBIT = 'DIRECT_DEBIT',
  ONLINE_PAYMENT = 'ONLINE_PAYMENT',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
  CHECK = 'CHECK',
  OTHER = 'OTHER',
}
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELED' | 'DISPUTED';

// Bill Interfaces
export interface CreateBillDto {
  title: string;
  amount: number;
  dueDate: string; // ISO string
  description?: string;
  billType: BillType;
  status: BillStatus;
  paymentMethod?: PaymentMethod;
  penaltyStartDate?: string; // ISO string
  isPenaltyApplied?: boolean;
  documentNumber?: string;
  propertyId: string;
  assignedToId?: string;
}

export interface ResponseBillDto {
  id: string;
  title: string;
  amount: string; // API returns amount as string
  dueDate: string;
  description: string;
  billType: BillType;
  status: BillStatus;
  penaltyStartDate?: string;
  isPenaltyApplied: boolean;
  documentNumber: string;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  property?: {
    id: string;
    name: string;
    propertyNumber: string;
    floor?: number | null;
  };
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    propertyIdentification?: string | null;
  } | null;
}

export interface UpdateBillDto extends Partial<CreateBillDto> {}

// Payment Interfaces
export interface CreatePaymentDto {
  amount: number;
  paymentMethod: PaymentMethod;
  status?: PaymentStatus;
  paymentDate?: string; // ISO string
  transactionId?: string;
  receiptNumber?: string;
  description?: string;
  notes?: string;
  paidById?: string;
  receivedById?: string;
  billId: string;
}

export interface ResponsePaymentDto extends CreatePaymentDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  status: PaymentStatus;
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {}

// Form Types for UI
export interface BillFormData {
  title: string;
  amount: number;
  dueDate: string; // HTML date input uses string format
  description: string;
  billType: BillType;
  paymentMethod?: PaymentMethod;
  propertyId: string;
  assignedToId: string;
  documentNumber: string;
}

export interface PaymentFormData {
  billId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string; // HTML date input uses string format
  transactionId: string;
  receiptNumber: string;
  description: string;
  notes: string;
}

// UI Helper Types
export interface BillTypeOption {
  value: BillType;
  label: string;
  icon: string;
  description: string;
}

export interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  icon: string;
  description: string;
}

// Constants
export const BILL_TYPE_OPTIONS: BillTypeOption[] = [
  { value: 'DUES', label: 'Aidat', icon: '🏠', description: 'Aylık aidat ödemesi' },
  { value: 'MAINTENANCE', label: 'Bakım', icon: '🔧', description: 'Bakım ve onarım masrafları' },
  { value: 'UTILITY', label: 'Fayda', icon: '⚡', description: 'Elektrik, su, gaz faturaları' },
  { value: 'PENALTY', label: 'Ceza', icon: '⚠️', description: 'Gecikme cezası' },
  { value: 'OTHER', label: 'Diğer', icon: '📄', description: 'Diğer fatura türleri' }
];

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  { value: PaymentMethod.CASH, label: 'Nakit', icon: '💵', description: 'Nakit ödeme' },
  { value: PaymentMethod.CREDIT_CARD, label: 'Kredi Kartı', icon: '💳', description: 'Kredi kartı ile ödeme' },
  { value: PaymentMethod.BANK_TRANSFER, label: 'Banka Havalesi/EFT', icon: '🏦', description: 'Banka havalesi/EFT ile ödeme' },
  { value: PaymentMethod.DIRECT_DEBIT, label: 'Otomatik Ödeme Talimatı', icon: '🏛️', description: 'Hesaptan otomatik tahsilat' },
  { value: PaymentMethod.ONLINE_PAYMENT, label: 'Online Ödeme', icon: '💻', description: 'İnternet üzerinden ödeme' },
  { value: PaymentMethod.MOBILE_PAYMENT, label: 'Mobil Ödeme', icon: '📱', description: 'Mobil uygulama ile ödeme' },
  { value: PaymentMethod.CHECK, label: 'Çek', icon: '🧾', description: 'Çek ile ödeme' },
  { value: PaymentMethod.OTHER, label: 'Diğer', icon: '📄', description: 'Diğer ödeme yöntemi' }
];

export const DISABLED_PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  { value: 'ONLINE_PAYMENT', label: 'Online Ödeme', icon: '💻', description: 'Yakında kullanılabilir olacak' }
];