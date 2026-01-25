// hooks/useDentista.ts

import { useState, useEffect } from 'react';
import { dentistaService } from '@/lib/services/dentista/dentista.service';
import {
    DentistaResponse,
    DentistaResumoResponse,
    DentistaInput,
    DentistaPageResponse
} from '@/lib/types/dentista/dentista.type';

export const useDentista = (id?: number) => {
    const [dentista, setDentista] = useState<DentistaResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            carregarDentista(id);
        }
    }, [id]);

    const carregarDentista = async (dentistaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await dentistaService.buscarPorId(dentistaId);
            setDentista(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar dentista');
        } finally {
            setLoading(false);
        }
    };

    const criar = async (dados: DentistaInput) => {
        setLoading(true);
        setError(null);
        try {
            const novoDentista = await dentistaService.criar(dados);
            setDentista(novoDentista);
            return novoDentista;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao criar dentista';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const atualizar = async (dentistaId: number, dados: DentistaInput) => {
        setLoading(true);
        setError(null);
        try {
            const dentistaAtualizado = await dentistaService.atualizar(dentistaId, dados);
            setDentista(dentistaAtualizado);
            return dentistaAtualizado;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao atualizar dentista';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const deletar = async (dentistaId: number) => {
        setLoading(true);
        setError(null);
        try {
            await dentistaService.deletar(dentistaId);
            setDentista(null);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao deletar dentista';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const ativar = async (dentistaId: number) => {
        setLoading(true);
        setError(null);
        try {
            await dentistaService.ativar(dentistaId);
            if (dentista && dentista.id === dentistaId) {
                setDentista({ ...dentista, ativo: true });
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao ativar dentista';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const desativar = async (dentistaId: number) => {
        setLoading(true);
        setError(null);
        try {
            await dentistaService.desativar(dentistaId);
            if (dentista && dentista.id === dentistaId) {
                setDentista({ ...dentista, ativo: false });
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao desativar dentista';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const buscarPorCro = async (cro: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await dentistaService.buscarPorCro(cro);
            setDentista(data);
            return data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao buscar dentista por CRO';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const verificarEmail = async (email: string) => {
        try {
            return await dentistaService.verificarEmail(email);
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Erro ao verificar email');
        }
    };

    const verificarCro = async (cro: string) => {
        try {
            return await dentistaService.verificarCro(cro);
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Erro ao verificar CRO');
        }
    };

    return {
        dentista,
        loading,
        error,
        carregarDentista,
        criar,
        atualizar,
        deletar,
        ativar,
        desativar,
        buscarPorCro,
        verificarEmail,
        verificarCro
    };
};

export const useDentistas = () => {
    const [dentistas, setDentistas] = useState<DentistaResumoResponse[]>([]);
    const [paginacao, setPaginacao] = useState({
        totalPages: 0,
        totalElements: 0,
        size: 10,
        number: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listarTodos = async (page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: DentistaPageResponse = await dentistaService.listarTodos(page, size);
            setDentistas(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar dentistas');
        } finally {
            setLoading(false);
        }
    };

    const listarResumo = async (page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: DentistaPageResponse = await dentistaService.listarResumo(page, size);
            setDentistas(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar resumo de dentistas');
        } finally {
            setLoading(false);
        }
    };

    const listarAtivos = async (page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: DentistaPageResponse = await dentistaService.listarAtivos(page, size);
            setDentistas(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar dentistas ativos');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorNome = async (nome: string, page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: DentistaPageResponse = await dentistaService.buscarPorNome(nome, page, size);
            setDentistas(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar dentistas por nome');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorEspecialidade = async (especialidade: string, page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: DentistaPageResponse = await dentistaService.buscarPorEspecialidade(especialidade, page, size);
            setDentistas(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar dentistas por especialidade');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorTermo = async (termo: string, page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data: DentistaPageResponse = await dentistaService.buscarPorTermo(termo, page, size);
            setDentistas(data.content);
            setPaginacao({
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                size: data.size,
                number: data.number
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar dentistas');
        } finally {
            setLoading(false);
        }
    };

    const recarregar = () => {
        listarResumo(paginacao.number, paginacao.size);
    };

    return {
        dentistas,
        paginacao,
        loading,
        error,
        listarTodos,
        listarResumo,
        listarAtivos,
        buscarPorNome,
        buscarPorEspecialidade,
        buscarPorTermo,
        recarregar
    };
};