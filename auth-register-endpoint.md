# Register Endpoint Documentation

## Overview
**Endpoint:** `POST /auth/register`  
**Controller:** `AuthController`  
**Access:** Public (No authentication required)  
**Purpose:** User registration with document verification

## Request

### Headers
```
Content-Type: application/json
```

### Request Body Structure

```json
{
  "personalInfo": {
    "firstName": "string",
    "lastName": "string", 
    "phone": "string (optional)",
    "email": "string",
    "password": "string"
  },
  "propertyInfo": {
    "name": "string",
    "block": "string", 
    "propertyNumber": "string",
    "propertyType": "PropertyType enum",
    "ownershipType": "owner | tenant"
  },
  "documents": [
    {
      "type": "string",
      "url": "string"
    }
  ]
}
```

## DTOs

### PersonalInfoDto
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `firstName` | string | ✅ | @IsNotEmpty | Kullanıcının adı |
| `lastName` | string | ✅ | @IsNotEmpty | Kullanıcının soyadı |
| `phone` | string | ❌ | @IsOptional | Telefon numarası |
| `email` | string | ✅ | @IsEmail, @IsNotEmpty | E-posta adresi (unique) |
| `password` | string | ✅ | @MinLength(8) | Şifre (minimum 8 karakter) |

### PropertyInfoDto  
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `name` | string | ✅ | @IsNotEmpty | Gayrimenkul adı |
| `block` | string | ✅ | @IsNotEmpty | Blok bilgisi |
| `propertyNumber` | string | ✅ | @IsNotEmpty | Daire/Unit numarası |
| `propertyType` | PropertyType | ✅ | @IsEnum(PropertyType) | Gayrimenkul tipi |
| `ownershipType` | string | ✅ | @IsNotEmpty | Sahiplik durumu (owner/tenant) |

### DocumentDto
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `type` | string | ✅ | @IsNotEmpty | Belge tipi |
| `url` | string | ✅ | @IsNotEmpty | Belge URL'i |

## Enums

### PropertyType
```typescript
enum PropertyType {
  RESIDENCE = 'RESIDENCE',    // Konut
  VILLA = 'VILLA',           // Villa  
  COMMERCIAL = 'COMMERCIAL', // Ticari
  OFFICE = 'OFFICE'          // Ofis
}
```

### OwnershipType
```typescript
type OwnershipType = 'owner' | 'tenant';
```

### UserStatus (System-assigned)
```typescript
enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE', 
  PENDING = 'PENDING',      // Default for new registrations
  BANNED = 'BANNED',
  SUSPENDED = 'SUSPENDED'
}
```

### VerificationStatus (System-assigned)
```typescript
enum VerificationStatus {
  PENDING = 'PENDING',        // Default for new registrations
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED', 
  UNDER_REVIEW = 'UNDER_REVIEW'
}
```

## Response

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "User successfully registered and pending verification",
  "userId": "uuid-string",
  "status": "PENDING"
}
```

### Error Responses

#### 409 Conflict - Email Already Exists
```json
{
  "statusCode": 409,
  "message": "Bu e-posta adresi zaten kayıtlı. Lütfen farklı bir e-posta kullanın.",
  "error": "Conflict"
}
```

#### 409 Conflict - Phone Already Exists  
```json
{
  "statusCode": 409,
  "message": "Bu telefon numarası zaten kayıtlı. Lütfen farklı bir telefon numarası kullanın.",
  "error": "Conflict"
}
```

#### 400 Bad Request - Validation Error
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters",
    "propertyType must be a valid PropertyType"
  ],
  "error": "Bad Request"
}
```

## Example Usage

### Valid Request Example
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "personalInfo": {
      "firstName": "Ahmet",
      "lastName": "Yılmaz", 
      "phone": "+905551234567",
      "email": "ahmet.yilmaz@email.com",
      "password": "securePassword123"
    },
    "propertyInfo": {
      "name": "Residence Premium",
      "block": "A",
      "propertyNumber": "12",
      "propertyType": "RESIDENCE",
      "ownershipType": "owner"
    },
    "documents": [
      {
        "type": "identity_card",
        "url": "https://example.com/documents/identity-123.pdf"
      },
      {
        "type": "property_deed", 
        "url": "https://example.com/documents/deed-456.pdf"
      }
    ]
  }'
```

### Success Response Example
```json
{
  "success": true,
  "message": "User successfully registered and pending verification",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "PENDING"
}
```

## Process Flow

1. **Validation**: Request body validation ile kontrol edilir
2. **Duplicate Check**: Email ve telefon numarası benzersizlik kontrolü
3. **Default Role**: Kullanıcıya otomatik olarak 'resident' rolü atanır  
4. **Password Hash**: Şifre hash'lenerek güvenli şekilde saklanır
5. **User Creation**: Kullanıcı `PENDING` status ile oluşturulur
6. **Document Storage**: Belgeler JSON formatında user entity'sine eklenir
7. **Transaction**: Tüm işlemler database transaction içinde yapılır

## Notes

- ✅ Public endpoint - Kimlik doğrulaması gerektirmez
- ✅ Yeni kullanıcılar otomatik olarak `PENDING` status ile oluşturulur
- ✅ Verification status `PENDING` olarak ayarlanır  
- ✅ Default role olarak `resident` atanır
- ✅ Email ve telefon numarası unique olmalıdır
- ✅ Şifreler bcrypt ile hash'lenir
- ✅ Documents array en az 1 belge içermelidir
- ✅ Tüm işlem database transaction içinde yapılır
- ⚠️ Kullanıcı admin onayı beklemek zorundadır (verification süreci)

## Related Endpoints

- `POST /auth/login` - Kullanıcı girişi
- `GET /admin/users/pending` - Onay bekleyen kullanıcıları listele  
- `PUT /admin/users/{id}/approve` - Kullanıcı onaylama
- `PUT /admin/users/{id}/reject` - Kullanıcı reddetme 