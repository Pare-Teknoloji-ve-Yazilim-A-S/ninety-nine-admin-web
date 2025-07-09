'use client'

import { useState } from 'react'
import { Button, IconButton, LoadingButton, FloatingActionButton } from '../components/ui'
import {
    Save,
    Edit2,
    Trash2,
    Download,
    Plus,
    Heart,
    Settings,
    Search,
    MessageCircle,
    Mail,
    Phone,
    Copy,
    Share2,
    Star,
    BookOpen,
    Home,
    ArrowRight,
    Check,
    X
} from 'lucide-react'

export default function ButtonsDemo() {
    const [loadingStates, setLoadingStates] = useState({
        save: false,
        download: false,
        upload: false,
        submit: false
    })

    const [progress, setProgress] = useState(0)

    const handleLoadingDemo = (type: string) => {
        setLoadingStates(prev => ({ ...prev, [type]: true }))

        if (type === 'submit') {
            // Progress bar demo
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        setLoadingStates(prevState => ({ ...prevState, [type]: false }))
                        return 0
                    }
                    return prev + 10
                })
            }, 200)
        } else {
            // Regular loading demo
            setTimeout(() => {
                setLoadingStates(prev => ({ ...prev, [type]: false }))
            }, 2000)
        }
    }

    return (
        <div className="min-h-screen bg-background-primary py-10">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-text-primary font-helvetica mb-4">
                        Buton Component'leri Demo
                    </h1>
                    <div className="w-24 h-1 bg-gradient-gold mx-auto rounded-full mb-6"></div>
                    <p className="text-text-secondary text-lg font-inter max-w-3xl mx-auto">
                        Modern ve etkileşimli buton component'lerinin kapsamlı demo sayfası.
                        Farklı varyantları, boyutları ve durumları test edebilirsiniz.
                    </p>
                </div>

                {/* Regular Buttons Section */}
                <div className="bg-background-card rounded-xl shadow-card border border-primary-gold/20 overflow-hidden mb-8">
                    <div className="bg-gradient-gold p-6">
                        <h2 className="text-2xl font-semibold text-primary-dark-gray font-helvetica">
                            Standart Butonlar
                        </h2>
                        <p className="text-primary-dark-gray/70 mt-2 font-inter">
                            Farklı varyant ve boyutlardaki butonlar
                        </p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Variants */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-2 h-6 bg-primary-gold rounded-full"></div>
                                <h3 className="text-lg font-semibold text-text-primary font-helvetica">
                                    Buton Varyantları
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Button variant="primary" icon={Save}>
                                    Primary Button
                                </Button>
                                <Button variant="secondary" icon={Edit2}>
                                    Secondary Button
                                </Button>
                                <Button variant="danger" icon={Trash2}>
                                    Danger Button
                                </Button>
                                <Button variant="ghost" icon={Download}>
                                    Ghost Button
                                </Button>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-2 h-6 bg-primary-gold rounded-full"></div>
                                <h3 className="text-lg font-semibold text-text-primary font-helvetica">
                                    Buton Boyutları
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <Button size="sm" variant="primary" icon={Plus}>
                                    Small
                                </Button>
                                <Button size="md" variant="primary" icon={Plus}>
                                    Medium
                                </Button>
                                <Button size="lg" variant="primary" icon={Plus}>
                                    Large
                                </Button>
                                <Button size="xl" variant="primary" icon={Plus}>
                                    Extra Large
                                </Button>
                            </div>
                        </div>

                        {/* Icon Positions */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-2 h-6 bg-primary-gold rounded-full"></div>
                                <h3 className="text-lg font-semibold text-text-primary font-helvetica">
                                    Icon Pozisyonları
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Button icon={ArrowRight} iconPosition="left">
                                    Left Icon
                                </Button>
                                <Button icon={ArrowRight} iconPosition="right">
                                    Right Icon
                                </Button>
                                <Button fullWidth icon={Check}>
                                    Full Width Button
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Icon Buttons Section */}
                <div className="bg-background-card rounded-xl shadow-card border border-primary-gold/20 overflow-hidden mb-8">
                    <div className="bg-gradient-gold p-6">
                        <h2 className="text-2xl font-semibold text-primary-dark-gray font-helvetica">
                            Icon Butonlar
                        </h2>
                        <p className="text-primary-dark-gray/70 mt-2 font-inter">
                            Sadece icon içeren kompakt butonlar
                        </p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Icon Button Variants */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-2 h-6 bg-primary-gold rounded-full"></div>
                                <h3 className="text-lg font-semibold text-text-primary font-helvetica">
                                    Icon Buton Varyantları
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <IconButton icon={Heart} variant="primary" tooltip="Beğen" />
                                <IconButton icon={Settings} variant="secondary" tooltip="Ayarlar" />
                                <IconButton icon={Trash2} variant="danger" tooltip="Sil" />
                                <IconButton icon={Search} variant="ghost" tooltip="Ara" />
                            </div>
                        </div>

                        {/* Icon Button Sizes */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-2 h-6 bg-primary-gold rounded-full"></div>
                                <h3 className="text-lg font-semibold text-text-primary font-helvetica">
                                    Icon Buton Boyutları
                                </h3>
                            </div>

                            <div className="flex items-center gap-4">
                                <IconButton icon={Mail} size="sm" variant="primary" tooltip="Küçük" />
                                <IconButton icon={Mail} size="md" variant="primary" tooltip="Orta" />
                                <IconButton icon={Mail} size="lg" variant="primary" tooltip="Büyük" />
                                <IconButton icon={Mail} size="xl" variant="primary" tooltip="Çok Büyük" />
                            </div>
                        </div>

                        {/* Icon Button Shapes */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-2 h-6 bg-primary-gold rounded-full"></div>
                                <h3 className="text-lg font-semibold text-text-primary font-helvetica">
                                    Icon Buton Şekilleri
                                </h3>
                            </div>

                            <div className="flex items-center gap-4">
                                <IconButton icon={Phone} shape="square" variant="primary" tooltip="Kare" />
                                <IconButton icon={Phone} shape="circle" variant="primary" tooltip="Yuvarlak" />
                                <IconButton icon={Copy} shape="square" variant="secondary" tooltip="Kopyala" />
                                <IconButton icon={Share2} shape="circle" variant="secondary" tooltip="Paylaş" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading Buttons Section */}
                <div className="bg-background-card rounded-xl shadow-card border border-primary-gold/20 overflow-hidden mb-8">
                    <div className="bg-gradient-gold p-6">
                        <h2 className="text-2xl font-semibold text-primary-dark-gray font-helvetica">
                            Loading Butonlar
                        </h2>
                        <p className="text-primary-dark-gray/70 mt-2 font-inter">
                            Yükleme durumu gösteren gelişmiş butonlar
                        </p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Loading Button Examples */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-2 h-6 bg-primary-gold rounded-full"></div>
                                <h3 className="text-lg font-semibold text-text-primary font-helvetica">
                                    Loading Buton Örnekleri
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <LoadingButton
                                    variant="primary"
                                    icon={Save}
                                    isLoading={loadingStates.save}
                                    onClick={() => handleLoadingDemo('save')}
                                    loadingText="Kaydediliyor..."
                                >
                                    Kaydet
                                </LoadingButton>

                                <LoadingButton
                                    variant="secondary"
                                    icon={Download}
                                    isLoading={loadingStates.download}
                                    onClick={() => handleLoadingDemo('download')}
                                    loadingText="İndiriliyor..."
                                >
                                    İndir
                                </LoadingButton>

                                <LoadingButton
                                    variant="danger"
                                    icon={Trash2}
                                    isLoading={loadingStates.upload}
                                    onClick={() => handleLoadingDemo('upload')}
                                    keepOriginalContent
                                >
                                    Yükle
                                </LoadingButton>

                                <LoadingButton
                                    variant="primary"
                                    icon={Check}
                                    isLoading={loadingStates.submit}
                                    onClick={() => handleLoadingDemo('submit')}
                                    progress={progress}
                                    loadingText="Gönderiliyor..."
                                >
                                    Gönder
                                </LoadingButton>
                            </div>
                        </div>

                        {/* Loading States Demo */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-2 h-6 bg-primary-gold rounded-full"></div>
                                <h3 className="text-lg font-semibold text-text-primary font-helvetica">
                                    Loading Durumları
                                </h3>
                            </div>

                            <div className="bg-background-secondary rounded-lg p-6 border border-primary-gold/20">
                                <p className="text-text-secondary text-sm mb-4">
                                    Bu butonlara tıklayarak loading durumlarını test edebilirsiniz.
                                    "Gönder" butonu progress bar ile birlikte çalışır.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-primary-gold/20 text-text-accent rounded-full text-sm">
                                        Normal Loading
                                    </span>
                                    <span className="px-3 py-1 bg-primary-gold/20 text-text-accent rounded-full text-sm">
                                        Keep Original Content
                                    </span>
                                    <span className="px-3 py-1 bg-primary-gold/20 text-text-accent rounded-full text-sm">
                                        Progress Bar
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Action Button Section */}
                <div className="bg-background-card rounded-xl shadow-card border border-primary-gold/20 overflow-hidden mb-8">
                    <div className="bg-gradient-gold p-6">
                        <h2 className="text-2xl font-semibold text-primary-dark-gray font-helvetica">
                            Floating Action Button
                        </h2>
                        <p className="text-primary-dark-gray/70 mt-2 font-inter">
                            Sabit pozisyonda duran yüzen butonlar
                        </p>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-2 h-6 bg-primary-gold rounded-full"></div>
                                <h3 className="text-lg font-semibold text-text-primary font-helvetica">
                                    FAB Özellikleri
                                </h3>
                            </div>

                            <div className="bg-background-secondary rounded-lg p-6 border border-primary-gold/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-text-primary font-semibold mb-3">Varyantlar</h4>
                                        <ul className="space-y-2 text-text-secondary text-sm">
                                            <li>• Primary - Ana aksiyon butonu</li>
                                            <li>• Secondary - İkincil aksiyon butonu</li>
                                            <li>• Danger - Tehlikeli aksiyon butonu</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-text-primary font-semibold mb-3">Pozisyonlar</h4>
                                        <ul className="space-y-2 text-text-secondary text-sm">
                                            <li>• bottom-right (varsayılan)</li>
                                            <li>• bottom-left, top-right, top-left</li>
                                            <li>• bottom-center, top-center</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-background-primary rounded-lg">
                                    <p className="text-text-accent text-sm">
                                        <strong>Not:</strong> Floating Action Button'lar sayfanın sağ alt köşesinde görüntülenir.
                                        Aşağıya kaydırarak onları görebilirsiniz.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12">
                    <p className="text-text-secondary font-inter">
                        Bu demo sayfası, NinetyNineAdmin projesinin buton component'lerini göstermektedir
                    </p>
                    <div className="flex justify-center items-center space-x-2 mt-4">
                        <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                        <div className="w-2 h-2 bg-primary-gold/60 rounded-full"></div>
                        <div className="w-2 h-2 bg-primary-gold/30 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Floating Action Buttons - Live Examples */}
            <FloatingActionButton
                icon={Plus}
                tooltip="Yeni Ekle"
                position="bottom-right"
                onClick={() => alert('Yeni ekleme butonu tıklandı!')}
            />

            <FloatingActionButton
                icon={MessageCircle}
                variant="secondary"
                position="bottom-left"
                tooltip="Mesaj Gönder"
                badge="3"
                onClick={() => alert('Mesaj butonu tıklandı!')}
            />

            <FloatingActionButton
                icon={BookOpen}
                variant="primary"
                position="top-right"
                extended
                label="Dokümantasyon"
                onClick={() => alert('Dokümantasyon butonu tıklandı!')}
            />
        </div>
    )
} 