// plano_dental.type.ts

// Request para criar plano dental
export type CriarPlanoDentalRequest = {
    pacienteId: number;
    dentistaId: number;
    dente: string;
    procedimento: string;
    valor: number | string;
    valorFinal?: number | string;
    observacoes?: string;
};

// Request para atualizar plano dental
export type AtualizarPlanoDentalRequest = {
    dente?: string;
    procedimento?: string;
    valor?: number | string;
    valorFinal?: number | string;
    observacoes?: string;
};

// Response resumido do plano dental
export type ResumoPlanoDentalResponse = {
    id: number;
    pacienteNome: string;
    dentistaNome: string;
    dente: string;
    procedimento: string;
    valor: number;
    valorFinal: number;
    criadoEm: string; // "dd/MM/yyyy HH:mm"
    temDesconto: boolean;
};

// Response completo do plano dental
export type PlanoDentalResponse = {
    id: number;
    pacienteId: number;
    pacienteNome: string;
    pacienteTelefone: string;
    dentistaId: number;
    dentistaNome: string;
    dentistaCro: string;
    dente: string;
    procedimento: string;
    valor: number;
    valorFinal: number;
    valorDesconto?: number;
    observacoes?: string;
    criadoEm: string; // "dd/MM/yyyy HH:mm:ss"
    atualizadoEm: string; // "dd/MM/yyyy HH:mm:ss"
    temDesconto: boolean;
    percentualDesconto: string;
};

// Response detalhado do plano dental
export type PlanoDentalDetalheResponse = {
    id: number;
    // Paciente
    pacienteId: number;
    pacienteNome: string;
    pacienteTelefone: string;
    pacienteEmail: string;
    pacienteCpf: string;
    // Dentista
    dentistaId: number;
    dentistaNome: string;
    dentistaCro: string;
    dentistaEspecialidade: string;
    // Plano
    dente: string;
    procedimento: string;
    descricaoProcedimento: string;
    valor: number;
    valorFinal: number;
    valorDesconto?: number;
    percentualDesconto?: number;
    observacoes?: string;
    criadoEm: string; // "dd/MM/yyyy HH:mm:ss"
    atualizadoEm: string; // "dd/MM/yyyy HH:mm:ss"
    // Permissões
    podeEditar: boolean;
    podeExcluir: boolean;
    podeAplicarDesconto: boolean;
    // Formatados
    valorFormatado: string;
    valorFinalFormatado: string;
    valorDescontoFormatado: string;
};

// Tipo para resposta paginada
export type PlanoDentalPageResponse = {
    content: ResumoPlanoDentalResponse[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
};

// Tipo para filtro de busca
export type PlanoDentalFilter = {
    pacienteId?: number;
    dentistaId?: number;
    dente?: string;
    procedimento?: string;
    dataInicio?: string;
    dataFim?: string;
    comDesconto?: boolean;
};