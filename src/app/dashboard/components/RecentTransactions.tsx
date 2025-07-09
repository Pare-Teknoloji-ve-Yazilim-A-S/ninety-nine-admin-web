'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';

interface Transaction {
    date: string;
    type: string;
    unit: string;
    amount: string;
    status: 'Ödendi' | 'Bekliyor' | 'Gecikmiş';
}

interface RecentTransactionsProps {
    transactions?: Transaction[];
    title?: string;
    subtitle?: string;
}

const defaultTransactions: Transaction[] = [
    { date: '2024-01-15', type: 'Aidat', unit: 'A-101', amount: '₺1,200', status: 'Ödendi' },
    { date: '2024-01-15', type: 'Bakım', unit: 'B-205', amount: '₺350', status: 'Bekliyor' },
    { date: '2024-01-14', type: 'Aidat', unit: 'C-301', amount: '₺1,200', status: 'Ödendi' },
    { date: '2024-01-14', type: 'Elektrik', unit: 'A-105', amount: '₺180', status: 'Gecikmiş' },
    { date: '2024-01-13', type: 'Aidat', unit: 'B-102', amount: '₺1,200', status: 'Ödendi' },
];

export default function RecentTransactions({
    transactions = defaultTransactions,
    title = "Son İşlemler",
    subtitle = "Bugünün finansal hareketleri"
}: RecentTransactionsProps) {
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