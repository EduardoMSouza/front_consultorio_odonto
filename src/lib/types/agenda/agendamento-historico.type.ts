// agendamento-historico.type.ts

import { StatusAgendamento } from './agendamento.type';

export enum TipoAcao {
    CRIACAO = 'CRIACAO',
    ATUALIZACAO = 'ATUALIZACAO',
    CONFIRMACAO = 'CONFIRMACAO',
    INICIO_ATENDIMENTO = 'INICIO_ATENDIMENTO',
    CONCLUSAO = 'CONCLUSAO',
    CANCELAMENTO = 'CANCELAMENTO',
    FALTA = 'FALTA',
    REAGENDAMENTO = 'REAGENDAMENTO',
    LEMBRETE_ENVIADO = 'LEMBRETE_ENVIADO'
}

export interface AgendamentoHistoricoResponse {
    id: number;
    agendamentoId: number;
    acao: TipoAcao;
    statusAnterior?: StatusAgendamento;
    statusNovo?: StatusAgendamento;
    usuarioResponsavel: string;
    descricao: string;
    detalhes?: string;
    dataHora: string; // "yyyy-MM-dd HH:mm:ss"
    ipOrigem?: string;
}

export const TipoAcaoLabels: Record<TipoAcao, string> = {
    [TipoAcao.CRIACAO]: 'Criação',
    [TipoAcao.ATUALIZACAO]: 'Atualização',
    [TipoAcao.CONFIRMACAO]: 'Confirmação',
    [TipoAcao.INICIO_ATENDIMENTO]: 'Início de Atendimento',
    [TipoAcao.CONCLUSAO]: 'Conclusão',
    [TipoAcao.CANCELAMENTO]: 'Cancelamento',
    [TipoAcao.FALTA]: 'Falta',
    [TipoAcao.REAGENDAMENTO]: 'Reagendamento',
    [TipoAcao.LEMBRETE_ENVIADO]: 'Lembrete Enviado'
};