'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Calendar,
  FileText,
  DollarSign,
  Building,
  User,
  Hash,
  AlertCircle
} from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
import TextArea from '@/app/components/ui/TextArea';
import Select from '@/app/components/ui/Select';
// import DatePicker from '@/app/components/ui/DatePicker';
import { 
  BillFormData, 
  BillType, 
  BILL_TYPE_OPTIONS,
  CreateBillDto 
} from '@/services/types/billing.types';
import { billingService } from '@/services';
import { propertyService } from '@/services';
import { userService } from '@/services';

interface CreateBillFormProps {
  onSuccess: (bill: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface PropertyOption {
  id: string;
  value: string;
  label: string;
  propertyNumber: string;
}

interface UserOption {
  id: string;
  value: string;
  label: string;
  email: string;
}

const CreateBillForm: React.FC<CreateBillFormProps> = ({
  onSuccess,
  onCancel,
  loading: externalLoading = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm<BillFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0], // Format for HTML date input
      description: '',
      billType: 'DUES',
      propertyId: '',
      assignedToId: '',
      documentNumber: ''
    }
  });

  const watchedBillType = watch('billType');

  // Fetch properties and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch properties
        setLoadingProperties(true);
        const propertiesResponse = await propertyService.getAll();
        const propertiesData = Array.isArray(propertiesResponse.data) 
          ? propertiesResponse.data 
          : propertiesResponse.data?.data || [];
        
        const propertyOptions: PropertyOption[] = propertiesData.map((property: any) => ({
          id: property.id,
          value: property.id,
          label: `${property.propertyNumber} - ${property.name}`,
          propertyNumber: property.propertyNumber
        }));
        setProperties(propertyOptions);

        // Fetch users
        setLoadingUsers(true);
        const usersResponse = await userService.getAll();
        const usersData = Array.isArray(usersResponse.data) 
          ? usersResponse.data 
          : usersResponse.data?.data || [];
        
        const userOptions: UserOption[] = usersData.map((user: any) => ({
          id: user.id,
          value: user.id,
          label: `${user.firstName} ${user.lastName}`,
          email: user.email
        }));
        setUsers(userOptions);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingProperties(false);
        setLoadingUsers(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: BillFormData) => {
    if (isSubmitting || externalLoading) return;

    setIsSubmitting(true);
    try {
      const billData: CreateBillDto = {
        title: data.title,
        amount: Number(data.amount),
        dueDate: new Date(data.dueDate).toISOString(),
        description: data.description,
        billType: data.billType,
        status: 'PENDING',
        propertyId: data.propertyId,
        assignedToId: data.assignedToId,
        documentNumber: data.documentNumber || undefined
      };

      const response = await billingService.createBill(billData);
      
      if (response.data) {
        onSuccess(response.data);
        reset();
      }
    } catch (error: any) {
      console.error('Error creating bill:', error);
      // Handle error - could show toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBillTypeIcon = (type: BillType) => {
    const option = BILL_TYPE_OPTIONS.find(opt => opt.value === type);
    return option?.icon || '📄';
  };

  const getBillTypeDescription = (type: BillType) => {
    const option = BILL_TYPE_OPTIONS.find(opt => opt.value === type);
    return option?.description || '';
  };

  const isLoading = isSubmitting || externalLoading || loadingProperties || loadingUsers;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-gold/10 rounded-lg">
          <FileText className="h-5 w-5 text-primary-gold" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Yeni Fatura Oluştur
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aidat, bakım veya fayda faturası oluşturun
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bill Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fatura Türü *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BILL_TYPE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watchedBillType === option.value
                    ? 'border-primary-gold bg-primary-gold/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('billType', { required: 'Fatura türü seçiniz' })}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 w-full">
                  <span className="text-lg">{option.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {option.description}
                    </div>
                  </div>
                </div>
                {watchedBillType === option.value && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary-gold rounded-full" />
                )}
              </label>
            ))}
          </div>
          {errors.billType && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.billType.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fatura Başlığı *
          </label>
          <Input
            {...register('title', { 
              required: 'Fatura başlığı gereklidir',
              minLength: { value: 3, message: 'En az 3 karakter olmalıdır' }
            })}
            placeholder="Örnek: Ocak 2024 Aidat"
            icon={FileText}
            error={errors.title?.message}
            disabled={isLoading}
          />
        </div>

        {/* Amount and Due Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tutar (IQD) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register('amount', { 
                required: 'Tutar gereklidir',
                min: { value: 0.01, message: 'Tutar 0\'dan büyük olmalıdır' }
              })}
              placeholder="0.00"
              icon={DollarSign}
              error={errors.amount?.message}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Vade Tarihi *
            </label>
            <Input
              type="date"
              {...register('dueDate', { required: 'Vade tarihi gereklidir' })}
              icon={Calendar}
              error={errors.dueDate?.message}
              disabled={isLoading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Property and Assigned User Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mülk *
            </label>
            <Select
              {...register('propertyId', { required: 'Mülk seçiniz' })}
              error={errors.propertyId?.message}
              disabled={isLoading}
              options={[
                { value: '', label: loadingProperties ? 'Yükleniyor...' : 'Mülk seçin' },
                ...properties
              ]}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Atanacak Kişi *
            </label>
            <Select
              {...register('assignedToId', { required: 'Kişi seçiniz' })}
              error={errors.assignedToId?.message}
              disabled={isLoading}
              options={[
                { value: '', label: loadingUsers ? 'Yükleniyor...' : 'Kişi seçin' },
                ...users
              ]}
            />
          </div>
        </div>

        {/* Document Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Belge Numarası
          </label>
          <Input
            {...register('documentNumber')}
            placeholder="Örnek: INV-2024-001"
            icon={Hash}
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Açıklama
          </label>
          <TextArea
            value={watch('description')}
            onChange={(e: any) => setValue('description', e.target.value)}
            placeholder="Fatura hakkında ek bilgiler..."
            rows={3}
            disabled={isLoading}
          />
        </div>

        {/* Current Bill Type Info */}
        {watchedBillType && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">{getBillTypeIcon(watchedBillType)}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {BILL_TYPE_OPTIONS.find(opt => opt.value === watchedBillType)?.label}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                - {getBillTypeDescription(watchedBillType)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            İptal
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isLoading}
            isLoading={isSubmitting}
            icon={FileText}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Fatura Oluşturuluyor...' : 'Fatura Oluştur'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateBillForm;