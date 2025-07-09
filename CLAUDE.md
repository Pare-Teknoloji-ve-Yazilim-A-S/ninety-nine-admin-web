# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
NinetyNine Admin Web - Next.js 14 admin dashboard for apartment/property management system (99Club)

## Development Commands

### Essential Commands
```bash
# Development
npm run dev              # Start development server (http://localhost:3000)

# Build & Production
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

### Environment Setup
- API URL configured via `NEXT_PUBLIC_API_URL` environment variable
- Default development API: `http://localhost:8080`

## Architecture Overview

### Directory Structure
- **`src/app/`** - Next.js App Router pages and layouts
  - Uses App Router (not Pages Router)
  - Protected routes pattern with authentication
  - Nested layouts for dashboard sections
  
- **`src/app/components/ui/`** - Extensive UI component library (30+ components)
  - All components follow consistent design system
  - Uses Radix UI primitives with custom styling
  - Components are self-contained with TypeScript interfaces
  
- **`src/services/`** - API service layer
  - Base service classes in `core/`
  - Axios-based API client with interceptors
  - Consistent error handling patterns

### Key Architectural Patterns

1. **Service Layer Pattern**
   - All API calls go through service classes
   - Base service provides CRUD operations
   - Services handle authentication tokens automatically

2. **Component Architecture**
   - Presentation components in `ui/`
   - Feature components colocated with pages
   - Consistent prop interfaces with TypeScript

3. **State Management**
   - React hooks for local state
   - Service layer handles API state
   - Form state via React Hook Form

4. **Authentication Flow**
   - JWT token-based authentication
   - Protected routes using middleware pattern
   - Token stored in localStorage/cookies

## Design System & Styling

### NinetyNine Brand Guidelines
- **Primary Color**: Gold `#AC8D6A` - Used for primary actions and brand elements
- **Color Philosophy**: Warm, premium aesthetic avoiding cold colors
- **Background**: Warm whites (`#FAFAF9`, `#F5F5F4`) instead of pure white
- **Text**: Warm grays (`#0A0A0A`, `#525252`) for better readability

### Tailwind Configuration
- Extended color palette with semantic naming
- Custom spacing and typography scales
- Predefined animation classes
- Mobile-first responsive design

### Component Styling Rules
- Use Tailwind utility classes
- Follow existing component patterns in `ui/` directory
- Maintain consistency with warm color palette
- Ensure WCAG AA compliance for accessibility

## API Integration

### Service Usage Pattern
```typescript
// Example: Using a service
import { ResidentService } from '@/services/resident.service';

const residentService = new ResidentService();
const residents = await residentService.getAll();
```

### API Response Format
- Consistent response structure across all endpoints
- Error handling with proper status codes
- Pagination support for list endpoints

## Form Handling
- Use React Hook Form for all forms
- Validation schemas with TypeScript
- Consistent error display patterns
- Loading states during submission

## Important Context Files
- **`.cursorrules`** - Comprehensive coding standards and component examples
- **`docs/ai-context.md`** - Detailed project context and business logic
- **`docs/information-architect.md`** - Dashboard information architecture
- **`tailwind.config.ts`** - Complete design system configuration