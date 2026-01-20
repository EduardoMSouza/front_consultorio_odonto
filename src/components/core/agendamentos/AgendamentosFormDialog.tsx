// components/core/agendamentos/AgendamentosFormDialog.tsx
"use client"

import { Button } from "@/components/ui-shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui-shadcn/dialog";
import { Input } from "@/components/ui-shadcn/input";
import { Label } from "@/components/ui-shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-shadcn/select";
import { Textarea } from "@/components/ui-shadcn/textarea";
import { Plus, Loader2, Clock, AlertCircle } from "lucide-react";
import { useAgendamentoForm } from "@/service/useAgendamentoForm";
import { Alert, AlertDescription } from "@/components/ui-shadcn/alert";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AgendamentosFormDialog() {
    const [showNewDialog, setShowNewDialog] = useState(false);

    const {
        formData,
        loading,
        error,
        dentistas,
        pacientes,
        horariosInicio,
        horariosFim,
        handleSelectDentista,
        handleSelectPaciente,
        handleChange,
        handleSelectData,
        handleSelectHoraInicio,
        submitForm,
        resetForm
    } = useAgendamentoForm();

    const handleOpenChange = (open: boolean) => {
        setShowNewDialog(open);
        if (!open) {
            resetForm();
        }
    };

    const handleSubmit = async () => {
        try {
            await submitForm();
            setShowNewDialog(false);
            resetForm();
        } catch (err) {
            // Erro já tratado no hook
        }
    };

    return (
        <Dialog open={showNewDialog} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Agendamento
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Novo Agendamento</DialogTitle>
                    <DialogDescription>
                        Preencha os dados para criar um novo agendamento
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4 py-4">
                    {/* Dentista */}
                    <div className="space-y-2">
                        <Label htmlFor="dentistaId">Dentista *</Label>
                        <Select
                            value={formData.dentistaId.toString()}
                            onValueChange={(value) => handleSelectDentista(parseInt(value))}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um dentista" />
                            </SelectTrigger>
                            <SelectContent>
                                {dentistas.map(dentista => (
                                    <SelectItem key={dentista.id} value={dentista.id.toString()}>
                                        {dentista.nome} {dentista.especialidade && `- ${dentista.especialidade}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Paciente */}
                    <div className="space-y-2">
                        <Label htmlFor="pacienteId">Paciente *</Label>
                        <Select
                            value={formData.pacienteId.toString()}
                            onValueChange={(value) => handleSelectPaciente(parseInt(value))}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um paciente" />
                            </SelectTrigger>
                            <SelectContent>
                                {pacientes.map(paciente => (
                                    <SelectItem key={paciente.id} value={paciente.id.toString()}>
                                        {paciente.nome} {paciente.cpf && `- ${paciente.cpf}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Data */}
                    <div className="space-y-2">
                        <Label htmlFor="dataConsulta">Data da Consulta *</Label>
                        <Input
                            id="dataConsulta"
                            type="date"
                            value={formData.dataConsulta}
                            onChange={(e) => handleSelectData(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            disabled={loading || !formData.dentistaId}
                        />
                    </div>

                    {/* Horários */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Hora Início */}
                        <div className="space-y-2">
                            <Label htmlFor="horaInicio">Horário de Início *</Label>
                            <Select
                                value={formData.horaInicio}
                                onValueChange={handleSelectHoraInicio}
                                disabled={loading || !formData.dataConsulta || horariosInicio.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={
                                        horariosInicio.length === 0
                                            ? "Selecione data primeiro"
                                            : "Selecione horário"
                                    } />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {horariosInicio.map(horario => (
                                        <SelectItem
                                            key={horario.value}
                                            value={horario.value}
                                            disabled={!horario.disponivel}
                                            className={cn(
                                                !horario.disponivel && "opacity-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {horario.label}
                                                {!horario.disponivel && (
                                                    <span className="text-xs text-muted-foreground">(ocupado)</span>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Hora Fim */}
                        <div className="space-y-2">
                            <Label htmlFor="horaFim">Horário de Término *</Label>
                            <Select
                                value={formData.horaFim}
                                onValueChange={(value) => handleChange('horaFim', value)}
                                disabled={loading || !formData.horaInicio || horariosFim.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={
                                        !formData.horaInicio
                                            ? "Selecione início primeiro"
                                            : "Selecione término"
                                    } />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {horariosFim.map(horario => (
                                        <SelectItem
                                            key={horario.value}
                                            value={horario.value}
                                            disabled={!horario.disponivel}
                                            className={cn(
                                                !horario.disponivel && "opacity-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {horario.label}
                                                {!horario.disponivel && (
                                                    <span className="text-xs text-muted-foreground">(conflito)</span>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tipo de Procedimento */}
                    <div className="space-y-2">
                        <Label htmlFor="tipoProcedimento">Tipo de Procedimento</Label>
                        <Select
                            value={formData.tipoProcedimento}
                            onValueChange={(value) => handleChange('tipoProcedimento', value)}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um procedimento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CONSULTA">Consulta</SelectItem>
                                <SelectItem value="LIMPEZA">Limpeza</SelectItem>
                                <SelectItem value="EXTRACAO">Extração</SelectItem>
                                <SelectItem value="OBTURACAO">Obturação</SelectItem>
                                <SelectItem value="CANAL">Canal</SelectItem>
                                <SelectItem value="CLAREAMENTO">Clareamento</SelectItem>
                                <SelectItem value="ORTODONTIA">Ortodontia</SelectItem>
                                <SelectItem value="PROTESE">Prótese</SelectItem>
                                <SelectItem value="IMPLANTE">Implante</SelectItem>
                                <SelectItem value="EMERGENCIA">Emergência</SelectItem>
                                <SelectItem value="OUTROS">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Valor */}
                    <div className="space-y-2">
                        <Label htmlFor="valorConsulta">Valor da Consulta (R$)</Label>
                        <Input
                            id="valorConsulta"
                            type="number"
                            step="0.01"
                            value={formData.valorConsulta || ''}
                            onChange={(e) => handleChange('valorConsulta', parseFloat(e.target.value) || 0)}
                            disabled={loading}
                        />
                    </div>

                    {/* Observações */}
                    <div className="space-y-2">
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                            id="observacoes"
                            value={formData.observacoes}
                            onChange={(e) => handleChange('observacoes', e.target.value)}
                            placeholder="Informações adicionais sobre o agendamento..."
                            disabled={loading}
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setShowNewDialog(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !formData.dentistaId || !formData.pacienteId}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Criar Agendamento
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}