// evolucao_tratamento.type.ts

// Request para criar evolução
export type CriarEvolucaoTratamentoRequest = {
    pacienteId: number;
    dentistaId: number;
    data: string; // formato ISO: "yyyy-MM-dd"
    evolucaoEIntercorrencias?: string;
};

// Request para atualizar evolução
export type AtualizarEvolucaoTratamentoRequest = {
    data?: string;
    evolucaoEIntercorrencias?: string;
};

// Request para filtrar evoluções
export type FiltroEvolucaoTratamentoRequest = {
    pacienteId?: number;
    dentistaId?: number;
    dataInicio?: string;
    dataFim?: string;
    nomePaciente?: string;
    nomeDentista?: string;
};

// Response resumido
export type ResumoEvolucaoResponse = {
    id: number;
    pacienteNome: string;
    dentistaNome: string;
    data: string; // "dd/MM/yyyy"
    evolucaoResumida: string;
    tamanhoTexto: number;
};

// Response completo
export type EvolucaoTratamentoResponse = {
    id: number;
    pacienteId: number;
    pacienteNome: string;
    dentistaId: number;
    dentistaNome: string;
    data: string; // "dd/MM/yyyy"
    evolucaoEIntercorrencias: string;
    criadoEm: string; // "dd/MM/yyyy HH:mm:ss"
    atualizadoEm: string; // "dd/MM/yyyy HH:mm:ss"
};

// Response detalhado
export type EvolucaoTratamentoDetalheResponse = {
    id: number;
    // Paciente
    pacienteId: number;
    pacienteNome: string;
    pacienteTelefone: string;
    pacienteEmail: string;
    // Dentista
    dentistaId: number;
    dentistaNome: string;
    dentistaCro: string;
    // Dados da evolução
    data: string; // "dd/MM/yyyy"
    dataFormatada: string; // "EEEE, dd 'de' MMMM 'de' yyyy"
    evolucaoEIntercorrencias: string;
    quantidadeCaracteres: number;
    criadoEm: string; // "dd/MM/yyyy HH:mm:ss"
    atualizadoEm: string; // "dd/MM/yyyy HH:mm:ss"
    // Permissões
    podeEditar: boolean;
    podeExcluir: boolean;
};

// Response de estatísticas
export type EstatisticaEvolucaoResponse = {
    totalEvolucoes: number;
    totalPacientes: number;
    totalDentistas: number;
    dataPrimeiraEvolucao: string;
    dataUltimaEvolucao: string;
    evolucoesMesAtual: number;
    evolucoesMesAnterior: number;
    crescimentoPercentual: number;
};

// Tipo genérico para paginação
export type PaginacaoResponse<T> = {
    conteudo: T[];
    paginaAtual: number;
    totalPaginas: number;
    totalElementos: number;
    tamanhoPagina: number;
    primeiraPagina: boolean;
    ultimaPagina: boolean;
};