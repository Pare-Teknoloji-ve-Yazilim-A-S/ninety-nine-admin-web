'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import { useRecentTransactions, Transaction } from '@/hooks/useRecentTransactions';

interface RecentTransactionsProps {
    title?: string;
    subtitle?: string;
}

export default function RecentTransactions({
    title = "Son İşlemler",
    subtitle = "Bugünün finansal hareketleri"
}: RecentTransactionsProps) {
    const { transactions, loading, error } = useRecentTransactions(5);
    
    if (loading) {
        return (
            <Card title={title} subtitle={subtitle}>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </Card>
        );
    }
    
    if (error) {
        return (
            <Card title={title} subtitle={subtitle}>
                <div className="text-center py-8 text-red-500">
                    Veriler yüklenirken hata oluştu: {error}
                </div>
            </Card>
        );
    }
    return (
        <Card title={title} subtitle={subtitle}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-medium text-text-on-light dark:text-text-on-dark">Tarih</th>
                            <th className="text-left py-3 px-4 font-medium text-text-on-light dark:text-text-on-dark">İşlem</th>
                            <th className="text-left py-3 px-4 font-medium text-text-on-light dark:text-text-on-dark">Konut</th>
                            <th className="text-left py-3 px-4 font-medium text-text-on-light dark:text-text-on-dark">Tutar</th>
                            <th className="text-left py-3 px-4 font-medium text-text-on-light dark:text-text-on-dark">Durum</th>
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
                                            transaction.status === 'Ödendi' ? 'primary' :
                                                transaction.status === 'Bekliyor' ? 'gold' :
                                                    'red'
                                        }
                                        size="sm"
                                    >
                                        {transaction.status}
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