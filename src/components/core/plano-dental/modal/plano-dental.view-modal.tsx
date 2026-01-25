// components/core/plano-dental/plano-dental-view-modal.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-shadcn/dialog';
import { Button } from '@/components/ui-shadcn/button';
import { Badge } from '@/components/ui-shadcn/badge';
import { User, Stethoscope, FileText, DollarSign, X, Clock } from 'lucide-react';
import {PlanoDentalResponse} from "@/lib/types/plano-dental/plano_dental.type";

interface PlanoDentalViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plano: PlanoDentalResponse | null;
}

export function PlanoDentalViewModal({
                                         open,
                                         onOpenChange,
                                         plano
                                     }: PlanoDentalViewModalProps) {
    if (!plano) return null;

    const formatCurrency = (value: number | null) => {
        if (value === null) return '-';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDateTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Detalhes do Plano Dental
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Informações Principais */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Paciente */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <User className="w-4 h-4" />
                                Paciente
                            </div>
                            <p className="text-base font-semibold">{plano.pacienteNome}</p>
                        </div>

                        {/* Dentista */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Stethoscope className="w-4 h-4" />
                                Dentista
                            </div>
                            <p className="text-base font-semibold">{plano.dentistaNome}</p>
                        </div>
                    </div>

                    {/* Procedimento */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <User className="w-4 h-4" />
                                Dente
                            </div>
                            <Badge variant="outline" className="text-sm font-mono">
                                {plano.dente}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <FileText className="w-4 h-4" />
                                Procedimento
                            </div>
                            <p className="text-base font-medium">{plano.procedimento}</p>
                        </div>
                    </div>

                    {/* Valores */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <DollarSign className="w-4 h-4" />
                                Valor
                            </div>
                            <p className="text-lg font-bold text-blue-600">
                                {formatCurrency(plano.valor)}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <DollarSign className="w-4 h-4" />
                                Valor Final
                            </div>
                            <p className="text-lg font-bold text-emerald-600">
                                {formatCurrency(plano.valorFinal)}
                            </p>
                        </div>
                    </div>

                    {/* Observações */}
                    {plano.observacoes && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <FileText className="w-4 h-4" />
                                Observações
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4 border">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {plano.observacoes}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="pt-4 border-t space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Criado em: {formatDateTime(plano.criadoEm)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Atualizado em: {formatDateTime(plano.atualizadoEm)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}