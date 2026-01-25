// services/plano-dental.service.ts



import {api} from "@/lib/api/api.service";
import {
    PagePlanoDentalResponse, PlanoDentalFilter,
    PlanoDentalRequest,
    PlanoDentalResponse
} from "@/lib/types/plano-dental/plano_dental.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const planoDentalService = {
    // Criar
    async criar(plano: PlanoDentalRequest): Promise<PlanoDentalResponse> {
        const response = await api.post(`${API_URL}/api/planos-dentais`, plano);
        return response.data;
    },

    // Buscar por ID
    async buscarPorId(id: number): Promise<PlanoDentalResponse> {
        const response = await api.get(`${API_URL}/api/planos-dentais/${id}`);
        return response.data;
    },

    // Buscar todos
    async listarTodos(): Promise<PlanoDentalResponse[]> {
        const response = await api.get(`${API_URL}/api/planos-dentais`);
        return response.data;
    },

    // Buscar todos paginados
    async listarTodosPaginados(page = 0, size = 10): Promise<PagePlanoDentalResponse> {
        const params = { page, size };
        const response = await api.get(`${API_URL}/api/planos-dentais/paginados`, { params });
        return response.data;
    },

    // Buscar por paciente
    async buscarPorPaciente(pacienteId: number): Promise<PlanoDentalResponse[]> {
        const response = await api.get(`${API_URL}/api/planos-dentais/paciente/${pacienteId}`);
        return response.data;
    },

    // Buscar por paciente paginado
    async buscarPorPacientePaginado(pacienteId: number, page = 0, size = 10): Promise<PagePlanoDentalResponse> {
        const params = { page, size };
        const response = await api.get(`${API_URL}/api/planos-dentais/paciente/${pacienteId}/paginados`, { params });
        return response.data;
    },

    // Buscar por dentista
    async buscarPorDentista(dentistaId: number): Promise<PlanoDentalResponse[]> {
        const response = await api.get(`${API_URL}/api/planos-dentais/dentista/${dentistaId}`);
        return response.data;
    },

    // Buscar por dente
    async buscarPorDente(dente: string): Promise<PlanoDentalResponse[]> {
        const response = await api.get(`${API_URL}/api/planos-dentais/dente/${dente}`);
        return response.data;
    },

    // Buscar por procedimento
    async buscarPorProcedimento(procedimento: string): Promise<PlanoDentalResponse[]> {
        const params = { procedimento };
        const response = await api.get(`${API_URL}/api/planos-dentais/procedimento`, { params });
        return response.data;
    },

    // Buscar por faixa de valor
    async buscarPorValorEntre(valorMin: number, valorMax: number): Promise<PlanoDentalResponse[]> {
        const params = { valorMin, valorMax };
        const response = await api.get(`${API_URL}/api/planos-dentais/valor`, { params });
        return response.data;
    },

    // Buscar por paciente e dentista
    async buscarPorPacienteEDentista(pacienteId: number, dentistaId: number): Promise<PlanoDentalResponse[]> {
        const response = await api.get(`${API_URL}/api/planos-dentais/paciente/${pacienteId}/dentista/${dentistaId}`);
        return response.data;
    },

    // Calcular total de valor por paciente
    async calcularTotalValorPorPaciente(pacienteId: number): Promise<number> {
        const response = await api.get(`${API_URL}/api/planos-dentais/paciente/${pacienteId}/total-valor`);
        return response.data;
    },

    // Calcular total de valor final por paciente
    async calcularTotalValorFinalPorPaciente(pacienteId: number): Promise<number> {
        const response = await api.get(`${API_URL}/api/planos-dentais/paciente/${pacienteId}/total-valor-final`);
        return response.data;
    },

    // Atualizar
    async atualizar(id: number, plano: PlanoDentalRequest): Promise<PlanoDentalResponse> {
        const response = await api.put(`${API_URL}/api/planos-dentais/${id}`, plano);
        return response.data;
    },

    // Deletar
    async deletar(id: number): Promise<void> {
        await api.delete(`${API_URL}/api/planos-dentais/${id}`);
    },

    // Buscar com filtros - NOTA: Este endpoint não existe no backend, você precisa criar ou usar outro
    async buscarComFiltros(filtros: PlanoDentalFilter): Promise<PagePlanoDentalResponse> {
        // Se não existir o endpoint /buscar no backend, use o endpoint paginado
        const params = {
            page: filtros.page || 0,
            size: filtros.size || 10
        };
        const response = await api.get(`${API_URL}/api/planos-dentais/paginados`, { params });
        return response.data;
    }
};