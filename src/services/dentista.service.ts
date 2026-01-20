// services/dentista.service.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const dentistaService = {
    // Criar
    async criar(dentista: any) {
        const response = await axios.post(`${API_URL}/api/dentistas`, dentista);
        return response.data;
    },

    // Buscar por ID
    async buscarPorId(id: number) {
        const response = await axios.get(`${API_URL}/api/dentistas/${id}`);
        return response.data;
    },

    // Buscar por CRO
    async buscarPorCro(cro: string) {
        const response = await axios.get(`${API_URL}/api/dentistas/cro/${cro}`);
        return response.data;
    },

    // Atualizar
    async atualizar(id: number, dentista: any) {
        const response = await axios.put(`${API_URL}/api/dentistas/${id}`, dentista);
        return response.data;
    },

    // Deletar
    async deletar(id: number) {
        await axios.delete(`${API_URL}/api/dentistas/${id}`);
    },

    // Listar todos
    async listarTodos(page = 0, size = 10) {
        const params = { page, size };
        const response = await axios.get(`${API_URL}/api/dentistas`, { params });
        return response.data;
    },

    // Listar resumo
    async listarResumo(page = 0, size = 10) {
        const params = { page, size };
        const response = await axios.get(`${API_URL}/api/dentistas/resumo`, { params });
        return response.data;
    },

    // Listar ativos
    async listarAtivos(page = 0, size = 10) {
        const params = { page, size };
        const response = await axios.get(`${API_URL}/api/dentistas/ativos`, { params });
        return response.data;
    },

    // Buscar por nome
    async buscarPorNome(nome: string, page = 0, size = 10) {
        const params = { nome, page, size };
        const response = await axios.get(`${API_URL}/api/dentistas/buscar/nome`, { params });
        return response.data;
    },

    // Buscar por especialidade
    async buscarPorEspecialidade(especialidade: string, page = 0, size = 10) {
        const params = { especialidade, page, size };
        const response = await axios.get(`${API_URL}/api/dentistas/buscar/especialidade`, { params });
        return response.data;
    },

    // Buscar por termo
    async buscarPorTermo(termo: string, page = 0, size = 10) {
        const params = { termo, page, size };
        const response = await axios.get(`${API_URL}/api/dentistas/buscar`, { params });
        return response.data;
    },

    // Ativar
    async ativar(id: number) {
        await axios.patch(`${API_URL}/api/dentistas/${id}/ativar`);
    },

    // Desativar
    async desativar(id: number) {
        await axios.patch(`${API_URL}/api/dentistas/${id}/desativar`);
    },

    // Verificar email
    async verificarEmail(email: string) {
        const params = { email };
        const response = await axios.get(`${API_URL}/api/dentistas/verificar/email`, { params });
        return response.data;
    },

    // Verificar CRO
    async verificarCro(cro: string) {
        const params = { cro };
        const response = await axios.get(`${API_URL}/api/dentistas/verificar/cro`, { params });
        return response.data;
    }
};