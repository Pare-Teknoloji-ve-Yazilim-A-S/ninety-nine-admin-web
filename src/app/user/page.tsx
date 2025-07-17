'use client';

import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Users,
    Calendar,
    Star,
    Award,
    Target,
    TrendingUp
} from 'lucide-react';

import {
    Avatar,
    AvatarGroup,
    AvatarPatterns,
    UserCard,
    UserCardPatterns,
    ProfileDropdown,
    ProfileDropdownPatterns,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Badge,
    Toast,
    ToastContainer
} from '@/app/components/ui';

export default function UserDemo() {
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }>>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    // Sample user data
    const sampleUser = {
        id: '1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '+90 555 123 4567',
        role: 'Frontend Developer',
        department: 'Yazılım Geliştirme',
        location: 'İstanbul, Türkiye',
        joinDate: '15 Mart 2023',
        status: 'online' as const,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Deneyimli frontend developer. React, TypeScript ve modern web teknolojileri konusunda uzman.',
        stats: {
            projects: 24,
            tasks: 156,
            followers: 89,
            following: 45,
        },
        badges: [
            { label: 'Senior Developer', variant: 'solid' as const, color: 'gold' as const },
            { label: 'Team Lead', variant: 'outline' as const, color: 'blue' as const },
            { label: 'React Expert', variant: 'soft' as const, color: 'green' as const },
        ],
    };

    const teamMembers = [
        {
            src: 'https://images.unsplash.com/photo-1494790108755-2616b612b524?w=150&h=150&fit=crop&crop=face',
            alt: 'Ayşe Kaya',
            fallback: 'AK',
        },
        {
            src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            alt: 'Mehmet Demir',
            fallback: 'MD',
        },
        {
            src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            alt: 'Fatma Öz',
            fallback: 'FÖ',
        },
        {
            src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            alt: 'Ali Yıldız',
            fallback: 'AY',
        },
        {
            src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
            alt: 'Zeynep Çelik',
            fallback: 'ZÇ',
        },
    ];

    const profileUser = {
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        role: 'Frontend Developer',
        status: 'online' as const,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    };

    return (
        <div className="min-h-screen bg-background-primary p-8">
            <ToastContainer
                toasts={toasts}
                onRemove={(id: string) => setToasts(prev => prev.filter(toast => toast.id !== id))}
            />

            <div className="max-w-7xl mx-auto space-y-12">

                {/* Page Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-text-primary">
                        👤 Kullanıcı Component'leri
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Avatar, UserCard ve ProfileDropdown component'leri ile kullanıcı arayüzü elementleri
                    </p>
                </div>

                {/* Avatar Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Avatar - Profil Resmi</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-8">

                        {/* Avatar Sizes */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Boyut Seçenekleri</h3>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="text-center">
                                    <Avatar size="xs" fallback="XS" />
                                    <div className="text-sm text-text-secondary mt-1">XS</div>
                                </div>
                                <div className="text-center">
                                    <Avatar size="sm" fallback="SM" />
                                    <div className="text-sm text-text-secondary mt-1">SM</div>
                                </div>
                                <div className="text-center">
                                    <Avatar size="md" fallback="MD" />
                                    <div className="text-sm text-text-secondary mt-1">MD</div>
                                </div>
                                <div className="text-center">
                                    <Avatar size="lg" fallback="LG" />
                                    <div className="text-sm text-text-secondary mt-1">LG</div>
                                </div>
                                <div className="text-center">
                                    <Avatar size="xl" fallback="XL" />
                                    <div className="text-sm text-text-secondary mt-1">XL</div>
                                </div>
                                <div className="text-center">
                                    <Avatar size="2xl" fallback="2XL" />
                                    <div className="text-sm text-text-secondary mt-1">2XL</div>
                                </div>
                            </div>
                        </div>

                        {/* Avatar Shapes */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Şekil Seçenekleri</h3>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="text-center">
                                    <Avatar shape="circle" fallback="C" />
                                    <div className="text-sm text-text-secondary mt-1">Circle</div>
                                </div>
                                <div className="text-center">
                                    <Avatar shape="rounded" fallback="R" />
                                    <div className="text-sm text-text-secondary mt-1">Rounded</div>
                                </div>
                                <div className="text-center">
                                    <Avatar shape="square" fallback="S" />
                                    <div className="text-sm text-text-secondary mt-1">Square</div>
                                </div>
                            </div>
                        </div>

                        {/* Avatar with Status */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Durum Göstergeleri</h3>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="text-center">
                                    <Avatar fallback="ON" status="online" showStatus />
                                    <div className="text-sm text-text-secondary mt-1">Online</div>
                                </div>
                                <div className="text-center">
                                    <Avatar fallback="OF" status="offline" showStatus />
                                    <div className="text-sm text-text-secondary mt-1">Offline</div>
                                </div>
                                <div className="text-center">
                                    <Avatar fallback="AW" status="away" showStatus />
                                    <div className="text-sm text-text-secondary mt-1">Away</div>
                                </div>
                                <div className="text-center">
                                    <Avatar fallback="BU" status="busy" showStatus />
                                    <div className="text-sm text-text-secondary mt-1">Busy</div>
                                </div>
                            </div>
                        </div>

                        {/* Avatar Group */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Avatar Grup</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <AvatarGroup avatars={teamMembers} />
                                    <span className="text-sm text-text-secondary">Takım Üyeleri</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <AvatarGroup avatars={teamMembers} max={3} />
                                    <span className="text-sm text-text-secondary">Maksimum 3 Avatar</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <AvatarGroup avatars={teamMembers} size="sm" />
                                    <span className="text-sm text-text-secondary">Küçük Boyut</span>
                                </div>
                            </div>
                        </div>

                        {/* Avatar Patterns */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Hazır Desenler</h3>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="text-center">
                                    {AvatarPatterns.Online({ fallback: 'ON' })}
                                    <div className="text-sm text-text-secondary mt-1">Online</div>
                                </div>
                                <div className="text-center">
                                    {AvatarPatterns.Admin({ fallback: 'AD' })}
                                    <div className="text-sm text-text-secondary mt-1">Admin</div>
                                </div>
                                <div className="text-center">
                                    {AvatarPatterns.Profile({ fallback: 'PR' })}
                                    <div className="text-sm text-text-secondary mt-1">Profile</div>
                                </div>
                                <div className="text-center">
                                    {AvatarPatterns.Notification({ fallback: 'NO' })}
                                    <div className="text-sm text-text-secondary mt-1">Notification</div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* UserCard Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>UserCard - Kullanıcı Kartı</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-8">

                        {/* UserCard Variants */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Varyantlar</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Minimal</div>
                                    <UserCard
                                        user={sampleUser}
                                        variant="minimal"
                                        onMessage={() => showToast('Mesaj gönderme özelliği', 'info')}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Compact</div>
                                    <UserCard
                                        user={sampleUser}
                                        variant="compact"
                                        onMessage={() => showToast('Mesaj gönderme özelliği', 'info')}
                                        onConnect={() => showToast('Bağlantı isteği gönderildi', 'success')}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Default</div>
                                    <UserCard
                                        user={sampleUser}
                                        variant="default"
                                        onMessage={() => showToast('Mesaj gönderme özelliği', 'info')}
                                        onConnect={() => showToast('Bağlantı isteği gönderildi', 'success')}
                                        onProfile={() => showToast('Profil sayfasına yönlendiriliyor', 'info')}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Detailed</div>
                                    <UserCard
                                        user={sampleUser}
                                        variant="detailed"
                                        onMessage={() => showToast('Mesaj gönderme özelliği', 'info')}
                                        onConnect={() => showToast('Bağlantı isteği gönderildi', 'success')}
                                        onProfile={() => showToast('Profil sayfasına yönlendiriliyor', 'info')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* UserCard Sizes */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Boyut Seçenekleri</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-text-secondary">Small</div>
                                    <UserCard
                                        user={sampleUser}
                                        variant="compact"
                                        size="sm"
                                        onMessage={() => showToast('Mesaj gönderme özelliği', 'info')}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-text-secondary">Medium</div>
                                    <UserCard
                                        user={sampleUser}
                                        variant="compact"
                                        size="md"
                                        onMessage={() => showToast('Mesaj gönderme özelliği', 'info')}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-text-secondary">Large</div>
                                    <UserCard
                                        user={sampleUser}
                                        variant="compact"
                                        size="lg"
                                        onMessage={() => showToast('Mesaj gönderme özelliği', 'info')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* UserCard Patterns */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Hazır Desenler</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Employee</div>
                                    {UserCardPatterns.Employee(sampleUser, {
                                        onMessage: () => showToast('Mesaj gönderme özelliği', 'info'),
                                        onConnect: () => showToast('Bağlantı isteği gönderildi', 'success'),
                                    })}
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Team Member</div>
                                    {UserCardPatterns.TeamMember(sampleUser, {
                                        onMessage: () => showToast('Mesaj gönderme özelliği', 'info'),
                                        onConnect: () => showToast('Bağlantı isteği gönderildi', 'success'),
                                    })}
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Profile</div>
                                    {UserCardPatterns.Profile(sampleUser, {
                                        onMessage: () => showToast('Mesaj gönderme özelliği', 'info'),
                                        onConnect: () => showToast('Bağlantı isteği gönderildi', 'success'),
                                    })}
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Contact</div>
                                    {UserCardPatterns.Contact(sampleUser)}
                                </div>
                            </div>
                        </div>

                        {/* Custom Actions */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Özel Aksiyonlar</h3>
                            <UserCard
                                user={sampleUser}
                                variant="default"
                                actions={
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => showToast('Favorilere eklendi', 'success')}
                                        >
                                            <Star size={16} className="mr-1" />
                                            Favorile
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => showToast('Proje atandı', 'success')}
                                        >
                                            <Target size={16} className="mr-1" />
                                            Ata
                                        </Button>
                                    </div>
                                }
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* ProfileDropdown Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>ProfileDropdown - Profil Menüsü</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-8">

                        {/* ProfileDropdown Patterns */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Hazır Desenler</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Standard</div>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        {ProfileDropdownPatterns.Standard(profileUser, {
                                            onClose: () => showToast('Profil menüsü kapatıldı', 'info'),
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Admin</div>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        {ProfileDropdownPatterns.Admin(profileUser, {
                                            onClose: () => showToast('Admin menüsü kapatıldı', 'info'),
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Compact</div>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        {ProfileDropdownPatterns.Compact(profileUser, {
                                            onClose: () => showToast('Compact menü kapatıldı', 'info'),
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Simple</div>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        {ProfileDropdownPatterns.Simple(profileUser, {
                                            onClose: () => showToast('Simple menü kapatıldı', 'info'),
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ProfileDropdown Positions */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Pozisyon Seçenekleri</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Bottom Right</div>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        <ProfileDropdown
                                            user={profileUser}
                                            position="bottom-right"
                                            items={[
                                                { id: 'profile', label: 'Profil', icon: <User size={16} /> },
                                                { id: 'settings', label: 'Ayarlar', icon: <Mail size={16} /> },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Bottom Left</div>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        <ProfileDropdown
                                            user={profileUser}
                                            position="bottom-left"
                                            items={[
                                                { id: 'profile', label: 'Profil', icon: <User size={16} /> },
                                                { id: 'settings', label: 'Ayarlar', icon: <Mail size={16} /> },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Top Right</div>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        <ProfileDropdown
                                            user={profileUser}
                                            position="top-right"
                                            items={[
                                                { id: 'profile', label: 'Profil', icon: <User size={16} /> },
                                                { id: 'settings', label: 'Ayarlar', icon: <Mail size={16} /> },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Top Left</div>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        <ProfileDropdown
                                            user={profileUser}
                                            position="top-left"
                                            items={[
                                                { id: 'profile', label: 'Profil', icon: <User size={16} /> },
                                                { id: 'settings', label: 'Ayarlar', icon: <Mail size={16} /> },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ProfileDropdown Triggers */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Tetikleyici Seçenekleri</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Click Trigger</div>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        <ProfileDropdown
                                            user={profileUser}
                                            trigger="click"
                                            items={[
                                                { id: 'profile', label: 'Profil', icon: <User size={16} /> },
                                                { id: 'settings', label: 'Ayarlar', icon: <Mail size={16} /> },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium text-text-secondary">Hover Trigger</div>
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        <ProfileDropdown
                                            user={profileUser}
                                            trigger="hover"
                                            items={[
                                                { id: 'profile', label: 'Profil', icon: <User size={16} /> },
                                                { id: 'settings', label: 'Ayarlar', icon: <Mail size={16} /> },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Özet</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-background-secondary rounded-lg">
                                <div className="text-2xl font-bold text-primary-gold">3</div>
                                <div className="text-sm text-text-secondary">Kullanıcı Component'i</div>
                            </div>
                            <div className="text-center p-4 bg-background-secondary rounded-lg">
                                <div className="text-2xl font-bold text-primary-gold">12+</div>
                                <div className="text-sm text-text-secondary">Hazır Desen</div>
                            </div>
                            <div className="text-center p-4 bg-background-secondary rounded-lg">
                                <div className="text-2xl font-bold text-primary-gold">6</div>
                                <div className="text-sm text-text-secondary">Boyut Seçeneği</div>
                            </div>
                            <div className="text-center p-4 bg-background-secondary rounded-lg">
                                <div className="text-2xl font-bold text-primary-gold">4</div>
                                <div className="text-sm text-text-secondary">Durum Göstergesi</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
} 