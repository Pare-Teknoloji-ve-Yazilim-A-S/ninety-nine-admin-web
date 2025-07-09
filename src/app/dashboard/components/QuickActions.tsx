'use client';

import React from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { Plus, DollarSign, Users, Settings } from 'lucide-react';

interface QuickAction {
    label: string;
    icon: React.ComponentType<any>;
    variant: 'primary' | 'secondary' | 'danger' | 'ghost';
    onClick?: () => void;
}

interface QuickActionsProps {
    actions?: QuickAction[];
    title?: string;
    subtitle?: string;
}

const defaultActions: QuickAction[] = [
    {
        label: 'Yeni Duyuru',
        icon: Plus,
        variant: 'primary',
        onClick: () => console.log('Yeni duyuru oluştur')
    },
    {
        label: 'Ödeme Kaydı',
        icon: DollarSign,
        variant: 'secondary',
        onClick: () => console.log('Ödeme kaydı ekle')
    },
    {
        label: 'Sakin Ekle',
        icon: Users,
        variant: 'secondary',
        onClick: () => console.log('Yeni sakin ekle')
    },
    {
        label: 'Talep Oluştur',
        icon: Settings,
        variant: 'secondary',
        onClick: () => console.log('Talep oluştur')
    }
];

export default function QuickActions({
    actions = defaultActions,
    title = "Hızlı İşlemler",
    subtitle = "Sık kullanılan eylemler"
}: QuickActionsProps) {
    return (
        <Card title={title} subtitle={subtitle}>
            <div className="space-y-3">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        fullWidth
                        variant={action.variant}
                        icon={action.icon}
                        size="md"
                        onClick={action.onClick}
                    >
                        {action.label}
                    </Button>
                ))}
            </div>
        </Card>
    );
} 