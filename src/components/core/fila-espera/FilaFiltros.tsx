// components/fila-espera/FilaFiltros.tsx
import { Button } from "@/components/ui-shadcn/button"
import { Input } from "@/components/ui-shadcn/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui-shadcn/dropdown-menu"
import { Search, Filter, AlertTriangle } from "lucide-react"
import { StatusFila, StatusFilaLabels } from "@/models/fila-espera.model"

interface FilaFiltrosProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    filterStatus: StatusFila | "TODOS"
    setFilterStatus: (status: StatusFila | "TODOS") => void
    filterPriority: string
    setFilterPriority: (priority: string) => void
}

export function FilaFiltros({
                                searchTerm,
                                setSearchTerm,
                                filterStatus,
                                setFilterStatus,
                                filterPriority,
                                setFilterPriority
                            }: FilaFiltrosProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar por paciente, procedimento ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Status: {filterStatus === "TODOS" ? "Todos" : StatusFilaLabels[filterStatus]}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterStatus("TODOS")}>
                        Todos os status
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {Object.values(StatusFila).map((status) => (
                        <DropdownMenuItem
                            key={status}
                            onClick={() => setFilterStatus(status)}
                        >
                            {StatusFilaLabels[status]}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Prioridade
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterPriority("TODOS")}>
                        Todas as prioridades
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterPriority("URGENTE")}>
                        Urgente (8-10)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority("ALTA")}>
                        Alta (5-7)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority("MEDIA")}>
                        Média (3-4)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority("NORMAL")}>
                        Normal (0-2)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}