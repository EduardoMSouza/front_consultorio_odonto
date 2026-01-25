// components/core/evolucao-tratamento/modal/evolucao-tratamento-edit-modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui-shadcn/dialog';
import { Button } from '@/components/ui-shadcn/button';
import { Label } from '@/components/ui-shadcn/label';
import { Textarea } from '@/components/ui-shadcn/textarea';
import { Input } from '@/components/ui-shadcn/input';
import { PacienteSelectorModal } from '@/components/core/paciente/PacienteSelectorModal';
import { DentistaSelectorModal } from '@/components/core/dentistas/DentistaSelectorModal';

import { User, Stethoscope, Calendar, Save, Loader2 } from 'lucide-react';
import {useEvolucaoTratamento} from "@/lib/hooks/useEvolucaoTratamento";
import {
    EvolucaoTratamentoRequest,
    EvolucaoTratamentoResponse
} from "@/lib/types/evolucao-tratamento/evoluca_tratamento.type";
import {PacienteResumoResponse} from "@/lib/types/paciente/paciente.types";
import {DentistaResumoResponse} from "@/lib/types/dentista/dentista.type";
import {
    EvolucaoTratamentoValidationErrors, hasValidationErrors,
    validateEvolucaoTratamentoForm
} from "@/lib/utils/validators/evolucao-tratamento.validator";

interface EvolucaoTratamentoEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    evolucao: EvolucaoTratamentoResponse | null;
    onSuccess?: () => void;
}

export function EvolucaoTratamentoEditModal({
                                                open,
                                                onOpenChange,
                                                evolucao,
                                                onSuccess
                                            }: EvolucaoTratamentoEditModalProps) {
    const { atualizar, loading } = useEvolucaoTratamento();
    const [pacienteSelectorOpen, setPacienteSelectorOpen] = useState(false);
    const [dentistaSelectorOpen, setDentistaSelectorOpen] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<PacienteResumoResponse | null>(null);
    const [selectedDentista, setSelectedDentista] = useState<DentistaResumoResponse | null>(null);
    const [data, setData] = useState('');
    const [evolucaoEIntercorrencias, setEvolucaoEIntercorrencias] = useState('');
    const [errors, setErrors] = useState<EvolucaoTratamentoValidationErrors>({});

    useEffect(() => {
        if (evolucao && open) {
            setSelectedPaciente({
                id: evolucao.pacienteId,
                nome: evolucao.pacienteNome
            } as PacienteResumoResponse);

            setSelectedDentista({
                id: evolucao.dentistaId,
                nome: evolucao.dentistaNome
            } as DentistaResumoResponse);

            setData(evolucao.data);
            setEvolucaoEIntercorrencias(evolucao.evolucaoEIntercorrencias);
        }
    }, [evolucao, open]);

    const handleSubmit = async () => {
        if (!evolucao) return;

        const formData = {
            selectedPaciente,
            selectedDentista,
            data,
            evolucaoEIntercorrencias
        };

        const validationErrors = validateEvolucaoTratamentoForm(formData);
        setErrors(validationErrors);

        if (hasValidationErrors(validationErrors)) return;

        try {
            const request: EvolucaoTratamentoRequest = {
                pacienteId: selectedPaciente!.id,
                dentistaId: selectedDentista!.id,
                data,
                evolucaoEIntercorrencias
            };

            await atualizar(evolucao.id, request);
            onSuccess?.();
            handleClose();
        } catch (error) {
            console.error('Erro ao atualizar evolução:', error);
        }
    };

    const handleClose = () => {
        setSelectedPaciente(null);
        setSelectedDentista(null);
        setData('');
        setEvolucaoEIntercorrencias('');
        setErrors({});
        onOpenChange(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Editar Evolução de Tratamento</DialogTitle>
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

                        <div className="space-y-2">
                            <Label htmlFor="data">Data *</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="data"
                                    type="date"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {errors.data && (
                                <p className="text-sm text-destructive">{errors.data}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="evolucao">Evolução e Intercorrências *</Label>
                            <Textarea
                                id="evolucao"
                                value={evolucaoEIntercorrencias}
                                onChange={(e) => setEvolucaoEIntercorrencias(e.target.value)}
                                placeholder="Descreva a evolução do tratamento e possíveis intercorrências..."
                                rows={6}
                                className="resize-none"
                            />
                            {errors.evolucao && (
                                <p className="text-sm text-destructive">{errors.evolucao}</p>
                            )}
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