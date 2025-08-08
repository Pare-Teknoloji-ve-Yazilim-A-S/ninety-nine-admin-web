'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  Calendar,
  FileText,
  DollarSign,
  Building,
  Hash,
  AlertCircle,
  Search,
  ChevronDown
} from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
import TextArea from '@/app/components/ui/TextArea';
// import Select from '@/app/components/ui/Select';
// import DatePicker from '@/app/components/ui/DatePicker';
import { 
  BillFormData, 
  BillType, 
  BILL_TYPE_OPTIONS,
  CreateBillDto 
} from '@/services/types/billing.types';
import { billingService } from '@/services';
import { unitsService } from '@/services';
// import { userService } from '@/services';

interface CreateBillFormProps {
  onSuccess: (bill: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface PropertyOption {
  id: string;
  value: string;
  label: string;
  propertyNumber: string;
}

interface UserOption {
  id: string;
  value: string;
  label: string;
  email: string;
}

const CreateBillForm: React.FC<CreateBillFormProps> = ({
  onSuccess,
  onCancel,
  loading: externalLoading = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const propertyDropdownRef = useRef<HTMLDivElement>(null);
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<PropertyOption[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm<BillFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0], // Format for HTML date input
      description: '',
      billType: 'DUES',
      propertyId: '',
      assignedToId: undefined as any,
      documentNumber: ''
    }
  });

  const watchedBillType = watch('billType');

  // Fetch properties from admin/properties with search (server-side pagination)
  useEffect(() => {
    let active = true;
    const fetchWithSearch = async () => {
      try {
        if (!propertyDropdownOpen) return;
        setLoadingProperties(true);
        const res = await unitsService.getAllProperties({
          page: 1,
          limit: 100,
          orderColumn: 'name',
          orderBy: 'ASC',
          search: propertySearchQuery || undefined,
          includeBills: false,
        } as any);
        const list = res?.data || [];
        const mapped: PropertyOption[] = list.map((property: any) => ({
          id: property.id,
          value: property.id,
          label: `${property.propertyNumber} - ${property.name}`,
          propertyNumber: property.propertyNumber
        }));
        if (!active) return;
        setProperties(mapped);
        setFilteredProperties(mapped);
        const current = res?.pagination?.page ?? 1;
        const totalPages = res?.pagination?.totalPages ?? 1;
        setPage(current);
        setHasMore(current < totalPages);
      } catch (error) {
        if (!active) return;
        console.error('Error fetching properties:', error);
        setProperties([]);
        setFilteredProperties([]);
        setHasMore(false);
      } finally {
        if (active) setLoadingProperties(false);
      }
    };
    fetchWithSearch();
    return () => { active = false; };
  }, [propertySearchQuery, propertyDropdownOpen]);

  // Minimal client-side filter fallback (when API returns full list)
  useEffect(() => {
    if (!propertySearchQuery.trim()) {
      setFilteredProperties(properties);
    }
  }, [properties]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(e.target as Node)) {
        setPropertyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const onSubmit = async (data: BillFormData) => {
    if (isSubmitting || externalLoading) return;

    setIsSubmitting(true);
    try {
      const billData: CreateBillDto = {
        title: data.title,
        amount: Number(data.amount),
        dueDate: new Date(data.dueDate).toISOString(),
        description: undefined,
        billType: data.billType,
        status: 'PENDING',
        propertyId: data.propertyId,
        assignedToId: undefined,
        documentNumber: data.documentNumber || undefined
      };

      const response = await billingService.createBill(billData);
      
      if (response.data) {
        onSuccess(response.data);
        reset();
      }
    } catch (error: any) {
      console.error('Error creating bill:', error);
      // Handle error - could show toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBillTypeIcon = (type: BillType) => {
    const option = BILL_TYPE_OPTIONS.find(opt => opt.value === type);
    return option?.icon || '📄';
  };

  const getBillTypeDescription = (type: BillType) => {
    const option = BILL_TYPE_OPTIONS.find(opt => opt.value === type);
    return option?.description || '';
  };

  const isLoading = isSubmitting || externalLoading || loadingProperties || loadingUsers;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-gold/10 rounded-lg">
          <FileText className="h-5 w-5 text-primary-gold" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Yeni Fatura Oluştur
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aidat, bakım veya fayda faturası oluşturun
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bill Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fatura Türü *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BILL_TYPE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watchedBillType === option.value
                    ? 'border-primary-gold bg-primary-gold/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('billType', { required: 'Fatura türü seçiniz' })}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 w-full">
                  <span className="text-lg">{option.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {option.description}
                    </div>
                  </div>
                </div>
                {watchedBillType === option.value && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary-gold rounded-full" />
                )}
              </label>
            ))}
          </div>
          {errors.billType && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.billType.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fatura Başlığı *
          </label>
          <Input
            {...register('title', { 
              required: 'Fatura başlığı gereklidir',
              minLength: { value: 3, message: 'En az 3 karakter olmalıdır' }
            })}
            placeholder="Örnek: Ocak 2024 Aidat"
            icon={FileText}
            error={errors.title?.message}
            disabled={isLoading}
          />
        </div>

        {/* Amount and Due Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tutar (IQD) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register('amount', { 
                required: 'Tutar gereklidir',
                min: { value: 0.01, message: 'Tutar 0\'dan büyük olmalıdır' }
              })}
              placeholder="0.00"
              icon={DollarSign}
              error={errors.amount?.message}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Vade Tarihi *
            </label>
            <Input
              type="date"
              {...register('dueDate', { required: 'Vade tarihi gereklidir' })}
              icon={Calendar}
              error={errors.dueDate?.message}
              disabled={isLoading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Property Selection - Expanded with search and dropdown (like AddOwnerModal) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mülk *
          </label>
          <div ref={propertyDropdownRef} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light-muted dark:text-text-muted" />
              <input
                type="text"
                placeholder={loadingProperties ? 'Yükleniyor...' : 'Mülk ara...'}
                value={propertySearchQuery}
                onChange={(e) => setPropertySearchQuery(e.target.value)}
                onFocus={() => setPropertyDropdownOpen(true)}
                disabled={loadingProperties || isLoading}
                className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border border-primary-gold/30 hover:border-primary-gold/50 focus:border-primary-gold focus:outline-none focus:ring-2 focus:ring-primary-gold/50 bg-background-secondary text-text-primary transition-colors"
              />
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light-muted transition-transform ${propertyDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Selected Property Display */}
            {watch('propertyId') && !propertyDropdownOpen && (
              <div className="mt-2 p-2 bg-primary-gold/10 border border-primary-gold/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary-gold" />
                  <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                    {properties.find(p => p.id === watch('propertyId'))?.label}
                  </span>
                </div>
              </div>
            )}

            {/* Dropdown List */}
            {propertyDropdownOpen && (
              <div
                className="absolute z-[9999] w-full mt-1 bg-background-secondary border border-primary-gold/30 rounded-lg shadow-lg max-h-64 overflow-auto"
                onScroll={async (e) => {
                  const el = e.currentTarget;
                  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
                  if (nearBottom && hasMore && !isLoadingMore && !loadingProperties) {
                    setIsLoadingMore(true);
                    const next = page + 1;
                    try {
                      const res = await unitsService.getAllProperties({
                        page: next,
                        limit: 100,
                        orderColumn: 'name',
                        orderBy: 'ASC',
                        search: propertySearchQuery || undefined,
                        includeBills: false,
                      } as any);
                      const list = res?.data || [];
                      const mapped: PropertyOption[] = list.map((property: any) => ({
                        id: property.id,
                        value: property.id,
                        label: `${property.propertyNumber} - ${property.name}`,
                        propertyNumber: property.propertyNumber,
                      }));
                      setProperties(prev => [...prev, ...mapped]);
                      setFilteredProperties(prev => [...prev, ...mapped]);
                      const totalPages = res?.pagination?.totalPages ?? next;
                      setPage(next);
                      setHasMore(next < totalPages);
                    } catch (err) {
                      setHasMore(false);
                    } finally {
                      setIsLoadingMore(false);
                    }
                  }
                }}
              >
                {loadingProperties ? (
                  <div className="p-3 text-center text-text-light-muted dark:text-text-muted">Yükleniyor...</div>
                ) : filteredProperties.length === 0 ? (
                  <div className="p-3 text-center text-text-light-muted dark:text-text-muted">{propertySearchQuery ? 'Aramanızla eşleşen mülk bulunamadı' : 'Mülk bulunamadı'}</div>
                ) : (
                  <>
                    <div className="p-2 text-xs font-medium text-text-light-muted dark:text-text-muted border-b border-gray-200 dark:border-gray-700">{filteredProperties.length} mülk bulundu</div>
                    {filteredProperties.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setValue('propertyId', p.id, { shouldValidate: true });
                          setPropertyDropdownOpen(false);
                          setPropertySearchQuery('');
                        }}
                        className="w-full text-left p-3 hover:bg-primary-gold/10 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-gold/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary-gold">{p.propertyNumber?.slice(0,2) || 'PR'}</span>
                          </div>
                          <div>
                            <div className="font-medium text-text-on-light dark:text-text-on-dark">{p.label}</div>
                            <div className="text-xs text-text-light-muted dark:text-text-muted">{p.propertyNumber}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                    {isLoadingMore && (
                      <div className="p-3 text-center text-text-light-muted dark:text-text-muted">Daha fazla yükleniyor...</div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          {/* Hidden input for validation error display */}
          <input type="hidden" {...register('propertyId', { required: 'Mülk seçiniz' })} />
          {errors.propertyId && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {errors.propertyId.message}
            </p>
          )}
        </div>

        {/* Atanacak Kişi alanı kaldırıldı */}

        {/* Document Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Belge Numarası
          </label>
          <Input
            {...register('documentNumber')}
            placeholder="Örnek: INV-2024-001"
            icon={Hash}
            disabled={isLoading}
          />
        </div>

        {/* Açıklama alanı kaldırıldı */}

        {/* Current Bill Type Info */}
        {watchedBillType && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">{getBillTypeIcon(watchedBillType)}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {BILL_TYPE_OPTIONS.find(opt => opt.value === watchedBillType)?.label}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                - {getBillTypeDescription(watchedBillType)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            İptal
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isLoading}
            isLoading={isSubmitting}
            icon={FileText}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Fatura Oluşturuluyor...' : 'Fatura Oluştur'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateBillForm;