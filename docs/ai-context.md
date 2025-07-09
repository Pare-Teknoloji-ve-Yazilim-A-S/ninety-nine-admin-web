# AI Context for NinetyNineAdmin

This document provides comprehensive context for AI assistants working on the NinetyNineAdmin project.

## Project Overview

**Name**: NinetyNineAdmin  
**Type**: web  
**Description**: NinetyNineAdmin project created with Pare CLI

## Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React hooks + Context API (add Zustand/Redux if needed)





## Development Guidelines

### Code Organization
```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard routes
│   ├── (auth)/           # Authentication routes
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── forms/            # Form components
├── lib/                  # Utilities and configurations
│   ├── utils.ts          # Utility functions
│   ├── validations.ts    # Zod schemas
│   └── api.ts            # API client
└── types/                # TypeScript definitions
```


### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions/Variables**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Interfaces/Types**: PascalCase with descriptive names

### TypeScript Best Practices
1. Always define proper interfaces/types
2. Use union types for controlled values
3. Implement generic types for reusable components
4. Avoid `any` type - use `unknown` when necessary
5. Utilize type guards for runtime type checking

### React/Next.js Best Practices
1. Use Server Components by default, Client Components when needed
2. Implement proper loading and error states
3. Use React Suspense for data fetching
4. Follow the composition pattern over inheritance
5. Keep components small and focused on single responsibility


## Common Patterns

### Form Handling
```typescript
import { useState } from 'react';
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
});

type UserFormData = z.infer<typeof UserSchema>;

export function UserForm() {
  const [formData, setFormData] = useState<UserFormData>();
  const [errors, setErrors] = useState<Record<string, string>>();
  
  const handleSubmit = async (data: UserFormData) => {
    try {
      const validData = UserSchema.parse(data);
      await submitUser(validData);
    } catch (error) {
      // Handle validation errors
    }
  };
}
```

### Data Fetching
```typescript
import { use } from 'react';

// Server Component
export default function UserList() {
  const users = use(fetchUsers());
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```


## Testing Strategy

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Test user workflows
- **E2E Tests**: Playwright (recommended)


## Performance Considerations

### Frontend Performance
- Use Next.js Image optimization
- Implement code splitting with dynamic imports
- Optimize bundle size with tree shaking
- Use React.memo for expensive components


## Security Guidelines

1. **Input Validation**: Validate all user inputs
2. **Authentication**: Implement proper JWT handling
3. **Authorization**: Use role-based access control
4. **Data Sanitization**: Prevent XSS and injection attacks
5. **Environment Variables**: Never commit secrets

---

This context should help AI assistants provide accurate, contextual suggestions that align with the project's architecture and coding standards.