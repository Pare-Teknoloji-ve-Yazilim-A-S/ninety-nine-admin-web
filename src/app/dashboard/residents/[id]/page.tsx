'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useResidentData } from '@/hooks/useResidentData';
import { ResidentsApiService } from '../services/residents-api.service';
import {
    ArrowLeft,
    Edit,
    Phone,
    MessageSquare,
    Building,
    User,
    Home,
    Calendar,
    CreditCard,
    QrCode,
    FileText,
    Settings,
    AlertCircle,
    CheckCircle,
    Clock,
    MapPin,
    Mail,
    IdCard,
    Plus,
    ChevronRight,
    Wrench,
    ExternalLink,
    Trash2,
    Upload,
    Tag
} from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';
import DocumentUploadModal from '@/app/components/ui/DocumentUploadModal';
import ApprovalModal, { ApprovalFormData } from '@/app/components/ui/ApprovalModal';
import EditModal, { EditFormData } from '@/app/components/ui/EditModal';
import { useResidentDocuments } from '@/hooks/useResidentDocuments';
import { useResidentTickets } from '@/hooks/useResidentTickets';
import { useToast } from '@/hooks/useToast';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { CREATE_TICKET_PERMISSION_ID, CREATE_TICKET_PERMISSION_NAME } from '@/app/components/ui/Sidebar';
import RequestDetailModal from '../../requests/RequestDetailModal';
import CreateTicketModal from '../../components/CreateTicketModal';
import { ToastContainer } from '@/app/components/ui/Toast';
import { Ticket } from '@/services/ticket.service';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { CreateFamilyMemberDto, FamilyMember } from '@/services/types/family-member.types';
import { useMyProperties } from '@/hooks/useMyProperties';
import { adminResidentService } from '@/services/admin-resident.service';
import qrCodeService, { GuestQrCode } from '@/services/qr-code.service';
import { useRouter } from 'next/navigation';
import { familyMemberService } from '@/services/family-member.service';

// Dil çevirileri
const translations = {
  tr: {
    // Page titles and headers
    pageTitle: 'Sakin Detayı',
    residentDetail: 'Sakin Detayı',
    loading: 'Yükleniyor...',
    error: 'Hata',
    residentNotFound: 'Sakin bulunamadı',
    backToResidents: 'Sakin Listesine Dön',
    
    // Breadcrumb
    home: 'Ana Sayfa',
    residents: 'Sakinler',
    
    // Page header
    back: 'Geri Dön',
    call: 'Ara',
    message: 'Mesaj',
    remove: 'Kaldır',
    edit: 'Düzenle',
    residentId: 'Sakin ID:',
    
    // Profile section
    membershipLevel: 'Üyelik Seviyesi',
    registrationDate: 'Kayıt Tarihi',
    approve: 'Onayla',
    documentsRequired: 'Belgelerin yüklenmesi gerek',
    
    // Tabs
    familyMembers: 'Aile Üyeleri',
    documents: 'Belgeler',
    requests: 'Talepler',
    activity: 'Aktivite',
    addFamilyMember: 'Aile Üyesi Ekle',
    
    // Family members section
    familyMembersTitle: 'Aile Üyeleri',
    familyMembersLoading: 'Aile üyeleri yüklenemedi',
    noFamilyMembers: 'Henüz aile üyesi eklenmemiş',
    noFamilyMembersDesc: 'Bu sakin için aile üyesi bilgilerini ekleyebilirsiniz.',
    tryAgain: 'Tekrar Dene',
    photo: 'Foto',
    name: 'Ad Soyad',
    relationship: 'İlişki',
    age: 'Yaş',
    phone: 'Telefon',
    actionColumn: 'İşlem',
    minor: 'Reşit Değil',
    
    // Documents section
    documentsTitle: 'Belgeler',
    identityDocument: 'Kimlik Belgesi',
    ownershipDocument: 'Tapu / Mülkiyet Belgesi',
    loaded: 'Yüklü',
    missing: 'Eksik',
    upload: 'Yükle',
    view: 'Görüntüle',
    preview: 'Önizleme',
    
    // Requests section
    requestsTitle: 'Talep Listesi',
    newRequest: 'Yeni Talep',
    requestsLoading: 'Talepler yüklenemedi',
    noRequests: 'Henüz talep bulunmuyor',
    noRequestsDesc: 'Bu sakin için henüz bir hizmet talebi oluşturulmamış.',
    open: 'Açık',
    inProgress: 'İşlemde',
    resolved: 'Çözüldü',
    closed: 'Kapatıldı',
    propertyNotSpecified: 'Konut Belirtilmemiş',
    faultRepair: 'Arıza/Tamir',
    complaint: 'Şikayet',
    request: 'Talep',
    maintenance: 'Bakım',
    
    // Activity section
    activityTitle: 'QR Kod Aktivite Günlüğü',
    activityLoading: 'Yükleniyor...',
    noActivity: 'Henüz QR kod aktivitesi yok.',
    date: 'Tarih',
    action: 'Aksiyon',
    type: 'Tip',
    qrCodeId: 'QR Kod ID',
    
    // Property information
    propertyInfo: 'Konut Bilgileri',
    propertyName: 'Konut Adı',
    debt: 'Borç',
    propertyInfoNotFound: 'Konut bilgisi bulunamadı.',
    
    // Contact information
    contactInfo: 'İletişim Bilgileri',
    mobilePhone: 'Cep Telefonu',
    email: 'E-posta',
    lastActivity: 'Son Aktivite',
    unspecified: 'Belirtilmemiş',
    
    // Notes
    notes: 'Notlar',
    
    // Modals
    addFamilyMemberTitle: 'Aile Üyesi Ekle',
    cancel: 'İptal',
    adding: 'Ekleniyor...',
    
    // Form fields
    nationalIdPassport: 'Ulusal kimlik numarası / Pasaport numarası',
    nationalIdPassportPlaceholder: '12345678901 veya AA1234567',
    firstName: 'Ad',
    firstNamePlaceholder: 'Ayşe',
    lastName: 'Soyad',
    lastNamePlaceholder: 'Yılmaz',
    relationshipDegree: 'Yakınlık derecesi',
    select: 'Seçiniz',
    spouse: 'Eş',
    child: 'Çocuk',
    mother: 'Anne',
    father: 'Baba',
    sibling: 'Kardeş',
    parent: 'Ebeveyn',
    grandparent: 'Büyükbaba/Büyükanne',
    grandchild: 'Torun',
    uncleAunt: 'Amca/Teyze/Dayı/Hala',
    nephewNiece: 'Yeğen',
    cousin: 'Kuzen',
    other: 'Diğer',
    phonePlaceholder: '0555 123 4567',
    additionalInfo: 'Ek Bilgiler (Opsiyonel)',
    gender: 'Cinsiyet',
    male: 'Erkek',
    female: 'Kadın',
    birthDate: 'Doğum Tarihi',
    birthPlace: 'Doğum Yeri',
    birthPlacePlaceholder: 'İstanbul, Türkiye',
    bloodType: 'Kan Grubu',
    
    // Upload popup
    selectFile: 'Dosya seçin',
    orDrag: 'veya sürükleyin',
    fileTypes: 'JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, TXT • Max 10MB',
    uploadSuccess: 'yüklendi',
    uploadFailed: 'Yükleme başarısız',
    
    // Toast messages
    userInfoUpdated: 'Kullanıcı bilgileri başarıyla güncellendi!',
    updateFailed: 'Güncelleme işlemi başarısız oldu. Lütfen tekrar deneyin.',
    userApproved: 'Kullanıcı başarıyla onaylandı!',
    userRejected: 'Kullanıcı başarıyla reddedildi!',
    approvalFailed: 'Onaylama işlemi başarısız oldu. Lütfen tekrar deneyin.',
    familyMemberAdded: 'Aile üyesi başarıyla eklendi!',
    familyMemberError: 'Aile üyesi eklenirken bir hata oluştu.',
    fillRequiredFields: 'Lütfen tüm zorunlu alanları doldurun.',
    requestCreated: 'Talep başarıyla oluşturuldu!',
    userDeleted: 'Kullanıcı başarıyla silindi!',
    deleteError: 'Kullanıcı silinirken bir hata oluştu.',
    deleteConfirm: 'Bu kullanıcıyı silmek istediğinize emin misiniz?',
    propertyInfoError: 'Konut bilgisi yüklenemedi',
    qrCodesError: 'QR kodlar yüklenemedi',
    logsError: 'Loglar yüklenemedi'
  },
  en: {
    // Page titles and headers
    pageTitle: 'Resident Detail',
    residentDetail: 'Resident Detail',
    loading: 'Loading...',
    error: 'Error',
    residentNotFound: 'Resident not found',
    backToResidents: 'Back to Residents',
    
    // Breadcrumb
    home: 'Home',
    residents: 'Residents',
    
    // Page header
    back: 'Back',
    call: 'Call',
    message: 'Message',
    remove: 'Remove',
    edit: 'Edit',
    residentId: 'Resident ID:',
    
    // Profile section
    membershipLevel: 'Membership Level',
    registrationDate: 'Registration Date',
    approve: 'Approve',
    documentsRequired: 'Documents need to be uploaded',
    
    // Tabs
    familyMembers: 'Family Members',
    documents: 'Documents',
    requests: 'Requests',
    activity: 'Activity',
    addFamilyMember: 'Add Family Member',
    
    // Family members section
    familyMembersTitle: 'Family Members',
    familyMembersLoading: 'Failed to load family members',
    noFamilyMembers: 'No family members added yet',
    noFamilyMembersDesc: 'You can add family member information for this resident.',
    tryAgain: 'Try Again',
    photo: 'Photo',
    name: 'Name',
    relationship: 'Relationship',
    age: 'Age',
    phone: 'Phone',
    actionColumn: 'Action',
    minor: 'Minor',
    
    // Documents section
    documentsTitle: 'Documents',
    identityDocument: 'Identity Document',
    ownershipDocument: 'Deed / Ownership Document',
    loaded: 'Loaded',
    missing: 'Missing',
    upload: 'Upload',
    view: 'View',
    preview: 'Preview',
    
    // Requests section
    requestsTitle: 'Request List',
    newRequest: 'New Request',
    requestsLoading: 'Failed to load requests',
    noRequests: 'No requests yet',
    noRequestsDesc: 'No service request has been created for this resident yet.',
    open: 'Open',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    propertyNotSpecified: 'Property Not Specified',
    faultRepair: 'Fault/Repair',
    complaint: 'Complaint',
    request: 'Request',
    maintenance: 'Maintenance',
    
    // Activity section
    activityTitle: 'QR Code Activity Log',
    activityLoading: 'Loading...',
    noActivity: 'No QR code activity yet.',
    date: 'Date',
    action: 'Action',
    type: 'Type',
    qrCodeId: 'QR Code ID',
    
    // Property information
    propertyInfo: 'Property Information',
    propertyName: 'Property Name',
    debt: 'Debt',
    propertyInfoNotFound: 'Property information not found.',
    
    // Contact information
    contactInfo: 'Contact Information',
    mobilePhone: 'Mobile Phone',
    email: 'Email',
    lastActivity: 'Last Activity',
    unspecified: 'Unspecified',
    
    // Notes
    notes: 'Notes',
    
    // Modals
    addFamilyMemberTitle: 'Add Family Member',
    cancel: 'Cancel',
    adding: 'Adding...',
    
    // Form fields
    nationalIdPassport: 'National ID / Passport Number',
    nationalIdPassportPlaceholder: '12345678901 or AA1234567',
    firstName: 'First Name',
    firstNamePlaceholder: 'John',
    lastName: 'Last Name',
    lastNamePlaceholder: 'Doe',
    relationshipDegree: 'Relationship Degree',
    select: 'Select',
    spouse: 'Spouse',
    child: 'Child',
    mother: 'Mother',
    father: 'Father',
    sibling: 'Sibling',
    parent: 'Parent',
    grandparent: 'Grandparent',
    grandchild: 'Grandchild',
    uncleAunt: 'Uncle/Aunt',
    nephewNiece: 'Nephew/Niece',
    cousin: 'Cousin',
    other: 'Other',
    phonePlaceholder: '0555 123 4567',
    additionalInfo: 'Additional Information (Optional)',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    birthDate: 'Birth Date',
    birthPlace: 'Birth Place',
    birthPlacePlaceholder: 'Istanbul, Turkey',
    bloodType: 'Blood Type',
    
    // Upload popup
    selectFile: 'Select file',
    orDrag: 'or drag',
    fileTypes: 'JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, TXT • Max 10MB',
    uploadSuccess: 'uploaded',
    uploadFailed: 'Upload failed',
    
    // Toast messages
    userInfoUpdated: 'User information updated successfully!',
    updateFailed: 'Update failed. Please try again.',
    userApproved: 'User approved successfully!',
    userRejected: 'User rejected successfully!',
    approvalFailed: 'Approval failed. Please try again.',
    familyMemberAdded: 'Family member added successfully!',
    familyMemberError: 'An error occurred while adding family member.',
    fillRequiredFields: 'Please fill in all required fields.',
    requestCreated: 'Request created successfully!',
    userDeleted: 'User deleted successfully!',
    deleteError: 'An error occurred while deleting user.',
    deleteConfirm: 'Are you sure you want to delete this user?',
    propertyInfoError: 'Failed to load property information',
    qrCodesError: 'Failed to load QR codes',
    logsError: 'Failed to load logs'
  },
  ar: {
    // Page titles and headers
    pageTitle: 'تفاصيل الساكن',
    residentDetail: 'تفاصيل الساكن',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    residentNotFound: 'الساكن غير موجود',
    backToResidents: 'العودة إلى السكان',
    
    // Breadcrumb
    home: 'الرئيسية',
    residents: 'السكان',
    
    // Page header
    back: 'رجوع',
    call: 'اتصال',
    message: 'رسالة',
    remove: 'إزالة',
    edit: 'تعديل',
    residentId: 'معرف الساكن:',
    
    // Profile section
    membershipLevel: 'مستوى العضوية',
    registrationDate: 'تاريخ التسجيل',
    approve: 'موافقة',
    documentsRequired: 'يجب رفع المستندات',
    
    // Tabs
    familyMembers: 'أفراد العائلة',
    documents: 'المستندات',
    requests: 'الطلبات',
    activity: 'النشاط',
    addFamilyMember: 'إضافة فرد عائلة',
    
    // Family members section
    familyMembersTitle: 'أفراد العائلة',
    familyMembersLoading: 'فشل في تحميل أفراد العائلة',
    noFamilyMembers: 'لم يتم إضافة أفراد عائلة بعد',
    noFamilyMembersDesc: 'يمكنك إضافة معلومات أفراد العائلة لهذا الساكن.',
    tryAgain: 'حاول مرة أخرى',
    photo: 'صورة',
    name: 'الاسم',
    relationship: 'العلاقة',
    age: 'العمر',
    phone: 'الهاتف',
    actionColumn: 'الإجراء',
    minor: 'قاصر',
    
    // Documents section
    documentsTitle: 'المستندات',
    identityDocument: 'وثيقة الهوية',
    ownershipDocument: 'سند الملكية / وثيقة الملكية',
    loaded: 'محمّل',
    missing: 'مفقود',
    upload: 'رفع',
    view: 'عرض',
    preview: 'معاينة',
    
    // Requests section
    requestsTitle: 'قائمة الطلبات',
    newRequest: 'طلب جديد',
    requestsLoading: 'فشل في تحميل الطلبات',
    noRequests: 'لا توجد طلبات بعد',
    noRequestsDesc: 'لم يتم إنشاء طلب خدمة لهذا الساكن بعد.',
    open: 'مفتوح',
    inProgress: 'قيد التنفيذ',
    resolved: 'تم الحل',
    closed: 'مغلق',
    propertyNotSpecified: 'العقار غير محدد',
    faultRepair: 'عطل/إصلاح',
    complaint: 'شكوى',
    request: 'طلب',
    maintenance: 'صيانة',
    
    // Activity section
    activityTitle: 'سجل نشاط رمز QR',
    activityLoading: 'جاري التحميل...',
    noActivity: 'لا يوجد نشاط رمز QR بعد.',
    date: 'التاريخ',
    action: 'الإجراء',
    type: 'النوع',
    qrCodeId: 'معرف رمز QR',
    
    // Property information
    propertyInfo: 'معلومات العقار',
    propertyName: 'اسم العقار',
    debt: 'الدين',
    propertyInfoNotFound: 'معلومات العقار غير موجودة.',
    
    // Contact information
    contactInfo: 'معلومات الاتصال',
    mobilePhone: 'الهاتف المحمول',
    email: 'البريد الإلكتروني',
    lastActivity: 'آخر نشاط',
    unspecified: 'غير محدد',
    
    // Notes
    notes: 'ملاحظات',
    
    // Modals
    addFamilyMemberTitle: 'إضافة فرد عائلة',
    cancel: 'إلغاء',
    adding: 'جاري الإضافة...',
    
    // Form fields
    nationalIdPassport: 'رقم الهوية الوطنية / رقم جواز السفر',
    nationalIdPassportPlaceholder: '12345678901 أو AA1234567',
    firstName: 'الاسم الأول',
    firstNamePlaceholder: 'أحمد',
    lastName: 'اسم العائلة',
    lastNamePlaceholder: 'محمد',
    relationshipDegree: 'درجة القرابة',
    select: 'اختر',
    spouse: 'الزوج/الزوجة',
    child: 'الطفل',
    mother: 'الأم',
    father: 'الأب',
    sibling: 'الأخ/الأخت',
    parent: 'الوالد',
    grandparent: 'الجد/الجدة',
    grandchild: 'الحفيد/الحفيدة',
    uncleAunt: 'العم/العمة/الخال/الخالة',
    nephewNiece: 'ابن الأخ/ابنة الأخ',
    cousin: 'ابن العم/ابنة العم',
    other: 'آخر',
    phonePlaceholder: '0555 123 4567',
    additionalInfo: 'معلومات إضافية (اختياري)',
    gender: 'الجنس',
    male: 'ذكر',
    female: 'أنثى',
    birthDate: 'تاريخ الميلاد',
    birthPlace: 'مكان الميلاد',
    birthPlacePlaceholder: 'إسطنبول، تركيا',
    bloodType: 'فصيلة الدم',
    
    // Upload popup
    selectFile: 'اختر الملف',
    orDrag: 'أو اسحب',
    fileTypes: 'JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, TXT • الحد الأقصى 10 ميجابايت',
    uploadSuccess: 'تم الرفع',
    uploadFailed: 'فشل الرفع',
    
    // Toast messages
    userInfoUpdated: 'تم تحديث معلومات المستخدم بنجاح!',
    updateFailed: 'فشل التحديث. يرجى المحاولة مرة أخرى.',
    userApproved: 'تمت الموافقة على المستخدم بنجاح!',
    userRejected: 'تم رفض المستخدم بنجاح!',
    approvalFailed: 'فشلت الموافقة. يرجى المحاولة مرة أخرى.',
    familyMemberAdded: 'تم إضافة فرد العائلة بنجاح!',
    familyMemberError: 'حدث خطأ أثناء إضافة فرد العائلة.',
    fillRequiredFields: 'يرجى ملء جميع الحقول المطلوبة.',
    requestCreated: 'تم إنشاء الطلب بنجاح!',
    userDeleted: 'تم حذف المستخدم بنجاح!',
    deleteError: 'حدث خطأ أثناء حذف المستخدم.',
    deleteConfirm: 'هل أنت متأكد من أنك تريد حذف هذا المستخدم؟',
    propertyInfoError: 'فشل في تحميل معلومات العقار',
    qrCodesError: 'فشل في تحميل رموز QR',
    logsError: 'فشل في تحميل السجلات'
  }
};

export default function ResidentViewPage() {
    const params = useParams();
    const residentId = params.id as string;
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    // Create Ticket izin kontrolü
    const { hasPermission } = usePermissionCheck();
    const hasCreateTicketPermission = hasPermission(CREATE_TICKET_PERMISSION_ID);

    // Helper fonksiyonlar - backend'den gelen değerleri çevirmek için
    const getTranslatedMembershipTier = (tier: string) => {
        console.log('Membership Tier:', tier, 'Current Language:', currentLanguage);
        switch (tier) {
            case 'STANDARD':
                return currentLanguage === 'tr' ? 'Standart Üye' : 
                       currentLanguage === 'en' ? 'Standard Member' : 'عضو قياسي';
            case 'GOLD':
                return currentLanguage === 'tr' ? 'Gold Üye' : 
                       currentLanguage === 'en' ? 'Gold Member' : 'عضو ذهبي';
            case 'SILVER':
                return currentLanguage === 'tr' ? 'Silver Üye' : 
                       currentLanguage === 'en' ? 'Silver Member' : 'عضو فضي';
            case 'Standart Üye':
                return currentLanguage === 'tr' ? 'Standart Üye' : 
                       currentLanguage === 'en' ? 'Standard Member' : 'عضو قياسي';
            case 'Gold Üye':
                return currentLanguage === 'tr' ? 'Gold Üye' : 
                       currentLanguage === 'en' ? 'Gold Member' : 'عضو ذهبي';
            case 'Silver Üye':
                return currentLanguage === 'tr' ? 'Silver Üye' : 
                       currentLanguage === 'en' ? 'Silver Member' : 'عضو فضي';
            default:
                return tier;
        }
    };

    const getTranslatedStatus = (status: any) => {
        if (!status || !status.label) return status;
        
        const label = status.label;
        console.log('Status Label:', label, 'Current Language:', currentLanguage);
        switch (label) {
            case 'Aktif':
                return currentLanguage === 'tr' ? 'Aktif' : 
                       currentLanguage === 'en' ? 'Active' : 'نشط';
            case 'Pasif':
                return currentLanguage === 'tr' ? 'Pasif' : 
                       currentLanguage === 'en' ? 'Inactive' : 'غير نشط';
            case 'Beklemede':
                return currentLanguage === 'tr' ? 'Beklemede' : 
                       currentLanguage === 'en' ? 'Pending' : 'في الانتظار';
            case 'Askıya Alınmış':
                return currentLanguage === 'tr' ? 'Askıya Alınmış' : 
                       currentLanguage === 'en' ? 'Suspended' : 'معلق';
            case 'İnceleniyor':
                return currentLanguage === 'tr' ? 'İnceleniyor' : 
                       currentLanguage === 'en' ? 'Under Review' : 'قيد المراجعة';
            case 'Onaylandı':
                return currentLanguage === 'tr' ? 'Onaylandı' : 
                       currentLanguage === 'en' ? 'Approved' : 'تمت الموافقة';
            case 'Reddedildi':
                return currentLanguage === 'tr' ? 'Reddedildi' : 
                       currentLanguage === 'en' ? 'Rejected' : 'مرفوض';
            default:
                return label;
        }
    };

    const getTranslatedResidentType = (residentType: any) => {
        if (!residentType || !residentType.label) return residentType;
        
        const label = residentType.label;
        console.log('Resident Type Label:', label, 'Current Language:', currentLanguage);
        switch (label) {
            case 'Malik':
                return currentLanguage === 'tr' ? 'Malik' : 
                       currentLanguage === 'en' ? 'Owner' : 'مالك';
            case 'Kiracı':
                return currentLanguage === 'tr' ? 'Kiracı' : 
                       currentLanguage === 'en' ? 'Tenant' : 'مستأجر';
            default:
                return label;
        }
    };
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
    const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [uploadDocumentType, setUploadDocumentType] = useState<'national_id' | 'ownership_document' | null>(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0, arrowLeft: 0 });
    const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
    const [showTicketDetailModal, setShowTicketDetailModal] = useState(false);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [approvalLoading, setApprovalLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [activeTab, setActiveTab] = useState<'family' | 'properties' | 'documents' | 'requests' | 'activity' | 'guestqrcodes'>('family');

    const [guestQRCodes, setGuestQRCodes] = useState<GuestQrCode[]>([]);
    const [qrLoading, setQrLoading] = useState(false);
    const [qrError, setQrError] = useState<string | null>(null);

    // QRCode Audit Logs State
    const [qrAuditLogs, setQrAuditLogs] = useState<any[]>([]);
    const [qrAuditLoading, setQrAuditLoading] = useState(false);
    const [qrAuditError, setQrAuditError] = useState<string | null>(null);

    // Toast system
    const toast = useToast();

    // Family member form data
    const [familyFormData, setFamilyFormData] = useState({
        firstName: '',
        lastName: '',
        relationship: '',
        age: '',
        phone: '',
        identityNumber: '',
        gender: '',
        birthDate: '',
        birthPlace: '',
        bloodType: ''
    });

    // Use document management hook
    const {
        nationalIdDoc,
        ownershipDoc,
        uploadStates,
        uploadNationalIdDocument,
        uploadOwnershipDocument,
        refreshDocuments
    } = useResidentDocuments({
        residentId,
        autoFetch: true
    });

    // Use resident tickets hook
    const {
        tickets: residentTickets,
        loading: ticketsLoading,
        error: ticketsError,
        refreshTickets
    } = useResidentTickets({
        residentId,
        autoFetch: true
    });

    const { resident, loading, error, refreshData } = useResidentData({
        residentId,
        autoFetch: true
    });

    // Use family members hook
    const {
        familyMembers,
        loading: familyMembersLoading,
        error: familyMembersError,
        saving: familyMembersSaving,
        saveError: familyMembersSaveError,
        createFamilyMember,
        refreshData: refreshFamilyMembers,
        clearSaveError: clearFamilyMembersSaveError
    } = useFamilyMembers({
        userId: residentId,
        autoFetch: true
    });

    // Use properties hook
    const {
        properties,
        loading: propertiesLoading,
        error: propertiesError,
        refreshData: refreshProperties
    } = useMyProperties({
        ownerId: residentId,
        autoFetch: true
    });

    // Property info state for sidebar
    const [propertyInfo, setPropertyInfo] = useState<any>(null);
    const [propertyLoading, setPropertyLoading] = useState(false);
    const [propertyError, setPropertyError] = useState<string | null>(null);

    // Add state for total debt
    const [totalDebt, setTotalDebt] = useState<number | null>(null);
    const [debtLoading, setDebtLoading] = useState(false);
    const [debtError, setDebtError] = useState<string | null>(null);

    useEffect(() => {
        if (residentId) {
            setPropertyLoading(true);
            setPropertyError(null);
            fetch(`/api/proxy/admin/properties/by-user/${residentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error(t.propertyInfoError);
                    const data = await res.json();
                    setPropertyInfo(data?.data || null);
                })
                .catch(() => setPropertyError(t.propertyInfoError))
                .finally(() => setPropertyLoading(false));
        }
    }, [residentId]);

    // Update debt fetch to use propertyInfo.id
    useEffect(() => {
        if (propertyInfo?.id) {
            setDebtLoading(true);
            setDebtError(null);
            fetch(`/api/proxy/admin/billing/total-debt/${propertyInfo.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setTotalDebt(0);
                        return;
                    }
                    const data = await res.json();
                    setTotalDebt(typeof data?.data === 'number' ? data.data : 0);
                })
                .catch(() => setTotalDebt(0))
                .finally(() => setDebtLoading(false));
        }
    }, [propertyInfo?.id]);

    const router = useRouter();

    useEffect(() => {
        if (activeTab === 'guestqrcodes' && residentId) {
            setQrLoading(true);
            setQrError(null);
            qrCodeService.getGuestQRCodesByUser(residentId)
                .then(setGuestQRCodes)
                .catch(() => setQrError(t.qrCodesError))
                .finally(() => setQrLoading(false));
        }
    }, [activeTab, residentId]);

    useEffect(() => {
        if (activeTab === 'activity' && residentId) {
            setQrAuditLoading(true);
            setQrAuditError(null);
            fetch(`/api/proxy/admin/logging/audit-logs/user/${residentId}/qrcode?limit=10&page=1`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error(t.logsError);
                    const data = await res.json();
                    setQrAuditLogs(data?.data?.data || []);
                })
                .catch(() => setQrAuditError(t.logsError))
                .finally(() => setQrAuditLoading(false));
        }
    }, [activeTab, residentId]);

    // Refresh resident data when edit modal closes
    const prevShowEditModal = React.useRef(showEditModal);
    useEffect(() => {
        if (prevShowEditModal.current && !showEditModal) {
            refreshData();
        }
        prevShowEditModal.current = showEditModal;
    }, [showEditModal]);

    // Breadcrumb for resident view page
    const breadcrumbItems = [
        { label: t.home, href: '/dashboard' },
        { label: t.residents, href: '/dashboard/residents' },
        { label: resident?.fullName || t.residentDetail, active: true }
    ];

    // Yeni: Status ikonunu type'a göre göster
    const getStatusIcon = (type: string) => {
        switch (type) {
            case 'active':
                return <CheckCircle className="h-4 w-4 text-semantic-success-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-semantic-warning-500" />;
            case 'inactive':
            case 'suspended':
                return null; // Remove icon for inactive/pasif status
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    // Yeni: Status badge rengini color'a göre göster
    const getStatusColor = (color: string) => {
        switch (color) {
            case 'green':
                return 'primary';
            case 'yellow':
                return 'secondary';
            case 'red':
                return 'red';
            default:
                return 'secondary';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'owner':
                return 'primary';
            case 'tenant':
                return 'primary';
            default:
                return 'secondary';
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getFamilyMemberInitials = (member: FamilyMember) => {
        return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
    };

    // Handle edit submission
    const handleEditSubmit = async (data: EditFormData) => {
        try {
            setEditLoading(true);
            // TODO: API call to update resident data
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
            toast.success(t.userInfoUpdated);
            await refreshData(); // Refresh resident data after update
        } catch (error: any) {
            console.error('Edit failed:', error);
            toast.error(
                error?.response?.data?.message ||
                t.updateFailed
            );
        } finally {
            setEditLoading(false);
        }
    };

    // Handle approval submission
    const handleApprovalSubmit = async (data: ApprovalFormData) => {
        try {
            setApprovalLoading(true);

            const approvalData = {
                decision: data.decision,
                reason: data.reason,
                assignedRole: data.assignedRole,
                initialMembershipTier: data.initialMembershipTier
            };

            await adminResidentService.approveResident(residentId, approvalData);

            toast.success(
                data.decision === 'approved'
                    ? t.userApproved
                    : t.userRejected
            );

            // Refresh resident data to update verification status
            await refreshData();

        } catch (error: any) {
            console.error('Approval failed:', error);
            toast.error(
                error?.response?.data?.message ||
                t.approvalFailed
            );
        } finally {
            setApprovalLoading(false);
        }
    };

    // Handle add family member
    const handleAddFamilyMember = async () => {
        // Debug form data
        console.log('Family Form Data:', familyFormData);
        
        if (
            familyFormData.firstName &&
            familyFormData.lastName &&
            familyFormData.relationship &&
            familyFormData.phone &&
            familyFormData.identityNumber &&
            familyFormData.gender &&
            familyFormData.birthDate &&
            familyFormData.birthPlace &&
            familyFormData.bloodType
        ) {
            try {
                const newMemberData = {
                    identityOrPassportNumber: familyFormData.identityNumber,
                    firstName: familyFormData.firstName,
                    lastName: familyFormData.lastName,
                    relationship: familyFormData.relationship, // Artık doğrudan backend değerleri kullanıyoruz
                    phone: familyFormData.phone,
                    gender: familyFormData.gender as 'MALE' | 'FEMALE' | 'OTHER', // Type assertion for strict enum
                    birthDate: familyFormData.birthDate,
                    birthPlace: familyFormData.birthPlace,
                    bloodType: familyFormData.bloodType,
                    notes: '' // opsiyonel, ekleyebilirsin
                };
                
                // Debug API payload
                console.log('API Payload:', newMemberData);
                
                await familyMemberService.createFamilyMemberAdmin(residentId, newMemberData);
                // Clear form data
                setFamilyFormData({
                    firstName: '',
                    lastName: '',
                    relationship: '',
                    age: '',
                    phone: '',
                    identityNumber: '',
                    gender: '',
                    birthDate: '',
                    birthPlace: '',
                    bloodType: ''
                });
                setShowAddFamilyModal(false);
                toast.success(t.familyMemberAdded);
            } catch (error: any) {
                console.error('Family member creation error:', error);
                toast.error(error?.response?.data?.message || t.familyMemberError);
            }
        } else {
            console.log('Validation failed. Missing fields:', {
                firstName: !familyFormData.firstName,
                lastName: !familyFormData.lastName,
                relationship: !familyFormData.relationship,
                phone: !familyFormData.phone,
                identityNumber: !familyFormData.identityNumber,
                gender: !familyFormData.gender,
                birthDate: !familyFormData.birthDate,
                birthPlace: !familyFormData.birthPlace,
                bloodType: !familyFormData.bloodType
            });
            toast.error(t.fillRequiredFields);
        }
    };

    // Handle ticket detail view
    const handleViewTicketDetail = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setShowTicketDetailModal(true);
    };

    // Handle create ticket modal
    const handleCreateTicket = () => {
        setShowCreateTicketModal(true);
    };

    // Handle ticket creation success
    const handleTicketCreated = () => {
        setShowCreateTicketModal(false);
        refreshTickets(); // Refresh the tickets list
        toast.success(t.requestCreated);
    };

    // Delete resident handler
    const handleDeleteResident = async () => {
        if (!residentId) return;
        if (!window.confirm(t.deleteConfirm)) return;
        try {
            await adminResidentService.deleteResident(residentId);
            toast.success(t.userDeleted);
            router.push('/dashboard/residents');
        } catch (error) {
            toast.error(t.deleteError);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader title={t.pageTitle} breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="space-y-6">
                                    <div className="h-64 bg-gray-200 rounded"></div>
                                    <div className="h-48 bg-gray-200 rounded"></div>
                                    <div className="h-32 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-background-primary">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className="lg:ml-72">
                        <DashboardHeader title={t.error} breadcrumbItems={breadcrumbItems} />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <Card className="text-center">
                                <div className="p-8">
                                    <AlertCircle className="h-12 w-12 text-primary-red mx-auto mb-4" />
                                    <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                                        {t.residentNotFound}
                                    </h2>
                                    <p className="text-text-light-secondary dark:text-text-secondary mb-6">
                                        {error}
                                    </p>
                                    <Link href="/dashboard/residents">
                                        <Button variant="primary">
                                            {t.backToResidents}
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

    if (!resident) {
        return null;
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
                    {/* Header */}
                    <DashboardHeader
                        title={resident?.fullName || t.residentDetail}
                        breadcrumbItems={breadcrumbItems}
                    />

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header with Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard/residents">
                                    <Button variant="ghost" icon={ArrowLeft}>
                                        {t.back}
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                                        {resident?.fullName || t.loading}
                                    </h1>
                                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                        {t.residentId} #{resident?.id || residentId}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="secondary" icon={Phone}>
                                    {t.call}
                                </Button>
                                <Button variant="secondary" icon={MessageSquare}>
                                    {t.message}
                                </Button>
                                <Link href="#" onClick={e => { e.preventDefault(); handleDeleteResident(); }}>
                                    <Button variant="danger" icon={Trash2}>
                                        {t.remove}
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Main Info */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Profile Summary */}
                                <Card>
                                    <div className="p-6">
                                        <div className="flex items-start gap-6">
                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                {resident?.profileImage ? (
                                                    <img
                                                        src={resident.profileImage}
                                                        alt={resident.fullName}
                                                        className="w-24 h-24 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-full bg-primary-gold flex items-center justify-center text-white text-xl font-bold">
                                                        {resident ? getInitials(resident.firstName, resident.lastName) : 'U'}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Basic Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
                                                            {resident?.fullName || 'Yükleniyor...'}
                                                        </h2>
                                                        {resident && (
                                                            <Badge
                                                                variant="soft"
                                                                color={getTypeColor(resident.residentType.type)}
                                                            >
                                                                {getTranslatedResidentType(resident.residentType)}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Edit Button - Same level as name */}
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                        onClick={() => setShowEditModal(true)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        {t.edit}
                                                    </Button>
                                                </div>

                                                {resident && (
                                                    <>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            {/* Hide status icon when user is pending */}
                                                            {resident.status.label !== 'Beklemede' && getStatusIcon(resident.status.type)}
                                                            {/* Hide "beklemede" text when user is pending */}
                                                            {resident.status.label !== 'Beklemede' && (
                                                                <Badge
                                                                    variant="soft"
                                                                    color={getStatusColor(resident.status.color)}
                                                                >
                                                                    {getTranslatedStatus(resident.status)}
                                                                </Badge>
                                                            )}
                                                            {resident.verificationStatus && resident.verificationStatus.color === 'yellow' && (
                                                                <div className="flex items-center gap-2">
                                                                    {(() => {
                                                                        const docsUploaded = Boolean(nationalIdDoc.url && ownershipDoc.url);
                                                                        return (
                                                                            <>
                                                                    <Button
                                                                        variant="primary"
                                                                        size="sm"
                                                                        onClick={() => setShowApprovalModal(true)}
                                                                                disabled={!docsUploaded || approvalLoading}
                                                                    >
                                                                        {t.approve}
                                                                    </Button>
                                                                            {!docsUploaded && (
                                                                                <span className="text-sm text-text-light-muted dark:text-text-muted">
                                                                                    {t.documentsRequired}
                                                                                </span>
                                                                            )}
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <p className="text-text-light-muted dark:text-text-muted">{t.membershipLevel}</p>
                                                                <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                    {getTranslatedMembershipTier(resident.membershipTier || 'STANDARD')}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-text-light-muted dark:text-text-muted">{t.registrationDate}</p>
                                                                <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                    {new Date(resident.registrationDate).toLocaleDateString('tr-TR')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Tabbed Contact/Resident Info Section */}
                                <Card className="mt-6">
                                    <div className="p-0">
                                        <div className="border-b border-gray-200 dark:border-gray-700 px-6 pt-6">
                                            <nav className="flex space-x-4" aria-label="Tabs">
                                                {[
                                                    { label: `${t.familyMembers} (${familyMembers.length})`, key: "family" },
                                                    { label: `${t.documents} (${[nationalIdDoc.url, ownershipDoc.url].filter(Boolean).length})`, key: "documents" },
                                                    { label: `${t.requests} (${residentTickets.length})`, key: "requests" },
                                                    { label: `${t.activity} (${qrAuditLogs.length})`, key: "activity" }
                                                ].map((tab, idx) => (
                                                    <button
                                                        key={tab.key}
                                                        className={
                                                            (activeTab === tab.key
                                                                ? "text-primary-gold border-primary-gold"
                                                                : "text-text-light-secondary dark:text-text-secondary border-transparent hover:text-primary-gold hover:border-primary-gold/60") +
                                                            " px-3 py-2 text-sm font-medium border-b-2 transition-colors"
                                                        }
                                                        onClick={() => setActiveTab(tab.key as 'family' | 'documents' | 'requests' | 'activity')}
                                                        type="button"
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </nav>
                                        </div>
                                        <div className="px-6 py-6">
                                            {activeTab === "family" && (
                                                <div>
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">{t.familyMembersTitle}</h4>
                                                        <Button
                                                            variant="primary"
                                                            icon={Plus}
                                                            onClick={() => setShowAddFamilyModal(true)}
                                                            disabled={familyMembersSaving}
                                                        >
                                                            {t.addFamilyMember}
                                                        </Button>
                                                    </div>

                                                    {familyMembersLoading ? (
                                                        <div className="space-y-4">
                                                            {[1, 2, 3].map((i) => (
                                                                <div key={i} className="animate-pulse">
                                                                    <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                                                        <div className="flex-1">
                                                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                                                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : familyMembersError ? (
                                                        <div className="text-center py-8">
                                                            <AlertCircle className="h-12 w-12 text-primary-red mx-auto mb-4" />
                                                            <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                                {t.familyMembersLoading}
                                                            </h3>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted mb-4">
                                                                {familyMembersError}
                                                            </p>
                                                            <Button variant="secondary" size="sm" onClick={refreshFamilyMembers}>
                                                                {t.tryAgain}
                                                            </Button>
                                                        </div>
                                                    ) : familyMembers.length > 0 ? (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead>
                                                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">{t.photo}</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">{t.name}</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">{t.relationship}</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">{t.age}</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">{t.phone}</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">{t.action}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {familyMembers.map((member) => (
                                                                        <tr key={member.id} className="border-b border-background-light-soft dark:border-background-soft hover:bg-background-light-soft dark:hover:bg-background-soft transition-colors">
                                                                            <td className="py-4 px-4">
                                                                                <div className="w-10 h-10 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold font-medium">
                                                                                    {getFamilyMemberInitials(member)}
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-4 px-4">
                                                                                <div className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                                    {member.firstName} {member.lastName}
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-4 px-4">
                                                                                <span className="text-text-light-secondary dark:text-text-secondary">
                                                                                    {member.relationship === 'SPOUSE' ? t.spouse :
                                                                                     member.relationship === 'CHILD' ? t.child :
                                                                                     member.relationship === 'MOTHER' ? t.mother :
                                                                                     member.relationship === 'FATHER' ? t.father :
                                                                                     member.relationship === 'SIBLING' ? t.sibling :
                                                                                     member.relationship === 'PARENT' ? t.parent :
                                                                                     member.relationship === 'GRANDPARENT' ? t.grandparent :
                                                                                     member.relationship === 'GRANDCHILD' ? t.grandchild :
                                                                                     member.relationship === 'UNCLE_AUNT' ? t.uncleAunt :
                                                                                     member.relationship === 'NEPHEW_NIECE' ? t.nephewNiece :
                                                                                     member.relationship === 'COUSIN' ? t.cousin :
                                                                                     member.relationship === 'OTHER' ? t.other :
                                                                                     member.relationship}
                                                                                </span>
                                                                            </td>
                                                                            <td className="py-4 px-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-text-on-light dark:text-text-on-dark">
                                                                                        {member.age}
                                                                                    </span>
                                                                                    {member.isMinor && (
                                                                                        <Badge variant="soft" color="secondary" className="text-xs">
                                                                                            {t.minor}
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-4 px-4">
                                                                                <span className="text-text-light-secondary dark:text-text-secondary">
                                                                                    {member.phone || '-'}
                                                                                </span>
                                                                            </td>
                                                                            <td className="py-4 px-4">
                                                                                <Link href={`/dashboard/residents/${member.id}`}>
                                                                                    <button className="p-2 hover:bg-background-light-soft dark:hover:bg-background-soft rounded-lg transition-colors">
                                                                                        <ChevronRight className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                                                                                    </button>
                                                                                </Link>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <User className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                                                            <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                                {t.noFamilyMembers}
                                                            </h3>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted">
                                                                {t.noFamilyMembersDesc}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {activeTab === "documents" && (
                                                <div>
                                                    <div className="mb-6">
                                                        <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">{t.documentsTitle}</h4>
                                                    </div>
                                                    <div className="space-y-6">
                                                        {/* National ID Document */}
                                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 group">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <IdCard className="h-5 w-5 text-primary-gold" />
                                                                    <h5 className="font-medium text-text-on-light dark:text-text-on-dark">{t.identityDocument}</h5>
                                                                    {/* Status indicator */}
                                                                    {nationalIdDoc.url ? (
                                                                        <span className="ml-2 w-3 h-3 rounded-full bg-green-500 inline-block" title={t.loaded}></span>
                                                                    ) : (
                                                                        <span className="ml-2 w-3 h-3 rounded-full bg-red-500 inline-block" title={t.missing}></span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {!nationalIdDoc.url && (
                                                                        <Button
                                                                            variant="primary"
                                                                            size="sm"
                                                                            icon={Upload}
                                                                            onClick={(e) => {
                                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                                const buttonCenter = rect.width / 2;
                                                                                setPopupPosition({
                                                                                    top: rect.top - 200,
                                                                                    left: rect.left,
                                                                                    arrowLeft: buttonCenter - 8
                                                                                });
                                                                                setUploadDocumentType('national_id');
                                                                                setShowUploadPopup(true);
                                                                            }}
                                                                            disabled={nationalIdDoc.loading}
                                                                        >
                                                                            {t.upload}
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        disabled={!nationalIdDoc.url}
                                                                        onClick={() => nationalIdDoc.url && window.open(nationalIdDoc.url, '_blank')}
                                                                    >
                                                                        {t.view}
                                                                    </Button>
                                                                    {nationalIdDoc.loading && (
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-gold"></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Image Preview - Shows when hovering over the card */}
                                                            {nationalIdDoc.url && (
                                                                <div className="fixed inset-0 flex items-center justify-center z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                                    <div className="bg-background-card border border-primary-gold/30 rounded-xl shadow-2xl p-6 max-w-md mx-4">
                                                                        <div className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-3 text-center">
                                                                            {t.identityDocument}
                                                                        </div>
                                                                        <div className="flex justify-center">
                                                                            <img
                                                                                src={nationalIdDoc.url}
                                                                                alt={t.identityDocument}
                                                                                className="w-full h-auto max-h-80 object-contain rounded-lg"
                                                                                onError={(e) => {
                                                                                    e.currentTarget.style.display = 'none';
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="text-xs text-text-light-muted dark:text-text-muted mt-3 text-center">
                                                                            {t.preview}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Ownership Document */}
                                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 group">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <FileText className="h-5 w-5 text-primary-gold" />
                                                                    <h5 className="font-medium text-text-on-light dark:text-text-on-dark">{t.ownershipDocument}</h5>
                                                                    {/* Status indicator */}
                                                                    {ownershipDoc.url ? (
                                                                        <span className="ml-2 w-3 h-3 rounded-full bg-green-500 inline-block" title={t.loaded}></span>
                                                                    ) : (
                                                                        <span className="ml-2 w-3 h-3 rounded-full bg-red-500 inline-block" title={t.missing}></span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {!ownershipDoc.url && (
                                                                        <Button
                                                                            variant="primary"
                                                                            size="sm"
                                                                            icon={Upload}
                                                                            onClick={(e) => {
                                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                                const buttonCenter = rect.width / 2;
                                                                                setPopupPosition({
                                                                                    top: rect.top - 200,
                                                                                    left: rect.left,
                                                                                    arrowLeft: buttonCenter - 8
                                                                                });
                                                                                setUploadDocumentType('ownership_document');
                                                                                setShowUploadPopup(true);
                                                                            }}
                                                                            disabled={ownershipDoc.loading}
                                                                        >
                                                                            {t.upload}
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        disabled={!ownershipDoc.url}
                                                                        onClick={() => ownershipDoc.url && window.open(ownershipDoc.url, '_blank')}
                                                                    >
                                                                        {t.view}
                                                                    </Button>
                                                                    {ownershipDoc.loading && (
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-gold"></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Image Preview - Shows when hovering over the card */}
                                                            {ownershipDoc.url && (
                                                                <div className="fixed inset-0 flex items-center justify-center z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                                    <div className="bg-background-card border border-primary-gold/30 rounded-xl shadow-2xl p-6 max-w-md mx-4">
                                                                        <div className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-3 text-center">
                                                                            {t.ownershipDocument}
                                                                        </div>
                                                                        <div className="flex justify-center">
                                                                            <img
                                                                                src={ownershipDoc.url}
                                                                                alt={t.ownershipDocument}
                                                                                className="w-full h-auto max-h-80 object-contain rounded-lg"
                                                                                onError={(e) => {
                                                                                    e.currentTarget.style.display = 'none';
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="text-xs text-text-light-muted dark:text-text-muted mt-3 text-center">
                                                                            {t.preview}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {activeTab === "requests" && (
                                                <div>
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">
                                                            {t.requestsTitle}
                                                        </h4>
                                                        {hasCreateTicketPermission && (
                                                            <Button
                                                                variant="primary"
                                                                size="md"
                                                                icon={Plus}
                                                                onClick={handleCreateTicket}
                                                            >
                                                                {t.newRequest}
                                                            </Button>
                                                        )}
                                                    </div>

                                                    {ticketsLoading ? (
                                                        <div className="space-y-4">
                                                            {[1, 2, 3].map((i) => (
                                                                <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                                                    </div>
                                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : ticketsError ? (
                                                        <div className="text-center py-8">
                                                            <AlertCircle className="h-12 w-12 text-primary-red mx-auto mb-4" />
                                                            <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                                {t.requestsLoading}
                                                            </h3>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted mb-4">
                                                                {ticketsError}
                                                            </p>
                                                            <Button variant="secondary" size="sm" onClick={refreshTickets}>
                                                                {t.tryAgain}
                                                            </Button>
                                                        </div>
                                                    ) : residentTickets.length > 0 ? (
                                                        <div className="space-y-4">
                                                            {residentTickets.map((ticket) => (
                                                                <div
                                                                    key={ticket.id}
                                                                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-gold/30 transition-colors cursor-pointer"
                                                                    onClick={() => handleViewTicketDetail(ticket)}
                                                                >
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                                                                <Wrench className="h-4 w-4 text-primary-gold" />
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                                    {ticket.title}
                                                                                </h5>
                                                                                <p className="text-xs text-text-light-muted dark:text-text-muted">
                                                                                    {ticket.ticketNumber}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge
                                                                                variant="soft"
                                                                                color={
                                                                                    ticket.status === 'OPEN' ? 'gold' :
                                                                                        ticket.status === 'IN_PROGRESS' ? 'accent' :
                                                                                            ticket.status === 'RESOLVED' ? 'primary' :
                                                                                                ticket.status === 'CLOSED' ? 'primary' :
                                                                                                    'secondary'
                                                                                }
                                                                            >
                                                                                {ticket.status === 'OPEN' ? t.open :
                                                                                    ticket.status === 'IN_PROGRESS' ? t.inProgress :
                                                                                        ticket.status === 'RESOLVED' ? t.resolved :
                                                                                            ticket.status === 'CLOSED' ? t.closed :
                                                                                                ticket.status}
                                                                            </Badge>
                                                                            <ExternalLink className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                                                                        </div>
                                                                    </div>

                                                                    <p className="text-sm text-text-light-secondary dark:text-text-secondary mb-3" style={{
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden'
                                                                    }}>
                                                                        {ticket.description}
                                                                    </p>

                                                                    <div className="flex items-center justify-between text-xs text-text-light-muted dark:text-text-muted">
                                                                        <div className="flex items-center gap-4">
                                                                            <span className="flex items-center gap-1">
                                                                                <Building className="h-3 w-3" />
                                                                                {ticket.property?.name || ticket.property?.propertyNumber || t.propertyNotSpecified}
                                                                            </span>
                                                                            <Badge variant="outline" color="secondary" className="text-xs">
                                                                                {ticket.type === 'FAULT_REPAIR' ? t.faultRepair :
                                                                                    ticket.type === 'COMPLAINT' ? t.complaint :
                                                                                        ticket.type === 'REQUEST' ? t.request :
                                                                                            ticket.type === 'MAINTENANCE' ? t.maintenance :
                                                                                                ticket.type}
                                                                            </Badge>
                                                                        </div>
                                                                        <span className="flex items-center gap-1">
                                                                            <Calendar className="h-3 w-3" />
                                                                            {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <Wrench className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                                                            <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                                                                {t.noRequests}
                                                            </h3>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted">
                                                                {t.noRequestsDesc}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {activeTab === "activity" && (
                                                <div>
                                                    <div className="mb-6">
                                                        <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">{t.activityTitle}</h4>
                                                    </div>
                                                    {qrAuditLoading ? (
                                                        <div className="text-center py-8">{t.activityLoading}</div>
                                                    ) : qrAuditError ? (
                                                        <div className="text-center py-8 text-primary-red">{qrAuditError}</div>
                                                    ) : qrAuditLogs.length === 0 ? (
                                                        <div className="text-center py-8 text-text-light-muted dark:text-text-muted">{t.noActivity}</div>
                                                    ) : (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead>
                                                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">{t.date}</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">{t.action}</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">{t.type}</th>
                                                                        <th className="text-left py-3 px-4 text-xs font-medium text-text-light-muted dark:text-text-muted uppercase tracking-wide">{t.qrCodeId}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {qrAuditLogs.map((log) => (
                                                                        <tr key={log.id} className="border-b border-background-light-soft dark:border-background-soft hover:bg-background-light-soft dark:hover:bg-background-soft transition-colors">
                                                                            <td className="py-4 px-4">{new Date(log.createdAt).toLocaleString('tr-TR')}</td>
                                                                            <td className="py-4 px-4">{log.action}</td>
                                                                            <td className="py-4 px-4">{log.metadata?.type || '-'}</td>
                                                                            <td className="py-4 px-4">{log.metadata?.qrcodeId || '-'}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="space-y-6">
                                {/* Property Information */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                            <Home className="h-5 w-5 text-primary-gold" />
                                            {t.propertyInfo}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {/* Konut Adı Başlık + Kart */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Tag className="h-5 w-5 text-primary-gold" />
                                                    <span className="text-base font-semibold text-text-on-light dark:text-text-on-dark">{t.propertyName}</span>
                                                </div>
                                                <Card className="bg-background-light-soft dark:bg-background-soft rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[80px]">
                                                    {propertyLoading ? (
                                                        <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                                                    ) : propertyError ? (
                                                        <div className="text-primary-red text-sm">{propertyError}</div>
                                                    ) : propertyInfo ? (
                                                        <span className="text-2xl font-bold text-primary-gold">{propertyInfo.name || '-'}</span>
                                                    ) : (
                                                        <span className="text-text-light-muted dark:text-text-muted text-sm">{t.propertyInfoNotFound}</span>
                                                    )}
                                                </Card>
                                            </div>
                                            {/* Borç Başlık + Kart */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CreditCard className="h-5 w-5 text-primary-red" />
                                                    <span className="text-base font-semibold text-text-on-light dark:text-text-on-dark">{t.debt}</span>
                                                </div>
                                                <Card className="bg-background-light-soft dark:bg-background-soft rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[80px]">
                                                    {debtLoading ? (
                                                        <div className="animate-pulse h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                                                    ) : (
                                                        <span className={`text-2xl font-bold ${(totalDebt ?? 0) > 0 ? 'text-primary-red' : 'text-text-on-light dark:text-text-on-dark'}`}>{`${(totalDebt ?? 0)} ع.د`}</span>
                                                    )}
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Quick Actions */}
                                {/* <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                            <Settings className="h-5 w-5 text-primary-gold" />
                                            Hızlı İşlemler
                                        </h3>
                                        
                                        <div className="space-y-3">
                                            <Link href={`/dashboard/residents/${resident.id}/edit`}>
                                                <Button variant="secondary" className="w-full justify-start" icon={Edit}>
                                                    Bilgileri Düzenle
                                                </Button>
                                            </Link>
                                            
                                            <Button variant="secondary" className="w-full justify-start" icon={QrCode}>
                                                QR Kod Oluştur
                                            </Button>
                                            
                                            <Button variant="secondary" className="w-full justify-start" icon={FileText}>
                                                Rapor Oluştur
                                            </Button>
                                            <Button variant="secondary" className="w-full justify-start" icon={FileText} onClick={() => setShowDocumentsModal(true)}>
                                                Belgeleri Görüntüle
                                            </Button>
                                        </div>
                                    </div>
                                </Card> */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                            <Phone className="h-5 w-5 text-primary-gold" />
                                            {t.contactInfo}
                                        </h3>

                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                                        <Phone className="h-5 w-5 text-primary-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-text-light-muted dark:text-text-muted">{t.mobilePhone}</p>
                                                        <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                            {resident?.contact.formattedPhone || t.unspecified}
                                                        </p>
                                                    </div>
                                                </div>

                                                {resident?.contact.email && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                                            <Mail className="h-5 w-5 text-primary-gold" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted">{t.email}</p>
                                                            <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                {resident.contact.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-6">


                                                {resident?.lastActivity && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                                                            <Calendar className="h-5 w-5 text-primary-gold" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-text-light-muted dark:text-text-muted">{t.lastActivity}</p>
                                                            <p className="font-medium text-text-on-light dark:text-text-on-dark">
                                                                {new Date(resident.lastActivity).toLocaleDateString('tr-TR')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                {/* Notes */}
                                {resident?.notes && (
                                    <Card>
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-primary-gold" />
                                                {t.notes}
                                            </h3>
                                            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                                                {resident.notes}
                                            </p>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Add Family Member Modal */}
            <Modal
                isOpen={showAddFamilyModal}
                onClose={() => setShowAddFamilyModal(false)}
                title={t.addFamilyMemberTitle}
                icon={User}
                size="lg"
            >
                <div className="space-y-6">
                    {/* Ulusal kimlik numarası - En üstte tek başına */}
                    <div>
                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                            {t.nationalIdPassport} *
                        </label>
                        <Input
                            placeholder={t.nationalIdPassportPlaceholder}
                            value={familyFormData.identityNumber}
                            onChange={(e: any) => setFamilyFormData({ ...familyFormData, identityNumber: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                {t.firstName} *
                            </label>
                            <Input
                                placeholder={t.firstNamePlaceholder}
                                value={familyFormData.firstName}
                                onChange={(e: any) => setFamilyFormData({ ...familyFormData, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                {t.lastName} *
                            </label>
                            <Input
                                placeholder={t.lastNamePlaceholder}
                                value={familyFormData.lastName}
                                onChange={(e: any) => setFamilyFormData({ ...familyFormData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                {t.relationshipDegree} *
                            </label>
                            <Select
                                value={familyFormData.relationship}
                                onChange={(e: any) => setFamilyFormData({ ...familyFormData, relationship: e.target.value })}
                                options={[
                                    { value: '', label: t.select },
                                    { value: 'SPOUSE', label: t.spouse },
                                    { value: 'CHILD', label: t.child },
                                    { value: 'MOTHER', label: t.mother },
                                    { value: 'FATHER', label: t.father },
                                    { value: 'SIBLING', label: t.sibling },
                                    { value: 'PARENT', label: t.parent },
                                    { value: 'GRANDPARENT', label: t.grandparent },
                                    { value: 'GRANDCHILD', label: t.grandchild },
                                    { value: 'UNCLE_AUNT', label: t.uncleAunt },
                                    { value: 'NEPHEW_NIECE', label: t.nephewNiece },
                                    { value: 'COUSIN', label: t.cousin },
                                    { value: 'OTHER', label: t.other }
                                ]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                {t.phone} *
                            </label>
                            <Input
                                placeholder={t.phonePlaceholder}
                                value={familyFormData.phone}
                                onChange={(e: any) => setFamilyFormData({ ...familyFormData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h5 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-4">
                            {t.additionalInfo}
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                                            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                {t.gender}
                            </label>
                                <Select
                                    value={familyFormData.gender}
                                    onChange={(e: any) => setFamilyFormData({ ...familyFormData, gender: e.target.value })}
                                    options={[
                                        { value: '', label: t.select },
                                        { value: 'MALE', label: t.male },
                                        { value: 'FEMALE', label: t.female },
                                        { value: 'OTHER', label: t.other }
                                    ]}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    label={t.birthDate}
                                    value={familyFormData.birthDate}
                                    onChange={(e: any) => setFamilyFormData({ ...familyFormData, birthDate: e.target.value })}
                                    maxDate={new Date().toISOString().split('T')[0]}
                                    variant="default"
                                    showIcon={true}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    {t.birthPlace}
                                </label>
                                <Input
                                    placeholder={t.birthPlacePlaceholder}
                                    value={familyFormData.birthPlace}
                                    onChange={(e: any) => setFamilyFormData({ ...familyFormData, birthPlace: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                                    {t.bloodType}
                                </label>
                                <Select
                                    value={familyFormData.bloodType}
                                    onChange={(e: any) => setFamilyFormData({ ...familyFormData, bloodType: e.target.value })}
                                    options={[
                                        { value: '', label: 'Seçiniz' },
                                        { value: 'A+', label: 'A+' },
                                        { value: 'A-', label: 'A-' },
                                        { value: 'B+', label: 'B+' },
                                        { value: 'B-', label: 'B-' },
                                        { value: 'AB+', label: 'AB+' },
                                        { value: 'AB-', label: 'AB-' },
                                        { value: 'O+', label: 'O+' },
                                        { value: 'O-', label: 'O-' }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAddFamilyModal(false)}
                        >
                            {t.cancel}
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddFamilyMember}
                            disabled={
                                !familyFormData.firstName ||
                                !familyFormData.lastName ||
                                !familyFormData.relationship ||
                                !familyFormData.phone ||
                                !familyFormData.identityNumber ||
                                familyFormData.gender === '' ||
                                !familyFormData.birthDate ||
                                !familyFormData.birthPlace ||
                                !familyFormData.bloodType ||
                                familyMembersSaving
                            }
                            isLoading={familyMembersSaving}
                        >
                            {familyMembersSaving ? t.adding : t.addFamilyMember}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Document Upload Modal */}
            <DocumentUploadModal
                isOpen={showDocumentUploadModal}
                onClose={() => setShowDocumentUploadModal(false)}
                onUploadNationalId={uploadNationalIdDocument}
                onUploadOwnership={uploadOwnershipDocument}
                uploadStates={uploadStates}
            />

            {/* Upload Popup */}
            {showUploadPopup && (
                <>
                    {/* Backdrop - clicking outside closes popup */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => {
                            setShowUploadPopup(false);
                            setUploadDocumentType(null);
                            setPopupPosition({ top: 0, left: 0, arrowLeft: 0 });
                        }}
                    />

                    {/* Popup Content */}
                    <div
                        className="fixed z-50 w-80 bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-in slide-in-from-bottom-2 duration-200"
                        style={{
                            top: `${popupPosition.top}px`,
                            left: `${popupPosition.left}px`,
                        }}
                    >
                        {/* Arrow pointing down to button */}
                        <div
                            className="absolute -bottom-2 w-4 h-4 bg-background-light-card dark:bg-background-card border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"
                            style={{ left: `${popupPosition.arrowLeft}px` }}
                        ></div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-text-on-light dark:text-text-on-dark">
                                    {uploadDocumentType === 'national_id' ? t.identityDocument : t.ownershipDocument}
                                </h4>
                                <button
                                    onClick={() => {
                                        setShowUploadPopup(false);
                                        setUploadDocumentType(null);
                                        setPopupPosition({ top: 0, left: 0, arrowLeft: 0 });
                                    }}
                                    className="text-text-light-muted dark:text-text-muted hover:text-text-on-light dark:hover:text-text-on-dark"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="
                                    relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
                                    border-primary-gold/30 hover:border-primary-gold/50
                                    bg-background-light-secondary dark:bg-background-secondary
                                ">
                                    <input
                                        accept="image/jpeg,image/png,image/jpg,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                // Belgeyi yükle
                                                if (uploadDocumentType === 'national_id') {
                                                    uploadNationalIdDocument(file)
                                                        .then(() => toast.success(`${t.identityDocument} ${t.uploadSuccess}`))
                                                        .catch((err: any) => toast.error(err?.message || t.uploadFailed));
                                                } else if (uploadDocumentType === 'ownership_document') {
                                                    uploadOwnershipDocument(file)
                                                        .then(() => toast.success(`${t.ownershipDocument} ${t.uploadSuccess}`))
                                                        .catch((err: any) => toast.error(err?.message || t.uploadFailed));
                                                }
                                                setShowUploadPopup(false);
                                                setUploadDocumentType(null);
                                                setPopupPosition({ top: 0, left: 0, arrowLeft: 0 });
                                            }
                                        }}
                                    />
                                    <div className="space-y-2">
                                        <Upload className="mx-auto h-8 w-8 text-text-light-secondary dark:text-text-secondary" />
                                        <div className="text-xs text-text-on-light dark:text-text-on-dark">
                                            <span className="font-medium">{t.selectFile}</span>
                                            <span className="text-text-light-secondary dark:text-text-secondary"> {t.orDrag}</span>
                                        </div>
                                        <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                                            {t.fileTypes}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Create Ticket Modal */}
            <CreateTicketModal
                isOpen={showCreateTicketModal}
                onClose={() => setShowCreateTicketModal(false)}
                onSuccess={handleTicketCreated}
            />

            {/* Ticket Detail Modal */}
            <RequestDetailModal
                open={showTicketDetailModal}
                onClose={() => {
                    setShowTicketDetailModal(false);
                    setSelectedTicket(null);
                }}
                item={selectedTicket}
                onActionComplete={() => {
                    setShowTicketDetailModal(false);
                    setSelectedTicket(null);
                    refreshTickets();
                }}
                toast={toast}
            />

            {/* Approval Modal */}
            <ApprovalModal
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                onSubmit={handleApprovalSubmit}
                loading={approvalLoading}
                userName={resident?.fullName || 'Kullanıcı'}
            />

            {/* Edit Modal */}
            <EditModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEditSubmit}
                loading={editLoading}
                userName={resident?.fullName}
                initialData={resident ? {
                    id: String(resident.id),
                    firstName: resident.firstName || '',
                    lastName: resident.lastName || '',
                    phone: resident.contact?.formattedPhone || '',
                    email: resident.contact?.email || '',
                    role: resident.residentType.type as 'resident' | 'tenant',
                    identityNumber: '',
                    gender: '',
                    birthDate: '',
                    birthPlace: '',
                    bloodType: ''
                } : undefined}
            />

            {/* Create Ticket Modal */}
            <CreateTicketModal
                isOpen={showCreateTicketModal}
                onClose={() => setShowCreateTicketModal(false)}
                onSuccess={() => {
                    toast.success('Talep başarıyla oluşturuldu!');
                    // Refresh tickets if needed
                    refreshTickets();
                }}
                defaultAssigneeId={resident?.id as string}
                defaultAssigneeName={resident?.fullName}
            />

            {/* Toast Container */}
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
        </ProtectedRoute>
    );
}