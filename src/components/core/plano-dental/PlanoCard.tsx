// components/core/plano/PlanoCard.tsx
import Link from "next/link"
import { Badge } from "@/components/ui-shadcn/badge"
import { Button } from "@/components/ui-shadcn/button"
import { Card, CardContent } from "@/components/ui-shadcn/card"
import type { PlanoDentalResponse } from "@/models/plano-dental.model"
import { statusColors, statusLabels } from "@/constants/plano-status"
import { Eye, Edit, Trash2, User, UserCog, Calendar, DollarSign, FileText } from "lucide-react"

interface PlanoCardProps {
    plano: PlanoDentalResponse
    onDeleteClick: (id: number) => void
}

export function PlanoCard({ plano, onDeleteClick }: PlanoCardProps) {
    const formatCurrency = (value?: number) => {
        if (!value) return "Não informado"
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2
        })
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 border-border/50">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Informações do plano */}
                    <div className="flex-1 space-y-4">
                        {/* Cabeçalho com procedimento e status */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold text-foreground">{plano.procedimento}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileText className="w-3 h-3" />
                                    <span>Dente: <span className="font-medium text-foreground">{plano.dente}</span></span>
                                </div>
                            </div>
                            <Badge
                                className={`px-3 py-1.5 font-medium ${statusColors[plano.status]}`}
                                variant="outline"
                            >
                                {statusLabels[plano.status]}
                            </Badge>
                        </div>

                        {/* Detalhes do plano em grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Paciente */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="w-4 h-4" />
                                    <span>Paciente</span>
                                </div>
                                <p className="font-medium text-foreground">
                                    Nome: {plano.pacienteId}
                                </p>
                            </div>

                            {/* Dentista */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <UserCog className="w-4 h-4" />
                                    <span>Dentista</span>
                                </div>
                                <p className="font-medium text-foreground">
                                    ID: {plano.dentistaId}
                                </p>
                            </div>

                            {/* Valor */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <DollarSign className="w-4 h-4" />
                                    <span>Valor</span>
                                </div>
                                <p className={`font-medium ${plano.valor ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {formatCurrency(plano.valor)}
                                </p>
                            </div>

                            {/* Data de criação */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>Criado em</span>
                                </div>
                                <p className="font-medium text-foreground">
                                    {formatDate(plano.criadoEm)}
                                </p>
                            </div>
                        </div>

                        {/* Observações */}
                        {plano.observacoes && (
                            <div className="pt-3 border-t border-border/50">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium">Observações:</span> {plano.observacoes}
                                </p>
                            </div>
                        )}

                        {/* Última atualização (opcional) */}
                        <div className="text-xs text-muted-foreground">
                            Última atualização: {formatDate(plano.atualizadoEm)}
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="flex md:flex-col items-center gap-2 md:w-auto">
                        <Link href={`/planos/${plano.id}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalhes
                            </Button>
                        </Link>
                        <Link href={`/planos/${plano.id}/editar`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full justify-start">
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteClick(plano.id)}
                            className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}