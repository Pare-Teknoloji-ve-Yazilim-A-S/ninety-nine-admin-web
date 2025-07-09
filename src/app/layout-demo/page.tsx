'use client'

import { useState } from 'react'
import {
    Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Drawer, DrawerHeader, DrawerBody, DrawerFooter,
    Tabs, Accordion, Collapse,
    Button, IconButton
} from '../components/ui'
import {
    Settings,
    User,
    Bell,
    Heart,
    Star,
    Calendar,
    FileText,
    MessageCircle,
    HelpCircle,
    ChevronRight,
    Plus,
    Edit2,
    Trash2,
    Eye,
    Download,
    Share2,
    BookOpen,
    Info,
    CheckCircle,
    AlertTriangle,
    X
} from 'lucide-react'

export default function LayoutDemo() {
    const [modalOpen, setModalOpen] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerPosition, setDrawerPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('right')
    const [selectedTab, setSelectedTab] = useState('profile')

    const tabItems = [
        {
            id: 'profile',
            label: 'Profil',
            icon: User,
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Profil Bilgileri</h3>
                    <p className="text-text-secondary">
                        Kullanıcı profil bilgilerinizi bu sekmede düzenleyebilirsiniz.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardBody>
                                <h4 className="text-text-primary font-semibold">Ad Soyad</h4>
                                <p className="text-text-secondary">Ahmet Yılmaz</p>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <h4 className="text-text-primary font-semibold">E-posta</h4>
                                <p className="text-text-secondary">ahmet@example.com</p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )
        },
        {
            id: 'settings',
            label: 'Ayarlar',
            icon: Settings,
            badge: 'Yeni',
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Uygulama Ayarları</h3>
                    <p className="text-text-secondary">
                        Uygulama tercihlerinizi ve bildirim ayarlarınızı yapılandırın.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                            <span className="text-text-primary">E-posta Bildirimleri</span>
                            <Button size="sm" variant="ghost">Açık</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                            <span className="text-text-primary">Push Bildirimleri</span>
                            <Button size="sm" variant="ghost">Kapalı</Button>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'notifications',
            label: 'Bildirimler',
            icon: Bell,
            badge: '3',
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Son Bildirimler</h3>
                    <div className="space-y-2">
                        {['Yeni mesaj alındı', 'Profil güncellendi', 'Sistem bakımı'].map((notification, index) => (
                            <div key={index} className="p-3 bg-background-secondary rounded-lg">
                                <p className="text-text-primary">{notification}</p>
                                <p className="text-text-secondary text-sm">{index + 1} saat önce</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'help',
            label: 'Yardım',
            icon: HelpCircle,
            disabled: false,
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Yardım ve Destek</h3>
                    <p className="text-text-secondary">
                        Sıkça sorulan sorular ve destek kaynaklarına buradan ulaşabilirsiniz.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card clickable hover>
                            <CardBody>
                                <h4 className="text-text-primary font-semibold flex items-center">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Dokümantasyon
                                </h4>
                                <p className="text-text-secondary text-sm mt-2">
                                    Detaylı kullanım kılavuzu
                                </p>
                            </CardBody>
                        </Card>
                        <Card clickable hover>
                            <CardBody>
                                <h4 className="text-text-primary font-semibold flex items-center">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Canlı Destek
                                </h4>
                                <p className="text-text-secondary text-sm mt-2">
                                    7/24 canlı destek hattı
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )
        }
    ]

    const accordionItems = [
        {
            id: 'general',
            title: 'Genel Bilgiler',
            subtitle: 'Temel uygulama bilgileri',
            icon: Info,
            content: (
                <div className="space-y-3">
                    <p className="text-text-secondary">
                        Bu uygulama modern React ve Next.js teknolojileri kullanılarak geliştirilmiştir.
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Versiyon:</span>
                            <span className="text-text-primary">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Son Güncelleme:</span>
                            <span className="text-text-primary">15 Ocak 2024</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'features',
            title: 'Özellikler',
            subtitle: 'Mevcut özellikler ve yetenekler',
            icon: CheckCircle,
            badge: 'Yeni',
            content: (
                <div className="space-y-3">
                    <ul className="space-y-2">
                        <li className="flex items-center text-text-secondary">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            Dark Theme Desteği
                        </li>
                        <li className="flex items-center text-text-secondary">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            Responsive Tasarım
                        </li>
                        <li className="flex items-center text-text-secondary">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            TypeScript Desteği
                        </li>
                        <li className="flex items-center text-text-secondary">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            Modern UI Components
                        </li>
                    </ul>
                </div>
            )
        },
        {
            id: 'limitations',
            title: 'Sınırlamalar',
            subtitle: 'Mevcut kısıtlamalar ve bilinen sorunlar',
            icon: AlertTriangle,
            content: (
                <div className="space-y-3">
                    <p className="text-text-secondary">
                        Beta sürümde olan bazı özellikler sınırlı olabilir.
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-center text-text-secondary">
                            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                            Offline modu henüz desteklenmiyor
                        </li>
                        <li className="flex items-center text-text-secondary">
                            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                            Bazı animasyonlar performans sorunlarına neden olabilir
                        </li>
                    </ul>
                </div>
            )
        }
    ]

    return (
        <div className="min-h-screen bg-background-primary py-10">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-text-primary font-helvetica mb-4">
                        Layout & İçerik Component'leri Demo
                    </h1>
                    <div className="w-24 h-1 bg-gradient-gold mx-auto rounded-full mb-6"></div>
                    <p className="text-text-secondary text-lg font-inter max-w-3xl mx-auto">
                        Modern layout ve içerik yönetimi component'lerinin kapsamlı demo sayfası.
                        Kartlar, modal'lar, drawer'lar, tab'lar ve daha fazlasını keşfedin.
                    </p>
                </div>

                {/* Cards Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-text-primary font-helvetica mb-6">
                        Card Component'leri
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Basic Card */}
                        <Card
                            title="Temel Kart"
                            subtitle="Basit card örneği"
                            icon={FileText}
                        >
                            <p className="text-text-secondary">
                                Bu temel bir card component'i örneğidir. İçeriğinizi düzenli bir şekilde sunmanız için idealdir.
                            </p>
                        </Card>

                        {/* Interactive Card */}
                        <Card
                            variant="bordered"
                            hover
                            clickable
                            title="Etkileşimli Kart"
                            subtitle="Hover ve click efektleri"
                            icon={Heart}
                            headerAction={
                                <IconButton icon={Star} size="sm" variant="ghost" />
                            }
                        >
                            <p className="text-text-secondary">
                                Bu karta hover yapın veya tıklayın. Görsel geri bildirimler alacaksınız.
                            </p>
                        </Card>

                        {/* Glass Card */}
                        <Card
                            variant="glass"
                            title="Glass Effect"
                            subtitle="Şeffaf arka plan"
                            icon={Calendar}
                            footer={
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost">İptal</Button>
                                    <Button size="sm">Tamam</Button>
                                </div>
                            }
                        >
                            <p className="text-text-secondary">
                                Glass effect ile modern görünüm.
                            </p>
                        </Card>
                    </div>

                    {/* Card Variants */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card variant="default" padding="sm">
                            <CardTitle>Default</CardTitle>
                            <CardSubtitle>Varsayılan stil</CardSubtitle>
                        </Card>
                        <Card variant="bordered" padding="sm">
                            <CardTitle>Bordered</CardTitle>
                            <CardSubtitle>Kalın kenarlık</CardSubtitle>
                        </Card>
                        <Card variant="elevated" padding="sm">
                            <CardTitle>Elevated</CardTitle>
                            <CardSubtitle>Yükseltilmiş görünüm</CardSubtitle>
                        </Card>
                        <Card variant="glass" padding="sm">
                            <CardTitle>Glass</CardTitle>
                            <CardSubtitle>Şeffaf efekt</CardSubtitle>
                        </Card>
                    </div>
                </div>

                {/* Modal & Drawer Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-text-primary font-helvetica mb-6">
                        Modal & Drawer Component'leri
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modal Örnekleri</CardTitle>
                                <CardSubtitle>Pop-up dialog'lar</CardSubtitle>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-3">
                                    <Button
                                        onClick={() => setModalOpen(true)}
                                        icon={Plus}
                                        fullWidth
                                    >
                                        Modal Aç
                                    </Button>
                                    <p className="text-text-secondary text-sm">
                                        Farklı boyut ve stil seçenekleri ile modal pencereler.
                                    </p>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Drawer Örnekleri</CardTitle>
                                <CardSubtitle>Yan panel'ler</CardSubtitle>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setDrawerPosition('left')
                                                setDrawerOpen(true)
                                            }}
                                        >
                                            Sol
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setDrawerPosition('right')
                                                setDrawerOpen(true)
                                            }}
                                        >
                                            Sağ
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setDrawerPosition('top')
                                                setDrawerOpen(true)
                                            }}
                                        >
                                            Üst
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setDrawerPosition('bottom')
                                                setDrawerOpen(true)
                                            }}
                                        >
                                            Alt
                                        </Button>
                                    </div>
                                    <p className="text-text-secondary text-sm">
                                        Dört farklı pozisyondan açılabilen drawer'lar.
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-text-primary font-helvetica mb-6">
                        Tabs Component'i
                    </h2>

                    <Card>
                        <CardBody className="p-0">
                            <Tabs
                                items={tabItems}
                                value={selectedTab}
                                onValueChange={setSelectedTab}
                                variant="underline"
                            />
                        </CardBody>
                    </Card>

                    {/* Tab Variants */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pills Tabs</CardTitle>
                            </CardHeader>
                            <CardBody className="p-0">
                                <Tabs
                                    items={tabItems.slice(0, 3)}
                                    variant="pills"
                                    size="sm"
                                />
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Cards Tabs</CardTitle>
                            </CardHeader>
                            <CardBody className="p-0">
                                <Tabs
                                    items={tabItems.slice(0, 3)}
                                    variant="cards"
                                    size="sm"
                                />
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Accordion Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-text-primary font-helvetica mb-6">
                        Accordion Component'i
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tekli Accordion</CardTitle>
                                <CardSubtitle>Bir seferde bir panel açık</CardSubtitle>
                            </CardHeader>
                            <CardBody>
                                <Accordion
                                    items={accordionItems}
                                    type="single"
                                    variant="minimal"
                                />
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Çoklu Accordion</CardTitle>
                                <CardSubtitle>Birden fazla panel açık olabilir</CardSubtitle>
                            </CardHeader>
                            <CardBody>
                                <Accordion
                                    items={accordionItems}
                                    type="multiple"
                                    variant="bordered"
                                    size="sm"
                                />
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Collapse Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-text-primary font-helvetica mb-6">
                        Collapse Component'i
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Temel Collapse</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    <Collapse
                                        title="Proje Detayları"
                                        subtitle="Daha fazla bilgi için tıklayın"
                                        icon={FileText}
                                    >
                                        <div className="space-y-3">
                                            <p className="text-text-secondary">
                                                Bu proje React ve Next.js kullanılarak geliştirilmiştir.
                                            </p>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost">Düzenle</Button>
                                                <Button size="sm" variant="ghost">Paylaş</Button>
                                            </div>
                                        </div>
                                    </Collapse>

                                    <Collapse
                                        title="Ekip Üyeleri"
                                        icon={User}
                                        defaultOpen
                                        variant="filled"
                                    >
                                        <div className="space-y-2">
                                            {['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya'].map((name, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-background-secondary rounded">
                                                    <span className="text-text-primary">{name}</span>
                                                    <IconButton icon={MessageCircle} size="sm" variant="ghost" />
                                                </div>
                                            ))}
                                        </div>
                                    </Collapse>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ghost Collapse</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    <Collapse
                                        title="Minimal Görünüm"
                                        ghost
                                        showIcon={false}
                                    >
                                        <p className="text-text-secondary">
                                            Ghost mode ile minimal ve temiz görünüm.
                                        </p>
                                    </Collapse>

                                    <Collapse
                                        title="Custom Trigger"
                                        trigger={
                                            <div className="flex items-center justify-between p-3 bg-primary-gold/10 rounded-lg cursor-pointer hover:bg-primary-gold/20 transition-colors">
                                                <span className="text-text-primary font-semibold">Özel Tetikleyici</span>
                                                <ChevronRight className="w-4 h-4 text-text-secondary" />
                                            </div>
                                        }
                                    >
                                        <div className="mt-3 p-3 bg-background-secondary rounded-lg">
                                            <p className="text-text-secondary">
                                                Özelleştirilmiş tetikleyici ile farklı görünümler elde edebilirsiniz.
                                            </p>
                                        </div>
                                    </Collapse>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-text-secondary font-inter">
                        Bu demo sayfası, NinetyNineAdmin projesinin layout component'lerini göstermektedir
                    </p>
                    <div className="flex justify-center items-center space-x-2 mt-4">
                        <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                        <div className="w-2 h-2 bg-primary-gold/60 rounded-full"></div>
                        <div className="w-2 h-2 bg-primary-gold/30 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Modal Example */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Örnek Modal"
                subtitle="Bu bir demo modal penceresidir"
                icon={Settings}
                size="lg"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>
                            İptal
                        </Button>
                        <Button onClick={() => setModalOpen(false)}>
                            Tamam
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-text-secondary">
                        Bu modal penceresi farklı boyutlarda ve stillerde kullanılabilir.
                        Escape tuşu ile kapatabilir veya overlay'e tıklayarak çıkış yapabilirsiniz.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-background-secondary rounded-lg">
                            <h4 className="text-text-primary font-semibold mb-2">Özellik 1</h4>
                            <p className="text-text-secondary text-sm">
                                Modal içerisinde karmaşık içerikler de yerleştirilebilir.
                            </p>
                        </div>
                        <div className="p-4 bg-background-secondary rounded-lg">
                            <h4 className="text-text-primary font-semibold mb-2">Özellik 2</h4>
                            <p className="text-text-secondary text-sm">
                                Responsive tasarım ile her cihazda mükemmel görünüm.
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Drawer Example */}
            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                position={drawerPosition}
                title={`${drawerPosition.charAt(0).toUpperCase() + drawerPosition.slice(1)} Drawer`}
                subtitle="Bu bir demo drawer'dır"
                icon={Settings}
                size="md"
                footer={
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => setDrawerOpen(false)} fullWidth>
                            İptal
                        </Button>
                        <Button onClick={() => setDrawerOpen(false)} fullWidth>
                            Kaydet
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-text-secondary">
                        Drawer component'i {drawerPosition} pozisyonundan açılıyor.
                        Farklı pozisyonlardan açılabilen yan panel'ler oluşturabilirsiniz.
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                            <span className="text-text-primary">Ayar 1</span>
                            <Button size="sm" variant="ghost">Düzenle</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                            <span className="text-text-primary">Ayar 2</span>
                            <Button size="sm" variant="ghost">Düzenle</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                            <span className="text-text-primary">Ayar 3</span>
                            <Button size="sm" variant="ghost">Düzenle</Button>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    )
} 