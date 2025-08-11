# IDE Configuration Guide for List Pages

Bu rehber, NestJS liste sayfaları geliştirmek için Cursor ve Trae IDE'lerinde kullanılacak ayar dosyalarını açıklar.

## 📁 Dosya Yapısı

```
project-root/
├── .cursor/
│   ├── rules/
│   │   └── list-pages-rules.md          # Cursor AI için liste sayfaları kuralları
│   └── settings/
│       └── typescript-list-pages.json   # TypeScript özel ayarları
├── .trae/
│   ├── rules/
│   │   └── list-pages-architecture.md   # Trae için mimari kuralları
│   └── workspace.json                   # Trae workspace ayarları
├── .cursorrules                         # Ana Cursor kuralları (güncellenmiş)
└── .editorconfig                        # Kod formatı tutarlılığı
```

## 🎯 Cursor IDE Ayarları

### 1. Ana Kurallar (.cursorrules)
Ana `.cursorrules` dosyasına liste sayfaları için özel bölüm eklendi:
- Frontend pattern'leri (hooks, components)
- Backend pattern'leri (controllers, services)
- TypeScript DTO validasyonları
- Error handling kuralları

### 2. Detaylı Liste Sayfaları Kuralları (.cursor/rules/list-pages-rules.md)
**İçerik:**
- NestJS backend mimarisi
- Frontend (Next.js) yapısı
- Pagination, filtering, sorting implementasyonu
- Performance optimizasyonları
- Testing stratejileri
- Security guidelines

**Kullanım:**
Cursor AI bu dosyayı otomatik olarak okur ve liste sayfaları geliştirirken bu kurallara uyar.

### 3. TypeScript Özel Ayarları (.cursor/settings/typescript-list-pages.json)
**Özellikler:**
- Strict type checking
- Liste sayfaları için özel tip tanımları
- Path mapping
- Code generation templates

## 🏗️ Trae IDE Ayarları

### 1. Mimari Kuralları (.trae/rules/list-pages-architecture.md)
**İçerik:**
- Clean Architecture principles
- Domain-Driven Design (DDD)
- CQRS pattern implementation
- Repository Pattern
- Event-Driven Architecture

### 2. Workspace Ayarları (.trae/workspace.json)
**Özellikler:**
- Proje metadata
- Editor ayarları
- Task definitions
- Debug configuration
- Code generation templates

## 📝 EditorConfig (.editorconfig)

**Amaç:** Hem Cursor hem de Trae IDE'de tutarlı kod formatlaması

**Ayarlar:**
- 2 space indentation
- UTF-8 encoding
- LF line endings
- Trim trailing whitespace
- Insert final newline

## 🚀 Kullanım Kılavuzu

### Cursor IDE'de Liste Sayfası Oluşturma

1. **Yeni dosya oluştur:** `src/modules/[module-name]/[module-name].controller.ts`
2. **Cursor AI'ya sor:** "Create a list page controller for [module-name] with pagination, filtering and sorting"
3. **AI otomatik olarak:**
   - `.cursor/rules/list-pages-rules.md` kurallarını uygular
   - Proper DTO'lar oluşturur
   - Pagination logic ekler
   - Error handling ekler

### Trae IDE'de Mimari Tasarım

1. **Proje aç:** Trae IDE'de projeyi aç
2. **Workspace ayarları:** `.trae/workspace.json` otomatik yüklenir
3. **Mimari pattern'ler:** `.trae/rules/list-pages-architecture.md` kuralları uygulanır
4. **Code generation:** Built-in templates kullanılır

## 🔧 Özelleştirme

### Yeni Kurallar Ekleme

**Cursor için:**
```markdown
# .cursor/rules/list-pages-rules.md dosyasına ekle

## Yeni Kural Başlığı
- Kural açıklaması
- Kod örnekleri
- Best practices
```

**Trae için:**
```markdown
# .trae/rules/list-pages-architecture.md dosyasına ekle

## Yeni Mimari Pattern
- Pattern açıklaması
- Implementation details
- Use cases
```

### TypeScript Ayarları Güncelleme

```json
// .cursor/settings/typescript-list-pages.json
{
  "listPagesTypes": {
    "newType": {
      "interface": "NewTypeDto",
      "properties": {
        "property": "type"
      }
    }
  }
}
```

## 📊 Performans Optimizasyonları

### Database
- Index optimization
- Query caching
- Connection pooling

### Frontend
- Virtual scrolling
- Debounced search
- Memoized components

### Backend
- Redis caching
- Pagination limits
- Query optimization

## 🔒 Güvenlik

### Input Validation
- DTO validation with class-validator
- SQL injection prevention
- XSS protection

### Authorization
- Role-based access control
- Resource-level permissions
- API rate limiting

## 🧪 Testing

### Unit Tests
```typescript
// Controller test example
describe('ModuleController', () => {
  it('should return paginated data', async () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
// Service integration test
describe('ModuleService Integration', () => {
  it('should filter and paginate correctly', async () => {
    // Test implementation
  });
});
```

## 📚 Kaynaklar

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

## 🤝 Katkıda Bulunma

Yeni kurallar veya iyileştirmeler için:
1. İlgili dosyayı düzenle
2. Değişiklikleri test et
3. Dokümantasyonu güncelle
4. Pull request oluştur

---

**Not:** Bu ayar dosyaları NinetyNine Admin Web projesinin mevcut mimarisine uygun olarak hazırlanmıştır. Proje gereksinimlerine göre özelleştirilebilir.