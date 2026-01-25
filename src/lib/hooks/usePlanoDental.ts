// hooks/usePlanoDental.ts

import { useState, useEffect } from 'react';
import { planoDentalService } from '@/lib/services/plano-dental/plano_dental.service';
import {
    PlanoDentalResponse,
    PlanoDentalRequest,
    PagePlanoDentalResponse,
    PlanoDentalFilter
} from '@/lib/types/plano-dental/plano_dental.type';

export const usePlanoDental = (id?: number) => {
    const [planoDental, setPlanoDental] = useState<PlanoDentalResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            carregarPlanoDental(id);
        }
    }, [id]);

    const carregarPlanoDental = async (planoId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await planoDentalService.buscarPorId(planoId);
            setPlanoDental(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar plano dental');
        } finally {
            setLoading(false);
        }
    };

    const criar = async (dados: PlanoDentalRequest) => {
        setLoading(true);
        setError(null);
        try {
            const novoPlano = await planoDentalService.criar(dados);
            setPlanoDental(novoPlano);
            return novoPlano;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao criar plano dental';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const atualizar = async (planoId: number, dados: PlanoDentalRequest) => {
        setLoading(true);
        setError(null);
        try {
            const planoAtualizado = await planoDentalService.atualizar(planoId, dados);
            setPlanoDental(planoAtualizado);
            return planoAtualizado;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao atualizar plano dental';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const deletar = async (planoId: number) => {
        setLoading(true);
        setError(null);
        try {
            await planoDentalService.deletar(planoId);
            setPlanoDental(null);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao deletar plano dental';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return {
        planoDental,
        loading,
        error,
        carregarPlanoDental,
        criar,
        atualizar,
        deletar
    };
};

export const usePlanosDentais = () => {
    const [planosDentais, setPlanosDentais] = useState<PlanoDentalResponse[]>([]);
    const [paginacao, setPaginacao] = useState({
        totalPages: 0,
        totalElements: 0,
        size: 10,
        number: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listarTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await planoDentalService.listarTodos();
            setPlanosDentais(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar planos dentais');
        } finally {
            setLoading(false);
        }
    };

    const listarTodosPaginados = async (page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: PagePlanoDentalResponse = await planoDentalService.listarTodosPaginados(page, size);
            setPlanosDentais(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar planos dentais');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorPaciente = async (pacienteId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await planoDentalService.buscarPorPaciente(pacienteId);
            setPlanosDentais(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar planos do paciente');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorPacientePaginado = async (pacienteId: number, page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: PagePlanoDentalResponse = await planoDentalService.buscarPorPacientePaginado(pacienteId, page, size);
            setPlanosDentais(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar planos do paciente');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorDentista = async (dentistaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await planoDentalService.buscarPorDentista(dentistaId);
            setPlanosDentais(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar planos do dentista');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorDente = async (dente: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await planoDentalService.buscarPorDente(dente);
            setPlanosDentais(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar planos por dente');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorProcedimento = async (procedimento: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await planoDentalService.buscarPorProcedimento(procedimento);
            setPlanosDentais(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar planos por procedimento');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorValorEntre = async (valorMin: number, valorMax: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await planoDentalService.buscarPorValorEntre(valorMin, valorMax);
            setPlanosDentais(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar planos por valor');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorPacienteEDentista = async (pacienteId: number, dentistaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await planoDentalService.buscarPorPacienteEDentista(pacienteId, dentistaId);
            setPlanosDentais(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar planos');
        } finally {
            setLoading(false);
        }
    };

    const buscarComFiltros = async (filtros: PlanoDentalFilter) => {
        setLoading(true);
        setError(null);
        try {
            const data: PagePlanoDentalResponse = await planoDentalService.buscarComFiltros(filtros);
            setPlanosDentais(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar planos com filtros');
        } finally {
            setLoading(false);
        }
    };

    const recarregar = () => {
        listarTodosPaginados(paginacao.number, paginacao.size);
    };

    return {
        planosDentais,
        paginacao,
        loading,
        error,
        listarTodos,
        listarTodosPaginados,
        buscarPorPaciente,
        buscarPorPacientePaginado,
        buscarPorDentista,
        buscarPorDente,
        buscarPorProcedimento,
        buscarPorValorEntre,
        buscarPorPacienteEDentista,
        buscarComFiltros,
        recarregar
    };
};

export const usePlanoDentalCalculos = (pacienteId?: number) => {
    const [totalValor, setTotalValor] = useState<number>(0);
    const [totalValorFinal, setTotalValorFinal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (pacienteId) {
            calcularTotais(pacienteId);
        }
    }, [pacienteId]);

    const calcularTotais = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const [valor, valorFinal] = await Promise.all([
                planoDentalService.calcularTotalValorPorPaciente(id),
                planoDentalService.calcularTotalValorFinalPorPaciente(id)
            ]);
            setTotalValor(valor);
            setTotalValorFinal(valorFinal);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao calcular totais');
        } finally {
            setLoading(false);
        }
    };

    const calcularTotalValor = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const valor = await planoDentalService.calcularTotalValorPorPaciente(id);
            setTotalValor(valor);
            return valor;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao calcular total';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const calcularTotalValorFinal = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const valorFinal = await planoDentalService.calcularTotalValorFinalPorPaciente(id);
            setTotalValorFinal(valorFinal);
            return valorFinal;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao calcular total final';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return {
        totalValor,
        totalValorFinal,
        loading,
        error,
        calcularTotais,
        calcularTotalValor,
        calcularTotalValorFinal
    };
};