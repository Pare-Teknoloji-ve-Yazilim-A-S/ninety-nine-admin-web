'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Sidebar from '@/app/components/ui/Sidebar';

// Breadcrumb Items
const BREADCRUMB_ITEMS = [
  { label: 'Ana Sayfa', href: '/dashboard' },
  { label: 'Ayarlar', href: '/dashboard/settings' },
  { label: 'Cihaz Ayarları', active: true }
];

export default function DeviceSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-primary">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content Area */}
        <div className="lg:ml-72">
          {/* Header */}
          <DashboardHeader 
            title="Cihaz Ayarları" 
            breadcrumbItems={BREADCRUMB_ITEMS}
          />
          
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="self-stretch p-6 bg-Table-Bg-Color rounded-md outline outline-1 outline-offset-[-1px] outline-Table-Border-Color inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch justify-center text-zinc-700 text-base font-bold font-['Inter'] leading-normal tracking-tight">
                Cihaz Ayarları
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-4">
                <div className="flex-1 p-6 bg-Table-Bg-Color rounded-lg outline outline-1 outline-offset-[-1px] outline-Table-Border-Color inline-flex flex-col justify-start items-start gap-6">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-center text-zinc-700 text-base font-bold font-['Inter'] leading-normal tracking-tight">
                      Cihaz Türleri
                    </div>
                    <div className="self-stretch justify-center text-Components-Button-Link-Blue-Placeholder-Color text-xs font-medium font-['Inter'] leading-none tracking-tight">
                      42 Cihaz Türü
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-start gap-2">
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Laptop
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Desktop
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Monitör
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Printer
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Scanner
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="White" data-shape="Rounded" data-size="Small" data-type="White" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-White-Bg-Color rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-Components-Badge-Border-Color flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Button-Link-Blue-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            + Yeni Ekle
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 bg-Table-Bg-Color rounded-lg outline outline-1 outline-offset-[-1px] outline-Table-Border-Color inline-flex flex-col justify-start items-start gap-6">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-center text-zinc-700 text-base font-bold font-['Inter'] leading-normal tracking-tight">
                      Cihaz Üreticileri
                    </div>
                    <div className="self-stretch justify-center text-Components-Button-Link-Blue-Placeholder-Color text-xs font-medium font-['Inter'] leading-none tracking-tight">
                      286 Cihaz Üreticisi
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-start gap-2">
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Apple
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            ASUS
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Dell
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            HP
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Toshiba
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="White" data-shape="Rounded" data-size="Small" data-type="White" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-White-Bg-Color rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-Components-Badge-Border-Color flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Button-Link-Blue-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            + Yeni Ekle
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-4">
                <div className="flex-1 p-6 bg-Table-Bg-Color rounded-lg outline outline-1 outline-offset-[-1px] outline-Table-Border-Color inline-flex flex-col justify-start items-start gap-6">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-center text-zinc-700 text-base font-bold font-['Inter'] leading-normal tracking-tight">
                      Cihaz Modelleri
                    </div>
                    <div className="self-stretch justify-center text-Components-Button-Link-Blue-Placeholder-Color text-xs font-medium font-['Inter'] leading-none tracking-tight">
                      1.274 Cihaz Modeli
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-start gap-2">
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Macbook Air
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Macbook Pro
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            ASUS Pro
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            HP G550
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Lenovo Thinkpad
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="White" data-shape="Rounded" data-size="Small" data-type="White" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-White-Bg-Color rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-Components-Badge-Border-Color flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Button-Link-Blue-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            + Yeni Ekle
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 bg-Table-Bg-Color rounded-lg outline outline-1 outline-offset-[-1px] outline-Table-Border-Color inline-flex flex-col justify-start items-start gap-6">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-center text-zinc-700 text-base font-bold font-['Inter'] leading-normal tracking-tight">
                      Cihaz Konumları
                    </div>
                    <div className="self-stretch justify-center text-Components-Button-Link-Blue-Placeholder-Color text-xs font-medium font-['Inter'] leading-none tracking-tight">
                      35 Cihaz Konumu
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-start gap-2">
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            İstanbul
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Ankara
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            İzmir
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Antalya
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            İstanbul - ARGE
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="White" data-shape="Rounded" data-size="Small" data-type="White" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-White-Bg-Color rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-Components-Badge-Border-Color flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Button-Link-Blue-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            + Yeni Ekle
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-4">
                <div className="w-[572px] p-6 bg-Table-Bg-Color rounded-lg outline outline-1 outline-offset-[-1px] outline-Table-Border-Color inline-flex flex-col justify-start items-start gap-6">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-center text-zinc-700 text-base font-bold font-['Inter'] leading-normal tracking-tight">
                      Cihaz Kullanım Durumları
                    </div>
                    <div className="self-stretch justify-center text-Components-Button-Link-Blue-Placeholder-Color text-xs font-medium font-['Inter'] leading-none tracking-tight">
                      3 Cihaz Kullanım Durumu
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-start gap-2">
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Kullanımda
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Kullanım Dışı
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="Dark" data-shape="Rounded" data-size="Small" data-type="Soft" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-Soft-Dark-Bg-Color rounded-md flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Badge-Soft-Dark-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            Bakımda
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-color="White" data-shape="Rounded" data-size="Small" data-type="White" className="flex justify-start items-start">
                      <div data-avatar="false" data-close-icon="false" data-leading-icon="false" data-placeholder="true" data-status="false" data-trailing-icon="false" className="px-[3px] py-px bg-Components-Badge-White-Bg-Color rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-Components-Badge-Border-Color flex justify-start items-center gap-px">
                        <div className="px-[2.50px] flex justify-start items-center gap-1.5">
                          <div className="justify-start text-Components-Button-Link-Blue-Placeholder-Color text-[10px] font-medium font-['Inter'] leading-none tracking-tight">
                            + Yeni Ekle
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
