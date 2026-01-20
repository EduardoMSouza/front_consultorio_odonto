// components/agendamentos/AgendamentosFiltros.tsx
"use client"

import { Input } from "@/components/ui-shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-shadcn/select";
import { Filter, Search, User } from "lucide-react";
import { StatusAgendamento } from "@/models/agendamento.model";
import { Button } from "@/components/ui-shadcn/button";
import { useEffect, useState } from "react";
import { useDentistas } from "@/service/useDentistas";
import { Skeleton } from "@/components/ui-shadcn/skeleton";

interface AgendamentosFiltrosProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterStatus: StatusAgendamento | "TODOS";
    setFilterStatus: (status: StatusAgendamento | "TODOS") => void;
    filterDentista: string;
    setFilterDentista: (dentista: string) => void;
    dentistasUnicos: string[];
    StatusAgendamentoLabels: Record<StatusAgendamento, string>;
    onFilter?: () => void;
}

export function AgendamentosFiltros({
                                        searchTerm,
                                        setSearchTerm,
                                        filterStatus,
                                        setFilterStatus,
                                        filterDentista,
                                        setFilterDentista,
                                        dentistasUnicos,
                                        StatusAgendamentoLabels,
                                        onFilter,
                                    }: AgendamentosFiltrosProps) {
    const { dentistas, listarDentistasAtivos, loading } = useDentistas();
    const [dentistasCarregados, setDentistasCarregados] = useState(false);

    // Carrega dentistas ativos quando o componente monta
    useEffect(() => {
        const carregarDentistas = async () => {
            try {
                await listarDentistasAtivos();
                setDentistasCarregados(true);
            } catch (error) {
                console.error("Erro ao carregar dentistas:", error);
            }
        };

        carregarDentistas();
    }, [listarDentistasAtivos]);

    // Extrai os nomes dos dentistas ativos
    const dentistasAtivos = dentistas
        .filter(d => d.ativo)
        .map(d => ({
            id: d.id,
            nome: d.nome,
            especialidade: d.especialidade
        }))
        .sort((a, b) => a.nome.localeCompare(b.nome));

    const handleFilterClick = () => {
        if (onFilter) {
            onFilter();
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Buscar paciente, dentista ou procedimento..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilterClick()}
                />
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as StatusAgendamento | "TODOS")}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="TODOS">Todos Status</SelectItem>
                        {Object.entries(StatusAgendamentoLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filterDentista} onValueChange={setFilterDentista}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Dentista">
                            {filterDentista === "TODOS" ? "Todos Dentistas" : filterDentista}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="TODOS">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Todos Dentistas
                            </div>
                        </SelectItem>

                        {loading ? (
                            <div className="p-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4 mt-2" />
                            </div>
                        ) : dentistasAtivos.length === 0 ? (
                            <SelectItem value="SEM_DENTISTAS" disabled>
                                Nenhum dentista cadastrado
                            </SelectItem>
                        ) : (
                            dentistasAtivos.map((dentista) => (
                                <SelectItem key={dentista.id} value={dentista.nome}>
                                    <div className="flex flex-col">
                                        <span>{dentista.nome}</span>
                                        {dentista.especialidade && (
                                            <span className="text-xs text-muted-foreground">
                                                {dentista.especialidade}
                                            </span>
                                        )}
                                    </div>
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFilterClick}
                    className="w-full md:w-auto"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                </Button>
            </div>
        </div>
    );
}