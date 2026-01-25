// lib/hooks/agenda/useAgendamentosDia.ts
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { agendamentoService } from '@/lib/services/agenda/agendamento.service';
import { AgendamentoResponse } from '@/lib/types/agenda/agendamento.type';

interface UseAgendamentosDiaReturn {
    agendamentos: AgendamentoResponse[];
    loading: boolean;
    error: string | null;
    selectedDate: Date;
    carregarAgendamentos: () => Promise<void>;
    setSelectedDate: (date: Date) => void;
    totalAgendamentos: number;
    agendamentosManha: AgendamentoResponse[];
    agendamentosTarde: AgendamentoResponse[];
    agendamentosNoite: AgendamentoResponse[];
}

export const useAgendamentosDia = (dentistaId: number, initialDate?: Date): UseAgendamentosDiaReturn => {
    const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());

    const carregarAgendamentos = useCallback(async () => {
        if (!dentistaId) {
            setAgendamentos([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const dataFormatada = format(selectedDate, 'yyyy-MM-dd');
            const resultado = await agendamentoService.listarPorDentistaEData(dentistaId, dataFormatada);
            setAgendamentos(resultado);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao carregar agendamentos do dia';
            setError(errorMessage);
            console.error('Erro ao carregar agendamentos:', err);
        } finally {
            setLoading(false);
        }
    }, [dentistaId, selectedDate]);

    useEffect(() => {
        carregarAgendamentos();
    }, [carregarAgendamentos]);

    // Filtrar agendamentos por período do dia
    const agendamentosManha = agendamentos.filter(ag => {
        const hora = parseInt(ag.horaInicio.split(':')[0]);
        return hora >= 8 && hora < 12;
    });

    const agendamentosTarde = agendamentos.filter(ag => {
        const hora = parseInt(ag.horaInicio.split(':')[0]);
        return hora >= 12 && hora < 18;
    });

    const agendamentosNoite = agendamentos.filter(ag => {
        const hora = parseInt(ag.horaInicio.split(':')[0]);
        return hora >= 18;
    });

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    return {
        agendamentos,
        loading,
        error,
        selectedDate,
        carregarAgendamentos,
        setSelectedDate: handleDateChange,
        totalAgendamentos: agendamentos.length,
        agendamentosManha,
        agendamentosTarde,
        agendamentosNoite
    };
};