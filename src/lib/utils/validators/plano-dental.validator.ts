// lib/validators/plano-dental.validator.ts


import { parseCurrency } from '@/lib/utils/currency.utils';
import {PacienteResumoResponse} from "@/lib/types/paciente/paciente.types";
import {DentistaResumoResponse} from "@/lib/types/dentista/dentista.type";

export interface PlanoDentalFormData {
    selectedPaciente: PacienteResumoResponse | null;
    selectedDentista: DentistaResumoResponse | null;
    dente: string;
    procedimento: string;
    valor: string;
    valorFinal: string;
    observacoes: string;
}

export interface PlanoDentalValidationErrors {
    paciente?: string;
    dentista?: string;
    dente?: string;
    procedimento?: string;
    valor?: string;
    valorFinal?: string;
}

export const validatePlanoDentalForm = (data: PlanoDentalFormData): PlanoDentalValidationErrors => {
    const errors: PlanoDentalValidationErrors = {};

    if (!data.selectedPaciente) {
        errors.paciente = 'Selecione um paciente';
    }

    if (!data.selectedDentista) {
        errors.dentista = 'Selecione um dentista';
    }

    if (!data.dente.trim()) {
        errors.dente = 'Informe o dente';
    }

    if (!data.procedimento.trim()) {
        errors.procedimento = 'Informe o procedimento';
    }

    if (data.valor && parseCurrency(data.valor) === null) {
        errors.valor = 'Valor inválido';
    }

    if (data.valorFinal && parseCurrency(data.valorFinal) === null) {
        errors.valorFinal = 'Valor final inválido';
    }

    return errors;
};

export const hasValidationErrors = (errors: PlanoDentalValidationErrors): boolean => {
    return Object.keys(errors).length > 0;
};