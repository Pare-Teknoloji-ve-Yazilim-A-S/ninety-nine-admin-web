# 🔐 Authentication System Development Prompt

## Project Context

You are tasked with creating a comprehensive authentication system for the 99Club residential management admin panel. This system will serve a large-scale housing project with 2,500 units in Iraq, requiring robust security, multi-language support, and role-based access control.

## Your Task

Design and implement a complete authentication module that includes:

### 1. Core Authentication Features

- Secure login/logout functionality with email and password
- JWT-based authentication with refresh token mechanism
- Two-factor authentication option (SMS/Email OTP)
- "Remember me" functionality lasting 30 days
- Password reset flow with email/SMS verification
- Session management allowing maximum 3 concurrent devices
- Automatic session timeout (configurable between 15 minutes to 24 hours)

### 2. Security Requirements

Implement comprehensive security measures including:

- Brute force protection (lock account after 5 failed attempts for 15 minutes)
- Strong password policy (minimum 8 characters, mixed case, numbers, special characters)
- Password history to prevent reuse of last 5 passwords
- Login anomaly detection for new devices/locations
- Complete audit logging for all authentication events
- Rate limiting (100 requests per minute per IP)
- CSRF protection and XSS prevention
- Optional IP whitelist for super admin accounts

### 3. Role-Based Access Control

Create a flexible permission system with these default roles:

- **Super Admin**: Full system access (maximum 2 users)
- **Admin**: Complete site management capabilities
- **Finance Manager**: Financial operations and reporting only
- **Operator**: Daily operations and basic management
- **Viewer**: Read-only access to all permitted sections

Each role should have granular permissions that can be checked throughout the application.

### 4. Multi-Language Support

The system must support three languages with RTL compatibility:

- Turkish (primary language)
- English
- Arabic (with full RTL layout support)

Language preference should be stored per user and applied immediately upon login.

### 5. User Interface Requirements

Create a professional, modern login interface featuring:

- Split-screen design (form on left, branding/carousel on right)
- Fully responsive design with mobile-first approach
- Clean form validation with inline error messages
- Loading states for all async operations
- Smooth transitions and micro-interactions
- Dark mode support (bonus feature)

### 6. Technical Specifications

- **Frontend**: React with TypeScript
- **State Management**: Redux Toolkit or Zustand
- **Styling**: Tailwind CSS or styled-components
- **Form Handling**: React Hook Form with Yup validation
- **API Communication**: Axios with interceptors
- **Token Storage**: Secure httpOnly cookies for refresh tokens
- **Encryption**: bcrypt for passwords, AES for sensitive data

### 7. API Design

Design RESTful endpoints following best practices:

- Consistent error responses with proper HTTP status codes
- Request/response validation
- Proper CORS configuration
- API versioning strategy
- Rate limiting headers
- Comprehensive API documentation

### 8. Testing Requirements

Implement thorough testing:

- Unit tests for all authentication logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Security testing for common vulnerabilities
- Performance testing for concurrent users
- Accessibility testing (WCAG 2.1 AA compliance)

### 9. Monitoring and Logging

Set up comprehensive monitoring:

- Failed login attempts tracking
- Unusual activity alerts
- Performance metrics (login time, API response time)
- Error tracking and reporting
- User session analytics
- Security event logging

### 10. Additional Considerations

- Implement social login options (Google, Microsoft) for future expansion
- Design the system to handle 10,000+ concurrent users
- Create detailed documentation for other developers
- Implement graceful degradation for poor network conditions
- Design for offline-first capability where possible
- Consider biometric authentication for mobile admin access

## Expected Deliverables

1. Complete authentication module with all features listed above
2. Comprehensive API documentation
3. Security audit report
4. Performance benchmarks
5. Deployment guide with security best practices
6. User manual for different role types

## Success Criteria

- Zero security vulnerabilities in OWASP top 10
- Login process completes in under 2 seconds
- System handles 1000 concurrent login attempts
- 99.9% uptime for authentication services
- Support for all modern browsers (last 2 versions)
- Mobile responsive on all devices
- WCAG 2.1 AA accessibility compliance

Focus on creating a system that is not only secure and functional but also provides an excellent user experience for administrators managing a large residential complex. The authentication system should inspire confidence and be intuitive enough that non-technical staff can use it effectively.
