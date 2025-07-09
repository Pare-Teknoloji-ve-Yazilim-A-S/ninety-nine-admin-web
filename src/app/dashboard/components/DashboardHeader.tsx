'use client';

import React from 'react';
import Breadcrumb from '@/app/components/ui/Breadcrumb';

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}

interface DashboardHeaderProps {
    title?: string;
    breadcrumbItems?: BreadcrumbItem[];
}

export default function DashboardHeader({
    title = "Dashboard",
    breadcrumbItems = []
}: DashboardHeaderProps) {
    return (
        <header className="bg-background-light-card dark:bg-background-card border-b border-gray-200 dark:border-gray-700 h-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="h-full flex flex-col justify-center">
                    {/* Breadcrumb */}
                    {breadcrumbItems.length > 0 && (
                        <div className="mb-1">
                            <Breadcrumb
                                items={breadcrumbItems}
                                size="sm"
                                showHome={true}
                            />
                        </div>
                    )}

                    {/* Page Title */}
                    <h1 className="text-2xl font-bold text-text-on-light dark:text-text-on-dark">
                        {title}
                    </h1>
                </div>
            </div>
        </header>
    );
} 