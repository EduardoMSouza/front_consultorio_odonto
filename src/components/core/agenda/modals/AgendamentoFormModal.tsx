// components/core/agenda/modals/AgendamentoFormModal.tsx
"use client"

import { useState, useEffect } from 'react';
import { format, addMinutes } from 'date-fns';
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
import { Input } from "@/components/ui-shadcn/input";
import { Label } from "@/components/ui-shadcn/label";
import { Textarea } from "@/components/ui-shadcn/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-shadcn/select";
import { ScrollArea } from "@/components/ui-shadcn/scroll-area";
import { Loader2, User, X } from "lucide-react";
import {
    AgendamentoResponse,
    AgendamentoRequest,
    TipoProcedimento,
    TipoProcedimentoLabels,
} from "@/lib/types/agenda/agendamento.type";
import { PacienteResumoResponse } from "@/lib/types/paciente/paciente.types";
import { PacienteSelectorModal } from "@/components/core/paciente/PacienteSelectorModal";
import { useAgendamento } from "@/lib/hooks/agenda/useAgendamento";
import { useAuth } from "@/lib/contexts/AuthContext";
import { toast } from "sonner";

interface FormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    agendamento?: AgendamentoResponse;
    dentistaId: number;
    initialData?: {
        horario: string;
        data: Date;
    };
}

export function AgendamentoFormModal({
                                         open,
                                         onClose,
                                         onSuccess,
                                         agendamento,
                                         dentistaId,
                                         initialData
                                     }: FormModalProps) {
    const { user } = useAuth();
    const { criar, atualizar, loading } = useAgendamento();

    // Modal de seleção de paciente
    const [pacienteSelectorOpen, setPacienteSelectorOpen] = useState(false);
    const [pacienteSelecionado, setPacienteSelecionado] = useState<PacienteResumoResponse | null>(null);

    // Form data - inicializa com os valores corretos
    const [formData, setFormData] = useState<Partial<AgendamentoRequest>>({
        dentistaId: dentistaId,
        pacienteId: 0,
        dataConsulta: '',
        horaInicio: '',
        horaFim: '',
        tipoProcedimento: TipoProcedimento.CONSULTA,
        observacoes: '',
    });

    // Quando o modal abre, inicializa os dados
    useEffect(() => {
        if (open) {
            if (agendamento) {
                // Editando um agendamento existente
                setFormData({
                    dentistaId: agendamento.dentistaId,
                    pacienteId: agendamento.pacienteId,
                    dataConsulta: agendamento.dataConsulta,
                    horaInicio: agendamento.horaInicio,
                    horaFim: agendamento.horaFim,
                    tipoProcedimento: agendamento.tipoProcedimento,
                    observacoes: agendamento.observacoes || '',
                });
                setPacienteSelecionado({
                    id: agendamento.pacienteId,
                    nome: agendamento.nomePaciente,
                } as PacienteResumoResponse);
            } else if (initialData) {
                // Novo agendamento com horário pré-selecionado
                const duracao = getDuracaoProcedimento(TipoProcedimento.CONSULTA);
                const horaFim = calcularHoraFim(initialData.horario, duracao);

                setFormData({
                    dentistaId: dentistaId,
                    pacienteId: 0,
                    dataConsulta: format(initialData.data, 'yyyy-MM-dd'),
                    horaInicio: initialData.horario,
                    horaFim: horaFim,
                    tipoProcedimento: TipoProcedimento.CONSULTA,
                    observacoes: '',
                });
                setPacienteSelecionado(null);
            }
        }
    }, [open, agendamento, initialData]);

    // Recalcula hora fim quando muda o tipo de procedimento
    useEffect(() => {
        if (formData.horaInicio && formData.tipoProcedimento) {
            const duracao = getDuracaoProcedimento(formData.tipoProcedimento);
            const novaHoraFim = calcularHoraFim(formData.horaInicio, duracao);
            setFormData(prev => ({ ...prev, horaFim: novaHoraFim }));
        }
    }, [formData.tipoProcedimento]);

    const getDuracaoProcedimento = (tipo: TipoProcedimento): number => {
        const duracoes: Record<TipoProcedimento, number> = {
            [TipoProcedimento.CONSULTA]: 30,
            [TipoProcedimento.LIMPEZA]: 60,
            [TipoProcedimento.EXTRACAO]: 45,
            [TipoProcedimento.OBTURACAO]: 60,
            [TipoProcedimento.CANAL]: 90,
            [TipoProcedimento.PROTESE]: 60,
            [TipoProcedimento.ORTODONTIA]: 45,
            [TipoProcedimento.IMPLANTE]: 120,
            [TipoProcedimento.CLAREAMENTO]: 90,
            [TipoProcedimento.EMERGENCIA]: 30,
            [TipoProcedimento.AVALIACAO]: 30,
            [TipoProcedimento.RETORNO]: 30,
            [TipoProcedimento.OUTRO]: 30,
        };
        return duracoes[tipo] || 30;
    };

    const calcularHoraFim = (horaInicio: string, duracaoMinutos: number): string => {
        const [hora, minuto] = horaInicio.split(':').map(Number);
        const dataHora = new Date();
        dataHora.setHours(hora, minuto, 0);
        const horaFim = addMinutes(dataHora, duracaoMinutos);
        return format(horaFim, 'HH:mm');
    };

    const handlePacienteSelect = (paciente: PacienteResumoResponse) => {
        setPacienteSelecionado(paciente);
        setFormData(prev => ({ ...prev, pacienteId: paciente.id }));
    };

    const handleRemovePaciente = () => {
        setPacienteSelecionado(null);
        setFormData(prev => ({ ...prev, pacienteId: 0 }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validações
        if (!formData.pacienteId || formData.pacienteId === 0) {
            toast.error('Selecione um paciente');
            setPacienteSelectorOpen(true);
            return;
        }

        if (!formData.dataConsulta || !formData.horaInicio || !formData.horaFim) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        if (formData.horaFim <= formData.horaInicio) {
            toast.error('O horário de término deve ser após o horário de início');
            return;
        }

        try {
            const dados: AgendamentoRequest = {
                dentistaId: formData.dentistaId!,
                pacienteId: formData.pacienteId,
                dataConsulta: formData.dataConsulta,
                horaInicio: formData.horaInicio,
                horaFim: formData.horaFim,
                tipoProcedimento: formData.tipoProcedimento,
                observacoes: formData.observacoes,
                criadoPor: user?.nome || 'Sistema',
            };

            if (agendamento) {
                await atualizar(agendamento.id, dados);
                toast.success('Agendamento atualizado com sucesso!');
            } else {
                await criar(dados);
                toast.success('Agendamento criado com sucesso!');
            }

            onSuccess();
            handleClose();
        } catch (error: any) {
            toast.error(error.message || 'Erro ao salvar agendamento');
        }
    };

    const handleClose = () => {
        setPacienteSelecionado(null);
        setFormData({
            dentistaId: dentistaId,
            pacienteId: 0,
            dataConsulta: '',
            horaInicio: '',
            horaFim: '',
            tipoProcedimento: TipoProcedimento.CONSULTA,
            observacoes: '',
        });
        onClose();
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="max-w-2xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {agendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
                        </DialogTitle>
                        <DialogDescription>
                            {initialData && !agendamento && (
                                <span className="text-primary font-medium">
                  {format(initialData.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {initialData.horario}
                </span>
                            )}
                            {!initialData && !agendamento && 'Preencha os dados para criar um novo agendamento'}
                            {agendamento && 'Edite as informações do agendamento'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <ScrollArea className="max-h-[60vh] pr-4">
                            <div className="space-y-4">
                                {/* Paciente */}
                                <div className="space-y-2">
                                    <Label>
                                        Paciente <span className="text-destructive">*</span>
                                    </Label>

                                    {pacienteSelecionado ? (
                                        <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                            <User className="h-4 w-4 text-primary" />
                                            <span className="flex-1 font-medium">{pacienteSelecionado.nome}</span>
                                            {!agendamento && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRemovePaciente}
                                                    className="h-7 w-7 p-0"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full justify-start h-11"
                                            onClick={() => setPacienteSelectorOpen(true)}
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            Selecionar Paciente
                                        </Button>
                                    )}
                                </div>

                                {/* Data */}
                                <div className="space-y-2">
                                    <Label htmlFor="data">
                                        Data <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="data"
                                        type="date"
                                        value={formData.dataConsulta}
                                        onChange={(e) => setFormData({ ...formData, dataConsulta: e.target.value })}
                                        required
                                        className="h-11"
                                    />
                                </div>

                                {/* Tipo de Procedimento */}
                                <div className="space-y-2">
                                    <Label htmlFor="procedimento">
                                        Tipo de Procedimento <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={formData.tipoProcedimento}
                                        onValueChange={(value) => setFormData({ ...formData, tipoProcedimento: value as TipoProcedimento })}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(TipoProcedimentoLabels).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {formData.tipoProcedimento && (
                                        <p className="text-xs text-muted-foreground">
                                            Duração estimada: {getDuracaoProcedimento(formData.tipoProcedimento)} minutos
                                        </p>
                                    )}
                                </div>

                                {/* Horários */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="horaInicio">
                                            Hora Início <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="horaInicio"
                                            type="time"
                                            value={formData.horaInicio}
                                            onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                                            required
                                            disabled={!!initialData && !agendamento}
                                            className="h-11"
                                        />
                                        {initialData && !agendamento && (
                                            <p className="text-xs text-muted-foreground">
                                                Horário selecionado automaticamente
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="horaFim">
                                            Hora Fim <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="horaFim"
                                            type="time"
                                            value={formData.horaFim}
                                            onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })}
                                            required
                                            min={formData.horaInicio}
                                            className="h-11"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Calculado automaticamente, mas pode ajustar
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </ScrollArea>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {agendamento ? 'Atualizar' : 'Criar'} Agendamento
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal de Seleção de Paciente */}
            <PacienteSelectorModal
                open={pacienteSelectorOpen}
                onOpenChange={setPacienteSelectorOpen}
                onSelect={handlePacienteSelect}
                selectedId={pacienteSelecionado?.id}
            />
        </>
    );
}