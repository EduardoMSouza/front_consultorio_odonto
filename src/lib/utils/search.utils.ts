// lib/utils/search.utils.ts

import { formatDateShort } from './date.utils';
import { cleanDocument } from './document.utils';

export const normalizeDateSearch = (dateStr: string): string => {
    if (!dateStr) return '';
    const numbers = dateStr.replace(/\D/g, '');

    if (numbers.length < 6) return dateStr;

    try {
        const day = numbers.substring(0, 2);
        const month = numbers.substring(2, 4);
        const year = numbers.substring(4);

        let fullYear = year;
        if (year.length === 2) {
            const yearNum = parseInt(year);
            fullYear = yearNum <= new Date().getFullYear() % 100
                ? `20${year.padStart(2, '0')}`
                : `19${year.padStart(2, '0')}`;
        }

        const date = new Date(`${fullYear}-${month}-${day}`);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('pt-BR');
        }
    } catch {
        return dateStr;
    }

    return dateStr;
};

export const searchInDate = (dateString: string | undefined, searchTerm: string): boolean => {
    if (!dateString) return false;

    try {
        const formattedDate = formatDateShort(dateString);
        const normalizedSearch = normalizeDateSearch(searchTerm);

        const searchFormats = [
            formattedDate,
            formattedDate.replace(/\//g, ''),
            formattedDate.replace(/^0/g, ''),
        ].filter(Boolean);

        return searchFormats.some(format =>
            format.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (normalizedSearch && format.includes(normalizedSearch))
        );
    } catch {
        return false;
    }
};

export const searchInText = (text: string | undefined, searchTerm: string): boolean => {
    if (!text) return false;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
};

export const searchInDocument = (document: string | undefined, searchTerm: string): boolean => {
    if (!document) return false;

    const cleanedDoc = cleanDocument(document);
    const cleanedSearch = cleanDocument(searchTerm);

    return cleanedDoc.includes(cleanedSearch) || document.includes(searchTerm);
};