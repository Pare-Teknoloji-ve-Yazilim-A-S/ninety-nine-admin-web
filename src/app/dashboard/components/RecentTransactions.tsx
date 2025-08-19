'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import { useRecentTransactions, Transaction } from '@/hooks/useRecentTransactions';

interface RecentTransactionsProps {
    title?: string;
    subtitle?: string;
}

// Dil çevirileri
const translations = {
    tr: {
        title: 'Son İşlemler',
        subtitle: 'Bugünün finansal hareketleri',
        date: 'Tarih',
        transaction: 'İşlem',
        unit: 'Konut',
        amount: 'Tutar',
        status: 'Durum',
        paid: 'Ödendi',
        waiting: 'Bekliyor',
        overdue: 'Gecikmiş',
        error: 'Veriler yüklenirken hata oluştu:'
    },
    en: {
        title: 'Recent Transactions',
        subtitle: 'Today\'s financial activities',
        date: 'Date',
        transaction: 'Transaction',
        unit: 'Unit',
        amount: 'Amount',
        status: 'Status',
        paid: 'Paid',
        waiting: 'Waiting',
        overdue: 'Overdue',
        error: 'Error loading data:'
    },
    ar: {
        title: 'المعاملات الأخيرة',
        subtitle: 'الأنشطة المالية اليوم',
        date: 'التاريخ',
        transaction: 'المعاملة',
        unit: 'الوحدة',
        amount: 'المبلغ',
        status: 'الحالة',
        paid: 'مدفوع',
        waiting: 'في الانتظار',
        overdue: 'متأخر',
        error: 'خطأ في تحميل البيانات:'
    }
};

export default function RecentTransactions({
    title,
    subtitle
}: RecentTransactionsProps) {
    const { transactions, loading, error } = useRecentTransactions(5);
    const [currentLanguage, setCurrentLanguage] = useState('tr');

    // Dil tercihini localStorage'dan al
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Çevirileri al
    const t = translations[currentLanguage as keyof typeof translations];
    
    if (loading) {
        return (
            <Card title={title || t.title} subtitle={subtitle || t.subtitle}>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </Card>
        );
    }
    
    if (error) {
        return (
            <Card title={title || t.title} subtitle={subtitle || t.subtitle}>
                <div className="text-center py-8 text-red-500">
                    {t.error} {error}
                </div>
            </Card>
        );
    }
    return (
        <Card title={title || t.title} subtitle={subtitle || t.subtitle}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-medium text-text-on-light dark:text-text-on-dark">{t.date}</th>
                            <th className="text-left py-3 px-4 font-medium text-text-on-light dark:text-text-on-dark">{t.transaction}</th>
                            <th className="text-left py-3 px-4 font-medium text-text-on-light dark:text-text-on-dark">{t.unit}</th>
                            <th className="text-left py-3 px-4 font-medium text-text-on-light dark:text-text-on-dark">{t.amount}</th>
                            <th className="text-left py-3 px-4 font-medium text-text-on-light dark:text-text-on-dark">{t.status}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="py-3 px-4 text-sm text-text-light-secondary dark:text-text-secondary">
                                    {transaction.date}
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                    {transaction.type}
                                </td>
                                <td className="py-3 px-4 text-sm text-text-on-light dark:text-text-on-dark">
                                    {transaction.unit}
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-text-on-light dark:text-text-on-dark">
                                    {transaction.amount}
                                </td>
                                <td className="py-3 px-4">
                                    <Badge
                                        variant="soft"
                                        color={
                                            transaction.status === t.paid ? 'primary' :
                                                transaction.status === t.waiting ? 'gold' :
                                                transaction.status === t.overdue ? 'red' :
                                                    'red'
                                        }
                                        size="sm"
                                    >
                                        {transaction.status === 'Gecikmiş' ? t.overdue : 
                                         transaction.status === 'Ödendi' ? t.paid :
                                         transaction.status === 'Bekliyor' ? t.waiting :
                                         transaction.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}