// components/core/agenda/modals/AgendamentoCancelamentoModal.tsx
"use client"

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui-shadcn/dialog";
import { Button } from "@/components/ui-shadcn/button";
import { Label } from "@/components/ui-shadcn/label";
import { Textarea } from "@/components/ui-shadcn/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { AgendamentoResponse } from "@/lib/types/agenda/agendamento.type";
import { useAgendamento } from "@/lib/hooks/agenda/useAgendamento";
import { useAuth } from "@/lib/contexts/AuthContext";
import { toast } from "sonner";

interface CancelamentoModalProps {
    agendamento: AgendamentoResponse | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AgendamentoCancelamentoModal({
                                                 agendamento,
                                                 open,
                                                 onClose,
                                                 onSuccess
                                             }: CancelamentoModalProps) {
    const { user } = useAuth();
    const { cancelar, loading } = useAgendamento();
    const [motivo, setMotivo] = useState('');

    const handleCancelar = async () => {
        if (!agendamento) return;

        if (!motivo.trim()) {
            toast.error('Informe o motivo do cancelamento');
            return;
        }

        try {
            await cancelar(agendamento.id, motivo, user?.nome || 'Sistema');
            toast.success('Agendamento cancelado com sucesso!');
            onSuccess();
            onClose();
            setMotivo('');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao cancelar agendamento');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        Cancelar Agendamento
                    </DialogTitle>
                    <DialogDescription>
                        Esta ação não pode ser desfeita. Confirme o cancelamento do agendamento.
                    </DialogDescription>
                </DialogHeader>

                {agendamento && (
                    <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <p className="text-sm">
                                <span className="font-medium">Paciente:</span> {agendamento.nomePaciente}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Data:</span>{' '}
                                {format(new Date(agendamento.dataConsulta), "dd/MM/yyyy", { locale: ptBR })} às {agendamento.horaInicio}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="motivo">
                                Motivo do Cancelamento <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="motivo"
                                placeholder="Descreva o motivo do cancelamento..."
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                rows={3}
                                required
                            />
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Voltar
                    </Button>
                    <Button variant="destructive" onClick={handleCancelar} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirmar Cancelamento
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}