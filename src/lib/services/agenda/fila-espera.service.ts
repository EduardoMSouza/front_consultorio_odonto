// fila-espera.service.ts

import { api } from "@/lib/api/api.service";
import {
    FilaEsperaRequest,
    FilaEsperaResponse,
    StatusFila
} from "@/lib/types/agenda/fila-espera.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const filaEsperaService = {
    // Criar
    async criar(filaEspera: FilaEsperaRequest): Promise<FilaEsperaResponse> {
        const response = await api.post(`${API_URL}/api/fila-espera`, filaEspera);
        return response.data;
    },

    // Atualizar
    async atualizar(id: number, filaEspera: FilaEsperaRequest): Promise<FilaEsperaResponse> {
        const response = await api.put(`${API_URL}/api/fila-espera/${id}`, filaEspera);
        return response.data;
    },

    // Buscar por ID
    async buscarPorId(id: number): Promise<FilaEsperaResponse> {
        const response = await api.get(`${API_URL}/api/fila-espera/${id}`);
        return response.data;
    },

    // Listar todas
    async listarTodas(): Promise<FilaEsperaResponse[]> {
        const response = await api.get(`${API_URL}/api/fila-espera`);
        return response.data;
    },

    // Listar por status
    async listarPorStatus(status: StatusFila): Promise<FilaEsperaResponse[]> {
        const response = await api.get(`${API_URL}/api/fila-espera/status/${status}`);
        return response.data;
    },

    // Listar por paciente
    async listarPorPaciente(pacienteId: number): Promise<FilaEsperaResponse[]> {
        const response = await api.get(`${API_URL}/api/fila-espera/paciente/${pacienteId}`);
        return response.data;
    },

    // Listar por dentista
    async listarPorDentista(dentistaId: number): Promise<FilaEsperaResponse[]> {
        const response = await api.get(`${API_URL}/api/fila-espera/dentista/${dentistaId}`);
        return response.data;
    },

    // Listar ativas
    async listarAtivas(): Promise<FilaEsperaResponse[]> {
        const response = await api.get(`${API_URL}/api/fila-espera/ativas`);
        return response.data;
    },

    // Notificar
    async notificar(id: number): Promise<FilaEsperaResponse> {
        const response = await api.patch(`${API_URL}/api/fila-espera/${id}/notificar`);
        return response.data;
    },

    // Converter em agendamento
    async converterEmAgendamento(id: number, agendamentoId: number): Promise<FilaEsperaResponse> {
        const params = { agendamentoId };
        const response = await api.patch(`${API_URL}/api/fila-espera/${id}/converter`, null, { params });
        return response.data;
    },

    // Cancelar
    async cancelar(id: number): Promise<FilaEsperaResponse> {
        const response = await api.patch(`${API_URL}/api/fila-espera/${id}/cancelar`);
        return response.data;
    },

    // Expirar filas antigas
    async expirarFilasAntigas(dataLimite: string): Promise<void> {
        const params = { dataLimite };
        await api.post(`${API_URL}/api/fila-espera/expirar`, null, { params });
    },

    // Deletar
    async deletar(id: number): Promise<void> {
        await api.delete(`${API_URL}/api/fila-espera/${id}`);
    }
};