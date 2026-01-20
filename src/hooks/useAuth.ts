// hooks/useApi.ts
import { useState, useCallback } from 'react';
import { apiService } from '@/services/api.service';
import { AuthError } from '@/models/auth.type';

interface UseApiOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: AuthError) => void;
    showLoading?: boolean;
}

export function useApi<T = any>() {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<AuthError | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const callApi = useCallback(async (
        method: 'get' | 'post' | 'put' | 'patch' | 'delete',
        url: string,
        data?: any,
        options?: UseApiOptions
    ) => {
        setIsLoading(true);
        setError(null);

        try {
            let response;

            switch (method) {
                case 'get':
                    response = await apiService.get<T>(url);
                    break;
                case 'post':
                    response = await apiService.post<T>(url, data);
                    break;
                case 'put':
                    response = await apiService.put<T>(url, data);
                    break;
                case 'patch':
                    response = await apiService.patch<T>(url, data);
                    break;
                case 'delete':
                    response = await apiService.delete<T>(url);
                    break;
            }

            setData(response.data);

            if (options?.onSuccess) {
                options.onSuccess(response.data);
            }

            return response.data;
        } catch (err: any) {
            const authError: AuthError = {
                message: err.message || 'Erro na requisição',
                status: err.status,
                fieldErrors: err.fieldErrors,
                errors: err.errors,
            };

            setError(authError);

            if (options?.onError) {
                options.onError(authError);
            }

            throw authError;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        data,
        error,
        isLoading,
        get: (url: string, options?: UseApiOptions) => callApi('get', url, undefined, options),
        post: (url: string, data: any, options?: UseApiOptions) => callApi('post', url, data, options),
        put: (url: string, data: any, options?: UseApiOptions) => callApi('put', url, data, options),
        patch: (url: string, data: any, options?: UseApiOptions) => callApi('patch', url, data, options),
        delete: (url: string, options?: UseApiOptions) => callApi('delete', url, undefined, options),
        reset: () => {
            setData(null);
            setError(null);
            setIsLoading(false);
        },
    };
}