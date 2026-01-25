// models/evolucoes-tratamento.type.ts

export interface EvolucaoTratamentoRequest {
    pacienteId: number;
    dentistaId: number;
    data: string; // ISO string format: YYYY-MM-DD
    evolucaoEIntercorrencias: string;
}

export interface EvolucaoTratamentoResponse {
    id: number;
    pacienteId: number;
    pacienteNome: string;
    dentistaId: number;
    dentistaNome: string;
    data: string; // ISO string format: YYYY-MM-DD
    evolucaoEIntercorrencias: string;
}

export interface EvolucaoTratamentoFilter {
    pacienteId?: number;
    dentistaId?: number;
    dataInicio?: string;
    dataFim?: string;
    evolucaoContem?: string;
    page?: number;
    size?: number;
}

export interface PageEvolucaoTratamentoResponse {
    content: EvolucaoTratamentoResponse[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}