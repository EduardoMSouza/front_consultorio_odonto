// agendamento.service.ts

import { api } from "@/lib/api/api.service";
import {
    AgendamentoRequest,
    AgendamentoResponse,
    StatusAgendamento,
    DisponibilidadeResponse
} from "@/lib/types/agenda/agendamento.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const agendamentoService = {
    // Criar
    async criar(agendamento: AgendamentoRequest): Promise<AgendamentoResponse> {
        const response = await api.post(`${API_URL}/api/agendamentos`, agendamento);
        return response.data;
    },

    // Atualizar
    async atualizar(id: number, agendamento: AgendamentoRequest): Promise<AgendamentoResponse> {
        const response = await api.put(`${API_URL}/api/agendamentos/${id}`, agendamento);
        return response.data;
    },

    // Buscar por ID
    async buscarPorId(id: number): Promise<AgendamentoResponse> {
        const response = await api.get(`${API_URL}/api/agendamentos/${id}`);
        return response.data;
    },

    // Listar todos
    async listarTodos(): Promise<AgendamentoResponse[]> {
        const response = await api.get(`${API_URL}/api/agendamentos`);
        return response.data;
    },

    // Listar por dentista
    async listarPorDentista(dentistaId: number): Promise<AgendamentoResponse[]> {
        const response = await api.get(`${API_URL}/api/agendamentos/dentista/${dentistaId}`);
        return response.data;
    },

    // Listar por paciente
    async listarPorPaciente(pacienteId: number): Promise<AgendamentoResponse[]> {
        const response = await api.get(`${API_URL}/api/agendamentos/paciente/${pacienteId}`);
        return response.data;
    },

    // Listar por data
    async listarPorData(data: string): Promise<AgendamentoResponse[]> {
        const response = await api.get(`${API_URL}/api/agendamentos/data/${data}`);
        return response.data;
    },

    // Listar por período
    async listarPorPeriodo(dataInicio: string, dataFim: string): Promise<AgendamentoResponse[]> {
        const params = { dataInicio, dataFim };
        const response = await api.get(`${API_URL}/api/agendamentos/periodo`, { params });
        return response.data;
    },

    // Listar por status
    async listarPorStatus(status: StatusAgendamento): Promise<AgendamentoResponse[]> {
        const response = await api.get(`${API_URL}/api/agendamentos/status/${status}`);
        return response.data;
    },

    // Listar por dentista e data
    async listarPorDentistaEData(dentistaId: number, data: string): Promise<AgendamentoResponse[]> {
        const response = await api.get(`${API_URL}/api/agendamentos/dentista/${dentistaId}/data/${data}`);
        return response.data;
    },

    // Confirmar
    async confirmar(id: number, usuario: string): Promise<AgendamentoResponse> {
        const params = { usuario };
        const response = await api.patch(`${API_URL}/api/agendamentos/${id}/confirmar`, null, { params });
        return response.data;
    },

    // Iniciar atendimento
    async iniciarAtendimento(id: number, usuario: string): Promise<AgendamentoResponse> {
        const params = { usuario };
        const response = await api.patch(`${API_URL}/api/agendamentos/${id}/iniciar-atendimento`, null, { params });
        return response.data;
    },

    // Concluir
    async concluir(id: number, usuario: string): Promise<AgendamentoResponse> {
        const params = { usuario };
        const response = await api.patch(`${API_URL}/api/agendamentos/${id}/concluir`, null, { params });
        return response.data;
    },

    // Cancelar
    async cancelar(id: number, motivo: string, usuario: string): Promise<AgendamentoResponse> {
        const params = { motivo, usuario };
        const response = await api.patch(`${API_URL}/api/agendamentos/${id}/cancelar`, null, { params });
        return response.data;
    },

    // Marcar falta
    async marcarFalta(id: number, usuario: string): Promise<AgendamentoResponse> {
        const params = { usuario };
        const response = await api.patch(`${API_URL}/api/agendamentos/${id}/marcar-falta`, null, { params });
        return response.data;
    },

    // Deletar
    async deletar(id: number): Promise<void> {
        await api.delete(`${API_URL}/api/agendamentos/${id}`);
    },

    // Verificar disponibilidade
    async verificarDisponibilidade(
        dentistaId: number,
        data: string,
        horaInicio: string,
        horaFim: string
    ): Promise<DisponibilidadeResponse> {
        const params = { dentistaId, data, horaInicio, horaFim };
        const response = await api.get(`${API_URL}/api/agendamentos/verificar-disponibilidade`, { params });
        return response.data;
    },

    // Buscar agendamentos para lembrete
    async buscarAgendamentosParaLembrete(data: string): Promise<AgendamentoResponse[]> {
        const response = await api.get(`${API_URL}/api/agendamentos/lembretes/${data}`);
        return response.data;
    },

    // Marcar lembrete enviado
    async marcarLembreteEnviado(id: number): Promise<void> {
        await api.patch(`${API_URL}/api/agendamentos/${id}/marcar-lembrete-enviado`);
    }
};