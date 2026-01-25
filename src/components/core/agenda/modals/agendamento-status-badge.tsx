"use client"

import { Badge } from "@/components/ui-shadcn/badge"
import {StatusAgendamento} from "@/lib/types/agenda/agendamento.type";


interface AgendamentoStatusBadgeProps {
    status: StatusAgendamento
}

const statusConfig: Record<
    StatusAgendamento,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
    [StatusAgendamento.AGENDADO]: {
        label: "Agendado", 
        variant: "secondary", 
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200" 
    },
    [StatusAgendamento.CONFIRMADO]: {
        label: "Confirmado", 
        variant: "default", 
        className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" 
    },
    [StatusAgendamento.EM_ATENDIMENTO]: {
        label: "Em Atendimento",
        variant: "default",
        className: "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200",
    },
    [StatusAgendamento.CONCLUIDO]: {
        label: "Concluído", 
        variant: "default", 
        className: "bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200" 
    },
    [StatusAgendamento.CANCELADO]: {
        label: "Cancelado", 
        variant: "destructive", 
        className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200" 
    },
    [StatusAgendamento.FALTA]: {
        label: "Falta",
        variant: "destructive",
        className: "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200"
    },
}

export function AgendamentoStatusBadge({ status }: AgendamentoStatusBadgeProps) {
    const config = statusConfig[status]
    return (
        <Badge variant={config.variant} className={config.className}>
            {config.label}
        </Badge>
    )
}
