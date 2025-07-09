'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './components/auth/AuthProvider';
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import {
  Building,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  Bell,
  Activity,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench,
  CreditCard
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while determining authentication status
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          99Club Admin
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Yükleniyor...
        </p>
      </div>
    </div>
  );
}

export function Home() {
  // Örnek veriler
  const metrics = [
    {
      title: 'Toplam Konut',
      value: '2,500',
      icon: Building,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Dolu Konutlar',
      value: '2,350',
      subtitle: '(%94)',
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Bu Ay Tahsilat',
      value: '₺4.2M',
      subtitle: '↑ %12',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Açık Talepler',
      value: '47',
      subtitle: '↓ %8',
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  const recentTransactions = [
    { date: '2024-01-15', type: 'Aidat Ödemesi', unit: 'A-101', amount: '₺2,500', status: 'completed' },
    { date: '2024-01-15', type: 'Bakım Ücreti', unit: 'B-205', amount: '₺800', status: 'pending' },
    { date: '2024-01-14', type: 'Aidat Ödemesi', unit: 'C-301', amount: '₺2,500', status: 'completed' },
    { date: '2024-01-14', type: 'Elektrik Faturası', unit: 'A-105', amount: '₺450', status: 'completed' },
    { date: '2024-01-13', type: 'Su Faturası', unit: 'B-203', amount: '₺280', status: 'failed' }
  ];

  const serviceRequests = [
    { title: 'Asansör Arızası', unit: 'B Blok', priority: 'high', time: '2 saat önce' },
    { title: 'Su Tesisatı', unit: 'A-105', priority: 'medium', time: '4 saat önce' },
    { title: 'Elektrik Kesintisi', unit: 'C Blok', priority: 'high', time: '6 saat önce' },
    { title: 'Bahçe Bakımı', unit: 'Ortak Alan', priority: 'low', time: '1 gün önce' }
  ];

  const quickActions = [
    { label: 'Yeni Duyuru', href: '/duyurular/yeni', icon: Bell, color: 'bg-blue-500' },
    { label: 'Ödeme Kaydı', href: '/finans/odeme', icon: CreditCard, color: 'bg-green-500' },
    { label: 'Sakin Ekle', href: '/sakinler/yeni', icon: Users, color: 'bg-purple-500' },
    { label: 'Talep Oluştur', href: '/hizmet-talepleri/yeni', icon: Wrench, color: 'bg-orange-500' }
  ];

  const todayEvents = [
    { time: '09:00', title: 'Asansör Bakımı', location: 'A Blok' },
    { time: '14:00', title: 'Yönetim Toplantısı', location: 'Toplantı Salonu' },
    { time: '16:00', title: 'Bahçe Bakımı', location: 'Ortak Alanlar' }
  ];

  const recentActivities = [
    { time: '5 dk önce', action: 'Yeni sakin kaydı oluşturuldu', user: 'A-301' },
    { time: '12 dk önce', action: 'Aidat ödemesi alındı', user: 'B-205' },
    { time: '25 dk önce', action: 'Hizmet talebi tamamlandı', user: 'C-101' },
    { time: '1 saat önce', action: 'Duyuru yayınlandı', user: 'Admin' }
  ];

  return (
    <div className="flex h-screen bg-background-primary">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-background-card border-b border-primary-dark-gray/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary font-helvetica">Dashboard</h1>
              <p className="text-sm text-text-secondary font-inter">99Club Site Yönetim Paneli</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Sistem Aktif</span>
              </div>
              <div className="text-sm text-text-secondary">
                Son güncelleme: {new Date().toLocaleString('tr-TR')}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Özet Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="bg-background-card rounded-xl border border-primary-dark-gray/10 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${metric.textColor}`} />
                    </div>
                    {metric.trend && (
                      <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-1">{metric.title}</h3>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold text-text-primary">{metric.value}</p>
                      {metric.subtitle && (
                        <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' :
                          metric.trend === 'down' ? 'text-red-600' : 'text-text-secondary'
                          }`}>
                          {metric.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* İçerik Alanı */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol Kolon - %60 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Aidat Tahsilat Grafiği */}
              <div className="bg-background-card rounded-xl border border-primary-dark-gray/10 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 font-helvetica">Aidat Tahsilat Trendi</h3>
                <div className="h-64 bg-background-secondary/30 rounded-lg flex items-center justify-center">
                  <p className="text-text-secondary">Son 6 ay aidat tahsilat grafiği burada görünecek</p>
                </div>
              </div>

              {/* Son İşlemler */}
              <div className="bg-background-card rounded-xl border border-primary-dark-gray/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary font-helvetica">Son İşlemler</h3>
                  <a href="/finans/odeme-gecmisi" className="text-sm text-text-accent hover:underline">Tümünü Gör</a>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-primary-dark-gray/10">
                      <tr>
                        <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wide py-3">Tarih</th>
                        <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wide py-3">İşlem Tipi</th>
                        <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wide py-3">Konut No</th>
                        <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wide py-3">Tutar</th>
                        <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wide py-3">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-dark-gray/10">
                      {recentTransactions.map((transaction, index) => (
                        <tr key={index} className="hover:bg-background-secondary/20">
                          <td className="py-3 text-sm text-text-secondary">{transaction.date}</td>
                          <td className="py-3 text-sm text-text-primary">{transaction.type}</td>
                          <td className="py-3 text-sm text-text-primary font-medium">{transaction.unit}</td>
                          <td className="py-3 text-sm text-text-primary font-medium">{transaction.amount}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                              {transaction.status === 'completed' ? 'Tamamlandı' :
                                transaction.status === 'pending' ? 'Beklemede' : 'Başarısız'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bakım/Arıza Talepleri */}
              <div className="bg-background-card rounded-xl border border-primary-dark-gray/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary font-helvetica">Aktif Hizmet Talepleri</h3>
                  <a href="/hizmet-talepleri" className="text-sm text-text-accent hover:underline">Tümünü Gör</a>
                </div>
                <div className="space-y-3">
                  {serviceRequests.map((request, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-background-secondary/20">
                      <div className={`p-2 rounded-lg ${request.priority === 'high' ? 'bg-red-100' :
                        request.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                        <AlertTriangle className={`w-4 h-4 ${request.priority === 'high' ? 'text-red-600' :
                          request.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{request.title}</p>
                        <p className="text-xs text-text-secondary">{request.unit} • {request.time}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${request.priority === 'high' ? 'bg-red-100 text-red-800' :
                        request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {request.priority === 'high' ? 'Acil' :
                          request.priority === 'medium' ? 'Normal' : 'Düşük'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ Kolon - %40 */}
            <div className="space-y-6">
              {/* Hızlı İşlemler */}
              <div className="bg-background-card rounded-xl border border-primary-dark-gray/10 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 font-helvetica">Hızlı İşlemler</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <a
                        key={index}
                        href={action.href}
                        className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-primary-dark-gray/10 hover:bg-background-secondary/20 transition-all duration-200"
                      >
                        <div className={`p-3 rounded-lg ${action.color}`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-text-primary text-center">{action.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Doluluk Haritası */}
              <div className="bg-background-card rounded-xl border border-primary-dark-gray/10 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 font-helvetica">Doluluk Haritası</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background-secondary/20">
                    <span className="text-sm font-medium text-text-primary">A Blok</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-background-secondary rounded-full">
                        <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-text-secondary">95%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background-secondary/20">
                    <span className="text-sm font-medium text-text-primary">B Blok</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-background-secondary rounded-full">
                        <div className="w-22 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-text-secondary">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background-secondary/20">
                    <span className="text-sm font-medium text-text-primary">C Blok</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-background-secondary rounded-full">
                        <div className="w-18 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-text-secondary">88%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bugünün Ajandası */}
              <div className="bg-background-card rounded-xl border border-primary-dark-gray/10 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 font-helvetica">Bugünün Ajandası</h3>
                <div className="space-y-3">
                  {todayEvents.map((event, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background-secondary/20">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary-gold" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{event.title}</p>
                        <p className="text-xs text-text-secondary">{event.time} • {event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Son Aktiviteler */}
              <div className="bg-background-card rounded-xl border border-primary-dark-gray/10 p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 font-helvetica">Son Aktiviteler</h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background-secondary/20">
                      <div className="flex-shrink-0 w-8 h-8 bg-background-secondary/50 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-text-primary">{activity.action}</p>
                        <p className="text-xs text-text-secondary">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-background-card border-t border-primary-dark-gray/20 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online Sakinler: 1,247</span>
              </div>
              <span>Son Yedekleme: Bugün 03:00</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>99Club Admin v2.1.0</span>
              <a href="/destek" className="text-text-accent hover:underline">Destek</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}