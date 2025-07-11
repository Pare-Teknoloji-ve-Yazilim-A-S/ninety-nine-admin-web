import React from 'react';
import { Property } from '@/services/types/property.types';
import { propertyService } from '@/services';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { 
    Search, 
    Download, 
    Eye, 
    MoreVertical,
    CheckCircle,
    AlertCircle,
    RotateCcw,
    Calendar
} from 'lucide-react';

interface UnitsTableViewProps {
    units: Property[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    onUnitAction?: (unit: Property, action: string) => void;
    onExport?: () => void;
}

const statusConfig = {
    OCCUPIED: { label: 'Dolu', color: 'green', icon: CheckCircle },
    AVAILABLE: { label: 'Boş', color: 'blue', icon: AlertCircle },
    UNDER_MAINTENANCE: { label: 'Bakım', color: 'orange', icon: RotateCcw },
    RESERVED: { label: 'Rezerve', color: 'purple', icon: Calendar }
};

export const UnitsTableView: React.FC<UnitsTableViewProps> = ({
    units,
    loading,
    error,
    totalCount,
    onUnitAction,
    onExport
}) => {
    const handleUnitAction = (unit: Property, action: string) => {
        onUnitAction?.(unit, action);
    };

    const renderLoadingState = () => (
        <tr>
            <td colSpan={8} className="py-8 text-center">
                <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-gold"></div>
                    <span className="text-text-light-secondary dark:text-text-secondary">
                        Konutlar yükleniyor...
                    </span>
                </div>
            </td>
        </tr>
    );

    const renderErrorState = () => (
        <tr>
            <td colSpan={8} className="py-8 text-center">
                <div className="text-primary-red">{error}</div>
            </td>
        </tr>
    );

    const renderEmptyState = () => (
        <tr>
            <td colSpan={8} className="py-8 text-center">
                <div className="text-text-light-secondary dark:text-text-secondary">
                    Henüz konut bulunamadı
                </div>
            </td>
        </tr>
    );

    const renderUnitRow = (unit: Property) => {
        const statusInfo = statusConfig[unit.status as keyof typeof statusConfig];
        const StatusIcon = statusInfo.icon;
        const typeInfo = propertyService.getTypeInfo(unit.type);

        return (
            <tr 
                key={unit.id} 
                className="border-b border-border-light dark:border-border-dark hover:bg-background-light-soft dark:hover:bg-background-soft"
            >
                <td className="py-4 px-4">
                    <div>
                        <div className="font-medium text-text-on-light dark:text-text-on-dark">
                            {unit.propertyNumber || unit.name}
                        </div>
                        <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                            {unit.blockNumber && `Blok ${unit.blockNumber}`}
                            {unit.floor && ` • ${unit.floor}. kat`}
                        </div>
                    </div>
                </td>
                <td className="py-4 px-4">
                    <Badge variant="soft" color="secondary">
                        {typeInfo.label}
                    </Badge>
                </td>
                <td className="py-4 px-4 text-text-on-light dark:text-text-on-dark">
                    {unit.area || '--'}
                </td>
                <td className="py-4 px-4">
                    {unit.tenant ? (
                        <div>
                            <div className="font-medium text-text-on-light dark:text-text-on-dark">
                                {unit.tenant.firstName} {unit.tenant.lastName}
                            </div>
                            <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                                Kiracı
                            </div>
                        </div>
                    ) : unit.owner ? (
                        <div>
                            <div className="font-medium text-text-on-light dark:text-text-on-dark">
                                {unit.owner.firstName} {unit.owner.lastName}
                            </div>
                            <div className="text-sm text-text-light-secondary dark:text-text-secondary">
                                Malik
                            </div>
                        </div>
                    ) : (
                        <span className="text-text-light-muted dark:text-text-muted">
                            Boş
                        </span>
                    )}
                </td>
                <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 text-semantic-${statusInfo.color}-500`} />
                        <Badge variant="soft" color={statusInfo.color as any}>
                            {statusInfo.label}
                        </Badge>
                    </div>
                </td>
                <td className="py-4 px-4">
                    {unit.bills && unit.bills.length > 0 ? (
                        <span className="text-primary-red font-medium">
                            Var
                        </span>
                    ) : (
                        <span className="text-semantic-success-500">
                            Temiz
                        </span>
                    )}
                </td>
                <td className="py-4 px-4 text-text-light-secondary dark:text-text-secondary">
                    --
                </td>
                <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Eye}
                            onClick={() => handleUnitAction(unit, 'view')}
                        >
                            Detay
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={MoreVertical}
                            onClick={() => handleUnitAction(unit, 'menu')}
                        />
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <Card>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                        Konut Listesi ({totalCount})
                    </h3>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" icon={Search}>
                            Ara
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Download}
                            onClick={onExport}
                        >
                            İndir
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-light dark:border-border-dark">
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Konut
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Tip
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    m²
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Sakin
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Durum
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Borç
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    Son Ödeme
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && renderLoadingState()}
                            {error && renderErrorState()}
                            {!loading && !error && units.length === 0 && renderEmptyState()}
                            {!loading && !error && units.length > 0 && units.map(renderUnitRow)}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
};