import React, { useState, useEffect } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';
import AddOwnerModal from './AddOwnerModal';
import { OwnerInfo, UpdateOwnerInfoDto } from '@/services/types/unit-detail.types';
import { User, Phone, Mail, Edit, Save, X, IdCard, UserPlus, UserX } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { adminResidentService } from '@/services/admin-resident.service';

interface OwnerInfoSectionProps {
  ownerInfo: OwnerInfo;
  onUpdate?: (data: UpdateOwnerInfoDto) => Promise<void>;
  onRemove?: () => Promise<void>;
  onAddOwner?: () => Promise<void>;
  onOpenAddOwnerModal?: () => void;
  loading?: boolean;
  canEdit?: boolean;
  residentId?: string; // Malik için sakin ID'si
  propertyId?: string; // Property ID for owner assignment
}



export default function OwnerInfoSection({ 
  ownerInfo, 
  onUpdate, 
  onRemove,
  onAddOwner,
  onOpenAddOwnerModal,
  loading = false,
  canEdit = true,
  residentId,
  propertyId
}: OwnerInfoSectionProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ownerInfo.data.phone.value,
    email: ownerInfo.data.email.value,
    nationalId: ownerInfo.data.nationalId.value,
    ownershipType: ownerInfo.data.ownershipType.value
  });


  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const toast = useToast();

  const handleEdit = () => {
    // Eğer malik yoksa, AddOwnerModal'ı aç
    if (!hasOwnerInfo) {
      if (onOpenAddOwnerModal) {
        onOpenAddOwnerModal();
      }
      return;
    }
    
    // Malik varsa, edit modal'ını aç
    setShowEditModal(true);
    
    // Mevcut fullName değerini ad ve soyad olarak ayırma
    const fullName = ownerInfo.data.fullName.value;
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setFormData({
      firstName: firstName,
      lastName: lastName,
      phone: ownerInfo.data.phone.value,
      email: ownerInfo.data.email.value,
      nationalId: ownerInfo.data.nationalId.value,
      ownershipType: ownerInfo.data.ownershipType.value
    });
    setValidationErrors({}); // Validation hatalarını temizle
  };

  // Form field değişikliklerini handle et ve validation yap
  const handleFieldChange = (field: string, value: string) => {
    let processedValue = value;
    
    // Telefon için otomatik formatting
    if (field === 'phone' && value.trim()) {
      // Sadece sayı ve + işaretine izin ver
      const cleanPhone = value.replace(/[^\d+]/g, '');
      processedValue = cleanPhone;
    }
    
    // TC Kimlik için sadece sayı
    if (field === 'nationalId' && value.trim()) {
      // Sadece sayı girişlerine izin ver
      const cleanTc = value.replace(/[^\d]/g, '');
      processedValue = cleanTc;
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Field-specific validation
    const newErrors = { ...validationErrors };
    
    if (field === 'phone') {
      if (value.trim()) {
        const formattedPhone = formatPhoneNumber(value);
        if (!validatePhoneNumber(formattedPhone)) {
          newErrors.phone = 'Telefon numarası +905551234567 formatında olmalıdır';
        } else {
          delete newErrors.phone;
        }
      } else {
        delete newErrors.phone; // Boş alan geçerli
      }
    }
    
    if (field === 'nationalId') {
      if (value.trim()) {
        if (!validateTcKimlik(value)) {
          newErrors.nationalId = 'TC Kimlik No 11 haneli olmalı ve 0 ile başlayamaz';
        } else {
          delete newErrors.nationalId;
        }
      } else {
        delete newErrors.nationalId; // Boş alan geçerli
      }
    }
    
    if (field === 'email') {
      if (value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = 'Geçerli bir email adresi giriniz';
        } else {
          delete newErrors.email;
        }
      } else {
        delete newErrors.email; // Boş alan geçerli
      }
    }
    
    setValidationErrors(newErrors);
  };



  // Kullanıcıyı email ile bulma
  const findResidentByEmail = async (email: string): Promise<string | undefined> => {
    try {
      const response = await fetch(`/api/proxy/admin/users?email=${encodeURIComponent(email)}&limit=1`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (userData.data && userData.data.length > 0) {
          const foundId = userData.data[0].id;
          return foundId;
        }
      }
      return undefined;
    } catch (error) {
      console.error('Error finding resident by email:', error);
      return undefined;
    }
  };

  // Telefon numarası validasyonu
  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone.trim()) return true; // Boş ise geçerli (opsiyonel)
    
    // International format kontrolü: +905551234567
    const phoneRegex = /^\+90[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // TC Kimlik No validasyonu
  const validateTcKimlik = (tcKimlik: string): boolean => {
    if (!tcKimlik.trim()) return true; // Boş ise geçerli (opsiyonel)
    
    // 11 haneli ve 0 ile başlamaz
    const tcRegex = /^[1-9][0-9]{10}$/;
    return tcRegex.test(tcKimlik);
  };

  // Telefon numarasını international format'a çevir
  const formatPhoneNumber = (phone: string): string => {
    if (!phone.trim()) return phone;
    
    // Zaten + ile başlıyorsa olduğu gibi bırak
    if (phone.startsWith('+90')) return phone;
    
    // 0 ile başlıyorsa +90 ile değiştir
    if (phone.startsWith('0')) {
      return '+90' + phone.substring(1);
    }
    
    // Sadece 10 haneli sayı ise +90 ekle
    if (/^[0-9]{10}$/.test(phone)) {
      return '+90' + phone;
    }
    
    return phone;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Validation hatalarını kontrol et
      if (Object.keys(validationErrors).length > 0) {
        toast.error('Lütfen form hatalarını düzeltin');
        setSaving(false);
        return;
      }

      // TC Kimlik validasyonu sadece
      if (formData.nationalId && !validateTcKimlik(formData.nationalId)) {
        toast.error('TC Kimlik No 11 haneli olmalı ve 0 ile başlayamaz');
        setSaving(false);
        return;
      }
      
      let targetResidentId = residentId;

      // Eğer residentId yoksa email ile kullanıcıyı bul
      if (!targetResidentId) {
        if (!formData.email || !formData.email.trim()) {
          toast.error('Kullanıcıyı güncellemek için email adresi gereklidir');
          setSaving(false);
          return;
        }
        
        targetResidentId = await findResidentByEmail(formData.email);
        if (!targetResidentId) {
          toast.error('Belirtilen email adresiyle kullanıcı bulunamadı. Önce kullanıcıyı sistemde oluşturun.');
          setSaving(false);
          return;
        }
      }

      // Sadece dolu/değiştirilmiş alanları gönder
      const updateData: any = {};
      
      // Ad Soyad - sadece dolu ve değiştirilmiş ise
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const currentFullName = ownerInfo.data.fullName.value;
      
      if (fullName && fullName !== currentFullName) {
        updateData.firstName = formData.firstName;
        updateData.lastName = formData.lastName;
      }
      
      // Telefon - sadece dolu ve değiştirilmiş ise
      if (formData.phone && formData.phone.trim()) {
        const currentPhone = ownerInfo.data.phone.value;
        if (formData.phone.trim() !== currentPhone) {
          updateData.phone = formData.phone.trim();
        }
      }
      
      // Email - sadece dolu ve değiştirilmiş ise
      if (formData.email && formData.email.trim()) {
        const currentEmail = ownerInfo.data.email.value;
        if (formData.email.trim() !== currentEmail) {
          updateData.email = formData.email.trim();
        }
      }
      
      // TC Kimlik - sadece dolu ve değiştirilmiş ise
      if (formData.nationalId && formData.nationalId.trim()) {
        const currentTcKimlik = ownerInfo.data.nationalId.value;
        if (formData.nationalId.trim() !== currentTcKimlik) {
          updateData.tcKimlikNo = formData.nationalId.trim();
        }
      }

      // En az bir alan dolu olmalı
      if (Object.keys(updateData).length === 0) {
        toast.success('Hiçbir değişiklik yapılmadı');
        setShowEditModal(false);
        setSaving(false);
        return;
      }



      // API çağrısını yap
      await adminResidentService.updateResident(targetResidentId, updateData);

      // Başarı durumunda
      setShowEditModal(false);
      toast.success('Malik bilgileri başarıyla güncellendi!');

      // Eğer onUpdate prop'u varsa onu da çağır (sayfa yenileme için)
      if (onUpdate) {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        await onUpdate({
          fullName: fullName,
          phone: formData.phone,
          email: formData.email,
          nationalId: formData.nationalId,
          ownershipType: formData.ownershipType as 'owner' | 'investor' | 'inherited'
        });
      }
    } catch (error: any) {
      console.error('Error updating resident:', error);
      
      // Spesifik hata mesajları
      const errorMessage = error?.response?.data?.message || error?.message;
      const statusCode = error?.response?.status;
      
      if (statusCode === 409 && errorMessage?.includes('Email already in use')) {
        toast.error('Bu email adresi zaten başka bir kullanıcı tarafından kullanılıyor');
      } else if (statusCode === 409) {
        toast.error('Bu bilgiler zaten başka bir kullanıcıda kayıtlı');
      } else if (statusCode === 404) {
        toast.error('Kullanıcı bulunamadı');
      } else if (statusCode === 400) {
        toast.error(errorMessage || 'Girilen bilgiler geçersiz');
      } else {
        toast.error(
          errorMessage ||
          'Malik bilgileri güncellenirken bir hata oluştu'
        );
      }
    } finally {
      setSaving(false);
    }
  };







  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getOwnershipTypeColor = (type: string): 'primary' | 'secondary' | 'gold' => {
    const option = ownerInfo.data.ownershipType.options.find(opt => 
      typeof opt === 'object' && opt.value === type
    );
    if (typeof option === 'object') {
      switch (option.color) {
        case 'blue': return 'primary';
        case 'purple': return 'secondary';
        case 'green': return 'primary';
        default: return 'secondary';
      }
    }
    return 'secondary';
  };

  const getOwnershipTypeLabel = (type: string): string => {
    const option = ownerInfo.data.ownershipType.options.find(opt => 
      typeof opt === 'object' && opt.value === type
    );
    return typeof option === 'object' ? option.label : type;
  };

  const hasOwnerInfo = ownerInfo.data.fullName.value;

  if (!hasOwnerInfo) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark flex items-center gap-2">
              <User className="h-5 w-5 text-primary-gold" />
              {ownerInfo.title}
            </h3>
            {canEdit && (
              <Button variant="primary" size="sm" icon={Edit} onClick={handleEdit}>
                Malik Ekle
              </Button>
            )}
          </div>
          <div className="text-center py-8">
            <User className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
            <p className="text-text-light-muted dark:text-text-muted">
              Henüz malik bilgisi eklenmemiş
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
            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark flex items-center gap-2">
              <User className="h-5 w-5 text-primary-gold" />
              {ownerInfo.title}
            </h3>
            {canEdit && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={UserX}
                  onClick={onRemove}
                  disabled={loading}
                >
                  Kaldır
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  onClick={handleEdit}
                  disabled={loading}
                >
                  Düzenle
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary-gold/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-gold">
                  {getInitials(ownerInfo.data.fullName.value)}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-lg font-medium text-text-on-light dark:text-text-on-dark">
                  {ownerInfo.data.fullName.value}
                </h4>
                <Badge 
                  variant="soft" 
                  color={getOwnershipTypeColor(ownerInfo.data.ownershipType.value)}
                  className="mt-1"
                >
                  {getOwnershipTypeLabel(ownerInfo.data.ownershipType.value)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Phone */}
                {ownerInfo.data.phone.value && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                    <a 
                      href={`tel:${ownerInfo.data.phone.value}`}
                      className="text-text-on-light dark:text-text-on-dark hover:text-primary-gold transition-colors"
                    >
                      {ownerInfo.data.phone.value}
                    </a>
                  </div>
                )}

                {/* Email */}
                {ownerInfo.data.email.value && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                    <a 
                      href={`mailto:${ownerInfo.data.email.value}`}
                      className="text-text-on-light dark:text-text-on-dark hover:text-primary-gold transition-colors"
                    >
                      {ownerInfo.data.email.value}
                    </a>
                  </div>
                )}

                {/* National ID */}
                {ownerInfo.data.nationalId.value && (
                  <div className="flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                    <span className="text-text-on-light dark:text-text-on-dark">
                      {ownerInfo.data.nationalId.value}
                    </span>
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
        title="Malik Bilgilerini Düzenle"
        icon={User}
        size="lg"
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Name and Surname */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                Ad *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e: any) => handleFieldChange('firstName', e.target.value)}
                placeholder="Ad"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                Soyad *
              </label>
              <Input
                value={formData.lastName}
                onChange={(e: any) => handleFieldChange('lastName', e.target.value)}
                placeholder="Soyad"
                disabled={saving}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                {ownerInfo.data.phone.label}
                {ownerInfo.data.phone.required && <span className="text-primary-red ml-1">*</span>}
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e: any) => handleFieldChange('phone', e.target.value)}
                placeholder="05551234567 veya +905551234567"
                disabled={saving}
                error={validationErrors.phone}
                maxLength={14}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                {ownerInfo.data.email.label}
                {ownerInfo.data.email.required && <span className="text-primary-red ml-1">*</span>}
                {!residentId && <span className="text-primary-red ml-1">*</span>}
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e: any) => handleFieldChange('email', e.target.value)}
                placeholder="ornek@email.com"
                disabled={saving}
                error={validationErrors.email}
              />
              {!residentId && (
                <p className="text-xs text-text-light-muted dark:text-text-muted mt-1">
                  Kullanıcıyı güncellemek için email adresi gereklidir
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                {ownerInfo.data.nationalId.label}
                {ownerInfo.data.nationalId.required && <span className="text-primary-red ml-1">*</span>}
              </label>
              <Input
                type="text"
                value={formData.nationalId}
                onChange={(e: any) => handleFieldChange('nationalId', e.target.value)}
                placeholder="12345678901 (11 haneli)"
                disabled={saving}
                error={validationErrors.nationalId}
                maxLength={11}
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                {ownerInfo.data.ownershipType.label}
                {ownerInfo.data.ownershipType.required && <span className="text-primary-red ml-1">*</span>}
              </label>
              <Select
                value={formData.ownershipType}
                onChange={(e: any) => handleFieldChange('ownershipType', e.target.value)}
                options={ownerInfo.data.ownershipType.options}
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
              İptal
            </Button>
            <Button 
              variant="primary" 
              icon={Save}
              onClick={handleSave}
              isLoading={saving}
              disabled={
                saving || 
                Object.keys(validationErrors).length > 0 ||
                (!residentId && (!formData.email || !formData.email.trim())) ||
                (!formData.firstName.trim() && !formData.lastName.trim() && !formData.phone.trim() && !formData.email.trim() && !formData.nationalId.trim())
              }
            >
              Kaydet
            </Button>
          </div>


        </div>
      </Modal>
    </>
  );
}