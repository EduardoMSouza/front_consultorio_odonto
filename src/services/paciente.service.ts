// paciente.service.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const pacienteService = {
    // Criar
    async criar(paciente: any) {
        const response = await axios.post(`${API_URL}/api/pacientes`, paciente);
        return response.data;
    },

    // Buscar por ID
    async buscarPorId(id: number) {
        const response = await axios.get(`${API_URL}/api/pacientes/${id}`);
        return response.data;
    },

    // Atualizar
    async atualizar(id: number, paciente: any) {
        const response = await axios.put(`${API_URL}/api/pacientes/${id}`, paciente);
        return response.data;
    },

    // Inativar
    async inativar(id: number) {
        await axios.patch(`${API_URL}/api/pacientes/${id}/inativar`);
    },

    // Ativar
    async ativar(id: number) {
        await axios.patch(`${API_URL}/api/pacientes/${id}/ativar`);
    },

    // Excluir
    async excluir(id: number) {
        await axios.delete(`${API_URL}/api/pacientes/${id}`);
    },

    // Buscar por prontuário
    async buscarPorProntuario(prontuario: string) {
        const response = await axios.get(`${API_URL}/api/pacientes/prontuario/${prontuario}`);
        return response.data;
    },

    // Buscar por CPF
    async buscarPorCpf(cpf: string) {
        const response = await axios.get(`${API_URL}/api/pacientes/cpf/${cpf}`);
        return response.data;
    },

    // Listar todos
    async listarTodos() {
        const response = await axios.get(`${API_URL}/api/pacientes`);
        return response.data;
    },

    // Listar paginado
    async listarPaginado(pagina = 0, tamanho = 10) {
        const params = { page: pagina, size: tamanho };
        const response = await axios.get(`${API_URL}/api/pacientes/paginado`, { params });
        return response.data;
    },

    // Listar ativos
    async listarAtivos() {
        const response = await axios.get(`${API_URL}/api/pacientes/ativos`);
        return response.data;
    },

    // Listar ativos paginado
    async listarAtivosPaginado(pagina = 0, tamanho = 10) {
        const params = { page: pagina, size: tamanho };
        const response = await axios.get(`${API_URL}/api/pacientes/ativos/paginado`, { params });
        return response.data;
    },

    // Listar inativos
    async listarInativos() {
        const response = await axios.get(`${API_URL}/api/pacientes/inativos`);
        return response.data;
    },

    // Listar resumo
    async listarResumo() {
        const response = await axios.get(`${API_URL}/api/pacientes/resumo`);
        return response.data;
    },

    // Listar resumo paginado
    async listarResumoPaginado(pagina = 0, tamanho = 10) {
        const params = { page: pagina, size: tamanho };
        const response = await axios.get(`${API_URL}/api/pacientes/resumo/paginado`, { params });
        return response.data;
    },

    // Buscar por nome
    async buscarPorNome(nome: string) {
        const params = { nome };
        const response = await axios.get(`${API_URL}/api/pacientes/buscar/nome`, { params });
        return response.data;
    },

    // Buscar por nome paginado
    async buscarPorNomePaginado(nome: string, pagina = 0, tamanho = 10) {
        const params = { nome, page: pagina, size: tamanho };
        const response = await axios.get(`${API_URL}/api/pacientes/buscar/nome/paginado`, { params });
        return response.data;
    },

    // Buscar por convênio
    async buscarPorConvenio(convenio: string) {
        const response = await axios.get(`${API_URL}/api/pacientes/buscar/convenio/${convenio}`);
        return response.data;
    },

    // Buscar por convênio paginado
    async buscarPorConvenioPaginado(convenio: string, pagina = 0, tamanho = 10) {
        const params = { page: pagina, size: tamanho };
        const response = await axios.get(`${API_URL}/api/pacientes/buscar/convenio/${convenio}/paginado`, { params });
        return response.data;
    },

    // Listar convênios
    async listarConvenios() {
        const response = await axios.get(`${API_URL}/api/pacientes/convenios`);
        return response.data;
    },

    // Buscar por data de nascimento
    async buscarPorDataNascimento(data: string) {
        const params = { data };
        const response = await axios.get(`${API_URL}/api/pacientes/buscar/data-nascimento`, { params });
        return response.data;
    },

    // Buscar por intervalo de data de nascimento
    async buscarPorDataNascimentoEntre(inicio: string, fim: string) {
        const params = { inicio, fim };
        const response = await axios.get(`${API_URL}/api/pacientes/buscar/data-nascimento/entre`, { params });
        return response.data;
    },

    // Buscar aniversariantes do mês
    async buscarAniversariantesMes(mes: number) {
        const response = await axios.get(`${API_URL}/api/pacientes/aniversariantes/mes/${mes}`);
        return response.data;
    },

    // Buscar por telefone
    async buscarPorTelefone(telefone: string) {
        const params = { telefone };
        const response = await axios.get(`${API_URL}/api/pacientes/buscar/telefone`, { params });
        return response.data;
    },

    // Buscar com filtros
    async buscarComFiltros(filtros: any, pagina = 0, tamanho = 10) {
        const params = { ...filtros, page: pagina, size: tamanho };
        const response = await axios.get(`${API_URL}/api/pacientes/filtros`, { params });
        return response.data;
    },

    // Buscar por faixa etária
    async buscarPorFaixaEtaria(idadeMin: number, idadeMax: number) {
        const params = { idadeMin, idadeMax };
        const response = await axios.get(`${API_URL}/api/pacientes/faixa-etaria`, { params });
        return response.data;
    },

    // Buscar menores
    async buscarMenores() {
        const response = await axios.get(`${API_URL}/api/pacientes/menores`);
        return response.data;
    },

    // Verificar prontuário
    async verificarProntuario(prontuario: string) {
        const response = await axios.get(`${API_URL}/api/pacientes/verificar/prontuario/${prontuario}`);
        return response.data;
    },

    // Verificar CPF
    async verificarCpf(cpf: string) {
        const response = await axios.get(`${API_URL}/api/pacientes/verificar/cpf/${cpf}`);
        return response.data;
    },

    // Estatísticas
    async estatisticasContagem() {
        const response = await axios.get(`${API_URL}/api/pacientes/estatisticas/contagem`);
        return response.data;
    },

    async estatisticasConvenio() {
        const response = await axios.get(`${API_URL}/api/pacientes/estatisticas/convenio`);
        return response.data;
    },

    async estatisticasFaixaEtaria() {
        const response = await axios.get(`${API_URL}/api/pacientes/estatisticas/faixa-etaria`);
        return response.data;
    },

    async estatisticasMesCadastro() {
        const response = await axios.get(`${API_URL}/api/pacientes/estatisticas/mes-cadastro`);
        return response.data;
    },

    // Saúde
    async pacientesComDiabetes() {
        const response = await axios.get(`${API_URL}/api/pacientes/saude/diabetes`);
        return response.data;
    },

    async pacientesComHipertensao() {
        const response = await axios.get(`${API_URL}/api/pacientes/saude/hipertensao`);
        return response.data;
    },

    async pacientesFumantes() {
        const response = await axios.get(`${API_URL}/api/pacientes/saude/fumantes`);
        return response.data;
    },

    // Responsáveis
    async pacientesComResponsavel() {
        const response = await axios.get(`${API_URL}/api/pacientes/responsaveis`);
        return response.data;
    },

    async buscarPorResponsavel(nome: string) {
        const params = { nome };
        const response = await axios.get(`${API_URL}/api/pacientes/buscar/responsavel`, { params });
        return response.data;
    },

    // Relatórios
    async relatorioCadastro(inicio: string, fim: string) {
        const params = { inicio, fim };
        const response = await axios.get(`${API_URL}/api/pacientes/relatorios/cadastro`, { params });
        return response.data;
    },

    async relatorioNaturalidades() {
        const response = await axios.get(`${API_URL}/api/pacientes/relatorios/naturalidades`);
        return response.data;
    },

    async relatorioNovos12Meses() {
        const response = await axios.get(`${API_URL}/api/pacientes/relatorios/novos-12-meses`);
        return response.data;
    }
};