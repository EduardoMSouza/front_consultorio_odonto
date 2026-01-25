"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui-shadcn/card"
import { format, addDays, subDays, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAgendamentosDia } from "@/lib/hooks/agenda/useAgendamentoDia"
import { AgendamentoResponse, StatusAgendamento } from "@/lib/types/agenda/agendamento.type"
import {
    AgendamentoCancelamentoModal,
    AgendamentoDetalhesModal,
    AgendamentoFormModal
} from "@/components/core/agenda/modals"
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { AgendaHeader } from './components/AgendaHeader'
import './AgendaFullCalendarDay.css'

interface AgendaFullCalendarDayProps {
    dentistaId: number
    initialDate?: Date
    onViewChange?: (view: 'day' | 'week' | 'month') => void
}

const STATUS_CONFIG = {
    [StatusAgendamento.AGENDADO]: {
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        icon: '📅'
    },
    [StatusAgendamento.CONFIRMADO]: {
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        icon: '✅'
    },
    [StatusAgendamento.EM_ATENDIMENTO]: {
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        icon: '🦷'
    },
    [StatusAgendamento.CONCLUIDO]: {
        color: '#22c55e',
        gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        icon: '🏁'
    },
    [StatusAgendamento.CANCELADO]: {
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        icon: '❌'
    },
    [StatusAgendamento.FALTA]: {
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        icon: '⏰'
    },
}

export function AgendaFullCalendarDay({ dentistaId, initialDate, onViewChange }: AgendaFullCalendarDayProps) {
    const calendarRef = useRef<FullCalendar>(null)

    const {
        agendamentos,
        loading,
        selectedDate,
        setSelectedDate,
        totalAgendamentos,
        carregarAgendamentos
    } = useAgendamentosDia(dentistaId, initialDate)

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

    // Filtrar agendamentos
    const agendamentosFiltrados = agendamentos.filter(ag =>
        filters.status.includes(ag.status)
    )

    // Sincronizar calendário quando selectedDate mudar
    useEffect(() => {
        const calendarApi = calendarRef.current?.getApi()
        if (calendarApi && selectedDate) {
            calendarApi.gotoDate(selectedDate)
        }
    }, [selectedDate])

    const events = agendamentosFiltrados.map(ag => {
        const config = STATUS_CONFIG[ag.status] || STATUS_CONFIG[StatusAgendamento.AGENDADO]

        return {
            id: ag.id.toString(),
            title: ag.nomePaciente,
            start: `${ag.dataConsulta}T${ag.horaInicio}`,
            end: `${ag.dataConsulta}T${ag.horaFim}`,
            backgroundColor: config.color,
            borderColor: config.color,
            extendedProps: {
                agendamento: ag,
                statusConfig: config
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

    const handlePrevDay = () => {
        const prevDay = subDays(selectedDate, 1)
        setSelectedDate(prevDay)
    }

    const handleNextDay = () => {
        const nextDay = addDays(selectedDate, 1)
        setSelectedDate(nextDay)
    }

    const handleToday = () => {
        const today = new Date()
        setSelectedDate(today)
    }

    const handleDetalhesSuccess = () => {
        carregarAgendamentos()
        setDetalhesModal({ open: false, agendamento: null })
    }

    const handleFormSuccess = () => {
        carregarAgendamentos()
    }

    const handleCancelamentoSuccess = () => {
        carregarAgendamentos()
    }

    const handleFilterChange = (newFilters: {
        status: string[]
        procedimentos: string[]
        dentistas: string[]
    }) => {
        setFilters(newFilters)
    }

    // Carregar agendamentos quando selectedDate mudar
    useEffect(() => {
        carregarAgendamentos()
    }, [selectedDate])

    if (loading && agendamentos.length === 0) {
        return (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm rounded-2xl overflow-hidden">
                <AgendaHeader
                    view="day"
                    currentDate={selectedDate}
                    onPrev={handlePrevDay}
                    onNext={handleNextDay}
                    onToday={handleToday}
                    onViewChange={onViewChange}
                    totalAgendamentos={0}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                <CardContent className="flex justify-center items-center py-16">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 relative z-10"></div>
                        </div>
                        <p className="text-gray-600 font-medium">Carregando agendamentos...</p>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                <AgendaHeader
                    view="day"
                    currentDate={selectedDate}
                    onPrev={handlePrevDay}
                    onNext={handleNextDay}
                    onToday={handleToday}
                    onViewChange={onViewChange}
                    totalAgendamentos={agendamentosFiltrados.length}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                <CardContent className="p-0">
                    <div className="calendar-premium-container">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[timeGridPlugin, interactionPlugin]}
                            initialView="timeGridDay"
                            initialDate={selectedDate}
                            locale={ptBrLocale}
                            headerToolbar={false}
                            height="auto"
                            contentHeight="auto"
                            slotMinTime="08:00:00"
                            slotMaxTime="20:00:00"
                            slotDuration="00:30:00"
                            slotLabelInterval="01:00"
                            slotLabelFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            }}
                            allDaySlot={false}
                            events={events}
                            eventClick={handleEventClick}
                            dateClick={handleDateClick}
                            selectable={true}
                            nowIndicator={true}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            }}
                            eventDisplay="block"
                            dayMaxEvents={true}
                            slotEventOverlap={false}
                            expandRows={true}
                            businessHours={{
                                daysOfWeek: [1, 2, 3, 4, 5, 6],
                                startTime: '09:00',
                                endTime: '20:00'
                            }}
                            slotLabelContent={(arg) => {
                                const hour = arg.date.getHours()
                                const timeIcon = {
                                    8: { icon: '🌅', label: 'Início do dia' },
                                    9: { icon: '☕', label: 'Primeira consulta' },
                                    12: { icon: '🍽️', label: 'Almoço' },
                                    14: { icon: '🔄', label: 'Retorno' },
                                    16: { icon: '☕', label: 'Intervalo' },
                                    18: { icon: '🌆', label: 'Final do dia' },
                                    19: { icon: '🌙', label: 'Últimas consultas' }
                                }[hour] || { icon: '', label: '' }

                                return {
                                    html: `<div class="time-slot-premium">
                                        <div class="time-icon-container">${timeIcon.icon}</div>
                                        <div class="time-text-container">
                                            <div class="time-hour">${arg.text}</div>
                                            ${timeIcon.label ? `<div class="time-label">${timeIcon.label}</div>` : ''}
                                        </div>
                                    </div>`
                                }
                            }}
                            eventContent={(eventInfo) => {
                                const agendamento = eventInfo.event.extendedProps.agendamento as AgendamentoResponse
                                const statusConfig = eventInfo.event.extendedProps.statusConfig
                                const start = format(new Date(eventInfo.event.start!), 'HH:mm')
                                const end = format(new Date(eventInfo.event.end!), 'HH:mm')

                                return {
                                    html: `<div class="event-card" style="background: ${statusConfig.gradient}">
                                        <div class="event-header">
                                            <div class="event-status-icon">${statusConfig.icon}</div>
                                            <div class="event-time-range">${start} - ${end}</div>
                                        </div>
                                        <div class="event-body">
                                            <div class="patient-info">
                                                <div class="patient-name">${agendamento.nomePaciente}</div>
                                                ${agendamento.tipoProcedimento ?
                                        `<div class="procedure-type">${agendamento.tipoProcedimento}</div>` :
                                        ''
                                    }
                                            </div>
                                        </div>
                                        <div class="event-footer">
                                            <div class="duration">${Math.round((new Date(eventInfo.event.end!).getTime() - new Date(eventInfo.event.start!).getTime()) / 60000)} min</div>
                                            <div class="event-hover">Clique para detalhes →</div>
                                        </div>
                                    </div>`
                                }
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            <AgendamentoDetalhesModal
                agendamento={detalhesModal.agendamento}
                open={detalhesModal.open}
                onClose={() => setDetalhesModal({ open: false, agendamento: null })}
                onSuccess={handleDetalhesSuccess}
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
