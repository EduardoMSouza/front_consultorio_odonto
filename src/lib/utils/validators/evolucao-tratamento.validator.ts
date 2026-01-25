// lib/validators/evolucao-tratamento.validator.ts

import { isEmpty } from '@/lib/utils/text.utils';
import { isValidDate } from '@/lib/utils/date.utils';
import {PacienteResumoResponse} from "@/lib/types/paciente/paciente.types";
import {DentistaResumoResponse} from "@/lib/types/dentista/dentista.type";

export interface EvolucaoTratamentoFormData {
    selectedPaciente: PacienteResumoResponse | null;
    selectedDentista: DentistaResumoResponse | null;
    data: string;
    evolucaoEIntercorrencias: string;
}

export interface EvolucaoTratamentoValidationErrors {
    paciente?: string;
    dentista?: string;
    data?: string;
    evolucao?: string;
}

export const validateEvolucaoTratamentoForm = (
    data: EvolucaoTratamentoFormData
): EvolucaoTratamentoValidationErrors => {
    const errors: EvolucaoTratamentoValidationErrors = {};

    if (!data.selectedPaciente) {
        errors.paciente = 'Selecione um paciente';
    }

    if (!data.selectedDentista) {
        errors.dentista = 'Selecione um dentista';
    }

    if (isEmpty(data.data)) {
        errors.data = 'Informe a data';
    } else if (!isValidDate(data.data)) {
        errors.data = 'Data inválida';
    }

    if (isEmpty(data.evolucaoEIntercorrencias)) {
        errors.evolucao = 'Descreva a evolução do tratamento';
    }

    return errors;
};

export const hasValidationErrors = (
    errors: EvolucaoTratamentoValidationErrors
): boolean => {
    return Object.keys(errors).length > 0;
};