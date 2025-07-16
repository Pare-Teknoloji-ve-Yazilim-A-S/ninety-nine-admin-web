"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";
import DashboardHeader from "@/app/dashboard/components/DashboardHeader";
import Sidebar from "@/app/components/ui/Sidebar";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import Checkbox from "@/app/components/ui/Checkbox";
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
} from "lucide-react";

// Mock blocks and types
const mockBlocks = ["A", "B", "C", "D", "Villa"];
const mockTypes = [
  { value: "RESIDENCE", label: "Daire" },
  { value: "VILLA", label: "Villa" },
  { value: "COMMERCIAL", label: "Ticari Alan" },
];
const mockRoomOptions = ["1+1", "2+1", "3+1", "4+1", "5+1"];
const mockStatusOptions = [
  { value: "AVAILABLE", label: "Boş" },
  { value: "OCCUPIED", label: "Dolu" },
  { value: "UNDER_MAINTENANCE", label: "Bakımda" },
  { value: "RESERVED", label: "Rezerve" },
];

interface FormData {
  block: string;
  propertyNumber: string;
  type: string;
  area: string;
  rooms: string;
  status: string;
  hasParking: boolean;
  hasStorage: boolean;
  description: string;
}

export default function AddUnitPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    block: "",
    propertyNumber: "",
    type: "RESIDENCE",
    area: "",
    rooms: "",
    status: "AVAILABLE",
    hasParking: false,
    hasStorage: false,
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const breadcrumbItems = [
    { label: "Ana Sayfa", href: "/dashboard" },
    { label: "Konutlar", href: "/dashboard/units" },
    { label: "Yeni Konut Ekle", active: true },
  ];

  // Validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.block) newErrors.block = "Blok seçimi zorunludur";
    if (!formData.propertyNumber) newErrors.propertyNumber = "Daire/Villa No zorunludur";
    if (!formData.type) newErrors.type = "Tip seçimi zorunludur";
    if (!formData.area) newErrors.area = "Alan zorunludur";
    if (!formData.rooms) newErrors.rooms = "Oda sayısı zorunludur";
    if (!formData.status) newErrors.status = "Durum seçimi zorunludur";
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
    if (validateForm()) {
      setShowSuccess(true);
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
                    Konut başarıyla kaydedildi!
                  </h2>
                  <p className="text-text-light-secondary dark:text-text-secondary mb-2">
                    {formData.block} Blok, {formData.propertyNumber} - {mockTypes.find(t => t.value === formData.type)?.label}
                  </p>
                  <p className="text-sm text-text-light-muted dark:text-text-muted mb-6">
                    Kayıt No: #U-{Math.floor(Math.random() * 9999).toString().padStart(4, "0")}
                  </p>
                  <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                      Şimdi ne yapmak istersiniz?
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/dashboard/units">
                      <Button variant="primary">Konut Listesine Dön</Button>
                    </Link>
                    <Button variant="secondary" onClick={() => setShowSuccess(false)}>
                      Yeni Konut Ekle
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
          <DashboardHeader title="Yeni Konut Ekle" breadcrumbItems={breadcrumbItems} />
          {/* Main Content */}
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <Button variant="primary" onClick={handleSubmit}>
                  Kaydet
                </Button>
              </div>
            </div>
            {/* Info Banner */}
            <div className="bg-primary-gold/10 dark:bg-primary-gold/20 border border-primary-gold/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary-gold mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-text-on-light dark:text-text-on-dark">
                    Temel bilgileri girerek konutu kaydedin, detayları sonra ekleyin
                  </p>
                  <p className="text-xs text-text-light-muted dark:text-text-muted mt-1">
                    Konut kaydedildikten sonra detay sayfasından tüm bilgileri ekleyebilir ve düzenleyebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
            {/* Main Form */}
            <form onSubmit={handleSubmit}>
              <Card>
                <div className="p-6">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-text-on-light dark:text-text-on-dark">
                      KONUT BİLGİLERİ
                    </h2>
                    <div className="w-24 h-1 bg-primary-gold rounded mx-auto mt-2"></div>
                  </div>
                  <div className="space-y-8">
                    {/* Block, Number, Type */}
                    <div>
                      <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary-gold" />
                        Temel Bilgiler
                      </h3>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Block */}
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
                        {/* Property Number */}
                        <div>
                          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                            Daire/Villa No *
                          </label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.propertyNumber ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                            placeholder="Örn: 12"
                            value={formData.propertyNumber}
                            onChange={e => handleInputChange("propertyNumber", e.target.value)}
                          />
                          {errors.propertyNumber && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.propertyNumber}</p>
                          )}
                        </div>
                        {/* Type */}
                        <div>
                          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                            Tip *
                          </label>
                          <select
                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.type ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                            value={formData.type}
                            onChange={e => handleInputChange("type", e.target.value)}
                          >
                            <option value="">Seçiniz</option>
                            {mockTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                          {errors.type && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.type}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Area, Rooms, Status */}
                    <div>
                      <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                        <Home className="h-5 w-5 text-primary-gold" />
                        Detaylar
                      </h3>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Area */}
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
                        {/* Rooms */}
                        <div>
                          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
                            Oda Sayısı *
                          </label>
                          <select
                            className={`w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold ${errors.rooms ? "border-red-300 dark:border-red-600" : "border-gray-200 dark:border-gray-700"}`}
                            value={formData.rooms}
                            onChange={e => handleInputChange("rooms", e.target.value)}
                          >
                            <option value="">Seçiniz</option>
                            {mockRoomOptions.map(room => (
                              <option key={room} value={room}>{room}</option>
                            ))}
                          </select>
                          {errors.rooms && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.rooms}</p>
                          )}
                        </div>
                        {/* Status */}
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
                    </div>
                    {/* Extras */}
                    <div>
                      <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                        <Store className="h-5 w-5 text-primary-gold" />
                        Ekstralar
                      </h3>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Checkbox
                          checked={formData.hasParking}
                          onChange={e => handleInputChange("hasParking", e.target.checked)}
                          label="Otopark Alanı Var"
                        />
                        <Checkbox
                          checked={formData.hasStorage}
                          onChange={e => handleInputChange("hasStorage", e.target.checked)}
                          label="Depo Alanı Var"
                        />
                      </div>
                    </div>
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                        <Map className="h-5 w-5 text-primary-gold" />
                        Açıklama
                      </h3>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <textarea
                          className="w-full px-3 py-2 border rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold min-h-[80px]"
                          placeholder="Ek açıklama (isteğe bağlı)"
                          value={formData.description}
                          onChange={e => handleInputChange("description", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col items-center gap-2">
                      <Button variant="primary" size="lg" type="submit" className="px-12">
                        Konutu Kaydet
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </form>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 