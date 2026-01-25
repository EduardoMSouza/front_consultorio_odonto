// useAgendamento.ts

import { useState, useEffect } from 'react';
import { agendamentoService } from '@/lib/services/agenda/agendamento.service';
import {
    AgendamentoRequest,
    AgendamentoResponse,
    StatusAgendamento,
    DisponibilidadeResponse
} from '@/lib/types/agenda/agendamento.type';

export const useAgendamento = (id?: number) => {
    const [agendamento, setAgendamento] = useState<AgendamentoResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            carregarAgendamento(id);
        }
    }, [id]);

    const carregarAgendamento = async (agendamentoId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await agendamentoService.buscarPorId(agendamentoId);
            setAgendamento(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar agendamento');
        } finally {
            setLoading(false);
        }
    };

    const criar = async (dados: AgendamentoRequest) => {
        setLoading(true);
        setError(null);
        try {
            const novoAgendamento = await agendamentoService.criar(dados);
            setAgendamento(novoAgendamento);
            return novoAgendamento;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao criar agendamento';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const atualizar = async (agendamentoId: number, dados: AgendamentoRequest) => {
        setLoading(true);
        setError(null);
        try {
            const agendamentoAtualizado = await agendamentoService.atualizar(agendamentoId, dados);
            setAgendamento(agendamentoAtualizado);
            return agendamentoAtualizado;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao atualizar agendamento';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const deletar = async (agendamentoId: number) => {
        setLoading(true);
        setError(null);
        try {
            await agendamentoService.deletar(agendamentoId);
            setAgendamento(null);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao deletar agendamento';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const confirmar = async (agendamentoId: number, usuario: string) => {
        setLoading(true);
        setError(null);
        try {
            const agendamentoConfirmado = await agendamentoService.confirmar(agendamentoId, usuario);
            setAgendamento(agendamentoConfirmado);
            return agendamentoConfirmado;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao confirmar agendamento';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const iniciarAtendimento = async (agendamentoId: number, usuario: string) => {
        setLoading(true);
        setError(null);
        try {
            const agendamentoIniciado = await agendamentoService.iniciarAtendimento(agendamentoId, usuario);
            setAgendamento(agendamentoIniciado);
            return agendamentoIniciado;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao iniciar atendimento';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const concluir = async (agendamentoId: number, usuario: string) => {
        setLoading(true);
        setError(null);
        try {
            const agendamentoConcluido = await agendamentoService.concluir(agendamentoId, usuario);
            setAgendamento(agendamentoConcluido);
            return agendamentoConcluido;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao concluir agendamento';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const cancelar = async (agendamentoId: number, motivo: string, usuario: string) => {
        setLoading(true);
        setError(null);
        try {
            const agendamentoCancelado = await agendamentoService.cancelar(agendamentoId, motivo, usuario);
            setAgendamento(agendamentoCancelado);
            return agendamentoCancelado;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao cancelar agendamento';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const marcarFalta = async (agendamentoId: number, usuario: string) => {
        setLoading(true);
        setError(null);
        try {
            const agendamentoFalta = await agendamentoService.marcarFalta(agendamentoId, usuario);
            setAgendamento(agendamentoFalta);
            return agendamentoFalta;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Erro ao marcar falta';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const verificarDisponibilidade = async (
        dentistaId: number,
        data: string,
        horaInicio: string,
        horaFim: string
    ): Promise<boolean> => {
        try {
            const resultado = await agendamentoService.verificarDisponibilidade(dentistaId, data, horaInicio, horaFim);
            return resultado.disponivel;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Erro ao verificar disponibilidade');
        }
    };

    return {
        agendamento,
        loading,
        error,
        carregarAgendamento,
        criar,
        atualizar,
        deletar,
        confirmar,
        iniciarAtendimento,
        concluir,
        cancelar,
        marcarFalta,
        verificarDisponibilidade
    };
};

export const useAgendamentos = () => {
    const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listarTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await agendamentoService.listarTodos();
            setAgendamentos(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar agendamentos');
        } finally {
            setLoading(false);
        }
    };

    const listarPorDentista = async (dentistaId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await agendamentoService.listarPorDentista(dentistaId);
            setAgendamentos(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar agendamentos do dentista');
        } finally {
            setLoading(false);
        }
    };

    const listarPorPaciente = async (pacienteId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await agendamentoService.listarPorPaciente(pacienteId);
            setAgendamentos(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar agendamentos do paciente');
        } finally {
            setLoading(false);
        }
    };

    const listarPorData = async (data: string) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await agendamentoService.listarPorData(data);
            setAgendamentos(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar agendamentos da data');
        } finally {
            setLoading(false);
        }
    };

    const listarPorPeriodo = async (dataInicio: string, dataFim: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await agendamentoService.listarPorPeriodo(dataInicio, dataFim);
            setAgendamentos(data);
            return data; // ✅ IMPORTANTE: Retornar os dados
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar agendamentos do período');
            throw err; // ✅ Lançar o erro para tratamento
        } finally {
            setLoading(false);
        }
    };


    const listarPorStatus = async (status: StatusAgendamento) => {
        setLoading(true);
        setError(null);
        try {
            const data = await agendamentoService.listarPorStatus(status);
            setAgendamentos(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar agendamentos por status');
        } finally {
            setLoading(false);
        }
    };

    const listarPorDentistaEData = async (dentistaId: number, data: string) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await agendamentoService.listarPorDentistaEData(dentistaId, data);
            setAgendamentos(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao listar agendamentos');
        } finally {
            setLoading(false);
        }
    };

    const buscarAgendamentosParaLembrete = async (data: string) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await agendamentoService.buscarAgendamentosParaLembrete(data);
            setAgendamentos(resultado);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar agendamentos para lembrete');
        } finally {
            setLoading(false);
        }
    };

    const marcarLembreteEnviado = async (id: number) => {
        try {
            await agendamentoService.marcarLembreteEnviado(id);
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Erro ao marcar lembrete enviado');
        }
    };

    const recarregar = () => {
        listarTodos();
    };

    return {
        agendamentos,
        loading,
        error,
        listarTodos,
        listarPorDentista,
        listarPorPaciente,
        listarPorData,
        listarPorPeriodo,
        listarPorStatus,
        listarPorDentistaEData,
        buscarAgendamentosParaLembrete,
        marcarLembreteEnviado,
        recarregar
    };
};