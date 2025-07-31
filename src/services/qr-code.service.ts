import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';

export interface GuestQrCode {
  id: string;
  type: string;
  createdBy: { id: string };
  guestName: string;
  createdAt: string;
  // ...other fields as needed
}

export interface GuestQrCodeResponse {
  data: GuestQrCode[];
}

class QrCodeService {
  /**
   * Fetch guest QR codes by userId
   * GET /admin/qrcodes/guest/by-user/:userId
   */
  async getGuestQRCodesByUser(userId: string): Promise<GuestQrCode[]> {
    const endpoint = `/admin/qrcodes/guest/by-user/${userId}`;
    const response = await apiClient.get<GuestQrCodeResponse>(endpoint);
    return response.data.data;
  }
}

const qrCodeService = new QrCodeService();
export default qrCodeService;