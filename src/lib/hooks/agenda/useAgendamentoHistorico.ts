// useAgendamentoHistorico.ts

import { useState } from 'react';
import {agendamentoHistoricoService} from "@/lib/services/agenda/agendamento-historico.service";
import {AgendamentoHistoricoResponse, TipoAcao} from "@/lib/types/agenda/agendamento-historico.type";

export const useAgendamentoHistorico = () => {
    const [historico, setHistorico] = useState<AgendamentoHistoricoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buscarPorAgendamento = async (agendamentoId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await agendamentoHistoricoService.buscarPorAgendamento(agendamentoId);
            setHistorico(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar histórico do agendamento');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorUsuario = async (usuario: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await agendamentoHistoricoService.buscarPorUsuario(usuario);
            setHistorico(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar histórico do usuário');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorAcao = async (acao: TipoAcao) => {
        setLoading(true);
        setError(null);
        try {
            const data = await agendamentoHistoricoService.buscarPorAcao(acao);
            setHistorico(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar histórico por ação');
        } finally {
            setLoading(false);
        }
    };

    const buscarPorPeriodo = async (inicio: string, fim: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await agendamentoHistoricoService.buscarPorPeriodo(inicio, fim);
            setHistorico(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar histórico por período');
        } finally {
            setLoading(false);
        }
    };

    const limpar = () => {
        setHistorico([]);
        setError(null);
    };

    return {
        historico,
        loading,
        error,
        buscarPorAgendamento,
        buscarPorUsuario,
        buscarPorAcao,
        buscarPorPeriodo,
        limpar
    };
};