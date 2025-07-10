import { Resident } from '@/app/components/ui/ResidentRow';
import { ResidentStatsResponse } from '@/services/types/resident.types';
import { StatsData } from '../types';
import { STATS_CONFIG } from '../constants';

/**
 * Calculate stats from residents data
 * @param residents - Array of residents
 * @param totalRecords - Total number of records
 * @returns Stats response object
 */
export const calculateStatsFromResidents = (residents: Resident[], totalRecords: number): ResidentStatsResponse => {
    const activeResidents = residents.filter(r => r.status.type === 'active').length;
    const pendingResidents = residents.filter(r => r.status.type === 'pending').length;
    const owners = residents.filter(r => r.residentType.type === 'owner').length;
    const tenants = residents.filter(r => r.residentType.type === 'tenant').length;
    const goldMembers = residents.filter(r => r.isGoldMember).length;
    const standardMembers = residents.filter(r => !r.isGoldMember).length;
    const inactiveResidents = residents.filter(r => r.status.type === 'inactive').length;

    return {
        totalResidents: totalRecords,
        activeResidents,
        pendingApproval: pendingResidents,
        newRegistrationsThisMonth: 0, // This would come from API
        approvedThisMonth: 0, // This would come from API
        rejectedThisMonth: 0, // This would come from API
        byMembershipTier: {
            gold: goldMembers,
            silver: 0, // Not currently tracked
            standard: standardMembers
        },
        byOwnershipType: {
            owner: owners,
            tenant: tenants
        },
        byStatus: {
            active: activeResidents,
            inactive: inactiveResidents,
            pending: pendingResidents,
            suspended: 0, // Not currently tracked
            banned: 0 // Not currently tracked
        }
    };
};

/**
 * Generate stats cards data from stats response
 * @param stats - Stats response object
 * @returns Array of stats card data
 */
export const generateStatsCardsData = (stats: ResidentStatsResponse | null): StatsData[] => {
    if (!stats) {
        return [
            { 
                title: 'Toplam Sakin', 
                value: '0', 
                color: STATS_CONFIG.colors.PRIMARY, 
                icon: STATS_CONFIG.icons.USERS 
            },
            { 
                title: 'Malik', 
                value: '0', 
                subtitle: '%0', 
                color: STATS_CONFIG.colors.SUCCESS, 
                icon: STATS_CONFIG.icons.HOME 
            },
            { 
                title: 'Kiracı', 
                value: '0', 
                subtitle: '%0', 
                color: STATS_CONFIG.colors.INFO, 
                icon: STATS_CONFIG.icons.USERS 
            },
            { 
                title: 'Aktif', 
                value: '0', 
                subtitle: '%0', 
                color: STATS_CONFIG.colors.DANGER, 
                icon: STATS_CONFIG.icons.CREDIT_CARD 
            },
            { 
                title: 'Gold Üye', 
                value: '0', 
                subtitle: '%0', 
                color: STATS_CONFIG.colors.GOLD, 
                icon: STATS_CONFIG.icons.USERS 
            },
        ];
    }

    const totalResidents = stats.totalResidents || 0;
    const owners = stats.byOwnershipType?.owner || 0;
    const tenants = stats.byOwnershipType?.tenant || 0;
    const active = stats.byStatus?.active || 0;
    const gold = stats.byMembershipTier?.gold || 0;

    return [
        {
            title: 'Toplam Sakin',
            value: totalResidents.toLocaleString('tr-TR'),
            color: STATS_CONFIG.colors.PRIMARY,
            icon: STATS_CONFIG.icons.USERS
        },
        {
            title: 'Malik',
            value: owners.toLocaleString('tr-TR'),
            subtitle: totalResidents > 0 ? `%${Math.round((owners / totalResidents) * 100)}` : '%0',
            color: STATS_CONFIG.colors.SUCCESS,
            icon: STATS_CONFIG.icons.HOME
        },
        {
            title: 'Kiracı',
            value: tenants.toLocaleString('tr-TR'),
            subtitle: totalResidents > 0 ? `%${Math.round((tenants / totalResidents) * 100)}` : '%0',
            color: STATS_CONFIG.colors.INFO,
            icon: STATS_CONFIG.icons.USERS
        },
        {
            title: 'Aktif',
            value: active.toLocaleString('tr-TR'),
            subtitle: totalResidents > 0 ? `%${Math.round((active / totalResidents) * 100)}` : '%0',
            color: STATS_CONFIG.colors.DANGER,
            icon: STATS_CONFIG.icons.CREDIT_CARD
        },
        {
            title: 'Gold Üye',
            value: gold.toLocaleString('tr-TR'),
            subtitle: totalResidents > 0 ? `%${Math.round((gold / totalResidents) * 100)}` : '%0',
            color: STATS_CONFIG.colors.GOLD,
            icon: STATS_CONFIG.icons.USERS
        },
    ];
};

/**
 * Calculate percentage
 * @param value - Numerator
 * @param total - Denominator
 * @returns Percentage string
 */
export const calculatePercentage = (value: number, total: number): string => {
    if (total === 0) return '%0';
    return `%${Math.round((value / total) * 100)}`;
};

/**
 * Format number with Turkish locale
 * @param value - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
    return value.toLocaleString('tr-TR');
}; 