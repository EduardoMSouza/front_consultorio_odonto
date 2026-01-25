"use client"

import { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-shadcn/card"
import { Button } from "@/components/ui-shadcn/button"
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { agendamentoService } from '@/lib/services/agenda/agendamento.service'
import { useAuth } from "@/lib/contexts/AuthContext"
import { AgendamentoResponse, StatusAgendamento } from "@/lib/types/agenda/agendamento.type"
import {
    AgendamentoCancelamentoModal,
    AgendamentoDetalhesModal,
    AgendamentoFormModal
} from "@/components/core/agenda/modals"
import './AgendaFullCalendarMonth.css'

interface AgendaFullCalendarMonthProps {
    dentistaId: number
    initialDate?: Date
    onDayClick?: (date: Date) => void
}

export function AgendaFullCalendarMonth({
                                            dentistaId,
                                            initialDate,
                                            onDayClick
                                        }: AgendaFullCalendarMonthProps) {
    const calendarRef = useRef<FullCalendar>(null)
    const { user } = useAuth()

    const [currentMonth, setCurrentMonth] = useState(initialDate || new Date())
    const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([])
    const [loading, setLoading] = useState(false)

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

    // Carregar agendamentos do mês
    useEffect(() => {
        carregarAgendamentosMes()
    }, [currentMonth, dentistaId])

    const carregarAgendamentosMes = async () => {
        setLoading(true)
        try {
            const inicio = startOfMonth(currentMonth)
            const fim = endOfMonth(currentMonth)

            const dataInicio = format(inicio, 'yyyy-MM-dd')
            const dataFim = format(fim, 'yyyy-MM-dd')

            const dados = await agendamentoService.listarPorPeriodo(dataInicio, dataFim)

            // Filtrar apenas agendamentos do dentista
            const agendamentosDoDentista = dados.filter(
                (ag: AgendamentoResponse) => ag.dentistaId === dentistaId
            )

            setAgendamentos(agendamentosDoDentista)
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error)
            setAgendamentos([])
        } finally {
            setLoading(false)
        }
    }

    // Converter agendamentos para eventos do FullCalendar
    const events = agendamentos.map(ag => {
        const statusColors = {
            [StatusAgendamento.AGENDADO]: '#3b82f6',
            [StatusAgendamento.CONFIRMADO]: '#10b981',
            [StatusAgendamento.EM_ATENDIMENTO]: '#8b5cf6',
            [StatusAgendamento.CONCLUIDO]: '#22c55e',
            [StatusAgendamento.CANCELADO]: '#ef4444',
            [StatusAgendamento.FALTA]: '#f59e0b',
        }

        return {
            id: ag.id.toString(),
            title: `${ag.horaInicio} - ${ag.nomePaciente}`,
            start: ag.dataConsulta,
            backgroundColor: statusColors[ag.status] || '#3b82f6',
            borderColor: statusColors[ag.status] || '#3b82f6',
            textColor: '#ffffff',
            extendedProps: {
                agendamento: ag
            }
        }
    })

    const handleEventClick = (info: any) => {
        const agendamento = info.event.extendedProps.agendamento as AgendamentoResponse
        setDetalhesModal({ open: true, agendamento })
    }

    const handleDateClick = (info: any) => {
        const data = new Date(info.date)

        // Se onDayClick foi fornecido, usar para navegar para visualização diária
        if (onDayClick) {
            onDayClick(data)
        } else {
            // Caso contrário, abrir modal para novo agendamento
            setFormModal({
                open: true,
                initialData: { horario: '09:00', data }
            })
        }
    }

    const handleFormSuccess = () => {
        carregarAgendamentosMes()
    }

    const handleCancelamentoSuccess = () => {
        carregarAgendamentosMes()
    }

    const goToToday = () => {
        const today = new Date()
        setCurrentMonth(today)
        const calendarApi = calendarRef.current?.getApi()
        if (calendarApi) {
            calendarApi.gotoDate(today)
        }
    }

    const goToPrev = () => {
        const prevMonth = subMonths(currentMonth, 1)
        setCurrentMonth(prevMonth)
        const calendarApi = calendarRef.current?.getApi()
        if (calendarApi) {
            calendarApi.prev()
        }
    }

    const goToNext = () => {
        const nextMonth = addMonths(currentMonth, 1)
        setCurrentMonth(nextMonth)
        const calendarApi = calendarRef.current?.getApi()
        if (calendarApi) {
            calendarApi.next()
        }
    }

    if (loading && agendamentos.length === 0) {
        return (
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Agenda Mensal
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                ({agendamentos.length} agendamento{agendamentos.length !== 1 ? "s" : ""})
                            </span>
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={goToToday} className="h-8 px-3">
                                Hoje
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToPrev}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToNext}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        initialDate={currentMonth}
                        locale={ptBrLocale}
                        headerToolbar={false}
                        height="auto"
                        firstDay={0}
                        dayMaxEvents={3}
                        moreLinkText="mais"
                        events={events}
                        eventClick={handleEventClick}
                        dateClick={handleDateClick}
                        dayHeaderFormat={{
                            weekday: 'short'
                        }}
                        fixedWeekCount={false}
                        showNonCurrentDates={true}
                    />
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