// evolucao_tratamento.service.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const evolucaoTratamentoService = {
    // Listar todas
    async listarTodos() {
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento`);
        return response.data.data;
    },

    // Listar paginado
    async listarPaginado(pagina = 0, tamanho = 20) {
        const params = { page: pagina, size: tamanho };
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/paginado`, { params });
        return response.data.data;
    },

    // Buscar por ID
    async buscarPorId(id: number) {
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/${id}`);
        return response.data.data;
    },

    // Criar
    async criar(evolucao: any) {
        const response = await axios.post(`${API_URL}/api/evolucoes-tratamento`, evolucao);
        return response.data.data;
    },

    // Atualizar
    async atualizar(id: number, evolucao: any) {
        const response = await axios.put(`${API_URL}/api/evolucoes-tratamento/${id}`, evolucao);
        return response.data.data;
    },

    // Excluir
    async excluir(id: number) {
        await axios.delete(`${API_URL}/api/evolucoes-tratamento/${id}`);
    },

    // Buscar por paciente
    async buscarPorPaciente(pacienteId: number) {
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/paciente/${pacienteId}`);
        return response.data.data;
    },

    // Buscar por paciente paginado
    async buscarPorPacientePaginado(pacienteId: number, pagina = 0, tamanho = 20) {
        const params = { page: pagina, size: tamanho };
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/paciente/${pacienteId}/paginado`, { params });
        return response.data.data;
    },

    // Buscar por dentista
    async buscarPorDentista(dentistaId: number) {
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/dentista/${dentistaId}`);
        return response.data.data;
    },

    // Buscar por data
    async buscarPorData(data: string) {
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/data/${data}`);
        return response.data.data;
    },

    // Buscar por período
    async buscarPorPeriodo(dataInicio: string, dataFim: string) {
        const params = { dataInicio, dataFim };
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/periodo`, { params });
        return response.data.data;
    },

    // Buscar por paciente e período
    async buscarPorPacienteEPeriodo(pacienteId: number, dataInicio: string, dataFim: string) {
        const params = { dataInicio, dataFim };
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/paciente/${pacienteId}/periodo`, { params });
        return response.data.data;
    },

    // Buscar última evolução do paciente
    async buscarUltimaEvolucaoPaciente(pacienteId: number) {
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/paciente/${pacienteId}/ultima`);
        return response.data.data;
    },

    // Buscar evoluções do dia
    async buscarEvolucoesDoDia() {
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/hoje`);
        return response.data.data;
    },

    // Buscar por texto
    async buscarPorTextoEvolucao(texto: string) {
        const params = { texto };
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/buscar-texto`, { params });
        return response.data.data;
    },

    // Contar evoluções por paciente
    async contarEvolucoesPorPaciente(pacienteId: number) {
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/paciente/${pacienteId}/contar`);
        return response.data.data;
    },

    // Contar total de evoluções
    async contarTotalEvolucoes() {
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/estatisticas/total`);
        return response.data.data;
    },

    // Verificar se existe evolução na data
    async existeEvolucaoNaData(pacienteId: number, data: string) {
        const params = { pacienteId, data };
        const response = await axios.get(`${API_URL}/api/evolucoes-tratamento/validar/data`, { params });
        return response.data.data;
    }
};