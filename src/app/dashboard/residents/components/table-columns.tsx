import React from 'react';
import { Resident } from '@/app/components/ui/ResidentRow';
import { TableColumn } from '../types';
import { TABLE_COLUMN_IDS } from '../constants';
import { maskNationalId } from '../utils/transformations';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { 
    Phone, 
    MoreVertical, 
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
    onEditResident: (resident: Resident) => void;
    onDeleteResident: (resident: Resident) => void;
    onCallResident: (resident: Resident) => void;
    onMessageResident: (resident: Resident) => void;
    onGenerateQR: (resident: Resident) => void;
    onViewNotes: (resident: Resident) => void;
    onViewHistory: (resident: Resident) => void;
    onViewPaymentHistory: (resident: Resident) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
    resident,
    onViewResident,
    onEditResident,
    onDeleteResident,
    onCallResident,
    onMessageResident,
    onGenerateQR,
    onViewNotes,
    onViewHistory,
    onViewPaymentHistory,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && 
                buttonRef.current && 
                !dropdownRef.current.contains(event.target as Node) && 
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDropdownToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleAction = (action: () => void) => (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        action();
    };

    return (
        <div className="flex items-center justify-center">
            <div className="relative group">
                <Button
                    ref={buttonRef}
                    variant="ghost"
                    size="sm"
                    icon={MoreVertical}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleDropdownToggle}
                />

                {/* Dropdown Menu */}
                <div 
                    ref={dropdownRef}
                    className={`absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 ${isOpen ? '' : 'hidden'}`}
                >
                    <div className="py-1">
                        {/* Primary Actions */}
                        <button
                            onClick={handleAction(() => onViewResident(resident))}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <Eye className="w-5 h-5" />
                            Görüntüle
                        </button>

                        <button
                            onClick={handleAction(() => onEditResident(resident))}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <Edit className="w-5 h-5" />
                            Düzenle
                        </button>

                        <hr className="border-gray-200 dark:border-gray-600 my-1" />

                        {/* Communication Actions */}
                        <button
                            onClick={handleAction(() => onCallResident(resident))}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <Phone className="w-5 h-5" />
                            Ara
                        </button>

                        <button
                            onClick={handleAction(() => onMessageResident(resident))}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Mesaj
                        </button>

                        <hr className="border-gray-200 dark:border-gray-600 my-1" />

                        {/* Utility Actions */}
                        {/* <button
                            onClick={handleAction(() => onGenerateQR(resident))}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <QrCode className="w-5 h-5" />
                            QR Kod
                        </button> */}

                        {/* <button
                            onClick={handleAction(() => onViewNotes(resident))}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <StickyNote className="w-5 h-5" />
                            Notlar
                        </button> */}

                        {/* <button
                            onClick={handleAction(() => onViewHistory(resident))}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <History className="w-5 h-5" />
                            Geçmiş
                        </button> */}

                        <button
                            onClick={handleAction(() => onViewPaymentHistory(resident))}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                            <PaymentHistory className="w-5 h-5" />
                            Ödeme Geçmişi
                        </button>

                        <hr className="border-gray-200 dark:border-gray-600 my-1" />

                        {/* Danger Actions */}
                        <button
                            onClick={handleAction(() => onDeleteResident(resident))}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                        >
                            <Trash2 className="w-5 h-5" />
                            Sil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Get table columns configuration
 */
export const getTableColumns = (
  actionHandlers: {
    handleViewResident: (resident: Resident) => void;
    handleEditResident: (resident: Resident) => void;
    handleDeleteResident: (resident: Resident) => void;
    handleCallResident: (resident: Resident) => void;
    handleMessageResident: (resident: Resident) => void;
    handleGenerateQR: (resident: Resident) => void;
    handleViewNotes: (resident: Resident) => void;
    handleViewHistory: (resident: Resident) => void;
    handleViewPaymentHistory: (resident: Resident) => void;
  },
  ActionMenuComponent?: React.ComponentType<{ row: Resident }>
): TableColumn[] => {
  const columns: TableColumn[] = [
        {
            id: TABLE_COLUMN_IDS.PHOTO,
            header: 'Fotoğraf',
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
            header: 'Ad Soyad',
            accessor: 'fullName',
            sortable: true,
            render: (value: string, row: Resident) => (
                <div>
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">{value}</p>
                    <p className="text-sm text-text-light-muted dark:text-text-muted">
                        Kimlik: {maskNationalId(row.nationalId)}
                    </p>
                </div>
            ),
        },
        {
            id: TABLE_COLUMN_IDS.LOCATION,
            header: 'Konut',
            accessor: 'address',
            render: (value: { building: string; apartment: string } | any) => {
                // Handle case where value might not be structured correctly
                if (!value || typeof value !== 'object') {
                    return <span className="text-gray-500">-</span>;
                }
                const building = value.building || 'Belirtilmemiş';
                const apartment = value.apartment || 'Belirtilmemiş';
                return (
                    <div>
                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                            {building} Blok - {apartment} Daire
                        </p>
                    </div>
                );
            },
        },
        {
            id: TABLE_COLUMN_IDS.TYPE,
            header: 'Mülkiyet Türü',
            accessor: 'residentType',
            render: (value: { type: 'owner' | 'tenant'; label: string } | any) => {
                // Handle case where value might not be structured correctly
                if (!value || typeof value !== 'object') {
                    return <span className="text-gray-500">-</span>;
                }
                const label = value.label || value.toString();
                const type = value.type || 'unknown';
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        type === 'owner' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                        {label}
                    </span>
                );
            },
        },
        {
            id: TABLE_COLUMN_IDS.CONTACT,
            header: 'İletişim',
            accessor: 'contact',
            render: (value: { phone: string; email?: string; formattedPhone?: string } | any, row: Resident) => {
                // Handle case where value might not be structured correctly
                if (!value || typeof value !== 'object') {
                    return <span className="text-gray-500">-</span>;
                }
                const phone = value.formattedPhone || value.phone || 'Belirtilmemiş';
                const email = value.email;
                return (
                    <div className="flex items-center gap-2">
                        <div>
                            <span className="text-sm text-text-on-light dark:text-text-on-dark">
                                {phone}
                            </span>
                            {email && email !== 'Belirtilmemiş' && (
                                <p className="text-xs text-text-light-muted dark:text-text-muted">
                                    {email}
                                </p>
                            )}
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Phone} 
                            className="h-8 w-8 p-1" 
                            onClick={() => actionHandlers.handleCallResident(row)}
                        />
                    </div>
                );
            },
        },
        {
            id: TABLE_COLUMN_IDS.MEMBERSHIP,
            header: 'Üyelik Türü',
            accessor: 'membershipTier',
            render: (value: string | any) => {
                // Handle case where value might not be a string
                const membershipTier = typeof value === 'string' ? value : 'Standart';
                if (membershipTier === 'Altın') {
                    return (
                        <Badge
                            variant="soft"
                            color="gold"
                            className="min-w-[88px] text-center justify-center"
                        >
                            {membershipTier}
                        </Badge>
                    );
                } else if (membershipTier === 'Gümüş') {
                    return (
                        <Badge
                            variant="soft"
                            color="secondary"
                            className="min-w-[88px] text-center justify-center"
                        >
                            {membershipTier}
                        </Badge>
                    );
                } else {
                    return (
                        <Badge className="min-w-[88px] text-center justify-center">
                            {membershipTier}
                        </Badge>
                    );
                }
            },
        },
        {
            id: TABLE_COLUMN_IDS.VERIFICATION,
            header: 'Doğrulama',
            accessor: 'verificationStatus',
            render: (value: any) => {
                if (!value || typeof value !== 'object') {
                    return <span className="text-gray-500">-</span>;
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
                            {value.label}
                        </span>
                    </div>
                );
            },
        },
        {
            id: TABLE_COLUMN_IDS.STATUS,
            header: 'Durum',
            accessor: 'status',
            render: (value: any) => {
                // Handle case where value might not be structured correctly
                if (!value || typeof value !== 'object') {
                    return <span className="text-gray-500">-</span>;
                }
                const label = value.label || 'Bilinmiyor';
                const color = value.color || 'gray';
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
          onEditResident={actionHandlers.handleEditResident}
          onDeleteResident={actionHandlers.handleDeleteResident}
          onCallResident={actionHandlers.handleCallResident}
          onMessageResident={actionHandlers.handleMessageResident}
          onGenerateQR={actionHandlers.handleGenerateQR}
          onViewNotes={actionHandlers.handleViewNotes}
          onViewHistory={actionHandlers.handleViewHistory}
          onViewPaymentHistory={actionHandlers.handleViewPaymentHistory}
        />
      ),
    });
  }
  return columns;
}; 