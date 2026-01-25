// components/core/evolucao-tratamento/evolucao-tratamento-view-modal.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-shadcn/dialog';
import { Button } from '@/components/ui-shadcn/button';
import { Badge } from '@/components/ui-shadcn/badge';
import { User, Stethoscope, Calendar, FileText, X } from 'lucide-react';
import {EvolucaoTratamentoResponse} from "@/lib/types/evolucao-tratamento/evoluca_tratamento.type";

interface EvolucaoTratamentoViewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    evolucao: EvolucaoTratamentoResponse | null;
}

export function EvolucaoTratamentoViewModal({
                                                open,
                                                onOpenChange,
                                                evolucao
                                            }: EvolucaoTratamentoViewModalProps) {
    if (!evolucao) return null;

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
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
                        Detalhes da Evolução
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
                            <p className="text-base font-semibold">{evolucao.pacienteNome}</p>
                        </div>

                        {/* Dentista */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Stethoscope className="w-4 h-4" />
                                Dentista
                            </div>
                            <p className="text-base font-semibold">{evolucao.dentistaNome}</p>
                        </div>
                    </div>

                    {/* Data */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Data do Atendimento
                        </div>
                        <Badge variant="secondary" className="text-sm">
                            {formatDate(evolucao.data)}
                        </Badge>
                    </div>

                    {/* Evolução e Intercorrências */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            Evolução e Intercorrências
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 border">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {evolucao.evolucaoEIntercorrencias}
                            </p>
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