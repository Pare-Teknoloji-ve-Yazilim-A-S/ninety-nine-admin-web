import { Resident } from '@/app/components/ui/ResidentRow';
import { ApiResident } from '../types';
import { 
    STATUS_CONFIG, 
    MEMBERSHIP_CONFIG, 
    VERIFICATION_CONFIG, 
    DEFAULT_VALUES 
} from '../constants';

/**
 * Get status label and color based on status string
 */
export const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.default;
};

/**
 * Get membership label and color based on membership tier
 */
export const getMembershipConfig = (tier: string) => {
    return MEMBERSHIP_CONFIG[tier] || MEMBERSHIP_CONFIG.default;
};

/**
 * Get verification label and color based on verification status
 */
export const getVerificationConfig = (status: string) => {
    switch ((status || '').toUpperCase()) {
        case 'APPROVED':
            return { label: 'Onaylandı', color: 'green' };
        case 'REJECTED':
            return { label: 'Reddedildi', color: 'red' };
        case 'PENDING':
        case 'UNDER_REVIEW':
        default:
            return { label: 'İnceleniyor', color: 'yellow' };
    }
};

/**
 * Format Iraq phone number
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export const formatIraqPhone = (phone: string): string => {
    if (!phone) return 'Belirtilmemiş';
    
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Iraq phone format: +964XXXXXXXXX
    if (digits.startsWith('964')) {
        return `+${digits}`;
    } else if (digits.startsWith('0')) {
        return `+964${digits.substring(1)}`;
    } else {
        return `+964${digits}`;
    }
};

/**
 * Mask national ID for privacy
 * @param nationalId - National ID string
 * @returns Masked national ID
 */
export const maskNationalId = (nationalId?: string): string => {
    if (!nationalId) return '';
    
    const visibleLength = DEFAULT_VALUES.NATIONAL_ID_MASK_LENGTH;
    if (nationalId.length <= visibleLength) {
        return nationalId;
    }
    
    return '****' + nationalId.slice(-visibleLength);
};

/**
 * Transform API resident to component resident
 * @param apiResident - API resident data
 * @returns Component resident data
 */
export const transformApiResidentToComponentResident = (apiResident: ApiResident): Resident => {
    const statusConfig = getStatusConfig(apiResident.status || '');
    const membershipConfig = getMembershipConfig(apiResident.membershipTier || '');
    const verificationConfig = getVerificationConfig(apiResident.verificationStatus || 'PENDING');

    return {
        id: String(apiResident.id),
        firstName: apiResident.firstName,
        lastName: apiResident.lastName,
        fullName: `${apiResident.firstName} ${apiResident.lastName}`,
        
        // Iraq-specific: National ID could be Iraqi National ID or Passport
        nationalId: apiResident.tcKimlikNo || apiResident.nationalId || apiResident.passportNumber || '',

        // Property information from API
        residentType: {
            type: apiResident.property?.ownershipType || 'owner',
            label: apiResident.property?.ownershipType === 'tenant' ? 'Kiracı' : 'Malik',
            color: apiResident.property?.ownershipType === 'tenant' ? 'blue' : 'green'
        },
        
        address: {
            building: apiResident.property?.block || 'Belirtilmemiş',
            apartment: apiResident.property?.apartment || 'Belirtilmemiş',
            roomType: apiResident.property?.roomType || 'Belirtilmemiş',
        },
        
        contact: {
            phone: apiResident.phone || 'Belirtilmemiş',
            email: apiResident.email || 'Belirtilmemiş',
            formattedPhone: formatIraqPhone(apiResident.phone || '')
        },
        
        financial: {
            balance: apiResident.financial?.balance || 0,
            totalDebt: apiResident.financial?.totalDebt || 0,
            lastPaymentDate: apiResident.financial?.lastPaymentDate
        },
        
        status: {
            type: (
                apiResident.status?.toLowerCase() === 'pending' ? 'pending' :
                apiResident.status?.toLowerCase() === 'inactive' ? 'inactive' :
                apiResident.status?.toLowerCase() === 'banned' ? 'suspended' :
                apiResident.status?.toLowerCase() === 'suspended' ? 'suspended' :
                'active'
            ) as 'active' | 'pending' | 'inactive' | 'suspended',
            label: statusConfig.label,
            color: statusConfig.color
        },
        
        // Membership and verification - Note: We need to check if these fields exist in Resident type
        membershipTier: membershipConfig.label,
        verificationStatus: verificationConfig,
        
        registrationDate: apiResident.createdAt || '',
        lastActivity: apiResident.updatedAt || new Date().toISOString(),
        isGoldMember: apiResident.membershipTier === 'GOLD',
        avatar: apiResident.avatar,
        notes: apiResident.notes || '',
        tags: [] // Default empty tags
    };
};

/**
 * Transform multiple API residents to component residents
 * @param apiResidents - Array of API resident data
 * @returns Array of component resident data
 */
export const transformApiResidentsToComponentResidents = (apiResidents: ApiResident[]): Resident[] => {
    return apiResidents.map(transformApiResidentToComponentResident);
}; 