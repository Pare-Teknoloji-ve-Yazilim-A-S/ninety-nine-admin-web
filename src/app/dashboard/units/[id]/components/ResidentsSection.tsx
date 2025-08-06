import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import Modal from '@/app/components/ui/Modal';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import { Resident, AddResidentDto } from '@/services/types/unit-detail.types';
import { 
  Users, 
  Plus, 
  Phone, 
  Mail, 
  User, 
  ChevronRight, 
  Crown,
  UserCheck,
  AlertCircle,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface ResidentsSectionProps {
  residents: Resident[];
  onAdd?: (data: AddResidentDto) => Promise<void>;
  onRemove?: (residentId: string) => Promise<void>;
  loading?: boolean;
  canEdit?: boolean;
}

export default function ResidentsSection({ 
  residents, 
  onAdd, 
  onRemove,
  loading = false,
  canEdit = true 
}: ResidentsSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'family_member' as 'owner' | 'tenant' | 'family_member',
    phone: '',
    email: '',
    age: '',
    nationalId: '',
    relation: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleAdd = () => {
    setShowAddModal(true);
    setFormData({
      name: '',
      role: 'family_member',
      phone: '',
      email: '',
      age: '',
      nationalId: '',
      relation: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: ''
    });
  };

  const handleSave = async () => {
    if (!onAdd) return;

    setSaving(true);
    try {
      const residentData: AddResidentDto = {
        name: formData.name,
        role: formData.role,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        nationalId: formData.nationalId || undefined,
        relation: formData.relation || undefined,
        emergencyContact: (formData.emergencyContactName && formData.emergencyContactPhone) ? {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relation: formData.emergencyContactRelation
        } : undefined
      };

      await onAdd(residentData);
      setShowAddModal(false);
      toast.success('Sakin başarıyla eklendi');
    } catch (error) {
      toast.error('Sakin ekleme işlemi başarısız');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (residentId: string, residentName: string) => {
    if (!onRemove) return;

    if (window.confirm(`${residentName} adlı sakini kayıttan çıkarmak istediğinizden emin misiniz?`)) {
      try {
        await onRemove(residentId);
        toast.success('Sakin kaydı kaldırıldı');
      } catch (error) {
        toast.error('Sakin kaldırma işlemi başarısız');
      }
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getRoleIcon = (role: string, isMainResident: boolean) => {
    if (isMainResident) return <Crown className="h-4 w-4 text-yellow-500" />;
    
    switch (role) {
      case 'owner':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'tenant':
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string): 'primary' | 'secondary' | 'gold' => {
    switch (role) {
      case 'owner':
        return 'primary';
      case 'tenant':
        return 'gold';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-gold" />
            <h4 className="text-base font-semibold text-text-on-light dark:text-text-on-dark">
              Mevcut Sakinler ({residents.length})
            </h4>
          </div>
        </div>

        {residents.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
            <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
              Henüz sakin kaydı yok
            </h3>
            <p className="text-sm text-text-light-muted dark:text-text-muted">
              Bu konut için sakin bilgilerini ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {residents.map((resident) => (
              <div 
                key={resident.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-gold/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary-gold/10 flex items-center justify-center relative">
                      <span className="text-sm font-bold text-primary-gold">
                        {getInitials(resident.name)}
                      </span>
                      {resident.isMainResident && (
                        <div className="absolute -top-1 -right-1">
                          <Crown className="h-4 w-4 text-yellow-500" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-text-on-light dark:text-text-on-dark">
                          {resident.name}
                        </h5>
                        <Badge 
                          variant="soft" 
                          color={getRoleBadgeColor(resident.role)}
                          className="text-xs"
                        >
                          {resident.roleLabel}
                        </Badge>
                        {resident.isMainResident && (
                          <Badge variant="soft" color="gold" className="text-xs">
                            Ana Sakin
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-text-light-muted dark:text-text-muted">
                        {resident.age && (
                          <span>{resident.age} yaş</span>
                        )}
                        {resident.relation && (
                          <span>{resident.relation}</span>
                        )}
                        {resident.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{resident.phone}</span>
                          </div>
                        )}
                        {resident.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{resident.email}</span>
                          </div>
                        )}
                      </div>

                      {resident.emergencyContact && (
                        <div className="mt-2 text-xs text-text-light-muted dark:text-text-muted">
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>
                              Acil Durum: {resident.emergencyContact.name} ({resident.emergencyContact.relation}) - {resident.emergencyContact.phone}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/residents/${resident.id}`}>
                      <Button variant="ghost" size="sm" icon={ChevronRight}>
                        Detay
                      </Button>
                    </Link>
                    {canEdit && !resident.isMainResident && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemove(resident.id, resident.name)}
                        className="text-primary-red hover:text-primary-red"
                      >
                        Kaldır
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Resident Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yeni Sakin Ekle"
        icon={User}
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              Ad Soyad *
            </label>
            <Input
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: Ahmet Yılmaz"
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                Rol *
              </label>
              <Select
                value={formData.role}
                onChange={(e: any) => setFormData({ ...formData, role: e.target.value as 'owner' | 'tenant' | 'family_member' })}
                options={[
                  { value: 'owner', label: 'Malik' },
                  { value: 'tenant', label: 'Kiracı' },
                  { value: 'family_member', label: 'Aile Üyesi' }
                ]}
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                İlişki {formData.role === 'family_member' && '*'}
              </label>
              <Select
                value={formData.relation}
                onChange={(e: any) => setFormData({ ...formData, relation: e.target.value })}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                Telefon
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
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
                value={formData.email}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ornek@email.com"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                Yaş
              </label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e: any) => setFormData({ ...formData, age: e.target.value })}
                placeholder="25"
                min="0"
                max="120"
                disabled={saving}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              Kimlik No
            </label>
            <Input
              value={formData.nationalId}
              onChange={(e: any) => setFormData({ ...formData, nationalId: e.target.value })}
              placeholder="12345678901"
              disabled={saving}
            />
          </div>

          {/* Emergency Contact */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h5 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-4">
              Acil Durum İletişim (Opsiyonel)
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-text-light-muted dark:text-text-muted mb-1">
                  Ad Soyad
                </label>
                <Input
                  value={formData.emergencyContactName}
                  onChange={(e: any) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="Acil durum kişisi"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-xs text-text-light-muted dark:text-text-muted mb-1">
                  Telefon
                </label>
                <Input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e: any) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="+964 XXX XXX XXXX"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-xs text-text-light-muted dark:text-text-muted mb-1">
                  İlişki
                </label>
                <Input
                  value={formData.emergencyContactRelation}
                  onChange={(e: any) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                  placeholder="Örn: Eş, Kardeş"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="secondary" 
              onClick={() => setShowAddModal(false)}
              disabled={saving}
            >
              İptal
            </Button>
            <Button 
              variant="primary" 
              icon={Save}
              onClick={handleSave}
              isLoading={saving}
              disabled={!formData.name || !formData.role || (formData.role === 'family_member' && !formData.relation)}
            >
              Sakin Ekle
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}