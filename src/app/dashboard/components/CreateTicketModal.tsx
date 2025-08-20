'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, AlertCircle, Plus, Upload, Search, ChevronDown, Building, X } from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import TextArea from '@/app/components/ui/TextArea';
import Button from '@/app/components/ui/Button';

import Checkbox from '@/app/components/ui/Checkbox';
import FileUpload from '@/app/components/ui/FileUpload';
import { useAuth } from '@/app/components/auth/AuthProvider';
import { useToast } from '@/hooks/useToast';
import { unitsService } from '@/services';

// Dil çevirileri
const translations = {
  tr: {
    // Modal titles
    modalTitle: 'Yeni Talep Oluştur',
    modalSubtitle: 'Talep detaylarını doldurun',
    
    // Error messages
    error: 'Hata',
    fileSizeError: 'Dosya boyutu 10MB\'dan büyük olamaz',
    unsupportedFileType: 'Desteklenmeyen dosya türü',
    ticketCreationFailed: 'Talep oluşturma başarısız',
    ticketCreationError: 'Talep oluşturulurken bir hata oluştu',
    fileUploadFailed: 'Dosya yükleme başarısız',
    someFilesNotUploaded: 'Talep oluşturuldu ancak bazı dosyalar yüklenemedi.',
    ticketCreatedSuccess: 'Talep başarıyla oluşturuldu!',
    
    // Form sections
    requiredInfo: 'Zorunlu Bilgiler',
    optionalInfo: 'Opsiyonel Bilgiler',
    
    // Form fields
    title: 'Talep Başlığı',
    titleRequired: 'Talep başlığı zorunludur',
    titleMinLength: 'En az 3 karakter olmalıdır',
    titlePlaceholder: 'Örn: Su tesisatı arızası',
    
    description: 'Açıklama',
    descriptionRequired: 'Açıklama zorunludur',
    descriptionMinLength: 'En az 10 karakter olmalıdır',
    descriptionPlaceholder: 'Talep detaylarını açıklayın...',
    
    type: 'Talep Türü',
    priority: 'Öncelik',
    priorityRequired: 'Öncelik seçimi zorunludur',
    status: 'Durum',
    category: 'Kategori',
    property: 'Konut',
    selectProperty: 'Konut seçiniz',
    propertySearch: 'Konut ara...',
    removeSelection: 'Seçimi kaldır',
    propertiesFound: 'konut bulundu',
    noPropertiesFound: 'Konut bulunamadı',
    noMatchingProperties: 'Aramanızla eşleşen konut bulunamadı',
    loadingMore: 'Daha fazla yükleniyor...',
    tenant: 'Kiracı:',
    owner: 'Malik:',
    assignee: 'Atanacak Kişi',
    initialComment: 'İlk Yorum',
    initialCommentPlaceholder: 'İlk yorumunuzu yazın...',
    internalComment: 'Dahili yorum (sadece yöneticiler görebilir)',
    attachments: 'Dosya Ekleri',
    selectedFiles: 'Seçilen Dosyalar:',
    remove: 'Kaldır',
    
    // Loading states
    loading: 'Yükleniyor...',
    select: 'Seçiniz',
    creating: 'Talep Oluşturuluyor...',
    create: 'Talep Oluştur',
    cancel: 'İptal',
    
    // Ticket types
    request: 'İstek',
    complaint: 'Şikayet',
    faultRepair: 'Arıza/Tamir',
    maintenance: 'Bakım',
    cleaningType: 'Temizlik',
    suggestion: 'Öneri',
    other: 'Diğer',
    
    // Priorities
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
    urgent: 'Acil',
    
    // Statuses
    open: 'Açık',
    inProgress: 'İşlemde',
    waiting: 'Beklemede',
    resolved: 'Çözüldü',
    closed: 'Kapatıldı',
    cancelled: 'İptal Edildi',
    
    // Categories
    plumbing: 'Tesisat',
    electrical: 'Elektrik',
    heating: 'Isıtma',
    cooling: 'Soğutma',
    cleaning: 'Temizlik',
    security: 'Güvenlik',
    garden: 'Bahçe',
    elevator: 'Asansör',
    internet: 'İnternet'
  },
  en: {
    // Modal titles
    modalTitle: 'Create New Request',
    modalSubtitle: 'Fill in request details',
    
    // Error messages
    error: 'Error',
    fileSizeError: 'File size cannot exceed 10MB',
    unsupportedFileType: 'Unsupported file type',
    ticketCreationFailed: 'Request creation failed',
    ticketCreationError: 'An error occurred while creating the request',
    fileUploadFailed: 'File upload failed',
    someFilesNotUploaded: 'Request created but some files could not be uploaded.',
    ticketCreatedSuccess: 'Request created successfully!',
    
    // Form sections
    requiredInfo: 'Required Information',
    optionalInfo: 'Optional Information',
    
    // Form fields
    title: 'Request Title',
    titleRequired: 'Request title is required',
    titleMinLength: 'Must be at least 3 characters',
    titlePlaceholder: 'Ex: Plumbing issue',
    
    description: 'Description',
    descriptionRequired: 'Description is required',
    descriptionMinLength: 'Must be at least 10 characters',
    descriptionPlaceholder: 'Describe request details...',
    
    type: 'Request Type',
    priority: 'Priority',
    priorityRequired: 'Priority selection is required',
    status: 'Status',
    category: 'Category',
    property: 'Property',
    selectProperty: 'Select property',
    propertySearch: 'Search property...',
    removeSelection: 'Remove selection',
    propertiesFound: 'properties found',
    noPropertiesFound: 'No properties found',
    noMatchingProperties: 'No properties match your search',
    loadingMore: 'Loading more...',
    tenant: 'Tenant:',
    owner: 'Owner:',
    assignee: 'Assignee',
    initialComment: 'Initial Comment',
    initialCommentPlaceholder: 'Write your initial comment...',
    internalComment: 'Internal comment (only managers can see)',
    attachments: 'File Attachments',
    selectedFiles: 'Selected Files:',
    remove: 'Remove',
    
    // Loading states
    loading: 'Loading...',
    select: 'Select',
    creating: 'Creating Request...',
    create: 'Create Request',
    cancel: 'Cancel',
    
    // Ticket types
    request: 'Request',
    complaint: 'Complaint',
    faultRepair: 'Fault/Repair',
    maintenance: 'Maintenance',
    cleaningType: 'Cleaning',
    suggestion: 'Suggestion',
    other: 'Other',
    
    // Priorities
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
    
    // Statuses
    open: 'Open',
    inProgress: 'In Progress',
    waiting: 'Waiting',
    resolved: 'Resolved',
    closed: 'Closed',
    cancelled: 'Cancelled',
    
    // Categories
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    heating: 'Heating',
    cooling: 'Cooling',
    cleaning: 'Cleaning',
    security: 'Security',
    garden: 'Garden',
    elevator: 'Elevator',
    internet: 'Internet'
  },
  ar: {
    // Modal titles
    modalTitle: 'إنشاء طلب جديد',
    modalSubtitle: 'املأ تفاصيل الطلب',
    
    // Error messages
    error: 'خطأ',
    fileSizeError: 'حجم الملف لا يمكن أن يتجاوز 10 ميجابايت',
    unsupportedFileType: 'نوع ملف غير مدعوم',
    ticketCreationFailed: 'فشل في إنشاء الطلب',
    ticketCreationError: 'حدث خطأ أثناء إنشاء الطلب',
    fileUploadFailed: 'فشل رفع الملف',
    someFilesNotUploaded: 'تم إنشاء الطلب ولكن بعض الملفات لم يمكن رفعها.',
    ticketCreatedSuccess: 'تم إنشاء الطلب بنجاح!',
    
    // Form sections
    requiredInfo: 'المعلومات المطلوبة',
    optionalInfo: 'معلومات اختيارية',
    
    // Form fields
    title: 'عنوان الطلب',
    titleRequired: 'عنوان الطلب مطلوب',
    titleMinLength: 'يجب أن يكون 3 أحرف على الأقل',
    titlePlaceholder: 'مثال: مشكلة في السباكة',
    
    description: 'الوصف',
    descriptionRequired: 'الوصف مطلوب',
    descriptionMinLength: 'يجب أن يكون 10 أحرف على الأقل',
    descriptionPlaceholder: 'صف تفاصيل الطلب...',
    
    type: 'نوع الطلب',
    priority: 'الأولوية',
    priorityRequired: 'اختيار الأولوية مطلوب',
    status: 'الحالة',
    category: 'الفئة',
    property: 'العقار',
    selectProperty: 'اختر العقار',
    propertySearch: 'البحث في العقار...',
    removeSelection: 'إزالة الاختيار',
    propertiesFound: 'عقار موجود',
    noPropertiesFound: 'لم يتم العثور على عقار',
    noMatchingProperties: 'لا توجد عقارات تطابق بحثك',
    loadingMore: 'جاري تحميل المزيد...',
    tenant: 'المستأجر:',
    owner: 'المالك:',
    assignee: 'المسؤول',
    initialComment: 'التعليق الأولي',
    initialCommentPlaceholder: 'اكتب تعليقك الأولي...',
    internalComment: 'تعليق داخلي (المديرون فقط يمكنهم رؤيته)',
    attachments: 'مرفقات الملفات',
    selectedFiles: 'الملفات المحددة:',
    remove: 'إزالة',
    
    // Loading states
    loading: 'جاري التحميل...',
    select: 'اختر',
    creating: 'جاري إنشاء الطلب...',
    create: 'إنشاء الطلب',
    cancel: 'إلغاء',
    
    // Ticket types
    request: 'طلب',
    complaint: 'شكوى',
    faultRepair: 'عطل/إصلاح',
    maintenance: 'صيانة',
    cleaningType: 'تنظيف',
    suggestion: 'اقتراح',
    other: 'آخر',
    
    // Priorities
    low: 'منخفض',
    medium: 'متوسط',
    high: 'عالي',
    urgent: 'عاجل',
    
    // Statuses
    open: 'مفتوح',
    inProgress: 'قيد التنفيذ',
    waiting: 'في الانتظار',
    resolved: 'تم الحل',
    closed: 'مغلق',
    cancelled: 'ملغي',
    
    // Categories
    plumbing: 'السباكة',
    electrical: 'الكهرباء',
    heating: 'التدفئة',
    cooling: 'التبريد',
    cleaning: 'التنظيف',
    security: 'الأمان',
    garden: 'الحديقة',
    elevator: 'المصعد',
    internet: 'الإنترنت'
  }
};

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    defaultAssigneeId?: string; // Varsayılan atanacak kişi ID'si
    defaultAssigneeName?: string; // Varsayılan atanacak kişi adı
}

interface PropertyOption {
  id: string;
  value: string;
  label: string;
  propertyNumber: string;
  area?: number;
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
  __raw?: any;
}

interface CreateTicketFormData {
    title: string;
    description: string;
    type: string;
    priority: string;
    status: string;
    category: string;
    creatorId: string;
    assigneeId: string;
    propertyId: string;
    initialComment: string;
    isInternalComment: boolean;
}

// Enum değerleri dokümantasyona göre - dinamik olarak çevirilerle oluşturulacak

export default function CreateTicketModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    defaultAssigneeId, 
    defaultAssigneeName 
}: CreateTicketModalProps) {
    const { user } = useAuth();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Dil tercihini localStorage'dan al
    const [currentLanguage, setCurrentLanguage] = useState('tr');
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Çevirileri al
    const t = translations[currentLanguage as keyof typeof translations];
    
    // Dinamik olarak çevirilerle oluşturulan array'ler
    const ticketTypes = [
        { value: '', label: t.select },
        { value: 'REQUEST', label: t.request },
        { value: 'COMPLAINT', label: t.complaint },
        { value: 'FAULT_REPAIR', label: t.faultRepair },
        { value: 'MAINTENANCE', label: t.maintenance },
        { value: 'CLEANING', label: t.cleaningType },
        { value: 'SUGGESTION', label: t.suggestion },
        { value: 'OTHER', label: t.other }
    ];

    const priorities = [
        { value: 'LOW', label: t.low },
        { value: 'MEDIUM', label: t.medium },
        { value: 'HIGH', label: t.high },
        { value: 'URGENT', label: t.urgent }
    ];

    const statuses = [
        { value: '', label: t.select },
        { value: 'OPEN', label: t.open },
        { value: 'IN_PROGRESS', label: t.inProgress },
        { value: 'WAITING', label: t.waiting },
        { value: 'RESOLVED', label: t.resolved },
        { value: 'CLOSED', label: t.closed },
        { value: 'CANCELLED', label: t.cancelled }
    ];

    const categories = [
        { value: '', label: t.select },
        { value: 'Tesisat', label: t.plumbing },
        { value: 'Elektrik', label: t.electrical },
        { value: 'Isıtma', label: t.heating },
        { value: 'Soğutma', label: t.cooling },
        { value: 'Temizlik', label: t.cleaningType },
        { value: 'Güvenlik', label: t.security },
        { value: 'Bahçe', label: t.garden },
        { value: 'Asansör', label: t.elevator },
        { value: 'İnternet', label: t.internet },
        { value: 'Diğer', label: t.other }
    ];

    const [error, setError] = useState<string | null>(null);
    const [properties, setProperties] = useState<PropertyOption[]>([]);
    const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
    const [loadingProperties, setLoadingProperties] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    
    // Property dropdown states
    const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
    const propertyDropdownRef = useRef<HTMLDivElement>(null);
    const propertyInputRef = useRef<HTMLInputElement>(null);
    const [propertySearchQuery, setPropertySearchQuery] = useState('');
    const [filteredProperties, setFilteredProperties] = useState<PropertyOption[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch,
        setValue
    } = useForm<CreateTicketFormData>({
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            type: '',
            priority: 'MEDIUM',
            status: 'OPEN',
            category: '',

            creatorId: '',
            assigneeId: '',
            propertyId: '',
            initialComment: '',
            isInternalComment: false
        }
    });

    // Watch priority for debugging
    const watchedPriority = watch('priority');

    // Load users when modal opens
    useEffect(() => {
        if (isOpen) {
            loadUsers();
            // Set current user as creator
            if (user?.id) {
                setValue('creatorId', typeof user.id === 'string' ? user.id : String(user.id));
            }
            // Set default assignee if provided
            if (defaultAssigneeId) {
                setValue('assigneeId', defaultAssigneeId);
            }
        }
    }, [isOpen, user, defaultAssigneeId]);

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
                
                const list = res?.data || [];
                const mapped: PropertyOption[] = list.map((property: any) => ({
                    id: property.id,
                    value: property.id,
                    label: `${property.propertyNumber} - ${property.name}`,
                    propertyNumber: property.propertyNumber,
                    area: property.area || 0,
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



    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await fetch('/api/proxy/admin/staff/maintenance/on-duty', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const userOptions = (data.data || []).map((staff: any) => ({
                    value: staff.id,
                    label: staff.positionTitle
                        ? `${staff.firstName} ${staff.lastName} - ${staff.department} - ${staff.positionTitle}`
                        : `${staff.firstName} ${staff.lastName} - ${staff.department}`
                }));
                setUsers(userOptions);
            }
        } catch (error) {
            console.error('On-duty maintenance staff loading failed:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleFilesChange = (files: FileList | null) => {
        if (files) {
            const fileArray = Array.from(files);
            
            // Validate each file
            const validFiles: File[] = [];
            const errors: string[] = [];
            
            fileArray.forEach(file => {
                // File size limit: 10MB
                if (file.size > 10 * 1024 * 1024) {
                    errors.push(`${file.name}: ${t.fileSizeError}`);
                    return;
                }
                
                // File type validation
                const allowedTypes = [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/gif',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'text/plain'
                ];
                if (!allowedTypes.includes(file.type)) {
                    errors.push(`${file.name}: ${t.unsupportedFileType}`);
                    return;
                }
                
                validFiles.push(file);
            });
            
            if (errors.length > 0) {
                setError(errors.join(', '));
            } else {
                setError(null);
            }
            
            setSelectedFiles(prev => [...prev, ...validFiles]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadAttachments = async (ticketId: string) => {
        if (selectedFiles.length === 0) return;

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            // Çoklu dosya yükleme için anahtar adı tam olarak 'files' olmalı
            formData.append('files', file);
        });

        try {
            const response = await fetch(`/api/proxy/admin/tickets/${ticketId}/attachments/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(t.fileUploadFailed);
            }

            const resJson = await response.json().catch(() => ({} as any));
            console.log('Attachments uploaded successfully', resJson?.attachments || resJson);
        } catch (error) {
            console.error('Error uploading attachments:', error);
            throw error;
        }
    };

    const onSubmit = async (data: CreateTicketFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            // Create ticket payload
            const ticketPayload: any = {
                title: data.title,
                description: data.description
            };

            // Add optional fields only if they have values
            if (data.type) ticketPayload.type = data.type;
            // Priority is always required, so always include it
            // Ensure priority is always set correctly
            const selectedPriority = data.priority && data.priority !== '' ? data.priority : 'MEDIUM';
            ticketPayload.priority = selectedPriority;
            if (data.status) ticketPayload.status = data.status;
            if (data.category) ticketPayload.category = data.category;

            if (data.creatorId) ticketPayload.creatorId = data.creatorId;
            if (data.assigneeId) ticketPayload.assigneeId = data.assigneeId;
            if (data.propertyId) ticketPayload.propertyId = data.propertyId;
            if (data.initialComment) ticketPayload.initialComment = data.initialComment;
            if (data.isInternalComment !== undefined) ticketPayload.isInternalComment = data.isInternalComment;

            console.log('Creating ticket with payload:', ticketPayload);

            // Create ticket
            const response = await fetch('/api/proxy/admin/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(ticketPayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || t.ticketCreationFailed);
            }

            const result = await response.json();
            console.log('Ticket created successfully:', result);

            // Upload attachments if any
            if (result.data?.id && selectedFiles.length > 0) {
                try {
                    await uploadAttachments(result.data.id);
                } catch (uploadError) {
                    console.error('Attachment upload failed:', uploadError);
                    // Don't fail the whole process for attachment upload failure
                    toast.warning(t.someFilesNotUploaded);
                }
            }

            // Success
            toast.success(t.ticketCreatedSuccess);
            reset({
                title: '',
                description: '',
                type: '',
                priority: 'MEDIUM', // Ensure priority is reset to MEDIUM
                status: 'OPEN',
                category: '',
                creatorId: '',
                assigneeId: '',
                propertyId: '',
                initialComment: '',
                isInternalComment: false
            });
            setSelectedFiles([]);
            onSuccess?.();
            onClose();

        } catch (error: any) {
            console.error('Error creating ticket:', error);
            setError(error.message || t.ticketCreationError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            reset({
                title: '',
                description: '',
                type: '',
                priority: 'MEDIUM', // Ensure priority is reset to MEDIUM
                status: 'OPEN',
                category: '',
                creatorId: '',
                assigneeId: '',
                propertyId: '',
                initialComment: '',
                isInternalComment: false
            });
            setSelectedFiles([]);
            setError(null);
            setPropertySearchQuery('');
            setPropertyDropdownOpen(false);
            setProperties([]);
            setFilteredProperties([]);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={t.modalTitle}
            subtitle={t.modalSubtitle}
            icon={FileText}
            size="xl"
            closable={!isLoading}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                {/* Scrollable Content Area */}
                <div className="flex-1 max-h-[70vh] overflow-y-auto px-1">
                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-red-600 font-medium">{t.error}</p>
                                    <p className="text-sm text-red-500 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Zorunlu Alanlar */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark border-b border-gray-200 dark:border-gray-700 pb-2">
                                {t.requiredInfo}
                            </h3>
                            
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    {t.title} *
                                </label>
                                <Input
                                    {...register('title', { 
                                        required: t.titleRequired,
                                        minLength: { value: 3, message: t.titleMinLength }
                                    })}
                                    placeholder={t.titlePlaceholder}
                                    error={errors.title?.message}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    {t.description} *
                                </label>
                                <textarea
                                    {...register('description', { 
                                        required: t.descriptionRequired,
                                        minLength: { value: 10, message: t.descriptionMinLength }
                                    })}
                                    placeholder={t.descriptionPlaceholder}
                                    rows={4}
                                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/50 min-h-[100px] border-primary-gold/30 bg-background-secondary text-text-primary hover:border-primary-gold/50 focus:border-primary-gold placeholder:text-text-secondary resize-vertical ${
                                        errors.description ? 'border-primary-red focus:ring-primary-red/50 focus:border-primary-red' : ''
                                    }`}
                                />
                                {errors.description && (
                                    <p className="text-sm text-primary-red mt-1">{errors.description.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Opsiyonel Alanlar */}
                        <div className="space-y-4">

                            {/* Type, Priority, Status - Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                        {t.type}
                                    </label>
                                    <Select
                                        {...register('type')}
                                        options={ticketTypes}
                                        error={errors.type?.message}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                        {t.priority}
                                    </label>
                                    <Select
                                        value={watchedPriority}
                                        onValueChange={(value) => {
                                            setValue('priority', value, { shouldValidate: true });
                                        }}
                                        options={priorities}
                                        error={errors.priority?.message}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                        {t.status}
                                    </label>
                                    <Select
                                        {...register('status')}
                                        options={statuses}
                                        error={errors.status?.message}
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    {t.category}
                                </label>
                                <Select
                                    {...register('category')}
                                    options={categories}
                                    error={errors.category?.message}
                                />
                            </div>

                            {/* Property Selection - Expanded with search and dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
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
                                                        
                                                        const list = res?.data || [];
                                                        const mapped: PropertyOption[] = list.map((property: any) => ({
                                                            id: property.id,
                                                            value: property.id,
                                                            label: `${property.propertyNumber} - ${property.name}`,
                                                            propertyNumber: property.propertyNumber,
                                                            area: property.area || 0,
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
                                <input type="hidden" {...register('propertyId')} />
                                {errors.propertyId && (
                                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.propertyId.message}
                                    </p>
                                )}
                            </div>

                            {/* Assignee */}
                            {defaultAssigneeId && defaultAssigneeName ? (
                                <div>
                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                        {t.assignee}
                                    </label>
                                    <div className="p-3 bg-primary-gold-light/20 border border-primary-gold/30 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-primary-gold/20 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-primary-gold">
                                                    {defaultAssigneeName.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <span className="font-medium text-text-on-light dark:text-text-on-dark">
                                                {defaultAssigneeName}
                                            </span>
                                        </div>
                                    </div>
                                    <input type="hidden" {...register('assigneeId')} value={defaultAssigneeId} />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                        {t.assignee}
                                    </label>
                                    <Select
                                        {...register('assigneeId')}
                                        options={[{ value: '', label: loadingUsers ? t.loading : t.select }, ...users]}
                                        disabled={loadingUsers}
                                        error={errors.assigneeId?.message}
                                    />
                                </div>
                            )}

                            {/* Initial Comment */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    {t.initialComment}
                                </label>
                                <textarea
                                    {...register('initialComment')}
                                    placeholder={t.initialCommentPlaceholder}
                                    rows={3}
                                    className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/50 min-h-[75px] border-primary-gold/30 bg-background-secondary text-text-primary hover:border-primary-gold/50 focus:border-primary-gold placeholder:text-text-secondary resize-vertical ${
                                        errors.initialComment ? 'border-primary-red focus:ring-primary-red/50 focus:border-primary-red' : ''
                                    }`}
                                />
                                {errors.initialComment && (
                                    <p className="text-sm text-primary-red mt-1">{errors.initialComment.message}</p>
                                )}
                            </div>

                            {/* Internal Comment Checkbox */}
                            <div>
                                <Checkbox
                                    {...register('isInternalComment')}
                                    label={t.internalComment}
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    {t.attachments}
                                </label>
                                <FileUpload
                                    onFilesChange={handleFilesChange}
                                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                                    multiple
                                    maxSize={10 * 1024 * 1024} // 10MB
                                />
                                
                                {/* Selected Files Display */}
                                {selectedFiles.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                                            {t.selectedFiles}
                                        </p>
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                                <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    {t.remove}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Form Actions */}
                <div className="flex-shrink-0 flex items-center justify-end space-x-3 pt-4 border-t border-primary-gold/20 bg-background-light-card dark:bg-background-card">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        {t.cancel}
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={isLoading || !watch('title') || !watch('description')}
                        icon={Plus}
                    >
                        {isLoading ? t.creating : t.create}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}