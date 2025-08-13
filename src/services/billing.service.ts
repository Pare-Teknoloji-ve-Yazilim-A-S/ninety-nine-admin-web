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
  async getAllBills(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
    propertyId?: string;
    residentId?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: string;
    sortOrder?: string;
    orderColumn?: string;
    orderBy?: 'ASC' | 'DESC';
  }): Promise<{ data: ResponseBillDto[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    this.logger.info('Fetching all bills', params);
    
    const queryParams = new URLSearchParams();
    
    // Add filter params
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if ((params as any)?.billType) queryParams.append('billType', String((params as any).billType));
    if (params?.propertyId) queryParams.append('propertyId', params.propertyId);
    if (params?.residentId) queryParams.append('residentId', params.residentId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.minAmount) queryParams.append('minAmount', params.minAmount.toString());
    if (params?.maxAmount) queryParams.append('maxAmount', params.maxAmount.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if ((params as any)?.orderColumn) queryParams.append('orderColumn', String((params as any).orderColumn));
    if ((params as any)?.orderBy) queryParams.append('orderBy', String((params as any).orderBy));
    
    const queryString = queryParams.toString();
    const url = `${this.baseEndpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔍 BillingService: Making request to', url);
    console.log('📋 Query Parameters:', params);
    
    try {
      const response = await apiClient.get<{ data: ResponseBillDto[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(url);

      // Normalize possible shapes
      const root: any = (response as any) ?? {};
      const list: ResponseBillDto[] = Array.isArray(root.data)
        ? root.data
        : Array.isArray(root.results?.results)
          ? root.results.results
          : Array.isArray(root.results)
            ? root.results
            : Array.isArray(root)
              ? (root as any[])
              : [];
      const pagination = root.pagination ?? root.data?.pagination ?? {
        total: 0,
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        totalPages: 1,
      };

      console.log('✅ BillingService: API call successful');
      console.log('📏 Bills count:', list.length);
      console.log('📋 First bill (if exists):', list[0]);
      console.log('📄 Pagination info:', pagination);

      this.logger.info(`Fetched ${list.length} bills`);
      return {
        data: list,
        pagination,
      };
    } catch (error) {
      console.error('❌ BillingService: API call failed:', error);
      this.logger.error('Failed to fetch bills:', error);
      throw error;
    }
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
        hasDebt: response.data?.hasDebt || false,
        totalDebt: response.data?.totalDebt || 0,
        overdueBills: response.data?.overdueBills || 0,
        pendingBills: response.data?.pendingBills || 0,
        lastPaymentDate: response.data?.lastPaymentDate
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
      return response.data || {};
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
   * Bekleyen faturaları (ilişkilerle birlikte) getirir
   * GET /admin/billing/pending-bills
   * Response shape: { data: { bills: ResponseBillDto[] } }
   */
  async getAllPendingBills(): Promise<ResponseBillDto[]> {
    this.logger.info('Fetching all pending bills (with relations)');
    try {
      const response = await apiClient.get<{ data: { bills: ResponseBillDto[] } }>(`${this.baseEndpoint}/pending-bills`);
      const bills = (response as any)?.data?.bills
        || (response as any)?.data?.data?.bills
        || (Array.isArray((response as any)?.data) ? (response as any).data : [])
        || [];
      this.logger.info(`Fetched ${Array.isArray(bills) ? bills.length : 0} pending bills (with relations)`);
      return Array.isArray(bills) ? bills : [];
    } catch (error) {
      this.logger.error('Failed to fetch all pending bills:', error);
      return [];
    }
  }

  /**
   * Bekleyen faturaları sayfalı ve arama/sıralama ile getirir
   * GET /admin/billing/pending-bills?page&limit&search&orderColumn&orderBy&billType&propertyId
   */
  async getAllPendingBillsPaginated(params?: {
    page?: number;
    limit?: number;
    search?: string;
    orderColumn?: string;
    orderBy?: 'ASC' | 'DESC';
    billType?: string;
    propertyId?: string;
  }): Promise<{ bills: ResponseBillDto[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    this.logger.info('Fetching pending bills (paginated)', params);
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    if (params?.orderColumn) query.append('orderColumn', params.orderColumn);
    if (params?.orderBy) query.append('orderBy', params.orderBy);
    if (params?.billType) query.append('billType', params.billType);
    if (params?.propertyId) query.append('propertyId', params.propertyId);

    const url = `${this.baseEndpoint}/pending-bills${query.toString() ? `?${query.toString()}` : ''}`;
    try {
      const response = await apiClient.get<{ data: { bills: ResponseBillDto[]; pagination?: { total: number; page: number; limit: number; totalPages: number } } }>(url);
      const root = (response as any)?.data || (response as any) || {};
      const bills: ResponseBillDto[] = root?.bills || root?.data?.bills || [];
      const serverPagination = root?.pagination || root?.data?.pagination;

      // If server doesn't provide pagination, slice on client to requested page/limit
      if (!serverPagination) {
        const reqPage = params?.page ?? 1;
        const reqLimit = params?.limit ?? 10;
        const total = Array.isArray(bills) ? bills.length : 0;
        const totalPages = Math.max(1, Math.ceil(total / reqLimit));
        const start = (reqPage - 1) * reqLimit;
        const sliced = Array.isArray(bills) ? bills.slice(start, start + reqLimit) : [];
        return {
          bills: sliced,
          pagination: { total, page: reqPage, limit: reqLimit, totalPages },
        };
      }

      return { bills: Array.isArray(bills) ? bills : [], pagination: serverPagination };
    } catch (error) {
      this.logger.error('Failed to fetch pending bills (paginated):', error);
      return { bills: [], pagination: { total: 0, page: params?.page || 1, limit: params?.limit || 10, totalPages: 1 } };
    }
  }

  /**
   * Bekleyen ödemeler toplamını getirir (içinde bulunulan ay için)
   * GET /admin/billing/pending-payments
   */
  async getPendingPaymentsSummary(): Promise<{ totalPendingAmount: number }> {
    this.logger.info('Fetching pending payments summary');
    try {
      const response = await apiClient.get<{ data: { totalPendingAmount: number } }>(`${this.baseEndpoint}/pending-payments`);
      const totalPendingAmount = (response as any)?.data?.totalPendingAmount ?? 0;
      this.logger.info('Pending payments summary fetched', { totalPendingAmount });
      return { totalPendingAmount };
    } catch (error) {
      this.logger.error('Failed to fetch pending payments summary:', error);
      return { totalPendingAmount: 0 };
    }
  }

  /**
   * Ödenen toplam tutarı getirir (içinde bulunulan ay için)
   * GET /admin/billing/paid-payments
   */
  async getPaidPaymentsSummary(): Promise<{ totalPaidAmount: number }> {
    this.logger.info('Fetching paid payments summary');
    try {
      const response = await apiClient.get<{ data: { totalPaidAmount: number } }>(`${this.baseEndpoint}/paid-payments`);
      const totalPaidAmount = (response as any)?.data?.totalPaidAmount ?? 0;
      this.logger.info('Paid payments summary fetched', { totalPaidAmount });
      return { totalPaidAmount };
    } catch (error) {
      this.logger.error('Failed to fetch paid payments summary:', error);
      return { totalPaidAmount: 0 };
    }
  }

  /**
   * Gecikmiş bekleyen ödemeler toplamını getirir (dueDate < now ve status=PENDING)
   * GET /admin/billing/overdue-pending-payments
   */
  async getOverduePendingPaymentsSummary(): Promise<{ totalOverduePendingAmount: number }> {
    this.logger.info('Fetching overdue pending payments summary');
    try {
      const response = await apiClient.get<{ data: { totalOverduePendingAmount: number } }>(`${this.baseEndpoint}/overdue-pending-payments`);
      const totalOverduePendingAmount = (response as any)?.data?.totalOverduePendingAmount ?? 0;
      this.logger.info('Overdue pending payments summary fetched', { totalOverduePendingAmount });
      return { totalOverduePendingAmount };
    } catch (error) {
      this.logger.error('Failed to fetch overdue pending payments summary:', error);
      return { totalOverduePendingAmount: 0 };
    }
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
   * Birden çok faturayı ödenmiş olarak işaretle
   * PATCH /admin/billing/mark-as-paid
   */
  async markBillsAsPaidBulk(params: { billIds: string[]; paidAt: string }): Promise<{ updatedCount: number; updatedBills: Array<{ id: string; status: string; paidAt: string }> }> {
    this.logger.info('Marking bills as paid (bulk)', params);
    try {
      const response = await apiClient.patch<{ data: { updatedCount: number; updatedBills: Array<{ id: string; status: string; paidAt: string }> } }>(
        `${this.baseEndpoint}/mark-as-paid`,
        params
      );
      const root = (response as any)?.data || {};
      return {
        updatedCount: root?.updatedCount ?? root?.data?.updatedCount ?? 0,
        updatedBills: root?.updatedBills ?? root?.data?.updatedBills ?? [],
      };
    } catch (error) {
      this.logger.error('Failed to mark bills as paid (bulk):', error);
      return { updatedCount: 0, updatedBills: [] };
    }
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

  /**
   * Get monthly paid totals for DUES bills for a given year
   * GET /admin/billing/dues/monthly-paid-totals/:year
   */
  async getDuesMonthlyPaidTotals(year: number): Promise<Array<{ month: number; totalPaid: number }>> {
    this.logger.info('Fetching dues monthly paid totals', { year });
    try {
      const response = await apiClient.get<{ data: Array<{ month: number; totalPaid: number }> }>(
        `${this.baseEndpoint}/dues/monthly-paid-totals/${year}`
      );
      const root: any = response as any;
      const list = root?.data ?? root?.data?.data ?? root?.results ?? [];
      return Array.isArray(list) ? list : [];
    } catch (error) {
      this.logger.error('Failed to fetch dues monthly paid totals', error);
      return [];
    }
  }
}

const billingService = new BillingService();
export default billingService;