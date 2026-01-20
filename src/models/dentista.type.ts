// dentista.type.ts

// Tipo para DentistaResumoResponse
export type DentistaResumoResponse = {
    id: number;
    nome: string;
    cro: string;
    especialidade: string;
    telefone: string;
    email: string;
    ativo: boolean;
};

// Tipo para DentistaResponse (completo)
export type DentistaResponse = {
    id: number;
    nome: string;
    cro: string;
    especialidade: string;
    telefone: string;
    email: string;
    ativo: boolean;
    criadoEm: string; // Data formatada como "dd/MM/yyyy HH:mm:ss"
    atualizadoEm: string; // Data formatada como "dd/MM/yyyy HH:mm:ss"
};

// Tipo para DentistaRequest
export type DentistaRequest = {
    nome: string;
    cro: string;
    especialidade: string;
    telefone: string;
    email: string;
};

// Tipo para criação/atualização de dentista
export type DentistaInput = DentistaRequest;

// Tipo para atualização parcial de dentista (PATCH)
export type DentistaUpdate = Partial<DentistaRequest>;

// Tipo para filtro/pesquisa de dentistas
export type DentistaFilter = {
    nome?: string;
    cro?: string;
    especialidade?: string;
    ativo?: boolean;
};

// Tipo para resposta paginada de dentistas
export type DentistaPageResponse = {
    content: DentistaResumoResponse[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
};

// Tipo para status de dentista
export type DentistaStatus = {
    id: number;
    ativo: boolean;
};

// Constante para especialidades comuns (opcional)
export const ESPECIALIDADES_DENTISTA = [
    'Clínico Geral',
    'Ortodontia',
    'Periodontia',
    'Endodontia',
    'Implantodontia',
    'Odontopediatria',
    'Dentística',
    'Radiologia',
    'Cirurgia Bucomaxilofacial'
] as const;