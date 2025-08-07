import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/app/components/ui/Modal';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Label from '@/app/components/ui/Label';

import { UserPlus, User, Phone, Mail, ChevronDown, Search, Info } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface AddOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propertyId: string;
}

interface OwnerFormData {
  // Owner Selection
  searchType: 'existing' | 'new';
  existingUserId: string;
  
  // New User Data
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
  dateOfBirth: string;
  identityNumber: string;
  ownershipType: string;
  ownershipDate: string;
}

interface ExistingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export default function AddOwnerModal({ isOpen, onClose, onSuccess, propertyId }: AddOwnerModalProps) {
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [existingUsers, setExistingUsers] = useState<ExistingUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExistingUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<OwnerFormData>({
    searchType: 'existing',
    existingUserId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    identityNumber: '',
    ownershipType: '',
    ownershipDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  // Get all residents
  const fetchResidents = async () => {
    setSearching(true);
    try {
      // Fetch with high limit to get all residents
      const response = await fetch('/api/proxy/admin/users?limit=1000&page=1', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched residents:', data.data?.length || 0, 'residents');
        setExistingUsers(data.data || []);
        setFilteredUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching residents:', error);
      toast.error('⚠️ Sakinler listesi yüklenemedi. Lütfen sayfayı yenileyin.');
    } finally {
      setSearching(false);
    }
  };

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(existingUsers);
    } else {
      const filtered = existingUsers.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        const query = searchQuery.toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
      setFilteredUsers(filtered);
    }
  }, [searchQuery, existingUsers]);

  // Get residents on mount
  useEffect(() => {
    if (isOpen && formData.searchType === 'existing') {
      fetchResidents();
    }
  }, [isOpen, formData.searchType]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        searchType: 'existing',
        existingUserId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        dateOfBirth: '',
        identityNumber: '',
        ownershipType: '',
        ownershipDate: ''
      });
      setErrors({});
      setExistingUsers([]);
      setFilteredUsers([]);
      setSearchQuery('');
      setDropdownOpen(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.searchType === 'existing') {
      if (!formData.existingUserId) {
        newErrors.existingUserId = 'Lütfen bir sakin seçin';
      }
    } else {
      if (!formData.firstName) newErrors.firstName = 'Ad zorunlu';
      if (!formData.lastName) newErrors.lastName = 'Soyad zorunlu';
      if (!formData.email) newErrors.email = 'E-posta zorunlu';
      if (!formData.phone) newErrors.phone = 'Telefon zorunlu';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Doğum tarihi zorunlu';
      if (!formData.identityNumber) newErrors.identityNumber = 'Kimlik numarası zorunlu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('⚠️ Lütfen gerekli alanları doldurun');
      return;
    }

    setLoading(true);
    
    try {
      // If creating new user, create user first
      if (formData.searchType === 'new') {
        // Prepare payload for new /admin/residents endpoint
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone, // phoneNumber yerine phone
          dateOfBirth: formData.dateOfBirth || '1990-01-01', // Default date if not provided
          gender: formData.gender || 'OTHER',
          tcKimlikNo: formData.identityNumber || '00000000000' // identityNumber yerine tcKimlikNo
        };
        
        console.log('🔍 Form Data:', formData);
        console.log('🚀 API Payload:', payload);
        
        toast.info('📋 Yeni sakin oluşturuluyor...');
        
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
          const errorMessage = errorData.message || 'Sakin oluşturulamadı';
          console.error('Resident creation failed:', errorData);
          toast.error(`Yeni sakin oluşturulamadı: ${errorMessage}`);
          throw new Error(errorMessage);
        }

        const residentData = await createResidentResponse.json();
        console.log('Resident created successfully:', residentData);
        
        // Show success message with temporary password
        toast.success(`✅ Yeni sakin "${formData.firstName} ${formData.lastName}" başarıyla oluşturuldu!`);
        toast.info(`🔑 Geçici şifre: ${residentData.temporaryPassword}`);
        toast.info('ℹ️ Sakin onaylandıktan sonra malik olarak atanabilir.');
        
        onSuccess();
        onClose();
        return;
      }

      // If selecting existing user, assign as owner
      if (formData.searchType === 'existing') {
        toast.info('📋 Malik atama işlemi başlatılıyor...');
        
        const simplePayload = {
          residentId: formData.existingUserId,
          status: 'OWNER'
        };
        
        console.log('API Request Payload (existing user):', simplePayload);
        console.log('propertyId:', propertyId);
        
        const addOwnerResponse = await fetch(`/api/proxy/admin/properties/${propertyId}/owner`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(simplePayload)
        });
        
        console.log('API Response Status:', addOwnerResponse.status);
        
        if (!addOwnerResponse.ok) {
          let errorData;
          try {
            const responseText = await addOwnerResponse.text();
            errorData = JSON.parse(responseText);
          } catch (e) {
            errorData = { message: 'Malik atama işlemi başarısız' };
          }
          
          console.error('Owner assignment failed:', errorData);
          toast.error(`❌ Malik atama işlemi başarısız: ${errorData.message}`);
          throw new Error(errorData.message);
        }

        // Get resident name for success message
        const residentName = existingUsers.find(u => u.id === formData.existingUserId);
        const displayName = residentName 
          ? `${residentName.firstName} ${residentName.lastName}` 
          : 'Sakin';
        
        toast.success(`🎉 ${displayName} başarıyla malik olarak atandı!`);
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      
      let errorMessage = 'İşlem sırasında beklenmeyen bir hata oluştu';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.name === 'TypeError') {
        errorMessage = 'İnternet bağlantınızı kontrol edin';
      } else if (error.name === 'SyntaxError') {
        errorMessage = 'Sunucu yanıtı işlenirken hata oluştu';
      }
      
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formData.searchType === 'new' ? "Yeni Sakin Oluştur" : "Malik Ekle"}
      icon={UserPlus}
      size="lg"
      className={formData.searchType === 'existing' ? (dropdownOpen ? "max-h-[95vh]" : "max-h-[90vh]") : ""}
    >
      <div className="space-y-6">
        {/* Search Type Selection */}
        <div>
          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
            Malik Türü
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, searchType: 'existing', existingUserId: '' })}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                formData.searchType === 'existing'
                  ? 'border-primary-gold bg-primary-gold/10 text-primary-gold'
                  : 'border-gray-200 dark:border-gray-700 text-text-light-secondary dark:text-text-secondary'
              }`}
            >
              Mevcut Sakin
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, searchType: 'new', firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', identityNumber: '', gender: '' })}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                formData.searchType === 'new'
                  ? 'border-primary-gold bg-primary-gold/10 text-primary-gold'
                  : 'border-gray-200 dark:border-gray-700 text-text-light-secondary dark:text-text-secondary'
              }`}
            >
              Yeni Sakin
            </button>
          </div>
        </div>

                 {/* Existing Resident Selection */}
         {formData.searchType === 'existing' && (
           <div ref={dropdownRef} className="pb-4">
            <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
              Sakin Seç
            </label>
            <div className="relative">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-light-muted dark:text-text-muted" />
                <input
                  type="text"
                  placeholder={searching ? 'Yükleniyor...' : 'Sakin ara...'}
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  onFocus={() => setDropdownOpen(true)}
                  disabled={searching}
                  className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border border-primary-gold/30 hover:border-primary-gold/50 focus:border-primary-gold focus:outline-none focus:ring-2 focus:ring-primary-gold/50 bg-background-secondary text-text-primary transition-colors"
                />
                <ChevronDown 
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-light-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Selected User Display */}
              {formData.existingUserId && !dropdownOpen && (
                <div className="mt-2 p-2 bg-primary-gold/10 border border-primary-gold/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary-gold" />
                    <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                      {existingUsers.find(u => u.id === formData.existingUserId)?.firstName} {existingUsers.find(u => u.id === formData.existingUserId)?.lastName}
                    </span>
                    <span className="text-xs text-text-light-muted dark:text-text-muted">
                      ({existingUsers.find(u => u.id === formData.existingUserId)?.email})
                    </span>
                  </div>
                </div>
              )}

                             {/* Dropdown List */}
               {dropdownOpen && (
                 <div className="absolute z-[9999] w-full mt-1 bg-background-secondary border border-primary-gold/30 rounded-lg shadow-lg">
                  {searching ? (
                    <div className="p-3 text-center text-text-light-muted dark:text-text-muted">
                      Yükleniyor...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-3 text-center text-text-light-muted dark:text-text-muted">
                      {searchQuery ? 'Aramanızla eşleşen sakin bulunamadı' : 'Sakin bulunamadı'}
                    </div>
                  ) : (
                    <>
                      <div className="p-2 text-xs font-medium text-text-light-muted dark:text-text-muted border-b border-gray-200 dark:border-gray-700">
                        {filteredUsers.length} sakin bulundu
                      </div>
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, existingUserId: user.id });
                            setDropdownOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left p-3 hover:bg-primary-gold/10 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-gold/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-primary-gold">
                                {user.firstName[0]}{user.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-text-on-light dark:text-text-on-dark">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-xs text-text-light-muted dark:text-text-muted">
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="text-xs text-text-light-muted dark:text-text-muted">
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
            {errors.existingUserId && (
              <p className="mt-1 text-sm text-primary-red">{errors.existingUserId}</p>
            )}
          </div>
        )}



        {/* New User Form */}
        {formData.searchType === 'new' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Yeni Sakin Oluşturma</p>
                  <p>Yeni sakin oluşturulduktan sonra onay sürecinden geçecek. Geçici şifre ile giriş yapabilir. Onaylandıktan sonra malik olarak atanabilir.</p>
                </div>
              </div>
            </div>
            
            {/* Kimlik Numarası - Tek başına en üstte */}
            <Input
              label="Kimlik Numarası"
              value={formData.identityNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, identityNumber: e.target.value })}
              error={errors.identityNumber}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ad"
                value={formData.firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                error={errors.firstName}
                required
              />
              <Input
                label="Soyad"
                value={formData.lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                error={errors.lastName}
                required
              />
              <Input
                label="E-posta"
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />
              <Input
                label="Telefon"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
                required
              />
              <Input
                label="Doğum Tarihi"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                error={errors.dateOfBirth}
                required
              />
              <div>
                <Label htmlFor="gender" className="block text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                  Cinsiyet *
                </Label>
                <Select
                  value={formData.gender}
                  onChange={(e: any) => setFormData({ ...formData, gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER' | '' })}
                  options={[
                    { value: '', label: 'Seçiniz' },
                    { value: 'MALE', label: 'Erkek' },
                    { value: 'FEMALE', label: 'Kadın' },
                    { value: 'OTHER', label: 'Diğer' }
                  ]}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            İptal
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={loading}
            disabled={loading}
            icon={UserPlus}
          >
            {loading 
              ? (formData.searchType === 'new' ? 'Oluşturuluyor...' : 'Ekleniyor...') 
              : (formData.searchType === 'new' ? 'Sakin Oluştur' : 'Malik Ekle')
            }
          </Button>
        </div>
      </div>
    </Modal>
  );
} 