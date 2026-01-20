// plano_dental.service.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const planoDentalService = {
    // Listar todos
    async listarTodos() {
        const response = await axios.get(`${API_URL}/api/planos-dentais`);
        return response.data;
    },

    // Listar paginado
    async listarPaginado(pagina = 0, tamanho = 10, ordenarPor = 'criadoEm', direcao = 'DESC') {
        const params = { pagina, tamanho, ordenarPor, direcao };
        const response = await axios.get(`${API_URL}/api/planos-dentais/paginado`, { params });
        return response.data;
    },

    // Buscar por ID
    async buscarPorId(id: number) {
        const response = await axios.get(`${API_URL}/api/planos-dentais/${id}`);
        return response.data;
    },

    // Criar
    async criar(plano: any) {
        const response = await axios.post(`${API_URL}/api/planos-dentais`, plano);
        return response.data;
    },

    // Atualizar
    async atualizar(id: number, plano: any) {
        const response = await axios.put(`${API_URL}/api/planos-dentais/${id}`, plano);
        return response.data;
    },

    // Excluir
    async excluir(id: number) {
        await axios.delete(`${API_URL}/api/planos-dentais/${id}`);
    },

    // Buscar por paciente
    async buscarPorPaciente(pacienteId: number) {
        const response = await axios.get(`${API_URL}/api/planos-dentais/paciente/${pacienteId}`);
        return response.data;
    },

    // Buscar por paciente (paginado)
    async buscarPorPacientePaginado(pacienteId: number, pagina = 0, tamanho = 10) {
        const params = { pagina, tamanho };
        const response = await axios.get(`${API_URL}/api/planos-dentais/paciente/${pacienteId}/paginado`, { params });
        return response.data;
    },

    // Buscar por dentista
    async buscarPorDentista(dentistaId: number) {
        const response = await axios.get(`${API_URL}/api/planos-dentais/dentista/${dentistaId}`);
        return response.data;
    },

    // Buscar por dente
    async buscarPorDente(dente: string) {
        const response = await axios.get(`${API_URL}/api/planos-dentais/dente/${dente}`);
        return response.data;
    },

    // Buscar por procedimento
    async buscarPorProcedimento(procedimento: string) {
        const params = { procedimento };
        const response = await axios.get(`${API_URL}/api/planos-dentais/procedimento`, { params });
        return response.data;
    },

    // Buscar por período
    async buscarPorPeriodo(dataInicio: string, dataFim: string) {
        const params = { dataInicio, dataFim };
        const response = await axios.get(`${API_URL}/api/planos-dentais/periodo`, { params });
        return response.data;
    },

    // Buscar por paciente e período
    async buscarPorPacienteEPeriodo(pacienteId: number, dataInicio: string, dataFim: string) {
        const params = { dataInicio, dataFim };
        const response = await axios.get(`${API_URL}/api/planos-dentais/paciente/${pacienteId}/periodo`, { params });
        return response.data;
    },

    // Buscar planos com desconto
    async buscarPlanosComDesconto() {
        const response = await axios.get(`${API_URL}/api/planos-dentais/com-desconto`);
        return response.data;
    },

    // Buscar planos recentes
    async buscarPlanosRecentes(quantidade = 10) {
        const params = { quantidade };
        const response = await axios.get(`${API_URL}/api/planos-dentais/recentes`, { params });
        return response.data;
    },

    // Calcular valor total por paciente
    async calcularValorTotalPorPaciente(pacienteId: number) {
        const response = await axios.get(`${API_URL}/api/planos-dentais/paciente/${pacienteId}/valor-total`);
        return response.data;
    },

    // Calcular valor total por dentista
    async calcularValorTotalPorDentista(dentistaId: number) {
        const response = await axios.get(`${API_URL}/api/planos-dentais/dentista/${dentistaId}/valor-total`);
        return response.data;
    },

    // Contar planos por paciente
    async contarPlanosPorPaciente(pacienteId: number) {
        const response = await axios.get(`${API_URL}/api/planos-dentais/paciente/${pacienteId}/contagem`);
        return response.data;
    },

    // Verificar plano para dente
    async verificarPlanoParaDente(pacienteId: number, dente: string) {
        const params = { pacienteId, dente };
        const response = await axios.get(`${API_URL}/api/planos-dentais/verificar-dente`, { params });
        return response.data;
    },

    // Aplicar desconto
    async aplicarDesconto(id: number, valorDesconto: number) {
        const params = { valorDesconto };
        const response = await axios.patch(`${API_URL}/api/planos-dentais/${id}/aplicar-desconto`, null, { params });
        return response.data;
    },

    // Buscar top procedimentos
    async buscarTopProcedimentos() {
        const response = await axios.get(`${API_URL}/api/planos-dentais/top-procedimentos`);
        return response.data;
    },

    // Estatísticas
    async estatisticas() {
        const response = await axios.get(`${API_URL}/api/planos-dentais/estatisticas`);
        return response.data;
    }
};