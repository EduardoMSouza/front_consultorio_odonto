// services/evolucoes-tratamento.service.ts

import {
    EvolucaoTratamentoRequest,
    EvolucaoTratamentoResponse,
    PageEvolucaoTratamentoResponse
} from "@/lib/types/evolucao-tratamento/evoluca_tratamento.type";
import { api } from "@/lib/api/api.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const evolucaoTratamentoService = {
    // Criar evolução
    async criar(evolucao: EvolucaoTratamentoRequest): Promise<EvolucaoTratamentoResponse> {
        const response = await api.post(`${API_URL}/api/evolucoes-tratamento`, evolucao);
        return response.data;
    },

    // Buscar por ID
    async buscarPorId(id: number): Promise<EvolucaoTratamentoResponse> {
        const response = await api.get(`${API_URL}/api/evolucoes-tratamento/${id}`);
        return response.data;
    },

    // Buscar todas
    async listarTodas(): Promise<EvolucaoTratamentoResponse[]> {
        const response = await api.get(`${API_URL}/api/evolucoes-tratamento`);
        return response.data;
    },

    // Buscar por paciente
    async buscarPorPaciente(pacienteId: number): Promise<EvolucaoTratamentoResponse[]> {
        const response = await api.get(`${API_URL}/api/evolucoes-tratamento/paciente/${pacienteId}`);
        return response.data;
    },

    // Buscar por dentista
    async buscarPorDentista(dentistaId: number): Promise<EvolucaoTratamentoResponse[]> {
        const response = await api.get(`${API_URL}/api/evolucoes-tratamento/dentista/${dentistaId}`);
        return response.data;
    },

    // Buscar por período
    async buscarPorPeriodo(inicio: string, fim: string): Promise<EvolucaoTratamentoResponse[]> {
        const params = { inicio, fim };
        const response = await api.get(`${API_URL}/api/evolucoes-tratamento/periodo`, { params });
        return response.data;
    },

    // Atualizar
    async atualizar(id: number, evolucao: EvolucaoTratamentoRequest): Promise<EvolucaoTratamentoResponse> {
        const response = await api.put(`${API_URL}/api/evolucoes-tratamento/${id}`, evolucao);
        return response.data;
    },

    // Deletar
    async deletar(id: number): Promise<void> {
        await api.delete(`${API_URL}/api/evolucoes-tratamento/${id}`);
    }
};