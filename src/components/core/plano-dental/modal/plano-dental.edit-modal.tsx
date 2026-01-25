// components/core/plano-dental/plano-dental-edit-modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-shadcn/dialog';
import { Button } from '@/components/ui-shadcn/button';
import { Label } from '@/components/ui-shadcn/label';
import { Textarea } from '@/components/ui-shadcn/textarea';
import { Input } from '@/components/ui-shadcn/input';
import { PacienteSelectorModal } from '@/components/core/paciente/PacienteSelectorModal';
import { DentistaSelectorModal } from '@/components/core/dentistas/DentistaSelectorModal';
import { User, Stethoscope, FileText, DollarSign, Save, Loader2 } from 'lucide-react';
import {PacienteResumoResponse} from "@/lib/types/paciente/paciente.types";
import {PlanoDentalRequest, PlanoDentalResponse} from "@/lib/types/plano-dental/plano_dental.type";
import {DentistaResumoResponse} from "@/lib/types/dentista/dentista.type";
import {planoDentalService} from "@/lib/services/plano-dental/plano_dental.service";

interface PlanoDentalEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plano: PlanoDentalResponse | null;
    onSuccess?: () => void;
}

export function PlanoDentalEditModal({
                                         open,
                                         onOpenChange,
                                         plano,
                                         onSuccess
                                     }: PlanoDentalEditModalProps) {
    const [pacienteSelectorOpen, setPacienteSelectorOpen] = useState(false);
    const [dentistaSelectorOpen, setDentistaSelectorOpen] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<PacienteResumoResponse | null>(null);
    const [selectedDentista, setSelectedDentista] = useState<DentistaResumoResponse | null>(null);
    const [dente, setDente] = useState('');
    const [procedimento, setProcedimento] = useState('');
    const [valor, setValor] = useState('');
    const [valorFinal, setValorFinal] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (plano && open) {
            setSelectedPaciente({
                id: plano.pacienteId,
                nome: plano.pacienteNome
            } as PacienteResumoResponse);

            setSelectedDentista({
                id: plano.dentistaId,
                nome: plano.dentistaNome
            } as DentistaResumoResponse);

            setDente(plano.dente);
            setProcedimento(plano.procedimento);
            setValor(plano.valor?.toString() || '');
            setValorFinal(plano.valorFinal?.toString() || '');
            setObservacoes(plano.observacoes || '');
        }
    }, [plano, open]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!selectedPaciente) newErrors.paciente = 'Selecione um paciente';
        if (!selectedDentista) newErrors.dentista = 'Selecione um dentista';
        if (!dente.trim()) newErrors.dente = 'Informe o dente';
        if (!procedimento.trim()) newErrors.procedimento = 'Informe o procedimento';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate() || !plano) return;

        try {
            setLoading(true);

            const request: PlanoDentalRequest = {
                pacienteId: selectedPaciente!.id,
                dentistaId: selectedDentista!.id,
                dente,
                procedimento,
                valor: valor ? parseFloat(valor) : null,
                valorFinal: valorFinal ? parseFloat(valorFinal) : null,
                observacoes: observacoes.trim() || null
            };

            await planoDentalService.atualizar(plano.id, request);

            onSuccess?.();
            handleClose();
        } catch (error) {
            console.error('Erro ao atualizar plano dental:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedPaciente(null);
        setSelectedDentista(null);
        setDente('');
        setProcedimento('');
        setValor('');
        setValorFinal('');
        setObservacoes('');
        setErrors({});
        onOpenChange(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Editar Plano Dental</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Paciente */}
                        <div className="space-y-2">
                            <Label>Paciente *</Label>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => setPacienteSelectorOpen(true)}
                            >
                                <User className="w-4 h-4 mr-2" />
                                {selectedPaciente ? selectedPaciente.nome : 'Selecionar paciente'}
                            </Button>
                            {errors.paciente && (
                                <p className="text-sm text-destructive">{errors.paciente}</p>
                            )}
                        </div>

                        {/* Dentista */}
                        <div className="space-y-2">
                            <Label>Dentista *</Label>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => setDentistaSelectorOpen(true)}
                            >
                                <Stethoscope className="w-4 h-4 mr-2" />
                                {selectedDentista ? selectedDentista.nome : 'Selecionar dentista'}
                            </Button>
                            {errors.dentista && (
                                <p className="text-sm text-destructive">{errors.dentista}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Dente */}
                            <div className="space-y-2">
                                <Label htmlFor="dente">Dente *</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="dente"
                                        value={dente}
                                        onChange={(e) => setDente(e.target.value)}
                                        placeholder="Ex: 11, 21, etc"
                                        className="pl-10"
                                    />
                                </div>
                                {errors.dente && (
                                    <p className="text-sm text-destructive">{errors.dente}</p>
                                )}
                            </div>

                            {/* Procedimento */}
                            <div className="space-y-2">
                                <Label htmlFor="procedimento">Procedimento *</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="procedimento"
                                        value={procedimento}
                                        onChange={(e) => setProcedimento(e.target.value)}
                                        placeholder="Ex: Restauração"
                                        className="pl-10"
                                    />
                                </div>
                                {errors.procedimento && (
                                    <p className="text-sm text-destructive">{errors.procedimento}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Valor */}
                            <div className="space-y-2">
                                <Label htmlFor="valor">Valor</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="valor"
                                        type="number"
                                        step="0.01"
                                        value={valor}
                                        onChange={(e) => setValor(e.target.value)}
                                        placeholder="0.00"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Valor Final */}
                            <div className="space-y-2">
                                <Label htmlFor="valorFinal">Valor Final</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="valorFinal"
                                        type="number"
                                        step="0.01"
                                        value={valorFinal}
                                        onChange={(e) => setValorFinal(e.target.value)}
                                        placeholder="0.00"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Observações */}
                        <div className="space-y-2">
                            <Label htmlFor="observacoes">Observações</Label>
                            <Textarea
                                id="observacoes"
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                placeholder="Observações sobre o procedimento..."
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Salvar
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <PacienteSelectorModal
                open={pacienteSelectorOpen}
                onOpenChange={setPacienteSelectorOpen}
                onSelect={setSelectedPaciente}
                selectedId={selectedPaciente?.id}
            />

            <DentistaSelectorModal
                open={dentistaSelectorOpen}
                onOpenChange={setDentistaSelectorOpen}
                onSelect={setSelectedDentista}
                selectedId={selectedDentista?.id}
            />
        </>
    );
}