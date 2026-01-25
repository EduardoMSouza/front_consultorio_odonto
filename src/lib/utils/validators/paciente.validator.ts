// lib/validators/paciente.validator.ts

import { PacienteRequest } from '@/lib/types/paciente/paciente.types';
import { isEmpty } from '@/lib/utils/text.utils';
import { isValidDate } from '@/lib/utils/date.utils';
import { cleanDocument } from '@/lib/utils/document.utils';

export interface PacienteValidationErrors {
    dadosBasicos?: {
        nome?: string;
        prontuarioNumero?: string;
        dataNascimento?: string;
        cpf?: string;
        telefone?: string;
    };
}

const cleanPhone = (telefone: string): string => {
    return telefone.replace(/\D/g, '');
};

export const validateDate = (dateString: string): boolean => {
    if (!dateString) return true;
    return isValidDate(dateString);
};

export const validateFutureDate = (dateString: string): boolean => {
    if (!dateString) return true;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
};

export const validateAge = (dateString: string, minAge: number = 0, maxAge: number = 150): boolean => {
    if (!dateString) return true;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= minAge && age <= maxAge;
};

export const validateCPF = (cpf: string): boolean => {
    const cleaned = cleanDocument(cpf);
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleaned.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    return digit === parseInt(cleaned.charAt(10));
};

export const validatePhone = (phone: string): boolean => {
    const cleaned = cleanPhone(phone);
    return cleaned.length === 10 || cleaned.length === 11;
};

export const validatePaciente = (paciente: PacienteRequest): PacienteValidationErrors => {
    const errors: PacienteValidationErrors = {};

    // Validação dos dados básicos
    if (isEmpty(paciente.dadosBasicos.nome)) {
        errors.dadosBasicos = { ...errors.dadosBasicos, nome: 'Nome é obrigatório' };
    } else if (paciente.dadosBasicos.nome.trim().length < 3) {
        errors.dadosBasicos = { ...errors.dadosBasicos, nome: 'Nome deve ter pelo menos 3 caracteres' };
    }

    if (isEmpty(paciente.dadosBasicos.prontuarioNumero)) {
        errors.dadosBasicos = { ...errors.dadosBasicos, prontuarioNumero: 'Número do prontuário é obrigatório' };
    }

    if (isEmpty(paciente.dadosBasicos.dataNascimento)) {
        errors.dadosBasicos = { ...errors.dadosBasicos, dataNascimento: 'Data de nascimento é obrigatória' };
    } else if (!validateDate(paciente.dadosBasicos.dataNascimento)) {
        errors.dadosBasicos = { ...errors.dadosBasicos, dataNascimento: 'Data de nascimento inválida' };
    } else if (!validateFutureDate(paciente.dadosBasicos.dataNascimento)) {
        errors.dadosBasicos = { ...errors.dadosBasicos, dataNascimento: 'Data de nascimento não pode ser futura' };
    } else if (!validateAge(paciente.dadosBasicos.dataNascimento)) {
        errors.dadosBasicos = { ...errors.dadosBasicos, dataNascimento: 'Idade inválida' };
    }

    if (paciente.dadosBasicos.cpf && !validateCPF(paciente.dadosBasicos.cpf)) {
        errors.dadosBasicos = { ...errors.dadosBasicos, cpf: 'CPF inválido' };
    }

    if (paciente.dadosBasicos.telefone && !validatePhone(paciente.dadosBasicos.telefone)) {
        errors.dadosBasicos = { ...errors.dadosBasicos, telefone: 'Telefone inválido (formato: (XX) XXXXX-XXXX)' };
    }

    return errors;
};

export const hasValidationErrors = (errors: PacienteValidationErrors): boolean => {
    return Object.keys(errors).some(section => {
        const sectionErrors = errors[section as keyof PacienteValidationErrors];
        return sectionErrors && typeof sectionErrors === 'object' && Object.keys(sectionErrors).length > 0;
    });
};