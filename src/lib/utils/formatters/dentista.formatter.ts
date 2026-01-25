// lib/formatters/dentista.formatter.ts

import { DentistaResumoResponse, DentistaResponse } from '@/lib/types/dentista/dentista.type';

export const formatPhone = (phone: string | null | undefined): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    }
    return cleaned;
};

export const formatCRO = (cro: string | null | undefined): string => {
    if (!cro) return '';
    const cleaned = cro.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const letters = cleaned.slice(0, 2);
    const numbers = cleaned.slice(2);
    if (letters.length === 2 && numbers.length > 0) {
        return `${letters}-${numbers}`;
    }
    return cro;
};

export const formatCROForInput = (value: string): string => {
    if (!value) return '';
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const letters = cleaned.slice(0, 2);
    const numbers = cleaned.slice(2, 7);
    if (letters.length === 2 && numbers.length > 0) return `${letters}-${numbers}`;
    if (letters.length === 2) return letters + '-';
    return cleaned;
};

export const formatEmailForInput = (email: string): string => {
    return email.replace(/\s+/g, '').trim();
};

export const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return '';
    return text.toLowerCase()
        .split(/\s+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
};

export const formatProperName = (name: string | null | undefined): string => {
    if (!name) return '';
    const exceptions = ['de', 'da', 'do', 'das', 'dos', 'e'];
    return name
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word =>
            exceptions.includes(word.toLowerCase())
                ? word.toLowerCase()
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
};

export const getStatusBadge = (ativo: boolean): { text: string; variant: 'success' | 'destructive' } => {
    return {
        text: ativo ? 'Ativo' : 'Inativo',
        variant: ativo ? 'success' : 'destructive'
    };
};