// lib/validators/dentista.validator.ts

import { DentistaRequest } from '@/lib/types/dentista/dentista.type';
import { isEmpty } from '@/lib/utils/text.utils';

export interface DentistaValidationErrors {
    nome?: string;
    cro?: string;
    especialidade?: string;
    telefone?: string;
    email?: string;
}

const cleanCRO = (cro: string): string => {
    return cro.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

const cleanPhone = (telefone: string): string => {
    return telefone.replace(/\D/g, '');
};

const formatEmailForInput = (email: string): string => {
    return email.replace(/\s+/g, '').trim();
};

export const isValidCRO = (cro: string): boolean => {
    const cleaned = cleanCRO(cro);
    return /^[A-Z]{2}\d{5}$/.test(cleaned);
};

export const isValidPhone = (telefone: string): boolean => {
    return cleanPhone(telefone).length === 11;
};

export const isValidEmail = (email: string): boolean => {
    const cleaned = formatEmailForInput(email);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned);
};

export const validateDentista = (data: DentistaRequest): DentistaValidationErrors => {
    const errors: DentistaValidationErrors = {};
    const cleanedCRO = cleanCRO(data.cro);
    const cleanedPhone = cleanPhone(data.telefone);
    const cleanedEmail = formatEmailForInput(data.email);

    // Validação do Nome
    if (isEmpty(data.nome)) {
        errors.nome = "Nome é obrigatório";
    } else if (data.nome.trim().length < 3) {
        errors.nome = "Nome deve ter pelo menos 3 caracteres";
    } else if (data.nome.trim().length > 100) {
        errors.nome = "Nome deve ter no máximo 100 caracteres";
    }

    // Validação do CRO
    if (isEmpty(data.cro)) {
        errors.cro = "CRO é obrigatório";
    } else if (!isValidCRO(cleanedCRO)) {
        errors.cro = "CRO inválido. Formato: UF-12345 (ex: PE-12345)";
    }

    // Validação da Especialidade
    if (isEmpty(data.especialidade)) {
        errors.especialidade = "Especialidade é obrigatória";
    } else if (data.especialidade.trim().length < 3) {
        errors.especialidade = "Especialidade deve ter pelo menos 3 caracteres";
    } else if (data.especialidade.trim().length > 50) {
        errors.especialidade = "Especialidade deve ter no máximo 50 caracteres";
    }

    // Validação do Telefone
    if (isEmpty(data.telefone)) {
        errors.telefone = "Telefone é obrigatório";
    } else if (!isValidPhone(cleanedPhone)) {
        errors.telefone = "Telefone inválido. Use celular com DDD: (81) 99999-9999";
    }

    // Validação do Email
    if (isEmpty(data.email)) {
        errors.email = "Email é obrigatório";
    } else if (!isValidEmail(cleanedEmail)) {
        errors.email = "Email inválido. Use formato: nome@exemplo.com";
    } else if (cleanedEmail.length > 100) {
        errors.email = "Email deve ter no máximo 100 caracteres";
    }

    return errors;
};

export const hasValidationErrors = (errors: DentistaValidationErrors): boolean => {
    return Object.keys(errors).length > 0;
};