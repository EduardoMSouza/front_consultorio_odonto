import { AuthError } from '@/models/auth.type';

export function formatFieldErrors(errors: Record<string, string[]>): Record<string, string> {
    const formatted: Record<string, string> = {};

    Object.entries(errors).forEach(([field, messages]) => {
        formatted[field] = messages.join(', ');
    });

    return formatted;
}

export function getErrorMessage(error: any): string {
    if (typeof error === 'string') return error;

    if (error?.message) {
        return error.message;
    }

    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    return 'Ocorreu um erro inesperado';
}