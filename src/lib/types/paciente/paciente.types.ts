// paciente.type.ts

// DTOs individuais
export type DadosBasicosRequest = {
    prontuarioNumero: string;
    nome: string;
    telefone?: string;
    rg?: string;
    orgaoExpedidor?: string;
    cpf?: string;
    dataNascimento: string; // "yyyy-MM-dd"
    naturalidade?: string;
    nacionalidade?: string;
    profissao?: string;
    enderecoResidencial?: string;
    indicadoPor?: string;
    status: boolean;
};

export type ResponsavelRequest = {
    nome?: string;
    rg?: string;
    orgaoExpedidor?: string;
    cpf?: string;
    estadoCivil?: string;
    conjuge?: string;
    rgConjuge?: string;
    orgaoExpedidorConjuge?: string;
    cpfConjuge?: string;
};

export type AnamneseRequest = {
    febreReumatica?: boolean;
    hepatite?: boolean;
    diabetes?: boolean;
    hipertensaoArterialSistemica?: boolean;
    portadorHiv?: boolean;
    alteracaoCoagulacaoSanguinea?: boolean;
    reacoesAlergicas?: boolean;
    doencasSistemicas?: boolean;
    internacaoRecente?: boolean;
    utilizandoMedicacao?: boolean;
    fumante?: boolean;
    fumanteQuantidade?: string;
    tempoFumo?: string;
    bebidasAlcoolicas?: boolean;
    problemasCardiacos?: boolean;
    problemasRenais?: boolean;
    problemasGastricos?: boolean;
    problemasRespiratorios?: boolean;
    problemasAlergicos?: boolean;
    problemasAlergicosQuais?: string;
    problemasArticularesOuReumatismo?: boolean;
    queixaPrincipal?: string;
    evolucaoDoencaAtual?: string;
};

export type ConvenioRequest = {
    nomeConvenio?: string;
    numeroInscricao?: string;
};

export type InspecaoBucalRequest = {
    lingua?: string;
    mucosa?: string;
    palato?: string;
    labios?: string;
    gengivas?: string;
    nariz?: string;
    face?: string;
    ganglios?: string;
    glandulasSalivares?: string;
    alteracaoOclusao?: boolean;
    alteracaoOclusaoTipo?: string;
    protese?: boolean;
    proteseTipo?: string;
    outrasObservacoes?: string;
};

export type QuestionarioSaudeRequest = {
    sofreDoenca?: boolean;
    sofreDoencaQuais?: string;
    tratamentoMedicoAtual?: boolean;
    gravidez?: boolean;
    usoMedicacao?: boolean;
    usoMedicacaoQuais?: string;
    medicoAssistenteTelefone?: string;
    teveAlergia?: boolean;
    teveAlergiaQuais?: string;
    foiOperado?: boolean;
    foiOperadoQuais?: string;
    problemasCicatrizacao?: boolean;
    problemasAnestesia?: boolean;
    problemasHemorragia?: boolean;
    habitos?: string;
    antecedentesFamiliares?: string;
};

// Request completo
export type PacienteRequest = {
    dadosBasicos: DadosBasicosRequest;
    responsavel?: ResponsavelRequest;
    anamnese?: AnamneseRequest;
    convenio?: ConvenioRequest;
    inspecaoBucal?: InspecaoBucalRequest;
    questionarioSaude?: QuestionarioSaudeRequest;
    observacoes?: string;
};

// Responses individuais
export type DadosBasicosResponse = {
    prontuarioNumero: string;
    nome: string;
    telefone?: string;
    rg?: string;
    orgaoExpedidor?: string;
    cpf?: string;
    dataNascimento: string; // "yyyy-MM-dd"
    naturalidade?: string;
    nacionalidade?: string;
    profissao?: string;
    enderecoResidencial?: string;
    indicadoPor?: string;
    status: boolean;
};

export type ResponsavelResponse = {
    nome?: string;
    rg?: string;
    orgaoExpedidor?: string;
    cpf?: string;
    cpfFormatado?: string;
    estadoCivil?: string;
    conjuge?: string;
    rgConjuge?: string;
    orgaoExpedidorConjuge?: string;
    cpfConjuge?: string;
    cpfConjugeFormatado?: string;
};

export type AnamneseResponse = {
    febreReumatica?: boolean;
    hepatite?: boolean;
    diabetes?: boolean;
    hipertensaoArterialSistemica?: boolean;
    portadorHiv?: boolean;
    alteracaoCoagulacaoSanguinea?: boolean;
    reacoesAlergicas?: boolean;
    doencasSistemicas?: boolean;
    internacaoRecente?: boolean;
    utilizandoMedicacao?: boolean;
    fumante?: boolean;
    fumanteQuantidade?: string;
    tempoFumo?: string;
    bebidasAlcoolicas?: boolean;
    problemasCardiacos?: boolean;
    problemasRenais?: boolean;
    problemasGastricos?: boolean;
    problemasRespiratorios?: boolean;
    problemasAlergicos?: boolean;
    problemasAlergicosQuais?: string;
    problemasArticularesOuReumatismo?: boolean;
    queixaPrincipal?: string;
    evolucaoDoencaAtual?: string;
};

export type ConvenioResponse = {
    nomeConvenio?: string;
    numeroInscricao?: string;
};

export type InspecaoBucalResponse = {
    lingua?: string;
    mucosa?: string;
    palato?: string;
    labios?: string;
    gengivas?: string;
    nariz?: string;
    face?: string;
    ganglios?: string;
    glandulasSalivares?: string;
    alteracaoOclusao?: boolean;
    alteracaoOclusaoTipo?: string;
    protese?: boolean;
    proteseTipo?: string;
    outrasObservacoes?: string;
};

export type QuestionarioSaudeResponse = {
    sofreDoenca?: boolean;
    sofreDoencaQuais?: string;
    tratamentoMedicoAtual?: boolean;
    gravidez?: boolean;
    usoMedicacao?: boolean;
    usoMedicacaoQuais?: string;
    medicoAssistenteTelefone?: string;
    teveAlergia?: boolean;
    teveAlergiaQuais?: string;
    foiOperado?: boolean;
    foiOperadoQuais?: string;
    problemasCicatrizacao?: boolean;
    problemasAnestesia?: boolean;
    problemasHemorragia?: boolean;
    habitos?: string;
    antecedentesFamiliares?: string;
};

// Response completo
export type PacienteResponse = {
    id: number;
    dadosBasicos: DadosBasicosResponse;
    responsavel?: ResponsavelResponse;
    anamnese?: AnamneseResponse;
    convenio?: ConvenioResponse;
    inspecaoBucal?: InspecaoBucalResponse;
    questionarioSaude?: QuestionarioSaudeResponse;
    observacoes?: string;
    ativo: boolean;
    idade: number;
    criadoEm: string; // "yyyy-MM-dd HH:mm:ss"
    atualizadoEm: string; // "yyyy-MM-dd HH:mm:ss"
};

// Response resumido
export type PacienteResumoResponse = {
    id: number;
    prontuarioNumero: string;
    nome: string;
    telefone?: string;
    cpf?: string;
    dataNascimento: string; // "yyyy-MM-dd"
    idade: number;
    convenio?: string;
    numeroInscricaoConvenio?: string;
    status: boolean;
    ativo: boolean;
};

// Tipo para paginação
export type PacientePageResponse = {
    content: PacienteResumoResponse[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
};

// Tipo para filtro
export type PacienteFiltro = {
    nome?: string;
    cpf?: string;
    prontuarioNumero?: string;
    status?: boolean;
    ativo?: boolean;
    convenio?: string;
    dataNascimentoInicio?: string;
    dataNascimentoFim?: string;
};

// Enums e constantes úteis
export const EstCivilOptions = [
    'SOLTEIRO(A)',
    'CASADO(A)',
    'DIVORCIADO(A)',
    'VIÚVO(A)',
    'UNIÃO ESTÁVEL'
];

export const NacionalidadeOptions = [
    'BRASILEIRO(A)',
    'ESTRANGEIRO(A)'
];

export const ProfissaoOptions = [
    'ESTUDANTE',
    'PROFISSIONAL LIBERAL',
    'EMPREGADO(A)',
    'EMPREGADOR(A)',
    'APOSENTADO(A)',
    'DONA DE CASA',
    'DESEMPREGADO(A)',
    'OUTRO'
];