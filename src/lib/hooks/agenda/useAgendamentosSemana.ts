// lib/hooks/agenda/useAgendamentosSemana.ts
import { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { agendamentoService } from '@/lib/services/agenda/agendamento.service';
import { AgendamentoResponse } from '@/lib/types/agenda/agendamento.type';

interface UseAgendamentosSemanaReturn {
    agendamentos: AgendamentoResponse[];
    loading: boolean;
    error: string | null;
    weekStart: Date;
    weekEnd: Date;
    carregarAgendamentos: () => Promise<void>;
    setWeekStart: (date: Date) => void;
    totalAgendamentos: number;
    agendamentosPorDia: Record<string, AgendamentoResponse[]>;
}

export const useAgendamentosSemana = (
    dentistaId: number,
    initialDate?: Date
): UseAgendamentosSemanaReturn => {
    const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [weekStart, setWeekStart] = useState<Date>(
        initialDate ? startOfWeek(initialDate, { weekStartsOn: 1 }) : startOfWeek(new Date(), { weekStartsOn: 1 })
    );
    const [weekEnd, setWeekEnd] = useState<Date>(endOfWeek(weekStart, { weekStartsOn: 1 }));

    const carregarAgendamentos = useCallback(async () => {
        if (!dentistaId) {
            setAgendamentos([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const dataInicio = format(weekStart, 'yyyy-MM-dd');
            const dataFim = format(weekEnd, 'yyyy-MM-dd');

            // Buscar todos os agendamentos do dentista
            const todosAgendamentos = await agendamentoService.listarPorDentista(dentistaId);

            // Filtrar apenas os que estão dentro da semana atual
            const agendamentosDaSemana = todosAgendamentos.filter(ag => {
                const dataAgendamento = new Date(ag.dataConsulta);
                return isWithinInterval(dataAgendamento, {
                    start: weekStart,
                    end: weekEnd
                });
            });

            setAgendamentos(agendamentosDaSemana);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao carregar agendamentos da semana';
            setError(errorMessage);
            console.error('Erro ao carregar agendamentos da semana:', err);
        } finally {
            setLoading(false);
        }
    }, [dentistaId, weekStart, weekEnd]);

    // Atualizar weekEnd quando weekStart mudar
    useEffect(() => {
        setWeekEnd(endOfWeek(weekStart, { weekStartsOn: 1 }));
    }, [weekStart]);

    useEffect(() => {
        carregarAgendamentos();
    }, [carregarAgendamentos]);

    // Agrupar agendamentos por dia
    const agendamentosPorDia = agendamentos.reduce((acc, ag) => {
        const data = ag.dataConsulta;
        if (!acc[data]) {
            acc[data] = [];
        }
        acc[data].push(ag);
        return acc;
    }, {} as Record<string, AgendamentoResponse[]>);

    const handleWeekChange = (date: Date) => {
        const newWeekStart = startOfWeek(date, { weekStartsOn: 1 });
        setWeekStart(newWeekStart);
    };

    return {
        agendamentos,
        loading,
        error,
        weekStart,
        weekEnd,
        carregarAgendamentos,
        setWeekStart: handleWeekChange,
        totalAgendamentos: agendamentos.length,
        agendamentosPorDia
    };
};