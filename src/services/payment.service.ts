import { BaseService } from './core/base.service';
import { apiClient } from './api/client';
import { ApiResponse } from './core/types';
import {
  CreatePaymentDto,
  ResponsePaymentDto,
  UpdatePaymentDto,
  PaymentStatus,
  PaymentMethod
} from './types/billing.types';

class PaymentService extends BaseService<ResponsePaymentDto, CreatePaymentDto, UpdatePaymentDto> {
  protected baseEndpoint = '/admin/payments';

  constructor() {
    super('PaymentService');
  }

  /**
   * Yeni ödeme kaydet
   * POST /admin/payments
   */
  async createPayment(paymentData: CreatePaymentDto): Promise<ApiResponse<ResponsePaymentDto>> {
    this.logger.info('Creating new payment', paymentData);
    
    const response = await apiClient.post<ResponsePaymentDto>(this.baseEndpoint, paymentData);
    
    this.logger.info('Payment created successfully', response.data);
    return response;
  }

  /**
   * Tüm ödemeleri getir
   * GET /admin/payments
   */
  async getAllPayments(): Promise<ResponsePaymentDto[]> {
    this.logger.info('Fetching all payments');
    
    const response = await apiClient.get<ResponsePaymentDto[]>(this.baseEndpoint);
    const payments = Array.isArray(response) ? response : [];
    
    this.logger.info(`Fetched ${payments.length} payments`);
    return payments;
  }

  /**
   * Duruma göre ödemeleri getir
   * GET /admin/payments/status/{status}
   */
  async getPaymentsByStatus(status: PaymentStatus): Promise<ResponsePaymentDto[]> {
    this.logger.info(`Fetching payments with status: ${status}`);
    
    const response = await apiClient.get<ResponsePaymentDto[]>(`${this.baseEndpoint}/status/${status}`);
    const payments = Array.isArray(response) ? response : [];
    
    this.logger.info(`Fetched ${payments.length} payments with status ${status}`);
    return payments;
  }

  /**
   * Tarih aralığına göre ödemeleri getir
   * GET /admin/payments/date-range?startDate=...&endDate=...
   */
  async getPaymentsByDateRange(startDate: string, endDate: string): Promise<ResponsePaymentDto[]> {
    this.logger.info(`Fetching payments between ${startDate} and ${endDate}`);
    
    const response = await apiClient.get<ResponsePaymentDto[]>(
      `${this.baseEndpoint}/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    const payments = Array.isArray(response) ? response : [];
    
    this.logger.info(`Fetched ${payments.length} payments for date range`);
    return payments;
  }

  /**
   * Belirli ay ve yıla göre ödemeleri getir
   * GET /admin/payments/month/{month}/year/{year}
   */
  async getPaymentsByMonth(month: number, year: number): Promise<ResponsePaymentDto[]> {
    this.logger.info(`Fetching payments for ${month}/${year}`);
    
    const response = await apiClient.get<ResponsePaymentDto[]>(
      `${this.baseEndpoint}/month/${month}/year/${year}`
    );
    const payments = Array.isArray(response) ? response : [];
    
    this.logger.info(`Fetched ${payments.length} payments for ${month}/${year}`);
    return payments;
  }

  /**
   * Belirli bir mülke ait ödemeleri getir
   * GET /admin/payments/property/{propertyId}
   */
  async getPaymentsByProperty(propertyId: string): Promise<ResponsePaymentDto[]> {
    this.logger.info(`Fetching payments for property: ${propertyId}`);
    
    const response = await apiClient.get<ResponsePaymentDto[]>(`${this.baseEndpoint}/property/${propertyId}`);
    const payments = Array.isArray(response) ? response : [];
    
    this.logger.info(`Fetched ${payments.length} payments for property ${propertyId}`);
    return payments;
  }

  /**
   * Belirli bir kullanıcının ödemelerini getir
   * GET /admin/payments/user/{userId}
   */
  async getPaymentsByUser(userId: string): Promise<ResponsePaymentDto[]> {
    this.logger.info(`Fetching payments for user: ${userId}`);
    
    const response = await apiClient.get<ResponsePaymentDto[]>(`${this.baseEndpoint}/user/${userId}`);
    const payments = Array.isArray(response) ? response : [];
    
    this.logger.info(`Fetched ${payments.length} payments for user ${userId}`);
    return payments;
  }

  /**
   * Belirli bir faturaya ait ödemeleri getir
   * GET /admin/payments/bill/{billId}
   */
  async getPaymentsByBill(billId: string): Promise<ResponsePaymentDto[]> {
    this.logger.info(`Fetching payments for bill: ${billId}`);
    
    const response = await apiClient.get<ResponsePaymentDto[]>(`${this.baseEndpoint}/bill/${billId}`);
    const payments = Array.isArray(response) ? response : [];
    
    this.logger.info(`Fetched ${payments.length} payments for bill ${billId}`);
    return payments;
  }

  /**
   * Ödeme detayını getir
   * GET /admin/payments/{id}
   */
  async getPaymentById(paymentId: string): Promise<ApiResponse<ResponsePaymentDto>> {
    this.logger.info(`Fetching payment details: ${paymentId}`);
    
    const response = await apiClient.get<ResponsePaymentDto>(`${this.baseEndpoint}/${paymentId}`);
    
    this.logger.info(`Fetched payment ${paymentId} details`);
    return response;
  }

  /**
   * Ödemeyi güncelle
   * PUT /admin/payments/{id}
   */
  async updatePayment(paymentId: string, updateData: UpdatePaymentDto): Promise<ApiResponse<ResponsePaymentDto>> {
    this.logger.info(`Updating payment: ${paymentId}`, updateData);
    
    const response = await apiClient.put<ResponsePaymentDto>(`${this.baseEndpoint}/${paymentId}`, updateData);
    
    this.logger.info(`Payment ${paymentId} updated successfully`);
    return response;
  }

  /**
   * Ödemeyi sil
   * DELETE /admin/payments/{id}
   */
  async deletePayment(paymentId: string): Promise<ApiResponse<void>> {
    this.logger.info(`Deleting payment: ${paymentId}`);
    
    const response = await apiClient.delete<void>(`${this.baseEndpoint}/${paymentId}`);
    
    this.logger.info(`Payment ${paymentId} deleted successfully`);
    return response;
  }

  /**
   * Bekleyen ödemeleri getir
   */
  async getPendingPayments(): Promise<ResponsePaymentDto[]> {
    return this.getPaymentsByStatus('PENDING');
  }

  /**
   * Tamamlanan ödemeleri getir
   */
  async getCompletedPayments(): Promise<ResponsePaymentDto[]> {
    return this.getPaymentsByStatus('COMPLETED');
  }

  /**
   * Başarısız ödemeleri getir
   */
  async getFailedPayments(): Promise<ResponsePaymentDto[]> {
    return this.getPaymentsByStatus('FAILED');
  }

  /**
   * İade edilen ödemeleri getir
   */
  async getRefundedPayments(): Promise<ResponsePaymentDto[]> {
    return this.getPaymentsByStatus('REFUNDED');
  }
}

const paymentService = new PaymentService();
export default paymentService;