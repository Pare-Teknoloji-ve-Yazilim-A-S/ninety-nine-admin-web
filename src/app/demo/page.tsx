'use client'

import { useState } from 'react'
import { Input, Select, Checkbox, RadioButton, TextArea, DatePicker, FileUpload } from '../components/ui'
import { Mail, Lock, User } from 'lucide-react'

export default function Demo() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        country: '',
        message: '',
        birthdate: '',
        newsletter: false,
        gender: '',
        files: null as FileList | null
    })

    const countries = [
        { value: 'tr', label: 'Türkiye' },
        { value: 'us', label: 'Amerika' },
        { value: 'uk', label: 'İngiltere' },
        { value: 'de', label: 'Almanya' },
        { value: 'fr', label: 'Fransa' }
    ]

    const genderOptions = [
        { value: 'male', label: 'Erkek' },
        { value: 'female', label: 'Kadın' },
        { value: 'other', label: 'Diğer' }
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form Data:', formData)
        alert('Form gönderildi! Konsolu kontrol edin.')
    }

    return (
        <div className="min-h-screen bg-background-primary py-10">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-text-primary font-helvetica mb-4">
                        Form Component'leri Demo
                    </h1>
                    <div className="w-24 h-1 bg-gradient-gold mx-auto rounded-full mb-6"></div>
                    <p className="text-text-secondary text-lg font-inter max-w-2xl mx-auto">
                        Modern ve kullanıcı dostu form elementlerinin kapsamlı demo sayfası.
                        Tüm component'leri test edebilir ve özelliklerini keşfedebilirsiniz.
                    </p>
                </div>

                {/* Main Form Container */}
                <div className="bg-background-card rounded-xl shadow-card border border-primary-gold/20 overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-gold p-6 text-center">
                        <h2 className="text-2xl font-semibold text-primary-dark-gray font-helvetica">
                            Kullanıcı Bilgileri Formu
                        </h2>
                        <p className="text-primary-dark-gray/70 mt-2 font-inter">
                            Aşağıdaki formu doldurarak tüm component'leri test edebilirsiniz
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Information Section */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-2 h-8 bg-primary-gold rounded-full"></div>
                                    <h3 className="text-xl font-semibold text-text-primary font-helvetica">
                                        Kişisel Bilgiler
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Input
                                        label="Ad Soyad"
                                        placeholder="Adınızı ve soyadınızı girin"
                                        value={formData.name}
                                        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                                        icon={User}
                                        isRequired
                                        className="bg-background-secondary border-primary-gold/30 text-text-primary placeholder:text-text-secondary"
                                    />

                                    <Input
                                        label="E-posta"
                                        type="email"
                                        placeholder="example@email.com"
                                        value={formData.email}
                                        onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                                        icon={Mail}
                                        isRequired
                                        className="bg-background-secondary border-primary-gold/30 text-text-primary placeholder:text-text-secondary"
                                    />
                                </div>

                                <Input
                                    label="Şifre"
                                    type="password"
                                    placeholder="Güçlü bir şifre girin"
                                    value={formData.password}
                                    onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                                    icon={Lock}
                                    variant="filled"
                                    helperText="En az 8 karakter, büyük harf, küçük harf ve rakam içermelidir"
                                    isRequired
                                    className="bg-background-secondary border-primary-gold/30 text-text-primary placeholder:text-text-secondary"
                                />

                                <DatePicker
                                    label="Doğum Tarihi"
                                    value={formData.birthdate}
                                    onChange={(e: any) => setFormData({ ...formData, birthdate: e.target.value })}
                                    maxDate={new Date().toISOString().split('T')[0]}
                                    className="bg-background-secondary border-primary-gold/30 text-text-primary"
                                />
                            </div>

                            {/* Location & Preferences Section */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-2 h-8 bg-primary-gold rounded-full"></div>
                                    <h3 className="text-xl font-semibold text-text-primary font-helvetica">
                                        Konum ve Tercihler
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Select
                                        label="Ülke"
                                        placeholder="Ülkenizi seçin"
                                        options={countries}
                                        value={formData.country}
                                        onChange={(e: any) => setFormData({ ...formData, country: e.target.value })}
                                        isRequired
                                        className="bg-background-secondary border-primary-gold/30 text-text-primary"
                                    />

                                    <div className="space-y-4">
                                        <RadioButton
                                            label="Cinsiyet"
                                            options={genderOptions}
                                            name="gender"
                                            value={formData.gender}
                                            onChange={(e: any) => setFormData({ ...formData, gender: e.target.value })}
                                            direction="horizontal"
                                            className="text-text-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Message Section */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-2 h-8 bg-primary-gold rounded-full"></div>
                                    <h3 className="text-xl font-semibold text-text-primary font-helvetica">
                                        Mesaj ve Dosyalar
                                    </h3>
                                </div>

                                <TextArea
                                    label="Mesaj"
                                    placeholder="Mesajınızı yazın..."
                                    value={formData.message}
                                    onChange={(e: any) => setFormData({ ...formData, message: e.target.value })}
                                    maxLength={500}
                                    showCount
                                    helperText="Geri bildirimlerinizi, sorularınızı veya önerilerinizi paylaşın"
                                    className="bg-background-secondary border-primary-gold/30 text-text-primary placeholder:text-text-secondary"
                                />

                                <FileUpload
                                    label="Dosya Yükle"
                                    acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.png']}
                                    maxSize={10}
                                    multiple
                                    onFilesChange={(files) => setFormData({ ...formData, files })}
                                    helperText="CV, portfolyo veya diğer belgelerinizi yükleyebilirsiniz (PDF, Word, Resim)"
                                    className="bg-background-secondary border-primary-gold/30"
                                />
                            </div>

                            {/* Agreements Section */}
                            <div className="space-y-4 pt-6 border-t border-primary-gold/20">
                                <Checkbox
                                    label="E-posta bültenine abone olmak istiyorum"
                                    checked={formData.newsletter}
                                    onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                                    helperText="Haftalık güncellemeler, yeni özellikler ve özel fırsatlar hakkında bilgi alın"
                                    className="text-text-primary"
                                />

                                <Checkbox
                                    label="Kullanım koşullarını ve gizlilik politikasını okudum, kabul ediyorum"
                                    helperText="Devam etmek için bu alanı işaretlemeniz gerekmektedir"
                                    className="text-text-primary"
                                />
                            </div>

                            {/* Submit Section */}
                            <div className="pt-8 border-t border-primary-gold/20">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        type="button"
                                        className="px-8 py-3 bg-transparent border border-primary-gold text-text-accent hover:bg-primary-gold hover:text-primary-dark-gray transition-all duration-300 rounded-lg font-semibold font-helvetica"
                                    >
                                        Önizleme
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-gradient-gold text-primary-dark-gray hover:opacity-90 transition-all duration-300 rounded-lg font-semibold font-helvetica shadow-lg"
                                    >
                                        Formu Gönder
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <p className="text-text-secondary font-inter">
                        Bu demo sayfası, NinetyNineAdmin projesinin form component'lerini göstermektedir
                    </p>
                    <div className="flex justify-center items-center space-x-2 mt-4">
                        <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                        <div className="w-2 h-2 bg-primary-gold/60 rounded-full"></div>
                        <div className="w-2 h-2 bg-primary-gold/30 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    )
} 