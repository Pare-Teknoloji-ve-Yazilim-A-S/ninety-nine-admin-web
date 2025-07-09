# GitHub Copilot Instructions for NinetyNineAdmin

## Project Overview
**NinetyNineAdmin** is a web project built with modern TypeScript technologies.

NinetyNineAdmin project created with Pare CLI

## Technology Stack

### Frontend Stack:
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with modern hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework




## Coding Guidelines

### General Principles:
1. **Type Safety First**: Always use TypeScript types and interfaces
2. **Functional Approach**: Prefer functional components and pure functions
3. **Error Handling**: Implement comprehensive error handling
4. **Performance**: Consider performance implications of suggestions
5. **Consistency**: Follow established patterns in the codebase

### React/Next.js Specific:
- Use App Router conventions (`app/` directory)
- Implement Server Components for data fetching
- Use Client Components only when necessary (`'use client'`)
- Follow React Hooks best practices
- Implement proper loading and error states
- Use Tailwind CSS for styling

### Component Patterns:
```typescript
// Server Component (default)
export default async function UserList() {
  const users = await fetchUsers();
  return <div>{/* JSX */}</div>;
}

// Client Component (interactive)
'use client';
export function UserForm() {
  const [user, setUser] = useState<User>();
  return <form>{/* Interactive JSX */}</form>;
}
```


### File Structure Guidelines:

```
src/
├── app/                 # Next.js App Router
│   ├── (routes)/       # Route groups
│   ├── api/           # API routes
│   └── globals.css    # Global styles
├── components/         # Reusable UI components
├── lib/               # Utilities and configurations
└── types/             # TypeScript type definitions
```


## Code Suggestions Guidelines

When providing code suggestions:

1. **Context Awareness**: Consider the existing project structure and patterns
2. **Type Safety**: Always include proper TypeScript types
3. **Best Practices**: Follow framework-specific best practices
4. **Error Handling**: Include appropriate error handling
5. **Performance**: Consider performance implications
6. **Testing**: Suggest testable code patterns


## Common Patterns to Suggest

### React Hooks:
```typescript
// Custom data fetching hook
const useUser = (id: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchUser(id).then(setUser).catch(setError).finally(() => setLoading(false));
  }, [id]);
  
  return { user, loading, error };
};
```


---

This project follows modern development practices. Please suggest code that aligns with these guidelines and the established project structure.