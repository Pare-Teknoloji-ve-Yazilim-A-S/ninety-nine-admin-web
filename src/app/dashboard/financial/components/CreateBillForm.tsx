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
  ChevronDown,
  X
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
  CreateBillDto,
  PAYMENT_METHOD_OPTIONS
} from '@/services/types/billing.types';
import { billingService } from '@/services';
import { unitsService } from '@/services';
import { unitPricesService } from '@/services/unit-prices.service';
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
  area?: number; // Metrekare bilgisi
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  // optional raw for owner/tenant info if available
  __raw?: any;
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
  // Generates a unique, human-friendly document number like: INV-20250808-7GQ4K9
  const generateDocumentNumber = (): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const now = new Date();
    const y = now.getFullYear();
    const m = pad(now.getMonth() + 1);
    const d = pad(now.getDate());
    const rand = Array.from({ length: 6 }, () => 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
    return `INV-${y}${m}${d}-${rand}`;
  };
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
  
  // Unit prices state
  const [unitPrices, setUnitPrices] = useState<any[]>([]);
  const [unitPricesLoading, setUnitPricesLoading] = useState(true);

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
      paymentMethod: undefined,
      propertyId: '',
      assignedToId: '',
      documentNumber: ''
    }
  });

  const watchedBillType = watch('billType');
  const watchedPropertyId = watch('propertyId');

  // Helper function to get unit price by type
  const getUnitPriceByType = (type: string) => {
    return unitPrices.find(price => price.priceType === type);
  };

  // Helper function to calculate dues amount
  const calculateDuesAmount = () => {
    const duesPrice = getUnitPriceByType('DUES');
    const selectedProperty = properties.find(p => p.id === watchedPropertyId);
    
    if (duesPrice && selectedProperty && selectedProperty.area) {
      const unitPrice = parseFloat(duesPrice.unitPrice);
      const area = selectedProperty.area;
      const totalAmount = unitPrice * area;
      
      console.log('🔧 Dues calculation:', {
        unitPrice,
        area,
        totalAmount,
        property: selectedProperty.label
      });
      
      return totalAmount;
    }
    return 0;
  };

  // Generate/clear document number when property selection changes
  useEffect(() => {
    if (watchedPropertyId && watchedPropertyId !== '') {
      setValue('documentNumber', generateDocumentNumber(), { shouldValidate: false });
    } else {
      setValue('documentNumber', '', { shouldValidate: false });
    }
  }, [watchedPropertyId, setValue]);

  // Auto-calculate dues amount when bill type is DUES and property is selected
  useEffect(() => {
    if (watchedBillType === 'DUES' && watchedPropertyId && unitPrices.length > 0) {
      const calculatedAmount = calculateDuesAmount();
      if (calculatedAmount > 0) {
        console.log('🔧 Auto-setting dues amount:', calculatedAmount);
        setValue('amount', calculatedAmount, { shouldValidate: true });
      }
    }
  }, [watchedBillType, watchedPropertyId, unitPrices, setValue]);

  // Fetch properties from admin/properties with search (server-side pagination)
  useEffect(() => {
    let active = true;
    const fetchWithSearch = async () => {
      try {
        if (!propertyDropdownOpen) return;
        setLoadingProperties(true);
        const requestedLimit = 100;
        const res = await unitsService.getAllProperties({
          page: 1,
          limit: requestedLimit,
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
           area: property.area || 0, // Metrekare bilgisini al
           owner: property.owner ? {
             id: property.owner.id,
             firstName: property.owner.firstName,
             lastName: property.owner.lastName,
             email: property.owner.email,
             phone: property.owner.phone
           } : undefined,
           tenant: property.tenant ? {
             id: property.tenant.id,
             firstName: property.tenant.firstName,
             lastName: property.tenant.lastName,
             email: property.tenant.email,
             phone: property.tenant.phone
           } : undefined,
           __raw: property,
         }));
         if (!active) return;
        setProperties(mapped);
        setFilteredProperties(mapped);
        const current = res?.pagination?.page ?? 1;
        const totalPages = res?.pagination?.totalPages;
        setPage(current);
        // hasMore if server says there are more pages OR if we exactly filled the page (fallback)
        const serverHasMore = typeof totalPages === 'number' ? current < totalPages : false;
        const filledPage = list.length === requestedLimit;
        setHasMore(serverHasMore || filledPage);
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

  // Load unit prices
  useEffect(() => {
    const loadUnitPrices = async () => {
      try {
        setUnitPricesLoading(true);
        const response = await unitPricesService.getAllUnitPrices();
        setUnitPrices(response);
      } catch (error) {
        console.error('Error loading unit prices:', error);
        setUnitPrices([]);
      } finally {
        setUnitPricesLoading(false);
      }
    };

    loadUnitPrices();
  }, []);

  const onSubmit = async (data: BillFormData) => {
    if (isSubmitting || externalLoading) return;

    setIsSubmitting(true);
    try {
      // Property'den owner veya tenant ID'sini al
      let assignedToId: string | undefined = undefined;
      
      if (data.propertyId) {
        try {
          // Property detaylarını getir
          const propertyResponse = await unitsService.getPropertyById(data.propertyId, false);
          const property = propertyResponse;
          
          // Öncelik sırası: tenant varsa tenant, yoksa owner
          if (property?.tenant?.id) {
            assignedToId = property.tenant.id;
            console.log('🔗 Bill assigned to tenant:', property.tenant.firstName, property.tenant.lastName);
          } else if (property?.owner?.id) {
            assignedToId = property.owner.id;
            console.log('🔗 Bill assigned to owner:', property.owner.firstName, property.owner.lastName);
          } else {
            console.log('⚠️ No tenant or owner found for property:', data.propertyId);
          }
        } catch (propertyError) {
          console.error('Error fetching property details for assignment:', propertyError);
          // Property detayı alınamazsa assignedToId undefined kalır
        }
      }

      const billData: CreateBillDto = {
        title: data.title,
        amount: Number(data.amount),
        dueDate: new Date(data.dueDate).toISOString(),
        description: undefined,
        billType: data.billType,
        status: 'PENDING',
        paymentMethod: data.paymentMethod,
        propertyId: data.propertyId,
        assignedToId: assignedToId, // Property'den alınan owner/tenant ID
        // ensure a doc number exists; generate one if missing
        documentNumber: data.documentNumber && data.documentNumber.trim() !== '' ? data.documentNumber : generateDocumentNumber()
      };

      const response = await billingService.createBill(billData);
      const created = (response as any)?.data?.data ?? (response as any)?.data ?? response;
      if (created) {
        onSuccess(created);
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
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
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
        
        {/* Unit Prices Info */}
        <div className="flex flex-col gap-2 min-w-[200px]">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Güncel Birim Fiyatlar
          </h4>
          {unitPricesLoading ? (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Fiyatlar yükleniyor...
            </div>
          ) : (
            <div className="space-y-1">
              {getUnitPriceByType('DUES') && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Aidat:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {parseFloat(getUnitPriceByType('DUES')?.unitPrice || '0').toFixed(2)} ₺/{getUnitPriceByType('DUES')?.unit}
                  </span>
                </div>
              )}
              {getUnitPriceByType('ELECTRICITY') && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Elektrik:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {parseFloat(getUnitPriceByType('ELECTRICITY')?.unitPrice || '0').toFixed(2)} ₺/{getUnitPriceByType('ELECTRICITY')?.unit}
                  </span>
                </div>
              )}
              {getUnitPriceByType('WATER') && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Su:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {parseFloat(getUnitPriceByType('WATER')?.unitPrice || '0').toFixed(2)} ₺/{getUnitPriceByType('WATER')?.unit}
                  </span>
                </div>
              )}
              {getUnitPriceByType('GAS') && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Doğalgaz:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {parseFloat(getUnitPriceByType('GAS')?.unitPrice || '0').toFixed(2)} ₺/{getUnitPriceByType('GAS')?.unit}
                  </span>
                </div>
              )}
            </div>
          )}
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

            {/* Selected Property Display with remove */}
            {watch('propertyId') && !propertyDropdownOpen && (
              <div className="mt-2 p-2 bg-primary-gold/10 border border-primary-gold/30 rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary-gold" />
                    <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                      {properties.find(p => p.id === watch('propertyId'))?.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('propertyId', '', { shouldValidate: true });
                      setPropertyDropdownOpen(false);
                    }}
                    className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-primary-gold/40 text-primary-gold hover:bg-primary-gold/10"
                    title="Seçimi kaldır"
                  >
                    <X className="h-3 w-3 mr-1" /> Kaldır
                  </button>
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
                      const requestedLimit = 100;
                      const res = await unitsService.getAllProperties({
                        page: next,
                        limit: requestedLimit,
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
                         area: property.area || 0, // Metrekare bilgisini al
                         owner: property.owner ? {
                           id: property.owner.id,
                           firstName: property.owner.firstName,
                           lastName: property.owner.lastName,
                           email: property.owner.email,
                           phone: property.owner.phone
                         } : undefined,
                         tenant: property.tenant ? {
                           id: property.tenant.id,
                           firstName: property.tenant.firstName,
                           lastName: property.tenant.lastName,
                           email: property.tenant.email,
                           phone: property.tenant.phone
                         } : undefined,
                         __raw: property,
                       }));
                      setProperties(prev => [...prev, ...mapped]);
                      setFilteredProperties(prev => [...prev, ...mapped]);
                      const totalPages = res?.pagination?.totalPages;
                      setPage(next);
                      const serverHasMore = typeof totalPages === 'number' ? next < totalPages : false;
                      const filledPage = list.length === requestedLimit;
                      setHasMore(serverHasMore || filledPage);
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
                  // Prefer tenant, otherwise owner, for assignedToId
                  const tenantId = p.tenant?.id;
                  const ownerId = p.owner?.id;
                  const resolvedAssignedId = tenantId || ownerId || undefined;
                  
                  console.log('🔗 Property selected:', {
                    propertyId: p.id,
                    propertyNumber: p.propertyNumber,
                    tenant: p.tenant ? `${p.tenant.firstName} ${p.tenant.lastName}` : 'None',
                    owner: p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : 'None',
                    assignedToId: resolvedAssignedId
                  });
                  
                  if (resolvedAssignedId) {
                    setValue('assignedToId', resolvedAssignedId, { shouldValidate: false });
                  } else {
                    setValue('assignedToId', '', { shouldValidate: false });
                  }
                          setPropertyDropdownOpen(false);
                          setPropertySearchQuery('');
                        }}
                        className="w-full text-left p-3 hover:bg-primary-gold/10 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-gold/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary-gold">{p.propertyNumber?.slice(0,2) || 'PR'}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-text-on-light dark:text-text-on-dark">{p.label}</div>
                            <div className="text-xs text-text-light-muted dark:text-text-muted">{p.propertyNumber}</div>
                            {/* Owner/Tenant Info */}
                            {(p.owner || p.tenant) && (
                              <div className="text-xs text-text-light-muted dark:text-text-muted mt-1">
                                {p.tenant ? (
                                  <span className="inline-flex items-center gap-1">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    Kiracı: {p.tenant.firstName} {p.tenant.lastName}
                                  </span>
                                ) : p.owner ? (
                                  <span className="inline-flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Malik: {p.owner.firstName} {p.owner.lastName}
                                  </span>
                                ) : null}
                              </div>
                            )}
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
             {/* Aidat hesaplama bilgisi */}
             {watchedBillType === 'DUES' && watchedPropertyId && (
               <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                 <div className="flex justify-between">
                   <span>Aidat Hesaplama:</span>
                   <span className="font-medium">
                     {(() => {
                       const selectedProperty = properties.find(p => p.id === watchedPropertyId);
                       const duesPrice = getUnitPriceByType('DUES');
                       if (selectedProperty?.area && duesPrice) {
                         const unitPrice = parseFloat(duesPrice.unitPrice);
                         const area = selectedProperty.area;
                         return `${unitPrice.toFixed(2)} ₺/m² × ${area} m² = ${(unitPrice * area).toFixed(2)} ₺`;
                       }
                       return 'Hesaplanamadı';
                     })()}
                   </span>
                 </div>
               </div>
             )}
           </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ödeme Yöntemi
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PAYMENT_METHOD_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watch('paymentMethod') === option.value
                    ? 'border-primary-gold bg-primary-gold/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('paymentMethod')}
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
                {watch('paymentMethod') === option.value && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary-gold rounded-full" />
                )}
              </label>
            ))}
          </div>
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