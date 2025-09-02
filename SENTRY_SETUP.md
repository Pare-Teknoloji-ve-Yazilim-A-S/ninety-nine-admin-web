# Sentry Entegrasyonu Kurulum Rehberi

## 🚀 Kurulum Tamamlandı

Sentry başarıyla projenize entegre edildi! Aşağıdaki dosyalar oluşturuldu:

### 📁 Oluşturulan Dosyalar

1. **`src/lib/sentry.ts`** - Sentry konfigürasyonu
2. **`src/app/components/providers/SentryProvider.tsx`** - Sentry provider
3. **`src/app/components/ui/ErrorBoundary.tsx`** - Error boundary component
4. **`src/app/components/ui/SentryTestButton.tsx`** - Test butonları
5. **`src/app/debug/sentry/page.tsx`** - Debug sayfası

### 🔧 Güncellenen Dosyalar

- **`src/app/layout.tsx`** - SentryProvider eklendi

## 🌍 Environment Variables

Proje root'unda `.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://92a96eb68d3c398016dd5f6d355e9b96@o4509943321001984.ingest.de.sentry.io/4509943356850256

# App Version (Sentry release tracking için)
NEXT_PUBLIC_APP_VERSION=1.0.0

# Environment
NODE_ENV=development
```

## 🧪 Test Etme

1. **Debug Sayfası**: `/debug/sentry` adresine gidin
2. **Test Butonları**: Farklı hata türlerini test edin
3. **Error Boundary**: Error boundary'nin çalışıp çalışmadığını kontrol edin

## 📊 Sentry Dashboard

Sentry dashboard'unuzda şunları görebilirsiniz:

- **Errors**: Tüm hatalar ve exception'lar
- **Performance**: Sayfa yükleme süreleri
- **Releases**: Versiyon takibi
- **User Feedback**: Kullanıcı geri bildirimleri

## 🎯 Özellikler

### ✅ Aktif Özellikler

- ✅ Error tracking
- ✅ Performance monitoring
- ✅ Session replay
- ✅ User context tracking
- ✅ Custom error boundaries
- ✅ Breadcrumb tracking
- ✅ Release tracking

### 🔧 Konfigürasyon Detayları

- **Environment**: Development/Production otomatik algılama
- **Sample Rate**: Production'da %10, Development'ta %100
- **PII**: Varsayılan olarak açık (güvenlik için kapatılabilir)
- **Debug**: Development'ta açık
- **Filtering**: Network hataları otomatik filtreleniyor

## 🚨 Production Hazırlığı

Production'a geçmeden önce:

1. **DSN'i güncelleyin**: Production Sentry projesi DSN'i
2. **Sample rate'i ayarlayın**: Performance monitoring için
3. **PII'yi kontrol edin**: Kişisel veri gönderimini kontrol edin
4. **Release tracking**: Her deployment'ta versiyon güncelleyin

## 📝 Kullanım Örnekleri

### Manuel Error Reporting

```typescript
import { captureException, captureMessage } from '@/lib/sentry';

// Exception yakalama
try {
  // Risky code
} catch (error) {
  captureException(error);
}

// Custom message
captureMessage('Kullanıcı önemli bir aksiyon aldı', 'info');
```

### User Context

```typescript
import { setUser, setTag } from '@/lib/sentry';

// Kullanıcı bilgilerini ayarla
setUser({
  id: '123',
  email: 'user@example.com',
  username: 'johndoe'
});

// Tag ekle
setTag('userType', 'admin');
```

### Breadcrumb

```typescript
import { addBreadcrumb } from '@/lib/sentry';

addBreadcrumb({
  message: 'Kullanıcı form gönderdi',
  level: 'info',
  category: 'user-action'
});
```

## 🔍 Monitoring

Sentry dashboard'unuzda şunları izleyebilirsiniz:

- **Error Rate**: Hata oranları
- **Performance**: Sayfa yükleme süreleri
- **User Impact**: Hangi kullanıcılar etkileniyor
- **Release Health**: Her versiyonun sağlığı

## 🆘 Sorun Giderme

### Sentry çalışmıyor mu?

1. Browser console'da hata var mı kontrol edin
2. Network tab'da Sentry istekleri gidiyor mu kontrol edin
3. DSN doğru mu kontrol edin
4. Environment variables doğru ayarlanmış mı kontrol edin

### Çok fazla hata mı geliyor?

1. `beforeSend` fonksiyonunda filtreleme ekleyin
2. Sample rate'i düşürün
3. Sadece production'da aktif edin

## 📚 Daha Fazla Bilgi

- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Error Boundaries](https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/)

---

**Not**: Bu kurulum production-ready'dir. Sadece DSN'i production projenizinki ile değiştirmeyi unutmayın!


