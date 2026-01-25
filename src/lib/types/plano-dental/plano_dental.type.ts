// types/planoDental.ts

export interface PlanoDentalRequest {
    pacienteId: number;
    dentistaId: number;
    dente: string;
    procedimento: string;
    valor?: number | null;
    valorFinal?: number | null;
    observacoes?: string | null;
}

export interface PlanoDentalResponse {
    id: number;
    pacienteId: number;
    pacienteNome: string;
    dentistaId: number;
    dentistaNome: string;
    dente: string;
    procedimento: string;
    valor: number | null;
    valorFinal: number | null;
    observacoes: string | null;
    criadoEm: string;
    atualizadoEm: string;
}

// Para parâmetros de busca
export interface PlanoDentalFilter {
    pacienteId?: number;
    dentistaId?: number;
    dente?: string;
    procedimento?: string;
    valorMin?: number;
    valorMax?: number;
    page?: number;
    size?: number;
    sort?: string;
}

// Para a resposta paginada
export interface PagePlanoDentalResponse {
    content: PlanoDentalResponse[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}