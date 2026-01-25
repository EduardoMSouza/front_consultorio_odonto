// components/core/agenda/modals/types.ts
import { AgendamentoResponse, AgendamentoRequest } from "@/lib/types/agenda/agendamento.type";

export interface DetalhesModalProps {
    agendamento: AgendamentoResponse | null;
    open: boolean;
    onClose: () => void;
}

export interface FormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    agendamento?: AgendamentoResponse;
    dentistaId: number;
    initialData?: {
        horario: string;
        data: Date;
    };
}

export interface CancelamentoModalProps {
    agendamento: AgendamentoResponse | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}