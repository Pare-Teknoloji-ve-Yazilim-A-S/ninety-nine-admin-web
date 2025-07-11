import React from 'react';
import { Property } from '@/services/types/property.types';
import { propertyService } from '@/services';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { 
    Home, 
    Building, 
    MapPin, 
    User, 
    Eye, 
    MoreVertical,
    CheckCircle,
    AlertCircle,
    RotateCcw,
    Calendar
} from 'lucide-react';

interface UnitsGridViewProps {
    units: Property[];
    loading: boolean;
    error: string | null;
    onUnitAction?: (unit: Property, action: string) => void;
}

const statusConfig = {
    OCCUPIED: { label: 'Dolu', color: 'green', icon: CheckCircle },
    AVAILABLE: { label: 'Boş', color: 'blue', icon: AlertCircle },
    UNDER_MAINTENANCE: { label: 'Bakım', color: 'orange', icon: RotateCcw },
    RESERVED: { label: 'Rezerve', color: 'purple', icon: Calendar }
};

export const UnitsGridView: React.FC<UnitsGridViewProps> = ({
    units,
    loading,
    error,
    onUnitAction
}) => {
    const handleUnitAction = (unit: Property, action: string) => {
        onUnitAction?.(unit, action);
    };

    const renderLoadingState = () => (
        Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} variant="elevated">
                <div className="p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </Card>
        ))
    );

    const renderErrorState = () => (
        <div className="col-span-full text-center py-8">
            <div className="text-primary-red">{error}</div>
        </div>
    );

    const renderEmptyState = () => (
        <div className="col-span-full text-center py-8">
            <div className="text-text-light-secondary dark:text-text-secondary">
                Henüz konut bulunamadı
            </div>
        </div>
    );

    const renderUnitCard = (unit: Property) => {
        const statusInfo = statusConfig[unit.status as keyof typeof statusConfig];
        const StatusIcon = statusInfo.icon;
        const typeInfo = propertyService.getTypeInfo(unit.type);
        const currentResident = unit.tenant || unit.owner;

        return (
            <Card key={unit.id} variant="elevated" hover={true}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-text-on-light dark:text-text-on-dark">
                            {unit.propertyNumber || unit.name}
                        </h4>
                        <Badge variant="soft" color={statusInfo.color as any}>
                            {statusInfo.label}
                        </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                            <Home className="h-4 w-4" />
                            <span>{typeInfo.label}</span>
                        </div>
                        {unit.area && (
                            <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                                <MapPin className="h-4 w-4" />
                                <span>{unit.area} m²</span>
                            </div>
                        )}
                        {unit.blockNumber && (
                            <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                                <Building className="h-4 w-4" />
                                <span>Blok {unit.blockNumber}</span>
                            </div>
                        )}
                        {currentResident && (
                            <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-secondary">
                                <User className="h-4 w-4" />
                                <span>{currentResident.firstName} {currentResident.lastName}</span>
                            </div>
                        )}
                    </div>

                    {unit.bills && unit.bills.length > 0 && (
                        <div className="mb-4 p-2 bg-primary-red/10 dark:bg-primary-red/20 rounded-lg">
                            <div className="text-sm text-primary-red font-medium">
                                Ödenmemiş Faturalar Var
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-1" 
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
                </div>
            </Card>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading && renderLoadingState()}
            {error && renderErrorState()}
            {!loading && !error && units.length === 0 && renderEmptyState()}
            {!loading && !error && units.length > 0 && units.map(renderUnitCard)}
        </div>
    );
};