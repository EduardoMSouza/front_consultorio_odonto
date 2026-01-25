// agendamento.type.ts

export enum StatusAgendamento {
    AGENDADO = 'AGENDADO',
    CONFIRMADO = 'CONFIRMADO',
    EM_ATENDIMENTO = 'EM_ATENDIMENTO',
    CONCLUIDO = 'CONCLUIDO',
    CANCELADO = 'CANCELADO',
    FALTA = 'FALTA'
}

export enum TipoProcedimento {
    CONSULTA = 'CONSULTA',
    LIMPEZA = 'LIMPEZA',
    EXTRACAO = 'EXTRACAO',
    OBTURACAO = 'OBTURACAO',
    CANAL = 'CANAL',
    PROTESE = 'PROTESE',
    ORTODONTIA = 'ORTODONTIA',
    IMPLANTE = 'IMPLANTE',
    CLAREAMENTO = 'CLAREAMENTO',
    EMERGENCIA = 'EMERGENCIA',
    AVALIACAO = 'AVALIACAO',
    RETORNO = 'RETORNO',
    OUTRO = 'OUTRO'
}

export interface AgendamentoRequest {
    dentistaId: number;
    pacienteId: number;
    dataConsulta: string; // "yyyy-MM-dd"
    horaInicio: string; // "HH:mm"
    horaFim: string; // "HH:mm"
    status?: StatusAgendamento;
    tipoProcedimento?: TipoProcedimento;
    observacoes?: string;
    criadoPor?: string;
}

export interface AgendamentoResponse {
    id: number;
    dentistaId: number;
    nomeDentista: string;
    pacienteId: number;
    nomePaciente: string;
    dataConsulta: string; // "yyyy-MM-dd"
    horaInicio: string; // "HH:mm"
    horaFim: string; // "HH:mm"
    status: StatusAgendamento;
    tipoProcedimento?: TipoProcedimento;
    observacoes?: string;
    ativo: boolean;
    criadoEm: string; // "yyyy-MM-dd HH:mm:ss"
    atualizadoEm: string; // "yyyy-MM-dd HH:mm:ss"
    criadoPor?: string;
    atualizadoPor?: string;
    canceladoPor?: string;
    canceladoEm?: string; // "yyyy-MM-dd HH:mm:ss"
    motivoCancelamento?: string;
    confirmadoEm?: string; // "yyyy-MM-dd HH:mm:ss"
    lembreteEnviado: boolean;
    lembreteEnviadoEm?: string; // "yyyy-MM-dd HH:mm:ss"
    duracaoEmMinutos: number;
    podeSerEditado: boolean;
    podeSerCancelado: boolean;
    finalizado: boolean;
    consultaPassada: boolean;
    hoje: boolean;
}

export interface DisponibilidadeResponse {
    disponivel: boolean;
}

export const StatusAgendamentoLabels: Record<StatusAgendamento, string> = {
    [StatusAgendamento.AGENDADO]: 'Agendado',
    [StatusAgendamento.CONFIRMADO]: 'Confirmado',
    [StatusAgendamento.EM_ATENDIMENTO]: 'Em Atendimento',
    [StatusAgendamento.CONCLUIDO]: 'Concluído',
    [StatusAgendamento.CANCELADO]: 'Cancelado',
    [StatusAgendamento.FALTA]: 'Falta'
};

export const TipoProcedimentoLabels: Record<TipoProcedimento, string> = {
    [TipoProcedimento.CONSULTA]: 'Consulta',
    [TipoProcedimento.LIMPEZA]: 'Limpeza',
    [TipoProcedimento.EXTRACAO]: 'Extração',
    [TipoProcedimento.OBTURACAO]: 'Obturação',
    [TipoProcedimento.CANAL]: 'Canal',
    [TipoProcedimento.PROTESE]: 'Prótese',
    [TipoProcedimento.ORTODONTIA]: 'Ortodontia',
    [TipoProcedimento.IMPLANTE]: 'Implante',
    [TipoProcedimento.CLAREAMENTO]: 'Clareamento',
    [TipoProcedimento.EMERGENCIA]: 'Emergência',
    [TipoProcedimento.AVALIACAO]: 'Avaliação',
    [TipoProcedimento.RETORNO]: 'Retorno',
    [TipoProcedimento.OUTRO]: 'Outro'
};