import { useState, useCallback } from 'react';
import { filaEsperaService } from '@/lib/services/agenda/fila-espera.service';
import {
    FilaEsperaRequest,
    FilaEsperaResponse,
    StatusFila
} from '@/lib/types/agenda/fila-espera.type';
import { toast } from 'sonner';

export const useFilaEspera = (id?: number) => {
    const [filaEspera, setFilaEspera] = useState<FilaEsperaResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const carregarFilaEspera = useCallback(async (filaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await filaEsperaService.buscarPorId(filaId);
            setFilaEspera(data);
            return data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao carregar fila de espera';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const criar = useCallback(async (dados: FilaEsperaRequest) => {
        setLoading(true);
        setError(null);
        try {
            const novaFila = await filaEsperaService.criar(dados);
            setFilaEspera(novaFila);
            toast.success('Paciente adicionado à fila de espera');
            return novaFila;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao criar fila de espera';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const atualizar = useCallback(async (filaId: number, dados: FilaEsperaRequest) => {
        setLoading(true);
        setError(null);
        try {
            const filaAtualizada = await filaEsperaService.atualizar(filaId, dados);
            setFilaEspera(filaAtualizada);
            toast.success('Fila de espera atualizada');
            return filaAtualizada;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao atualizar fila de espera';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deletar = useCallback(async (filaId: number) => {
        setLoading(true);
        setError(null);
        try {
            await filaEsperaService.deletar(filaId);
            setFilaEspera(null);
            toast.success('Fila de espera removida');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao deletar fila de espera';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const notificar = useCallback(async (filaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const filaNotificada = await filaEsperaService.notificar(filaId);
            setFilaEspera(filaNotificada);
            toast.success('Paciente notificado com sucesso');
            return filaNotificada;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao notificar paciente';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const converterEmAgendamento = useCallback(async (filaId: number, agendamentoId: number) => {
        setLoading(true);
        setError(null);
        try {
            const filaConvertida = await filaEsperaService.converterEmAgendamento(filaId, agendamentoId);
            setFilaEspera(filaConvertida);
            toast.success('Fila convertida em agendamento');
            return filaConvertida;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao converter fila em agendamento';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const cancelar = useCallback(async (filaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const filaCancelada = await filaEsperaService.cancelar(filaId);
            setFilaEspera(filaCancelada);
            toast.success('Fila de espera cancelada');
            return filaCancelada;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao cancelar fila de espera';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        filaEspera,
        loading,
        error,
        carregarFilaEspera,
        criar,
        atualizar,
        deletar,
        notificar,
        converterEmAgendamento,
        cancelar
    };
};

export const useFilasEspera = () => {
    const [filas, setFilas] = useState<FilaEsperaResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listarTodas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await filaEsperaService.listarTodas();
            setFilas(data);
            return data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao listar filas de espera';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const listarPorStatus = useCallback(async (status: StatusFila) => {
        setLoading(true);
        setError(null);
        try {
            const data = await filaEsperaService.listarPorStatus(status);
            setFilas(data);
            return data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao listar filas por status';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const listarPorPaciente = useCallback(async (pacienteId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await filaEsperaService.listarPorPaciente(pacienteId);
            setFilas(data);
            return data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao listar filas do paciente';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const listarPorDentista = useCallback(async (dentistaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await filaEsperaService.listarPorDentista(dentistaId);
            setFilas(data);
            return data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao listar filas do dentista';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const listarAtivas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await filaEsperaService.listarAtivas();
            setFilas(data);
            return data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao listar filas ativas';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const expirarFilasAntigas = useCallback(async (dataLimite: string) => {
        setLoading(true);
        setError(null);
        try {
            await filaEsperaService.expirarFilasAntigas(dataLimite);
            toast.success('Filas antigas expiradas');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao expirar filas antigas';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const notificar = useCallback(async (filaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const filaNotificada = await filaEsperaService.notificar(filaId);
            setFilas(prev => prev.map(f => f.id === filaId ? filaNotificada : f));
            toast.success('Paciente notificado com sucesso');
            return filaNotificada;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao notificar paciente';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const cancelar = useCallback(async (filaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const filaCancelada = await filaEsperaService.cancelar(filaId);
            setFilas(prev => prev.map(f => f.id === filaId ? filaCancelada : f));
            toast.success('Fila de espera cancelada');
            return filaCancelada;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao cancelar fila de espera';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        filas,
        loading,
        error,
        listarTodas,
        listarPorStatus,
        listarPorPaciente,
        listarPorDentista,
        listarAtivas,
        expirarFilasAntigas,
        notificar,
        cancelar
    };
};