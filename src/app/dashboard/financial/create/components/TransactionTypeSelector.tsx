'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';

interface TransactionTypeOption {
  id: 'bill' | 'payment';
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route: string;
}

const transactionTypes: TransactionTypeOption[] = [
  {
    id: 'bill',
    title: 'Fatura Oluştur',
    description: 'Aidat, bakım, fayda veya ceza faturası oluşturun',
    icon: FileText,
    color: 'bg-primary-gold/10 text-primary-gold',
    route: '/dashboard/financial/create/bill'
  },
  {
    id: 'payment',
    title: 'Ödeme Kaydet',
    description: 'Mevcut bir faturaya ödeme kaydedin',
    icon: CreditCard,
    color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    route: '/dashboard/financial/create/payment'
  }
];

interface TransactionTypeSelectorProps {
  onTypeSelect?: (type: 'bill' | 'payment') => void;
}

const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({
  onTypeSelect
}) => {
  const router = useRouter();

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
          Yeni İşlem Türü Seçin
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Oluşturmak istediğiniz işlem türünü seçin
        </p>
      </div>

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
                  Devam Et
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Bu sayfadan finansal işlemlerinizi kolayca yönetebilirsiniz.
        </p>
      </div>
    </div>
  );
};

export default TransactionTypeSelector;