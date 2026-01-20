// agendamento.type.ts

// Response do histórico de agendamento
export type AgendamentoHistoricoResponse = {
    id: number;
    agendamentoId: number;
    acao: string; // 'CRIADO', 'ATUALIZADO', 'STATUS_ALTERADO', etc.
    statusAnterior: string;
    statusNovo: string;
    usuarioResponsavel: string;
    descricao: string;
    detalhes: string;
    dataHora: string; // LocalDateTime
    ipOrigem: string;
};

// Response completo do agendamento
export type AgendamentoResponse = {
    id: number;
    dentistaId: number;
    nomeDentista: string;
    pacienteId: number;
    nomePaciente: string;
    dataConsulta: string; // "yyyy-MM-dd"
    horaInicio: string; // "HH:mm"
    horaFim: string; // "HH:mm"
    status: string; // StatusAgendamento enum
    tipoProcedimento?: string; // TipoProcedimento enum
    observacoes?: string;
    valorConsulta?: number;
    ativo: boolean;
    criadoEm: string;
    atualizadoEm: string;
    criadoPor?: string;
    atualizadoPor?: string;
    canceladoPor?: string;
    canceladoEm?: string;
    motivoCancelamento?: string;
    confirmadoEm?: string;
    lembreteEnviado: boolean;
    lembreteEnviadoEm?: string;
    duracaoEmMinutos: number;
    podeSerEditado: boolean;
    podeSerCancelado: boolean;
    finalizado: boolean;
    consultaPassada: boolean;
    hoje: boolean;
};

// Response da fila de espera
export type FilaEsperaResponse = {
    id: number;
    pacienteId: number;
    nomePaciente: string;
    dentistaId?: number;
    nomeDentista?: string;
    tipoProcedimento?: string;
    dataPreferencial?: string; // "yyyy-MM-dd"
    horaInicioPreferencial?: string; // "HH:mm"
    horaFimPreferencial?: string; // "HH:mm"
    periodoPreferencial?: string; // PeriodoPreferencial enum
    status: string; // StatusFila enum
    observacoes?: string;
    prioridade: number;
    aceitaQualquerHorario: boolean;
    aceitaQualquerDentista: boolean;
    criadoEm: string;
    atualizadoEm: string;
    criadoPor?: string;
    agendamentoId?: number;
    convertidoEm?: string;
    notificado: boolean;
    notificadoEm?: string;
    tentativasContato: number;
    ultimaTentativaContato?: string;
    ativa: boolean;
    expirado: boolean;
};

// Request para criar/atualizar agendamento
export type AgendamentoRequest = {
    dentistaId: number;
    pacienteId: number;
    dataConsulta: string; // "yyyy-MM-dd"
    horaInicio: string; // "HH:mm"
    horaFim: string; // "HH:mm"
    status?: string;
    tipoProcedimento?: string;
    observacoes?: string;
    valorConsulta?: number;
    criadoPor?: string;
};

// Request para fila de espera
export type FilaEsperaRequest = {
    pacienteId: number;
    dentistaId?: number;
    tipoProcedimento?: string;
    dataPreferencial?: string; // "yyyy-MM-dd"
    horaInicioPreferencial?: string; // "HH:mm"
    horaFimPreferencial?: string; // "HH:mm"
    periodoPreferencial?: string;
    observacoes?: string;
    prioridade?: number;
    aceitaQualquerHorario?: boolean;
    aceitaQualquerDentista?: boolean;
    criadoPor?: string;
};

// Enums (baseado nos Java enums)
export const StatusAgendamento = {
    AGENDADO: 'AGENDADO',
    CONFIRMADO: 'CONFIRMADO',
    EM_ANDAMENTO: 'EM_ANDAMENTO',
    CONCLUIDO: 'CONCLUIDO',
    CANCELADO: 'CANCELADO',
    FALTOU: 'FALTOU',
    REMARCADO: 'REMARCADO'
} as const;

export const TipoProcedimento = {
    CONSULTA_INICIAL: 'CONSULTA_INICIAL',
    RETORNO: 'RETORNO',
    LIMPEZA: 'LIMPEZA',
    TRATAMENTO_CANAL: 'TRATAMENTO_CANAL',
    EXTRACAO: 'EXTRACAO',
    IMPLANTE: 'IMPLANTE',
    ORTODONTIA: 'ORTODONTIA',
    PROTESE: 'PROTESE',
    CLAREAMENTO: 'CLAREAMENTO',
    CIRURGIA: 'CIRURGIA',
    OUTRO: 'OUTRO'
} as const;

export const PeriodoPreferencial = {
    MANHA: 'MANHA',
    TARDE: 'TARDE',
    NOITE: 'NOITE',
    QUALQUER: 'QUALQUER'
} as const;

export const StatusFila = {
    PENDENTE: 'PENDENTE',
    NOTIFICADO: 'NOTIFICADO',
    CONVERTIDO: 'CONVERTIDO',
    CANCELADO: 'CANCELADO',
    EXPIRADO: 'EXPIRADO'
} as const;

export const TipoAcaoHistorico = {
    CRIADO: 'CRIADO',
    ATUALIZADO: 'ATUALIZADO',
    STATUS_ALTERADO: 'STATUS_ALTERADO',
    CANCELADO: 'CANCELADO',
    CONFIRMADO: 'CONFIRMADO',
    FINALIZADO: 'FINALIZADO',
    REMARCADO: 'REMARCADO'
} as const;

// Tipo para filtros de busca
export type AgendamentoFiltro = {
    dentistaId?: number;
    pacienteId?: number;
    dataInicio?: string;
    dataFim?: string;
    status?: string;
    tipoProcedimento?: string;
    ativo?: boolean;
};

// Tipo para resposta paginada
export type AgendamentoPageResponse = {
    content: AgendamentoResponse[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
};

// Tipo para conversão de fila para agendamento
export type ConverterFilaRequest = {
    filaEsperaId: number;
    dataConsulta: string;
    horaInicio: string;
    horaFim: string;
    dentistaId?: number;
    valorConsulta?: number;
};