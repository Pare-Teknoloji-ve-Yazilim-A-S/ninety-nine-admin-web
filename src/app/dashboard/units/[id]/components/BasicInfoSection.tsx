import React, { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Badge from '@/app/components/ui/Badge';
import { BasicInfo, UpdateBasicInfoDto } from '@/services/types/unit-detail.types';
import { Edit, Save, X, Home } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface BasicInfoSectionProps {
  basicInfo: BasicInfo;
  onUpdate?: (data: UpdateBasicInfoDto) => Promise<void>;
  loading?: boolean;
  canEdit?: boolean;
}

export default function BasicInfoSection({ 
  basicInfo, 
  onUpdate, 
  loading = false,
  canEdit = true 
}: BasicInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    apartmentNumber: basicInfo.data.apartmentNumber.value,
    block: basicInfo.data.block.value,
    floor: basicInfo.data.floor.value,
    apartmentType: basicInfo.data.apartmentType.value,
    area: basicInfo.data.area.value,
    status: basicInfo.data.status.value
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      apartmentNumber: basicInfo.data.apartmentNumber.value,
      block: basicInfo.data.block.value,
      floor: basicInfo.data.floor.value,
      apartmentType: basicInfo.data.apartmentType.value,
      area: basicInfo.data.area.value,
      status: basicInfo.data.status.value
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      apartmentNumber: basicInfo.data.apartmentNumber.value,
      block: basicInfo.data.block.value,
      floor: basicInfo.data.floor.value,
      apartmentType: basicInfo.data.apartmentType.value,
      area: basicInfo.data.area.value,
      status: basicInfo.data.status.value
    });
  };

  const handleSave = async () => {
    if (!onUpdate) return;

    setSaving(true);
    try {
      await onUpdate({
        apartmentNumber: formData.apartmentNumber,
        block: formData.block,
        floor: formData.floor,
        apartmentType: formData.apartmentType,
        area: formData.area,
        status: formData.status as 'active' | 'inactive' | 'maintenance' | 'renovation'
      });
      setIsEditing(false);
      toast.success('Konut bilgileri güncellendi');
    } catch (error) {
      toast.error('Güncelleme başarısız oldu');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string): 'primary' | 'secondary' | 'gold' | 'red' => {
    switch (status) {
      case 'active': return 'primary';
      case 'inactive': return 'red';
      case 'maintenance': return 'gold';
      case 'renovation': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string): string => {
    const option = basicInfo.data.status.options.find(opt => 
      typeof opt === 'object' && opt.value === status
    );
    return typeof option === 'object' ? option.label : status;
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-primary-gold" />
            </div>
            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              {basicInfo.title}
            </h3>
            {!isEditing && (
              <Badge variant="soft" color={getStatusColor(basicInfo.data.status.value)}>
                {getStatusLabel(basicInfo.data.status.value)}
              </Badge>
            )}
          </div>
          {canEdit && !isEditing && (
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
          {isEditing && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={handleCancel}
                disabled={saving}
              >
                İptal
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Save}
                onClick={handleSave}
                isLoading={saving}
              >
                Kaydet
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Apartment Number */}
          <div>
            <label className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-2">
              {basicInfo.data.apartmentNumber.label}
              {basicInfo.data.apartmentNumber.required && <span className="text-primary-red ml-1">*</span>}
            </label>
            {isEditing ? (
              <Input
                value={formData.apartmentNumber}
                onChange={(e: any) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                placeholder="Örn: A-101"
                disabled={saving}
              />
            ) : (
              <p className="font-medium text-text-on-light dark:text-text-on-dark">
                {basicInfo.data.apartmentNumber.value}
              </p>
            )}
          </div>

          {/* Block */}
          <div>
            <label className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-2">
              {basicInfo.data.block.label}
              {basicInfo.data.block.required && <span className="text-primary-red ml-1">*</span>}
            </label>
            {isEditing ? (
              <Select
                value={formData.block}
                onChange={(e: any) => setFormData({ ...formData, block: e.target.value })}
                options={basicInfo.data.block.options.map(opt => 
                  typeof opt === 'string' ? { value: opt, label: opt } : opt
                )}
                disabled={saving}
              />
            ) : (
              <p className="font-medium text-text-on-light dark:text-text-on-dark">
                {basicInfo.data.block.value}
              </p>
            )}
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-2">
              {basicInfo.data.floor.label}
              {basicInfo.data.floor.required && <span className="text-primary-red ml-1">*</span>}
            </label>
            {isEditing ? (
              <Input
                type="number"
                value={formData.floor}
                onChange={(e: any) => setFormData({ ...formData, floor: parseInt(e.target.value) || 0 })}
                min={basicInfo.data.floor.min}
                max={basicInfo.data.floor.max}
                disabled={saving}
              />
            ) : (
              <p className="font-medium text-text-on-light dark:text-text-on-dark">
                {basicInfo.data.floor.value}. Kat
              </p>
            )}
          </div>

          {/* Apartment Type */}
          <div>
            <label className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-2">
              {basicInfo.data.apartmentType.label}
              {basicInfo.data.apartmentType.required && <span className="text-primary-red ml-1">*</span>}
            </label>
            {isEditing ? (
              <Select
                value={formData.apartmentType}
                onChange={(e: any) => setFormData({ ...formData, apartmentType: e.target.value })}
                options={basicInfo.data.apartmentType.options.map(opt => 
                  typeof opt === 'string' ? { value: opt, label: opt } : opt
                )}
                disabled={saving}
              />
            ) : (
              <p className="font-medium text-text-on-light dark:text-text-on-dark">
                {basicInfo.data.apartmentType.value}
              </p>
            )}
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-2">
              {basicInfo.data.area.label}
              {basicInfo.data.area.required && <span className="text-primary-red ml-1">*</span>}
            </label>
            {isEditing ? (
              <Input
                type="number"
                value={formData.area}
                onChange={(e: any) => setFormData({ ...formData, area: parseInt(e.target.value) || 0 })}
                min={basicInfo.data.area.min}
                max={basicInfo.data.area.max}
                disabled={saving}
              />
            ) : (
              <p className="font-medium text-text-on-light dark:text-text-on-dark">
                {basicInfo.data.area.value} m²
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-2">
              {basicInfo.data.status.label}
              {basicInfo.data.status.required && <span className="text-primary-red ml-1">*</span>}
            </label>
            {isEditing ? (
              <Select
                value={formData.status}
                onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                options={basicInfo.data.status.options}
                disabled={saving}
              />
            ) : (
              <Badge variant="soft" color={getStatusColor(basicInfo.data.status.value)}>
                {getStatusLabel(basicInfo.data.status.value)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}