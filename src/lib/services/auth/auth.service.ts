// lib/services/auth/auth.service.ts

import {
    AuthError,
    ChangePasswordRequest,
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    UserResponse
} from "@/lib/types/auth/auth.type";
import { apiService } from "@/lib/api/api.service";
import envConfig from "@/lib/config/env.config";

class AuthService {
    private readonly baseUrl = '/api/auth';
    private refreshPromise: Promise<LoginResponse | null> | null = null;

    // Usa as chaves do .env.local ao invés de valores fixos
    private readonly KEYS = envConfig.storage.keys;
    private readonly COOKIES = envConfig.cookies.names;

    /**
     * Realiza login
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await apiService.post<LoginResponse>(
                `${this.baseUrl}/login`,
                credentials
            );

            if (response.data) {
                this.setTokens(response.data);
                this.setAuthCookie();
            }

            return response.data;
        } catch (error: any) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Renova tokens usando refresh token
     */
    async refreshToken(refreshToken: string): Promise<LoginResponse> {
        if (this.refreshPromise) {
            return this.refreshPromise as Promise<LoginResponse>;
        }

        this.refreshPromise = (async () => {
            try {
                const request: RefreshTokenRequest = { refreshToken };
                const response = await apiService.post<LoginResponse>(
                    `${this.baseUrl}/refresh`,
                    request
                );

                if (response.data) {
                    this.setTokens(response.data);
                    this.setAuthCookie();
                }

                return response.data;
            } catch (error: any) {
                this.clearTokens();
                throw error;
            } finally {
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    /**
     * Realiza logout
     */
    async logout(): Promise<void> {
        try {
            const token = this.getAccessToken();
            if (token) {
                await apiService.post(
                    `${this.baseUrl}/logout`,
                    null,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            }
        } catch (error: any) {
            console.error('Erro no logout:', error);
        } finally {
            this.clearTokens();
            this.clearAuthCookie();

            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }

    /**
     * Altera senha do usuário logado
     */
    async changePassword(data: ChangePasswordRequest): Promise<void> {
        try {
            await apiService.post(`${this.baseUrl}/alterar-senha`, data);
        } catch (error: any) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Realiza logout de todos os dispositivos
     */
    async logoutAllDevices(): Promise<void> {
        try {
            await apiService.post(`${this.baseUrl}/logout-all-devices`);
            this.clearTokens();
            this.clearAuthCookie();

            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        } catch (error: any) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Verifica se o usuário está autenticado
     */
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;

        const token = this.getAccessToken();
        if (!token) return false;

        if (this.isTokenExpired()) {
            this.clearTokens();
            this.clearAuthCookie();
            return false;
        }

        return true;
    }

    /**
     * Verifica se o token está prestes a expirar
     */
    isTokenAboutToExpire(): boolean {
        if (typeof window === 'undefined') return false;

        const expiresAt = localStorage.getItem(this.KEYS.tokenExpires);
        if (!expiresAt) return true;

        const timeUntilExpiry = parseInt(expiresAt) - Date.now();
        return timeUntilExpiry < envConfig.token.refreshBeforeExpiry;
    }

    /**
     * Obtém token de acesso
     */
    getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.KEYS.accessToken);
    }

    /**
     * Obtém refresh token
     */
    getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.KEYS.refreshToken);
    }

    /**
     * Obtém informações do usuário
     */
    getUser(): UserResponse | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem(this.KEYS.user);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Atualiza informações do usuário
     */
    updateUser(user: Partial<UserResponse>): void {
        if (typeof window === 'undefined') return;

        const currentUser = this.getUser();
        if (currentUser) {
            const updatedUser = { ...currentUser, ...user };
            localStorage.setItem(this.KEYS.user, JSON.stringify(updatedUser));
        }
    }

    /**
     * Define tokens no localStorage (usando chaves do .env.local)
     */
    private setTokens(data: LoginResponse): void {
        if (typeof window === 'undefined') return;

        // Usa as chaves definidas no .env.local
        localStorage.setItem(this.KEYS.accessToken, data.accessToken);
        localStorage.setItem(this.KEYS.refreshToken, data.refreshToken);
        localStorage.setItem(this.KEYS.user, JSON.stringify(data.user));

        const expiresAt = Date.now() + (data.expiresIn * 1000);
        localStorage.setItem(this.KEYS.tokenExpires, expiresAt.toString());

        // Log em desenvolvimento
        if (envConfig.dev.showStorageData) {
            console.log('🔐 Tokens armazenados com as chaves:', {
                accessToken: this.KEYS.accessToken,
                refreshToken: this.KEYS.refreshToken,
                user: this.KEYS.user,
                expires: this.KEYS.tokenExpires,
            });
        }
    }

    /**
     * Define cookie de autenticação (usando nome do .env.local)
     */
    private setAuthCookie(): void {
        if (typeof window === 'undefined') return;

        const date = new Date();
        date.setTime(date.getTime() + (envConfig.cookies.config.maxAge * 1000));
        const expires = `expires=${date.toUTCString()}`;

        // Usa o nome do cookie definido no .env.local
        document.cookie = `${this.COOKIES.auth}=true; ${expires}; path=/; SameSite=${envConfig.cookies.config.sameSite}`;
    }

    /**
     * Limpa cookie de autenticação (usando nome do .env.local)
     */
    private clearAuthCookie(): void {
        if (typeof window === 'undefined') return;
        document.cookie = `${this.COOKIES.auth}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    /**
     * Limpa tokens do localStorage (usando chaves do .env.local)
     */
    private clearTokens(): void {
        if (typeof window === 'undefined') return;

        localStorage.removeItem(this.KEYS.accessToken);
        localStorage.removeItem(this.KEYS.refreshToken);
        localStorage.removeItem(this.KEYS.user);
        localStorage.removeItem(this.KEYS.tokenExpires);
    }

    /**
     * Verifica se o token está expirado
     */
    isTokenExpired(): boolean {
        if (typeof window === 'undefined') return true;

        const expiresAt = localStorage.getItem(this.KEYS.tokenExpires);
        if (!expiresAt) return true;

        return Date.now() > parseInt(expiresAt);
    }

    /**
     * Tratamento de erros de autenticação
     */
    private handleAuthError(error: any): AuthError {
        if (envConfig.dev.debugMode) {
            console.error('❌ Auth error:', error);
        }

        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                this.clearTokens();
                this.clearAuthCookie();

                return {
                    message: 'Sessão expirada. Faça login novamente.',
                    status
                };
            }

            if (status === 400) {
                if (data.fieldErrors || data.errors) {
                    return {
                        message: 'Dados inválidos',
                        status,
                        fieldErrors: data.fieldErrors,
                        errors: data.errors
                    };
                }

                return {
                    message: data?.message || 'Dados inválidos',
                    status
                };
            }

            if (status === 403) {
                return {
                    message: 'Acesso negado. Você não tem permissão.',
                    status
                };
            }

            return {
                message: data?.message || `Erro ${status} na autenticação`,
                status
            };
        }

        if (error.request) {
            return {
                message: 'Erro de conexão. Verifique sua internet.'
            };
        }

        return {
            message: error.message || 'Erro inesperado na autenticação'
        };
    }

    /**
     * Verifica se a sessão é válida
     */
    async validateSession(): Promise<boolean> {
        try {
            const token = this.getAccessToken();
            if (!token) return false;

            if (this.isTokenAboutToExpire()) {
                const refreshToken = this.getRefreshToken();
                if (refreshToken) {
                    await this.refreshToken(refreshToken);
                    return true;
                }
                return false;
            }

            return !this.isTokenExpired();
        } catch (error) {
            return false;
        }
    }
}

export const authService = new AuthService();