import { apiClient } from './api/client';
import { ApiResponse } from './core/types';

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

class BillingService {
  /**
   * Belirli bir kullanıcıya ait ödeme geçmişini getirir
   * GET /admin/billing/user/{userId}
   */
  async getBillsByUser(userId: string): Promise<Bill[]> {
    const response = await apiClient.get<any[]>(`/admin/billing/user/${userId}`);
    return Array.isArray(response) ? response : [];
  }
}

const billingService = new BillingService();
export default billingService; 