// Token Manager - Infrastructure Layer
import { apiConfig } from '../config/api.config';

export class TokenManager {
    private accessTokenKey = apiConfig.authTokenKey;
    private refreshTokenKey = apiConfig.refreshTokenKey;

    /**
     * Access token'ı localStorage'dan alır
     */
    getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;

        try {
            return localStorage.getItem(this.accessTokenKey);
        } catch (error) {
            console.warn('Failed to get access token from localStorage:', error);
            return null;
        }
    }

    /**
     * Refresh token'ı localStorage'dan alır
     */
    getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;

        try {
            return localStorage.getItem(this.refreshTokenKey);
        } catch (error) {
            console.warn('Failed to get refresh token from localStorage:', error);
            return null;
        }
    }

    /**
     * Access ve refresh token'ları localStorage'a kaydeder
     */
    setTokens(accessToken: string, refreshToken?: string): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(this.accessTokenKey, accessToken);

            if (refreshToken) {
                localStorage.setItem(this.refreshTokenKey, refreshToken);
            }
        } catch (error) {
            console.error('Failed to set tokens in localStorage:', error);
        }
    }

    /**
     * Sadece access token'ı günceller
     */
    setAccessToken(accessToken: string): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(this.accessTokenKey, accessToken);
        } catch (error) {
            console.error('Failed to set access token in localStorage:', error);
        }
    }

    /**
     * Sadece refresh token'ı günceller
     */
    setRefreshToken(refreshToken: string): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(this.refreshTokenKey, refreshToken);
        } catch (error) {
            console.error('Failed to set refresh token in localStorage:', error);
        }
    }

    /**
     * Tüm token'ları localStorage'dan siler
     */
    clearTokens(): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.removeItem(this.accessTokenKey);
            localStorage.removeItem(this.refreshTokenKey);
        } catch (error) {
            console.error('Failed to clear tokens from localStorage:', error);
        }
    }

    /**
     * Token'ın geçerli olup olmadığını kontrol eder
     */
    isTokenValid(token?: string | null): boolean {
        const tokenToCheck = token || this.getAccessToken();

        if (!tokenToCheck) return false;

        try {
            // JWT token'ın payload kısmını decode et
            const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            // Token'ın süresi dolmuş mu kontrol et
            return payload.exp > currentTime;
        } catch (error) {
            console.warn('Failed to validate token:', error);
            return false;
        }
    }

    /**
     * Token'dan user bilgilerini çıkarır
     */
    getUserFromToken(): any | null {
        const token = this.getAccessToken();

        if (!token || !this.isTokenValid(token)) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.user || payload.sub || null;
        } catch (error) {
            console.warn('Failed to extract user from token:', error);
            return null;
        }
    }

    /**
     * Token'ın ne zaman dolacağını döner (milisaniye)
     */
    getTokenExpiryTime(): number | null {
        const token = this.getAccessToken();

        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000; // Convert to milliseconds
        } catch (error) {
            console.warn('Failed to get token expiry time:', error);
            return null;
        }
    }

    /**
     * Token'ın kalan süresini döner (milisaniye)
     */
    getTokenRemainingTime(): number | null {
        const expiryTime = this.getTokenExpiryTime();

        if (!expiryTime) return null;

        const remainingTime = expiryTime - Date.now();
        return remainingTime > 0 ? remainingTime : 0;
    }

    /**
     * Token otomatik yenileme için gereken süreyi kontrol eder
     */
    shouldRefreshToken(bufferTime: number = 5 * 60 * 1000): boolean {
        const remainingTime = this.getTokenRemainingTime();

        if (!remainingTime) return false;

        return remainingTime <= bufferTime;
    }
} 