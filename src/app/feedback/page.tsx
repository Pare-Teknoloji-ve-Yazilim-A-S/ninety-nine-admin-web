'use client';

import React, { useState } from 'react';
import {
    Toast,
    ToastContainer,
    Alert,
    Tooltip,
    Skeleton,
    SkeletonAvatar,
    SkeletonCard,
    SkeletonList,
    SkeletonTable,
    SkeletonText,
    Spinner,
    SpinnerOverlay,
    SpinnerButton,
    SpinnerCard,
    SpinnerInline,
    Button,
    Card
} from '@/app/components/ui';
import { HelpCircle, RefreshCw, User, Settings } from 'lucide-react';

const FeedbackDemo = () => {
    const [toasts, setToasts] = useState<any[]>([]);
    const [alertVisible, setAlertVisible] = useState({
        success: true,
        error: true,
        warning: true,
        info: true,
    });
    const [showSkeletons, setShowSkeletons] = useState(true);
    const [loadingStates, setLoadingStates] = useState({
        overlay: false,
        button: false,
        inline: false,
    });

    const addToast = (type: 'success' | 'error' | 'warning' | 'info') => {
        const messages = {
            success: { title: 'Başarılı!', message: 'İşlem başarıyla tamamlandı.' },
            error: { title: 'Hata!', message: 'Bir hata oluştu, lütfen tekrar deneyin.' },
            warning: { title: 'Uyarı!', message: 'Bu işlem geri alınamaz.' },
            info: { title: 'Bilgi', message: 'Yeni güncellemeler mevcut.' },
        };

        const newToast = {
            id: Date.now().toString(),
            type,
            ...messages[type],
        };

        setToasts(prev => [...prev, newToast]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const toggleSkeleton = () => {
        setShowSkeletons(!showSkeletons);
    };

    const toggleLoading = (type: 'overlay' | 'button' | 'inline') => {
        setLoadingStates(prev => ({
            ...prev,
            [type]: !prev[type]
        }));

        // Auto reset after 3 seconds
        setTimeout(() => {
            setLoadingStates(prev => ({
                ...prev,
                [type]: false
            }));
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-background-primary py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-text-primary mb-8">Geri Bildirim Component'leri</h1>

                {/* Toast */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">Toast - Bildirim Mesajı</h2>
                        <p className="text-text-secondary">Geçici bildirim mesajları gösterir</p>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                            <Button onClick={() => addToast('success')} variant="outline" className="border-green-600 text-green-400">
                                Başarı Toast'ı
                            </Button>
                            <Button onClick={() => addToast('error')} variant="outline" className="border-primary-red text-primary-red">
                                Hata Toast'ı
                            </Button>
                            <Button onClick={() => addToast('warning')} variant="outline" className="border-yellow-600 text-yellow-400">
                                Uyarı Toast'ı
                            </Button>
                            <Button onClick={() => addToast('info')} variant="outline" className="border-primary-gold text-primary-gold">
                                Bilgi Toast'ı
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Alert */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">Alert - Uyarı Kutusu</h2>
                        <p className="text-text-secondary">Önemli mesajları vurgular</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {alertVisible.success && (
                            <Alert
                                type="success"
                                title="Başarılı İşlem"
                                closable
                                onClose={() => setAlertVisible(prev => ({ ...prev, success: false }))}
                            >
                                Hesabınız başarıyla oluşturuldu. E-posta adresinizi doğrulamayı unutmayın.
                            </Alert>
                        )}

                        {alertVisible.error && (
                            <Alert
                                type="error"
                                title="Hata Oluştu"
                                variant="outline"
                                closable
                                onClose={() => setAlertVisible(prev => ({ ...prev, error: false }))}
                            >
                                Sunucu bağlantısı kurulamadı. Lütfen internet bağlantınızı kontrol edin.
                            </Alert>
                        )}

                        {alertVisible.warning && (
                            <Alert
                                type="warning"
                                title="Dikkat!"
                                variant="solid"
                                closable
                                onClose={() => setAlertVisible(prev => ({ ...prev, warning: false }))}
                            >
                                Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?
                            </Alert>
                        )}

                        {alertVisible.info && (
                            <Alert
                                type="info"
                                title="Bilgilendirme"
                                closable
                                onClose={() => setAlertVisible(prev => ({ ...prev, info: false }))}
                            >
                                Yeni özellikler eklendi! Daha fazla bilgi için dokümantasyonu inceleyin.
                            </Alert>
                        )}
                    </div>
                </Card>

                {/* Tooltip */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">Tooltip - Açıklama Balonu</h2>
                        <p className="text-text-secondary">Hover ile açıklama gösterir</p>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-4 items-center">
                            <Tooltip content="Bu bir yardım ikonu" position="top">
                                <Button variant="outline" size="sm">
                                    <HelpCircle className="h-4 w-4" />
                                </Button>
                            </Tooltip>

                            <Tooltip content="Ayarlara git" position="bottom">
                                <Button variant="outline" size="sm">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </Tooltip>

                            <Tooltip content="Kullanıcı profili" position="left">
                                <Button variant="outline" size="sm">
                                    <User className="h-4 w-4" />
                                </Button>
                            </Tooltip>

                            <Tooltip content="Sayfayı yenile" position="right">
                                <Button variant="outline" size="sm">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </Card>

                {/* Skeleton */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">Skeleton - Yükleme Placeholder'ı</h2>
                        <p className="text-text-secondary">İçerik yüklenene kadar gösterilen placeholder</p>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <Button onClick={toggleSkeleton} variant="outline" className="border-primary-gold text-primary-gold">
                                {showSkeletons ? 'İçeriği Göster' : 'Skeleton Göster'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Avatar Skeleton */}
                            <div>
                                <h3 className="text-lg font-medium text-text-primary mb-3">Avatar</h3>
                                {showSkeletons ? (
                                    <SkeletonAvatar />
                                ) : (
                                    <div className="w-10 h-10 bg-primary-gold rounded-full flex items-center justify-center">
                                        <span className="text-background-primary font-semibold">AY</span>
                                    </div>
                                )}
                            </div>

                            {/* Card Skeleton */}
                            <div>
                                <h3 className="text-lg font-medium text-text-primary mb-3">Kart</h3>
                                {showSkeletons ? (
                                    <SkeletonCard />
                                ) : (
                                    <div className="p-4 bg-background-secondary rounded-lg">
                                        <img src="https://via.placeholder.com/300x200" alt="Demo" className="w-full h-48 object-cover rounded mb-3" />
                                        <h4 className="text-text-primary font-semibold mb-2">Başlık</h4>
                                        <p className="text-text-secondary text-sm">Bu bir örnek içeriktir.</p>
                                    </div>
                                )}
                            </div>

                            {/* List Skeleton */}
                            <div>
                                <h3 className="text-lg font-medium text-text-primary mb-3">Liste</h3>
                                {showSkeletons ? (
                                    <SkeletonList items={3} />
                                ) : (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-primary-gold rounded-full"></div>
                                                <div>
                                                    <div className="text-text-primary font-medium">Kullanıcı {i}</div>
                                                    <div className="text-text-secondary text-sm">user{i}@example.com</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Text Skeleton */}
                            <div>
                                <h3 className="text-lg font-medium text-text-primary mb-3">Metin</h3>
                                {showSkeletons ? (
                                    <SkeletonText lines={4} />
                                ) : (
                                    <div className="space-y-2 text-text-secondary">
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                        <p>Ut enim ad minim veniam, quis nostrud exercitation.</p>
                                        <p>Duis aute irure dolor in reprehenderit in voluptate.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Spinner */}
                <Card className="mb-8 bg-background-card border-primary-dark-gray/20">
                    <div className="p-6 border-b border-primary-dark-gray/20">
                        <h2 className="text-xl font-semibold mb-2 text-text-primary">Spinner - Yükleme Animasyonu</h2>
                        <p className="text-text-secondary">Yükleme durumlarında gösterilen animasyonlar</p>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Basic Spinners */}
                        <div>
                            <h3 className="text-lg font-medium text-text-primary mb-3">Temel Spinner'lar</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <Spinner size="xs" color="gold" />
                                <Spinner size="sm" color="gold" />
                                <Spinner size="md" color="gold" />
                                <Spinner size="lg" color="gold" />
                                <Spinner size="xl" color="gold" />
                            </div>
                        </div>

                        {/* Spinner Variants */}
                        <div>
                            <h3 className="text-lg font-medium text-text-primary mb-3">Farklı Türler</h3>
                            <div className="flex flex-wrap gap-6 items-center">
                                <div className="text-center">
                                    <Spinner variant="default" color="gold" />
                                    <p className="text-xs text-text-secondary mt-2">Default</p>
                                </div>
                                <div className="text-center">
                                    <Spinner variant="dots" color="gold" />
                                    <p className="text-xs text-text-secondary mt-2">Dots</p>
                                </div>
                                <div className="text-center">
                                    <Spinner variant="bars" color="gold" />
                                    <p className="text-xs text-text-secondary mt-2">Bars</p>
                                </div>
                                <div className="text-center">
                                    <Spinner variant="pulse" color="gold" />
                                    <p className="text-xs text-text-secondary mt-2">Pulse</p>
                                </div>
                                <div className="text-center">
                                    <Spinner variant="ring" color="gold" />
                                    <p className="text-xs text-text-secondary mt-2">Ring</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Examples */}
                        <div>
                            <h3 className="text-lg font-medium text-text-primary mb-3">Etkileşimli Örnekler</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Overlay Example */}
                                <div>
                                    <Button
                                        onClick={() => toggleLoading('overlay')}
                                        variant="outline"
                                        className="border-primary-gold text-primary-gold mb-3"
                                    >
                                        Overlay Göster
                                    </Button>
                                    <SpinnerOverlay className={loadingStates.overlay ? '' : 'hidden'}>
                                        <div className="bg-background-secondary p-6 rounded-lg">
                                            <h4 className="text-text-primary font-medium mb-2">İçerik Alanı</h4>
                                            <p className="text-text-secondary">Bu alan loading sırasında blur olur.</p>
                                        </div>
                                    </SpinnerOverlay>
                                </div>

                                {/* Button Example */}
                                <div>
                                    <Button
                                        onClick={() => toggleLoading('button')}
                                        variant="outline"
                                        className="border-primary-gold text-primary-gold mb-3"
                                    >
                                        Button Loading
                                    </Button>
                                    {loadingStates.button && <SpinnerButton text="Kaydediliyor..." />}
                                </div>

                                {/* Inline Example */}
                                <div>
                                    <Button
                                        onClick={() => toggleLoading('inline')}
                                        variant="outline"
                                        className="border-primary-gold text-primary-gold mb-3"
                                    >
                                        Inline Loading
                                    </Button>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-text-primary">Veriler yükleniyor</span>
                                        {loadingStates.inline && <SpinnerInline />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Example */}
                        <div>
                            <h3 className="text-lg font-medium text-text-primary mb-3">Kart İçinde Loading</h3>
                            <div className="max-w-md">
                                <SpinnerCard
                                    title="Veriler Yükleniyor"
                                    description="Lütfen bekleyiniz, bu işlem birkaç saniye sürebilir."
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Toast Container */}
            <ToastContainer
                toasts={toasts}
                onRemove={removeToast}
            />
        </div>
    );
};

export default FeedbackDemo; 