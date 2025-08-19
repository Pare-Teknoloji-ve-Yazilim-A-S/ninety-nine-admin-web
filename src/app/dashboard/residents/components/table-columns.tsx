import React from 'react';
import { Resident } from '@/app/components/ui/ResidentRow';
import { TableColumn } from '../types';
import { TABLE_COLUMN_IDS } from '../constants';
import { maskNationalId } from '../utils/transformations';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { 
    Phone, 
    ChevronRight, 
    Eye, 
    Edit, 
    Trash2, 
    MessageSquare, 
    QrCode, 
    StickyNote, 
    History, 
    CreditCard as PaymentHistory 
} from 'lucide-react';

/**
 * Action menu component for table rows
 */
interface ActionMenuProps {
    resident: Resident;
    onViewResident: (resident: Resident) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
    resident,
    onViewResident,
}) => {
    const handleDetailView = (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewResident(resident);
    };

    return (
        <div className="flex items-center justify-center">
            <Button
                variant="ghost"
                size="sm"
                icon={ChevronRight}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleDetailView}
            />
        </div>
    );
};

/**
 * Get table columns configuration
 */
export const getTableColumns = (
  actionHandlers: {
    handleViewResident: (resident: Resident) => void;
  },
  ActionMenuComponent?: React.ComponentType<{ row: Resident }>,
  translations?: {
    photo: string;
    name: string;
    location: string;
    ownershipType: string;
    contact: string;
    membershipType: string;
    verification: string;
    status: string;
    nationalId: string;
    unspecified: string;
    block: string;
    apartment: string;
    unknown: string;
    // Badge and status translations
    approved: string;
    rejected: string;
    underReview: string;
    active: string;
    pending: string;
    inactive: string;
    suspended: string;
    standard: string;
    gold: string;
    silver: string;
    owner: string;
    tenant: string;
  }
): TableColumn[] => {
  // Default translations if not provided
  const t = translations || {
    photo: 'Fotoğraf',
    name: 'Ad Soyad',
    location: 'Konut',
    ownershipType: 'Mülkiyet Türü',
    contact: 'İletişim',
    membershipType: 'Üyelik Türü',
    verification: 'Doğrulama',
    status: 'Durum',
    nationalId: 'Kimlik',
    unspecified: 'Belirtilmemiş',
    block: 'Blok',
    apartment: 'Daire',
    unknown: 'Bilinmiyor',
    // Badge and status translations
    approved: 'Onaylandı',
    rejected: 'Reddedildi',
    underReview: 'İnceleniyor',
    active: 'Aktif',
    pending: 'Beklemede',
    inactive: 'Pasif',
    suspended: 'Askıya Alınmış',
    standard: 'Standart',
    gold: 'Altın',
    silver: 'Gümüş',
    owner: 'Malik',
    tenant: 'Kiracı'
  };

  const columns: TableColumn[] = [
        {
            id: TABLE_COLUMN_IDS.PHOTO,
            header: t.photo,
            accessor: 'avatar',
            width: '80px',
            render: (value: string, row: Resident) => (
                <div className="w-10 h-10 bg-primary-gold rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
                    {value ? (
                        <img src={value} alt={row.fullName} className="w-full h-full object-cover" />
                    ) : (
                        <span>{row.firstName?.charAt(0)}{row.lastName?.charAt(0)}</span>
                    )}
                </div>
            ),
        },
        {
            id: TABLE_COLUMN_IDS.NAME,
            header: t.name,
            accessor: 'fullName',
            sortable: true,
            render: (value: string, row: Resident) => (
                <div>
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">{value}</p>
                    <p className="text-sm text-text-light-muted dark:text-text-muted">
                        {t.nationalId}: {maskNationalId(row.nationalId)}
                    </p>
                </div>
            ),
        },
        {
            id: TABLE_COLUMN_IDS.LOCATION,
            header: t.location,
            accessor: 'address',
            render: (value: { building: string; apartment: string } | any) => {
                // Handle case where value might not be structured correctly
                if (!value || typeof value !== 'object') {
                    return <span className="text-gray-500">-</span>;
                }
                const building = value.building || t.unspecified;
                const apartment = value.apartment || t.unspecified;
                return (
                    <div>
                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                            {building} {t.block} - {apartment} {t.apartment}
                        </p>
                    </div>
                );
            },
        },
        {
            id: TABLE_COLUMN_IDS.TYPE,
            header: t.ownershipType,
            accessor: 'residentType',
            render: (value: { type: 'owner' | 'tenant'; label: string } | any) => {
                // Handle case where value might not be structured correctly
                if (!value || typeof value !== 'object') {
                    return <span className="text-gray-500">-</span>;
                }
                const label = value.label || value.toString();
                const type = value.type || 'unknown';
                
                // Translate the label if it matches known values
                let translatedLabel = label;
                if (label === 'Malik' || label === 'Owner' || label === 'مالك') {
                    translatedLabel = t.owner;
                } else if (label === 'Kiracı' || label === 'Tenant' || label === 'مستأجر') {
                    translatedLabel = t.tenant;
                }
                
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        type === 'owner' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                        {translatedLabel}
                    </span>
                );
            },
        },
        {
            id: TABLE_COLUMN_IDS.CONTACT,
            header: t.contact,
            accessor: 'contact',
            render: (value: { phone: string; email?: string; formattedPhone?: string } | any, row: Resident) => {
                // Handle case where value might not be structured correctly
                if (!value || typeof value !== 'object') {
                    return <span className="text-gray-500">-</span>;
                }
                const phone = value.formattedPhone || value.phone || t.unspecified;
                const email = value.email;
                return (
                    <div className="flex items-center gap-2">
                        <div>
                            <span className="text-sm text-text-on-light dark:text-text-on-dark">
                                {phone}
                            </span>
                            {email && email !== t.unspecified && (
                                <p className="text-xs text-text-light-muted dark:text-text-muted">
                                    {email}
                                </p>
                            )}
                        </div>
                        {/* <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Phone} 
                            className="h-8 w-8 p-1" 
                            onClick={() => actionHandlers.handleCallResident(row)}
                        /> */}
                    </div>
                );
            },
        },
        {
            id: TABLE_COLUMN_IDS.MEMBERSHIP,
            header: t.membershipType,
            accessor: 'membershipTier',
            render: (value: string | any) => {
                // Handle case where value might not be a string
                const membershipTier = typeof value === 'string' ? value : t.standard;
                
                // Translate membership tier
                let translatedTier = membershipTier;
                if (membershipTier === 'Altın' || membershipTier === 'Gold' || membershipTier === 'ذهبي') {
                    translatedTier = t.gold;
                } else if (membershipTier === 'Gümüş' || membershipTier === 'Silver' || membershipTier === 'فضي') {
                    translatedTier = t.silver;
                } else if (membershipTier === 'Standart' || membershipTier === 'Standard' || membershipTier === 'قياسي') {
                    translatedTier = t.standard;
                }
                
                if (translatedTier === t.gold) {
                    return (
                        <Badge
                            variant="soft"
                            color="gold"
                            className="min-w-[88px] text-center justify-center"
                        >
                            {translatedTier}
                        </Badge>
                    );
                } else if (translatedTier === t.silver) {
                    return (
                        <Badge
                            variant="soft"
                            color="secondary"
                            className="min-w-[88px] text-center justify-center"
                        >
                            {translatedTier}
                        </Badge>
                    );
                } else {
                    return (
                        <Badge className="min-w-[88px] text-center justify-center">
                            {translatedTier}
                        </Badge>
                    );
                }
            },
        },
        {
            id: TABLE_COLUMN_IDS.VERIFICATION,
            header: t.verification,
            accessor: 'verificationStatus',
            render: (value: any) => {
                if (!value || typeof value !== 'object') {
                    return <span className="text-gray-500">-</span>;
                }
                
                // Translate verification status label
                let translatedLabel = value.label;
                if (value.label === 'Onaylandı' || value.label === 'Approved' || value.label === 'تمت الموافقة') {
                    translatedLabel = t.approved;
                } else if (value.label === 'Reddedildi' || value.label === 'Rejected' || value.label === 'مرفوض') {
                    translatedLabel = t.rejected;
                } else if (value.label === 'İnceleniyor' || value.label === 'Under Review' || value.label === 'قيد المراجعة') {
                    translatedLabel = t.underReview;
                }
                
                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                            value.color === 'green' ? 'bg-green-500' :
                            value.color === 'red' ? 'bg-red-500' :
                            value.color === 'yellow' ? 'bg-yellow-500' :
                            'bg-gray-500'
                        }`} />
                        <span className="text-sm text-text-on-light dark:text-text-on-dark">
                            {translatedLabel}
                        </span>
                    </div>
                );
            },
        },
        {
            id: TABLE_COLUMN_IDS.STATUS,
            header: t.status,
            accessor: 'status',
            render: (value: any) => {
                // Handle case where value might not be structured correctly
                if (!value || typeof value !== 'object') {
                    return <span className="text-gray-500">-</span>;
                }
                let label = value.label || t.unknown;
                const color = value.color || 'gray';
                
                // Translate status label
                if (label === 'Aktif' || label === 'Active' || label === 'نشط') {
                    label = t.active;
                } else if (label === 'Beklemede' || label === 'Pending' || label === 'في الانتظار') {
                    label = t.pending;
                } else if (label === 'Pasif' || label === 'Inactive' || label === 'غير نشط') {
                    label = t.inactive;
                } else if (label === 'Askıya Alınmış' || label === 'Suspended' || label === 'معلق') {
                    label = t.suspended;
                }
                
                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                            color === 'green' ? 'bg-green-500' :
                            color === 'red' ? 'bg-red-500' :
                                color === 'yellow' ? 'bg-yellow-500' :
                                    'bg-gray-500'
                        }`} />
                        <span className="text-sm text-text-on-light dark:text-text-on-dark">
                            {label}
                        </span>
                    </div>
                );
            },
        },
    ];
  // Eğer ActionMenuComponent varsa, aksiyon sütunu ekleme gerekmiyor, çünkü DataTable bunu kendisi ekleyecek.
  // Eğer yoksa, eski aksiyon sütununu ekle.
  if (!ActionMenuComponent) {
    columns.push({
      id: 'actions',
      header: '',
      accessor: '',
      width: '60px',
      render: (_: any, row: Resident) => (
        <ActionMenu
          resident={row}
          onViewResident={actionHandlers.handleViewResident}
        />
      ),
    });
  }
  return columns;
}; 