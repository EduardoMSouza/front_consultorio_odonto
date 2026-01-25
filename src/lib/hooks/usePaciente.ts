import { useState, useEffect } from 'react';
import { pacienteService } from '@/lib/services/paciente/paciente.service';
import {
    PacienteRequest,
    PacienteResponse,
    PacienteResumoResponse,
    PacientePageResponse,
    PacienteFiltro
} from '@/lib/types/paciente/paciente.types';

export const usePaciente = (id?: number) => {
    const [paciente, setPaciente] = useState<PacienteResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            carregarPaciente(id);
        }
    }, [id]);

    const carregarPaciente = async (pacienteId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await pacienteService.buscarPorId(pacienteId);
            setPaciente(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar paciente');
        } finally {
            setLoading(false);
        }
    };

    const criar = async (dados: PacienteRequest) => {
        setLoading(true);
        setError(null);
        try {
            const novoPaciente = await pacienteService.criar(dados);
            setPaciente(novoPaciente);
            return novoPaciente;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao criar paciente';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const atualizar = async (pacienteId: number, dados: PacienteRequest) => {
        setLoading(true);
        setError(null);
        try {
            const pacienteAtualizado = await pacienteService.atualizar(pacienteId, dados);
            setPaciente(pacienteAtualizado);
            return pacienteAtualizado;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao atualizar paciente';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const excluir = async (pacienteId: number) => {
        setLoading(true);
        setError(null);
        try {
            await pacienteService.excluir(pacienteId);
            setPaciente(null);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao excluir paciente';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const ativar = async (pacienteId: number) => {
        setLoading(true);
        setError(null);
        try {
            await pacienteService.ativar(pacienteId);
            if (paciente && paciente.id === pacienteId) {
                setPaciente({ ...paciente, ativo: true });
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao ativar paciente';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const inativar = async (pacienteId: number) => {
        setLoading(true);
        setError(null);
        try {
            await pacienteService.inativar(pacienteId);
            if (paciente && paciente.id === pacienteId) {
                setPaciente({ ...paciente, ativo: false });
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao inativar paciente';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const buscarPorProntuario = async (prontuario: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await pacienteService.buscarPorProntuario(prontuario);
            setPaciente(data);
            return data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao buscar paciente por prontuário';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const buscarPorCpf = async (cpf: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await pacienteService.buscarPorCpf(cpf);
            setPaciente(data);
            return data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao buscar paciente por CPF';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const verificarProntuario = async (prontuario: string) => {
        try {
            return await pacienteService.verificarProntuario(prontuario);
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Erro ao verificar prontuário');
        }
    };

    const verificarCpf = async (cpf: string) => {
        try {
            return await pacienteService.verificarCpf(cpf);
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Erro ao verificar CPF');
        }
    };

    return {
        paciente,
        loading,
        error,
        carregarPaciente,
        criar,
        atualizar,
        excluir,
        ativar,
        inativar,
        buscarPorProntuario,
        buscarPorCpf,
        verificarProntuario,
        verificarCpf
    };
};

export const usePacientes = () => {
    const [pacientes, setPacientes] = useState<PacienteResumoResponse[]>([]);
    const [paginacao, setPaginacao] = useState({
        totalPages: 0,
        totalElements: 0,
        size: 10,
        number: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listarTodos = async (pagina = 0, tamanho = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: PacientePageResponse = await pacienteService.listarPaginado(pagina, tamanho);
            setPacientes(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar pacientes');
        } finally {
            setLoading(false);
        }
    };

    const listarResumo = async (pagina = 0, tamanho = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: PacientePageResponse = await pacienteService.listarResumoPaginado(pagina, tamanho);
            setPacientes(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar resumo de pacientes');
        } finally {
            setLoading(false);
        }
    };

    const listarAtivos = async (pagina = 0, tamanho = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: PacientePageResponse = await pacienteService.listarAtivosPaginado(pagina, tamanho);
            setPacientes(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar pacientes ativos');
        } finally {
            setLoading(false);
        }
    };

    const listarInativos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await pacienteService.listarInativos();
            setPacientes(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar pacientes inativos');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorNome = async (nome: string, pagina = 0, tamanho = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: PacientePageResponse = await pacienteService.buscarPorNomePaginado(nome, pagina, tamanho);
            setPacientes(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes por nome');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorConvenio = async (convenio: string, pagina = 0, tamanho = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: PacientePageResponse = await pacienteService.buscarPorConvenioPaginado(convenio, pagina, tamanho);
            setPacientes(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes por convênio');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorDataNascimento = async (data: string) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await pacienteService.buscarPorDataNascimento(data);
            setPacientes(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes por data de nascimento');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorDataNascimentoEntre = async (inicio: string, fim: string) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await pacienteService.buscarPorDataNascimentoEntre(inicio, fim);
            setPacientes(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes por intervalo de data');
        } finally {
            setLoading(false);
        }
    };

    const buscarAniversariantesMes = async (mes: number) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await pacienteService.buscarAniversariantesMes(mes);
            setPacientes(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar aniversariantes do mês');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorTelefone = async (telefone: string) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await pacienteService.buscarPorTelefone(telefone);
            setPacientes(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes por telefone');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorFaixaEtaria = async (idadeMin: number, idadeMax: number) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await pacienteService.buscarPorFaixaEtaria(idadeMin, idadeMax);
            setPacientes(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes por faixa etária');
        } finally {
            setLoading(false);
        }
    };

    const buscarMenores = async () => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await pacienteService.buscarMenores();
            setPacientes(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes menores');
        } finally {
            setLoading(false);
        }
    };

    const buscarComFiltros = async (filtros: PacienteFiltro, pagina = 0, tamanho = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: PacientePageResponse = await pacienteService.buscarComFiltros(filtros, pagina, tamanho);
            setPacientes(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes com filtros');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorResponsavel = async (nome: string) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await pacienteService.buscarPorResponsavel(nome);
            setPacientes(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes por responsável');
        } finally {
            setLoading(false);
        }
    };

    const listarConvenios = async () => {
        try {
            return await pacienteService.listarConvenios();
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Erro ao listar convênios');
        }
    };

    const recarregar = () => {
        listarResumo(paginacao.number, paginacao.size);
    };

    return {
        pacientes,
        paginacao,
        loading,
        error,
        listarTodos,
        listarResumo,
        listarAtivos,
        listarInativos,
        buscarPorNome,
        buscarPorConvenio,
        buscarPorDataNascimento,
        buscarPorDataNascimentoEntre,
        buscarAniversariantesMes,
        buscarPorTelefone,
        buscarPorFaixaEtaria,
        buscarMenores,
        buscarComFiltros,
        buscarPorResponsavel,
        listarConvenios,
        recarregar
    };
};

export const usePacientesSaude = () => {
    const [pacientes, setPacientes] = useState<PacienteResumoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buscarComDiabetes = async () => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await pacienteService.pacientesComDiabetes();
            setPacientes(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes com diabetes');
        } finally {
            setLoading(false);
        }
    };

    const buscarComHipertensao = async () => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await pacienteService.pacientesComHipertensao();
            setPacientes(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes com hipertensão');
        } finally {
            setLoading(false);
        }
    };

    const buscarFumantes = async () => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await pacienteService.pacientesFumantes();
            setPacientes(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes fumantes');
        } finally {
            setLoading(false);
        }
    };

    const buscarComResponsavel = async () => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await pacienteService.pacientesComResponsavel();
            setPacientes(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar pacientes com responsável');
        } finally {
            setLoading(false);
        }
    };

    return {
        pacientes,
        loading,
        error,
        buscarComDiabetes,
        buscarComHipertensao,
        buscarFumantes,
        buscarComResponsavel
    };
};

export const usePacientesEstatisticas = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const obterContagem = async () => {
        setLoading(true);
        setError(null);
        try {
            return await pacienteService.estatisticasContagem();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao obter estatísticas de contagem';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const obterPorConvenio = async () => {
        setLoading(true);
        setError(null);
        try {
            return await pacienteService.estatisticasConvenio();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao obter estatísticas por convênio';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const obterPorFaixaEtaria = async () => {
        setLoading(true);
        setError(null);
        try {
            return await pacienteService.estatisticasFaixaEtaria();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao obter estatísticas por faixa etária';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const obterPorMesCadastro = async () => {
        setLoading(true);
        setError(null);
        try {
            return await pacienteService.estatisticasMesCadastro();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao obter estatísticas por mês de cadastro';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        obterContagem,
        obterPorConvenio,
        obterPorFaixaEtaria,
        obterPorMesCadastro
    };
};

export const usePacientesRelatorios = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const gerarRelatorioCadastro = async (inicio: string, fim: string) => {
        setLoading(true);
        setError(null);
        try {
            return await pacienteService.relatorioCadastro(inicio, fim);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao gerar relatório de cadastro';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const gerarRelatorioNaturalidades = async () => {
        setLoading(true);
        setError(null);
        try {
            return await pacienteService.relatorioNaturalidades();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao gerar relatório de naturalidades';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const gerarRelatorioNovos12Meses = async () => {
        setLoading(true);
        setError(null);
        try {
            return await pacienteService.relatorioNovos12Meses();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao gerar relatório de novos pacientes';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        gerarRelatorioCadastro,
        gerarRelatorioNaturalidades,
        gerarRelatorioNovos12Meses
    };
};