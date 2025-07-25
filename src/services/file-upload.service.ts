import { apiClient } from './api/client';
import { apiConfig } from './config/api.config';
import { ApiResponse } from './core/types';

export interface UploadedFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface UploadFileResponse {
  file: UploadedFile;
  success: boolean;
  message: string;
}

export const fileUploadService = {
  /**
   * Upload a single file to the server
   */
  async uploadFile(file: File): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileType', file.type);
    formData.append('fileSize', file.size.toString());

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      const response: ApiResponse<UploadFileResponse> = await apiClient.post(
        apiConfig.endpoints.files.upload,
        formData
      );

      console.log('File upload response:', response);
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Upload multiple files
   */
  async uploadFiles(files: File[]): Promise<UploadFileResponse[]> {
    console.log(`Uploading ${files.length} files...`);
    
    const uploadPromises = files.map(file => this.uploadFile(file));
    
    try {
      const results = await Promise.all(uploadPromises);
      console.log('All files uploaded successfully:', results);
      return results;
    } catch (error) {
      console.error('Error uploading some files:', error);
      throw error;
    }
  },

  /**
   * Get file info by URL or ID
   */
  async getFileInfo(fileId: string): Promise<UploadedFile> {
    const response: ApiResponse<UploadedFile> = await apiClient.get(`/admin/files/${fileId}`);
    return response.data;
  },

  /**
   * Delete a file by ID
   */
  async deleteFile(fileId: string): Promise<{ success: boolean; message: string }> {
    const response: ApiResponse<{ success: boolean; message: string }> = await apiClient.delete(`/admin/files/${fileId}`);
    return response.data;
  },

  /**
   * Validate file before upload
   */
  validateFile(file: File, options: {
    maxSize?: number; // in MB
    allowedTypes?: string[];
  } = {}): { isValid: boolean; error?: string } {
    const { maxSize = 5, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] } = options;

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      return {
        isValid: false,
        error: `Dosya boyutu ${maxSize}MB'den büyük olamaz. Mevcut boyut: ${fileSizeInMB.toFixed(2)}MB`
      };
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Desteklenmeyen dosya formatı. İzin verilen formatlar: ${allowedTypes.join(', ')}`
      };
    }

    return { isValid: true };
  },
}; 