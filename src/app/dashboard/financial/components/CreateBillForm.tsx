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
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { 
  CREATE_BILLING_PERMISSION_ID, 
  CREATE_BILLING_PERMISSION_NAME 
} from '@/app/components/ui/Sidebar';
// import { userService } from '@/services';

// Dil çevirileri
const translations = {
  tr: {
    // Form header
    createNewBill: 'Yeni Fatura Oluştur',
    createBillDesc: 'Aidat, bakım veya fayda faturası oluşturun',
    
    // Unit prices section
    currentUnitPrices: 'Güncel Birim Fiyatlar',
    pricesLoading: 'Fiyatlar yükleniyor...',
    dues: 'Aidat:',
    electricity: 'Elektrik:',
    water: 'Su:',
    gas: 'Doğalgaz:',
    
    // Form fields
    billType: 'Fatura Türü *',
    selectBillType: 'Fatura türü seçiniz',
    property: 'Mülk *',
    selectProperty: 'Mülk seçiniz',
    propertySearch: 'Mülk ara...',
    loading: 'Yükleniyor...',
    removeSelection: 'Seçimi kaldır',
    propertiesFound: 'mülk bulundu',
    noPropertiesFound: 'Mülk bulunamadı',
    noMatchingProperties: 'Aramanızla eşleşen mülk bulunamadı',
    loadingMore: 'Daha fazla yükleniyor...',
    tenant: 'Kiracı:',
    owner: 'Malik:',
    
    // Bill title
    billTitle: 'Fatura Başlığı *',
    billTitleRequired: 'Fatura başlığı gereklidir',
    billTitleMinLength: 'En az 3 karakter olmalıdır',
    billTitlePlaceholder: 'Örnek: Ocak 2024 Aidat',
    
    // Due date
    dueDate: 'Vade Tarihi *',
    dueDateRequired: 'Vade tarihi gereklidir',
    
    // Amount
    amount: 'Tutar (IQD) *',
    amountRequired: 'Tutar gereklidir',
    amountMin: 'Tutar 0\'dan büyük olmalıdır',
    amountPlaceholder: '0.00',
    duesCalculation: 'Aidat Hesaplama:',
    calculationFailed: 'Hesaplanamadı',
    
    // Payment method
    paymentMethod: 'Ödeme Yöntemi',
    
    // Document number
    documentNumber: 'Belge Numarası',
    documentNumberPlaceholder: 'Örnek: INV-2024-001',
    
    // Buttons
    cancel: 'İptal',
    createBill: 'Fatura Oluştur',
    creatingBill: 'Fatura Oluşturuluyor...',
    permissionLoading: 'İzinler kontrol ediliyor...',
    noPermission: 'Bu sayfaya erişim izniniz bulunmamaktadır.',
    requiredPermission: 'Gerekli İzin: Fatura Oluşturma'
  },
  en: {
    // Form header
    createNewBill: 'Create New Bill',
    createBillDesc: 'Create dues, maintenance or utility bills',
    
    // Unit prices section
    currentUnitPrices: 'Current Unit Prices',
    pricesLoading: 'Loading prices...',
    dues: 'Dues:',
    electricity: 'Electricity:',
    water: 'Water:',
    gas: 'Gas:',
    
    // Form fields
    billType: 'Bill Type *',
    selectBillType: 'Select bill type',
    property: 'Property *',
    selectProperty: 'Select property',
    propertySearch: 'Search property...',
    loading: 'Loading...',
    removeSelection: 'Remove selection',
    propertiesFound: 'properties found',
    noPropertiesFound: 'No properties found',
    noMatchingProperties: 'No properties match your search',
    loadingMore: 'Loading more...',
    tenant: 'Tenant:',
    owner: 'Owner:',
    
    // Bill title
    billTitle: 'Bill Title *',
    billTitleRequired: 'Bill title is required',
    billTitleMinLength: 'Must be at least 3 characters',
    billTitlePlaceholder: 'Example: January 2024 Dues',
    
    // Due date
    dueDate: 'Due Date *',
    dueDateRequired: 'Due date is required',
    
    // Amount
    amount: 'Amount (IQD) *',
    amountRequired: 'Amount is required',
    amountMin: 'Amount must be greater than 0',
    amountPlaceholder: '0.00',
    duesCalculation: 'Dues Calculation:',
    calculationFailed: 'Cannot calculate',
    
    // Payment method
    paymentMethod: 'Payment Method',
    
    // Document number
    documentNumber: 'Document Number',
    documentNumberPlaceholder: 'Example: INV-2024-001',
    
    // Buttons
    cancel: 'Cancel',
    createBill: 'Create Bill',
    creatingBill: 'Creating Bill...',
    permissionLoading: 'Checking permissions...',
    noPermission: 'You do not have permission to access this page.',
    requiredPermission: 'Required Permission: Create Billing'
  },
  ar: {
    // Form header
    createNewBill: 'إنشاء فاتورة جديدة',
    createBillDesc: 'إنشاء فواتير رسوم أو صيانة أو مرافق',
    
    // Unit prices section
    currentUnitPrices: 'أسعار الوحدات الحالية',
    pricesLoading: 'جاري تحميل الأسعار...',
    dues: 'الرسوم:',
    electricity: 'الكهرباء:',
    water: 'الماء:',
    gas: 'الغاز:',
    
    // Form fields
    billType: 'نوع الفاتورة *',
    selectBillType: 'اختر نوع الفاتورة',
    property: 'الممتلكات *',
    selectProperty: 'اختر الممتلكات',
    propertySearch: 'البحث في الممتلكات...',
    loading: 'جاري التحميل...',
    removeSelection: 'إزالة الاختيار',
    propertiesFound: 'ممتلكات موجودة',
    noPropertiesFound: 'لم يتم العثور على ممتلكات',
    noMatchingProperties: 'لا توجد ممتلكات تطابق بحثك',
    loadingMore: 'جاري تحميل المزيد...',
    tenant: 'المستأجر:',
    owner: 'المالك:',
    
    // Bill title
    billTitle: 'عنوان الفاتورة *',
    billTitleRequired: 'عنوان الفاتورة مطلوب',
    billTitleMinLength: 'يجب أن يكون 3 أحرف على الأقل',
    billTitlePlaceholder: 'مثال: رسوم يناير 2024',
    
    // Due date
    dueDate: 'تاريخ الاستحقاق *',
    dueDateRequired: 'تاريخ الاستحقاق مطلوب',
    
    // Amount
    amount: 'المبلغ (دينار عراقي) *',
    amountRequired: 'المبلغ مطلوب',
    amountMin: 'يجب أن يكون المبلغ أكبر من 0',
    amountPlaceholder: '0.00',
    duesCalculation: 'حساب الرسوم:',
    calculationFailed: 'لا يمكن الحساب',
    
    // Payment method
    paymentMethod: 'طريقة الدفع',
    
    // Document number
    documentNumber: 'رقم المستند',
    documentNumberPlaceholder: 'مثال: INV-2024-001',
    
    // Buttons
    cancel: 'إلغاء',
    createBill: 'إنشاء فاتورة',
    creatingBill: 'جاري إنشاء الفاتورة...',
    permissionLoading: 'جاري فحص الأذونات...',
    noPermission: 'ليس لديك إذن للوصول إلى هذه الصفحة.',
    requiredPermission: 'الإذن المطلوب: إنشاء فاتورة'
  }
};

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
  // BEFORE any conditional returns - Tüm hook'ları en üste taşı
  const [mounted, setMounted] = useState(false);
  const { hasPermission, loading: permissionLoading } = usePermissionCheck();
  
  // Dil tercihini localStorage'dan al
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const propertyDropdownRef = useRef<HTMLDivElement>(null);
  const propertyInputRef = useRef<HTMLInputElement>(null);
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

  // Client-side mount kontrolü
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dil tercihini localStorage'dan al
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

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

  // Fetch properties from admin/properties with search (server-side pagination) - with debounce
  useEffect(() => {
    let active = true;
    const timeoutId = setTimeout(async () => {
      try {
        if (!propertyDropdownOpen) return;
        
        setLoadingProperties(true);
        
        // Always fetch properties when dropdown is open
        const requestedLimit = 100;
        const res = await unitsService.getAllProperties({
          page: 1,
          limit: requestedLimit,
          orderColumn: 'name',
          orderBy: 'ASC',
          search: propertySearchQuery || undefined,
          includeBills: false,
        } as any);

        console.log('🔍 CreateBillForm API Response:', {
          res,
          hasSuccess: !!res.success,
          hasData: !!res?.data,
          dataType: typeof res?.data,
          isDataArray: Array.isArray(res?.data),
          dataLength: Array.isArray(res?.data) ? res.data.length : 'not array',
          firstItem: Array.isArray(res?.data) && res.data.length > 0 ? res.data[0] : 'no items'
        });

        // Handle response structure - unitsService returns { data: Property[], pagination: {...} }
        let list = [];
        if (res?.success && res?.data && Array.isArray(res.data)) {
          list = res.data;
        } else if (res?.data && Array.isArray(res.data)) {
          list = res.data;
        } else if (Array.isArray(res)) {
          list = res;
        } else {
          console.warn('🚨 CreateBillForm: Unexpected API response structure:', res);
          list = [];
        }
        
        if (active && list.length > 0) {
          const formattedProperties = list.map((property: any) => ({
            id: property.id,
            value: property.id,
            label: `${property.name} (${property.propertyNumber})`,
            propertyNumber: property.propertyNumber,
            area: property.area,
            owner: property.owner,
            tenant: property.tenant,
            __raw: property
          }));
          
          console.log('🔍 CreateBillForm Formatted Properties:', {
            originalLength: list.length,
            formattedLength: formattedProperties.length,
            firstFormatted: formattedProperties[0] || 'no items'
          });
          
          setProperties(formattedProperties);
          setFilteredProperties(formattedProperties);
          setHasMore(list.length >= requestedLimit);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        if (active) {
          setLoadingProperties(false);
        }
      }
    }, 300); // 300ms debounce

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [propertyDropdownOpen, propertySearchQuery]);

  // Fetch unit prices
  useEffect(() => {
    const fetchUnitPrices = async () => {
      try {
        setUnitPricesLoading(true);
        const response = await unitPricesService.getUnitPrices();
        if (response && Array.isArray(response)) {
          setUnitPrices(response);
        }
      } catch (error) {
        console.error('Error fetching unit prices:', error);
      } finally {
        setUnitPricesLoading(false);
      }
    };

    fetchUnitPrices();
  }, []);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

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

  // Permission kontrolü - koşullu render fonksiyonları
  const renderPermissionLoading = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">{t.permissionLoading}</p>
      </div>
    </Card>
  );

  const renderNoPermission = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t.noPermission}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t.requiredPermission}
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-auto"
        >
          {t.cancel}
        </Button>
      </div>
    </Card>
  );

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

  // Fetch properties from admin/properties with search (server-side pagination) - with debounce
  useEffect(() => {
     let active = true;
     const timeoutId = setTimeout(async () => {
       try {
         if (!propertyDropdownOpen) return;
         
         setLoadingProperties(true);
         
                  // Always fetch properties when dropdown is open
         const requestedLimit = 100;
         const res = await unitsService.getAllProperties({
           page: 1,
           limit: requestedLimit,
           orderColumn: 'name',
           orderBy: 'ASC',
           search: propertySearchQuery || undefined,
           includeBills: false,
         } as any);
         
         console.log('🔍 CreateBillForm Second API Response:', {
           res,
           hasSuccess: !!res?.success,
           hasData: !!res?.data,
           dataType: typeof res?.data,
           isDataArray: Array.isArray(res?.data),
           dataLength: Array.isArray(res?.data) ? res.data.length : 'not array',
           fullResponse: JSON.stringify(res, null, 2)
         });
         
         // Handle response structure - unitsService returns { data: Property[], pagination: {...} }
         let list = [];
         if (res?.success && res?.data && Array.isArray(res.data)) {
           list = res.data;
         } else if (res?.data && Array.isArray(res.data)) {
           list = res.data;
         } else if (Array.isArray(res)) {
           list = res;
         } else {
           console.warn('🚨 CreateBillForm: Unexpected API response structure:', res);
           list = [];
         }
         
         console.log('🔍 CreateBillForm List:', {
           list,
           listLength: list.length,
           isListArray: Array.isArray(list)
         });
         
         if (!active) return;
         
         if (list.length > 0) {
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
           
           console.log('🔍 CreateBillForm Mapped Properties:', {
             mappedLength: mapped.length,
             firstMapped: mapped[0] || 'no items'
           });
           
           setProperties(mapped);
           setFilteredProperties(mapped);
           const current = res?.pagination?.page ?? 1;
           const totalPages = res?.pagination?.totalPages;
           setPage(current);
           // hasMore if server says there are more pages OR if we exactly filled the page (fallback)
           const serverHasMore = typeof totalPages === 'number' ? current < totalPages : false;
           const filledPage = list.length === requestedLimit;
           setHasMore(serverHasMore || filledPage);
         } else {
           setProperties([]);
           setFilteredProperties([]);
           setHasMore(false);
         }
      } catch (error) {
        if (!active) return;
        console.error('Error fetching properties:', error);
        setProperties([]);
        setFilteredProperties([]);
        setHasMore(false);
      } finally {
        if (active) setLoadingProperties(false);
      }
    }, 100); // 100ms debounce delay - çok hızlı tepki

    return () => { 
      active = false; 
      clearTimeout(timeoutId);
    };
  }, [propertySearchQuery]); // propertyDropdownOpen'ı dependency'den çıkardık

     // Show existing properties when dropdown opens and keep it open
   useEffect(() => {
     if (propertyDropdownOpen) {
       // If we have properties and search is empty, show all properties
       if (properties.length > 0 && !propertySearchQuery.trim()) {
         setFilteredProperties(properties);
       }
       // If dropdown opens and no properties loaded yet, trigger initial load
       if (properties.length === 0 && !propertySearchQuery.trim()) {
         // This will trigger the main useEffect to load properties
         setPropertySearchQuery(''); // Force a refresh
       }
     }
   }, [propertyDropdownOpen, properties, propertySearchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(e.target as Node)) {
        // Only close if user is not actively typing
        if (!propertySearchQuery.trim()) {
          setPropertyDropdownOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [propertySearchQuery]);

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

  // SSR ve permission kontrolü
  if (!mounted || permissionLoading) {
    return renderPermissionLoading();
  }

  // TEMPORARILY DISABLED - Permission kontrolü
  // if (!hasPermission(CREATE_BILLING_PERMISSION_ID)) {
  //   return renderNoPermission();
  // }

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

  // Dinamik bill type options oluştur
  const getBillTypeOptions = () => {
    const billTypeTranslations = {
      tr: {
        DUES: { label: 'Aidat', description: 'Aylık aidat ödemesi' },
        MAINTENANCE: { label: 'Bakım', description: 'Bakım ve onarım masrafları' },
        UTILITY: { label: 'Fayda', description: 'Elektrik, su, gaz faturaları' },
        PENALTY: { label: 'Ceza', description: 'Gecikme cezası' },
        OTHER: { label: 'Diğer', description: 'Diğer fatura türleri' }
      },
      en: {
        DUES: { label: 'Dues', description: 'Monthly dues payment' },
        MAINTENANCE: { label: 'Maintenance', description: 'Maintenance and repair costs' },
        UTILITY: { label: 'Utility', description: 'Electricity, water, gas bills' },
        PENALTY: { label: 'Penalty', description: 'Late payment penalty' },
        OTHER: { label: 'Other', description: 'Other bill types' }
      },
      ar: {
        DUES: { label: 'الرسوم', description: 'دفع الرسوم الشهرية' },
        MAINTENANCE: { label: 'الصيانة', description: 'تكاليف الصيانة والإصلاح' },
        UTILITY: { label: 'المرافق', description: 'فواتير الكهرباء والماء والغاز' },
        PENALTY: { label: 'الغرامة', description: 'غرامة التأخير في الدفع' },
        OTHER: { label: 'أخرى', description: 'أنواع فواتير أخرى' }
      }
    };

    return BILL_TYPE_OPTIONS.map(option => ({
      ...option,
      label: billTypeTranslations[currentLanguage as keyof typeof billTypeTranslations]?.[option.value]?.label || option.label,
      description: billTypeTranslations[currentLanguage as keyof typeof billTypeTranslations]?.[option.value]?.description || option.description
    }));
  };

  // Dinamik payment method options oluştur
  const getPaymentMethodOptions = () => {
    const paymentMethodTranslations = {
      tr: {
        CASH: { label: 'Nakit', description: 'Nakit ödeme' },
        CREDIT_CARD: { label: 'Kredi Kartı', description: 'Kredi kartı ile ödeme' },
        BANK_TRANSFER: { label: 'Banka Havalesi/EFT', description: 'Banka havalesi/EFT ile ödeme' },
        DIRECT_DEBIT: { label: 'Otomatik Ödeme Talimatı', description: 'Hesaptan otomatik tahsilat' },
        ONLINE_PAYMENT: { label: 'Online Ödeme', description: 'İnternet üzerinden ödeme' },
        MOBILE_PAYMENT: { label: 'Mobil Ödeme', description: 'Mobil uygulama ile ödeme' },
        CHECK: { label: 'Çek', description: 'Çek ile ödeme' },
        OTHER: { label: 'Diğer', description: 'Diğer ödeme yöntemi' }
      },
      en: {
        CASH: { label: 'Cash', description: 'Cash payment' },
        CREDIT_CARD: { label: 'Credit Card', description: 'Payment by credit card' },
        BANK_TRANSFER: { label: 'Bank Transfer/EFT', description: 'Payment by bank transfer/EFT' },
        DIRECT_DEBIT: { label: 'Direct Debit', description: 'Automatic deduction from account' },
        ONLINE_PAYMENT: { label: 'Online Payment', description: 'Payment over the internet' },
        MOBILE_PAYMENT: { label: 'Mobile Payment', description: 'Payment via mobile app' },
        CHECK: { label: 'Check', description: 'Payment by check' },
        OTHER: { label: 'Other', description: 'Other payment method' }
      },
      ar: {
        CASH: { label: 'نقداً', description: 'دفع نقدي' },
        CREDIT_CARD: { label: 'بطاقة ائتمان', description: 'الدفع ببطاقة الائتمان' },
        BANK_TRANSFER: { label: 'تحويل بنكي/EFT', description: 'الدفع بالتحويل البنكي/EFT' },
        DIRECT_DEBIT: { label: 'خصم مباشر', description: 'خصم تلقائي من الحساب' },
        ONLINE_PAYMENT: { label: 'دفع إلكتروني', description: 'الدفع عبر الإنترنت' },
        MOBILE_PAYMENT: { label: 'دفع محمول', description: 'الدفع عبر التطبيق المحمول' },
        CHECK: { label: 'شيك', description: 'الدفع بشيك' },
        OTHER: { label: 'أخرى', description: 'طريقة دفع أخرى' }
      }
    };

    return PAYMENT_METHOD_OPTIONS.map(option => ({
      ...option,
      label: paymentMethodTranslations[currentLanguage as keyof typeof paymentMethodTranslations]?.[option.value]?.label || option.label,
      description: paymentMethodTranslations[currentLanguage as keyof typeof paymentMethodTranslations]?.[option.value]?.description || option.description
    }));
  };

  const getBillTypeIcon = (type: BillType) => {
    const option = BILL_TYPE_OPTIONS.find(opt => opt.value === type);
    return option?.icon || '📄';
  };

  const getBillTypeDescription = (type: BillType) => {
    const translatedOptions = getBillTypeOptions();
    const option = translatedOptions.find(opt => opt.value === type);
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
              {t.createNewBill}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.createBillDesc}
            </p>
          </div>
        </div>
        
        {/* Unit Prices Info */}
        <div className="flex flex-col gap-2 min-w-[200px]">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.currentUnitPrices}
          </h4>
          {unitPricesLoading ? (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t.pricesLoading}
            </div>
          ) : (
            <div className="space-y-1">
              {getUnitPriceByType('DUES') && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{t.dues}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {parseFloat(getUnitPriceByType('DUES')?.unitPrice || '0').toFixed(2)} IQD/{getUnitPriceByType('DUES')?.unit}
                  </span>
                </div>
              )}
              {getUnitPriceByType('ELECTRICITY') && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{t.electricity}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {parseFloat(getUnitPriceByType('ELECTRICITY')?.unitPrice || '0').toFixed(2)} IQD/{getUnitPriceByType('ELECTRICITY')?.unit}
                  </span>
                </div>
              )}
              {getUnitPriceByType('WATER') && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{t.water}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {parseFloat(getUnitPriceByType('WATER')?.unitPrice || '0').toFixed(2)} IQD/{getUnitPriceByType('WATER')?.unit}
                  </span>
                </div>
              )}
              {getUnitPriceByType('GAS') && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{t.gas}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {parseFloat(getUnitPriceByType('GAS')?.unitPrice || '0').toFixed(2)} IQD/{getUnitPriceByType('GAS')?.unit}
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
            {t.billType}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {getBillTypeOptions().map((option) => (
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
                  {...register('billType', { required: t.selectBillType })}
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
            {t.property}
          </label>
          <div ref={propertyDropdownRef} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light-muted dark:text-text-muted" />
                                                           <input
                  ref={propertyInputRef}
                  type="text"
                  autoComplete="off"
                  placeholder={loadingProperties ? t.loading : t.propertySearch}
                  value={propertySearchQuery}
                                   onChange={(e) => {
                    setPropertySearchQuery(e.target.value);
                    // Reset pagination when search changes
                    setPage(1);
                    setHasMore(true);
                    // Keep dropdown open when typing
                    if (!propertyDropdownOpen) {
                      setPropertyDropdownOpen(true);
                    }
                  }}
                  onBlur={(e) => {
                    // Prevent blur when clicking inside dropdown
                    const relatedTarget = e.relatedTarget as HTMLElement;
                    if (propertyDropdownRef.current?.contains(relatedTarget)) {
                      e.preventDefault();
                      // Use setTimeout to ensure focus is maintained
                      setTimeout(() => {
                        propertyInputRef.current?.focus();
                      }, 0);
                    }
                  }}
                                   onCompositionEnd={(e) => {
                    // Trigger search after IME composition ends (for non-Latin characters)
                    setPropertySearchQuery((e.target as HTMLInputElement).value);
                  }}
                 onFocus={() => setPropertyDropdownOpen(true)}
                 onKeyDown={(e) => {
                   // Allow typing without delay
                   if (e.key === 'Enter') {
                     e.preventDefault();
                     setPropertyDropdownOpen(false);
                   }
                 }}
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
                    title={t.removeSelection}
                  >
                    <X className="h-3 w-3 mr-1" /> {t.removeSelection}
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
                      
                      console.log('🔍 CreateBillForm Scroll Loading API Response:', {
                        res,
                        page: next,
                        hasSuccess: !!res.success,
                        hasData: !!res.data,
                        dataLength: Array.isArray(res.data) ? res.data.length : 'not array'
                      });
                      
                                             // Handle response structure - unitsService returns { data: Property[], pagination: {...} }
                       let list = [];
                       if (res?.success && res?.data && Array.isArray(res.data)) {
                         list = res.data;
                       } else if (res?.data && Array.isArray(res.data)) {
                         list = res.data;
                       } else if (Array.isArray(res)) {
                         list = res;
                       } else {
                         console.warn('🚨 CreateBillForm Scroll: Unexpected API response structure:', res);
                         list = [];
                       }
                       
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
                       
                       console.log('🔍 CreateBillForm Scroll Mapped:', {
                         mappedLength: mapped.length,
                         totalPropertiesAfter: properties.length + mapped.length
                       });
                       
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
                  <div className="p-3 text-center text-text-light-muted dark:text-text-muted">{t.loading}</div>
                ) : filteredProperties.length === 0 ? (
                  <div className="p-3 text-center text-text-light-muted dark:text-text-muted">{propertySearchQuery ? t.noMatchingProperties : t.noPropertiesFound}</div>
                ) : (
                  <>
                    <div className="p-2 text-xs font-medium text-text-light-muted dark:text-text-muted">{filteredProperties.length} {t.propertiesFound}</div>
            {filteredProperties.map((p) => (
                                             <button
                         key={p.id}
                         type="button"
                         onMouseDown={(e) => {
                           // Prevent input blur when clicking dropdown items
                           e.preventDefault();
                         }}
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
                                    {t.tenant} {p.tenant.firstName} {p.tenant.lastName}
                                  </span>
                                ) : p.owner ? (
                                  <span className="inline-flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    {t.owner} {p.owner.firstName} {p.owner.lastName}
                                  </span>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                    {isLoadingMore && (
                      <div className="p-3 text-center text-text-light-muted dark:text-text-muted">{t.loadingMore}</div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          {/* Hidden input for validation error display */}
          <input type="hidden" {...register('propertyId', { required: t.selectProperty })} />
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
            {t.billTitle}
          </label>
          <Input
            {...register('title', { 
              required: t.billTitleRequired,
              minLength: { value: 3, message: t.billTitleMinLength }
            })}
            placeholder={t.billTitlePlaceholder}
            icon={FileText}
            error={errors.title?.message}
            disabled={isLoading}
          />
        </div>

        {/* Amount and Due Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.dueDate}
            </label>
            <Input
              type="date"
              {...register('dueDate', { required: t.dueDateRequired })}
              icon={Calendar}
              error={errors.dueDate?.message}
              disabled={isLoading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

                     <div className="space-y-2">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
               {t.amount}
             </label>
             <Input
               type="number"
               step="0.01"
               min="0"
               {...register('amount', { 
                 required: t.amountRequired,
                 min: { value: 0.01, message: t.amountMin }
               })}
               placeholder={t.amountPlaceholder}
               icon={DollarSign}
               error={errors.amount?.message}
               disabled={isLoading}
             />
             {/* Aidat hesaplama bilgisi */}
             {watchedBillType === 'DUES' && watchedPropertyId && (
               <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                 <div className="flex justify-between">
                   <span>{t.duesCalculation}</span>
                   <span className="font-medium">
                     {(() => {
                       const selectedProperty = properties.find(p => p.id === watchedPropertyId);
                       const duesPrice = getUnitPriceByType('DUES');
                       if (selectedProperty?.area && duesPrice) {
                         const unitPrice = parseFloat(duesPrice.unitPrice);
                         const area = selectedProperty.area;
                         return `${unitPrice.toFixed(2)} IQD/m² × ${area} m² = ${(unitPrice * area).toFixed(2)} IQD`;
                       }
                       return t.calculationFailed;
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
            {t.paymentMethod}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {getPaymentMethodOptions().map((option) => (
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
            {t.documentNumber}
          </label>
          <Input
            {...register('documentNumber')}
            placeholder={t.documentNumberPlaceholder}
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
                 {getBillTypeOptions().find(opt => opt.value === watchedBillType)?.label}
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
            {t.cancel}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isLoading}
            isLoading={isSubmitting}
            icon={FileText}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? t.creatingBill : t.createBill}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateBillForm;
