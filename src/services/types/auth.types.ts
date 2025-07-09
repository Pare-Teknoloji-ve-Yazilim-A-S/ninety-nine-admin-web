// Authentication Domain Types - API-99CLUB Compatible
import { User } from './user.types';

// API-99CLUB TokenDto Schema
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    tokenType: string; // "bearer"
    expiresIn: number; // seconds
}

export interface AuthUser {
    user: User;
    tokens: AuthTokens;
}

// API-99CLUB LoginDto Schema
export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

// API-99CLUB RegisterDto Schema  
export interface RegisterDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone?: string; // Optional phone number
}

export interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

// API-99CLUB RefreshTokenDto Schema
export interface RefreshTokenDto {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

// Password Reset DTOs (Future Implementation)
export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Email Verification DTOs (Future Implementation)
export interface EmailVerificationDto {
    token: string;
}

export interface ResendVerificationDto {
    email: string;
}

// 2FA DTOs (Future Implementation)
export interface Enable2FAResponse {
    qrCode: string;
    secret: string;
    backupCodes: string[];
}

export interface Verify2FADto {
    token: string;
    code: string;
}

export interface Disable2FADto {
    password: string;
    code: string;
}

// Logout DTOs
export interface LogoutDto {
    refreshToken?: string;
}

// Social Login DTOs (Future Implementation)
export interface SocialLoginDto {
    provider: 'google' | 'facebook' | 'github' | 'twitter';
    token: string;
}

export interface SocialLoginResponse {
    user: User;
    tokens: AuthTokens;
    isNewUser: boolean;
    message: string;
}

// Session DTOs (Future Implementation)
export interface SessionInfo {
    id: string;
    userId: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
    isCurrentSession: boolean;
    createdAt: string;
    lastActivityAt: string;
    expiresAt: string;
}

export interface ActiveSessionsResponse {
    sessions: SessionInfo[];
    currentSessionId: string;
}

export interface RevokeSessionDto {
    sessionId: string;
}

// Auth State
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    tokens: AuthTokens | null;
    isLoading: boolean;
    error: string | null;
}

// Permission checking - API-99CLUB Compatible
export interface PermissionCheck {
    resource: string; // "users", "roles", "properties"
    action: string;   // "read", "create", "update", "delete"
}

// Security events (Future Implementation)
export interface SecurityEvent {
    type: 'login' | 'logout' | 'password_change' | 'email_change' | '2fa_enabled' | '2fa_disabled' | 'suspicious_activity';
    description: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
    timestamp: string;
}

export interface SecurityEventsResponse {
    events: SecurityEvent[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
} 