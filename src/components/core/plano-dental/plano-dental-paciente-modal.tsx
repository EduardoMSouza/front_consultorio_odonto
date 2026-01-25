// components/core/plano-dental/modal/plano-dental-paciente-modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-shadcn/dialog';
import { Button } from '@/components/ui-shadcn/button';
import { Badge } from '@/components/ui-shadcn/badge';
import { PacienteSelectorModal } from '@/components/core/paciente/PacienteSelectorModal';
import { formatCurrency } from '@/lib/utils/currency.utils';
import { User, FileText, Loader2, AlertCircle, Stethoscope } from 'lucide-react';
import {PacienteResumoResponse} from "@/lib/types/paciente/paciente.types";
import {usePlanoDentalCalculos, usePlanosDentais} from "@/lib/hooks/usePlanoDental";

interface PlanoDentalPacienteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Função auxiliar para obter o valor final normalizado
const getValorFinalNormalizado = (plano: any) => {
    return plano.valorFinal || plano.valor;
};

export function PlanoDentalPacienteModal({
                                             open,
                                             onOpenChange
                                         }: PlanoDentalPacienteModalProps) {
    const [pacienteSelectorOpen, setPacienteSelectorOpen] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<PacienteResumoResponse | null>(null);
    const { planosDentais, loading, buscarPorPaciente } = usePlanosDentais();
    const { totalValor, totalValorFinal, calcularTotais } = usePlanoDentalCalculos();

    // Calcular o total valor final normalizado
    const totalValorFinalNormalizado = planosDentais.reduce((total, plano) => {
        return total + getValorFinalNormalizado(plano);
    }, 0);

    useEffect(() => {
        if (selectedPaciente) {
            buscarPorPaciente(selectedPaciente.id);
            calcularTotais(selectedPaciente.id);
        }
    }, [selectedPaciente]);

    const handleSelectPaciente = (paciente: PacienteResumoResponse) => {
        setSelectedPaciente(paciente);
    };

    const handleClose = () => {
        setSelectedPaciente(null);
        onOpenChange(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[900px] max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Procedimentos do Paciente
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start h-auto py-3"
                            onClick={() => setPacienteSelectorOpen(true)}
                        >
                            <User className="w-4 h-4 mr-2" />
                            {selectedPaciente ? (
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold">{selectedPaciente.nome}</span>
                                    <span className="text-xs text-muted-foreground">
                    Prontuário: {selectedPaciente.prontuarioNumero || 'N/A'}
                  </span>
                                </div>
                            ) : (
                                'Selecionar paciente'
                            )}
                        </Button>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    )}

                    {!loading && !selectedPaciente && (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <User className="w-16 h-16 mb-4 opacity-40" />
                            <p className="text-base font-medium">Nenhum paciente selecionado</p>
                            <p className="text-sm">Selecione um paciente para visualizar seus procedimentos</p>
                        </div>
                    )}

                    {!loading && selectedPaciente && (
                        <>
                            {planosDentais.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <AlertCircle className="w-16 h-16 mb-4 opacity-40" />
                                    <p className="text-base font-medium">Nenhum procedimento encontrado</p>
                                    <p className="text-sm">Este paciente não possui planos dentais cadastrados</p>
                                </div>
                            ) : (
                                <div className="space-y-4 flex-1 overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Total Valor</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {formatCurrency(totalValor)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Total Valor Final</p>
                                            <p className="text-2xl font-bold text-emerald-600">
                                                {formatCurrency(totalValorFinalNormalizado)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                            Procedimentos ({planosDentais.length})
                                        </h3>
                                        {planosDentais.map((plano) => {
                                            const valorFinalNormalizado = getValorFinalNormalizado(plano);
                                            return (
                                                <div
                                                    key={plano.id}
                                                    className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <Badge variant="outline" className="font-mono text-sm">
                                                                    <User className="w-3 h-3 mr-1" />
                                                                    Dente {plano.dente}
                                                                </Badge>
                                                                <span className="font-semibold">{plano.procedimento}</span>
                                                            </div>

                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Stethoscope className="w-3 h-3" />
                                                                <span>{plano.dentistaNome}</span>
                                                            </div>

                                                            {plano.observacoes && (
                                                                <p className="text-sm text-muted-foreground mt-2">
                                                                    {plano.observacoes}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="text-right space-y-1">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Valor</p>
                                                                <p className="font-semibold text-blue-600">
                                                                    {formatCurrency(plano.valor)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Valor Final</p>
                                                                <p className="font-bold text-emerald-600">
                                                                    {formatCurrency(valorFinalNormalizado)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                        {selectedPaciente && planosDentais.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                {planosDentais.length} procedimento(s) encontrado(s)
                            </p>
                        )}
                        <div className="ml-auto">
                            <Button variant="outline" onClick={handleClose}>
                                Fechar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <PacienteSelectorModal
                open={pacienteSelectorOpen}
                onOpenChange={setPacienteSelectorOpen}
                onSelect={handleSelectPaciente}
                selectedId={selectedPaciente?.id}
            />
        </>
    );
}