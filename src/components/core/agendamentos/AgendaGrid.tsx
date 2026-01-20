"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Clock, User, Phone, FileText, Loader2 } from "lucide-react"
import { AgendaDialog } from "./AgendaDialog"
import { useAgendamento } from "@/service/useAgendamento"
import {
    StatusAgendamento,
    getTipoProcedimentoLabel,
    AgendamentoResumoResponse
} from "@/models/agendamento.model"

// Atualizei a prop para receber o ID, pois a API trabalha com IDs numéricos
interface AgendaGridProps {
    baseDate: Date
    dentistaId?: number | null // null ou undefined significa "Todos"
}

export function AgendaGrid({ baseDate, dentistaId }: AgendaGridProps) {
    const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null)
    const [consultasDaSemana, setConsultasDaSemana] = useState<AgendamentoResumoResponse[]>([])

    // Hook personalizado que já criamos anteriormente
    const {
        listarPorPeriodo,
        loading
    } = useAgendamento()

    // Constantes de Estrutura da Grid
    const diasLabel = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
    // Definindo o range de horários (Isso geralmente é fixo na UI, ou poderia vir de uma config da clínica)
    const horasGrid = [
        "07:00", "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00", "15:00", "16:00",
        "17:00", "18:00",
    ]

    // ==========================================
    // 1. Cálculos de Data e Semana
    // ==========================================

    // Formata Date para YYYY-MM-DD (Padrão da API Java LocalDate)
    const formatDateForApi = (date: Date): string => {
        return date.toISOString().split('T')[0]
    }

    // Calcula os dias da semana baseados na baseDate
    const semana = useMemo(() => {
        const days: Date[] = []
        const current = new Date(baseDate)
        // Ajusta para o início da semana (Segunda-feira = 1, Domingo = 0 no JS)
        const dayOfWeek = current.getDay()
        const diffToMonday = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)

        const monday = new Date(current.setDate(diffToMonday))

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday)
            d.setDate(monday.getDate() + i)
            days.push(d)
        }
        return days
    }, [baseDate])

    // ==========================================
    // 2. Busca de Dados
    // ==========================================

    const fetchAgendamentos = useCallback(async () => {
        if (!semana.length) return

        const inicio = formatDateForApi(semana[0]) // Segunda
        const fim = formatDateForApi(semana[6])    // Domingo

        try {
            // Usamos listarPorPeriodo para pegar TUDO de uma vez (mais eficiente que 7 chamadas)
            // O serviço retorna PageResponse.type.ts, pegamos o .content
            // Precisamos acessar o serviço diretamente ou ajustar o hook para retornar os dados
            // Como o hook no exemplo original retorna void e atualiza um estado interno,
            // vamos supor que precisamos acessar o serviço ou que o hook foi ajustado.
            // *Ajuste base*: O hook `listarPorPeriodo` atualiza o estado `agendamentos` interno do hook.
            // Mas aqui queremos controlar o estado local para grid.
            // Vou assumir que o `useAgendamento` expõe o serviço ou retorna Promise com dados
            // Caso contrário, usamos o método do service importado diretamente, mas vamos tentar via hook.

            // Nota: No código fornecido do `useAgendamento`, `listarPorPeriodo` retorna void e atualiza state `agendamentos`.
            // Para flexibilidade, vou instanciar o service aqui ou assumir que o hook expõe os dados.
            // Vou usar o `agendamentoService` importado diretamente para ter controle total do retorno
            // JÁ QUE o hook `useAgendamento` foi desenhado para gerenciar uma lista paginada global.

            // *Melhor Abordagem*: Usar o service diretamente para popular esta view específica
            const { agendamentoService } = require("@/services/agendamento.service") // Import dinâmico ou no topo
            const response = await agendamentoService.listarPorPeriodo(inicio, fim, { size: 1000 }) // Size grande para pegar tudo

            setConsultasDaSemana(response.content)

        } catch (error) {
            console.error("Erro ao carregar agenda:", error)
        }
    }, [semana])

    useEffect(() => {
        fetchAgendamentos()
    }, [fetchAgendamentos, dentistaId]) // Recarrega se mudar a semana ou o filtro

    // ==========================================
    // 3. Helpers de Renderização
    // ==========================================

    const getConsultaNoSlot = useCallback((dia: Date, hora: string) => {
        const dataStr = formatDateForApi(dia)

        return consultasDaSemana.find(consulta => {
            // Filtro de dentista (client-side para performance na navegação)
            if (dentistaId && consulta.dentistaId !== dentistaId) return false

            // Comparação de data
            if (consulta.dataConsulta !== dataStr) return false

            // Comparação de hora (API pode mandar '08:00:00', normalizamos para '08:00')
            const horaApi = consulta.horaInicio.substring(0, 5)
            return horaApi === hora
        })
    }, [consultasDaSemana, dentistaId])

    const getStatusGradient = (status: StatusAgendamento) => {
        switch (status) {
            case StatusAgendamento.CONFIRMADO: return "from-emerald-400 to-green-500"
            case StatusAgendamento.AGENDADO: return "from-blue-400 to-indigo-500"
            case StatusAgendamento.EM_ATENDIMENTO: return "from-violet-400 to-purple-500"
            case StatusAgendamento.CONCLUIDO: return "from-slate-400 to-gray-500"
            case StatusAgendamento.CANCELADO: return "from-rose-400 to-red-500"
            case StatusAgendamento.FALTOU: return "from-amber-400 to-orange-500"
            case StatusAgendamento.REAGENDADO: return "from-yellow-400 to-amber-500"
            default: return "from-blue-400 to-indigo-500"
        }
    }

    const handleSlotClick = (dia: Date, hora: string) => {
        // Bloqueia clique no domingo se a clínica não abre
        if (dia.getDay() === 0) return
        setSelectedSlot({ date: dia, time: hora })
    }

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    // ==========================================
    // 4. Renderização
    // ==========================================

    return (
        <>
            {loading ? (
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-sm text-indigo-600 font-medium">Sincronizando agenda...</p>
                </div>
            ) : (
                <motion.div
                    className="rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-100/50 overflow-hidden bg-white/80 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            {/* Grid Layout: Coluna de Horas + 7 Colunas de Dias */}
                            <div className="grid grid-cols-[80px_repeat(7,minmax(130px,1fr))] border-t border-indigo-100">

                                {/* Coluna Lateral: Horários */}
                                <div className="bg-slate-50/80 backdrop-blur-sm sticky left-0 z-20 border-r border-indigo-100">
                                    <div className="h-20 border-b border-indigo-200 flex items-center justify-center bg-white/50">
                                        <Clock className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    {horasGrid.map((h, i) => (
                                        <div
                                            key={i}
                                            className="h-24 border-b border-indigo-50 text-xs font-semibold text-slate-500 flex items-center justify-center"
                                        >
                                            {h}
                                        </div>
                                    ))}
                                </div>

                                {/* Colunas: Dias da Semana */}
                                {semana.map((dia, diaIdx) => {
                                    const isDomingo = dia.getDay() === 0
                                    const isHoje = dia.toDateString() === hoje.toDateString()
                                    const diaLabel = diasLabel[dia.getDay() === 0 ? 6 : dia.getDay() - 1]
                                    const diaNum = String(dia.getDate()).padStart(2, "0")

                                    return (
                                        <motion.div
                                            key={diaIdx}
                                            className={cn(
                                                "border-r border-indigo-50 min-w-[130px] transition-colors",
                                                isDomingo ? "bg-red-50/30" : "bg-white",
                                                isHoje && "bg-indigo-50/30"
                                            )}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: diaIdx * 0.03 }}
                                        >
                                            {/* Cabeçalho do Dia */}
                                            <div
                                                className={cn(
                                                    "sticky top-0 z-10 h-20 flex flex-col items-center justify-center gap-1 border-b border-indigo-200 backdrop-blur-md transition-colors",
                                                    isHoje ? "bg-indigo-600 text-white shadow-md" : "bg-white/90 text-slate-700",
                                                    isDomingo && !isHoje && "bg-red-50 text-red-400"
                                                )}
                                            >
                                                <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                                                    {diaLabel}
                                                </span>
                                                <span className="text-xl font-bold">{diaNum}</span>
                                                {isHoje && (
                                                    <span className="text-[10px] bg-white/20 px-2 rounded-full font-medium">
                                                        Hoje
                                                    </span>
                                                )}
                                            </div>

                                            {/* Slots de Horário */}
                                            {horasGrid.map((hora, horaIdx) => {
                                                const consulta = getConsultaNoSlot(dia, hora)
                                                // Definindo intervalo de almoço visualmente (opcional)
                                                const isAlmoco = hora === "12:00"

                                                if (isDomingo) {
                                                    return (
                                                        <div key={horaIdx} className="h-24 border-b border-red-50 bg-red-50/20" />
                                                    )
                                                }

                                                // --- Slot com Agendamento ---
                                                if (consulta) {
                                                    const isCancelado = consulta.status === StatusAgendamento.CANCELADO

                                                    return (
                                                        <motion.div
                                                            key={horaIdx}
                                                            layoutId={`agendamento-${consulta.id}`}
                                                            className={cn(
                                                                "h-24 border-b border-white p-1 relative group cursor-pointer",
                                                            )}
                                                            onClick={() => !isCancelado && handleSlotClick(dia, hora)}
                                                        >
                                                            <div className={cn(
                                                                "w-full h-full rounded-lg p-2 shadow-sm text-white flex flex-col justify-between overflow-hidden relative transition-all",
                                                                "bg-gradient-to-br hover:shadow-md hover:scale-[1.02]",
                                                                getStatusGradient(consulta.status),
                                                                isCancelado && "opacity-60 grayscale-[0.5]"
                                                            )}>
                                                                {/* Conteúdo do Card */}
                                                                <div className="z-10 relative">
                                                                    <div className="flex items-center gap-1.5 mb-1">
                                                                        <User className="w-3 h-3 opacity-80" />
                                                                        <span className="text-xs font-bold truncate">
                                                                            {consulta.pacienteNome.split(' ')[0]}
                                                                        </span>
                                                                    </div>

                                                                    {consulta.tipoProcedimento && (
                                                                        <div className="flex items-center gap-1.5 text-[10px] opacity-90">
                                                                            <FileText className="w-2.5 h-2.5" />
                                                                            <span className="truncate">
                                                                                {getTipoProcedimentoLabel(consulta.tipoProcedimento)}
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {/* Exibir dentista se estiver vendo "Todos" */}
                                                                    {!dentistaId && (
                                                                        <div className="mt-1 text-[9px] bg-black/10 w-fit px-1.5 py-0.5 rounded text-white/90 truncate">
                                                                            {consulta.dentistaNome.split(' ')[0]}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Status Icon / Hora */}
                                                                <div className="flex justify-between items-end z-10 relative">
                                                                    <span className="text-[10px] font-medium opacity-80 bg-black/20 px-1.5 rounded">
                                                                        {hora}
                                                                    </span>
                                                                </div>

                                                                {/* Linha de Cancelado */}
                                                                {isCancelado && (
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <div className="w-full h-0.5 bg-white/60 -rotate-12" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )
                                                }

                                                // --- Slot Vazio (Disponível) ---
                                                return (
                                                    <motion.div
                                                        key={horaIdx}
                                                        className={cn(
                                                            "h-24 border-b border-indigo-50 relative group cursor-pointer transition-all",
                                                            "hover:bg-indigo-50/50",
                                                            isAlmoco && "bg-slate-50/50" // Visual diferente pro almoço
                                                        )}
                                                        onClick={() => handleSlotClick(dia, hora)}
                                                    >
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="bg-indigo-600/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium transform scale-90 group-hover:scale-100 transition-transform">
                                                                + Agendar
                                                            </div>
                                                        </div>

                                                        {isAlmoco && (
                                                            <div className="absolute top-2 right-2 opacity-20">
                                                                <Clock className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )
                                            })}
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Dialog de Criação mantido, agora passando callback de sucesso para refresh */}
            <AgendaDialog
                selected={selectedSlot}
                onClose={() => setSelectedSlot(null)}
                onSubmitSuccess={() => {
                    fetchAgendamentos() // Recarrega dados após salvar
                    setSelectedSlot(null)
                }}
            />
        </>
    )
}