import { PacienteRequest } from '@/lib/types/paciente/paciente.types';
import { isEmpty } from '@/lib/utils/text.utils';
import { isValidDate } from '@/lib/utils/date.utils';
import {cleanDocument} from "@/lib/utils/document.utils";

export interface PacienteValidationErrors {
    dadosBasicos?: {
        nome?: string;
        prontuarioNumero?: string;
        dataNascimento?: string;
        cpf?: string;
        telefone?: string;
    };
    [key: string]: any;
}

export const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
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

export const validatePacienteRequest = (paciente: PacienteRequest): PacienteValidationErrors => {
    const errors: PacienteValidationErrors = {};

    // Validação dos dados básicos
    if (isEmpty(paciente.dadosBasicos.nome)) {
        errors.dadosBasicos = {
            ...errors.dadosBasicos,
            nome: 'Nome é obrigatório'
        };
    }

    if (isEmpty(paciente.dadosBasicos.prontuarioNumero)) {
        errors.dadosBasicos = {
            ...errors.dadosBasicos,
            prontuarioNumero: 'Número do prontuário é obrigatório'
        };
    }

    if (isEmpty(paciente.dadosBasicos.dataNascimento)) {
        errors.dadosBasicos = {
            ...errors.dadosBasicos,
            dataNascimento: 'Data de nascimento é obrigatória'
        };
    } else if (!validateDate(paciente.dadosBasicos.dataNascimento)) {
        errors.dadosBasicos = {
            ...errors.dadosBasicos,
            dataNascimento: 'Data de nascimento inválida'
        };
    } else if (!validateFutureDate(paciente.dadosBasicos.dataNascimento)) {
        errors.dadosBasicos = {
            ...errors.dadosBasicos,
            dataNascimento: 'Data de nascimento não pode ser futura'
        };
    } else if (!validateAge(paciente.dadosBasicos.dataNascimento)) {
        errors.dadosBasicos = {
            ...errors.dadosBasicos,
            dataNascimento: 'Idade inválida'
        };
    }

    if (paciente.dadosBasicos.cpf && !validateCPF(paciente.dadosBasicos.cpf)) {
        errors.dadosBasicos = {
            ...errors.dadosBasicos,
            cpf: 'CPF inválido'
        };
    }

    if (paciente.dadosBasicos.telefone && !validatePhone(paciente.dadosBasicos.telefone)) {
        errors.dadosBasicos = {
            ...errors.dadosBasicos,
            telefone: 'Telefone inválido (formato: (XX) XXXXX-XXXX)'
        };
    }

    return errors;
};

export const hasValidationErrors = (errors: PacienteValidationErrors): boolean => {
    return Object.keys(errors).some(section => {
        const sectionErrors = errors[section];
        return sectionErrors && Object.keys(sectionErrors).length > 0;
    });
};
