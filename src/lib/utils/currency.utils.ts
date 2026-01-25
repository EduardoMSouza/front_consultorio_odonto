// lib/utils/currency.utils.ts

export const formatCurrency = (value: number | null): string => {
    if (value === null || value === 0) return 'R$ 0,00';

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

export const parseCurrency = (value: string): number | null => {
    if (!value.trim()) return null;

    const cleanValue = value
        .replace('R$', '')
        .replace(/\s/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim();

    const num = parseFloat(cleanValue);
    return isNaN(num) ? null : num;
};

export const formatToCurrencyInput = (value: string): string => {
    if (!value) return '';

    const numbers = value.replace(/\D/g, '');
    const numberValue = parseInt(numbers) / 100;

    return numberValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export const formatDateTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateString;
    }
};