// components/core/plano-dental/modal/plano-dental-create-modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-shadcn/dialog';
import { Button } from '@/components/ui-shadcn/button';
import { Label } from '@/components/ui-shadcn/label';
import { Textarea } from '@/components/ui-shadcn/textarea';
import { Input } from '@/components/ui-shadcn/input';
import { PacienteSelectorModal } from '@/components/core/paciente/PacienteSelectorModal';
import { DentistaSelectorModal } from '@/components/core/dentistas/DentistaSelectorModal';
import { formatCurrency, parseCurrency, formatToCurrencyInput } from '@/lib/utils/currency.utils';
import { User, Stethoscope, FileText, DollarSign, Loader2 } from 'lucide-react';
import {usePlanoDental} from "@/lib/hooks/usePlanoDental";
import {PacienteResumoResponse} from "@/lib/types/paciente/paciente.types";
import {DentistaResumoResponse} from "@/lib/types/dentista/dentista.type";
import {PlanoDentalRequest} from "@/lib/types/plano-dental/plano_dental.type";
import {
    hasValidationErrors,
    PlanoDentalValidationErrors,
    validatePlanoDentalForm
} from "@/lib/utils/validators/plano-dental.validator";

interface PlanoDentalCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function PlanoDentalCreateModal({
                                           open,
                                           onOpenChange,
                                           onSuccess
                                       }: PlanoDentalCreateModalProps) {
    const { criar, loading } = usePlanoDental();
    const [pacienteSelectorOpen, setPacienteSelectorOpen] = useState(false);
    const [dentistaSelectorOpen, setDentistaSelectorOpen] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<PacienteResumoResponse | null>(null);
    const [selectedDentista, setSelectedDentista] = useState<DentistaResumoResponse | null>(null);
    const [dente, setDente] = useState('');
    const [procedimento, setProcedimento] = useState('');
    const [valor, setValor] = useState('');
    const [valorFinal, setValorFinal] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [errors, setErrors] = useState<PlanoDentalValidationErrors>({});

    // Quando o valor mudar, atualizar automaticamente o valorFinal
    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formatted = formatToCurrencyInput(rawValue);
        setValor(formatted);

        // Atualizar valorFinal com o mesmo valor
        setValorFinal(formatted);
    };

    // Permitir que o usuário edite manualmente o valorFinal se quiser
    const handleValorFinalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formatted = formatToCurrencyInput(rawValue);
        setValorFinal(formatted);
    };

    const handleSubmit = async () => {
        const formData = {
            selectedPaciente,
            selectedDentista,
            dente,
            procedimento,
            valor,
            valorFinal,
            observacoes
        };

        const validationErrors = validatePlanoDentalForm(formData);
        setErrors(validationErrors);

        if (hasValidationErrors(validationErrors)) return;

        try {
            const request: PlanoDentalRequest = {
                pacienteId: selectedPaciente!.id,
                dentistaId: selectedDentista!.id,
                dente,
                procedimento,
                valor: parseCurrency(valor),
                valorFinal: parseCurrency(valorFinal),
                observacoes: observacoes.trim() || null
            };

            await criar(request);
            onSuccess?.();
            handleClose();
        } catch (error) {
            console.error('Erro ao criar plano dental:', error);
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
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Novo Plano Dental
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
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
                            <div className="space-y-2">
                                <Label htmlFor="valor">Valor *</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="valor"
                                        value={valor}
                                        onChange={handleValorChange}
                                        placeholder="0,00"
                                        className="pl-10 text-right"
                                    />
                                </div>
                                {errors.valor && (
                                    <p className="text-sm text-destructive">{errors.valor}</p>
                                )}
                                {valor && (
                                    <p className="text-xs text-muted-foreground">
                                        {formatCurrency(parseCurrency(valor))}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="valorFinal">Valor Final *</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="valorFinal"
                                        value={valorFinal}
                                        onChange={handleValorFinalChange}
                                        placeholder="0,00"
                                        className="pl-10 text-right"
                                    />
                                </div>
                                {errors.valorFinal && (
                                    <p className="text-sm text-destructive">{errors.valorFinal}</p>
                                )}
                                {valorFinal && (
                                    <p className="text-xs text-muted-foreground">
                                        {formatCurrency(parseCurrency(valorFinal))}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="observacoes">Observações</Label>
                            <Textarea
                                id="observacoes"
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                placeholder="Observações sobre o procedimento..."
                                rows={3}
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
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4 mr-2" />
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