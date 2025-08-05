"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";
import DashboardHeader from "@/app/dashboard/components/DashboardHeader";
import Sidebar from "@/app/components/ui/Sidebar";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import Checkbox from "@/app/components/ui/Checkbox";
import { useToast } from "@/hooks/useToast";
import {
  ArrowLeft,
  Check,
  Info,
  Building,
  Home,
  Map,
  User,
  Store,
  Car,
  AlertCircle,
  Hash,
  FileText,
  Camera,
  Settings,
  MapPin,
  Layers,
} from "lucide-react";

// Mock data for asset management
const mockAssetTypes = [
  { value: "RESIDENCE", label: "Konut" },
  { value: "COMMERCIAL", label: "Ticari Alan" },
];

const mockStatusOptions = [
  { value: "ACTIVE", label: "Aktif" },
  { value: "INACTIVE", label: "Pasif" },
  { value: "RESERVED", label: "Rezerve" },
];

const mockBlocks = ["A", "B", "C", "D", "Villa"];
const mockFloors = ["Zemin", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const mockAssetSizeTypes = [
  "200m²",
  "400m²", 
  "400+200m²",
  "600m²",
  "800m²",
  "1000m²",
  "1200m²",
  "1500m²",
  "2000m²+"
];

const mockNeighborhoods = ["Mahalle 1", "Mahalle 2", "Mahalle 3", "Mahalle 4", "Mahalle 5"];

interface FormData {
  // Varlık Temel Bilgileri
  assetNumber: string;
  assetNumberAuto: boolean;
  assetName: string;
  assetType: "RESIDENCE" | "COMMERCIAL";
  status: "ACTIVE" | "INACTIVE" | "RESERVED";
  block: string;
  floor: string;
  unitNumber: string;
  mapLocation: string;
  planLocation: string;
  
  // Varlık Detay Bilgileri
  area: string;
  roomCount: string;
  assetSizeType: string;
  groupingBlock: string;
  groupingNeighborhood: string;
  specialNotes: string;
  
  // Varlık İçerik Bilgileri (Opsiyonel)
  inventoryList: string;
  currentPhotos: string;
  technicalSpecs: string;
}

export default function AddAssetPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    assetNumber: "",
    assetNumberAuto: true,
    assetName: "",
    assetType: "RESIDENCE",
    status: "ACTIVE",
    block: "",
    floor: "",
    unitNumber: "",
    mapLocation: "",
    planLocation: "",
    area: "",
    roomCount: "",
    assetSizeType: "",
    groupingBlock: "",
    groupingNeighborhood: "",
    specialNotes: "",
    inventoryList: "",
    currentPhotos: "",
    technicalSpecs: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const breadcrumbItems = [
    { label: "Ana Sayfa", href: "/dashboard" },
    { label: "Varlıklar", href: "/dashboard/units" },
    { label: "Yeni Varlık Ekle", active: true },
  ];

  // Auto-generate asset number
  React.useEffect(() => {
    if (formData.assetNumberAuto) {
      const autoNumber = `VRLK-${Math.floor(Math.random() * 99999).toString().padStart(5, "0")}`;
      setFormData(prev => ({ ...prev, assetNumber: autoNumber }));
    }
  }, [formData.assetNumberAuto]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.assetNumberAuto && !formData.assetNumber) {
      newErrors.assetNumber = "Varlık numarası zorunludur";
    }
    if (!formData.assetName) newErrors.assetName = "Varlık adı zorunludur";
    if (!formData.assetType) newErrors.assetType = "Varlık türü zorunludur";
    if (!formData.status) newErrors.status = "Durum seçimi zorunludur";
    if (!formData.block) newErrors.block = "Blok seçimi zorunludur";
    if (!formData.floor) newErrors.floor = "Kat seçimi zorunludur";
    if (!formData.unitNumber) newErrors.unitNumber = "Daire/Villa No zorunludur";
    if (!formData.area) newErrors.area = "Alan zorunludur";
    if (!formData.assetSizeType) newErrors.assetSizeType = "Varlık tipi zorunludur";
    if (!formData.groupingBlock) newErrors.groupingBlock = "Gruplama blok no zorunludur";
    if (!formData.groupingNeighborhood) newErrors.groupingNeighborhood = "Gruplama mahalle no zorunludur";
    
    // Conditional validation for residence
    if (formData.assetType === "RESIDENCE" && !formData.roomCount) {
      newErrors.roomCount = "Oda sayısı zorunludur";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Prepare payload for API
      const payload = {
        assetNumber: formData.assetNumber,
        name: formData.assetName,
        type: formData.assetType,
        status: formData.status,
        block: formData.block,
        floor: formData.floor,
        unitNumber: formData.unitNumber,
        mapLocation: formData.mapLocation || null,
        planLocation: formData.planLocation || null,
        area: parseFloat(formData.area) || 0,
        roomCount: formData.assetType === 'RESIDENCE' ? parseInt(formData.roomCount) || 0 : null,
        assetSizeType: formData.assetSizeType,
        groupingBlock: formData.groupingBlock,
        groupingNeighborhood: formData.groupingNeighborhood,
        specialNotes: formData.specialNotes || null,
        inventoryList: formData.inventoryList || null,
        technicalSpecs: formData.technicalSpecs || null
      };

      const response = await fetch('/api/proxy/admin/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      success(`Konut başarıyla oluşturuldu: ${formData.assetName}`);
      
      // Redirect to units list or the created unit's detail page
      if (result.data?.id) {
        router.push(`/dashboard/units/${result.data.id}`);
      } else {
        router.push('/dashboard/units');
      }
      
    } catch (errorMsg) {
        console.error('Konut oluşturma hatası:', errorMsg);
        error(errorMsg instanceof Error ? errorMsg.message : 'Konut oluşturulurken bir hata oluştu');
      } finally {
      setIsSubmitting(false);
    }
  };

  // Success modal/message
  if (showSuccess) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="lg:ml-72">
            <DashboardHeader title="Başarılı!" breadcrumbItems={breadcrumbItems} />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Card className="text-center">
                <div className="p-8">
                  <div className="w-16 h-16 bg-semantic-success-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-semantic-success-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark mb-2">
                    Varlık başarıyla kaydedildi!
                  </h2>
                  <p className="text-text-light-secondary dark:text-text-secondary mb-2">
                    {formData.assetName} - {mockAssetTypes.find(t => t.value === formData.assetType)?.label}
                  </p>
                  <p className="text-sm text-text-light-muted dark:text-text-muted mb-6">
                    Varlık No: {formData.assetNumber}
                  </p>
                  <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                      Şimdi ne yapmak istersiniz?
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/dashboard/units">
                      <Button variant="primary">Varlık Listesine Dön</Button>
                    </Link>
                    <Button variant="secondary" onClick={() => setShowSuccess(false)}>
                      Yeni Varlık Ekle
                    </Button>
                  </div>
                </div>
              </Card>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Main Content Area */}
        <div className="lg:ml-72">
          {/* Header */}
          <DashboardHeader title="Yeni Varlık Ekle" breadcrumbItems={breadcrumbItems} />
          {/* Main Content */}
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header Actions */}
            <div className="flex justify-between items-center mb-6">
              <Link href="/dashboard/units">
                <Button variant="ghost" icon={ArrowLeft}>
                  Geri Dön
                </Button>
              </Link>
              <div className="flex gap-3">
                <Link href="/dashboard/units">
                  <Button variant="secondary">İptal</Button>
                </Link>
                <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-primary-gold/10 dark:bg-primary-gold/20 border border-primary-gold/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary-gold mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                    Varlık bilgilerini detaylı olarak girerek sisteme kaydedin
                  </p>
                  <p className="text-xs text-text-light-muted dark:text-text-muted mt-1">
                    Varlık kaydedildikten sonra detay sayfasından tüm bilgileri ekleyebilir ve düzenleyebilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Varlık Temel Bilgileri */}
              <Card>
                <div className="p-6">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-text-on-light dark:text-text-on-dark flex items-center justify-center gap-2">
                      <Hash className="h-6 w-6 text-primary-gold" />
                      VARLIK TEMEL BİLGİLERİ
                    </h2>
                    <div className="w-24 h-1 bg-primary-gold rounded mx-auto mt-2"></div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Varlık Numarası */}
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Varlık Numarası *
                      </label>
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={formData.assetNumberAuto}
                          onChange={e => handleInputChange("assetNumberAuto", e.target.checked)}
                          label="Otomatik oluştur"
                        />
                        <input
                          type="text"
                          className={`flex-1 px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.assetNumber ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                          placeholder="Varlık numarası"
                          value={formData.assetNumber}
                          onChange={e => handleInputChange("assetNumber", e.target.value)}
                          disabled={formData.assetNumberAuto}
                        />
                      </div>
                      {errors.assetNumber && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.assetNumber}</p>
                      )}
                    </div>

                    {/* Varlık Adı */}
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Varlık Adı/Tanımı *
                      </label>
                      <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.assetName ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                        placeholder="Örn: A Blok 3. Kat 12 No'lu Daire"
                        value={formData.assetName}
                        onChange={e => handleInputChange("assetName", e.target.value)}
                      />
                      {errors.assetName && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.assetName}</p>
                      )}
                    </div>

                    {/* Varlık Türü ve Durum */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                          Ana Varlık Türü *
                        </label>
                        <div className="space-y-2">
                          {mockAssetTypes.map(type => (
                            <label key={type.value} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="assetType"
                                value={type.value}
                                checked={formData.assetType === type.value}
                                onChange={e => handleInputChange("assetType", e.target.value)}
                                className="text-primary-gold focus:ring-primary-gold"
                              />
                              <span className="text-text-on-light dark:text-text-on-dark">{type.label}</span>
                            </label>
                          ))}
                        </div>
                        {errors.assetType && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.assetType}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                          Durum *
                        </label>
                        <select
                          className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.status ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                          value={formData.status}
                          onChange={e => handleInputChange("status", e.target.value)}
                        >
                          <option value="">Seçiniz</option>
                          {mockStatusOptions.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                        {errors.status && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.status}</p>
                        )}
                      </div>
                    </div>

                    {/* Adres Bilgileri */}
                    <div>
                      <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary-gold" />
                        Adres ve Konum Bilgileri
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                            Blok *
                          </label>
                          <select
                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.block ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                            value={formData.block}
                            onChange={e => handleInputChange("block", e.target.value)}
                          >
                            <option value="">Seçiniz</option>
                            {mockBlocks.map(block => (
                              <option key={block} value={block}>{block} Blok</option>
                            ))}
                          </select>
                          {errors.block && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.block}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                            Kat *
                          </label>
                          <select
                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.floor ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                            value={formData.floor}
                            onChange={e => handleInputChange("floor", e.target.value)}
                          >
                            <option value="">Seçiniz</option>
                            {mockFloors.map(floor => (
                              <option key={floor} value={floor}>{floor}</option>
                            ))}
                          </select>
                          {errors.floor && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.floor}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                            Daire/Villa No *
                          </label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.unitNumber ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                            placeholder="Örn: 12"
                            value={formData.unitNumber}
                            onChange={e => handleInputChange("unitNumber", e.target.value)}
                          />
                          {errors.unitNumber && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.unitNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Harita ve Plan Konumları */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                          Harita Üzerinde Konum
                        </label>
                        <div className="w-full h-32 bg-background-light-soft dark:bg-background-soft border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Map className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-text-light-muted dark:text-text-muted">
                              Harita konum işaretleme
                            </p>
                            <p className="text-xs text-text-light-muted dark:text-text-muted">
                              (Yakında eklenecek)
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                          Plan/Kroki Üzerinde Konum
                        </label>
                        <div className="w-full h-32 bg-background-light-soft dark:bg-background-soft border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Layers className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-text-light-muted dark:text-text-muted">
                              Plan konum işaretleme
                            </p>
                            <p className="text-xs text-text-light-muted dark:text-text-muted">
                              (Yakında eklenecek)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Varlık Detay Bilgileri */}
              <Card>
                <div className="p-6">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-text-on-light dark:text-text-on-dark flex items-center justify-center gap-2">
                      <Home className="h-6 w-6 text-primary-gold" />
                      VARLIK DETAY BİLGİLERİ
                    </h2>
                    <div className="w-24 h-1 bg-primary-gold rounded mx-auto mt-2"></div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Alan ve Oda Sayısı */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                          Alan (m²) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.area ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                          placeholder="Örn: 145"
                          value={formData.area}
                          onChange={e => handleInputChange("area", e.target.value)}
                        />
                        {errors.area && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.area}</p>
                        )}
                      </div>
                      
                      {formData.assetType === "RESIDENCE" && (
                        <div>
                          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                            Oda Sayısı *
                          </label>
                          <select
                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.roomCount ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                            value={formData.roomCount}
                            onChange={e => handleInputChange("roomCount", e.target.value)}
                          >
                            <option value="">Seçiniz</option>
                            <option value="1+1">1+1</option>
                            <option value="2+1">2+1</option>
                            <option value="3+1">3+1</option>
                            <option value="4+1">4+1</option>
                            <option value="5+1">5+1</option>
                            <option value="6+1">6+1</option>
                          </select>
                          {errors.roomCount && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.roomCount}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Varlık Tipi */}
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Varlık Tipi *
                      </label>
                      <select
                        className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.assetSizeType ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                        value={formData.assetSizeType}
                        onChange={e => handleInputChange("assetSizeType", e.target.value)}
                      >
                        <option value="">Seçiniz</option>
                        {mockAssetSizeTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.assetSizeType && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.assetSizeType}</p>
                      )}
                    </div>

                    {/* Gruplama Alanları */}
                    <div>
                      <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary-gold" />
                        Gruplama Alanları
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                            Gruplama Blok No *
                          </label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.groupingBlock ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                            placeholder="Örn: A-1"
                            value={formData.groupingBlock}
                            onChange={e => handleInputChange("groupingBlock", e.target.value)}
                          />
                          {errors.groupingBlock && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.groupingBlock}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                            Gruplama Mahalle No *
                          </label>
                          <select
                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.groupingNeighborhood ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                            value={formData.groupingNeighborhood}
                            onChange={e => handleInputChange("groupingNeighborhood", e.target.value)}
                          >
                            <option value="">Seçiniz</option>
                            {mockNeighborhoods.map(neighborhood => (
                              <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                            ))}
                          </select>
                          {errors.groupingNeighborhood && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.groupingNeighborhood}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Özel Notlar */}
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Özel Notlar
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold min-h-[80px]"
                        placeholder="Varlık hakkında özel notlar..."
                        value={formData.specialNotes}
                        onChange={e => handleInputChange("specialNotes", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Varlık İçerik Bilgileri (Opsiyonel) */}
              <Card>
                <div className="p-6">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-text-on-light dark:text-text-on-dark flex items-center justify-center gap-2">
                      <FileText className="h-6 w-6 text-primary-gold" />
                      VARLIK İÇERİK BİLGİLERİ
                    </h2>
                    <div className="w-24 h-1 bg-primary-gold rounded mx-auto mt-2"></div>
                    <p className="text-sm text-text-light-muted dark:text-text-muted mt-2">
                      Bu bölüm opsiyoneldir, varlık kaydedildikten sonra da eklenebilir
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Demirbaş Listesi */}
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Demirbaş Listesi
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold min-h-[80px]"
                        placeholder="Varlıkta bulunan demirbaş listesi..."
                        value={formData.inventoryList}
                        onChange={e => handleInputChange("inventoryList", e.target.value)}
                      />
                    </div>

                    {/* Mevcut Durumu Fotoğrafları */}
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Mevcut Durumu (Fotoğraflar)
                      </label>
                      <div className="w-full h-32 bg-background-light-soft dark:bg-background-soft border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-text-light-muted dark:text-text-muted">
                            Fotoğraf yükleme
                          </p>
                          <p className="text-xs text-text-light-muted dark:text-text-muted">
                            (Yakında eklenecek)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Teknik Özellikler */}
                    <div>
                      <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                        Teknik Özellikler
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold min-h-[80px]"
                        placeholder="Teknik özellikler, sistemler, ekipmanlar..."
                        value={formData.technicalSpecs}
                        onChange={e => handleInputChange("technicalSpecs", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button variant="primary" size="lg" type="submit" className="px-12" disabled={isSubmitting}>
                  {isSubmitting ? 'Kaydediliyor...' : 'Varlığı Kaydet'}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}