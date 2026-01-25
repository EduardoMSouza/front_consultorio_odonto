// lib/formatters/paciente.formatter.ts

import { PacienteResumoResponse, PacienteResponse } from '@/lib/types/paciente/paciente.types';
import { formatCPF, formatRG, cleanDocument } from '@/lib/utils/document.utils';
import { formatDateShort } from '@/lib/utils/date.utils';
import { formatPhone as formatPhoneNumber } from '@/lib/utils/phone.utils';

export const formatCPFForDisplay = (cpf?: string): string => {
    return formatCPF(cpf);
};

export const formatRGForDisplay = (rg?: string): string => {
    return formatRG(rg);
};

export const formatPhone = (telefone?: string): string => {
    if (!telefone) return '-';
    return formatPhoneNumber(telefone);
};

export const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    try {
        return formatDateShort(dateString);
    } catch {
        return dateString;
    }
};

export const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
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

export const getAtendimentoBadge = (status: boolean): { text: string; variant: 'default' | 'destructive' } => {
    return {
        text: status ? 'Atendimento Ativo' : 'Atendimento Inativo',
        variant: status ? 'default' : 'destructive'
    };
};

export const formatPacienteForList = (paciente: PacienteResumoResponse): PacienteResumoResponse => {
    return {
        ...paciente,
        cpf: paciente.cpf ? cleanDocument(paciente.cpf) : undefined,
        idade: paciente.idade || calculateAge(paciente.dataNascimento)
    };
};