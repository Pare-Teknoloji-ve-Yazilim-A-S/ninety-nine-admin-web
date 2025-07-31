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

interface OwnerInfoSectionProps {
  ownerInfo: OwnerInfo;
  onUpdate?: (data: UpdateOwnerInfoDto) => Promise<void>;
  onRemove?: () => Promise<void>;
  loading?: boolean;
  canEdit?: boolean;
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
  canEdit = true 
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
    phone: '',
    relationship: '',
    gender: '',
    birthDate: '',
    birthPlace: '',
    bloodType: ''
  });
  const [selectedResident, setSelectedResident] = useState('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [saving, setSaving] = useState(false);
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
    loadResidents();
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

  const handleSave = async () => {
    if (!onUpdate) return;

    setSaving(true);
    try {
      await onUpdate({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        nationalId: formData.nationalId,
        ownershipType: formData.ownershipType as 'owner' | 'investor' | 'inherited'
      });
      setShowEditModal(false);
      toast.success('Malik bilgileri güncellendi');
    } catch (error) {
      toast.error('Güncelleme başarısız oldu');
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
    if (!newResidentData.identityNumber || !newResidentData.firstName || !newResidentData.lastName || !newResidentData.phone || !newResidentData.relationship) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    setSaving(true);
    try {
      // Burada yeni sakin oluşturma API'si çağrılacak
      // Şimdilik sadece form verilerini kullanıyoruz
      setFormData({
        fullName: `${newResidentData.firstName} ${newResidentData.lastName}`,
        phone: newResidentData.phone,
        email: '',
        nationalId: newResidentData.identityNumber,
        ownershipType: 'owner'
      });
      
      setShowAddNewResident(false);
      setNewResidentData({
        identityNumber: '',
        firstName: '',
        lastName: '',
        phone: '',
        relationship: '',
        gender: '',
        birthDate: '',
        birthPlace: '',
        bloodType: ''
      });
      toast.success('Yeni sakin bilgileri eklendi');
    } catch (error) {
      toast.error('Sakin eklenirken hata oluştu');
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
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={ownerInfo.data.phone.format}
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                {ownerInfo.data.email.label}
                {ownerInfo.data.email.required && <span className="text-primary-red ml-1">*</span>}
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ornek@email.com"
                disabled={saving}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                {ownerInfo.data.nationalId.label}
                {ownerInfo.data.nationalId.required && <span className="text-primary-red ml-1">*</span>}
              </label>
              <Input
                value={formData.nationalId}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                placeholder="12345678901"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                {ownerInfo.data.ownershipType.label}
                {ownerInfo.data.ownershipType.required && <span className="text-primary-red ml-1">*</span>}
              </label>
              <Select
                value={formData.ownershipType}
                onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value })}
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
              disabled={!formData.fullName || !formData.phone}
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
                onChange={(e) => handleResidentSelect(e.target.value)}
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
                    onChange={(e) => handleNewResidentInputChange('identityNumber', e.target.value)}
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
                      onChange={(e) => handleNewResidentInputChange('firstName', e.target.value)}
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
                      onChange={(e) => handleNewResidentInputChange('lastName', e.target.value)}
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Phone and Relationship */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                      Telefon *
                    </label>
                    <Input
                      type="tel"
                      placeholder="+90 555 123 45 67"
                      value={newResidentData.phone}
                      onChange={(e) => handleNewResidentInputChange('phone', e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                      Yakınlık derecesi *
                    </label>
                    <Select
                      value={newResidentData.relationship}
                      onChange={(e) => handleNewResidentInputChange('relationship', e.target.value)}
                      options={[
                        { value: '', label: 'Seçiniz' },
                        { value: 'Eş', label: 'Eş' },
                        { value: 'Çocuk', label: 'Çocuk' },
                        { value: 'Anne', label: 'Anne' },
                        { value: 'Baba', label: 'Baba' },
                        { value: 'Kardeş', label: 'Kardeş' },
                        { value: 'Diğer', label: 'Diğer' }
                      ]}
                      disabled={saving}
                    />
                  </div>
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
                        onChange={(e) => handleNewResidentInputChange('gender', e.target.value)}
                        options={[
                          { value: '', label: 'Seçiniz' },
                          { value: 'Erkek', label: 'Erkek' },
                          { value: 'Kadın', label: 'Kadın' },
                          { value: 'Diğer', label: 'Diğer' }
                        ]}
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <DatePicker
                        label="Doğum Tarihi"
                        value={newResidentData.birthDate}
                        onChange={(e) => handleNewResidentInputChange('birthDate', e.target.value)}
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
                        onChange={(e) => handleNewResidentInputChange('birthPlace', e.target.value)}
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Kan Grubu
                      </label>
                      <Select
                        value={newResidentData.bloodType}
                        onChange={(e) => handleNewResidentInputChange('bloodType', e.target.value)}
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
                    disabled={!newResidentData.identityNumber || !newResidentData.firstName || !newResidentData.lastName || !newResidentData.phone || !newResidentData.relationship}
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