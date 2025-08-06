import { BaseService } from './core/base.service';
import { apiClient } from './api/client';
import { ApiResponse, PaginatedResponse } from './core/types';
import {
  CreateBillDto,
  ResponseBillDto,
  UpdateBillDto,
  BillStatus
} from './types/billing.types';

export interface BillAssignedTo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membershipTier?: string;
}

export interface BillProperty {
  id: string;
  propertyNumber: string;
  name: string;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  createdAt: string;
  description?: string;
  billType: string;
  status: string;
  paidAt?: string | null;
  assignedTo?: BillAssignedTo;
  property?: BillProperty;
  documentNumber?: string;
  penaltyStartDate?: string;
  isPenaltyApplied?: boolean;
}

function mapApiBill(apiBill: any): Bill {
  return {
    id: apiBill.id,
    title: apiBill.title,
    amount: parseFloat(apiBill.amount),
    dueDate: apiBill.dueDate,
    createdAt: apiBill.createdAt,
    description: apiBill.description,
    billType: apiBill.billType,
    status: apiBill.status,
    paidAt: apiBill.paidAt,
    documentNumber: apiBill.documentNumber,
    penaltyStartDate: apiBill.penaltyStartDate,
    isPenaltyApplied: apiBill.isPenaltyApplied,
    assignedTo: apiBill.assignedTo
      ? {
          id: apiBill.assignedTo.id,
          firstName: apiBill.assignedTo.firstName,
          lastName: apiBill.assignedTo.lastName,
          email: apiBill.assignedTo.email,
          phone: apiBill.assignedTo.phone,
          membershipTier: apiBill.assignedTo.membershipTier,
        }
      : undefined,
    property: apiBill.property
      ? {
          id: apiBill.property.id,
          propertyNumber: apiBill.property.propertyNumber,
          name: apiBill.property.name,
        }
      : undefined,
  };
}

class BillingService extends BaseService<ResponseBillDto, CreateBillDto, UpdateBillDto> {
  protected baseEndpoint = '/admin/billing';

  constructor() {
    super('BillingService');
  }

  /**
   * Yeni fatura oluştur
   * POST /admin/billing
   */
  async createBill(billData: CreateBillDto): Promise<ApiResponse<ResponseBillDto>> {
    this.logger.info('Creating new bill', billData);
    
    const response = await apiClient.post<ResponseBillDto>(this.baseEndpoint, billData);
    
    this.logger.info('Bill created successfully', response.data);
    return response;
  }

  /**
   * Tüm faturaları getir
   * GET /admin/billing
   */
  async getAllBills(): Promise<ResponseBillDto[]> {
    this.logger.info('Fetching all bills');
    
    const response = await apiClient.get<ResponseBillDto[]>(this.baseEndpoint);
    const bills = Array.isArray(response) ? response : [];
    
    this.logger.info(`Fetched ${bills.length} bills`);
    return bills;
  }

  /**
   * Belirli bir kullanıcıya ait faturaları getirir
   * GET /admin/billing/user/{userId}
   */
  async getBillsByUser(userId: string): Promise<Bill[]> {
    this.logger.info(`Fetching bills for user: ${userId}`);
    
    const response = await apiClient.get<any[]>(`${this.baseEndpoint}/user/${userId}`);
    const bills = Array.isArray(response) ? response.map(mapApiBill) : [];
    
    this.logger.info(`Fetched ${bills.length} bills for user ${userId}`);
    return bills;
  }

  /**
   * Belirli bir mülke ait faturaları getirir
   * GET /admin/billing/property/{propertyId}
   */
  async getBillsByProperty(propertyId: string): Promise<ResponseBillDto[]> {
    this.logger.info(`Fetching bills for property: ${propertyId}`);
    
    const response = await apiClient.get<ResponseBillDto[]>(`${this.baseEndpoint}/property/${propertyId}`);
    const bills = Array.isArray(response) ? response : [];
    
    this.logger.info(`Fetched ${bills.length} bills for property ${propertyId}`);
    return bills;
  }

  /**
   * Belirli bir mülkün borç durumunu getirir (sadece özet bilgi)
   * GET /admin/billing/property/{propertyId}/debt-status
   */
  async getPropertyDebtStatus(propertyId: string): Promise<{
    hasDebt: boolean;
    totalDebt: number;
    overdueBills: number;
    pendingBills: number;
    lastPaymentDate?: string;
  }> {
    this.logger.info(`Fetching debt status for property: ${propertyId}`);
    
    try {
      const response = await apiClient.get<any>(`${this.baseEndpoint}/property/${propertyId}/debt-status`);
      
      this.logger.info(`Fetched debt status for property ${propertyId}`);
      return {
        hasDebt: response.hasDebt || false,
        totalDebt: response.totalDebt || 0,
        overdueBills: response.overdueBills || 0,
        pendingBills: response.pendingBills || 0,
        lastPaymentDate: response.lastPaymentDate
      };
    } catch (error) {
      this.logger.error(`Failed to fetch debt status for property ${propertyId}:`, error);
      // Fallback: return default values
      return {
        hasDebt: false,
        totalDebt: 0,
        overdueBills: 0,
        pendingBills: 0
      };
    }
  }

  /**
   * Birden fazla mülkün borç durumunu toplu olarak getirir
   * POST /admin/billing/properties/debt-status
   */
  async getPropertiesDebtStatus(propertyIds: string[]): Promise<Record<string, {
    hasDebt: boolean;
    totalDebt: number;
    overdueBills: number;
    pendingBills: number;
    lastPaymentDate?: string;
  }>> {
    this.logger.info(`Fetching debt status for ${propertyIds.length} properties`);
    
    try {
      const response = await apiClient.post<any>(`${this.baseEndpoint}/properties/debt-status`, {
        propertyIds
      });
      
      this.logger.info(`Fetched debt status for ${propertyIds.length} properties`);
      return response || {};
    } catch (error) {
      this.logger.error(`Failed to fetch debt status for properties:`, error);
      // Fallback: return empty object
      return {};
    }
  }

  /**
   * Bekleyen faturaları getirir
   * GET /admin/billing/pending
   */
  async getPendingBills(): Promise<ResponseBillDto[]> {
    this.logger.info('Fetching pending bills');
    
    const response = await apiClient.get<ResponseBillDto[]>(`${this.baseEndpoint}/pending`);
    const bills = Array.isArray(response) ? response : [];
    
    this.logger.info(`Fetched ${bills.length} pending bills`);
    return bills;
  }

  /**
   * Gecikmiş faturaları getirir
   * GET /admin/billing/overdue
   */
  async getOverdueBills(): Promise<ResponseBillDto[]> {
    this.logger.info('Fetching overdue bills');
    
    const response = await apiClient.get<ResponseBillDto[]>(`${this.baseEndpoint}/overdue`);
    const bills = Array.isArray(response) ? response : [];
    
    this.logger.info(`Fetched ${bills.length} overdue bills`);
    return bills;
  }

  /**
   * Faturayı ödendi olarak işaretle
   * PATCH /admin/billing/{id}/mark-paid
   */
  async markBillAsPaid(billId: string): Promise<ApiResponse<ResponseBillDto>> {
    this.logger.info(`Marking bill as paid: ${billId}`);
    
    const response = await apiClient.patch<ResponseBillDto>(`${this.baseEndpoint}/${billId}/mark-paid`);
    
    this.logger.info(`Bill ${billId} marked as paid`);
    return response;
  }

  /**
   * Faturayı güncelle
   * PATCH /admin/billing/{id}
   */
  async updateBill(billId: string, updateData: UpdateBillDto): Promise<ApiResponse<ResponseBillDto>> {
    this.logger.info(`Updating bill: ${billId}`, updateData);
    
    const response = await apiClient.patch<ResponseBillDto>(`${this.baseEndpoint}/${billId}`, updateData);
    
    this.logger.info(`Bill ${billId} updated successfully`);
    return response;
  }

  /**
   * Fatura detayını getir
   * GET /admin/billing/{id}
   */
  async getBillById(billId: string): Promise<ApiResponse<ResponseBillDto>> {
    this.logger.info(`Fetching bill details: ${billId}`);
    
    const response = await apiClient.get<ResponseBillDto>(`${this.baseEndpoint}/${billId}`);
    
    this.logger.info(`Fetched bill ${billId} details`);
    return response;
  }

  /**
   * Faturayı sil
   * DELETE /admin/billing/{id}
   */
  async deleteBill(billId: string): Promise<ApiResponse<void>> {
    this.logger.info(`Deleting bill: ${billId}`);
    
    const response = await apiClient.delete<void>(`${this.baseEndpoint}/${billId}`);
    
    this.logger.info(`Bill ${billId} deleted successfully`);
    return response;
  }
}

const billingService = new BillingService();
export default billingService;