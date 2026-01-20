// services/auth.service.ts
import {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    ChangePasswordRequest,
    AuthError,
    UserResponse
} from '@/models/auth.type';
import { apiService } from './api.service';

class AuthService {
    private readonly baseUrl = '/api/auth';
    private refreshPromise: Promise<LoginResponse | null> | null = null;

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
        // Evita múltiplas requisições de refresh simultâneas
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
                // Se falhar, limpa tokens
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
            // Continua mesmo com erro para limpar localmente
        } finally {
            this.clearTokens();
            this.clearAuthCookie();

            // Redireciona para login
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

            // Redireciona para login
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

        // Verifica se o token está expirado
        if (this.isTokenExpired()) {
            this.clearTokens();
            this.clearAuthCookie();
            return false;
        }

        return true;
    }

    /**
     * Verifica se o token está prestes a expirar (5 minutos)
     */
    isTokenAboutToExpire(): boolean {
        if (typeof window === 'undefined') return false;

        const expiresAt = localStorage.getItem('token_expires_at');
        if (!expiresAt) return true;

        const timeUntilExpiry = parseInt(expiresAt) - Date.now();
        return timeUntilExpiry < 5 * 60 * 1000; // 5 minutos
    }

    /**
     * Obtém token de acesso
     */
    getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    }

    /**
     * Obtém refresh token
     */
    getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('refresh_token');
    }

    /**
     * Obtém informações do usuário
     */
    getUser(): UserResponse | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
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
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    }

    /**
     * Define tokens no localStorage
     */
    private setTokens(data: LoginResponse): void {
        if (typeof window === 'undefined') return;

        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Calcula timestamp de expiração
        const expiresAt = Date.now() + (data.expiresIn * 1000);
        localStorage.setItem('token_expires_at', expiresAt.toString());
    }

    /**
     * Define cookie de autenticação para middleware
     */
    private setAuthCookie(): void {
        if (typeof window === 'undefined') return;

        const date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 dias
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `isAuthenticated=true; ${expires}; path=/; SameSite=Strict`;
    }

    /**
     * Limpa cookie de autenticação
     */
    private clearAuthCookie(): void {
        if (typeof window === 'undefined') return;
        document.cookie = 'isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    /**
     * Limpa tokens do localStorage
     */
    private clearTokens(): void {
        if (typeof window === 'undefined') return;

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expires_at');
    }

    /**
     * Verifica se o token está expirado
     */
    isTokenExpired(): boolean {
        if (typeof window === 'undefined') return true;

        const expiresAt = localStorage.getItem('token_expires_at');
        if (!expiresAt) return true;

        return Date.now() > parseInt(expiresAt);
    }

    /**
     * Tratamento de erros de autenticação
     */
    private handleAuthError(error: any): AuthError {
        console.error('Auth error:', error);

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
                // Trata erros de validação do Spring
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

            // Se o token estiver prestes a expirar, tenta renovar
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