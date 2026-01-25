// hooks/useEvolucaoTratamento.ts

import { useState, useEffect } from 'react';
import { evolucaoTratamentoService } from '@/lib/services/evolucao-tratamento/evoluca_tratamento.service';
import {
    EvolucaoTratamentoRequest,
    EvolucaoTratamentoResponse
} from '@/lib/types/evolucao-tratamento/evoluca_tratamento.type';

// Hook para uma única evolução
export const useEvolucaoTratamento = (id?: number) => {
    const [evolucao, setEvolucao] = useState<EvolucaoTratamentoResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            carregarEvolucao(id);
        }
    }, [id]);

    const carregarEvolucao = async (evolucaoId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await evolucaoTratamentoService.buscarPorId(evolucaoId);
            setEvolucao(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar evolução');
        } finally {
            setLoading(false);
        }
    };

    const criar = async (dados: EvolucaoTratamentoRequest) => {
        setLoading(true);
        setError(null);
        try {
            const novaEvolucao = await evolucaoTratamentoService.criar(dados);
            setEvolucao(novaEvolucao);
            return novaEvolucao;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao criar evolução';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const atualizar = async (evolucaoId: number, dados: EvolucaoTratamentoRequest) => {
        setLoading(true);
        setError(null);
        try {
            const evolucaoAtualizada = await evolucaoTratamentoService.atualizar(evolucaoId, dados);
            setEvolucao(evolucaoAtualizada);
            return evolucaoAtualizada;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao atualizar evolução';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const deletar = async (evolucaoId: number) => {
        setLoading(true);
        setError(null);
        try {
            await evolucaoTratamentoService.deletar(evolucaoId);
            setEvolucao(null);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao deletar evolução';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return {
        evolucao,
        loading,
        error,
        carregarEvolucao,
        criar,
        atualizar,
        deletar
    };
};

// Hook para múltiplas evoluções
export const useEvolucoesTratamento = () => {
    const [evolucoes, setEvolucoes] = useState<EvolucaoTratamentoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listarTodas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await evolucaoTratamentoService.listarTodas();
            setEvolucoes(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar evoluções');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorPaciente = async (pacienteId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await evolucaoTratamentoService.buscarPorPaciente(pacienteId);
            setEvolucoes(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar evoluções do paciente');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorDentista = async (dentistaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await evolucaoTratamentoService.buscarPorDentista(dentistaId);
            setEvolucoes(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar evoluções do dentista');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorPeriodo = async (inicio: string, fim: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await evolucaoTratamentoService.buscarPorPeriodo(inicio, fim);
            setEvolucoes(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar evoluções por período');
        } finally {
            setLoading(false);
        }
    };

    const recarregar = () => {
        listarTodas();
    };

    return {
        evolucoes,
        loading,
        error,
        listarTodas,
        buscarPorPaciente,
        buscarPorDentista,
        buscarPorPeriodo,
        recarregar
    };
};