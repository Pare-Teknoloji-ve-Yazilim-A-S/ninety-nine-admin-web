import React from 'react';
import { Eye, Edit, MessageSquare, Phone, MoreVertical, User, Home, CreditCard, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Badge from './Badge';
import Button from './Button';

interface ResidentAddress {
    building: string;
    apartment: string;
    floor?: string;
    roomType: string;
}

interface ResidentContact {
    phone: string;
    email?: string;
    secondaryPhone?: string;
    formattedPhone?: string;
}

interface ResidentFinancial {
    balance: number;
    totalDebt: number;
    lastPaymentDate?: string;
}

interface ResidentStatus {
    type: 'active' | 'pending' | 'inactive' | 'suspended';
    label: string;
    color: 'green' | 'yellow' | 'red' | 'gray';
}

interface ResidentType {
    type: 'owner' | 'tenant' | 'guest';
    label: string;
    color: 'blue' | 'green' | 'purple';
}

interface MembershipTier {
    type: string;
    label: string;
    color: string;
}

interface VerificationStatus {
    type: string;
    label: string;
    color: string;
}

export interface Resident {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    nationalId?: string;
    profileImage?: string;
    residentType: ResidentType;
    address: ResidentAddress;
    contact: ResidentContact;
    financial: ResidentFinancial;
    status: ResidentStatus;
    membershipTier: MembershipTier;
    verificationStatus: VerificationStatus;
    registrationDate: string;
    lastActivity?: string;
    notes?: string;
    tags?: string[];
    isGoldMember?: boolean;
}

interface ResidentRowProps {
    resident: Resident;
    onAction: (action: string, resident: Resident) => void;
    selectable?: boolean;
    selected?: boolean;
    onSelect?: (resident: Resident) => void;
    showDetails?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const ResidentRow: React.FC<ResidentRowProps> = ({
    resident,
    onAction,
    selectable = false,
    selected = false,
    onSelect,
    showDetails = true,
    className,
    size = 'md',
}) => {
    const sizeClasses = {
        sm: 'p-2 text-xs',
        md: 'p-4 text-sm',
        lg: 'p-6 text-base',
    };

    const avatarSizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const getStatusColor = (status: ResidentStatus) => {
        switch (status.color) {
            case 'green':
                return 'success';
            case 'yellow':
                return 'warning';
            case 'red':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const getTypeColor = (type: ResidentType) => {
        switch (type.color) {
            case 'blue':
                return 'primary';
            case 'green':
                return 'success';
            case 'purple':
                return 'accent';
            default:
                return 'secondary';
        }
    };

    const getStatusIcon = (status: ResidentStatus) => {
        switch (status.type) {
            case 'active':
                return <CheckCircle size={12} className="text-semantic-success-600" />;
            case 'pending':
                return <Clock size={12} className="text-semantic-warning-600" />;
            case 'inactive':
            case 'suspended':
                return <AlertCircle size={12} className="text-primary-red" />;
            default:
                return null;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR');
    };

    const maskNationalId = (nationalId?: string) => {
        if (!nationalId) return '';
        return `****${nationalId.slice(-3)}`;
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const handleActionClick = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onAction(action, resident);
    };

    const handleRowClick = () => {
        if (selectable && onSelect) {
            onSelect(resident);
        }
    };

    const hasDebt = resident.financial.totalDebt > 0;

    return (
        <tr
            className={cn(
                'border-t border-gray-200 dark:border-gray-700 transition-colors',
                'hover:bg-background-light-soft dark:hover:bg-background-soft',
                selected && 'bg-primary-gold/10',
                selectable && 'cursor-pointer',
                className
            )}
            onClick={handleRowClick}
        >
            {/* Selection checkbox */}
            {selectable && (
                <td className={sizeClasses[size]}>
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {
                            e.stopPropagation();
                            onSelect?.(resident);
                        }}
                        className="rounded border-gray-300 text-primary-gold focus:ring-primary-gold/50"
                    />
                </td>
            )}

            {/* Profile Photo */}
            <td className={sizeClasses[size]}>
                <div className="flex items-center justify-center">
                    {resident.profileImage ? (
                        <img
                            src={resident.profileImage}
                            alt={resident.fullName}
                            className={cn(
                                'rounded-full object-cover',
                                avatarSizes[size]
                            )}
                        />
                    ) : (
                        <div className={cn(
                            'rounded-full flex items-center justify-center font-medium text-white',
                            avatarSizes[size],
                            resident.isGoldMember ? 'bg-primary-gold' : 'bg-primary-gray-blue'
                        )}>
                            {getInitials(resident.firstName, resident.lastName)}
                        </div>
                    )}
                </div>
            </td>

            {/* Name and Personal Info */}
            <td className={sizeClasses[size]}>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                            {resident.fullName}
                        </p>
                        {resident.isGoldMember && (
                            <Badge variant="solid" color="gold" size="sm">
                                Gold
                            </Badge>
                        )}
                    </div>
                    {showDetails && (
                        <div className="flex items-center gap-2">
                            <User size={12} className="text-text-light-muted dark:text-text-muted" />
                            <p className="text-text-light-muted dark:text-text-muted">
                                TC: {maskNationalId(resident.nationalId)}
                            </p>
                        </div>
                    )}
                </div>
            </td>

            {/* Address */}
            <td className={sizeClasses[size]}>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Home size={12} className="text-text-light-muted dark:text-text-muted" />
                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                            {resident.address.building} - {resident.address.apartment}
                        </p>
                    </div>
                    {showDetails && (
                        <p className="text-text-light-secondary dark:text-text-secondary">
                            {resident.address.roomType}
                        </p>
                    )}
                </div>
            </td>

            {/* Type */}
            <td className={sizeClasses[size]}>
                <Badge
                    variant="soft"
                    color={getTypeColor(resident.residentType) as any}
                    size="sm"
                >
                    {resident.residentType.label}
                </Badge>
            </td>

            {/* Contact */}
            <td className={sizeClasses[size]}>
                <div className="flex items-center gap-2">
                    <span className="text-text-on-light dark:text-text-on-dark">
                        {resident.contact.phone}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Phone}
                        onClick={(e) => handleActionClick('call', e)}
                        className="h-6 w-6 p-1"
                        title="Ara"
                    />
                </div>
            </td>

            {/* Financial */}
            <td className={sizeClasses[size]}>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <CreditCard size={12} className="text-text-light-muted dark:text-text-muted" />
                        <span className={cn(
                            'font-medium',
                            hasDebt ? 'text-primary-red' : 'text-semantic-success-600'
                        )}>
                            {formatCurrency(resident.financial.totalDebt)}
                        </span>
                    </div>
                    {showDetails && resident.financial.lastPaymentDate && (
                        <p className="text-text-light-secondary dark:text-text-secondary">
                            Son: {formatDate(resident.financial.lastPaymentDate)}
                        </p>
                    )}
                </div>
            </td>

            {/* Status */}
            <td className={sizeClasses[size]}>
                <div className="flex items-center gap-2">
                    {getStatusIcon(resident.status)}
                    <Badge
                        variant="soft"
                        color={getStatusColor(resident.status) as any}
                        size="sm"
                    >
                        {resident.status.label}
                    </Badge>
                </div>
            </td>

            {/* Actions */}
            <td className={sizeClasses[size]}>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={(e) => handleActionClick('view', e)}
                        className="h-8 w-8 p-1"
                        title="Görüntüle"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={(e) => handleActionClick('edit', e)}
                        className="h-8 w-8 p-1"
                        title="Düzenle"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={MessageSquare}
                        onClick={(e) => handleActionClick('message', e)}
                        className="h-8 w-8 p-1"
                        title="Mesaj Gönder"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={MoreVertical}
                        onClick={(e) => handleActionClick('more', e)}
                        className="h-8 w-8 p-1"
                        title="Daha Fazla"
                    />
                </div>
            </td>
        </tr>
    );
};

export default ResidentRow;