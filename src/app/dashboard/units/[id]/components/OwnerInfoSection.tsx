import React, { useState, useEffect } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';
import { OwnerInfo, UpdateOwnerInfoDto } from '@/services/types/unit-detail.types';
import { User, Phone, Mail, Edit, Save, X, IdCard, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { residentService } from '@/services/resident.service';
import { adminResidentService } from '@/services/admin-resident.service';

interface OwnerInfoSectionProps {
  ownerInfo: OwnerInfo;
  onUpdate?: (data: UpdateOwnerInfoDto) => Promise<void>;
  onRemove?: () => Promise<void>;
  loading?: boolean;
  canEdit?: boolean;
  residentId?: string; // Malik için sakin ID'si
}

interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  email?: string;
}

export default function OwnerInfoSection({ 
  ownerInfo, 
  onUpdate, 
  onRemove,
  loading = false,
  canEdit = true,
  residentId
}: OwnerInfoSectionProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddNewResident, setShowAddNewResident] = useState(false);
  const [formData, setFormData] = useState({
    fullName: ownerInfo.data.fullName.value,
    phone: ownerInfo.data.phone.value,
    email: ownerInfo.data.email.value,
    nationalId: ownerInfo.data.nationalId.value,
    ownershipType: ownerInfo.data.ownershipType.value
  });
  const [newResidentData, setNewResidentData] = useState({
    identityNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    birthPlace: '',
    bloodType: ''
  });
  const [selectedResident, setSelectedResident] = useState('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const toast = useToast();

  const handleEdit = () => {
    setShowEditModal(true);
    setShowAddNewResident(false); // Yeni sakin ekleme formunu kapat
    setFormData({
      fullName: ownerInfo.data.fullName.value,
      phone: ownerInfo.data.phone.value,
      email: ownerInfo.data.email.value,
      nationalId: ownerInfo.data.nationalId.value,
      ownershipType: ownerInfo.data.ownershipType.value
    });
    setValidationErrors({}); // Validation hatalarını temizle
    loadResidents();
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

  const loadResidents = async () => {
    setLoadingResidents(true);
    try {
      const response = await residentService.getAllResidents({ limit: 1000 });
      const residentsList = response.data.map((resident: any) => ({
        id: resident.id,
        firstName: resident.firstName,
        lastName: resident.lastName,
        fullName: `${resident.firstName} ${resident.lastName}`,
        phone: resident.phone,
        email: resident.email
      }));
      setResidents(residentsList);
    } catch (error) {
      console.error('Failed to load residents:', error);
      toast.error('Sakinler yüklenirken hata oluştu');
    } finally {
      setLoadingResidents(false);
    }
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
          return userData.data[0].id;
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

      // Form validasyonu
      const formattedPhone = formatPhoneNumber(formData.phone);
      
      if (formData.phone && !validatePhoneNumber(formattedPhone)) {
        toast.error('Telefon numarası international formatında olmalıdır (örn: +905551234567)');
        setSaving(false);
        return;
      }

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
      if (formData.fullName && formData.fullName.trim()) {
        const currentFullName = ownerInfo.data.fullName.value;
        if (formData.fullName.trim() !== currentFullName) {
          const nameParts = formData.fullName.trim().split(' ');
          updateData.firstName = nameParts[0];
          if (nameParts.length > 1) {
            updateData.lastName = nameParts.slice(1).join(' ');
          }
        }
      }
      
      // Telefon - sadece dolu ve değiştirilmiş ise, formatlanmış halini gönder
      if (formData.phone && formData.phone.trim()) {
        const currentPhone = ownerInfo.data.phone.value;
        if (formattedPhone !== currentPhone) {
          updateData.phone = formattedPhone;
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

      console.log('Updating resident:', { targetResidentId, updateData });

      // API çağrısını yap
      await adminResidentService.updateResident(targetResidentId, updateData);

      // Başarı durumunda
      setShowEditModal(false);
      toast.success('Malik bilgileri başarıyla güncellendi!');

      // Eğer onUpdate prop'u varsa onu da çağır (sayfa yenileme için)
      if (onUpdate) {
        await onUpdate({
          fullName: formData.fullName,
          phone: formattedPhone,
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

  const handleResidentSelect = (residentId: string) => {
    if (!residentId) return;
    
    const selectedResidentData = residents.find(r => r.id === residentId);
    if (selectedResidentData) {
      setFormData({
        fullName: selectedResidentData.fullName,
        phone: selectedResidentData.phone || '',
        email: selectedResidentData.email || '',
        nationalId: formData.nationalId,
        ownershipType: formData.ownershipType
      });
      setSelectedResident(residentId);
    }
  };

  const handleAddNewResident = () => {
    setShowAddNewResident(true);
  };

  const handleNewResidentInputChange = (field: string, value: string) => {
    setNewResidentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateNewResident = async () => {
    if (!newResidentData.firstName || !newResidentData.lastName || !newResidentData.email || !newResidentData.phone) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    setSaving(true);
    try {
      // Debug log to check what's being sent
      const payload = {
        tcKimlikNo: newResidentData.identityNumber,
        firstName: newResidentData.firstName,
        lastName: newResidentData.lastName,
        email: newResidentData.email,
        phone: newResidentData.phone,
        ...(newResidentData.gender && newResidentData.gender !== '' && { gender: newResidentData.gender }),
        ...(newResidentData.birthDate && { dateOfBirth: newResidentData.birthDate }),
        ...(newResidentData.birthPlace && { placeOfBirth: newResidentData.birthPlace }),
        ...(newResidentData.bloodType && { bloodType: newResidentData.bloodType })
      };
      console.log('OwnerInfoSection - API Payload:', payload);
      
      // Call the new residents API endpoint
      const createResidentResponse = await fetch('/api/proxy/admin/residents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!createResidentResponse.ok) {
        const errorData = await createResidentResponse.json();
        const errorMessage = errorData.message || 'Kullanıcı oluşturulamadı';
        console.error('Resident creation failed:', errorData);
        toast.error(`Yeni sakin oluşturulamadı: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const residentData = await createResidentResponse.json();
      console.log('Resident created successfully:', residentData);

      // Update form data with the new resident info
      setFormData({
        fullName: `${newResidentData.firstName} ${newResidentData.lastName}`,
        phone: newResidentData.phone,
        email: '',
        nationalId: '',
        ownershipType: 'owner'
      });
      
      setShowAddNewResident(false);
      setNewResidentData({
        identityNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        birthDate: '',
        birthPlace: '',
        bloodType: ''
      });
      
      toast.success(`Yeni sakin "${newResidentData.firstName} ${newResidentData.lastName}" başarıyla oluşturuldu`);
    } catch (error: any) {
      console.error('Error creating resident:', error);
      toast.error(error.message || 'Sakin eklenirken hata oluştu');
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
              <Button
                variant="ghost"
                size="sm"
                icon={Edit}
                onClick={handleEdit}
                disabled={loading}
              >
                Düzenle
              </Button>
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
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              {ownerInfo.data.fullName.label}
              {ownerInfo.data.fullName.required && <span className="text-primary-red ml-1">*</span>}
            </label>
            <Input
              value={formData.fullName}
              onChange={(e: any) => handleFieldChange('fullName', e.target.value)}
              placeholder="Ad Soyad"
              disabled={saving}
            />
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
                (!formData.fullName.trim() && !formData.phone.trim() && !formData.email.trim() && !formData.nationalId.trim())
              }
            >
              Kaydet
            </Button>
          </div>

          {/* Sakin Seçimi - Divider altında */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                Sakin Seçin
              </label>
              <Select
                value={selectedResident}
                onChange={(e: any) => handleResidentSelect(e.target.value)}
                options={[
                  { value: '', label: 'Sakin seçiniz' },
                  ...residents.map(resident => ({
                    value: resident.id,
                    label: `${resident.fullName}${resident.phone ? ` (${resident.phone})` : ''}`
                  }))
                ]}
                disabled={loadingResidents || saving}
              />
            </div>

            {/* Yeni Sakin Ekle Butonu */}
            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                icon={UserPlus}
                onClick={handleAddNewResident}
                disabled={saving}
                className="w-full"
              >
                Yeni Sakin Ekle
              </Button>
            </div>

            {/* Yeni Sakin Ekleme Formu */}
            {showAddNewResident && (
              <div className="mt-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                {/* Ulusal kimlik numarası - En üstte tek başına */}
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Ulusal kimlik numarası / Pasaport numarası *
                  </label>
                  <Input
                    placeholder="12345678901 veya AA1234567"
                    value={newResidentData.identityNumber}
                    onChange={(e: any) => handleNewResidentInputChange('identityNumber', e.target.value)}
                    disabled={saving}
                  />
                </div>

                {/* Name and Surname */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                      Ad *
                    </label>
                    <Input
                      placeholder="Ad"
                      value={newResidentData.firstName}
                      onChange={(e: any) => handleNewResidentInputChange('firstName', e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                      Soyad *
                    </label>
                    <Input
                      placeholder="Soyad"
                      value={newResidentData.lastName}
                      onChange={(e: any) => handleNewResidentInputChange('lastName', e.target.value)}
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    E-posta *
                  </label>
                  <Input
                    type="email"
                    placeholder="ornek@email.com"
                    value={newResidentData.email}
                    onChange={(e: any) => handleNewResidentInputChange('email', e.target.value)}
                    disabled={saving}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                    Telefon *
                  </label>
                  <Input
                    type="tel"
                    placeholder="Telefon numarası"
                    value={newResidentData.phone}
                    onChange={(e: any) => handleNewResidentInputChange('phone', e.target.value)}
                    disabled={saving}
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Cinsiyet
                      </label>
                      <Select
                        value={newResidentData.gender}
                        onChange={(e: any) => handleNewResidentInputChange('gender', e.target.value)}
                        options={[
                          { value: '', label: 'Seçmek istemiyorum' },
                          { value: 'MALE', label: 'Erkek' },
                          { value: 'FEMALE', label: 'Kadın' },
                          { value: 'OTHER', label: 'Diğer' }
                        ]}
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <DatePicker
                        label="Doğum Tarihi"
                        value={newResidentData.birthDate}
                        onChange={(e: any) => handleNewResidentInputChange('birthDate', e.target.value)}
                        maxDate={new Date().toISOString().split('T')[0]}
                        variant="default"
                        showIcon={true}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Doğum Yeri
                      </label>
                      <Input
                        placeholder="İstanbul, Türkiye"
                        value={newResidentData.birthPlace}
                        onChange={(e: any) => handleNewResidentInputChange('birthPlace', e.target.value)}
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Kan Grubu
                      </label>
                      <Select
                        value={newResidentData.bloodType}
                        onChange={(e: any) => handleNewResidentInputChange('bloodType', e.target.value)}
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
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>

                {/* New Resident Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowAddNewResident(false)}
                    disabled={saving}
                  >
                    İptal
                  </Button>
                  <Button 
                    variant="primary" 
                    icon={Save}
                    onClick={handleCreateNewResident}
                    isLoading={saving}
                    disabled={!newResidentData.firstName || !newResidentData.lastName || !newResidentData.email || !newResidentData.phone}
                  >
                    Ekle
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}