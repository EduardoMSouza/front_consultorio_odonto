// services/api.service.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {authService} from "@/lib/services/auth/auth.service";
import {ApiErrorResponse, AuthError} from "@/lib/types/auth/auth.type";

// Configuração base do axios
const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    timeout: 30000, // 30 segundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Flag para controlar se está fazendo refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Interceptor de request
api.interceptors.request.use(
    async (config) => {
        // Adiciona token se existir
        const token = authService.getAccessToken();
        if (token && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Adiciona timestamp para evitar cache
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                _t: Date.now(),
            };
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de response
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Se for erro 401 e não for uma tentativa de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Se já está fazendo refresh, coloca na fila
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Tenta renovar o token
                const refreshToken = authService.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const newTokens = await authService.refreshToken(refreshToken);

                // Atualiza o header da requisição original
                originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;

                // Processa a fila de requisições falhas
                processQueue(null, newTokens.accessToken);

                // Reexecuta a requisição original
                return api(originalRequest);
            } catch (refreshError) {
                // Se falhar no refresh, faz logout
                processQueue(refreshError, null);
                await authService.logout();

                // Redireciona para login se estiver no client
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Para outros erros, formata a resposta
        const apiError = formatError(error);
        return Promise.reject(apiError);
    }
);

// Função para formatar erros da API
function formatError(error: AxiosError): AuthError {
    if (!error.response) {
        return {
            message: 'Erro de conexão. Verifique sua internet.',
        };
    }

    const { status, data } = error.response;
    const apiData = data as ApiErrorResponse;

    let message = 'Erro inesperado';

    if (apiData.message) {
        message = apiData.message;
    } else if (status === 400) {
        message = 'Dados inválidos';
    } else if (status === 401) {
        message = 'Não autorizado';
    } else if (status === 403) {
        message = 'Acesso negado';
    } else if (status === 404) {
        message = 'Recurso não encontrado';
    } else if (status >= 500) {
        message = 'Erro interno do servidor';
    }

    return {
        message,
        status,
        fieldErrors: apiData.fieldErrors,
        errors: apiData.errors,
    };
}

// Métodos utilitários
export const apiService = {
    get: <T>(url: string, config?: AxiosRequestConfig) => api.get<T>(url, config),
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => api.post<T>(url, data, config),
    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => api.put<T>(url, data, config),
    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => api.patch<T>(url, data, config),
    delete: <T>(url: string, config?: AxiosRequestConfig) => api.delete<T>(url, config),
};

export { api };