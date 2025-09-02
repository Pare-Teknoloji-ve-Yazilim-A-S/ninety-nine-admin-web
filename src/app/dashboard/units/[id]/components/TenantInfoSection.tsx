import React, { useState, useEffect } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';
import { TenantInfo, UpdateTenantInfoDto } from '@/services/types/unit-detail.types';
import { 
  Home, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  Edit, 
  UserX, 
  Save, 
  X,
  Clock,
  User,
  UserPlus,
  IdCard
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

// Dil çevirileri
const translations = {
  tr: {
    edit: 'Düzenle',
    cancel: 'İptal',
    save: 'Kaydet',
    remove: 'Kaldır',
    updateSuccess: 'Kiracı bilgileri güncellendi',
    updateError: 'Güncelleme başarısız oldu',
    // Modal and form
    editTenantInfo: 'Kiracı Bilgilerini Düzenle',
    firstName: 'Ad',
    lastName: 'Soyad',
    phone: 'Telefon',
    email: 'E-posta',
    tenant: 'Kiracı',
    addTenant: 'Kiracı Ekle',
    noTenantInfo: 'Henüz kiracı bilgisi eklenmemiş',
    // Lease status
    expired: 'Süresi Dolmuş',
    expiringSoon: 'Süresi Yakında Doluyor',
    active: 'Aktif',
    // Not rented state
    notRented: 'Bu konut şu anda kiralık değil',
    clickToAddTenant: 'Kiracı eklemek için yukarıdaki butona tıklayın',
    // Section title
    tenantInfoTitle: 'Kiracı Bilgileri'
  },
  en: {
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    remove: 'Remove',
    updateSuccess: 'Tenant information updated',
    updateError: 'Update failed',
    // Modal and form
    editTenantInfo: 'Edit Tenant Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    email: 'Email',
    tenant: 'Tenant',
    addTenant: 'Add Tenant',
    noTenantInfo: 'No tenant information added yet',
    // Lease status
    expired: 'Expired',
    expiringSoon: 'Expiring Soon',
    active: 'Active',
    // Not rented state
    notRented: 'This unit is not currently rented',
    clickToAddTenant: 'Click the button above to add a tenant',
    // Section title
    tenantInfoTitle: 'Tenant Information'
  },
  ar: {
    edit: 'تعديل',
    cancel: 'إلغاء',
    save: 'حفظ',
    remove: 'إزالة',
    updateSuccess: 'تم تحديث معلومات المستأجر',
    updateError: 'فشل التحديث',
    // Modal and form
    editTenantInfo: 'تعديل معلومات المستأجر',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    tenant: 'المستأجر',
    addTenant: 'إضافة مستأجر',
    noTenantInfo: 'لم يتم إضافة معلومات المستأجر بعد',
    // Lease status
    expired: 'منتهي الصلاحية',
    expiringSoon: 'ينتهي قريباً',
    active: 'نشط',
    // Not rented state
    notRented: 'هذه الوحدة غير مستأجرة حالياً',
    clickToAddTenant: 'انقر على الزر أعلاه لإضافة مستأجر',
    // Section title
    tenantInfoTitle: 'معلومات المستأجر'
  }
};


interface TenantInfoSectionProps {
  tenantInfo?: TenantInfo;
  onUpdate?: (data: UpdateTenantInfoDto) => Promise<void>;
  onRemove?: () => void;
  onAddTenant?: () => void;
  loading?: boolean;
  canEdit?: boolean;
  canAssign?: boolean;
}



export default function TenantInfoSection({ 
  tenantInfo, 
  onUpdate, 
  onRemove,
  onAddTenant,
  loading = false,
  canEdit = true,
  canAssign = true 
}: TenantInfoSectionProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('tr');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tenantPhone: tenantInfo?.data.tenantPhone?.value || '',
    tenantEmail: tenantInfo?.data.tenantEmail?.value || ''
  });

  const [saving, setSaving] = useState(false);
  const toast = useToast();

  // Dil tercihini localStorage'dan al
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

  // Helper function to translate section title
  const getTranslatedTitle = (title: string): string => {
    const titleMap: { [key: string]: string } = {
      'Kiracı Bilgileri': t.tenantInfoTitle
    };
    
    return titleMap[title] || title;
  };

  const handleEdit = () => {
    setShowEditModal(true);
    
    // Mevcut tenantName değerini ad ve soyad olarak ayırma
    const fullName = tenantInfo?.data.tenantName?.value || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setFormData({
      firstName: firstName,
      lastName: lastName,
      tenantPhone: tenantInfo?.data.tenantPhone?.value || '',
      tenantEmail: tenantInfo?.data.tenantEmail?.value || ''
    });
  };



  const handleSave = async () => {
    if (!onUpdate) return;

    setSaving(true);
    try {
      // Ad ve soyadı birleştirerek tam isim oluştur
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      await onUpdate({
        tenantName: fullName,
        tenantPhone: formData.tenantPhone,
        tenantEmail: formData.tenantEmail
      });
      setShowEditModal(false);
      toast.success(t.updateSuccess);
    } catch (error) {
      toast.error(t.updateError);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTenant = () => {
    if (onRemove) {
      onRemove(); // Ana sayfadaki modal'ı aç
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const formatCurrency = (amount: number, currency: string = 'IQD') => {
    return new Intl.NumberFormat('tr-TR').format(amount) + ' ' + currency;
  };

  const getLeaseStatusBadge = () => {
    if (!tenantInfo?.data.leaseEndDate?.value) return null;
    
    const endDate = new Date(tenantInfo.data.leaseEndDate.value);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <Badge variant="soft" color="red">{t.expired}</Badge>;
    } else if (diffDays <= 30) {
      return <Badge variant="soft" color="gold">{t.expiringSoon}</Badge>;
    } else {
      return <Badge variant="soft" color="primary">{t.active}</Badge>;
    }
  };



  // If not rented or no tenant info
  if (!tenantInfo?.isRented) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark flex items-center gap-2">
              <Home className="h-5 w-5 text-primary-gold" />
              {t.tenantInfoTitle}
            </h3>
            {onAddTenant && (
              <Button variant="primary" size="sm" icon={UserPlus} onClick={onAddTenant}>
                {t.addTenant}
              </Button>
            )}
          </div>
          <div className="text-center py-8">
            <Home className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
            <p className="text-text-light-muted dark:text-text-muted">
              {t.notRented}
            </p>
            <p className="text-sm text-text-light-muted dark:text-text-muted mt-1">
              {t.clickToAddTenant}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-3">
               <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark flex items-center gap-2">
                 <Home className="h-5 w-5 text-primary-gold" />
                 {getTranslatedTitle(tenantInfo.title)}
               </h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={UserX}
                onClick={handleRemoveTenant}
                disabled={loading}
              >
                {t.remove}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={Edit}
                onClick={handleEdit}
                disabled={loading}
              >
                {t.edit}
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary-gold/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-gold">
                  {getInitials(tenantInfo.data.tenantName?.value || 'KR')}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                  {tenantInfo.data.tenantName?.value}
                </h4>
                <Badge variant="soft" color="primary" className="mt-1">
                  {t.tenant}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Phone */}
                {tenantInfo.data.tenantPhone?.value && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                    <a 
                      href={`tel:${tenantInfo.data.tenantPhone.value}`}
                      className="text-text-on-light dark:text-text-on-dark hover:text-primary-gold transition-colors"
                    >
                      {tenantInfo.data.tenantPhone.value}
                    </a>
                  </div>
                )}

                {/* Email */}
                {tenantInfo.data.tenantEmail?.value && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                    <a 
                      href={`mailto:${tenantInfo.data.tenantEmail.value}`}
                      className="text-text-on-light dark:text-text-on-dark hover:text-primary-gold transition-colors"
                    >
                      {tenantInfo.data.tenantEmail.value}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={t.editTenantInfo}
        icon={Home}
        size="lg"
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                {t.firstName} *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e: any) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder={t.firstName}
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                {t.lastName} *
              </label>
              <Input
                value={formData.lastName}
                onChange={(e: any) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder={t.lastName}
                disabled={saving}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                {t.phone} *
              </label>
              <Input
                type="tel"
                value={formData.tenantPhone}
                onChange={(e: any) => setFormData({ ...formData, tenantPhone: e.target.value })}
                                      placeholder={t.phone}
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                {t.email}
              </label>
              <Input
                type="email"
                value={formData.tenantEmail}
                onChange={(e: any) => setFormData({ ...formData, tenantEmail: e.target.value })}
                placeholder={t.email}
                disabled={saving}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="secondary" 
              onClick={() => setShowEditModal(false)}
              disabled={saving}
            >
              {t.cancel}
            </Button>
            <Button 
              variant="primary" 
              icon={Save}
              onClick={handleSave}
              isLoading={saving}
              disabled={!formData.firstName || !formData.lastName || !formData.tenantPhone}
            >
              {t.save}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}