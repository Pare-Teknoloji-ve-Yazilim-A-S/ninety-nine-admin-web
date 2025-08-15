'use client';

import React, { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { Plus, DollarSign, Users, Settings, LucideIcon } from 'lucide-react';
import CreateTicketModal from './CreateTicketModal';

interface QuickAction {
    label: string;
    icon: LucideIcon;
    variant: 'primary' | 'secondary' | 'danger' | 'ghost';
    onClick?: () => void;
}

interface QuickActionsProps {
    actions?: QuickAction[];
    title?: string;
    subtitle?: string;
}

export default function QuickActions({
    title = "Hızlı İşlemler",
    subtitle = "Sık kullanılan eylemler"
}: QuickActionsProps) {
    const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);

    const defaultActions: QuickAction[] = [
        // {
        //     label: 'Yeni Duyuru',
        //     icon: Plus,
        //     variant: 'primary',
        //     onClick: () => console.log('Yeni duyuru oluştur')
        // },
        // {
        //     label: 'Ödeme Kaydı',
        //     icon: DollarSign,
        //     variant: 'secondary',
        //     onClick: () => console.log('Ödeme kaydı ekle')
        // },

        {
            label: 'Talep Oluştur',
            icon: Settings,
            variant: 'secondary',
            onClick: () => setIsCreateTicketModalOpen(true)
        }
    ];

    const handleTicketCreated = () => {
        // You can add success notification here
        console.log('Ticket created successfully');
    };

    return (
        <>
            <Card title={title} subtitle={subtitle}>
                <div className="space-y-3">
                    {defaultActions.map((action, index) => (
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

            <CreateTicketModal
                isOpen={isCreateTicketModalOpen}
                onClose={() => setIsCreateTicketModalOpen(false)}
                onSuccess={handleTicketCreated}
            />
        </>
    );
} 