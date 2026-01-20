// components/fila-espera/FilaLista.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-shadcn/card"
import { Alert, AlertDescription } from "@/components/ui-shadcn/alert"
import { Button } from "@/components/ui-shadcn/button"
import { Skeleton } from "@/components/ui-shadcn/skeleton"
import { AlertCircle, Plus, Users } from "lucide-react"
import { FilaItem } from "./FilaItem"
import {StatusFila, StatusFilaLabels} from "@/models/fila-espera.model"

interface FilaListaProps {
    filteredFilas: any[]
    loading: boolean
    error: string | null
    filterStatus: string
    filterPriority: string
    searchTerm: string
    onShowAddDialog: () => void
    onNotificar: (id: number) => void
    onCancelar: (id: number) => void
    onAumentarPrioridade: (id: number, prioridadeAtual: number) => void
    onVerDetalhes: (id: number) => void
}

export function FilaLista({
                              filteredFilas,
                              loading,
                              error,
                              filterStatus,
                              filterPriority,
                              searchTerm,
                              onShowAddDialog,
                              onNotificar,
                              onCancelar,
                              onAumentarPrioridade,
                              onVerDetalhes
                          }: FilaListaProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pacientes na Fila ({filteredFilas.length})</CardTitle>
                <CardDescription>
                    {filterStatus !== "TODOS" &&
                        `Filtrado por: ${
                            filterStatus === StatusFila.AGUARDANDO ? StatusFilaLabels.AGUARDANDO :
                                filterStatus === StatusFila.NOTIFICADO ? StatusFilaLabels.NOTIFICADO :
                                    filterStatus === StatusFila.CONFIRMADO ? StatusFilaLabels.CONFIRMADO :
                                        filterStatus === StatusFila.CONVERTIDO ? StatusFilaLabels.CONVERTIDO :
                                            filterStatus === StatusFila.CANCELADO ? StatusFilaLabels.CANCELADO :
                                                StatusFilaLabels.EXPIRADO
                        }`
                    }
                    {filterPriority !== "TODOS" && ` • Prioridade: ${filterPriority}`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading && !filteredFilas.length ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex items-center gap-4 flex-1">
                                    <Skeleton className="w-16 h-16 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-64" />
                                    </div>
                                </div>
                                <Skeleton className="h-9 w-24" />
                            </div>
                        ))}
                    </div>
                ) : filteredFilas.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Nenhuma fila encontrada</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchTerm || filterStatus !== "TODOS" || filterPriority !== "TODOS"
                                ? "Tente ajustar seus filtros de busca"
                                : "Adicione pacientes à fila para começar"}
                        </p>
                        {!searchTerm && filterStatus === "TODOS" && filterPriority === "TODOS" && (
                            <Button onClick={onShowAddDialog}>
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Primeiro Paciente
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredFilas.map((fila) => (
                            <FilaItem
                                key={fila.id}
                                fila={fila}
                                loading={loading}
                                onNotificar={onNotificar}
                                onCancelar={onCancelar}
                                onAumentarPrioridade={onAumentarPrioridade}
                                onVerDetalhes={onVerDetalhes}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}