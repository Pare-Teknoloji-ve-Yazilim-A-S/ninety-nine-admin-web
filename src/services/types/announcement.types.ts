// Announcement Types - Domain Layer
import { ApiResponse, PaginatedResponse, FilterParams } from '../core/types';

// Enums matching API-99CLUB schema
export enum AnnouncementType {
    GENERAL = 'GENERAL',
    MAINTENANCE = 'MAINTENANCE',
    EMERGENCY = 'EMERGENCY',
    EVENT = 'EVENT',
    RULE = 'RULE',
    MEETING = 'MEETING',
    OTHER = 'OTHER'
}

export enum AnnouncementStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED'
}

// Base interfaces matching API schema
export interface CreateAnnouncementDto {
    title: string;
    content: string;
    type?: AnnouncementType;
    status?: AnnouncementStatus;
    publishDate?: string;
    expiryDate?: string;
    isPinned?: boolean;
    isEmergency?: boolean;
    imageUrl?: string;
    propertyIds?: string[];
    createdById?: string;
}

export interface UpdateAnnouncementDto {
    title?: string;
    content?: string;
    type?: AnnouncementType;
    status?: AnnouncementStatus;
    publishDate?: string;
    expiryDate?: string;
    isPinned?: boolean;
    isEmergency?: boolean;
    imageUrl?: string;
    propertyIds?: string[];
    updatedById?: string;
}

export interface ResponseUserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role?: string;
}

export interface ResponsePropertyDto {
    id: string;
    name: string;
    address?: string;
    type?: string;
    status?: string;
}

export interface Announcement {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    title: string;
    content: string;
    type: AnnouncementType;
    status: AnnouncementStatus;
    publishDate?: string;
    expiryDate?: string;
    isPinned: boolean;
    isEmergency: boolean;
    imageUrl?: string;
    createdBy?: ResponseUserDto;
    properties?: ResponsePropertyDto[];
}

// Filter parameters for announcements
export interface AnnouncementFilterParams extends FilterParams {
    status?: AnnouncementStatus | AnnouncementStatus[];
    type?: AnnouncementType | AnnouncementType[];
    isEmergency?: boolean;
    isPinned?: boolean;
    propertyId?: string;
    userId?: string;
    publishDateFrom?: string;
    publishDateTo?: string;
    expiryDateFrom?: string;
    expiryDateTo?: string;
    createdById?: string;
}

// Response types
export interface AnnouncementListResponse extends PaginatedResponse<Announcement> {}

// Bulk action types
export interface AnnouncementBulkActionDto {
    ids: string[];
    action: 'publish' | 'archive' | 'delete' | 'pin' | 'unpin' | 'mark_emergency' | 'unmark_emergency';
    data?: {
        status?: AnnouncementStatus;
        isPinned?: boolean;
        isEmergency?: boolean;
    };
}

export interface AnnouncementBulkActionResponse {
    success: boolean;
    affectedCount: number;
    message: string;
    errors?: string[];
}

// Stats interfaces
export interface AnnouncementStats {
    total: number;
    draft: number;
    published: number;
    archived: number;
    emergency: number;
    pinned: number;
    expiringSoon: number;
    byType: {
        [key in AnnouncementType]: number;
    };
}

// Upload response for images
export interface AnnouncementImageUploadResponse {
    success: boolean;
    imageUrl: string;
    message?: string;
}

// Form data interfaces for UI
export interface AnnouncementFormData {
    title: string;
    content: string;
    type: AnnouncementType;
    status: AnnouncementStatus;
    publishDate?: Date;
    expiryDate?: Date;
    isPinned: boolean;
    isEmergency: boolean;
    // For legacy single-image flows we keep these optional
    image?: File;
    imageUrl?: string;
    // New multi-file upload support for create endpoint
    files?: File[];
    propertyIds: string[];
}

// Display interfaces
export interface AnnouncementDisplayData extends Announcement {
    statusLabel: string;
    statusColor: 'primary' | 'gold' | 'secondary' | 'red';
    typeLabel: string;
    typeColor: 'primary' | 'gold' | 'secondary' | 'accent';
    isExpired: boolean;
    isExpiringSoon: boolean;
    daysUntilExpiry?: number;
    authorName: string;
    propertiesCount: number;
    canEdit: boolean;
    canDelete: boolean;
    canPublish: boolean;
    canArchive: boolean;
}

// Search and sort options
export interface AnnouncementSortConfig {
    key: keyof Announcement;
    direction: 'asc' | 'desc';
}

export const ANNOUNCEMENT_TYPE_OPTIONS = [
    { value: AnnouncementType.GENERAL, label: 'Genel', color: 'secondary' },
    { value: AnnouncementType.MAINTENANCE, label: 'Bakım', color: 'gold' },
    { value: AnnouncementType.EMERGENCY, label: 'Acil Durum', color: 'red' },
    { value: AnnouncementType.EVENT, label: 'Etkinlik', color: 'primary' },
    { value: AnnouncementType.RULE, label: 'Kural', color: 'accent' },
    { value: AnnouncementType.MEETING, label: 'Toplantı', color: 'secondary' },
    { value: AnnouncementType.OTHER, label: 'Diğer', color: 'secondary' }
] as const;

export const ANNOUNCEMENT_STATUS_OPTIONS = [
    { value: AnnouncementStatus.DRAFT, label: 'Taslak', color: 'secondary' },
    { value: AnnouncementStatus.PUBLISHED, label: 'Yayında', color: 'primary' },
    { value: AnnouncementStatus.ARCHIVED, label: 'Arşiv', color: 'accent' }
] as const;

// Helper functions for display
export function getAnnouncementTypeLabel(type: AnnouncementType): string {
    return ANNOUNCEMENT_TYPE_OPTIONS.find(option => option.value === type)?.label || type;
}

export function getAnnouncementStatusLabel(status: AnnouncementStatus): string {
    return ANNOUNCEMENT_STATUS_OPTIONS.find(option => option.value === status)?.label || status;
}

export function getAnnouncementTypeColor(type: AnnouncementType): string {
    return ANNOUNCEMENT_TYPE_OPTIONS.find(option => option.value === type)?.color || 'secondary';
}

export function getAnnouncementStatusColor(status: AnnouncementStatus): string {
    return ANNOUNCEMENT_STATUS_OPTIONS.find(option => option.value === status)?.color || 'secondary';
}

export function isAnnouncementExpired(announcement: Announcement): boolean {
    if (!announcement.expiryDate) return false;
    return new Date(announcement.expiryDate) < new Date();
}

export function isAnnouncementExpiringSoon(announcement: Announcement): boolean {
    if (!announcement.expiryDate) return false;
    const expiryDate = new Date(announcement.expiryDate);
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
    return expiryDate > now && expiryDate <= threeDaysFromNow;
}

export function getDaysUntilExpiry(announcement: Announcement): number | undefined {
    if (!announcement.expiryDate) return undefined;
    const expiryDate = new Date(announcement.expiryDate);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}