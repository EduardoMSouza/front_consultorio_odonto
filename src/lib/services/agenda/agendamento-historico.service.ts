// agendamento-historico.service.ts

import { api } from "@/lib/api/api.service";
import {
    AgendamentoHistoricoResponse,
    TipoAcao
} from "@/lib/types/agenda/agendamento-historico.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const agendamentoHistoricoService = {
    // Buscar por agendamento
    async buscarPorAgendamento(agendamentoId: number): Promise<AgendamentoHistoricoResponse[]> {
        const response = await api.get(`${API_URL}/api/agendamentos/historico/agendamento/${agendamentoId}`);
        return response.data;
    },

    // Buscar por usuário
    async buscarPorUsuario(usuario: string): Promise<AgendamentoHistoricoResponse[]> {
        const response = await api.get(`${API_URL}/api/agendamentos/historico/usuario/${usuario}`);
        return response.data;
    },

    // Buscar por ação
    async buscarPorAcao(acao: TipoAcao): Promise<AgendamentoHistoricoResponse[]> {
        const response = await api.get(`${API_URL}/api/agendamentos/historico/acao/${acao}`);
        return response.data;
    },

    // Buscar por período
    async buscarPorPeriodo(inicio: string, fim: string): Promise<AgendamentoHistoricoResponse[]> {
        const params = { inicio, fim };
        const response = await api.get(`${API_URL}/api/agendamentos/historico/periodo`, { params });
        return response.data;
    }
};