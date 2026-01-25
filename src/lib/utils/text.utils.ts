// lib/utils/text.utils.ts

export const truncateText = (text: string, maxLength: number = 80): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const isEmpty = (text: string): boolean => {
    return !text || text.trim().length === 0;
};

export const normalizeText = (text: string): string => {
    return text.toLowerCase().trim();
};