// components/core/agenda/modals/AgendamentoDetalhesModal.tsx
"use client"

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui-shadcn/dialog";
import { Button } from "@/components/ui-shadcn/button";
import { Label } from "@/components/ui-shadcn/label";
import { Separator } from "@/components/ui-shadcn/separator";
import { ScrollArea } from "@/components/ui-shadcn/scroll-area";
import { Badge } from "@/components/ui-shadcn/badge";
import {
    Calendar,
    Clock,
    FileText,
    User,
    Activity,
    CheckCircle,
    XCircle
} from "lucide-react";
import {
    AgendamentoResponse,
    TipoProcedimentoLabels,
    StatusAgendamento
} from "@/lib/types/agenda/agendamento.type";
import { AgendamentoEditModal } from "./AgendamentoEditModal";
import {AgendamentoStatusBadge} from "@/components/core/agenda/modals/agendamento-status-badge";

interface DetalhesModalProps {
    agendamento: AgendamentoResponse | null;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AgendamentoDetalhesModal({
                                             agendamento,
                                             open,
                                             onClose,
                                             onSuccess
                                         }: DetalhesModalProps) {
    const [editModalOpen, setEditModalOpen] = useState(false);

    if (!agendamento) return null;

    const handleStatusEditClick = () => {
        setEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
    };

    const handleEditSuccess = () => {
        setEditModalOpen(false);
        if (onSuccess) {
            onSuccess();
        }
        onClose();
    };

    // Define quais status permitem edição
    const statusEditaveis = [
        StatusAgendamento.AGENDADO,
        StatusAgendamento.CONFIRMADO,
        StatusAgendamento.EM_ATENDIMENTO
    ];

    const podeEditar = statusEditaveis.includes(agendamento.status) && agendamento.podeSerEditado;
    const estaCancelado = agendamento.status === StatusAgendamento.CANCELADO;

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base">
                            <Calendar className="h-5 w-5 text-primary" />
                            Detalhes do Agendamento
                        </DialogTitle>
                        <DialogDescription className="flex items-center justify-between">
                            <span className="text-sm">Agendamento #{agendamento.id}</span>
                            <AgendamentoStatusBadge status={agendamento.status} />
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[65vh] pr-4">
                        <div className="space-y-4">
                            {/* Paciente */}
                            <div className="bg-blue-50/50 p-3 rounded-lg">
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                    Paciente
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Nome</Label>
                                        <p className="font-medium text-sm">{agendamento.nomePaciente}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">ID</Label>
                                        <p className="font-medium text-sm">#{agendamento.pacienteId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dentista */}
                            <div className="bg-emerald-50/50 p-3 rounded-lg">
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <User className="h-4 w-4 text-emerald-600" />
                                    Dentista
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Nome</Label>
                                        <p className="font-medium text-sm">{agendamento.nomeDentista}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">ID</Label>
                                        <p className="font-medium text-sm">#{agendamento.dentistaId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Data e Horário */}
                            <div className="bg-amber-50/50 p-3 rounded-lg">
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-amber-600" />
                                    Data e Horário
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Data</Label>
                                        <p className="font-medium text-sm">
                                            {format(new Date(agendamento.dataConsulta), "dd/MM/yyyy", { locale: ptBR })}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(agendamento.dataConsulta), "EEEE", { locale: ptBR })}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Horário</Label>
                                        <p className="font-medium text-sm">
                                            {agendamento.horaInicio} - {agendamento.horaFim}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Duração</Label>
                                        <p className="font-medium text-sm">{agendamento.duracaoEmMinutos} min</p>
                                    </div>
                                </div>
                            </div>

                            {/* Procedimento */}
                            {agendamento.tipoProcedimento && (
                                <div className="bg-purple-50/50 p-3 rounded-lg">
                                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-purple-600" />
                                        Procedimento
                                    </h3>
                                    <Badge variant="secondary" className="text-sm">
                                        {TipoProcedimentoLabels[agendamento.tipoProcedimento]}
                                    </Badge>
                                </div>
                            )}

                            {/* Observações */}
                            {agendamento.observacoes && (
                                <div>
                                    <Label className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Observações
                                    </Label>
                                    <div className="bg-muted/50 p-3 rounded-lg">
                                        <p className="text-sm whitespace-pre-wrap">{agendamento.observacoes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Informações de Cancelamento */}
                            {estaCancelado && agendamento.canceladoPor && (
                                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                                    <h3 className="text-sm font-semibold mb-2 text-destructive flex items-center gap-2">
                                        <XCircle className="h-4 w-4" />
                                        Informações de Cancelamento
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs text-muted-foreground">Cancelado por</Label>
                                                <p className="font-medium">{agendamento.canceladoPor}</p>
                                            </div>
                                            {agendamento.canceladoEm && (
                                                <div>
                                                    <Label className="text-xs text-muted-foreground">Data</Label>
                                                    <p className="font-medium">
                                                        {format(new Date(agendamento.canceladoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {agendamento.motivoCancelamento && (
                                            <div>
                                                <Label className="text-xs text-muted-foreground">Motivo</Label>
                                                <p className="mt-1 text-sm whitespace-pre-wrap bg-white p-2 rounded border border-destructive/20">
                                                    {agendamento.motivoCancelamento}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Informações do Sistema */}
                            <div className="bg-muted/30 p-3 rounded-lg">
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Informações do Sistema
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Criado em</Label>
                                        <p className="text-sm">
                                            {format(new Date(agendamento.criadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Atualizado em</Label>
                                        <p className="text-sm">
                                            {format(new Date(agendamento.atualizadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </p>
                                    </div>
                                    {agendamento.criadoPor && (
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Criado por</Label>
                                            <p className="text-sm">{agendamento.criadoPor}</p>
                                        </div>
                                    )}
                                    {agendamento.confirmadoEm && (
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Confirmado em</Label>
                                            <p className="text-sm">
                                                {format(new Date(agendamento.confirmadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Fechar
                        </Button>

                        {podeEditar && (
                            <Button
                                onClick={handleStatusEditClick}
                                className="gap-2"
                            >
                                <Activity className="h-4 w-4" />
                                Gerenciar Status
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Edição de Status */}
            <AgendamentoEditModal
                agendamento={agendamento}
                open={editModalOpen}
                onClose={handleEditModalClose}
                onSuccess={handleEditSuccess}
            />
        </>
    );
}