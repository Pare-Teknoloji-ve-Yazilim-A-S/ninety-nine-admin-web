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
import { usePropertyDetail } from "@/hooks/usePropertyDetail";
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
} from "lucide-react";

const statusConfig = {
  AVAILABLE: { label: "Boş", color: "info", icon: AlertCircle },
  OCCUPIED: { label: "Dolu", color: "success", icon: CheckCircle },
  UNDER_MAINTENANCE: { label: "Bakımda", color: "warning", icon: RotateCcw },
  RESERVED: { label: "Rezerve", color: "primary", icon: Calendar },
};

const typeConfig = {
  RESIDENCE: { label: "Daire", icon: Building, color: "primary" },
  VILLA: { label: "Villa", icon: Home, color: "success" },
  COMMERCIAL: { label: "Ticari", icon: Store, color: "info" },
  PARKING: { label: "Otopark", icon: Car, color: "warning" },
};

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: property, loading, error } = usePropertyDetail(propertyId);

  const breadcrumbItems = [
    { label: "Ana Sayfa", href: "/dashboard" },
    { label: "Konutlar", href: "/dashboard/units" },
    { label: property?.name || "Konut Detayı", active: true },
  ];

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

  if (error || !property) {
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

  const statusInfo = statusConfig[property.status as keyof typeof statusConfig];
  const typeInfo = typeConfig[property.type as keyof typeof typeConfig];

  // Helper to map color to allowed Badge color
  const mapBadgeColor = (color: string | undefined): 'primary' | 'secondary' | 'gold' | 'red' | 'accent' | undefined => {
    if (!color) return undefined;
    if (color === 'info' || color === 'success' || color === 'primary') return 'primary';
    if (color === 'warning') return 'gold';
    if (color === 'red') return 'red';
    if (color === 'secondary') return 'secondary';
    return undefined;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:ml-72">
          <DashboardHeader title={property.name} breadcrumbItems={breadcrumbItems} />
          <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/dashboard/units">
                <Button variant="ghost" icon={ArrowLeft}>
                  Geri Dön
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                {property.name}
              </h1>
              <Badge variant="soft" color={mapBadgeColor(typeInfo?.color)}>
                {typeInfo?.label || property.type}
              </Badge>
              {statusInfo && (
                <Badge variant="soft" color={mapBadgeColor(statusInfo.color)} className="flex items-center gap-1">
                  <statusInfo.icon className="h-4 w-4 mr-1" />
                  {statusInfo.label}
                </Badge>
              )}
            </div>

            <Card>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-text-light-muted dark:text-text-muted">Konut Numarası</p>
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">
                      {property.propertyNumber || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-light-muted dark:text-text-muted">Konut Grubu</p>
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">
                      {property.propertyGroup || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-light-muted dark:text-text-muted">Alan (m²)</p>
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">
                      {property.area || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-light-muted dark:text-text-muted">Blok</p>
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">
                      {property.blockNumber || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-light-muted dark:text-text-muted">Kat</p>
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">
                      {property.floor ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-light-muted dark:text-text-muted">Durum</p>
                    <p className="font-medium text-text-on-light dark:text-text-on-dark">
                      {statusInfo?.label || property.status}
                    </p>
                  </div>
                </div>
                {property.bills && property.bills.length > 0 && (
                  <div className="mt-6 p-4 bg-primary-red/10 dark:bg-primary-red/20 rounded-lg">
                    <div className="text-sm text-primary-red font-medium">
                      Ödenmemiş Faturalar Var
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 