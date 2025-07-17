'use client';

import React, { useState } from 'react';
import { Table, Pagination, DataList, EmptyState, ProgressBar, Badge, Chip, Button, Card } from '@/app/components/ui';
import { UserIcon, TrashIcon, EditIcon } from 'lucide-react';

const DataDisplayDemo = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [tableData, setTableData] = useState([
        { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'Admin', status: 'Aktif', progress: 85 },
        { id: 2, name: 'Fatma Demir', email: 'fatma@example.com', role: 'Kullanıcı', status: 'Pasif', progress: 60 },
        { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', role: 'Editör', status: 'Aktif', progress: 92 },
        { id: 4, name: 'Ayşe Özkan', email: 'ayse@example.com', role: 'Kullanıcı', status: 'Aktif', progress: 78 },
        { id: 5, name: 'Ali Çelik', email: 'ali@example.com', role: 'Admin', status: 'Pasif', progress: 45 },
    ]);

    const [chips, setChips] = useState([
        { id: 1, label: 'React', color: 'gold' as const },
        { id: 2, label: 'TypeScript', color: 'accent' as const },
        { id: 3, label: 'Next.js', color: 'primary' as const },
        { id: 4, label: 'Tailwind CSS', color: 'secondary' as const },
    ]);

    const tableColumns = [
        { key: 'name', label: 'İsim', width: '200px' },
        { key: 'email', label: 'E-posta', width: '250px' },
        { key: 'role', label: 'Rol', width: '120px' },
        {
            key: 'status',
            label: 'Durum',
            width: '120px',
            render: (value: string) => (
                <Badge
                    color={value === 'Aktif' ? 'gold' : 'red'}
                    size="sm"
                    variant="soft"
                >
                    {value}
                </Badge>
            )
        },
        {
            key: 'progress',
            label: 'İlerleme',
            width: '150px',
            render: (value: number) => (
                <ProgressBar
                    value={value}
                    size="sm"
                    color="gold"
                    showPercentage
                />
            )
        },
        {
            key: 'actions',
            label: 'İşlemler',
            width: '100px',
            render: () => (
                <div className="flex space-x-2">
                    <Button size="sm" variant="ghost">
                        <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" color="red">
                        <TrashIcon className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    ];

    const listData = [
        {
            id: 1,
            title: 'Ahmet Yılmaz',
            subtitle: 'ahmet@example.com',
            description: 'Son giriş: 2 saat önce',
            badge: 'Admin',
            badgeColor: 'gold' as const,
            meta: <span>Hesap ID: #1234</span>
        },
        {
            id: 2,
            title: 'Fatma Demir',
            subtitle: 'fatma@example.com',
            description: 'Son giriş: 1 gün önce',
            badge: 'Kullanıcı',
            badgeColor: 'secondary' as const,
            meta: <span>Hesap ID: #1235</span>
        },
        {
            id: 3,
            title: 'Mehmet Kaya',
            subtitle: 'mehmet@example.com',
            description: 'Son giriş: 3 gün önce',
            badge: 'Editör',
            badgeColor: 'accent' as const,
            meta: <span>Hesap ID: #1236</span>
        },
    ];

    const handleChipRemove = (id: number) => {
        setChips(chips.filter(chip => chip.id !== id));
    };

    return (
        <div className="min-h-screen bg-background-primary py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-text-primary mb-8">Veri Gösterim Component'leri</h1>

                {/* Table */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">Table - Veri Tablosu</h2>
                        <p className="text-text-secondary">Verileri tablo formatında gösterir</p>
                    </div>
                    <div className="p-6">
                        <Table
                            columns={tableColumns}
                            data={tableData}
                            hoverable
                            striped
                        />
                    </div>
                </Card>

                {/* Pagination */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">Pagination - Sayfalama</h2>
                        <p className="text-text-secondary">Sayfa geçişi için kullanılır</p>
                    </div>
                    <div className="p-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={10}
                            onPageChange={setCurrentPage}
                            showFirstLast
                            showPrevNext
                        />
                    </div>
                </Card>

                {/* DataList */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">DataList - Liste Görünümü</h2>
                        <p className="text-text-secondary">Verileri liste formatında gösterir</p>
                    </div>
                    <div className="p-6">
                        <DataList
                            items={listData}
                            clickable
                            showAvatar
                            showArrow
                            onItemClick={(item) => console.log('Tıklanan item:', item)}
                        />
                    </div>
                </Card>

                {/* EmptyState */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">EmptyState - Boş Durum</h2>
                        <p className="text-text-secondary">Veri olmadığında gösterilir</p>
                    </div>
                    <div className="p-6">
                        <EmptyState
                            icon="inbox"
                            title="Henüz veri yok"
                            description="Buraya veri eklendiğinde görüntülenecek"
                            action={
                                <Button variant="ghost" className="border-primary-gold text-text-accent hover:bg-primary-gold/10">
                                    Veri Ekle
                                </Button>
                            }
                        />
                    </div>
                </Card>

                {/* ProgressBar */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">ProgressBar - İlerleme Çubuğu</h2>
                        <p className="text-text-secondary">İlerleme durumunu gösterir</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <ProgressBar value={25} color="gold" showPercentage />
                        <ProgressBar value={50} color="accent" showPercentage label="Tamamlanan" />
                        <ProgressBar value={75} color="primary" showPercentage size="lg" />
                        <ProgressBar value={90} color="red" showPercentage striped animated />
                    </div>
                </Card>

                {/* Badge */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">Badge - Durum Etiketi</h2>
                        <p className="text-text-secondary">Durum ve etiket gösterimi için kullanılır</p>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge color="gold">Yeni</Badge>
                            <Badge color="accent">Aktif</Badge>
                            <Badge color="red">Pasif</Badge>
                            <Badge color="primary">Beklemede</Badge>
                            <Badge color="secondary">VIP</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" color="gold">Outline</Badge>
                            <Badge variant="solid" color="gold">Solid</Badge>
                            <Badge variant="soft" color="accent">Soft</Badge>
                            <Badge dot color="gold">Noktalı</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge size="sm" color="gold">Küçük</Badge>
                            <Badge size="md" color="accent">Orta</Badge>
                            <Badge size="lg" color="red">Büyük</Badge>
                        </div>
                    </div>
                </Card>

                {/* Chip */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">Chip - Küçük Etiket</h2>
                        <p className="text-text-secondary">Kaldırılabilir küçük etiketler</p>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {chips.map(chip => (
                                <Chip
                                    key={chip.id}
                                    color={chip.color}
                                    removable
                                    onRemove={() => handleChipRemove(chip.id)}
                                >
                                    {chip.label}
                                </Chip>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Chip variant="outline" color="gold">Outline</Chip>
                            <Chip variant="solid" color="gold">Solid</Chip>
                            <Chip avatar="https://via.placeholder.com/32">Avatar</Chip>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Chip size="sm" color="gold">Küçük</Chip>
                            <Chip size="md" color="accent">Orta</Chip>
                            <Chip size="lg" color="red">Büyük</Chip>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DataDisplayDemo; 