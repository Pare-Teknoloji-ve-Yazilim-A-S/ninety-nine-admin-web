'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import {
  CREATE_BILLING_PERMISSION_ID
} from '@/app/components/ui/Sidebar';

// Dil çevirileri
const translations = {
  tr: {
    // Page header
    selectTransactionType: 'Yeni İşlem Türü Seçin',
    selectTransactionTypeDesc: 'Oluşturmak istediğiniz işlem türünü seçin',
    
    // Transaction types
    createBill: 'Fatura Oluştur',
    createBillDesc: 'Aidat, bakım, fayda veya ceza faturası oluşturun',
    recordPayment: 'Ödeme Kaydet',
    recordPaymentDesc: 'Mevcut bir faturaya ödeme kaydedin',
    
    // Button
    continue: 'Devam Et',
    
    // Footer
    manageFinancialTransactions: 'Bu sayfadan finansal işlemlerinizi kolayca yönetebilirsiniz.',
    

  },
  en: {
    // Page header
    selectTransactionType: 'Select New Transaction Type',
    selectTransactionTypeDesc: 'Select the type of transaction you want to create',
    
    // Transaction types
    createBill: 'Create Bill',
    createBillDesc: 'Create dues, maintenance, utility or penalty bills',
    recordPayment: 'Record Payment',
    recordPaymentDesc: 'Record payment for an existing bill',
    
    // Button
    continue: 'Continue',
    
    // Footer
    manageFinancialTransactions: 'You can easily manage your financial transactions from this page.',
    

  },
  ar: {
    // Page header
    selectTransactionType: 'اختر نوع المعاملة الجديدة',
    selectTransactionTypeDesc: 'اختر نوع المعاملة التي تريد إنشاءها',
    
    // Transaction types
    createBill: 'إنشاء فاتورة',
    createBillDesc: 'إنشاء فواتير رسوم أو صيانة أو مرافق أو غرامات',
    recordPayment: 'تسجيل دفعة',
    recordPaymentDesc: 'تسجيل دفعة لفاتورة موجودة',
    
    // Button
    continue: 'استمر',
    
    // Footer
    manageFinancialTransactions: 'يمكنك إدارة معاملاتك المالية بسهولة من هذه الصفحة.',
    

  }
};

interface TransactionTypeOption {
  id: 'bill' | 'payment';
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route: string;
}

const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({
  onTypeSelect
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  const router = useRouter();

  // Permission kontrolü - sadece billing için
  const { hasPermission } = usePermissionCheck();
  const hasCreateBillingPermission = hasPermission(CREATE_BILLING_PERMISSION_ID);
  // Payment permission kontrolü kaldırıldı - artık herkes erişebilir

  // Debug logs
  console.log('TransactionTypeSelector - CREATE_BILLING_PERMISSION_ID:', CREATE_BILLING_PERMISSION_ID);
  console.log('TransactionTypeSelector - hasCreateBillingPermission:', hasCreateBillingPermission);

  // Dil tercihini localStorage'dan al
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Çevirileri al
  const t = translations[currentLanguage as keyof typeof translations];

  // Transaction types with translations - sadece izinli olanları göster
  const allTransactionTypes: TransactionTypeOption[] = [
    {
      id: 'bill',
      title: t.createBill,
      description: t.createBillDesc,
      icon: FileText,
      color: 'bg-primary-gold/10 text-primary-gold',
      route: '/dashboard/financial/create/bill'
    },
    {
      id: 'payment',
      title: t.recordPayment,
      description: t.recordPaymentDesc,
      icon: CreditCard,
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      route: '/dashboard/financial/create/payment'
    }
  ];

  // İzinlere göre filtreleme - TEMPORARILY DISABLED
  const transactionTypes = allTransactionTypes.filter(type => {
    if (type.id === 'bill') {
      return true; // Geçici olarak herkese izin ver
    }
    if (type.id === 'payment') {
      return true; // Payment artık her zaman görünür
    }
    return false;
  });

  const handleTypeSelect = (option: TransactionTypeOption) => {
    if (onTypeSelect) {
      onTypeSelect(option.id);
    } else {
      router.push(option.route);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t.selectTransactionType}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t.selectTransactionTypeDesc}
        </p>
      </div>

      {transactionTypes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transactionTypes.map((option) => {
            const IconComponent = option.icon;
            
            return (
              <Card 
                key={option.id}
                className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary-gold/30"
                onClick={() => handleTypeSelect(option)}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-2xl ${option.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    icon={ArrowRight}
                    className="mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTypeSelect(option);
                    }}
                  >
                    {t.continue}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">Yetkiniz bulunmamaktadır</p>
            <p className="text-sm">Finansal işlem oluşturmak için gerekli izinlere sahip değilsiniz.</p>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t.manageFinancialTransactions}
        </p>
      </div>
    </div>
  );
};

interface TransactionTypeSelectorProps {
  onTypeSelect?: (type: 'bill' | 'payment') => void;
}

export default TransactionTypeSelector;