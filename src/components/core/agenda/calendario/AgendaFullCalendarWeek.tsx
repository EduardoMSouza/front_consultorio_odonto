
"use client"

import { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { Card, CardContent } from "@/components/ui-shadcn/card"
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAgendamentosSemana } from "@/lib/hooks/agenda/useAgendamentosSemana"
import { AgendamentoResponse, StatusAgendamento } from "@/lib/types/agenda/agendamento.type"
import { toast } from "sonner"
import {
    AgendamentoCancelamentoModal,
    AgendamentoDetalhesModal,
    AgendamentoFormModal
} from "@/components/core/agenda/modals"
import { AgendaHeader } from './components/AgendaHeader'
import './AgendaFullCalendarWeek.css'

interface AgendaFullCalendarWeekProps {
    dentistaId: number
    initialDate?: Date
    onViewChange?: (view: 'day' | 'week' | 'month') => void
}

const STATUS_COLORS = {
    [StatusAgendamento.AGENDADO]: { bg: '#3b82f6', border: '#2563eb', text: '#ffffff' },
    [StatusAgendamento.CONFIRMADO]: { bg: '#10b981', border: '#059669', text: '#ffffff' },
    [StatusAgendamento.EM_ATENDIMENTO]: { bg: '#8b5cf6', border: '#7c3aed', text: '#ffffff' },
    [StatusAgendamento.CONCLUIDO]: { bg: '#22c55e', border: '#16a34a', text: '#ffffff' },
    [StatusAgendamento.CANCELADO]: { bg: '#ef4444', border: '#dc2626', text: '#ffffff' },
    [StatusAgendamento.FALTA]: { bg: '#f59e0b', border: '#d97706', text: '#ffffff' },
}

export function AgendaFullCalendarWeek({ dentistaId, initialDate, onViewChange }: AgendaFullCalendarWeekProps) {
    const calendarRef = useRef<FullCalendar>(null)

    const {
        agendamentos,
        loading,
        weekStart,
        carregarAgendamentos,
        setWeekStart,
        totalAgendamentos
    } = useAgendamentosSemana(dentistaId, initialDate)

    // Filtros
    const [filters, setFilters] = useState<{
        status: string[]
        procedimentos: string[]
        dentistas: string[]
    }>({
        status: ['AGENDADO', 'CONFIRMADO', 'EM_ATENDIMENTO'],
        procedimentos: [],
        dentistas: []
    })

    // Estados dos modais
    const [detalhesModal, setDetalhesModal] = useState<{
        open: boolean
        agendamento: AgendamentoResponse | null
    }>({ open: false, agendamento: null })

    const [formModal, setFormModal] = useState<{
        open: boolean
        agendamento?: AgendamentoResponse
        initialData?: { horario: string; data: Date }
    }>({ open: false })

    const [cancelamentoModal, setCancelamentoModal] = useState<{
        open: boolean
        agendamento: AgendamentoResponse | null
    }>({ open: false, agendamento: null })

    // Filtrar agendamentos por status
    const agendamentosFiltrados = agendamentos.filter(ag =>
        filters.status.includes(ag.status)
    )

    // Converter agendamentos para eventos do FullCalendar
    const events = agendamentosFiltrados.map(ag => {
        const colors = STATUS_COLORS[ag.status] || STATUS_COLORS[StatusAgendamento.AGENDADO]

        return {
            id: ag.id.toString(),
            title: ag.nomePaciente,
            start: `${ag.dataConsulta}T${ag.horaInicio}`,
            end: `${ag.dataConsulta}T${ag.horaFim}`,
            backgroundColor: colors.bg,
            borderColor: colors.border,
            textColor: colors.text,
            extendedProps: {
                agendamento: ag,
                tipoProcedimento: ag.tipoProcedimento,
                status: ag.status
            }
        }
    })

    const handleEventClick = (info: any) => {
        const agendamento = info.event.extendedProps.agendamento as AgendamentoResponse
        setDetalhesModal({ open: true, agendamento })
    }

    const handleDateClick = (info: any) => {
        const data = new Date(info.date)
        const horario = format(data, 'HH:mm')

        setFormModal({
            open: true,
            initialData: { horario, data }
        })
    }

    const handleFormSuccess = () => {
        carregarAgendamentos()
        toast.success('Agendamento salvo com sucesso!')
    }

    const handleCancelamentoSuccess = () => {
        carregarAgendamentos()
    }

    const goToToday = () => {
        const today = new Date()
        const weekStartToday = startOfWeek(today, { weekStartsOn: 1 })
        setWeekStart(weekStartToday)
        const calendarApi = calendarRef.current?.getApi()
        if (calendarApi) {
            calendarApi.gotoDate(today)
        }
    }

    const goToPrev = () => {
        const prevWeek = subWeeks(weekStart, 1)
        setWeekStart(prevWeek)
        const calendarApi = calendarRef.current?.getApi()
        if (calendarApi) {
            calendarApi.prev()
        }
    }

    const goToNext = () => {
        const nextWeek = addWeeks(weekStart, 1)
        setWeekStart(nextWeek)
        const calendarApi = calendarRef.current?.getApi()
        if (calendarApi) {
            calendarApi.next()
        }
    }

    const handleFilterChange = (newFilters: {
        status: string[]
        procedimentos: string[]
        dentistas: string[]
    }) => {
        setFilters(newFilters)
    }

    // Atualizar calendário quando weekStart mudar
    useEffect(() => {
        const calendarApi = calendarRef.current?.getApi()
        if (calendarApi && weekStart) {
            calendarApi.gotoDate(weekStart)
        }
    }, [weekStart])

    if (loading && agendamentos.length === 0) {
        return (
            <Card className="border-0 shadow-sm">
                <AgendaHeader
                    view="week"
                    currentDate={weekStart}
                    onPrev={goToPrev}
                    onNext={goToNext}
                    onToday={goToToday}
                    onViewChange={onViewChange}
                    totalAgendamentos={0}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                <CardContent className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-muted-foreground"></div>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card className="border-0 shadow-sm">
                <AgendaHeader
                    view="week"
                    currentDate={weekStart}
                    onPrev={goToPrev}
                    onNext={goToNext}
                    onToday={goToToday}
                    onViewChange={onViewChange}
                    totalAgendamentos={agendamentosFiltrados.length}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                <CardContent className="p-4">
                    <div className="agenda-week-container">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            initialDate={weekStart}
                            locale={ptBrLocale}
                            headerToolbar={false}
                            height="auto"
                            slotMinTime="08:00:00"
                            slotMaxTime="21:00:00"
                            slotDuration="00:30:00"
                            slotLabelInterval="01:00"
                            slotLabelFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            }}
                            allDaySlot={false}
                            weekends={true}
                            firstDay={1}
                            dayHeaderFormat={{
                                weekday: 'short',
                                day: 'numeric',
                                month: 'numeric'
                            }}
                            events={events}
                            eventClick={handleEventClick}
                            dateClick={handleDateClick}
                            selectable={true}
                            selectMirror={true}
                            nowIndicator={true}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            }}
                            businessHours={[
                                {
                                    daysOfWeek: [1, 2, 3, 4, 5],
                                    startTime: '09:00',
                                    endTime: '20:30'
                                },
                                {
                                    daysOfWeek: [6],
                                    startTime: '08:00',
                                    endTime: '11:30'
                                }
                            ]}
                            hiddenDays={[0]}
                            eventContent={(arg) => {
                                const { agendamento, tipoProcedimento } = arg.event.extendedProps
                                return (
                                    <div className="fc-event-main-frame p-1">
                                        <div className="fc-event-time font-semibold">
                                            {arg.timeText}
                                        </div>
                                        <div className="fc-event-title font-bold truncate">
                                            {arg.event.title}
                                        </div>
                                        {tipoProcedimento && (
                                            <div className="text-xs opacity-90 truncate mt-0.5">
                                                {tipoProcedimento}
                                            </div>
                                        )}
                                    </div>
                                )
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Modais */}
            <AgendamentoDetalhesModal
                agendamento={detalhesModal.agendamento}
                open={detalhesModal.open}
                onClose={() => setDetalhesModal({ open: false, agendamento: null })}
            />

            <AgendamentoFormModal
                open={formModal.open}
                onClose={() => setFormModal({ open: false })}
                onSuccess={handleFormSuccess}
                agendamento={formModal.agendamento}
                dentistaId={dentistaId}
                initialData={formModal.initialData}
            />

            <AgendamentoCancelamentoModal
                agendamento={cancelamentoModal.agendamento}
                open={cancelamentoModal.open}
                onClose={() => setCancelamentoModal({ open: false, agendamento: null })}
                onSuccess={handleCancelamentoSuccess}
            />
        </>
    )
}
