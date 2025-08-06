import { useState, useEffect, useCallback } from 'react';
import { unitsService } from '@/services/units.service';
import { 
  UnitDetail, 
  UpdateBasicInfoDto, 
  UpdateNotesDto 
} from '@/services/types/unit-detail.types';

interface UseUnitDetailResult {
  unit: UnitDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateBasicInfo: (data: UpdateBasicInfoDto) => Promise<void>;
  updateNotes: (data: UpdateNotesDto) => Promise<void>;
}

// Mock data transformer - converts API response to UnitDetail format
const transformPropertyToUnitDetail = (property: any): UnitDetail => {
  console.log('🔍 DEBUG: Transforming property to unit detail:', property);
  
  // This is a mock transformer - replace with actual API response mapping
  return {
    id: property.id,
    apartmentNumber: property.name || property.propertyNumber || 'A-101',
    block: property.propertyGroup || property.blockNumber || 'A',
    floor: property.floor || 1,
    type: property.type || 'RESIDENCE',
    area: parseFloat(property.area) || 120,
    status: property.status === 'OCCUPIED' || property.status === 'OWNER_OCCUPIED' || 
            property.status === 'TENANT_OCCUPIED' || property.status === 'GUEST_OCCUPIED' ? 'occupied' : 'available',
    createdDate: property.createdAt || new Date().toISOString(),
    lastUpdated: property.updatedAt || new Date().toISOString(),
    tenantId: property.tenant?.id, // Tenant ID from tenant object
    ownerId: property.owner?.id, // Owner ID from owner object
          basicInfo: {
        title: 'Konut Temel Bilgileri',
        icon: '🏠',
        data: {
          apartmentNumber: {
            label: 'Daire No',
            value: property.name || property.propertyNumber || 'A-101',
            type: 'text',
            required: true
          },
          block: {
            label: 'Blok',
            value: property.propertyGroup || property.blockNumber || 'A Blok',
            type: 'select',
            options: ['A Blok', 'B Blok', 'C Blok', 'D Blok'],
            required: true
          },
          floor: {
            label: 'Kat',
            value: property.floor || 1,
            type: 'number',
            min: -1,
            max: 20,
            required: true
          },
          propertyType: {
            label: 'Mülk Tipi',
            value: property.type || 'RESIDENCE',
            type: 'select',
            options: [
              { value: 'RESIDENCE', label: 'Daire' },
              { value: 'VILLA', label: 'Villa' },
              { value: 'COMMERCIAL', label: 'Ticari' },
              { value: 'OFFICE', label: 'Ofis' }
            ],
            required: true
          },
          apartmentType: {
            label: 'Daire Tipi',
            value: `${property.rooms || '3+1'} (${parseFloat(property.area) || 120}m²)`,
            type: 'select',
            options: ['1+0 (45m²)', '1+1 (65m²)', '2+1 (85m²)', '3+1 (120m²)', '4+1 (150m²)', '5+1 (180m²)'],
            required: true
          },
          area: {
            label: 'Alan (m²)',
            value: parseFloat(property.area) || 120,
            type: 'number',
            min: 30,
            max: 500,
            required: true
          },
          status: {
            label: 'Durum',
            value: property.status === 'OCCUPIED' || property.status === 'OWNER_OCCUPIED' || 
                   property.status === 'TENANT_OCCUPIED' || property.status === 'GUEST_OCCUPIED' ? 'occupied' : 'available',
            type: 'select',
            options: [
              { value: 'occupied', label: 'Dolu', color: 'red' },
              { value: 'available', label: 'Müsait', color: 'green' }
            ],
            required: true
          }
        }
      },
    ownerInfo: {
      title: 'Malik Bilgileri',
      icon: '👤',
      data: {
        fullName: {
          label: 'Ad Soyad',
          value: property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : '',
          type: 'text',
          required: true,
          validation: 'name'
        },
        phone: {
          label: 'Telefon',
          value: property.owner?.phone || '',
          type: 'tel',
          format: '+964 XXX XXX XXXX',
          required: true,
          validation: 'iraq_phone'
        },
        email: {
          label: 'E-posta',
          value: property.owner?.email || '',
          type: 'email',
          required: false,
          validation: 'email'
        },
        nationalId: {
          label: 'Kimlik No',
          value: '',
          type: 'text',
          required: false,
          validation: 'national_id'
        },
        address: {
          label: 'Adres',
          value: '',
          type: 'textarea',
          required: false
        },
        ownershipType: {
          label: 'Sahiplik Türü',
          value: 'owner',
          type: 'select',
          options: [
            { value: 'owner', label: 'Malik', color: 'blue' },
            { value: 'investor', label: 'Yatırımcı', color: 'purple' },
            { value: 'inherited', label: 'Miras', color: 'green' }
          ],
          required: true
        }
      }
    },
    tenantInfo: property.tenant ? {
      title: 'Kiracı Bilgileri',
      icon: '🏠',
      isRented: true,
      data: {
        isRented: {
          label: 'Kiralık Daire',
          value: true,
          type: 'checkbox'
        },
        tenantName: {
          label: 'Kiracı Adı',
          value: `${property.tenant.firstName} ${property.tenant.lastName}`,
          type: 'text',
          required: true,
          dependsOn: 'isRented',
          validation: 'name'
        },
        tenantPhone: {
          label: 'Kiracı Telefon',
          value: property.tenant.phone || '',
          type: 'tel',
          format: '+964 XXX XXX XXXX',
          required: true,
          dependsOn: 'isRented',
          validation: 'iraq_phone'
        },
        tenantEmail: {
          label: 'Kiracı E-posta',
          value: property.tenant.email || '',
          type: 'email',
          required: false,
          dependsOn: 'isRented'
        },
        leaseStartDate: {
          label: 'Kira Başlangıç',
          value: '2024-01-01',
          type: 'date',
          required: true,
          dependsOn: 'isRented'
        },
        leaseEndDate: {
          label: 'Kira Bitiş',
          value: '2024-12-31',
          type: 'date',
          required: true,
          dependsOn: 'isRented'
        },
        monthlyRent: {
          label: 'Aylık Kira (IQD)',
          value: 800000,
          type: 'currency',
          currency: 'IQD',
          required: true,
          dependsOn: 'isRented'
        },
        deposit: {
          label: 'Depozit (IQD)',
          value: 1600000,
          type: 'currency',
          currency: 'IQD',
          required: false,
          dependsOn: 'isRented'
        }
      }
    } : undefined,
    residents: [],
    billingInfo: {
      title: 'Fatura Ayarları',
      icon: '💰',
      data: {
        monthlyDues: {
          label: 'Aylık Aidat (IQD)',
          value: 150000,
          type: 'currency',
          currency: 'IQD',
          required: true
        },
        electricityMeterNo: {
          label: 'Elektrik Sayacı No',
          value: '',
          type: 'text',
          required: false,
          validation: 'meter_number'
        },
        waterMeterNo: {
          label: 'Su Sayacı No',
          value: '',
          type: 'text',
          required: false,
          validation: 'meter_number'
        },
        gasMeterNo: {
          label: 'Gaz Sayacı No',
          value: '',
          type: 'text',
          required: false,
          validation: 'meter_number'
        },
        internetConnection: {
          label: 'İnternet Bağlantısı',
          value: true,
          type: 'checkbox'
        },
        parkingSpace: {
          label: 'Otopark',
          value: '',
          type: 'text',
          required: false
        }
      }
    },
    financialSummary: {
      title: 'Finansal Özet',
      icon: '📊',
      data: {
        currentBalance: {
          label: 'Güncel Bakiye',
          value: 0,
          type: 'currency',
          currency: 'IQD',
          status: 'credit'
        },
        lastPaymentDate: {
          label: 'Son Ödeme',
          value: new Date().toISOString(),
          type: 'datetime'
        },
        lastPaymentAmount: {
          label: 'Son Ödeme Tutarı',
          value: 150000,
          type: 'currency',
          currency: 'IQD'
        },
        overdueAmount: {
          label: 'Gecikmiş Tutar',
          value: 0,
          type: 'currency',
          currency: 'IQD',
          status: 'overdue'
        },
        nextDueDate: {
          label: 'Sonraki Vade',
          value: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
          type: 'date'
        }
      }
    },
    consumptionData: {
      title: 'Tüketim Verileri',
      icon: '⚡',
      period: 'monthly',
      data: {}
    },
    maintenanceHistory: [],
    visitorHistory: [],
    notes: {
      title: 'Notlar ve Özel Durumlar',
      icon: '📝',
      data: {
        generalNotes: {
          label: 'Genel Notlar',
          value: '',
          type: 'textarea',
          maxLength: 1000
        },
        maintenanceNotes: {
          label: 'Bakım Notları',
          value: '',
          type: 'textarea',
          maxLength: 1000
        },
        specialRequests: {
          label: 'Özel İstekler',
          value: '',
          type: 'textarea',
          maxLength: 1000
        },
        accessRestrictions: {
          label: 'Erişim Kısıtlamaları',
          value: '',
          type: 'textarea',
          maxLength: 500
        }
      }
    },
    documents: [],
    permissions: {
      canEdit: true,
      canDelete: false,
      canViewFinancials: true,
      canManageResidents: true,
      canAccessDocuments: true,
      role: 'admin'
    },
    systemInfo: {
      createdBy: 'System Admin',
      createdDate: property.createdAt || new Date().toISOString(),
      lastModifiedBy: 'Apartment Manager',
      lastModifiedDate: property.updatedAt || new Date().toISOString(),
      version: '1.0',
      syncStatus: 'synced',
      backupDate: new Date().toISOString()
    }
  };
};

export function useUnitDetail(unitId: string | undefined): UseUnitDetailResult {
  const [unit, setUnit] = useState<UnitDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const fetchUnit = useCallback(async () => {
    if (!unitId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await unitsService.getPropertyById(unitId);
      if (response) {
        const transformedUnit = transformPropertyToUnitDetail(response);
        setUnit(transformedUnit);
      }
    } catch (err) {
      setError('Konut detayı yüklenemedi');
      console.error('Error fetching unit detail:', err);
    } finally {
      setLoading(false);
    }
  }, [unitId]);

  useEffect(() => {
    fetchUnit();
  }, [fetchUnit]);

  const refetch = async () => {
    // Force refetch with cache busting
    setUnit(null); // Clear current data
    await fetchUnit();
  };

  const updateBasicInfo = async (data: UpdateBasicInfoDto) => {
    if (!unitId) return;

    try {
      setLoading(true);
      // API call to update basic info
      // await unitsService.updateProperty(unitId, data);
      
      // For now, update local state
      setUnit(prev => prev ? {
        ...prev,
        apartmentNumber: data.apartmentNumber || prev.apartmentNumber,
        block: data.block || prev.block,
        floor: data.floor !== undefined ? data.floor : prev.floor,
        type: data.apartmentType || prev.type,
        area: data.area !== undefined ? data.area : prev.area,
        status: data.status || prev.status,
        lastUpdated: new Date().toISOString()
      } : null);
    } catch (err) {
      setError('Bilgiler güncellenemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNotes = async (data: UpdateNotesDto) => {
    if (!unitId || !unit) return;

    try {
      setLoading(true);
      // API call to update notes
      // await unitsService.updatePropertyNotes(unitId, data);
      
      // For now, update local state
      setUnit(prev => prev ? {
        ...prev,
        notes: {
          ...prev.notes,
          data: {
            generalNotes: data.generalNotes !== undefined ? 
              { ...prev.notes.data.generalNotes!, value: data.generalNotes } : 
              prev.notes.data.generalNotes,
            maintenanceNotes: data.maintenanceNotes !== undefined ? 
              { ...prev.notes.data.maintenanceNotes!, value: data.maintenanceNotes } : 
              prev.notes.data.maintenanceNotes,
            specialRequests: data.specialRequests !== undefined ? 
              { ...prev.notes.data.specialRequests!, value: data.specialRequests } : 
              prev.notes.data.specialRequests,
            accessRestrictions: data.accessRestrictions !== undefined ? 
              { ...prev.notes.data.accessRestrictions!, value: data.accessRestrictions } : 
              prev.notes.data.accessRestrictions
          }
        },
        lastUpdated: new Date().toISOString()
      } : null);
    } catch (err) {
      setError('Notlar güncellenemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    unit,
    loading,
    error,
    refetch,
    updateBasicInfo,
    updateNotes
  };
}