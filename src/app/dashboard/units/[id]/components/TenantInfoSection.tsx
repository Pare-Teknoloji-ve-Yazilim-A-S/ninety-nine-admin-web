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
import { residentService } from '@/services/resident.service';

interface TenantInfoSectionProps {
  tenantInfo?: TenantInfo;
  onUpdate?: (data: UpdateTenantInfoDto) => Promise<void>;
  onRemove?: () => Promise<void>;
  onAddTenant?: () => void;
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

export default function TenantInfoSection({ 
  tenantInfo, 
  onUpdate, 
  onRemove,
  onAddTenant,
  loading = false,
  canEdit = true 
}: TenantInfoSectionProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddNewResident, setShowAddNewResident] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: tenantInfo?.data.tenantName?.value || '',
    tenantPhone: tenantInfo?.data.tenantPhone?.value || '',
    tenantEmail: tenantInfo?.data.tenantEmail?.value || ''
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
      tenantName: tenantInfo?.data.tenantName?.value || '',
      tenantPhone: tenantInfo?.data.tenantPhone?.value || '',
      tenantEmail: tenantInfo?.data.tenantEmail?.value || ''
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
        tenantName: formData.tenantName,
        tenantPhone: formData.tenantPhone,
        tenantEmail: formData.tenantEmail
      });
      setShowEditModal(false);
      toast.success('Kiracı bilgileri güncellendi');
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
        tenantName: selectedResidentData.fullName,
        tenantPhone: selectedResidentData.phone || '',
        tenantEmail: selectedResidentData.email || ''
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
        tenantName: `${newResidentData.firstName} ${newResidentData.lastName}`,
        tenantPhone: newResidentData.phone,
        tenantEmail: ''
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
      return <Badge variant="soft" color="red">Süresi Dolmuş</Badge>;
    } else if (diffDays <= 30) {
      return <Badge variant="soft" color="gold">Süresi Yakında Doluyor</Badge>;
    } else {
      return <Badge variant="soft" color="primary">Aktif</Badge>;
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
              Kiracı Bilgileri
            </h3>
            {canEdit && onAddTenant && (
              <Button variant="primary" size="sm" icon={UserPlus} onClick={onAddTenant}>
                Kiracı Ekle
              </Button>
            )}
          </div>
          <div className="text-center py-8">
            <Home className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
            <p className="text-text-light-muted dark:text-text-muted">
              Bu konut şu anda kiralık değil
            </p>
            <p className="text-sm text-text-light-muted dark:text-text-muted mt-1">
              Kiracı eklemek için yukarıdaki butona tıklayın
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
                {tenantInfo.title}
              </h3>
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={UserX}
                  onClick={handleRemoveTenant}
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
                  Kiracı
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
        title="Kiracı Bilgilerini Düzenle"
        icon={Home}
        size="lg"
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              Kiracı Adı *
            </label>
            <Input
              value={formData.tenantName}
              onChange={(e: any) => setFormData({ ...formData, tenantName: e.target.value })}
              placeholder="Ad Soyad"
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                Telefon *
              </label>
              <Input
                type="tel"
                value={formData.tenantPhone}
                onChange={(e: any) => setFormData({ ...formData, tenantPhone: e.target.value })}
                placeholder="+964 XXX XXX XXXX"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                E-posta
              </label>
              <Input
                type="email"
                value={formData.tenantEmail}
                onChange={(e: any) => setFormData({ ...formData, tenantEmail: e.target.value })}
                placeholder="ornek@email.com"
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
              disabled={!formData.tenantName || !formData.tenantPhone}
            >
              Kaydet
            </Button>
          </div>

          {/* Kiracı Seçimi - Divider altında */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                Kiracı Seçin
              </label>
              <Select
                value={selectedResident}
                onChange={(e: any) => handleResidentSelect(e.target.value)}
                options={[
                  { value: '', label: 'Kiracı seçiniz' },
                  ...residents.map(resident => ({
                    value: resident.id,
                    label: `${resident.fullName}${resident.phone ? ` (${resident.phone})` : ''}`
                  }))
                ]}
                disabled={loadingResidents || saving}
              />
            </div>

            {/* Yeni Kiracı Ekle Butonu */}
            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                icon={UserPlus}
                onClick={handleAddNewResident}
                disabled={saving}
                className="w-full"
              >
                Yeni Kiracı Ekle
              </Button>
            </div>

            {/* Yeni Kiracı Ekleme Formu */}
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

                {/* Phone and Relationship */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                      Telefon *
                    </label>
                    <Input
                      type="tel"
                      placeholder="+964 XXX XXX XXXX"
                      value={newResidentData.phone}
                      onChange={(e: any) => handleNewResidentInputChange('phone', e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                      Yakınlık derecesi *
                    </label>
                    <Select
                      value={newResidentData.relationship}
                      onChange={(e: any) => handleNewResidentInputChange('relationship', e.target.value)}
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
                        onChange={(e: any) => handleNewResidentInputChange('gender', e.target.value)}
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