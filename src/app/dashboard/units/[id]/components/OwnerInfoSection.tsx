import React, { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import { OwnerInfo, UpdateOwnerInfoDto } from '@/services/types/unit-detail.types';
import { User, Phone, Mail, MapPin, Edit, Save, X, IdCard } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface OwnerInfoSectionProps {
  ownerInfo: OwnerInfo;
  onUpdate?: (data: UpdateOwnerInfoDto) => Promise<void>;
  onRemove?: () => Promise<void>;
  loading?: boolean;
  canEdit?: boolean;
}

export default function OwnerInfoSection({ 
  ownerInfo, 
  onUpdate, 
  onRemove,
  loading = false,
  canEdit = true 
}: OwnerInfoSectionProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: ownerInfo.data.fullName.value,
    phone: ownerInfo.data.phone.value,
    email: ownerInfo.data.email.value,
    nationalId: ownerInfo.data.nationalId.value,
    address: ownerInfo.data.address.value,
    ownershipType: ownerInfo.data.ownershipType.value
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleEdit = () => {
    setShowEditModal(true);
    setFormData({
      fullName: ownerInfo.data.fullName.value,
      phone: ownerInfo.data.phone.value,
      email: ownerInfo.data.email.value,
      nationalId: ownerInfo.data.nationalId.value,
      address: ownerInfo.data.address.value,
      ownershipType: ownerInfo.data.ownershipType.value
    });
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
        address: formData.address,
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

                {/* Address */}
                {ownerInfo.data.address.value && (
                  <div className="flex items-start gap-2 md:col-span-2">
                    <MapPin className="h-4 w-4 text-text-light-muted dark:text-text-muted mt-0.5" />
                    <span className="text-text-on-light dark:text-text-on-dark">
                      {ownerInfo.data.address.value}
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
        <div className="space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              {ownerInfo.data.address.label}
              {ownerInfo.data.address.required && <span className="text-primary-red ml-1">*</span>}
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Adres bilgileri"
              rows={3}
              className="w-full px-3 py-2 text-text-on-light dark:text-text-on-dark bg-background-light-secondary dark:bg-background-secondary border border-background-light-soft dark:border-background-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
              disabled={saving}
            />
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
        </div>
      </Modal>
    </>
  );
}