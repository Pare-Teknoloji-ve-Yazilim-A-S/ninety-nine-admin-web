'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import TextArea from '@/app/components/ui/TextArea';
import Label from '@/app/components/ui/Label';
import { unitsService, Property } from '@/services';
import { useUnitsActions } from '@/hooks/useUnitsActions';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function EditUnitPage() {
    const router = useRouter();
    const params = useParams();
    const unitId = params.id as string;

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [unit, setUnit] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Partial<Property>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { updateUnit, isUpdating, error } = useUnitsActions({
        onUpdateSuccess: () => {
            router.push('/dashboard/units');
        }
    });

    const breadcrumbItems = [
        { label: 'Ana Sayfa', href: '/dashboard' },
        { label: 'Konutlar', href: '/dashboard/units' },
        { label: 'Düzenle', active: true }
    ];

    // Load unit data
    useEffect(() => {
        const loadUnit = async () => {
            try {
                setLoading(true);
                const response = await unitsService.getUnitById(unitId);
                const unitData = response.data;
                setUnit(unitData);
                setFormData({
                    name: unitData.name || '',
                    propertyNumber: unitData.propertyNumber || '',
                    type: unitData.type || '',
                    status: unitData.status || '',
                    blockNumber: unitData.blockNumber || '',
                    floor: unitData.floor || undefined,
                    area: unitData.area || undefined
                });
            } catch (err: any) {
                console.error('Failed to load unit:', err);
                router.push('/dashboard/units');
            } finally {
                setLoading(false);
            }
        };

        if (unitId) {
            loadUnit();
        }
    }, [unitId, router]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.propertyNumber?.trim()) {
            newErrors.propertyNumber = 'Daire numarası gereklidir';
        }

        if (!formData.type) {
            newErrors.type = 'Konut tipi seçiniz';
        }

        if (!formData.status) {
            newErrors.status = 'Durum seçiniz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        await updateUnit(unitId, formData);
    };

    const handleReset = () => {
        if (unit) {
            setFormData({
                name: unit.name || '',
                propertyNumber: unit.propertyNumber || '',
                type: unit.type || '',
                status: unit.status || '',
                blockNumber: unit.blockNumber || '',
                floor: unit.floor || undefined,
                area: unit.area || undefined
            });
            setErrors({});
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    {/* Sidebar */}
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />

                    {/* Main Content Area */}
                    <div className="lg:ml-72">
                        <DashboardHeader
                            title="Konut Düzenle"
                            breadcrumbItems={breadcrumbItems}
                        />
                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Card>
                            <div className="p-6">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                                    <div className="space-y-3">
                                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </main>
                </div>
            </div>
            </ProtectedRoute>
        );
    }

    if (!unit) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    {/* Sidebar */}
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />

                    {/* Main Content Area */}
                    <div className="lg:ml-72">
                        <DashboardHeader
                            title="Konut Bulunamadı"
                            breadcrumbItems={breadcrumbItems}
                        />
                        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card>
                                <div className="p-6 text-center">
                                    <p className="text-text-light-secondary dark:text-text-secondary mb-4">
                                        Düzenlemek istediğiniz konut bulunamadı.
                                    </p>
                                    <Link href="/dashboard/units">
                                        <Button variant="primary">
                                            Konutlar Listesine Dön
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background-primary">
                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div className="lg:ml-72">
                    <DashboardHeader
                        title={`${unit.propertyNumber || unit.name || 'Konut'} - Düzenle`}
                        breadcrumbItems={breadcrumbItems}
                    />

                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link href="/dashboard/units">
                            <Button variant="ghost" size="sm" icon={ArrowLeft}>
                                Geri Dön
                            </Button>
                        </Link>
                    </div>

                    {/* Form */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-6">
                                Konut Bilgilerini Düzenle
                            </h2>

                            {error && (
                                <div className="mb-6 p-4 bg-primary-red/10 dark:bg-primary-red/20 border border-primary-red/20 rounded-lg">
                                    <p className="text-primary-red text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Property Number */}
                                    <div>
                                        <Input
                                            label="Daire Numarası"
                                            value={formData.propertyNumber || ''}
                                            onChange={(value: any) => handleInputChange('propertyNumber', value)}
                                            error={errors.propertyNumber}
                                            placeholder="Örn: A1, B25, Villa-1"
                                            required
                                        />
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <Input
                                            label="İsim (Opsiyonel)"
                                            value={formData.name || ''}
                                            onChange={(value: any) => handleInputChange('name', value)}
                                            placeholder="Konut ismi"
                                        />
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <Label htmlFor="type" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                            Konut Tipi *
                                        </Label>
                                        <Select
                                            value={formData.type || ''}
                                            onChange={(e: any) => handleInputChange('type', e.target.value)}
                                            error={errors.type}
                                            options={[
                                                { value: '', label: 'Tip Seçiniz' },
                                                { value: 'RESIDENCE', label: 'Daire' },
                                                { value: 'VILLA', label: 'Villa' },
                                                { value: 'COMMERCIAL', label: 'Ticari' },
                                                { value: 'PARKING', label: 'Otopark' }
                                            ]}
                                            required
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <Label htmlFor="status" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                            Durum *
                                        </Label>
                                        <Select
                                            value={formData.status || ''}
                                            onChange={(e: any) => handleInputChange('status', e.target.value)}
                                            error={errors.status}
                                            options={[
                                                { value: '', label: 'Durum Seçiniz' },
                                                { value: 'OCCUPIED', label: 'Dolu' },
                                                { value: 'AVAILABLE', label: 'Boş' },
                                                { value: 'UNDER_MAINTENANCE', label: 'Bakımda' },
                                                { value: 'RESERVED', label: 'Rezerve' }
                                            ]}
                                            required
                                        />
                                    </div>

                                    {/* Block Number */}
                                    <div>
                                        <Input
                                            label="Blok"
                                            value={formData.blockNumber || ''}
                                            onChange={(value: any) => handleInputChange('blockNumber', value)}
                                            placeholder="Örn: A, B, C"
                                        />
                                    </div>

                                    {/* Floor */}
                                    <div>
                                        <Input
                                            label="Kat"
                                            type="number"
                                            value={formData.floor || ''}
                                            onChange={(value: any) => handleInputChange('floor', value)}
                                            placeholder="Kat numarası"
                                        />
                                    </div>

                                    {/* Area */}
                                    <div>
                                        <Input
                                            label="Alan (m²)"
                                            type="number"
                                            value={formData.area || ''}
                                            onChange={(value: any) => handleInputChange('area', value)}
                                            placeholder="Metrekare"
                                        />
                                    </div>

                                    {/* Rooms */}
                                    <div>
                                        <Input
                                            label="Oda Sayısı"
                                            value={formData.rooms || ''}
                                            onChange={(value: any) => handleInputChange('rooms', value)}
                                            placeholder="Örn: 2+1, 3+1"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <TextArea
                                        label="Açıklama"
                                        value={formData.description || ''}
                                        onChange={(value) => handleInputChange('description', value)}
                                        placeholder="Konut hakkında ek bilgiler..."
                                        rows={4}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleReset}
                                        icon={RotateCcw}
                                        disabled={isUpdating}
                                    >
                                        Sıfırla
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        icon={Save}
                                        isLoading={isUpdating}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? 'Kaydediliyor...' : 'Kaydet'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </main>
                </div>
            </div>
        </ProtectedRoute>
    );
} 