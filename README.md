# NinetyNine Admin Web Dashboard

NinetyNine Admin Web projesine hoş geldiniz! Bu proje, NinetyNine Club'un admin paneli için geliştirilmiş Next.js tabanlı bir web uygulamasıdır.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18.0.0 veya üzeri
- npm veya yarn package manager

### Kurulum

1. Repository'yi klonlayın:
```bash
git clone <repo-url>
cd ninety-nine-admin-web
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment variables'ı ayarlayın:
```bash
# .env.local dosyası oluşturun
NEXT_PUBLIC_API_URL=https://ninetynineclub-api.onrender.com
```

4. Development sunucusunu başlatın:
```bash
npm run dev
```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🔧 API Proxy Yapılandırması

Bu proje, CORS sorunlarını çözmek için Next.js API routes üzerinden proxy kullanır:

### Nasıl Çalışır?
- Tüm API istekleri `/api/proxy/*` path'ine gönderilir
- Proxy handler, istekleri canlı API'ye (`https://ninetynineclub-api.onrender.com`) yönlendirir
- CORS headers'ları otomatik olarak eklenir
- Authentication token'ları proxy üzerinden geçirilir

### Örnek Kullanım:
```typescript
// Bu istek:
fetch('/api/proxy/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})

// Şu adrese yönlendirilir:
// https://ninetynineclub-api.onrender.com/auth/login
```

### Proxy Özellikleri:
- ✅ Tüm HTTP methodları desteklenir (GET, POST, PUT, PATCH, DELETE)
- ✅ Authorization header'ları otomatik geçirilir
- ✅ CORS headers'ları otomatik eklenir
- ✅ Query parametreleri korunur
- ✅ Error handling ve logging

## 📝 Environment Variables

Projeyi çalıştırmadan önce `.env.local` dosyasını oluşturun:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://ninetynineclub-api.onrender.com
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_MAX_RETRIES=3
NEXT_PUBLIC_API_RETRY_DELAY=1000

# Feature Flags
NEXT_PUBLIC_ENABLE_CACHE=true
NEXT_PUBLIC_ENABLE_MOCKING=false
NEXT_PUBLIC_ENABLE_DEBUG_LOGS=true
```

## 🏗️ Proje Yapısı

```
ninety-nine-admin-web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── proxy/
│   │   │       └── [...path]/
│   │   │           └── route.ts      # Proxy handler
│   │   ├── components/
│   │   ├── dashboard/
│   │   └── login/
│   ├── services/
│   │   ├── config/
│   │   │   └── api.config.ts         # API konfigürasyonu
│   │   ├── auth.service.ts           # Authentication service
│   │   └── api/
│   │       └── client.ts             # API client
│   └── lib/
└── docs/
```

## 🎯 Özellikler

- **🔐 Authentication**: JWT tabanlı kimlik doğrulama
- **🏠 Dashboard**: Admin paneli ana sayfa
- **👥 Resident Management**: Sakin yönetimi
- **🏢 Unit Management**: Daire yönetimi
- **📊 Analytics**: Analitik ve raporlar
- **🎨 UI Components**: Özel tasarım sistemi

## 🔌 API Entegrasyonu

Proje, API-99CLUB ile uyumlu şekilde tasarlanmıştır:

### Authentication Endpoints:
- `POST /auth/login` - Giriş
- `POST /auth/logout` - Çıkış
- `POST /auth/refresh-token` - Token yenileme
- `GET /auth/me` - Kullanıcı bilgileri

### Admin Endpoints:
- `GET /admin/users` - Kullanıcı listesi
- `POST /admin/users` - Kullanıcı oluşturma
- `PUT /admin/users/{id}` - Kullanıcı güncelleme
- `DELETE /admin/users/{id}` - Kullanıcı silme

## 🧪 Test Etme

Proxy yapılandırmasını test etmek için:

1. Development sunucusunu başlatın: `npm run dev`
2. Browser'da Network tab'ını açın
3. Login sayfasına giderek giriş yapmayı deneyin
4. `/api/proxy/auth/login` isteklerini kontrol edin

## 📚 Dokümantasyon

- [AI Context](docs/ai-context.md) - AI geliştirme rehberi
- [Modules](docs/modules/) - Modül dokümantasyonları
- [API Requirements](docs/api-requirements-units-module.md) - API gereksinimleri

## 🚨 Sorun Giderme

### CORS Hatası
Eğer CORS hatası alıyorsanız:
- `.env.local` dosyasının doğru ayarlandığından emin olun
- Development sunucusunu yeniden başlatın

### API Bağlantı Hatası
Eğer API'ye bağlanamıyorsanız:
- `NEXT_PUBLIC_API_URL` değerinin doğru olduğunu kontrol edin
- Canlı API'nin çalıştığından emin olun
- Network tab'ında proxy isteklerini kontrol edin

### Token Hatası
Eğer authentication token hatası alıyorsanız:
- Browser'daki localStorage'ı temizleyin
- Yeniden giriş yapmayı deneyin

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun: `git checkout -b feature/amazing-feature`
3. Commit edin: `git commit -m 'Add amazing feature'`
4. Push edin: `git push origin feature/amazing-feature`
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.