// fila-espera.type.ts

import { TipoProcedimento } from './agendamento.type';

export enum PeriodoPreferencial {
    MANHA = 'MANHA',
    TARDE = 'TARDE',
    NOITE = 'NOITE',
    QUALQUER = 'QUALQUER'
}

export enum StatusFila {
    AGUARDANDO = 'AGUARDANDO',
    NOTIFICADO = 'NOTIFICADO',
    CONVERTIDO = 'CONVERTIDO',
    CANCELADO = 'CANCELADO',
    EXPIRADO = 'EXPIRADO'
}

export interface FilaEsperaRequest {
    pacienteId: number;
    dentistaId?: number;
    tipoProcedimento?: TipoProcedimento;
    dataPreferencial?: string; // "yyyy-MM-dd"
    horaInicioPreferencial?: string; // "HH:mm"
    horaFimPreferencial?: string; // "HH:mm"
    periodoPreferencial?: PeriodoPreferencial;
    observacoes?: string;
    prioridade?: number;
    aceitaQualquerHorario?: boolean;
    aceitaQualquerDentista?: boolean;
    criadoPor?: string;
}

export interface FilaEsperaResponse {
    id: number;
    pacienteId: number;
    nomePaciente: string;
    dentistaId?: number;
    nomeDentista?: string;
    tipoProcedimento?: TipoProcedimento;
    dataPreferencial?: string; // "yyyy-MM-dd"
    horaInicioPreferencial?: string; // "HH:mm"
    horaFimPreferencial?: string; // "HH:mm"
    periodoPreferencial?: PeriodoPreferencial;
    status: StatusFila;
    observacoes?: string;
    prioridade: number;
    aceitaQualquerHorario: boolean;
    aceitaQualquerDentista: boolean;
    criadoEm: string; // "yyyy-MM-dd HH:mm:ss"
    atualizadoEm: string; // "yyyy-MM-dd HH:mm:ss"
    criadoPor?: string;
    agendamentoId?: number;
    convertidoEm?: string; // "yyyy-MM-dd HH:mm:ss"
    notificado: boolean;
    notificadoEm?: string; // "yyyy-MM-dd HH:mm:ss"
    tentativasContato: number;
    ultimaTentativaContato?: string; // "yyyy-MM-dd HH:mm:ss"
    ativa: boolean;
    expirado: boolean;
}

export const PeriodoPreferencialLabels: Record<PeriodoPreferencial, string> = {
    [PeriodoPreferencial.MANHA]: 'Manhã',
    [PeriodoPreferencial.TARDE]: 'Tarde',
    [PeriodoPreferencial.NOITE]: 'Noite',
    [PeriodoPreferencial.QUALQUER]: 'Qualquer'
};

export const StatusFilaLabels: Record<StatusFila, string> = {
    [StatusFila.AGUARDANDO]: 'Aguardando',
    [StatusFila.NOTIFICADO]: 'Notificado',
    [StatusFila.CONVERTIDO]: 'Convertido',
    [StatusFila.CANCELADO]: 'Cancelado',
    [StatusFila.EXPIRADO]: 'Expirado'
};