// components/agendamentos/AgendamentoItem.tsx
import { Button } from "@/components/ui-shadcn/button";
import { Badge } from "@/components/ui-shadcn/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui-shadcn/dropdown-menu";
import { CheckCircle, Clock, Phone } from "lucide-react";
import {
    AgendamentoResumoResponse,
    StatusAgendamento,
    formatHorarioConsulta,
    getTipoProcedimentoLabel,
    getStatusColor,
    getStatusLabel,
} from "@/models/agendamento.model";

interface AgendamentoItemProps {
    agendamento: AgendamentoResumoResponse;
    loading: boolean;
    handleConfirmar: (id: number) => void;
    handleIniciarAtendimento: (id: number) => void;
    handleConcluir: (id: number) => void;
    handleMarcarFalta: (id: number) => void;
    setSelectedAgendamentoId: (id: number | null) => void;
    setShowCancelDialog: (show: boolean) => void;
}

// Função auxiliar para renderizar o Badge de status
const getStatusBadge = (status: StatusAgendamento) => {
    const color = getStatusColor(status);

    const colorMap: Record<string, string> = {
        blue: "bg-blue-100 text-blue-800 border-blue-200",
        green: "bg-green-100 text-green-800 border-green-200",
        purple: "bg-purple-100 text-purple-800 border-purple-200",
        gray: "bg-gray-100 text-gray-800 border-gray-200",
        red: "bg-red-100 text-red-800 border-red-200",
        orange: "bg-orange-100 text-orange-800 border-orange-200",
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
        <Badge
            variant="outline"
            className={`${colorMap[color] || "bg-gray-100 text-gray-800 border-gray-200"} text-xs`}
        >
            {getStatusLabel(status)}
        </Badge>
    );
};

export function AgendamentoItem({
                                    agendamento,
                                    loading,
                                    handleConfirmar,
                                    handleIniciarAtendimento,
                                    handleConcluir,
                                    handleMarcarFalta,
                                    setSelectedAgendamentoId,
                                    setShowCancelDialog,
                                }: AgendamentoItemProps) {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
            {/* Horário e duração */}
            <div className="flex items-center gap-4 flex-1">
                <div className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                    <span className="text-sm font-bold text-primary">{agendamento.horaInicio}</span>
                    <span className="text-xs text-primary/70">{agendamento.duracaoMinutos}min</span>
                </div>

                {/* Informações principais */}
                <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold truncate">{agendamento.pacienteNome}</p>
                        {getStatusBadge(agendamento.status)}
                    </div>

                    <p className="text-sm text-muted-foreground truncate">{agendamento.dentistaNome}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
                {formatHorarioConsulta(agendamento)}
            </span>

                        <span>•</span>

                        <span className="truncate max-w-[140px]">
              {getTipoProcedimentoLabel(agendamento.tipoProcedimento)}
            </span>

                        <span>•</span>

                        <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
                            {agendamento.pacienteTelefone || "Não informado"}
            </span>

                        {agendamento.confirmado && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-green-600 whitespace-nowrap">
                  <CheckCircle className="h-3 w-3" />
                  Confirmado
                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 shrink-0">
                {agendamento.status === StatusAgendamento.AGENDADO && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfirmar(agendamento.id)}
                        disabled={loading}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirmar
                    </Button>
                )}

                {agendamento.status === StatusAgendamento.CONFIRMADO && (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleIniciarAtendimento(agendamento.id)}
                        disabled={loading}
                    >
                        Iniciar Atendimento
                    </Button>
                )}

                {agendamento.status === StatusAgendamento.EM_ATENDIMENTO && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleConcluir(agendamento.id)}
                        disabled={loading}
                    >
                        Concluir
                    </Button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            •••
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log("Ver detalhes", agendamento.id)}>
                            Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Editar", agendamento.id)}>
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Reagendar", agendamento.id)}>
                            Reagendar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        {agendamento.status !== StatusAgendamento.CANCELADO &&
                            agendamento.status !== StatusAgendamento.FALTOU && (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedAgendamentoId(agendamento.id);
                                            setShowCancelDialog(true);
                                        }}
                                        className="text-orange-600 focus:text-orange-600"
                                    >
                                        Cancelar
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => handleMarcarFalta(agendamento.id)}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        Marcar Falta
                                    </DropdownMenuItem>
                                </>
                            )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}