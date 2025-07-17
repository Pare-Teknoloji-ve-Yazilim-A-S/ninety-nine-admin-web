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
    { label: property?.data?.name || "Konut Detayı", active: true },
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

  const statusInfo = statusConfig[property.data.status as keyof typeof statusConfig];
  const typeInfo = typeConfig[property.data.type as keyof typeof typeConfig];

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
      <div className="min-h-screen bg-gradient-to-br from-background-light-primary via-background-light-secondary to-primary-gold-light/30 dark:from-background-primary dark:via-background-secondary dark:to-background-card flex flex-col min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:ml-72 flex flex-col flex-1">
          <DashboardHeader title={property.data.name} breadcrumbItems={breadcrumbItems} />
          <main className="flex flex-col items-center flex-1 w-full py-12 px-4 sm:px-8 lg:px-16">
            <div className="w-full max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                <Link href="/dashboard/units">
                  <Button variant="ghost" icon={ArrowLeft}>
                    Geri Dön
                  </Button>
                </Link>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-text-on-light dark:text-on-dark tracking-tight mb-1 flex items-center gap-3">
                    <span className="text-primary-gold">{property.data.name}</span>
                    <span className="inline-block">
                      <Badge variant="soft" color={mapBadgeColor(typeInfo?.color)} className="text-lg px-4 py-1 rounded-xl shadow-md flex items-center gap-2">
                        {typeInfo?.icon && <typeInfo.icon className="h-5 w-5 mr-1" />}
                        {typeInfo?.label || property.data.type}
                      </Badge>
                    </span>
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    {statusInfo && (
                      <Badge variant="soft" color={mapBadgeColor(statusInfo.color)} className="flex items-center gap-2 px-3 py-1 rounded-lg shadow-sm text-base">
                        <statusInfo.icon className="h-4 w-4 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Card className="rounded-2xl shadow-xl border border-primary-gold/10 bg-background-light-card/80 dark:bg-background-card/80 backdrop-blur-md">
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-background-light-soft dark:bg-background-soft rounded-xl p-5 shadow-sm border border-primary-gold/5">
                      <p className="text-text-light-muted dark:text-text-muted text-sm mb-1">Konut Numarası</p>
                      <p className="font-semibold text-lg text-text-on-dark">{property.data.propertyNumber || "-"}</p>
                    </div>
                    <div className="bg-background-light-soft dark:bg-background-soft rounded-xl p-5 shadow-sm border border-primary-gold/5">
                      <p className="text-text-light-muted dark:text-text-muted text-sm mb-1">Konut Grubu</p>
                      <p className="font-semibold text-lg text-text-on-dark">{property.data.propertyGroup || "-"}</p>
                    </div>
                    <div className="bg-background-light-soft dark:bg-background-soft rounded-xl p-5 shadow-sm border border-primary-gold/5">
                      <p className="text-text-light-muted dark:text-text-muted text-sm mb-1">Alan (m²)</p>
                      <p className="font-semibold text-lg text-text-on-dark">{property.data.area || "-"}</p>
                    </div>
                    <div className="bg-background-light-soft dark:bg-background-soft rounded-xl p-5 shadow-sm border border-primary-gold/5">
                      <p className="text-text-light-muted dark:text-text-muted text-sm mb-1">Blok</p>
                      <p className="font-semibold text-lg text-text-on-dark">{property.data.blockNumber || "-"}</p>
                    </div>
                    <div className="bg-background-light-soft dark:bg-background-soft rounded-xl p-5 shadow-sm border border-primary-gold/5">
                      <p className="text-text-light-muted dark:text-text-muted text-sm mb-1">Kat</p>
                      <p className="font-semibold text-lg text-text-on-dark">{property.data.floor ?? "-"}</p>
                    </div>
                    <div className="bg-background-light-soft dark:bg-background-soft rounded-xl p-5 shadow-sm border border-primary-gold/5">
                      <p className="text-text-light-muted dark:text-text-muted text-sm mb-1">Durum</p>
                      <p className="font-semibold text-lg text-text-on-dark">{statusInfo?.label || property.status}</p>
                    </div>
                  </div>
                  {/* Fatura Durumu */}
                  {property.data.bills && property.data.bills.length > 0 && (() => {
                    const unpaidBills = property.data.bills.filter((bill: any) => bill.status !== "PAID");
                    const allPaid = unpaidBills.length === 0;
                    if (allPaid) {
                      return (
                        <div className="mt-8 p-6 bg-semantic-success/10 dark:bg-semantic-success/20 rounded-xl border border-semantic-success/20 flex items-center gap-4">
                          <CheckCircle className="h-6 w-6 text-semantic-success-600" />
                          <div className="text-base text-semantic-success-600 font-semibold">
                            Tüm faturalar ödendi
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="mt-8 p-6 bg-primary-red/10 dark:bg-primary-red/20 rounded-xl border border-primary-red/20">
                          <div className="flex items-center gap-4 mb-2">
                            <AlertCircle className="h-6 w-6 text-primary-red" />
                            <div className="text-base text-primary-red font-semibold">
                              Ödenmemiş Faturalar Var
                            </div>
                          </div>
                          <ul className="space-y-2 mt-2">
                            {unpaidBills.map((bill: any) => (
                              <li key={bill.id} className="flex flex-col md:flex-row md:items-center md:gap-6 bg-background-light-soft dark:bg-background-soft rounded-lg p-3 border border-primary-red/10">
                                <span className="font-medium text-text-on-dark">{bill.title}</span>
                                <span className="text-text-light-secondary dark:text-text-secondary">Tutar: <span className="font-semibold">₺{bill.amount}</span></span>
                                <span className="text-text-light-secondary dark:text-text-secondary">Son Tarih: <span className="font-semibold">{bill.dueDate}</span></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                  })()}
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 