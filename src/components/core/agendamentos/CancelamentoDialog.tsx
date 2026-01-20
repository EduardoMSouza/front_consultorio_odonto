// components/agendamentos/CancelamentoDialog.tsx
import { Button } from "@/components/ui-shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui-shadcn/dialog";
import { Label } from "@/components/ui-shadcn/label";
import { Textarea } from "@/components/ui-shadcn/textarea";

interface CancelamentoDialogProps {
    showCancelDialog: boolean;
    setShowCancelDialog: (show: boolean) => void;
    selectedAgendamentoId: number | null;
    cancelamentoMotivo: string;
    setCancelamentoMotivo: (motivo: string) => void;
    handleCancelar: () => void;
    loading: boolean;
}

export function CancelamentoDialog({
                                       showCancelDialog,
                                       setShowCancelDialog,
                                       selectedAgendamentoId,
                                       cancelamentoMotivo,
                                       setCancelamentoMotivo,
                                       handleCancelar,
                                       loading,
                                   }: CancelamentoDialogProps) {
    return (
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancelar Agendamento</DialogTitle>
                    <DialogDescription>
                        Informe o motivo do cancelamento para o agendamento #{selectedAgendamentoId}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="motivoCancelamento">Motivo do Cancelamento *</Label>
                        <Textarea
                            id="motivoCancelamento"
                            placeholder="Ex: Paciente solicitou cancelamento, mudança de horário, etc."
                            value={cancelamentoMotivo}
                            onChange={(e) => setCancelamentoMotivo(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                        Voltar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleCancelar}
                        disabled={!cancelamentoMotivo.trim() || loading}
                    >
                        {loading ? "Cancelando..." : "Confirmar Cancelamento"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}