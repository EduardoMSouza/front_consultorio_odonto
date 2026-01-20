// components/fila-espera/FilaItem.tsx
import {Button} from "@/components/ui-shadcn/button"
import {Badge} from "@/components/ui-shadcn/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui-shadcn/dropdown-menu"
import {
    calcularTempoEspera,
    formatHorarioPreferencial,
    formatTempoEspera,
    getPrioridadeColor,
    getPrioridadeLabel,
    getStatusFilaColor,
    getStatusFilaLabel,
    getTipoProcedimentoLabel,
    StatusFila
} from "@/models/fila-espera.model"
import {ArrowUpCircle, Bell, Calendar, Clock, Phone, User, XCircle} from "lucide-react"

interface FilaItemProps {
    fila: any
    loading: boolean
    onNotificar: (id: number) => void
    onCancelar: (id: number) => void
    onAumentarPrioridade: (id: number, prioridadeAtual: number) => void
    onVerDetalhes: (id: number) => void
}

export function FilaItem({
                             fila,
                             loading,
                             onNotificar,
                             onCancelar,
                             onAumentarPrioridade,
                             onVerDetalhes
                         }: FilaItemProps) {
    const diasEspera = calcularTempoEspera(fila)

    const getStatusBadge = (status: StatusFila) => {
        const color = getStatusFilaColor(status)
        const colorMap: Record<string, string> = {
            blue: "bg-blue-100 text-blue-800 border-blue-200",
            yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
            green: "bg-green-100 text-green-800 border-green-200",
            purple: "bg-purple-100 text-purple-800 border-purple-200",
            red: "bg-red-100 text-red-800 border-red-200",
            gray: "bg-gray-100 text-gray-800 border-gray-200"
        }

        return (
            <Badge variant="outline" className={`${colorMap[color] || ''} text-xs`}>
                {getStatusFilaLabel(status)}
            </Badge>
        )
    }

    const getPrioridadeBadge = (prioridade: number) => {
        const label = getPrioridadeLabel(prioridade)
        const color = getPrioridadeColor(prioridade)
        const colorMap: Record<string, string> = {
            red: "bg-red-100 text-red-800 border-red-200",
            orange: "bg-orange-100 text-orange-800 border-orange-200",
            yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
            green: "bg-green-100 text-green-800 border-green-200"
        }

        return (
            <Badge variant="outline" className={`${colorMap[color] || ''} text-xs`}>
                P{prioridade} {label}
            </Badge>
        )
    }

    return (
        <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4 flex-1">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="text-xs font-medium text-primary">Posição</span>
                    <span className="text-xl font-bold text-primary">
            {fila.posicaoFila || "-"}
          </span>
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{fila.pacienteNome}</p>
                        {getStatusBadge(fila.status)}
                        {getPrioridadeBadge(fila.prioridade)}
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="font-medium">Procedimento:</span>
                            <span>{getTipoProcedimentoLabel(fila.tipoProcedimento)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className="font-medium">Telefone:</span>
                            <span>{fila.pacienteTelefone || "Não informado"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">Período:</span>
                            <span>{formatHorarioPreferencial(fila)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="font-medium">Dentista:</span>
                            <span>{fila.dentistaNome || "Qualquer dentista"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatTempoEspera(diasEspera)} na fila</span>
                        </div>
                        {fila.dataPreferencial && (
                            <div className="flex items-center gap-1">
                                <span className="font-medium">Data preferencial:</span>
                                <span>{new Date(fila.dataPreferencial).toLocaleDateString("pt-BR")}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {fila.status === StatusFila.AGUARDANDO && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNotificar(fila.id)}
                        disabled={loading}
                    >
                        <Bell className="mr-2 h-4 w-4" />
                        Notificar
                    </Button>
                )}
                {fila.status === StatusFila.NOTIFICADO && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNotificar(fila.id)}
                        disabled={loading}
                    >
                        <Bell className="mr-2 h-4 w-4" />
                        Reenviar ({fila.tentativasContato})
                    </Button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            •••
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {fila.prioridade < 10 && (
                            <DropdownMenuItem
                                onClick={() => onAumentarPrioridade(fila.id, fila.prioridade)}
                            >
                                <ArrowUpCircle className="mr-2 h-4 w-4" />
                                Aumentar prioridade
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onVerDetalhes(fila.id)}>
                            Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onCancelar(fila.id)}
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Remover da fila
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}