import React from 'react';
import { Property, QuickStats } from '@/services/types/property.types';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { 
    TrendingUp, 
    TrendingDown, 
    RotateCcw, 
    Plus, 
    UserPlus, 
    DollarSign, 
    FileText 
} from 'lucide-react';

interface UnitsAnalyticsProps {
    units: Property[];
    quickStats: QuickStats | null;
    onQuickAction?: (action: string) => void;
}

export const UnitsAnalytics: React.FC<UnitsAnalyticsProps> = ({
    units,
    quickStats,
    onQuickAction
}) => {
    const totalUnits = quickStats ? 
        quickStats.apartmentUnits.total + quickStats.villaUnits.total + quickStats.commercialUnits.total :
        units.length;

    const occupiedUnits = quickStats ?
        quickStats.apartmentUnits.occupied + quickStats.villaUnits.occupied + quickStats.commercialUnits.occupied :
        units.filter(u => u.status === 'OCCUPIED').length;

    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    const handleQuickAction = (action: string) => {
        onQuickAction?.(action);
    };

    return (
        <div className="space-y-6">
            {/* Quick Analysis */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                        📊 Hızlı Analiz
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                    Doluluk Oranı
                                </span>
                                <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                    %{occupancyRate}
                                </span>
                            </div>
                            <div className="w-full bg-background-light-soft dark:bg-background-soft rounded-full h-2">
                                <div
                                    className="bg-primary-gold h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${occupancyRate}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                Konut Tipi Dağılımı
                            </h4>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-light-secondary dark:text-text-secondary">1+1:</span>
                                    <span className="text-text-on-light dark:text-text-on-dark">420 (%17)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-light-secondary dark:text-text-secondary">2+1:</span>
                                    <span className="text-text-on-light dark:text-text-on-dark">840 (%34)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-light-secondary dark:text-text-secondary">3+1:</span>
                                    <span className="text-text-on-light dark:text-text-on-dark">840 (%34)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-light-secondary dark:text-text-secondary">4+1:</span>
                                    <span className="text-text-on-light dark:text-text-on-dark">250 (%10)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-light-secondary dark:text-text-secondary">Villa:</span>
                                    <span className="text-text-on-light dark:text-text-on-dark">150 (%5)</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-border-light dark:border-border-dark">
                            <h4 className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                Borç Durumu
                            </h4>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-light-secondary dark:text-text-secondary">Temiz:</span>
                                <span className="text-semantic-success-500">2,100</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-light-secondary dark:text-text-secondary">Borçlu:</span>
                                <span className="text-primary-red">248</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-light-secondary dark:text-text-secondary">Toplam:</span>
                                <span className="text-text-on-light dark:text-text-on-dark">4.2M ₺</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Recent Activity */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                        Son 30 Gün
                    </h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-semantic-success-500" />
                                <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                    Yeni dolu
                                </span>
                            </div>
                            <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                12
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="h-4 w-4 text-primary-red" />
                                <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                    Boşalan
                                </span>
                            </div>
                            <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                8
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <RotateCcw className="h-4 w-4 text-semantic-warning-500" />
                                <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                    Bakıma giren
                                </span>
                            </div>
                            <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                3
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Quick Actions */}
            <Card>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4">
                        Hızlı İşlemler
                    </h3>
                    <div className="space-y-3">
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start" 
                            icon={Plus}
                            onClick={() => handleQuickAction('add-unit')}
                        >
                            Yeni Konut Ekle
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start" 
                            icon={UserPlus}
                            onClick={() => handleQuickAction('bulk-assign')}
                        >
                            Toplu Sakin Ata
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start" 
                            icon={DollarSign}
                            onClick={() => handleQuickAction('debt-analysis')}
                        >
                            Borç Analizi
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start" 
                            icon={FileText}
                            onClick={() => handleQuickAction('occupancy-report')}
                        >
                            Doluluk Raporu
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};