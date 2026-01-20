// components/agendamentos/AgendamentosLista.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-shadcn/card";
import { Alert, AlertDescription } from "@/components/ui-shadcn/alert";
import { Skeleton } from "@/components/ui-shadcn/skeleton";
import { AlertTriangle, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui-shadcn/button";
import { Plus } from "lucide-react";
import {AgendamentoResumoResponse, StatusAgendamento, StatusAgendamentoLabels} from "@/models/agendamento.model";
import { AgendamentoItem } from "./AgendamentoItem";

interface AgendamentosListaProps {
    filteredAgendamentos: AgendamentoResumoResponse[];
    loading: boolean;
    error: string | null;
    agendaDoDia: AgendamentoResumoResponse[];
    searchTerm: string;
    filterStatus: StatusAgendamento | "TODOS";
    filterDentista: string;
    formatDate: (date: Date) => string;
    selectedDate: Date;
    setShowNewDialog: (show: boolean) => void;
    handleConfirmar: (id: number) => void;
    handleIniciarAtendimento: (id: number) => void;
    handleConcluir: (id: number) => void;
    handleMarcarFalta: (id: number) => void;
    setSelectedAgendamentoId: (id: number | null) => void;
    setShowCancelDialog: (show: boolean) => void;
}

export function AgendamentosLista({
                                      filteredAgendamentos,
                                      loading,
                                      error,
                                      agendaDoDia,
                                      searchTerm,
                                      filterStatus,
                                      filterDentista,
                                      formatDate,
                                      selectedDate,
                                      setShowNewDialog,
                                      ...props
                                  }: AgendamentosListaProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-xl font-bold">Agenda de {formatDate(selectedDate)}</CardTitle>
                    <CardDescription>
                        {filteredAgendamentos.length} agendamento(s) encontrado(s)
                        {filterStatus !== "TODOS" && ` • Filtro: ${StatusAgendamentoLabels[filterStatus]}`}
                        {filterDentista !== "TODOS" && ` • Dentista: ${filterDentista}`}
                    </CardDescription>
                </div>
                {/* Navegador de datas movido para DataNavigator */}
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {loading && !agendaDoDia.length ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex items-center gap-4 flex-1">
                                    <Skeleton className="w-20 h-20 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-64" />
                                    </div>
                                </div>
                                <Skeleton className="h-9 w-24" />
                            </div>
                        ))}
                    </div>
                ) : filteredAgendamentos.length === 0 ? (
                    <div className="text-center py-12">
                        <CalendarClock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Nenhum agendamento encontrado</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchTerm || filterStatus !== "TODOS" || filterDentista !== "TODOS"
                                ? "Tente ajustar seus filtros de busca"
                                : "Não há agendamentos para esta data"}
                        </p>
                        {!searchTerm && filterStatus === "TODOS" && filterDentista === "TODOS" && (
                            <Button onClick={() => setShowNewDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Criar Primeiro Agendamento
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredAgendamentos.map((agendamento) => (
                            <AgendamentoItem key={agendamento.id} agendamento={agendamento} loading={loading} {...props} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}