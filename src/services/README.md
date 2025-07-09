# Services Architecture - Backend Entegrasyon Yapısı

Bu klasör, NinetyNineAdmin projesi için Clean Architecture yaklaşımına uygun backend entegrasyon altyapısını içerir.

## 📁 Klasör Yapısı

```
src/services/
├── core/                 # Domain layer (entities, interfaces)
│   ├── types.ts         # Temel tipler ve interface'ler
│   └── base.service.ts  # Temel service sınıfı
├── api/                 # Infrastructure layer
│   └── client.ts        # API client (axios wrapper)
├── config/              # Configuration
│   └── api.config.ts    # API konfigürasyonu
├── types/               # Domain-specific types
│   ├── user.types.ts    # User domain types
│   ├── auth.types.ts    # Authentication types
│   └── resident.types.ts # Resident domain types
├── utils/               # Utilities
│   ├── token-manager.ts # Token yönetimi
│   └── logger.ts        # Logging sistemi
├── auth.service.ts      # Authentication service
├── user.service.ts      # User service
├── admin-resident.service.ts # Admin resident management
├── resident.service.ts  # Resident operations (mobile)
└── index.ts            # Ana export dosyası
```

## 🏗️ Clean Architecture Katmanları

### 1. Domain Layer (Core)

- **types.ts**: Temel tipler, interface'ler ve business logic
- **base.service.ts**: Tüm service'lerin extend ettiği temel sınıf

### 2. Application Layer (Services)

- **auth.service.ts**: Authentication işlemleri
- **user.service.ts**: User management işlemleri
- **admin-resident.service.ts**: Admin panel resident yönetimi
- **resident.service.ts**: Resident panel işlemleri (mobile)
- Service'ler business logic'i yönetir

### 3. Infrastructure Layer (API)

- **client.ts**: Axios tabanlı HTTP client
- Token management, interceptors, error handling

### 4. Configuration Layer

- **api.config.ts**: API konfigürasyonu
- Environment variables yönetimi

## 🚀 Kullanım Örnekleri

### Temel Kullanım

```typescript
import {
  authService,
  userService,
  adminResidentService,
  residentService,
  ApiResponse,
  User,
  Resident,
} from "@/services";

// Authentication
const loginResult = await authService.login({
  email: "user@example.com",
  password: "password123",
});

// User operations
const users = await userService.getAllUsers({
  page: 1,
  limit: 10,
  search: "john",
});

// Admin Resident Management
const pendingResidents = await adminResidentService.getPendingResidents({
  page: 1,
  limit: 20,
});

// Approve resident
await adminResidentService.approveResident("resident-id", {
  decision: "APPROVED",
  reason: "All documents verified",
  assignedRole: "resident",
  initialMembershipTier: "SILVER",
});

// Bulk operations
await adminResidentService.bulkApproveResidents(["id1", "id2"], {
  assignedRole: "resident",
  initialMembershipTier: "STANDARD",
});

// Resident Profile Management (Mobile)
const myProfile = await residentService.getMyProfile();

// Upload avatar
await residentService.uploadAvatar("user-id", file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

### Custom Service Oluşturma

```typescript
import { BaseService } from "@/services/core/base.service";

interface Product {
  id: string;
  name: string;
  price: number;
}

class ProductService extends BaseService<Product> {
  protected baseEndpoint = "/products";

  constructor() {
    super("ProductService");
  }

  async getTopSelling(): Promise<Product[]> {
    const response = await this.apiClient.get(
      `${this.baseEndpoint}/top-selling`
    );
    return response.data;
  }
}

export const productService = new ProductService();
```

### Error Handling

```typescript
import { authService, ApiError } from "@/services";

try {
  const user = await authService.login(credentials);
  console.log("Login successful:", user);
} catch (error) {
  const apiError = error as ApiError;
  console.error("Login failed:", apiError.message);

  if (apiError.status === 401) {
    // Handle unauthorized
  } else if (apiError.status === 429) {
    // Handle rate limiting
  }
}
```

## 🔧 Environment Variables

Aşağıdaki environment variables'ları `.env.local` dosyasında tanımlayın:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_MAX_RETRIES=3
NEXT_PUBLIC_API_RETRY_DELAY=1000

# Feature Flags
NEXT_PUBLIC_ENABLE_CACHE=true
NEXT_PUBLIC_ENABLE_MOCKING=false
NEXT_PUBLIC_ENABLE_DEBUG_LOGS=true

# Authentication
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=refresh_token
```

## 🔐 Authentication Flow

```typescript
import { authService } from "@/services";

// 1. Login
const loginResponse = await authService.login({
  email: "user@example.com",
  password: "password123",
});

// 2. Tokens otomatik olarak saklanır
// 3. Sonraki istekler otomatik olarak authenticated olur

// 4. Check authentication status
const isAuthenticated = authService.isAuthenticated();
const currentUser = authService.getUser();

// 5. Logout
await authService.logout();
```

## 📊 Logging

```typescript
import { createLogger } from "@/services";

const logger = createLogger("MyComponent");

logger.info("User action performed", { userId: 123 });
logger.error("Operation failed", error);

// Performance monitoring
const stopTimer = logger.startTimer("api-call");
await someApiCall();
stopTimer(); // Logs execution time
```

## 🔄 Token Management

```typescript
import { TokenManager } from "@/services";

const tokenManager = new TokenManager();

// Token validation
const isValid = tokenManager.isTokenValid();

// Get user from token
const user = tokenManager.getUserFromToken();

// Check if token needs refresh
const shouldRefresh = tokenManager.shouldRefreshToken();

// Manual token operations
tokenManager.setTokens(accessToken, refreshToken);
tokenManager.clearTokens();
```

## 📝 Type Safety

```typescript
import type {
  User,
  CreateUserDto,
  ApiResponse,
  PaginatedResponse,
  LoginDto,
  AuthState,
} from "@/services";

// Fully typed API responses
const response: ApiResponse<User> = await userService.getUserById("123");
const paginatedUsers: PaginatedResponse<User> = await userService.getAllUsers();

// Type-safe DTOs
const newUser: CreateUserDto = {
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  password: "secure123",
  roleId: "user",
};
```

## 🎯 Best Practices

### 1. Service Usage

- Services'leri singleton olarak kullanın
- Error handling'i her zaman implement edin
- Type safety'yi önceliğiniz yapın

### 2. Custom Services

- BaseService'den extend edin
- Logger kullanımını ihmal etmeyin
- Endpoint'leri config'de tanımlayın

### 3. Error Management

- Global error handling için interceptors kullanın
- User-friendly error messages sağlayın
- Retry logic implement edin

### 4. Performance

- Pagination kullanın
- Cache mekanizmalarını kullanın
- Lazy loading implement edin

## 🚀 Yeni Service Ekleme

1. **Types oluşturun:**

```typescript
// src/services/types/product.types.ts
export interface Product extends BaseEntity {
  name: string;
  price: number;
  category: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  categoryId: string;
}
```

2. **Service oluşturun:**

```typescript
// src/services/product.service.ts
import { BaseService } from "./core/base.service";
import { Product, CreateProductDto } from "./types/product.types";

class ProductService extends BaseService<Product, CreateProductDto> {
  protected baseEndpoint = "/products";

  constructor() {
    super("ProductService");
  }
}

export const productService = new ProductService();
```

3. **Index'e ekleyin:**

```typescript
// src/services/index.ts
export { default as productService } from "./product.service";
export * from "./types/product.types";
```

## 🔍 Global Standartlar

Bu services yapısı aşağıdaki global standartlara uygun olarak geliştirilmiştir:

- **Clean Architecture**: Domain, Application, Infrastructure katmanları
- **SOLID Principles**: Single responsibility, Open/closed, vb.
- **DRY (Don't Repeat Yourself)**: BaseService ile kod tekrarını önleme
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error management
- **Logging**: Structured logging system
- **Security**: Token management ve authentication
- **Performance**: Caching, pagination, optimization
- **Scalability**: Modular yapı ve service factory

Bu yapı ile backend entegrasyonu için enterprise-level, ölçeklenebilir ve maintainable bir altyapı elde etmiş olursunuz.
