"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";
import DashboardHeader from "@/app/dashboard/components/DashboardHeader";
import Sidebar from "@/app/components/ui/Sidebar";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import { useUnitDetail } from "@/hooks/useUnitDetail";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/app/components/ui/Toast";
import BasicInfoSection from "./components/BasicInfoSection";
import OwnerInfoSection from "./components/OwnerInfoSection";
import TenantInfoSection from "./components/TenantInfoSection";
import ResidentsSection from "./components/ResidentsSection";
import FinancialSummarySection from "./components/FinancialSummarySection";
import {
  Building,
  Home,
  Store,
  Car,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Calendar,
  Edit,
  Phone,
  MessageSquare,
  Settings,
  Users,
  DollarSign,
  Zap,
  Wrench,
  UserCheck,
  FileText
} from "lucide-react";

export default function UnitDetailPage() {
  const params = useParams();
  const unitId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'residents' | 'financial' | 'consumption' | 'maintenance' | 'visitors' | 'documents'>('residents');
  const toast = useToast();
  
  const { 
    unit, 
    loading, 
    error, 
    refetch,
    updateBasicInfo,
    updateNotes
  } = useUnitDetail(unitId);

  const breadcrumbItems = [
    { label: "Ana Sayfa", href: "/dashboard" },
    { label: "Konutlar", href: "/dashboard/units" },
    { label: unit?.apartmentNumber || "Konut Detayı", active: true },
  ];

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-semantic-success-500" />;
      case 'maintenance': return <RotateCcw className="h-4 w-4 text-semantic-warning-500" />;
      case 'renovation': return <Settings className="h-4 w-4 text-primary-gold" />;
      case 'inactive': return <AlertCircle className="h-4 w-4 text-primary-red" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string): 'primary' | 'secondary' | 'gold' | 'red' => {
    switch (status) {
      case 'active': return 'primary';
      case 'maintenance': return 'gold';
      case 'renovation': return 'secondary';
      case 'inactive': return 'red';
      default: return 'secondary';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="lg:ml-72">
            <DashboardHeader title="Konut Detayı" breadcrumbItems={breadcrumbItems} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-6">
                  <div className="h-64 bg-gray-200 rounded"></div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !unit) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-primary">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="lg:ml-72">
            <DashboardHeader title="Hata" breadcrumbItems={breadcrumbItems} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Card className="text-center">
                <div className="p-8">
                  <AlertCircle className="h-12 w-12 text-primary-red mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark mb-2">
                    Konut bulunamadı
                  </h2>
                  <p className="text-text-light-secondary dark:text-text-secondary mb-6">
                    {error || "Konut detayı yüklenemedi."}
                  </p>
                  <Link href="/dashboard/units">
                    <Button variant="primary">Konut Listesine Dön</Button>
                  </Link>
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
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="lg:ml-72">
          {/* Header */}
          <DashboardHeader
            title={unit?.apartmentNumber || 'Konut Detayı'}
            breadcrumbItems={breadcrumbItems}
          />

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Link href="/dashboard/units">
                  <Button variant="ghost" icon={ArrowLeft}>
                    Geri Dön
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                      {unit?.apartmentNumber || 'Yükleniyor...'}
                    </h1>
                    {unit && (
                      <>
                        {getStatusIcon(unit.status)}
                        <Badge variant="soft" color={getStatusColor(unit.status)}>
                          {unit.basicInfo.data.status.options.find(opt => 
                            typeof opt === 'object' && opt.value === unit.status
                          )?.label || unit.status}
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                    {unit?.block} Blok • {unit?.floor}. Kat • {unit?.area} m²
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" icon={Phone}>
                  İletişim
                </Button>
                <Button variant="secondary" icon={MessageSquare}>
                  Note Ekle
                </Button>
                <Button variant="primary" icon={Edit}>
                  Düzenle
                </Button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Unit Summary */}
                <Card className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-lg bg-primary-gold/10 flex items-center justify-center">
                        <Building className="h-12 w-12 text-primary-gold" />
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-text-on-light dark:text-text-on-dark">
                          {unit?.apartmentNumber}
                        </h2>
                        <Badge variant="soft" color="primary">
                          {unit?.type}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-text-light-muted dark:text-text-muted">Blok</p>
                          <p className="font-medium text-text-on-light dark:text-text-on-dark">
                            {unit?.block}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-light-muted dark:text-text-muted">Kat</p>
                          <p className="font-medium text-text-on-light dark:text-text-on-dark">
                            {unit?.floor}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-light-muted dark:text-text-muted">Alan</p>
                          <p className="font-medium text-text-on-light dark:text-text-on-dark">
                            {unit?.area} m²
                          </p>
                        </div>
                        <div>
                          <p className="text-text-light-muted dark:text-text-muted">Durum</p>
                          <Badge variant="soft" color={getStatusColor(unit?.status || 'inactive')}>
                            {unit?.basicInfo.data.status.options.find(opt => 
                              typeof opt === 'object' && opt.value === unit.status
                            )?.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Basic Info Section */}
                {unit?.basicInfo && (
                  <BasicInfoSection
                    basicInfo={unit.basicInfo}
                    onUpdate={updateBasicInfo}
                    loading={loading}
                    canEdit={unit.permissions.canEdit}
                  />
                )}

                {/* Tabbed Content Section */}
                <Card className="mt-6">
                  <div className="p-0">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 pt-6">
                      <nav className="flex space-x-4" aria-label="Tabs">
                        {[
                          { label: "Sakinler", key: "residents", icon: Users },
                          { label: "Finansal", key: "financial", icon: DollarSign },
                          { label: "Tüketim", key: "consumption", icon: Zap },
                          { label: "Bakım", key: "maintenance", icon: Wrench },
                          { label: "Ziyaretçiler", key: "visitors", icon: UserCheck },
                          { label: "Belgeler", key: "documents", icon: FileText }
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            className={
                              (activeTab === tab.key
                                ? "text-primary-gold border-primary-gold"
                                : "text-text-light-secondary dark:text-text-secondary border-transparent hover:text-primary-gold hover:border-primary-gold/60") +
                              " px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2"
                            }
                            onClick={() => setActiveTab(tab.key as any)}
                            type="button"
                          >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                          </button>
                        ))}
                      </nav>
                    </div>
                    <div className="px-6 py-6">
                      {activeTab === "residents" && unit && (
                        <ResidentsSection
                          residents={unit.residents}
                          loading={loading}
                          canEdit={unit.permissions.canManageResidents}
                        />
                      )}
                      {activeTab === "financial" && unit && (
                        <FinancialSummarySection
                          financialSummary={unit.financialSummary}
                          loading={loading}
                        />
                      )}
                      {activeTab === "consumption" && (
                        <div className="text-center py-8">
                          <Zap className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                          <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Tüketim Verileri
                          </h3>
                          <p className="text-sm text-text-light-muted dark:text-text-muted">
                            Elektrik, su ve gaz tüketim verileri burada görüntülenecek.
                          </p>
                        </div>
                      )}
                      {activeTab === "maintenance" && (
                        <div className="text-center py-8">
                          <Wrench className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                          <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Bakım Geçmişi
                          </h3>
                          <p className="text-sm text-text-light-muted dark:text-text-muted">
                            Bu konut için bakım kayıtları burada görüntülenecek.
                          </p>
                        </div>
                      )}
                      {activeTab === "visitors" && (
                        <div className="text-center py-8">
                          <UserCheck className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                          <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Ziyaretçi Geçmişi
                          </h3>
                          <p className="text-sm text-text-light-muted dark:text-text-muted">
                            Bu konut için ziyaretçi kayıtları burada görüntülenecek.
                          </p>
                        </div>
                      )}
                      {activeTab === "documents" && (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-text-light-muted dark:text-text-muted mx-auto mb-4" />
                          <h3 className="text-sm font-medium text-text-on-light dark:text-text-on-dark mb-2">
                            Belgeler
                          </h3>
                          <p className="text-sm text-text-light-muted dark:text-text-muted">
                            Bu konut için belgeler burada görüntülenecek.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Owner Information */}
                {unit?.ownerInfo && (
                  <OwnerInfoSection
                    ownerInfo={unit.ownerInfo}
                    loading={loading}
                    canEdit={unit.permissions.canEdit}
                  />
                )}

                {/* Tenant Information */}
                <TenantInfoSection
                  tenantInfo={unit?.tenantInfo}
                  loading={loading}
                  canEdit={unit?.permissions.canEdit}
                />

                {/* Financial Summary Sidebar */}
                {unit?.financialSummary && (
                  <Card>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary-gold" />
                        Finansal Durum
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-4">
                          <p className="text-sm text-text-light-muted dark:text-text-muted">Güncel Bakiye</p>
                          <p className={`text-lg font-semibold ${unit.financialSummary.data.currentBalance.value < 0 ? 'text-primary-red' : 'text-primary-gold'}`}>
                            {new Intl.NumberFormat('tr-TR').format(Math.abs(unit.financialSummary.data.currentBalance.value))} {unit.financialSummary.data.currentBalance.currency}
                          </p>
                        </div>
                        <Button 
                          variant="primary" 
                          className="w-full" 
                          onClick={() => setActiveTab('financial')}
                        >
                          Finansal Detayları Gör
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Notes */}
                {unit?.notes.data.generalNotes?.value && (
                  <Card>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary-gold" />
                        Notlar
                      </h3>
                      <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                        {unit.notes.data.generalNotes.value}
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </ProtectedRoute>
  );
} 