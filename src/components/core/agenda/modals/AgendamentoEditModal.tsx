// components/core/agenda/modals/AgendamentoEditModal.tsx
"use client"

import { useState, useEffect } from 'react';
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
import { Textarea } from "@/components/ui-shadcn/textarea";
import { Badge } from "@/components/ui-shadcn/badge";
import { ScrollArea } from "@/components/ui-shadcn/scroll-area";
import {
    AlertCircle,
    Loader2,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    ArrowRight,
    Ban,
    Play,
    Square
} from "lucide-react";
import {
    AgendamentoResponse,
    StatusAgendamento,
    TipoProcedimentoLabels
} from "@/lib/types/agenda/agendamento.type";
import { useAgendamento } from "@/lib/hooks/agenda/useAgendamento";
import { useAuth } from "@/lib/contexts/AuthContext";
import { toast } from "sonner";
import {AgendamentoStatusBadge} from "@/components/core/agenda/modals/agendamento-status-badge";

interface AgendamentoEditModalProps {
    agendamento: AgendamentoResponse | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AgendamentoEditModal({
                                         agendamento,
                                         open,
                                         onClose,
                                         onSuccess
                                     }: AgendamentoEditModalProps) {
    const { user } = useAuth();
    const { confirmar, iniciarAtendimento, concluir, cancelar, marcarFalta, loading } = useAgendamento();
    const [motivoCancelamento, setMotivoCancelamento] = useState('');
    const [showCancelamentoForm, setShowCancelamentoForm] = useState(false);

    useEffect(() => {
        if (open && agendamento) {
            setMotivoCancelamento('');
            setShowCancelamentoForm(false);
        }
    }, [open, agendamento]);

    const handleStatusAction = async (action: 'confirmar' | 'iniciar' | 'concluir' | 'falta') => {
        if (!agendamento) return;

        const usuario = user?.nome || 'Sistema';

        try {
            switch (action) {
                case 'confirmar':
                    await confirmar(agendamento.id, usuario);
                    toast.success('✅ Agendamento confirmado!');
                    break;
                case 'iniciar':
                    await iniciarAtendimento(agendamento.id, usuario);
                    toast.success('▶️ Atendimento iniciado!');
                    break;
                case 'concluir':
                    await concluir(agendamento.id, usuario);
                    toast.success('✅ Atendimento concluído!');
                    break;
                case 'falta':
                    await marcarFalta(agendamento.id, usuario);
                    toast.success('⚠️ Falta registrada');
                    break;
            }

            onSuccess();
            handleClose();
        } catch (error: any) {
            toast.error(error.message || 'Erro ao alterar status');
        }
    };

    const handleCancelar = async () => {
        if (!agendamento) return;

        if (!motivoCancelamento.trim()) {
            toast.error('Informe o motivo do cancelamento');
            return;
        }

        const usuario = user?.nome || 'Sistema';

        try {
            await cancelar(agendamento.id, motivoCancelamento, usuario);
            toast.success('❌ Agendamento cancelado');
            onSuccess();
            handleClose();
        } catch (error: any) {
            toast.error(error.message || 'Erro ao cancelar');
        }
    };

    const handleClose = () => {
        setMotivoCancelamento('');
        setShowCancelamentoForm(false);
        onClose();
    };

    if (!agendamento) return null;

    const estaCancelado = agendamento.status === StatusAgendamento.CANCELADO;
    const estaConcluido = agendamento.status === StatusAgendamento.CONCLUIDO;
    const estaFalta = agendamento.status === StatusAgendamento.FALTA;
    const estaFinalizado = agendamento.finalizado;
    const podeEditar = agendamento.podeSerEditado && !estaFinalizado;

    const getMensagemBloqueio = () => {
        if (estaCancelado) {
            return {
                titulo: 'Agendamento Cancelado',
                mensagem: 'Este agendamento foi cancelado e não pode mais ser alterado.',
                icon: <XCircle className="h-12 w-12 text-red-500" />
            };
        }
        if (estaConcluido) {
            return {
                titulo: 'Atendimento Concluído',
                mensagem: 'Este atendimento foi finalizado com sucesso.',
                icon: <CheckCircle className="h-12 w-12 text-green-500" />
            };
        }
        if (estaFalta) {
            return {
                titulo: 'Falta Registrada',
                mensagem: 'Foi registrado que o paciente não compareceu.',
                icon: <AlertCircle className="h-12 w-12 text-amber-500" />
            };
        }
        if (estaFinalizado) {
            return {
                titulo: 'Agendamento Finalizado',
                mensagem: 'Este agendamento está finalizado.',
                icon: <Ban className="h-12 w-12 text-gray-500" />
            };
        }
        return null;
    };

    const mensagemBloqueio = getMensagemBloqueio();

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Gerenciar Agendamento
                    </DialogTitle>
                    <DialogDescription>
                        {agendamento.nomePaciente} • {format(new Date(agendamento.dataConsulta), "dd/MM/yyyy", { locale: ptBR })} às {agendamento.horaInicio}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh]">
                    <div className="space-y-6 pr-4">
                        {/* Card de Informações Rápidas */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Status Atual</Label>
                                    <div className="mt-1">
                                        <AgendamentoStatusBadge status={agendamento.status} />
                                    </div>
                                </div>-
                                {agendamento.tipoProcedimento && (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Procedimento</Label>
                                        <p className="font-medium text-sm mt-1">
                                            {TipoProcedimentoLabels[agendamento.tipoProcedimento]}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Área de Bloqueio ou Ações */}
                        {mensagemBloqueio ? (
                            <div className="p-8 bg-muted/30 rounded-lg text-center border-2 border-dashed space-y-4">
                                <div className="flex justify-center">
                                    {mensagemBloqueio.icon}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold mb-2">
                                        {mensagemBloqueio.titulo}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {mensagemBloqueio.mensagem}
                                    </p>
                                </div>

                                {estaCancelado && agendamento.motivoCancelamento && (
                                    <div className="mt-4 bg-destructive/10 p-4 rounded-lg text-left">
                                        <Label className="text-xs text-muted-foreground">Motivo do Cancelamento</Label>
                                        <p className="text-sm mt-1 whitespace-pre-wrap">
                                            {agendamento.motivoCancelamento}
                                        </p>
                                        {agendamento.canceladoPor && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Cancelado por: {agendamento.canceladoPor}
                                                {agendamento.canceladoEm && ` em ${format(new Date(agendamento.canceladoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Fluxo de Progresso Visual */}
                                <div className="bg-white border-2 rounded-lg p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        Fluxo de Atendimento
                                    </h3>

                                    <div className="space-y-4">
                                        {/* AGENDADO → CONFIRMADO */}
                                        {agendamento.status === StatusAgendamento.AGENDADO && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <Calendar className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <ArrowRight className="h-4 w-4" />
                                                    <span>Próximo passo: Confirmar presença do paciente</span>
                                                </div>

                                                <Button
                                                    onClick={() => handleStatusAction('confirmar')}
                                                    disabled={loading}
                                                    className="w-full h-14 text-lg gap-2"
                                                    variant="default"
                                                >
                                                    {loading ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="h-5 w-5" />
                                                    )}
                                                    Confirmar Agendamento
                                                </Button>
                                            </div>
                                        )}

                                        {/* CONFIRMADO → EM ATENDIMENTO */}
                                        {agendamento.status === StatusAgendamento.CONFIRMADO && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <ArrowRight className="h-4 w-4" />
                                                    <span>Próximo passo: Iniciar o atendimento</span>
                                                </div>

                                                <Button
                                                    onClick={() => handleStatusAction('iniciar')}
                                                    disabled={loading}
                                                    className="w-full h-14 text-lg gap-2 bg-purple-600 hover:bg-purple-700"
                                                >
                                                    {loading ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <Play className="h-5 w-5" />
                                                    )}
                                                    Iniciar Atendimento
                                                </Button>
                                            </div>
                                        )}

                                        {/* EM ATENDIMENTO → CONCLUÍDO */}
                                        {agendamento.status === StatusAgendamento.EM_ATENDIMENTO && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                                        <Clock className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <ArrowRight className="h-4 w-4" />
                                                    <span>Próximo passo: Finalizar o atendimento</span>
                                                </div>

                                                <Button
                                                    onClick={() => handleStatusAction('concluir')}
                                                    disabled={loading}
                                                    className="w-full h-14 text-lg gap-2 bg-green-600 hover:bg-green-700"
                                                >
                                                    {loading ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <Square className="h-5 w-5" />
                                                    )}
                                                    Concluir Atendimento
                                                </Button>
                                            </div>
                                        )}

                                        {/* Opções Secundárias */}
                                        {(agendamento.status === StatusAgendamento.AGENDADO ||
                                            agendamento.status === StatusAgendamento.CONFIRMADO) && (
                                            <div className="pt-4 border-t space-y-2">
                                                <Label className="text-xs text-muted-foreground">Outras Ações</Label>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button
                                                        onClick={() => handleStatusAction('falta')}
                                                        disabled={loading}
                                                        variant="outline"
                                                        className="gap-2"
                                                    >
                                                        <AlertCircle className="h-4 w-4" />
                                                        Marcar Falta
                                                    </Button>

                                                    <Button
                                                        onClick={() => setShowCancelamentoForm(true)}
                                                        disabled={loading}
                                                        variant="outline"
                                                        className="gap-2 text-destructive hover:bg-destructive hover:text-white"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Cancelamento durante atendimento */}
                                        {agendamento.status === StatusAgendamento.EM_ATENDIMENTO && (
                                            <div className="pt-4 border-t">
                                                <Button
                                                    onClick={() => setShowCancelamentoForm(true)}
                                                    disabled={loading}
                                                    variant="outline"
                                                    className="w-full gap-2 text-destructive hover:bg-destructive hover:text-white"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    Cancelar Atendimento
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Formulário de Cancelamento */}
                                {showCancelamentoForm && (
                                    <div className="bg-destructive/5 border-2 border-destructive/20 rounded-lg p-6 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-destructive mb-1">
                                                    Cancelar Agendamento
                                                </h4>
                                                <p className="text-sm text-destructive/90 mb-4">
                                                    Esta ação não pode ser desfeita. Informe o motivo do cancelamento.
                                                </p>

                                                <div className="space-y-3">
                                                    <Label className="text-sm font-medium">
                                                        Motivo do Cancelamento *
                                                    </Label>
                                                    <Textarea
                                                        placeholder="Descreva o motivo do cancelamento..."
                                                        value={motivoCancelamento}
                                                        onChange={(e) => setMotivoCancelamento(e.target.value)}
                                                        rows={4}
                                                        className="resize-none"
                                                    />
                                                </div>

                                                <div className="flex gap-2 mt-4">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setShowCancelamentoForm(false);
                                                            setMotivoCancelamento('');
                                                        }}
                                                        className="flex-1"
                                                    >
                                                        Voltar
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={handleCancelar}
                                                        disabled={loading || !motivoCancelamento.trim()}
                                                        className="flex-1 gap-2"
                                                    >
                                                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                                        Confirmar Cancelamento
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}